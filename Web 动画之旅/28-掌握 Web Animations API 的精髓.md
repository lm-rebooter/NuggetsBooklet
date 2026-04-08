你可能对 [CSS 过渡（transition）和动画（animation）](https://juejin.cn/book/7288940354408022074/section/7292735608995184678)提供的功能感到满意，尤其是 [CSS 自定义属性 @property 的兴起](https://juejin.cn/book/7223230325122400288/section/7258870477462962236)，它给 CSS 动画带来了更多的想象空间；你也可能突然间需要所有可能的功能。[通过上一节课的学习](https://juejin.cn/book/7288940354408022074/section/7308623717105008652)，我们知道了 WAAPI 为处理动画提供了许多 JavaScript API，使得 Web 开发者创作动画变得更加灵活，因为可以以编程方式定义动画和控制动画。但这是有前提的，那就是你需要知道如何使用它们。在这节课中，你将了解处理复杂动画时需要掌握的主要要点和技术，同时保持灵活性。

  


## 从主要的 API 接口聊起

  


尽管 CSS 过渡（`transition`）和动画（`animation`）为定义动画效果提供了一种强大的方式，但它们都是通过触发相应的 CSS 属性变化来启动。也就是说，它们有一个单一的启动点。想象一下，你正在一个购物网站上浏览商品，当你将鼠标悬浮在商品图片上时，图片产生了一些微妙的动画效果，以吸引你的注意。这是一个典型的应用 CSS 动画的场景。

  


这个过程中，鼠标悬浮是 CSS 动画的单一启动点。只有在用户与页面交互时（鼠标悬浮），动画效果才会触发。换句话说，CSS 动画就好比是一个开关，要么打开，要么关闭。当然，你可以使用动画的[持续时间、延迟时间](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)和强大的[缓动函数](https://juejin.cn/book/7288940354408022074/section/7297493957557092404)（例如 `cubic-bezier()` 、`linear()` 和 `steps()` 等）以及动画编排等技巧来[创建相当复杂的动画效果](https://juejin.cn/book/7288940354408022074/section/7308623246604599307)。但在某种程度上，它的创作过程会变得很麻烦且难以处理。因为，你有更多的元素要处理，你需要一些能够保证精度的东西，否则易使元素“跑调”，从而使你创作出来的动画不够优雅和引人入胜。

  


相比而言，WAAPI 在这方面要强大很多，它将这个单一的启动点转变为对播放的完全控制。好比这个开关变成了一个带有滑块的调光开关。如果你愿意，你可以将其转变为整个智能家居系统，因为除了控制动画的播放之外，你还可以在动画运行时定义和更改动画效果。

  


这意味着，你现在可以根据上下文调整动画效果，甚至你可以实现一个具有实时预览动画的编辑器。WAAPI 之所以这么强大，主要是它提供了很多 [API 接口](https://www.w3.org/TR/web-animations-1/#programming-interface)：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/953a97aa96ef4a3485a914ceeefeaee9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1915&h=1437&s=1374567&e=jpg&b=ffffff)

  


> API：https://www.w3.org/TR/web-animations-1/#programming-interface

  


-   `Animation 接口`：用于表示一个动画，包含了动画的各种属性和控制方法。通过创建 `Animation` 实例，你可以定义动画各种属性、如持续时间、缓动函数等
-   `KeyframeEffect 接口`：用于定义动画的关键帧效果，包含了动画的起始状态、中间状态和结束状态
-   `AnimationEffect 接口`：代表动画的效果，可以是 CSS 样式、变换或其他类型的动画效果
-   `AnimationTimeline 接口`：用于获取和控制动画的时间轴。可以通过它来获取当前的时间、暂停和恢复动画等
-   `DocumentTimeline 接口`：提供文档级别的时间轴，可以用来获取全局的动画信息

  


这些接口共同提供了一套强大的工具，使 Web 开发者能够更灵活地创建和控制 Web 动画。通过使用 WAAPI，可以实现更复杂、流畅的动画效果，提升用户体验。

  


### Animation 接口

  


我们先从 `Animation` 接口开始。`Animation` 接口主要用于表示和控制动画。它提供了一系列方法和属性，允许 Web 开发者对动画进行播放、暂停、取消等操作，并获得动画的状态和属性。

  


#### 构造函数

  


`Animation` 接口有一个 `new Animation()` 构造函数：

  


```JavaScript
const animation = new Animation(effect, timeline);
```

  


-   `effect` ：可选参数，表示动画的效果，通常是 `KeyframeEffect` 对象，这个对象由 `new KeyframeEffect()` 创建
-   `timeline` ：可选参数，表示动画的时间轴

  


#### 属性和方法

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f83bd95ce28477592efd523f983141d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=6420&h=3004&s=872567&e=png&b=ffffff)

我们可以通过它的属性来获取动画相关信息或设置动画：

  


-   `animation.effect` ：获取或设置动画的效果
-   `animation.timeline` ：获取或设置动画的时间轴
-   `animation.startTime` ：获取或设置动画的开始时间
-   `animation.currentTime` ：获取或设置动画的当前时间
-   `animation.playbackRate` ：获取或设置动画的播放速率
-   `animation.playState` ：获取动画的播放状态
-   `animation.replaceState` ：用于获取动画的替换状态
-   `animation.pending` ：用来检查动画是否处于等待执行的状态
-   `animation.onfinish` ：事件处理程序，表示动画播放结束时要调用的函数
-   `animation.oncancel` ：事件处理程序，表示在动画被取消时要调用的函数
-   `animation.onremove` ：事件处理程序，表示在动画被移除时要调用的函数
-   `animation.ready` ：返回一个 Promise，可以让你等待更改项生效（即在播放或暂停等播放控制方法之间切换）
-   `animation.finish` ：返回一个 Promise，提供了一种在动画播放完毕后执行自定义 JavaScript 代码的方法

  


简单的解释一下它们。

  


在 WAAPI 中，`effect` 是 `Animation` 接口的一个属性，其类型为 `AnimationEffect`，可为空。

  


```JavaScript
const animation = new Animation(element, keyframes, options);

// 获取 effect 属性
const animationEffect = animation.effect;
```

  


`effect` 属性表示动画的关联效果。动画的效果通常由 `KeyframeEffect` 对象定义。通过访问 `effect` 属性，你可以获取或设置与动画关联的效果。

  


设置 `effect` 属性可以使用以下过程：

  


```JavaScript
const newEffect = new KeyframeEffect(newElement, newKeyframes, newOptions);

animation.effect = newEffect;
```

  


这将更新动画的关联效果，并使用新的 `KeyframeEffect` 对象来定义动画的效果。

  


需要注意的是，`effect` 属性是可为空的，这意味着你可以将其设置为 `null`。在某些情况下，当你想要取消动画的效果时，将 `effect` 设置为 `null` 可以清除之前定义的效果。

  


`timeline` 、`startTime` 和 `currentTime` 都是 `Animation` 接口的一个属性，主要与动画时间相关联。

  


其中 `timeline` 属性表示动画所关联的时间轴。时间轴用于管理动画的时序。通过访问 `timeline` 属性，你可以获取或设置动画的时间轴。

  


```JavaScript
// 获取动画的时间轴
const animationTimeline = animation.timeline;
```

  


设置新的时间轴：

  


```JavaScript
const newTimeline = new AnimationTimeline();

// 设置动画的时间轴
animation.timeline = newTimeline;
```

  


这个属性允许你在运行时获取和设置动画的时间轴，从而影响动画的整体时间控制。如果想要将动画与特定的时间轴关联，或者改变动画的时间轴，就可以使用这个属性。

  


`startTime` 属性表示动画的开始时间。它可以用来控制动画何时开始播放。通过访问 `startTime` 属性，你可以获取或设置动画的开始时间。

  


```JavaScript
// 获取动画开始时间
const startTime = animation.startTime;
```

  


设置新的开始时间：

  


```JavaScript
// 设置动画的开始时间
animation.startTime = 1000; // 设置开始时间为 1000 毫秒
```

  


动画的开始时间表示动画何时开始在时间轴上播放。如果 `startTime` 设置为 `null`，则动画会在当前时间（按时间轴的时间）立即开始。如果设置了具体的时间值，动画将在指定的时间开始播放。

  


这个属性对于控制动画的播放时机非常有用。你可以使用它来实现延迟播放、同步多个动画，或者在特定时刻启动动画。例如，如果你想要一个动画在页面加载后延迟 `1s` 开始播放，你可以这样设置：

  


```JavaScript
animation.startTime = 1000; // 设置延迟 1000 毫秒
```

  


需要注意的是，`startTime` 是相对于动画关联的时间轴（`animation.timeline`）的时间值。如果你更改了动画的时间轴，`startTime` 也会相应地受到影响。

  


  


`currentTime` 用于表示动画的当前时间。它允许你获取或设置动画当前所处的时间点。

  


```JavaScript
// 获取动画的当前时间
var currentTime = animation.currentTime;

// 设置新的当前时间
animation.currentTime = 500; // 设置当前时间为 500 毫秒
```

  


动画的当前时间表示动画在时间轴上的播放位置。通过读取 `currentTime` 属性，你可以获取动画当前所处的时间。通过设置 `currentTime` 属性，你可以调整动画的播放位置。

  


这个属性对于实现一些高级控制非常有用，例如通过设置 `currentTime` 可以将动画的播放位置调整到特定时间点，从而实现暂停和恢复效果：

  


```JavaScript
// 暂停动画
animation.currentTime = animation.currentTime;

// 恢复动画
animation.currentTime = 0;
animation.play();
```

  


你可以通过设置 `currentTime` 将动画的播放位置直接跳跃到特定的时间点：

  


```JavaScript
animation.currentTime = 1000; // 跳跃到 1000 毫秒的时间点
```

  


需要注意的是，`currentTime` 是相对于动画关联的时间轴（`animation.timeline`）的时间值。如果你更改了动画的时间轴，`currentTime` 也会相应地受到影响。

  


`playbackRate` 属性用于表示动画的播放速率，它允许你获取或设置动画的播放速率：

  


```JavaScript
// 获取动画的播放速率
const playbackRate = animation.playbackRate;

// 设置新的播放速率
animation.playbackRate = 2.0; // 设置播放速率为 2.0
```

  


动画的播放速率决定了动画在时间轴上前进的速度。默认情况下，`playbackRate` 的值为 `1.0`，表示正常速度播放。通过设置 `playbackRate`，你可以加速或减缓动画的播放速度。

  


例如，如果你将 `playbackRate` 设置为 `2.0`，动画将以正常速度的两倍快进。如果设置为 `0.5`，则动画将以正常速度的一半速度播放。

  


```JavaScript
animation.playbackRate = 2.0; // 加速动画

// 或
animation.playbackRate = 0.5; // 减缓动画
```

  


这个属性对于实现动画速度控制、慢动作效果或快进效果非常有用。需要注意的是，`playbackRate` 是一个倍数值，可以是正数、负数或零。负数表示反向播放（类似于 `animation.reverse()`）。

  


任何一个动画都会有不同的播放状态，这就好比你正在播放一个 DVD，它有开始、暂停、结束等状态。动画亦是。在 WAAPI 中，通常使用 `playState` 来表动画的播放状态。这个属性返回一个字符串，表示当前动画的状态。

  


-   `"idle"`: 动画未开始播放，或已经完成并返回到起始状态。
-   `"pending"`: 动画正在等待开始播放。
-   `"running"`: 动画正在播放中。
-   `"paused"`: 动画已被暂停。
-   `"finished"`: 动画已经完成播放。

  


我们可以通过下面这种方式来获取动画播放状态：

  


```JavaSript
const animation = new Animation(element, keyframes, options);

console.log(animation.playState); // 输出 "idle"

animation.play(); // 播放动画
console.log(animation.playState); // 输出 "running"
```

  


这个属性对于了解动画的当前状态非常有用，可以根据不同的状态执行相应的逻辑。可以使用这个属性来监测动画的状态，以便在适当的时机执行其他操作，比如在动画完成时触发一些回调函数。

  


`pending` 是 `Animation` 接口的一个只读属性，其类型为布尔值 (`boolean`)。它指示动画是否有待处理的播放任务或暂停任务。如果返回 `true`，则表示有一个等待执行的任务（可能是播放或暂停任务）；如果返回 `false`，则表示当前没有待处理的任务。

  


这个属性对于检查动画的当前状态，以确定是否有任务需要在启动新操作之前完成非常有用。

  


```JavaScript
if (!animation.pending) {// 执行新的动画任务
  animation.play();
}
```

  


需要注意的是，`animation.pending` 属性是只读的，仅用于指示动画的当前状态，而不能用于手动触发或取消任务。它主要用于查询动画的状态。

  


`ready` 是 `Animation` 接口的一个只读属性，其类型为 `Promise<Animation>`。该属性返回一个 Promise 对象，该对象表示当前动画对象的准备状态。在 WAAPI 中，动画对象的准备状态通常用于表示动画对象是否已经准备好执行动画。

  


你可以使用这个属性来执行一些异步操作，直到动画对象准备好执行动画。例如，你可以使用 `async/await` 或 `then` 方法等待动画准备好后执行相应的操作。

  


```JavaScript
async function executeAnimation() {
    await animation.ready;// 在这里执行动画相关的操作
    animation.play();
}

// 或者使用 then 方法
animation.ready.then(() => {
    // 在这里执行动画相关的操作
    animation.play();
});
```

  


需要注意的是，`animation.ready` 返回的 Promise 对象会在动画准备就绪时被解析。这是一个异步操作，可以帮助你在确保动画准备好执行时采取相应的步骤。

  


WAAPI 中的 `finished` 和 `ready` 类似，它也会返回一个 Promise 对象，表示当前动画对象的完成状态。在 WAAPI 中，完成状态通常表示动画对象已经执行完毕，达到了其最终状态。

  


你可以使用这个属性来执行一些异步操作，直到动画对象完成。例如：

  


```JavaScript
async function executeAfterAnimation() {
    await animation.finished;// 在这里执行动画完成后的操作
    console.log("Animation has finished!");
}

// 或者使用 then 方法
animation.finished.then(() => {
    // 在这里执行动画完成后的操作
    console.log("Animation has finished!");
});
```

  


除此之外，WAAPI 还有 `onfinish` 、`oncancel` 和 `onremove` 等事件处理程序（`EventHandler`），它们分别：

  


-   `onfinish` 指定动画完成时的事件处理程序，允许你指定一个函数，当动画完成时就会调用这个函数。
-   `oncancel` 指定动画取消时的事件处理程序，允许你指定一个函数，当动画被取消时就会调用这个函数。
-   `onremove` 指定动画被移除时的事件处理程序，允许你指定一个函数，当动画被移除时就会调用这个函数。

  


```JavaScript
// 指定动画完成时的事件处理程序
animation.onfinish = function(event) {
    // 在这里执行动画完成时的操作
    console.log("Animation has finished!");
};

animation.oncancel = function(event) {
    // 在这里执行动画取消时的操作
    console.log("Animation has been canceled!");
};

animation.onremove = function(event) {
    // 在这里执行动画被移除时的操作
    console.log("Animation has been removed!");
};

// 或者
animation.addEventListener('finish', etv => {
    // 在这里执行动画完成时的操作
    console.log("Animation has finished!");
})

animation.addEventListener('cancel', etv => {
    // 在这里执行动画取消时的操作
    console.log("Animation has canceled!");
})

animation.addEventListener('remove', etv => {
    // 在这里执行动画被移除时的操作
    console.log("Animation has removed!");
})
```

  


你还可以通过将 `onfinish` 、`oncancel` 和 `onremove` 设置为 `null` 来删除现有的事件处理程序。通过这种方式，你可以在动画完成时、被取消时或被移除时执行一些自定义的操作，例如处理界面元素的清理或执行其他逻辑。需要注意的是，

  


-   `onfinish` 事件处理程序仅在动画自然完成时触发，而不包括由于中途取消或替换而中断的情况
-   `oncancel` 事件处理程序仅在动画被取消时触发，而不包括动画自然完成的情况
-   `onremove` 事件处理程序仅在动画被显式移除时触发，而不包括动画自然完成或被取消的情况

  


WAAPI 的 `Animation` 还提供了一些方法，允许 Web 开发者通过这些方法来控制动画：

  


-   `animation.play()`: 启动或恢复动画的播放。
-   `animation.pause()`: 暂停动画的播放。
-   `animation.reverse()`: 反转动画的方向。
-   `animation.finish()`: 立即完成动画。
-   `animation.cancel()`: 取消动画。
-   `animation.updatePlaybackRate(playbackRate)`: 更新动画的播放速率。
-   `animation.commitStyles()` ：会根据底层样式更新元素的样式，以及元素上的所有动画（按合成顺序）
-   `animation.persist()` ：用于将动画标记为不可替换

  


这些方法好比我们儿时使用的录音机一样，可以控制动画的播放、暂停、取消等：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df808b0f505b431aae1a0b6411b90207~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=800&h=600&s=864281&e=png&b=836985)

  


在 WAAPI 中，调用 `play()` 方法会开始或恢复动画的播放：

  


```JavaScript
animation.play();
```

  


动画将按照其正常的播放进度逐帧更新，直到达到结束位置。如果动画是处于暂停状态，调用 `play()` 将使其继续播放；如果动画是已经结束的，调用 `play()` 将重新开始播放。

  


此方法通常在你希望开始或恢复动画播放时使用。需要注意的是，`play()` 方法将动画的自动倒带标志设置为 `true`，这意味着当动画达到结束位置后，将自动回到初始状态。如果不希望自动倒带，可以考虑使用 `currentTime` 属性手动控制动画的播放位置。

  


WAAPI 的 `pause()` 方法用于暂停动画的播放：

  


```JavaScript
animation.pause();
```

  


动画将停在当前位置，不再更新帧。如果在动画播放期间调用 `pause()`，动画将暂停在当前位置；如果动画已经结束，调用 `pause()` 将不产生任何效果。

  


此方法通常在你希望暂停动画播放时使用。需要注意的是，`pause()` 方法将动画暂停在当前位置，如果希望在暂停后重新开始动画，可以使用 `play()` 方法。如果需要将动画恢复到初始状态，可以使用 `cancel()` 方法。

  


WAAPI 的 `reverse()` 方法会反转动画的播放速率并播放：

  


```JavaScript
animation.reverse();
```

  


如果动画当前正在正向播放，则反转播放方向；如果动画当前正在反向播放，则反转为正向播放。

  


需要注意的是，反转播放会影响动画的当前状态。如果希望在动画完成后反转播放，可以在 `onfinish` 事件处理程序中调用 `reverse()` 方法。

  


```JavaScript
animation.onfinish = function() {
    // 在动画完成后反转播放
    animation.reverse();
};
```

  


此外，如果动画已经反向播放并且已经完成，再次调用 `reverse()` 将会重新开始播放正向方向。

  


在 WAAPI 中，`updatePlaybackRate(playbackRate)` 方法用于异步更新动画的播放速率。调用 `updatePlaybackRate()` 方法会异步更新动画的播放速率。传递的 `playbackRate` 参数将成为动画的新播放速率。这个过程是异步执行的，不会立即影响动画的当前状态。

  


```JavaScript
animation.updatePlaybackRate(2.0);
```

  


此方法通常在你希望在运行时动态更改动画播放速率时使用。

  


`cancel()` 方法用于取消动画，清除由该动画引起的所有效果，并通过运行取消动画的过程中止其播放：

  


```JavaScript
animation.cancel();
```

  


调用 `cancel()` 方法会立即中止动画的播放，并清除由该动画引起的所有效果。这包括将动画回退到初始状态。此方法是在动画播放期间或结束之前调用的，以中止其执行。如果你希望在动画播放完成后执行一些操作，可以使用 `onfinish` 事件处理程序，而不是直接调用 `cancel()` 方法。

  


需要注意的是，取消动画会触发 `oncancel` 事件处理程序，如果已经设置的话。这是一个通知你动画已被取消的机会，可以在事件处理程序中执行相应的操作。

  


在 WAAPI 中，调用 `finish()` 方法会将动画立即定位到关联效果的结束位置，即动画的最终状态。这相当于立即完成动画，不等待其正常播放结束。

  


```JavaScript
animation.finish();
```

  


这个方法通常在你希望立即将动画移动到最终状态时使用，而不必等待其正常播放完成。需要注意的是，调用 `finish()` 方法可能会触发 `onfinish` 事件处理程序，具体取决于动画的状态和设置。

  


调用 `persist()` 方法会将动画的替代状态设置为 `persisted` ：

  


```JavaScript
animation.persist();
```

  


替代状态是用来指示动画是否应该被保留在其替代容器中的状态。通过将替代状态设置为 `persisted`，可以确保动画不会在替代容器中被自动移除。

  


需要注意的是，通常情况下，动画会在完成或被取消后自动从替代容器中移除。通过调用 `persist()` 方法，你可以防止动画在这些情况下被自动移除，确保它一直存在于替代容器中。

  


调用 `commitStyles()` 方法会将动画效果的当前效果值写入其对应效果目标的内联样式中。这样做可以确保在动画执行过程中，目标元素的外观与动画效果保持同步。

  


```JavaScript
animation.commitStyles();
```

  


这个方法通常在你希望立即应用动画效果到目标元素的外观时使用。需要注意的是，`commitStyles()` 方法的效果是立即将当前的动画效果值应用到目标元素的内联样式中。这可能会导致动画在中途被取消时，元素保留动画结束时的状态，而不是回退到动画开始时的状态。如果需要确保元素回退到动画开始时的状态，应使用 `cancel()` 方法。

  


正如你所看到的，`Aimation` 接口提供的这些属性和方法，使得 Web 开发者可以更灵活控制和监控动画的行为。需要知道是，它（`Animation` 接口）只是用于管理动画的状态和行为。或者说，你可以把 `Animation` 接口想象是一台 DVD 播放机，它有一个插槽，用于放置光盘（`KeyframeEffect`）。在没有光盘的情况之下，你也就只能操作机器的物理键，播放、暂停、快进、倒带等操作：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8da7667b012a4801a4a8bf51c196afcc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1344&h=456&s=51331&e=png&b=ffffff)

  


也就是说，`Animation` 接口实例就是一台 DVD 播放器，它包含了定义的动画并提供了控制播放的方式。你只要给 DVD 插入光盘（`KeyframeEffect`），它就会给你控制权。你获得控制动画的方式与 DVD 机器控制光盘的方式相似，它们是播放 `play()` 、暂停 `pause()` 等方法，以及 `currentTime` 属性。有了这三个控制，你在播放方面可以构建任何东西。

  


换句话说，`Animation` 接口仅仅是让你拥有了一台先进且时髦的 DVD 播放器，在没有光盘的情况下，你只有操作物理按键玩，并无法听到想听的音乐。也就是说，你接下来需要光盘，即 WAAPI 中的 `KeyframeEffect` 接口，通过它来定义动画的关键帧效果。

  


### KeyframeEffect 接口

  


DVD 播放器（`Animation` ）需要的光盘（`KeyframeEffect`）自身就是一个包裹，它包含了要应用动画效果的元素、描述动画的关键状态和对应的样式以及动画的各种设置。换句话说，我们的光盘是一个保存所有视频（或音频）和视频（或音频）长度的信息。你可以回忆一下你印象中的 DVD 光盘。

  


现实世界中的 DVD 光盘是存储音视频数据的一个东西，它在 WAAPI 中对应的就是 `KeyframeEffect` 接口，它提供了一个 `new KeyframeEffect()` 构造函数，通过指定目标元素、关键帧和选项来创建一个关键帧动画效果：

  


```JavaScript
new KeyframeEffect(target, keyframes, options);
```

  


-   `target`：目标元素，即要应用动画效果的元素
-   `keyframes`：关键帧，描述动画的关键状态和对应的样式
-   `options`：选项，包含动画的各种设置，如持续时间、缓动函数等

  


其中 `target` 相当于 CSS 动画中的动画元素，例如 `.animated` ，`keyframes` 相当于 CSS 动画中的 `@keyframes` ，而 `options` 相当于 CSS 中的 `animation-*` 属性（除 `animation-name`）。假设你在 CSS 中给 `.animated` 元素应用了一个 `fadeIn` 动画：

  


```HTML
<div class="animated"></div>
```

  


```CSS
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animated {
    animation: fadeIn 1s ease-in both;
    
    /* 等同于 */
    animation-name: fadeIn;
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-timing-function: ease-in;
    animation-iteration-count: 1;
}
```

  


上面这个示例，我们在 WAAPI 中，则会像下面这样创建 `KeyframeEffect` ：

  


```HTML
<div class="animated"></div>
```

  


```JavaScript
const target = document.querySelector('.animated');

const keyframes = [
    {opacity: 0}, // 相当于 @keyframes 中的 from
    {opacity: 1}  // 相当于 @keyframes 中的 to
]

const options = {
    duration: 1000,     // 相当于 animation-duration: 1s;
    fill: 'both',       // 相当于 animation-fill-mode: both;
    easing: 'ease-in',  // 相当于 animation-timing-function: ease-in;
    iterations: 1       // 相当于 animation-iteration-count: 1;
}

// 创建 KeyframeEffect 对象
const animationEffect = new KeyframeEffect(target, keyframes, options)
```

  


上面的代码，我们使用 `new KeyframeEffect()` 构造函数创建了一个名为 `animationEffect` 的 `KeyframeEffect` 对象，将动画效果 `keyframes` 应用于 `target` 元素（`document.querySelector('.animated')` ，即类名为 `.animated` 的元素）。动画效果 `keyframes` 就是一个最简单的淡入动画效果，`opacity` 从 `0` 过渡到 `1` ，而选项 `options` 设置了动画的持续时间为 `1s` ，填充模式为 `both` ，缓动函数是 `ease-in` 和动画只播放 `1` 次。

  


到这里，你已经有了 DVD 播放机（`Animation`），也有了 DVD 光盘（`animationEffect`），但并不代表着你按下 DVD 播放机的播放按钮就能听到音乐或看到视频了。因为你还差一个步骤，只有当你把 DVD 光盘塞入 DVD 播放机的插槽中，并按下播放按键，DVD 光盘才会在播放机中运动起来，你才能听到音乐或看到视频。

  


先暂停一下，等聊完 `KeyframeEffet` 之后，我们再来接着聊如何将 DVD 光盘放入 DVD 播放器的插槽中。

  


不难发现，`new KeyframeEffect(target, keyframes, options)` 中的每个参数都不难理解，但我还是想把 `keyframes` 和 `options` 单独拎出来聊一下。

  


#### options 参数

  


首先说 `options` 参数吧，你可以在 `options` 中配置一个或多个参数：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e0befae2d2b4d1ab62be46c61b2c47d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=8192&h=7360&s=1256124&e=png&b=ffffff)

  


上图中标红的部分与 CSS 的 `animation-*` 属性所起作用是相同的，它们都是用来设置动画的运行参数。

  


-   `delay` ：设置动画的开始之前的延迟时间，以 `ms` 为单位，默认值为 `0` ，通常在 `options` 中不带参数，例如 `delay: 200` ，表示动画延迟 `200ms` 再开始播放。类似于 [CSS 的 animation-delay 属性](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)
-   `endDelay` ：动画结束后的延迟时间，以 `ms` 为单位，默认值为 `0`。这主要用于基于另一个动画的结束时间对动画进行排序
-   `duration` ：每次迭代动画完成所需的时间， 以 `ms` 为单位，默认值为 `0` 。虽然它是一个可选值，但需要知道，因为它的默认值是`0` ，如果不显式设置 `duration` 的值，那么动画将不会运行。类似于 [CSS 的 animation-duration 属性](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)
-   `direction` ：动画运行的方向，可设置的值有 `normal` （正常）、`reverse` （反向）、`alternate` （交替）或 `alternate-reverse` （反向交替），其中默认值为 `normal` 。注意，`direction` 的值类型是字符串，在 `options` 设置该值时，需要使用字符串，例如 `direction: 'reverse'` 。类似于 [CSS 的 animation-direction 属性](https://juejin.cn/book/7288940354408022074/section/7308548793962922025)
-   `easing` ：设置动画的缓动曲线，即动画随时间变化的速率，接受一个 `<easing-function>` ，也可以像 CSS 中的 `animation-timing-function` 属性一样，使用内置的一些值，例如 `linear` （默认值）、`ease` 、`ease-in` 、`ease-out` 、`ease-in-out` 、`step-end` 和 `step-start` 等，也可以应用`steps()` 、`cubic-bezier()` 或 `linear()` 函数定制的缓动曲线。它的值类型也是字符串，因此在使用的时候，要将其值设置为字符串，例如 `easing: 'ease'` 。需要注意的是，在 `easing` 中不能直接使用 JavaScript 定义的缓动曲线，稍后我们会介绍。类似于 [CSS 的 animation-timing-function 属性](https://juejin.cn/book/7288940354408022074/section/7297493957557092404)。
-   `fill` ：设置动画结束时的填充模式，可选的值有 `none` （默认值）、`backwards` 、`forwards` 和 `both` 。它的值也是字符串类型，使用时需要将值转换为字符串，例如 `fill: 'both'` 。类似于 [CSS 的 animation-fill-mode 属性](https://juejin.cn/book/7288940354408022074/section/7307284837554585638)
-   `iterations` ：动画循环播放的次数，默认值为 `1` ，你可以将其值设置为 `Infinity`，动画将会无限循环播放。类似于 CSS 的 `animation-iteration-count` 属性
-   `iterationStart` ：描述动画应该从迭代的哪一点开始。例如， `0.5` 表示从第一次迭代的中间开始，设置了这个值后，具有两次迭代的动画会在第三次迭代的中间结束。其默认值为 `0.0`
-   `composite` ：决定在这个动画和其他不指定自己特定合成操作的独立动画之间如何合并值。默认为 `replace` ，表示使用新值覆盖先前的值；`add` 指定一种附加效果，每个后续迭代都建立在上一次迭代的基础上，例如，在 `transform` 中， `translateX(-200px)` 不会覆盖早期的 `rotate(20deg)` 值，而会产生 `translateX(-200px) rotate(20deg)` ；`accumulate` 与 `add` 有点类似，但稍微聪明一些，例如， `filter` 的 `blure(2)` 和 `blur(5)` 会变成 `blur(7)` ，而不是 `blur(2) blur(5)` 。类似于 [CSS 的 animation-composite 属性](https://juejin.cn/book/7288940354408022074/section/7308623246604599307)
-   `iterationComposite` ：决定在这个动画的迭代之间如何构建值。可以设置为 `accumulate` 或 `replace`。默认为 `replace`
-   `pseudoElement` ：包含伪元素选择器的字符串，例如 `"::before"`。如果存在，则效果应用于目标的所选伪元素，而不是目标本身。

  


#### keyframes 参数

  


接着再来看 `new KeyframeEffect(target, keyframes, options)` 中的第二个部分 `keyframes` ，它其实和 [CSS 的 @keyframes ](https://juejin.cn/book/7288940354408022074/section/7295617447058407474)也是非常的相似，主要用来描述动画的关键状态和对应的样式。只不过它的定义方式可以是多样的，相比于 `@keyframes` 要复杂一些。

  


我们先从最简单的 `fadeIn` 动画开始。简单回忆一下，使用 CSS 的 `@keyframes` 定义 `fadeIn` 动画，它看起来会像下面这样：

  


```CSS
@keyframes fadeIn{
    from { /* from 选择器也可以换成 0% */
        opacity: 0;
    }
    to {  /* to 选择器也可以换成 100% */
        opacity: 1;
    }
}
```

  


在 WAAPI 中，我们可以像下面这样来定义 `fadeIn` 动画的关键帧：

  


```JavaScript
const fadeInKeyframes = [
    { opacity: 0 }, // 相当于 0% 或 from
    { opacity: 1 }  // 相当于 100% 或 to
]
```

  


上面的方式是将 `fadeIn` 的每一帧视为一个对象（`{}` ，相比 CSS 的 `@keyframes` 的每一帧，少了百分比选择器），然后把这些对象放到一个数组中。我们也可以以对象的形式来定义 `keyframes` ，例如：

  


```JavaScript
const fadeInKeyframes = {
    opacity: [0, 1] // 将每一帧中 opacity 属性的值放到一个数组中
}
```

  


上面示例中每一帧只有一个 `opacity` 属性，要是每一帧中有多个属性呢，例如 `rotateIn` 动画中的每一帧都有 `transform` 和 `opacity` 属性：

  


```CSS
@keyframes rotateIn {
    from {
        transform: rotate3d(0, 0, 1, -200deg);
        opacity: 0;
    }

    to {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}
```

  


在 WAAPI 中，可以像下面这样来定义 `rotateIn` 动画的关键帧：

  


```JavaScript
// 数组形式
const rotateInKeyframes = [
    {
        transform: 'rotate3d(0, 0, 1, -200deg)',
        opacity: 0
    },
    {
        transform: 'translate3d(0, 0, 0)',
        opacity: 1
    }
]

// 对象形式
const rotateInKeyframes = {
    transform: ['rotate3d(0, 0, 1, -200deg)', 'translate3d(0, 0, 0)'],
    opacity: [0, 1]
}
```

  


你可能已经发现了，上面示例中的关键帧应用的属性数量都是相等的，要么同时都只有一个，例如 `fadeIn` 动画；要么同时都有两个，例如 `rotateIn` 动画。但很多时候，关键帧中的每一帧并不会都以相同数量属性来定义，例如 `rollOut` 动画，最后一帧就比第一帧多了一个 `transform` 属性：

  


```CSS
@keyframes rollOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
        transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);
    }
}
```

  


在 WAAPI 中，我们可以像下面这样定义 `rollOut` 动画的关键帧：

  


```JavaScript
// 数组的形式
const rollOutKeyframes = [
    {
        opacity: 1
    },
    {
        opacity: 0,
        transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)'
    }
]

// 对象的形式
const rollOutKeyframes = {
    opacity: [1, 0],
    transform: ['translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)']
}
```

  


简单地说，不管是哪种方式，只需要关注每一帧有哪些属性及属性值，并不需要关心每一帧中的属性名和数量是否相同。

  


上面所展示的案例，它们都有着一个共同的特征，那就是关键帧都只有第一帧（`from` 或 `0%`）和最后一帧（`to` 或 `100%`）。稍微了解 CSS 关键帧的同学都知道，很多关键帧动画都不只有第一帧和最后一帧，会有很多百分比选择器设置的关键帧，例如下面这个 `shake` 动画：

  


```CSS
@keyframes shake {
    from,to {
        transform: translate3d(0, 0, 0);
    }

    10%,30%,50%,70%,90% {
        transform: translate3d(-10px, 0, 0);
    }

    20%,40%,60%,80% {
        transform: translate3d(10px, 0, 0);
    }
}
```

  


就上面这个关键帧来说，并不难发现，整个关键帧分为 `0%` （或 `from`）、`10%` 、`20%` 、`30%` 、`40%` 、`50%` 、`60%` 、`70%` 、`80%` 、`90%` 和 `100%` （或 `to`）等 `11` 帧。整个关键帧均分了动画单次迭代所需的持续时间。

  


另外，`shake` 关键帧还有一个特征：

  


-   关键帧的 `0%` 和 `100%` 应用了同一个样式规则 `transform: translate3d(0, 0, 0)`
-   关键帧的 `10%` 、`30%` 、`50%` 、`70%` 和 `90%` 应用了同一个样式规则 `transform: translate3d(-10px, 0, 0)`
-   关键帧的 `20%` 、`40%` 、`60%` 和 `80%` 应用了同一个样式规则 `transform: translate3d(10px, 0, 0)`

  


```CSS
@keyframes shake {
    from,to {
        transform: translate3d(0, 0, 0);
    }

    10%,30%,50%,70%,90% {
        transform: translate3d(-10px, 0, 0);
    }

    20%,40%,60%,80% {
        transform: translate3d(10px, 0, 0);
    }
}

/* 等同于 */
@keyframes shake {
    0% {
        transform: translate3d(0, 0, 0);
    }
    
    10% {
        transform: translate3d(-10px, 0, 0);
    }
    
    20% {
        transform: translate3d(10px, 0, 0);
    }
    
    30% {
        transform: translate3d(-10px, 0, 0);
    }
    
    40% {
        transform: translate3d(10px, 0, 0);
    }
    
    50% {
        transform: translate3d(-10px, 0, 0);
    }

    60% {
        transform: translate3d(10px, 0, 0);
    }
        
    70%{
        transform: translate3d(-10px, 0, 0);
    }
    
    80% {
        transform: translate3d(10px, 0, 0);
    }
    
    90% {
        transform: translate3d(-10px, 0, 0);
    }
    
    100% {
        transform: translate3d(0, 0, 0);
    }
}
```

  


就这个关键帧而言，在 WAAPI 中定义的话，不能像在 `@keyframes` 中那样，将应用相同样式规则的关键帧组合在一起（有点类似于 CSS 的组合选择器），要在对象或数组中列出动画所需的所有关键帧：

  


```JavaScript
// 数组形式
const shakeKeyframes = [
    { transform: 'translate3d(0, 0, 0)' },     // 相当于 0%
    { transform: 'translate3d(-10px, 0, 0)' }, // 相当于 10%
    { transform: 'translate3d(10px, 0, 0)' },  // 相当于 20%
    { transform: 'translate3d(-10px, 0, 0)' }, // 相当于 30%
    { transform: 'translate3d(10px, 0, 0)' },  // 相当于 40%
    { transform: 'translate3d(-10px, 0, 0)' }, // 相当于 50%
    { transform: 'translate3d(10px, 0, 0)' },  // 相当于 60%
    { transform: 'translate3d(-10px, 0, 0)' }, // 相当于 70%
    { transform: 'translate3d(10px, 0, 0)' },  // 相当于 80%
    { transform: 'translate3d(-10px, 0, 0)' }, // 相当于 90%
    { transform: 'translate3d(0, 0, 0)' }      // 相当于 100%
]

// 对象的形式
const shakeKeyframes = {
    transform: [
        'translate3d(0, 0, 0)',      // 相当于 0%
        'translate3d(-10px, 0, 0)',  // 相当于 10%
        'translate3d(10px, 0, 0)',   // 相当于 20%
        'translate3d(-10px, 0, 0)',  // 相当于 30%
        'translate3d(10px, 0, 0)',   // 相当于 40%
        'translate3d(-10px, 0, 0)',  // 相当于 50%
        'translate3d(10px, 0, 0)',   // 相当于 70%
        'translate3d(-10px, 0, 0)',  // 相当于 80%
        'translate3d(10px, 0, 0)',   // 相当于 90%
        'translate3d(0, 0, 0)'       // 相当于 100%
    ]
}
```

  


可以你会问，既然 CSS 的 `@keyframes` 都可以应用相同样式规则的关键帧组合在一起，那么 WAAPI 是不是也可以呢？

  


```CSS
@keyframes shake {
    from,to {
        transform: translate3d(0, 0, 0);
    }

    10%,30%,50%,70%,90% {
        transform: translate3d(-10px, 0, 0);
    }

    20%,40%,60%,80% {
        transform: translate3d(10px, 0, 0);
    }
}
```

  


你的疑惑是，上面的 `@keyframes` 是不是在 WAAPI 中可以像下面这样定义：

  


```JavaScript
// 数组形式
const shakeKeyframes = [
    { transform: 'translate3d(0, 0, 0)' },
    { transform: 'translate3d(-10px, 0, 0)' },
    { transform: 'translate3d(10px, 0, 0)' }
]

// 对象形式 
const shakeKeyframes = {
    transform: [
        'translate3d(0, 0, 0)',
        'translate3d(-10px, 0, 0)',
        'translate3d(10px, 0, 0)'
    ]
}
```

  


不用，这样定义将是两个完全不同的关键帧效果：

  


```JavaScript
const shakeKeyframes1 = [
    { transform: 'translate3d(0, 0, 0)' },     // 相当于 0%
    { transform: 'translate3d(-10px, 0, 0)' }, // 相当于 10%
    { transform: 'translate3d(10px, 0, 0)' },  // 相当于 20%
    { transform: 'translate3d(-10px, 0, 0)' }, // 相当于 30%
    { transform: 'translate3d(10px, 0, 0)' },  // 相当于 40%
    { transform: 'translate3d(-10px, 0, 0)' }, // 相当于 50%
    { transform: 'translate3d(10px, 0, 0)' },  // 相当于 60%
    { transform: 'translate3d(-10px, 0, 0)' }, // 相当于 70%
    { transform: 'translate3d(10px, 0, 0)' },  // 相当于 80%
    { transform: 'translate3d(-10px, 0, 0)' }, // 相当于 90%
    { transform: 'translate3d(0, 0, 0)' }      // 相当于 100%
]

const shakeKeyframes2 = [
    { transform: 'translate3d(0, 0, 0)' },
    { transform: 'translate3d(-10px, 0, 0)' },
    { transform: 'translate3d(10px, 0, 0)' }
]
```

  


上面代码中的 `shakeKeyframes1` 和 `shakeKeyframes2` 将是完全不同的两个关键帧效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d89795bc10be4b09a8356727f33d01db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1072&h=510&s=876635&e=gif&f=99&b=310630)

  


> Demo 地址：https://codepen.io/airen/full/QWovOmQ

  


这是因为，在 WAAPI 中如果没有给每个关键帧指定偏移值的话，将会均分动画单次迭代的持续时间。比如上面示例中的 `shakeKeyframes2`，它相当于只在动画单次迭代的持续时间的 `0%` 、`50%` 和 `100%` 位置处创建了关键帧：

  


```CSS
@keyframes shakeKeyframes2 {
    0% {
        transform: translate3d(0, 0, 0);
    }
    50% {
        transform: translate3d(-10px, 0, 0);
    }
    100% {
        transform: translate3d(10px, 0, 0);
    }
}
```

  


如果你需要给 WAAPI 中定义的关键帧指定偏移量的话，可以使用 `offset` 来指定：

  


```JavaScript
// 数组形式
const shakeKeyframes = [
    { 
        transform: 'translate3d(0, 0, 0)',
        offset: 0      // 相当于 0%
    },     
    { 
        transform: 'translate3d(-10px, 0, 0)',
        offset: 0.1    // 相当于 10%                       
    },
    { 
        transform: 'translate3d(10px, 0, 0)',
        offset: 0.2   // 相当于 20% 
    },  
    { 
        transform: 'translate3d(-10px, 0, 0)',
        offset: .3    // 相当于 30%
    }, 
    { 
        transform: 'translate3d(10px, 0, 0)', 
        offset: .4   // 相当于 40%
    },  
    { 
        transform: 'translate3d(-10px, 0, 0)',
        offset: .5   // 相当于 50%
    }, 
    { 
        transform: 'translate3d(10px, 0, 0)', 
        offset: .6   // 相当于 60%
    },  
    { 
        transform: 'translate3d(-10px, 0, 0)',
        offset: .7   // 相当于 70%
    }, 
    { 
        transform: 'translate3d(10px, 0, 0)', 
        offset: 0.8  // 相当于 80%
    },  
    { 
        transform: 'translate3d(-10px, 0, 0)', 
        offset: .9   // 相当于 90%
    }, 
    { 
        transform: 'translate3d(0, 0, 0)',
        offset: 1    // 相当于 100%
    }      
]

// 对象的形式
const shakeKeyframes = {
    transform: [
        'translate3d(0, 0, 0)',      // 相当于 0%
        'translate3d(-10px, 0, 0)',  // 相当于 10%
        'translate3d(10px, 0, 0)',   // 相当于 20%
        'translate3d(-10px, 0, 0)',  // 相当于 30%
        'translate3d(10px, 0, 0)',   // 相当于 40%
        'translate3d(-10px, 0, 0)',  // 相当于 50%
        'translate3d(10px, 0, 0)',   // 相当于 70%
        'translate3d(-10px, 0, 0)',  // 相当于 80%
        'translate3d(10px, 0, 0)',   // 相当于 90%
        'translate3d(0, 0, 0)'       // 相当于 100%
    ]，
    offset: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
}
```

  


正如你所看到的，我们可以指定 `offset` 的值为 `0.0 ~ 1.0` 之间的数字来表示关键帧的偏移量，其中 `0.0` 相当于 `@keyframes` 中的 `0%` 或 `from` ，`1.0` 相当于 `@keyframes` 中的 `100%` 或 `to` ，`.5` 相当于 `@keyframes` 的 `50%` 。 需要知道的是，如果指定的 `offset` 值不在 `0.0 ~ 1.0` 范围内，例如小于 `0` 或大于 `1` 的数值，那么程序会抛出 `TypeError` 。

  


你可能已经想到了，如果在 WAAPI 中想要构建一个不是均分动画单次迭代的持续时间的关键帧，那么 `offset` 就很重要了。例如，我们要在 WAAPI 中创建一个类似 `headShake` 的关键帧：

  


```CSS
@keyframes headShake {
    0% {
        transform: translateX(0);
    }

    6.5% {
        transform: translateX(-6px) rotateY(-9deg);
    }

    18.5% {
        transform: translateX(5px) rotateY(7deg);
    }

    31.5% {
        transform: translateX(-3px) rotateY(-5deg);
    }

    43.5% {
        transform: translateX(2px) rotateY(3deg);
    }

    50% {
        transform: translateX(0);
    }
}
```

  


我们可以在 WAAPI 中像下面这样定义 `headShake` 关键帧：

  


```JavaScript
// 数组方式
const headShakeKeyframes = [
    {
        transform: 'translateX(0)',
        offset: 0        // 0%
    },
    {
        transform: 'translateX(-6px) rotateY(-9deg)',
        offset: 0.065    // 6.5% 
    },
    {
        transform: 'translateX(5px) rotateY(7deg)',
        offset: 0.185    // 18.5% 
    },
    {
        transform: 'translateX(-3px) rotateY(-5deg)',
        offset: 0.315    // 31.5% 
    },
    {
        transform: 'translateX(2px) rotateY(3deg)',
        offset: 0.435    // 43.5% 
    },
    {
        transform: 'translateX(0)',
        offset: 0.5     // 50%
    }
]

// 对象形式
const headShakeKeyframes = {
    transform: [
        'translateX(0)',
        'translateX(-6px) rotateY(-9deg)',
        'translateX(5px) rotateY(7deg)',
        'translateX(-3px) rotateY(-5deg)',
        'translateX(2px) rotateY(3deg)',
        'translateX(0)'
    ],
    offset: [0, 0.065, 0.185, 0.315, 0.435, 0.5]
}
```

  


另外，在 WAAPI 中，定义动画关键帧时，不带 `offset` 的关键帧将会自动计算偏移。例如：

  


```JavaScript
const keyframes = [
    {
        color: 'blue'
    },
    {
        color: 'green',
        offset: 0.5
    },
    {
        color: 'red'
    },
    {
        color: 'yellow',
        offset: .8
    },
    {
        color: 'pink'
    }
]
```

  


上面代码定义的 `keyframes` 关键帧，第一个关键帧的 `offset` 为 `0` ，第三个关键帧位于第二个和第三个之间，它的 `offset` 会是 `0.5` 和 `0.8` 之间的中间值，即 `0.65` （`(0.8 - 0.5) ÷ 2 + 0.5 = 0.65`），最后一个关键帧的 `offset` 是 `1` 。所以上面的关键帧与下面这个关键效果是相同的：

  


```JavaScript
const keyframes = [
    {
        color: 'blue',
        offset: null
    },
    {
        color: 'green',
        offset: 0.5
    },
    {
        color: 'red',
        offset: null
    },
    {
        color: 'yellow',
        offset: .8
    },
    {
        color: 'pink',
        offset: null
    }
]
```

  


将 `offset` 的值设置为 `null` ，表示关键帧应在相邻关键帧之间自动间隔。注意，最后一个关键帧的 `offset` 在不指定值的时候会被视为 `null` 。

  


还有一点与 `@keyframes` 不同的是，WAAPI 中定义关键帧时，必须按照偏移 `offset` 递增的方式来定义，例如下面这个 `flash` 关键帧，`from` ，`50%` 和 `to` 三个关键帧都应用了 `opacity: 1` ，而 `25%` 和 `75%` 两个关键帧都应用了 `opacity: 0` ：

  


```CSS
@keyframes flash {
    from,
    50%,
    to {
        opacity: 1;
    }

    25%,
    75% {
        opacity: 0;
    }
}
```

  


在 WAAPI 中，我们是无法将相同样式规则的选择器以组的方式来设置，只能按照 `offset` 的递增来定义：

  


```JavaScript
const flashKeyframes = [
    {
        opacity: 1,
        offset: 0
    },
    {
        opacity: 0,
        offset: .25
    },
    {
        opacity: 1,
        offset: .5
    },
    {
        opacity: 0,
        offset: .75
    },
    {
        opacity: 1,
        offset: 1
    }
]
```

  


但是，允许相邻且相等的 `offset` 。

  


同样的，你也可以在定义关键帧的时候，在每一个关键帧指定缓动函数，例如 `bounce` 关键帧：

  


```CSS
@keyframes bounce {
    from,
    20%,
    53%,
    to {
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        transform: translate3d(0, 0, 0);
    }

    40%,
    43% {
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        transform: translate3d(0, -30px, 0) scaleY(1.1);
    }

    70% {
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        transform: translate3d(0, -15px, 0) scaleY(1.05);
    }

    80% {
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        transform: translate3d(0, 0, 0) scaleY(0.95);
    }

    90% {
        transform: translate3d(0, -4px, 0) scaleY(1.02);
    }
}
```

  


在 WAAPI 中，我们可以像下面这样来定义 `bounce` 关键帧：

  


```JavaScript
// 数组的形式
const bounceKeyframes = [
    {
        transform: 'translate3d(0, 0, 0)',
        offset: 0,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    {
        transform: 'translate3d(0, 0, 0)',
        offset: 0.2,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    {
        transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
        offset: 0.4,
        easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)'
    },
    {
        transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
        offset: 0.43,
        easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)'
    },
    {
        transform: 'translate3d(0, 0, 0)',
        offset: 0.53,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    {
        transform: 'translate3d(0, -15px, 0) scaleY(1.05)',
        offset: 0.7,
        easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)'
    },
    {
        transform: 'translate3d(0, 0, 0) scaleY(0.95)',
        offset: 0.8,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    },
    {
        transform: 'translate3d(0, -4px, 0) scaleY(1.02)',
        offset: 0.9
    },
    {
        transform: 'translate3d(0, 0, 0)',
        offset: 1,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    }
]

// 对象形式
const bounceKeyframes = {
    transform: [
        'translate3d(0, 0, 0)',
        'translate3d(0, 0, 0)',
        'translate3d(0, -30px, 0) scaleY(1.1)',
        'translate3d(0, -30px, 0) scaleY(1.1)',
        'translate3d(0, 0, 0)',
        'translate3d(0, -15px, 0) scaleY(1.05)',
        'translate3d(0, 0, 0) scaleY(0.95)',
        'translate3d(0, -4px, 0) scaleY(1.02)',
        'translate3d(0, 0, 0)'
    ],
    offset: [0, 0.2, 0.4, 0.43, 0.53, 0.7, 0.8, 0.9, 1],
    easing: [
        'cubic-bezier(0.215, 0.61, 0.355, 1)',
        'cubic-bezier(0.215, 0.61, 0.355, 1)',
        'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
        'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
        'cubic-bezier(0.215, 0.61, 0.355, 1)',
        'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
        'cubic-bezier(0.215, 0.61, 0.355, 1)',
        'cubic-bezier(0.215, 0.61, 0.355, 1)'
    ]
}
```

  


数组形式允许为每个关键帧指定不同的值，而对于对象形式，将重复值列表直到为每个关键帧分配一个值为止。重复行为使得将相同的值分配给所有关键帧变得简单：

  


```JavaScript
const color = {
    color: ['blue', 'green', 'red', 'yellow', 'pink'],
    offset: [null, 0.5, null, .8],
    easing: 'ease-in-out'
}
```

  


上面代码中的 `ease-in-out` 会在每个颜色值之间应用。有一点需要注意，它和 `options` 中的 `easing` 所表达的效果将是完全不同的。例如下面这个示例，所产生的效果完全不同：

  


```JavaScript
// 在这里，'ease-in-out' 在每个颜色值之间应用。
elem.animate({ 
    color: [ 'blue', 'green', 'yellow' ],
    easing: 'ease-in-out'   // keyframe 中的 easing
}, 2000);

// 但是，在这种情况下，'ease-in-out' 从动画的整个跨度应用，即从 'blue' 到 'yellow'。
elem.animate({ 
    color: [ 'blue', 'green', 'yellow' ] 
},{ 
    duration: 2000, 
    easing: 'ease-in-out'  // options 中的 easing
});
```

  


在定义关键帧时，除了能在关键帧中应用 `offset` 、`easing` 之外，还可以应用 `composite` ，它是 `CompositeOperation` 类型的，用于定义该关键帧效果与效果堆栈合成的合成操作。`CompositeOperation` 是一个枚举，表示关键帧效果的合成行为。具体而言，`composite` 属性有三个可能的枚举值：

  


-   `replace`：对应于 `replace` 合成操作值，使动画效果覆盖它所组合的底层值
-   `add`: 对应于 `add` 合成操作值，使动画效果与其组合的底层值相加
-   `accumulate`: 对应于 `accumulate` 合成操作值，使动画效果在底层值上累积

  


这些值决定了在关键帧效果与底层值合成时采用的合成策略。使用 `composite` 属性，你可以控制关键帧效果如何与其他效果进行组合，从而影响动画的最终表现。

  


需要知道的是，上面创建的 `keyframes` 除了可作 `KeyframeEffect(target, keyframes, options)` 构造函数的参数之外。还可以用于：

  


-   `KeyframeEffect` 接口上的 `setKeyframes()` 方法：用于设置关键帧的方法，通过该方法可以替换构造函数中设置的关键帧。
-   `Animatable` 接口混合的 `animate()` 方法：用于启动动画的方法，接受关键帧作为参数，并返回一个 `Animation` 对象，该对象可以用于控制和操作动画

  


#### 创建 KeyframeEffect 对象

  


我们知道在 WAAPI 中可以通过 `new KeyframeEffect(target, keyframes, options)` 构造函数来创建 `KeyframeEffect` 对象。不过，大家需要知道的是，`new KeyframeEffect()` 构造函数中的 `keyframes` 并不是只能用关键帧。换句话说，`new KeyframeEffect()` 构造函数中的 `keyframes` 参数可以是下面这三种的任何一种：

  


-   `keyframes` 是单个属性
-   `keyframes` 是多个属性
-   `keyframes` 是一个关键帧

  


先来看第一种方式，这是 `new KeyframeEffect()` 构造函数创建 `KeyframeEffect` 对象最简单的一种。可以通过以下方式构造一个将 `aniEle` 元素的 `translate` 属性在 `3s` 内更改变 `0 -100px` 的 `KeyframeEffect` 对象：

  


```JavaScript
const effect = new KeyframeEffect(
    aniEle,                    // target
    {translate: '0 -100px'},   // keyframes
    3000                       // options
)
```

  


当然，你也可以在第二个参数中同时指定多个属性：

  


```JavaScript
const effect = new KeyframeEffect(
    aniEle,                     // target
    {                           // keyframes
        translate: '0 -100px',
        scale: .5
    },                       
    3000                        // options
)
```

  


第三种，就是第二个参数可以是一个关键帧，前面你所看到的案例都是这种方式：

  


```JavaScript
const keyframes = [
    { 
        translate: "0 -100px" 
    },
    { 
        scale: 0.5, 
        translate: "0 100px" 
    }
]

const effect = new KeyframeEffect(aniEle, keyframes, 3000)
```

  


正如前面所述，使用 `new KeyframeEffect()` 构造函数创建 `KeyframeEffect` 对象时，第三个 `options` 可以是简单地表示动画迭代持续时间的毫秒数的数字，例如上面示例中的 `3000` ，表示动画持续时间 `duration` 为 `3s` ，也可以使用 `EffectTiming` 对象指定动画更详细的参数，也就是前面所说的 `options` 。例如：

  


```JavaScript
const options = {
    duration: 2000,
    fill: "both",
    easing: "ease-in-out"
};

const keyframes = [
    { 
        translate: "0 -100px", 
        scale: 1.2, 
        opacity: 0.3 
    },
    { 
        scale: 0.5, 
        translate: "0 100px", 
        opacity: 1 
    }
];

const effect = new KeyframeEffect(aniEle, keyframes, options);
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ed8f63d20e045ebb446631c58381fc7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1204&h=518&s=1083392&e=gif&f=282&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/LYaLPPz

  


注意，你也可以在创建 `KeyframeEffect` 对象时，不显式指定动画的持续时间，也可以不指定任何参数：

  


```JavaScript
const effect = new KeyframeEffect(
    aniEle2,
    { translate: "0 -100px", scale: 0.5 }
);
```

  


这个时候动画的持续时间会被视为 `0` ，不会有任何动画效果。它相当于创建了一个仅设置属性而不进行任何插值的动画。

  


### 使动画动起来

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7be4f31812a84d61b02516ef2be91b50~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1142&h=524&s=7304537&e=gif&f=343&b=fbf7f6)

  


可以说，你现在万事具备：

  


-   使用 `new KeyframeEffect(target, keyframes, options)` 构造函数创建了一个 `KeyframeEffect` 对象，你有了 DVD 光盘
-   使用 `new Animation(effect, timeline)` 构造函数创建了一个 `Animation` 对象，你有了 DVD 播放器

  


回忆一下儿时播放 DVD 的过程：

  


-   ①：获取 DVD 光盘，即使用 `new KeyframeEffect(target, keyframes, options)` 创建一个 `KeyframeEffect` 对象
-   ②：将 DVD 光盘放到 DVD 播放器，即使用 `new Animaiton(effect, timeline)` 创建一个 `Animation` 对象
-   ③：当你按下 DVD 播放器的开始键（`animation.play()`）时， DVD 开始播放；在播放过程中，你要是按下 DVD 播放器的暂停键（`animation.pause()`）时，DVD 暂停播放；同样的，在播放过程中，你要是按下 DVD 的取消键（`animation.cancel()`）时、DVD 取消播放

  


就是这么简单，你的动画就动起来了。当然你也可以根据需要来控制动画。

  


我们通过一个简单的示例，用代码来描述整个过程。首先，你有一个动画元素：

  


```HTML
<svg id="logo"></svg>
```

  


然后，使用 `new KeyframeEffect(target, keyframes, options)` 构造函数创建一个动画效果 `effect` ，这个 `effect` 是一个 `KyeframeEffect` 对象，也就是我们所说的 DVD 光盘：

  


```JavaScript
// target
const aniEle = document.querySelector('#logo');

// keyframes
const wobble = [
    {
        transform: 'translate3d(0, 0, 0)',
        offset: 0
    },
    {
        transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)',
        offset: 0.15
    },
    {
        transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)',
        offset: 0.3
    },
    {
        transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)',
        offset: 0.45
    },
    {
        transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)',
        offset: 0.6
    },
    {
        transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)',
        offset: 0.75
    },
    {
        transform: 'translate3d(0, 0, 0)',
        offset: 1
    }
]

// options
const options = {
    duration: 10000,
    easing: 'ease'
}

// create KeyframeEffect => create DVD disc
const effect = new KeyframeEffect(aniEle, wobble, options);
```

  


创建完 DVD 光盘 `effect` ，你需要再使用 `new Animation(effect, timeline)` 构造函数创建 DVD 播放器 `animation`，并且将 DVD 光盘 `effect` 插入 DVD 播放器中：

  


```JavaScript
// Get Document Timeline
const timeline = document.timeline || new Animation();

// Create Animation Object => Create DVD Player
const animation = new Animation(effect, timeline);
```

  


通过前面两步，你已经把 DVD 光盘放入了 DVD 光盘的插槽中，接下来，你可以通过操作 DVD 播放器的按键来控制动画：

  


-   按下播放键（`play()`）开始播放动画
-   按下暂停键（`pause()`）暂停动画播放
-   按下取消键（`cancel()`）取消动画播放
-   按下“反向”键（`reverse()`），动画反向播放（DVD 播放器只有倒带功能）
-   按下快进键（`playbackRate()`），动画会按指定的速率播放（DVD 播放器有快进功能）

  


在代码中，我们分别以不同的按钮来表示 DVD 播放器的按键：

  


```HTML
<div class="btn" id="play"><!-- 播放按键 --></div>
<div class="btn" id="pause"><!-- 暂停按键 --></div>
<div class="btn" id="cancel"><!-- 取消按键 --></div>
<div class="btn" id="reverse"><!-- “反向”按键 --></div>
<div class="btn" id="rate"><!-- 快进按键 --></div>
```

  


在 JavaScript 中分别监听这些按钮的 `click` 事件，并且通过 `Animation` 还提供了方法来控制动画：

  


-   `animation.play()`: 启动或恢复动画的播放，对应播放按键（`#play`）
-   `animation.pause()`: 暂停动画的播放，对应暂停按键（`#pause`）
-   `animation.cancel()`: 取消动画，对应取消按键（`#cancel`）
-   `animation.reverse()`: 反转动画的方向，对应“反向”按键（`#reverse`）
-   `animation.updatePlaybackRate(playbackRate)`: 更新动画的播放速率，对应“快进”按键（`#rate`）

  


```JavaScript
const playHandler = document.getElementById('play');       // 播放按键
const pauseHandler = document.getElementById('pause');     // 暂停按键
const cancelHandler = document.getElementById('cancel');   // 取消按键
const reverseHandler = document.getElementById('reverse'); // “反向”按键
const rateHandler = document.getElementById('rate');       // “快进”按键

// 播放动画
playHandler.addEventListener('click', () => {
    animation.play();
});

// 动画暂停播放
pauseHandler.addEventListener('click', () => {
    animation.pause();
});

// 取消动画播放
cancelHandler.addEventListener('click', () => {
    animation.cancel();
});

// 动画反向播放
reverseHandler.addEventListener('click', () => {
    animation.reverse();
});

// 动画以 3 倍的速率播放
rateHandler.addEventListener('click', () => {
    animation.updatePlaybackRate(3);
    animation.ready.then(() => {
        console.log(`Playback rate set to ${animation.playbackRate}`);
        animation.play()
    });
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37a4c17467ac40c4977412e25f5c0a5a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1258&h=762&s=1728376&e=gif&f=144&b=6c6c6c)

  


> Demo 地址：https://codepen.io/airen/full/Rwdgbxv

  


你也可以通过 `Animation` 的混合接口 `Element.animate() 方法来获取动画对象`：

  


```JavaScript
Element.animate(keyframes, options)
```

  


使用 `Element.animate()` 方法时，你只要给它提供了 `keyframes` 和 `options` ，它会立即播放你的动画。换句话说，当你通过 `Element.animate(keyframes, options)` 创建一个动画时，相当于你使用的是一个执行三个操作的快捷方式：

  


-   它创建了一个 `KeyframeEffect` 实例（步骤 ①，获取 DVD 光盘），等同于使用 `new KeyframeEffect(target, keyframes, options)` 创建了一个 `KeyframeEffect`
-   它将创建好的 `KeyframeEffect` 放入一个新的 `Animation` 实例中（步骤 ②，将 DVD 光盘放入了 DVD 播放器中），等同于使用 `new Animation(effect, timeline)` 创建了一个 `Animation`
-   它会立即开始播放动画（步骤 ③，播放动画），等同于 `animation.play()`

  


```JavaScript
const animEle = document.querySelector('.animated');

const keyframes = [
    {
        opacity: 0
    },
    {
        opacity: 1
    }
]

const options = {
    duration: 1000,
    fill: 'both',
    easing: 'ease-in'
}


// Element.animate() 创建动画
animEle.animate(keyframes, options);
```

  


上面的代码等同于：

  


```JavaScript
const animEle = document.querySelector('.animated');

const keyframes = [
    {
        opacity: 0
    },
    {
        opacity: 1
    }
]

const options = {
    duration: 1000,
    fill: 'both',
    easing: 'ease-in'
}

// 步骤 ①，获取 DVD 光盘
const effect = new KeyframeEffect(animEle, keyframes, options);

// 步骤 ②，将 DVD 光盘放入了 DVD 播放器中
const animation = new Animation(effect, document.timeline);

// 步骤 ③，按播放键播放动画
animation.play()
```

  


了解它在幕后是如何工作的关键在于能够区分关键帧的定义并决定何时播放它。当你有很多动画需要协调时，首先收集它们可能会有所帮助，这样你就知道它们已经准备好播放了。在运行时生成它们并希望它们在正确的时刻开始播放并不是一个明智的选择。通过几帧拖动，很容易破坏期望的效果。在长序列的情况下，拖拽累积会导致完全不令人信服的体验。

  


### 控制时间

  


[WAAPI 引入了时间轴的概念](https://www.w3.org/TR/web-animations-1/#timelines)。默认情况下，所有的动画都与[文档的时间轴](https://www.w3.org/TR/web-animations-1/#document-timelines)（`document.timeline`）相关联。这意味着动画共享相同的“内部时钟”，即一个从页面加载开始的时钟。这个共享的时钟是我们能够协调动画的原因。无论是某种节奏还是模式，你都不需要担心某些事情会拖慢或超前于自己。

  


Web 开发者在创建动画的时候，为了使效果生效，或者为了使效果达到某种感觉，我们需要有能够微调属性变化的方式。例如，控制动画时间的方式。要是说时间就是动画的生命线，这一点都不为。因此，我们有必要了解和掌握在 WAAPI 中是如何控制动画时间的。

  


在 WAAPI 中，有两个级别的时间可以控制。首先，在定义关键帧时，可以使用 `offset` 对单个帧时间进行控制。通过给它一个从 `0` 到 `1` 的值，你可以定义每个效果何时开始。当省略时，默认值为 `0` 。前面在介绍 `offset` 也说过，它相当于 CSS `@keyframes` 中的百分比选择器，只不过 WAAPI 中的 `offset` 是一个除以 `100` 的值。不管是 `@keyframes` 中的百分比选择器还是 WAAPI 中 `offset` 值，都是动画单次迭代的持续时间的一部分。简单地说，它们都是相对于动画单次迭代的持续时间计算。

  


在 WAAPI 中，`offset` 允许 Web 开发者在 `KeyfrmeEffect` 中排列关键帧。作为一个相对数值，`offset` 确保无论播放速度如何，所有的关键帧都相对于彼此在同一时刻开始。

  


虽然 `offset` 可以帮助我们控制关键帧中每一帧在动画单次迭代的持续时间上的偏移量，但大家要有一个更明确的概念，偏移 `offset` 只是动画持续时间的一部分，而动画持续时间与动画的总体持续时间不是同一回事。如果我说，通常情况下，动画的持续时间与动画的总体时间是相同的，这可能会让你感到困惑。是的，这同样也让我感到困惑。

  


简单的来解释一下，让你不再感到困惑。我们常说的动画持续时间主要指的是动画一次迭代完成所需的时间，即动画播放完一次的用时。默认情况下（或者说，大多数情况下），它将等于动画的总持续时间。一旦在动画中添加延迟 `delay` 或增加迭代次数，动画持续时间与动画的总体时间就不相等了。我们充分利用这一点是很重要的。

  


为什么这么说呢？

  


假设你正在构建一个大型或复杂的动画，它将会涉及到多个动画的播放，在这样的情境之下，时间就显得尤其重要。动画从开始到结束的整个过程都将以时间为主。这意味着，动画从开始到结束的整个持续时间就不是我们所谓的“动画持续时间”，它应该是通过以下公式计算出来的时间：

  


```
delay + (iterations × duration) + endDelay
```

  


我们可以通地定面这个示例来演示上面这个公式的结果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/019f8452585647d2b94ef8c4fad2fa0d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1122&h=530&s=3819506&e=gif&f=649&b=fbf4f1)

  


> Demo 地址：https://codepen.io/smashingmag/full/VwWWrzz

  


这使我们能够在固定的时间长度上控制多个动画。

  


在 WAAPI 中，保持所需的动画持续时间不变，你可以在开始时用延迟 `delay` 和在结束时用 `endDelay` 来“填充”它，以将其嵌入到持续时间较长的上下文中。从这个意义上说，延迟的作用类似于关键帧中的偏移。

  


对于 Web 开发者而言，对 `delay` 要比 `endDelay` 熟悉一些，因为 `delay` 与 CSS 中的 `animation-delay` 是相似的，指定动画延迟播放的时间。但 `endDelay` 则有所不同。

  


我们在定义 `KeyframeEffect` 时，可以在 `options` 中设置 `endDelay` ，它主要用于指定动画结束后的延迟时间。这个延迟时间表示在动画结束后，元素保持最终状态的时间，然后再执行其他操作或开始下一次迭代。例如下面这个示例，动画元素沿着 `x` 轴从 `0px` 位置向右移动 `200px` ，使用 WAAPI 很容易实现这样的一个动画效果：

  


```JavaScript
const animatedEle = document.querySelector('.animated');

const keyframes = [
    {
        translate: '0px'
    },
    {
        translate: '200px'
    }
]

const options = {
    duration: 2000,
    fill: 'both',
    iterations: Infinity,
    easing: 'ease',
    direction: 'alternate',
    endDelay: 3000  // 在动画结束后延迟 3s 
}

const timeline = document.timeline || new Animation();

const effect = new KeyframeEffect(animatedEle, keyframes, options);

const animation = new Animation(effect, timeline);

animation.play()
```

  


在创建序列动画和交错动画效果上，`endDelay` 就会很有用。假设你给动画元素创建了两个动画效果 `fadeIn` 和 `pulse` ，而且你希望 `fadeIn` 动画结束后 `300ms` 再运行 `pulse` 动画，那么你可以像下面这样做：

  


```JavaScript
const animatedEle = document.querySelector(".animated");

const fadeInKeyframes = [
    {
        opacity: 0
    },
    {
        opacity: 1
    }
];

const fadeInOptions = {
    duration: 300,
    fill: "both",
    easing: "ease-in",
    endDelay: 300 // 在动画结束后延迟 3s
};

const pulseKeyframes = [
    {
        scale: `1.25 1.25 1.25`,
        offset: 0.5
    }
];

const pulseOptions = {
    duration: 1000,
    direction: "alternate",
    fill: "both",
    easing: "ease-in-out"
};

const timeline = document.timeline || new Animation();

const fadeInEffect = new KeyframeEffect(
    animatedEle,
    fadeInKeyframes,
    fadeInOptions
);

const pulseEffect = new KeyframeEffect(
    animatedEle,
    pulseKeyframes,
    pulseOptions
);

const fadeInAni = new Animation(fadeInEffect, timeline);
const pulseAni = new Animation(pulseEffect, timeline);

fadeInAni.play();

fadeInAni.onfinish = () => {
    // fadeInAni 动画结束后执行其他操作
    console.log("FadeIn Animation Finished!");
    pulseAni.play();
};
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46d3342a0d444546a928e324e2d6139e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=466&s=314737&e=gif&f=176&b=340631)

  


> Demo 地址：https://codepen.io/airen/full/wvOdrYM

  


正如你所看到的，`endDelay` 在 WAAPI 中常用于控制动画结束后的等待时间，使得动画效果更加灵活，适用于各种交互和设计场景。

  


在 WAAPI 中，除了 `endDelay` 之外，还有一个有助于对齐动画的时间选项是 `iterationStart` ，它也是 `KeyframeEffect` 的一个配置选项，主要用于指定动画的起始迭代点，它表示动画应该从整个迭代中的哪个点开始播放。默认情况下，`iterationStart` 的值是 `0.0` ，即动画从第一次迭代的开始点开始播放。

  


```JavaScript
const animatedEle = document.querySelector(".animated");

const keyframes = [
    { transform: 'translateX(0px)' },
    { transform: 'translateX(200px)' },
];

const options = {
    duration: 1000,
    iterations: 2,
    iterationStart: 0.5, // 从动画的一半位置开始播放
};

const animation = new Animation(new KeyframeEffect(animEle, keyframes, options));
animation.play();
```

  


在上面的示例中，动画的迭代次数为 `2` 次，而 `iterationStart` 被设置为 `0.5`，这意味着动画将从第一次迭代的中间位置开始播放。这样可以产生一种在动画的中间位置开始播放的效果。

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ceb4723b1897439086cf430f54de32ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=488&s=701623&e=gif&f=194&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/XWGgBLO

  


与 `endDdely` 相似，我们可以通过设置多个动画的 `iterationStart` ，创建一组动画，使得它们在迭代的时间上交错执行，产生更加复杂的动画序列。简而言之，`iterationStart` 可以用于控制动画从整个迭代中的特定点开始播放，提供了更多灵活性，适用于需要定制起始位置的动画场景。

  


### pseudoElement 配置参数

  


在 CSS 中，我们可以给伪元素 `::before` 或 `::after` 添加过渡或关键帧动画，例如：

  


```CSS
@keyframes pulse {
    50% {
        scale: 1.5;
    }
}

.animated::before {
    animation: pulse 1s ease-in-out;
}
```

  


在 WAAPI 中，我们可以通过 `KeyframeEffectOptions` 中的 `pseudoElement` 配置选项给指定元素的伪元素 `::before` 或 `::after` 应用动画。

  


```JavaScript
const animEle = document.querySelector(".animated");
const buttonHandler = document.querySelector(".button");

const keyframes = [{ scale: 2, offset: 0.5 }];

const options = {
    duration: 3000,
    iterations: Infinity,
    easing: "ease-in-out",
    pseudoElement: "::before"  // 将动画应用于元素的 ::before 伪元素
};

const effect = new KeyframeEffect(animEle, keyframes, options);
const timeline = document.timeline || new Animation();

const animation = new Animation(effect, timeline);

buttonHandler.addEventListener("click", () => {
    animation.play();
});
```

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c154bd53fce845969571177ee1c38906~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=530&s=590316&e=gif&f=175&b=330630)

  


> Demo 地址：https://codepen.io/airen/full/xxBraKv

  


## 使用 WAAPI 构建动画

  


我们来使用 WAAPI 创建一个简单的动画效果，让表情包在屏幕上飞舞的一个效果：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/822eb5ea01ee4023820a715876d808ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1286&h=814&s=9286652&e=gif&f=105&b=00042b)

  


> Demo 地址：https://codepen.io/airen/full/QWogzwm

  


这个示例的动画效果使用 WAAPI 对每个表情符的 `transform` 做随机处理。具体代码如下：

  


```JavaScript
const main = document.querySelector("main");

const emojis = [
  "😀",
  "😃",
  // 省略其他的表情符号
];

emojis.forEach((emoji, index) => {
    // 每一个表情符号放在一个 div，并且命名为 animated
    const aniEle = document.createElement("div");
    aniEle.classList.add("animated");
    aniEle.textContent = `${emoji}`;
    
    // 将所有的表情符塞入到 main 元素中
    main.appendChild(aniEle);

    // 获取随机的 translate、rotate 和 scale 值
    const startx1 = Math.random() * 100;
    const startx2 = Math.random() * 100;
    const starty1 = Math.random() * 100;
    const starty2 = Math.random() * 100;
    const startr1 = Math.random();
    const startr2 = Math.random();
    const starts1 = Math.random();

    const endx1 = Math.random() * 100;
    const endx2 = Math.random() * 100;
    const endy1 = Math.random() * 100;
    const endy2 = Math.random() * 100;
    const endr1 = Math.random();
    const endr2 = Math.random();
    const ends1 = Math.random();

    // 创建 translate 关键帧，改变 transform 属性的值
    const translate = [
        {
            transform: `
                translate(${startx1}vmin,${starty1}vmin)
                rotate(${startr1}turn) 
                scale(${starts1}) 
                rotate(${startr2}turn) 
                translate(${startx2}vmin,${starty2}vmin)`
        },
        {
            transform: `
                translate(${endx1}vmin,${endy1}vmin) 
                rotate(${endr1}turn) 
                scale(${ends1}) 
                rotate(${endr2}turn) 
                translate(${endx2}vmin,${endy2}vmin)`
        }
    ];

    // 配置 translate 动画参数
    const translateOptions = {
        iterations: Infinity,
        duration: Math.random() * 5000 + 5000,
        direction: "alternate",
        easing: "ease-in-out"
    };

    // 创建 scale 关键帧，改变 scale 属性的值
    const scale = [
        {
            scale: 0
        },
        {
            scale: 1
        }
    ];

    // 配置 scale 动画参数
    const scaleOptions = {
        duration: 20000,
        easing: "ease-out"
    };

    // 每个表情符应用 translate 动画
    aniEle.animate(translate, translateOptions);

    // main 元素应用 scale 动画
    main.animate(scale, scaleOptions);
});
```

  


我们使用 `Element.animate()` 分别创建了 `translate` 和 `scale` 动画，每个表情符应用了 `translate` 动画：

  


```JavaScript
// 获取随机的 translate、rotate 和 scale 值
const startx1 = Math.random() * 100;
const startx2 = Math.random() * 100;
const starty1 = Math.random() * 100;
const starty2 = Math.random() * 100;
const startr1 = Math.random();
const startr2 = Math.random();
const starts1 = Math.random();

const endx1 = Math.random() * 100;
const endx2 = Math.random() * 100;
const endy1 = Math.random() * 100;
const endy2 = Math.random() * 100;
const endr1 = Math.random();
const endr2 = Math.random();
const ends1 = Math.random();

// 创建 translate 关键帧，改变 transform 属性的值
const translate = [
    {
        transform: `
            translate(${startx1}vmin,${starty1}vmin)
            rotate(${startr1}turn) 
            scale(${starts1}) 
            rotate(${startr2}turn) 
            translate(${startx2}vmin,${starty2}vmin)`
    },
    {
        transform: `
            translate(${endx1}vmin,${endy1}vmin) 
            rotate(${endr1}turn) 
            scale(${ends1}) 
            rotate(${endr2}turn) 
            translate(${endx2}vmin,${endy2}vmin)`
    }
];

// 配置 translate 动画参数
const translateOptions = {
    iterations: Infinity,
    duration: Math.random() * 5000 + 5000,
    direction: "alternate",
    easing: "ease-in-out"
};

// 每个表情符应用 translate 动画
aniEle.animate(translate, translateOptions);
```

  


同时在 `main` 元素上应用了 `scale` 动画：

  


```JavaScript
// 创建 scale 关键帧，改变 scale 属性的值
const scale = [
    {
        scale: 0
    },
    {
        scale: 1
    }
];

// 配置 scale 动画参数
const scaleOptions = {
    duration: 20000,
    easing: "ease-out"
};

// main 元素应用 scale 动画
main.animate(scale, scaleOptions);
```

  


## WAAPI 控制多个动画

  


在 CSS 中控制多个动画时，[通常会使用动画编排的技术来管理整个时间轴上的所有动画](https://juejin.cn/book/7288940354408022074/section/7304843997364060214)。其本质是控制动画的持续时间和延迟时间来协调时间轴上所有动画，使得所有动画在播放时不会产生混乱，给用户一个较好的体验。

  


相比而言，WAAPI 中控制多个动画会更容易得多。想象一下，你有一个超级 DVD 播放器，可以往这个 DVD 播放器中放入任意数量的 DVD 光盘，而且你还可以在该播放器上添加任意数量的按钮。假设这个超级 DVD 播放器被命名为 `createPlayer` ，它是一个函数：

  


```JavaScript
const createPlayer = (animations) => {
    // 超级 DVD 播放器
}
```

  


你将任意数量的 DVD 光盘 `animations` 放到这个超级 DVD 播放器中。正如上面示例所示，`animations` 当作 `createPlayer()` 函数的参数传入。即：

  


-   `createPlayer()` 函数是一个超级 DVD 播放器
-   `animations` 是任意数量的 DVD 光盘

  


前面我们说过，当 DVD 光盘（`KeyframeEffect`）放入 DVD 播放器（`Animation`）的插槽后，就可以按下 DVD 播放器的播放按键开始播放 DVD：

  


```JavaScript
animation.play()
```

  


现在在这个超级 DVD 播放器中有任意数量的 DVD 光盘，如果你需要播放每张 DVD 光盘，就需要对 DVD 光盘进行遍历。换句话说，这就是调用单个动画和多个动画（动画数组）上 `play()` 的区别，单个动画可以直接调用，多个动画需要进行遍历。如果用代码来描述的话，可能会像下面这样：

  


```JavaScript
const createPlayer = (animations) => {
    animations.forEach(animation => {
        animation.play()
    })
}
```

  


我们可以使用这个来为我们的播放器创建各种功能。当然，你也可以以任何适合的方式创建这个超级 DVD 播放器。例如，下面这个示例，`createPlayer()` 函数接受要同步播放的动画数组（`animations`），并返回具有单个`play` 方法的对象。这个方法使用 `forEach` 循环遍历传入的动画数组，并对每个动画调用其 `play` 方法。

  


```JavaScript
function createPlayer(animations) {
    return Object.freeze({
        play: function() {
            animations.forEach((animation) => animation.play());
        }
    });
}
```

  


这已经足够让你开始扩展功能了。让我们添加 `pause` 和 `currentTime` 方法。

  


```JavaScript
function createPlayer(animations) {
    return Object.freeze({
        play: function() {
            animations.forEach((animation) => animation.play());
        },
        pause: function() {
            animations.forEach((animation) => animation.pause());
        },
        currentTime: function(time = 0) {
            animations.forEach((animation) => animation.currentTime = time);
        }
    });
}
```

  


具有这三种方法的 `createPlayer` 足以让你对任意数量的动画进行编排。

  


来看一个简单的示例：

  


```HTML
<div class="animations">
    <div class="animated"></div>
    <div class="animated"></div>
    <div class="animated"></div>
    <div class="animated"></div>
    <div class="animated"></div>
</div>

<div class="actions">
    <div class="button play" id="play">playAll</div>
    <div class="button pause" id="pause">pauseAll</div>
    <div class="button seek" id="seek">seekAll</div>
    <div class="button cancel" id="cancel">cancelAll</div>
</div>
```

  


有五个动画元素 `.animated` ，并且有四个控制所有动画的不同按钮。通过 WAAPI 的 `Element.animate()` 给 `.animated` 创建动画，并且使用 `pause()` 让所有动画暂停播放，同时将所有动画推到 `animations` 数组中。这样你就获得了很多张 DVD 光盘：

  


```JavaScript
const animEles = document.querySelectorAll(".animated");
const animations = [];

const DURATION = 8000;

// 创建动画
animEles.forEach((animEle, index) => {
    // 创建关键帧
    const keyframes = [
        {
            translate: `0px`,
            rotate: `0deg`
        },
        {
            translate: `80vw`,
            rotate: `2700deg`
        }
    ];

    // 配置动画参数
    const options = {
        duration: DURATION,                         // 动画持续时间
        easing: "ease-in-out",                      // 动画缓动函数
        fill: "both",                               // 动画填充模式  
        delay: (DURATION / 4) * index,              // 动画延迟播放时间
        endDelay: DURATION - (DURATION / 4) * index // 动画结束后延迟时间
    };

    // 使用 Element.animate() 创建 Animation 实例
    const anim = animEle.animate(keyframes, options);
    
    // 默认暂停所有动画播放
    anim.pause();
  
    // 将所有动画推送到 animations 数组  
    animations.push(anim);
});
```

  


使用上面介绍的方法，创建一个超级 DVD 播放器，例如，控制所有动画的播放、暂停和取消等：

  


```JavaScript
function createPlayer(animations) {
    return Object.freeze({
        play: function() {
            animations.forEach((animation) => animation.play());
        },
        pause: function() {
            animations.forEach((animation) => animation.pause());
        },
        cancel: function() {
            animations.forEach((animation) => animation.cancel());
        },
        currentTime: function(time = 0) {
            animations.forEach((animation) => (animation.currentTime = time));
        }
    });
}
```

  


有了这些之后，给按钮绑定 `click` 事件，并且在相应的程序中执行 `createPlayer` 播放器的相关操作：

  


```JavaScript
const playHandler = document.getElementById('play');
const seekHandler = document.getElementById('seek');
const pauseHandler = document.getElementById('pause');
const cancelHandler = document.getElementById('cancel');

const player = createPlayer(animations);

playHandler.addEventListener('click', etv => {
    console.log('Play all animations');
    player.play()
})

pauseHandler.addEventListener('click', etv => {
    console.log('Pause all animations');
    player.pause()
})

cancelHandler.addEventListener('click', etv => {
    console.log('Cancel all animations')
    player.cancel()
})

seekHandler.addEventListener('click', etv => {
    console.log('Seek all animations')
    player.currentTime(1000);
})
```

  


这样你可以同时操作多个动画：

  


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f5bdaedc45d4b3ca8d0ec3534e7d312~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=576&s=2578283&e=gif&f=332&b=060a2e)

  


> Demo 地址：https://codepen.io/airen/full/dyrzpRM

  


## 小结

  


WAAPI 提供了一种现代且强大的方式来处理 Web 页面上的动画效果。通过使用 JavaScript 控制动画，Web 开发者能够更灵活地实现各种交互和动态效果，而不仅仅依赖于静态的 CSS 动画。

  


WAAPI 的关键帧和时间控制机制使得动画的创建和调整变得直观而灵活。Web 开发者可以更细粒度地控制动画的每一帧，以及动画的整体时序。掌握 WAAPI 对于创建富有交互性和动态性的 Web 页面是非常重要的。通过了解和灵活运用 WAAPI 的各项特性，Web 开发者能够提供更出色的用户体验，增强页面的吸引力和可交互性。同时，对于动画的性能优化和事件处理的合理运用也是保证动画效果流畅性和用户体验的关键因素。