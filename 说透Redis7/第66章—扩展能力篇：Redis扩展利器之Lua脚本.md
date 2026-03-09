通过前文的介绍我们知道，Redis 是使用`单线程`方式执行命令的，Redis 与客户端交互的模式是 `Request-Response 模式`，也就是：先由客户端发起请求，请求中包含一条 Redis 命令，Redis 执行完这条命令之后，给客户端返回对应的响应。

如果我们使用多条 Redis 命令组合，实现一个较为复杂的流程，在多个客户端同时执行的情况下，就可能会出现`并发问题`。

举个例子，我们在 Redis 中维护了一个商品的库存个数，现在进行秒杀活动，每个用户限只能下一个订单，每个订单最多可以购买 5 件商品，这里需要业务侧在每次减少库存值时，判断库存值是否已经到达 0 ，如果库存减到 0 了，就给用户返回“库存不足”的提示。如果下单的业务逻辑是先使用 GET 命令获取库存值，然后与订单购买的商品个数进行比较，在库存值大于购买个数的时候，才使用 SET 命令更新库存值的话，就会存在下表的并发问题，例如下表展示的这个并发执行顺序。

| **时间** | **Redis 客户端 A**      | **Redis 客户端 B**      |
| ------ | -------------------- | -------------------- |
| T1     | 执行 GET 命令，获得库存量为 100 |                      |
| T2     |                      | 执行 GET 命令，获得库存量为 100 |
| T3     | 判断当前库存充足，执行 -5，得到 95 |                      |
| T4     |                      | 判断当前库存充足，执行 -5，得到 95 |
| T5     | 执行 SET 命令，将库存更新为 95  |                      |
| T6     |                      | 执行 SET 命令，将库存更新为 95  |


很明显，我们卖出了 10 份商品，但是库存只减少了 5 份，这样就造成 “超卖” 的问题，如果更多客户端并发请求，超卖问题会更加严重。如果我们希望将多条命令组合成一个原子操作，就可以考虑**将这多条命令封装成一个 Lua 脚本，Redis 会以原子方式执行该 Lua 脚本，就不会出现上述并发问题了**。



## 第一个 Lua 脚本

Lua 是一门古老的语言，广泛作为其他语言的嵌入脚本，尤其是 C/C++，Lua 语言自身的语法简单，运行环境非常轻量级，这也是 Redis 官方选择它作为自身的扩展脚本的原因之一。目前 Lua 语言已经迭代到了 5.4 版本，较之前版本性能有较大提高。

下面我们就来编写一个 Lua 脚本来处理上面提到的库存变更问题，具体的 Lua 脚本如下所示：

```lua
local v1 = redis.call('GET', KEYS[1]);

if v1 >= ARGV[1] then

    local result = v1 - ARGV[1];

    redis.call('SET', KEYS[1], result);

    return true;

end

return false;
```

我们一行行地解析一下这个 Lua 脚本的功能。

第一行是通过 redis.call() 方法执行 Redis 的命令，这里执行的是 GET 命令，查询指定 Key 的值，GET 命令查询到的值会记录到 v1 局部变量中。在 KEYS[1] 这个 Key 中记录的是当前库存量。在 Redis 中执行一段 Lua 脚本的时候，可以传递两组参数，一组是 KEYS 参数，用来记录当前这段 Lua 脚本可能访问到的 Redis Key；另一组是 ARGV 参数，ARGV 数组中的参数不能作为 Redis 中的 Key 值使用，只能作为 Lua 脚本自身的参数使用。

第二行是比较 v1 与 ARGV[1] 参数，ARGV[1] 参数是此次订单购买的商品数，如果 v1 大于 ARGV[1] 参数，则表示库存充足，会执行 if 代码块中的逻辑；如果库存量不足，会直接执行到第七行，返回 false，表示当前 Lua 脚本执行失败。第三行代码会计算最新的库存量并记录到 result 这个局部变量中。第四行再次使用 redis.call() 方法执行 SET 命令，更新 KEYS[1] 的值，也就是库存量。第五行返回 true，表示当前 Lua 脚本执行成功。

接下来我们就可以在 Redis 中执行该脚本了，我们可以使用如下 `--eval` 命令执行一个 Lua 文件：

```
➜ ./redis-cli --eval ./updateInventory.lua test1 test2 , 10 100
```

这里的 updateInventory.lua 是上述 Lua 脚本的文件名称，test1 和 test2 会传入到 KEYS 数组中，然后通过逗号分隔之后的 10 和 100 传入到 ARGV 数组中（示例中没有使用到 test2 和 100 这两个值）。注意，KEYS 和 ARGV 参数中各个参数前后都需要空格进行分隔。

除了这种一次性的执行方式之外，我们还可以通过 SCRIPT LOAD 命令将脚本存储到 Redis 中，如下所示：

```
➜ ./redis-cli -x script load < ./updateInventory.lua

"2f9e5bb00bf2a6739542ca791fbff35b0eea6e89"
```

这里返回的一串字符串是 updateInventory.lua 脚本的 SHA1 值，也是该脚本在 Redis 脚本缓存中的唯一标识，之后就可以复用该标识来调用 updateInventory.lua 脚本的功能了。我们进入 redis-cli 客户端之后，执行 EVALSHA 命令即可，具体如下所示：

```
127.0.0.1:6379> EVALSHA 2f9e5bb00bf2a6739542ca791fbff35b0eea6e89 1 test1 10000000
```

最后，我们还可以在 redis-cli 后面添加 `--ldb` 参数对 Lua 脚本进行调试，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/692256d794ff45c2908c90802551d5c8~tplv-k3u1fbpfcp-zoom-1.image)

进入 Debug 状态之后，我们可以输入 s 或是 step 单步执行，如下图所示，在单步执行的时候，执行的 Redis 命令以及返回值都会打印出来：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e83bc825ca64d88bff20c097bd47a8d~tplv-k3u1fbpfcp-zoom-1.image)

我们还可以使用 break 命令在指定行添加断点，也可以使用 break 命令展示或删除指定行的断点，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14f788f652564e88b4fea12b128a58d1~tplv-k3u1fbpfcp-zoom-1.image)

在设置断点之后，我们就可以使用 continue 命令将程序直接运行到下一个断点处，同时，也可以使用 print 命令展示全部局部变量值以及指定的局部变量值，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20a1d64453be4e63816cdc4b7f9bc97e~tplv-k3u1fbpfcp-zoom-1.image)

到此为止，我们的第一个 Lua 脚本的`编写`、`运行`、`调试`方面的知识就介绍完了。下面我们将开始介绍 Redis 执行 Lua 脚本的相关实现了。

## Redis Lua 核心实现

### Lua 环境初始化

首先，我们来看 Redis 中与 Lua 脚本执行相关的关键结构体 —— luaCtx，它表示的是 Lua 脚本执行的上下文信息：

```c++
struct luaCtx {

    lua_State *lua; // 从C语言的角度看，可以把lua_State理解成一个Lua虚拟机，或者是一个可以执行Lua代码的Lua虚拟机主线程。lua_State全局唯一

    client *lua_client;   // 指向一个fake client，它是用于在Lua脚本中执行Redis命令的client

    dict *lua_scripts;    // 当前正在执行的脚本对应的SHA1值

    unsigned long long lua_scripts_mem;  // 缓存脚本使用的内存空间

} lctx;
```


在 redisServer 结构体中，也有一些与 Lua 脚本相关信息，如下：

```c++
struct redisServer {

    client *script_caller; // 调用EVAL命令，触发Lua脚本执行的client

    mstime_t busy_reply_threshold;  // 脚本执行超时时间

    ... // 省略其他字段

}
```

接下来看 Redis 初始化 Lua 脚本环境的核心流程，这部分逻辑位于 scriptingInit() 函数，其核心步骤如下。

1.  调用 lua_open() 初始化 Lua 脚本解释器，也就是上面 luaCtx->lua 字段。

2.  加载 Lua 库，这里加载了 Lua 的基础库以及 cjson 库等常用 Lua 库，同时会禁用 loadfile、dofile 等文件读写函数，防止恶意的 Lua 脚本读写 Redis 服务器上的文件。
3.  初始化 luaCtx->lua_scripts 字典，用于维护 Lua 脚本 SHA1 标识与 Lua 脚本代码之间的映射关系。
4.  注册 Redis 命令，对应的逻辑在 luaRegisterRedisAPI() 函数中，下面截取了其中一段比较有代表性的代码片段，并做了比较详细的分析。这里需要先明确一下，C 语言与 Lua 交互的方式是靠一个虚拟栈来完成的，后面我们还会多次使用到这个虚拟栈来传递数据：

```c++
// lua_newtable()函数用于创建一个table，该table会压入到Lua的栈顶中，

// table中注册的内容也就从Redis传递到了Lua脚本中

lua_newtable(lua); 

// lua_pushstring()函数是将一个字符串压入到栈顶，下面就是将"call"字符串压入栈顶

lua_pushstring(lua,"call"); 

// lua_pushcfunction()函数是将一个C函数指针压入到栈顶，下面就是将luaRedisCallCommand

// 函数指针压入栈顶

lua_pushcfunction(lua,luaRedisCallCommand); 

// lua_settable()函数是将栈顶的两个元素弹出，第一个弹出的元素作为Key，第二个弹出的元素作为Value，然后将Key和Value设置到table中

lua_settable(lua,-3);
```

call 命令以及对应的 luaRedisCallCommand() 函数注册的逻辑如下图所示：


<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4989b7de6454d84a5ace9a3c13ec668~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

同学们可以参考 Redis 源码中`  /deps/lua/doc/manual.html  `这个 API 文档来了解 C 语言与 Lua 脚本交互的函数。

除了注册 call 命令之外，这里还会注册 pcall、log、setresp、error_reply、status_reply、replicate_commands、set_repl 等一系列命令以及 LL_VERBOSE、LL_NOTICE、PROPAGATE_AOF、PROPAGATE_REPL 一系列全局和局部变量，它们的注册原理与 call 命令相同，这里就不再一一重复了。

5.  在将上述命令和变量都注册到 table 之后，这里会调用 lua_setglobal() 函数，将 table 记录到一个名为 redis 的全局变量中，如下图所示，在 Lua 脚本中就可以通过 "redis." 的方式调用前面注册到其中的函数了。出于安全方面的考虑，这里还会禁用 Lua 全局变量的读写，防止恶意 Lua 脚本修改 redis table 中注册的函数。


<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee777de861184a83bb92ba0a68dcd872~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

6.  最后，初始化 luaCtx->lua_client 字段，后续我们会看到该 client 实例主要用于在 Lua 脚本中执行 Redis 命令，这里会在 client 实例的 flags 中设置 CLIENT_SCRIPT 进行标识，同时还会设置 CLIENT_DENY_BLOCKING 标志位禁止阻塞。


### redis.call() 核心

了解了在 Lua 解释器中注册 Redis 命令的逻辑之后，我们来看 Lua 脚本中 redis.call() 和 pcall() 函数具体是如何执行 Redis 命令的，redis.call() 和 pcall() 函数在底层对应的都是 luaRedisGenericCommand() 函数，两者只是返回值有所不同而已，如下图所示：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/639a07d36e134609a92fb8257236b24a~tplv-k3u1fbpfcp-zoom-1.image" alt=""  /></p>

下面是 luaRedisGenericCommand() 函数的核心逻辑。

1.  首先调用 luaArgsToRedisArgv() 函数，解析 Lua 脚本给 redis.call() 函数传入的参数值。数字类型参数将通过 lua_tonumber() 函数读取，并以 double 形式存储，字符串类型参数将通过 lua_tolstring() 函数读取并存储，最终所有的参数将存储到 argv 数组中。

2.  接下来进入 scriptCall() 函数，它先将解析得到的参数（argv 数组）赋值到 luaCtx.lua_client 这个全局 client 中的 argv 字段，同时会更新 luaCtx.lua_client->argc 字段，记录参数个数。前面简单提到 luaCtx->client，它是一个 fake client，专门用来执行 Lua 脚本发出的 Redis 命令。
3.  然后，scriptCall() 会通过 lookupCommand() 函数，根据 luaCtx->lua_client->argv[0] 指定的命令名称，查询对应的 redisCommand 实例。
4.  在命令真正执行之前，还有一系列检查。例如，检查 Lua 脚本的 client 是否有执行目标命令的权限；如果目标命令为写操作的话，当前是否有持久化异常禁止写操作执行；检查当前 Redis 内存是否达到最大值，从而禁止命令执行；如果是 Redis Cluster 模式中，目标命令只能访问当前节点管理的 slot 中的 Key。这些检查与正常执行一条命令前的检查基本类似，这里就不再展开一一介绍了，感兴趣的小伙伴可以翻看一下 scriptCall() 函数的源码。
5.  接下来根据 Lua 脚本的配置，设置此次执行的命令能否传播到从库以及 AOF 文件中。这里简单说一下 Redis 对 Lua 脚本中命令进行传播的处理。下面看个例子，其中通过 time 命令随机生成时间戳并写入到 Redis 的是 Lua 实现如下：

```
local now = redis.call('time')[1]; // 执行time命令获取随机时间

redis.call('set','now',now);       // 将随机时间写入到now这个Key中

return true;
```

在老版本的 Redis 中，这种操作在 Lua 脚本中是不允许的，因为 Lua 脚本对 Redis 数据进行修改之后，会将整个 Lua 脚本持久化到 AOF 文件中，从而保证回放 AOF 能够将 Redis 恢复到当前状态；还会将 Lua 脚本复制给 Slave 执行，从而保证主从一致。但是，如果 Lua 脚本中使用了随机命令，随机命令无法产生一个确定的值，就可能造成主从不一致。

在 Redis 5 中引入了 lua-replicate-commands 配置，用来表示是否开启单行命令的同步特性。开启该特性之后，AOF 和主从复制不再传播整个 Lua 脚本，而是传播单条 Redis 命令；在传播单条命令的时候，Redis 就会对命令进行过改写，从而解决 Lua 脚本中不能使用随机命令的问题。

在 Redis 7 中，只能使用单条命令的方式来传播 Lua 脚本中执行的命令，Lua 脚本方式传播以及 lua-replicate-commands 这个开关也已经都废弃掉了。

6.  完成上述检查和处理逻辑之后，scriptCall() 函数会调用 call() 函数执行真正的 Redis 命令，其核心逻辑在前面的小节中已经详细分析过了，这里不再重复。

7.  完成 Redis 命令执行之后，这里会开始读取 luaCtx->client 这个 fake client 的 buf 缓冲区以及 reply 列表，获取 Redis 命令返回值。然后调用 redisProtocolToLuaType() 函数将 Redis 命令返回值转换成 Lua 变量并压入到虚拟栈中。

    这里以 redisProtocolToLuaType_Int() 函数为例进行简单说明，其中会先查找 '\r' 结束符，然后 '\r' 字符之前的部分转换成 double 类型，并调用 lua_pushnumber() 函数将其压缩到虚拟栈中，如下图所示：


<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9291f9933b9a49c4a6eff78f0184a09e~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

到此为止，Lua 脚本中的 redis.call()、pcall() 调用的核心逻辑就介绍完了。

### Lua 脚本执行原理

介绍完 Lua 脚本内部执行 Redis 命令的逻辑之后，我们来关注触发 Lua 脚本的相关命令，其中我们最常用的、触发 Lua 脚本执行的命令就是 `EVAL` 命令，其格式如下：

```c
EVAL script numkeys key [key ...] arg [arg ...]
```

其中 script 是 Lua 脚本的具体代码，numkeys 是后续 key 参数的个数，这些 key 参数将会转换成 Lua 脚本中 KEYS 数组中的元素值，后续的 arg 参数将转换成 Lua 脚本中的 ARGV 数组中的元素值。前面在命令行窗口中使用 redis-cli --eval 命令执行 Lua 脚本的时候，没有 numkeys 参数，而是使用逗号区分 key 参数和 argv 参数，注意两者的区别。

下面我们来看 EVAL 命令对应的底层实现 —— evalGenericCommand() 函数（EVALSHA 命令的底层也是通过该函数实现的），其核心逻辑如下。

1.  首先，为 Lua 脚本计算 SHA1 值，该 SHA1 值前面会拼接 "f_" 字符将作为该 Lua 脚本对应的函数名称，我们可以回忆一下前文编写的 Lua 脚本实际上就是一个函数体。计算好 Lua 脚本对应的函数名称之后，这里会调用 lua_getfield() 函数从 Lua 环境中获取同名的全局变量，并将该变量值压入到虚拟栈中。

2.  接下来执行 lua_isnil() 函数检查栈顶值是否空，如果是的话，说明该脚本未被缓存，这里会调用 luaCreateFunction() 函数将 Lua 函数名称和对应的 Lua 脚本写入到 luaCtx->lua_script 字典中缓存，同时还会调用 luaL_loadbuffer()、lua_pcall() 等函数，将 Lua 脚本加载到虚拟栈顶。如下图所示：


<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ecfc29cfafd4d038fc6c0aedbcfdd4b~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

3.  随后，进入 luaCallFunction() 函数。它会将 EVAL 命令中的 key 参数列表，设置到 Lua 全局变量中的 KEYS 数组中，将 EVAL 命令中的 arg 参数列表设置到 Lua 全局变量中的 ARGV 数组中。

4.  luaCallFunction() 函数还会调用 lua_sethook() 函数，将 luaMaskCountHook() 函数设置为 hook 函数，在 Lua 解释器每执行 100000 条指令的时候，就会回调一下 luaMaskCountHook() 函数。

    在 luaMaskCountHook() 函数中会比较当前时间戳与 lua_time_start 时间戳来判断当前 Lua 脚本执行是否超时，如果超时了，会在上下文中设置 SCRIPT_TIMEDOUT 标识。然后，在将发起 EVAL 命令的 client 的 flags 中添加 CLIENT_PROTECTED 标记，该标记表示暂时保持与 lua_caller 之间的连接，我们可以在 freeClientsInAsyncFreeQueue() 函数和 freeClient() 函数中看到对应的逻辑：

```c
void freeClient(client *c) {

    if (c->flags & CLIENT_PROTECTED) { // 如果有CLIENT_PROTECTED标志，会异步释放

         // 将client添加到redisServer.clients_to_close列表中，

         // clients_to_close列表中记录了等待释放的client

        freeClientAsync(c); 

        return;

    }

    ... ... // 省略其他逻辑

}



int freeClientsInAsyncFreeQueue(void) {

    listRewind(server.clients_to_close,&li);

    while ((ln = listNext(&li)) != NULL) {

        client *c = listNodeValue(ln);

        // 跳过CLIENT_PROTECTED状态的client

        if (c->flags & CLIENT_PROTECTED) continue;

        // 调用freeClient(c)函数释放client以及底层连接

        freeClient(c);

        listDelNode(server.clients_to_close,ln);

        freed++;

    }

    return freed;

}
```

之所以保持该 client 的连接，是为了在 Lua 脚本执行完成或是在被其他客户端 kill 的时候，返回给客户端相应的提示信息。

另外，在发生超时的时候，luaMaskCountHook() 函数还会调用 processEventsWhileBlocked() 函数处理其他客户端请求和定时任务，但是注意，这里只能接受其他客户端发来的 SCRIPT KILL 等几种特殊的控制命令，读写命令就别想了，相应的控制逻辑我们可以在 processCommand() 函数中看到：

```c
int processCommand(client *c){

    ... // 省略其他逻辑

    if ((scriptIsTimedout() // 当前Lua脚本执行超时

            || server.busy_module_yield_flags

         ) && !(c->cmd->flags & CMD_ALLOW_BUSY)) { // 只有CMD_ALLOW_BUSY的命令能执行

        if (server.busy_module_yield_flags && server.busy_module_yield_reply) 

        {

            rejectCommandFormat(c, "-BUSY %s", 

                    server.busy_module_yield_reply);

        } else if (server.busy_module_yield_flags) {

            rejectCommand(c, shared.slowmoduleerr); // 返回BUSY响应

        } else if (scriptIsEval()) {

            rejectCommand(c, shared.slowevalerr); // 返回BUSY响应

        } else {

            rejectCommand(c, shared.slowscripterr); // 返回BUSY响应

        }

        return C_OK;

    }

    ... // 省略其他逻辑

}
```

5.  介绍完 Lua 脚本超时的处理逻辑之后，我们回到 luaCallFunction() 函数的主线继续分析。接下来，luaCallFunction() 函数可以调用 lua_pcall() 函数执行虚拟栈顶的 Lua 函数了。

    如果 Lua 脚本执行失败，lua_pcall() 函数会将错误信息压入到虚拟栈中，此时 Redis 会通过 lua_tostring() 函数从虚拟栈中弹出错误信息，并组装成合适的格式，返回给 lua_caller 客户端；如果 Lua 脚本执行成功，lua_pcall() 会将 Lua 脚本的执行结果压入到虚拟栈，此时 Redis 会从栈顶弹出数据，并通过 luaReplyToRedisReply() 函数将其转换成 Redis 中的类型，返回 lua_caller 客户端。

6.  在 Lua 脚本执行完成之后，会进行一系列清理工作，例如，删除前面注册的 luaMaskCountHook() 超时检查函数、调用 Lua 的垃圾回收器清理 Lua 数据（这里会限制 GC 调用的频率，不是每执行完一次 Lua 脚本就执行一次 GC，而是每执行 50 次 Lua 脚本才会触发一次 Lua 的 GC）、清理超时标识等等。

到此为止，`EVAL` 、`EVALSHA` 命令执行 Lua 脚本的核心逻辑就介绍完了。

## 总结

在这一节中，我们重点介绍了 Redis 中 Lua 脚本的基本使用以及 Redis 支持 Lua 脚本的底层原理。首先带着大家一起，写了一个简单的 Lua 脚本，介绍了 Lua 脚本在 Redis 中相关的应用；然后分析了 Redis 中与 Lua 脚本相关的核心结构体；最后介绍了 Redis 执行 Lua 脚本的核心流程和原理。

下一节，我们将一起来看 **Redis 7 新引入的 Function 功能**。