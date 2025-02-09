拖拽是常见的需求，在 react 里我们会用 react-dnd 来做。

这节我们通过一个拖拽排序的案例来入门下 react-dnd。

我们这篇文章会实现 3 个案例：

```javascript
npx create-react-app --template=typescript react-dnd-test
```
新建个 react 项目

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/098f02a9584a44caa14b9e8c89cd6d87~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=224&s=83039&e=png&b=000000)

安装 react-dnd 相关的包：

```
npm install react-dnd react-dnd-html5-backend
```
然后改一下 App.tsx

```javascript
import './App.css';

function Box() {
  return <div className='box'></div>
}

function Container() {
  return <div className="container"></div>
}

function App() {
  return <div>
    <Container></Container>
    <Box></Box>
  </div>
}

export default App;
```
css 部分如下：

```css
.box {
  width: 50px;
  height: 50px;
  background: blue;
  margin: 10px;
}

.container {
  width: 300px;
  height: 300px;
  border: 1px solid #000;
}
```

把它跑起来：

```
npm run start
```

是这样的：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a87a4da969324f2eabad176600aeb3a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=884&h=932&s=29667&e=png&b=ffffff)

现在我们想把 box 拖拽到 container 里，用 react-dnd 怎么做呢？

dnd 是 drag and drop 的意思，api 也分有两个 useDrag 和 useDrop。

box 部分用 useDrag 让元素可以拖拽：

```javascript
function Box() {
  const ref = useRef(null);

  const [, drag]= useDrag({
    type: 'box',
    item: {
      color: 'blue'
    }
  });

  drag(ref);

  return <div ref={ref} className='box'></div>
}
```
用 useRef 保存 dom 引用，然后用 useDrag 返回的第二个参数处理它。

至于 type 和 item，后面再讲。

然后是 Container：

```javascript
function Container() {
  const ref = useRef(null);

  const [,drop] = useDrop(() => {
    return {
      accept: 'box',
      drop(item) {
        console.log(item);
      }
    }
  });
  drop(ref);

  return <div ref={ref} className="container"></div>
}
```
用 useDrop 让它可以接受拖拽过来的元素。

接收什么元素呢？

就是我们 useDrag 的时候声明的 type 的元素。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ef593f753ee4bdba48e8dc67fae4d11~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=992&h=1170&s=148040&e=png&b=1f1f1f)

在 drop 的时候会触发 drop 回调函数，第一个参数是 item，就是 drag 的元素声明的那个。

只是这样还不行，还要在根组件加上 Context：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29131c45d90e461e8576e7ae57d23d23~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1500&h=548&s=133577&e=png&b=1f1f1f)

```javascript
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<DndProvider backend={HTML5Backend}><App></App></DndProvider>);
```
之前是直接渲染 App，现在要在外面加上 DndProvider。

这个就是设置 dnd 的 context的，用于在不同组件之间共享数据。

然后我们试试看：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1b14269550b44628e861e83f76dd950~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1166&h=1236&s=167636&e=gif&f=25&b=fdfdfd)

确实，现在元素能 drag 了，并且拖到目标元素也能触发 drop 事件，传入 item 数据。

那如果 type 不一样呢？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c0ea643b53a4cbaa0329a611b390970~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1064&h=1178&s=160068&e=png&b=202020)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b30d03ad74ed43cda507b39e958e7dd8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1194&h=1126&s=186738&e=gif&f=23&b=fefefe)

那就触发不了 drop 了。

然后我们给 Box 组件添加一个 color 的 props，用来设置背景颜色：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a08c4576d2ef48b8b00b512b7ee7872a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=964&h=994&s=120760&e=png&b=1f1f1f)

并且给 item 的数据加上类型。

```javascript
interface ItemType {
  color: string;
}
interface BoxProps {
  color: string
}
function Box(props: BoxProps) {
  const ref = useRef(null);

  const [, drag]= useDrag({
    type: 'box',
    item: {
      color: props.color
    }
  });

  drag(ref);

  return <div ref={ref} className='box' style={
    { background: props.color || 'blue'}
  }></div>
}
```
添加几个 Box 组件试一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c3154fcedda4fe48a585652f0512079~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=630&h=458&s=59178&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c1c168b06be4fc596bf702183d762aa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=900&h=1202&s=35762&e=png&b=ffffff)

没啥问题。

然后我们改下 Container 组件，增加一个 boxes 数组的 state，在 drop 的时候把 item 加到数组里，并触发渲染：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c8afb456b8b4697b47b8941bb440ee3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=1016&s=138239&e=png&b=1f1f1f)

```javascript
function Container() {
  const [boxes, setBoxes] = useState<ItemType[]>([]);

  const ref = useRef(null);

  const [,drop] = useDrop(() => {
    return {
      accept: 'box',
      drop(item: ItemType) {
        setBoxes((boxes) => [...boxes, item])
      }
    }
  });
  drop(ref);

  return <div ref={ref} className="container">
    {
      boxes.map(item => {
        return <Box color={item.color}></Box>
      })
    }
  </div>
}
```
这里 setBoxes 用了函数的形式，这样能拿到最新的 boxes 数组，不然会形成闭包，始终引用最初的空数组。

测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a351c740e1504a168f8923c79c7acda0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1374&h=1224&s=239320&e=gif&f=47&b=fefefe)

这样，拖拽到容器里的功能就实现了。

我们再加上一些拖拽过程中的效果：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46affc9f2c9e49e2b30ab02e5ba5cad7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1520&h=910&s=145816&e=png&b=1f1f1f)

useDrag 可以传一个 collect 的回调函数，它的参数是 monitor，可以拿到拖拽过程中的状态。

collect 的返回值会作为 useDrag 的返回的第一个值。

我们判断下，如果是在 dragging 就设置一个 dragging 的 className。

```javascript
function Box(props: BoxProps) {
  const ref = useRef(null);

  const [{dragging}, drag]= useDrag({
    type: 'box',
    item: {
      color: props.color
    },
    collect(monitor) {
      return {
        dragging: monitor.isDragging()
      }
    }
  });

  drag(ref);

  return <div ref={ref} className={ dragging ? 'box dragging' : 'box'} style={
    { background: props.color || 'blue'}
  }></div>
}
```
然后添加 dragging 的样式：

```css
.dragging {
  border: 5px dashed #000;
  box-sizing: border-box;
}
```

测试下：
 
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7178fdd175e54c2d8a9299de646cf076~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1506&h=1282&s=343311&e=gif&f=43&b=fefefe)

确实，这样就给拖拽中的元素加上了对应的样式。

但如果我们想把这个预览的样式也给改了呢？

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/974dd0fff0bd4f8b83650e643e95be82~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=540&h=546&s=26876&e=png&b=fefefe)

这时候就要新建个组件了：

```javascript
const DragLayer = () => {
  const { isDragging, item, currentOffset} = useDragLayer((monitor) => ({
      item: monitor.getItem(),
      isDragging: monitor.isDragging(),
      currentOffset: monitor.getSourceClientOffset(),
    }));

    if (!isDragging) {
      return null;
    }
    return (
      <div className='drag-layer' style={{
        left: currentOffset?.x,
        top: currentOffset?.y
      }}>{item.color} 拖拖拖</div>
    );
}
```

useDragLayer 的参数是函数，能拿到 monitor，从中取出很多东西，比如 item、isDragging，还是有 clientOffset，也就是拖拽过程中的坐标。

其中 drag-layer 的样式如下：

```css
.drag-layer {
  position: fixed;
}
```
引入下这个组件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aaaf5124a76a42329d84b5da516e433a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=632&h=424&s=56774&e=png&b=1f1f1f)

现在的效果是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bba8326668154b74b383c7e7131a3259~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1492&h=1192&s=371621&e=gif&f=46&b=fefefe)

确实加上了自定义的预览样式，但是原来的还保留着。

这个也可以去掉：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd86c006693c49b6b1cbadbd97b6423c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1006&h=950&s=145785&e=png&b=1f1f1f)

useDrag 的第三个参数就是处理预览元素的，我们用 getEmptyImage 替换它，就看不到了。

```javascript
dragPreview(getEmptyImage())
```
这时候就只有我们自定义的预览样式了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2029e572643b474eb03ad3aa2ea400a0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=1172&s=144031&e=gif&f=42&b=fefefe)

但其实这种逻辑只要执行一次就行，我们优化一下：

```javascript
useEffect(() => {
    drag(ref);
    dragPreview(getEmptyImage(), { captureDraggingState: true });
}, [])
```

drop 的逻辑也同样：

```javascript
useEffect(()=> {
    drop(ref);
}, []);
```

这样，我们就学会了 react-dnd 的基本使用。

总结下：

- 使用 useDrag 处理拖拽的元素，使用 useDrop 处理 drop 的元素，使用 useDragLayer 处理自定义预览元素
- 在根组件使用 DndProvider 设置 context 来传递数据
- useDrag 可以传入 type、item、collect 等。type 标识类型，同类型才可以 drop。item 是传递的数据。collect 接收 monitor，可以取拖拽的状态比如  isDragging 返回。
- useDrag 返回三个值，第一个值是 collect 函数返回值，第二个是处理 drag 的元素的函数，第三个值是处理预览元素的函数
- useDrop 可以传入 accept、drop 等。accept 是可以 drop 的类型。drop 回调函数可以拿到 item，也就是 drag 元素的数据
- useDragLayer 的回调函数会传入 monitor，可以拿到拖拽的实时坐标，用来设置自定义预览效果

全部代码如下：

```javascript
import { useDrag, useDragLayer, useDrop } from 'react-dnd';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend'

interface ItemType {
  color: string;
}
interface BoxProps {
  color: string
}
function Box(props: BoxProps) {
  const ref = useRef(null);

  const [{dragging}, drag, dragPreview]= useDrag({
    type: 'box',
    item: {
      color: props.color
    },
    collect(monitor) {
      return {
        dragging: monitor.isDragging()
      }
    }
  });

  useEffect(() => {
    drag(ref);
    dragPreview(getEmptyImage());
  }, [])

  return <div ref={ref} className={ dragging ? 'box dragging' : 'box'} style={
    { background: props.color || 'blue'}
  }></div>
}

function Container() {
  const [boxes, setBoxes] = useState<ItemType[]>([]);

  const ref = useRef(null);

  const [,drop] = useDrop(() => {
    return {
      accept: 'box',
      drop(item: ItemType) {
        setBoxes((boxes) => [...boxes, item])
      }
    }
  });

  useEffect(()=> {
    drop(ref);
  }, []);

  return <div ref={ref} className="container">
    {
      boxes.map(item => {
        return <Box color={item.color}></Box>
      })
    }
  </div>
}


const DragLayer = () => {
  const { isDragging, item, currentOffset} = useDragLayer((monitor) => ({
      item: monitor.getItem(),
      isDragging: monitor.isDragging(),
      currentOffset: monitor.getSourceClientOffset(),
    }));

    if (!isDragging) {
      return null;
    }
    return (
      <div className='drag-layer' style={{
        left: currentOffset?.x,
        top: currentOffset?.y
      }}>{item.color}拖拖拖</div>
    );
}

function App() {
  return <div>
    <Container></Container>
    <Box color="blue"></Box>
    <Box color="red"></Box>
    <Box color="green"></Box>
    <DragLayer></DragLayer>
  </div>
}

export default App;
```
css：

```css
.box {
  width: 50px;
  height: 50px;
  background: blue;
  margin: 10px;
}

.dragging {
  border: 5px dashed #000;
  box-sizing: border-box;
}
.drag-layer {
  position: fixed;
}

.container {
  width: 300px;
  height: 300px;
  border: 1px solid #000;
}
```
入了门之后，我们再来做个进阶案例：拖拽排序

我们写个 App2.tsx

```javascript
import { useState } from "react";
import './App2.css';

interface CardItem {
    id: number;
    content: string;
}

interface CardProps {
    data: CardItem
}
function Card(props: CardProps) {
    const { data } = props;
    return <div className="card">{data.content}</div>
}
function App() {
    const [cardList, setCardList] = useState<CardItem[]>([
        {
            id:0,
            content: '000',
        },
        {
            id:1,
            content: '111',
        },
        {
            id:2,
            content: '222',
        },
        {
            id:3,
            content: '333',
        },
        {
            id:4,
            content: '444',
        }
    ]);

    return <div className="card-list">
        {
            cardList.map((item: CardItem) => (
                <Card data={item} key={'card_' + item.id} />
            ))
        }
    </div>
}

export default App;
```
还有 App2.css：

```css
.card {
  width: 200px;
  line-height: 60px;
  padding: 0 20px;
  border: 1px solid #000;
  margin: 10px;
  cursor: move;
}
```
就是根据 cardList 的数据渲染一个列表。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50c59509e968444dab885ebd880c4732~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1528&h=498&s=132535&e=png&b=1f1f1f)

把它渲染出来是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73446c2a9aa14bd9976438a38245143e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=822&h=946&s=38166&e=png&b=ffffff)

拖拽排序，显然 drag 和 drop 的都是 Card。

我们给它加上 useDrag 和 useDrop：

```javascript
function Card(props: CardProps) {
    const { data } = props;

    const ref = useRef(null);

    const [, drag] = useDrag({
        type: 'card',
        item: props.data
    });
    const [, drop] = useDrop({
        accept: 'card',
        drop(item) {
            console.log(item);
        }
    });

    useEffect(() => {
        drag(ref);
        drop(ref);
    }, []);

    return <div ref={ref} className="card">{data.content}</div>
}

```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbe16875a8c547cea6dd7cb7dfe6453a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1378&h=1364&s=283587&e=gif&f=39&b=fdfdfd)

接下来做的很显然就是交换位置了。

我们实现一个交换位置的方法，传入 Card 组件，并且把当前的 index 也传入：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82a527f14c5849cea18f6cba3c1f5021~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1728&h=912&s=171865&e=png&b=1f1f1f)
```javascript
const swapIndex = useCallback((index1: number, index2: number) => {
    const tmp = cardList[index1];
    cardList[index1] = cardList[index2];
    cardList[index2] = tmp;
    setCardList([...cardList]);
}, [])
```
这里 setState 时需要创建一个新的数组，才能触发渲染。

然后在 Card 组件里调用下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c57f8781bd884f1ca45e3599b5c8e83f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=876&h=1310&s=162960&e=png&b=1f1f1f)

增加 index 和 swapIndex 两个参数，声明 drag 传递的 item 数据的类型

在 drop 的时候互换 item.index 和当前 drop 的 index 的 Card

```javascript
interface CardProps {
    data: CardItem;
    index: number;
    swapIndex: Function;
}

interface DragData {
    id: number;
    index: number;
}

function Card(props: CardProps) {
    const { data, swapIndex, index } = props;

    const ref = useRef(null);

    const [, drag] = useDrag({
        type: 'card',
        item: {
            id: data.id,
            index: index
        }
    });
    const [, drop] = useDrop({
        accept: 'card',
        drop(item: DragData) {
            swapIndex(index, item.index)
        }
    });

    useEffect(() => {
        drag(ref);
        drop(ref);
    }, []);

    return <div ref={ref} className="card">{data.content}</div>
}
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/253f022acf244b4889b0d1277e9227b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=834&h=946&s=212237&e=gif&f=33&b=fdfdfd)

这样就实现了拖拽排序。

不过因为背景是透明的，看着不是很明显。

我们设置个背景色：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1622644466743c792981ffd6a37855b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=656&h=488&s=67564&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19367f9bfb4043a7b79b687e386046ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=856&h=950&s=587115&e=gif&f=45&b=fdfdfd)

清晰多了。

但是现在是 drop 的时候才改变位置，如果希望在 hover 的时候就改变位置呢？

useDrop 有 hover 时的回调函数，我们把 drop 改成 hover就好了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9547b313d0894a11bce646d073be124e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=984&h=1152&s=146778&e=png&b=1f1f1f)

但现在你会发现它一直在换：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68bf0af647e844c4ba91b8b55a7b3ead~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=910&h=924&s=212161&e=gif&f=29&b=fdfdfd)

那是因为交换位置后，没有修改 item.index 为新的位置，导致交换逻辑一致触发：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eeef4d02d06c40cda15df821b627ea49~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=762&h=278&s=44196&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8b2ca6cf48141d3942c9f7d3b372e11~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=748&h=942&s=457102&e=gif&f=33&b=91d4ed)

在 hover 时就改变顺序，体验好多了。

然后我们再处理下拖拽时的样式。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85da4e1ec7384ef78d894c41c972f8f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1664&h=1184&s=177774&e=png&b=1f1f1f)

样式如下：

```css
.dragging {
  border-style: dashed;
  background: #fff; 
}
```

效果是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/976ad015d5ca43089a3c2fab40c1d4d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=784&h=920&s=741118&e=gif&f=44&b=93d2ed)

这样，拖拽排序就完成了。

我们对 react-dnd 的掌握又加深了一分。

这个案例的全部代码如下：
```javascript
import { useCallback, useEffect, useRef, useState } from "react";
import './App2.css';
import { useDrag, useDrop } from "react-dnd";

interface CardItem {
    id: number;
    content: string;
}

interface CardProps {
    data: CardItem;
    index: number;
    swapIndex: Function;
}

interface DragData {
    id: number;
    index: number;
}

function Card(props: CardProps) {
    const { data, swapIndex, index } = props;

    const ref = useRef(null);

    const [{ dragging }, drag] = useDrag({
        type: 'card',
        item: {
            id: data.id,
            index: index
        },
        collect(monitor) {
            return {
                dragging: monitor.isDragging()
            }
        }
    });
    const [, drop] = useDrop({
        accept: 'card',
        hover(item: DragData) {
            swapIndex(index, item.index);
            item.index = index;
        }
        // drop(item: DragData) {
        //     swapIndex(index, item.index)
        // }
    });

    useEffect(() => {
        drag(ref);
        drop(ref);
    }, []);

    return <div ref={ref} className={ dragging ? 'card dragging' : 'card'}>{data.content}</div>
}

function App() {
    const [cardList, setCardList] = useState<CardItem[]>([
        {
            id:0,
            content: '000',
        },
        {
            id:1,
            content: '111',
        },
        {
            id:2,
            content: '222',
        },
        {
            id:3,
            content: '333',
        },
        {
            id:4,
            content: '444',
        }
    ]);

    const swapIndex = useCallback((index1: number, index2: number) => {
        const tmp = cardList[index1];
        cardList[index1] = cardList[index2];
        cardList[index2] = tmp;

        setCardList([...cardList]);
    }, [])

    return <div className="card-list">
        {
            cardList.map((item: CardItem, index) => (
                <Card data={item} key={'card_' + item.id} index={index} swapIndex={swapIndex}/>
            ))
        }
    </div>
}

export default App;
```
css：

```css
.card {
  width: 200px;
  line-height: 60px;
  padding: 0 20px;
  border: 1px solid #000;
  background: skyblue;
  margin: 10px;
  cursor: move;
}

.dragging {
  border-style: dashed;
  background: #fff; 
}
```

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/react-dnt-test)

## 总结

我们学了 react-dnd 并用它实现了拖拽排序。

react-dnd 主要就是 useDrag、useDrop、useDragLayout 这 3 个 API。

useDrag 是给元素添加拖拽，指定 item、type、collect 等参数。

useDrop 是给元素添加 drop，指定 accepet、drop、hover、collect 等参数。

useDragLayout 是自定义预览，可以通过 monitor 拿到拖拽的实时位置。

此外，最外层还要加上 DndProvider，用来组件之间传递数据。

其实各种拖拽功能的实现思路比较固定：什么元素可以拖拽，什么元素可以 drop，drop 或者 hover 的时候修改数据触发重新渲染就好了。

比如拖拽排序就是 hover 的时候互换两个 index 的对应的数据，然后 setState 触发渲染。

用 react-dnd，我们能实现各种基于拖拽的功能。
