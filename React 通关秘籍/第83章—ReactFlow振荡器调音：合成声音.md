这节来写音频部分，通过流程图设置参数，然后生成声音。

我们先用一下 AudioContext 的 api。

创建 audio.ts

```javascript
const context = new AudioContext();

const osc = context.createOscillator();
osc.frequency.value = 220;
osc.type = 'square';
osc.start();

const volume = context.createGain();
volume.gain.value = 0.5;

const out = context.destination;

osc.connect(volume);
volume.connect(out);
```
创建一个 Oscillator 节点，一个 Gain 节点，和 destination 节点连接起来：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b7355f7f1854403a0d0b69d6b46eaea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=256&s=21626&e=png&b=ffffff)

Oscillator 振荡器节点产生不同波形、频率的声音，Gain 节点调节音量，然后 destination 节点播放声音。

在 main.ts 里引入下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bc00cefaf344c84b0092cd40d349792~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=556&s=99721&e=png&b=1f1f1f)

这时候你在页面上就能听到声音了。

[jaudio](https://lf-activity-static.juejin.cn/obj/juejin-activity-static/user_book/2788017216685118_1724930888896_3064.mp3)

有 connect 当然也有 disconnect：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0be68997957e49239d89c837a6ddc0f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=828&h=812&s=132493&e=png&b=1f1f1f)

断开节点的连接就没声音了。

connect、disconnect 在流程图上就是 edge 的创建和删除。

所以很容易把两者结合起来。

而且你可以用两个振荡器节点 connect 到一个 destination

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5eaa6df937646219f719a6e7f16a272~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1244&h=438&s=43538&e=png&b=ffffff)

对应的代码就是这样：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a10a33ec17347979337be75ea669f7b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=938&h=1166&s=201232&e=png&b=1f1f1f)

```javascript
const context = new AudioContext();

const osc = context.createOscillator();
osc.frequency.value = 220;
osc.type = 'square';
osc.start();

const volume = context.createGain();
volume.gain.value = 0.5;

const out = context.destination;

osc.connect(volume);
volume.connect(out);

const osc2 = context.createOscillator();
osc2.frequency.value = 800;
osc2.type = 'sine';
osc2.start();

const volume2 = context.createGain();
volume2.gain.value = 0.5;

osc2.connect(volume2);
volume2.connect(out);
```
两个振荡器分别设置不同的波形、频率，产生不同的声音。

你可以听一下，声音是不是两者的合并：

[jaudio](https://lf-activity-static.juejin.cn/obj/juejin-activity-static/user_book/2788017216685118_1724934947163_9470.mp3)

对比听下之前的：

[jaudio](https://lf-activity-static.juejin.cn/obj/juejin-activity-static/user_book/2788017216685118_1724930888896_3064.mp3)

对应到流程图就是这样的：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df7b6f4a05854adb9fff079cf96ef7d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1426&h=1282&s=191687&e=png&b=fdfdfd)

接下来我们就来实现流程图操作到 audio 的对应。

改下 Audio.tsx

```javascript
const context = new AudioContext();

const osc = context.createOscillator();
osc.frequency.value = 220;
osc.type = 'square';
osc.start();

const volume = context.createGain();
volume.gain.value = 0.5;

const out = context.destination;

const nodes = new Map();

nodes.set('a', osc);
nodes.set('b', volume);
nodes.set('c', out);

export function isRunning() {
  return context.state === 'running';
}

export function toggleAudio() {
  return isRunning() ? context.suspend() : context.resume();
}

export function updateAudioNode(id: string, data: Record<string, any>) {
    const node = nodes.get(id);
  
    for (const [key, val] of Object.entries(data)) {
      if (node[key] instanceof AudioParam) {
        node[key].value = val;
      } else {
        node[key] = val;
      }
    }
}

export function removeAudioNode(id: string) {
    const node = nodes.get(id);
  
    node.disconnect();
    node.stop?.();
  
    nodes.delete(id);
}

export function connect(sourceId: string, targetId: string) {
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);
  
    source.connect(target);
}

export function disconnect(sourceId: string, targetId: string) {
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);
    source.disconnect(target);
}


export function createAudioNode(id: string, type: string, data: Record<string, any>) {
  switch (type) {
    case 'osc': {
      const node = context.createOscillator();
      node.frequency.value = data.frequency;
      node.type = data.type;
      node.start();

      nodes.set(id, node);
      break;
    }

    case 'volume': {
      const node = context.createGain();
      node.gain.value = data.gain;

      nodes.set(id, node);
      break;
    }
  }
}
```
从上往下看：

因为可能有多个振荡器节点、音量节点，所以用一个 Map 来存储，key 是流程图节点 id：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5eaa6df937646219f719a6e7f16a272~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1244&h=438&s=43538&e=png&b=ffffff)

首先，内置 3 个节点：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/701d54954b0e486286a235b3bec3b1f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=950&h=798&s=133354&e=png&b=1f1f1f)

然后暴露了一个 createAudioNode 的方法来创建两种节点（destination 节点只有一个）：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8fb1e3f67c34a2fb0a3d05f7eb7ca9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1702&h=1058&s=192380&e=png&b=1f1f1f)

创建完加到 Map 里。

然后提供两个 Audio 节点的连接和断开连接的方法：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f369b90d7c54c91af5f98919eaf4724~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1274&h=600&s=145465&e=png&b=1f1f1f)

这就是我们用流程图节点 id 来作为 Map 的 key 的好处，可以直接把流程图节点的操作对应到 Audio 节点。

然后暴露一个删除 Audio 节点的方法：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59239cfb79674050bb977d8173bbaca7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=380&s=62629&e=png&b=1f1f1f)

首先 disconnect 所有的连接，然后 stop 这个 Audio 节点，之后从 map 中删除它。

然后是更新参数的方法：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92d9389bf03147feb13f7c4a56387852~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1348&h=496&s=92810&e=png&b=1f1f1f)

两种流程图节点中的参数修改，就通过这个方法更新到 Audio 节点


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eef8e2bbe3c244f7a6922e55c3e2e901~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=864&h=1416&s=110351&e=png&b=fdfdfd)

最后暴露一个暂停、修复声音播放的方法：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5953d21e69a94e94bf96cee7a87b707b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1218&h=414&s=79279&e=png&b=1f1f1f)

总结一下，就是用一个 Map 保存所有的 Audio 节点，key 为对应流程图节点的 id，然后暴露创建节点、节点连接、删除节点、更新节点参数，暂停、恢复播放的方法。

之后就可以把节点的 onNodeChanges、onEdgeChanges、onConnect 事件对应到这些 更新 audio 节点的方法了。

改下 App.tsx

初始有 a、b、c 三个节点：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9647783dbf7f44bcb0a27f63e3c67a1d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=1160&s=173833&e=png&b=1f1f1f)

没有边。

流程图节点 connect 的时候，顺便也把对应的 Audio 节点 connect：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abf2aaa1ae924209997185c72dc8aaa5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1314&h=1194&s=259258&e=png&b=1f1f1f)

```javascript
const initialNodes: Node[] =  [
  {
      id: 'a',
      type: 'osc',
      data: { frequency: 220, type: 'square' },
      position: { x: 200, y: 0 }
  },
  { 
      id: 'b', 
      type: 'volume', 
      data: { gain: 0.5 },
      position: { x: 150, y: 250 } 
  },
  { 
      id: 'c',
      type: 'out',
      data: {},
      position: { x: 350, y: 400 } 
  }
];

const initialEdges:Edge[] = [];
```
```javascript
connect(params.source, params.target);
```
然后你再在界面上连下线：

![2024-08-29 21.13.32.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38157591c33b48a0b0d1ab9362675cb9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2870&h=1536&s=535660&e=gif&f=49&b=fbfbfb)

连完 3 个节点，你会发现还是没声音。

因为默认是在 suspend 状态，需要 resume 一下：

我们在 OutputNode 点击喇叭的时候调用下 toogleAudio 来切换状态：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee177c767abc4d94abe24932946e581e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270&h=1312&s=237238&e=png&b=1f1f1f)

这样点击喇叭就有声音了：

![2024-08-29 21.51.05.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ae74df9663a4460b3063e6c67ec4ac0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2870&h=1536&s=573400&e=gif&f=31&b=fbfbfb)

再点击一次就会暂停。

然后再支持下参数的调整：

在 onChange 的时候，修改 audio 节点的参数：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc3899e77b004769a307b396594a685b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1624&h=1382&s=315192&e=png&b=1f1f1f)
```javascript
import { Handle, Position } from '@xyflow/react';
import { updateAudioNode } from '../Audio';
import { ChangeEvent, ChangeEventHandler, useState } from 'react';

export interface VolumeNodeProps {
  id: string
  data: {
    gain: number
  }
}

export function VolumeNode({ id, data }: VolumeNodeProps) {
    const [gain, setGain] = useState(data.gain);

    const changeGain: ChangeEventHandler<HTMLInputElement> = (e) => {
        setGain(+e.target.value);
        updateAudioNode(id, { gain: +e.target.value })
    }

    return (
        <div className={'rounded-md bg-white shadow-xl'}>
            <Handle type="target" position={Position.Top} />

            <p className={'rounded-t-md p-[4px] bg-blue-500 text-white'}>音量节点</p>
            <div className={'flex flex-col p-[4px]'}>
                <p>Gain</p>
                <input
                    className="nodrag"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={gain}
                    onChange={changeGain}
                />
                <p className={'text-right'}>{gain.toFixed(2)}</p>
            </div>

            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
```
试一下：

![2024-08-30 08.06.37.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73ca7d821cab42cf830292a66e0967e6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2870&h=1536&s=638845&e=gif&f=30&b=fbfbfb)

拖动调整音量，你能听到声音大小的变化。

[jaudio](https://lf-activity-static.juejin.cn/obj/juejin-activity-static/user_book/2788017216685118_1724975765635_1230.mp3)

注意，这里加上了 nodrag：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7466fdcef5b74049a684cd2eaf243ffb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1356&h=708&s=133232&e=png&b=1f1f1f)

不加的话拖动进度条就变成了拖动节点：

![2024-08-30 07.56.40.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/955c60960ce6416da6d6b8dd3569bb64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2870&h=1536&s=1171032&e=gif&f=30&b=fbfbfb)

这个是 react flow 提供的用于禁止拖动的 className：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8df35b89a2ec4ab4aa169dfeb90bfd50~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1900&h=466&s=111954&e=png&b=ffffff)

同样的方式处理下 OscillatorNode

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05940da5fc0a4b8a8bf2d216d94f432f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1370&h=1222&s=319524&e=png&b=202020)


```javascript
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { updateAudioNode } from '../Audio';
import { ChangeEvent, ChangeEventHandler, useState } from 'react';

export interface OscillatorNodeProps {
  id: string
  data: {
    frequency: number
    type: string
  }
}

export function OscillatorNode({ id, data }: OscillatorNodeProps) {
    const [frequency, setFrequency] = useState(data.frequency);
    const [type, setType] = useState(data.type);

    const changeFrequency: ChangeEventHandler<HTMLInputElement> = (e) => {
      setFrequency(+e.target.value);
      updateAudioNode(id, { frequency: +e.target.value })
    }

    const changeType: ChangeEventHandler<HTMLSelectElement> = (e) => {
      setType(e.target.value);
      updateAudioNode(id, { type: e.target.value })
    }

    return (
      <div className={'bg-white shadow-xl'}>
          <p className={'rounded-t-md p-[8px] bg-pink-500 text-white'}>振荡器节点</p>
          <div className={'flex flex-col p-[8px]'}>
            <span>频率</span>
            <input
                className='nodrag'
                type="range"
                min="10"
                max="1000"
                value={frequency}
                onChange={changeFrequency}
            />
            <span className={'text-right'}>{frequency}赫兹</span>
          </div>
          <hr className={'mx-[4px]'} />
          <div className={'flex flex-col p-[8px]'}>
            <p>波形</p>
            <select value={type} onChange={changeType}>
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

![2024-08-30 08.11.10.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58635c54c05342e68901421b5d78e475~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2870&h=1536&s=918558&e=gif&f=70&b=fbfbfb)

现在就能听到不同频率、波形的声音了。

然后我们再支持下添加振荡器节点和音量节点：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d95e5d15c4f2469f814041aaa0327bee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=1378&s=338301&e=png&b=1f1f1f)

```javascript
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, EdgeTypes, MiniMap, Node, OnConnect, Panel, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { OscillatorNode } from './components/OscillatorNode';
import { VolumeNode } from './components/VolumeNode';
import { OutputNode } from './components/OutputNode';
import { connect, createAudioNode } from './Audio';

const initialNodes: Node[] =  [
  {
      id: 'a',
      type: 'osc',
      data: { frequency: 220, type: 'square' },
      position: { x: 200, y: 0 }
  },
  { 
      id: 'b', 
      type: 'volume', 
      data: { gain: 0.5 },
      position: { x: 150, y: 250 } 
  },
  { 
      id: 'c',
      type: 'out',
      data: {},
      position: { x: 350, y: 400 } 
  }
];

const initialEdges:Edge[] = [];

const nodeTypes = {
  'osc': OscillatorNode,
  'volume': VolumeNode,
  'out': OutputNode
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = (params: Connection) => {
    connect(params.source, params.target);
    setEdges((eds) => addEdge(params, eds))
  }

  function addOscNode() {
    const id = Math.random().toString().slice(2, 8);
    const position = { x: 0, y: 0 };
    const type = 'osc';
    const data = {frequency: 400, type: 'sine' };

    setNodes([...nodes, {id, type, data, position}])
    createAudioNode(id, type, data);
  }

  function addVolumeNode() {
    const id = Math.random().toString().slice(2, 8);
    const data = { gain: 0.5 };
    const position = { x: 0, y: 0 };
    const type = 'volume';
  
    setNodes([...nodes, {id, type, data, position}])
    createAudioNode(id, type, data);
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
        <Panel className={'space-x-4'}  position="top-right">
          <button className={'p-[4px] rounded bg-white shadow'}  onClick={addOscNode}>添加振荡器节点</button>
          <button className={'p-[4px] rounded bg-white shadow'}  onClick={addVolumeNode}>添加音量节点</button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
```
试一下：


![2024-08-30 08.24.31.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4330865bfb83401dbf81ac40945af092~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2870&h=1536&s=1746933&e=gif&f=70&b=fbfbfb)

这样，添加节点就完成了。

多个节点的时候，声音是它们的合成音。

我们还没处理流程节点删除的时候，去掉 Audio Node，也做一下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5de88b20225345f79fd39a921fdc48f5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=872&h=816&s=153155&e=png&b=1f1f1f)

```javascript
onNodesDelete={(nodes) => {
  for (const { id } of nodes) {
    removeAudioNode(id)
  }
}}
onEdgesDelete={(edges) => {
  for (const item of edges) {
    const { source, target} = item
    disconnect(source, target);
  }
}}
```
节点删除对应 removeAudioNode，边删除对应 disconnect。

至此，我们的 React Flow 振荡器调音就完成了。

不过现在不好操作，Handle 有点小，我们加大一点：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc071d4693b84e4baf1dea233e278414~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1502&h=1010&s=228930&e=png&b=202020)

看下效果：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2810f47840b54bc3a3d257581c9b33ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2150&h=1434&s=317001&e=png&b=fcfcfc)

这样，操作起来就方便多了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/audio-flow)

## 总结

这节我们实现了流程图节点和 AudioContext 节点的同步。

Audio 是通过 createOscillator 创建振荡器节点，通过 createGain 创建音量节点，然后把它们 connect 起来 connect 到 context.destination 节点播放声音。

这和 React Flow 流程图的节点创建、节点连接很容易对应上。

我们分别把流程图节点的 connect 对应到 Audio Node 的 connect 上。

流程图节点表单参数的修改对应到相同 id 的 Audio Node 的参数修改。

流程图节点的创建、删除对应到 Audio Node 的添加删除上。

这样，就可以可视化的调音了。
