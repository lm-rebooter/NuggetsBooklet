> 仓库地址：https://github.com/czm1290433700/nextjs-demo

在 C 端的官网页面中，我们常常可以看到一些花哨的动画。好的动画可以给网页增色很多，给用户身临其境的体验，在技术成本允许的情况，适当在网页中加一下动画可以在页面加载或是交互的时候分散用户注意力并取悦用户。不仅如此，动画还可以用来提供独特的体验，甚至可以突出品牌的趣味性。

比如[字节官网](https://www.bytedance.com/zh/)，首页有一些类似重力感应的球体动画。


![字节跳动 - Google Chrome 2022-08-13 18-45-27.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3e4e06577394b7da89aab59c45fde01~tplv-k3u1fbpfcp-watermark.image?)
又比如抖音前端技术团队官网，首屏也有一组复杂的首页加载动画。

![抖音前端技术团队官网 - Google Chrome 2022-08-13 18-49-33.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2c823f30b9f446da6def980b7e91ef0~tplv-k3u1fbpfcp-watermark.image?)

可以说，一个 C 端开发者，熟悉动画的实现方式，并且具备逐帧调试的能力是很重要的。对于一些简单的动画大家应该都比较熟悉，但是对于需要逐帧去绘制的组合动画，应该怎么实现呢？

## 动画的基础知识

首先我们先了解一下什么是帧动画呢？

> *定格动画，又名逐帧动画，是一种动画技术，其原理即将每帧不同的图像连续播放，从而产生动画效果。*

简单来说，就是每帧下会有不同的状态和图像，从而组合在一起的复杂动画场景。对于 2D 的 Web 动画场景，我们常用四种方式来绘制动画：

-   CSS Transtion：transition 只有起始状态和终点状态的概念，往往只能针对具体 dom 区域的相关属性变化进行简单动画场景绘制，不适用于帧动画场景。

<!---->

-   CSS Animation：可以是多个状态，具备很强的灵活性，同时引入了帧的概念，并且支持主动触发，常用于复杂帧动画的绘制。

<!---->

-   JavaScript：可以覆盖任何场景，但是绘制成本较大，针对较复杂场景，需要频繁操作 dom，同时会受到其他线程代码的影响，导致动画缺帧，建议只在动画极其复杂且高度定制、css 实现很困难的情况下才考虑这种方案。

<!---->

-   Canvas：成本较高，且绘制内容的绑定事件都需要自己处理，加上因为依赖像素，当画布较大的时候，动画效果不佳。

所以我们这里使用 Animation 动画来实现帧动画，如果不熟悉它基本属性和能力的同学，建议阅读 [MDN 相应的官方文档](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) 来熟悉。因为比较基础，加上官方文档的内容相对更全面且具备实时性，我们这里就不重复搬运讲解基础概念和属性了，下面我们直接就实际的例子来实战讲解整个帧动画的开发过程。

## 实现一个帧动画的 Demo

我们以 [抖音前端技术团队官网](https://douyinfe.com/) 的首页加载动画为例，看看这个动画下究竟发生了什么？首先我们打开 控制台的 network，使用 performance 来录制首页加载的过程，为了能更清晰查看，我们适当降低 CPU 的性能，调整为 4 x slowdown。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24f86e0dcad442439017733a5fd45029~tplv-k3u1fbpfcp-watermark.image?)

我们点击控制台左上角的⚪，然后刷新页面，可以得到下面的逐帧列表：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbe3ad28291147e1a8a3abcb9677cb1f~tplv-k3u1fbpfcp-watermark.image?)

从下面的加载图中我们可以判断出。这个动画总的执行时长为 1.36 s，然后上面的列表中有具体页面加载过程的帧动画变化图，通过按帧查看，咱们可以大概看出这个动画的执行顺序是这样的。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/271202ddb12849249c34e7e42e458f94~tplv-k3u1fbpfcp-watermark.image?)

按照从小序列到大序列的顺序，每个元素分别执行了从下往上的平移操作，以及一个透明度从 0 到 1 的过程，加上我们上面看到每个动画的时长分析都是 1.3s，所以只是对每个元素推迟了不同的动画平移时间，但是它们享有相同的动画时长，针对这个场景我们应该怎么去实现呢？


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3838f53f04c465e85d299819e797297~tplv-k3u1fbpfcp-watermark.image?)

针对现在的首页，我们也可以把 dom 元素简单拆分为 8 个区域，我们可以把总动画时长定成 1s，其中 1s 的时间可以分为 9个时间帧，每个区域从对应序列的时间帧开始执行相同的动画效果，最后把所有的帧连起来就是一个完整的帧动画，大致时间帧变化类似下图。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d067d089bce74c17972267aac78eec51~tplv-k3u1fbpfcp-watermark.image?)

这样通过延迟执行的方式，我们就可以得到一种每个区域逐步滑入的视觉感知效果，现在我们开始着手实现，首先我们改造一下首页 Dom 的类，专门定义一个动画类来存放动画相关的样式，避免对基础样式造成污染。

```
// ./pages/index.tsx
import type { NextPage } from "next";
import styles from "./index.module.scss";
import cName from "classnames";
// ...

const Home: NextPage<IProps> = ({ title, description, list }) => {
  return (
    <div className={styles.container}>
      <main
        className={cName([styles.main, styles.withAnimation])}
        ref={mainRef}
      >
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>{description}</p>

        <div className={styles.grid}>
          {list?.map((item, index) => {
            return (
              <div
                key={index}
                className={styles.card}
                onClick={(): void => {
                  window.open(
                    item.link,
                    "blank",
                    "noopener=yes,noreferrer=yes"
                  );
                }}
              >
                <h2>{item.label} &rarr;</h2>
                <p>{item.info}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
// ...

export default Home;
```

然后我们开始定义对应的样式进行绑定，我们以 fadeInDown1 举例，@keyframes 指向动画的逐帧状态，其中 0% 和 11 % 大家可以看到都是一样的内容，这时候区域处于 y 轴 40px 的位置，然后末尾状态是无区域状态和 1 透明度，这个动画的效果会使得动画从整体时间的 11% 开始执行，到 100 % 完成最终的变化。

这个11% 是从哪里来的呢？上面我们提到，我们为每个动画延迟一个帧频率执行，8 个区域，共 9 帧，所以 1 帧的占比为 11% 的总动画时长，参考下面的动画，每个动画的起始时间（第二个状态值）都比上一个高出 1 帧的比例，这样就可以将整体帧动画串联起来了。

```
// ./pages/index.module.scss
// ...

.withAnimation {
  .title {
    animation: fadeInDown1 1s;
  }

  .description {
    animation: fadeInDown2 1s;
  }

  .card:nth-of-type(1) {
    animation: fadeInDown3 1s;
  }

  .card:nth-of-type(2) {
    animation: fadeInDown4 1s;
  }

  .card:nth-of-type(3) {
    animation: fadeInDown5 1s;
  }

  .card:nth-of-type(4) {
    animation: fadeInDown6 1s;
  }

  .card:nth-of-type(5) {
    animation: fadeInDown7 1s;
  }

  .card:nth-of-type(6) {
    animation: fadeInDown8 1s;
  }
}

// ..

@keyframes fadeInDown1 {
  0% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  11% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}

@keyframes fadeInDown2 {
  0% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  22% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}

@keyframes fadeInDown3 {
  0% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  33% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}

@keyframes fadeInDown4 {
  0% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  44% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}

@keyframes fadeInDown5 {
  0% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  55% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}

@keyframes fadeInDown6 {
  0% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  66% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}

@keyframes fadeInDown7 {
  0% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  77% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}

@keyframes fadeInDown8 {
  0% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  88% {
    transform: translate3d(0, 40px, 0);
    opacity: 0;
  }

  100% {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}
```

然后我们查看一下效果，可以看到动画效果已经实现了，其他类型的帧动画也是采用类似的做法，**将帧动画按帧数区分，每一帧下需要哪些区域进行操作，它们当时帧数下的状态又是怎样的**。确定好这个，我们只需要对每个区域，编写它们下面对应每一帧的样式，就可以实现我们预期的帧动画效果了。


![cdbee301-0ca4-418e-b1b4-8e79550856cd.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6378d21709f647a2a4711bf2e9c7bf87~tplv-k3u1fbpfcp-watermark.image?)

## 怎么主动触发动画重新播放？

那么如果我们需要主动触发这个动画效果应该怎么办呢，比如在切换主题的时候，我们希望能再执行一次加载动画，我们可以通过`requestAnimationFrame`来实现，它会返回一个回调，强制浏览器在重绘前调用指定的函数来进行动画的更新，我们使用这个来改造一下首页，加一个 useEffect 的钩子。

```
// ./pages/index.tsx
import type { NextPage } from "next";
import styles from "./index.module.scss";
import cName from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "@/stores/theme";

// ...

const Home: NextPage<IProps> = ({ title, description, list }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    mainRef.current?.classList.remove(styles.withAnimation);
    window.requestAnimationFrame(() => {
      mainRef.current?.classList.add(styles.withAnimation);
    });
  }, [theme]);

  return (
    <div className={styles.container}>
      <main
        className={cName([styles.main, styles.withAnimation])}
        ref={mainRef}
      >
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>{description}</p>

        <div className={styles.grid}>
          {list?.map((item, index) => {
            return (
              <div
                key={index}
                className={styles.card}
                onClick={(): void => {
                  window.open(
                    item.link,
                    "blank",
                    "noopener=yes,noreferrer=yes"
                  );
                }}
              >
                <h2>{item.label} &rarr;</h2>
                <p>{item.info}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

// ...

export default Home;
```

在每次 theme 发生变化的时候，主动移除对应的动画类，再通过`requestAnimationFrame`对动画类进重新绑定，达到主动触发动画刷新的效果，现在我们来看一下最终成品。


![ceaf0b3e-b13b-4988-b309-e227481d0214.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec78324663164c799bb28ae03f5e6efa~tplv-k3u1fbpfcp-watermark.image?)

## 小结

这节课我们学习了怎么去实现一个相对复杂的帧动画，并尝试去使用 performance 去慢放分析一个帧动画的细节进行还原，从成本、实现效果多方面考虑，我们通常会采用 CSS Animation 的方式去实现相对复杂的帧动画，实现的关键在于分析出每帧的变化，根据区域去逐帧绘制，然后将所有的帧连起来，就可以实现一个完整的帧动画。

通常帧动画都会有重复绘制的需求，针对这类场景，我们可以使用`requestAnimationFrame`调起浏览器去执行我们预期的回调，将对应的动画类进行移除和重复添加，这样就可以在重绘的过程中再次执行一次我们的动画效果。

到这里我们官网的内容其实已经比较充实了，但是现在，我们只针对 16 英寸进行了样式适配，如果通过手机和 ipad 端访问，部分样式可能存在问题，下一节课，我会以首页作为案例，详细给大家介绍怎么全面覆盖主流多媒体设备。