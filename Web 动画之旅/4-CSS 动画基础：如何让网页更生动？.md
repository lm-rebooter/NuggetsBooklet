欢迎来到 Web 开发的世界，这里唯一不变的是变化。近年来，我们看到的最大变化之一是越来越多地使用 CSS 动画。它可以让你轻松地为 Web 元素添加动画效果，而无需过多的 JavaScript 编码。通过使用 CSS 动画，你可以创造出令用户留连忘返的互动体验，提高用户满意度，增强品牌形象，以及更好地传达信息。

  


这节课将引导你深入了解 CSS 动画以及如何使用它们创建引人入胜的 Web 动画。这节课涵盖了 CSS 动画的基础知识，从简单的动画属性到高级动画技巧，再到实际应用。你将学习如何创建各种动画效果，包括悬停效果、按钮点击效果、导航菜单动画以及响应用户交互的动画。

  


通过这节课的学习，你将能够掌握 CSS 动画的基础知识，为你的 Web 应用或网站增添生气和吸引力。无论你是刚刚入门 Web 开发者，还是希望提高动画开发技能，这节课都将为你提供宝贵的知识和实际操作经验，帮助你让 Web 更加生动。准备好开始学习 CSS 动画基础，让你的网页脱颖而出吧！

  


## CSS 动画是什么？

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df5bf299b57d4ee5bfc12e234d543222~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1200&h=720&s=8639467&e=gif&f=151&b=5cc066)

  


你是否曾经访问过一个网站，注意到一些元素在滚动或与它们互动时如何优雅地移动、淡出或改变颜色？这些看似神奇的效果是由 CSS 动画实现的。从简单的状态过渡到复杂的交互式动画，CSS 提供了一个强大而灵活的工具集，可以使网站栩栩如生。

  


从本质上说，CSS 动画允许你使用关键帧、时间函数和其他属性将视觉效果应用于 Web 元素。简单地说，CSS 动画是一种使用 CSS 特性来创建网页元素动态效果的技术。它通过改变元素的样式属性（比如位置、大小、颜色和透明度等）来实现动画效果，而无需使用 JavaScript 或其他编程语言。CSS 动画通常使用关键帧（Keyframes）、过渡（Transitions）、[视图过渡](https://juejin.cn/book/7223230325122400288/section/7259669097242329145)（View Transitions）、[锚点定位](https://juejin.cn/book/7223230325122400288/section/7259669151743279159)（Anchor Positions）、[路径](https://juejin.cn/book/7223230325122400288/section/7259668703032606781)（Motion Path）、[自定义属性](https://juejin.cn/book/7223230325122400288/section/7258870477462962236)和[变换](https://juejin.cn/book/7223230325122400288/section/7259668493158023205)（Transform）等 [CSS 特性](https://s.juejin.cn/ds/idHTGSBG/)来定义动画的行为和样式。使用 CSS ，你可以创建微妙的效果，为你的网站增色添彩，或创建更复杂的动画，讲述一个故事或展示你的品牌。

  


## CSS 动画效果

  


CSS 动画可以实现多种不同的动画效果，包括文本动画、颜色动画、滑入动画、旋转动画、波浪动画、光晕动画、弹跳动画、淡入淡出动画、悬停动画和无限加载动画等。这些动画可以用于使网页更具吸引力、提供视觉反馈、引导用户的注意力、增加互动性等目的。

  


### CSS 文本动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cdc69e1e3fc42b2b267be09aa0270ef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1002&h=466&s=333036&e=gif&f=103&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/mdaNaLK

  


CSS 文本动画是一种将动画效果应用于文本元素（比如字母、单词、句子和段落等）的技术。使用动画文字可以立即吸引用户的注意。以下是一些常见的 CSS 文本动画效果：

  


-   **文本闪烁**：通过在文本元素上应用 CSS 关键帧动画，可以创建文本闪烁的效果。这使文本以交替的方式显示和隐藏，以引起注意。
-   **文本滚动**：文本滚动动画将文本从一侧滚动到另一侧，通常用于创建新闻滚动、广告滚动或通知滚动效果。
-   **文本放大或缩小**：通过过渡动画或关键帧动画，可以使文本逐渐放大或缩小，以吸引注意力或突出显示。
-   **文本颜色变化**：通过过渡动画或关键帧动画，可以改变文本的颜色，以强调特定文本或为文本添加动态效果。
-   **文本颤动**：文本颤动动画使文本元素在页面上轻微抖动，以吸引用户的目光。
-   **文本旋转**：通过关键帧动画，可以使文本元素绕自身旋转，为文本添加独特的动态效果。

  


最受欢迎的 CSS 文本动画技术包括添加彩虹效果、阴影、故障和粘糊效果。例如，下面这个 404 页面的效果就是文字动画中的故障动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9e3aef0821840919cf6724b56d40d4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=522&s=11723707&e=gif&f=29&b=333333)

  


> Demo 地址：https://codepen.io/airen/full/qBLegNo

  


### CSS 颜色动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ab65d615cb948ffb8a271d09bfdb53b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=600&s=4042472&e=webp&f=102&b=7cedb1)

  


CSS 颜色动画是通过 CSS 动画模块来实现的一种动画效果，它允许你以动画的方式改变元素的颜色。它可以应用于文本、按钮、边框和其他页面元素，使其非常适合引导用户的注意力到网站的特定区域。比如下面这个示例，动态画改变文本和背景的颜色：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/828ad5a72a1142f5ac482c0e9a7a2e84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1016&h=518&s=5146119&e=gif&f=60&b=121111)

  


> Demo 地址：https://codepen.io/airen/full/ZEVgPWR

  


这种技巧对于吸引用户的关注、提高用户体验以及引导他们关注网站上的特定内容非常有效。通过改变颜色，你可以突出显示重要的信息、呈现警告或强调特定元素，从而增强网站的视觉吸引力和交互性。 CSS 颜色动画为 Web 设计提供了有趣和引人注目的方式，以吸引和留住用户的注意力。

  


### CSS 的滑入式动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1c7e0640b24491993bc16190bb5fd6e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=440&h=903&s=2993213&e=gif&f=54&b=faf9f1)

  


  


CSS 的滑入式动画使元素在 Web 上以滑入的方式出现，你可以让元素从屏幕的特定位置（通常是顶部、底部、左侧或右侧）滑入，并且滑动到指定位置。这种动画效果可以吸引用户的注意，为 Web 增添加互动性和吸引力。

  


你还可以将滑入式动画与其他效果结合使用，以进一步自定义你的设计。在下面的示例中，滑入动画与颜色动画相结合，使卡片描述内容从卡片底部滑入，并且使卡片缩略图变得不可见：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c497236ce934921a1c1da0b5e925a8b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1430&h=450&s=10026667&e=gif&f=131&b=f6f3f3)

  


> Demo 地址：https://codepen.io/airen/full/wvRVOVm

  


滑入式动画通常用于 Web 设计和用户界面中，以引导用户关注特定内容或提供交互反馈。这种类型的动画可以增强用户体验，使网页更加引人注目和有趣。

  


有入就有出，它们是相互对应的。在 CSS 动画中与滑入式动画对应的另一种动画被称为滑出式动画。正如上面的卡片示例，当用户鼠标不再悬停在卡片上时，卡片的描述内容和按钮会向卡片底部滑出，并且不可见。这种动画效果被称为滑出式动画。

  


滑出式动画刚好与滑入式动画相反，它使元素以滑出的方式从屏幕上消失，通常是从当前位置滑动到特定位置（例如顶部、底部、左侧或右侧）。这种动画效果通常用于隐藏或删除元素，以改进用户体验或交互。

  


### CSS 旋转动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb7cc2cdbbb44d718aebb858042dff9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600&h=1200&s=4984884&e=gif&f=470&b=261422)

  


CSS 旋转动画用于在一段预定时间内改变元素的外观和行为。你可以使用 CSS 的 2D 或 3D 变换中的旋转特性分别在 2D 或 3D 空间中旋转元素。通常使用 CSS 的旋转动画来制作加载动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adf19068bb8144f2a24fcff0571c214a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=960&h=426&s=640383&e=gif&f=47&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/abPexrw

  


旋转动画的另一个应用是 CSS 波浪动画。为了构建 CSS 波浪动画，你需要创建多个 HTML 元素来表示波浪，然后将旋转动画应用于每个波浪，其中包括不同的背景颜色或透明度和动画时间。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93175915efcd4f9d8dd15310fc4c43e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=956&h=438&s=405882&e=gif&f=72&b=fefefe)

  


> Demo 地址：https://codepen.io/airen/full/jOXgoqb

  


### CSS 发光动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a68e7b81887040529e510299e7b45518~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=358&s=2730503&e=gif&f=110&b=0c0332)

  


> Demo 地址：https://codepen.io/airen/full/RwEXXey

  


你可以使用 [CSS 的阴影属性](https://juejin.cn/book/7199571709102391328/section/7199844993455325216)给文本或其他元素添加发光效果。这种效果使文本或元素周围产生类似光晕的光效，为它们添加了视觉吸引力。

  


CSS 发光动画常用于切换按钮上：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29bf6c1fba2e40eebcd48f4e7058b116~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=940&h=384&s=379052&e=gif&f=137&b=111111)

  


> Demo 地址：https://codepen.io/airen/full/QWYLLqN

  


在此基础上，发挥你的才智和创意，还能制作出更具创意的发光动画，比如下面这个由 [@Jhey 提供的“永无止境的火花”跟退鼠标的动画效果](https://codepen.io/jh3y/full/zgoBVj)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eca51704ca1a4fa893229701cc181537~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=896&h=430&s=2434100&e=gif&f=118&b=02030c)

  


> Demo 地址：https://codepen.io/airen/full/OJdLLaV

  


### CSS 弹跳动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8165a821c7a94d93a21ccc52f41b2b9b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=600&s=1298692&e=webp&f=145&b=e8e9ef)

  


弹跳动画是一种经典的动画效果，它是一种通过改变元素位置和形状来模拟弹跳效果的动画。它完美的运用了“**[挤压和拉伸](https://juejin.cn/book/7288940354408022074/section/7288940354580480056#heading-2)**”的动画原则，使动画效果更自然。这种动画使元素在垂直方向上来回弹跳，给用户一种元素在上下移动的感觉，而且和“地面”接触时，元素还会有一种挤压变形的效果。这种动画效果通常用于制作加载动效。

  


下面这个效果模拟了一个物体从高空落下的效果，它是典型的弹跳动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/880143c16b274c038741cdc9570df17a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=900&h=436&s=319348&e=gif&f=256&b=282828)

  


> Demo 地址：https://codepen.io/airen/full/BaMBaYZ

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1b74e3951454f36baa8cccacb9f2488~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=540&s=1468344&e=gif&f=55&b=7a001c)

  


> Demo 地址：https://codepen.io/airen/full/ExrYaPj （来源于[ @Joshua van Boxtel](https://codepen.io/JoshuaVB/full/xoRapP)）

  


### CSS 淡入淡出动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa68b3fd025a46f19c41c0415de25cf7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1211&h=737&s=1585535&e=gif&f=50&b=151515)

  


CSS 淡入淡出动画是一种通过将元素的不透明度（`opacity`）从 `0%` 过渡到 `100%` ，然后在结束时现次过渡到 `0%` ，即通过改变元素的不透明度来实现过渡显示和隐藏效果的动画。这种动画效果使元素逐渐出现或消失，而不是突然出现或消失，增加了过渡的平滑性和视觉吸引力。

  


CSS 淡入淡出动画效果在 Web 页面的图片幻灯片和画廊、模态框和弹出窗口、导航菜单、通知和警报消息、页面过渡、按钮效果等常见应用场景上使用，可以提高用户体验，使页面元素更具吸引力和交互性。例如下面这个示例，通过调整每个元素的延迟时间，实现一个简单的交错的淡入的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa5b6193691c48a2b615612669bcdd63~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=932&h=500&s=5512843&e=gif&f=212&b=05887b)

  


> Demo 地址：https://codepen.io/airen/full/ExrYWbP

  


你也可以在元素的悬停状态下使用淡入淡出的动画效果，比如下面这个由 [@Hyperplexed 提供的“来自路德维希视频的悬停效果”](https://codepen.io/Hyperplexed/full/poQmrEq)，这个动画效果除了有淡入淡出的动画效果之外，还带有缩放的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df0634f63e7d4561a073e4f7124ed43c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1366&h=586&s=13694915&e=gif&f=62&b=040000)

  


> Demo 地址：https://codepen.io/airen/full/VwgZpdM （来源于 [@Hyperplexed](https://codepen.io/Hyperplexed/full/poQmrEq)）

  


### CSS 悬停动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7711f94f97da4f2ca88e5ec1b3680cc5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=450&s=1362110&e=webp&f=59&b=fdfafd)

  


CSS 悬停动画是一种常见的 Web 设计技巧，它在用户将鼠标悬停在 Web 元素上时触发动画效果。这种技术用于增强用户交互，吸引用户的注意力，以及为页面元素添加一些互动性。它常用于按钮缩放、背景颜色变化、图像翻转、文本高亮、图标旋转、边框效果和导航菜单等场景。

  


Web 设计师和开发人员可以根据他们的需求和创意创建各种各样的悬停动画效果。这些动画效果可以通过 CSS 的 `:hover` 伪类来触发，它使得在用户与页面元素交互时添加动画效果变得非常容易。例如下面这个示例，当用户的鼠标悬停在头像上时，头像会有一种穿过其装饰圈的错觉效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5170f1f91d5e4c8382c94eb9e857b93c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1022&h=432&s=2833789&e=gif&f=82&b=dbdfc4)

  


> Demo 地址：https://codepen.io/airen/full/yLZBMdN （来源于[ @Temani Afif](https://codepen.io/t_afif/full/zYLeOLM)）

  


结合现代 CSS 的一些新特性，例如[自定义属性 @property](https://juejin.cn/book/7223230325122400288/section/7258870477462962236) 、[剪切（Clipping）、蒙板（Masking）](https://juejin.cn/book/7223230325122400288/section/7259668885224456252)和[锚点定位（Anchor Position）](https://juejin.cn/book/7223230325122400288/section/7259669151743279159)等可以制作出更有创意的悬停动画效果。例如下面这个悬停动画效果就是结合锚点定位实现的，当用户将鼠标悬停在演讲者头像上时，对应的演讲主题会有一个高亮的背景滑入；当用户鼠标悬停在演讲主题上时，对应的用户头像会有一个放大的效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e7e9a99a14a4b8b9b81b2bedb8e75c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1072&h=510&s=2011849&e=gif&f=154&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/gOqYmVQ

  


### CSS 无限加载动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c51a601e328a415d8bef225ee7e9be09~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=758&s=454823&e=gif&f=23&b=2b2539)

  


> URL：https://css-loaders.com/ （Demo 地址：https://codepen.io/collection/zaXqRn 或 https://cssloaders.github.io/）

  


CSS 无限加载动画指的是我们平时所说的 “Loading” 动画效果，它是 Web 设计中常见的动画效果，用于向用户传达正在加载内容或资源的信息，同时为用户提供一种有趣和互动的等待体验。这种动画效果通常在 Web 页面加载时间不确定或资源加载过程中使用，以告知用户正在进行加载操作，同时避免向用户显示具本的加载百分比或进度条。

  


无限加载动画的主要特点是，它通常循环播放，因此称之为“无限”加载。这意味着动画将一遍又一遍地播放，直到加载操作完成为止。这有助于减轻用户的焦虑感，因为他们不会感到不确定或不耐烦，等待过程也不会显得无聊。

  


下面是一些无限加载动画的示例和常见特征：

  


-   **旋转加载动画**： 一个常见的无限加载动画是一个旋转的图标，如一个旋转的圆圈或加载符号。这个图标不断旋转，向用户传达加载正在进行的信息。
-   **波浪加载动画**： 另一个流行的动画是一个波浪形图标，它像波浪一样上下移动。这种动画在页面底部或按钮旁边使用，以表示用户可以加载更多内容。
-   **点动画**： 一系列点（通常是三个或更多）可以形成一个周期性的动画，它们会依次出现和消失，以模拟加载操作。
-   **进度条动画**： 有时，无限加载动画可以采用进度条的形式，不断滚动，但不会显示具体的百分比或剩余时间。

  


无限加载动画的目标是提供用户友好的等待体验，减轻他们等待时的焦虑感，同时向他们传达网页或应用正在积极加载内容。这种动画是提高用户体验的有用工具，特别是在与网络资源相关的应用程序和网站中。

  


### CSS 视差滚动效果

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd6004f21bc5460b9a4317147b1e7880~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=449&s=2784794&e=gif&f=30&b=ffdfc6)

  


CSS 视差滚动效果（CSS Parallax Scrolling）是一种常用的视觉效果，通过让 Web 页面上的前景和背景元素以不同的速度滚动，创造出一个种深度感或“虚拟 3D 效果”，旨在增强用户在网站上的浏览体验。

  


这种效果通过使前景元素（通常是文本、图片或其他内容）和背景元素（通常是背景图片或其他背景内容）以不同的速度滚动，来营造出一种深度感。 这种效果可以使用户感觉在浏览网站时有一种层次感，同时增加了网站的吸引力和趣味性。

  


在 CSS 视差滚动效果中，前景元素通常以较快的速度滚动，而背景元素以较慢的速度滚动，这种速度差异可以根据设计的需要进行调整。这种差异使前景元素似乎在屏幕上移动得更快，而背景元素则以更慢的速度滚动，营造出一种立体感。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8efe0ea19f8f4619accd769c1a7ae86d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=926&h=688&s=11552747&e=gif&f=268&b=f2f1f1)

  


> Demo 地址：https://codepen.io/airen/full/VwgZbbG （来源于 [@Andrej Sharapov](https://codepen.io/andrejsharapov/full/OqvXyb)）

  


除了在页面滚动上添加视差效果之外，现在在一些 Web 组件上与会应用视差效果，例如下面这个卡片效果，应用了视差效果，给用户创造了一种深度感：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b64e66336a084d20a8e25cc753f087d8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=614&s=6835114&e=gif&f=187&b=ffffff)

  


> Demo 地址：https://codepen.io/airen/full/vYbBmpb （来源于 [@Dicki Prima Yudha](https://codepen.io/dpyudha) ）

  


### CSS 滚动驱动动效

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ca9a772a668400194699eeb60f00c4f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=960&h=480&s=10560&e=avif&b=c4e1e3)

  


前面我们所看到的 CSS 动画的播放都是使用文档时间轴（[DocumentTimeline](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FDocumentTimeline)），简单来说就是页面加载完成后就开始运行 `@keyframes` 内所定义动画，即**动画播放进度是跟着自然时间走的**。而 **[CSS 滚动驱动动效](https://juejin.cn/book/7223230325122400288/section/7259272255786450981)** **指的是将动画的执行（播放）过程由页面（或滚动容器）的滚动进行接管**。也就是说，CSS 滚动驱动的动画只会跟随滚动容器的滚动进度而变化，即滚动条滚动了多少，动画就播放多少，时间已不再起作用。

  


换句话说，CSS 滚动驱动动画又是如何改变动画的时间线呢？为此，CSS 滚动驱动动效规范（[Scroll-driven Animations](https://link.juejin.cn/?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fscroll-animations-1%2F)）定义了两种改变动画的时间线，用于控制 CSS 动画播放进度：

  


-   **滚动进度时间线** （**Scroll Progress Timeline**），简称 `scroll-timeline`，代表容器已滚动的距离，从 `0% ~ 100%`
-   **视图进度时间线** （**View Progress Timeline**），简称 `view-timeline`，代表一个在容器内的元素相对于滚动距离的相对位置，从 `0% ~ 100%`

  


[CSS 滚动驱动动效](https://juejin.cn/book/7223230325122400288/section/7259272255786450981)（Scroll-driven Animations）也是 Web 设计中常见的交互式动画技术，它使用滚动事件触发元素的动画效果。这种技术通过用户滚动页面时的交互，创建了与页面滚动位置相关联的动画。例如下面这个经典的封面动画效果，现在可以使用纯 CSS 就可以实现，不再需要依赖任何 JavaScript 脚本了：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13383ae90f7d49f98ff13ba302261084~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=452&s=11804180&e=gif&f=97&b=0f0f0f)

  


> Demo 地址：https://codepen.io/airen/full/WNPeONR

  


### CSS 路径动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a838b03d6744d2aab8163df81afe42f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=900&h=700&s=1628984&e=gif&f=38&b=eef4fa)

  


[CSS 路径动画](https://juejin.cn/book/7223230325122400288/section/7259668703032606781)是一种通过在图形或其他可视元素上定义路径，使元素沿着这些路径移动、变换或执行其他动作的动画技术。这些路径可以是直线、圆、椭圆、曲线或复杂的自定义路径，元素会按照这些路径的轨迹进行动画。

  


简单地说，**CSS 路径动画是一种用于创建元素动画的技术，它允许你指定一个路径，然后使 Web 页面上的元素沿着这个路径进行移动、旋转或者发生其他变换，从而产生动画效果**。这种技术为网页设计师提供了一种有趣的方式来创建动态和吸引人的效果。

  


CSS 路径动画通常需要结合 CSS 属性（如 `offset-path` 和 `offset-distance`）和关键帧动画来实现。这为元素的路径移动提供了更多控制选项。例如下面这个动画效果，它是一个典型的以滚动驱动的路径动画效果。用户在滚动内容的时候，小蜜蜂会沿着指定的路径向前飞行：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a597feb760894d2b840a6b590307f10e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=496&s=5784917&e=gif&f=172&b=e4b158)

  


> Demo 地址：https://codepen.io/airen/full/GRzKvYG

  


上面所列的仅是在 Web 页面上常见的一些 CSS 动画类型，其实还有许多其他有趣的 CSS 动画效果，比如翻转动画、环绕动画、蒙板动画、液体动画、熔岩灯动画、粒子动画、粘糊动画和页面转场动画等。

  


这些是一些令人兴奋和富有创意的 CSS 动画效果，可用于不同类型的网页和应用程序。根据你的设计需求和目标，你可以选择合适的动画效果来增强用户体验，提高网站的吸引力。无论你是一个网页设计师还是一个开发者，了解和掌握这些 CSS 动画效果都可以让你的项目更加生动和引人注目。

  


## 如何使用 CSS 创建动画？

  


前面花了较长的篇幅向大家展示了 Web 页面上常见的一些 CSS 动画效果。这些令人兴奋而又富有创意的 CSS 动画效果肯定撩起了你的好奇心？如何使用 CSS 创建动画？

  


我们以一个简单的动画效果为例，向大家阐述如何使用 CSS 来创建 Web 动画。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e80927a56914a9d8a6afeedc7064a1a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1000&h=476&s=3699797&e=gif&f=149&b=3a82d5)

  


> Demo 地址：https://codepen.io/airen/full/XWOrebp

  


任何一个 CSS 动画都会包含两个部分：**关键帧（** **`@keyframes`** **）** 和**动画属性（** **`animation`** **）** 。前者是用来定义动画的，后者是用来控制动画的。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0a6a71287c040bdae49074a3132c438~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=758&s=322824&e=jpg&b=8913f1)

  


### 使用 @keyframes 定义动画

  


CSS 动画是使用 `@keyframes` 规则来定义的。此规则指定动画的名称，并通过在动画序列中定义关键帧的样式来控制 CSS 动画序列中的中间步骤。关键帧主要是用于为时间戳和时间轴分配动画状态的机制。例如：

  


```CSS
@keyframes fadeIn{
    0% {
        opacity: 0;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}
```

  


在这个示例中，我们定义了个名为 `fadeIn` 的动画，它逐渐将一个元素的不透明度从 `0` 增加到 `1` 。`fadeIn` 动画定义了三个关键帧：`0%` （`from`）、`50%` 和 `100%` （`to`）：

  


-   在 `0%` 时，元素的透明度（`opacity`）是 `0` ，即元素完全透明，不可见
-   在 `50%` 时，元素的透明度（`opacity`）是 `0.5` ，即元素部分透明
-   在 `100%` 时，元素的透明度（`opacity`）是 `1` ，即元素完全不透明

  


注意，`@keyframes` 规则必须至少包含一个关键帧，以描述动画元素在动画序列中的特定时间应该如何呈现。关键帧选择器可以使用百分比来指定它们在动画周期中的发生时间。如果它们指定为 `0%` （动画周期的开始，即动画开始状态）或 `100%` （动画周期的结束，即动画结束状态）。

  


### 使用 animation 属性应用动画

  


`@keyframes` 规则定义的动画仅仅是声明了一个动画，只有被 CSS 的 `animation` 属性引用了，它才将生效。也就是说，如果要将已定义的 `fadeIn` 动画应用于 HTML 元素（要动画化的元素），我们需要使用 CSS 的 `animation` 属性。例如：

  


```CSS
.animated {
    animation-name: fadeIn;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-delay: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}
```

  


在此示例中，我们将 `fadeIn` 动画应用于一个名为 `.anmated` 的元素上。我们指定了动画持续的时间为 `2s` （`animation-duration: 2s`），使用缓动函数（`ease-in-out`）来控制动画的速度（`animation-timing-function: ease-in-out`），并且让动画延迟 `1s` 才开始播放（`animation-delay: 1s`）。

  


同时指定动画无限次循环播放（`animation-iteration-count: infinite`）以及指定了每个周期内动画的方向（`animation-direction: alternate`）。在这个示例中，`alternate` 表示动画在第一个周期中正向播放，然后在第二个周期中反向播放，以此类推。这会创建一种来回效果，对于某些类型的动画非常有用。

  


顺便说一下，上述代码也可以这样写：

  


```CSS
.animated {
    animation: fadeIn 2s ease-in-out 1s infinite alternate;
}
```

  


一个完成的 CSS 动画，既要 `@keyframes` 规则定义动画，又需要 `animation` 应用动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f78c8ec02895410c8eec8671ea030a46~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1767&h=1543&s=1156342&e=jpg&b=161719)

  


### 示例

  


回到我们目标案例中来：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4536393328474e54b3828ae72dffe093~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1058&s=798371&e=jpg&b=5695d4)

  


在这个示例中，总共有五个物体被动画化：

  


-   ① 云在飘
-   ② 障碍物在移动
-   ③ 路在移动
-   ④ 人在行走
-   ⑤ 球在弹跳

  


其顶上的云、中间的障碍物和底下的路都是相似的动画效果，即沿着水平方向从右向左不间断的平移，红色的球在垂直方向弹跳（移动），人在行走其实是一个错觉性的动作，因为路在不断的移动，给你造成一种错觉，即人在不断向前走，事实上它在原地是不动的。但人有另一个动画效果，它有不同的动作。

  


也就是说，要实现示例所呈现的效果，我们需要使用 `@keyframes` 定义五个动画。每个动画服务于不同的物体（元素）。

  


```CSS
/* 云在飘 */
@keyframes moveClouds {
    from {
        background-position: 110% 100%;
    }

    to {
        background-position: 0% 100%;
    }
}

/* 障碍物在移动 */
@keyframes moveObstacle {
    from {
        transform: translateX(calc(760px + 144px));
    }

    to {
        transform: translateX(-144px);
    }
}

/* 路在移动 */
@keyframes moveRoad {
    from {
        background-position: -0px 100%;
    }

    to {
        background-position: -96px 100%;
    }
}

/* 人物动作变换 */
@keyframes walking {
    from {
        background-position: -0px 0px;
    }

    to {
        background-position: -1632px 0px;
    }
}

/* 球在弹跳 */
@keyframes drop {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(100px);
    }
}
```

  


注意，示例中云在飘、路在移动和人在行走都是通过改变背景图位置来实现动画效果的，而障碍物的移动和球的弹跳是通过改变 `transform` 的位移值来实现动画效果的。

  


接下来，只需要将已定义好的动画通过 `animation` 属性应用到相应的元素上即可：

  


```CSS
.clouds {
    animation: 30s moveClouds linear infinite;
}

.obstacle {
    animation: 25s moveObstacle linear infinite;
}

.land {
    animation: 1700ms moveRoad linear infinite;
}

.treeman {
    animation: walking 600ms steps(17) infinite;
}


.ball {
    animation: 1500ms drop cubic-bezier(0.5, 0.05, 1, 0.5) infinite alternate;
}
```

  


使用 CSS 制作 Web 动画效果就是这么的简单。

  


## CSS 动画类型

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/556534be8db6464ba080eb1a883983f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1194&h=488&s=3951958&e=gif&f=144&b=1b0f1f)

  


> Demo 地址：https://codepen.io/airen/full/WNPedNy （来源于 [@Stéphanie Walter](https://codepen.io/stephaniewalter/pen/xxVgReM) ）

  


我们平常所说的 CSS 动画其实包含两种动画类型：**帧动画**（`@keyframes` 和 `animation` 实现的动画）和**过渡动画**（`transition` 实现的动画）。

  


### CSS 过渡动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cd5dad8bddd4b5085da90bdcd724a8d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=640&h=320&s=1031537&e=gif&f=145&b=b511fc)

  


与网站交互时，你可能会注意到很多元素都有状态。例如：

  


-   下拉菜单可以处于打开或关闭状态
-   按钮在聚焦或悬停时可能会改为颜色
-   模态框的出现和消失
-   手风琴的折叠与展开
-   单选按钮或复选框可以处理选中或未选中状态
-   表单控件可以下得有效或无效状态
-   等等...

  


默认情况下，CSS 会即时切换这些状态的样式。我们可以使用 CSS 的 `transition` 属性，在元素的初始状态和终止（目标）状态之间插入插值。两者之间的过渡提供了有关互动原因和效果的视觉方向、支持和提示，从而改善了用户体验。

  


简单地说，CSS 过渡动画主要指的是使用 CSS 的 `transition` 属性定义的动画效果，它指定了要进行动画的属性、动画的持续时间和要使用的缓动函数。它主要用于平滑地改变元素的状态（开始状态和结束状态的样式）。例如，下面这个示例：

  


```CSS
button {
    background-color: blue;
    transition: background-color 0.5s ease-in-out;
}

button:hover {
    background-color: red;
}
```

  


在这个示例中，按钮元素的背景颜色会在悬停时从蓝色平滑地过渡到红色，过渡持续时间为 `0.3s` ，使用了 `ease` 缓动函数。这样的动画效果可以让用户更容易地察觉到状态的改变，提供更流畅的用户体验。

  


CSS 过渡动画效果常用来制作悬停动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6caaf713df2498da68b726f70e6fc5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1330&h=362&s=6378821&e=gif&f=111&b=ebc8df)

  


> Demo 地址：https://codepen.io/airen/full/bGzbaxO （来源于 [@Mojtaba Seyedi](https://codepen.io/seyedi/pen/zYoeLEv) ）

  


关键 CSS 代码如下：

  


```CSS
.card__overlay {     
    transform: translateY(100%);
    transition: .2s ease-in-out;
}

.card__header {
    transform: translateY(-100%);
    transition: .2s ease-in-out;
}

.card:hover {
    .card__overlay {
        transform: translateY(0);
    }
    
    .card__header {
        transform: translateY(0);
    }
}
```

  


记住，只要有状态变化了，比如 `A` 状态到 `B` 状态有相同属性样式发生变化，就可以使用 CSS 的过渡动画。[transition.css](https://www.transition.style/) 收录了多种不同过渡动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e02640134174031a44b6623264962a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=606&s=3770814&e=gif&f=216&b=ffffff)

  


> URL 地址：https://www.transition.style/

  


### CSS 关键帧动画

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25242ff2d2b543bbb416eceffbccc0dc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1968&h=1304&s=554291&e=gif&f=46&b=0f0f0f)

  


> URL 地址：https://animate.style/

  


如果你需要的动画效果无法使用 CSS 的过渡（`transition`）实现，那就要使用 CSS 的关键帧动画。它通常用于创造更为复杂的动画效果。正如前面示例所展示的那样，CSS 关键帧动画允许你定义多个关键帧或中间状态，以及指定元素在这些状态之间如何过渡。例如下面这个无限滚动动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3aa2992edde540ba892f0d355f2d394a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=562&s=3627707&e=gif&f=64&b=1b2433)

  


> Demo 地址：https://codepen.io/airen/full/ZEwzrre （来源于 [@Yoav Kadosh](https://codepen.io/ykadosh/pen/KKezJzz) ）

  


```CSS
@keyframes loop {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

.loop-slider .inner {
    animation: loop var(--duration) linear infinite var(--direction);
}
```

  


课程前面所展示的大部分案例都是 CSS 的帧动画。

  


## 何时使用 CSS 动画

  


总的来说，CSS 动画提供了一个功能强大且灵活的工具集，用于创建引人入胜的动画效果。通过了解 CSS 动画的基本语法、存在的动画类型以及可以用于控制它们行为的各种动画属性，你可以开始将动画应用到自己的 Web 项目中，从而给用户留下深刻印象。例如：

  


-   **页面过渡和加载动画**：使用 CSS 动画来创建页面切换或加载动画，以提高用户体验。这可以包括在页面加载时使用过渡效果，或在切换页面视图时使用淡入淡出动画
-   **交互元素**：对于用户交互元素，如按钮、表单控件和下拉菜单等，可以使用 CSS 动画来提供吸引人的交互性，例如按钮悬停时的颜色变化或提交表单时的反馈
-   **数据可视化**：对于数据可视化项目，如图表、图形和数据仪表盘，CSS 动画可用于突出显示数据变化、趋势和关键数据
-   **网站导航**：CSS 动画可用于创建具有动画效果的导航菜单和导航链接，使网站导航更有吸引力
-   **元素强调**：使用 CSS 动画可以突出显示页面上的特定元素，例如鼠标悬停在链接上时的效果，或突出显示重要信息
-   **页面装饰和背景效果**：通过 CSS 动画，你可以创建装饰性效果，如页面背景的运动、背景颜色的渐变或粒子效果，以使页面更具吸引力

  


然而，值得注意的是，CSS 动画存在一些限制，比如它们只能对某些 CSS 属性进行动画处理，而且在某些情况下可能不如其他动画技术表现出色。例如，JavaScript 动画使用 JavaScript 代码创建动画，可以对动画过程进行更精细的控制，比 CSS 动画更具优势；SVG 动画使用可伸缩矢量图形（SVG）文件创建动画，特别适用于创建复杂的交互式动画，如数据可视化或游戏。只不过，无论是 JavaScript 动画还是 SVG 动画，都可能比 CSS 动画更复杂和耗时。

  


此外，需要谨慎使用 CSS 动画，避免过度使用，因为过多的动画可能会降低网站的性能并使其不太用户友好。选择何时以及如何使用 CSS 动画应该根据项目的性质和用户体验需求来决定。

  


## 使用 CSS 动画的最佳实践

  


最佳实践的目标是在提供令人满意的用户体验的同时，避免分散注意力或引起混乱。这些实践有助于确保 CSS 动画在网站上有效地实现其目标，而不会妨碍用户的任务完成。

  


### 保持简单

  


重要的是要避免创建过于复杂的动画，因为复杂的动画容易分散用户注意力或引起混乱（让用户感到困惑）。相反，专注于创建简单而微妙的动画效果，以增强用户体验而不过分复杂。

  


例如，当用户悬停在 Web 页面上的菜单项上时，菜单项会以平滑的动画效果放大。这增加了导航菜单的互动性，但动画很简单，不会分散用户的注意力。用户能够清晰地理解导航菜单的互动性，开发者又无需处理复杂的动画效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0635b80e4464ca192785e4b140e80de~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=430&s=1696347&e=gif&f=126&b=4a4969)

  


> Demo 地址：https://codepen.io/airen/full/zYeOWBJ

  


```CSS
li {
    &:nth-child(odd) {
        padding-left: 10%;
        transform: perspective(500px) rotateY(45deg);
        
        &:hover {
            transform: perspective(200px) rotateY(45deg);
            padding-left: 5%;
        }
    }
    
    &:nth-child(even) {
        padding-right: 10%;
        transform: perspective(500px) rotateY(-45deg);
        
        &:hover {
            transform: perspective(200px) rotateY(-45deg);
            padding-right: 5%;
        }
    }
}
```

  


### 保持短暂

  


在使用 CSS 动画时，保持动画的短暂是一种最佳实践。这是因为过长或复杂的动画可能会引起用户的不耐烦，特别是在用户需要完成任务时。较短的动画可以更好地保持用户的专注，不会让他们感到等待时间太长。

  


例如，当用户单页面上的按钮时，你可以添加一个简短的过渡动画来提供视觉反馈，但不要使它太长，以免用户感到不耐烦。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12bced545bb5425c92a35d28f7b0d72d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=242&s=382618&e=gif&f=118&b=f8f9ff)

  


> Demo 地址：https://codepen.io/airen/full/oNJKjXv

  


  


```CSS
@keyframes topBubbles {
    0% {
        background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
    }
    50% {
        background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
    }
    100% {
        background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
        background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
    }
}
@keyframes bottomBubbles {
    0% {
        background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
    }
    50% {
        background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
    }
    100% {
        background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%,  110% 10%;
        background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
    }
}

.bubbly-button {
    transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
    box-shadow: 0 2px 25px rgb(255 0 130 / 0.5);
    
    &::before,
    &::after {
        transition: all ease-in-out 0.5s;
    }
    
    &:active {
        transform: scale(0.9);
        box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2);
    }
    
    &.animate::before {
        animation: topBubbles ease-in-out 0.75s forwards;
    }
    
    &.animate::after {
        animation: bottomBubbles ease-in-out 0.75s forwards;
    }
}
```

  


另一方面，某些情况下，较长的动画可能更合适，例如在游戏或娱乐应用程序中，但即使在这些情况下，也应注意不要让它们过于冗长，以免失去用户的兴趣。

  


### 保持有意义

  


在使用 CSS 动画时，确保动画具有明确的目的和含义是至关重要的。动画应该为用户提供有用的信息，并增加界面的价值，而不仅仅是无谓的装饰性动画。确保动画与你的内容或功能相关，而不仅仅是为了添加眼睛的视觉效果。

  


举例来说，如果你正在设计一个电子商务网站，你可以使用 CSS 动画来强调特定产品的特点或价格变化，或者为用户提供购物车中有多少商品的动画反馈。这些动画具有明确的目的，有助于提高用户的体验和提供有用的信息。例如，在 [archiduchesse 网站上](https://www.archiduchesse.com/en)，当用户点击“产品图”下面的数字时，它会触发一只可爱的小袜子飞到购物车中，同时会还会调整购物车上的数字信息：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/931bfa5b94774b20a87c4405016731a1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=982&h=570&s=3841211&e=gif&f=276&b=fdfcfc)

  


另一方面，不要添加没有实际含义的动画，因为它们可能会分散用户的注意力，使他们感到困惑，而不是增强用户体验。确保你的动画与你的网站或应用程序的整体信息和目标一致。

  


### 给用户控制

  


在使用 CSS 动画时，考虑为用户提供控制动画的选项是一个很好的实践。这可以增加用户体验的灵活性，并使用户能够根据他们的偏好或需求来控制动画。以下是一些方法，可以考虑在 CSS 动画中提供用户控制：

  


-   **允许暂停或播放**：考虑添加一个暂停或播放按钮，使用户能够在需要时暂停动画或重新启动它
-   **提供动画速度控制**：允许用户调整动画的速度，例如，他们可以选择较快的动画或较慢的动画
-   **允许自定义**：如果可能，允许用户自定义动画的某些方面，如颜色、时长或效果

  


在某些情况下，用户对动画的控制是很有用的，因为不同用户可能有不同的偏好。提供这种控制可以使用户更好地适应他们的需求，并提供更好的用户体验。

  


### 避免过度使用

  


尽管动画可以是增加网站视觉吸引力的好方法，但需谨慎使它们。不要在网站中过度使用动画，因为太多的动画可能会导致网站变得混乱和不易使用，也可能会减慢网站加载速度并降低用户友好性。

  


例如，不要对页面上的每个元素都添加动画，而是将动画限制在特定部分或特别重要的元素上。下面是一个过度使用动画效果的示例，给页面所有元素添加了旋转效果，可能会让用户感到不知所措：

  


```CSS
* {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
```

  


注意，避免过度使用动画效果是确保网站性能和用户体验的重要原则。以下是一些建议，以避免过度使用动画效果：

  


-   **有选择地使用动画**： 不要对页面上的每个元素都添加动画效果。而是有选择地将动画应用于那些对用户特别重要或需要强调的部分。
-   **考虑性能**： 多个动画可能会占用更多的计算资源，特别是在移动设备上。因此，要确保你的动画不会导致页面加载速度明显减慢。
-   **使用性能优化**： 如果你需要多个动画，确保它们是经过性能优化的。这可能包括使用硬件加速（GPU加速）来提高动画性能。
-   **关注用户反馈**： 如果用户抱怨动画效果过多或使他们感到不适，要认真倾听他们的反馈，考虑减少或修改动画效果。

  


总之，使用动画来增强网站的视觉吸引力是一种好方法，但要谨慎使用，确保它们不会对网站的性能和用户体验产生负面影响。

  


### 要注意性能问题

  


动画可能对网站性能产生显著影响，尤其是在处理能力有限的移动设备上。确保优化你的动画以提高性能，方法包括减少页面上的动画数量，尽可能使用硬件加速，并在不同设备和浏览器上测试你的动画。

  


以下是一个使用硬件加速的 CSS 动画示例：

  


```CSS
.element {
    transform: translate3d(0, 0, 0);
    transition: transform 0.3s ease-in-out;
}
```

  


在这个示例中，`translate3d` 和 `transition` 属性的使用可以利用硬件加速来改善动画的性能。这是因为 `translate3d` 使用设备的图形处理单元（GPU）来渲染动画，通常比使用设备的中央处理单元（CPU）更快速和高效。这有助于确保动画在各种设备和浏览器上都能够平滑运行，而不会导致性能下降。

  


然而，需要注意的是，并非所有设备都支持硬件加速，而且使用硬件加速有时可能会导致其他性能问题，例如增加内存使用。一般来说，最好在不同的设备和浏览器上测试你的动画，以确保它们在不同平台上表现良好。这可以帮助你优化动画以适应各种环境，并提供更好的用户体验。

  


除此之外，你还需要注意 CSS 动画影响性能相关的事项：

  


-   **减少动画数量**： 避免在页面上使用过多的动画，因为它们会增加页面的负担，导致性能下降。只使用必要的动画来增强用户体验。
-   **使用硬件加速**： 尽可能使用硬件加速的属性，例如 `transform` 和 `opacity`，以便浏览器可以更有效地处理动画。这有助于减少 CPU 的负载。
-   **优化动画性能**： 使用合适的过渡和缓动函数，以确保动画平滑且不会导致页面卡顿。避免使用复杂的动画，特别是在较慢的设备上。
-   **避免过度复杂性**： 尽量避免创建过于复杂的动画，因为它们可能会对性能产生负面影响。保持动画简单而有效。
-   **使用性能分析工具**： 可以使用性能分析工具来监视动画的性能，识别潜在的性能问题，并进行优化。

  


通过关注这些性能问题并采取相应的措施，可以确保 CSS 动画不仅具有吸引力，而且对用户友好且在各种设备和浏览器上都能够高效运行。

  


## 小结

  


CSS 动画是创建引人入胜的 Web 动画的强大工具，它允许你为网站或其他数字产品创建出色的动画元素，从而实现从一种 CSS 样式配置到另一种的平滑过渡。通过理解 CSS 的动画基础知识并尝试不同的技巧，Web 开发人员可以为 Web 网站、Web 应用程序和数字产品创建吸引人的交互性动画，提高用户体验并增加网站的动态性和互动性。但要小心使用动画，确保它们简单、有意义，不会影响性能，从而提高用户满意度。