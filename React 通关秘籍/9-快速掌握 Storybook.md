我们每天都在写各种组件，一般的组件不需要文档，但当你写组件库里的组件，或者项目里的一些公共组件的时候，是需要提供文档的。

这时候我们一般都会用 Storybook。

Storybook 是非常流行的用来构建组件文档的工具。

现在有 80k 的 star 了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06ab9985e51b47d1aeb9036cea11107e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1052&h=298&s=66199&e=png&b=ffffff)

那 Storybook 都提供了啥功能呢？

我们试一下就知道了：

```
npx create-react-app --template typescript sb-test
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f62a4d090a24e119c22bf5202dfdccf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1016&h=236&s=71617&e=png&b=010101)

用 cra 创建个 react 项目。

然后进入项目，执行 storybook 的初始化：

```
npx storybook@latest init
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6098a95319644d28e159f6c19f8143f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1072&h=638&s=91236&e=png&b=181818)

打印的日志告诉你 storybook init 是在你的项目里添加 storybook 的最简单方式。

它会在你的 package.json 添加一个 storybook 命令：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af2a91325b7e4275b5323f8379b078b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=606&h=266&s=53027&e=png&b=1f1f1f)

执行 npm run storybook，就可以看到这样文档：

```
npm run storybook
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1edef20173b44deab8ab28933dfd53d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1856&h=1326&s=192240&e=png&b=ffffff)

这就是 storybook 生成的组件文档。

这三个组件不是我们自己写的，是 storybook 初始化的时候自带了三个 demo 组件。

我们可以用它来了解下 storybook 的功能。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4ccea6e07754816aee59871946aa9fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=448&h=856&s=77191&e=png&b=191919)

storybook init 在项目里加了 2 个目录： .storybook 和 src/stories

.storybook 下的是配置文件， src/stories 下的是展示文档用的组件。

Button.tsx 就是传入几个参数，渲染出一个 button：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/076d9d08fa6b4f25be5ddd38e8591d2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1380&h=1314&s=224407&e=png&b=1f1f1f)

然后 Button.stories.tsx 里导出了几种 Button 的 props：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b1d8d2483d64d9ebece55b10a5cb532~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1130&h=970&s=177490&e=png&b=1d1d1d)

导出的这几个 Story 类型的对象是啥呢？

是用来渲染不同 story 的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bed9ff1280945c5b9e9dd9fc799b087~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1882&h=1236&s=252972&e=gif&f=21&b=fefefe)

也就是 Button 组件传入不同参数的时候渲染的结果。

我们加一个 Story 试试：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c65585123874843abf11a5b8dd9299a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=810&h=1178&s=141994&e=png&b=1f1f1f)

```javascript
export const Guang: Story = {
  args: {
    label: '光光光',
    size: 'large',
    backgroundColor: 'green'
  }
}
```

页面多了一个 Button 的类型：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c3ddfac936b40a2828c3956aff59d8d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1636&h=1004&s=111753&e=png&b=ffffff)

也就是说，Storybook 把同一个组件传入不同 props 的情况，叫做一个 Story。

别的地方可能叫做用例或变体，而在 Storybook 里叫做 story。

一个组件包含多个 Story，一个文档里又包含多个组件，和一本书的目录差不多。

所以把这个工具叫做 Storybook。

除了 story 外，上面还有生成的组件文档：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca7d1282bc6b417a858a4ee2ad89a5a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2168&h=1420&s=229825&e=png&b=ffffff)

可以看到，列出了每个 props 和描述。

是从注释里拿到的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7160a50961a4812a54643041c6e07da~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=780&h=1106&s=136655&e=png&b=1f1f1f)

我们改了一下注释，刷新下，可以看到文档变了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/991028784622424888b56b28aee2ed39~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2086&h=1256&s=189776&e=png&b=ffffff)

这样就可以方便的生成组件文档了。

而且，这些参数都是可以调的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08a54390c10449aebcbad112725fd663~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1846&h=1266&s=352767&e=gif&f=37&b=fefefe)

可以直接修改 props 看组件渲染结果，就很方便。

而且你还可以直接复制它的 jsx 代码：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a1cd354eeaf4b7b8bc9cc8c256b6174~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2156&h=1098&s=129390&e=png&b=ffffff)

之前我们是 args 传入参数渲染，你还可以用 render 函数的方式自己渲染：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0755d2c1f24e4c6ba420eb7b03e96efd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=622&h=538&s=72605&e=png&b=1f1f1f)

```javascript
export const Guang: Story = {
  args: {
    label: '光光光',
    size: 'large',
    backgroundColor: 'green'
  },
  render(args) {
    return <div>
      <button>aaaa</button>
      <Button {...args}/>
      <button>bbb</button>
    </div>
  }
}
```

render 函数的参数就是 args，你可以自己返回 jsx（这时要把文件后缀名改为 tsx）。

这样，渲染内容就是自己控制的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb6babdd973f484588ba6c6b1ce9b14b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1970&h=820&s=105759&e=png&b=ffffff)

而且有的组件不只是传入 props 就可以了，还需要一些点击、输入等事件。

storybook 支持写这类脚本：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43a45caf62da4293a28c4f7bb5eddd84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1044&h=956&s=158398&e=png&b=1f1f1f)
```javascript
export const Guang: Story = {
  args: {
    label: '光光光',
    size: 'large',
    backgroundColor: 'green'
  },
  render(args) {
    return <div>
      <button>aaaa</button>
      <Button {...args}/>
      <button>bbb</button>
    </div>
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = await canvas.getByRole('button', {
      name: /光光光/i,
    });
    await userEvent.click(btn);

    btn.textContext = '东';
  },
}
```

比如我写了找到内容为光光光的 button，点击，然后把它的内容改为东。

组件渲染完就会自动执行 play 函数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/baa2cb424b4f4f4f93df1c89f601050f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2118&h=1124&s=371545&e=gif&f=25&b=fefefe)

当然，这个案例不大好，用表单来测试 play 功能会更好点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83554b55732749849d741ca0252b20c2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1282&h=918&s=358839&e=gif&f=22&b=fdfdfd)

此外，你还可以在渲染组件之前请求数据，然后把数据传入 render 函数再渲染：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3df784c1627645b6af384024b90ee7a8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=734&h=948&s=114335&e=png&b=1f1f1f)

```javascript

export const Guang: Story = {
  args: {
    label: '光光光',
    size: 'large',
    backgroundColor: 'green'
  },
  render(args, meta) {
    const list = meta.loaded.list;

    return <div>
      <div>{list.join(',')}</div>
      <Button {...args}/>
    </div>
  },
  loaders: [
    async () => {
      await '假装 fetch'
      return {
        list: [
          111,
          222,
          333
        ]
      }
    },
  ]
}
```

渲染出来是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d086821cc0d846369e206b138364de3c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1810&h=858&s=122949&e=png&b=ffffff)

感受到 Storybook 的强大了么？

不只是自动生成组件文档这么简单，你可以定义不同的 Story，这些 Story 可以传入不同 props、可以请求数据、可以自定义渲染内容、还可以定义自动执行的脚本。

有同学会觉得，这个自动执行的 play 函数其实和测试脚本差不多。

确实，play 函数是可以当作测试脚本来用的。

安装用到的包：

```
npm install @storybook/jest
```

使用 expect 来断言：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98d01f9c93ca4943aa8a5a44a30bfc5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=774&h=216&s=57082&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e57fb5a9e4454dae934d5488e46d3130~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1016&h=508&s=106145&e=png&b=1f1f1f)

```javascript
await expect(btn.textContent).toEqual('光光光');

await expect(btn.style.backgroundColor).toEqual('green');
```

这样一打开组件会自动跑 play 函数，也就会自动执行断言：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8766d0ee20e34a6e8f8c12a4e4e91bb4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1970&h=1106&s=180445&e=png&b=ffffff)

改下 expect，断言失败就是这样：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f4fa32957ee4356a929b4f0b3033fbc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1042&h=522&s=108195&e=png&b=202020)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc59a59b141a4e8ea60d3d384b4b3e26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1506&h=1062&s=127088&e=png&b=fef5f3)

这样，组件有没有通过测试用例，打开一看就知道了。

就很方便。

但是，组件多了的话，这样一个个点开看也挺麻烦的，这时候就可以用 cli 跑了：

安装用到的包：
```
npm install @storybook/testing-library
```
然后：

```
npx test-storybook
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d4163340d794f279b59cbf10e5996d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=870&h=304&s=62930&e=png&b=1a1a1a)

xx.stories.tsx 文件里除了 Story 外，还会导出 meta 信息：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45b0f117f4f94438a4bcd58318cdb7aa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=1046&s=171277&e=png&b=1f1f1f)

这些都很简单，改一下就知道了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5818c8d6b11c4b4caa18f5a59eddda4a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=686&h=444&s=58337&e=png&b=1f1f1f)

title 是这个：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69c97cc176d24dbcbae2ca6f0e5de871~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=532&h=744&s=49224&e=png&b=f5f7fb)

paremeters 的 layout 是这个：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/596720cb55cd4a0cbd226f002e0ae832~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=680&h=548&s=78545&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb11973736e746f48e275206148b6f3a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1640&h=1082&s=64795&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e703ab71fc348a59556bf9145b66715~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030&h=864&s=38111&e=png&b=ffffff)

这里还可以配置背景色：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18ce9e82cb9a44a194ba9289204d8ea8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=690&h=664&s=81349&e=png&b=202020)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/625692a01e194763b185c080a6672d52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2304&h=1218&s=328243&e=gif&f=26&b=fefefe)

然后 argTypes 是这个：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/964bf7cec5f540f88039e39565a5142f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=700&h=504&s=64874&e=png&b=1f1f1f)


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18a42a4fe06d439bba53088130740d52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1444&h=1078&s=93692&e=png&b=ffffff)


![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/883e41493cfe4e20aac001167230aaea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=738&h=520&s=72467&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/836a379b3f8149988bc9b85b5b029f1a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1176&h=744&s=71535&e=png&b=ffffff)

具体什么类型的参数用什么控件，可以用到的时候查一下[文档](https://storybook.js.org/docs/essentials/controls#annotation)。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a08f253de944627b1449f44245bcd24~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1152&h=1138&s=152486&e=png&b=ffffff)

这些都是与 Story 无关的一些东西，所以放在 Meta 里。

此外，你还可以用 Storybook 写 MDX 文档。

mdx 是 markdown + jsx 的混合语法，用来写文档很不错。

在这个目录下的文档：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d44f1722884f4f969ce5e31d0eb61d5e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1422&h=1190&s=326436&e=png&b=1d1d1d)

都会被放到这里：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/108bc5bdccb24f1ba6c8b7e85fc3052f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1370&h=1026&s=175807&e=png&b=ffffff)

我们加一个试试：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37e4abb3557c45bda09c064da9057658~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1612&h=924&s=257301&e=png&b=1d1d1d)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/834f32d42ba04e0db1905fc60b072a5a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1680&h=950&s=120565&e=png&b=ffffff)

这样，当你想在组件文档里加一些别的说明文档，就可以这样加。

而且，组件文档的格式也是可以自定义的。

可以在 .storybook 下的 preview.tsx 里配置这个：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c90fa993e16b4c4db139f39592155049~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1696&h=1194&s=298029&e=png&b=1d1d1d)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a28273d320749289793d8f29afd500f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1604&h=1236&s=146283&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05c92411d87446eb902068fa642b99b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1304&h=990&s=227974&e=png&b=1d1d1d)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a07da9717084f19b783ee85405bc960~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2140&h=1338&s=207244&e=png&b=ffffff)

大概过了一遍 Storybook 的功能之后，我们把上节的 Calendar 组件拿过来试一下。

把那个项目的 Calendar 目录复制过来：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cc32b2fde854a2080da1a4d37332258~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=456&h=658&s=57000&e=png&b=1a1a1a)

然后在 stories 目录下添加一个 Calendar.stories.tsx

```javascript
import type { Meta, StoryObj } from '@storybook/react';
import Calendar from '../Calendar/index';
import dayjs from 'dayjs';

const meta = {
    title: '日历组件',
    component: Calendar,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs']
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Value: Story = {
    args: {
        value: dayjs('2023-11-08')
    },
};

export const DateRender: Story = {
    args: {
        value: dayjs('2023-11-08'),
        dateRender(currentDate) {
            return <div>
                日期{currentDate.date()}
            </div>
        }
    },
};

export const DateInnerContent: Story = {
    args: {
        value: dayjs('2023-11-08'),
        dateInnerContent(currentDate) {
            return <div>
                日期{currentDate.date()}
            </div>
        }
    },
};

export const Locale: Story = {
    args: {
        value: dayjs('2023-11-08'),
        locale: 'en-US'
    },
};

```
我们添加了 4 个 story。

安装用到的 dayjs、classnames 和 node-sass

```
npm install --save classnames

npm install --save dayjs

npm install --save-dev node-sass
```
然后把 storybook 文档服务跑起来：

```
npm run storybook
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7a48537021a4eae8876da2e9dab240b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2170&h=1402&s=185281&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86c9436a6b4246bc9d754bc83c194def~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2086&h=1322&s=187492&e=png&b=fefefe)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/559a457f5fdc48a3b7882d5696900afb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2172&h=1366&s=248974&e=png&b=fefefe)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b63bca47248f4891a284957eae175210~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2192&h=1318&s=195589&e=png&b=ffffff)

都没啥问题。

不过 value 的控件类型不对：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e03b3963b26948459be0e1d050a125cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1738&h=1026&s=140687&e=png&b=fefefe)

但是现在我们要传入的是 dayjs 对象，就算是用了 date 的控件也不行。

先改成 date 类型试试：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/251ca2c18abf41828cd0f893025237cf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=658&h=522&s=72893&e=png&b=1f1f1f)

控件确实对了，但是修改日期点击刷新后，会报错：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55f93770f1ee4063b2188574f596e780~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1776&h=1180&s=436621&e=gif&f=34&b=fdfdfd)

因为控件传入的是一个 date 的毫秒值。

那怎么办呢？

这时候就要把 story 改成 render 的方式了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f4dafd6798840a7a69f0775d4b26fda~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1286&h=982&s=176073&e=png&b=1f1f1f)

```javascript

const renderCalendar = (args: CalendarProps) => {
    if(typeof args.value === 'number') {
        return <Calendar {...args} value={dayjs(new Date(args.value))}/>
    }

    return <Calendar {...args}/>
}

export const Value: Story = {
    args: {
        value: dayjs('2023-11-08')
    },
    render: renderCalendar
};

```

再试试：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8bed02108ac47c18b881c42ec6995ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1776&h=1180&s=379705&e=gif&f=38&b=fdfdfd)

现在就可以了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/sb-test)。

## 总结

写组件文档，我们一般都是用 Storybook。

它把不同 props 的渲染结果叫做一个 story，一个组件有多个 story。

story 可以通过 args 指定传入组件的参数，通过 loaders 请求数据，通过 render 函数自定义渲染内容、通过 play 指定自动执行的脚本等。

而且还可以渲染完组件直接跑测试用例，就很方便。

storybook 还会自动生成组件文档，而且也可以把项目里的 mdx 文件加到文档里。

用起来也很简单，首先 npx storybook init 初始化，之后执行 npm run storybook 就可以了。

总之，用 storybook 可以轻松的创建组件文档，可以写多个 story，直观的看到组件不同场景下的渲染结果，还可以用来做测试。

如果想给你的组件加上文档，storybook 基本是最好的选择。
