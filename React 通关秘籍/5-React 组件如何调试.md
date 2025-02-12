大家都是怎么调试 React 组件的呢？

很多同学都会说，console.log 啊。

这样可以，但效率太低了，因为你只能看到你打印的一些零散值，看不到代码的具体执行路线，比如走了哪些分支、调用某个函数的时候参数是什么。

而如果你使用 debugger 断点调试的方式，就可以看到代码执行的细节，可以在关心的地方断住，单步执行来观察是否符合预期，可以帮你更好的理清代码逻辑。

所以说，学会断点调试 React 组件的代码，是提升你写代码和排查错误的水平的很重要的一步。

这节我们就来学下 React 组件的调试。

用 cra 创建个项目：

```
npx create-react-app --template typescript debug-test
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3412a97b90f84445865205353750577a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1172&h=312&s=55423&e=png&b=010101)

改下 index.tsx

```javascript
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
```
然后在 App.tsx 写个组件：

```javascript
import { useEffect, useLayoutEffect, useState } from "react";

async function queryData() {
  const data = await new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(666);
    }, 2000);
  })
  return data;
}

function App() {
  const [num, setNum] = useState(0);

  useLayoutEffect(() => {
    queryData().then(data => {
      setNum(data);
    })
  }, []);

  return (
    <div onClick={(e) => {
      setNum((prevNum) => prevNum + 1)
    }}>{num}</div>
  );
}

export default App;

```
把开发服务跑起来：

```
npm run start
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dead91b48d8c4bbdb7bb118d4bd64bb4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=734&h=332&s=61069&e=gif&f=40&b=fdfdfd)

点击 debug 面板的 create a launch.json file

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dda22e46d3514c3ca255b4df7e8b0970~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=574&h=514&s=60111&e=png&b=191919)

选择 chrome 类型的调试配置：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfbd5914af6b473cbb2dba179fe7f3f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=656&h=292&s=44345&e=png&b=242424)

它会创建 .vscode/launch.json 文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a773f098837d47689b5c5b0aa9ea295e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1516&h=658&s=166485&e=png&b=1d1d1d)

把端口改为 3000

然后点击调试按钮，会跑一个浏览器：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1282274d541348de9208261b874a756c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2194&h=1500&s=354960&e=gif&f=46&b=1c1c1c)

打几个断点，然后点击刷新：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9c21c647c704b949a768f3ec8b202c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1174&h=1096&s=174480&e=png&b=1f1f1f)

代码会在断点处断住，左边可以看到作用域、调用栈，鼠标 hover 到变量上可以看到变量值：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4249285353ee4473a82e8e1984b957be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1742&h=1166&s=370604&e=png&b=1c1c1c)

这几个按钮分别是跳断点执行、单步执行、进入函数、跳出函数、刷新、停止：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f749c951a1e1486992fdee09b8c6896d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=370&h=72&s=9501&e=png&b=191919)

可以点点试试看。

在页面点击 div，会触发 click 事件，在断点处断住，

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c146f775f6114e5894d6b7d60c9a0f1f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1896&h=1336&s=392492&e=png&b=1b1b1b)

可以在下面的 debug console 输入变量或者表达式，会输出执行结果：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0e9f2c69987412f8a1c0d560bf5bb5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=942&s=142048&e=png&b=1a1a1a)

这样调试不比 console.log 方便多了？

而且还有其他几种断点类型：

右键可以选择添加一个条件断点:

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca5047b7bc0b42d0bfa876e18a463140~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=792&h=380&s=67773&e=png&b=1f1f1f)

输入表达式，代码会在满足条件的时候断住：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08248fe17d7b4d1faf1036649fa6ca7f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=754&h=360&s=46712&e=png&b=202020)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8aaf9aef9db4103a3a5075a6dae36d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=964&h=718&s=108197&e=png&b=1f1f1f)

也可以选择 hit count，代码会在触发对应的次数的时候断住：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60d040cc80854781b7a3b63f279d42b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=782&h=322&s=41778&e=png&b=202020)

或者是 logpoint，它不会断住，但会在代码执行到这里的时候打印表达式的值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13a7c41d2e0747ac830451249275611f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=714&h=282&s=58337&e=png&b=bbb6b4)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e022713ed3fc4d8486dafdf40f3b87fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=992&h=686&s=97744&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d4f0241ad2743e5959a4d51645089f8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=846&h=718&s=81430&e=png&b=1c1c1c)

这些断点类型也都挺有用的。

这样我们就可以在 VSCode 里边写 React 组件边断点调试了。

不过，有同学可能会问，这个浏览器好像没有 React DevTools 啊。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00425306a95649168c77212b65275f7b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2262&h=1340&s=201160&e=png&b=ffffff)

确实，因为这跑的是一个新的浏览器实例，没有之前的那些用户数据。

用户数据是保存在 userDataDir 里的，一个 userDataDir 对应一个浏览器实例。

不信我们试试看：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62bec04f06cd454e9a8675ce62424c73~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1326&h=840&s=159851&e=png&b=1f1f1f)

我指定一个 userDataDir，然后点击调试启动。

在启动的浏览器里把掘金收藏为书签：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9ffea90489b4667aba6f2c792393138~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2042&h=826&s=262530&e=png&b=fefefe)

然后进入刚才那个 userDataDir，进入 defaults 目录，看一下 Bookmarks 文件的内容： 

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f870900285c8497cb5ae5566f783cece~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918&h=1096&s=187442&e=png&b=010101)

就有刚才保存的书签了。

同理，各种 chrome 插件、浏览记录、cookies 等等，所有用户数据都是保存在 userDataDir 里。

chrome 一个 userDataDir 只能跑一个实例。

我们调试的时候，如果没有指定 userDataDir，默认是临时创建一个新的 userDataDir。

所以这时候自然就没有 React DevTools 等你之前安装的插件了。

如果想调试的时候还用这些插件，那可以把 userDataDir 设置为 false，就是这样就是用默认的 userDatDir 来跑：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b697eab725e04e1f957f39475a5b0e16~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=874&h=650&s=109369&e=png&b=1f1f1f)

这时候需要你把之前跑的 chrome 关掉才能跑，因为一个 userDataDir 只能跑一个实例。

之后再点击调试，这次跑的浏览器就有你之前装的 React DevTools 了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1df222df59944f69b633891adecabf82~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2276&h=934&s=106150&e=png&b=ffffff)

这样，我们就可以在 VSCode 里断点调试，并且跑的调试浏览器还有 React DevTools 可用了。

## 总结

这节我们学了如何用 VSCode 调试 React 组件。

点击创建 launch.json，输入 chrome 类型的调试配置，点击调试，这时候代码就会在打的断点处断住。

断点类型有普通断点、条件断点、hit count、logpoint 等。

用 debugger 可以在想调试的代码处断住，单步调试，看一些变量的变化，看代码执行路线，这样高效很多。

此外，chrome 的各种用户数据是保存在 userDataDir 下，一个 userDataDir 只能跑一个实例。

默认跑的浏览器是会创建新的临时 userDataDir，所以没有之前的用户数据，也就没有之前安装的 React DevTools 等插件。

可以把它设置为 false，然后关掉别的浏览器再跑，这时候就是在默认 userDataDir 跑的，各种用户的数据都有。

会断点调试 React 组件，是提高开发和排查问题效率的很重要的技能。
