## 1. 前言

Tailwind CSS 是一个用于构建 Web 项目的 CSS 框架，它提供了一系列预定义的原子 CSS 类，可以帮助开发人员快速构建 Web 界面，并且可以通过自定义主题和扩展来满足不同的需求。

目前 Tailwind CSS 在 GitHub 有 80k Stars、Npm 周下载量 733W，已经成为前端主流的 CSS 框架。

Tailwind CSS 看起来很简单，就是将 CSS 的简写放到 HTML 类名中，但是 `ring`、`truncate`这些类名是啥意思？响应式该如何处理？暗黑模式如何支持？如何自定义一个类名的样式？使用时有哪些注意事项？常搭配哪些库使用？这些进阶的问题又要花费一些时间去了解。

不过**本篇并不会具体介绍 Tailwind CSS 的使用，但我会根据自己的学习经验告诉大家如何系统学习 Tailwind CSS。**

## 2. 学习使用

### 2.1. 安装使用

首先入门 Tailwind CSS 是很简单的，你只需要装好环境即可。目前很多主流的框架都支持 Tailwind CSS，比如 Next.js 的脚手架、Svelte 的脚手架 SvelteKit 都会在创建项目的时候就让你选择是否使用 Tailwind CSS。

安装 Tailwind CSS 后，使用很简单，更多考验的是你的 CSS 知识：

```html
<div class="flex justify-center items-center">center</div>
```

### 2.2. 多查多学

如果不知道样式对应的类名，打开 [Tailwind CSS 官网](https://tailwindcss.com/)，点击搜索框，直接搜索即可：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e19b0682b754e4ca05448ffcf7ab587~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2956\&h=1440\&s=191787\&e=png\&b=1c2336)

点击链接就会跳转到对应的文档，查看需要的类名即可：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1eb48e2510d94371b1383cefb7e8bc9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2918\&h=1078\&s=353173\&e=png\&b=11182b)

注：VSCode 有 [Tailwind Documentation](https://marketplace.visualstudio.com/items?itemName=alfredbirk.tailwind-documentation)<font style="color:rgb(37, 41, 51);"> 或 </font>[Tailwind Docs](https://marketplace.visualstudio.com/items?itemName=austenc.tailwind-docs)<font style="color:rgb(37, 41, 51);"> 这两个插件可以帮助你查阅文档</font>

如果你会写 CSS，大部分的类名都很容易想到，比如 `display: flex`就写作 `flex`，`flex-direction: row` 就写作 `flex-row`。

少部分类名初次接触的时候可能有些不太习惯，比如设置文字颜色是 `text-sky-500`而不是 `color-sky-500`，但设置字重却不是 `text-bold`而是 `font-bold`。设置行高是 [leading](https://tailwindcss.com/docs/line-height)，设置字间距是 [tracking](https://tailwindcss.com/docs/letter-spacing)……

除此之外，还有一些工具类名，比如 [container](https://tailwindcss.com/docs/container)（设置容器宽度）、[size](https://tailwindcss.com/docs/size)（设置高度和宽度）、[divide](https://tailwindcss.com/docs/divide-width)（设置元素之间的 border）、[space](https://tailwindcss.com/docs/space)（设置元素之间的距离）、[line-clamp](https://tailwindcss.com/docs/line-clamp)（设置文字行数，超出的部分显示 `...`）、[truncate](https://tailwindcss.com/docs/text-overflow#truncate)（文字显示一行）、[ring](https://tailwindcss.com/docs/ring-width)（使用 box-shadow 实现元素轮廓）、[animate](https://tailwindcss.com/docs/animation)（一些常用的动画效果）、[sr-only](https://tailwindcss.com/docs/screen-readers#screen-reader-only-elements)（只显示在屏幕阅读器）等等

这些类名的学习我并没有看到专门的整理，虽然都可以在官方文档里查到，但由于文档实在是太多了，从头看到尾确实有些累。我的建议是在日常开发中，比如使用 [Tailwind CSS Components](https://tailwindui.com/components) 的时候多加注意用到的样式，遇到不熟悉的就顺便学习一下，从实践中掌握。

### 2.3. 核心概念

Tailwind CSS 还有一些核心的概念，官方文档中进行了详细的介绍：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4b73a73efbf40a69ecdffa4e2daf65d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2780\&h=864\&s=272338\&e=png\&b=11192c)

主要是介绍了元素的各种状态样式如何写，如何写响应式、如何写暗黑模式、如何自定义样式等等，都很重要，日常开发会用到上，内容至少要过一遍。

如果你需要自定义样式，那就需要看这块内容：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/087fe8a0f22e4e9189b304605c99e0fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2622\&h=974\&s=307271\&e=png\&b=11192c)

这块内容基本都是讲如何自定义样式，如果业务的 UI 设计比较有体系，且与 Tailwind CSS 本身的设计体系有较大差别，那就可以用这里的自定义配置先自定义出一套自己的体系，然后再开发，会事半功倍。

### 2.4. 多用组件库

实际项目开发中，如果不需要严格控制样式，自由度较高，那最好不要自己从头写样式，而是多借助现有的组件库。Tailwind CSS 提供了 [Tailwind CSS Components](https://tailwindui.com/components)，这种是预设的 UI 组件，只有样式，可直接复制修改，但是免费的只开放了一些，不过网上也有一些类似的免费 UI 组件，比如 [Float UI](https://floatui.com/components/banners)。

除此之外，还有很多 Tailwind CSS 库，这些有更多的封装，比如 [Shadcn/ui](https://ui.shadcn.com/docs)、[Daisyui](https://daisyui.com/docs/install/)、[Flowbite](https://flowbite.com/) 等等（搜“Tailwind CSS 组件库”，你会发现很多）。其中最火的是 Shadcn UI，它是 2023 年 JavaScript 领域 GitHub Stars 增长最多的开源项目，2023 年 1 月创建的项目，一年便涨了 39.5K Star，足以看出其火爆程度。

除了搜索引擎，还可以到 [Tailwind Awesome](https://www.tailwindawesome.com/?price=free\&type=all) 搜索模板或者 UI 组件。

### 2.5. 搭配工具库

这篇文章一定要看看：[《Next.js 项目写 Tailwind CSS 基本都会遇到的两个问题》](https://juejin.cn/post/7387611028988002314)

**它介绍了使用 Tailwind CSS 的两大问题，以及解决这些问题会用到的 3 个库：tailwind-merge、clsx、cva，最后补充了一些配合写 Tailwind CSS 的插件和网站。**

基本的学习内容就这些，你要是还不放心，这还有一个 4 小时的 Youtube [Tailwind CSS 教程](https://www.youtube.com/watch?v=KFtM4tuCTZs\&list=PL8HkCX2C5h0VM7zNTaGgRDEb0Mp18ttqp\&index=1)可以看一下。

## 3. 小技巧

### 3.1. 自定义样式

如果要使用自定义的样式，比如宽高、颜色等，使用 `[]`进行包裹：

```jsx
<div class="w-[111px] bg-[#ddd]">Content</div>
```

也可以在 `[]`中使用 `calc` 或 CSS 变量：

```jsx
<div class="w-[calc(100% - 80px)] bg-[var(--content-bg)]">Content</div>
```

### 3.2. 距离

在 Tailwind CSS 中，距离通常是用数字表示的，比如 `w-2`、`h-4`：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74628cba9f3c40f384550f016aad5044~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2476\&h=554\&s=138728\&e=png\&b=1f1f1f)

这些数字最终会转算为 rem 单位，计算方式是`数字 / 4`，即 `w-4` 就是 `1rem`，如要换算成 px，计算方式则是 `数字 * 4`，比如 `w-4`就是 16px。

但这只是一个换算，`1rem` 并不一定是 16px，只是 Chrome 浏览器默认根字体大小是 16px。写样式的时候，尤其是写响应式，应该尽可能避免使用 px 单位，因为天道好轮回，现在你眼神好，不代表你工作 10 年后还眼神好……再工作一段时间，你可能就要调整浏览器默认文字大小了……

数字是支持小数的，比如 `m-0.5(对应 0.125rem; /* 2px */)`、`m-1.5(对应 0.375rem; /* 6px */)`、`m-2.5(对应 0.625rem; /* 10px */)`、`m-3.5(对应 0.875rem; /* 14px */)`

也支持负数，写法是加个 `-`前缀，比如 `-m-4`就是 `margin: -1rem`

那如果遇到了 Tailwind CSS 不支持的数字该怎么办呢？比如 `m-13`，这个类名在文档里是找不到的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfa96cad657749a8b2d3e456ef9c72ac~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1754\&h=228\&s=63261\&e=png\&b=10172a)

这个时候就要看这个距离值用的多不多了。如果只是偶尔用一下，那你可以直接写成 `m-[3.25rem]`，如果用的多，则修改 `tailwind.config.js`：

```javascript
module.exports = {
  theme: {
    extend: {
      spacing: {
        13: "3.25rem",
        15: "3.75rem",
        128: "32rem",
        144: "36rem",
      },
    },
  },
};
```

这样就可以直接使用 `m-13`。

### 3.3. 颜色

Tailwind CSS 默认提供了很多颜色，如果你需要自定义颜色，就修改 `tailwind.config.js`：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    colors: {
      transparent: "transparent",
      black: "#000",
      white: "#fff",
      gray: {
        100: "#f7fafc",
        // ...
        900: "#1a202c",
      },

      // ...
    },
  },
};
```

这样你就可以使用以 `text-transparent`、`text-black`、`text-gray-100`等方式使用这些色值。

定义颜色的时候也可以使用 CSS 变量：

```javascript
export default {
  theme: {
    colors: {
      border: "var(--border)",
    },
  },
};
```

如果既要设置颜色（比如 `text-sky-500`），又要设置透明度（比如 `text-opacity-30`），你可以合并写作 `text-sky-500/30`，或者使用 `[]`定义任何透明度，比如 `text-sky-500/[0.33]`。

### 3.4. !important

如果要使用 `!important`，添加一个 `!`前缀：

```html
<p class="!font-medium font-bold">This will be medium even though bold comes later in the CSS.</p>
```

最终渲染的样式为：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98f919a02e0f4be5b0023fc17adf0a38~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2072\&h=350\&s=154977\&e=png\&b=282828)

当搭配其他状态的时候，用法如下：

```html
<div class="sm:hover:!tw-font-bold">
```

### 3.5. @layer 和 @apply

有的时候，我们会重复的定义类名：

```html
<div class="flex flex-row justify-start items-center px-4 py-3 rounded-xl mb-2">首页</div>
<div class="flex flex-row justify-start items-center px-4 py-3 rounded-xl mb-2">技术文章</div>
<div class="flex flex-row justify-start items-center px-4 py-3 rounded-xl mb-2">个人成长</div>
<div class="flex flex-row justify-start items-center px-4 py-3 rounded-xl mb-2">关注</div>
```

此时我们会希望有一个单独的自定义类名，比如将这段代码写作：

```html
<div class="nav">首页</div>
<div class="nav">技术文章</div>
<div class="nav">个人成长</div>
<div class="nav">关注</div>
```

这就需要 @layer 和 @apply 了。@layer 是为了告诉 Tailwind CSS 该样式属于哪层，是 base （基础层）、components（组件层）还是 utilities （工具层）。@apply 是为了自定义 CSS 类名。

举个例子：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply text-xl;
  }
}

@layer components {
  .nav {
    @apply flex flex-row justify-start items-center px-4 py-3 rounded-xl mb-2;
  }
}

@layer utilities {
  .filter-none {
    filter: none;
  }
  .filter-grayscale {
    filter: grayscale(100%);
  }
}
```

此时我们就可以直接使用 `nav`类名。

但是 Tailwind CSS 不建议使用这种方式，因为它会增加协同成本、你必须想一个不值得命名的类名、更改时跳转多个文件，让你的 CSS 文件更大等等。除此之外，就这个例子而言，其实你应该写成循环遍历：

```javascript
["首页", "技术文章", "个人成长", "关注"].map((text) => {
  return <div class="flex flex-row justify-start items-center px-4 py-3 rounded-xl mb-2">{text}</div>;
});
```

### 3.6. 响应式设计

Tailwind CSS 默认提供了几个断点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bcb8d676eb6d4378a9757c9590585cda~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2022\&h=634\&s=129712\&e=png\&b=101729)

这个设计体系被称为“Mobile First”，也就是移动端优先，注意这些断点对应的媒体查询用的是 `min-width`，也就是大于等于这些值的时候样式才生效。

什么叫做移动优先呢？以我们实战项目中的三栏样式为例，窄屏幕比如手机采用一栏布局，更宽的屏幕比如平板采用两栏布局，再宽一点的屏幕比如 PC 端采用三栏布局。

浏览器效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8fc84802891a4196b46f7f29d04e8564~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1398\&h=533\&s=1504584\&e=gif\&f=69\&b=fefefe)

在写代码的时候，应该优先写移动端的样式：

```html
<div class="flex min-h-screen">
  <div class="hidden min-w-64">Left</div>
  <div class="flex-1">Content</div>
  <div class="hidden min-w-64">Right</div>
</div>
```

然后在较大的断点时覆盖之前的值：

```html
<div class="flex min-h-screen">
  <div class="hidden min-w-64 md:block">Left</div>
  <div class="flex-1">Content</div>
  <div class="hidden min-w-64">Right</div>
</div>
```

然后在更大的断点时覆盖之前的值：

```html
<div class="flex min-h-screen">
  <div class="hidden min-w-64 md:block">Left</div>
  <div class="flex-1">Content</div>
  <div class="hidden min-w-64 xl:block">Right</div>
</div>
```

### 3.7. 暗黑模式

如果要实现手动切换暗黑模式，那就需要选择 selector 策略：

```javascript
module.exports = { darkMode: 'selector', // ... }
```

此时 Tailwind CSS 会根据 HTML 上的 `.dark`类名来判断是否是暗黑模式。

但是否在 HTML 上添加 `.dark`类名是开发者决定的，开发者也可以使用其他方式比如 html 的 `data-theme="dark"` 方式标记是否是暗黑模式。

此时 Tailwind CSS 的配置也需要做修改：

```javascript
module.exports = { darkMode: ['selector', '[data-mode="dark"]'], // ... }
```

### 3.8. typography plugin

[typography plugin](https://github.com/tailwindlabs/tailwindcss-typography) 是 Tailwind CSS 的官方插件，可以在官方文档的侧边导航栏底部找到介绍：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2132779e6a6045e4923854408e4d811e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2974\&h=956\&s=246038\&e=png\&b=101729)

简单来说，使用默认 Tailwind CSS 的时候，所有的样式都被重置。如果你要设置一篇文章的样式时，所有元素的样式都需要自己重写，这就很麻烦了。Tailwind CSS 直接提供了 typography 插件，为元素添加上漂亮的排版默认值，你只需要在最外层添加一个 `prose`类名，元素就会自动带上合适的样式：

```html
<article class="prose lg:prose-xl">
  <h1>Garlic bread with cheese: What the science tells us</h1>

  <p>
    For years parents have espoused the health benefits of eating garlic bread with cheese to their children, with the food earning such an iconic status in our culture that kids will often dress up
    as warm, cheesy loaf for Halloween.
  </p>

  <p>But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases springing up around the country.</p>

  <!-- ... -->
</article>
```

浏览器效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6666c83bf5b4f00af2a01496c833af3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1970\&h=944\&s=179013\&e=png\&b=ffffff)

可以在 [Live Demo](https://play.tailwindcss.com/uj1vGACRJA?layout=preview) 看到更加完整的样式展示。

### 3.9. 预处理器与嵌套语法

通常使用 Tailwind CSS 的时候并不需要用预处理器，因为 Tailwind CSS 的目标是让你少写 CSS，所以往往行不需要编写很多自定义 CSS。

但预处理器的嵌套语法还是很好用的，比如：

```css
div {
  font-size: 16px;
}

div p {
  font-size: 18px;
}
```

使用嵌套语法后，写作：

```css
div {
  font-size: 16px;
  p {
    font-size: 18px;
  }
}
```

Tailwind CSS 提供了 tailwindcss/nesting 插件实现这一功能。

## 4. 总结

虽然这篇文章关于 Tailwind CSS 的介绍看似有些少，主要是因为将学习内容放到了各种链接中，其实展开后还是有不少内容需要学习的。不过 Tailwind CSS 入门还是很容易的，哪怕不系统性学习也可以上手使用。遇到具体的问题时再去查找解决方案也是不错的学习方式。
