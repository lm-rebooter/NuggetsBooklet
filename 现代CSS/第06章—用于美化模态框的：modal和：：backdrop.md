模态框（`Modal`）是很常见的一种 Web 组件，也是 Web 中的一种特殊类型的弹出框（对话框），即一种打断用户专注于自身的弹出框，可以使用户专注于特定的内容，在至少是暂时的时间内忽略 Web 页面上的其他部分。由于其交互模式较为复杂，即使使用 CSS 的 `:target` 选择器（或者和 `:has()` 选择器结合）可以构建出带有简单交互的模态框，但是 Web 开发者还是习惯于借助于 JavaScript 脚本或其他第三方 JavaScript 库来构建。

换句话说，至少到目前为止，使用 JavaScript 构建模态框还是主流方式。但是，我们可以变一变了。HTML 推出一种原生构建模态框的方式，即使用语义化的 HTML `<dialog>` 元素来创建对话框（模态框是对话框中的一种），该方法构建的模态框带有语义，键盘交互以及 `HTMLDialogElement 接口的所有属性和方法`。

随着 `<dialog>` 元素的出现，CSS 新增了 `:modal` 伪类选择器和 `::backdrop` 的伪元素。你可以使用它们来美化由 `<dialog>` 元素构建的模态框 UI 样式。虽然这两者都是用来美化模框 UI 样式的，但它们之间还是有较大差异的。接下来的课程就向大家阐述它们是如何使用的，以及它们之间的差异是什么？

## Web 模态组成简介

Web 模态框（`Modal`）是一种用户界面元素，被用于在 Web 网页中显示重要的信息和交互元素。模态框在展示时会遮挡背景，用户需要先处理模态框之后才能在页面上进行其他操作。这种交互可以更好地引导用户的注意力，使用户专注于模态框中的内容。

Web 模态框通常由以下几个部分构成：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b5a52cbbebc4230b65dec6a40a2f4e8~tplv-k3u1fbpfcp-zoom-1.image)

*   **模态框容器** （① ）：模态框的外部容器，包含所有内容，它通常有一个固定的大小和位置，并被居中于屏幕或浮动在页面上方
*   **模态框标题** （②）：通常位于模态框容器的顶部，并描述模态框的内容，会告诉用户模态框的内容或目的
*   **模态框内容** （③）：模态框的核心，用于向用户展示关键信息或交互元素，例如文本、表单、图片、图表等
*   **模态框操作按钮** （④）：包括一些供用户选择和操作的按钮，例如确认、取消、提交和关闭按钮等
*   **模态框关闭按钮** （⑤）：模态框可能包括一个关闭按钮，用户可以随时点击来关闭模态框
*   **模态框背景** （⑥）：模态框打开后，背景通常会半透明化（即半透明遮罩层），以突出显示模态框并确保用户无法与背景中的其他内容进行交互

这些部分的外观和位置可能因实现和设计而异。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6668b83cb32d472d80519fe9db112a05~tplv-k3u1fbpfcp-zoom-1.image)

## dialog 元素简介

`dialog 是 HTML5 中一个新标签元素`，你可以直接使用该标签来制作 Web 中的对话框组件。例如：

```HTML
<dialog>
    <div class="dialog__heading">
        <h3>Dialog Heading</h3>
    </div>
    <div class="dialog__body">
        <p>Dialog Content</p>
    </div>
    <div class="dialog__footer">
        <button>Cancel</button>
        <button>Confirm</button>
    </div>
</dialog>
```

你会发现，你在浏览器中什么都没看到。这是因为，浏览器默认对 `<dialog>` 做了隐藏设置：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f91c5a4191214a4b9861074ed6c5ede3~tplv-k3u1fbpfcp-zoom-1.image)

这也是 `<dialog>` 元素与其他 HTML5 元素不同之处，`<dialog>` 元素具有内置的 API 和一些基本的 CSS 样式。根据设计，`<dialog>` 元素具有两个状态：**可见（打开）** 或**隐藏（关闭）** ，而且这两种状态都由 `<dialog>` 元素的 `open` 属性来控制。例如，在上面示例中的 `<dialog>` 元素上添加一个 `open` 属性之后，你在浏览器中就能看到对话框（`<dialog>`）中的内容：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c35bf599384f4c7ca2162de70a791c23~tplv-k3u1fbpfcp-zoom-1.image)

正如你所看见的，当 `<dialog>` 元素添加了 `open` 属性之后，浏览器会将该元素的 `display` 重置为 `block` ，即：

```CSS
/* dialog 打开状态 */
dialog[open] {
    display: block;
}

/* dialog 关闭状态 */
dialog:not(open) {
    display: none;
}
```

也就是说，`<dialog>` 的初始状态为隐藏（关闭）状态。但是，你可以使用 `open` 属性来强制打开 `<dialog>` 。另外，`<dialog>` 元素还提供了几个相关的 API 方法来控制其状态：

*   **`showModal()`** ： 使用 `showModal()` 方法给 `<dialog>` 元素添加 `open` 属性，以打开固定定位的对话框，阻止用户与页面中其他内容进行交互。它还添加了一个 `::backdrop` 伪元素来覆盖 `<dialog>` 元素之外的内容，形成覆盖效果
*   **`show()`** ： 类似于 `showModal()` 方法，使用它可以打开一个常规的绝对定位对话框，但不会添加背景。此方法对将对话框用作 Toast 通知很有用
*   **`close()`** ： 使用 `close()` 方法将会删除 `<dialog>` 元素的 `open` 属性，从而来关闭对话框。另外可以使用键盘上的 `Esc` 键直接关闭对话框，无需编写任何额外的代码

## 如何使用 dialog ?

我们来创建一个简单的确认对话框：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6c390d29a1c402bb33bc8bc1102d0c0~tplv-k3u1fbpfcp-zoom-1.image)

```HTML
<!-- 对话框容器(Dialog Container) -->
<dialog id="confirmation-dialog" class="dialog">
    <!-- 对话框标题(Dialog Title) -->
    <div class="dialog__heading">
        <h3 class="dialog__title">All location tracking?</h3>
    </div>
    <!-- 对话框内容(Dialog Content) -->
    <div class="dialog__content">
        <p>Location tracking helps us make better decisions so you can get more value. By enabling locaton tracking, you're allowing us to monitor your movement. <a href="">Learn More</a></p>
    </div>
    
    <!-- 对话框操作按钮(Dialog Actions) -->
    <div class="dialog__footer">
        <button class="button button--cancel" id="cancel-button">Cancel</button>
        <button class="button button--allow" id="allow-button">Allow</button>
    </div>
</dialog>
```

通常，你会通过 JavaScript 来打开一个对话框。例如，页面提供了一个打开对话框的按钮，并且在该按钮上绑定了一个点击事件（`click`），该点击事件只做一件事情，即使用 `showModal()` 方法打开 `<dialog>` 对话框（给 `<dialog>` 元素添加 `open` 属性）。

```HTML
<!-- 对话框容器(Dialog Container) -->
<dialog id="confirmation-dialog" class="dialog">
    <!-- 对话框标题(Dialog Title) -->
    <div class="dialog__heading">
        <h3 class="dialog__title">All location tracking?</h3>
    </div>
    <!-- 对话框内容(Dialog Content) -->
    <div class="dialog__content">
        <p>Location tracking helps us make better decisions so you can get more value. By enabling locaton tracking, you're allowing us to monitor your movement. <a href="">Learn More</a></p>
    </div>
    
    <!-- 对话框操作按钮(Dialog Actions) -->
    <div class="dialog__footer">
        <button class="button button--cancel" id="cancel-button">Cancel</button>
        <button class="button button--allow" id="allow-button">Allow</button>
    </div>
</dialog>

<!-- 打开对话框的按钮 -->
<button class="button button--primary" id="open-dialog">Open Dialog</button>
```

引入 JavaScript 脚本，使用 `<dialog>` 提供的 API 方法，控制对话框的打开与关闭：

```JavaScript
const openDialogButton = document.getElementById('open-dialog');
const confirmationDialog = document.getElementById('confirmation-dialog');
const cancelButton = document.getElementById('cancel-button');
const allowButton = document.getElementById('allow-button');

// 点击 “Open Dialog” 按钮，打开对话框 
openDialogButton.addEventListener('click', () => {
  confirmationDialog.showModal();
})

// 点击 “Cancel” 按钮，关闭对话框
cancelButton.addEventListener('click', () => {
  confirmationDialog.close('Cancel');
})

// 点击 “Allow” 按钮，关闭对话框
allowButton.addEventListener('click', () => {
  confirmationDialog.close('Allow');
})
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b07527da160649ec8e54ee780a41ed2b~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/jOeaxrR>

请注意，一旦打开对话框，它将获得一个 `open` 属性：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9523118d9e6248fc80b5d6f61cfaffb2~tplv-k3u1fbpfcp-zoom-1.image)

这对于样式设置可能很有用：

```CSS
dialog[open] {
    display: flex;
}
```

但是，不建议手动切换此属性以显示或隐藏对话框，因为浏览器可能会丢失对话框状态，而且无法对辅助功能进行正确的焦点调整。

## 模态框对话框和非模态框对话框

使用 HTML5 的 `<dialog>` 元素制作的对话框分为两种：**模态对话框**和**非模态对话框**。其主要区别是打开 `<dialog>` 所使用的方法不同。

### 模态对话框

正如上面示例所示，使用 `showModal()` 方法打开（创建）的对话框，被称为模态对话框。模态对话框是用户界面元素，它成为 DOM 上面的“顶层”，需要打断用户的操作流程以进行交互。它们具有固定（不可移动）的位置，并使用 `::backdrop` 创建一个半透明的覆盖层来覆盖除对话框之外的 Web 内容。

当模态对话框打开时（即使用 `showModal()` 方法给 `<dialog>` 元素设置了 `open` 属性），页面后面的内容应该呈现为不活动状态。也就是说，除对话框之外的 Web 内容应该移除交互、呈现静态的效果。这种不活动的行为在模态中创建了一个“焦点陷阱”，这意味着键盘用户可以进入模态，但不能将焦点移回到后面的页面，直到模态关闭。虽然 `inert` 属性正在获得浏览器支持，但使用 `<dialog>` 元素创建的模态对话框的好处是**自动的不活动行为**。

键盘用户对模态对话框的另一个期望是能够使用键盘的 `Esc` 键来关闭对话框，这是 `<dialog>` 元素在使用 `showModal()` 方法时提供的功能，你不需要额外编写任何 JavaScript 脚本代码。

### 非模态对话框

如果你使用的是 `show()` 方法来给 `<dialog>` 元素添加 `open` 属性，那么你创建的是一个非模态对话框。与模态对话框不同的是，当对话框打开时，用户仍然可以与页面内容（对话框之外的内容）进行交互。如果需要用户输入或交互，则不应该使用非模态对话框。比如电子邮件应用程序的“撰写”窗口、博客上的订阅提醒、查找或替换处理程序、入门教程指南或其他类型的子窗口界面。

需要注意的是，当使用 `show()` 方法创建一个非模态对话框时，对话框必须提供一个关闭操作（比如提供一个关闭按钮），并且非模态对话框需要用户交互才能关闭（用户使用键盘的 `Esc` 键是无法关闭对话框）。

我们通过下面这个示例来展示模态对话框与非模态对话框之间的差异：

```HTML
<dialog id="confirmation-dialog" class="dialog">
    <!-- 对话框标题(Dialog Title) -->
    <div class="dialog__heading">
        <h3 class="dialog__title">All location tracking?</h3>
    </div>
    
    <!-- 对话框内容(Dialog Content) -->
    <div class="dialog__content">
        <p>Location tracking helps us make better decisions so you can get more value. By enabling locaton tracking, you're allowing us to monitor your movement. <a href="">Learn More</a></p>
    </div>

    <!-- 对话框操作按钮(Dialog Actions) -->
    <div class="dialog__footer">
        <button class="button button--cancel" id="cancel-button">Cancel</button>
        <button class="button button--allow" id="allow-button">Allow</button>
    </div>
</dialog>

<div class="actions">
    <button class="button button--primary" id="open-modal" data-modal="true">Open Modal</button>
    <button class="button button--secondary" id="open-no-modal" data-modal="false">Open No-Modal</button>
</div>
```

```CSS
/* 关键 CSS */
dialog {
    max-inline-size: min(90vw, 60ch);
    max-block-size: min(80vh, 100%);
    max-block-size: min(80dvb, 100%);
    overflow: hidden;
    margin: auto;
    padding: 2rem;
    border: none;
    border-radius: .5em;
    box-shadow: 0 0 0.2em 0.25em rgb(0 0 0 /.125);
  
    flex-direction: column;
    gap: 2rem;
    font-size: 1rem;
    color: #7F7E85;
    font-weight: 300;
    line-height: 1.625;
}

/* 打开对话框 */
dialog[open] {
    display: flex;
}

/* 模态对话框 */
dialog::backdrop {
    backdrop-filter: blur(25px);
    transition: backdrop-filter .5s ease;
    background-color: rgb(0 0 0 / .5);
}

/* 非模态对话框 */
dialog[open]:not(:modal):before {
    content: "";
    position: fixed;
    height: 100vh;
    width: 100vw;
    inset: 0;
    background: hsl(100 0% 10% / 0.25);
    backdrop-filter: blur(10px);
    z-index: -1;
}
```

```javascript
const confirmationDialog = document.getElementById('confirmation-dialog');
const cancelButton = document.getElementById('cancel-button');
const allowButton = document.getElementById('allow-button');
const buttons = document.querySelectorAll(".actions .button");

buttons.forEach((button) => {
    button.addEventListener('click', (etv) => {
        let modalStyle;
        switch (button.getAttribute("data-modal")) {
            case "true":
                modalStyle = "showModal"; // 打开模态对话框
                break;
            case "false":
                modalStyle = "show";    // 打开非模态对话框
                break;
            default:
                modalStyle = "close";
        }
        confirmationDialog[modalStyle]();
    })
})

// 关闭对话框
cancelButton.addEventListener('click', () => {
  confirmationDialog.close('Cancel');
})

allowButton.addEventListener('click', () => {
  confirmationDialog.close('Allow');
})
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8933e2258a04e7ab97979007f8667e3~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/XWxzGRO>

## 对话框（dialog）内的表单

在 `<dialog>` 元素中可以内置一个 `method` 为 `dialog` 的表单元素（`<form>`）。它与传统的 `<form>` 有所不同，使用 `<form method="dialog">` 会导致表单提交关闭对话框并将 `returnValue` 属性设置为提交按钮的值。这可以使你避免编写自定义代码，同时为你的 Web 页面提供正确的语义。

这是因为，`<dialog>` 具有 `close` 事件，我们可以使用以下语法将事件处理程序附加到其中：

```JavaScript
dialogElement.addEventListener('close', function() {
    // 这里有附加的逻辑
});
```

每当对话框关闭时，它将触发此函数，你可以使用 `data.returnValue` 决定用户是单击“取消”按钮还是“允许”按钮。为此，你需要向这些按钮添加 `value` 属性，如下所示：

```HTML
<div class="dialog__footer">
    <button class="button button--cancel" id="cancel-button" value="Cancel">Cancel</button>
    <button class="button button--allow" id="allow-button" value="Allow">Allow</button>
</div>
```

在 `close` 事件监听器逻辑中，你可以执行一个简单的检查：

```JavaScript
dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'cancel') {
        // 做某些事
    } else if (dialog.returnValue === 'allow') {
        // 做某些事
    }
});
```

来看一个简单地示例：

```HTML
<!-- 对话框容器(Dialog Container) -->
<dialog id="confirmation-dialog" class="dialog">
    <!-- 使用一个带 method="dialog" 的 form 包裹整个对话框内容，这个很重要 -->
    <form method="dialog">
        <!-- 对话框标题(Dialog Title) -->
        <div class="dialog__heading">
            <h3 class="dialog__title">All location tracking?</h3>
        </div>
    
        <!-- 对话框内容(Dialog Content) -->
        <div class="dialog__content">
            <p>Location tracking helps us make better decisions so you can get more value. By enabling locaton tracking, you're allowing us to monitor your movement. <a href="">Learn More</a></p>
        </div>

        <!-- 对话框操作按钮(Dialog Actions) -->
        <div class="dialog__footer">
            <!-- 在 button 上设置 value 的值，这个很重要 -->
            <button class="button button--cancel" id="cancel-button" value="Cancel">Cancel</button>
            <button class="button button--allow" id="allow-button" value="Allow">Allow</button>
        </div>
    </form>
</dialog>

<button class="button button--primary" id="open-dialog">Open Dialog</button>
```

如此一来，你可以使用下面这段代码，来替代“取消”按钮和“允许”按钮绑定的 `click` 监听事件所对应的 JavaScript 代码：

```JavaScript
confirmationDialog.addEventListener("close", () => {
    console.log(confirmationDialog.returnValue);
});

// 等同于 

cancelButton.addEventListener('click', () => {
    confirmationDialog.close('Cancel');
})

allowButton.addEventListener('click', () => {
    confirmationDialog.close('Allow');
})
```

使用这种模式，JavaScript 代码要变得简单地多，而且能达到等同的效果：

```JavaScript
const openDialogButton = document.getElementById('open-dialog');
const confirmationDialog = document.getElementById('confirmation-dialog');

// 使用 showModal() 方法打开一个模态对话框
openDialogButton.addEventListener('click', () => {
    confirmationDialog.showModal();
})

// 使用 close() 方法关闭对话框
confirmationDialog.addEventListener("close", () => {
    console.log(confirmationDialog.returnValue);
});
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/268333f1ace443bab5bf46d01ff891bd~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/NWOwmbE>

请注意，如果用户按下键盘的 `Esc` 键，`returnValue` 将没有任何值。

## 美化对话框

默认情况下，浏览器都会给 `<dialog>` 元素制作的对话框提供一个基本样式，比如有黑色的边框、黑色的文本和白色的背景：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cec3a3e6c99437c9b7c59b59f3f09c0~tplv-k3u1fbpfcp-zoom-1.image)

前面我们介绍过，使用 `<dialog>` 的 `show()` 和 `showModal()` 两种方法打开的对话框分别被称为非模态对话框和模态对话框。同样的，浏览器对两者的默认样式也有所差异。拿 Chrome 浏览器为例：

```CSS
/* 模态对话框 */
dialog {
    display: none;
    position: absolute;
    inset-inline-start: 0px;
    inset-inline-end: 0px;
    width: fit-content;
    height: fit-content;
    background-color: canvas;
    color: canvastext;
    margin: auto;
    border-width: initial;
    border-style: solid;
    border-color: initial;
    border-image: initial;
    padding: 1em;
}

dialog[open] {
    display: block;
}

dialog:modal {
    position: fixed;
    inset-block-start: 0px;
    inset-block-end: 0px;
    max-width: calc((100% - 6px) - 2em);
    max-height: calc((100% - 6px) - 2em);
    user-select: text;
    visibility: visible;
    overflow: auto;
}

/* 非模态对话框 */
dialog {
    display: none;
    position: absolute;
    inset-inline-start: 0px;
    inset-inline-end: 0px;
    width: fit-content;
    height: fit-content;
    background-color: canvas;
    color: canvastext;
    margin: auto;
    border-width: initial;
    border-style: solid;
    border-color: initial;
    border-image: initial;
    padding: 1em;
}

dialog[open] {
    display: block;
}
```

正如你所看到的：

*   使用 `show()` 方法打开的 `<dialog>` （非模态对话框），它采用的是绝对定位（`position: absolute`）
*   使用 `showModal()` 方法打开的 `<dialog>` （模态对话框），它采用的是固定定位（`position: fixed`）

除此之外，模态对话框和非模态对话框之间除了定位方式不同之外，还有另一个不同之处，即**模态对话框会多有一个** **`:modal`** **伪类选择器**。CSS 的 `:modal` 伪类选择器主要用来匹配一种状态的元素，该状态下该元素将排除与其外部元素的所有交互，直到交互被解除为止。那么，使用 `showModal()` 打开的 `<dialog>` 元素就是这种模式的元素，`showModal()` 在其余内容之上打开具有背景的模态对话框，并且你无法与页面的其余部分交互。

也就是说，你可以使用 `:modal` 为模态对话框设置不同的样式，例如：

```CSS
/* 改变模态对话框的背景 */
dialog:modal {
    background-image: linear-gradient(
        136deg in oklab, 
        oklch(55% .45 350) 0%, oklch(100% .4 95) 100%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81784854cac542c98ba868b90416d747~tplv-k3u1fbpfcp-zoom-1.image)

同样的，你也可以将 `:not()` 伪类函数与 `:modal` 伪类选择器结合起来，给非模态对话框（`show()` 方法打开的 `<dialog>` 元素）设置不同的样式。例如：

```CSS
/* 改变非模态对话框的背景 */
dialog:not(:modal) {
    background-image: linear-gradient(
        320deg in oklab, 
        oklch(18% 0.44 222 / 64%) 0%, oklch(100% 0.31 195) 100%);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce6f09821cf64330800a660d77b42acc~tplv-k3u1fbpfcp-zoom-1.image)

注意，CSS 的 `:modal` 除了可以运用于 `showModal()` 方法打开的 `<dialog>` 元素之外，还可以运用于 `requestFullscreen()` 打开的元素，也就是 `:fullscreen` 伪类选中的元素。例如：

```HTML
<header>
    <h1>
        <span style="--index: 0;">:</span>
        <span style="--index: 1;">m</span>
        <span style="--index: 2;">o</span>
        <span style="--index: 3;">d</span>
        <span style="--index: 4;">a</span>
        <span style="--index: 5;">l</span>
    </h1>
</header>
<button>全屏播放</button>
```

与 `:modal` 有关的 CSS 代码：

```CSS
h1 span {
    background: linear-gradient(
        136deg in oklab,
        oklch(55% 0.45 350) 0%,
        oklch(100% 0.4 95) 100%
    );
    -webkit-background-clip: text;
    color: var(--color, var(--text-1));
    display: inline-block;
    transition: color 0.2s;
    animation: jump calc(var(--speed, 0) * 1s) calc(var(--index, 0) * 0.1s) infinite ease;
}

@keyframes jump {
    50% {
        transform: translateY(-50%);
    }
}

/* CSS :modal 匹配全屏模式下的 header 元素 */
header:modal {
    display: grid;
    place-items: center;
}

header:modal span {
    --speed: 0.75;
    --color: transparent;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65b1ccf7ea804f2381f1da047a7ca14c~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/LYgeRLx>

也就是说，CSS 的 `:modal` 伪类可以匹配到两种类型的元素

*   使用 `showModal()` 方法的 `<dialog>` 元素
*   使用 `requestFullscreen()` 方法打开的元素或处于全屏模式的元素，比如 `<video>` 元素

我们再次把话题重新回到 `<dialog>` 元素上。模态对话框和非模态对话框还有一个差异，打开模态对话框时，会自动生成一个伪元素 `::backdrop` ，用来设置对话框覆盖层（蒙层）的样式。而非模态框在打开时，不会创建这个伪元素：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a284a39838a44368d0643422cd47bd8~tplv-k3u1fbpfcp-zoom-1.image)

浏览器同样给 `::backdrop` 伪元素提供了一段默认样式：

```CSS
dialog::backdrop {
    position: fixed;
    inset: 0px;
    background: rgba(0, 0, 0, 0.1);
}
```

如此一来，你就可以使用 `::backdrop` 伪元素给模态对话框的蒙层定制样式：

```CSS
dialog::backdrop {
    backdrop-filter: blur(25px);
    transition: backdrop-filter .5s ease;
    background-color: rgb(0 0 0 / .5);
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5a2c0235895472c92bc88aa5da46d07~tplv-k3u1fbpfcp-zoom-1.image)

`::backdrop` 伪元素有点类似于 `::before` 和 `::after` 伪元素，你除了可以定制不同的样式规则之外，也可以给它设置动画效果。例如：

```CSS
dialog::backdrop {
    backdrop-filter: blur(25px);
    transition: backdrop-filter .5s ease;
    background-color: rgb(0 0 0 / .5);
  
    transition: all .2s ease-in-out;
    animation: fade-in 1s;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe5daf4db9f4442b87d0dd0e0a662b7a~tplv-k3u1fbpfcp-zoom-1.image)

如果你也希望给非模态对话框添加一个蒙层效果，那就需要添加额外的 HTML 标签元素或者使用伪元素 `::before` 或 `::after` ，个人更建议使用伪元素来制作非模态框的蒙层效果，它更轻便一些。你可以将其与 `:not` 和 `:modal` 结合使用来检测非模态对话框。

```CSS
dialog[open]:not(:modal)::after {
    content:"";
    position: fixed;
    inset: 0;
    backdrop-filter: blur(25px);
    transition: backdrop-filter .5s ease;
    background-color: rgb(0 0 0 / .5);
  
    transition: all .2s ease-in-out;
    animation: fade-in 1s;
    z-index: -1;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e4713cd2e5b40229695205d1813e6c6~tplv-k3u1fbpfcp-zoom-1.image)

> 注意，在使用伪元素创建一个假的 `::backdrop` 元素时，它在 `z` 轴的层级处理会相对麻烦一些，你需要对 [CSS 的 z-index](https://juejin.cn/book/7199571709102391328/section/7204402059225858052) 有一定的了解，否则较难达到你所预期的效果。

在制作模态对话框时，我们总是希望用户点击蒙层也可以关闭对话框。换句话说，我们希望用户在点击 `::backdrop` 伪元素时就可以关闭对话框。目前，我们可以通过向对话框（`<dialog>`）元素绑定一个 `click` 事件，并利用 `click` 事件的冒泡性质来关闭对话框。

```JavaScript
dialog.addEventListener("click", ({ target }) => {
    if(target.matches('dialog')) {
        dialog.close();
    }
});
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b24ad9ca29b54bee840a50e9fb760f1e~tplv-k3u1fbpfcp-zoom-1.image)

不幸的是，到目前为止，还没有较好的方式能给伪元素 `::before` 或 `::after` 添加 `click` 事件的监听器。也就是说，对于非模态对话框，你希望点击蒙层（使用伪元素 `::before` 或 `::after` 创建的一个假的 `::backdrop`）来关闭对话框是不太现实的。如果你希望点击非模态对话框的蒙层来关闭对话框，那就需要添加额外的一个 HTML 标签元素来替代 `::before` 或 `::after` 。

`::backdrop` 伪元素和 CSS 的 `:modal` 伪类选择器有点类似，它同样会出现在使用 `requestFullscreen()` 方法打开的元素或处于全屏模式的元素中。比如[前面那个示例](https://codepen.io/airen/full/LYgeRLx)，当你点击“全屏播放”按钮时，`header` 元素中会新增一个 `::backdrop` 伪元素：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1f2400818f0494e9223be8b921339bd~tplv-k3u1fbpfcp-zoom-1.image)

你同样可以基于 `header::backdrop` 来设置一个不一样的蒙层效果：

```CSS
header::backdrop {
    background-image: radial-gradient(
      farthest-corner circle at 100% 0% in oklab, 
      oklch(80% .4 222) 0%, oklch(35% .5 313) 100%
    ),linear-gradient(
      to bottom left in oklab, 
      oklch(55% .45 350) 0%, oklch(100% .4 95) 100%
    );
    background-blend-mode: difference, exclusion;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59db21bbda2f402abb2d91a1d7ef88c5~tplv-k3u1fbpfcp-zoom-1.image)

从上面这几个关于 `:modal` 和 `::backdrop` 相关的示例延伸出另外一种场景，要是你的业务经常和视频 `<video>` 打交道，那么你就可以使用 `:modal` 和 `::backdrop` 为视频全屏播放时，提供一些额外的样式。例如：

```HTML
<video controls src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/h264.mov" poster="https://source.unsplash.com/1600x900/?iran" width="100%">
</video>
```

```CSS
video:modal {
    border: 6px solid #09f;
    border-radius: 10px;
}

video::backdrop {
    background-image: radial-gradient(
      farthest-corner circle at 100% 0% in oklab, 
      oklch(80% .4 222) 0%, oklch(35% .5 313) 100%
    ),linear-gradient(
      to bottom left in oklab, 
      oklch(55% .45 350) 0%, oklch(100% .4 95) 100%
    );
    background-blend-mode: difference, exclusion;
    backdrop-filter: blur(25px);
    transition: backdrop-filter .5s ease;
    transition: all .2s ease-in-out;
    animation: fade-in 1s;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6948e11b471c4cb7bbef2e32fc9b7a88~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/mdzpRPe>

虽然说，我们这节课的标题是“用于美化模态框的 `:modal` 和 `::backdrop`”，但我想再次强调的是，**CSS 的** **`:modal`** **和** **`::backdrop`** **除了可以运用于** **`showModal()`** **方法打开的** **`<dialog>`** **之外，还可以运用于全屏元素（比如** **`<video>`）或者由** **`requestFullscreen()`** **方法打开的元素**。另外，CSS 的 `::backdrop` 和我们熟悉的 `::before` 或 `::after` 伪元素极其相似，你可以在 `::backdrop` 伪元素中声明任何属性，因此可以向 `::backdrop` 添加动画和转换，甚至可以在状态（如悬停）下更改样式：

```CSS
.element::backdrop {
    animation: move 5s infinite linear paused both;
    background: conic-gradient(red, orange, yellow, green, blue);
}

.element:hover::backdrop {
    animation-play-state: running;
}

@keyframes move {
    50% {
        transform: scale(0.9);
    }  
}
```

话又说回来，抛开全屏元素不说，就只聊 `<dialog>` 制作的对话框。CSS 的 `:modal` 和 `::backdrop` 也仅对模态对话框有效。即使是如此，我们要美化 `<dialog>` 还需要做很多额外的事情。

首先，我们需要根据布局方式，在 `<dialog>` 处于 `open` 的状态下，改变 `display` 属性的值。这是因为，默认情况下，对话框在显示隐藏状态下，`display` 属性的值是 `block` 切换到 `none` 。要是你想使用 [Flexbox](https://juejin.cn/book/7161370789680250917/section/7161621092560273439) 或 [Grid](https://juejin.cn/book/7161370789680250917/section/7161372229123440648) 为对话框布局的话，需要在 `open` 状态下，设置 `display` 的值为 `flex` 或 `grid` ：

```CSS
dialog[open] {
    display: flex;
}
```

当然，你也可以在此过程中为打开的状态的对话框设置更多的样式，例如：

```CSS
dialog[open] {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    border: none;
    border-radius: 6px;
    padding: 1rem;
    color: #fff;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9d096d52cd44a0292de5d37107d5e73~tplv-k3u1fbpfcp-zoom-1.image)

通过更改（拥有）`display` 属性值，正如上面的 CSS 代码片段所示，需要管理相当数量的样式以便促进正确的用户体验。首先，对话框的默认状态为关闭。你可以使用以下样式来在视觉上表示此状态，并防止对话框接收交互：

```CSS
dialog:not([open]) {
    pointer-events: none;
    opacity: 0;
}
```

一般情况之下，对话框（不管是模态对话框还是非模态对话框）都位于浏览器视窗的中心位置（即在浏览器视窗中水平垂直居中）。在 CSS 中实现水平垂直居中的方案有很多种，而对话框要么是绝对定位，要么是固定定位，因此让它水平垂直居中的最好方式是，设置`inset:0` ，并且 `margin` 为 `auto` ，即：

```CSS
dialog[open] {
    inset: 0;
    margin: auto;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80ce79113903422fa414f96655b388b6~tplv-k3u1fbpfcp-zoom-1.image)

现在，布局和位置都调整好了。接下来，你可以调整对话框的尺寸大小：

```CSS
dialog {
    max-inline-size: min(90vw, 70ch);
    max-block-size: min(80vh, 100%);
    max-block-size: min(80dvb, 100%);
    min-inline-size: 40vw;
    min-block-size: 20dvb;
    overflow: hidden;
}
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55f8bcb6845f44f2966e7129b1728683~tplv-k3u1fbpfcp-zoom-1.image)

制作模态对话框组件时，经常会碰到一个不好的体验。即当显示对话框时，用户仍然可以滚动其后面的页面，这是我不想要的：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/386d2d82723a4fa28b8eaa1ac467ef79~tplv-k3u1fbpfcp-zoom-1.image)

通常，`overscroll-behavior 是我的解决方案`，但是[根据规范](https://drafts.csswg.org/css-overscroll-1/#overscroll-behavior-properties)，它对对话框没有影响，因为它不是滚动容器。也就是说，并没有需要阻止的滚动条。我可以使用 JavaScript 监听此指南中的新事件，例如 “关闭” 和 “打开”，并在文档上切换 `overflow: hidden`，或者我可以用 CSS 的 `:has()` 选择器来处理：

```CSS
html:has(dialog[open]) {
    overflow: hidden;
}
```

或者根据 `:modal` 来做判断：

```CSS
html:has(:modal) {
    overflow: hidden;
}
```

它的意思是，当对话框打开时，`html` 元素将会设置 `overflow:hidden` 。即 `html` 无法滚动。

最后按正常的方式美化 `<dialog>` 元素中的内部元素的样式，你就完成了对话框样式的美化工作。最终关键代码如下：

```CSS
/* 对话框打开状态时，禁示页面可滚动 */
html:has(dialog[open]) {
    overflow: hidden;
}

/* 设置对话框尺寸 */
dialog {
    max-inline-size: min(90vw, 70ch);
    max-block-size: min(80vh, 100%);
    max-block-size: min(80dvb, 100%);
    min-inline-size: 40vw;
    min-block-size: 20dvb;
    overflow: hidden;
}

/* 设置对话框打开状态时样式 */
dialog[open] {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    border: none;
    border-radius: 6px;
    padding: 1rem;
    color: #fff;
  
    inset: 0;
    margin: auto;
}

/* 对话框关闭状态下样式 */
dialog:not([open]) {
  pointer-events: none;
  opacity: 0;
}

/* 改变模态对话框背景 */
dialog:modal {
    background-image: linear-gradient(
        136deg in oklab,
        oklch(55% 0.45 350) 0%,
        oklch(100% 0.4 95) 100%
    );
}

/* 设置模态对话框蒙板样式 */
dialog::backdrop {
    backdrop-filter: blur(25px);
    transition: backdrop-filter 0.5s ease;
    background-color: rgb(0 0 0 / 0.5);
    transition: all 0.2s ease-in-out;
    animation: fade-in 1s;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* 改变非模态对话框背景 */
dialog:not(:modal) {
    background-image: linear-gradient(
        320deg in oklab,
        oklch(18% 0.44 222 / 64%) 0%,
        oklch(100% 0.31 195) 100%
    );
}

/* 设置非模态对话框蒙板样式 */
dialog[open]:not(:modal)::after {
    content: "";
    position: fixed;
    inset: 0;
    backdrop-filter: blur(25px);
    transition: backdrop-filter 0.5s ease;
    background-color: rgb(0 0 0 / 0.5);

    transition: all 0.2s ease-in-out;
    animation: fade-in 1s;
    z-index: -1;
}
```

最终效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1c0033190144a8f8322f50dd6ec6261~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://codepen.io/airen/full/gOBoMJx>

上面所展示的只是最简单的一个对话框。如果你感兴趣的话，可以阅读 @Adam Argyle 的《[Building a dialog component](https://web.dev/building-a-dialog-component/)》一文。该教程会一步一步教你如何使用 `<dialog>` 来制作一个复杂的对话框：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bae1d7d579db4e289f6a99f84f62dadf~tplv-k3u1fbpfcp-zoom-1.image)

具体效果如下：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/884cd831b99e4a65878bfd03393b4b1e~tplv-k3u1fbpfcp-zoom-1.image)

> Demo 地址：<https://gui-challenges.web.app/dialog/dist/>

## 小结

CSS 的 `:modal` 是用于表示以模态形式打开的对话框的伪类选择器。模态对话框是一种阻止用户与页面上其他元素进行交互，直到对话框关闭的对话框形式。

而 CSS 的 `::backdrop` 是用于表示作为背景的半透明层的伪元素，当模态对话框打开时，该层覆盖在整个页面上，防止用户与页面上的其他元素交互，可以为 `::backdrop` 添加样式以修饰其外观和在对话框关闭时的行为。

使用它们，可以轻松地实现自定义且易于访问的模态对话框，而无需添加复杂的 JavaScript 代码，确保对用户友好的用户体验。
