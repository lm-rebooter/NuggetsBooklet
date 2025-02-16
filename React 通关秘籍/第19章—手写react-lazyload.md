网页里可能会有很多图片，图片加载有一个过程，我们会在图片加载过程中展示占位图片。

并且我们不需要一开始就加载所有图片，而是希望在图片滚动到可视区域再加载。

这种效果我们会用 react-lazyload 来实现。

创建个项目：

```
npx create-vite
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f025d7d5ad94483932f9b03d773a78f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=874&h=406&s=52005&e=png&b=000000)

进入项目，安装 react-lazyload

```
npm install

npm install --save react-lazyload

npm install --save-dev @types/react-lazyload

npm install --save prop-types
```
prop-types 是 react-lazyload 用到的包。

去掉 index.css 和 StrictMode：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d518270e1074b90b3407d6880bc0033~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1014&h=416&s=77891&e=png&b=1f1f1f)

然后改下 App.tsx

```javascript
import img1 from './img1.png';
import img2 from './img2.png';
import LazyLoad from 'react-lazyload';

export default function App() {
  return (
    <div>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <LazyLoad placeholder={<div>loading...</div>}>
        <img src={img1}/>
      </LazyLoad>
      <LazyLoad placeholder={<div>loading...</div>}>
        <img src={img2}/>
      </LazyLoad>
    </div>
  );
};
```
在超出一屏的位置加载两张图片，用 LazyLoad 包裹。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c681f6093b4b4eefae2ba3ccb5f8d735~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1586&h=756&s=155856&e=png&b=ffffff)

可以看到，最开始展示 placeholder 的内容。

当图片划入可视区域后，会替换成图片：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5b85e46a00449e28f58ece8b2218fef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1682&h=1596&s=1575146&e=gif&f=22&b=fdfdfd)

在网络里也可以看到，当图片进入可视区域才会下载：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43d9869a63e0447f9145f27331e7fbfe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1682&h=1596&s=4927141&e=gif&f=26&b=fdfdfd)

这就是 react-lazyload 的作用。

当然，它能做的可不只是懒加载图片，组件也可以。

我们知道，用 lazy 包裹的组件可以异步加载。

我们写一个 Guang.tsx

```javascript
export default function Guang() {
    return '神说要有光';
}
```
然后在 App.tsx 里异步引入：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b9dc3bd3d4b416e93da2dd6e275dbff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=956&h=504&s=92360&e=png&b=1f1f1f)

```javascript
const LazyGuang = React.lazy(() => import('./Guang'));
```

import() 包裹的模块会单独打包，然后 React.lazy 是用到这个组件的时候才去加载。

试下效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0effc2a659c44292b8a388e85fb612e4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1408&h=1424&s=230546&e=png&b=ffffff)

可以看到，确实是异步下载了这个组件并渲染出来。

那如果我们想组件进入可视区域再加载呢？

这样：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7df5c3cafb2c48bbbcd13bdc656ed821~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=910&h=498&s=92735&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f4f54c8768c4762bc0e3c154cf8eb67~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=852&h=356&s=66549&e=png&b=202020)

react-lazyload 是进入可视区域才会把内容替换为 LazyGuang，而这时候才会去下载组件对应的代码。

效果就是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93a53f7d319842e7b339e0fb0d2d2a73~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1682&h=1596&s=934064&e=gif&f=30&b=fdfdfd)

可以看到，Guang.tsx 的组件代码，img2.png 的图片，都是进入可视区域才加载的。

你还可以设置 offset，也就是不用到可视区域，如果 offset 设置 200，那就是距离 200px 到可视区域就触发加载：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fee950cee345488ebf420159b5218420~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=338&s=66850&e=png&b=202020)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c088c9294fd74e62836883131ff4ecd5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1682&h=1596&s=941486&e=gif&f=27&b=fdfdfd)

可以看到，现在 img2 还没到可视区域就加载了。

知道了 react-lazyload 怎么用，那它是怎么实现的呢？

用前两节讲过的 IntersectionObserver 就可以实现。

我们来写一下：

src/MyLazyLoad.tsx

```javascript
import {
    CSSProperties,
    FC,
    ReactNode,
    useRef,
    useState
} from 'react';

interface MyLazyloadProps{
    className?: string,
    style?: CSSProperties,
    placeholder?: ReactNode,
    offset?: string | number,
    width?: number | string,
    height?: string | number,
    onContentVisible?: () => void,
    children: ReactNode,
}

const MyLazyload: FC<MyLazyloadProps> = (props) => {

    const {
        className = '',
        style,
        offset = 0,
        width,
        onContentVisible,
        placeholder,
        height,
        children
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    const styles = { height, width, ...style };

    return <div ref={containerRef} className={className} style={styles}>
        {visible? children : placeholder}
    </div>
}

export default MyLazyload;
```
先看下 props：

className 和 style 是给外层 div 添加样式的。

placeholder 是占位的内容。

offset 是距离到可视区域多远就触发加载。

onContentVisible 是进入可视区域的回调。

然后用 useRef 保存外层 div 的引用。

用 useState 保存 visible 状态。

visible 的时候展示 children，否则展示 placeholder。

然后补充下 IntersectionObserver 监听 div 进入可视区域的情况：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f29b77a741b548dd82f68a53b9200ba1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1450&h=1086&s=247186&e=png&b=1f1f1f)
```javascript
const elementObserver = useRef<IntersectionObserver>();

useEffect(() => {
    const options = {
        rootMargin: typeof offset === 'number' ? `${offset}px` : offset || '0px',
        threshold: 0
    };

    elementObserver.current = new IntersectionObserver(lazyLoadHandler, options);

    const node = containerRef.current;

    if (node instanceof HTMLElement) {
        elementObserver.current.observe(node);
    }
    return () => {
        if (node && node instanceof HTMLElement) {
            elementObserver.current?.unobserve(node);
        }
    }
}, []);
```
这里的 rootMargin 就是距离多少进入可视区域就触发，和参数的 offset 一个含义。

threshold 是元素进入可视区域多少比例的时候触发，0 就是刚进入可视区域就触发。

然后用 IntersectionObserver 监听 div。

之后定义下 lazyloadHandler：

```javascript
function lazyLoadHandler (entries: IntersectionObserverEntry[]) {
    const [entry] = entries;
    const { isIntersecting } = entry;

    if (isIntersecting) {
        setVisible(true);
        onContentVisible?.();

        const node = containerRef.current;
        if (node && node instanceof HTMLElement) {
            elementObserver.current?.unobserve(node);
        }
    }
};
```
当 isIntersecting 为 true 的时候，就是从不相交到相交，反之，是从相交到不相交。

这里设置 visible 为 true，回调 onContentVisible，然后去掉监听。

测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84622fd51f2e4343b14d0f9f75da1d63~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932&h=458&s=86100&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c46b7297e2694bc0a53bded33fe264ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1326&h=418&s=96722&e=png&b=202020)

可以看到，首先是图片加载，然后是组件加载，这说明 offset 生效了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4178060633ae4fb2933034cdbf1dce33~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1692&h=1528&s=1485329&e=gif&f=32&b=fdfdfd)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8c86931190745699945980fe4f71a3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1692&h=1528&s=551127&e=gif&f=27&b=fdfdfd)


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbdb5216532842fba4c86e7dc324740d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1692&h=1528&s=991051&e=gif&f=34&b=fdfdfd)

这样，我们就实现了 react-lazyload。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/react-lazyload-test)

## 总结

当图片进入可视区域才加载的时候，可以用 react-lazyload。

它支持设置 placeholder 占位内容，设置 offset 距离多少距离进入可视区域触发加载。

此外，它也可以用来实现组件进入可视区域时再加载，配合 React.lazy + import() 即可。

它的实现原理就是 IntersectionObserver，我们自己实现了一遍，设置 rootMargin 也就是 offset，设置 threshold 为 0 也就是一进入可视区域就触发。

图片、组件的懒加载（进入可视区域再触发加载）是非常常见的需求，不但要会用 react-lazyload 实现这种需求，也要能够自己实现。
