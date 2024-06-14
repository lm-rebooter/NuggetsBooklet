由于前端框架的存在，通常情况下我们在编写页面时，并不是在写原生的 JS 代码，而更多是如 React 的 JSX 和 Vue 的 SFC（单文件）这样，基于 JS 衍生出的代码。这些特殊的代码当然不能被浏览器直接执行，而是需要经过编译，得到纯 JS 代码。而我们学习了这么多 TypeScript 的知识后，肯定会感到 TS 与 JS 的关系之紧密，那么，上面这些特殊的代码能否基于 TS 来衍生呢？

答案是肯定的，最经典的示例就是基于 TypeScript 书写的 JSX，我们很自然地称之为 TSX。自然到什么程度呢，React 团队只需要提供 React 的 TS 类型声明，你就能够很简单地从 JSX 迁移到 TSX，同时享受到由 TS 提供的原汁原味的类型检查——这也是为什么我们选择 React 来作为 TS 在前端框架的应用示例。

在这一节中，我们会从创建工程开始，一步步介绍 React + TypeScript 的开发过程中有哪些注意事项，React 的类型声明应该如何使用等等。

在第一步创建阶段，你有两个脚手架可以选择：由 React 团队官方提供的 create-react-app 和 Vite 团队提供的 create-vite。对于入门阶段来说，选择哪一个并没有明显区别，因为它们的起始模板都足够简单但也足够全面。这里我们选择 create-vite 来作为示例，首先运行这个命令，并选择 React 与 TypeScript：

```bash
npx create-vite
```

它创建的文件目录大概是这么个结构：

```bash
├── index.html
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

让我们先看看，这个初始化的项目里都包括了哪些类型的文件。首先是 .tsx 文件，我们打开 App.tsx 看看内容：

```tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* 省略 */}
    </>
  )
}

export default App
```

  


  


然后是 .d.ts 文件，前面我们已经了解过，这就是类型声明文件，我们打开 vite-env.d.ts 文件，看看一个 React 工程需要哪些类型声明才能正常运转？

```typescript
/// <reference types="vite/client" />
```

这里它使用了三斜线指令来导入 `vite/client` 下的类型定义，我们不需要了解具体使用，只需要知道其作用是将 npm 包 'vite' 下的 'client.d.ts' 文件中的类型声明导入即可，直接将其内部的类型定义粘贴个简化版本看看：

```typescript
// CSS modules
type CSSModuleClasses = { readonly [key: string]: string }

declare module '*.module.css' {
  const classes: CSSModuleClasses
  export default classes
}

// CSS
declare module '*.css' {
  const css: string
  export default css
}

// images
declare module '*.png' {
  const src: string
  export default src
}
```

可以看到，这里的类型声明主要是提供了你导入 `.module.css`，`.css`，`.png` 这些非常规代码文件时的类型声明。毕竟，虽然我们导入了它们，但实际上还需要经过编译工具处理后才能在页面中正常展示。而如果缺少这些非标准文件的类型声明，在 TS 文件中我们会得到一片一片的报错。

这两类文件就是最核心的逻辑存放了，接下来我们就可以来学习，如何让 JSX 与 TypeScript 进行融合了。先想想 TypeScript 最重要的优势是什么？无疑是类型约束带来的安全性，那么在 React 项目里什么地方最需要进行类型约束？当然是组件属性了！我们可以使用 TypeScript，描述一个组件能够接受的属性有哪些，分别又是什么类型，这样就能够避免传入了错误的属性时组件崩溃了。在 React 中，我们可以使用 React.FC 类型来描述一个函数式组件的类型，并通过它为属性类型预留的泛型坑位，来描述这个组件的属性类型：

```tsx
import * as React from 'react';

interface HomeProps {
  owner: string;
}

const Home: React.FC<HomeProps> = ({ owner }) => {
  return <>Home of {owner}</>;
};

const App1: React.FC = () => {
  // √
  return <Home owner='me' />;
};

const App2: React.FC = () => {
  // X 不能将类型“number”分配给类型“string”。
  return <Home owner={599} />;
};
```

  


除了这里，再想想还有什么地方我们会迫切地需要类型？前端页面中最重要的一个概念就是状态管理，而在 React 中，我们接触状态管理最常用的方式就是 React Hooks 中的 useState：

```tsx
function App() {
  const [count, setCount] = useState(0)
  return <></>
}

export default App
```

它同样为你预留了泛型坑位：

```tsx
function App() {
  const [count, setCount] = useState<number>(0)
  return <></>
}

export default App
```

这个例子看起来是否有点多此一举？TypeScript 会自动地尝试从你的输入值中推导实际的类型，比如这里其实是可以推导出 number 类型的，但如果说你的初始值是一个空数组，那么 TypeScript 就无能为力，只能推导出一个 `never[]` 类型了：

```tsx
function App() {
  // never[]
  const [list, setList] = useState([]);
  return <></>;
}

export default App;
```

此时指定类型就显得尤为重要了：

```tsx
function App() {
  // never[]
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    // x，对于每个元素，都会提示 不能将类型“number”分配给类型“string”。
    setList([1, 2, 3]);
  });

  return <></>;
}

export default App;
```

类似的，useRef 中也允许你传入一个类型参数，比如我们最常见的使用 ref 来存储 DOM 元素：

```tsx
const Container = () => {
  const domRef = useRef<HTMLDivElement>(null);

  const operateRef = () => {
    // element 能被推导为 HTMLDivElement | null 类型
    domRef.current?.getBoundingClientRect();
  };

  return <div ref={domRef}></div>;
};
```

在这一节，我们学习了 TypeScript 结合 React 的实战，从一个 Vite React 项目开始，我们一步步了解了一个 TypeScript + React 工程内各个文件的作用，Vite 为我们内置的 CSS 与 CSS Modules 类型声明的作用，以及 React 的 JSX 中我们可以添加类型的地方——当然，别忘记要把它升级成 TSX。在下一节，我们会继续了解 TypeScript 的实战场景——使用 TypeScript 来开发一个 npm 包。