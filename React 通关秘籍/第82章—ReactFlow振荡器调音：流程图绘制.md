这节我们来画下流程图。

创建个项目：

```
npx create-vite audio-flow
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30cae15096b44744b26151112dd972c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=768&h=392&s=68531&e=png&b=000000)

进入项目，安装下 reactflow

```
npm install
npm install --save @xyflow/react
```
去掉 index.css


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a87fd063b37843b994fee7dfe1d47fbf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=492&s=90816&e=png&b=1f1f1f)

然后改下 App.tsx

```javascript
import { addEdge, Background, BackgroundVariant, Connection, Controls, MiniMap, OnConnect, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds))
  }

  return (
    <div style={{ width: '100vw', height: '100vh'}}>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls/>
        <MiniMap/>
        <Background variant={BackgroundVariant.Lines}/>
      </ReactFlow>
    </div>
  );
}
```
我们写了下基础代码，加了两个 node，一个 edge，然后加了 Controles、Background、MiniMap 组件。

跑起来看一下：

```
npm run dev
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b99a835c6e77470a9bc229caf4201bc6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=902&h=318&s=44154&e=png&b=191919)


![2024-08-29 14.42.48.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c563c767f9fb43b299fcf7585e3913ab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2542&h=1324&s=435924&e=gif&f=64&b=fafafa)

没啥问题，只是流程图不在正中央。

加个 fitView 就好了：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50be05ae1e024d829c491d948f346f9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1050&h=754&s=125377&e=png&b=1f1f1f)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d8c9b0e7fa14b869df829171fef1607~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2492&h=1406&s=102007&e=png&b=fefefe)

接下来分别实现这三种自定义节点：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e08043d8a6d4ec9bcfbe2f2b5480fe1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=826&s=146957&e=png&b=fdfdfd)

我们用 tailwind 来写样式。

按照 [tailwind 文档](https://www.tailwindcss.cn/docs/guides/vite#react)里的步骤安装 tailwind：

```javascript
npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p
```

会生成 tailwind 和 postcss 配置文件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36df8c8c90d64b1b956c8072ffb60459~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=176&s=60899&e=png&b=1a1a1a)

修改下 content 配置，也就是从哪里提取 className：

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
tailwind 会提取 className 之后按需生成最终的 css。

改下 index.css 引入 tailwind 基础样式：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
在 main.tsx 里引入：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57edcbbb36c7466cabfc087c00137d94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074&h=488&s=91270&e=png&b=1f1f1f)

如果你没安装 tailwind 插件，需要安装一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7dfdd931a6946cfa629042c07b10e04~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1902&h=838&s=411909&e=png&b=1d1d1d)

这样在写代码的时候就会提示 className 和对应的样式值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c6aaecb875c4c289e7ab14562733ec9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1194&h=576&s=72772&e=png&b=1f1f1f)

不知道 className 叫啥的样式，还可以在 [tailwind 文档](https://www.tailwindcss.cn/docs/border-width)里搜：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7efbcb935b94005b51dbd4f4faed5b7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1716&h=1218&s=333844&e=png&b=ffffff)

接下来创建振荡器的自定义节点：

components/OscillatorNode.tsx

```javascript
import { Handle, Position } from '@xyflow/react';

export interface OscillatorNodeProps {
  id: string
  data: {
    frequency: number
    type: string
  }
}

export function OscillatorNode({ id, data }: OscillatorNodeProps) {
    return (
      <div className={'bg-white shadow-xl'}>
          <p className={'rounded-t-md p-[8px] bg-pink-500 text-white'}>振荡器节点</p>
          <div className={'flex flex-col p-[8px]'}>
            <span>频率</span>
            <input
                type="range"
                min="10"
                max="1000"
                value={data.frequency}
            />
            <span className={'text-right'}>{data.frequency}赫兹</span>
          </div>
          <hr className={'mx-[4px]'} />
          <div className={'flex flex-col p-[8px]'}>
            <p>波形</p>
            <select value={data.type}>
              <option value="sine">正弦波</option>
              <option value="triangle">三角波</option>
              <option value="sawtooth">锯齿波</option>
              <option value="square">方波</option>
            </select>
          </div>
          <Handle type="source" position={Position.Bottom} />
      </div>
    );
};
```
就是一个标题，一个 input，一个 select，用 tailwind 写下样式。

可以通过 data 传入 frequency、type

用一下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8366155f090e4f85a7e3f0725af7fbfc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1808&h=1306&s=313143&e=png&b=1f1f1f)

```javascript
import { addEdge, Background, BackgroundVariant, Connection, Controls, MiniMap, OnConnect, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { OscillatorNode } from './components/OscillatorNode';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { frequency: 300, type: 'square' }, type: 'osc' },
  { id: '2', position: { x: 0, y: 300 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const nodeTypes = {
  'osc': OscillatorNode
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds))
  }

  return (
    <div style={{ width: '100vw', height: '100vh'}}>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls/>
        <MiniMap/>
        <Background variant={BackgroundVariant.Lines}/>
      </ReactFlow>
    </div>
  );
}
```
看下效果：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bea6701ec8804c59a4e8fa88ffaa7da7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2622&h=1484&s=179746&e=png&b=fefefe)

可以看到，节点替换为了我们自定义的节点，并且根据传入的 data 做了表单回显。

接下来写下第二种自定义节点：

components/VolumeNode.tsx

```javascript
import { Handle, Position } from '@xyflow/react';

export interface VolumeNodeProps {
  id: string
  data: {
    gain: number
  }
}

export function VolumeNode({ id, data }: VolumeNodeProps) {
    return (
        <div className={'rounded-md bg-white shadow-xl'}>
            <Handle type="target" position={Position.Top} />

            <p className={'rounded-t-md p-[4px] bg-blue-500 text-white'}>音量节点</p>
            <div className={'flex flex-col p-[4px]'}>
                <p>Gain</p>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={data.gain}
                />
                <p className={'text-right'}>{data.gain.toFixed(2)}</p>
            </div>

            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
```

主要是上下两个 Handle、中间一个 input。

用一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cd29cc3fae0457da24fed96bcde1ca1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1790&h=1256&s=332726&e=png&b=1f1f1f)

```javascript
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { frequency: 300, type: 'square' }, type: 'osc' },
  { id: '2', position: { x: 0, y: 300 }, data: { gain: 0.6 }, type: 'volume' },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const nodeTypes = {
  'osc': OscillatorNode,
  'volume': VolumeNode
}
```
看下效果：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11b8adac194d4d0fb59154ec3a4f737a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2328&h=1436&s=177606&e=png&b=fdfdfd)

可以看到，音量节点也渲染出来了。

然后来写最后一个节点：输出节点

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e08043d8a6d4ec9bcfbe2f2b5480fe1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=826&s=146957&e=png&b=fdfdfd)

components/OutputNode.tsx

```javascript
import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

export function OutputNode() {
    const [isRunning, setIsRuning] = useState(false);

    function toggleAudio() {
        setIsRuning(isRunning => !isRunning)
    }

    return <div className={'bg-white shadow-xl p-[20px]'}>
        <Handle type="target" position={Position.Top} />

        <div>
            <p>输出节点</p>
            <button onClick={toggleAudio}>
                {isRunning ? (
                    <span role="img">
                    🔈
                    </span>
                ) : (
                    <span role="img">
                    🔇
                    </span>
                )}
            </button>
        </div>
    </div>
}
```
用一下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae8066712a01404f8c4386d3b36eeba0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1786&h=1262&s=349579&e=png&b=1f1f1f)

加一个节点类型，然后加一个节点、一条边。

```javascript
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { frequency: 300, type: 'square' }, type: 'osc' },
  { id: '2', position: { x: 0, y: 300 }, data: { gain: 0.6 }, type: 'volume' },
  { id: '3', position: { x: 0, y: 500 }, data: { }, type: 'out' },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

const nodeTypes = {
  'osc': OscillatorNode,
  'volume': VolumeNode,
  'out': OutputNode
}
```

看下效果：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6253ff52e9b4cd5a2f386e6aab015de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2724&h=1480&s=204984&e=png&b=fdfdfd)

这样，三种自定义节点就都画出来了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/audio-flow)

## 总结

我们创建了 vite 项目，引入了 tailwind 来写样式。

然后实现了流程图的绘制，主要是三种自定义节点的绘制：

振荡器节点、音量节点、输出节点。

流程图画完了，下节来开发音频部分的功能。
