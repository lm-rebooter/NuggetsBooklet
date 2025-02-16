上节写了几个 react-use 的 hook，这节来写几个 ahooks 里的。

新建个项目：

```
npx create-vite
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c561156b15241b396b9c4551520684c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=428&s=49085&e=png&b=000000)

进入项目，安装依赖，然后把服务跑起来：

```
npm install
npm run dev
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7628300c5ffd43b7b3b7488ee3357434~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=764&h=284&s=35882&e=png&b=181818)

去掉 index.css 和 StrictMode：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/350a181d56e04023b628a29a33a867e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=408&s=76577&e=png&b=1f1f1f)

安装 ahooks：

```
npm install --save ahooks
```
## useSize

useSize 是用来获取 dom 尺寸的，并且在窗口大小改变的时候会实时返回新的尺寸

```javascript
import React, { useRef } from 'react';
import { useSize } from 'ahooks';

export default () => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  return (
    <div ref={ref}>
      <p>改变窗口大小试试</p>
      <p>
        width: {size?.width}px, height: {size?.height}px
      </p>
    </div>
  );
};
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/021dd0ac1d9c4be3b7d0a5ae28e4afef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1830&h=1188&s=1148560&e=gif&f=30&b=fefefe)

我们来实现下：

```javascript
import ResizeObserver from 'resize-observer-polyfill';
import { RefObject, useEffect, useState } from 'react';

type Size = { width: number; height: number };

function useSize(targetRef: RefObject<HTMLElement>): Size | undefined {

    const [state, setState] = useState<Size | undefined>(
        () => {
            const el = targetRef.current;
            return el ? { width: el.clientWidth, height: el.clientHeight } : undefined
        },
    );

    useEffect(() => {
        const el = targetRef.current;

        if (!el) {
            return;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const { clientWidth, clientHeight } = entry.target;
                setState({ width: clientWidth, height: clientHeight });
            });
        });
        resizeObserver.observe(el);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return state;
}

export default useSize;
```
用 useState 创建 state，初始值是传入的 ref 元素的宽高。

这里取 clientHeight，也就是不包含边框的高度。

网页里的各种距离、尺寸可以看[图解网页的各种距离](https://juejin.cn/book/7294082310658326565/section/7357716194742583330)那节。

然后用 ResizeObserver 监听元素尺寸的变化，改变的时候 setState 触发重新渲染。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b390b914a5774f4987eb6b7769c90268~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1188&h=1110&s=177529&e=png&b=1f1f1f)

这里为了兼容，用了 resize-observer-polyfill

```
npm i --save resize-observer-polyfill
```

换成我们实现的试一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f86c316aded458d809fdfa74647c670~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=972&h=578&s=106212&e=png&b=1f1f1f)

没啥问题：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e52cdca44e543fb911e55372182dae1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1830&h=1188&s=815119&e=gif&f=26&b=fefefe)

## useHover

上节用用过 react-use 的 useHover，它是传入 React Element （或者返回 React Element 的函数）的方式：

```javascript
import {useHover} from 'react-use';

const App = () => {
  const element = (hovered: boolean) =>
    <div>
      Hover me! {hovered && 'Thanks'}
    </div>;

  const [hoverable, hovered] = useHover(element);

  return (
    <div>
      {hoverable}
      <div>{hovered ? 'HOVERED' : ''}</div>
    </div>
  );
};

export default App;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f80d9146f6124d7686df4dab2550425a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=812&h=388&s=40970&e=gif&f=27&b=fdfdfd)

而 ahooks 里的 [useHover](https://ahooks.gitee.io/zh-CN/hooks/use-hover) 是这样用的：

```javascript
import React, { useRef } from 'react';
import { useHover } from 'ahooks';

export default () => {
  const ref = useRef<HTMLDivElement>(null);
  const isHovering = useHover(ref);
  return <div ref={ref}>{isHovering ? 'hover' : 'leaveHover'}</div>;
};
```
传入的是 ref。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b25942f393c45079fe505735246881d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=712&h=316&s=36104&e=gif&f=21&b=fefefe)

实现下：

```javascript
import { RefObject, useEffect, useState } from 'react';

export interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
  onChange?: (isHovering: boolean) => void;
}

export default (ref: RefObject<HTMLElement>, options?: Options): boolean => {
    const { onEnter, onLeave, onChange } = options || {};

    const [isEnter, setIsEnter] = useState<boolean>(false);

    useEffect(() => {
        ref.current?.addEventListener('mouseenter', () => {
            onEnter?.();
            setIsEnter(true);
            onChange?.(true);
        });
    
        ref.current?.addEventListener('mouseleave', () => {
            onLeave?.();
            setIsEnter(false);
            onChange?.(false);
        });
    }, [ref]);

    return isEnter;
};
```

上节讲过事件绑定类的 hook 有三种写法，之前用传入 React Element + cloneElement 的方式实现过，这次用 ref + addEventListener 实现的。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62b4cfe937214ef1953252775027af6c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1264&h=1104&s=215415&e=png&b=1f1f1f)

测试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64bab25dde114c9098e28ecfc0e64d03~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1102&h=342&s=74895&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ace14904e344980bf7ab07b9050d952~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=712&h=316&s=34697&e=gif&f=17&b=fefefe)

没啥问题。

## useTimeout

讲闭包陷阱那节我们实现过定时器的 hook：

```javascript
import React, { useState } from 'react';
import { useTimeout } from 'ahooks';

export default () => {
  const [state, setState] = useState(1);
  useTimeout(() => {
    setState(state + 1);
  }, 3000);

  return <div>{state}</div>;
};
```
它要保证只能跑一次，不然计时会不准。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/489348ae07a54bd09224777135c6cdee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=712&h=316&s=16857&e=gif&f=18&b=fefefe)

ahooks 的实现和我们之前实现一样：

```javascript
import { useCallback, useEffect, useRef } from 'react';

const useTimeout = (fn: () => void, delay?: number) => {

  const fnRef = useRef<Function>(fn);

  fnRef.current = fn;

  const timerRef = useRef<number>();

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(fnRef.current, delay);

    return clear;
  }, [delay]);

  return clear;
};

export default useTimeout;
```
首先 useRef 保存回调函数，每次调用都会更新这个函数，避免闭包陷阱（函数里引用之前的 state）：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc7e2725ed2c4d4989b2666d9f3fd562~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=894&s=131079&e=png&b=1f1f1f)

setTimeout 执行从 fnRef.current 取的最新的函数。

要不要在渲染函数里直接改 ref.current，其实都可以，[闭包陷阱那节](https://juejin.cn/book/7294082310658326565/section/7298292751051784230)也讲过。文档里不建议，但是很多库都是直接改的。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bfa9e18d1d54fa596b1c2dcdd458684~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1824&h=810&s=276682&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea6f88280a774cdab40c54e29a096d6f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1242&h=892&s=162174&e=png&b=fffdfd)

可以包一层 useLayoutEffect 或者 useEffect，这里我们就可以改了。

然后用 useRef 保存 timer 引用，方便 clear 函数里拿到它来 clearTimeout：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0de854ec9993455290ebde136cdfd74c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=890&h=942&s=119888&e=png&b=1f1f1f)

测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80cb07d8473e4084b4a0e941a910faa0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=728&h=442&s=73682&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36e9aadb7c8941118815bc4e2b8fafc0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=712&h=316&s=16807&e=gif&f=16&b=fefefe)

没啥问题。

## useWhyDidYouUpdate

props 变了会导致组件重新渲染，而 [useWhyDidYouUpdate](https://ahooks.gitee.io/zh-CN/hooks/use-why-did-you-update) 就是用来打印是哪些 props 改变导致的重新渲染：

用下试试：

```javascript
import { useWhyDidYouUpdate } from 'ahooks';
import React, { useState } from 'react';

const Demo: React.FC<{ count: number }> = (props) => {
  const [randomNum, setRandomNum] = useState(Math.random());

  useWhyDidYouUpdate('Demo', { ...props, randomNum });

  return (
    <div>
      <div>
        <span>number: {props.count}</span>
      </div>
      <div>
        randomNum: {randomNum}
        <button onClick={() => setRandomNum(Math.random)}>
          设置随机 state
        </button>
      </div>
    </div>
  );
};

export default () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Demo count={count} />
      <div>
        <button onClick={() => setCount((prevCount) => prevCount - 1)}>减一</button>
        <button onClick={() => setCount((prevCount) => prevCount + 1)}>加一</button>
      </div>
    </div>
  );
};
```
Demo 组件有 count 的 props，有 randomNum 的 state。

当 count 导致组件重新渲染时：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4dababd794849d5a15fc07005fee71b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1334&h=974&s=193208&e=gif&f=35&b=fdfdfd)

当 randomNum 导致组件重新渲染时：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c39ce6dccb04487af3e2878475d3772~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1334&h=974&s=270143&e=gif&f=30&b=fdfdfd)

都能打印出值从 from 改变到 to 导致的。

它的实现其实很简单，我们来写一下：

```javascript
import { useEffect, useRef } from 'react';

export type IProps = Record<string, any>;

export default function useWhyDidYouUpdate(componentName: string, props: IProps) {
  const prevProps = useRef<IProps>({});

  useEffect(() => {
    if (prevProps.current) {
      const allKeys = Object.keys({ ...prevProps.current, ...props });
      const changedProps: IProps = {};

      allKeys.forEach((key) => {
        if (!Object.is(prevProps.current[key], props[key])) {
          changedProps[key] = {
            from: prevProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', componentName, changedProps);
      }
    }

    prevProps.current = props;
  });
}
```
Record<string, any> 是任意的对象的 ts 类型。

核心就是 useRef 保存 props 或者其他值，当下次渲染的时候，拿到新的值和上次的对比下，打印值的变化：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5e440582b964e19aab6e7c9d239e71e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1254&h=962&s=178655&e=png&b=1f1f1f)

props 可以传入任意 props、state 或者其他值：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6863f3f65c214d15b0618a86ab9772d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=940&h=672&s=107414&e=png&b=1f1f1f)

实现很简单，但是比较有用的一个 hook。

## useCountDown

这个是用来获取倒计时的：

```javascript
import { useCountDown } from 'ahooks';

export default () => {
  const [countdown, formattedRes] = useCountDown({
    targetDate: `${new Date().getFullYear()}-12-31 23:59:59`,
  });

  const { days, hours, minutes, seconds, milliseconds } = formattedRes;

  return (
    <p>
      距离今年年底还剩 {days} 天 {hours} 小时 {minutes} 分钟 {seconds} 秒 {milliseconds} 毫秒
    </p>
  );
};
```
比如获取到今年年底的倒计时。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22ae3e894bdf4627a08745fe7bf31308~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=386&s=34099&e=gif&f=22&b=fefefe)

我们来实现下：

```javascript
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';

export type TDate = dayjs.ConfigType;

export interface Options {
  leftTime?: number;
  targetDate?: TDate;
  interval?: number;
  onEnd?: () => void;
}

export interface FormattedRes {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const calcLeft = (target?: TDate) => {
  if (!target) {
    return 0;
  }

  const left = dayjs(target).valueOf() - Date.now();
  return left < 0 ? 0 : left;
};

const parseMs = (milliseconds: number): FormattedRes => {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
    milliseconds: Math.floor(milliseconds) % 1000,
  };
};

const useCountdown = (options: Options = {}) => {
    const { leftTime, targetDate, interval = 1000, onEnd } = options || {};

    const memoLeftTime = useMemo<TDate>(() => {
        return leftTime && leftTime > 0 ? Date.now() + leftTime : undefined;
    }, [leftTime]);

    const target = 'leftTime' in options ? memoLeftTime : targetDate;

    const [timeLeft, setTimeLeft] = useState(() => calcLeft(target));

    const onEndRef = useRef(onEnd);
    onEndRef.current = onEnd;

    useEffect(() => {
        if (!target) {
            setTimeLeft(0);
            return;
        }

        setTimeLeft(calcLeft(target));

        const timer = setInterval(() => {
            const targetLeft = calcLeft(target);
            setTimeLeft(targetLeft);
            if (targetLeft === 0) {
                clearInterval(timer);
                onEndRef.current?.();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [target, interval]);

    const formattedRes = useMemo(() => parseMs(timeLeft), [timeLeft]);

    return [timeLeft, formattedRes] as const;
};

export default useCountdown;
```
代码比较多，一部分一部分来看。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69c2f7be28cf4d3a80464e11be3d4911~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1672&h=1014&s=215933&e=png&b=1f1f1f)

Options 是参数的类型，可以传入 leftTime 剩余时间，也可以传入目标日期值 targetDate。

interval 是倒计时变化的时间间隔，默认 1s。

onEnd 是倒计时结束的回调。

FormattedRes 是返回的格式化后的日期。

TDate 是 dayjs 允许的传入的日期类型。

然后 leftTime 和 targetDate 只需要取一个。

如果是 leftTime 那 Date.now() 加上 targetDate 就是目标日期。否则，就用传入的 targetDate。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93719daf2a4d4047a4869c53be18f9bd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270&h=612&s=146333&e=png&b=1f1f1f)

onEnd 的函数也是要用 useRef 保存，然后每次更新 ref.current，取的时候取 ref.current。

这也是为了避免闭包陷阱的。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/125e2662a7df42c6a6925934e342b870~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1146&h=686&s=132715&e=png&b=1f1f1f)

核心部分是 useState 创建一个 state，在初始和每次定时器都计算一次剩余时间：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ff70723eb9a4d83975c2a7419e89f55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1112&h=1116&s=193200&e=png&b=1f1f1f)

这个就是当前日期到目标日期的差值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fa00987925c493a9b26fe6d020aaae2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=882&s=201792&e=png&b=1f1f1f)

然后把它格式化一下就好了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2082e1da08e4cb7990d41cc17c820e1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1250&h=1222&s=275235&e=png&b=1f1f1f)

倒计时的逻辑很简单，就是通过定时器，每次计算下当前日期和目标日期的差值，返回格式化以后的结果。

注意传入的回调函数都要用 useRef 包裹下，用的时候取 ref.current，避免闭包陷阱。

测试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc0df5b635fa45cb961558fd36a927e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1296&h=588&s=114878&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e92a4f9a7aff4a3b829f44ab37d7662d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=386&s=36147&e=gif&f=20&b=fefefe)

没啥问题。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/ahooks-hook)
## 总结

这节我们写了几个 ahooks 里的自定义 hook。

useSize：拿到元素尺寸，通过 ResizeObserver 监听尺寸变动返回新的尺寸。

useHover：用 ref + addEventListener 实现的 hover 事件。

useTimeout：对 setTimeout 的封装，通过 useRef 保存 fn 避免了闭包陷阱。

useWhyDidYouUpdate：打印 props 或者 state 等的变化，排查引起组件重新渲染的原因，原理很简单，就是通过 useRef 保存之前的值，和当前渲染时的值对比

useCountDown：倒计时，通过当前时间和目标时间的差值实现，基于 dayjs。

写完这些 hook，相信你对自定义 hook 的封装更加得心应手了。
