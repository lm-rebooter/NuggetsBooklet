CSS in JS，顾名思义就是用 js 来写 css。

它也是一种很流行的 css 管理方案。

比如 styled-components 的样式是这样写：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81a5eac452014b91bfaab17de26e39d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1020&h=1274&s=200831&e=png&b=1f1f1f)

可以传参数。

然后用的时候当作组件一样用：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40c3878c9f1144d384a66176ce8a3318~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=972&h=726&s=165620&e=png&b=202020)

样式用 js 写，可以当成组件用，可以传参，这是 CSS in JS 的方案独有的体验。

接下来我们也体验一下：

```
npx create-vite styled-components-test
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cd9da175a804d84a95bbd5ffd8c80f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=354&s=74733&e=png&b=ffffff)

用 vite 创建个项目。

安装 styled-components：

```
npm install

npm install --save styled-components
```
去掉 index.css 和 StrictMode：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5711302b486a47f8ae579120f8dd7add~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1016&h=444&s=84214&e=png&b=1f1f1f)

然后改下 App.tsx：

```javascript
import { styled } from 'styled-components';

const Title = styled.h1`
  font-size: 30px;
  text-align: center;
  color: blue;
`;

const Header = styled.div`
  padding: 20px;
  background: pink;
`;

function App() {

  return <Header>
    <Title>
      Hello World!
    </Title>
  </Header>
}

export default App
```
跑起来看下：

```
npm run dev
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/490d3d0eb1f34b88b4ef383efc2d1627~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=912&h=268&s=39491&e=png&b=191919)

样式生效了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62a9047deab54eb597f8aea5706279a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2096&h=558&s=59278&e=png&b=f6c8d7)

打开 devtools 看下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e23d49207714c1b9d4077b10e0734a5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2246&h=958&s=201554&e=png&b=f4e3fa)

可以看到 styled.div、styled.h1 会创建对应的标签，然后样式会生成一个唯一的 className。

所以说，用 styled-components 不用担心样式冲突的问题。

继续看，styled-components 的 styled.xx 可以作为组件用，那自然是可以传参的：

```javascript
import { styled } from 'styled-components';

const Title = styled.h1<{ color?: string; }>`
  font-size: 30px;
  text-align: center;
  color: ${props => props.color || 'blue'}
`;

const Header = styled.div`
  padding: 20px;
  background: pink;
`;

function App() {

  return <Header>
    <Title>
      Hello World!
    </Title>
    <Title color='green'>
      Hello World!
    </Title>
    <Title color='black'>
      Hello World!
    </Title>
  </Header>
}

export default App
```
我们给 Title 样式组件添加一个 color 参数，然后分别传入 green、black。

看下效果：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d82ed5a7cc1f405097f9a3f3ddb00b3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2160&h=694&s=81452&e=png&b=f6c7d3)

确实样式组件用起来和其他 React 组件体验一样，加的 ts 类型也会有提示：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48b2ff7609f849c1ab71afdf900d1c55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1202&h=1002&s=157422&e=png&b=1f1f1f)

这也是为啥这个库叫 styled-components，样式组件。

有的时候，样式需要基于已有的做扩展，比如我有一个 Button 的样式，另一种 Button 和它大部分一样，但有所不同。

这时候就可以这样写：

```javascript
import { styled } from 'styled-components';

const Button = styled.button<{ color?: string; }>`
  font-size: 20px;
  margin: 5px 10px;
  border: 2px solid #000;
  color: ${props => props.color || 'blue'}
`;

const Button2 = styled(Button)`
  border-radius: 8px;
`;
function App() {

  return <div>
    <Button color='red'>Hello World!</Button>
    <Button2 color='red'>Hello World!</Button2>
  </div>
}

export default App
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/664da6c6d05e4fe2bc1b14d4ac0b447c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=696&h=260&s=25172&e=png&b=fcfcfc)

如果你还想改样式组件的标签，可以用 as：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4c19c87399a41408fd8a10dd46d3fa4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1054&h=828&s=137991&e=png&b=1f1f1f)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0631cd0584b34767bcc7ef517b53a080~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1324&h=742&s=115685&e=png&b=f3f3fa)

styled() 除了可以给样式组件扩展样式外，还可以给普通组件加上样式：

```javascript
import { FC, PropsWithChildren } from 'react';
import { styled } from 'styled-components';

interface LinkProps extends PropsWithChildren {
  href: string;
  className?: string;
}

const Link: FC<LinkProps> = (props) => {
  const {
    href,
    className,
    children
  } = props;

  return <a href={href} className={className}>{children}</a>
}

const StyledLink = styled(Link)`
  color: green;
  font-size: 40px;
`;

function App() {
  return <div>
    <StyledLink href='#aaa'>click me</StyledLink>
  </div>
}

export default App
```
比如我们给 Link 组件加上样式。

这里要注意，Link 组件必须接收 className 参数，因为 styled-components 会把样式放到这个 className 上：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4367a31164944049ac4f815e370db97~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1448&h=772&s=137469&e=png&b=f8f8fd)

我们知道，样式组件也是可以接受参数的，为了区分两者，我们一般都是样式组件的 props 用 $ 开头：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8656d426c054958949a8a365a13889c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=1148&s=192452&e=png&b=1f1f1f)

```javascript
const StyledLink = styled(Link)<{ $color?: string;}>`
  color: ${props => props.$color || 'green'};
  font-size: 40px;
`;

function App() {
  return <div>
    <StyledLink href='#aaa' $color="purple">click me</StyledLink>
  </div>
}
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1b0272676de408dbdcaf73cc5c630fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1362&h=774&s=141044&e=png&b=f8f8fd)

默认情况下，样式组件会透传所有不是它的 props 给被包装组件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e17ef9261b2b46b5a360d4e5af5eabcf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=450&s=65617&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00210064f3ea4ca5ad054ade2d02d70f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1096&h=608&s=65615&e=png&b=ffffff)

样式组件包了一层，自然是可以修改 props 的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2797bd8d43a44f9398399bfa74a7139c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1172&h=1196&s=208894&e=png&b=1f1f1f)

用 attrs 方法，接收传入的 props 返回修改后的 props。

```javascript
import { FC, PropsWithChildren } from 'react';
import { styled } from 'styled-components';

interface LinkProps extends PropsWithChildren {
  href: string;
  className?: string;
}

const Link: FC<LinkProps> = (props) => {
  console.log(props);

  const {
    href,
    className,
    children
  } = props;

  return <a href={href} className={className}>{children}</a>
}

const StyledLink = styled(Link).attrs<{ $color?: string;}>((props) => {
  console.log(props);

  props.$color = 'orange';
  props.children = props.children + ' 光';
  return props;
})`
  color: ${props => props.$color || 'green'};
  font-size: 40px;
`;

function App() {
  return <div>
    <StyledLink href='#aaa' $color="purple">click me</StyledLink>
  </div>
}

export default App
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf45b36a08664e298378fcb48ca57e2b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1344&h=660&s=93040&e=png&b=ffffff)

attrs 支持对象和函数，简单的场景直接传对象也可以：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c69353604e184b33a43e9c72fd66191c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1218&h=1100&s=199982&e=png&b=1f1f1f)

```javascript
const Input = styled.input.attrs({ type: 'checkbox'})`
  width: 30px;
  height: 30px;
`;
```

那伪类选择器、伪元素选择器这些呢？

当然也是支持的。

```javascript
import { styled } from 'styled-components';

const ColoredText = styled.div`
  color: blue;

  &:hover {
    color: red;
  }

  &::before {
    content: '* ';
  }
`

function App() {

  return <>
    <ColoredText>Hello styled components</ColoredText>
  </>
}

export default App;

```
写法和之前一样。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd98fb61e67340c687ff55da46c5e8e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=814&h=382&s=31042&e=gif&f=17&b=fefefe)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/479f2aa612f34791b418d797aab45c63~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1276&h=788&s=128739&e=png&b=f8f8fd)

但 styled components 这个 & 和 scss 里的 & 含义还不大一样。

它指的是同一个样式组件的实例，这里也就是 ColoredText 的实例。

所以可以这样写：

```javascript
import { styled } from 'styled-components';

const ColoredText = styled.div`
  color: blue;

  &:hover {
    color: red;
  }

  &::before {
    content: '* ';
  }

  &.aaa + & {
    background: lightblue;
  }

  &.bbb ~ & {
    background: pink;
  }
`

function App() {

  return <>
    <ColoredText>Hello styled components</ColoredText>
    <ColoredText className="aaa">Hello styled components</ColoredText>
    <ColoredText>Hello styled components</ColoredText>
    <ColoredText className="bbb">Hello styled components</ColoredText>
    <div>Hello styled components</div>
    <ColoredText>Hello styled components</ColoredText>
    <ColoredText>Hello styled components</ColoredText>
  </>
}

export default App;
```

这里 &.aaa + & 就是 .aaa 的 ColoredText 样式组件之后的一个 ColoredText 样式组件实例。

&.bbb ~ & 就是 .bbb 的 ColoredText 样式组件之后的所有 ColoredText 样式组件实例。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a50685505abf4aa89b77eb11470deb43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=746&h=436&s=64857&e=png&b=ffffff)

此外，如果你把 & 全换成 &&，你会发现效果也一样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07a777cd628e4f43a2cdd8ba117fcd8a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1246&h=1268&s=216412&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3584fdf7667549f98650f63812850a21~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=850&h=502&s=68431&e=png&b=ffffff)

那什么时候用 &、什么时候用 && 呢？

当你和全局样式冲突的时候。

styled-components 用 createGlobalStyle 创建全局样式：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eacd0cbea59b43619a5b649d6d02ab59~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1294&h=1474&s=254074&e=png&b=1f1f1f)

我们全局指定 ColoredText 的 color 为 green，然后组件里指定 color 为 blue。

看下效果：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/639d7f34253f4867a63ea95a6115f07d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1322&h=1044&s=256005&e=png&b=f4f0fc)

每个 ColorText 组件都会有一个 src-aYaIB 的 className，全局样式就是给这个 className 加了 color 为 green 的样式。

可以看到，组件里写的 color: blue 被覆盖了。

这时候你这样写是没用的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e82f5fb54a4443d3ad62dd005139260a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=794&h=480&s=60610&e=png&b=1f1f1f)

用 && 才能覆盖：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f43774805a54ae9bd465f01b9ea87d6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=854&h=602&s=69357&e=png&b=1f1f1f)

它通过 .aaa.aaa 这样的方式实现了样式优先级的提升：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e834290694424a96b3777125ddac3459~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1384&h=972&s=253883&e=png&b=f3effc)

那动画怎么写呢？

有单独的 api：

```javascript
import { styled, keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
  font-size: 50px;
  padding: 30px;
`;

function App() {

  return <Rotate>X</Rotate>
}

export default App;
```
通过 keyframes 来编写动画，然后在 animation 里引用。

看下效果：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d64fc2e129847c8996182b964f78ab0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=836&h=494&s=40245&e=gif&f=18&b=fefefe)

它为 @keyframes 生成了一个唯一 ID：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30e88ce6a7dc4b6f8fc73cb42e1fe9a3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1658&h=1250&s=215012&e=png&b=f7f7fc)

这大概就是加一个 keyframes 的 api 的意义。

此外，如果你想复用部分 css，要这样写：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81d2dae7cd2b461a922a14ca144ac43c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=1108&s=153087&e=png&b=1f1f1f)

```javascript
const animation = css`
  animation: ${rotate} 2s linear infinite;
`

const Rotate = styled.div`
  display: inline-block;
  ${animation}
  font-size: 50px;
  padding: 30px;
`;
```
不加 css 是不会生效的，你可以试一下。

抽出来的 css 也是可以用 props 的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/380772a25d5a481e9d4774f0a0a28d40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1236&h=1148&s=178162&e=png&b=1f1f1f)

```javascript
import { styled, keyframes, css } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const animation = css<{ $duration: number }>`
  animation: ${rotate} ${props => props.$duration}s linear infinite;
`

const Rotate = styled.div<{ $duration: number }>`
  display: inline-block;
  ${animation}
  font-size: 50px;
  padding: 30px;
`;

function App() {

  return <Rotate $duration={3}>X</Rotate>
}

export default App;
```
但是 css 声明了类型，用到了这部分样式的 styled.xxx 也需要声明类型。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bce8356728ce46cd95dd54c3d671ea60~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1662&h=826&s=158448&e=png&b=ffffff)

如果你希望样式组件用的时候可以传入一些样式，那可以用 RuleSet：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9610642e3ae483a81e24d70339847d9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1434&h=1354&s=230249&e=png&b=1f1f1f)

```javascript
import { styled, keyframes, css, RuleSet } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const animation = css<{ $duration: number }>`
  animation: ${rotate} ${props => props.$duration}s linear infinite;
`

const Rotate = styled.div<{ $duration: number, otherStyles: RuleSet }>`
  display: inline-block;
  ${animation}
  font-size: 50px;
  padding: 30px;
  ${props => props.otherStyles}
`;

function App() {

  return <Rotate $duration={3} otherStyles={ [ 
    { border: '1px', background: 'pink' }, 
    { boxShadow: '0 0 3px  blue'}
  ]}>X</Rotate>
}

export default App;
```
它是一个样式对象的数组类型：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9844907d08c4726b63cc245954b211e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1094&h=588&s=137680&e=png&b=202020)

可以用的时候传入一些样式：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84404fa2bb434b4588a255515d4ab2be~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=822&h=528&s=91778&e=gif&f=14&b=f7eafb)

最后，styled-components 还有 theme 的 api。

这个也很简单，你会用 react 的 context 就会用这个：

```javascript
import { styled, ThemeProvider } from 'styled-components';

const Aaa = styled.div`
  width: 100px;
  height: 100px;
  background: ${props => props.theme.dark ? 'black' : '#ccc'}
`
function Content() {
  return <Aaa></Aaa>
}

function App() {
  return <ThemeProvider theme={{ dark: true }}>
      <Content></Content>
  </ThemeProvider>
}

export default App;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3878123f965349de8b0e0f33c550d3dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=710&h=420&s=19709&e=png&b=ffffff)

每个样式组件都有 props.theme 可以读取当前 theme 对象，然后这个对象可以通过 useTheme 读取，通过 ThemeProvider 修改。

```javascript
import { useState } from 'react';
import { styled, ThemeProvider, useTheme } from 'styled-components';

const Aaa = styled.div`
  width: 100px;
  height: 100px;
  background: ${props => props.theme.dark ? 'black' : '#ccc'}
`
function Content() {
  const theme = useTheme();
  const [dark, setDark] = useState<boolean>(theme.dark);

  return <>
    <button onClick={() => setDark(!dark)}>切换</button>
    <ThemeProvider theme={{ dark }}>
      <Aaa></Aaa>
    </ThemeProvider>
  </>
}

function App() {
  return <ThemeProvider theme={{ dark: true }}>
      <Content></Content>
  </ThemeProvider>
}

export default App;
```

我们用 useTheme 读取了当前 theme，然后点击按钮的时候 setState 触发重新渲染，通过 ThemeProvider 修改了 theme 的值。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/623bdd0b1e5d4a8bb2f445fc452e9763~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=790&h=528&s=31939&e=gif&f=19&b=fefefe)

这就是 styled-components 的 theme 功能。

上面的过一遍，styled-components 就算掌握的差不多了

那最后我们来思考下，用 styled-components 有啥优缺点呢？

先来看下好处：

用了 styled-components 之后，你的 className 都是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d1886d871df494191b27d5b25582a59~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=592&h=456&s=117069&e=png&b=f8f8fd)

没有样式冲突问题，不需要类似 CSS Modules 这种方案。

而且你可以用 js 来写样式逻辑，而且封装方式也是 React 组件的方式，这个是挺爽的。

不然你要学 scss 的函数的语法，比如这样：

```scss
@function multiple-box-shadow($n) {
    $value: '#{random(2000)}px #{random(2000)}px #FFF';
    @for $i from 2 through $n {
      $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF';
    }
    @return unquote($value);
}

#stars { 
    width: 1px;
    height: 1px;
    box-shadow: multiple-box-shadow(700);
}
```
scss 的 for 循环、if else 还有函数等的语法都要单独学习。

相比之下，还是 styled-components 直接用 js 来写样式组件的逻辑更爽。

这就像很多人不喜欢 vue 的 template 写法，更喜欢 React 的 jsx 一样，可以直接用 js 来写逻辑。

当然，styled-components 也有不好的地方，比如：

你的 React 项目里会多出特别多样式组件：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9371eef088444ea28504c99b5c965a1f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=958&h=1294&s=198271&e=png&b=1f1f1f)

随便找一个组件，一眼望去全是样式组件。

你的 React DevTools 里也是一堆 styled-components 的组件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a47be5db5d5a49859053c18a132a9ee0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1562&h=1442&s=166674&e=png&b=ebf3fe)

当然，这些也不是啥大问题，styled-components 整体还是很好用的。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/styled-components-test)

## 总结

CSS in JS 就是用 js 来写 css。

今天我们学习了最流行的 CSS in JS 库 styled-components。

它的特点就是样式组件，用 styled.div、styled() 可以创建样式组件。

样式组件可以传参数，可以通过 attrs() 修改参数。

通过 keyframes 来声明动画样式，通过 css 来复用某段样式，通过 createGlobalStyle 创建全局样式。

写样式的时候，通过 & 代表当前样式组件的实例，当样式和全局样式冲突的时候，还可以 && 提高优先级。

styled-components 还支持 theme，可以通过 ThemeProvider 修改 theme 值，通过 useTheme 来读取，每个样式组件里都可以通过 props.theme 拿到当前 theme，然后展示不同样式。

styled-components 相比 scss 等方案有好有坏：

- 没有 className 冲突问题，不需要 CSS Modules
- 用 js 来写逻辑，不需要学习单独的 scss 语法
- 项目里会多很多的样式组件，和普通组件混在一起
- React DevTools 里会有很多层的样式组件

总体来说，styled-components 还是很有不错，如果你喜欢通过 React 组件的方式来写样式这种方式，可以考虑使用。

我最近在维护的一个项目，用 styled-components 好多年了，大项目用也没问题。
