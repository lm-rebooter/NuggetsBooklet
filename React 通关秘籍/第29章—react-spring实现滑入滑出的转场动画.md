有的时候，直接展示一个组件会过于突兀，需要一些过渡效果。

比如这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdf1708f709c479b81e236606d0bb896~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=808&h=1408&s=763331&e=gif&f=27&b=faf9f9)

点击结算的时候，展示结算页面的组件，点击返回的时候隐藏。

这里是通过滑入滑出的动画来实现的过渡。

这个效果是我公司的项目里真实在用的，这节我们来一起实现下。

我们说的转场动画、过渡动画是一个东西，你看下英文翻译就知道了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53607a9317b94f47a5c9163ec0db418e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1714&h=508&s=119034&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40a4538a6b7347009e54253d4cd9b50e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=558&h=314&s=34498&e=png&b=f7f7fa)

这里的过渡动画很明显可以用我们学过的 react-transition-group 或者 react-spring 来做。

我们就用 reac-spring 结合上节学的 styled-components 来实现下。

创建个 vite 项目：

```
npx create-vite slide-in-out-transition
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6501c63d3d1c4099b9dda09b79fada18~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1014&h=336&s=67609&e=png&b=ffffff)

安装用到的包：

```
npm install

npm install --save @react-spring/web

npm install --save styled-components
```

要实现这样的效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5746d5496f33461196170a41358e80de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=808&h=1408&s=763331&e=gif&f=27&b=faf9f9)

首先，我们需要一个 div 包裹它。

创建 src/Overlay.tsx

```javascript
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

export default Overlay;
```

然后在 src/SlideInOverlay.tsx 里用一下：

```javascript
import React, { FC, PropsWithChildren } from "react";
import { useTransition, animated } from "@react-spring/web";
import Overlay from "./Overlay";

const DURATION = 300;

interface SlideInOverlayProps extends PropsWithChildren {
  isVisible: boolean;
  from?: "right" | "bottom";
}

const SlideInOverlay: FC<SlideInOverlayProps> = (props) => {
  const { isVisible, from = "right", children } = props;

  const x = React.useMemo(
    () => (from === "right" ? window.screen.width : window.screen.height),
    [from]
  );

  const transitions = useTransition(isVisible, {
    x,
    opacity: 1,
    from: {
      x,
      opacity: 1,
    },
    enter: { x: 0, opacity: 1 },
    leave: { x, opacity: 0 },
    config: { duration: DURATION },
  });

  const translate = React.useCallback(
    (x: number) => {
      switch (from) {
        case "right":
          return `translateX(${x}px)`;
        case "bottom":
          return `translateY(${x}px)`;
      }
    },
    [from]
  );

  return (
    <>
      {transitions(
        (props, isVisible) =>
          isVisible && (
            <Overlay
              as={animated.div}
              style={{
                transform: props.x.to((x) => (x === 0 ? "none" : translate(x))),
                opacity: props.opacity,
              }}
            >
              {children}
            </Overlay>
          )
      )}
    </>
  );
};

export { SlideInOverlay, DURATION };
```

代码比较多，我们一部分一部分来看下：

首先，这个 SlideInOverlay 组件有 3 个 props：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09b914d6955e45218f22a9201d958291~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1304&h=668&s=152383&e=png&b=1f1f1f)

isVisible 是是否展示。

from 是从右向左还是从下向上来运动，取值为 right 或 bottom。

children 传入具体的内容。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55e59352a01e4081840de713615e1e11~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1686&h=1792&s=318882&e=png&b=1f1f1f)


用 react-spring 的 useTransition 来做动画，改变 x、opcity 属性。

设置初始值、from 的值、enter 的值，以及 leave 的值。

也就是进入动画开始、进入动画结束、离开动画结束的值。

然后下面的 div 使用 react-spring 传入的 x、opcity 来设置样式就好了。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8878c0a8eb9e4ee0ab60b2ecb971bb77~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1624&h=1780&s=317707&e=png&b=1f1f1f)

Overlay 是样式组件，用 as 转为用 animated.div 渲染。

初始值 x 根据 from 参数是 right 还是 bottom 来设置 window.screen.width 或者 height。


这里用 useMemo 的好处是只要 from 参数没变，就直接用之前的值。

然后 react-spring 传入的 x 还需要根据 from 来转为 translateX 或者 translateY 的样式。

这样，转场动画就完成了。

我们来试一下：

去掉 main.tsx 的 StrictMode 和 index.css。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/721dfcd460be4d07aa1c468725a6268c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1274&h=504&s=99283&e=png&b=1f1f1f)

在 App.tsx 里用一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59ccf976ed344685ba590583f1b12a42~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=1240&s=202931&e=png&b=1f1f1f)

```javascript
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { SlideInOverlay } from "./SlideInOverlay";

function App() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setShow(true);
        }}
      >
        开启
      </button>
      <SlideInOverlay
        isVisible={show}
        from="right"
        className={"guangguang"}
        style={{
          border: "2px solid #000",
        }}
      >
        <div>
          <button
            onClick={() => {
              setShow(false);
            }}
          >
            关闭
          </button>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </SlideInOverlay>
    </>
  );
}

export default App;
```

我们加了一个 state 来保存显示隐藏状态，加了两个 button，点击的时候切换。

跑一下：

```
npm run dev
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08f0014cb24e42c08a7087923146f3f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=344&s=45979&e=png&b=191919)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85969f4c4af947b0990bed8e7d4731de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1806&h=1628&s=414384&e=gif&f=30&b=fbf9fd)

可以看到，滑入滑出的转场动画（或者叫过渡动画）生效了。

而且因为只是改变了 translate，组件不会销毁，所以状态也可以保留。

再来试下另一种效果，把 from 改为 bottom：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e7b0c41d9ca4af5b71973b9232810cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1758&h=1590&s=543432&e=gif&f=38&b=fefefe)

完美！

用在真实项目里就是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdf1708f709c479b81e236606d0bb896~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=808&h=1408&s=763331&e=gif&f=27&b=faf9f9)

然后我们再完善一下细节：

加上 className 和 style 两个 props。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa03fb1f76b04feb9cbf8722e8a418ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1568&h=1074&s=264776&e=png&b=1f1f1f)

```javascript
interface SlideInOverlayProps extends PropsWithChildren {
  isVisible: boolean;
  from?: "right" | "bottom";
  className?: string | string[];
  style?: CSSProperties;
}
```

传入样式组件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/167ccd864b0c4423ba626aaffe870813~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1638&h=1138&s=198640&e=png&b=1f1f1f)

安装用到的 classnames 包

```
npm install --save classnames
```

测试下：

![d-14.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcca28e311754d78b6f6961890264c27~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=1198&s=167180&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b3db38145fd43fb98c468a34918d4e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2072&h=1580&s=723250&e=gif&f=44&b=fbf9fd)

可以看到 style 生效了，className 也加上了。

我们继续完善，添加 onEnter 参数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e274b1d41d17452290ec148ff5a3916b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1316&h=974&s=165182&e=png&b=1f1f1f)

然后加一下处理逻辑：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9f544c3433a4f42b5d4864f47e9ce40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1258&h=1110&s=159064&e=png&b=1f1f1f)

```javascript
useEffect(() => {
  let timer = null;

  if (isVisible === true && onEnter != null) {
    timer = setTimeout(onEnter, DURATION);
  }

  return () => {
    if (timer != null) {
      clearTimeout(timer);
    }
  };
}, [isVisible, onEnter]);
```

因为我们设置了动画的时长是 DURATION 常量，所以这里用一个 setTimeout 就可以实现 onEnter

判断下 isVisible 是 true 的时候再执行 onEnter 的定时器。

并且当 isVisible、onEnter 变化的时候，销毁上次的定时器，重新跑。

测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30e088cc4f27448482b554311241827a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1128&h=1118&s=165672&e=png&b=202020)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8699aba8143c4e0c80825ea8b1ba577d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2468&h=1672&s=850528&e=gif&f=40&b=fcfbfe)

没啥问题。

接下来继续实现 onExit。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c64c4b629ed34ad39c87785bb943f7bf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1410&h=1106&s=196274&e=png&b=1f1f1f)

添加参数，然后加上 useEffect 通过 setTimeout 触发：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ba9e715654846c6910d8efaff768faa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1300&h=1148&s=180318&e=png&b=1f1f1f)

```javascript
useEffect(() => {
  let timer = null;

  if (isVisible === false && onExit != null) {
    timer = setTimeout(onExit, DURATION);
  }

  return () => {
    if (timer != null) {
      clearTimeout(timer);
    }
  };
}, [isVisible, onExit]);
```

跑一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aebde34a0af545be8ef54095a6ad399c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1110&h=992&s=145310&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a9e880eded2427eadf822e2a7cd64c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2054&h=1674&s=896253&e=gif&f=44&b=fdfafe)

可以看到，滑入滑出时的回调没问题，但是最开始多回调了一次 onExit。

如何判断出最开始那一次呢？

记录下 isVisible 参数就可以了，如果是从 true 变为 false 才触发。

用 useRef 保存上次的 isVisible 参数的值，如果上次的是 true 而当前 isVisible 是 false 就触发。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9e1258ecf1c47cc89b3b92a37be00f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1564&h=1372&s=237248&e=png&b=1f1f1f)

```javascript
const visibleRef = useRef(isVisible);

useEffect(() => {
    let timer = null;

    if (isVisible === false && visibleRef.current === true && onExit != null) {
      timer = setTimeout(onExit, DURATION);
    }

    visibleRef.current = isVisible;

    return () => {
      if (timer != null) {
        clearTimeout(timer);
      }
    };
}, [isVisible, onExit]);
```
测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/436185830a6e40aebdb2683d6ad8de5f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2196&h=1742&s=870257&e=gif&f=38&b=fdfafe)

可以看到，现在最开始多的一次调用就没有了。

这样，这个 SlideInOverlay 组件就完成了。

当然，你还可以做更多的扩展，比如点击商品的时候从下面滑入商品详情：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7dca99016da34d2590f4f65c6d1b508e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=374&h=818&s=99675&e=png&b=fdfcfc)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/140b57053a734737b9fdd2c77ff47fbd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1420&h=1206&s=133623&e=gif&f=23&b=f6f6f4)

这里是距离顶部有一段距离的，这个距离也可以作为参数传入。

如果想实现这种和手势结合的动画呢？

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccf5bd51fb854729a6a18f30b4d4e1d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=320&h=692&s=3170214&e=webp&f=100&b=faf9fc)

这个我们做过了呀，可以回去看看手势库那节。

拖动速度、方向、距离这类需求都可以用手势库搞定。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/slide-in-out-transition)

## 总结

很多场景下，加上转场动画会使交互体验更好。

这节我们用 react-spring 实现了滑入滑出的转场动画（或者叫过渡动画）。

支持了 isVisible、from、children、onExit、onEnter、className、style 参数。

from 可以设置 right 或 bottom，然后根据它来设置 x 参数初始值为 window.screen.width 或者 window.screen.height。

改变 x、opacity 就可以实现滑入滑出的动画。

我们通过 useRef 记录之前的参数来实现了 onExit 的回调。

用 styled-components 写了外层 div 的样式。

这样的 SlideInOverlay 组件就比较完善了，可以直接用在项目里。
