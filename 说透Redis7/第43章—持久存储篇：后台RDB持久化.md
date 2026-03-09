分析完写入 RDB 文件的格式以及 RDB 持久化的核心实现之后，我们回到触发 RDB 持久化的地方会发现，除了 SAVE 命令之外，其他 rdbSave() 函数调用都是来自 rdbSaveBackground() 函数，如下图调用栈所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4586afe51fcf461b987d30b0204bda4d~tplv-k3u1fbpfcp-zoom-1.image)

**rdbSaveBackground() 函数的核心在于，使用 fork() 调用创建一个子进程，并在子进程中调用rdbSave() 函数，完成后台的 RDB 持久化操作**。在 redisServer 中有一个 child_pid 字段，它用来记录当前 Redis 创建的子进程 id，这个子进程可以是用来进行 RDB 持久化的，也可以用来做 AOF Rewrite 操作的，或是其他 Module 需要的后台操作。但是，Redis 同一时刻只能有一个子进程，这个子进程的 id 会被记录到 child_pid 字段中。


## 创建 RDB 子进程

下面我们就先来看看用于 RDB 持久化的子进程是怎么创建出来的，下面是 rdbSaveBackground() 函数的核心逻辑。


它首先会调用 hasActiveChildProcess() 函数来检查 server.child_pid 字段，如果不为 0，表示已经有子进程在运行了，就会立刻异常返回。如果当前没有子进程启动，就调用 redisFork() 函数，其核心是通过 fork() 系统调用创建子进程。相信熟悉 Linux 系统的朋友都知道，通过 fork() 创建出来的子进程与父进程运行在不同的内存空间中，在子进程刚刚创建出来时（即 fork() 调用结束时），父子进程的内存数据完全相同，宛如拷贝了一份，后续父子线程对内存操作以及文件的映射都是在各自的内存中完成的，两者不会相互影响。正是由于这一`“宛如拷贝”`的特性，Redis 可以在子进程的内存空间中，安全地把数据写入到 RDB 文件中，与此同时，父进程也可以继续对自己的内存进行读写操作，做到不阻塞父进程的命令执行，也不干扰子进程的 RDB 文件生成。


我们回到 rdbSaveBackground() 函数的实现，在 redisFork() 调动结束之后，子进程拿到的 childpid 是 0 ，也就会开始执行 if 分支内的逻辑，父进程拿到的 childpid 不是 0 （是子进程的进程号），也就会进入 else 分支。通过代码可以看出，子进程调用前文介绍的 rdbSave() 函数开始 RDB 持久化操作，父进程则是记录一些 RDB 持久化子进程启动时间、对应的子进程类型等信息，之后，父进程就会从 rdbSaveBackground() 函数退出，继续处理客户端的命令。

```c
int rdbSaveBackground(char *filename, rdbSaveInfo *rsi) {
    pid_t childpid;
    // 检查server.child_pid,如果不为0，表示已经有子进程存在，这里直接返回异常
    if (hasActiveChildProcess()) return C_ERR;
    
    server.dirty_before_bgsave = server.dirty; // 暂存主进程的dirty字段
    server.lastbgsave_try = time(NULL); // 记录最近一次bgsave的尝试时间

    if ((childpid = redisFork(CHILD_TYPE_RDB)) == 0) { // 子进程执行该分支
        redisSetProcTitle("redis-rdb-bgsave"); // 修改子进程的名称
        int retval = rdbSave(filename,rsi); // 调用rdbSave()函数进行RDB持久化
        if (retval == C_OK) { // RDB文件创建成功，通知主进程
            sendChildCowInfo(CHILD_INFO_TYPE_RDB_COW_SIZE, "RDB");
        }
        exitFromChild((retval == C_OK) ? 0 : 1); // 使用_exit()退出子进程
    } else { // 父进程执行该分支
        // 更新rdb_save_time_start字段，记录RDB持久化的启动时间
        server.rdb_save_time_start = time(NULL);
        // rdb_child_type字段记录了此次生成的RDB文件是写入到磁盘上的还是发送给从节点的
        server.rdb_child_type = RDB_CHILD_TYPE_DISK; 
        return C_OK;
    }
    return C_OK; /* unreached */
}
```


虽然父子进程内存中的数据互不影响，就像拷贝了一份一样，但是如果 fork() 调用真的拷贝了整个父进程的内存，对于 Redis 来说是不可接受的，主要体现在两个方面：一个是 Redis 服务占用的内存将会翻倍，另一个是 fork() 调用要拷贝整个内存，耗时会很长，阻塞主线程执行其他命令，整个 Redis 就不可用了。


Redis 之所以还是使用 fork() 来创建子进程，是因为 **fork 出来的子进程使用了 Copy-on-Write 的方式进行内存拷贝，而非全量内存拷贝**。Copy-on-Write 的原理是将内存拷贝操作推迟到内存真正发生修改时再进行，那些父子进程完全相同的内存页，实际上只有一份，这也就避免了无意义的拷贝操作。通过前文介绍的 RDB 文件写入过程我们也知道，这里启动的子进程只会读取内存，不会进行任何修改，所以只有在父进程执行修改命令的时候，才会触发 Copy-on-Write 操作。从另一个角度看，Redis 多数被应用到读多写少的场景中，也就使得 Copy-on-Write 机制更大程度地发挥作用。注意，Copy-On-Write 的最小单位内存页，而不是键值对。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f636967836634e9d8bf6e5b405d609c0~tplv-k3u1fbpfcp-watermark.image?)



了解完 fork() 系统调用的原理之后，我们到 redisFork() 函数中，详细分析一下其核心逻辑。

```c
int redisFork(int purpose) {
    if (isMutuallyExclusiveChildType(purpose)) {
        // 1、首先会检查此次启动子进程的目的，如果是用于 RDB 持久化，则会启动一个 pipe 用于父子进程通信
        openChildInfoPipe();
    }

    int childpid;
    // 2、通过fork()系统调用创建子进程
    if ((childpid = fork()) == 0) { // 子进程执行的分支
        server.in_fork_child = purpose;
        setupChildSignalHandlers(); // 注册信号回调
        setOOMScoreAdj(CONFIG_OOM_BGCHILD);
        dismissMemoryInChild();
        // 释放一些使用不到的网络资源和文件
        closeChildUnusedResourceAfterFork();
    } else { // 父进程执行的分支
        // 它会更新一些统计信息，例如，fork() 调用的次数（记录到 redisServer.stat_total_forks 字段）、
        // 耗时（记录到 redisServer.stat_fork_time 字段）等等。
        server.stat_total_forks++;
        server.stat_fork_time = ustime()-start;
        server.stat_fork_rate = (double) zmalloc_used_memory() * 1000000 / server.stat_fork_time / (1024*1024*1024); /* GB per second. */
        latencyAddSampleIfNeeded("fork",server.stat_fork_time/1000);

        if (isMutuallyExclusiveChildType(purpose)) {
            // 还会更新 server 中子进程相关的字段，例如，子进程的进程号（对应 redisServer.child_pid 字段）、
            // 当前子进程的目的（对应 redisServer.child_type 字段）以及 Copy-on-Write 相关的统计信息
            server.child_pid = childpid;
            server.child_type = purpose;
            server.stat_current_cow_peak = 0;
            server.stat_current_cow_bytes = 0;
            server.stat_current_cow_updated = 0;
            server.stat_current_save_keys_processed = 0;
            server.stat_module_progress = 0;
            server.stat_current_save_keys_total = dbTotalServerKeyCount();
        }

        updateDictResizePolicy();
        moduleFireServerEvent(REDISMODULE_EVENT_FORK_CHILD,
                              REDISMODULE_SUBEVENT_FORK_CHILD_BORN,
                              NULL);
    }
    return childpid;
}
```

1.  redisFork() 函数首先会检查此次启动子进程的目的，如果是用于 RDB 持久化，则会启动一个 pipe 用于父子进程通信（父子进程通信的事情我们后面展开说）。

2.  接下来，通过 fork() 系统调用创建子进程。父子进程根据 fork() 函数的返回值进入不同的分支。
3.  先看`子进程执行的分支`，它会设置 SIGUSR1 信号的回调函数 sigKillChildHandler()，其中的逻辑会终止子进程，我们可以在 killRDBChild() 函数中看到，父进程向子进程发送 SIGUSR1 信号的逻辑：

```c
void killRDBChild(void) {
    kill(server.child_pid, SIGUSR1); // 终止子进程
}
```

如下图所示，killRDBChild() 函数在清空 redisDb （flushAllDataAndResetRDB() 函数）、Redis 正常停机（prepareForShutdown() 函数）等流程中都有调用：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d60d8114ad048ba93f3aa0049670fba~tplv-k3u1fbpfcp-watermark.image?)
   

这里启动的子进程，只用于 RDB 持久化，不会做主进程要做的一些事情，所以可以释放一些使用不到的网络资源和文件，例如，子进程自己的 redisServer.ipfd 连接。这部分逻辑位于 closeChildUnusedResourceAfterFork() 函数，感兴趣的同学可以参考代码进行分析。


4.  再来看`父进程执行的分支`，它会更新一些统计信息，例如，fork() 调用的次数（记录到 redisServer.stat_total_forks 字段）、耗时（记录到 redisServer.stat_fork_time 字段）等等。还会更新 server 中子进程相关的字段，例如，子进程的进程号（对应 redisServer.child_pid 字段）、当前子进程的目的（对应 redisServer.child_type 字段）以及 Copy-on-Write 相关的统计信息。

  


## 父子进程通信

在 redisFork() 函数里有一个小细节，就是**调用 openChildInfoPipe() 函数打开一个父子进程通信的管道**，下面我们就展开说说父子进行通信的事情。

在 openChildInfoPipe() 函数中，会调用 pipe() 这个系统函数来创建一个管道，管道创建后得到的两个文件描述符会记录到 redisServer.child_info_pipe 数组中，这个数组是一个长度为 2 的 int 类型的数组，子进程会向 child_info_pipe[1] 中记录的文件描述符写入数据，父进程从 child_info_pipe[0] 中记录的文件描述符读取数据，这样就实现了父子进程的交互。大概的模型如下图所示：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d42a9994ffc648eda3b00f0e037b7165~tplv-k3u1fbpfcp-watermark.image?)


我们可以在 sendChildInfoGeneric() 函数中看到向管道中写入数据的逻辑：

```c
void sendChildInfoGeneric(childInfoType info_type, size_t keys, double progress, char *pname) {
    // 初始化child_info_data
    child_info_data data = {0}; 
    ... // 省略更新child_info_data数据的逻辑
    // 将child_info_data实例写入server.child_info_pipe[1]管道中
    if (write(server.child_info_pipe[1], &data, wlen) != wlen) {...}
}
```

在 receiveChildInfo() 函数中，我们可以看到从管道中读取数据的逻辑：

```c
void receiveChildInfo(void) {
    ... // 省略其他逻辑
    // readChildInfo()函数中会从server.child_info_pipe[0]读取
    while (readChildInfo(&information_type, &cow, &cow_updated, 
            &keys, &progress)) {
        // 根据读取到的数据，更新server的对应字段
        updateChildInfo(information_type, cow, cow_updated, keys, progress);
    }
}
```

从下图的调用栈中可以看出，向管道写入数据的逻辑是在 rdbSaveRio() 以及 rdbSaveBackground() 中完成的，其中 rdbSaveRio() 会在每持久化 1024 个 Key 时，通知主进程 RDB 持久化的进度（两次通知间隔超过），在 rdbSaveBackground() 函数中是在整个 RDB 持久化完成时，通知主进程。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/775e92bb8d9e4858b67a0cf6222048e8~tplv-k3u1fbpfcp-zoom-1.image)

从管道里面读取数据的逻辑是在 serverCron() 函数中触发的，serverCron() 函数会每隔 1 秒调用一次 receiveChildInfo() 函数读取子进程发来的信息，并更新相应统计字段。


那父子进程中传递的数据是什么呢？我们来看 child_info_data 结构体，如下所示，child_info_data 结构体主要包含了子进程发给父进程的一些信息，其中的 keys 字段记录了当前已经写入到 RDB 文件的 Key 个数，cow 字段记录了发生 Copy-on-Write 的字节数。

```c
typedef struct {
    size_t keys; // 写入Key个数
    size_t cow; // COW字节数
    monotime cow_updated;
    double progress;
    childInfoType information_type; 
} child_info_data;
```



这里我们重点展开介绍一下 cow 字段值的获取过程，Linux 系统会为每个进程维护了一个 `/proc/{pid}/smaps` 文件，通过这个文件，我们可以看到一个进程映射的内存区域以及这个区域的使用情况，其中会记录下面的内容。

-   size：是进程使用内存空间，并不一定实际分配了物理内存。

-   Rss：实际驻留“在内存中”的内存数，不包括已经交换出去的内存页。RSS 还包括了与其他进程共享的内存区域，通常用于共享库。
-   Pss：Private Rss， Rss 中私有的内存页。
-   Shared_Clean：Rss 中和其他进程共享的未改写内存页。
-   Shared_Dirty：Rss 中和其他进程共享的已改写内存页。
-   Private_Clean：Rss 中改写的私有内存页。
-   Private_Dirty：Rss 中已改写的私有内存页，如果出现换页，该页的内容需要写回磁盘。



子进程就是通过读取 /proc/{pid}/smaps 文件，遍历每个内存区域并累计其中的 Private_Dirty 值，进而确定发生 Copy-on-Write 的字节数。这部分逻辑位于 zmalloc_get_smap_bytes_by_field() 函数中，感兴趣的同学可以分析一下其中读取 /proc/{pid}/smaps 文件的逻辑。


说完子进程发送的关键数据来源之后，我们再来看父进程从管道读取到数据之后都做了什么。



**主进程会在 serverCron() 中，定时读取子进程发来的统计信息，还会定时检查子进程是否已经结束**，相关代码片段如下：

```c
if (hasActiveChildProcess() || ldbPendingChildren()) { // 子进程存在
    // 从管道中读取数据，并更新统计信息。主要更新的是stat_current_cow_bytes、
    // stat_current_save_keys_processed、stat_current_cow_updated等字段，
    // 记录了Copy-On-Write涉及到的字节数以及RDB持久化的进度
    run_with_period(1000) receiveChildInfo(); 
    checkChildrenDone(); // 检查子进程是否结束
}
```

检查子进程是否结束的逻辑位于 checkChildrenDone() 函数中，其核心实现如下，我们可以看到，它主要是通过 waitpid() 函数实现的，下面的注释对 waitpid() 函数进行了详细说明，在发现子进程结束时，会调用 backgroundSaveDoneHandler() 函数进行处理。

```c
void checkChildrenDone(void) {
    int statloc = 0;
    pid_t pid;
    // 如果pid(第一个参数)指定的子进程没有结束，则waitpid()会阻塞等待，但是这里使用
    // 了WNOHANG配置，此时waitpid()函数会立即返回0，而不是阻塞等待。如果子进程结束了，
    // 则返回该子进程的进程号。如果第一个参数为-1，则表示waitpid()函数会等待任意子进程结束
    if ((pid = waitpid(-1, &statloc, WNOHANG)) != 0) {
        ... // 省略其他类型子进程的结束逻辑
        if (pid == server.child_pid) { 
            if (server.child_type == CHILD_TYPE_RDB) {
                // 执行回调逻辑
                backgroundSaveDoneHandler(exitcode, bysignal);
            }
        }
        ... // 省略其他异常结束的分支
     }
}
```


其实，RDB 持久化有两种情况，一种是我们前面一直说的，把 RDB 数据写入到本地磁盘，还有一种就是把 RDB 数据写入到 Socket 连接里面。


在这两种情况结束的时候，都会走 backgroundSaveDoneHandler() 处理，这里我们关注其中对写本地文件场景的处理，也就是 backgroundSaveDoneHandlerDisk() 函数，其中会更新 redisServer 的 rdb_save_time_last、lastbgsave_status 字段记录最近一次 RDB 持久化的时间戳和结果（是否持久化成功），还会更新 dirty 字段。如果 RDB 子进程是被 SIGUSR1 等信号主动结束的，backgroundSaveDoneHandlerDisk() 会向后台线程提交一个文件删除任务，将 RDB 子进程写了一般的 rdb 临时文件删除掉，具体代码片段如下：

```c
static void backgroundSaveDoneHandlerDisk(int exitcode, int bysignal) {
    if (!bysignal && exitcode == 0) { // RDB持久化子进程正常结束
        // rdbSaveBackground()中在子进程启动的时候，使用dirty_before_bgsave记录了当时的
        // dirty值，子进程会将RDB持久化之前的全部变更都已经持久化到了RDB文件中，在RDB持久化过程中
        // 的修改会导致主进程的dirty值继续递增，所以在子进程结束的时候，会进行dirty的更新
        server.dirty = server.dirty - server.dirty_before_bgsave;
        server.lastsave = time(NULL);
        server.lastbgsave_status = C_OK;
    } else if (!bysignal && exitcode != 0) { // RDB持久化子进程正常结束，异常结束
        serverLog(LL_WARNING, "Background saving error");
        server.lastbgsave_status = C_ERR;
    } else { // RDB持久化子进程被SIGUSR1信号结束的
        mstime_t latency;
        latencyStartMonitor(latency);
        // 提交删除rdb临时文件的后台任务
        rdbRemoveTempFile(server.child_pid, 0);
        latencyEndMonitor(latency);
        latencyAddSampleIfNeeded("rdb-unlink-temp-file",latency);
        if (bysignal != SIGUSR1)
            server.lastbgsave_status = C_ERR;
    }
}
```


## Copy-On-Write 相关优化

通过前面的介绍我们知道，Redis 使用子进程进行 RDB 持久化不会造成整个内存占用量翻倍的原因，是系统使用 Copy-On-Write 技术。但是，如果 Redis 是使用在写非常多的场景里面，Copy-On-Write 带来的好处就有所减少，因为父进程修改的内存页，在内存中会有两份，写操作多了，这种页面也就多了，也就会导致 Redis 的内存占用量增加。


这个时候，Redis 从另一个角度去优化子进程中的 RDB 持久化操作：**释放一些子进程不要再使用的内存页**。举个例子，在子进程进行 RDB 持久化的时候，一个内存页出现了 Copy-On-Write 的情况，在子进程把这个内存页中全部的键值对都持久化到了 RDB 文件之后，子进程其实就没有必要继续持有这个内存页了，只需主进程保留该内存页的最新拷贝即可，所以也就有了[这个 PR](https://github.com/redis/redis/pull/8974) 的优化。


在 8974 这个 PR 里面，使用 Linux 的 madvise() 调用来释放一个内存页，在前面分析的时候我们知道，rdbSaveDb() 函数会将一个 redisDb 中的全部键值对都持久化到 RDB 文件中，在这个过程中，就会同时尝试释放掉子进程持有的内存页，相关代码片段如下：

```c
ssize_t rdbSaveDb(rio *rdb, int dbid, int rdbflags, long *key_counter) {
    ... // 省略写入redisDb编号、键值对数据量等信息的逻辑
    while((de = dictNext(di)) != NULL) {
        ... //省略读取键值对的逻辑
        // 调用rdbSaveKeyValuePair()函数，持久化键值对
        if ((res = rdbSaveKeyValuePair(rdb, &key, o, expire, dbid)) < 0) goto werr;
        written += res;
        // 关键在这里！！！这里会计算此次写入键值对大小，然后通过dismissObject来释放子进程中的内存页
        size_t dump_size = rdb->processed_bytes - rdb_bytes_before_key;
        if (server.in_fork_child) dismissObject(o, dump_size);
        ... // 省略子进程给父进程发送统计信息的逻辑
    }
    return written;
}
```


dismissObject() 函数底层会针对不同的类型进行分类处理，如下图调用栈所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f32f5fc8a33a4cf2bdee847a5b0ac853~tplv-k3u1fbpfcp-zoom-1.image)



下面我们以 dismissListObject() 释放 quicklist 为例进行简单分析。在 dismissListObject() 函数中，会检查 quicklist 节点的平均大小是否超过了一个内存页的大小（默认是 4K），如果超过了，就会走 dismissMemory() 函数进行释放，dismissMemory() 底层就是调用 Linux 的 madvise() 系统调用释放内存的，核心代码片段如下：

```c
void dismissListObject(robj *o, size_t size_hint) {
    if (o->encoding == OBJ_ENCODING_QUICKLIST) {
        quicklist *ql = o->ptr;
        serverAssert(ql->len != 0);
        // 检查quicklistNode节点的平均大小，是不是超过了内存页的大小，
        // 只有超过了内存页大小，才会进行优化
        if (size_hint / ql->len >= server.page_size) {
            quicklistNode *node = ql->head;
            while (node) {
                // 尝试释放单个quicklistNode节点占用的内存页
                if (quicklistNodeIsCompressed(node)) {
                    dismissMemory(node->entry, ((quicklistLZF*)node->entry)->sz);
                } else {
                    dismissMemory(node->entry, node->sz);
                }
                node = node->next;
            }
        }
    } else {
        serverPanic("Unknown list encoding type");
    }
}
```


这里有两点需要注意。


第一点是这里使用的 madvise() 系统调用中，传入了 MADV_DONTNEED 这个 flags，它的意思是，告诉操作系统当前进程不再需要这个内存页了，操作系统可以把它标记成“未分配”，后面有其他进程需要这块内存页的话，可以进行分配，相应地，进程的 RSS 值会立刻下降。


第二点是要使用 madvise 这个优化，我们需要关闭系统的 Transparent huge page 配置，[这个 Redis 官方文档中，也提供了相应的操作建议](https://redis.io/docs/reference/optimization/latency/#ive-little-time-give-me-the-checklist)。在 dismissObject() 函数中也可以看到 THP 配置和 madvise() 优化互斥的判断：

```c
void dismissObject(robj *o, size_t size_hint) {
    // 开启了系统开启THP的话，madvise(MADV_DONTNEED)优化就不会被使用
    if (server.thp_enabled) return;
    ... // 省略针对各个类型，调用不同dismiss*()函数的逻辑
}
```


在很多数据库产品里面，比如，Redis、Couchbase、TiDB 等等，都是建议关闭 THP 的，主要是因为 THP 在数据库这个场景中，会导致性能波动。THP 本身的一些特性和问题，已经超出了我们的讨论范围，如果小伙伴想深入了解 THP 特性，需要有一定的 Linux 内存管理的知识，可以从 [PingCAP 的这篇文章看起](https://cn.pingcap.com/blog/why-should-we-disable-thp)，之后再自行扩展。



## 总结

这一节中，我们重点介绍了 RDB 持久化在后台执行的相关原理。首先，我们介绍了 Redis 创建子进程的核心逻辑，然后介绍了父子进程如何通过 pipeline 进行通信的关键，最后介绍了 Redis 针对 Copy-On-Write 的一些优化措施和建议。


下一节中，我们会来介绍 Redis 另一种持久化方式 —— AOF 持久化的内容。