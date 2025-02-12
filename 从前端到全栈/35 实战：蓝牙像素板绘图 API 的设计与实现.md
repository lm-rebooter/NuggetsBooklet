接下来，我们来设计设备的绘图 API，目的是更加方便地操作设备。

首先，我们需要搞清楚设备具体的绘图指令。还记得在前两节课程中，我们使用`4501`指令来让整个像素板填充某种颜色。这是因为，根据 Divoom 的协议，`4501`指令会将像素板设置为`Lightning mode`。在这个模式下，像素板可以显示纯色。

更多相关指令，可以详细阅读[这个文档](https://github.com/RomRider/node-divoom-timebox-evo/blob/master/PROTOCOL.md)。

在这里，我们重点关注绘制静态图像的指令，这个指令固定以`44000A0A04`序列开头。

具体的图像格式如下：

```
44000A0A04 AA LLLL 000000 NN COLOR_DATA PIXEL_DATA
           |<---------- IMAGE_DATA ------------->|
```

上面的指令中，AA 是固定的图像开头标志，LLLL 是图像的数据长度，接着是`000000`的分隔位，接着是 NN 表示图像的颜色数量，最多是 256 色，用 00 表示，接着是颜色索引数据和像素数据。

我们来试一下。大家还记得上一节课我们最后的通讯指令：

```
picker.addEventListener('change', async ({target}) => {
  const colorStr = target.value.slice(1);
  const message = `4501${colorStr}500001000000`;
  const payload = generatePayload(message);
  const ret = await (await fetch('http://localhost:9527/send', {
    method: 'POST',
    body: JSON.stringify({
      payload,
    }),
  })).json();
  console.log(ret);
});
```

这里我们是通过`4501`来发送指令，切换到`Lighting mode`来显示纯色。那我们现在换一个形式用`44000A0A04`指令来实现类似的功能。

我们实现相关的函数：

```
function number2HexString(int) {
  if(int > 255 || int < 0) {
    throw new Error('number2HexString works only with number between 0 and 255');
  }
​
  return Math.round(int).toString(16).padStart(2, '0');
}
​
​
function generateImageData(pixels) {
  const colorMap = new Map();
  let index = 0;
​
  let colorData = '';
​
  const screen = [];
​
  for(let i = 0; i < 256; i++) {
    const color = pixels[i];
    if(!colorMap.has(color)) {
      colorMap.set(color, index++);
      colorData += color;
    }
    screen.push(colorMap.get(color));
  }
​
  // Calculate how many bits are needed to fit all the palette values in
  // log(1) === 0. Therefore we clamp to [1,..]
  const referenceBitLength = Math.max(1, Math.ceil(Math.log2(colorData.length / 6)));
​
  // Screen buffer is using minmal amount of bits to encode all palette codes.
  // Ordering of segments is Little endion
  let current = 0;
  let currentIndex = 0;
​
  let pixelData = '';
​
  screen.forEach((paletteIndex) => {
    // Add the new color reference to the accumulator
    const reference = paletteIndex & ((2 ** referenceBitLength) - 1);
    current |= (reference << currentIndex);
    currentIndex += referenceBitLength;
​
    // Write out all filled up bytes
    while(currentIndex >= 8) {
      const lastByte = current & 0xff;
      current >>= 8;
      currentIndex -= 8;
      pixelData += number2HexString(lastByte);
    }
  });
​
  // Add the last byte
  if(currentIndex !== 0) {
    pixelData += number2HexString(current);
  }
​
  const colorCount = number2HexString(colorData.length / 6);
  const data = `${colorCount}${colorData}${pixelData}`;
  const length = int2hexlittle(data.length / 2 + 6);
  const prefix = '44000A0A04';
  return `${prefix}AA${length}000000${data}`;
}
```

在这里，我们用一个数组表示像素点，因为设备是 16X16 的，所以我们数组的长度为 256，其中每个元素表示相应坐标下的颜色信息，存储一个六位的 RGB 字符串。

在`generateImageData`方法里，我们对像素点的颜色进行处理。根据协议，我们先将颜色信息存储到一个哈希表中，然后将所有用到的颜色拼接成`colorData`数据。接着我们计算由这些颜色所以组成的 pixelData。注意，根据协议，这部分数据是压缩后的数据，用尽可能少的位数来表示坐标下的颜色索引。例如，图像如果一共只用到 3 个颜色，那么只需要用 2 位二进制位来存放一个坐标的索引，如果用了 15 个颜色，则使用 4 位二进制位来存放，以此类推。

最后，我们将颜色数量`colorCount`、颜色数据`colorData`和包含颜色索引的像素信息`pixelData`拼接起来，再添加`AA LLLL 000000`数据头，就可以生成我们要发送的信息了。

下面是完整的代码，可以[访问这个链接](https://code.juejin.cn/pen/7216613245233135677)在线运行效果。注意，别忘了先启动服务端，以便于建立设备连接。

```
const picker = document.querySelector('input[type=color');
​
function int2hexlittle(value) {
  if(value > 65535 || value < 0) {
    throw new TypeError('int2hexlittle only supports value between 0 and 65535');
  }
  const byte1 = (value & 0xFF).toString(16).padStart(2, '0');
  const byte2 = ((value >> 8) & 0xFF).toString(16).padStart(2, '0');
  return `${byte1}${byte2}`;
}
​
function lengthHS(message) {
  return int2hexlittle((message.length + 4) / 2);
}
​
function calcCRC(message) {
  const msg = lengthHS(message) + message;
  let sum = 0;
  for(let i = 0, l = msg.length; i < l; i += 2) {
    sum += parseInt(msg.substr(i, 2), 16);
  }
  return int2hexlittle(sum % 65536);
}
​
function number2HexString(int) {
  if(int > 255 || int < 0) {
    throw new Error('number2HexString works only with number between 0 and 255');
  }
​
  return Math.round(int).toString(16).padStart(2, '0');
}
​
​
function generateImageData(pixels) {
  const colorMap = new Map();
  let index = 0;
​
  let colorData = '';
​
  const screen = [];
​
  for(let i = 0; i < 256; i++) {
    const color = pixels[i];
    if(!colorMap.has(color)) {
      colorMap.set(color, index++);
      colorData += color;
    }
    screen.push(colorMap.get(color));
  }
​
  // Calculate how many bits are needed to fit all the palette values in
  // log(1) === 0. Therefore we clamp to [1,..]
  const referenceBitLength = Math.max(1, Math.ceil(Math.log2(colorData.length / 6)));
​
  // Screen buffer is using minmal amount of bits to encode all palette codes.
  // Ordering of segments is Little endion
  let current = 0;
  let currentIndex = 0;
​
  let pixelData = '';
​
  screen.forEach((paletteIndex) => {
    // Add the new color reference to the accumulator
    const reference = paletteIndex & ((2 ** referenceBitLength) - 1);
    current |= (reference << currentIndex);
    currentIndex += referenceBitLength;
​
    // Write out all filled up bytes
    while(currentIndex >= 8) {
      const lastByte = current & 0xff;
      current >>= 8;
      currentIndex -= 8;
      pixelData += number2HexString(lastByte);
    }
  });
​
  // Add the last byte
  if(currentIndex !== 0) {
    pixelData += number2HexString(current);
  }
​
  const colorCount = number2HexString(colorData.length / 6);
  const data = `${colorCount}${colorData}${pixelData}`;
  const length = int2hexlittle(data.length / 2 + 6);
  const prefix = '44000A0A04';
  return `${prefix}AA${length}000000${data}`;
}
​
function setPixel(pixels, row, col, color = '000000') {
  pixels[row * 16 + col] = color;
}
​
function generatePayload(message) {
  return `01${lengthHS(message)}${message}${calcCRC(message)}02`;
}
​
async function sendMessage(message) {
  const payload = generatePayload(message);
  const ret = await (await fetch('http://localhost:9527/send', {
    method: 'POST',
    body: JSON.stringify({
      payload,
    }),
  })).json();
  return ret;
}
​
const pixels = (new Array(256)).fill('000000');
​
picker.addEventListener('change', async ({target}) => {
  const colorStr = target.value.slice(1);
  for(let i = 0; i < 16; i++) {
    for(let j = i; j < 16; j++) {
      setPixel(pixels, i, j, colorStr);
    }
  }
  await sendMessage(generateImageData(pixels));
});
```

最终运行效果如下：

![Mar-31-2023 16-58-46.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be022de78a12470e87d2512554226285~tplv-k3u1fbpfcp-zoom-1.image)

## 利用Canvas绘图

上面的例子，我们可以通过像素点绘图，但是这么使用还是不够方便，我们可以做一个巧妙的设计，把代码封装成一个 Divoom 类，暴露一个 getContext 方法，返回一个 Canvas 的上下文对象，然后在 Canvas 中进行绘图！

我们看一下要怎么实现。

```
class Divoom {
  constructor() {
    this._canvas = new OffscreenCanvas(16, 16);
  }
​
  getContext() {
    if(this._ctx) return this._ctx;
    const ctx = this._canvas.getContext('2d', {willReadFrequently: true});
    const {fill, stroke, fillRect, strokeRect, fillText, strokeText, drawImage, clearRect} = ctx;
    [fill, stroke, fillRect, strokeRect, fillText, strokeText, drawImage, clearRect].forEach((fn) => {
      ctx[fn.name] = async (...rest) => {
        fn.apply(ctx, rest);
        return await this.forceUpdate();
      };
    });
    return ctx;
  }
​
  forceUpdate() {
    this._needsUpdate = true;
    if(!this._updatePromise) {
      this._updatePromise = new Promise((resolve) => {
        requestAnimationFrame(() => {
          this._updatePromise = null;
          this.update();
          resolve();
        });
      });
    }
    return this._updatePromise;
  }
​
  transferCanvasData() {
    const ctx = this.getContext();
    const imageData = ctx.getImageData(0, 0, 16, 16);
    const data = imageData.data;
    const pixels = [];
​
    for(let i = 0; i < 256; i++) {
      const index = i * 4;
      pixels[i] = number2HexString(data[index])
        + number2HexString(data[index + 1])
        + number2HexString(data[index + 2]);
    }
    return pixels;
  }
​
  async update() {
    const pixels = this.transferCanvasData();
    await sendMessage(generateImageData(pixels));
  }
}
```

上面的代码我们简单封装了一个 Divoom 类，在这个类中，我们关联了一个 OffscreenCanvas 对象，我们让这个类能够通过 getContext 获得这个 Canvas 对象的上下文。同时，关键的一步是我们对这个对象的上下文中一些绘图方法进行了包装，我们让`fill, stroke, fillRect, strokeRect, fillText, strokeText, drawImage, clearRect`这些 Canvas 方法在调用的时候，通过调用 forceUpdate 方法来异步触发 Divoom 对象的 update，在 update 方法里，我们读取 Canvas 对象的像素信息，并按照格式编码然后发送给设备。

注意这里之所以要用异步，是考虑 HTTP 通讯的性能，我们不希望 Canvas 绘制的时候过于频繁地发送请求给服务。

那么实现了这个封装之后，我们就可以非常方便地使用 Canvas 来绘制我们的图形到设备上了：

```
const device = new Divoom();
​
const ctx = device.getContext();
ctx.fillStyle = 'blue';
ctx.beginPath();
ctx.rect(0, 0, 10, 10);
ctx.fill();
ctx.fillStyle = 'red';
ctx.beginPath();
ctx.rect(10, 10, 16, 16);
ctx.fill();
```

详细代码和完整的例子[在这里](https://code.juejin.cn/pen/7216633012636057655)。

这是最终运行的效果：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4edf1628614040629d39c9199c73189a~tplv-k3u1fbpfcp-zoom-1.image)

还可以用它来绘制各种图像，非常方便，比如：

```
(async () => {
  const device = new Divoom();
​
  const url = 'https://p2.ssl.qhimg.com/t017f6883a6380b105b.png';
  const img = await loadImage(url);
  
  const ctx = device.getContext();
​
  ctx.drawImage(img, 3, 5, 10, 10);
  ctx.fillStyle = 'white';
  ctx.fillRect(3, 3, 1, 1);
  ctx.fillRect(12, 3, 1, 1);
})();
```

最终效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8106fade0934fa893495d4ed0acd04f~tplv-k3u1fbpfcp-zoom-1.image)

## 小结

这一节课，我们对 Divoom 设备的客户端代码进行简单的封装，用 Canvas 上下文提供了强大的功能，这样就相当于我们从设备获得一个 16X16 的画布，可以随意发挥我们的想象力，绘制各种不同的图形，或者实现一些有趣的应用，非常的好玩。

不知道你入手了蓝牙设备吗？学到这里，你是否已经完成了设备的代码封装和调试，实现了什么有趣的功能？欢迎在评论区讨论。