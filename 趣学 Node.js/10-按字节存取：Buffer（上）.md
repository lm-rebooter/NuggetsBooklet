Buffer，操作一块内存块里面的内容。这对于一个服务端的应用来说，是必不可缺的功能之一。很多数据的传输，内容并不是明文的，而是经过序列化过的特殊格式的数据，如 Dubbo、Protobuf、MessagePack 等。再比如，与 MySQL 之间的数据传输，也是按某种格式进行序列化的。这个时候，如果需要按字节解析某块数据，`Buffer` 就很必须了。

在 Node.js 中，`Buffer` 存在于 `buffer` 内置模块中。不过现在的 Node.js 也已经[直接把 `Buffer` 挂载在了 `globalThis` 上](https://github.com/nodejs/node/blob/v18.14.2/lib/internal/bootstrap/node.js#L432-L458 "https://github.com/nodejs/node/blob/v18.14.2/lib/internal/bootstrap/node.js#L432-L458")：

    ...
    setupBuffer();
    ...
    function setupBuffer() {
      const {
        Buffer,
      } = require('buffer');
      const bufferBinding = internalBinding('buffer');
    
      // Only after this point can C++ use Buffer::New()
      bufferBinding.setBufferPrototype(Buffer.prototype);
      delete bufferBinding.setBufferPrototype;
      delete bufferBinding.zeroFill;
    
      // Create global.Buffer as getters so that we have a
      // deprecation path for these in ES Modules.
      // See https://github.com/nodejs/node/pull/26334.
      let _Buffer = Buffer;
      ObjectDefineProperty(globalThis, 'Buffer', {
        __proto__: null,
        get() {
          return _Buffer;
        },
        set(value) {
          _Buffer = value;
        },
        enumerable: false,
        configurable: true,
      });
    }
    

`Buffer` 的本质是什么？
----------------

### 黑暗时代 v0.x

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43ad21ee07584acfbf781a62361683bf~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=719&h=429&s=624762&e=png&b=818e3f)

在很多个大版本之前（特指 v0.x 阶段），Node.js 的 `Buffer` 内存完全由自己管理，直接在 `Buffer` 的构造函数阶段[通过 malloc 来分配内存](https://github.com/nodejs/node/blob/v0.12/src/node_buffer.cc#L155 "https://github.com/nodejs/node/blob/v0.12/src/node_buffer.cc#L155")：

    data = static_cast<char*>(malloc(length));
    

并通过 [V8 对象的 SetIndexedPropertiesToExternalArrayData 方法](https://github.com/nodejs/node/blob/v0.12/src/smalloc.cc#L342-L352 "https://github.com/nodejs/node/blob/v0.12/src/smalloc.cc#L342-L352")来将其绑定给指定 V8 对象做关联：

    void Alloc(Environment* env,
               Handle<Object> obj,
               char* data,
               size_t length,
               enum ExternalArrayType type) {
      assert(!obj->HasIndexedPropertiesInExternalArrayData());
      env->isolate()->AdjustAmountOfExternalAllocatedMemory(length);
      size_t size = length / ExternalArraySize(type);
      obj->SetIndexedPropertiesToExternalArrayData(data, type, size);
      CallbackInfo::New(env->isolate(), obj, CallbackInfo::Free);
    }
    

所以，在 N 个版本前，`Buffer` 的本质是一个 `Buffer` 对象以及一块与其绑定的由 Node.js 管理的内存的组合。到 Node.js v4.0 之后就不这样了，它基于 ECMAScript 中的 `ArrayBuffer` 来完成内存块的各种活动。内存就不是通过裸的 `malloc` 由 Node.js 直接管理了。

### 城堡时代

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2de7e4fb1024445683dc2241c34ca219~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1024&h=620&s=1247748&e=png&b=828a3e)

自从 Node.js 与 io.js 合并后，Node.js 就从刀耕火种的阶段进入了耒耜耕种的阶段。把这一块的生命周期交给 V8 的 `ArrayBuffer` 管理，并有了“池化”的概念。我们本章就讲 `Buffer`，被遗弃的 `SlowBuffer` 这类就不讲了。所以剩下的就是 `FastBuffer` 了。可能有的读者觉得奇怪。诶？明明不是 `Buffer` 吗？让我们来看看 `Buffer` 是怎么写的吧：

    function Buffer(arg, encodingOrOffset, length) {
      showFlaggedDeprecation();
      // Common case.
      if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
          throw new ERR_INVALID_ARG_TYPE('string', 'string', arg);
        }
        return Buffer.alloc(arg);
      }
      return Buffer.from(arg, encodingOrOffset, length);
    }
    
    ObjectDefineProperty(Buffer, SymbolSpecies, {
      __proto__: null,
      enumerable: false,
      configurable: true,
      get() { return FastBuffer; }
    });
    

这里先剧透 `Buffer.alloc()` 和 `Buffer.from()` 内部都是返回 `FastBuffer`。那么为什么它的 `instanceOf` 或者 `constructor` 看出来居然是 `Buffer` 呢？就是[它干的](https://github.com/nodejs/node/blob/v18.14.2/lib/buffer.js#L135-L137 "https://github.com/nodejs/node/blob/v18.14.2/lib/buffer.js#L135-L137")：

    FastBuffer.prototype.constructor = Buffer;
    Buffer.prototype = FastBuffer.prototype;
    addBufferPrototypeMethods(Buffer.prototype);
    

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a9e3ae4aabf48a798d578325fb4363e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=600&h=762&s=224255&e=png&b=0c164a)

除了 `Buffer` 自身的构建函数（这个对于 Node.js 来说，不推荐 `new Buffer()` 这种用法），像 `Buffer.alloc()` 之类的，也是直勾勾地返回了 `FastBuffer`。

    Buffer.alloc = function alloc(size, fill, encoding) {
      assertSize(size);
      if (fill !== undefined && fill !== 0 && size > 0) {
        const buf = createUnsafeBuffer(size);
        return _fill(buf, fill, 0, buf.length, encoding);
      }
      return new FastBuffer(size);
    };
    

那 `FastBuffer` 又是什么呢？

    class FastBuffer extends Uint8Array {
      // Using an explicit constructor here is necessary to avoid relying on
      // `Array.prototype[Symbol.iterator]`, which can be mutated by users.
      // eslint-disable-next-line no-useless-constructor
      constructor(bufferOrLength, byteOffset, length) {
        super(bufferOrLength, byteOffset, length);
      }
    }
    

它就是个 `Uint8Array`！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07bb32bfa8724b41b1694f2947c1a5ca~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=600&h=762&s=225452&e=png&b=0c164a)

所以说，**`Buffer` 的本质就是一个继承自 `Uint8Array` 的子类**，里面添加了许多子类的方法，如 `writeUint8()`：

    function writeU_Int8(buf, value, offset, min, max) {
      value = +value;
      // `checkInt()` can not be used here because it checks two entries.
      validateNumber(offset, 'offset');
      if (value > max || value < min) {
        throw new ERR_OUT_OF_RANGE('value', `>= ${min} and <= ${max}`, value);
      }
      if (buf[offset] === undefined)
        boundsError(offset, buf.length - 1);
    
      buf[offset] = value;
      return offset + 1;
    }
    
    function writeUInt8(value, offset = 0) {
      return writeU_Int8(this, value, offset, 0, 0xff);
    }
    

如果你想进一步证实，可以尝试一下下面的代码：

    const a = Buffer.from('123');
    console.log(a instanceof Uint8Array);  // true
    console.log(a.byteOffset);  // 16
    console.log(a.buffer);      // ArrayBuffer { byteLength: 8192, ... }
    

看吧，它就是个 `Uint8Array` 的子类，而且它所对应的 `buffer` 是一个长达 `8192` 的 `ArrayBuffer`，然后它的 `byteOffset` 是 `16`。不过这个情况下仅限于刚启动 Node.js 就执行上面的代码，而且不同 Node.js 也不一定一致。

这我们就很容易想到 **`Buffer`** **是一个** **`Uint8Array`** **的子类，拥有很多** **`Buffer`** **特有的方法，其背后有一个大的** **`ArrayBuffer`** **池子，然后每次生成一个** **`Buffer`** **的时候，都用了这个池子的一段作为它的载体**。

`ArrayBuffer` 与 `FastBuffer`
----------------------------

我们从前面的内容看，既然某些情况下，一个 `Buffer` 背后是一个很大的 `ArrayBuffer`，那么很容易就可以推导出来该 `ArrayBuffer` 会被不同 `Buffer` 共用，根据 `byteOffset` 和 `length` 不同读不同内存段。而像 `Buffer.alloc()` 这类 API，我们从代码中能看到，它就是一个原原本本的 `Uint8Array` 子类的构造。

### `Buffer.alloc()`

虽说我们提到了池化，但 `Buffer` 也不是处处都池化的。比如还是上面提到的 `Buffer.alloc()`，[你看看](https://github.com/nodejs/node/blob/v18.14.2/lib/buffer.js#L367-L378 "https://github.com/nodejs/node/blob/v18.14.2/lib/buffer.js#L367-L378")：

    Buffer.alloc = function alloc(size, fill, encoding) {
      assertSize(size);
      if (fill !== undefined && fill !== 0 && size > 0) {
        const buf = createUnsafeBuffer(size);
        return _fill(buf, fill, 0, buf.length, encoding);
      }
      return new FastBuffer(size);
    };
    

如果我们不 `fill`，那么就直勾勾返回一个 `new FastBuffer(size)`，它内部相当于跑了 `super(size)`，即 `new Uint8Array(size)`，它的效果除了新增了一些 `Buffer` 特有的方法之外，就是一个直勾勾地构建一个 `Uint8Array`。而如果要 `fill`，暂且不管现在 Node.js 怎么写的，里面那个 `if` 逻辑大概应该长这样：

    if (fill !== undefined && fill !== 0 && size > 0) {
      const buf = new FastBuffer(size);
      size.fill(fill);
    }
    

`Uint8Array` 的 `fill()` 其实与 `Array` 的 `fill()` 差不多，逐个去填充；但是，如果 `fill` 是个某种 `encoding` 下的字符串，那是无法正确填充的。所以，这里 Node.js 就自己给其开辟了一个大内存块（池子）给到某个 `ArrayBuffer`，然后再对其中 `byteOffset` 之后的 `length` 位直接进行内存级别的填充。所以这个 `if` 的内部是分了两块去写，第一块是 [createUnsafeBuffer()](https://github.com/nodejs/node/blob/v18.14.2/lib/internal/buffer.js#L1056-L1068 "https://github.com/nodejs/node/blob/v18.14.2/lib/internal/buffer.js#L1056-L1068")，然后再手动去 `_fill()`。

#### `createUnsafeBuffer()`

    let zeroFill = getZeroFillToggle();
    function createUnsafeBuffer(size) {
      zeroFill[0] = 0;
      try {
        return new FastBuffer(size);
      } finally {
        zeroFill[0] = 1;
      }
    }
    

这里面的 `zeroFill` 与之前 `Timer` 里面的那个 `timeoutInfo` 类似，是为了打破 C++ 侧与 JavaScript 侧性能桎梏的简单标识。如果 `zeroFill[0]` 为 `0` 时，Node.js 内部在创建 `ArrayBuffer` 时，并不会对其对应创建出来的内存块进行初始化置零操作，而读取、操作一块未被初始化的内存，是“不安全”的，所以这个函数名为 `createUnsafeBuffer()`。既然 `createUnsafeBuffer()` 不安全，也就是说它创建出来的 `FastBuffer` 不能直接用，我们得对这块内存进行初始化，这就是后面紧跟着的 `_fill()` 做的事了。

#### `_fill()`

`_fill()` 做的事情[有两步](https://github.com/nodejs/node/blob/v18.14.2/lib/buffer.js#L992-L1061 "https://github.com/nodejs/node/blob/v18.14.2/lib/buffer.js#L992-L1061")：

1.  根据不同需要填充的内容类型，最终都标准化为某种格式的数字、字符串等；
    
2.  到 C++ 侧代码，把填充内容最终填充到对应的 `ArrayBuffer` 中。
    

如果最终是数字，那么调用的是 [TypedArray.prototype.fill()](https://github.com/nodejs/node/blob/v18.14.2/lib/buffer.js#L1043-L1051 "https://github.com/nodejs/node/blob/v18.14.2/lib/buffer.js#L1043-L1051")：

      if (typeof value === 'number') {
        // OOB check
        const byteLen = TypedArray.prototype.getByteLength(buf);
        const fillLength = end - offset;
        if (offset > end || fillLength + offset > byteLen)
          throw new ERR_BUFFER_OUT_OF_BOUNDS();
    
        TypedArray.prototype.fill(buf, value, offset, end);
      }
    

而如果是字符串，则[调用 bindingFill()](https://github.com/nodejs/node/blob/v18.14.2/lib/buffer.js#L1051-L1058 "https://github.com/nodejs/node/blob/v18.14.2/lib/buffer.js#L1051-L1058")，这个就是 C++ 侧的填充逻辑了：

      } else {
        const res = bindingFill(buf, value, offset, end, encoding);
        if (res < 0) {
          if (res === -1)
            throw new ERR_INVALID_ARG_VALUE('value', value);
          throw new ERR_BUFFER_OUT_OF_BOUNDS();
        }
      }
    

在 C++ 侧，`bindingFill()` 的[逻辑](https://github.com/nodejs/node/blob/v18.14.2/src/node_buffer.cc#L663-L753 "https://github.com/nodejs/node/blob/v18.14.2/src/node_buffer.cc#L663-L753")中，有一个 `start_fill` 的 `goto` 标签：

    start_fill:
      if (str_length >= fill_length)
        return;
    
      // If str_length is zero, then either an empty buffer was provided, or Write()
      // indicated that no bytes could be written. If no bytes could be written,
      // then return -1 because the fill value is invalid. This will trigger a throw
      // in JavaScript. Silently failing should be avoided because it can lead to
      // buffers with unexpected contents.
      if (str_length == 0)
        return args.GetReturnValue().Set(-1);
    
      size_t in_there = str_length;
      char* ptr = ts_obj_data + start + str_length;
    
      while (in_there < fill_length - in_there) {
        memcpy(ptr, ts_obj_data + start, in_there);
        ptr += in_there;
        in_there *= 2;
      }
    
      if (in_there < fill_length) {
        memcpy(ptr, ts_obj_data + start, fill_length - in_there);
      }
    

这个是个兜底的逻辑，在这之前，我们假设已经填充了一波数据了。那么，若填充数据长度（`str_length`）大于等于目标 `FastBuffer` 的长度（`fill_length`），那么说明填充完了，直接返回；如果填充长度为 `0`，则返回 `-1`，以通知外部抛错；否则，开始用一个 `while` 去反复往后填充（`memcpy`）**自身第一波填充进来的数据（即** **`ts_obj_data + start`** **开始到** **`in_there`** **长度）**，直到目标长度全被填充完。因为 `memcpy` 只能复制填充等长的内存块，所以当目标长度更大的时候，就需要自己控制多次填充。`memcpy` 来进行填充的效率比在 JavaScript 侧通过 `for` 循环或者 `while` 循环进行填充的效率要高得多。

然后我们把逻辑往回看，在 `bindingFill()` 中，如果判断出来的填充数据类型是类 `ArrayBuffer` 的类型，那么就先[不管三七二十一填充一遍](https://github.com/nodejs/node/blob/v18.14.2/src/node_buffer.cc#L685-L691 "https://github.com/nodejs/node/blob/v18.14.2/src/node_buffer.cc#L685-L691")，然后再到 `goto` 标签中看后续是直接返回，还是通过 `while` 循环去填充剩余内容：

      if (Buffer::HasInstance(args[1])) {
        SPREAD_BUFFER_ARG(args[1], fill_obj);
        str_length = fill_obj_length;
        memcpy(
            ts_obj_data + start, fill_obj_data, std::min(str_length, fill_length));
        goto start_fill;
      }
    

上面的 `Buffer::HasInstance()` 就是判断填充数据是否是类 `ArrayBuffer` 的类型。`SPREAD_BUFFER_ARG` 宏则是把填充数据里面的元信息提取出来，展开给后续逻辑用——比如 `fill_obj_length` 就是填充数据长度，`ts_obj_data` 就是目标内存块的地址，`fill_obj_data` 就是填充数据的地址。

如果填充数据不是字符串，那么 Node.js 都将其[强行视为是一个 Uint32 类型进行填充](https://github.com/nodejs/node/blob/v18.14.2/src/node_buffer.cc#L693-L700 "https://github.com/nodejs/node/blob/v18.14.2/src/node_buffer.cc#L693-L700")：

      // Then coerce everything that's not a string.
      if (!args[1]->IsString()) {
        uint32_t val;
        if (!args[1]->Uint32Value(ctx).To(&val)) return;
        int value = val & 255;
        memset(ts_obj_data + start, value, fill_length);
        return;
      }
    

如果是字符串，那么先[将字符串按照编码类型给解码成裸内存里面的数据](https://github.com/nodejs/node/blob/v18.14.2/src/node_buffer.cc#LL705-L726C4 "https://github.com/nodejs/node/blob/v18.14.2/src/node_buffer.cc#LL705-L726C4")，然后进行第一波填充：

      // Can't use StringBytes::Write() in all cases. For example if attempting
      // to write a two byte character into a one byte Buffer.
      if (enc == UTF8) {
        str_length = str_obj->Utf8Length(env->isolate());
        node::Utf8Value str(env->isolate(), args[1]);
        memcpy(ts_obj_data + start, *str, std::min(str_length, fill_length));
    
      } else if (enc == UCS2) {
        str_length = str_obj->Length() * sizeof(uint16_t);
        node::TwoByteValue str(env->isolate(), args[1]);
        if (IsBigEndian())
          SwapBytes16(reinterpret_cast<char*>(&str[0]), str_length);
    
        memcpy(ts_obj_data + start, *str, std::min(str_length, fill_length));
    
      } else {
        // Write initial String to Buffer, then use that memory to copy remainder
        // of string. Correct the string length for cases like HEX where less than
        // the total string length is written.
        str_length = StringBytes::Write(
            env->isolate(), ts_obj_data + start, fill_length, str_obj, enc);
      }
    

> 解码逻辑不重要，我就复制出来给你看一眼，没必要细究。知道这一段逻辑是按不同编码进行填充就好。

上面这些逻辑做完之后，要么填充完成然后返回了，要么就是跑到后面 `goto` 的逻辑，开始不断 `memcpy` 自身第一波数据直到填充完毕。

用流程图来还原这段逻辑，就是：

![死月11流程图.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efe110003c604c51a367485c18e373d7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1882&h=1592&s=242647&e=png&b=ffffff)

#### `Buffer.alloc()` 是池化的吗？

根据 `Buffer.alloc()` 源码，我们可以看出，如果没有 `fill`，那就直接返回一个 `new FastBuffer()`；否则以“不安全”的形式去 `new FastBuffer()`，不初始化里面的内存块，然后以 `fill` 中的内容去快速填充内存块。

### `ArrayBuffer::Allocator`

无论池化不池化，`FastBuffer` 的背后靠的总归还是 `ArrayBuffer`。而在 V8 中，如果要创建一个 `ArrayBuffer`，得在引擎初始化之初，就指定一个叫 `ArrayBuffer::Allocator` 的东西，用于在构造 `ArrayBuffer` 的时候，为其分配一块内存给 V8 用，内存里的内容就是 `ArrayBuffer` 里面各字节的内容了。通常情况下，V8 提供了一个默认的 `ArrayBuffer::Allocator` 类给大伙儿用。像这样：

    v8::Isolate::CreateParams create_params;
    create_params.snapshot_blob = nullptr;
    create_params.array_buffer_allocator = ArrayBuffer::Allocator::NewDefaultAllocator();
    v8::Isolate* isolate = Isolate::Allocate();
    v8::Isolate::Initialize(isolate, create_params);
    

但是 Node.js 偏不，它自己继承了这个 `ArrayBuffer::Allocator`，自己重载了 `Allocate` 方法，当需要分配指定大小内存的时候，它做了些自己的事情。该类的结构中有[这些东西](https://github.com/nodejs/node/blob/v18.14.2/src/node_internals.h#L120-L127 "https://github.com/nodejs/node/blob/v18.14.2/src/node_internals.h#L120-L127")：

    class NodeArrayBufferAllocator : public ... {
      ...
    
     private:
      uint32_t zero_fill_field_ = 1;
      std::atomic<size_t> total_mem_usage_ {0};
      std::unique_ptr<v8::ArrayBuffer::Allocator> allocator_{
          v8::ArrayBuffer::Allocator::NewDefaultAllocator()};
    };
    

逐个说明一下：

1.  `zero_fill_field_`：这个就是前面提到的 `zeroFill` 的本体了，在 JavaScript 修改 `zeroFill` 的值，会影响到这个值，继而影响到该 `NodeArrayBufferAllocator` 的行为；
    
2.  `total_mem_usage_`：这是一个线程安全的原子数据，你不用在意它的类型在 C++ 里面怎么操作的，不重要，你只要知道它可以加减，以记录 `ArrayBuffer` 已经分配了一共多少内存；
    
3.  `allocator_`：V8 默认的 `Allocator`，其实 `NodeArrayBufferAllocator` 底层还是透传调用了 V8 默认 `Allocator` 的对应方法进行分配内存，只是中间做了些小把戏。
    

接下去，我们看看 `Allocate` 分配内存的时候到底做了什么吧：

    void* NodeArrayBufferAllocator::Allocate(size_t size) {
      void* ret;
      if (zero_fill_field_ || per_process::cli_options->zero_fill_all_buffers)
        ret = allocator_->Allocate(size);
      else
        ret = allocator_->AllocateUninitialized(size);
      if (LIKELY(ret != nullptr))
        total_mem_usage_.fetch_add(size, std::memory_order_relaxed);
      return ret;
    }
    

可以看出，主要的逻辑区别就在于判断 `zero_fill_field_`，看看需不需要初始化内存块，即是否是“不安全”创建。如果是安全的，那直接透传调用 `allocator_` 的 `Allocate()`，否则就调用它的 `AllocateUninitialized()`。在创建完之后，往 `total_mem_usage_` 上加上申请的内存用量即可。

这就像是我开饭店，但菜不是端到自己后厨烧的，而是下单给隔壁饭店让它烧，并还给隔壁提了“这个要放辣”、“这个不放辣”的要求，最后上菜的时候把账算到自己头上。然后我再给自己的店定了个规则，看老板心情（`zero_fill_field_`），心情好了就放辣，心情不好就不放。

主要我还真见过，以前在一家苍蝇馆点菜，然后点了大部分都饭店自己烧，里面有一道菜就直接从隔壁饭店端过来了🤡。大呼原来还可以这样。

小结
--

本章为大家讲解了 `Buffer` 的本质是什么。在 Node.js v0.x 的时代，`Buffer` 本质是在 C++ 侧实现了一个 JavaScript 的类，然后自己管理与该类绑定的内存块。而之后，Node.js 就使用 ECMAScript 标准里面的 `Uint8Array` 作为 `Buffer` 的基座，让 `Buffer` 等同于 `FastBuffer`，并继承自 `Uint8Array`，背靠的是 `ArrayBuffer`。

在 `Buffer.alloc()` 中，C++ 侧通过 `memcpy()` 等操作为其构造的 `FastBuffer` 进行填充操作。而在底层该块逻辑的内存管理中，自身代理了一个 `ArrayBuffer::Allocate`，以便其可以方便地创建“安全”或“不安全”的 `ArrayBuffer`，这样可以尽可能在一些逻辑中减少冗余逻辑。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fab07336a6fc4d12ad40c34fcfbbc958~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=658&h=370&s=54312&e=png&b=faf8f8)