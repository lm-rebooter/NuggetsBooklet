上一章我们讲了 Node.js 中的 Winter API 之 `URL`。本章我们来讲讲 `crypto` 与 `WebCrypto`。

`crypto`
--------

首先是 Node.js 中 Legacy 的密码学模块 `crypto`。其提供了用于处理加密功能的类和函数，包括哈希函数、HMAC、加密、解密、签名、以及验证等功能。用 Node.js 自身的话说就是：

> 一组对 OpenSSL 的哈希、HMAC、加密、解密、签名和验证功能的封装。

划重点，OpenSSL。也就是说，实际上 `crypto` 就是一组 OpenSSL 的函数在 JavaScript 侧的导出。

> ### OpenSSL
> 
> OpenSSL 是一个强大的安全套接字层密码库，包含了丰富的加密工具，可以为网络连接提供安全通信。不过，虽然它功能强大且完备，但用起来还是有比较高的复杂性。**若要正确地使用它，开发者需要理解加密的基本概念以及** **SSL** **/** **TLS** **协议。**
> 
> 我就吃亏在这里，基本上就是简单地使用，或者在调用一些 HTTP API 的时候照着文档所需的加密方式进行参数的加工，所以本章应该写不了多少内容。但我可以讲故事呀。下面稍微讲讲有关 OpenSSL 的三件事情吧。
> 
> #### Heartbleed Bug（心脏出血漏洞）
> 
> 这是 OpenSSL 历史上最严重的安全漏洞之一，发生在 2014 年。该漏洞是由于 OpenSSL 的一个函数存在缺陷，攻击者可以通过这个漏洞获取大量的内存数据，包括 SSL 私钥、用户名和密码等敏感信息。这个漏洞在被发现后迅速引起了全球范围内的关注和恐慌，因为大量的网站和服务都使用了 OpenSSL。这就像一场心脏病发作一样让人措手不及。这个漏洞就像一扇开着的窗户，任由小偷随意进出。该个“小偷”不仅能够偷走我们的私人物品（比如 SSL 私钥和密码），甚至还能偷走我们的名字（用户名）。这让世界范围内的网络安全人员纷纷大呼：这病得治！比如加拿大税务局（CRA）称，900 纳税人的社会保险号码遭窃，并表示在 2014 年 4 月 8 日的 6 个小时内，有人利用了该漏洞得到了这些数据。在发现攻击后，该机构关闭了网站，并将纳税人的申报期限从 4 月 30 日延长至了 5 月 5 日。该机构表示，将向任何受影响的人提供信誉保障服务，不收取任何费用。4 月 16 日，皇家加拿大骑警宣布，他们已掌握了一名与该盗窃有关的工程学学生信息，并指控其“未经授权使用电脑”及“有关数据的恶作剧”。
> 
> #### 随机数生成问题
> 
> 2006 年，一名 Debian 维护者为了解决一个 Valgrind 的问题，注释掉 OpenSSL PRNG 里的两行代码。但是这两行代码非常重要，它们负责抓取几乎所有的不可预测的熵，以作为 OpenSSL PRNG 的随机种子。没有这两行代码，PRNG 只有总共 32767 个选择可作为种子，其随机数生成器产生的随机数极度有限，大大降低了生成的密钥的安全性。就像一个抽奖箱，里面只有十张彩票。由于该错误，这个“抽奖箱”生成的“随机”数字极度有限，就像你每次抽奖都抽到同样的奖品。那时的密钥就像是被剧透的电影，失去了所有的神秘感。
> 
> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/958c3e244bb646bdac2abf2fc46203a9~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=304&h=166&s=45203&e=png&b=faf4f8)
> 
> #### 资金和维护问题
> 
> 尽管 OpenSSL 是许多重要系统和服务的核心组件，但长期以来，它一直由一个小团队在资金紧张的情况下维护。在心脏出血漏洞事件之后，这个问题引起了人们的关注，因为人们意识到了对这种重要的开源项目进行适当资助和维护的重要性。在发现上述漏洞时，OpenSSL 仅有少数志愿者负责维护，其中只有一人将其作为全职工作。每年 OpenSSL 项目收到的捐款大约为 2000 美元。

### `Hash`

为了让大家看看 `crypto` 确实是对于 OpenSSL 赤裸裸的封装，我们进入接下去熟悉的环节。节约篇幅，我们只看 `Hash` 相关内容。

#### `crypto.getHashes()`

首先是 `crypto.getHashes()` 函数，它返回的是 Node.js 所支持的哈希（Hash）算法数组，也称摘要（Digest）算法。

> 密码学中的哈希（Hash）算法和普通的哈希算法不是同一个概念。从安全的角度考虑，密码学中的哈希算法除了有普通哈希算法的特性之外，还有其他的一些特性。
> 
> **“** **哈希** **（** **hash** **）”和“摘要（digest）”这两个术语在密码学中都被用来指代哈希函数的输出。** 这两个词都是从这个函数的特性和用途中得出的。
> 
> 哈希函数将任意长度的输入数据处理成固定长度的输出，这个输出通常被称为哈希值或哈希码。这个处理过程是一种“消化”过程，因为它将大量的输入数据“消化”成一个小的、固定长度的输出。因此，哈希值也常常被称为“摘要”（digest），就像是一本书的摘要可以给你提供整本书的主要内容一样，哈希值也可以代表输入数据的“摘要”。
> 
> 然而，需要注意的是，虽然哈希值可以代表输入数据，但由于哈希函数的单向性，你不能从哈希值恢复原始的输入数据。这是哈希函数在密码学和数据完整性校验中的重要应用。

我们 `crypto.getHashes()` 几乎是透传了 C++ 侧的 `GetHashes()`，唯一做了加工的是，在 `GetHashes()` 的返回值上做了去重操作，以及对其返回值做缓存。

    const getHashes = cachedResult(() => filterDuplicateStrings(_getHashes()));
    

这里的 `cachedResult()` 是生成一个函数，该函数会返回传进去的函数的返回值，若已经调用过里面的函数，则直接返回缓存下来的值；`filterDuplicateStrings()` 则是将传进来的数组进行去重，且不区分大小写，把重复的值去掉。

> **留一题：** 试着实现这两个函数吧。
> 
> **答案：** [github.com/nodejs/node…](https://github.com/nodejs/node/blob/v18.16.0/lib/internal/util.js#L241-L262 "https://github.com/nodejs/node/blob/v18.16.0/lib/internal/util.js#L241-L262")

上面 `_getHashes()` 就是 C++ 侧的该函数了。继续划重点：**一组对** **OpenSSL** **的哈希、HMAC、加密、解密、签名和验证功能的封装**。也就是说其所支持的哈希算法是 OpenSSL 所支持的。看看 `GetHashes()` 都返回了哪些值吧。

    void Hash::GetHashes(const FunctionCallbackInfo<Value>& args) {
      Environment* env = Environment::GetCurrent(args);
      MarkPopErrorOnReturn mark_pop_error_on_return;
      CipherPushContext ctx(env);
      EVP_MD_do_all_sorted(
        array_push_back<EVP_MD>,
        &ctx);
      args.GetReturnValue().Set(ctx.ToJSArray());
    }
    

前后几行代码不重要，主要看它调用了 `EVP_MD_do_all_sorted`。

`EVP_MD_do_all_sorted` 函数针对所有已注册的消息摘要算法，用于遍历和执行操作的函数。它的主要目的是按照字典序对已注册的摘要算法进行遍历，同时对每一个遍历到的算法执行特定的操作。

当调用 `EVP_MD_do_all_sorted` 函数时，我们需要传递一个回调函数作为参数。这个回调函数将在每一个已注册的消息摘要算法上执行。通过这种方式，你可以对所有已注册的哈希算法执行任意操作，例如打印算法名称或检查算法的某些属性。

而 Node.js 中传入这个函数的回调函数是一个模板函数 `array_push_back<EVP_MD>`，它里面的逻辑就是把每次遍历到的哈希算法字符串推入 `ctx` 所包含的数组当中。简单理解就类似这样：

    function getHashes() {
      const ctx = [];
      const forEachAlgorithm = EVP_MD_do_all_sorted;
      forEachAlgorithm((name, ctx) => {
        ctx.push(name);
      }, ctx);
    
      return ctx;
    }
    

看吧，就是 OpenSSL 支持什么算法，就遍历一遍把所有算法名都拿出来，最终作为 `getHashes()` 的返回值。所以，最终值就是 OpenSSL 所支持的内容：`['DSA', 'DSA-SHA', 'DSA-SHA1', ...]`。

#### OpenSSL 与 Node.js 的哈希

如果我们自己在 C/C++ 中用 OpenSSL 做摘要，通常步骤是这样的：

1.  初始化；
2.  不断重复更新内容；
3.  获得摘要。

跟 Node.js 中 `crypto` 的 `Hash` 是不是异曲同工呢？应该反过来说，Node.js 中 `crypto` 的 `Hash` 步骤是不是跟 OpenSSL 异曲同工呢？

以 SHA512 为例，这三步分别对应三个函数：

     int SHA512_Init(SHA512_CTX *c);
     int SHA512_Update(SHA512_CTX *c, const void *data, size_t len);
     int SHA512_Final(unsigned char *md, SHA512_CTX *c);
    

用这三个函数写一个最简单的 C 程序就是这样的：

    #include <stdio.h>
    #include <string.h>
    #include <openssl/sha.h>
    int main() {
        unsigned char digest[SHA512_DIGEST_LENGTH];
        const char* string = "hello world";
        
        SHA512_CTX ctx;
        SHA512_Init(&ctx);
        SHA512_Update(&ctx, string, strlen(string));
        SHA512_Final(digest, &ctx);
        
        char mdString[SHA512_DIGEST_LENGTH*2+1];
        for (int i = 0; i < SHA512_DIGEST_LENGTH; i++)
            sprintf(&mdString[i*2], "%02x", (unsigned int)digest[i]);
    
        printf("SHA512 digest: %s\n", mdString);
        return 0;
    }
    

`SHA512_Init()`、`SHA512_Update()`、`SHA512_Final()` 一气呵成。如果换成 Node.js 的 `crypto`，那就是：

    const { createHash } = require('crypto');
    
    const hash = createHash('sha512');
    hash.update('some data to hash');
    console.log(hash.digest('hex'));
    

也是一气呵成，`createHash()` 对应 `<算法>_Init`；`hash.update()` 对应 `<算法>_Update()`；`hash.digest()` 对应 `<算法>_Final()`。所以不要问为什么这些 API 设计起来要初始化、更新、摘要三步走，因为 OpenSSL 的 API 就长这样。

事实上，Node.js 的这三个函数并非直接用的 `<算法>_Init()` 这些函数，而是用的 OpenSSL 更通用的函数。例如 `SHA512_Init` 是一个特定的函数，它只用于初始化 SHA-512 哈希计算。你只能使用它来开始一个新的 SHA-512 哈希计算。相比之下，你可以使用它来初始化任何 OpenSSL 支持的摘要算法，包括但不限于 SHA-512。只需在参数里面指明算法即可。这是精炼下来 `createHash()` 的逻辑：

    const Utf8Value hash_type(env->isolate(), args[0]);  // 获取传进来的算法名（如 sha512）
    const EVP_MD* md = EVP_get_digestbyname(*hash_type);  // 根据算法名获取 Init 所需参数a
    EVP_MD_CTX* ctx = EVP_MD_CTX_new();
    EVP_DigestInit_ex(ctx, md, nullptr);  // 把带有算法信息的 md 参数传进去，相当于 <算法>_Init()
    

这么一来，就可以不用各种 `if-else` 或者 `switch-case` 来枚举所有的哈希算法了，只用一个 `EVP_DigestInit_ex()` 就搞定。

然后是 `hash.update()`。同理也不是直勾勾用 `<算法>_Update()`，而是 `EVP_DigestUpdate()`。

    return EVP_DigestUpdate(ctx, data, len) == 1;
    

`ctx` 就是上面 `EVP_MD_CTX_new()` 创建的那个，`data` 和 `len` 分别指 JavaScript 传进来的数据及其长度。`hash.digest()` 也好说，就是 `EVP_DigestFinal_ex()`。

    int ret = EVP_DigestFinal_ex(
        ctx, digest.data<unsigned char>(), &len);
    

后面两个参数用于接收最终摘要的内容及其长度用的。

`WebCrypto`
-----------

`WebCrypto` 同样在 Winter 标准的 Minimum Common Web Platform API 中。一共四项。

内容

说明

`globalThis.crypto`

这是一个只读的属性，它返回一个 `Crypto` 对象，该对象允许访问用于密码学操作的 Web API。比如，你可以使用 `globalThis.crypto.subtle` 来访问 `SubtleCrypto` 对象，或者使用 `globalThis.crypto.getRandomValues` 来生成安全的随机数。

`globalThis.Crypto`

`global.crypto` 所对应的类。`Crypto` 接口代表了基本的密码学特性。它允许你访问密码学功能，但本身并没有提供任何函数。它的所有功能都在它的 `subtle` 属性（一个 `SubtleCrypto` 对象）中，或者在它的方法 `getRandomValues` 中。

`globalThis.CryptoKey`

代表了密码学操作中使用的密钥的类。其不能直接使用，需要通过 `SubtleCrypto` 的方法（如 `generateKey`，`importKey`，`exportKey` 等）来创建。

`globalThis.SubtleCrypto`

提供了一系列密码学功能，`crypto.subtle` 所对应的类。这个对象只能通过 `Crypto` 对象的 `subtle` 属性访问。它提供了一系列方法，可以用于执行诸如密钥生成、加密、解密、签名验证等复杂的密码学操作。

这四项中，只有 `globalThis.crypto` 可直接使用，其余三项都是 `globalThis.crypto` 中某一项所对应的类、原型等。比如 `crypto.subtle.generateKey()` 的返回值就是一个 `CryptoKey` 的实例，可用 `instanceof` 来检查。

在 Node.js v18 中，我们可通过 `require('crypto').webcrypto` 来拿到对标 `globalThis.crypto` 的对象。在 Node.js v20 中，则这个 `require('crypto').webcrypto` 被挂载在了 `globalThis.crypto` 下，可直接使用了。

从这里可以看出来，Node.js 真的有在往 WinterCG 靠近；而 Deno 则本来就是 WinterCG 的最初撺掇方之一，这块 API 就是有的：[deno.land/api@v1.33.3…](https://deno.land/api@v1.33.3?s=Crypto "https://deno.land/api@v1.33.3?s=Crypto") ；Cloudflare Workers 也一样：[developers.cloudflare.com/workers/run…](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/ "https://developers.cloudflare.com/workers/runtime-apis/web-crypto/") 。

> 可以理解为 WebCrypto 的所有入口都在 `crypto.subtle` 或 `crypto.getRandomValues()` 中。而 `subtle` 则是 `SubtleCrypto` 的实例。有关 `SubtleCrypto` 的内容可翻阅 MDN：[developer.mozilla.org/en-US/docs/…](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto") 。

Node.js 的 `crypto` 是 OpenSSL 所支持的算法中近乎所有算法的封装。而 `WebCrypto` 规范仅定义了部分算法。

下表是 `WebCrypto` 规范中所支持的各种算法。

**[sign()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign")** **[verify()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/verify "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/verify")**

**[encrypt()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt")** **[decrypt()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt")**

**[digest()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest")**

**[deriveBits()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveBits "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveBits")** **[deriveKey()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey")**

**[wrapKey()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/wrapKey "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/wrapKey")** **[unwrapKey()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/unwrapKey "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/unwrapKey")**

**RSASSA-PKCS1-v1\_5**

✅

**RSA-PSS**

✅

**ECDSA**

✅

**HMAC**

✅

**RSA-OAEP**

✅

✅

**AES-CTR**

✅

✅

**AES-CBC**

✅

✅

**AES-GCM**

✅

✅

**SHA-1**

✅

**SHA-256**

✅

**SHA-384**

✅

**SHA-512**

✅

**ECDH**

✅

**HKDF**

✅

**PBKDF2**

✅

**AES-KW**

✅

### Hash

这里我们同样用哈希举例。`WebCrypto` 中的哈希函数是 `subtle.digest()`。从上面的表格中可以看出，`WebCrypto` 的哈希只支持 `SHA-1`、`SHA-256`、`SHA-384` 和 `SHA-512` 四种算法。接下去让我们来输出一下 Node.js 的 `require('crypto').getHashes()`：

    ["RSA-MD4","RSA-MD5","RSA-MDC2","RSA-RIPEMD160","RSA-SHA1","RSA-SHA1-2","RSA-SHA224","RSA-SHA256","RSA-SHA3-224","RSA-SHA3-256","RSA-SHA3-384","RSA-SHA3-512","RSA-SHA384","RSA-SHA512","RSA-SHA512/224","RSA-SHA512/256","RSA-SM3","blake2b512","blake2s256","id-rsassa-pkcs1-v1_5-with-sha3-224","id-rsassa-pkcs1-v1_5-with-sha3-256","id-rsassa-pkcs1-v1_5-with-sha3-384","id-rsassa-pkcs1-v1_5-with-sha3-512","md4","md4WithRSAEncryption","md5","md5-sha1","md5WithRSAEncryption","mdc2","mdc2WithRSA","ripemd","ripemd160","ripemd160WithRSA","rmd160","sha1","sha1WithRSAEncryption","sha224","sha224WithRSAEncryption","sha256","sha256WithRSAEncryption","sha3-224","sha3-256","sha3-384","sha3-512","sha384","sha384WithRSAEncryption","sha512","sha512-224","sha512-224WithRSAEncryption","sha512-256","sha512-256WithRSAEncryption","sha512WithRSAEncryption","shake128","shake256","sm3","sm3WithRSAEncryption","ssl3-md5","ssl3-sha1","whirlpool"]
    

`WebCrypto` 中只定义了一系列最常用的算法，而 Node.js 的 `digest()` 则是其全集。

我们在之前说了，一个 Web-interoperable Runtime 的定义是宽松的，只需是交集即可。交集意味着可以是子集、全集、超集和交集。Cloudflare Workers 的 `WebCrypto` 中 `.digest()` 函数就是一个超集，它额外支持了 MD5 算法。以下是它对于 `subtle.digest()` 支持 MD5 的说法：

> MD5 is not part of the WebCrypto standard but is supported in Cloudflare Workers for interacting with legacy systems that require MD5. MD5 is considered a weak algorithm. Do not rely upon MD5 for security.

翻译过来是：MD5 不是 WebCrypto 标准的一部分，但在 Cloudflare Workers 中得到了支持，以便与需要 MD5 的旧系统进行交互。MD5 被认为是一种弱算法。请不要依赖 MD5 来保证安全性。

总结起来五个字：**时代的眼泪**。

Node.js 中 `WebCrypto` 的 `.digest()` 函数一样是通过 `EVP_DigestInit_ex()`、`EVP_DigestUpdate()` 和 `EVP_DigestFinal_ex()` 等函数来完成四种的实现的。所以理论上是跟 `crypto.createHash()` 一样有能力支持 OpenSSL 所支持的任意算法。只不过受 WebCrypto 标准所限，它在 `.digest()` 函数中直接被限定死了。

    async function digest(algorithm, data) {
      ...
    
      algorithm = normalizeAlgorithm(algorithm, 'digest'); // 格式化算法名
      return Reflect.apply(asyncDigest, this, [algorithm, data]); // 调用 asyncDigest
    }
    
    async function asyncDigest(algorithm, data) {
      ...
    
      switch (algorithm.name) {
        case 'SHA-1':
          // Fall through
        case 'SHA-256':
          // Fall through
        case 'SHA-384':
          // Fall through
        case 'SHA-512':
          return jobPromise(() => new HashJob(
            kCryptoJobAsync,
            normalizeHashName(algorithm.name),
            data));
      }
    
      throw lazyDOMException('Unrecognized algorithm name', 'NotSupportedError');
    }
    

`digest` 在参数什么的都弄好之后，就去调用 `asyncDigest()`。而后者函数直接通过一个 `switch` 将算法限定在了 WebCrypto 中所定义的四种算法里面了。也就是说，如果我们想支持 MD5，直接在 `switch` 中加一个 `case 'MD5'` 即可。而再进去在 `HashJob` 中，就是在 C++ 侧调用 OpenSSL 的那仨函数了。

这里指的注意的一点是，`crypto` 的 `Hash` 中 `update()` 和 `digest()` 都是同步的；而 `WebCrypto` 中的 `.digest()` 则是异步的。`jobPromise()` 就是创建一个 `Promsie`，并执行回调函数所创造的 `HashJob` 对象的 `run()`，并将 `resolve` 和 `reject` 存储在 `HashJob` 中，等待异步执行完之后由 `HashJob` 主动调用。

在 `HashJob` 内部，是通过 `uv_queue_work()` 来异步执行代码的。

> #### `uv_queue_work()`
> 
> `uv_queue_work()` 是 libuv 库中的一个函数，用于在 libuv 的工作线程池中排队执行一项任务。它的原理是启动一堆线程池，线程池中每条线程都是一个死循环。线程每次循环中，若当前任务队列中有任务，则执行任务；若没有任务，则挂起等待信号。每次 `uv_queue_work()` 时，都会往任务队列中加入任务函数，并发送“任务来了”的信号。这个时候若有线程挂起等待信号中，则会被该信号通知，并继续后续循环。
> 
> 可以简单理解为（实际上代码比下面这个复杂很多）：
> 
>     // 线程函数
>     static void worker(void* arg) {
>       ...
>       for (;;) {
>         ...
>         if (没任务了) {
>           空闲线程++;
>           等待信号();
>           空闲线程--;
>         }
>     
>         ...处理下一个任务...
>       }
>     }
>     
>     // 会在程序中一次性初始化
>     void init_threads() {
>       // 默认 4 条线程
>       nthreads = ARRAY_SIZE(default_threads);
>       if (需要更多线程) {  // 如 UV_THREADPOOL_SIZE 环境变量
>         nthreads = 更多线程数;
>         扩充 default_threads 数组;
>       }
>     
>       // 创建 nthreads 条线程，每条线程都执行 `worker` 函数
>       for (i = 0; i < nthreads; i++)
>         uv_thread_create(threads + i, worker, ...);
>     
>       ..
>     }
>     
>     int uv_queue_work(uv_loop_t* loop,
>                       uv_work_t* req,
>                       uv_work_cb work_cb,
>                       uv_after_work_cb after_work_cb) {
>       ...
>       插入队尾(req, work_cb, after_work_cb, ...);
>       if (空闲线程 > 0) {
>         发送信号();
>       }
>     }
>     
> 
> 那么，处理完任务之后，这个在另一个线程中处理的任务是怎么回到主事件循环，回到 `Promise` 的 `resolve` 呢？
> 
> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2d3c3a193ed4baeb979ac94b349c25f~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=480&h=360&s=2050458&e=gif&f=30&b=c9d1d5)
> 
> 当然是用静电棒吸回来呀！另一个线程在执行完任务后，通过 `uv_async_t`，把任务完成的消息“告知”主事件循环。然后主事件循环在下一个 Poll I/O 阶段中就会得到这个消息，然后就可以处理后续内容了。`uv_async_t` 的本质通过“写”一个字节来触发 I/O 事件，无论什么时候在哪个线程“写”一个字节，下次在 Poll I/O 阶段中就可以收到这个事件了。
> 
> ![21流程图1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9e0b929bc294adfb20e15a62e36b0e5~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1260&h=1830&s=332210&e=png&b=fefefe) ![21流程图2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f528684916f48868e5b3b8c71be65c4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1260&h=1802&s=261624&e=png&b=ffffff) ![21流程图3.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/816acbe6127343e894c6db972ffd4ece~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1278&h=712&s=105948&e=png&b=ffffff)
> 
> 上面 Poll I/O 阶段收到 `uv_async_t` 的事件后，知道这次事件是关联给这个哈希计算的。所以会调用上面那个 `jobPromise()` 所生成的 `Promise` 的 `resolve()` 函数，并把计算结果传给 `resolve()`，整条逻辑就接上了。用之前那种图示意，就是：
> 
> ![21流程图4.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5905f0011fcd4172be226fc5294005f7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1534&h=800&s=235451&e=png&b=edebe5)

而真正在线程任务中执行的就是我们上面提到的三个函数三步走了：`EVP_DigestInit_ex()`、`EVP_DigestUpdate()` 和 `EVP_DigestFinal_ex()`。

### `encrypt/decrypt` 与 `wrapKey/unwrapKey`

`encrypt` 和 `wrapKey` 都是 Web Crypto API 中 SubtleCrypto 接口的方法，分别用于加密数据和封装密钥。以下是它们的主要作用：

1.  `encrypt`: 这个方法用于对数据进行加密。它接收一个包含加密算法的信息和用于加密的密钥作为参数，以及要加密的数据；返回的结果是一个包含加密数据的 `ArrayBuffer`；
    
2.  `wrapKey`: 这个方法用于封装一个密钥，也就是将一个密钥加密成可以安全传输或存储的格式。这通常在需要在不同的环境（比如不同的服务器或应用）之间共享密钥时使用。它接收一个包含加密算法信息的对象，要封装的密钥，用于封装的密钥，以及封装后的密钥的格式（如 "raw"，"pkcs8"，"spki"，"jwk"）作为参数。返回的结果是一个包含封装后的密钥的 `ArrayBuffer`。
    

`encrypt` 和 `wrapKey` 都是 Web Crypto API 提供的用于加密操作的方法。不同的是，`encrypt` 主要用于加密普通的数据，而 `wrapKey` 则专门用于封装（加密）密钥。

`decrypt` 与 `unwrapKey` 作用于上面俩函数相反。但这四个函数最终都调用同一个函数：`cipherOrWrap(mode, algorithm, key, data, op)`，并传入参数。

*   `mode`：`kWebCryptoCipherEncrypt` 或 `kWebCryptoCipherDecrypt`，表示是加密还是解密；`wrapKey` 也算加密，`unwrapKey` 也算解密；
    
*   `algorithm`：算法，我们从上面表格中可以看到，`encrypt` 与 `wrapKey` 所支持的算法几乎一致，除了 `wrapKey` 还多一种 `AES-KW`；
    
*   `key`：密钥，如果是 `wrapKey` 和 `unwrapKey`，则该值表示用于加解密密钥的密钥，即 `wrapKey()` 中的 `wrappingKey` 参数；
    
*   `data`：待加解密的数据，如果是 `wrapKey`，则该数据为待加解密密钥的展开数据，即 `exportKey()` 的结果；
    
*   `op`：操作命令，只有四种：`encrypt`、`decrypt`、`wrapKey` 和 `unwrapKey`。
    

而这个 `cipherOrWrap()` 函数则是根据不同的参数内容和算法，调用不同算法函数：

    async function cipherOrWrap(mode, algorithm, key, data, op) {
      ...
    
      switch (algorithm.name) {
        case 'RSA-OAEP':
          return require('internal/crypto/rsa')
            .rsaCipher(mode, key, data, algorithm);
        case 'AES-CTR':
          // Fall through
        case 'AES-CBC':
          // Fall through
        case 'AES-GCM':
          return require('internal/crypto/aes')
            .aesCipher(mode, key, data, algorithm);
        case 'AES-KW':
          if (op === 'wrapKey' || op === 'unwrapKey') {
            return require('internal/crypto/aes')
              .aesCipher(mode, key, data, algorithm);
          }
      }
      throw lazyDOMException('Unrecognized algorithm name', 'NotSupportedError');
    }
    

可以看到，如果是 `RSA-OAEP`，则调用 `rsaCipher()`；如果是 `AES-CTR`、`AES-CBC`、`AES-GCM`，则调用 `aesCipher()`；`AES-KW` 比较特殊，虽然也是调用的 `aesCipher()`，但只给 `wrapKey` 和 `unwrapKey` 用，这个我们从表格中也能看出来。而这俩函数到最后对应的是 C++ 侧的 `AESCipherJob` 与 `RSACipherJob`，也是用的 `jobPromsie()` 包起来，所以 C++ 底层是一个异步通过 `uv_queue_work` 执行的任务。

关于这四个函数，最终也是 OpenSSL 三步走：

1.  `EVP_CipherInit_ex`：根据算法、密钥等初始化一个 `Cipher`；
    
2.  `EVP_CipherUpdate`：将待加解密数据更新进去；
    
3.  `EVP_CipherFinal_ex`：得到最终结果。
    

是不是跟哈希那块很像？其实都是换汤不换药的。

本章小结
----

本章我们深入了解了 Node.js 中的 legacy `crypto` 模块，以及如何将其与 Winter 中的 WebCrypto 标准进行融合。

二者均是基于 OpenSSL 进行的封装。`crypto` 相对封装更加裸一些，而 WebCrypto 标准则是更上层的一些封装。但在 API 内部，都逃不开 OpenSSL 的三步走：`init`、`update` 和 `final`。

由于我对密码学不熟悉，我还列了三个 OpenSSL 的小故事来水字数，而当年 OpenSSL 的少量维护团队真的是应了下面这张图。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2de79da736a44c6883dfbcec473d2a82~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=385&h=489&s=51091&e=png&b=f6f6f6)