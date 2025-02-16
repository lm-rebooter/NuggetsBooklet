现在写 React 组件都是基于 TypeScript，所以如何给组件写类型也是很重要的。

这节我们就来学下 React 组件如何写 TypeScript 类型。

用 cra 创建个项目：

```
npx create-react-app --template typescript react-ts
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a06a833a02342fa9bbd6e0a6d09d937~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=298&s=83108&e=png&b=010101)

我们平时用的类型在 @types/react 这个包里，cra 已经帮我们引入了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70a001ebbcd74459a4a0a0eca4b6b14b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=776&h=602&s=120514&e=png&b=1f1f1f)

## JSX 的类型

在 App.tsx 里开始练习 TypeScript 类型：

```javascript
interface AaaProps {
  name: string;
}

function Aaa(props: AaaProps) {
  return <div>aaa, {props.name}</div>
}

function App() {
  return <div>
    <Aaa name="guang"></Aaa>
  </div>
}

export default App;
```

其实组件我们一般不写返回值类型，就用默认推导出来的。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af1f13bc560e46bb9840a75b40aedfbe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=844&h=172&s=36884&e=png&b=202020)

React 函数组件默认返回值就是 JSX.Element。

我们看下 JSX.Element 的类型定义：

```javascript
const content: JSX.Element = <div>aaa</div>
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26c662972489430698a287aedb432561~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1234&h=300&s=61014&e=png&b=202020)

可以看到它就是 React.ReactElement。

也就是说，如果你想描述一个 jsx 类型，就用 React.ReactElement 就好了。

比如 Aaa 组件有一个 content 的 props，类型为 ReactElement：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37a609f702e54e06aa99a9e10eac076f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=782&s=126160&e=png&b=1f1f1f)

这样就只能传入 JSX。

跑一下：
```
npm run start
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7358b1f4c4ee4a858a9bb87176609c41~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=582&h=214&s=18661&e=png&b=fefefe)

ReactElement 就是 jsx 类型，但如果你传入 null、number 等就报错了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad3cfd438f61454c8a07367f9a5957c1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1326&h=690&s=150465&e=png&b=202020)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6713b88bee6b4c3996833dcc435d2948~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1354&h=736&s=163455&e=png&b=202020)

那如果有的时候就是 number、null 呢？

换成 ReactNode 就好了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4375cc818344992b9c7dc14fcb1ff48~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=918&h=786&s=120357&e=png&b=1f1f1f)

看下它的类型定义：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/739c7c079ec84a9fa6f14a1923370a73~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1058&h=476&s=68910&e=png&b=1f1f1f)

ReactNode 包含 ReactElement、或者 number、string、null、boolean 等可以写在 JSX 里的类型。

这三个类型的关系 ReactNode > ReactElement > JSX.Element。

所以，一般情况下，如果你想描述一个参数接收 JSX 类型，就用 ReactNode 就行。

## 函数组件的类型

前面的函数组件，我们都没明确定义类型：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b496b77eb774ae882319a548e79c8f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=328&s=47885&e=png&b=1f1f1f)

其实它的类型是 FunctionComponent：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0394b3b32a99425e8204a8bc3be39e45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986&h=548&s=101485&e=png&b=1f1f1f)

```javascript
const Aaa: React.FunctionComponent<AaaProps> = (props) => {
  return <div>aaa, {props.name}{props.content}</div>
}
```

看下它的类型定义：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31af367a957b4f6186f8df0f4bcb5fa7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=766&h=350&s=77020&e=png&b=1f1f1f)

可以看到，FC 和 FunctionComponent 等价，参数是 Props，返回值是 ReactNode。

而且函数组件还可以写几个可选属性，这些用到了再说。

## hook 的类型

接下来过一下 hook 的类型：

### useState

先从 useState 开始：

一般用推导出的类型就行：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81fda4ec23b447a78459f275a59de784~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=600&h=240&s=34118&e=png&b=212121)

也可以手动声明类型：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6360b69158440b68be7c2043d776b88~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=732&h=270&s=37889&e=png&b=202020)

useEffect 和 useLayoutEffect 这种没有类型参数的就不说了。

### useRef

useRef 我们知道，可以保存 dom 引用或者其他内容。

所以它的类型也有两种。

保存 dom 引用的时候，参数需要传个 null：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d2a680752614e78ab7391a26eec900f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=844&h=370&s=64517&e=png&b=1f1f1f)

不然会报错：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a5a7789771144309c0b0e1bfbf2fcec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=798&h=368&s=63076&e=png&b=1f1f1f)

而保存别的内容的时候，不能传 null，不然也会报错，说是 current 只读：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f41dbf1da46e43e1afa31e3b45465a5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=722&h=326&s=42725&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/760491ca046d4369aeca68e16c633248~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074&h=478&s=88173&e=png&b=202020)

为什么呢？

看下类型就知道了：

当你传入 null 的时候，返回的是  RefObject，它的 current 是只读的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a076b4afb7e450fa29646955aca4abc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=898&h=142&s=38104&e=png&b=202020)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c03177f418e6499d86e7855a8a376ea8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=536&h=142&s=21952&e=png&b=202020)

这很合理，因为保存的 dom 引用肯定不能改呀。

而不传 null 的时候，返回的 MutableRefObject，它的 current 就可以改了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/521b681a404542708922c520666aa246~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=876&h=128&s=30073&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8b7017a29b64726877d15c2ff881980~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=506&h=132&s=15886&e=png&b=202020)

因为 ref 既可以保存 dom 引用，又可以保存其他数据，而保存 dom 引用又要加上 readonly，所以才用 null 做了个区分。

传 null 就是 dom 引用，返回 RefObject，不传就是其他数据，返回 MutableRefObject。

所以，这就是一种约定，知道传 null 和不传 null 的区别就行了。

### useImperativeHandle

我们前面写过 forwardRef + useImperativeHandle 的例子，是这样的：
```javascript
import { useRef } from 'react';
import { useEffect } from 'react';
import React from 'react';
import { useImperativeHandle } from 'react';

interface GuangProps {
  name: string;
}

interface GuangRef {
  aaa: () => void;
}

const Guang: React.ForwardRefRenderFunction<GuangRef, GuangProps> = (props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      aaa() {
        inputRef.current?.focus();
      }
    }
  }, [inputRef]);

  return <div>
    <input ref={inputRef}></input>
    <div>{props.name}</div>
  </div>
}

const WrapedGuang = React.forwardRef(Guang);

function App() {
  const ref = useRef<GuangRef>(null);
 
  useEffect(()=> {
    console.log('ref', ref.current)
    ref.current?.aaa();
  }, []);

  return (
    <div className="App">
      <WrapedGuang name="guang" ref={ref}/>
    </div>
  );
}

export default App;
```

forwardRef 包裹的组件会额外传入 ref 参数，所以它不是 FunctionComponent 类型，而是专门的 ForwardRefRenderFunction 类型。

它有两个类型参数，第一个是 ref 内容的类型，第二个是 props 的类型：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54851a11e0904c00bf02a066fe1327fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1320&h=488&s=86757&e=png&b=1f1f1f)

其实 forwardRef 也是这两个类型参数，所以写在 forwardRef 上也行：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b810feacb37f4e1f892b443ff92c247f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1316&h=1080&s=184360&e=png&b=1f1f1f)

```javascript
import { useRef } from 'react';
import { useEffect } from 'react';
import React from 'react';
import { useImperativeHandle } from 'react';

interface GuangProps {
  name: string;
}

interface GuangRef {
  aaa: () => void;
}

const WrapedGuang = React.forwardRef<GuangRef, GuangProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      aaa() {
        inputRef.current?.focus();
      }
    }
  }, [inputRef]);

  return <div>
    <input ref={inputRef}></input>
    <div>{props.name}</div>
  </div>
});

```

useImperativeHanlde 可以有两个类型参数，一个是 ref 内容的类型，一个是 ref 内容扩展后的类型。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de49d22a23d14af390755b798ed60a55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=448&s=83706&e=png&b=1f1f1f)

useImperativeHanlde 传入的函数的返回值就要求满足第二个类型参数的类型

不过一般没必要写，因为传进来的 ref 就已经是有类型的了，直接用默认推导的就行。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/325bc2607a7b4522bf884c82b65d0182~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1192&h=686&s=115889&e=png&b=1f1f1f)

### useReducer

useReducer 可以传一个类型参数也可以传两个：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34513b19f0524fe7bcece9d37d23bf05~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1038&h=146&s=29763&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8020481fe85f47f0bc5fbcfb44dd86d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1418&h=246&s=47877&e=png&b=1f1f1f)

当传一个的时候，是 Reducer<xx,yy> 类型，xx 是 state 的类型，yy 是 action 的类型。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b91a697c2e7f4e4fa06daaaf00f94fd4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=984&s=137680&e=png&b=1f1f1f)

当传了第二个的时候，就是传入的初始化函数参数的类型。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dce530abe9344688f93353469ddcd4b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2042&h=410&s=83629&e=png&b=202020)

### 其余 hook

剩下的 hook 的类型比较简单，我们快速过一遍：

useCallback 的类型参数是传入的函数的类型：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/306888df90d449d6b1fee62d4021d0c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=694&h=164&s=21770&e=png&b=1f1f1f)

useMemo 的类型参数是传入的函数的返回值类型：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9caf01c8c888462dba7291abf74dfdf6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=692&h=218&s=23221&e=png&b=1f1f1f)

useContext 的类型参数是 Context 内容的类型：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21fb9f3abe244e9880ced421112effad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=886&h=836&s=135108&e=png&b=1f1f1f)

当然，这些都没必要手动声明，用默认推导的就行。

再就是 memo：

它可以直接用包裹的函数组件的参数类型：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2ac84404bb1485bb5a69fe40d2b3a00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=548&h=286&s=38611&e=png&b=1f1f1f)

也可以在类型参数里声明：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b4853f14ae34c7095460b72d1761f54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=234&s=38751&e=png&b=1f1f1f)

## 参数类型

回过头来，我们再来看传入组件的 props 的类型。

### PropsWithChildren

前面讲过，jsx 类型用 ReactNode，比如这里的 content 参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/857cedbf20584091958556a8e66083bc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=706&s=97090&e=png&b=1f1f1f)


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cc0a0ab989e4083a228e66916395869~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=556&h=214&s=18470&e=png&b=ffffff)

如果你不想通过参数传入内容，可以在 children 里：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62214b3f27e543658e5efb2999e66c9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=826&h=458&s=83020&e=png&b=202020)

这时候就要声明 children 的类型为 ReactNode：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0adb78933ab14db9960151343df506b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=938&h=778&s=129762&e=png&b=202020)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f873d6f0aa442f9bb45e94828f0eaa6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=966&h=796&s=118907&e=png&b=1f1f1f)

```javascript
import React, { ReactNode } from "react";

interface CccProps {
  content: ReactNode,
  children: ReactNode
}

function Ccc(props: CccProps) {
  return <div>ccc,{props.content}{props.children}</div>
}

function App() {

  return <div>
    <Ccc content={<div>666</div>}>
      <button>7777</button>
    </Ccc>
  </div>
}

export default App;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/492c175d83464ed69a6682ed0654d6b5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=606&h=256&s=20936&e=png&b=fefefe)

但其实没有必要自己写，传 children 这种情况太常见了，React 提供了相关类型：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c29f67f6098744d4a509a2a0dd26fc8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=780&s=122592&e=png&b=1f1f1f)

```javascript
type CccProps = PropsWithChildren<{
  content: ReactNode,
}>
```
看下它的类型定义：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fc5583334354131a01f9d3e210d28e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1196&h=90&s=22457&e=png&b=1f1f1f)

就是给 Props 加了一个 children 属性。

### CSSProperties

有时候组件可以通过 props 传入一些 css 的值，这时候怎么写类型呢？

用 CSSProperties。

比如加一个 color 参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cbc9d356c52449384cf6d60b9e9dc18~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1036&h=880&s=141437&e=png&b=1f1f1f)

或者加一个 styles 参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/446fa299b8a24f3d922502f19b73ab38~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1016&h=914&s=177867&e=png&b=202020)

可以看到，提示出了 css 的样式名，以及可用的值：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51145fe5f9d448eda877ae3e4ab1527f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=538&s=91444&e=png&b=202020)

```javascript
import React, { CSSProperties, PropsWithChildren, ReactNode } from "react";

type CccProps = PropsWithChildren<{
  content: ReactNode,
  color: CSSProperties['color'],
  styles: CSSProperties
}>


function Ccc(props: CccProps) {
  return <div>ccc,{props.content}{props.children}</div>
}

function App() {

  return <div>
    <Ccc content={<div>666</div>} color="yellow" styles={{
      backgroundColor: 'blue'
    }}>
      <button>7777</button>
    </Ccc>
  </div>
}

export default App;
```

## HTMLAttributes

如果你写的组件希望可以当成普通 html 标签一样用，也就是可以传很多 html 的属性作为参数呢？

那可以继承 HTMLAttributes：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2d3ffd6cf624098b0263a4a9052b9bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=664&s=102247&e=png&b=202020)

上图中可以看到，提示了很多 html 的属性。

```javascript
import React, { HTMLAttributes } from "react";

interface CccProps extends HTMLAttributes<HTMLDivElement>{

    } 

function Ccc(props: CccProps) {
  return <div>ccc</div>
}

function App() {

  return <div>
    <Ccc p>
      <button>7777</button>
    </Ccc>
  </div>
}

export default App;
```

那 HTMLAttributes 的类型参数是干嘛的呢？

是其中一些 onClick、onMouseMove 等事件处理函数的类型参数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e7dcfd5c2e1418ca2724e4747754e3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1278&h=766&s=136620&e=png&b=1f1f1f)

当然，继承 HTMLAttributes 只有 html 通用属性，有些属性是某个标签特有的，这时候可以指定 FormHTMLAttributes、AnchorHTMLAttributes 等：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74e4bab0162d495ebea8e5ca43b19877~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1176&h=622&s=164769&e=png&b=202020)

比如 a 标签的属性，会有 href：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e39d3c9360f4a9ea57fe47f4c2d61d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1016&h=402&s=82287&e=png&b=1f1f1f)

### ComponentProps

继承 html 标签的属性，前面用的是 HTMLAttributes：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50004ec749274b17ba849602ba485852~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1170&h=748&s=116897&e=png&b=202020)

其实也可以用 ComponentProps：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de8abe65d228464da421f49e477a597a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=742&s=107156&e=png&b=202020)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e040bf8dc474f849415449f3426e1e6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1286&h=816&s=125377&e=png&b=1f1f1f)

效果一样。

ComponentProps 的类型参数是标签名，比如 a、div、form 这些。

## EventHandler

很多时候，组件需要传入一些事件处理函数，比如 clickHandler：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c8165aeff374200b521fb702dec5a26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1352&h=824&s=141509&e=png&b=1f1f1f)

```javascript
import React, { HTMLAttributes, MouseEventHandler } from "react";

interface CccProps {
  clickHandler: MouseEventHandler
} 

function Ccc(props: CccProps) {
  return <div onClick={props.clickHandler}>ccc</div>
}

function App() {

  return <div>
    <Ccc clickHandler={(e) => {
      console.log(e);
    }}></Ccc>
  </div>
}

export default App;
```
这种参数就要用 xxxEventHandler 的类型，比如 MouseEventHandler、ChangeEventHandler 等，它的类型参数是元素的类型。

或者不用 XxxEventHandler，自己声明一个函数类型也可以：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ac760e40c3f4786b3f24ba6d4f72bc9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=872&s=140993&e=png&b=1f1f1f)

```javascript
interface CccProps {
  clickHandler: (e: MouseEvent<HTMLDivElement>) => void
} 
```
案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/react-ts)。

## 总结

我们过了一遍写 React 组件会用到的类型：

- **ReactNode**：JSX 的类型，一般用 ReactNode，但要知道 ReactNode、ReactElement、JSX.Element 的关系

- **FunctionComonent**：也可以写 FC，第一个类型参数是 props 的类型

- **useRef 的类型**：传入 null 的时候返回的是 RefObj，current 属性只读，用来存 html 元素；不传 null 返回的是 MutableRefObj，current 属性可以修改，用来存普通对象。

- **ForwardRefRenderFunction**：第一个类型参数是 ref 的类型，第二个类型参数是 props 的类型。forwardRef 和它类型参数一样，也可以写在 forwardRef 上

- **useReducer**：第一个类型参数是 Reducer<data 类型, action 类型>，第二个类型参数是初始化函数的参数类型。

- **PropsWithChildren**：可以用来写有 children 的 props

- **CSSProperties**： css 样式对象的类型

- **HTMLAttributes**：组件可以传入 html 标签的属性，也可以指定具体的 ButtonHTMLAttributes、AnchorHTMLAttributes。

- **ComponentProps**：类型参数传入标签名，效果和 HTMLAttributes 一样

- **EventHandler**：事件处理器的类型

后面写 React 组件的时候，会大量用到这些 typescript 的类型。