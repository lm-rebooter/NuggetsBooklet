通过前面章节的介绍我们知道，Redis 之所以快，主要是因为 Redis 读写的数据都是存储在内存中的，那么一旦出现机器宕机、服务重启等情况，内存中的数据就丢失了。

为了让数据能够持久化地存储，Redis 分别提供了 `RDB` 和 `AOF` 两种持久化方式。从这一节开始，我们将首先重点来介绍 Redis 中的 RDB 持久化。

## RDB 特性

RDB 持久化就像是**给 Redis 的整个内存做了一个快照，然后把这个快照持久化到一个 .rdb 文件中**。Redis 在重启时，可以通过加载 RDB 文件快速恢复 Redis 内存数据，但是需要说明的是，由于 RDB 持久化的快照特性，Redis 会丢失最后一次 RDB 文件到重启之间的数据，如下图所示，蓝色部分的数据在 RDB 持久化的时候已经被保存下来了，但是红色部分的数据，会因为宕机而丢失。所以需要后面介绍的另一种持久化方式，也就是 **AOF，来辅助实现 Redis 崩溃后的完整数据恢复**。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a3784f341c74951b600e4363ee49293~tplv-k3u1fbpfcp-watermark.image?)

## 触发 RDB 持久化

了解了 RDB 持久化的特性之后，我们来看如何触发 RDB 持久化。

首先是**手动触发方式**，主要是通过 SAVE 和 BGSAVE 两个命令。两者区别在于：`SAVE 命令`会使用 Redis 主线程进行 RDB 持久化，这段时间会造成整个 Redis 不可用，所以生产环境中是绝不能使用 SAVE 命令的；而 `BGSAVE 命令`则是 fork 出一个子进程来进行 RDB 持久化，并不会阻塞主线程，也被称为“后台 RDB 持久化”。

这两条命令的处理逻辑位于下图中的 saveCommand() 函数和 bgsaveCommand() 函数，它们底层都是依赖 **rdbSave() 函数**实现的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6fc129b3c5342e8b07c84172faca659~tplv-k3u1fbpfcp-zoom-1.image)

另外，从图中我们还可以看到，serverCron() 和 prepareForShutdown() 两个函数中也会调用 rdbSave() 函数。其中，prepareForShutdown() 函数会在 Redis Server 停机之前，触发一次 RDB 持久化，保证 Redis 服务正常关闭之后数据不会丢。

而 **serverCron() 函数的调用更为关键，它是自动定时触发 RDB 持久化的地方**，核心代码片段如下：

```c
// 检查是否有子进程在生成RDB文件或是AOF的重写，如果有，则不会再新启动子进程进行RDB持久化

if (hasActiveChildProcess() || ldbPendingChildren()) {

    run_with_period(1000) receiveChildInfo();

    checkChildrenDone(); // 检查子进程是否结束

} else {

    for (j = 0; j < server.saveparamslen; j++) {

        struct saveparam *sp = server.saveparams + j;

        // 检查是否符合自动触发RDB持久化的条件

        if (server.dirty >= sp->changes &&

            server.unixtime - server.lastsave > sp->seconds &&

            // 两次尝试需要一定间隔

            (server.unixtime - server.lastbgsave_try > 

                 CONFIG_BGSAVE_RETRY_DELAY ||

             server.lastbgsave_status == C_OK)) { // 上次后台持久化是否成功

            rdbSaveInfo rsi, *rsiptr;

            rsiptr = rdbPopulateSaveInfo(&rsi);

            // fork出一个子进程，执行后台RDB持久化

            rdbSaveBackground(server.rdb_filename, rsiptr);

            break;

        }

    }

    ... // 省略AOF rewrite的逻辑，在后面介绍AOF持久化的时候，会详细介绍

}
```

这里使用到 server 的几个字段。一个是 dirty 字段，它记录了上次 RDB 持久化之后，Redis 中有多少个 Key 被修改了，下图展示了其部分调用位置，我们可以看到 HSET 等写命令都会递增 dirty 字段，在 rdbSave() 函数中会将其清零。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d26a56d8f4f74ce49adaf1f52657484f~tplv-k3u1fbpfcp-zoom-1.image)

还有，lastsave 字段记录了上次 RDB 持久化成功的时间戳，lastbgsave_try 字段记录了上次尝试进行后台 RDB 持久化的时间戳，lastbgsave_status 字段则记录了上次后台 RDB 持久化的结果，这些字段都是在 rdbSaveBackground() 和 rdbSave() 函数中更新的，然后下次在 serverCron() 触发 RDB 持久化之前使用。

这里我们展开看一下自动触发 RDB 持久化的条件。

在 redisServer 中维护了一个 saveparams 字段（saveparam 数组），每个 saveparam 实例中都记录了触发 RDB 持久化的一个条件，另外，redisServer 中还有一个 saveparamslen 字段，用来记录 saveparams 数组的长度。从上面 serverCron() 函数的逻辑我们也能看出，saveparams 中记录的多个 RDB 触发条件是 “或” 的关系，任意一个条件满足之后，就会触发 RDB 文件的生成。

saveparam 结构体中维护了两个方面的条件，一个是时间方面，另一个是数据变更方面，其定义如下：

```c
struct saveparam {

    time_t seconds; // 间隔时间

    int changes;    // 被修改的Key的个数

};
```

在 appendServerSaveParams() 函数中封装了创建 saveparam 实例并添加到 server.saveparams 数组中的逻辑，调用该方法的地方有下图展示的三个：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17923966ffa04e0794fc3270aa87e8b1~tplv-k3u1fbpfcp-zoom-1.image)

首先，initServerConfig() 函数在 Redis Server 初始化的过程中，创建了三个默认的 saveparam 实例，相关代码如下：

```c
void initServerConfig(void) {

    ... // 省略其他逻辑

    // 如果距离上次RDB持久化超过1小时，且有1个Key被修改过，则触发RDB持久化

    appendServerSaveParams(60 * 60, 1); 

    // 如果距离上次RDB持久化超过5小时，且有100个Key被修改过，则触发RDB持久化    

    appendServerSaveParams(300, 100);

    // 如果距离上次RDB持久化超过1分钟，且有10000个Key被修改过，则触发RDB持久化

    appendServerSaveParams(60, 10000); 

}
```

完成了默认 saveparam 条件的创建之后，Redis Server 会继续调用 loadServerConfig() 加载 redis.conf 配置文件，并解析其中的 save 项的配置，然后通过上图中的 setConfigSaveOption() 函数，覆盖上述默认的 saveparam 条件，相关代码片段如下：

```c
static int setConfigSaveOption(standardConfig *config, sds *argv, 

        int argc, const char **err) {

    ...// 省略前面的解析逻辑

    

    // 先执行resetServerSaveParams()函数，清空默认的saveparam条件

    if (!reading_config_file) {

        resetServerSaveParams(); 

    } else {

        static int save_loaded = 0;

        if (!save_loaded) {

            save_loaded = 1;

            resetServerSaveParams();

        }

    }

    // 根据redis.conf的save配置项，添加新的saveparam条件

    for (j = 0; j < argc; j += 2) { 

        time_t seconds;

        int changes;

        seconds = strtoll(argv[j],NULL,10);

        changes = strtoll(argv[j+1],NULL,10);

        appendServerSaveParams(seconds, changes);

    }

    return 1;

}
```

在 Redis 启动之后，我们还可以通过 CONFIG SET SAVE 命令修改的 saveparam 条件，例如，`CONFIG SET SAVE "3600 3"` 这条命令，就可以把 RDB 持久化的触发条件设置为：距离上次 RDB 持久化超过 1 小时 且 有 3 个 Key 被修改过，就会触发 RDB 持久化。CONFIG SET 命令的处理逻辑位于configSetCommand() 函数中，底层也是通过 setConfigSaveOption() 函数实现的，这里就不再重复分析了。

## RIO

介绍完 RDB 持久化的触发时机和触发条件后，下面我们再来看 RDB 持久化具体是怎么把内存中的数据持久化到磁盘上的 .rdb 文件中的。

持久化的过程必然就会涉及到磁盘 I/O 的操作，不光是 RDB 持久化，AOF 持久化也是一样的，**Redis 为了统一多种持久化的接口，自己抽象了一个 IO 层来封装磁盘 IO 涉及到的各种实现细节以及相应的 buffer 操作**，也就是这里要介绍的 `RIO`。

RIO 层最核心的就是 rio 结构体，它的每个字段都非常重要，所以这里我们会详细地介绍 rio 中每个字段的功能：

```c
struct _rio {

  // 指向数据读取函数的指针

  size_t (*read)(struct _rio *, void *buf, size_t len);

  // 指向数据写入函数的指针

  size_t (*write)(struct _rio *, const void *buf, size_t len);

  // 指向获取当前的读写偏移量函数的指针

  off_t (*tell)(struct _rio *);

  // 指向flush函数的指针

  int (*flush)(struct _rio *);

  // 指向用于计算校验和函数的指针

  void (*update_cksum)(struct _rio *, const void *buf, size_t len);

  

  uint64_t cksum, flags;  // 校验和、flags标志位

  size_t processed_bytes;   // 已经读写的字节数

  size_t max_processing_chunk;   // 单次读写的上限值



  union { // 底层读写的真正结构，可以是buffer、文件、网络连接

        struct {

          sds ptr; // 指向buffer的指针

          off_t pos; // 当前读写的位置

        } buffer;

        

        struct {

          FILE *fp; // 读写的文件

          off_t buffered; // 写入的字节数

          off_t autosync; // 是否异步刷新

        } file;

        

        struct {

          connection *conn; // 指向网络连接

          off_t pos;        // 缓冲区中的数据

          sds buf;          // 读写缓冲区

          size_t read_limit;  // 从该连接中读取数据的上限值（字节）

          size_t read_so_far; // 

        } conn;

        

        struct {

          int fd; // 读写的文件描述符   

          off_t pos; // 缓冲区中的读写位置

          sds buf; // 缓冲区

        } fd;

  } io;

};
```

虽然 rio 结构体的定义有点长，但其实就是定义了 IO 操作三方面的内容。

1.  定义了四个函数指针，分别用来实现读操作、写操作、获取当前读写的偏移量以及 flush 操作。

2.  定义了一些控制信息，用来辅助 IO 操作，例如，校验和、flags 标志位以及读写总进度等字段。
3.  最后是 io 字段，它是一个 union 结构。一个 rio 实例只能针对一个明确的数据源进行 IO 操作，但是rio 结构体可以支持读写多种不同类型的数据源，这个时候，就需要 io 字段用不同的部分记录不同的数据源。例如，读写 buffer 缓冲区时，需要使用 io.buffer；读写文件时，需要使用 io.file；读写网络连接时，需要使用 io.conn。正是由于 rio 可以读写不同的数据源，才会使用 read、write、tell 等指针来指向不同的函数实现，通过不同的函数实现来完成不同数据源的读写操作。

了解了 rio 结构体之后，我们再来看 RIO 对读写操作的封装。

首先来看 rioRead() 函数，它在 rio->read 指针的基础上，封装出了一套读取数据的模板函数，它的功能就是从 rio 的数据源中，读取 len 长度的数据到 buf 缓冲区中。下面是 rioRead() 函数的具体实现：

```c
static inline size_t rioRead(rio *r, void *buf, size_t len) {

  if (r->flags & RIO_FLAG_READ_ERROR) return 0; // 检查flags的异常标志位

  while (len) {

    // 确认读取的目标字节数

    size_t bytes_to_read = (r->max_processing_chunk 

       && r->max_processing_chunk < len) ? r->max_processing_chunk : len;

    // 调用rio->read()函数，从底层数据源读取数据

    if (r->read(r, buf, bytes_to_read) == 0) {

      // 如果读取过程发生异常，会在flags标志位设置相应标记

      r->flags |= RIO_FLAG_READ_ERROR;

      return 0;

    }

    // 对计算校验和

    if (r->update_cksum) r->update_cksum(r, buf, bytes_to_read);

    buf = (char *)buf + bytes_to_read; // 后移buf指针

    len -= bytes_to_read; // 更新此次读取的目标字节数

    r->processed_bytes += bytes_to_read; // 更新读取的总字节数

  }

  return 1;

}
```

有读操作的模板操作，自然也就有写操作的模板方法，也就是 rioWrite() 函数，它是在 rio->write 指针的基础上进行封装的，它会将 buf 缓冲区的数据写入到 rio 底层的数据源中。下面是 rioWrite() 函数的具体实现：

```c
static inline size_t rioWrite(rio *r, const void *buf, size_t len) {

  if (r->flags & RIO_FLAG_WRITE_ERROR) return 0; // 检查flags的异常标志位

  while (len) {

    // 确认需要写入的字节数

    size_t bytes_to_write = (r->max_processing_chunk && r->max_processing_chunk < len) ? r->max_processing_chunk : len;

    if (r->update_cksum) r->update_cksum(r, buf, bytes_to_write); // 计算校验和

    // 调用rio->write()函数，向底层数据源写入数据

    if (r->write(r, buf, bytes_to_write) == 0) {

      // 如果写入过程发生异常，会在flags标志位设置相应标记

      r->flags |= RIO_FLAG_WRITE_ERROR;

      return 0;

    }

    buf = (char *)buf + bytes_to_write; // 后移buf指针

    len -= bytes_to_write; // 更新此次写入的字节数

    r->processed_bytes += bytes_to_write; // 更新写入的总字节数

  }

  return 1;

}
```

RIO 提供的其他方法比较简单，比如下图展示的 rio 结构体初始化的函数，从名字就能看出，它们是根据不同的数据源进行初始化的，得到的 rio->io 的部分也就有所不同。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18b66b6250104647ab4d697dc16ce886~tplv-k3u1fbpfcp-zoom-1.image)

再比如说，下图展示的四个写入 Bulk 结构内容的写方法，它们是按照 RESP 协议格式，多次调用 rioWrite() 函数组合出来的方法。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf9a70b6b9534cab9b7dd57d000b8367~tplv-k3u1fbpfcp-zoom-1.image)

这些方法的实现都比较简单，这里就不再展开分析了，感兴趣的小伙伴可以参考源码进行学习。

## RDB 持久化关键流程

**无论是手动触发还是自动触发，都会调用 `rdbSave() 函数`在磁盘上生成一个 .rdb 后缀的文件，这也是 RDB 持久化的核心逻辑所在。**

rdbSave() 函数的关键实现如下：

```c
int rdbSave(int req, char *filename, rdbSaveInfo *rsi) {

    ... // 省略非关键代码

    // 1、调用 fopen() 打开一个名为"temp-进程号.rdb"的文件

    snprintf(tmpfile,256,"temp-%d.rdb", (int) getpid());

    fp = fopen(tmpfile,"w");

    ... // 省略非关键代码    



    //2、通过rioInitWithFile()初始化一个 rio 实例，它是专门用来读写文件的 rio 实现

    rioInitWithFile(&rdb,fp);

    startSaving(RDBFLAGS_NONE);



    if (server.rdb_save_incremental_fsync) // 是否4MB刷一次盘

        rioSetAutoSync(&rdb,REDIS_AUTOSYNC_BYTES);



    //3、按照 RDB 的格式写入到 .rdb  临时文件中，该逻辑封装在 rdbSaveRio() 函数中，下面我们会单独展开分析

    if (rdbSaveRio(req,&rdb,&error,RDBFLAGS_NONE,rsi) == C_ERR) {

        errno = error;

        err_op = "rdbSaveRio";

        goto werr;

    }



    // 4、通过 fflush() 和 fsync() 将数据完全刷到磁盘上，

    // 防止数据残存在应用缓冲区或者 OS 缓冲区中,

    // 然后才会调用 fclose() 方法关闭这个 .rdb  临时文件

    if (fflush(fp)) { err_op = "fflush"; goto werr; }

    if (fsync(fileno(fp))) { err_op = "fsync"; goto werr; }

    if (fclose(fp)) { fp = NULL; err_op = "fclose"; goto werr; }

    fp = NULL;

    

    // 5、把临时文件变成正式的 rdb 文件

    if (rename(tmpfile,filename) == -1) {

        ... // 省略错误处理逻辑

    }

    if (fsyncFileDir(filename) == -1) { err_op = "fsyncFileDir"; goto werr; }



    // 6、善后工作

    serverLog(LL_NOTICE,"DB saved on disk");

    server.dirty = 0;

    server.lastsave = time(NULL);

    server.lastbgsave_status = C_OK;

    stopSaving(1);

    return C_OK;

}
```

1.  首先，调用 fopen() 打开一个名为"temp-进程号.rdb"的文件，后续 Redis 产生的整个快照数据，都会写到这个文件中。

2.  要读写文件，就需要通过 rioInitWithFile() 初始化一个 rio 实例，它是专门用来读写文件的 rio 实现。
3.  接下来，使用 rioFileIO 将全部 Redis 中的全部数据，按照 RDB 的格式写入到 .rdb 临时文件中，该逻辑封装在 rdbSaveRio() 函数中，下面我们会单独展开分析。
4.  在数据写入完成之后，rdbSave() 函数会通过 fflush() 和 fsync() 将数据完全刷到磁盘上，防止数据残存在应用缓冲区或者 OS 缓冲区中，然后才会调用 fclose() 方法关闭这个 .rdb 临时文件。
5.  最后，就是把临时文件变成正式的 rdb 文件。其实就是调用 rename() 函数，将 .rdb 临时文件重命名为 dbfilename 配置项指定的文件名，默认是 dump.rdb。
6.  IO 操作完成之后，rdbSave() 函数还要做一些善后操作，比如，清理上面介绍的 redisServer 中统计字段，包括 dirty、lastsave、lastbgsave_status 等字段。正如前文所述，这些字段也就是计算 RDB 周期性触发条件的关键。

在 RDB 持久化关键流程中，需要展开说几个点。

第一个是 .rdb 临时文件和 .rdb 正式文件所存储的目录，是由 redis.conf 配置文件中的 dir 配置项指定，相应的处理函数是 setConfigDirOption()，其中会调用 chdir() 函数，把整个进程的工作目录切换到 dir 配置指定的目录，后续没有特别指定目录的话，默认就是在工作目录下执行 IO 操作，例如，在 rdbSave() 创建临时 rdb 文件以及正式 rdb 文件，都是默认在工作目录下创建的。

第二点是这里初始化的 rio 实例，实际是指向一个全局的 rioFileIO 实例，它的 read、write、tell、flush 指针分别指向了 rioFileRead()、rioFileWrite()、rioFileTell()、rioFileFlush() 函数，这些函数底封装的其实就是 C 语言函数库中的 fread()、fwrite()、ftello()、fflush() 等文件读写函数。

这里特别说明一下 `rioFileWrite() 函数`，它会检查 rio->io.file.autosync 字段是否设置了 sync 上限值（对应 rdb-save-incremental-fsync 配置项，默认开启），如果设置了的话，会开启`增量刷盘`的功能。具体原理是：在每次写入数据的时候，rioFileWrite() 函数都会将写入的字节数累加到 rio->io.file.buffered 里面，当 buffered 超过了 autosync 上限值时，就会触发一次 fflush() 和 fsync() 函数调用进行刷盘，防止整个 RDB 文件进行刷盘导致磁盘 IO 出现尖刺。autosync 字段的上限值没法通过配置进行调整，我们只能通过 rdb-save-incremental-fsync 配置项决定是否开启增量刷盘功能。在 Redis 7 中，autosync 的默认值 4 MB，在 Redis 6 以及之前版本，默认值是 32 MB，这个改动可以参考[这个 PR](https://github.com/redis/redis/pull/9409)。

既然看到了这个 PR，我们就展开看看这个 PR 中的另一个优化 —— `sync_file_range`。在 RDB 持久化这个场景里面，会有大量的数据写入到磁盘，如果我们开启了 rdb-save-incremental-fsync 配置，可能会出现频繁刷盘的情况，刷盘又是一个比较慢的操作，就会带来比较严重的性能问题。在内核升级到 2.6.17 之后，Linux 开始支持了sync_file_range 操作，这已经是 2015 年的事情了，目前主流的 Linux 操作系统都已经支持 sync_file_range 操作了。

在写 RDB 文件的时候，尤其是 RDB 文件比较大的时候，如果写入了大量的数据，最后直接调用 fsync 的话，就可能会很慢。有小伙伴们可能会说，可以用 fdatasync 进行优化，这个思路没问题，但是，RDB 文件在写入的过程中，其长度会不断发生变化，那么 fdatasync 的优势就没那么强了，fdatasync 也就会和 fsync 一样，要去更新文件的 metadata，而单个文件系统写 metadata 是串行的，就可能会和其他文件的刷盘冲突。

但 sync_file_range 不会写 metadata，所以它非常适合来优化 RDB 场景下，在我们每次写入一小部分数据之后，可以立即调用 sync_file_range，把这些数据刷到磁盘上。等到整个 RDB 写入完成之后，再调用 fsync 就会很快了。

下面是 rioFileWrite() 函数的核心代码：

```c
static size_t rioFileWrite(rio *r, const void *buf, size_t len) {

    // 没有开启自动刷盘功能，只调用fwrite()函数写入，不做刷盘

    if (!r->io.file.autosync) return fwrite(buf,len,1,r->io.file.fp);



    size_t nwritten = 0;

    while (len != nwritten) { // 为了防止一次写入大量数据，这里循环多次进行fwrite()

        size_t nalign = (size_t)(r->io.file.autosync - r->io.file.buffered);

        // 计算此次通过fwrite()写入的字节数数

        size_t towrite = nalign > len-nwritten ? len-nwritten : nalign;



        if (fwrite((char*)buf+nwritten,towrite,1,r->io.file.fp) == 0) return 0;

        nwritten += towrite;

        r->io.file.buffered += towrite;



        if (r->io.file.buffered >= r->io.file.autosync) { // 当写入数据超过4MB，就会进行刷盘

            fflush(r->io.file.fp); // 把数据刷到内核缓冲区

            size_t processed = r->processed_bytes + nwritten;

            // 调用sync_file_range()进行异步刷盘

            if (sync_file_range(fileno(r->io.file.fp),

                    processed - r->io.file.autosync, r->io.file.autosync,

                    SYNC_FILE_RANGE_WRITE) == -1)

                return 0;

            // 周期性调用同步刷盘，如果异步刷盘没有堆积，这里的同步刷盘会很快

            if (processed >= (size_t)r->io.file.autosync * 2) {

                if (sync_file_range(fileno(r->io.file.fp),

                        processed - r->io.file.autosync*2,

                        r->io.file.autosync, SYNC_FILE_RANGE_WAIT_BEFORE|

                        SYNC_FILE_RANGE_WRITE|SYNC_FILE_RANGE_WAIT_AFTER) == -1)

                    return 0;

            }

            r->io.file.buffered = 0;

        }

    }

    return 1;

}
```

我们看到，在调用 sync_file_range 的时候，可以通过它的 flags 参数，也就是第四个参数，决定此次调用是异步、还是同步的，下面是 flags 参数各个取值的具体含义。

-   SYNC_FILE_RANGE_WRITE：异步刷盘。
-   SYNC_FILE_RANGE_WAIT_BEFORE：写前做一次全文件范围的 sync_file_range，保证在调用fdatasync 或 fsync 之前，该文件的所有数据都已经全部刷到磁盘了。
-   SYNC_FILE_RANGE_WAIT_AFTER：写后做一次全文件范围的 sync_file_range，保证在调用fdatasync 或 fsync 之前，该文件的所有数据都已经全部刷到磁盘了。

## 总结

在这一节中，我们重点介绍了 Redis 中 RDB 持久化的关键流程。

-   首先，我们介绍了 RDB 持久化的基本特性以及触发 RDB 持久化的时机。
-   然后，讲解了 RIO 这个 Redis 持久化依赖的核心结构体，它是 Redis 为了统一多种持久化的`接口`。
-   最后，带领小伙伴们一起分析了 RDB 持久化的关键流程，以及其中的优化点。

下一节，我们将深入 RDB 文件的格式，看看 RDB 文件中到底存储了哪些数据。