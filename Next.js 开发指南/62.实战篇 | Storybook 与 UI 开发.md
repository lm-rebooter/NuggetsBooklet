## 前言

本篇我们介绍 [Storybook](https://storybook.js.org/)，根据官网的介绍，它是：

> Storybook is a frontend workshop for building UI components and pages in isolation. Thousands of teams use it for UI development, testing, and documentation. It's open source and free.
>
> Storybook is the most popular UI component development tool for React, Vue, and Angular. It helps you develop and design UI components outside your app in an isolated environment.

简单总结一下就是：**Storybook 是一个支持 React、Vue、Angular 的 UI 组件开发工具，独立于开发环境，常被用于 UI 开发、组件测试和编写组件文档**。

之所以出现 Storybook，是因为传统开发的 UI 组件，随着不断迭代越发复杂，组件所拥有的状态不再容易追溯。当你需要查看组件的某种状态时，可能需要麻烦的运行项目、Mock 接口数据亦或者手动修改组件 props 才能查看效果，查看完后还要再更改回来……这就造成了组件开发和使用的繁琐。而 Storybook 可以独立于开发环境，让你能够快捷查看到组件的不同状态。

**目前 Storybook GitHub 83k Stars，Npm 周均下载量 2400W，算是这个细分领域最主流的技术选型了。**

只谈论背景和功能还是比较抽象，我们以 Next.js 项目为例，具体讲解 Storybook 如何使用。

## Storybook

### 1. 初始化

使用 Next.js 官方脚手架创建一个新项目：

```bash
npx create-next-app@latest
```

初始化 Storybook：

```bash
npx storybook@latest init
```

Storybook 会自动探测项目类型，根据 Next.js 项目类型安装依赖项，创建 `.storybook`和 `stories`两个文件夹，其中：

1.  `.storybook`下的文件是配置文件，声明了 Storybook 的运行规则，比如读取哪些文件作为 story
2.  `stories` 下的文件是组件文件，初始化创建的组件文件只是用作示例代码，展示 story 的写法和使用方式

同时`package.json` 也会写入了两个脚本命令：

```bash
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}

```

安装完成后，会自动运行 `npm run storybook`，自动打开 <http://localhost:6006/>：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffe4f15561ce435cad6accbb0203b596~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3064\&h=1522\&s=1134114\&e=png\&b=cecfd0)

### 2. 支持 Tailwind.css

如果我们书写自己的组件，很有可能用到 Tailwind.css。为了让 Tailwind.css 在 Storybook 中生效，我们还需要额外做一点修改。

修改 `tailwind.config.js`，代码如下：

```javascript
// 添加 stories 目录
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

```

修改 `next-storybook/.storybook/preview.js`，添加代码如下：

```javascript
// 引入全局 CSS
import "../app/globals.css";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

### 3. 组件与 Story

为了由浅入深的讲解如何写 Storybook 组件，我们先删除掉 stories 文件夹下的内容，从头开始实现。

我们以 Ant-Design 的 `<Button>` 组件为例。根据 `type` 属性的值不同，Ant-Design 提供了五种基本类型：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fad405ebfc241eaba5a8129a7fb5e31~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1786\&h=456\&s=75253\&e=png\&b=fefefe)

我们尝试模仿下这个效果。但为了避免复杂，我们就先完成主按钮、次按钮类型。

新建 `stories/Button.jsx`，代码如下：

```jsx
import PropTypes from "prop-types";

const Button = ({ label, type = "default", ...props }) => {

  let classnames = "bg-white text-black border border-gray-300 border-solid hover:border-sky-600 hover:text-sky-600";
  if (type == 'primary') {
    classnames = "bg-sky-600 text-white "
  }

  return (
    <button type="button" className={`inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 shadow-inner shadow-white/10 ${classnames}`} {...props}>
      { label }
    </button>
  );
};

Button.propTypes = {
  /**
   * 按钮文案
   */
  label: PropTypes.string,
  /**
   * 按钮类型
   */
  type: PropTypes.string,
  /**
   * 可选点击事件
   */
  onClick: PropTypes.func,
};

export default Button;

```

新建 `stories/Button.stories.js`，代码如下：

```javascript
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
};

export const Primary = () => <Button type="primary" label="Primary Button" />;

export const Default = () => <Button type="default" label="Default Button" />;
```

在这段代码中，我们引入了 Button 组件的代码，导出了两种状态的组件。

此时打开 <http://localhost:6006/>：

![9.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e55465deecd48b5ad018b32e2abb3fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1192\&h=523\&s=182862\&e=gif\&f=40\&b=fefefe)

在这个页面，我们可以预览组件的两种状态。这就是 Storybook 最基本的两个组织级别：组件和它的子故事（stroies）。也就是说，每一个组件都有多个 story，共同组成了“storybook”。

注意下方的 Controls 面板，里面的值（比如 label、type、onClick）可以理解，是根据 Button.propTypes 生成，可是当组件切换的时候，这些值的内容并未发生改变。如果你需要定义这些值，并希望能够随时修改，修改 `stories/Button.stories.js`，代码如下：

```javascript
import Button from './Button';

export default {
  title: 'Button',
  component: Button
};

export const Primary = {
  args: {
    type: "primary",
    label: "Primary Button",
  },
};

export const Default = {
  args: {
    type: "default",
    label: "Default Button",
  },
};
```

此时浏览器效果如下：

![10.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c9595f2dd5b4d7e85c0fdcb545199fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1192\&h=531\&s=195300\&e=gif\&f=45\&b=fdfdfd)

我们甚至可以在面板中修改传入的值，并实时查看效果。

### 4. 组件设置

其实 Storybook 提供了非常丰富的设置选项，继续修改 `stories/Button.stories.js`，代码如下：

```javascript
import { fn } from '@storybook/test';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
  parameters: {
    // 调整组件在 Canvas 的位置: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // 自动生成组件文档: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // 组件参数类型: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    type: { control: 'radio', options: ['primary', 'default'] }
  },
  // 组件默认传入参数：https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    type: "primary",
    label: "Primary Button"
  },
};

export const Default = {
  args: {
    type: "default",
    label: "Default Button"
  },
};
```

其中，parameters.layout 用于设置组件的位置，`tags: ['autodocs']`用于自动生成组件文档，查看效果时你会发现组件下多了一个 Docs 文档。argTypes用于设置组件的类型，之前都是输入框类型，在这里可以设置更多样的类型，就比如单选框。args 设置组件的默认传入参数。

此时效果如下：

![11.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b765b4615194863b68e9e970c175e8e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1192\&h=527\&s=403753\&e=gif\&f=62\&b=fefefe)

### 5. Story 设置

我们也可以设置 Story，继续修改 `stories/Button.stories.js`，代码如下：

```javascript
import { fn, within, userEvent, expect } from '@storybook/test';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
  parameters: {
    // 调整组件在 Canvas 的位置: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // 组件自动生成文档: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // 组件参数类型: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    type: { control: 'radio', options: ['primary', 'default'] }
  },
  // 组件默认传入参数：https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    type: "primary",
    label: "Like"
  },
  render(args, { loaded: { todo } }) {
    return (
      <div>
        <span>为 {todo.title} 点赞： </span>
        <Button {...args} />
      </div>
    )
  },
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Like/i });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(button.textContent).toEqual('Like')
  }
};

export const Default = {
  args: {
    type: "default",
    label: "Default Button"
  },
};
```

其中，render 函数用于展示组件的最终渲染结果，loaders 用于渲染组件前加载数据，play 用于触发事件，常用于测试。

浏览器效果如下：

![12.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3f7c6f461ee494d929452eb9e47ab37~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1403\&h=740\&s=215728\&e=gif\&f=42\&b=fefefe)

### 6. 添加 MDX 文档

上节讲到可以自动生成组件文档，你也可以完全自定义组件文档，Storybook 支持 MDX 文档格式。

举个例子，先注释掉 `stories/Button.stories.js` 中的 `tags: ['autodocs'] `这行，因为它会与你自定义的文档造成冲突。

然后新建 `next-/stories/Button.mdx`，代码如下：

```javascript
import { Canvas, Meta } from '@storybook/blocks';

import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

这里展示了 Button 组件的不同样式

主按钮样式：

<Canvas of={ButtonStories.Primary} />

默认按钮样式：

<Canvas of={ButtonStories.Default} />
```

浏览器效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/662bcbaacc6c4f69976c5b8095628592~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3412\&h=1618\&s=243714\&e=png\&b=ffffff)

## 组件驱动开发

至此我们就展示了 Storybook 的基本功能：1. 展示 UI  2. 组件测试 3. 编写组件文档

其实使用 Storybook 的大前提是遵循**组件驱动开发**（Component Driven Development）的编程方式。

所谓组件驱动开发，将复杂的页面拆解为简单的组件，每个组件都有一个定义良好的 API 和一系列被模拟的固定状态。开发者就可以通过重组来构建不同的 UI。

那组件驱动开发的流程是什么样的呢？

1.  编写单个组件：单独构建每个组件并定义其相关状态，比如 Avatar、Button、Input、Tooltip
2.  组合复杂组件：将单个组件进行组合构建更复杂的组件，比如 Form、Header、List、Table
3.  组装页面：通过组合复杂组件构建页面，使用模拟数据模拟边缘 Case，比如主页、设置页面、个人信息页面
4.  集成到项目：将页面添加到项目中，与后端 API 和服务进行连接，比如 Web 应用、文档网站、商城网站

我们在运行 Storybook 初始化命令的时候，示例代码包含三个组件，分别是 Button、Header、Page，其实就代表了这样一个开发流程。

## 类似工具

类似于 Storybook 的组件文档工具还有 [Docz](https://www.docz.site/)（23.5k Star）、[dumi](https://d.umijs.org/guide)（3.5k Star）：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cefe8145f67845e9886d688155471d9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3370\&h=2042\&s=433597\&e=png\&b=fefefe)

总的来说，Storybook 无论是在实现功能、支持的库、下载使用量、更新维护速度等多个方面都遥遥领先。虽然 Docz、dumi 也有其特点和优势，但就这一细分领域，Storybook 是毫无疑问的一家独大。

## 参考文档：

1.  <https://storybook.js.org/docs/get-started/nextjs>
2.  <https://storybook.js.org/docs/api>
3.  <https://github.com/chromaui/intro-storybook-react-template/blob/master/src/stories/Button.stories.js>
4.  <https://www.componentdriven.org/>
5.  <https://npmtrends.com/docz-vs-dumi-vs-storybook>
