Jotai 是一个 react 的状态管理库，主打原子化。

提到原子化，你可能会想到原子化 CSS 框架 tailwind。

比如这样的 css：


```html
<div class="aaa"></div>
```
```css
.aaa {
    font-size: 16px;
    border: 1px solid #000;
    padding: 4px;
}
```
用 tailwind 这样写：

```html
<div class="text-base p-1 border border-black border-solid"></div>
```

```css
.text-base {
    font-size: 16px;
}
.p-1 {
    padding: 4px;
}
.border {
    border-width: 1px;
}
.border-black {
    border-color: black;
}
.border-solid {
    border-style: solid;
}
```
定义一系列原子 class，用到的时候组合这些 class。

jotai 也是这个思想：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c323f28070da446c9f70a5c72dc17050~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=638&h=498&s=57331&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f7a52d698f94597b1aa7dfa7af97fb8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=450&h=164&s=14300&e=png&b=ffffff)

通过 atom 定义一个原子状态，可以把它组合起来成为新的状态。

那状态为什么要原子化呢？

来看个例子：

```javascript
import { FC, PropsWithChildren, createContext, useContext, useState } from "react";

interface ContextType {
  aaa: number;
  bbb: number;
  setAaa: (aaa: number) => void;
  setBbb: (bbb: number) => void;
}

const context = createContext<ContextType>({
  aaa: 0,
  bbb: 0,
  setAaa: () => {},
  setBbb: () => {}
});

const Provider: FC<PropsWithChildren> = ({ children }) => {
  const [aaa, setAaa] = useState(0);
  const [bbb, setBbb] = useState(0);

  return (
    <context.Provider
      value={{
        aaa,
        bbb,
        setAaa,
        setBbb
      }}
    >
      {children}
    </context.Provider>
  );
};

const App = () => (
  <Provider>
    <Aaa />
    <Bbb />
  </Provider>
);

const Aaa = () => {
  const { aaa, setAaa } = useContext(context);
  
  console.log('Aaa render...')

  return <div>
    aaa: {aaa}
    <button onClick={() => setAaa(aaa + 1)}>加一</button>
  </div>;
};

const Bbb = () => {
  const { bbb, setBbb } = useContext(context);
  
  console.log("Bbb render...");
  
  return <div>
    bbb: {bbb}
    <button onClick={() => setBbb(bbb + 1)}>加一</button>
  </div>;
};

export default App;

```
用 createContext 创建了 context，其中保存了 2 个useState 的 state 和 setState 方法。

用 Provider 向其中设置值，在 Aaa、Bbb 组件里用 useContext 取出来渲染。

浏览器访问下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f412d82d51714f4b9a63947cae9a1c1c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=824&h=1088&s=89706&e=gif&f=26&b=fdfdfd)

可以看到，修改 aaa 的时候，会同时触发 bbb 组件的渲染，修改 bbb 的时候，也会触发 aaa 组件的渲染。

因为不管修改 aaa 还是 bbb，都是修改 context 的值，会导致所有用到这个 context 的组件重新渲染。

这就是 Context 的问题。

解决方案也很容易想到：拆分成两个 context 不就不会互相影响了？

```javascript
import { FC, PropsWithChildren, createContext, useContext, useState } from "react";

interface AaaContextType {
  aaa: number;
  setAaa: (aaa: number) => void;
}

const aaaContext = createContext<AaaContextType>({
  aaa: 0,
  setAaa: () => {}
});

interface BbbContextType {
  bbb: number;
  setBbb: (bbb: number) => void;
}

const bbbContext = createContext<BbbContextType>({
  bbb: 0,
  setBbb: () => {}
});

const AaaProvider: FC<PropsWithChildren> = ({ children }) => {
  const [aaa, setAaa] = useState(0);

  return (
    <aaaContext.Provider
      value={{
        aaa,
        setAaa
      }}
    >
      {children}
    </aaaContext.Provider>
  );
};

const BbbProvider: FC<PropsWithChildren> = ({ children }) => {
  const [bbb, setBbb] = useState(0);

  return (
    <bbbContext.Provider
      value={{
        bbb,
        setBbb
      }}
    >
      {children}
    </bbbContext.Provider>
  );
};

const App = () => (
  <AaaProvider>
    <BbbProvider>
      <Aaa />
      <Bbb />
    </BbbProvider>
  </AaaProvider>
);

const Aaa = () => {
  const { aaa, setAaa } = useContext(aaaContext);
  
  console.log('Aaa render...')

  return <div>
    aaa: {aaa}
    <button onClick={() => setAaa(aaa + 1)}>加一</button>
  </div>;
};

const Bbb = () => {
  const { bbb, setBbb } = useContext(bbbContext);
  
  console.log("Bbb render...");
  
  return <div>
    bbb: {bbb}
    <button onClick={() => setBbb(bbb + 1)}>加一</button>
  </div>;
};

export default App;
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6efa34a0ed14a77a01b881d78ba08b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=824&h=1088&s=121131&e=gif&f=37&b=fdfdfd)

这样就好了。

这种把状态放到不同的 context 中管理，也是一种原子化的思想。

虽然说这个与 jotai 没啥关系，因为状态管理库不依赖于 context 实现，自然也没那些问题。

但是 jotai 在介绍原子化思想时提到了这个：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f68f86991da467b93d7b96cdf790d40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1878&h=530&s=132971&e=png&b=0d0d0d)

可能你用过 redux、zustand 这些状态管理库，jotai 和它们是完全两种思路。

用 zustand 是这样写：

```javascript
import { create } from 'zustand'

const useStore = create((set) => ({
  aaa: 0,
  bbb: 0,
  setAaa: (value) => set({ aaa: value}),
  setBbb: (value) => set({ bbb: value})
}))

function Aaa() {
    const aaa = useStore(state => state.aaa);
    const setAaa = useStore((state) => state.setAaa);
    
    console.log('Aaa render...')
    return <div>
        aaa: {aaa}
        <button onClick={() => setAaa(aaa + 1)}>加一</button>
    </div>
}

function Bbb() {
    const bbb = useStore(state => state.bbb);
    const setBbb = useStore((state) => state.setBbb);

    console.log('Bbb render...')

    return <div>
        bbb: {bbb}
        <button onClick={() => setBbb(bbb + 1)}>加一</button>
    </div>
}

export default function App() {
    return <div>
        <Aaa></Aaa>
        <Bbb></Bbb>
    </div>
}
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3242566136b647f0a94815a85f491823~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=890&h=834&s=125456&e=gif&f=39&b=fdfdfd)

store 里定义全部的 state，然后在组件里选出一部分来用。

这个叫做 selector：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/752ecda80ed1456fbba97f9cde86b20f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=894&h=362&s=66607&e=png&b=1f1f1f)

状态变了之后，zustand 会对比 selector 出的状态的新旧值，变了才会触发组件重新渲染。

此外，这个 selector 还可以起到派生状态的作用，对原始状态做一些修改：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7e37f0575b643cfac4bd77af5e51ef6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=908&h=360&s=68739&e=png&b=1f1f1f)

而在 jotai 里，每个状态都是独立的原子：

```javascript
import { atom, useAtom } from 'jotai'; 

const aaaAtom = atom (0);

const bbbAtom = atom(0);

function Aaa() {
    const [aaa, setAaa]= useAtom(aaaAtom);
    
    console.log('Aaa render...')
    return <div>
        aaa: {aaa}
        <button onClick={() => setAaa(aaa + 1)}>加一</button>
    </div>
}

function Bbb() {
    const [bbb, setBbb]= useAtom(bbbAtom);

    console.log('Bbb render...')

    return <div>
        bbb: {bbb}
        <button onClick={() => setBbb(bbb + 1)}>加一</button>
    </div>
}

export default function App() {
    return <div>
        <Aaa></Aaa>
        <Bbb></Bbb>
    </div>
}
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/678f0e5bf8a4460dadb1581ce6a106e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=890&h=834&s=138935&e=gif&f=28&b=fdfdfd)

状态可以组合，产生派生状态：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74d4ca3baa9e434884c8981631f57e83~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=754&h=902&s=116217&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5cd85a5b14b4f09b19556fdf31c504c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=824&h=350&s=88980&e=gif&f=29&b=fdfdfd)

而在 zustand 里是通过 selector 来做：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be730aa9d1a84ea9b4247e1e54b17f77~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=842&s=123564&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2436ce94699c4cf7837d10dc37fa6a8f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=824&h=350&s=77371&e=gif&f=26&b=fdfdfd)

不知道大家有没有感受到这两种方式的区别：

**zustand 是所有 state 放在全局 store 里，然后用到的时候 selector 取需要的部分。**

**jotai 是每个 state 单独声明原子状态，用到的时候单独用或者组合用。**

**一个自上而下，一个自下而上，算是两种思路。**

此外，异步逻辑，比如请求服务端接口来拿到数据，这种也是一个放在全局 store，一个单独放在原子状态里：

在 zustand 里是这样：

```javascript
import { create } from 'zustand'

async function getListById(id) {
    const data = {
        1: ['a1', 'a2', 'a3'],
        2: ['b1', 'b2', 'b3', 'b4']
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data[id]);
        }, 2000);
    });
}

const useStore = create((set) => ({
  list: [],
  fetchData: async (param) => {
    const data = await getListById(param);
    set({ list: data });
  },
}))

export default function App() {
    const list = useStore(state => state.list);
    const fetchListData = useStore((state) => state.fetchData);

    return <div>
        <button onClick={() => fetchListData(1)}>列表111</button>
        <ul>
            {
                list.map(item => {
                    return <li key={item}>{item}</li>
                })
            }
        </ul>
    </div>
}
```
在 store 里添加一个 fetchData 的 async 方法，组件里取出来用就行。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e83b8050cad42c5baeb10d1ec090e90~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=824&h=350&s=38506&e=gif&f=28&b=fdfdfd)

可以看到，2s 后拿到了数据设置到 list，并且触发了组件渲染。

而在 jotai 里，也是单独放在 atom 里的：

```javascript
import { atom, useAtom } from 'jotai'; 

async function getListById(id) {
    const data = {
        1: ['a1', 'a2', 'a3'],
        2: ['b1', 'b2', 'b3', 'b4']
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data[id]);
        }, 2000);
    });
}

const listAtom = atom([]);

const fetchDataAtom = atom(null, async (get, set, param) => {
    const data = await getListById(param);
    set(listAtom, data);
});

export default function App() {
    const [,fetchListData] = useAtom(fetchDataAtom);
    const [list] = useAtom(listAtom);

    return <div>
        <button onClick={() => fetchListData(2)}>列表222</button>
        <ul>
            {
                list.map(item => {
                    return <li key={item}>{item}</li>
                })
            }
        </ul>
    </div>
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/caf5ec47b3ed4137b9daa448df3f8c07~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=796&h=454&s=39288&e=gif&f=25&b=fefefe)

atom 除了可以直接传值外，也可以分别传入 get、set 函数。

之前的派生状态就是只传入了 get 函数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b3fe0dcf85348d2b0b24ad8f8cbb727~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=428&s=114815&e=png&b=202020)

这样，状态是只读的。

这里我们只传入了 set 函数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1531622a98741349cecc120d47d4c9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=268&s=47481&e=png&b=1f1f1f)

所以状态是只能写。

用的时候要取第二个参数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7b602d1aa8f4d6780fde996758a7ccd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=822&h=162&s=34080&e=png&b=1f1f1f)

当然，这么写有点费劲，所以 atom 对于只读只写的状态多了两个 hook：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a77794666864adc957d640065381c7a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1004&h=550&s=82231&e=png&b=202020)

useAtomValue 是读取值，useSetAtom 是拿到写入函数。

而常用的 useAtom 就是拿到这两者返回值的数组。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbd0d8f8795f4825a2dbc7c52a60c430~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=664&h=182&s=34602&e=png&b=202020)

效果一样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/caf5ec47b3ed4137b9daa448df3f8c07~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=796&h=454&s=39288&e=gif&f=25&b=fefefe)

当然，这里没必要用两个 atom，合并成一个就行：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f477c75d991c4e1b9f25ebf152aaa6eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=850&s=125580&e=png&b=1f1f1f)

```javascript
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'; 

async function getListById(id) {
    const data = {
        1: ['a1', 'a2', 'a3'],
        2: ['b1', 'b2', 'b3', 'b4']
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data[id]);
        }, 2000);
    });
}

const listAtom = atom([]);

const dataAtom = atom((get) => {
    return get(listAtom);
}, async (get, set, param) => {
    const data = await getListById(param);
    set(listAtom, data);
});

export default function App() {
    const [list, fetchListData] = useAtom(dataAtom);
    
    return <div>
        <button onClick={() => fetchListData(2)}>列表222</button>
        <ul>
            {
                list.map(item => {
                    return <li key={item}>{item}</li>
                })
            }
        </ul>
    </div>
}
```
此外，用 useSetAtom 有时候可以起到性能优化的作用。

比如这段代码：

```javascript
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'; 

const aaaAtom = atom(0);

function Aaa() {
    const [aaa] = useAtom(aaaAtom);

    console.log('Aaa render...');

    return <div>
        {aaa}
    </div>
}

function Bbb() {
    const [, setAaa] = useAtom(aaaAtom);

    console.log('Bbb render...');

    return <div>
        <button onClick={() => setAaa(Math.random())}>按钮</button>
    </div>
}

export default function App() {
    return <div>
        <Aaa></Aaa>
        <Bbb></Bbb>
    </div>
}
```

在 Aaa 组件里读取状态，在 Bbb 组件里修改状态。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c5748f67bf54c40a0209a8b8d750b25~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=946&h=864&s=116823&e=gif&f=20&b=fdfdfd)

可以看到，点击按钮 Aaa、Bbb 组件都重新渲染了。

而其实 Bbb 组件不需要重新渲染。

这时候可以改一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/581131660345448882d43f025e662a8e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=1048&s=152129&e=png&b=1f1f1f)

换成 useSetAtom，也就是不需要读取状态值。

这样状态变了就不如触发这个组件的重新渲染了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/194a522cd47e457cbbd9657999c8defc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=946&h=864&s=114007&e=gif&f=28&b=fefefe)

上面 Aaa 组件里也可以简化成 useAtomValue：

```javascript
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'; 

const aaaAtom = atom(0);

function Aaa() {
    const aaa = useAtomValue(aaaAtom);

    console.log('Aaa render...');

    return <div>
        {aaa}
    </div>
}

function Bbb() {
    const setAaa = useSetAtom(aaaAtom);

    console.log('Bbb render...');

    return <div>
        <button onClick={() => setAaa(Math.random())}>按钮</button>
    </div>
}

export default function App() {
    return <div>
        <Aaa></Aaa>
        <Bbb></Bbb>
    </div>
}
```

至此，jotai 的核心功能就讲完了：

**通过 atom 创建原子状态，定义的时候还可以单独指定 get、set 函数（或者叫 read、write 函数），用来实现状态派生、异步状态修改。**

**组件里可以用 useAtom 来拿到 get、set 函数，也可以通过 useAtomValue、useSetAtom 分别拿。**

**不需要读取状态的，用 useSetAtom 还可以避免不必要的渲染。**

那 zustand 支持的中间件机制在 jotai 里怎么实现呢？

zustand 支持通过中间件来修改 get、set 函数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5707cf2971a744b9b2d2a1d3f3ac30f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=846&h=656&s=106639&e=png&b=1f1f1f)

比如在 set 的时候打印日志。

或者用 persist 中间件把状态存储到 localStorage 中：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79e3f3f0cbc44fa0a4d242823ee92c44~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1484&h=1230&s=362790&e=png&b=262b37)

zustand 中间件的原理很简单，就是修改了 get、set 函数，做一些额外的事情。

试一下：

```javascript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(persist((set) => ({
    count: 0,
    setCount: (value) => set({ count: value})
}), {
    name: 'count-key'
}))

export default function App() {
    const count = useStore(state => state.count);
    const setCount = useStore((state) => state.setCount);
    
    return <div>
        count: {count}
        <button onClick={() => setCount(count + 1)}>加一</button>
    </div>
}
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97cb5cd555f54fd79b667b011db96303~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1402&h=1106&s=189007&e=gif&f=37&b=fdfdfd)

jotai 里是用 utils 包的 atomWithStorage：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6f128895d78499a8e787748659744d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1840&h=1322&s=278578&e=png&b=14161b)

试一下：

```javascript
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const countAtom = atomWithStorage('count-key2', 0)

export default function App() {
    const [count, setCount] = useAtom(countAtom);
    
    return <div>
        count: {count}
        <button onClick={() => setCount(count + 1)}>加一</button>
    </div>
}

```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f25d4e7aaab4a2f934c9b15e8c6faf4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1402&h=1106&s=185601&e=gif&f=31&b=fdfdfd)

它是怎么实现的呢？和 zustand 的中间件有啥区别么？

看下源码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/192ce04ddba1469381f209fad3cf7eab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=1166&s=215959&e=png&b=1f1f1f)

声明一个 atom 来存储状态值，然后又声明了一个 atom 来 get、set 它。

其实和 zustand 中间件修改 get、set 方法的原理是一样的，只不过 atom 本来就支持自定义 get、set 方法。

## 总结

今天我们学了状态管理库 jotai，以及它的原子化的思路。

声明原子状态，然后组合成新的状态，和 tailwind 的思路类似。

提到原子化状态管理，都会提到 context 的性能问题，也就是 context 里通过对象存储了多个值的时候，修改一个值，会导致依赖其他值的组件也跟着重新渲染。

所以要拆分 context，这也是原子化状态管理的思想。

zustand 是所有 state 放在全局 store 里，然后用到的时候 selector 取需要的部分。

jotai 是每个 state 单独声明原子状态，用到的时候单独用或者组合用。

一个自上而下，一个自下而上，这是两种思路。

jotai 通过 atom 创建原子状态，定义的时候还可以单独指定 get、set 函数（或者叫 read、write 函数），用来实现状态派生、异步状态修改。

组件里可以用 useAtom 来拿到 get、set 函数，也可以通过 useAtomValue、useSetAtom 分别拿。

不需要读取状态的，用 useSetAtom 还可以避免不必要的渲染。

zustand 的中间件是通过包一层然后修改 get、set 实现的，而 jotai 天然支持 get、set 的修改。

不管是状态、派生状态、异步修改状态、中间件等方面，zustand 和 jotai 都是一样的。

区别只是一个是全局 store 里存储所有 state，一个是声明原子 state，然后组合。

这只是两种思路，没有好坏之分，看你业务需求，适合哪个就用那个，或者你习惯哪种思路就用哪个。
