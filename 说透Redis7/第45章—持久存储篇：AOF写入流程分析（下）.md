通过上一节的介绍，我们了解了 AOF 日志从生产到写入缓冲区的过程，也分析了 AOF 日志的格式，这里有两个额外的知识点需要补充说明一下。

第一个点是，当执行的是 EXPIRE 这种设置过期时间的命令，如果 AOF 是把 EXPIRE 指定的过期时间记录下来，在回放的时候，是不是就给 Key 设置了一个错误的过期时间呢？这个问题的答案需要小伙伴们回顾一下[第 36 讲《命令解析篇：通用命令与 String 命令实现解析》](https://juejin.cn/book/7144917657089736743/section/7147529981898260480)中介绍的，expireGenericCommand() 函数中的一个细节，在设置完 Key 的过期时间之后，expireGenericCommand() 就已经将 client->argv 中记录的命令和参数进行了改写，它会将命令改成 PEXPIREAT 命令，并将过期时间归一化成毫秒级时间戳。同理， SET...EX|PX 这个带过期时间的复合命令，也会对命令进行改写，也是统一改写 SET...PXAT，过期时间归一化成毫秒级时间戳。


第二个点是，在介绍 Key 过期以及内存淘汰的时候，我们知道这两个功能是会将一部分 Key 删除掉的，这个时候需要产生 DEL 或者 UNLINK 命令对应的 AOF 日志，如下图的调用栈所示，expireIfNeeded()、activeExpireCycle() 和 performEvictions() 这三个函数都会调用上一讲介绍的 alsoPropagate()、 propagatePendingCommands() 函数记录 AOF 日志。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/359a9d87a0cf49f492cdcea765e8137e~tplv-k3u1fbpfcp-zoom-1.image)

这两个功能可能一次过期多个 Key，这就会导致 redisOp 数组中出现多条命令的情况，Redis 通过 redisServer.propagate_no_multi 字段，区分这两种场景与事务场景。如下图调用栈所示，Key 过期或者进行内存淘汰的时候，会将 propagate_no_multi 设置成 1，从而告诉 propagatePendingCommands() 函数此次的多条命令不用事务包裹。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d5a3fd793d9440496b4cb6c4833d246~tplv-k3u1fbpfcp-zoom-1.image)

补充完上一节的内容之后，我们这一节就继续看 `AOF 日志从缓冲区写到文件中`的过程。


## 写入 AOF 文件与刷盘策略

将 redisServer.aof_buf 缓冲区中的 AOF 日志写入到 AOF 文件的核心逻辑位于 flushAppendOnlyFile() 函数中，下面的调用栈展示了它的调用位置：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a122ad71d2f4871a0f37f4c26b163db~tplv-k3u1fbpfcp-zoom-1.image)


我们先来看 beforeSleep() 中的调用，关键代码如下所示，从这段代码我们知道，在 Redis 给客户端返回响应之前，也就是 handleClientsWithPendingWritesUsingThreads() 这个调用之前，会先调用 flushAppendOnlyFile() 函数，把 AOF 日志写入到磁盘。这也符合我们的认知，如果两者调用顺序发生调换，就可能出现响应已经返回，但写 AOF 日志失败这种不一致的问题。

```c
void beforeSleep(struct aeEventLoop *eventLoop) {
    ... // 省略其他逻辑
    // 开启了AOF写入配置
    if (server.aof_state == AOF_ON || server.aof_state == AOF_WAIT_REWRITE)
        flushAppendOnlyFile(0);

    // 在返回响应之前，会调用flushAppendOnlyFile()函数将AOF落盘
    handleClientsWithPendingWritesUsingThreads();
    ... // 省略其他调用
}
```

flushAppendOnlyFile() 函数这里说的 “AOF 写入文件” 是指通过 write() 系统调用写文件，这些写入的 AOF 日志并不是立刻就落到磁盘上，而是会先落到内核缓冲区，然后由操作系统选择合适的时机刷盘，或者我们主动调用 `fflush`、`fsync` 进行刷盘，才能将数据真正落到磁盘上。

在 redis.conf 文件中，有一个 appendfsync 配置项，它用来决定 AOF 刷盘的策略，可选值有三个。

-   `no 策略`：不会主动执行 fsync() 进行刷盘，而是依赖操作系统自动刷盘的机制。使用该策略的风险是服务宕机时，部分 AOF 日志还存储在系统缓冲区中，而未真正落盘，导致 AOF 日志丢失；好处就是省去的 fsync() 函数调用，写入 AOF 的效率会高一些。

-   `always 策略`：每次写入 AOF 的时候，都会调用 fsync() 进行刷盘。使用该策略的缺点就是频繁调用 fsync() 刷盘会降低 Redis 性能；好处就是不会因为系统缓冲区而造成 AOF 日志丢失。
-   `everysec 策略`：每秒执行一次 fsync() 进行刷盘。该策略是上述两种策略的折中，最多丢失一秒的 AOF 日志，调用 fsync() 频率也不是很高，性能比 always 策略要好，该策略也是 AOF 的`默认刷盘策略`。在后面展开介绍 everysec 策略的实现时会发现，它真正的刷盘操作是在**后台线程**中完成的，而 always 策略是在主线程中进行 fsync() 的，这也是 everysec 策略性能比较好的原因之一。


既然说到 fsync() 刷盘的问题，我们就再展开说说 redisServer 中与刷盘相关的字段，这些字段在下面要分析的 flushAppendOnlyFile() 函数中也有应用。

-   aof_fsync_offset：记录了当前已经刷到磁盘的 AOF 日志偏移量（单位是字节）。

-   aof_current_size：记录了通过 write() 写入的 AOF 日志量（单位是字节）。如果 aof_fsync_offset 落后于 aof_current_size，就说明有一部分 AOF 日志可能残留在系统缓冲区中，没有真正写到磁盘上，需要进行一次刷盘。
-   aof_last_fsync：记录了最后一次调用 fsync() 刷盘的时间戳。



## always 刷盘策略解析


了解了上述基础知识之后，下面我们来梳理一下 always 策略下 flushAppendOnlyFile() 函数的执行轨迹：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32cbe8f2cc8647979b837c855760a162~tplv-k3u1fbpfcp-watermark.image?)


这里的 aofWrite() 函数中，实际上就是通过循环执行 write() 这个系统调用，把 redisServer.aof_buf 缓冲区中的日志写入到 AOF 文件中，退出循环的条件有两个：一个是 aof_buf 缓冲区中的数据全部写入完了，另一个是写入发生失败。


aofWrite() 函数执行完之后，Redis 会检查是不是已经把 aof_buf 缓冲区中的全部数据都写入了，如果没有的话，直接就证明磁盘发生了故障，比如，磁盘写满了。这个时候，命令响应已经在 client->buf 中了，相应的数据修改也已经无法回滚了，为了保持一致性，Redis 会直接打印日志并退出进程。


aofWrite() 函数正常写入 aof_buf 缓冲区的全部数据之后，Redis 会检查 aof_buf 缓冲区的总长度，尝试对其进行复用。但如果 aof_buf 占的空间太大，比如，长度超过 4000 个字节，Redis 会认为后续不会频繁出现这么多 AOF 日志阻塞在 aof_buf 缓冲区的情况，则不会复用这个 sds 实例，而是将其释放掉重新创建。如果决定复用，Redis 会清空 aof_buf 缓冲区中的数据，等待下次 AOF 日志写入缓冲区。


在 always 策略的时候，在写入完成后立即刷盘，这里使用的是 redis_fsync() 这个宏，它实际调用的是 fdatasync() 函数，而不是 fsync()。这是因为 fsync() 函数除了将文件内容进行刷盘之外，还会将文件的描述信息刷盘，例如，文件大小、文件修改时间等等，通常文件元数据和文件的内容数据存放在磁盘的不同位置，所以 fsync() 实际上执行了至少两次 IO，而且有的文件系统修改文件元数据是串行的，修改起来会很慢。而 fdatasync() 只对文件内容刷盘，不会去修改文件元数据，性能上就有所提升。


## everysec 刷盘策略解析

下面再来看 flushAppendOnlyFile() 函数在 everysec 策略下的执行流程：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6005b03c9cd540209e587c579b2df8be~tplv-k3u1fbpfcp-watermark.image?)



首先在 aof_buf 缓冲区为空的时候，会检查当前是否需要执行刷盘操作，涉及到 4 方面的检查，如下所示：

```c
if (server.aof_fsync == AOF_FSYNC_EVERYSEC && // 当前是everysec策略
    server.aof_fsync_offset != server.aof_current_size && // 有待刷盘的数据
    server.unixtime > server.aof_last_fsync && // 距离上次刷盘时间超过1s
    !(sync_in_progress = aofFsyncInProgress()){ // 后台线程中没有待执行的刷盘任务
    goto try_fsync; // 向后台线程提交刷盘任务
}
```


在 everysec 策略下，如果是 aof_buf 缓冲区中有数据等待写入，但是，后台线程还有待处理的刷盘任务没执行完，此次 AOF 写文件的操作可以进行延迟，但是延迟时间不能超过 2 秒。在确定要延迟写入 AOF 文件的时候，flushAppendOnlyFile() 函数会在 redisServer.aof_flush_postponed_start 字段中记录当前时间戳，后续再次尝试写入 AOF 文件的时候，就会通过该字段判断是否超过 2 秒这个上限值。如果超过 2 秒，就会继续执行后续的写入逻辑。如果未超过 2 秒，就结束此次 flushAppendOnlyFile() 调用，等待调用的时候，再检查后台刷盘任务的状态。


接下来，就是我们熟悉的 aofWrite() 写入 AOF 文件的循环逻辑，这里不再重复。写入完成之后，还是会检查 aof_buf 缓冲区中的数据是否已经完全写入到 AOF 文件中了，如果没有完全写入成功，everysec 策略不会像 always 策略那样立即终止进程，而是有一定的容忍度，这里会将 server.aof_last_write_status 字段设置为 C_ERR 状态，等待下次调用 flushAppendOnlyFile() 函数重试。


我们前面提到，在 serverCron() 中会定时执行 flushAppendOnlyFile() 函数，相关的调用位置如下图所示，很明显，第一个调用点判断了 aof_flush_postponed_start 字段不为 0，是为了进行延迟写入；第二个调用点判断了 aof_last_write_status 字段的值，是为了写入失败的重试。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58b11d74917f455e92320b74c6deecc3~tplv-k3u1fbpfcp-zoom-1.image)

  


当 redisServer.aof_last_write_status 被设置为 C_ERR 时，除了可以触发 serverCron() 中的写入失败重试逻辑之外，还会阻塞后续的写命令，小伙伴们可以关注一下 writeCommandsDeniedByDiskError() 函数，它里面会检查 RDB 写入状态、AOF 写入状态以及 AOF 后台线程的刷盘状态，这三个状态对应 redisServer 中的 lastbgsave_status、aof_last_write_status、aof_last_write_status 三个字段，但凡有一个状态不正常，writeCommandsDeniedByDiskError() 函数就会返回异常。


调用 writeCommandsDeniedByDiskError() 函数的地方是 processCommand()，它在收到异常的时候，就会拒绝后续收到的 Redis 命令，相关的片段如下：

```c
int processCommand(client *c){
    ... // 省略其他逻辑
    // 通过writeCommandsDeniedByDiskError()函数检查上述三种持久化状态
    int deny_write_type = writeCommandsDeniedByDiskError();
    if (deny_write_type != DISK_ERROR_TYPE_NONE 
        && (is_write_command || c->cmd->proc == pingCommand)) // 必须是写命令
    { 
        ... // 省略其他逻辑
        sds err = writeCommandsGetDiskErrorMessage(deny_write_type);
        rejectCommandSds(c, err);
        return C_OK;
    }
    ...// 省略后续调用call()函数的逻辑
}

// 下面是writeCommandsGetDiskErrorMessage()函数的具体实现
sds writeCommandsGetDiskErrorMessage(int error_code) {
    sds ret = NULL;
    if (error_code == DISK_ERROR_TYPE_RDB) {
        ret = sdsdup(shared.bgsaveerr->ptr); // 因为RDB写入失败而被拒绝
    } else { // 因AOF写入失败或AOF后台线程刷盘是失败而拒绝
        ret = sdscatfmt(sdsempty(),
                "-MISCONF Errors writing to the AOF file: %s",
                strerror(server.aof_last_write_errno));
    }
    return ret;
}
```


介绍完各种写入异常的分支逻辑以及关联的处理逻辑之后，最后来看 everysec 策略下，写入正常的逻辑：在 aofWrite() 函数正常写入之后，与 always 策略相同，会清空 aof_buf 缓冲区并尝试复用，然后更新 aof_current_size 字段。注意，这里来到了 everysec 策略的关键，也是 everysec 策略与 always 策略的不同之处，**everysec 策略的刷盘操作是通过 aof_background_fsync() 函数提交到后台线程执行的，而不是由主线程立即执行的**。刷盘任务每秒最多提交一个，而且有堆积的刷盘任务的时候，也不会继续提交新任务，而是直接将两次刷盘`合并`，相关的代码片段如下：

```c
void flushAppendOnlyFile(int force) {
    ... // 省略其他的
    if ((server.aof_fsync == AOF_FSYNC_EVERYSEC && // 当前是everysec策略
            server.unixtime > server.aof_last_fsync)) // 上次刷盘距今至少1秒
     {
        if (!sync_in_progress) { // 确定当前没有后台刷盘任务
            aof_background_fsync(server.aof_fd); // 提交后台刷盘任务
            server.aof_fsync_offset = server.aof_current_size;
        }
        server.aof_last_fsync = server.unixtime; // 更新最新的刷盘时间
    }
}
```


这里我们简单介绍一下后台刷盘任务的实现。在[第 34 讲《内核解析篇：Redis Key 的过期与删除》](https://juejin.cn/book/7144917657089736743/section/7147529943709122600)中介绍 lazy free 特性的时候，我们已经详细分析过后台线程涉及到的基础知识，例如，bio_job 结构体、后台线程的启动和执行流程以及三种后台线程类型，其中就有一个 BIO_AOF_FSYNC 类型的后台线程，这里的 aof_background_fsync() 函数就是向 BIO_AOF_FSYNC 后台线程对应的任务队列，也就是 bio_jobs[BIO_AOF_FSYNC] 队列中，**提交刷盘任务**，也就是一个 bio_job 实例，这个实例中的 fd 字段，记录了需要刷盘的文件描述符。


任务提交之后，BIO_AOF_FSYNC 后台线程会从 bio_jobs[BIO_AOF_FSYNC] 任务队列中读到任务，然后开始执行前文介绍的 redis_fsync() 方法进行刷盘，相关代码片段位于 **bioProcessBackgroundJobs() 函数**中，如下所示：

```c
void *bioProcessBackgroundJobs(void *arg) {
    ... // 省略其他逻辑
    if (type == BIO_AOF_FSYNC) {
        if (redis_fsync(job->fd) == -1 && // 调用redis_fsync进行刷盘
            errno != EBADF && errno != EINVAL)
        {
            int last_status;
            atomicGet(server.aof_bio_fsync_status,last_status);
            // 如果刷盘异常，会更新redisServer.aof_bio_fsync_status字段
            atomicSet(server.aof_bio_fsync_status,C_ERR);
            atomicSet(server.aof_bio_fsync_errno,errno);
            if (last_status == C_OK) {
                serverLog(LL_WARNING, "Fail to fsync the AOF file: %s",strerror(errno));
            }
        } else { // 刷盘成功
            atomicSet(server.aof_bio_fsync_status,C_OK);
        }
    }
}
```



我们看到后台刷盘线程会去更新 redisServer.aof_bio_fsync_status 字段来记录刷盘状态，但是注意，我们前面说过，在主线程执行命令之前，会调用 writeCommandsDeniedByDiskError() 函数读取该字段确认刷盘状态，这样的话，该字段就可能会被并发操作，所以这里修改和读取该字段使用 atomicSet、atomicGet 等`原子操作`完成。


## 总结

在这一节中，我们重点介绍了 Redis AOF 日志写入文件的核心原理和重点策略。首先，我们讲解了 Redis AOF 日志刷盘的相关配置以及时机，说明了三种刷盘策略的配置以及含义。接下来，分析了 always 刷盘策略的核心原理以及 everysec 刷盘策略的核心原理。


下一节，我们将继续介绍 AOF 中另一个非常重要的机制 —— AOF Rewrite 机制的实现原理。