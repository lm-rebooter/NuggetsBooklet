在上一节课，我们介绍了用 Web Bluetooth API 操作智能 LED 设备，这样的设备是低功耗蓝牙设备，一般支持 GATT 协议。接下来，我们了解另一类的蓝牙设备，它们不属于低功耗蓝牙设备，因此不采用 GATT 协议，通常使用蓝牙串口通讯协议（SPP）进行通讯。

## SPP 通讯协议与设备

SPP 协议是一种基于串口的蓝牙通讯协议，它的特点是：

-   串口通讯协议，即数据以字节流的形式传输，没有数据帧的概念。
-   通讯速率较低，一般为 9600bps。
-   通讯距离较短，一般为 10 米以内。
-   通讯稳定性较高，一般不会出现数据丢失的情况。
-   通讯延迟较低，一般为 10ms 以内。

一些智能设备采用这个协议，比较有意思的设备有 Divoom 系列的像素板设备。在本节课中，我们的例子选择 Divoom 的一款迷你像素屏音箱 [Ditoo-Plus](https://divoom.com/products/divoom-ditooplus?variant=32038376210550) 来作为测试设备。你可以在 Divoom 官网或者国内的电商平台上购买这个系列的产品，也可以购买 Divoom 其他系列（除了Pixoo64）的像素屏产品。

## 实现蓝牙 SPP 服务

在这里，我们使用 [node-bluetooth-serial-port](https://github.com/tinyprinter/node-bluetooth-serial-port) 模块来搭建服务。

服务器的实现比较简单，我们可以直接创建一个服务的实例：

```
import BluetoothSerialPort from 'node-bluetooth-serial-port';
const server = new BluetoothSerialPort.BluetoothSerialPort();
```

然后，我们可以通过`server.findSerialPortChannel`方法来查找设备的通讯通道并建立连接：

```
server.findSerialPortChannel(deviceMAC, (channel) => {
  // Connect to the device
  server.connect(deviceMAC, channel, () => {
    // We connected, resolve
    console.log('connected');
  }, () => throw new Error('Cannot connect'));
}, () => throw new Error('Not found'));
```

在连接成功后，我们可以通过`server.write`方法来写入数据：

```
server.write(buffer, (error, bytes) => {
  console.log('==>', error, buffer, bytes);
  if(error) {
    console.error(error);
    server.close(); // 断开连接
  }
});
```

为了方便使用，我们可以将整个蓝牙串口通讯服务封装成一个类：

```
import BluetoothSerialPort from 'node-bluetooth-serial-port';
import {stringToBuffer} from '../utils.js';
​
function Defer() {
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}
​
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
​
export class Bluetooth {
  constructor({deviceMAC, connectionTimeout, maxConnectAttempts, connectionAttemptDelay}) {
    this._config = {deviceMAC, connectionTimeout, maxConnectAttempts, connectionAttemptDelay};
    this._dataBuffer = [];
    this.server = new BluetoothSerialPort.BluetoothSerialPort();
  }
​
  async connect(times = this._config.maxConnectAttempts) {
    const {connectionAttemptDelay} = this._config;
    let attempts = 0;
    for(let i = 0; i < times; i += 1) {
      try {
        console.log('connection attempt %d/%d', attempts, times);
        // eslint-disable-next-line no-await-in-loop
        await this._connect();
        break;
      } catch (error) {
        console.error('error', error.message);
        attempts++;
        // eslint-disable-next-line no-await-in-loop
        await sleep(connectionAttemptDelay);
      }
    }
    await sleep(500); // wait for device ready
    return this.server;
  }
​
  _connect() {
    const {deviceMAC, connectionTimeout} = this._config;
    const server = this.server;
    return new Promise((resolve, reject) => {
      // Find the device
      setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, connectionTimeout);
​
      server.findSerialPortChannel(deviceMAC, (channel) => {
        // Connect to the device
        server.connect(deviceMAC, channel, () => {
          // We connected, resolve
          resolve(server);
        }, () => reject(new Error('Cannot connect')));
      }, () => reject(new Error('Not found')));
    });
  }
​
  /**
   * Write a buffer to the device
   */
  write(buffer) {
    const server = this.server;
    return new Promise((resolve, reject) => {
      server.write(buffer, (error, bytes) => {
        console.log('==>', error, buffer, bytes);
        if(error) {
          server.close(); // 重新连接
          this.connect(1000).then(() => {
            console.log('reconnected!');
            this.write(buffer);
          });
        }
        return error ? reject(error) : resolve(bytes);
      });
    });
  }
​
  async writeMessage(command) {
    const buffers = stringToBuffer(command);
    const status = [];
​
    const len = this._dataBuffer.length;
    this._dataBuffer.push(...buffers);
​
    if(len === 0) {
      this._defer = new Defer();
      // eslint-disable-next-line no-restricted-syntax
      do {
        const buffer = this._dataBuffer.shift();
        // eslint-disable-next-line no-await-in-loop
        status.push(await this.write(buffer));
      } while(this._dataBuffer.length > 0);
      this._defer.resolve();
      this._defer = null;
    } else {
      await this._defer.promise;
    }
​
    return status;
  }
​
  async disconnect() {
    if(this._defer) await this._defer.promise;
    this.server.close();
  }
}
```

整个类的代码不是特别复杂，但有几个细节点需要注意一下。

首先，蓝牙连接建立的时候不一定能保证成功，发现设备信道的成功率取决于设备的信号频率和距离等等因素。所以我们需要设置一个重试次数，如果重试次数用完还是没有成功，那么我们就抛出异常。在建立单次连接的时候，我们设置一个超时的时间，如果连接超时，那么等待一个重试间隔时间后再次尝试连接。在这里我们用`_connect`来实现单次ci连接，然后在`connect`方法中进行重试。

其次，我们需要保证数据的顺序性，然后在上一次数据发送完成后再发送下一次数据。这里我们在`writeMessage`方法中使用了一个`_defer`来实现这个功能，`writeMessage`方法可以向设备发送字符串数据，当我们发送数据的时候，如果缓冲区中有数据，那么我们就等待上一次数据发送完成后再发送下一次数据。之所以这样设计，是因为在后续的章节中我们会实现一组 HTTP 接口，通过 HTTP 请求来转发数据给设备，这样我们就可以通过 HTTP 请求来控制设备了。但是，当我们通过 HTTP 请求发送数据的时候，我们有可能同时发起多次请求，那就需要将这些数据按照顺序发送给设备，所以我们还需要一个缓冲区来存储数据，再通过`_defer`保证数据的顺序发送。

最后，我们在发送数据的时候，有可能出现连接错误。因此，如果数据发送失败，我们就重新建立连接，然后再发送数据。这里我们在`write`方法里使用了`server.close`方法来断开连接，然后再次调用`connect`方法来重新建立连接。

这样我们就实现了一个简单的蓝牙串口服务，我们可以通过这个服务连接设备的MAC地址来控制设备。

## 向设备发送数据

接下来，我们通过操控实际的设备来测试一下我们的蓝牙串口服务。

向具体的设备发送数据之前，我们必须根据设备的协议来构造正确的数据。

Divoom 设备的协议有一个开放的文档，我们可以通过[这个文档](https://github.com/RomRider/node-divoom-timebox-evo/blob/master/PROTOCOL.md)来构造正确的数据。

简单来说，Divoom 的协议是这样的格式：

`01 LLLL PAYLOAD CRCR 02`

其中数据以 01 开头，02 结尾，中间的数据是`PAYLOAD`，`PAYLOAD`的长度是`LLLL`，而`CRCR`是`PAYLOAD`的 CRC 校验码。

根据这个协议，我设计一个类来编码构造正确的数据：

```
​
// https://github.com/RomRider/node-divoom-timebox-evo/blob/master/PROTOCOL.md
function int2hexlittle(value) {
  if(value > 65535 || value < 0) {
    throw new TypeError('int2hexlittle only supports value between 0 and 65535');
  }
  const byte1 = (value & 0xFF).toString(16).padStart(2, '0');
  const byte2 = ((value >> 8) & 0xFF).toString(16).padStart(2, '0');
  return `${byte1}${byte2}`;
}
​
const _START = '01';
const _END = '02';
​
export class TimeboxEvoMessage {
  constructor(msg = '') {
    this._message = null;
    this.append(msg);
  }
​
  _calcCRC() {
    if(!this._message) return undefined;
    const msg = this.lengthHS + this._message;
    let sum = 0;
    for(let i = 0, l = msg.length; i < l; i += 2) {
      sum += parseInt(msg.substr(i, 2), 16);
    }
    return sum % 65536;
  }
​
  get crc() {
    if(!this._message) return undefined;
    return this._calcCRC();
  }
​
  get crcHS() {
    if(!this._message) return undefined;
    return int2hexlittle(this.crc);
  }
​
  get length() {
    if(!this._message) return undefined;
    return (this._message.length + 4) / 2;
  }
​
  get lengthHS() {
    if(!this._message) return undefined;
    return int2hexlittle(this.length);
  }
​
  get payload() {
    return this._message;
  }
​
  set payload(payload) {
    this._message = payload;
  }
​
  get message() {
    if(!this._message) return undefined;
    return _START + this.lengthHS + this._message + this.crcHS + _END;
  }
​
  append(msg) {
    if(msg) {
      this._message = this._message ? this._message + msg.toLowerCase() : msg.toLowerCase();
    }
    return this;
  }
​
  prepend(msg) {
    if(msg) {
      this._message = this._message ? msg.toLowerCase() + this._message : msg.toLowerCase();
    }
    return this;
  }
​
  toString() {
    return this.message;
  }
}
```

这样，我们就可以通过这个类来构造正确的数据发送给设备了。


## 测试服务

接下来，我们写一段简单的脚本来测试一下我们的服务。

```
import {Bluetooth} from '../server/bluetooth/bluetooth.js';
import {TimeboxEvoMessage} from '../src/divoom/message.js';
​
const config = {
  deviceMAC: '11:75:58:CE:DB:2F',
  maxConnectAttempts: 3,
  connectionAttemptDelay: 500,
  connectionTimeout: 10000,
};
​
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
​
function randomColor() {
  const R = Math.floor(Math.random() * 255);
  const G = Math.floor(Math.random() * 255);
  const B = Math.floor(Math.random() * 255);
  return `${R.toString(16)}${G.toString(16)}${B.toString(16)}`;
}
​
(async function () {
  const bluetooth = new Bluetooth(config);
  const connection = await bluetooth.connect();
  console.log('connected');
​
  connection.on('data', (buffer) => {
    const result = buffer.toString('hex');
    console.log('<==', result);
  });
​
  process.on('SIGINT', async () => {
    await bluetooth.disconnect();
    console.log('disconnected');
    process.exit(0);
  });
​
  while(1) {
    const color = randomColor();
    const message = `4501${color}500001000000`;
    const payload = new TimeboxEvoMessage(message).message;
    // eslint-disable-next-line no-await-in-loop
    await bluetooth.writeMessage(payload);
    // eslint-disable-next-line no-await-in-loop
    await sleep(1000);
  }
}());
```

这段脚本会不断向设备发送随机颜色的数据，来测试我们的服务。根据协议，4501 是设置颜色的指令，格式如下：

`4501 RRGGBB BB TT PP 000000`，其中`RRGGBB`是颜色的 RGB 值，`BB`是亮度，我们设置为`50`，中等亮度，`TT`是类型，这里我们设置为`00`，表示纯色，`PP`是强度，一般设置为`01`。

所以，最后我们需要发送的数据是`4501${color}500001000000`，其中`color`是随机颜色的 RGB 值，我们通过`randomColor`方法来生成随机颜色。

这样，我们将上面这段代码保存为`test.js`，然后执行`node test.js`，就可以看到设备的颜色在不断的变化了，效果如下图所示：

![Mar-15-2023 10-41-14.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e92fa7e95c9468cbc9c229342fa0595~tplv-k3u1fbpfcp-zoom-1.image)

## 小结

这节课我们通过一个例子，熟悉了 SPP 协议的蓝牙通讯服务的实现，以及如何通过蓝牙向设备发送数据。这里我们只是简单发送了颜色数据，实际上，我们还可以通过蓝牙向设备发送图片、文字，以此来实现更多的功能。

下一节课，我们将尝试把设备的蓝牙通讯服务通过 HTTP 接口暴露出来。这样，我们就可以在 Web 上通过 HTTP 接口来控制设备了。同时，我们也会封装和测试 Divoom 设备的更多功能，以实现更加有趣的效果。