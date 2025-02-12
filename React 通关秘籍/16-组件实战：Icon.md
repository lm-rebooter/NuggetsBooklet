Icon 图标组件是非常常用的组件。

它用起来非常简单，只要复制图标的组件名，直接渲染即可：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21ba1ce6940a47edbbb6282f9a5b14a1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2086&h=1206&s=182736&e=png&b=fefefe)

它也有一些 props：

spin 是让图标不断转圈：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddb92e08e42e4082a43e9a072c19e6eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=414&h=72&s=9930&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f0c59a0853f4e7d80303bd0174575ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=44&h=48&s=9652&e=gif&f=14&b=fcfcfc)

rotate 是指定图标旋转角度：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36d4d5454a134509af3aa00df69d254d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=550&h=64&s=12329&e=png&b=ffffff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45c6c1ed83e044f481e3af1ce2b1e8c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=42&h=46&s=3937&e=png&b=fdfdfd)

antd 内置了很多图标组件，如果觉得不够用，还可以自己扩展：

```javascript
import React from 'react';
import Icon from '@ant-design/icons';
import type { GetProps } from 'antd';

type CustomIconComponentProps = GetProps<typeof Icon>;

const HeartSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
  </svg>
);

const HeartIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={HeartSvg} {...props} />;

const App: React.FC = () => <HeartIcon style={{ color: 'pink' }} />;

export default App;
```
只要对 Icon 组件包一层，component 参数传入图标的 svg，那就是一个新的图标组件。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/130b1274ee384491ab57cefe6a346429~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=50&h=50&s=3797&e=png&b=ffffff)

而且如果你的项目用了 iconfont，你也可以把 iconfont 图标封装成 Icon 组件：

```javascript
import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { Space } from 'antd';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

const App: React.FC = () => (
  <Space>
    <IconFont type="icon-tuichu" />
    <IconFont type="icon-facebook" />
    <IconFont type="icon-twitter" />
  </Space>
);

export default App;
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c38487f2300f48a3b48cbfe8d41812d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=152&h=72&s=4493&e=png&b=fefefe)

用 createFromIconfontCN 的方法，传入 scriptUrl，就可以直接用 IconFont 的组建了。

Icon 组件就这么多用法，还是挺简单的。

接下来我们自己实现一下：

```shell
npx create-react-app --template=typescript icon-component
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2411326ed9404793a21cb4e4e7e16c04~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=306&s=53722&e=png&b=010101)

用 cra 创建个项目。

添加 Icon/index.tsx

```javascript
import React, { PropsWithChildren, forwardRef } from 'react';

type BaseIconProps = {
    className?: string;
    style?: React.CSSProperties;
    size?: string | string[];
    spin?: boolean;
};

export type IconProps = BaseIconProps & Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>((props, ref) => {
    
    const { 
        style,
        className, 
        spin, 
        size = '1em',
        children,
        ...rest 
    } = props;

    return (
        <svg ref={ref} style={style} fill="currentColor" {...rest}>
            {children}
        </svg>
    );
});
```

这里有 style、className、spin、size、children 这些参数，都很好理解。

此外，因为 Icon 就是对 svg 的封装，所以我们也接受所有 svg 的属性，透传给内部的 svg。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c486153bb12492abf6c0c194461ecb5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1556&h=1070&s=194099&e=png&b=1f1f1f)

这里还用了 forwardRef 来把 svg 的 ref 转发出去：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b36b306591d44bab42fb66d8f2ad680~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1544&h=1052&s=192521&e=png&b=1f1f1f)

还有，size 默认为 1em 也就是用 font-size 的大小：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc60b78b3ed341bba2db5162eb8f073d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1508&h=206&s=40836&e=png&b=f8f8fa)

填充颜色用 currentColor，也就是 color 的值：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a02ff96fa49b4dc08e62aa84a736719f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1572&h=792&s=123253&e=png&b=f9f9f9)

这就是为什么我们能通过 font-size 和 color 来修改 Icon 组件的大小和颜色。

然后处理下 size 参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e45b17de34854b6fadf4f2eba974df93~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1566&h=1218&s=244617&e=png&b=1f1f1f)

size 可以传 [10px, 10px] 分别指定宽高，也可以传 10px 来同时指定宽高，所以要做下处理。

```javascript
import React, { PropsWithChildren, forwardRef } from 'react';

type BaseIconProps = {
    className?: string;
    style?: React.CSSProperties;
    size?: string | string[];
    spin?: boolean;
};

export type IconProps = BaseIconProps & Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

export const getSize = (size: IconProps['size']) => {
    if (Array.isArray(size) && size.length === 2) {
        return size as string[];
    }

    const width = (size as string) || '1em';
    const height = (size as string) || '1em';

    return [width, height];
};

export const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>((props, ref) => {
    
    const { 
        style,
        className, 
        spin, 
        size = '1em',
        children,
        ...rest 
    } = props;

    const [width, height] = getSize(size);

    return (
        <svg ref={ref} style={style} width={width} height={height} fill="currentColor" {...rest}>
            {children}
        </svg>
    );
});
```
然后再处理下 className。

安装用到的包：

```bash
npm install --save classnames
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19e26bd271e843968ffab2b789470cfe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=908&h=800&s=117965&e=png&b=1f1f1f)

```javascript
const cn = cs(
    'icon',
    {
        'icon-spin': spin
    },
    className
)
```
实现下 icon-spin 的样式：

安装 sass 包：

```
npm install --save-dev sass
```
添加 Icon/index.scss
```scss
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.icon {
  display: inline-block;
}

.icon-spin {
  animation: spin 1s linear infinite;
}
```
icon 设置为 inline-block，也就是行内元素但是可以设置宽高。

icon-spin 执行无限旋转动画。

在 Icon/index.tsx 里引入：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4858b3370054a3eb66f49d5eb8f0cf3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=916&h=528&s=98876&e=png&b=1f1f1f)

至此，Icon 组件就封装完了。

这就完了么？

没错，Icon 组件就这么简单。

然后创建 Icon/createIcon.tsx

```javascript
import React, { forwardRef } from 'react';
import { Icon, IconProps } from '.';

interface CreateIconOptions {
  content: React.ReactNode;
  iconProps?: IconProps;
  viewBox?: string;
}

export function createIcon(options: CreateIconOptions) {
  const { content, iconProps = {}, viewBox = '0 0 1024 1024' } = options;

  return forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    return <Icon ref={ref} viewBox={viewBox} {...iconProps} {...props}>
      {content}
    </Icon>
  });
}
```
它是用来创建 Icon 组件的，接收 svg 的内容，也可以设置一些 IconProps、fill 颜色等。

接下来用它创建几个 Icon 组件试试：

Icon/icons/IconAdd.tsx

```javascript
import { createIcon } from '../createIcon';

export const IconAdd = createIcon({
  content: (
    <>
      <path d="M853.333333 480H544V170.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v309.333333H170.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h309.333333V853.333333c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V544H853.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"></path>
    </>
  ),
});
```
Icon/icons/IconEmail.tsx

```javascript
import { createIcon } from '../createIcon';

export const IconEmail = createIcon({
  content: (
    <>
      <path d="M874.666667 181.333333H149.333333c-40.533333 0-74.666667 34.133333-74.666666 74.666667v512c0 40.533333 34.133333 74.666667 74.666666 74.666667h725.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V256c0-40.533333-34.133333-74.666667-74.666666-74.666667z m-725.333334 64h725.333334c6.4 0 10.666667 4.266667 10.666666 10.666667v25.6L512 516.266667l-373.333333-234.666667V256c0-6.4 4.266667-10.666667 10.666666-10.666667z m725.333334 533.333334H149.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V356.266667l356.266666 224c4.266667 4.266667 10.666667 4.266667 17.066667 4.266666s12.8-2.133333 17.066667-4.266666l356.266666-224V768c0 6.4-4.266667 10.666667-10.666666 10.666667z"></path>
    </>
  ),
});
```
在 App.tsx 里引入下试试：

```javascript
import { IconAdd } from './Icon/icons/IconAdd';
import { IconEmail } from './Icon/icons/IconEmail';

function App() {
  return (
    <div style={ {padding: '50px'} }>
      <IconAdd></IconAdd>
      <IconEmail></IconEmail>
    </div>
  );
}

export default App;
```
跑下开发服务：

```bash
npm run start
```
可以看到，Icon 渲染出来了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35626c69fece49a59094cfd2a91a3333~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=250&h=150&s=4890&e=png&b=ffffff)

然后试下 props：

```javascript
import { IconAdd } from './Icon/icons/IconAdd';
import { IconEmail } from './Icon/icons/IconEmail';


function App() {
  return (
    <div style={ {padding: '50px'} }>
      <IconAdd size='40px'></IconAdd>
      <IconEmail spin></IconEmail>
      <IconEmail style={{color: 'blue', fontSize: '50px'}}></IconEmail>
    </div>
  );
}

export default App;
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d7c686370b84d2d9a44050a9e64d1d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=354&h=350&s=22270&e=gif&f=17&b=fefefe)

没啥问题。

接下来支持下 iconfont 的图标：

创建 Icon/createFrontIconfont.tsx

```javascript
import React from 'react';
import { Icon, IconProps } from './';

const loadedSet = new Set<string>();

export function createFromIconfont(scriptUrl: string) {
  if (
    typeof scriptUrl === 'string'
    && scriptUrl.length
    && !loadedSet.has(scriptUrl)
  ) {
    const script = document.createElement('script');
    script.setAttribute('src', scriptUrl);
    script.setAttribute('data-namespace', scriptUrl);
    document.body.appendChild(script);

    loadedSet.add(scriptUrl);
  }

  const Iconfont = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const { type, ...rest } = props;

    return (
      <Icon {...rest} ref={ref}>
        { type ? <use xlinkHref={`#${type}`} /> : null}
      </Icon>
    );
  });

  return Iconfont;
}
```
createFromIconfont 会传入 scriptUrl，我们在 document.body 上添加 \<script> 标签引入它。

当然，如果加载过的就不用再次加载了，所以用 Set 来记录下。

然后用的时候使用 \<use xlinkHref="#type" > 引用。

antd 的就是这么做的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e30cb8e7e4dc4e52acd127674c489442~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1576&h=1168&s=336508&e=png&b=fcfbfb)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/389ce710a7f84b71b9a837476ad2a99a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1440&h=866&s=183803&e=png&b=fefefe)

我们测试下：

登录 [iconfont.cn](https://www.iconfont.cn/)

选几个图标:

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f06c5be3b8a41fd9fca591ceceb6ce6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1406&h=852&s=282606&e=png&b=181818)

添加到购物车，创建个项目：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15ca48ed7ebf4f858386b73cd842002a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=732&h=388&s=26647&e=png&b=fafafb)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7904b82306304d28a41934f2db08e0c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=886&h=1188&s=100821&e=png&b=f9f9f9)

然后就可以看到在线 js 链接：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4d323261c4f4d7f9fe448043daa0665~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1974&h=1264&s=271236&e=png&b=fbfbfb)

我们在项目里引入下试试：

```javascript
import { createFromIconfont } from './Icon/createFrontIconfont';
import { IconAdd } from './Icon/icons/IconAdd';
import { IconEmail } from './Icon/icons/IconEmail';

const IconFont = createFromIconfont('//at.alicdn.com/t/c/font_4443338_a2wwqhorbk4.js');

function App() {
  return (
    <div>
      <div style={ {padding: '50px'} }>
        <IconFont type="icon-shouye-zhihui" size="40px"></IconFont>
        <IconFont type="icon-gerenzhongxin-zhihui" fill="blue" size="40px"></IconFont>
      </div>
    </div>
  );
}

export default App;

```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67845c1ff651446da184c73c126d2cbc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=378&h=210&s=7628&e=png&b=ffffff)

引入成功！

至此，我们的 Icon 组件就开发完成了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/icon-component)。

## 总结

这节我们实现了 Icon 组件。

支持 size、spin、className、style 等参数。

然后实现了 createIcon 方法，可以传入 svg 内容来生成具体的 Icon。

并且对 iconfont 做了支持，实现了 createIconFromIconfont，可以传入 scriptUrl，然后指定 type 来引用对应的 icon。

通过把 svg 的 fill 设置为 currentColor，把 width、height 设置为 1em， 实现了可以通过 color 和 font-size 来设置 Icon 大小和颜色的效果。

这就是我们每天在用的 Icon 组件的实现原理。