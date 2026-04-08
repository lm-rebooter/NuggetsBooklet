混合模式是一种出色的数字化图像和设计增强方法。作为 Web 开发者，有多种方式可以使用混合模式：CSS 混合模式（`mix-blend-mode` 和 `background-blend-mode`）和 SVG 滤镜（`<feBlend>` 滤镜基元）。在这节课中，我们主要来探讨 SVG 滤镜中的混合模式以及它与 CSS 混合模式有何差异。

  


## 混合模式简介

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72e40e4b489c46e4a04ae09c481beb02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2100&h=1018&s=3974955&e=png&b=eee3d9)

  


**[混合模式](https://en.wikipedia.org/wiki/Blend_modes)** 在数字图像编辑和计算机图形学中，用于确定两个或多个图层如何相互混合。换句话说，混合模式也是一种数学公式，用于定义当两个或多个图层的像素组合时，这些像素如何相互混合。虽然这些算法相对复杂，但通过设计工具（如 Adobe Photoshop、Sketch 和 Figma 等），使用它们非常简单。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbed5a72b52944a4b041fdbff10c1de1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1280&h=603&s=71463&e=jpg&b=efedec)

  


通过这种软件，设计师可以将图层（照片、颜色或文本等）以创意的方式混合，只需点击几下鼠标就可以创建独特的设计。作为 Web 开发者，除了使用 CSS 的 `mix-blend-mode` 和 `background-blend-mode` 属性为 Web 元素增强视觉效果之外，还可以使用 SVG 滤镜中的 `<feBlend>` 滤镜基元（混合模式）来增强视觉效果。

  


[如果你不想花时间去深究其底层的数学公式的话](https://www.w3.org/TR/compositing-1/#advancedcompositing)，那么你可以这么来理解混合模式的工作方式。混合模式通过将一个基础图层和一个混合图层结合起来，达到不同的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38b5aeef41fe45d0b4ded7f88f53c714~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1010&s=509966&e=jpg&b=fefefe)

  


  


每种效果（或模式）使用数学方程，将红、绿、蓝（RGB）或青、品红、黄、黑（CMYK）颜色代码与不同的明暗水平结合起来，创建出多层次的效果。大多数混合模式需要透明度来突显混合效果。你可以利用混合模式为图像应用颜色覆盖，将图像混合在一起，调整照片的色彩水平，以及其他许多操作。

  


举个例子，我们来看看如何结合两个图层并应用[“乘法”（Multiply）模式](https://en.wikipedia.org/wiki/Blend_modes#Multiply)。将照片图层作为基础图层，然后使用颜色为 `#ff0f0f` 和 `#4a00e8` 的渐变作为混合图层，结果图像会变暗，并呈现出渐变颜色的外观。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43493d3cde914244a38affad1c1684dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1925&s=806199&e=jpg&b=fdfcfc)

  


为了使混合模式生效，至少需要两个图层。根据所选的模式，每种选项都会产生不同的结果。它的运作原理如下：首先，基础图层是原始的颜色或图像。接下来，混合图层以特定的模式直接应用于基础图层。结果是两个图层的混合，通过改变颜色展现出完全不同的图像外观。

  


## 理解混合模式

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df10f7bc038a4fb4ac0135bf6340e49e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2544&h=1537&s=906739&e=jpg&b=f6f7f9)

  


我们借助诸如 Figma 设计软件来理解混合模式。我们根据它们的主要效果将混合模式分为六大类：普通模式、加深模式、减淡模式、对比模式、比较模式和复合模式（也有称颜色模式）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/220eca3b6f9e48d69190c77d708641e9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2544&h=2280&s=758196&e=jpg&b=fefefe)

  


### 普通模式

  


大多数设计软件（如Figma、 Photoshop 和 Sketch）默认的混合模式都是[普通模式](https://www.w3.org/TR/compositing-1/#blendingnormal)。需要调整混合图层的透明度才能在图像中看到明显的差异。当应用 `100%` 不透明度时，混合图层完全覆盖在基础图层。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26e8813cf0d543caa85bb28ed71c4f57~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=1913435&e=jpg&b=fefdfd)

  


调整一下混合层的透明度，例如 `85%` ，就能透过混合层看到基础层图像：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80dc912f27804f168112b567fa5f854a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=2250715&e=jpg&b=fefdfd)

### 加深模式

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cd89df51cab4be3973024e7121bdad4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1676&s=1633099&e=jpg&b=fdfafa)

  


加深模式也称加法模式，正如其名，这些混合模式会给你的图像和设计添加深色调。加深模式包含变暗（`darken`）、叠加（即正片叠底 `multiply`）、颜色加深（`color-burn`）和较暗颜色（Plus Darker）。

  


#### 变暗：`darken`

  


[变暗模式](https://www.w3.org/TR/compositing-1/#blendingdarken)通过比较基础图层和混合图层的像素，选择最暗的像素来使图层显得更暗。如下图所示，你可以看到应用了照片、颜色或渐变叠加时（混合图层），图像（基础图层）变得更暗：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ddfe052ef68426fb3e149230e5a7f94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=2888463&e=jpg&b=fefdfd)

这种模式会保留混合图层和基础图层之间的最暗色。

  


#### 叠加：`multiply`

  


[叠加模式](https://www.w3.org/TR/compositing-1/#blendingmultiply)又称为正片叠底，是最常用的混合模式之一。它通过将基础图层的颜色与混合图层相乘来工作，结果是图像呈现出变暗的外观。任何白色像素都不会改变，而较暗的色调会比原始照片或设计显得更暗。简单地说，保留混合图层中的较暗色，并使较亮色变得不透明。结果颜色总是较暗的，除非纯白处。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe0e44441d2642a195c729057f704687~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=2801844&e=jpg&b=fefdfd)

#### 颜色加深：`color-burn`

  


类似于叠加，[颜色加深](https://www.w3.org/TR/compositing-1/#blendingcolorburn)通过增加对比度来使基础图层的颜色变暗，然后再与混合图层的颜色混合。与白色混合不会改变图像外观。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86515b3fbe9843d9b2c564834917f6f1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=3075119&e=jpg&b=fefdfd)

#### **较暗颜色：Plus Darker**

  


较暗颜色模式比较图像图层和混合图层的像素，然后显示较低值的颜色。与变暗不同的是，较暗颜色不会创建第三种颜色，而是选择来自基础和混合图层的最低颜色值。它有点类似于变暗（`darken`），但对中间色调的影响更强。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dc9547f2c5742c682cd001fd1f44586~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=2709185&e=jpg&b=fefdfd)

  


注意，较暗颜色模式只在设计软件中有，在 CSS 和 SVG 混合模式中都没有 `plus-darker` 这个选项。

  


加深类的混合模式非常适合处理阴影或深色基础图层。你可以利用它们来创造更真实和动态的阴影效果，或者为图像增添深度和质感！

  


### 减淡模式

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a09fca240c924944a9e8d724b71ccd97~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1676&s=1684508&e=jpg&b=fdfafa)

  


减淡模式又称为较亮模式，它会使你的图像和设计看起来更亮，有助于增强设计中的亮色色调，因为它们减少了光（或光颜色调）在混合图层上的混合。减淡模式中包含了亮光（`lighten`）、屏幕（`screen`）、颜色减淡（`color-dodge`）和较亮的颜色（Plus Lighter）等类型。

  


#### 亮光：`lighten`

  


[亮光模式](https://www.w3.org/TR/compositing-1/#blendinglighten)会选择两个图层中最亮的颜色，用混合图层替换比混合图支暗的像素颜色。或者说，它会保留混合图层和基础图层之间的最亮色。只有在顶部图层（混合图层）比底部图层（基础图层）的亮度或光度更高时才会变亮。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b7cafa8878747c98dacf854560f326f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=2984616&e=jpg&b=fdfafa)

  


#### 屏幕：`screen`

  


[屏幕模式](https://www.w3.org/TR/compositing-1/#blendingscreen)会保留混合图层中的白色和较亮色，并使黑色或暗色变得不透明。换句话说，它将基础和混合颜色的反向进行乘法运算，得到更亮的结果，除了纯黑处。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01c01c677a314a4d9d814d9fe88a4abe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=2980568&e=jpg&b=fefdfd)

  


#### 颜色减淡：`color-dodge`

  


[颜色减淡](https://www.w3.org/TR/compositing-1/#blendingcolordodge)会使混合图层的颜色来提亮基础图层，减少两者之间的对比度。与黑色混合不会产生变化。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71541eaf85d14374a41b87ac22566313~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=3293412&e=jpg&b=fefdfd)

  


#### **较亮颜色：Plus Lighter**

  


与亮光模式（`lighten`）类似，较亮的颜色比较基础和混合图层，然后保留两者中较亮的颜色。亮光模式（`lighten`）和较亮颜色模式的区别在于，较亮的颜色会整体考虑 RGB 通道，而亮度则是按照通道完成的。简单地说，它对中间色调的影响更强。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7ad02362ed949d0a1787b69934d100b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=2951260&e=jpg&b=fefdfd)

  


注意，较亮颜色模式与较暗颜色模式相似，只在设计软件中有这种模式，CSS 和 SVG 的混合模式中没有该选项。

  


减淡类的混合模式非常适合创造光亮效果或增强图像的明亮度。

  


### **对比模式**

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1250c0d8da5f4da293b3631aa0eff734~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1676&s=1375850&e=jpg&b=fefcfc)

  


对比类混合模式通过对比度创建不同的效果，并基于基础或混合图层是否比 `50%` 灰色深。这个类别包含覆盖（`overlay`）、柔光（`soft-light`）和硬光（`hard-light`）。

  


#### 覆盖：`overlay`

  


[覆盖模式](https://www.w3.org/TR/compositing-1/#blendingoverlay)也是混合模式中最常的模式之一，它在亮于灰色的颜色上使用屏幕模式（`screen`）的 `50%` 强度。暗色调会使用中色调变暗，而亮色调则会使中色调变得更亮。简单地说，如果基础层较暗，它的效果类似于正片叠加模式（`multiply`），如果基础层较亮，其效果类似于屏幕模式（`screen`）。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/baa9997d5da240e4901d57e64fcc2d0d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=3251227&e=jpg&b=fefdfd)

  


#### **柔光：** **`soft-light`**

  


[柔光模式](https://www.w3.org/TR/compositing-1/#blendingsoftlight)类似于覆盖模式（`overlay`），它根据图像或颜色中的亮度值应用较暗或较亮的效果，但更加微妙，不会有强烈的对比度。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30f2788dfb4a43e59cb6e27557edbc5c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=3134512&e=jpg&b=fefdfd)

  


#### **硬光：** **`hard-light`******

  


[硬光模式](https://www.w3.org/TR/compositing-1/#blendinghardlight)通过结合叠加（`multiply`）和屏幕（`screen`）模式，利用混合图层的亮度来计算其结果。或者说，它通过使用混合层的亮度值结合叠加（`multiply`）和屏幕（`screen`）的效果进行计算，而基础层使用覆盖（`overlay`）的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed13f7df2ffa449ab310f2e6ea6795e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=3112411&e=jpg&b=fefdfd)

  


通常，在使用硬光模式时最好减少混合层的不透明度以获得良好的结果。

  


对比类的混合模式非常适合为图像添加深度和动态。例如，你可以将它们与高斯模糊结合使用，为用户头像增添柔和的光晕效果。当然，它们也非常适合在不需要通过色彩调整设置来增加图像对比度时使用。

  


### 比较模式

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23c58381302348448f19f79663d8b617~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1008&s=986388&e=jpg&b=fdfbfb)

  


比较类的混合模式会根据混合图层和基础图层的数值创建颜色变化，基本上是反转白色或浅色。这种类型包括差异厝式（`difference`）和排除模式（`exclusion`）。

  


#### 差异模式：`difference`

  


[差异模式](https://www.w3.org/TR/compositing-1/#blendingdifference)会根据哪个图层更亮，从基础图层或混合图层中减去颜色。当两个像素相同时，结果为黑色。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a6e489dd6d04b68913d587305f07a80~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=3360844&e=jpg&b=fefdfd)

  


#### 排除模式：`exclusion`

  


[排除模式](https://www.w3.org/TR/compositing-1/#blendingexclusion)与差异模式类似，但降低了对比度，因为它不反转中间色调。如果你用白色混合，基础图层会被反转。然而，黑色不会改变。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08af51f84876463db372df88ad62326b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=3074148&e=jpg&b=fefdfd)

  


比较类的混合模式适用于创建细微的分层效果或反转颜色。你还可以使用它们来测试颜色之间的差异，如果你对设计的科学面感兴趣的话。

  


### **复合混合模式**

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cc4b53e35144b85a60b0928cb5de6ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1657&s=1688884&e=jpg&b=fdf9f9)

  


复合类混合模式又称为颜色类混合模式，这一类别的混合模式用于改变颜色质量。它结合了白色和红色、绿色、蓝色（RGB）以及青色、品红、黄色和黑色（CMYK）的主要颜色组合来创建混合模式。简单地说，这类混合模式通过操纵色调（色相）、饱和度和亮度来使设计更加生动。它包含色相模式（`hue`）、饱和度模式（`saturation`）、颜色模式（`color`）和亮度模式（`luminosity`）。

  


#### 色相：`hue`

  


[色相模式](https://www.w3.org/TR/compositing-1/#blendinghue)通过强制基础层中的颜色使用混合层的色相来重新上色。它保持所有暗色调暗，所有浅色调亮，但只替换混合层的色调。简单地说，它使用混合图层的色相，同时保留基础图层的饱和度和亮度。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dc065281cc8424d9445052617a352b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=2812034&e=jpg&b=fefdfd)

  


#### 饱和度：`saturation`

  


[饱和度模式](https://www.w3.org/TR/compositing-1/#blendingsaturation)与色相模式相似，但影响到图像的饱和度。基础层中最浅的颜色和色调保持不变，而饱和度则用混合颜色替换。简单地说，它使用混合图层的饱和度级别，但保留基础图层的色相和亮度。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82a0787b6d344c288ee15638a194a801~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=3649547&e=jpg&b=fef9f9)

  


#### 颜色：`color`

  


[颜色模式](https://www.w3.org/TR/compositing-1/#blendingcolor)的工作方式与色调模式类似，但它只保留基础层中最亮的颜色。然后添加混合层的色调和饱和度。即使用混合图层的色相和饱和度，同时保留基础图层的亮度。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc8b0fbbc37d42409cd4581b79226931~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=3142266&e=jpg&b=fefdfd)

  


#### 亮度：`luminosity`

  


[亮度模式](https://www.w3.org/TR/compositing-1/#blendingluminosity)与颜色模式相反。它在保留基础照片层的色调和饱和度的同时，用混合层的颜色替换其最亮的颜色（亮度）。即保留基础图层的亮度，同时保留基础图层的色相和饱和度，从而创建颜色的反向效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22863e4351034fa1b62fc4dc9b4ddb23~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=3042&s=2484067&e=jpg&b=fefdfd)

  


复合类的混合模式非常适合进行照片编辑。例如，你可以用它来为冷色调的照片增添温暖感，或者通过去饱和色彩来创造复古风格。

  


好了，现在我们对混合模式有了一个基本的认识。那么，我们实际如何使用这些混合模式呢？下图向你展示了如何有效地使用每种混合模式类型：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b3ff4cddeec47b78ea0b5e107407b78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3160&h=3042&s=4350974&e=jpg&b=f8f3f3)

  


-   1️⃣ **使用加深混合模式处理阴影**：使用正片叠底（`multiply`）将纹身无缝融入背部的阴影中
-   2️⃣**使用减淡混合模式照亮图像**：使用亮光（`lighten`）使灯看起来像是亮着的，通过添加高斯模糊使其效果更加优雅
-   3️⃣**使用对比混合模式改变图像纹理**：使用覆盖（`overlay`）轻松改变任何图像的整体纹理，通过调整基础图形的饱和度（去饱和度）使纹理（混合层）更好的融入到人物头像中（基础图层）
-   4️⃣**使用比较混合模式翻转图像中的颜色**：使用差异（`difference`）翻转图像的颜色，将亮变暗，将暗变亮
-   5️⃣**使用复合混合模式改变图像中对象的颜色**：使用色相（`hue`）改变图像的颜色，同时保留其底层纹理

  


这些仅是混合模式中的部分案例。希望这能让你更好地了解如何使用混合模式并并释你的创造力。

  


在这之前，我们聊的都是基于 Figma 设计软件中的混合模式，接下来我们将注意力转到 Web 中的混合模式。

  


## CSS 混合模式在 Web 中的应用

  


CSS 提供了两个主要属性，允许 Web 开发者在 Web 中应用混合模式：

  


-   `background-blend-mode` ：用于为单个 HTML 元素的多个背景添加混合模式
-   `mix-blend-mode`：用于为多个 HTML 元素添加混合模式样式，使其与父元素或其他重叠的兄弟元素进行混合

  


我们简单的看看这两个属性在 Web 上的应用。

  


### background-blend-mode 属性

  


`background-blend-mode` 是一个 CSS 属性，用于为单个 HTML 元素的多个背景添加混合模式。在 CSS 中，你可以使用 `background` 、`background-image` 或 `background-color` 属性为元素添加背景。如果一个元素包含两个或更多的背景图像、线性渐变或颜色，你可以使用 `background-blend-mode` 属性为这些背景分配混合模式。

  


```HTML
<div class="blend"></div>
```

  


```CSS
.blend {
    background: 
        linear-gradient( 225deg in oklab, oklch(70% 0.5 340) 0%, oklch(90% 0.5 200) 91% 91% ),
        url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/153385/jpgls-leaf.jpg") 
        orange;
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9ff31de3cab44e29ae250e70fd99ba6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=642&s=6023576&e=gif&f=204&b=010101)

  


> Demo 地址：https://codepen.io/airen/full/Yzbaemo

  


### mix-blend-mode 属性

  


`mix-blend-mode` 是一个 CSS 属性，用于为多个元素添加混合模式样式，而不仅仅是像 `background-blend-mode` 那样为单个元素的背景添加混合模式。它可以将一个元素与其父元素或其他重叠的兄弟元素进行混合。例如：

  


```HTML
<div class="card">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/153385/jpgls-leaf.jpg" alt="">
</div>
```

  


```CSS
.blending .card {
    &::before {
        background:linear-gradient( 225deg in oklab, oklch(70% 0.5 340) 0%, oklch(90% 0.5 200) 91% 91% );
    }
    &:nth-child(1) {
      &::before {
        mix-blend-mode: var(--blend-mode);
      }
    }
    
    &:nth-child(2) {
      & img {
        mix-blend-mode: var(--blend-mode);
      }
    }
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/066faf601c5b4d5fae7eaa1fe1fe2099~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1096&h=676&s=5590397&e=gif&f=179&b=010101)

  


> Demo 地址：https://codepen.io/airen/full/QWRmmNg

  


有关于 CSS 混合模式在 Web 中的应用就介绍到这里，如果你想更深入了解这方面的知识，请移步阅读小册的《[SVG 与 Web 开发之使用 CSS 混合模式增强 SVG 图形](https://juejin.cn/book/7341630791099383835/section/7368317864165507082)》！

  


## SVG 混合模式：`<feBlend>`

  


你可能使用过图像编辑器，例如 Fimgma、Sketch 或 Photoshop 等，通过选择不同的混合模式将两张图像或两个图层组合在一起，创造出一些非常有趣的图像。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ae5a70150134c64898394ae5c1f4a33~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1048&h=756&s=3970673&e=gif&f=156&b=f6f5f5)

  


你知道 SVG 也有一个滤镜，可以让你做同样的事情吗？这个滤镜就是 `<feBlend>` 滤镜基元，它可以像你喜欢的图像编辑器一样混合两张图像或两个图层。

  


`<feBlend>` 滤镜基元类似于 `<feComposite>` 滤镜基元，它将两个图像或 SVG 片段通过混合模式合成为一个图形。这类似于诸如 Figma 图像编辑中的图层混合功能。不像 `<feComposite>` ，`<feBlend>` 使用的是混合模式，而非操作符。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1578097355ee4a33a650d24e6b58dd54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1144&h=634&s=2153982&e=gif&f=131&b=fcfcfc)

  


> URL:https://yoksel.github.io/svg-filters/#/

  


`<feBlend>` 滤镜的主要属性有：

  


-   `in` ：定义第一个输入图像，如果未指定，则默认使用滤镜的第一个输入图像，即 `in="SourceGraphic"` ，相当于混合层
-   `in2` ：定义第二个输入图像。必须指定第二个输入图像，相当于基础层
-   `mode` ：定义两个层（即 `in` 指定的混合图层和`in2` 指定的基础图层）的混合模式。它的值与 CSS 的 `mix-blend-mode` 或 `background-blend-mode` 属性值相同。如果未指定，则使用默认值 `normal`

  


注意，`<feBlend>` 中的 `in` 和 `in2` 类似于 `<feComposite>` 的操作符为 `over` ，`in` 将位于 `in2` 前面，即 `in` 在顶部，`in2` 在底部！

  


下面是一个示例，展示了 `<feBlend>` 如何在实际中工作。首先，使用 `<filter>` 元素创建了一个名为 `blend` 的滤镜，在这个滤镜中，使用两个滤镜基元：

  


-   `<feFlood>` ：使用 `<feFlood>` 滤镜基元为滤镜区域填充了一个玫红色（`#f36`），并将其结果命名为 `BLEND__LAYER`
-   `<feBlend>` ：使用 `<feBlend>` 滤镜基元创建混合模式，其中 `in` 设置为 `<feFlood>` 滤镜的结果，即 `BLEND__LAYER` （混合层），`in2` 设置为 `SourceGraphic` （基础层，即应用滤镜的元素），并且指定 `mode` 属性的值为 `multiply` （即混合模式为“正片叠底”）

  


对应的代码如下：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="blend" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feFlood flood-color="#f36" in="SourceGraphic" result="BLEND__LAYER" />
            <feBlend in="BLEND__LAYER" in2="SourceGraphic" mode="multiply" result="BLEND" />
        </filter>
    </defs>
</svg>
```

  


到目前为止，上面的代码仅仅是定义了一个名为 `blend` 的滤镜，它需要被别的元素引用才能生效。例如，在需要应用 `blend` 滤镜效果的 SVG 元素上指定 `filter` 属性的值为 `url(#blend)` ，或者在 CSS 中给元素指定 `filter` 属性的值为 `url(#blend)` ：

  


```CSS
.blend {
    filter: url(#blend);
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27f08da824a9415ea29c7c4171593167~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2732&h=1381&s=1759948&e=jpg&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/zYQWegj

  


你可以尝试着调整示例中的混合模式的类型以及 `<feFlood>` 滤镜基元的 `flood-color` 的值，你将获得不同的视觉效果。具体哪种模式效果最好，取决于你要混合的内容，但希望这个简单的示例所呈现的结果能给你一个 `<feBlend>` 滤镜基元如何工作的概念。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04c27c77c4624da6be6babf4a4143018~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=648&s=6077127&e=gif&f=268&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/zYQWegj

  


## SVG 混合模式与 CSS 混合模式的差异

  


SVG 混合模式与 CSS 混合模式虽然都有助于实现图像或元素的混合效果，但它们之间在工作和使用方式上都有所不同。

  


首先，CSS 混合模式可以通过 `mix-blend-mode` 或 `background-blend-mode` 属性分别在多个元素或多个背景上应用混合模式，而无需依赖其他方面的定义。 SVG 混合模式则不同，它需要先使用 `<feBlend>` 滤镜基元定义一个混合模式，然后在元素上使用 `filter` 属性来引用已定义的混合模式。实质上它是一个滤镜。只不过，该滤镜中的 `<feBlend>` 滤镜基元做了混合模式相关的事情。

  


其次，CSS 混合模式可以对两个或多个元素或背景层进行混合，然后 `<feBlend>` 只能对两个层进行混合。另外，CSS 混合模式可以对任何元素或元素的任何背景层进行混合，但 `<feBlend>` 只能对图像源进行混合，该图像源可以是 SVG 元素（通常是 SVG 的其他滤镜基元的结果）或 `SourceGraphic` 以及 `SourceAlpha` 。

  


接下来，我们通过一些简单的示例来向大家呈现 `<feBlend>` 与 CSS 混合模式不一样的地方。

  


我们通过内联 SVG 代码的方式，在 HTML 中使用 `<filter>` 创建了一个名为 `blend` 的滤镜：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="blend" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
        </filter>
    </defs>
</svg>
```

  


到目前为止，`blend` 滤镜什么都没做，因为在 `<filter>` 中还没有添加任何滤镜基元。假设，我们将在一个渐变文本和一个图像上应用 `blend` 滤镜：

  


```HTML
<h3 class="blend">SVG Awesome!</h3>
<img src="https://picsum.photos/id/156/800/600" alt="" class="blend" />
```

  


```CSS
.blend {
    filter: url("#blend");
}
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a506c1d05064664aed8411a965e4b59~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1053&s=451756&e=jpg&b=050505)

  


接下来，我们往 `<filter>` 元素中添加一个 `<feBlend>` 滤镜基元，将其 `in` 和 `in2` 分别设置为 `SourceGraphic` 和 `SourceAlpha` ，并且设置 `mode` 为 `multiply` ：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="blend" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feBlend in="SourceGraphic" in2="SourceAlpha" mode="multiply" result="BLEND" />
        </filter>
    </defs>
</svg>
```

  


这个时候，`h3` 和 `img` 元素与一个纯黑色层混合在一起，因为 `in` 的值为 `SourceGraphic` ，表示第一个输入图像是元素自身（在这个示例中是 `h3` 和 `img`），`in2` 的值为 `SourceAlpha` ，表示第二个输入图像是元素自身的 Alpha 通道版本，即可黑色（在我们这个示例中分别是黑色的文本和黑色矩形）：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3188e88c49440bc8fc58e864c7eb1df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=2636&s=2304239&e=jpg&b=39383d)

  


你可以尝试着调整将上面示例中的 `in` 和 `in2` 的值进行互换。它们将产生不一样的结果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe973cf020ab4847a5ff1dfc251835a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1080&h=594&s=6957969&e=gif&f=352&b=323234)

  


> Demo 地址：https://codepen.io/airen/full/jOozReo

  


仅与纯黑色图层进行混合肯定是不符合现实的。在 SVG 中，我们可通以下方式来替换上例中的纯黑色层。

  


```XML
<svg class="sr-only">
    <defs>
        <rect x="0" y="0" width="100%" height="100%" fill="#f36" id="overlay" />
        <filter id="blend" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage href="#overlay" result="OVERLAY" />
            <feBlend in="OVERLAY" in2="SourceGraphic" mode="multiply" result="BLEND" />
        </filter>
    </defs>
</svg>
```

  


在上面的示例中，我们使用 `<rect>` 创建了一个矩形图形，并且在 `<filter>` 中应用 `<feImage>` 滤镜基元，并将 `<rect>` 绘制的矩形图形引用到滤镜中，同时将其结果命名为 `OVERLAY` 。然后再使用 `<feBlend>` 将 `<feImage>` 的结果 `OVERLAY` 作为第一输入图像（混合层），使用 `SourceGraphic` 作为第二输入图像（基础层）进行混合。这样你就可以任意你喜欢的纯色进行混合：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f5e3990620d4c0c892361bfcf29dc40~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=722&s=4158709&e=gif&f=260&b=070707)

  


> Demo 地址：https://codepen.io/airen/full/eYaMavB

  


另一种更简单的方式是使用 `<feFlood>` 滤镜基元。它会将滤镜区域填充为你指定的颜色，该颜色可以是任意你想要的颜色。

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="blend" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feFlood flood-color="#f36" result="OVERLAY" />
            <feBlend in="OVERLAY" in2="SourceGraphic" mode="multiply" result="BLEND" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79d1e88a3e56440d9b22f3438dd9b2ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1146&h=760&s=6247683&e=gif&f=331&b=070707)

  


> Demo 地址：https://codepen.io/airen/full/pomLmry

  


在 CSS 中，我们还可以将丰富多彩的渐变作为混合图层，并与其他图层进行混合。在 SVG 中，同样也可以使用渐变颜色作为混合层。不过，与 CSS 相比，它的灵活性以及渐变的丰富性要弱一些。例如下面这个示例，我们将前面纯色的矩长替换为一个线性渐变：

  


```XML
<svg class="sr-only">
    <defs>
        <linearGradient id="linearGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0" stop-color="oklch(55% .45 350)" />
            <stop offset="1" stop-color="oklch(95% .4 95)" />
        </linearGradient>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#linearGradient)" id="overlay" />
        <filter id="blend" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage href="#overlay" result="OVERLAY" />
            <feBlend in="OVERLAY" in2="SourceGraphic" mode="multiply" result="BLEND" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd8ce17535714d979522dba4eae56cff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1204&h=764&s=11083048&e=gif&f=286&b=050505)

  


> Demo 地址：https://codepen.io/airen/full/zYQWQpd

  


你也不仅限于渐变颜色或纯色混合，还可以与其他图像混合：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="blend" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage href="https://picsum.photos/id/98/800/600" result="OVERLAY"  preserveAspectRatio="none" />
            <feBlend in="OVERLAY" in2="SourceGraphic" mode="multiply" result="BLEND" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4a767fc7b584a8ba6de123cfbd17cdf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1260&h=740&s=11486869&e=gif&f=304&b=080808)

  


> Demo 地址：https://codepen.io/airen/full/VwOXOxE

  


你可能已经发现了，前面这些示例，混合层不管是纯色、渐变色或图像，它们都有一个共同点，都是另一个滤镜基元的结果，例如 `<feImage>` 或 `<feFlood>` 的结果（即 `result`）。这意味着，SVG 混合模式可以通过组合更多的滤镜基元创建更复杂的混合效果，这是 CSS 不具备的能力。例如下面这个示例：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="blend" color-interpolation-filters="linearRGB" x="0%" y="0%" width="100%" height="100%">
            <feOffset in="SourceGraphic" dx="-8" dy="-8" result="OFFSET" />
            <feGaussianBlur in="OFFSET" stdDeviation="64" result="BLUR" />
            <feTurbulence result="WAVES" type="turbulence" baseFrequency="0.0735 0.0771" numOctaves="3" seed="256" />
            <feDisplacementMap in="BLUR" in2="WAVES" scale="320" xChannelSelector="R" yChannelSelector="B" result="RIPPLES" />
            <feComposite in="WAVES" in2="RIPPLES" operator="arithmetic" k1="1" k2="0" k3="1" k4="0" result="RIPPLES__WAVES" />
            <feColorMatrix in="RIPPLES__WAVES" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -16" result="RIPPLES__WAVES__COLOR" />
            <feBlend in="RIPPLES__WAVES__COLOR" in2="SourceGraphic" mode="multiply" result="BLEND" />
        </filter>
    </defs>
</svg>
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/475cf4ec4ac840889a9d8a05a934e54c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1164&h=698&s=9211586&e=gif&f=275&b=040404)

  


> Demo 地址：https://codepen.io/airen/full/rNgdgQG

  


发挥你的想象力和创造力，你可以组合更多的 SVG 滤镜，实现更具创意的效果。最后以 [@Ana Tudor 制作的分割文本的案例](https://codepen.io/thebabydino/full/GRaKbZo)来结束 SVG 混合模式的介绍。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/923788d33cf54543b53162ed29360bcf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2000&h=1053&s=724971&e=jpg&b=3c3b3f)

  


> Demo 地址：https://codepen.io/airen/full/bGyvyPp （来源于 [@Ana Tudor](https://codepen.io/thebabydino/full/GRaKbZo) ）

  


上面这个效果对应的 SVG 滤镜代码如下：

  


```XML
<svg class="sr-only">
    <defs>
        <filter id="sliced" color-interpolation-filters="sRGB">
            <feColorMatrix values="
                0 0 0 0 .93 
                0 0 0 0 .93 
                0 0 0 0 .93
                1 0 1 0 -1" in="SourceGraphic" result="TOP__STRIP__10" />
            <feOffset dx="-16" dy="-2" in="TOP__STRIP__10" result="TOP__STRIP__20" />
            <feColorMatrix values="
                0 0 0 0 .93 
                0 0 0 0 .93 
                0 0 0 0 .93
                0 1 1 0 -1" in="SourceGraphic"  result="BOTTOM__STRIP__10" />
            <feOffset dx="16" dy="2" in="BOTTOM__STRIP__10" resutl="BOTTOM__STRIP__20" />
            <feBlend in="TOP__STRIP__20" in2="BOTTOM__STRIP__20" result="BLEND" mode="normal" />
            <feDropShadow stdDeviation="5" in="BLEND" resutl="BLEND__SHADOW" />
            <feDropShadow stdDeviation="7" in="BLEND__SHADOW" result="OUT__STRIP" />
            <feColorMatrix  values=" 
                0  0  0 0 .945 
                0  0  0 0 .965 
                0  0  0 0 .4 
                -1 -1 1 0 0" in="SourceGraphic" result="MIDDLE__STRIP" />
            <feBlend in="OUT__STRIP" in2="MIDDLE__STRIP" />
        </filter>
        <filter id="noisey">
            <feTurbulence type="fractalNoise" baseFrequency="3.17" in="SourceGraphic" result="TURBULENCE__10" />
            <feComponentTransfer in="TURBULENCE__10" result="TURBULENCE__20">
                <feFuncA type="table" tableValues="0 .3" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="TURBULENCE__20" operator="out" />
        </filter>
    </defs>
</svg>
```

  


这里不一一拆解了。感兴趣的同学可以注释掉每个滤镜基元，一步一步看查其效果的变化。这样你能更好的理解每个滤镜基元的功能。

  


## 为什么选择 SVG 滤镜？

  


我们在小册分了多节课与大家一起探讨了 SVG 滤镜相关的技术：

  


-   [中级篇：初探 SVG 滤镜](https://juejin.cn/book/7341630791099383835/section/7366549423746187273)
-   [高级篇：SVG 滤镜的进阶之高阶颜色矩阵](https://juejin.cn/book/7341630791099383835/section/7368318058076569638)
-   [高级篇：SVG 滤镜的进阶之文本描边](https://juejin.cn/book/7341630791099383835/section/7368318146262138889)
-   [高级篇：SVG 滤镜的进阶之创建图像特效](https://juejin.cn/book/7341630791099383835/section/7368318225756454962)
-   [高级篇：SVG 滤镜的进阶之奇妙的位移滤镜](https://juejin.cn/book/7341630791099383835/section/7368318262368534578)
-   [高级篇：SVG 滤镜的进阶之创造纹理](https://juejin.cn/book/7341630791099383835/section/7368318101526183986)
-   [高级篇：SVG 滤镜的进阶之创建颗粒效果](https://juejin.cn/book/7341630791099383835/section/7368318185768615962)
-   [高级篇：SVG 滤镜的进阶之模糊与阴影效果](https://juejin.cn/book/7341630791099383835/section/7368318391733452850)
-   [高级篇：SVG 滤镜的进阶之黏糊效果](https://juejin.cn/book/7341630791099383835/section/7368318301761437746)

  


这节课是最后一节关于 SVG 滤镜的内容。在即将结束 SVG 滤镜之旅时，简单的与大家聊聊“为什么选择 SVG 滤镜”？

  


到目前为止，虽然 CSS 也具有处理图像效果相关的特性，但与 SVG 相比，还是要逊色的多。使用 SVG 滤镜可以直接将视觉效果在 Web 上呈现，而且它具备以下几个优势：

  


-   **响应式 Web 设计需求**：在响应式 Web 设计时代，我们不再只处理单一图像。对于在 Web 上使用的每一个图像，我们都应该提供针对不同用户环境和性能优化的响应式版本。这意味着，如果你创建了一张图片并决定更改其中的某个效果，你将不得不在多个图像中更改这个效果，这很容易变成维护的噩梦。相反，在浏览器中创建效果意味着它们是分辨率无关的，并且更容易编辑
-   **保持文档语义结构**：在 Web 上应用滤镜效果有助于保持文档的语义结构，而不是依赖图像。图像通常是固定分辨率的，并且往往会模糊它们所替代元素的原始语义。这对应用于文本的效果尤其重要。当效果应用于 Web 上的真实文本时，该文本将是可搜索、可选择和可访问的
-   **更易编辑和更新**：在 Web 上创建的效果更易于编辑、更改和更新，而不必在图形编辑器和代码编辑器或浏览器之间切换
-   **可动画和交互**：在 Web 上创建的效果可以进行动画处理和交互，这是它们最重要的优势之一

  


## 写在最后

  


最后，我希望这一系列的课程能激励你开始使用 SVG 滤镜，并在适当的时间和场景中将其应用于实际项目。在学习和试验 SVG 滤镜时，你将能创建出很多令人惊艳和吸引人注意力的效果。或许，这些实验性的效果中就有你可以用于实际项目中的。

  


在结束滤镜之旅时，我想再跟大家说一句，SVG 滤镜并没有大家想象的那么恐怖，只要尝试性的去拆分每个滤镜，并尝试着调整每个参数，你将能快速掌握 SVG 滤镜。在这个过程中，你除了能掌握 SVG 滤镜所有知识之外，还能激发你的创造力，发挥你的想象力，并制作出符合你自己期望的效果。