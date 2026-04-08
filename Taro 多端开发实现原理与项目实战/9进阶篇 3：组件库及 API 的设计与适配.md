# Taro 组件库及 API 的设计与适配

> 前面我们提到，框架核心已经实现了源代码到目标代码的转换，这一步骤繁琐且复杂，但距离实现多端目标，仍有一步之遥，那就是组件和 API —— 如果把框架核心比作材料加工机，那么组件和 API 就是模具，机器处理原材料，模具把材料塑造成型，不管用的是哪种模具，最终得到的形状都一样，多端组件和 API 存在的意义就是：无论你用哪套组件，最终产出的效果都是一致的。
> 
> 目前 Taro 已支持三端——小程序、H5、React Native。本节将会讲述组件库和 API 设计适配中的哲学。

## 多端差异

在开始讲述实现之前，先了解一下各端之间的差异，这也是我们实际操作中绕不过的坎。

### 组件差异

小程序、H5 以及快应用都可以划分为 XML 类，React Native 归为 JSX 类，两种语言风牛马不相及，给适配设置了非常大的障碍。XML 类有个明显的特点是关注点分离（Separation of Concerns），即语义层（XML）、视觉层（CSS）、交互层（JavaScript）三者分离的松耦合形式，JSX 类则要把三者混为一体，用脚本来包揽三者的工作。

不同端的组件的差异还体现在定制程度上：

- H5 标签（组件）提供最基础的功能——布局、表单、媒体、图形等等；
- 小程序组件相对 H5 有了一定程度的定制，我们可以把小程序组件看作一套类似于 H5 的 UI 组件库；
- React Native 端组件也同样如此，而且基本是专“组”专用的，比如要触发点击事件就得用 `Touchable` 或者 `Text` 组件，要渲染文本就得用 `Text` 组件（虽然小程序也提供了 `Text` 组件，但它的文本仍然可以直接放到 `view` 之类的组件里）。

对于 React Native 的样式，我们可以姑且把它当作 CSS 的子集，但相比于 CSS，又有非常大的差别，首先是单位不一致，你必须根据屏幕的尺寸来精细地控制元素的尺寸和相关数值，然后是以对象的形式存在，不作用于全局，没有**选择器**的概念，你完全可以把它看做是一种 `Inline Style`，对于写惯了 XML 类的朋友，可能不太适应这种“另类”的写法，于是林林总总的[第三方库](https://github.com/MicheleBertoli/css-in-js)就冒出来了，这类库统称为 `CSS in JS`，至于他们存在的意义就见仁见智了。

### API 差异

各端 API 的差异具有定制化、接口不一、能力限制的特点：

1. 定制化：各端所提供的 API 都是经过量身打造的，比如小程序的开放接口类 API，完全是针对小程序所处的微信环境打造的，其提供的功能以及外在表现都已由框架提供实现，用户上手可用，毋须关心内部实现。
2. 接口不一：相同的功能，在不同端下的调用方式以及调用参数等也不一样，比如 `socket`，小程序中用 `wx.connectSocket` 来连接，H5 则用 `new WebSocket()` 来连接，这样的例子我们可以找到很多个。
3. 能力限制：各端之间的差异可以进行定制适配，然而并不是所有的 API（此处特指小程序 API，因为多端适配是向小程序看齐的）在各个端都能通过定制适配来实现，因为不同端所能提供的端能力“大异小同”，这是在适配过程中不可抗拒、不可抹平的差异。

## 设计思路

由多端差异我们了解到进行多端适配的困难，那应该如何去设计组件和 API 呢？

由于组件和 API 定制程度的不同，相同功能的组件和 API 提供的能力不完全相同，在设计的时候，对于端差异较小的不影响主要功能的，我们直接使用相应端对应的组件 API 来实现，并申明特性的支持程度，对于端差异较大的且影响了主要功能的，则通过封装的形式来完成，并申明特性的支持程度，**绝大部分的组件 API 都是通过这种形式来实现的**。

这里特别提到样式的设计，前面提到 React Native 的 `Inline Style`，不支持全局样式，不支持标签样式，不支持部分的 CSS 属性，flex 布局等等，这些可能会在交付开发者使用过程中人为产生的问题，我们会在规范中提到：如果你要兼容 React Native，不要使用全局样式，不要用标签样式，不能写这个样式等等。

## 多端适配

### 样式处理

H5 端使用官方提供的 [WEUI](https://github.com/Tencent/weui) 进行适配，React Native 端则在组件内添加样式，并通过脚本来控制一些状态类的样式，框架核心在编译的时候把源代码的 `class` 所指向的样式通过 [css-to-react-native](https://github.com/styled-components/css-to-react-native) 进行转译，所得 StyleSheet 样式传入组件的 `style` 参数，组件内部会对样式进行二次处理，得到最终的样式。

![样式处理流程](https://user-gold-cdn.xitu.io/2018/10/8/1665155932b630fe?w=958&h=718&f=png&s=47989)

> 为什么需要对样式进行二次处理？
>
> 部分组件是直接把传入 style 的样式赋给最外层的 React Native 原生组件，但部分经过层层封装的组件则不然，我们要把容器样式、内部样式和文本样式离析。为了方便解释，我们把这类组件简化为以下的形式：
> 
> ``` jsx
> <View style={wrapperStyle}>
>   <View style={containerStyle}>
>     <Text style={textStyle}>Hello World</Text>
>   </View>
> </View>
> ```
>
> 假设组件有样式 `margin-top`、`background-color` 和 `font-size`，转译传入组件后，就要把分别把它们传到 `wrapperStyle`、`containerStyle` 和 `textStyle`，可参考 `ScrollView` 的 `style` 和 `contentContainerStyle`。

### 组件封装

组件的封装则是一个“仿制”的过程，利用端提供的原材料，加工成通用的组件，暴露相对统一的调用方式。我们用 `<Button />` 这个组件来举例，在小程序端它也许是长这样子的：

``` xml
<button size="mini" plain={{plain}} loading={{loading}} hover-class="you-hover-me"></button>
```

如果要实现 H5 端这么一个按钮，大概会像下面这样，在组件内部把小程序的按钮特性实现一遍，然后暴露跟小程序一致的调用方式，就完成了 H5 端一个组件的设计。

``` xml
<button
  {...omit(this.props, ['hoverClass', 'onTouchStart', 'onTouchEnd'])}
  className={cls}
  style={style}
  onClick={onClick}
  disabled={disabled}
  onTouchStart={_onTouchStart}
  onTouchEnd={_onTouchEnd}
>
  {loading && <i class='weui-loading' />}
  {children}
</button>
```

其他端的组件适配相对 H5 端来说会更曲折复杂一些，因为 H5 跟小程序的语言较为相似，而其他端需要整合特定端的各种组件，以及利用端组件的特性来实现，比如在 React Native 中实现这个按钮，则需要用到 `<Touchable* />`、`<View />`、`<Text />`，要实现动画则需要用上 `<Animated.View />`，还有就是相对于 H5 和小程序比较容易实现的 `touch` 事件，在 React Native 中则需要用上 `PanResponder` 来进行“仿真”，总之就是，因“端”制宜，一切为了最后只需一行代码通行多端！

除了属性支持外，事件回调的参数也需要进行统一，为此，需要在内部进行处理，比如 `Input` 的 `onInput` 事件，需要给它造一个类似小程序相同事件的回调参数，比如 `{ target: { value: text }, detail: { value: text } }`，这样，开发者们就可以像下面这样处理回调事件，无需关心中间发生了什么。

``` JavaScript
function onInputHandler ({ target, detail }) {
  console.log(target.value, detail.value)
}
```

当然，因“端”制宜也并不能支持所有的特性，换句话说实现完全支持会特别困难，比如 `<Input />` 的 `type` 属性，下面是 React Native 实现中的类型对应，可以看到 `idcard` 类型转为了 `default` 类型，因为 React Native 本身不支持：

``` JavaScript
const keyboardTypeMap = {
  text: 'default',
  number: 'numeric',
  idcard: 'default',
  digit: Platform.select({
    ios: 'decimal-pad',
    android: 'numeric'
  })
}
```

还有就是组件规范方面，由于 React Native 是 flex 型布局的，这点跟 H5 和小程序还是有蛮大区别的，所以就得在开发规范中约束用户要注意这些，比如用户要兼容 React Native 就要采用 flex 布局的写法。

### 质量把关

> 代码质量重于泰山，凹凸实验室始终把代码质量看作重中之重，通过两个强力手腕来保证，一是代码规范，二是测试。

#### 代码规范

在日常业务中也需遵循代码规范，日常 Code Review 也会把代码规范作为检查的一方面，统一的规范对于代码交接，业务检查等方面有重要作用，在 Taro 组件库和 API 的相应库代码都严格遵循这个规范，既保证团队开发者协作的顺畅，又利于优秀的开源合作者们贡献代码。总之，代码规范既体现个人的代码素养，也侧面体现团队的综合能力。

#### 测试

作为 Taro 中的重要一环，组件和 API 功能的稳定性尤为重要，于是引入了**单元测试**，细心的读者可以翻阅框架代码、组件和 API 的库都带有 `JEST` 测试。当然，不管在任何框架，写测试是一个优秀开发者必做的工作。

## 小结

Taro 的语法遵循小程序的语法，所以小程序端使用固有的官方组件以及 API 即可，不用单独设计，而 H5、React Native、多应用等端则需要设计一套组件和 API 进行适配，抹平各端之间的差异，力图让开发者达到无感适配。