# 使用sass编写公用样式

> 软件和教堂非常相似——建成之后我们就在祈祷。—— Sam Redwine

本章主要讲解 scss 的基本使用，rpx 单位的概念，了解 uni.scss 在项目中的使用。

实际的开发更多的是结合什么样的工具，利用什么样的技术栈来实现快捷开发。前端三大工具js，html，css。特别是 css 上手容易，键值对对应即可实现，但是并不能实现复杂的逻辑判断，可以说是呆板鸡肋的。如果你想轻松自如健步如飞的写样式，那么 scss 绝对适合你，特别是 Uniapp 集成了插件后，不用复杂的配置 webpack 参数即可，让你在复杂的参数配置与羞涩难懂的命令行中解脱出来。

我们在新建 uni-app 项目的模板目录可以发现有一个 uni.scss 文件（相当于公用样式）。是的，你没看错。这里你可以轻松使用 scss ，尝试使用 scss ，会让你工作效率更高。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/13/16e63e7d6199e7b2~tplv-t2oaga2asx-image.image)

在前面介绍安装 HbuilderX 编译器的章节中，我们就已经介绍了安装必要使用的插件（ scss/sass 编译），直接点击安装即可，点击【工具】>> 【插件安装】即可查看，如果安装了 scss/sass 编译，就可以在代码中体验着酸爽的感觉了。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/13/16e63e818cfebe87~tplv-t2oaga2asx-image.image)

Scss 是一种 css 预处理器和一种语言, 它可以用来定义一套新的语法规则和函数，以加强和提升 css，可以解放代码量。

Uniapp 首推使用 scss ，因此这边主要以 scss 来讲解，使用时需要 Vue 文件中 style 节点上加上 `lang="scss"` 指定编译语言:

```html
<style lang="scss">
    /* or lang="less" */
    /* 测试代码 */
    .list{
        color: #fff;
        .item{
            background: #fff;
        }
    }
</style>
```

上面的代码经过 scss 编译成 css 后，嵌套的层级会处理成扁平的样式表:

```css
.list{
    color: #fff;
}
.item{
    background: #fff;
}
```

你还可以跟 js 一样使用变量，比如定义一个颜色 `$white: #fff` （变量以 $ 符号开头），所有引用这个变量的样式值都会编译成 `#fff`：

```html
<style lang="scss">
    $white: #fff;

    .list{
        color: $white;
        .item{
            background: $white;
        }
    }
    /**/
</style>
```

编译后：

```css
.list{
    color: #fff;
}
.item{
    background: #fff;
}
```

就上面的方法就已经可以让你解放双手了，你是否见过下面这样一大篓的，甚至更长的层级的样式表：

```css
.goods-list .item .img .txt{
    /* 样式 */ 
}
.goods-list .item .name{
    /* 样式 */ 
}
.goods-list .item .name .sub{
    /* 样式 */ 
}
.goods-list .item .price{
    /* 样式 */ 
}
.goods-list .item .num{
    /* 样式 */ 
}
```

我们很多后端的小伙伴就是因为不想写那么臃长的样式表而选择了后端开发，如果你用 scss 可以让你按‘模块’来写样式：

```scss
.goods-list {
    .item {
        .img .txt{
            /* 样式 */ 
        }
        .name{
            /* 样式 */ 
            .sub{
                /* 样式 */ 
            }
        }
        .price{
            /* 样式 */ 
        }
        .num{
            /* 样式 */ 
        }
    }
}
```

> 想了解更多 scss 特性请查看 [官网](https://www.sass.hk/)。

恩，我要说的可不止这些。我是想让你更加地贴近项目去开发，在项目目录里面的 uni.scss 文件是个变量文件，让你了解 scss 才能使你更加了解 uni.scss 的使用，让你在项目中更加驰骋。

> Uniapp 官方文档上说了，Uniapp 官方扩展插件及 [插件市场](https://ext.dcloud.net.cn/) 上很多三方插件均使用了这些样式变量，如果你是插件开发者，建议你使用 scss 预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的 App。

Uniapp 默认提供这样一套 UI 主题，同时允许在一定程度上定制新的主题，以满足业务的多样化视觉需求。

开发阶段，每个 Uniapp 项目在目录都会有一个 uni.scss 的文件，可以通过修改 scss 文件的变量来定制自己的插件主题，实现自定义主题功能。

Uniapp 定义了相关变量（相当于框架开发规范），方便开发者引用，修改指定变量值即可，以下是 uni.scss 的部分相关变量：

```scss
/* 颜色变量 */
$theme-color: #21d398;
/* 行为相关颜色 */
$uni-color-primary: #007aff;
$uni-color-success: #4cd964;
$uni-color-warning: #f0ad4e;
$uni-color-error: #dd524d;
```

你可以在你使用的 vue 页面文件中轻松使用这些变量，定制主题就是编辑这个变量列表，然后在页面中使用这些变量：

```html
<style lang="scss">
    /* 例如，设置页面背景 #007aff */
    page{
        background: $uni-color-primary;  
    }

    .btn{
        color:#fff;
        background: $theme-color;
    }
</style>
```

在主题化下引用这些样式变量，所有的风格都会保持一致，比如这个音乐应用的主题颜色是浅绿色的，一些按钮，图标都是以这个颜色样式呈现。

运用行为相关颜色，文字基本颜色，背景颜色，边框颜色，文字尺寸，组件禁用态的透明度等等 scss 变量，会让你的项目呈现高度统一，保持一致性.

## 使用 rpx 开发

在样式单位处理方面，Uniapp 默认为 rpx。这是小程序官方推荐的单位，也是 Uniapp 可跨端的通用单位。

大多数人刚开始看到一个新的单位，心里肯定会在嘀咕，又多了一个样式单位，这是还嫌rem，%，em，vh不够麻烦的是吧？

先不要着急，慢慢看我区分这些单位，让你有个充分认识。

平常前端在开发过程中，px 是最常用的样式单位，但是随着移动设备的兴起，rem，%，em，vw 更多单位走入了我们的视野。这些单位的出现无非多是为了解决页面适配的问题，rpx 也不例外。页面适配指的是同样的布局，在不同大小的屏幕上怎么进行缩放、控制间距、宽高、字号等大小都会以同样的样式渲染。

页面适配的方式有很多：

* 使用 %，按百分比自适应布局；
* 使用 rem，结合 html 元素的 font-size 来根据屏幕宽度适配；
* 使用 vw、vh，直接根据视口宽高适配。

可是这些只是在h5网页的某些范围里可以实现，但在其他端并不完全支持，那 Uniapp 设计 rpx 这个单位就是为了解决这个问题的。

rpx 即响应式 px，跟 rem 实现是类似的，一种根据屏幕宽度自适应的动态单位。规定以 `750rpx` 为屏幕基准宽（移动端更多以 iphone 6 的尺寸设计），750rpx 恰好为屏幕宽度。屏幕变宽，rpx 实际显示效果会等比放大。Uniapp 集成了其他 iOS、Android、H5、以及各种小程序（微信/支付宝/百度/头条/QQ/钉钉）等多个平台的特性，为实现多端开发而定义的一种样式单位。

开发者可以通过设计稿基准宽度计算页面元素 rpx 值，设计稿 1px 与框架样式 1rpx 转换公式如下：

**设计稿 1px / 设计稿基准宽度 = 框架样式 1rpx / 750rpx**

换言之，页面元素宽度在 Uniapp 中的宽度计算公式：

**750 * 元素在设计稿中的宽度 / 设计稿基准宽度**

用一句话简单来说就是，你在750px的设计稿中量到多少数目，就是多少数目的 rpx 量，不用管单位，知道它是伸缩适配的就行。

> 列举官方栗子：  
> 若设计稿宽度为 750px，元素 A 在设计稿上的宽度为 100px，那么元素 A 在 uni-app 里面的宽度应该设为：750 * 100 / 750，结果为：100rpx。
> 若设计稿宽度为 640px，元素 A 在设计稿上的宽度为 100px，那么元素 A 在 uni-app 里面的宽度应该设为：750 * 100 / 640，结果为：117rpx。
> 若设计稿宽度为 375px，元素 B 在设计稿上的宽度为 200px，那么元素 B 在 uni-app 里面的宽度应该设为：750 * 200 / 375，结果为：400rpx。

你是不是看到这样的换算方程式有点懵？莫急，Uniapp 提供了自动换算的功能：

在 HBuilderX【偏好设置】->【编辑器设置】中进行配置

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/13/16e63e88b7557d88~tplv-t2oaga2asx-image.image)

之后代码里就有提示了

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/13/16e63e8df26cd43e~tplv-t2oaga2asx-image.image)

你可能在别处听说过 upx，这个官方已经弃用了，目前版本统一用 rpx，了解完之后就愉快的使用 rpx 吧 :)

## 小结

1. 合理利用工具能让你的开发效率稳步提升，使用 scss 是一个很好提高效率和管理样式的方式；
2. uni.scss 可以实现自定义主题功能，实现全局样式变量的应用；
3. rpx 是 Uniapp 开发可跨端的通用单位，配置工具提示，根据设计稿大小，可以实现简单的基准换算，让开发变得更简单了一些。