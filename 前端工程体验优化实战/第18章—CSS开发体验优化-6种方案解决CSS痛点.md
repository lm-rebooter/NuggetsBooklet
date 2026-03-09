CSS是前端应用的基石之一，但CSS的开发体验却饱受诟病，为什么会有这样的反差呢？

让我们从一道**简单**的面试题开始说起。

## 1. 一道简单的CSS面试题

**问题：下列HTML代码在浏览器中加载渲染后，** **`body元素`** **中2个** **`div元素`** **的前景色** **`color`** **分别是什么？**

``` html
<!DOCTYPE html>
<html>
  <head>
    <title>简单的 CSS 面试题</title>
    <style>
      .blue {
        color: blue;
      }
      .red {
        color: red;
      }
    </style>
  </head>
  <body>
    <div class="blue red">我是什么颜色？</div>
    <div class="red blue">我是什么颜色？</div>
  </body>
</html>
```

<details>
  <summary>点击展开答案</summary>
答案：2个`div`的前景色`color`分别是`red`和`red`。

因为CSS样式最终是否生效，取决于CSS规则**声明**的先后**顺序**，而非CSS class的先后顺序。
</details>

这是个易错题，即使有多年的CSS开发经验，也会因为对CSS**隐式规则**的疏忽而判断错误。

理解了这道面试题，CSS在开发中的痛点就可见一斑了。

  


## 2. CSS开发体验痛点

CSS最显著的痛点就是**可维护性差**，具体表现在：

### 1. 语法简陋

CSS并非编程语言，其语法缺乏逻辑控制，变量，循环等特性，不便于编写复杂的动态样式，对如今业务逻辑复杂的前端应用来说，语法堪称简陋。

### 2. 全局作用域污染

CSS默认运行在全局作用域中，同时模块化能力又有限，类名样式对所有元素生效，导致类名冲突难以避免，样式容易被覆盖。

### 3. 选择器规则复杂

CSS的类名选择符特性依赖优先级生效，但优先级计算规则又相当复杂，对人类开发者并不友好。

### 4. 代码关联性差

CSS与JS、HTML配合紧密，代码却又相互隔离，缺乏关联，导致开发者需要在3者之间频繁切换注意力，对开发效率和体验都有负面影响。

避免开发者频繁切换注意力，从而提高开发效率，也是Vue.js提出单文件组件（即SFC、`.vue`文件）和`React.js`使用JSX的初衷。

### 5. 样式生效依赖隐式规则

CSS的样式最终是否生效，**隐式**的依赖许多难以控制的因素，例如：

-   CSS 规则声明的先后顺序：或者说`style`或`link`标签在HTML中的先后顺序。（即本节开头面试题的**考点**）
-   元素继承关系：部分CSS样式规则可以在应用到父元素后，通过继承关系，应用到子元素上。

这些因素在开发实践中通常**难以控制**，尤其是现代的前端工程大都依赖打包构建工具，将模块化的代码，合并成产物文件。对于有成百上千个组件模块的前端项目，CSS代码合并后的顺序往往不能控制，甚至难以预测。

> 注：以Webpack为例，其对CSS代码进行打包时，是基于导入CSS文件的顺序，决定的产物代码的顺序。
> 
> 具体到我们常用的组件开发模式，也就是Webpack遍历组件依赖关系时，确定的组件依赖顺序。如果有大量组件相互依赖、引用，这个依赖关系非常难以预测，也就很难控制CSS产物代码的舒顺序。
>
> 来源：https://github.com/webpack/webpack/issues/215

  


> 注：CSS痛点导致开发问题的例子：
>
> -   Next.js 因 style 标签先后顺序导致样式错乱BUG，饱受困扰多年，仍未能修复：https://github.com/vercel/next.js/issues/16630
> -   Stack Overflow上关于CSS覆盖顺序的提问：https://stackoverflow.com/questions/9459062/in-which-order-do-css-stylesheets-override
> -   第10节《细粒度代码分割》提到的代码分割后CSS覆盖问题：https://juejin.cn/book/7306163555449962533/section/7311383850400120884#heading-10

  


## 3. CSS开发体验优化方案

有痛点就有解决方案，过去许多年来，业界也为解决CSS的痛点尝试过众多解决方案，接下来我们一起来了解6类CSS优化方案的利弊得失。

  


### 1. 类名命名原则

第一类解决方案是类名命名原则，代表工具是BEM方法论：https://getbem.com/。

这类解决方案提供了一套编写CSS的原则，约定在开发时将CSS的类名class分成3部分：

1.  块`Block`：是一个抽象概念，表示使用这个字符串作为类名的元素，都属于一个部分，有相对独立的功能。例如`.block，.navbar`类名。
1.  元素`Element`：块的组成部分，总是和块相连使用，以2个下划线作为分隔。例如`.block__element, .navbar__dropdown`类名。
1.  修饰符`Modifier`：用于标识块和元素的细节外观，以2个中横线作为分隔。例如`.block-element--modifier, .navbar__dropdown--disabled`类名。

这3类概念组成的类名，对应的就是BEM的全称：Block Element Modifier。

  


BEM规则通过提供统一的CSS class命名规范，让开发者使用统一的大小写规则和下划线等符号，实现为不同的组件和元素，命名不同的CSS类名class。

同时致力于尽量让CSS类名选择符保持**最低的优先级**，只有一个类选择器，避免CSS缺乏作用域特性导致难以维护优先级的痛点。

#### 缺点

1.  **BEM类名冗长**：大量的BEM类名会导致整个页面的HTML标签代码视觉上略显冗长，甚至混乱难以辨认。例如：`.navigation` *`_`* `menu-item--active-with-submenu, .product __image-container--with-overlay-and-zoom`，这样的类名让人类来阅读辨别并非易事。
1.  **依赖开发者主观上遵守规范，可靠性不强**：但人又往往是不可靠因素，导致在实践中，对同一元素的类名命名容易因人而异，对块元素，修饰符的定义出现分歧，不得不依赖代码评审保持规则约束。

  


### 2. CSS 预处理器

第二类解决方案是最常见的CSS 预处理，代表工具是`Sass`和`Less`。

这类方案基于配套的代码编译工具，拓展了CSS的语法，通过为CSS增加变量，函数，嵌套等特性，来解决CSS可维护性较差的痛点。

以Less为例，通过使用less-loader <https://www.webpackjs.com/loaders/less-loader/>，就能在基于`webpack`构建的前端项目中编写.less后缀的样式文件，使用原生CSS所没有的变量，嵌套，函数等特性。

`Less`的代码示例如下：

``` css
// src/style/demo.less
// 1. 函数 mixin
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

// 2. 变量 variable
@fontSize: 16px;

// 3. 嵌套 nested
#header {
  font-size: @fontSize;
}
```

上述`demo.less`文件中的Less语法代码，在浏览器中不能直接解析生效，需要经过编译后，产生如下CSS代码，供我们在开发生产环境使用：

``` css
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}

#header {
  font-size: 16px;
}
```

  


#### 缺点

1.  **有额外学习成本**：需要专门学习`Sass`和`Less`的语法，有一定时间成本。
1.  **不便于调试**：使用`Sass`和`Less`编写的源码和最终浏览器中运行的产物CSS代码不一定能精确匹配，会增加开发调试的难度，一般需要额外配合`CSS sourcemap`使用。
1.  **拖慢构建耗时**：用预处理器编写的`Sass`和`Less`代码，需要使用专用的编译器，例如`sass-loader,less-loader`，编译后才能在生产环境中使用，会导致前端项目构建的耗时显著增加。

  


### 3. CSS 后处理器

第三类解决方案是后处理器，代表工具是PostCSS：<https://postcss.org/>。

和预处理器直接提供新语法、新特性不同，后处理器PostCSS通过提供一套类似Babel的CSS语法编译工具和插件系统，来对已有的CSS进行后置处理，更注重通过生态中的各类插件，实现特定功能，例如：

1.  嵌套语法插件：https://github.com/postcss/postcss-nested
1.  自动增加浏览器兼容前缀插件：https://github.com/postcss/autoprefixer
1.  CSS代码压缩：https://github.com/cssnano/cssnano

  


#### 缺点

1.  有额外学习成本和工具链配置成本：使用PostCSS的配置相对更加复杂，需要专门的`postcss.config.js`配置文件，来设置使用的插件及其选项。

``` js
// postcss.config.js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require('autoprefixer'),
    require('postcss-nested')
  ]
}

module.exports = config
```

2.  **拖慢构建耗时**：PostCSS为了实现对CSS语法树的编译解析并应用插件转化代码（Transform），有额外的编译开销，会导致构建耗时变长，

  


### 4. 原子化CSS

第四类解决方案，是近两年在前端领域非常流行的原子化CSS方案。

代表工具是：Tailwind CSS：<https://tailwindcss.com/>，据说Tailwind的作者靠这一个开源项目，一年就挣到了30万美元，火爆程度可见一斑。

这类方案通过提供**预定义**的**细粒度**CSS样式和**类名**，来提高CSS的开发效率，减少自定义的样式和类名，从根本上尽可能避免CSS类名和样式容易冲突覆盖，难以维护的痛点。

以Tailwind为例，其特点有：

1.  Tailwind提供的预定义CSS样式和类名，基于**工具优先utility-first**的思想，有独特的规律，例如：

    1.  样式化文字尺寸的：

        1.  `text-xs`：` font-size: 0.75rem; /* 12px  `*`/ line-height: 1rem; /`* `16px */`
        1.  `text-sm`：` font-size: 0.875rem; /* 14px  `*`/ line-height: 1.25rem; /`* `20px */`
        1.  `text-lg`：` font-size: 1.125rem; /* 18px  `*`/ line-height: 1.75rem; /`* `28px */`

    1.  样式化尺寸大小的：

        1.  `w-4`：`width: 1rem; /* 16px */`
        1.  `w-8`：`width: 2rem; /* 32px */`

1.  可配置性：Tailwind还支持修改预定义类名的具体样式，可以通过专门的 `tailwind.config.js` 来配置，例如修改默认的文字大小配置：

``` js
module.exports = {
  theme: {
    fontSize: {
      'xs': '0.75rem',    // 自定义字体尺寸 'xs'
      'sm': '0.875rem',   // 自定义字体尺寸 'sm'
      'lg': '1.125rem',   // 自定义字体尺寸 'lg'
      // 添加更多自定义的字体尺寸...
    },
  },
  // 其他的配置...
}
```

3.  轻量无冗余代码：Tailwind自带移除未使用类名和CSS代码的特性，会尽可能减少产物CSS代码的体积。

  


#### 缺点

Tailwind显著提高了CSS的可维护性，有很多优点，但是他也存在缺点，主要有：

1.  **有一定学习成本**：其预定义的CSS类名规则比较特殊，想要灵活运用，需要一定的时间来熟悉。
1.  **可读性略差**：有很多开发者认为预定义的原子化CSS类名不够直观、难以理解，写出来的代码可读性不好。
1.  **没有解决CSS样式生效依赖隐式规则的痛点**：例如开头的CSS面试题，如果使用2个Tailwind的文字颜色类名，最终生效的样式仍然取决于隐式的、难以控制的规则定义顺序。

  


### 5. 初级CSS In JS

第五类解决方案是CSS In JS（下文简称**CIJ**），也就是把CSS和JS相结合，这类方案致力于实现在JS代码中编写CSS的解决方案，通过复用JS的作用域，逻辑判断等特性来强化CSS。

代表工具有：

-   styled-components：https://www.npmjs.com/package/styled-components，
-   emotion.js：https://emotion.sh/docs/introduction

以styled-components为例，CSS in JS的代码示例如下：https://styled-components.com/docs/basics#styling-any-component

``` js
const Link = ({ className, children }) => (
  <a className={className}>
    {children}
  </a>
);

const StyledLink = styled(Link)`
  color: #BF4F74;
  font-weight: bold;
`;

render(
  <div>
    <Link>Unstyled, boring Link</Link>
    <br />
    <StyledLink>Styled, exciting Link</StyledLink>
  </div>
);
```

基于`styled-components`的`styled()`API，我们可以对React组件进行加工。

例如上述代码运行后，会生成一个**哈希字符串**作为**类名**，指向我们编写在`styled()`方法后的CSS样式，并将该类名添加到返回的新组件`StyledLink`上，让该组件被样式化。

例如下图中的类名`.lmIyLq`就是我们编写的CSS In JS代码生成的**哈希字符串类名：**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47e60cf477ff4d108273c126cfd22ef4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1407&h=665&s=112197&e=png&b=2b2b2b)

因为是在JS中编写CSS代码的需求，我们还可以利用逻辑判断，方便地编写动态样式，例如在下列代码中：

``` js
const Button = styled.button`  
    background: ${(props) => (props.primary ? "#6495ED" : "#2b2b2b")};  
    color: white;  
    font-size: 24px;  
    padding: 12px;  
    cursor: pointer;
`;

// 使用时通过改变组件的 primary 属性来实现动态变化样式：
<Button primary>Hello, I am a Primary Button</Button>
```

我们使用[基于组件属性适配样式（adapting-based-on-props）](https://styled-components.com/docs/basics#adapting-based-on-props)的特性，在编写CIJ代码时，基于传入组件的`props.primary`，改变`background`CSS规则的值。



这类CIJ方案的一大显著优势是**学习成本极低**，只要会写CSS代码，就可以无缝切换到编写CIJ代码中。

  


#### 缺点

1.  有运行时额外性能开销：

因为本质上是在JS中编写CSS代码，所以CSS in JS解决方案普遍需要在JS运行时，通过执行额外的代码逻辑，动态生成CSS，实现CSS样式化，会对前端应用的渲染性能有所影响。

不过具体影响程度一般不大，尤其是相较于对开发体验带来的显著优化，这点负面影响可以忽略。

如果非常在意对运行时的影响，也可以考虑使用构建时生成静态文件的CSS in JS解决方案，规避这一缺点，例如`linaria`：https://github.com/callstack/linaria



### 6. 进阶CSS In JS：css prop

第六类解决方案是CSS In JS的进阶优化版css prop，这类方案通过在CIJ的基础上，为前端组件例如JSX增加专门的`css`属性来容纳CSS代码，来实现极致简单高效的CSS开发方式。

代表工具是Emotion的 css prop：https://emotion.sh/docs/css-prop

  


#### 示例：为前端项目增加 Emotion css prop

> 完整代码示例，请参考：《feat: add css prop》：<https://github.com/JuniorTour/fe-optimization-demo/pull/10>
>
> 注意！下列示例只适用于React版本>=16.14.0的前端项目。
>
> 官方文档：https://emotion.sh/docs/css-prop#babel-preset

增加 Emotion CSS prop的步骤非常简单，只需要安装并引入`@emotion/babel-plugin`这一官方babel插件：

```
npm install --save @emotion/react @emotion/babel-plugin
```

再修改babel配置，启用`importSource: '@emotion/react'`，引入`@emotion/babel-plugin`即可：

``` js
// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-react',
      { runtime: 'automatic', importSource: '@emotion/react' },
    ],
  ],
  plugins: [
    '@emotion/babel-plugin',
  ],
  // 其他 Babel 配置...
}
```

这样，我们就为前端项目增加了`css`prop的支持，直接在JSX中的HTML标签编写css属性，就可以被编译成对应的CSS代码，并生成一个唯一的哈希字符串作为ID。

`css`prop的代码示例如下：

``` js
import { StrictMode } from 'react';
import { render } from 'react-dom';
import { css } from '@emotion/react';

const dynamicColor = Math.random() % 2 === 0 ? 'darkgreen' : 'yellow';

render(
  <StrictMode>
    {/* 1. 对象风格 CIJ */}
    <div
      css={{
        fontSize: '32px',
        color: 'red',
      }}
    >
      CSS In JS DEMO
    </div>
    {/* 2. 字符串风格 CIJ */}
    <div
      css={css`
        background-color: hotpink;
        &:hover {
          color: ${dynamicColor};
        }
      `}
    >
      css prop 动态样式示例
    </div>
  </StrictMode>,
  document.getElementById('root'),
);
```

有2种写法：

1.  对象风格：CSS规则需要用小驼峰命名法改写，例如`font-size`改为`fontSize`。
1.  字符串风格：CSS规则命名可以和元素CSS保持一致，但是需要额外导入`css`方法。

此外，CSS prop不仅支持写入CSS规则，更支持写入有**嵌套**逻辑的CSS代码，例如：

``` jsx
<div
  css={{
    fontSize: '32px',
    color: 'red',
    '.child-class': {
      color: 'blue',
      '& button': {
        backgroundColor: 'green',
      },
    },
  }}
>
  CSS In JS DEMO
  <div className="child-class">
    child-class div
    <button type="button">Button</button>
  </div>
</div>
```


#### 对比优势

下面，我们通过对比：

-   传统的BEM 类名命名原则
-   基于 React 框架 JSX 语法的 Emotion 的 `css` prop

两种解决方案的异同来进一步理解`css` prop的优势。

对比项               | BEM 类名命名原则 | Emotion 的 `css` prop 解决方案 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 源码示例：实现动态样式       | 代码行数较**多**，约**22**行代码：<br /> ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d4c3636d4224d2589ba52903d089547~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=503&h=384&s=17467&e=png&b=282828) <br />另外还需要配套JS逻辑，实现样式切换，代码示例如下：![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fedb07f816c443b857e02871206d7a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=503&h=471&s=23657&e=png&b=292929) | 代码行数较**少**，约**12**行代码：![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8046dfb14a344eebba8dff8ceffe28ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=465&h=447&s=22578&e=png&b=282828) |
| 生产环境代码            | 与源代码相同，包含3个class类名：`.block__div`、`.block__div--color-green`、`.block__div--color-yellow` | 编译后的代码，会自动生成2个唯一哈希字符串作为类名：```.css-1gjlitb:hover {     color: yellow; }  .css-1gjlitb {     backrgound-color: hotpink; }``` ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06965bddebd14d3ea45eb92bc555bd6a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1919&h=414&s=105655&e=png&b=2c2c2c) |
| 痛点1：样式生效依赖隐式规则    | **未解决痛点**<br />样式是否生效，仍然依赖CSS规则声明的**先后顺序**，一旦CSS规则的声明顺序变化，最终生效的样式就会变化，极易导致样式错乱。 | **痛点解决**<br />每段样式都有各自独立的唯一哈希字符串作为CSS class，样式是否生效，不依赖CSS规则声明的**先后顺序**，不论CSS规则的声明顺序如何变化，样式都能保持稳定。 |
| 痛点2：CSS 选择符的优先级复杂 | **未解决痛点**<br />开发者自行构思命名规则复杂的 class，消耗时间精力，还容易重复、优先级冲突，开发体验较差。 | **痛点解决**<br />所有CSS样式都有自动生成的CSS class，无需区分对比优先级，从根本上避免了class优先级冲突覆盖，开发体验更好。                                                                                                                                                                                                                                                                                                       |
| 代码提示              | 有代码提示 | 有代码提示![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dda6379a5f44235ba46d9e8418e1fbd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1455&h=728&s=203363&e=png&b=212121)




基于CIJ和`css`prop的这些特性，CSS的各类痛点得以解决：

1.  **语法更加强大**：CSS In JS的特性，为CSS赋予了逻辑判断，嵌套，局部作用域，便捷复用等能力，大幅强化了CSS的语法和特性。
1.  **全局作用域污染**：css prop用生成的唯一哈希字符串作为类名，避免了CSS默认处于全局作用域时自定义的类名容易冲突的问题。
1.  **选择器规则复杂**：css prop会自动生成哈希字符串作为类名，从根本上解决了**命名**这一编程领域永恒的难题，使用css prop根本就不用耗费时间构思类名要叫什么，更不需要学习记忆复杂的选择符规则，能显著节省开发者的时间和精力。
1.  **代码关联性差**：使用CSS In JS，再搭配JSX，将前端的三块基石HTML、JS和CSS紧密地关联在了一起，开发者不必在三者之间切换注意力，开发体验能得到显著优化。
1.  **样式生效依赖隐式规则**：css prop生成的哈希字符串类名，天然的可以避免类名冲突、优先级覆盖等问题。

最后，最重要的是，这一解决方案几乎**没有学习成本**，只要会写CSS，就会写css prop，不需要再学习任何规则。开发者几乎没有任何学习成本，就能解决大部分CSS维护性差的痛点，投入几乎为零，产出却非常巨大，是近年来最为完美的解决方案，笔者强烈推荐各位一试。