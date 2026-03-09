这里统称 `CompressionStream`，实际上代指 `CompressionStream` 与 `UncompressionStream`。类比前两篇文章，`zlib` 是 Legacy 的 Node.js API，而 `CompressionStream` 与 `UncompressionStream` 则是 Winter 中的 Minimum Common Web Platform API 之一。

共同之源——zlib
----------

`zlib` 这个名字并不是 Node.js 中特有的，而是说它用了一个 C 写的开源库 zlib。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b892a2d83c2447a979785005eb35cad~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=369&h=204&s=52415&e=png&a=1&b=306930)

zlib 初版 0.9 版在 1995 年 5 月 1 日发表。其使用 DEFLATE 算法，最初是为 libpng 库所写的，后来普遍为许多软件所使用。

Node.js 中的 `zlib` 模块就是对该库的一个封装。Node.js 中的 `CompressionStream` 与 `UncompressionStream` 同理。事实上，市面上绝大多数实现了该 API 的运行时（包括各浏览器在内）都使用了 `zlib` 去支持这俩 API。

### 最简单的压缩代码

在 zlib 库的官网中，教大家怎么依赖 zlib 用最简单的 C 语言编写一段压缩代码。这里展示出来给大家看一下。

    #define CHUNK 16384
    
    int def(FILE *source, FILE *dest, int level)
    {
        int ret, flush;
        unsigned have;
        z_stream strm;
        unsigned char in[CHUNK];
        unsigned char out[CHUNK];
    
        strm.zalloc = Z_NULL;
        strm.zfree = Z_NULL;
        strm.opaque = Z_NULL;
        ret = deflateInit(&strm, level);
        if (ret != Z_OK)
            return ret;
    
        do {
            strm.avail_in = fread(in, 1, CHUNK, source);
            if (ferror(source)) {
                (void)deflateEnd(&strm);
                return Z_ERRNO;
            }
            flush = feof(source) ? Z_FINISH : Z_NO_FLUSH;
            strm.next_in = in;
    
            do {
                strm.avail_out = CHUNK;
                strm.next_out = out;
                ret = deflate(&strm, flush);
                assert(ret != Z_STREAM_ERROR);
                have = CHUNK - strm.avail_out;
                if (fwrite(out, 1, have, dest) != have || ferror(dest)) {
                    (void)deflateEnd(&strm);
                    return Z_ERRNO;
                }
            } while (strm.avail_out == 0);
            assert(strm.avail_in == 0);
        } while (flush != Z_FINISH);
        assert(ret == Z_STREAM_END);
    
        (void)deflateEnd(&strm);
        return Z_OK;
    }
    

这里有几个局部变量需要说明一下：

*   `ret`：zlib 操作完返回的各种状态码，比如 `Z_STREAM_END` 表示压缩或解压缩的数据流已经到达末尾；
    
*   `flush`：各次操作的 Flush 状态，有 `Z_FLUSH` 和 `Z_NO_FLUSH`；
    
    *   `Z_FLUSH`：表示这是要压缩的最后一块输入数据；
    *   `Z_NO_FLUSH`：表示我们仍然在未压缩数据的中间部分；
*   `strm`：用来向 zlib 传递信息，并从 zlib 获取信息，以及维持 `deflate()`（压缩）的状态；
    
*   `in` 和 `out`：`deflate()` 的输入和输出缓冲区。
    

首先使用 `deflateInit()` 来初始化 zlib 的压缩状态。初始化之前，我们设置了 `strm` 结构体中的 `zalloc`，`zfree` 和 `opaque` 字段，此处我们用 `Z_NULL` 来让 zlib 使用默认的内存分配方式。然后判断 `ret` 是否是 `Z_OK`。

接下去是一个循环，循环每次都会从文件中读取指定长度的内容（`fread(in, 1, CHUNK, source)`）。此处 `in` 就是读入的 Buffer；`1` 表示读取一次；`CHUNK` 值为 `16384`，表示每次最多读取 16384 字节；`source` 则是输入文件的句柄。

`fread()` 的返回值是实际读取的内容长度。我们将其赋值给 `strm.avail_in`，以告诉 zlib 现在还剩 `avail_in` 的内容未被处理。

`flush = feof(source) ? Z_FINISH : Z_NO_FLUSH;` 这段代码的意思是，看看这次读完后 `source` 是不是就到最后（EOF）了。如果没到最后，则说明还没读完，没处理完，我们通过 `Z_NO_FLUSH` 来告知 zlib 我们后续还会有内容要处理；若读完了则通过 `Z_FLUSH` 告知 zlib 这是最后一批工作。

接着将 `in` 这个 Buffer 赋值给 `strm.next_in`，告知 zlib 这次要处理的 Buffer 指针。

某一块输入数据准备好了，接着又是一个 `do-while` 循环，分一次或多次去压缩这次读取的内容。每次进行压缩的时候，先设置好 `strm.next_out`，让 zlib 将压缩输出的内容导到 `out` 中，并告知这个 `out` 的容量（`strm.avail_out`）为 `CHUNK`。也就说，如果 `out` 填满了，这一段 `in` 还没压缩完，是会继续这个 `do-while` 循环的。

输入输出都准备好后，就是 zlib 的核心 `ret = deflate(&strm, flush)` 了。这一句的意思是通过 zlib 的 `deflate()` 函数来对我们刚设置好的 `strm` 输入输出进行压缩，并告知它的 `flush` 状态。在这个函数执行完之后，会去改变 `strm` 的 `next_in`、`next_out`、`avail_in`、`avail_out`，比如压缩到某个位置后输出 Buffer 满了，那么剩下没被压缩的长度会变成新的 `avail_in`，剩下没被压缩的内容会被变为 `next_in`。也就是说，如果 `avail_in` 变成了 `0`，就代表着此次输入全处理完了。

执行 `deflate()` 压缩之后，先断言一下 `ret` 不是 `Z_STREAM_ERROR`。然后就是 `have`，`CHUNK` 减去还剩下可用的输出 Buffer 长度（`avail_out`），也就是此次压缩得到的输出长度：

have（输出长度）\= CHUNK（总长度）−avail\_out（剩余长度）have（输出长度）= CHUNK（总长度）-avail\\\_out（剩余长度）have（输出长度）\= CHUNK（总长度）−avail\_out（剩余长度）

然后把 `out` 输出 Buffer 中 `have` 长度的内容追加至输出文件（`fwrite(out, 1, have, dest)`）。该追加函数的返回值是实际写入长度，若实际写入长度短于 `have` 则报错。

这个压缩的 `do-while` 循环的退出条件是 `strm.avail_out != 0`。因为如果 `strm.avail_out` 等于 `0` 了，表示此次压缩的输出内容被填满了，那么是否输入文件全被处理完我们尚未可知。但如果输出内容未被填满，则说明我们压缩到输入内容的最后，也没能填满输出 Buffer，则说明输入内容完全被处理完了。

![22流程图1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99d3bc61a1654215813f4892735f4981~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1130&h=330&s=58547&e=png&b=fffaf9)

如上图，输入 Buffer 第一次只处理了一部分内容，就把输出 Buffer 给填满了，这个时候 `do-while` 中判断 `strm.avail_out == 0`，继续循环；第二轮循环中，输出 Buffer 只用了很少一部分的空间就把输入 Buffer 的内容压缩完了，这个时候 `strm.avail_out != 0`，代表输入 Buffer 完全被处理，退出本次循环。

在输出 Buffer 自身总长度要短于输入 Buffer 长度的时候，我们通常的确是要好几轮才能处理完输入 Buffer。但是当输入 Buffer 和输出 Buffer 一样长的时候（就像上图），为什么也要做这些判断呢？压缩不应该输出肯定比输入短吗？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b721237d4fd944ebad964c1253d163dd~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=225&h=225&s=18331&e=png&b=f5f5f5)

zlib 的 `deflate()` 函数在压缩数据时，是有可能使得压缩后的数据比压缩前的数据要长。这种情况通常发生在你尝试压缩的数据已经是压缩过的，或者说这些数据无法进一步压缩。例如，如果你尝试压缩一份已经被压缩过的文件，或者是一份随机数据文件，那么压缩后的文件可能比原始文件要大。这是因为压缩算法需要添加一些额外的信息（如压缩头和校验和等）到压缩数据中，这些额外的信息可能会使得压缩后的数据大小超过了原始数据的大小。

所以，哪怕输入 Buffer 和输出 Buffer 等长的情况下，我们仍需要用循环来处理可能得增长。那么如果输出 Buffer 大于输入 Buffer 呢？主要我们在完成压缩前，我们也不知道它到底会不会更大呀，你得跑了才知道，还是写个循环稳妥点——薛定谔的压缩。

比如，上面的图我们再极端一点。

![22流程图2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba26433c8328407184ddcc992aa6472d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1122&h=286&s=59833&e=png&b=fef8f7)

循环第二次后，虽然输入 Buffer 处理完了，但是输出 Buffer 也占满了。这个时候怎么办？那也没关系，我们还是通过 `avail_out` 来判断。我们目前认为它“也许还是没处理完”。等到第三次循环的时候，因为输入 Buffer 剩下的内容已经没了，这个时候处理完的输出 Buffer 会一个子儿也不占，所以第三轮处理完的时候，`avail_out` 会是输出 Buffer 的总长度，自然也达到了“退出循环”的条件。只不过多空跑一轮而已，问题不大。

当我们一段输入 Buffer 处理完之后，我们得断言一下 `avail_in` 是不是 `0`，也就是是不是真的处理完了。如果输出 Buffer 没被充满，但是 `avail_in` 还没处理完，相当于代码逻辑私藏了——这逻辑肯定是错的，这种逻辑不应该存在，所以需要断言来退出程序。

这些都做完之后，我们在上一层循环中的退出条件是本次的输入 Buffer 是不是最后一段输入 Buffer，也就是输入文件有没有被读完。我们在前面已经通过 `flush` 标识来表示有没有读完了，所以退出条件自然是 `flush == Z_FINISH`。

输入文件读完、输出文件写完后，再通过 `deflateEnd()` 销毁 `strm` 的各种内容。最终返回 `Z_OK` 表示压缩成功。一个压缩效果不怎么好的过程会像下面这样：

![22流程大图3.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc5c0b9ebd8547ec86ddc277efa39527~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1716&h=5610&s=698442&e=png&b=ffffff)

![22流程大图4.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44b01c5e5fdc490db7d59dc9583eb225~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1732&h=5704&s=861030&e=png&b=ffffff)

说白了就是抄一段，然后找个地方打草稿，草稿打满了后把答案抄到试卷上。如果这个时候抄的这段还没弄完，那么打新草稿，继续抄答案到试卷上。直到抄的这段弄完，再抄一段新的，继续打草稿抄答案到试卷……

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8581c70694e54ac3a6a071747de5f706~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=800&h=527&s=466110&e=png&b=918778)

`def()` 函数写好后，接下去就主函数了。以 `stdin` 作为输入，`stdout` 作为输出。

    int main(int argc, char **argv)
    {
        int ret;
    
        ret = def(stdin, stdout, Z_DEFAULT_COMPRESSION);
        if (ret != Z_OK)
          zerr(ret);
        return ret;
    }
    

### 最简单的解压代码

解压与压缩类似，只不过压缩是 `deflate()`，解压是 `inflate()`。

    int inf(FILE *source, FILE *dest)
    {
        int ret;
        unsigned have;
        z_stream strm;
        unsigned char in[CHUNK];
        unsigned char out[CHUNK];
    
        strm.zalloc = Z_NULL;
        strm.zfree = Z_NULL;
        strm.opaque = Z_NULL;
        strm.avail_in = 0;
        strm.next_in = Z_NULL;
        ret = inflateInit(&strm);
        if (ret != Z_OK)
            return ret;
    
        do {
            strm.avail_in = fread(in, 1, CHUNK, source);
            if (ferror(source)) {
                (void)inflateEnd(&strm);
                return Z_ERRNO;
            }
            if (strm.avail_in == 0)
                break;
            strm.next_in = in;
    
            do {
                strm.avail_out = CHUNK;
                strm.next_out = out;
    
                ret = inflate(&strm, Z_NO_FLUSH);
                assert(ret != Z_STREAM_ERROR);
                switch (ret) {
                case Z_NEED_DICT:
                    ret = Z_DATA_ERROR;
                case Z_DATA_ERROR:
                case Z_MEM_ERROR:
                    (void)inflateEnd(&strm);
                    return ret;
                }
    
                have = CHUNK - strm.avail_out;
                if (fwrite(out, 1, have, dest) != have || ferror(dest)) {
                    (void)inflateEnd(&strm);
                    return Z_ERRNO;
                }
            } while (strm.avail_out == 0);
        } while (ret != Z_STREAM_END);
    
        (void)inflateEnd(&strm);
        return ret == Z_STREAM_END ? Z_OK : Z_DATA_ERROR;
    }
    

一样，也是初始化、一段一段读入数据。每段数据读入后，同样开始不断解压填充输出。这里有几个不同的点是，由于压缩后的内容是有终止标识的，所以不需要你告诉 zlib 某一段是不是最后一段，所以统一传 `Z_NO_FLUSH` 就好了。另外，压缩时数据随意，不会出错；但是解压必定得是 zlib 特定算法压缩之后得到的特定内容格式，一旦格式不对就无法完成解压。所以 zlib 解压每段的时候都需要检测一遍此次解压的这段有没有问题。我们需要对每次 `inflate()` 之后得到的 `ret` 做一遍判断，它不能是各种错误码。

Node.js 中的 `zlib`
-----------------

在 Node.js 官方文档中是这么描述 `zlib` 的：

> The `node:zlib` module provides compression functionality implemented using Gzip, Deflate/Inflate, and Brotli.

它提供了压缩功能，支持 Gzip、Deflate/Inflate 以及 Brotli。我们前面介绍过，zlib 使用的是 DEFLATE 算法。

DEFLATE 是由 Lempel-Ziv 压缩（LZ77）和 Huffman 编码组合而成的一个无损数据压缩算法。它由 Phil Katz 在 1993 年为其 ZIP 压缩软件所设计，现已被广泛采用。而 INFLATE 则是它的解压缩。

Gzip 格式则是在 DEFLATE 算法的基础上，加了一些额外的元数据，如原始文件的名称、原始文件的大小、以及文件的修改时间等。Gunzip 则是它的解压缩。Gzip 常常被用于 HTTP 协议中，以减少在网络上传输的数据量。

而 Brotli 则是 Google 开发的一种无损数据压缩算法，基于 LZ77 算法的一个现代变体、霍夫曼编码和二阶上下文建模。它可以被用于压缩数据以进行网络传输，或者压缩文件以节省存储空间。Brotli 旨在对于网络传输的文本数据提供更高的压缩率。相较于 Gzip 和 DEFLATE，Brotli 压缩后的数据更小，能带来更快的页面加载速度和更低的数据使用。

这几种能力中，Gzip、Deflate/Inflate 使用的是 zlib，而 Brotli 则用的谷歌写的 [brotli 库](https://github.com/google/brotli "https://github.com/google/brotli")。但由于它们都是压缩解压缩的算法，而 Brotli 又是 Node.js v10 之后才出现的，所以跟 zlib 放到了一个模块下。但我们又不好给这个模块改名，不然就不向下兼容了。所以 Brotli 虽然不是 zlib 生的，但在 Node.js 中寄样在 zlib 模块下面。

在 Node.js 的 zlib 中，有几个核心的类，它们分别提供了不同能力。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/352f073181244b4fa811828164ef7c27~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=300&h=231&s=1069339&e=gif&f=40&b=4d78ce)

*   `ZlibBase`：`zlib` 模块的基类，继承自 `stream` 模块的 `Transform` [变形金刚流](https://zhuanlan.zhihu.com/p/44809689#h_44809689_9 "https://zhuanlan.zhihu.com/p/44809689#h_44809689_9")；
    
*   `Zlib`：继承自 `ZlibBase`，`zlib` 模块中底层基于 `zlib` 库的那些类的基类（虽然有点拗口，但是回去看一下前面几段话就好理解了）；
    
*   `Brotli`：原型链继承自 `Zlib`，但是构造函数中的 `super` 却调用的 `ZlibBase`；
    
*   `Deflate`：继承自 `Zlib`；
    
*   `Inflate`：继承自 `Zlib`；
    
*   `Gunzip`：继承自 `Zlib`；
    
*   `Gzip`：继承自 `Zlib`；
    
*   `DeflateRaw`：继承自 `Zlib`；
    
*   `InflateRaw`：继承自 `Zlib`；
    
*   `Unzip`：继承自 `Zlib`；
    
*   `BrotliCompress`：继承自 `Brotli`；
    
*   `BrotliDecompress`：继承自 `Brotli`。
    

上面这些类中的后九项就是我们在 Node.js 文档中看到的暴露出来的那几个类了。这几个类画成关系图如下：

![22流程大图5.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ce20cbb3d4c44d18988ed48b79bf1c9~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=2768&h=1446&s=279988&e=png&b=fefefe)

这里面的 `binding` 指 C++ 侧实现的类。`ZlibBase` 里面有一个 `_handle` 属性，是 `Zlib` 或者 `Brotli` 在初始化的时候生成的。其中 `Zlib` 在初始化的时候 `_handle` 为 `binding.Zlib` 实例；而 `Brotli` 在初始化的时候视当前是 `BrotliCompress` 还是 `BrotliDecompress` 而定为 `binding.BrotliEncoder` 还是 `binding.BrotliDecoder`。而无论是哪类 `_handle`，最终都是继承自 `binding.CompressStream`。

这些类里面，`zlib` 中的那些类主要是实现一个变形金刚流，并且做相关的流程控制。而 `CompressionStream` 及其派生类都是针对单块内容的加解压时进行的异步多线程操作，在另外的线程调用形如我们在上一节中提到的 `inflate()` 和 `deflate()` 函数。

**篇幅原因，** **`Brotli`** **相关内容我们就不讲了。**

### `ZlibBase`——变形金刚流

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e20a257abec940799b76cf2e8a17c8fd~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=474&h=360&s=714454&e=gif&f=12&b=033c7c)

让我们回到 `stream` 的官方文档中看看，如果要实现一个变形金刚流，[都要做什么事](https://nodejs.org/docs/latest-v18.x/api/stream.html#implementing-a-transform-stream "https://nodejs.org/docs/latest-v18.x/api/stream.html#implementing-a-transform-stream")——[实现 Transform.\_transform()](https://nodejs.org/docs/latest-v18.x/api/stream.html#transform_transformchunk-encoding-callback "https://nodejs.org/docs/latest-v18.x/api/stream.html#transform_transformchunk-encoding-callback")。

> All `Transform` stream implementations must provide a `_transform()` method to accept input and produce output. The `transform._transform()` implementation handles the bytes being written, computes an output, then passes that output off to the readable portion using the `transform.push()` method.

看看 `ZlibBase` 是[如何实现 \_transform() 的吧](https://github.com/nodejs/node/blob/v18.16.0/lib/zlib.js#L412-L425 "https://github.com/nodejs/node/blob/v18.16.0/lib/zlib.js#L412-L425")。

    function processChunk(self, chunk, flushFlag, cb) {
      const handle = self._handle;
      if (!handle) return process.nextTick(cb);
    
      handle.buffer = chunk;
      handle.cb = cb;
      handle.availOutBefore = self._chunkSize - self._outOffset;
      handle.availInBefore = chunk.byteLength;
      handle.inOff = 0;
      handle.flushFlag = flushFlag;
    
      handle.write(flushFlag,
                   chunk, // in
                   0, // in_off
                   handle.availInBefore, // in_len
                   self._outBuffer, // out
                   self._outOffset, // out_off
                   handle.availOutBefore); // out_len
    }
    
    ZlibBase.prototype._transform = function(chunk, encoding, cb) {
      ...
      processChunk(this, chunk, flushFlag, cb);
    };
    

处理一下参数然后调用 `processChunk()`。而 `processChunk()` 中对 `handle` 做了一些类似于前文对 `strm` 做的操作，接着调用了 `handle.write()`。

这个 `handle` 就是前面类图中提到的，可能是 `binding.Zlib`、`binding.BrotliEncoder` 或者 `binding.BrotliDecoder` 的任意一项。它们都继承自 `binding.CompressionStream`，它们的 `write()` 都是在另一个线程中执行加解压一块内容的操作。

### `binding.Zlib`

除了 `BrotliCompress` 和 `BrotliDecompress`，剩下的 zlib 相关类中的 `_handle` 都是 `binding.Zlib` 类的实例。该实例会在 `zlib.Zlib` 类的构造函数中被初始化。

    function Zlib(opts, mode) {
      ...
      const handle = new binding.Zlib(mode);
      handle.init(windowBits,
                  level,
                  memLevel,
                  strategy,
                  this._writeState,
                  processCallback,
                  dictionary);
    
      // 将 handle 传给 ZlibBase，以此将其作为 `this._handle`
      ZlibBase.call(this, ..., handle, ...);
    }
    
    function Deflate(opts) {
      ...
      Zlib.call(this, opts, DEFLATE);
    }
    
    ...
    

可以看出来，不同类只是 `mode` 不同。比如 `Deflate` 类，它传递给父类的 `mode` 就是 `DEFLATE`。`binding.Zlib` 就是根据不同 `mode` 的值区分不同的内容的。

这个 `mode` 怎么就能起到指定是 `Deflate`、`DeflateRaw`、`Gzip`、`Gunzip`、`Unzip`、`Inflate`、`InflateRaw` 的区别呢？我们先来看看它们的不同：

*   `Deflate` 与 `Inflate`：用 DEFLATE 压缩与解压；
    
*   `DeflateRaw` 与 `InflateRaw`：也是用 DEFLATE 加解压，但是压缩内容中不附加 `zlib` 的头，解压的格式也不应该有；
    
*   `Gzip` 与 `Gunzip`：用 gzip 来加解压；
    
*   `Unzip`：可自动探测内容是被 `Deflate` 压缩的还是被 `Gzip` 压缩的，并进行相关解压。
    

#### `write()`

`binding.Zlib::write()` 最终是体现在 `handle.write()` 上的。上面讲的几种类型，最终调用的都是 `binding.Zlib::write()`。在该函数中，最终调用的是其父类 `PoolThreadWork` 的 `ScheduleWork`。里面是通过 `uv_queue_work()` 去调用 `handle.doThreadPoolWork()`。

> 还记得第二十一章中介绍的 `uv_queue_work()` 吗？它是在一个线程池中依次执行任务，并在执行完毕后通过 `uv_async_t` 将“任务完成”的信息吸附回主事件循环以进行后续逻辑。

在 `binding.Zlib::DoThreadWork()`，也就是线程池任务逻辑中，我们可以看到一些熟悉的逻辑。

> 这里实际上不是 Zlib，而是它模板类中的一些内容。情况有些复杂，但大家只要理解为 `Zlib` 的 `DoThreadWork()` 最终调用的是 `ZlibContext::DoThreadPoolWork()` 就好了。不然还得绕挺多 C++ 逻辑的，你也不想这样吧。

    constexpr uint8_t GZIP_HEADER_ID1 = 0x1f;
    constexpr uint8_t GZIP_HEADER_ID2 = 0x8b;
    
    void ZlibContext::DoThreadPoolWork() {
      ...
    
      const Bytef* next_expected_header_byte = nullptr;
      switch (mode_) {
        case DEFLATE:
        case GZIP:
        case DEFLATERAW:
          err_ = deflate(&strm_, flush_);
          break;
        case UNZIP:
          if (strm_.avail_in > 0) {
            next_expected_header_byte = strm_.next_in;
          }
    
          switch (gzip_id_bytes_read_) {
            case 0:
              if (next_expected_header_byte == nullptr) {
                break;
              }
    
              if (*next_expected_header_byte == GZIP_HEADER_ID1) {
                gzip_id_bytes_read_ = 1;
                next_expected_header_byte++;
    
                if (strm_.avail_in == 1) {
                  // The only available byte was already read.
                  break;
                }
              } else {
                mode_ = INFLATE;
                break;
              }
    
              [[fallthrough]];
            case 1:
              if (next_expected_header_byte == nullptr) {
                break;
              }
    
              if (*next_expected_header_byte == GZIP_HEADER_ID2) {
                gzip_id_bytes_read_ = 2;
                mode_ = GUNZIP;
              } else {
                // There is no actual difference between INFLATE and INFLATERAW
                // (after initialization).
                mode_ = INFLATE;
              }
    
              break;
            default:
              UNREACHABLE("invalid number of gzip magic number bytes read");
          }
    
          [[fallthrough]];
        case INFLATE:
        case GUNZIP:
        case INFLATERAW:
          err_ = inflate(&strm_, flush_);
    
          // If data was encoded with dictionary (INFLATERAW will have it set in
          // SetDictionary, don't repeat that here)
          if (mode_ != INFLATERAW &&
              err_ == Z_NEED_DICT &&
              !dictionary_.empty()) {
            // Load it
            err_ = inflateSetDictionary(&strm_,
                                        dictionary_.data(),
                                        dictionary_.size());
            if (err_ == Z_OK) {
              // And try to decode again
              err_ = inflate(&strm_, flush_);
            } else if (err_ == Z_DATA_ERROR) {
              // Both inflateSetDictionary() and inflate() return Z_DATA_ERROR.
              // Make it possible for After() to tell a bad dictionary from bad
              // input.
              err_ = Z_NEED_DICT;
            }
          }
    
          while (strm_.avail_in > 0 &&
                 mode_ == GUNZIP &&
                 err_ == Z_STREAM_END &&
                 strm_.next_in[0] != 0x00) {
            ...
            err_ = inflate(&strm_, flush_);
          }
          break;
        default:
          UNREACHABLE();
      }
    }
    

根据 `mode` 不同，这里的代码我们分几块看。

第一块，`DEFLATE`、`GZIP` 与 `DEFLATERAW` 逻辑一致，都是直接 `deflate(&strm_, flush_)` 了事。

第二块，`UNZIP`。前文说过，`Unzip` 可自动探测内容是被 `Deflate` 压缩的还是被 `Gzip` 压缩的，并进行相关解压。在 Gzip 文件格式中，文件头的前两个字节应该是 `0x1f` 和 `0x8b`。这两个值在 Gzip 文件中是固定的，用来表明这个文件是一个 Gzip 文件。所以，最开始的两个常量就是用来和读取到的文件头部进行比对，从而判断该文件是否为 Gzip 文件。所以在 `UNZIP` 中，把内部的 `switch-case` 解释一下，就是判断头两位是否是 `0x1f`、`0x8b`，若是，则将 `mode`设置成为 `GUNZIP`，否则设置为 `INFLATE`，然后跳出内部的 `switch-case`。这里注意，外层的 `switch-case` 在 `UNZIP` 中并没有被 `break`，而是加了一个 `[[fallthrough]]` 的属性。

> 在 C++ 的 `switch` 语句中，如果在一个 `case` 分支末尾没有使用 `break`，控制流就会“贯穿”到下一个 `case`。这通常被视为编程错误，因为这样的行为可能会导致预期之外的结果。然而，在某些情况下，程序员可能有意为之，让控制流贯穿到下一个 `case`。这种时候，就可以使用 `[[fallthrough]]` 属性来消除编译器的警告，表明这种贯穿行为是有意的。

为什么这里要“贯穿”呢？因为当我们读了两个字节确定了它是 `INFLATE` 还是 `GUNZIP` 后，我们就重设了 `mode`，然后流控会继续往下面去匹配。而 `INFLATE` 和 `GUNZIP` 刚好是在 `UNZIP` 之后，是会被正常匹配到，并执行相应后续逻辑的。所以这里的 `switch-case` 顺序也是有讲究的——如果我们把 `UNZIP` 这个 `case` 写到了 `INFLATE` 或者 `GUNZIP` 之后，就不会被后续匹配到了。

上面这段逻辑就是我们之前讲的“`Unzip` 可自动探测内容是被 `Deflate` 压缩的还是被 `Gzip` 压缩的，并进行相关解压”。

第三块，剩下的三个解压方式都是通过 `inflate(&strm_, flush_)` 了事。如果第一遍解压失败，那我们看看是不是因为没加字典。如果需要字典且外部调用并没有提供字典（外部调用的 `options` 参数中的 `dictionary` 字段），那么就是 `Z_NEED_DICT` 错误；如果有提供字典，那么通过 `inflateSetDictionary()` 设置字典，然后重新进行一遍 `inflate(&strm_, flush_)`。接着就是循环调用 `inflate()` 直到本次这块内容解压完成。

大家可能比较奇怪，为什么我们最开始介绍的压缩是用内外两层 `do-while` 进行不断压缩，而这里每次 `DoThreadWork()` 时，只做一次，毫不恋战呢？因为这些不断读取、压缩的流程控制已经在 JavaScript 侧的 `Transform` 层就做了的。而每次 `DoThreadWork()` 进行压缩之后，`strm` 中的状态（相当于之前画中的白纸记录的临时状态）是会被存下来，供下一次 `DoThreadWork()` 使用的。

看起来好像讲差不多了。但是有没有发现一个问题，为什么 `DEFLATE`、`GZIP` 和 `DEFLATERAW` 用的都是 `inflate()`，甚至参数都一样，zlib 库是怎么区分这三种类型的呢？解压的三个方法同理。这就涉及到下面的内容了。

#### `init()`

每次构造一个 `binding.Zlib` 时，都会调用 [ZlibContext::Init()](https://github.com/nodejs/node/blob/v18.16.0/src/node_zlib.cc#L958-L1003 "https://github.com/nodejs/node/blob/v18.16.0/src/node_zlib.cc#L958-L1003") 进行初始化。

        void ZlibContext::Init(...) {
          ...
    
          if (mode_ == GZIP || mode_ == GUNZIP) {
            window_bits_ += 16;
          }
    
          if (mode_ == UNZIP) {
            window_bits_ += 32;
          }
    
          if (mode_ == DEFLATERAW || mode_ == INFLATERAW) {
            window_bits_ *= -1;
          }
    
          ...
        }
    

摘除一些不重要的逻辑，这里剩下上面这几行代码。如果 `mode` 是 `GZIP` 或者 `GUNZIP`，则将 `window_bits_` 值加上 `16`；如果是 `UNZIP` 则加 `32`；如果是 `DEFLATERAW` 或者 `INFLATERAW`，则取负数。

这是什么科学道理呢？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6ccce72d6de4c8cbbb22e1f48b77074~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=440&h=440&s=99935&e=png&b=fafafa)

首先，`window_bits` 是窗口大小（历史缓冲区的大小）的以 `2` 为底的对数。例如，当 `window_bits` 为 `8` 时，窗口大小就是 `256` 字节。这个 `window_bits` 在 Node.js 中是可以作为参数传给 zlib 的各种类的。

对于现版本 Node.js（v18.16.0）所使用的 zlib 版本（v1.2.11）来说，`window_bits` 值应该在 `8` 到 `15` 之间。

话是这么说的没错，但 zlib 的文档中也说了，实际上这个 `window_bits` 可以是其它值。

当 `window_bits` 处于 `-8` 到 `-15` 之间时，则表示使用 Raw 进行加解压，也就是所谓的 `DEFLATERAW` 和 `INFLATERAW`。这种模式下不包含 zlib 或 Gzip 的头部和尾部。

当 `window_bits` 大于 `15` 时，则表示一个 Gzip 的加解压。所以当我们对原 `window_bits` 加上 `16`，就会为压缩对象加上 Gzip 的头尾，而不再包含 zlib 的头尾。

当加上 `32` 后，这个 `window_bits` 就又代表可自行探测 GUNZIP 还是 INFLATE 了。

所以，我们在初始化的时候通过 `window_bits` 来告诉 zlib，这个对象要处理的内容到底是哪种模式。

        inflateInit2(&strm_, window_bits_);
    

`CompressionStream` 与 `UncompressionStream`
-------------------------------------------

> 阅读本节前，建议你对 Service Worker API 中的 `ReadableStream`、`WritableStream` 以及 `TransformStream` 有所了解，并且知道它们是怎么用的。了解什么是 `controller.enqueue()`，什么是 `getReader()` 以及 `getWriter()` 等。
> 
> *   [developer.mozilla.org/en-US/docs/…](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream "https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream")
>     
> *   [developer.mozilla.org/en-US/docs/…](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream "https://developer.mozilla.org/en-US/docs/Web/API/WritableStream")
>     
> *   [developer.mozilla.org/en-US/docs/…](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream "https://developer.mozilla.org/en-US/docs/Web/API/TransformStream")
>     
> 
> 如果你已了解，当我什么都没说。

这俩是 Winter 中的压缩与解压流。它们都是 Service Worker API 中 [TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream "https://developer.mozilla.org/en-US/docs/Web/API/TransformStream") 的一种实现。`TransformStream` 中内含一个 `readable` 和一个 `writable`。其中 `readable` 是 [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream "https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream")，`writable` 是 [WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream "https://developer.mozilla.org/en-US/docs/Web/API/WritableStream")，中间再有个 Transform 逻辑就好了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c45d74b0b6f4f44995df75c2c18876b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=300&h=200&s=679102&e=gif&f=29&b=592308)

Node.js 中的 `CompressionStream` 与 `UncompressionStream` 比较偷懒。因为之前已经有现成的各式各样的加解压的变形金刚流的实现，这俩 Winter 的 API 就直接买四个萝卜切吧切吧剁了，再来四块豆腐你就咕嘟咕嘟吧。

        let zlib;
        function lazyZlib() {
          zlib ??= require('zlib');
          return zlib;
        }
    
        class CompressionStream {
          #handle;
          #transform;
    
          constructor(format) {
            switch (format) {
              case 'deflate':
                this.#handle = lazyZlib().createDeflate();
                break;
              case 'gzip':
                this.#handle = lazyZlib().createGzip();
                break;
              default:
                throw new ERR_INVALID_ARG_VALUE('format', format);
            }
            this.#transform = newReadableWritablePairFromDuplex(this.#handle);
          }
    
          get readable() {
            return this.#transform.readable;
          }
    
          get writable() {
            return this.#transform.writable;
          }
        }
    

`UncompressionStream` 实现也类似。核心就是通过 `zlib` 的 `createDeflate()` 或者 `createGzip()` 创建相应的变形金刚流（上一节介绍过的），把它存在 `this.#handle` 中。然后通过 `newReadableWritablePairFromDuplex()` 工具函数来将这个变形金刚流处理成 Service Worker API 中的 `ReadableStream` 与 `WritableStream` 对。往对应的 `readable` 中写内容，会被压缩或解压，并把结果导向 `writable` 中。

> **问：** 明明我们前面讲的是 `Transform`，怎么到这个函数里面就是 `Duplex` 了？
> 
> **答：** 变形金刚流也是双工流的一种，只是它的输出是输入经过一系列计算后得到的结果。

### `newReadableWritablePairFromDuplex()`

这个 [newReadableWritablePairFromDuplex()](https://github.com/nodejs/node/blob/v18.16.0/lib/internal/webstreams/adapters.js#L567-L608 "https://github.com/nodejs/node/blob/v18.16.0/lib/internal/webstreams/adapters.js#L567-L608") 长这样：

        function newWritableStreamFromStreamWritable(streamWritable) {
          ...
          return new WritableStream({
            start(c) { controller = c; },
    
            async write(chunk) {
              if (streamWritable.writableNeedDrain || !streamWritable.write(chunk)) {
                backpressurePromise = createDeferredPromise();
                return SafePromisePrototypeFinally(
                  backpressurePromise.promise, () => {
                    backpressurePromise = undefined;
                  });
              }
            },
    
            abort(reason) {
              destroy(streamWritable, reason);
            },
    
            close() {
              if (closed === undefined && !isWritableEnded(streamWritable)) {
                closed = createDeferredPromise();
                streamWritable.end();
                return closed.promise;
              }
    
              controller = undefined;
              return PromiseResolve();
            },
          }, strategy);
        }
    
        function newReadableWritablePairFromDuplex(duplex) {
          ...
    
          const writable =
            isWritable(duplex) ?
              newWritableStreamFromStreamWritable(duplex) :
              new WritableStream();
    
          if (!isWritable(duplex))
            writable.close();
    
          const readable =
            isReadable(duplex) ?
              newReadableStreamFromStreamReadable(duplex) :
              new ReadableStream();
    
          if (!isReadable(duplex))
            readable.cancel();
    
          return { writable, readable };
        }
    

就是通过 `newWritableStreamFromStreamWritable()` 创建一个与传进来的双工流联立的 Service Worker API 中的 `WritableStream`，以及通过 `newReadableStreamFromStreamReadable()` 创建对应的 `ReadableStream`。

### `newWritableStreamFromStreamWritable()`

        function newWritableStreamFromStreamWritable(streamWritable) {
          ...
          return new WritableStream({
            ...
    
            async write(chunk) {
              if (streamWritable.writableNeedDrain || !streamWritable.write(chunk)) {
                backpressurePromise = createDeferredPromise();
                return SafePromisePrototypeFinally(
                  backpressurePromise.promise, () => {
                    backpressurePromise = undefined;
                  });
              }
            },
    
            ...
          }, strategy);
        }
    

就是新建一个 `WritableStream`，并且在它的 `write()` 函数中往传进来的 `streamWritable` 写入内容（`streamWritable.write()`）。

### `newReadableStreamFromStreamReadable()`

        function newReadableStreamFromStreamReadable(streamReadable, options = kEmptyObject) {
          ...
    
          let controller;
          function onData(chunk) {
            // Copy the Buffer to detach it from the pool.
            if (Buffer.isBuffer(chunk) && !objectMode)
              chunk = new Uint8Array(chunk);
            controller.enqueue(chunk);
            if (controller.desiredSize <= 0)
              streamReadable.pause();
          }
    
          ...
    
          streamReadable.on('data', onData);
          return new ReadableStream({
            start(c) { controller = c; },
    
            pull() { streamReadable.resume(); },
    
            cancel(reason) {
              destroy(streamReadable, reason);
            },
          }, strategy);
        }
    

逻辑也很简单，创建一个 `ReadableStream`，并监听 `streamReadable` 的 `data` 事件。在事件监听中通过 `ReadableStream` 所创建的 `controller` 往 `ReadableStream` 推入事件里面传进来的数据（`controller.enqueue()`）。

如此一来，二者就明晰了。其实 `CompressionStream` 和 `UncompressionStream` 在 Node.js 就是个造熊猫的过程。

![22流程图6.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15eb72f908914ef4bc59ebb120b050c1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=930&h=1332&s=248969&e=png&b=fefefe)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e243274dc8b84abdb6ef341d8f1acca9~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=225&h=225&s=91015&e=png&b=35342e)

本章小结
----

Node.js 原来有 `zlib` 内置模块，支持 `DEFLATE`、`GZIP`、`DEFLATERAW` 格式。后来在 Node.js v10 之后，强势加入 Brotli 的支持。但是为它再加个 `brotli` 模块又太多余，跟 `zlib` 模块一起改个像 `compress` 类似的模块又不想下兼容，所以只能把它也归入 `zlib` 中来。

本章我们介绍了 zlib 库的使用方式（但并不介绍算法具体内容），并向大家展示了 Node.js 中是如何使用 zlib 库的，以及各种类之间的关系。

![22流程图7.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7e9fb97c4634380951b96b0c2bbc320~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=2764&h=1438&s=279405&e=png&b=fefefe)

最后，为大家介绍了 Winter 中所指定的 `CompressionStream` 与 `UncompressionStream`，并讲述了其造🐼的过程——如何将原来 Node.js 的变形金刚流拆成有联立关系的 Service Worker 下的 `ReadableStream` 和 `WritableStream`，并将其组合成 `CompressionStream`。