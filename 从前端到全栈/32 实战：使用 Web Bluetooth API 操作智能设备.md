在上一节课中，我们做了一些准备工作，创建了项目目录，安装了一些依赖。不过在这一节课，我们先不继续在项目里添加代码，因为还有一些准备工作要做。

前面说过，对于 GATT 协议的蓝牙设备，我们将使用 Web Bluetooth API 来进行通信，而 Web Bluetooth API 已经被 Chrome 浏览器支持了，所以我们可以先通过一些简单的代码来熟悉这个 API。

## 选择智能设备

在国内厂商的蓝牙智能设备里，选择支持通用的 GATT 协议的设备并不容易，大部分设备都是基于自己的协议来实现的，所以我们这里选择了一个国外的设备，它叫 [Mipow PlayBlub Candel](https://www.mipow.com/products/playbulb-candle)，是一款蓝牙智能 LED 灯，它支持 GATT 协议，我们可以通过它来学习 Web Bluetooth API。

这个设备在国内卖的不多，但如果你不想海淘，也可以在淘宝或者闲鱼上购买到，或者购买 Mipow 的其他智能 LED 设备也可以。

有了设备，我们再来看看使用 Web Bluetooth API 操作这个设备需要做哪些准备工作。

### 连接设备

首先，如何通过 Web Bluetooth API 来查找设备？这里我们使用的是 Chrome 浏览器，因为它是唯一支持 Web Bluetooth API 的浏览器。

我们先写一个简单的 HTML 页面：

```
<meta charset="UTF-8">
<button id="connector">连接设备</button>
<button id="switcher">开关</button>
​
<script>
let service = null;
​
connector.onclick = async () => {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{namePrefix: 'PLAYBULB'}],
    optionalServices: [0xff00, 0xff02, 0xff0f],
  });
​
  const server = await device.gatt.connect();
​
  service = (await server.getPrimaryServices())[0];
​
  console.log('connected!', service);
};
</script>
```

在上面的代码中，我们使用了`navigator.bluetooth.requestDevice`方法查找设备，这个方法接收一个对象作为参数，而这个对象里有两个属性，分别是`filters`和`optionalServices`。

`filters`属性是一个数组，它里面可以包含多个对象，每个对象都是一个过滤器，这些过滤器都是`AND`关系。也就是说，只有同时满足所有过滤器的设备才会被查找到。

这里我们只有一个过滤器，它的`namePrefix`属性是`PLAYBULB`。这个属性的意思是，设备的名称必须以`PLAYBULB`开头，这样我们就可以找到我们的设备了。

`optionalServices`属性是一个数组，它里面可以包含多个数字，这些数字都是设备的服务 UUID。这里我们列出了三个服务，分别是`0xff00`、`0xff02`和`0xff0f`。它们是我们设备的服务，被用来操作设备。

`0xff00`、`0xff02`和`0xff0f`都有可能是控制 LED 灯的服务，但我们不知道哪个服务才是真正控制 LED 灯的服务，所以都列出来了，我们可以在连接后返回所有支持服务的列表，然后从中选取我们需要的服务。

注意到我们将`navigator.bluetooth.requestDevice`方法调用写在了按钮被点击的事件里，这样只有用户主动点击按钮才会触发寻找可连接设备的操作。这是`Web Bluetooth API`的一个限制，考虑到安全性，它不允许在非用户主动操作的情况下自动寻找设备，以避免用户隐私泄露。

`navigator.bluetooth.requestDevice`方法会尝试寻找匹配的设备，如果找到了，它会询问用户是否建立连接，用户点击确定后返回一个`BluetoothDevice`对象，这个对象就是我们要找的设备，我们可以通过它来获得设备。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13545a583e724f20bb3086118aae17a9~tplv-k3u1fbpfcp-zoom-1.image)

获得设备后，我们可以通过`device.gatt.connect`方法来建立连接，这也是一个异步方法，成功后返回对应的连接服务实例。

接着我们可以通过服务实例获取服务，`await server.getPrimaryServices()`异步返回所有支持的服务列表，这里我们只需要第一个服务，所以我们使用了`[0]`来获取第一个服务，这个服务就是我们要找的服务，我们将它保存在`service`变量里。

这样我们获取服务的操作就完成了，我们可以在控制台里看到我们的服务实例了。

### 通过服务操作设备

接下来，我们可以操作设备。我们修改上面的代码：

```
<meta charset="UTF-8">
<button id="connector">连接设备</button>
<button id="switcher">开关</button>
​
<script>
let service = null;
​
connector.onclick = async () => {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{namePrefix: 'PLAYBULB'}],
    optionalServices: [0xff00, 0xff02, 0xff0f],
  });
​
  const server = await device.gatt.connect();
​
  service = (await server.getPrimaryServices())[0];
};
​
let lightOn = false;
switcher.onclick = async() => {
  const characteristic = await service.getCharacteristic(0xfffc);
  lightOn = !lightOn;
  const color = lightOn ? [0xff, 0xff, 0xff] : [0, 0, 0];
  characteristic.writeValue(new Uint8Array([0x00, ...color]));
};
</script>
```

上面的代码，我们在`switcher`按钮的点击事件里，通过`service.getCharacteristic`方法来获取一个设备的特性对象，这个方法接收一个数字作为参数，这个数字是特性对象的 UUID，这里我们使用的是`0xfffc`，这个特性是我们设备的 LED 用来控制颜色的，一般根据规范，这个特性的 UUID 是`0xfffc`。

> 如果你拿到一个陌生的设备，不知道这个设备的服务和特性，你可以在手机上安装一个蓝牙设备调试工具，通过调试工具可以看到所有该设备支持的服务和对应的特性。
>
> ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/949c17c11e28438686721543a7a05a80~tplv-k3u1fbpfcp-zoom-1.image) 查看完设备的服务和特性之后，记得断开连接，以便设备能被浏览器发现。

获取到特性对象后，我们可以通过它来操作设备，我们在`switcher`按钮的点击事件里，通过`characteristic.writeValue`方法来写入数据，这个方法接收一个`ArrayBuffer`对象作为参数，这个对象就是我们要写入设备的数据。

Playbulb 系列设备使用一个四位的 uint8 数组来表示颜色，这是一种叫做 WRGB 的颜色表示法，和 RGBA 类似，只不过第一位不是表示透明度，而是表示白光的强度。

在这里，我们通过一个`lightOn`变量来表示灯的开关状态，每次点击按钮时，我们将`lightOn`变量取反，然后根据`lightOn`变量的值来决定写入的颜色，如果`lightOn`为`true`，我们就写入白色，否则就写入黑色。这样就实现了开灯关灯的控制效果。

最终效果如下：

![Mar-07-2023 23-24-26.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cde66b1a70c6431889e332c0ff014952~tplv-k3u1fbpfcp-zoom-1.image)

## 更加复杂的控制

我们可以对 Playbulb 设备进行更加复杂的控制，比如，我们可以通过一个滑块来控制灯的亮度，通过一个颜色选择器来控制灯的颜色。

我们修改上面的代码：

```
<meta charset="UTF-8">
<button id="connector">连接设备</button>
<button id="switcher">开关</button>
<input type="color" id="palette" value="#ffffff"/>
<input type="range" id="brightness" value="0" min="0" max="100" step="1"/>
​
<script>
let service = null;
​
function parseColorString(colorStr) {
  const rgb = colorStr.match(/[0-9a-f]{2}/ig).map((c) => parseInt(c, 16));
  return new Uint8Array(rgb);
}
​
let color = parseColorString(palette.value);
let lightOn = false;
let characteristic = null;
let bright = 0;
​
palette.addEventListener('change', ({target}) => {
  color = parseColorString(target.value);
  if(lightOn) characteristic.writeValue(new Uint8Array([bright, ...color]));
});
​
brightness.addEventListener('change', ({target}) => {
  bright = parseInt(target.value);
  if(lightOn) characteristic.writeValue(new Uint8Array([bright, ...color]));
});
​
connector.onclick = async () => {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{namePrefix: 'PLAYBULB'}],
    optionalServices: [0xff00, 0xff02, 0xff0f],
  });
​
  const server = await device.gatt.connect();
​
  service = (await server.getPrimaryServices())[0];
​
  characteristic = await service.getCharacteristic(0xfffc);
  characteristic.writeValue(new Uint8Array([0, 0, 0, 0]));
​
  switcher.onclick = async() => {
    lightOn = !lightOn;
    characteristic.writeValue(new Uint8Array(lightOn ? [bright, ...color] : [0, 0, 0, 0]));
  };
};
</script>
```

首先，我们增加了一个`parseColorString`函数，这个函数接收一个颜色字符串作为参数，返回一个`Uint8Array`对象，这个对象就是我们要写入设备的颜色数据。

我们通过`palette`和`brightness`两个滑块来控制灯的颜色和亮度，我们在`palette`的`change`事件里，通过`parseColorString`函数来获取颜色数据，然后将颜色数据写入设备，我们在`brightness`的`change`事件里，通过`parseInt`函数来获取亮度数据，然后将亮度数据写入设备。

在设备开关的时候，我们传入当前的颜色和亮度数据，这样就实现了灯的颜色和亮度的控制。

最终的效果如下：

![Mar-07-2023 23-46-46.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfad6c3ca42f441ba133d40390c2af0c~tplv-k3u1fbpfcp-zoom-1.image)

## 特殊效果

Playbulb 设备还支持一些特殊的效果，比如，我们可以通过设备的特性来控制设备的呼吸灯效果、闪烁效果和跑马灯效果。

我们继续修改代码：

```
<meta charset="UTF-8">
<button id="connector">连接设备</button>
<button id="switcher">开关</button>
<select id="effect">
  <option value="none">无特效</option>
  <option value="0x00">闪烁</option>
  <option value="0x01">呼吸</option>
  <option value="0x03">彩虹</option>
</select>
<input type="color" id="palette" value="#ffffff"></input>
<input type="range" id="brightness" value="0" min="0" max="100" step="1"></input>
​
<script>
let service = null;
​
function parseColorString(colorStr) {
  const rgb = colorStr.match(/[0-9a-f]{2}/ig).map((c) => parseInt(c, 16));
  return new Uint8Array(rgb);
}
​
let color = parseColorString(palette.value);
let lightOn = false;
let characteristic = null;
let effectCharacteristic = null;
let bright = 0;
let colorEffect = 'none';
​
const speedMap = {
  '0x00': 0x1f,
  '0x01': 0x03,
  '0x03': 0x1f,
}
​
async function updateColorEffect() {
  if(!characteristic || !effectCharacteristic) return;
  if(!lightOn) {
    characteristic.writeValue(new Uint8Array([0, 0, 0, 0]));
  } else if(colorEffect === 'none') {
    characteristic.writeValue(new Uint8Array([bright, ...color]));
  } else {
    const speed = speedMap[colorEffect];
    effectCharacteristic.writeValue(new Uint8Array([
      bright, ...color,
      parseInt(colorEffect, 16), 0x00, speed, 0x00,
    ]));
  }
}
​
effect.addEventListener('change', ({target}) => {
  colorEffect = target.value;
  updateColorEffect();
});
​
palette.addEventListener('change', ({target}) => {
  color = parseColorString(target.value);
  updateColorEffect();
});
​
brightness.addEventListener('change', ({target}) => {
  bright = parseInt(target.value);
  updateColorEffect();
});
​
connector.onclick = async () => {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{namePrefix: 'PLAYBULB'}],
    optionalServices: [0xff00, 0xff02, 0xff0f],
  });
​
  const server = await device.gatt.connect();
​
  service = (await server.getPrimaryServices())[0];
​
  characteristic = await service.getCharacteristic(0xfffc);
  effectCharacteristic = await service.getCharacteristic(0xfffb);
​
  updateColorEffect();
​
  switcher.onclick = async() => {
    lightOn = !lightOn;
    updateColorEffect();
  };
};
</script>
```

在上面的代码里，我们添加了`effect`选择，通过`effectCharacteristic`特性来控制设备的特效，它的 UUID 是`0xfffb`。

我在代码中调整了细节，现在灯有三种状态：关闭状态、开启状态和开启状态下的特效状态。我们通过`updateColorEffect`函数来控制灯的状态，这个函数会根据当前的状态来决定写入设备的哪个特性，以及写入什么样的值。

在`effect`选择的`change`事件里，我们通过`speedMap`对象来获取特效的速度，这里我们固定了特效的默认速度，然后将特效的速度和颜色数据写入设备。

最终的效果如下：

![Mar-08-2023 00-17-51.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ecf7c1264fc4e65bb195934850ed246~tplv-k3u1fbpfcp-zoom-1.image)

## 小结

在这节课中，我们通过实际操作一个智能 LED 灯学习了如何使用 Web Bluetooth API 控制蓝牙设备。

实际上 Web Bluetooth API 非常简单，上面的示例已经演示了足够多的功能，你可以通过这个 API 来控制任何支持 GATT 协议的低功耗蓝牙设备，只要你能找到设备的特性和特性的 UUID，你就可以用 JavaScript 来写程序让这些设备实现你的意图。

这一节课是动手实践的课程，只有自己写一遍代码才会理解更加深入。也许你看到这里的时候手边还没有一个合适的设备，为了后续的课程，我建议你入手一个类似的智能 LED 设备，这样能更好地体会和掌握这一节课以及后续课程的内容。