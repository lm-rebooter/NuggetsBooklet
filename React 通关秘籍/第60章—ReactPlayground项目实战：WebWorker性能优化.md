功能实现的差不多以后，我们做下代码的优化。

大家觉得我们的 playground 有啥性能瓶颈没有？

用 Performace 跑下就知道了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89c8119ba9234dddbad5a97afd6b22d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2874&h=1376&s=310192&e=png&b=fefefe)

用无痕模式打开这个页面，无痕模式下不会跑浏览器插件，比较准确。

打开 devtools，点击 reload 重新加载页面：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1a824edac604e38a1d568679f08fac5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2852&h=1310&s=738991&e=gif&f=51&b=fdfdfd)

等页面渲染完点击停止，就可以看到录制的性能数据。

按住可以上下左右拖动，按住然后上下滑动可以放大缩小：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5aa2883224a74caa94da1cbcaaf11705~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2680&h=884&s=6603821&e=gif&f=58&b=fbf8f8)

这里的 main 就是主线程：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bdcbbcbc73043488d91efb5641b9379~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2604&h=828&s=294387&e=png&b=f7f1ed)

主线程会通过 event loop 的方式跑一个个宏任务，也就是这里的 task。

超过 50ms 的被称为长任务 long task：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2eaab1ad21f64edd86fb6bf4a2a35b3e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1940&h=598&s=199231&e=png&b=f2ece0)

long task 会导致主线程一直被占据，阻塞渲染，表现出来的就是页面卡顿。

性能优化的目标就是消除这种 long task。

图中的宽度代表耗时，可以看到是 babelTransform 这个方法耗费了 24 ms

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c142b810445436f8cc9d542a9ce3edf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1796&h=1034&s=172285&e=png&b=e6ebcd)

点击火焰图中的 babelTransform，下面会展示它的代码位置，点击可以跳到 Sources 面板的代码：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/189b1c2b87064c24bfcfec0ce1673201~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2878&h=1386&s=2404765&e=gif&f=48&b=f6efe6)

这就是我们要优化性能的代码。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2daf0a327121413ebcb67232fc4b68d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2510&h=1374&s=515123&e=png&b=ffffff)

这是 babel 内部代码，怎么优化呢？

其实这段代码就是计算量比较大，我们把它放到单独的 worker 线程来跑就好了，这样就不会占用主线程的时间。

vite 项目用 web worker 可以这样用：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c09d368df89a4fd690580b9038ca2399~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2242&h=1536&s=413076&e=png&b=fdfdfd)

我们用一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26456a740b714240901e2dd28599f803~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1616&h=692&s=183810&e=png&b=1c1c1c)

把 compiler.ts 改名为 compiler.worker.ts

然后在 worker 线程向主线程 postMessage

```javascript
self.postMessage({
    type: 'COMPILED_CODE',
    data: 'xx'
})
```

主线程里创建这个 worker 线程，监听 message 消息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bd983ec1df44c20ac7acb58e2b003a7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1576&h=1202&s=271431&e=png&b=1f1f1f)

```javascript
import CompilerWorker from './compiler.worker?worker'
```

```javascript
const compilerWorkerRef = useRef<Worker>();

useEffect(() => {
    if(!compilerWorkerRef.current) {
        compilerWorkerRef.current = new CompilerWorker();
        compilerWorkerRef.current.addEventListener('message', (data) => {
            console.log('worker', data)
        })
    }
}, []);
```
跑一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d3bdd64ba2a4939afb698b41e025f61~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1898&h=1442&s=306273&e=png&b=fefefe)

可以看到，主线程接收到了 worker 线程传过来的消息。

反过来通信也是一样的 postMessage 和监听 message 事件。

主线程这边给 worker 线程传递 files，然后拿到 woker 线程传回来的编译后的代码：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec46f97b98c1467299aa8ae8dada848e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1534&h=1176&s=276503&e=png&b=1f1f1f)

```javascript
import { useContext, useEffect, useRef, useState } from "react"
import { PlaygroundContext } from "../../PlaygroundContext"
import Editor from "../CodeEditor/Editor";
import iframeRaw from './iframe.html?raw'
import { IMPORT_MAP_FILE_NAME } from "../../files";
import { Message } from "../Message";
import CompilerWorker from './compiler.worker?worker'

interface MessageData {
    data: {
      type: string
      message: string
    }
}

export default function Preview() {

    const { files} = useContext(PlaygroundContext)
    const [compiledCode, setCompiledCode] = useState('')
    const [error, setError] = useState('')

    const compilerWorkerRef = useRef<Worker>();

    useEffect(() => {
        if(!compilerWorkerRef.current) {
            compilerWorkerRef.current = new CompilerWorker();
            compilerWorkerRef.current.addEventListener('message', ({data}) => {
                console.log('worker', data);
                if(data.type === 'COMPILED_CODE') {
                    setCompiledCode(data.data);
                } else {
                    //console.log('error', data);
                }
            })
        }
    }, []);

    useEffect(() => {
        compilerWorkerRef.current?.postMessage(files)
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
而 worker 线程这边则是监听主线程的 message，传递 files 编译后的代码给主线程：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94a23faa3d9545848f5a5dbacc3a4dbc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1256&h=710&s=145618&e=png&b=1f1f1f)

```javascript
self.addEventListener('message', async ({ data }) => {
    try {
        self.postMessage({
            type: 'COMPILED_CODE',
            data: compile(data)
        })
    } catch (e) {
         self.postMessage({ type: 'ERROR', error: e })
    }
})
```
可以看到，拿到了 worker 线程传过来的编译后的代码：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be0aeb2bdd7d463d9997333ab42cdfc5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2678&h=954&s=311275&e=png&b=fdfdfd)

预览也正常。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e40eb236999f43e084a62019d14e0387~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1612&h=536&s=124820&e=png&b=1f1f1f)

其实 files 变化没必要那么频繁触发编译，我们加个防抖：

```javascript
useEffect(debounce(() => {
    compilerWorkerRef.current?.postMessage(files)
}, 500), [files]);
```

我们再用 performance 看下优化后的效果：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/954abd87fa7641328e95ea8e093fe54b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2518&h=1290&s=322184&e=png&b=f6f0e3)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c69c3793e954cf1995acd22150c8f23~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2878&h=1386&s=921016&e=gif&f=30&b=f5eee1)

之前的编译代码的耗时没有了，现在被转移到了 worker 线程：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e4cb528a96048ccb57e311670deebfa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2066&h=1106&s=301171&e=png&b=f5efe9)

还是 24ms，但是不占据主线程了。

当然，因为我们文件内容很少，所以编译耗时少，如果文件多了，那编译耗时自然也就增加了，拆分就很有必要。

这样，性能优化就完成了。

然后再优化两处代码：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52578006ea474193ab5980df37b3198b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2638&h=1176&s=284934&e=png&b=fcfcfc)

main.tsx 有个编辑器错误说 StrictMode 不是一个 jsx，这种不用解决，也不影响运行，改下模版把它去掉就行了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8d8f64202074688a6fb9c5270f9179a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2044&h=646&s=167467&e=png&b=1d1d1d)

上面那个只要编辑下文件就会触发类型下载，也不用解决：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9128f1f7cffd4a2097f085082b5dbc6f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2764&h=1222&s=240358&e=gif&f=28&b=fdfdfd)

再就是我们生成的文件名没必要 6 位随机数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76a5420da59f45e58964cca438e0660d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2486&h=1252&s=322332&e=gif&f=37&b=fefefe)

改为 4 位正好：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31247d00c8704ae297be72b7359f7dfb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1594&h=406&s=113049&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44ffac62c832459b833914da19b38b2d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2486&h=1252&s=307984&e=gif&f=34&b=fefefe)

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/react-playground-project)。

## 总结

这节我们做了下性能优化。

我们用 Performance 分析了页面的 Event Loop，发现有 long task，**性能优化的目标就是消除 long task**。

分析发现是 babel 编译的逻辑导致的。

我们通过 Web Worker 把 babel 编译的逻辑放到了 worker 线程跑，通过 message 事件和 postMessage 和主线程通信。

拆分后功能正常，再用 Performance 分析，发现耗时逻辑被转移到了 worker 线程，主线程这个 long task 没有了。

这样就达到了性能优化的目的。

当需要编译的文件多了之后，这种性能优化就更有意义。
