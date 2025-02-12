JSX 的标签体部分会通过 children 的 props 传给组件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1188b684ffe748808c99f97fc25e570f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=466&h=176&s=38205&e=png&b=202020)

在组件里取出 props.children 渲染：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0eba2a061c4427cb20114ef8f9d6fde~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=596&h=494&s=52740&e=png&b=1f1f1f)

但有的时候，我们要对 children 做一些修改。

比如 Space 组件，传入的是 3 个 .box 的 div：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1188b684ffe748808c99f97fc25e570f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=466&h=176&s=38205&e=png&b=202020)

但渲染出来的 .box 外面包了一层：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8b4f4c80e51424e988bf3304aa57466~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1066&h=582&s=117436&e=png&b=ffffff)

这种就需要用 React.Children 的 api 实现。

有这些 api：

- Children.count(children)
- Children.forEach(children, fn, thisArg?)
- Children.map(children, fn, thisArg?)
- Children.only(children)
- Children.toArray(children)

我们来试一下。

用 cra 创建个 react 项目：

```shell
npx create-react-app --template=typescript children-test
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afca05e6473b4dbf8d4017c8d82d04c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1158&h=232&s=46645&e=png&b=010101)

进入项目，改下 index.tsx

```javascript
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);
```
然后在 App.tsx 里测试下 Children 的 api：

```javascript
import React, { FC } from 'react';

interface AaaProps {
  children: React.ReactNode
}

const Aaa: FC<AaaProps> = (props) => {
  const { children } = props;

  return <div className='container'>
    {
      React.Children.map(children, (item) => {
        return <div className='item'>{item}</div>
      })
    }
  </div>
}

function App() {
  return <Aaa>
    <a href="#">111</a>
    <a href="#">222</a>
    <a href="#">333</a>
  </Aaa>
}

export default App;
```
在传入的 children 外包了一层 .item 的 div。

跑一下：

```shell
npm run start
```
可以看到，渲染出的 children 是修改后的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe805ec09a8d406891b150c93c3063d4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=868&h=1060&s=122188&e=png&b=ffffff)

有的同学说，直接用数组的 api 可以么？

我们试试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a4c404ea8d14c21a6067f4a44747e45~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=870&h=708&s=106899&e=png&b=1f1f1f)

```javascript
interface AaaProps {
  children: React.ReactNode[]
}

const Aaa: FC<AaaProps> = (props) => {
  const { children } = props;

  return <div className='container'>
    {
      // React.Children.map(children, (item) => {
      children.map(item => {
        return <div className='item'>{item}</div>
      })
    }
  </div>
}
```
要用数组的 api 需要把 children 类型声明为 ReactNode[]，然后再用数组的 map 方法：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4f33bef81c546b6b6ec7d2181ed67fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=860&h=1114&s=125239&e=png&b=ffffff)

看起来结果貌似一样？

其实并不是。

首先，因为要用数组方法，所以声明了 children 为 ReactNode[]，这就导致了如果 children 只有一个元素会报错：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/150733781703407c83b033e1b8b6312e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1624&h=312&s=71746&e=png&b=202020)

更重要的是当 children 传数组的时候：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e889f38bd77489aa660785c03442c42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=878&h=754&s=99104&e=png&b=1f1f1f)

```javascript
function App() {
  return <Aaa>
    {
        [
            <span>111</span>,
            <span>333</span>,
            [<span>444</span>, <span>222</span>]
        ]
    }
  </Aaa>
}
```
数组的 map 处理后是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d0fe4111120442caf69b8de0a05686e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=846&h=1148&s=137452&e=png&b=ffffff)

换成 React.Children.map 是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d834eda0350c47579d785f91144d9b47~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932&h=758&s=106552&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6f2df06877146ea888b1e5d26a61ec3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=790&h=1206&s=141115&e=png&b=ffffff)

React.Children.map 会把 children 拍平，而数组的方法不会。

还有一点，有时候直接调用数组的 sort 方法会报错：

```javascript
import React, { FC } from 'react';

interface AaaProps {
  children: React.ReactNode[]
}

const Aaa: FC<AaaProps> = (props) => {
  const { children } = props;

  console.log(children.sort());

  return <div className='container'>
  </div>
}

function App() {
  return <Aaa>
    {33}
    <span>hello world</span>
    {22}
    {11}
  </Aaa>
}

export default App;

```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8adc84d911cb4331a13a311c9eafa906~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1848&h=1284&s=399640&e=png&b=f8edec)

因为 props.children 的元素是只读的，不能重新赋值，所以也就不能排序。

这时候只要用 React.Children.toArray 转成数组就好了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26f2e186608e44d29415c5ef97ebac68~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=818&h=616&s=94705&e=png&b=1f1f1f)

（这里不用 children 数组方法了，就直接声明为 ReactNode 类型了）

```javascript
interface AaaProps {
  children: React.ReactNode
}

const Aaa: FC<AaaProps> = (props) => {
  const { children } = props;

  const arr = React.Children.toArray(children);
  
  console.log(arr.sort());

  return <div className='container'>
  </div>
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6714896482a466b9ce418b6c55eea70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936&h=908&s=86350&e=png&b=ffffff)

综上，直接用数组方法操作 children 有 3 个问题：

- 用数组的方法需要声明 children 为 ReactNode[] 类型，这样就必须传入多个元素才行，而 React.Children 不用
- 用数组的方法不会对 children 做拍平，而 React.Children 会
- 用数组的方法不能做排序，因为 children 的元素是只读的，而用 React.Children.toArray 转成数组就可以了

当然，不用记这些区别，只要操作 children，就用 React.Children 的 api 就行了。

然后再试下其它 React.Children 的 api：

```javascript
import React, { FC, useEffect } from 'react';

interface AaaProps {
  children: React.ReactNode
}

const Aaa: FC<AaaProps> = (props) => {
  const { children } = props;

  useEffect(() => {
    const count = React.Children.count(children);
  
    console.log('count', count);
    
    React.Children.forEach(children, (item, index) => {
      console.log('item' + index, item);
    });
  
    const first = React.Children.only(children);
    console.log('first', first);
  }, []);

  return <div className='container'>
  </div>
}

function App() {
  return <Aaa>
    {33}
    <span>hello world</span>
    {22}
    {11}
  </Aaa>
}

export default App;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d72a12fc204144ca9ca4edc038cd0af0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1860&h=532&s=115608&e=png&b=fcf8f8)

React.Children.count 是计数，forEach 是遍历、only 是如果 children 不是一个元素就报错。

这些 api 都挺简单的。

有的同学可能会注意到，Children 的 api 也被放到了 Legacy 目录下，并提示用 Children 的 api 会导致代码脆弱，建议用别的方式替代：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77b07793b88d4c3e9137bd254e966528~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2170&h=522&s=85605&e=png&b=fef8f5)

我们先看看这些替代方式：

首先，我们用 React.Children 来实现这样的功能：

```javascript
import React, { FC } from 'react';

interface RowListProps {
  children?: React.ReactNode
}

const RowList: FC<RowListProps> = (props) => {
  const { children } = props;

  return <div className='row-list'>
    {
      React.Children.map(children, item => {
        return <div className='row'>
          {item}
        </div>
      })
    }
  </div>
}

function App() {
  return <RowList>
    <div>111</div>
    <div>222</div>
    <div>333</div>
  </RowList>
}

export default App;
```
对传入的 children 做了一些修改之后渲染。

结果如下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d50897a260d048ba94fe40a639ab6941~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=892&h=1094&s=124737&e=png&b=ffffff)

第一种替代方案是这样的：

```javascript
import React, { FC } from 'react';

interface RowProps{
  children?: React.ReactNode
}

const Row: FC<RowProps> = (props) => {
  const { children } = props;
  return <div className='row'>
    {children}
  </div>
}

interface RowListProps{
  children?: React.ReactNode
}

const RowList: FC<RowListProps> = (props) => {
  const { children } = props;

  return <div className='row-list'>
    {children}
  </div>
}

function App() {
  return <RowList>
    <Row>
      <div>111</div>
    </Row>
    <Row>
      <div>222</div>
    </Row>
    <Row>
      <div>333</div>
    </Row>
  </RowList>
}

export default App;
```
就是把对 children 包装的那一层封装个组件，然后外面自己来包装。

跑一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/269a904d413f40648510f884f444fb57~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=762&h=1080&s=116265&e=png&b=ffffff)

这样是可以的。

当然，这里的 RowListProps 和 RowProps 都是只有 children，我们直接用内置类型 PropsWithChildren 来简化下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a211618142dc4425b218c768df88a2ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=596&s=102579&e=png&b=1f1f1f)

```javascript
import React, { FC, PropsWithChildren } from 'react';

const Row: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return <div className='row'>
    {children}
  </div>
}

const RowList: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return <div className='row-list'>
    {children}
  </div>
}

function App() {
  return <RowList>
    <Row>
      <div>111</div>
    </Row>
    <Row>
      <div>222</div>
    </Row>
    <Row>
      <div>333</div>
    </Row>
  </RowList>
}

export default App;
```

第二种方案不使用 chilren 传入具体内容，而是自己定义一个 prop：

```javascript
import { FC, PropsWithChildren, ReactNode } from 'react';

interface RowListProps extends PropsWithChildren {
  items: Array<{
    id: number,
    content: ReactNode
  }>
}

const RowList: FC<RowListProps> = (props) => {
  const { items } = props;

  return <div className='row-list'>
      {
        items.map(item => {
          return  <div className='row' key={item.id}>{item.content}</div>
        })
      }
  </div>
}

function App() {
  return <RowList items={[
    {
      id: 1,
      content: <div>111</div>
    },
    {
      id: 2,
      content: <div>222</div>
    },
    {
      id: 3,
      content: <div>333</div>
    }
  ]}>
  </RowList>
}

export default App;

```
我们声明了 items 的 props，通过其中的 content 来传入内容。

效果是一样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e1ce290aa634de686b588adb2aa41ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=778&h=1076&s=113871&e=png&b=ffffff)

而且还可以通过 render props 来定制渲染逻辑：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d20df626a8d9439899b46c2df497c1ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=866&s=141513&e=png&b=1f1f1f)

```javascript
import { FC, PropsWithChildren, ReactNode } from 'react';

interface Item {
  id: number,
  content: ReactNode
}

interface RowListProps extends PropsWithChildren {
  items: Array<Item>,
  renderItem: (item: Item) => ReactNode
}

const RowList: FC<RowListProps> = (props) => {
  const { items, renderItem } = props;

  return <div className='row-list'>
      {
        items.map(item => {
          return renderItem(item);
        })
      }
  </div>
}

function App() {
  return <RowList items={[
    {
      id: 1,
      content: <div>111</div>
    },
    {
      id: 2,
      content: <div>222</div>
    },
    {
      id: 3,
      content: <div>333</div>
    }
  ]}
  renderItem={(item) => {
    return <div className='row' key={item.id}>
      <div className='box'>
          {item.content}
      </div>
    </div>
  }}
  >
  </RowList>
}

export default App;
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e8846512011407ab2adf18139b31cbb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=876&h=1342&s=170903&e=png&b=ffffff)

综上，替代 props.children 有两种方案：

- 把对 children 的修改封装成一个组件，使用者用它来手动包装 
- 声明一个 props 来接受数据，内部基于它来渲染，而且还可以传入 render props 让使用者定制渲染逻辑

但是这些替代方案使用起来和 React.Children 还是不同的。

React.Children 使用起来是无感的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84ec99656b09438799f92213aceed252~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=394&h=262&s=27148&e=png&b=202020)

而这两种替代方案使用起来是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25e2d484eccc4b3e82243f39ffc7c351~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=452&h=470&s=44070&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51dd0658866f4c2caa749c17ae94d3b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=562&h=610&s=51580&e=png&b=1f1f1f)


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a832922f3fb44913b34c67466cae26d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=712&h=870&s=87642&e=png&b=202020)

虽然能达到同样的效果，但是还是用 React.Children 内部修改 children 的方式更易用一些。

而且现在各大组件库依然都在大量用 React.Children

比如 semi design 的代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d6615f4f0d845a5acac90b3ea847c65~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=1058&s=210708&e=png&b=1c1c1c)

arco design 的代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f837c0259e2409db0fff149b7bb6c68~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932&h=1148&s=237104&e=png&b=1c1c1c)

ant design 的代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78a04f9ba3a5400388cce11357c27985~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=892&h=1016&s=190487&e=png&b=1c1c1c)

比如我们上节写过的 Space 组件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce5133833ba841a68ddbb8ebe4a53eb0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1602&h=1188&s=257222&e=png&b=ffffff)

所以 React.Children 还是可以继续用的，因为这些替代方案和 React.Children 还是有差距。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/children-test)。
## 总结

我们学了用 React.Children 来修改 children，它有 map、forEach、toArray、only、count 等方法。

不建议直接用数组方法来操作，而是用 React.Children 的 api。

原因有三个：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10224f0c551f40b8a866bd6a510a268a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=314&s=92726&e=png&b=ffffff)

当然，Children 的 api 被放到了 legacy 目录，可以用这两种方案来替代：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/846e9e99373b4589a4b8beeb6c7fc8f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1116&h=226&s=59289&e=png&b=ffffff)

不过，这两种替代方案易用性都不如 React.Children，各大组件库也依然大量使用 React.Children 的 api。

所以，遇到需要修改渲染的 children 的情况，用 React.Children  的 api，或是两种替代方案（抽离渲染逻辑为单独组件、传入数据 + render props）都可以。
