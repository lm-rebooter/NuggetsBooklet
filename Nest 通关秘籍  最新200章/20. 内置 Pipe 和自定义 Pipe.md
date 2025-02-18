Pipe 是在参数传给 handler 之前对参数做一些验证和转换的 class，

对应的源码如下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ed89de3d40e498bade8a478e22f4b2f~tplv-k3u1fbpfcp-watermark.image?)

对每个参数都会应用 pipe：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/062d2f24b9874a8fbedc7a3085e62e63~tplv-k3u1fbpfcp-watermark.image?)

内置的 Pipe 有这些：

*   ValidationPipe
*   ParseIntPipe
*   ParseBoolPipe
*   ParseArrayPipe
*   ParseUUIDPipe
*   DefaultValuePipe
*   ParseEnumPipe
*   ParseFloatPipe
*   ParseFilePipe

它们都实现了 PipeTransform 接口：

比如 ParseIntPipe 的源码是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa9cca172621448da12d1b2fcedd7fdd~tplv-k3u1fbpfcp-watermark.image?)

我们分别来试下内置的 Pipe 的功能吧。

创建个项目：

    nest new pipe-test -p npm

参数默认是 string 类型：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87eb6e7c9e5042ebb71a1227578f4e66~tplv-k3u1fbpfcp-watermark.image?)

我们可以通过 Pipe 把它转为整数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f168c749eb014e869d44ddc4e8b89870~tplv-k3u1fbpfcp-watermark.image?)

效果如下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/231946ac471b45d0873ff3a97651b26b~tplv-k3u1fbpfcp-watermark.image?)

当你传入的参数不能 parse 为 int 时，会返回这样的响应：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62eee43c9237471bb5052cdc8d0806e9~tplv-k3u1fbpfcp-watermark.image?)

这个也是可以修改的，但要使用 new XxxPipe 的方式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5eef1df33b7c4c0885dd4fde73332708~tplv-k3u1fbpfcp-watermark.image?)

比如我指定错误时的状态码为 404。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dfeac56cc0e496a86d6dc865c1c68b6~tplv-k3u1fbpfcp-watermark.image?)

就会返回这样的响应。

此外，你还可以自己抛一个异常出来，然后让 exception filter 处理：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96004942abf84719a72afb80ff32acce~tplv-k3u1fbpfcp-watermark.image?)

可以看到，状态码和 message 都改了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7e32b042f7744b988597d11f58caae5~tplv-k3u1fbpfcp-watermark.image?)

你也可以加个 @UseFilters 来使用自己的 exception filter 处理。

ParseFloatPipe 是把参数转换为 float 类型的。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc7d6ef5f44946e593c04603f174235b~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/000c46317e7f449bb504d3b02f12466e~tplv-k3u1fbpfcp-watermark.image?)

它也同样可以 new ParseFloatPipe 的形式，传入 errorHttpStatusCode 和 exceptionFactory。

剩下这些与 parse 有关的 pipe 我们都试一下：

ParseBoolPipe：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88758a82a1b54cc69425c0086def72ea~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f3da13bc7cb4c6ca8380f8811c81d83~tplv-k3u1fbpfcp-watermark.image?)

ParseArrayPipe：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b7f3fe51102479c90c9d93b6729515c~tplv-k3u1fbpfcp-watermark.image?)

这时会提示需要 class-validator 这个包：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c24ae6a218074f2380acb4fecd420625~tplv-k3u1fbpfcp-watermark.image?)

这是可以用装饰器和非装饰器两种方式对 class 属性做验证的库

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ce5ff851375484f8927ea4b05f16c71~tplv-k3u1fbpfcp-watermark.image?)

还会提示需要 class-transformer 这个包：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9950f20f7db4de895efc6c2e328c522~tplv-k3u1fbpfcp-watermark.image?)

它是把普通对象转换为对应的 class 实例的包：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d025a51956394e74a1a82ff11c590098~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98495919df1543ff902de67745de3b3f~tplv-k3u1fbpfcp-watermark.image?)

后面我们也会用到这俩包。

安装这俩包：

    npm install -D class-validator class-transformer

然后访问下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52d39b2ada2747299fdc7f7fd37c9406~tplv-k3u1fbpfcp-watermark.image?)

你会发现它确实把每一项都提取出来了，但是没有转为 number。

这时候就需要用 new XxxPipe 的方式传入参数了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95f05794c3f94db9ad283e4930147b51~tplv-k3u1fbpfcp-watermark.image?)

指定 item 的类型。

这样就把数组每一项处理为 number 了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6077cce97aef47cfb6df5a0f420fb91b~tplv-k3u1fbpfcp-watermark.image?)

此外，你还可以指定分隔符：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa6c885ffc2f4eccb06442430b2b7176~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0361c705bb9845da9b38c32d6c23f411~tplv-k3u1fbpfcp-watermark.image?)

当没有传参数的时候会报错：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/203e7685cadb41fb9b07cb05a2925af5~tplv-k3u1fbpfcp-watermark.image?)

可以把它设置为 optional：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e389f42e0a8b4ad89511bf73b3c9a27d~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d79c376c0ae48ac9d16bcf7476f7a01~tplv-k3u1fbpfcp-watermark.image?)

然后是 ParseEnumPipe：

假设我们有这样一个枚举：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b18934cd71074a1abb00e5788650c40d~tplv-k3u1fbpfcp-watermark.image?)

就可以用 ParseEnumPipe 来取：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd33fe52b7f0491d892e95462e8107e3~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c55f4a16e454abe8c3aca59ed01111f~tplv-k3u1fbpfcp-watermark.image?)

有同学说，这不是多此一举么，本来 @Param 也能把它取出来呀。

ParseEnumPipe 还是有用的：

第一个是可以限制参数的取值范围：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c64dc64a7f9742c083ddaae9e041ad32~tplv-k3u1fbpfcp-watermark.image?)

如果参数值不是枚举里的，就会报错。

这个错误自然也可以通过 errorHttpStatusCode 和 exceptionFactory 来定制。

第二个是帮你转换类型：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66bbf74c69a14addae795fc398e25d1d~tplv-k3u1fbpfcp-watermark.image?)

这里拿到的就直接是枚举类型了，如果有个方法的参数是这样的枚举类型，就可以直接传入。

接下来是 ParseUUIDPipe：

UUID 是一种随机生成的几乎不可能重复的字符串，可以用来做 id。

它有 v3、v4、v5 3 个版本，我们用 uuid 包可以生成这种 id：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e352ab28776a4174b0b32d89f6d59d4d~tplv-k3u1fbpfcp-watermark.image?)

在参数里，可以用 ParseUUIDPipe 来校验是否是 UUID：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d046a82c4b9345daad4d4be5f19d5fbc~tplv-k3u1fbpfcp-watermark.image?)

如果不是 uuid 会抛异常：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3de426d3123c4e23a336d006d4ba2380~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a41ef1845a9849f08e923dc8361097bf~tplv-k3u1fbpfcp-watermark.image?)

接下来是 DefaultValuePipe：

这个是设置参数默认值的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8077504a0f1404482d6f3be7b17ac5c~tplv-k3u1fbpfcp-watermark.image?)

当你没传参数的时候，会使用默认值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3026296b87344451b8dfc929c741307b~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d732443f95d4ee0aa23248436497b56~tplv-k3u1fbpfcp-watermark.image?)

它的源码也很简单：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44835473f29b4304a78850642c238437~tplv-k3u1fbpfcp-watermark.image?)

还剩下 ValidationPipe 和 ParseFilePipe，这个我们之后再讲。

接下来我们自己实现个 Pipe 试一下：

    nest g pipe aaa --flat --no-spec

生成一个 pipe，打印下参数值，返回 aaa：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3ba624bacce466da270a118eb856fe3~tplv-k3u1fbpfcp-watermark.image?)

在 handler 里用下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cfb11c44b6648328d1890e1c3154884~tplv-k3u1fbpfcp-watermark.image?)

浏览器访问这个接口：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00cde610b641471eb9f5c520654a6c44~tplv-k3u1fbpfcp-watermark.image?)

返回的值是 aaaaaa，也就是说 pipe 的返回值就是传给 handler 的参数值。

打印的 value 就是 query、param 的值，而 metadata 里包含 type、metatype、data：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db98d9dc787040c2b2db96ce7c3e54c2~tplv-k3u1fbpfcp-watermark.image?)

type 就是 @Query、@Param、@Body 装饰器，或者自定义装饰器：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f784ab236374d5c89645c9a707002d7~tplv-k3u1fbpfcp-watermark.image?)

而 metatype 是参数的 ts 类型：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/835ef7054764499b8fbfb6c821801568~tplv-k3u1fbpfcp-watermark.image?)

data 是传给 @Query、@Param、@Body 等装饰器的参数。

有了这些东西，做一下验证，抛出异常给 exception filter 处理，或者对 value 做些转换再传给 handler 就都是很简单的事情了。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/pipe-test)。

## 总结

Pipe 是在参数传给 handler 之前做一些验证和转换的，有 9 个内置的 Pipe 可以直接用。

我们过了一遍内置的 ParseIntPipe、ParseBoolPipe、ParseArrayPipe、ParseUUIDPipe、ParseEnumPipe、ParseFloatPipe 还有 DefaultValuePipe。

剩下的 ValidationPipe 和 ParseFilePipe 之后的章节讲。

自己写一个 pipe 也很简单，就是实现 PipeTransform 接口的 transform 方法，它的返回值就是传给 handler 的值。

在 pipe 里可以拿到装饰器和 handler 参数的各种信息，基于这些来实现校验和转换就是很简单的事情了。
