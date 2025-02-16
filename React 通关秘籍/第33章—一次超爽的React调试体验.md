我们学了如何在 VSCode 里断点调试 React 组件，也学了用 click-to-react-component 点击页面元素直接在 VSCode 打开对应组件。

这俩单独使用都很不错，而如果把两者结合起来用，会有更爽的调试体验。

比如我们要调试这个页面，理清这个输入框的内容是哪里来的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b28277d191f1499592679df67943c675~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1540&h=1306&s=205214&e=png&b=fcfcfc)

我们先在项目里引入 click-to-react-component

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e626b4145584cafb692ee1e6d86bb25~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1232&h=828&s=180924&e=png&b=1f1f1f)

用它来定位这个输入框的源码在哪，按住 option + 点击元素即可：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/972cfbbb2ff44abd8c0187a32e7a2bf1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2552&h=1762&s=1189631&e=gif&f=41&b=fdfcfc)

添加调试配置后启动 debug：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cc29977c3f3432fa7e7032cea348482~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2170&h=702&s=178418&e=png&b=1d1d1d)

然后在刚定位到的组件 return 的地方打个断点：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9253705cd8cc44618be9b68c9f990cb2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2148&h=1470&s=579776&e=png&b=1d1d1d)

发现这个 value 是从父组件通过 props 传进来的。

所以要继续去父组件里打断点。

但是 React 组件渲染的时候调用栈里都是 react 源码，找不到父组件在哪。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71f81ac9d8a64eeca29bb19335eba2b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1446&h=970&s=295654&e=png&b=1b1b1b)

那怎么办呢？

这时候可以借助 click-to-react-component 展示所有父组件的能力：

按住 option + 右键，会展示这个元素所在组件的所有父组件。

点击父组件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c885fa92d934ef79381d9e3f545a894~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2278&h=1474&s=1203026&e=gif&f=44&b=fcfcfc)

这样就定位到了父组件里渲染这个子组件的源码位置：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd04a9daeea749b1bc578e63e023c1d4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1980&h=1620&s=648178&e=png&b=1d1d1d)

这时候发现这个值依然是通过 props 传进来的。

所以我们用同样的方式继续往上找：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/331e7ab81aed403eaccb848429ebf549~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2300&h=1674&s=1402828&e=gif&f=47&b=fcfcfc)

定位到了一个自定义 hooks，参数都是这里返回的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b8e9ada372a40faacbc1cab7c178a9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1708&h=1056&s=318166&e=gif&f=18&b=1d1d1d)

在这里打个断点调试下：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1eedbe28a4c4099b16a97a6690320ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1814&h=998&s=1315018&e=gif&f=50&b=1c1c1c)

不断 step into 进入函数内部，最终，我们找到了这个参数的来源：

在 localStorage 里读取了某个 key，key 的名字也调试出来了。

这样我们就达成了调试目标。

整个过程我们根本不需要去理清业务代码的逻辑。

想想看，你是接手这个业务项目的新人，虽然你还没看这些业务代码，但你可以快速定位界面上显示的值的来源，定位到代码在哪里改。

是不是就很高效！

## 总结

这节我们把 VSCode 断点调试 React 组件和 click-to-react-component 点击元素在 VSCode 打开组件结合了起来。

引入 click-to-react-component，然后添加一个调试配置。

按照这样的步骤来：

- option + 点击页面上想调试的元素，定位到 VSCode 里的源码
- 打断点看一下值的来源
- 如果是来自父组件，那就用 option + 右键查找父组件，直接定位到父组件的源码
- 在定位到的父组件源码里打断点
- 不断往上找，直到找到产生这个值的地方，断点调试

这样，就算你不懂这段业务逻辑，也能快速梳理清楚整个流程，并知道在哪里改代码。

两者结合用，调试体验是非常爽的。
