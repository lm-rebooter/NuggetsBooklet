上一节，我们详细介绍了 Redis 如何通过 Lua 脚本进行扩展，以及 Redis 底层是如何执行 Lua 脚本的。在 Redis 7 中，引入了 Functions 这种新的扩展方式，之所以引入 Functions 这种扩展方式，因为 Lua 脚本的的一些局限性，例如：

-   Lua 脚本在发到 Redis 服务端之后，只是暂存在内存中，不会进行持久化。当 Redis 重启或者出现主从切换，Lua 脚本就会丢失，需要客户端重新上传。这样的话，就需要所有的客户端都要保留一份 Lua 脚本，并实现一套上传 Lua 脚本的逻辑。
-   Lua 脚本进行代码更新的时候，也是同样的逻辑。除了要在 Redis 服务端进行更新，还需要同步全部客户端进行更新，否则，就会出现脚本代码不一致的情况。
-   另外，Lua 脚本之间是不能相互调用的，这就会造成许多代码重复，从开发和维护角度来说，都不是一件好事。


## Functions 基本使用

下面我们开始介绍一下 Redis Functions 的基本使用。

**Redis Functions 目前只支持 Lua 脚本**，所以我们先来定义 check_key()、my_hset() 和 my_hgetall() 三个 Lua function，具体如下所示。其中，my_hset() 函数在 HSET 命令之上做了扩展，它不仅会将传入的键值对写入到指定的 Hash 表，还会多加一个名为 `“_last_modified_”` 的 field，对应的 value 是写入时间。my_hset() 在执行 HSET 命令之前，还会调用 check_key() 函数检查传入的 Hash Key 的个数。定义完这两个函数之后，我们还要调用 redis.register_function() 来注册 my_hset() 函数。my_hgetall() 函数用来与 my_hset() 搭配使用，它的关键点在于 `redis.setresp(3)` 这行代码会将指定当前要使用 RESP3 协议，这样后面的 HGETALL 命令返回值才能会按照 map 的格式去处理。


```lua
#!lua name=mylib   -- 指定lib

local function check_key(keys) --定义check_keys函数
    local error = nil 
    local nkeys = table.getn(keys) -- 检查keys数组的长度
    if nkeys == 0 then
      error = 'Hash key name not provided'
    elseif nkeys > 1 then
      error = 'Only one key name is allowed'
    end
  
    if error ~= nil then -- 如果keys参数异常，会打印日志，并给客户端返回异常
      redis.log(redis.LOG_WARNING, error);
      return redis.error_reply(error)
    end
    return nil
end
  
local function my_hset(keys, args) -- 定义my_hset函数
    local error = check_keys(keys)  -- 调用check_keys()函数，检查keys参数的长度 
    if error ~= nil then
      return error
    end
  
    local hash = keys[1] -- 获取Hash的Key
    local time = redis.call('TIME')[1]  -- 获取当前时间
    -- 调用HSET命令，设置多个KV值，其中会用_last_modified_这个field来记录当前时间戳，
    -- 其他field来自my_hset函数的参数
    return redis.call('HSET', hash, '_last_modified_', time, unpack(args))
end

local function my_hgetall(keys, args)
    local error = check_keys(keys) -- 调用check_keys()函数，检查keys参数的长度 
    if error ~= nil then
      return error
    end
  redis.setresp(3) -- 使用RESP3
  local hash = keys[1]
  local res = redis.call('HGETALL', hash) -- 调用HGETALL命令
  res['map']['_last_modified_'] = nil -- 将_last_modified_字段清理掉
  return res
end
  
-- 注册my_hset函数
redis.register_function('my_hset', my_hset)
-- 注册my_hgetall函数
redis.register_function('my_hgetall', my_hgetall)
```


编写完 Lua 脚本之后，我们就可以用 FUNCTION LOAD 命令进行加载了，具体命令如下。加载成功之后，返回的就是 Lua 脚本中指定的 lib 库的名称：

```shell
➜  src git:(heads/7.0.0) ✗ cat test.lua| redis-cli -x FUNCTION LOAD REPLACE
"mylib"
```



到此为止，我们就在 Redis 中创建好了一个叫 my_hset() 的函数，接下来我们可以用 FCALL 命令来调用这个函数的话，具体如下所示。紧跟在 FCALL 命令之后的第一个参数是刚刚我们定义好的 my_hset() 函数的函数名称，然后是传入 my_hset() 的 keys 参数的长度，这里是 1，也就是后面的 testHash 字符串将作为 keys 数组传入，最后的 `f1 v1 f2 v2` 四个参数，会作为 args 数组传入到 my_hset() 函数。

```lua
127.0.0.1:6379> FCALL my_hset 1 testHash f1 v1 f2 v2
(integer) 3
127.0.0.1:6379> HGETALL testHash
1) "_last_modified_"
2) "1660006387"
3) "f1"
4) "v1"
5) "f2"
6) "v2"
127.0.0.1:6379> FCALL my_hset 2 testHash testHash2 f1 v1 f2 v2
(error) Only one key name is allowed
127.0.0.1:6379> FCALL my_hgetall 1 testHash
1) "f1"
2) "v1"
3) "f2"
4) "v2"
```


执行完上述 my_hset() 函数之后，我们用 HGETALL 命令查看 testHash 中的全部 field 和 value 值，发现其中除了 f1、v1 和 f2、v2 两组键值对之外，还多出了一个 `“_last_modified_”`，记录了调用 my_hset() 的时间戳，这也就和我们前面介绍的 my_hset() 函数逻辑对应上了。

我们再调用一次 my_hset() 函数，但这里让 keys 数组长度变成 2，就会被 check_key() 函数的检查拦住，并返回 `Only one key name is allowed` 提示。

最后，我们调用一下 my_hgetall() 函数，可以看到它会将 `“_last_modified_”` 这个 field 抹去之后返回。这样，通过 my_hset() 和 my_hgetall() 两个函数，我们就实现了添加 `“_last_modified_”` 隐藏字段的效果。

  


## Redis Function 核心结构体

在开始介绍 Function 的相关命令之前，我们先来了解一下 Redis Function 涉及到的一些核心结构体。

首先是 functionLibInfo 结构体，它表示的是一个函数库，例如上面的示例中 mylib。functionLibInfo 中维护了整个函数库的源码，以及每个函数对应的 functionInfo 实例，其具体定义如下：

```c
struct functionLibInfo 
    sds name;        // 函数库的名称，也就是示例中的mylib
    dict *functions; // 当前函数库中的函数，Key是函数名称，Value是函数对应的functionInfo实例
    engineInfo *ei;  // 函数关联的引擎，目前只有Lua脚本引擎
    sds code;        // 函数库的代码，也就是示例中的整个Lua脚本的内容
};
```

接下来看 functionInfo 结构体，它用来表示函数库中的一个函数，具体定义如下。在上述示例中，check_key() 和 my_hset() 两个函数，分别对应一个 functionInfo 实例。

```c
typedef struct functionInfo {
    sds name;            // 函数名称，也就是示例中的check_key和my_hset
    void *function;      // 由Lua引擎设置的指针，指向了编译后的代码，运行函数的时候，就会用到这个指针
    functionLibInfo* li; // 指向了所属的函数库
    sds desc;            // 函数的描述信息
    uint64_t f_flags;    // 用于指定函数的一些特性，这个后面再说
} functionInfo;
```

最后来看 engine 结构体，它类似于一个接口，其中定义了多个函数指针，用来抽象一个 function 引擎，其关键字段的定义如下：

```c
typedef struct engine {
    void *engine_ctx; // 引擎上下文信息，在Lua引擎中，包含了前面提到的lua_State，用于执行Lua脚本
    // create函数用于编译Lua脚本，并注册函数库
    int (*create)(void *engine_ctx, functionLibInfo *li, sds code, sds *err);
    // call函数用于调用指定的函数
    void (*call)(scriptRunCtx *r_ctx, void *engine_ctx, void *compiled_function,
            robj **keys, size_t nkeys, robj **args, size_t nargs);

    ... // 省略其他不重要的函数指针
} engine;
```


目前 Redis 只有 Lua 一种引擎，在 Redis 启动的时候会初始化 Lua 引擎，并记录到全局的 engines 字典中，其中 Key 是 “LUA” 这个字符串，Value 是 Lua 对应的 engine 实例。

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3ff2f8dc10a4e0f8456efc281cd35f4~tplv-k3u1fbpfcp-zoom-1.image" alt=""  /></p>



另外，Redis 还会维护一个全局的 functionsLibCtx 上下文信息（curr_functions_lib_ctx 全局变量），其中维护了 libraries 和 functions 两个集合，分别记录了全部的函数库和函数，这就方便我们用名称来查找函数库或是函数。


最后，我们通过一张图来简单总结一下上述核心结构体之间的关系：


<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/371ee004365d4e6792a8c0246e1eeca7~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

  


## FUNCTION LOAD 命令原理

介绍完 Redis Functions 相关的核心结构体之后，我们正式开始看 Function 相关的命令实现原理。

这里先来看看 FUNCTION LOAD 命令的完整格式化，如下所示。它除了可以指定 lua function 的具体代码实现之外，还可以指定一个 REPLACE 参数，用于更新已存在的 lua function 的代码实现。

```lua
FUNCTION LOAD [REPLACE] function-code
```


FUNCTION LOAD 命令加载 function 的核心逻辑位于 functionsCreateWithLibraryCtx() 中，下面结合我们的实例，分析一下其核心逻辑，如下：

```c
sds functionsCreateWithLibraryCtx(sds code, int replace, sds* err, functionsLibCtx *lib_ctx) {
    dictIterator *iter = NULL;
    dictEntry *entry = NULL;
    functionLibInfo *new_li = NULL;
    functionLibInfo *old_li = NULL;
    functionsLibMataData md = {0};
    // 1.过 functionExtractLibMetaData() 函数，从 Lua 脚本中提取函数库的基本信息，
    // 主要就是解析 Lua 脚本的第一行 #!lua name=mylib 
    if (functionExtractLibMetaData(code, &md, err) != C_OK) {
        return NULL;
    }
    ... // 省略校验逻辑

    // 2.从 functionsLibCtx 中查找是否有重名的函数库。如果是替换逻辑，就会将旧的函数库释放掉；如果是单纯新增函数库，如果出现同名的函数库，直接抛出异常
    engineInfo *ei = dictFetchValue(engines, md.engine);
    if (!ei) {
        *err = sdscatfmt(sdsempty(), "Engine '%S' not found", md.engine);
        goto error;
    }
    engine *engine = ei->engine;

    old_li = dictFetchValue(lib_ctx->libraries, md.name);
    if (old_li && !replace) {
        old_li = NULL;
        *err = sdscatfmt(sdsempty(), "Library '%S' already exists", md.name);
        goto error;
    }

    if (old_li) {
        libraryUnlink(lib_ctx, old_li);
    }
    // 执行 engineLibraryCreate() 函数，为传入的 mylib 创建对应的 functionLibInfo 实例
    new_li = engineLibraryCreate(md.name, ei, code);
    // 3.调用 Lua 引擎的 luaEngineCreate() 编译脚本，同时，还是执行一下 Lua 脚本
    if (engine->create(engine->engine_ctx, new_li, md.code, err) != C_OK) {
        goto error;
    }

    ... // 省略后续的校验逻辑
    sds loaded_lib_name = md.name;
    md.name = NULL;
    functionFreeLibMetaData(&md);

    return loaded_lib_name;
}
```

1.  通过 functionExtractLibMetaData() 函数，从 Lua 脚本中提取函数库的基本信息，主要就是解析 Lua 脚本的第一行 ` #!lua name=mylib  `。从这一行中，可以看到这个脚本要使用的 Lua 引擎，函数库的名称为 mylib。

2.  从 functionsLibCtx 中查找是否有重名的函数库。如果是替换逻辑，就会将旧的函数库释放掉；如果是单纯新增函数库，如果出现同名的函数库，直接抛出异常。然后执行 engineLibraryCreate() 函数，为传入的 mylib 创建对应的 functionLibInfo 实例。

3.  调用 Lua 引擎的 luaEngineCreate() 编译脚本，同时，还是执行一下 Lua 脚本。注意，在示例脚本中，my_hset() 和 check_key() 两个函数只有函数定义，没有被调用，所以示例脚本在执行的时候，只会执行 `redis.register_function('my_hset', my_hset)` 和 `redis.register_function('my_hgetall', my_hgetall)`这两行 Lua 代码。

      

-  在 Redis 初始化的时候，会将 luaRegisterFunction() 函数注册为 redis.register_function() 的回调函数，所以这里会触发 luaRegisterFunction() 函数，相关的代码片段如下：
    
     ```c
        int luaEngineInitEngine() {
            ... // 省略其他代码
           lua_pushstring(lua_engine_ctx->lua, "register_function");
           lua_pushcfunction(lua_engine_ctx->lua, luaRegisterFunction);
           lua_settable(lua_engine_ctx->lua, -3);
           ... // 省略其他代码
        }
        ```
    
- luaRegisterFunction() 函数中会为 my_hset() 函数和 my_hgetall() 函数创建对应的 functionInfo 实例，并填充到 functionLibInfo->functions 字段，这样就实现了函数注册的效果。


4.  调用 libraryLink() 函数，将上面新建的一个 functionLibInfo 实例以及两个 functionInfo 实例，全部记录到全局 functionsLibCtx 实例中。之后要调用函数的时候，就从这个全局 functionsLibCtx 实例中，按名称进行查找。


FUNCTION LOAD 命令在执行完成上述逻辑之后，还会将 redisServer.dirty 加一，表示该命令修改了数据，这样，FUNCTION LOAD 命令就可以实现传播到从库以及写入到 AOF 日志中的效果。

除了 AOF 这种持久化方式，上述定义的函数还支持持久化到 RDB 文件中，相应的持久化逻辑位于 rdbSaveFunctions() 函数，其中会遍历全局 functionsLibCtx 实例中存储的全部 functionInfo，将其中记录的 Lua 源码存到 RDB 文件中。



## FCALL 命令实现原理

通过 FUNCTION LOAD 加载完 Lua 函数库之后，就可以使用 FCALL 命令来执行函数了。


fcallCommandGeneric() 函数是处理 FCALL 命令的核心，其关键步骤如下。

1.  根据 FCALL 命令指定的函数名称，从全局 functionsLibCtx->functions 字典中，查找对应的 functionInfo 实例。

2.  调用 scriptPrepareForRun() 函数初始化 scriptRunCtx 上下文实例，scriptRunCtx 中记录了一些函数执行的上下文信息，例如，此次触发的函数名称、执行函数的 fake client 引用、真正触发函数的客户端 client 引用等等。

    在 scriptPrepareForRun() 函数中还会结合 Redis 的运行状态与 functionInfo->t_flags 标志做一些检查，t_flags 标志是在 `redis.register_function()`注册函数的时候指定的，可选的标志有下面几个。
    -  no-writes：表示该函数只会读数据，不能写入数据。
    -  allow-oom：在 Redis 内存满了的时候，该函数依旧可以执行。
    -  allow-stale：如果该函数运行在了从库上，从库与主库断开了连接或者出现延迟，该函数依旧可以执行。
    -  no-cluster：表示该函数不能在 Redis Cluster 上执行。
    -  allow-cross-slot-keys：表示该函数可以读写多个 slot 中的 Key，但是，函数中每条 Redis 命令，还是只能读写单个 slot 中的 Key。

3.  最后调用 engine->call()，也就是 luaEngineCall() 函数，该执行 Lua 函数。它底层也是依赖上一小节介绍的 luaCallFunction() 函数来执行 Lua 脚本的，具体逻辑在上一小节已经详细分析过了，这里不再重复。

  


## 总结

在本节中，我们重点介绍了 Redis 7 引入的 Function 新特性。我们首先讲解了 Redis Function 的基本使用，然后介绍了 Redis 是如何支持 Function 这一新特性的，其中包括 Redis Function 特性使用的关键结构体介绍，以及 `FUNCTION LOAD` 和 `FCALL` 两个关键命令的实现解析。