这节我们继续完善 playground 的功能。

首先，我们预览出错时，iframe 会白屏，并不会显示错误。

比如当依赖的模块找不到的时候：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ab6832fedd1440f901da5b3e4bd49f5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2606&h=1364&s=217986&e=gif&f=28&b=fefdfd)

这时候在 devtools 可以看到错误信息：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d75693698e145e5a7e7869bef1ada18~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1510&h=340&s=93101&e=png&b=fcf7f7)

但总不能让开发者自己打开 devtools 看，我们要在页面做一下错误的显示。

新增 components/Message/index.tsx 组件

```javascript
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'

import styles from './index.module.scss'

export interface MessageProps {
    type: 'error' | 'warn'
    content: string
}

export const Message: React.FC<MessageProps> = (props) => {
  const { type, content } = props
  const [visible, setVisible] = useState(false)

  useEffect(() => {
      setVisible(!!content)
  }, [content])

  return visible ? (
    <div className={classnames(styles.msg, styles[type])}>
      <pre dangerouslySetInnerHTML={{ __html: content }}></pre>
      <button className={styles.dismiss} onClick={() => setVisible(false)}>
        ✕
      </button>
    </div>
  ) : null
}
```
传入两个参数，type 是 error 还是 warn，还有错误内容 content。

这里 cotent 要作为 html 的方式设置到 pre 标签的标签体。

React 里设置 html 要用 dangerouslySetInnerHTML={{\_html: 'xxx'}} 的方式。

用 visible 的 state 控制显示隐藏，当传入内容的时候，设置 visible 为 true。

写下样式：

index.module.scss
```scss
.msg {
    position: absolute;
    right: 8px;
    bottom: 0;
    left: 8px;
    z-index: 10;

    display: flex;
    max-height: calc(100% - 300px);
    min-height: 40px;
    margin-bottom: 8px;
    color: var(--color);

    background-color: var(--bg-color);
    border: 2px solid #fff;
    border-radius: 6px;

    border-color: var(--color);
  
    &.error {
      --color: #f56c6c;
      --bg-color: #fef0f0;
    }
  
    &.warn {
      --color: #e6a23c;
      --bg-color: #fdf6ec;
    }
}
  
pre {
    padding: 12px 20px;
    margin: 0;
    overflow: auto;
    white-space: break-spaces;
}
  
.dismiss {
    position: absolute;
    top: 2px;
    right: 2px;

    display: block;
    width: 18px;
    height: 18px;
    padding: 0;

    font-size: 9px;
    line-height: 18px;
    color: var(--bg-color);

    text-align: center;
    cursor: pointer;
    background-color: var(--color);
    border: none;
    border-radius: 9px;
}
```
.msg 绝对定位在底部，设置下宽高。

.dismss 绝对定位在 .msg 的右上角。

注意，.error 和 .warn 的时候 color 和 background-color 都不同，我们声明了两个 css 变量。

css 变量可以在它元素和子元素 css 里生效，所以切换了 .error 和 .warn 就切换了整体的颜色：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/734c14cdfe254ae6ae793242269d13d2~tplv-k3u1fbpfcp-watermark.image?)

在 Preview 组件引入下试试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07c610ceb0394f3981b3e363fdab51d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1274&h=748&s=139288&e=png&b=1f1f1f)

```javascript
<Message type='warn' content={new Error().stack!.toString()} />
```
看下效果：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e7b981f88c1410ea338c0c5417c2fef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2868&h=1544&s=557007&e=gif&f=23&b=fdf8f7)

把 type 换成 error，再缩小下窗口试试：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddab8bd9d9c94d8993008b7ff3648bc8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1736&h=1046&s=1817146&e=gif&f=51&b=fdfcfc)

没啥问题。

那展示的错误内容从哪里来呢？

从 iframe 里传出来。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b93c9cceefae47ae9fac9376f6e1240a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1206&h=690&s=145893&e=png&b=1f1f1f)

```html
<script>
    window.addEventListener('error', (e) => {
        window.parent.postMessage({type: 'ERROR', message: e.message})
    })
</script>
```
通过 postMessage 传递消息给父窗口。

然后在 Preview 组件里监听下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e049c1659afd41d190706a8e7e27a121~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=1152&s=226601&e=png&b=1f1f1f)

```javascript
import { useContext, useEffect, useState } from "react"
import { PlaygroundContext } from "../../PlaygroundContext"
import Editor from "../CodeEditor/Editor";
import { compile } from "./compiler";
import iframeRaw from './iframe.html?raw'
import { IMPORT_MAP_FILE_NAME } from "../../files";
import { Message } from "../Message";

interface MessageData {
    data: {
      type: string
      message: string
    }
}

export default function Preview() {

    const { files} = useContext(PlaygroundContext)
    const [compiledCode, setCompiledCode] = useState('')

    useEffect(() => {
        const res = compile(files);
        setCompiledCode(res);
    }, [files]);

    const getIframeUrl = () => {
        const res = iframeRaw.replace(
            '<script type="importmap"></script>', 
            `<script type="importmap">${
                files[IMPORT_MAP_FILE_NAME].value
            }</script>`
        ).replace(
            '<script type="module" id="appSrc"></script>',
            `<script type="module" id="appSrc">${compiledCode}</script>`,
        )
        return URL.createObjectURL(new Blob([res], { type: 'text/html' }))
    }

    useEffect(() => {
        setIframeUrl(getIframeUrl())
    }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]);

    const [iframeUrl, setIframeUrl] = useState(getIframeUrl());

    const [error, setError] = useState('')

    const handleMessage = (msg: MessageData) => {
        const { type, message } = msg.data
        if (type === 'ERROR') {
          setError(message)
        }
    }

    useEffect(() => {
        window.addEventListener('message', handleMessage)
        return () => {
          window.removeEventListener('message', handleMessage)
        }
    }, [])

    return <div style={{height: '100%'}}>
        <iframe
            src={iframeUrl}
            style={{
                width: '100%',
                height: '100%',
                padding: 0,
                border: 'none',
            }}
        />
        <Message type='error' content={error} />

        {/* <Editor file={{
            name: 'dist.js',
            value: compiledCode,
            language: 'javascript'
        }}/> */}
    </div>
}
```
试下效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ec3d96e05824decb38ee0294c0572c8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2450&h=1154&s=236107&e=gif&f=29&b=fefefe)

错误展示出来了，这就是控制台那个报错：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b4a6b84036649cbb4880501c95a7d30~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2016&h=340&s=116185&e=png&b=fdf9f9)

这里暂时用不到 warn，后面用到 warn 再切换 type。

然后再来做下主题切换：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a9fda9901ce473d9c02c581fa48d981~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2754&h=1372&s=563626&e=gif&f=26&b=fdfdfd)

这个同样要在 context 里保存配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2448cee65d24f649004ae799c83c271~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=1308&s=302368&e=png&b=1f1f1f)

然后加一个 theme 对应的 className：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b31e9668fb94eceae3781221cda1f1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=956&h=1188&s=227327&e=png&b=1f1f1f)

写下用到的样式：

```css
.light {
    --text: #444;
    --bg: #fff;
}
  
.dark {
    --text: #fff;
    --bg: #1a1a1a;
} 
```

还记得前面讲过 css 变量的生效范围么？

在元素和它的所有子元素里生效。

所以只要把之前 css 的样式值改成这些变量就可以了。

比如我们在 Header 组件里用下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0802b2e5728a45df9c5eea7c4d08cc6e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1260&h=848&s=199222&e=png&b=1c1c1c)

然后把 theme 初始值改为 dark

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1e570e5857e4bd9ba15d3fd648da2d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1160&h=392&s=132242&e=png&b=1f1f1f)

这时候 Header 就切换为暗色主题了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2376d05d911941fbb2380c74f90592f4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2870&h=1162&s=212766&e=png&b=ffffff)

改为 light 就会变回来：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a71c86027fb4b53a06888bc5d4414a1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2846&h=1082&s=207534&e=png&b=ffffff)

这就是主题切换的原理：

声明一些全局的 css 变量，写样式的时候用这些变量。切换主题时切换不同的全局变量值即可。

切成暗色主题后可以看到周边有点间距，加下重置样式：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9183eff95592443392bc223982b5386f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=430&s=66932&e=png&b=1c1c1c)

然后我们在 Header 加一个切换主题的按钮：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85915f807cb147c0aba43b94e562b44b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1210&h=1230&s=263110&e=png&b=1f1f1f)

```javascript
import styles from './index.module.scss'

import logoSvg from './icons/logo.svg';
import { useContext } from 'react';
import { PlaygroundContext } from '../../PlaygroundContext';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

export default function Header() {
  const { theme, setTheme} = useContext(PlaygroundContext)

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img alt='logo' src={logoSvg}/>
        <span>React Playground</span>
      </div>
      <div className={styles.links}>
        {theme === 'light' && (
          <MoonOutlined
            title='切换暗色主题'
            className={styles.theme}
            onClick={() => setTheme('dark')}
          />
        )}
        {theme === 'dark' && (
          <SunOutlined
            title='切换亮色主题'
            className={styles.theme}
            onClick={() => setTheme('light')}
          />
        )}
      </div>
    </div>
  )
}
```
安装用到的 icon 包：

```javascript
npm install @ant-design/icons --save
```

试下效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/592466e1bfb14fc8af2ef3f58ed1211d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1802&h=1170&s=220278&e=gif&f=33&b=fefefe)

确实能切换了，不过我们要完善下暗色主题的样式。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88fb6728d4994ccbb4f72373ce6ce5eb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=734&h=468&s=80098&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af8def13fdb34f6eb267257f94dfbff3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2204&h=1210&s=241005&e=gif&f=28&b=fdfdfd)

其余地方也是同理。

再改下 FileNameList 的样式：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/373dc31f8b724d43bcaa16aa60e915be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1158&h=704&s=161445&e=png&b=1c1c1c)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/268be8a6c2fa437292f69699d1b32523~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2232&h=1138&s=265680&e=gif&f=30&b=fefefe)

编辑器同样也可以切换主题，这个是 monaco editor 自带的。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d39ecf206f5f40ecac063fbdd7b0982d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1376&h=982&s=185128&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ad369f4498e4a8ca831b3ee887d70d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2868&h=1314&s=537354&e=gif&f=43&b=fefefe)

这样，主题切换功能就完成了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/react-playground-project)，可以切换到这个 commit 查看：

```
git reset --hard 4a77f1bf3dc8be9e270cc346145fde6a6a896b89
```

## 总结

这节我们实现了错误显示和主题切换功能。

我们创建了 Message 组件来显示错误，iframe 里监听 error 事件，发生错误的时候通过 postMessage 传递给父窗口。

父窗口里监听 message 事件传过来的错误，用 Message 组件显示。

主题切换就是在根元素加一个 .light、.dark 的 className，里面声明 css 变量，因为 css 变量可以在子元素里生效，子元素写样式基于这些变量，那切换了 className 也就切换了这些变量的值，从而实现主题切换。

实现这两个功能后，我们的 playground 就更完善了。
