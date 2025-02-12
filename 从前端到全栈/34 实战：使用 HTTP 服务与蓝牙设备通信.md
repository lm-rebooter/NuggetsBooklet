在上一节课里，我们使用蓝牙串口服务（Bluetooth Serial Port Service，简称 BSPS）实现了到蓝牙设备的连接。这样，我们就可以在 Node.js 中通过命令行来操作蓝牙设备。但是，通过命令行操作设备不够方便，我们可以在蓝牙串口服务器之上再设计一个 HTTP 服务，通过 HTTP 服务将数据转发给蓝牙串口服务，这样我们就能在网页中通过 HTTP 请求来与我们的蓝牙设备通信了。

在前面的课程里已经说过，实现 HTTP 服务有很多可选的框架，比如 Express、Koa、Hapi 等。在这里，我们使用  Express 来实现 HTTP 服务。

我们可以在 package.json 中添加 Express 依赖：

```
npm install express --save
```

然后，我们创建一个`server/index.js`文件，用来实现 HTTP 服务：

```
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {Bluetooth} from './bluetooth/bluetooth.js';
​
const config = {
  spp: {
    deviceMAC: null,
    maxConnectAttempts: 3,
    connectionAttemptDelay: 500,
    connectionTimeout: 10000,
  },
  http: {
    port: 9527,
  },
};
​
(async function () {
  const args = process.argv.slice(2);
  if(!args[0]) {
    console.log(`No device MAC address.
    Please use `npm run server -- <MAC>` to set the MAC address manually.`);
    process.exit(-1);
  }
​
  config.spp.deviceMAC = args[0].replace(/[: ]/mg, '');
​
  const bluetooth = new Bluetooth(config.spp);
​
  // Let's try connecting
  const connection = await bluetooth.connect();
​
  if(!connection) {
    console.error('Failed to connect.');
    process.exit(-1);
  }
​
  connection.on('data', (buffer) => {
    const result = buffer.toString('hex');
    console.log('<==', result);
  });
​
  const app = express();
​
  // ...
})();
```

这里我们使用了`process.argv`来获取命令行参数，然后将参数传递给蓝牙串口服务。这样，我们就可以在命令行中通过`npm run server -- <MAC>`输入蓝牙设备的 MAC 地址，用来建立蓝牙连接。

我们在启动 HTTP 服务之前，先创建蓝牙连接服务的实例，然后异步地调用`connect()`方法来建立蓝牙连接。如果连接成功，我们就可以在`connection`事件中监听到蓝牙设备的数据。

这里，我们需要把上一节课的蓝牙服务连接代码做一个小的改动：

```
export class Bluetooth {
  ...
  async connect(times = this._config.maxConnectAttempts) {
    const {connectionAttemptDelay} = this._config;
    let attempts = 0;
    let success = false;
    for(let i = 0; i < times; i += 1) {
      try {
        console.log('connection attempt %d/%d', attempts, times);
        // eslint-disable-next-line no-await-in-loop
        await this._connect();
        success = true;
        break;
      } catch (error) {
        console.error('error', error.message);
        attempts++;
        // eslint-disable-next-line no-await-in-loop
        await sleep(connectionAttemptDelay);
      }
    }
    await sleep(500); // wait for device ready
    return success ? this.server : null;
  }
  ...
}
```

我们在`connect()`方法中，通过`success`变量来判断是否连接成功。如果连接成功，我们就返回`this.server`，否则返回`null`。

Express 是采用洋葱模型的 HTTP 服务框架，我们可以通过中间件来添加需要的功能。在这里，我们需要添加`body-parser`和`cors`中间件，分别用来解析 HTTP 请求的 body 和设置跨域访问。

```
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {Bluetooth} from './bluetooth/bluetooth.js';
​
const config = {
  spp: {
    deviceMAC: null,
    maxConnectAttempts: 3,
    connectionAttemptDelay: 500,
    connectionTimeout: 10000,
  },
  http: {
    port: 9527,
  },
};
​
(async function () {
  const args = process.argv.slice(2);
  if(!args[0]) {
    console.log(`No device MAC address.
    Please use `npm run server -- <MAC>` to set the MAC address manually.`);
    process.exit(-1);
  }
​
  config.spp.deviceMAC = args[0].replace(/[: ]/mg, '');
​
  const bluetooth = new Bluetooth(config.spp);
​
  // Let's try connecting
  const connection = await bluetooth.connect();
​
  if(!connection) {
    console.error('Failed to connect.');
    process.exit(-1);
  }
​
  connection.on('data', (buffer) => {
    const result = buffer.toString('hex');
    console.log('<==', result);
  });
​
  const app = express();
  app.use(cors());
  app.use(bodyParser.text({type: '*/*'}));
​
  app.get('/', (req, res) => {
    res.send(config);
  });
​
  app.listen(config.http.port);
})();
```

现在我们已经实现了基本的 HTTP 服务，虽然我们还没有实现蓝牙设备数据的发送，但是这个服务器可以正常运行了。

我们在 package.json 中添加一个`server`命令，用来启动 HTTP 服务：

```
{
  "scripts": {
    "server": "node server"
  }
}
```

这样我们就可以通过`npm run server -- <MAC>`来启动服务器，然后通过浏览器访问`http://localhost:9527`来查看服务器的配置信息。

```
npm run server -- 11:75:58:CE:DB:2F
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5d28200d1854c4e9b8123d4d912fc3c~tplv-k3u1fbpfcp-zoom-1.image)

接下来，我们需要实现蓝牙设备数据的发送。我们可以在`server/index.js`中添加一个`post`方法，用来接收 HTTP 请求，然后将请求的数据发送到蓝牙设备：

```
  app.post('/send', async (req, res) => {
    try {
      const {payload} = JSON.parse(req.body);
      if(payload) {
        const result = await bluetooth.writeMessage(payload);
        res.send({status: 'OK', result});
      } else {
        res.send({status: 'OK'});
      }
    } catch (error) {
      res.send({status: 'ERROR', error: error.message});
    }
  });
```

注意，这里我们可以有一个设计上的取舍，那就是我们能将数据的编码放在服务器端进行，也可以将数据的编码放在客户端进行，它们各有利弊。前者的好处是，我们在 HTTP 传输中可以减少数据的传输量，弊端是我们每添加一类硬件，需要对应实现该硬件的编码和解码。后者的好处是，我们可以在客户端实现多种硬件的编码和解码，弊端是我们在 HTTP 传输中会增加数据的传输量。

在这个项目里，我希望保持 HTTP 服务尽量通用，所以选择了在客户端处理数据。这样的话，我们的 HTTP 服务就可以实现得非常简单了，最后完整代码如下：

```
// General purpose blue-tooth SPP server
​
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {Bluetooth} from './bluetooth/bluetooth.js';
​
const config = {
  spp: {
    deviceMAC: null,
    maxConnectAttempts: 3,
    connectionAttemptDelay: 500,
    connectionTimeout: 10000,
  },
  http: {
    port: 9527,
  },
};
​
(async function () {
  const args = process.argv.slice(2);
  if(!args[0]) {
    console.log(`No device MAC address.
    Please use `npm run server -- <MAC>` to set the MAC address manually.`);
    process.exit(-1);
  }
​
  config.spp.deviceMAC = args[0].replace(/[: ]/mg, '');
​
  const bluetooth = new Bluetooth(config.spp);
​
  // Let's try connecting
  const connection = await bluetooth.connect();
​
  if(!connection) {
    console.error('Failed to connect.');
    process.exit(-1);
  }
​
  connection.on('data', (buffer) => {
    const result = buffer.toString('hex');
    console.log('<==', result);
  });
​
  const app = express();
  app.use(cors());
  app.use(bodyParser.text({type: '*/*'}));
​
  app.get('/', (req, res) => {
    res.send(config);
  });
​
  app.post('/send', async (req, res) => {
    try {
      const {payload} = JSON.parse(req.body);
      if(payload) {
        const result = await bluetooth.writeMessage(payload);
        res.send({status: 'OK', result});
      } else {
        res.send({status: 'OK'});
      }
    } catch (error) {
      res.send({status: 'ERROR', error: error.message});
    }
  });
​
  app.listen(config.http.port);
​
  process.on('SIGINT', (code) => {
    console.log('Disconnecting…');
    connection.close();
    process.exit(0);
  });
}());
```

我们可以测试一下 HTTP 服务。首先，在终端启动这个服务，然后我们在[码上掘金](https://code.juejin.cn)创建一个新的项目：

```
<input type="color"/>
```

我们在 HTML 中放了一个颜色选择器，然后实现 JavaScript 部分：

```
const picker = document.querySelector('input[type=color');

function int2hexlittle(value) {
  if(value > 65535 || value < 0) {
    throw new TypeError('int2hexlittle only supports value between 0 and 65535');
  }
  const byte1 = (value & 0xFF).toString(16).padStart(2, '0');
  const byte2 = ((value >> 8) & 0xFF).toString(16).padStart(2, '0');
  return `${byte1}${byte2}`;
}

function lengthHS(message) {
  return int2hexlittle((message.length + 4) / 2);
}

function calcCRC(message) {
  const msg = lengthHS(message) + message;
  let sum = 0;
  for(let i = 0, l = msg.length; i < l; i += 2) {
    sum += parseInt(msg.substr(i, 2), 16);
  }
  return int2hexlittle(sum % 65536);
}

function generatePayload(message) {
  return `01${lengthHS(message)}${message}${calcCRC(message)}02`;
}

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

在上面的代码里，我们将颜色选择器的值转换成了 16 进制的字符串，然后将其拼接成了一个完整的数据包，最后将其发送到 HTTP 服务。可以看到，我们的 HTTP 服务接收到了这个数据包，并将其发送到了蓝牙设备，最终的效果如下：

![Mar-20-2023 15-31-13.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/527df583bb3c4813bb911bd05eff9e0f~tplv-k3u1fbpfcp-zoom-1.image)

## 小结

这一节课，我们通过封装 HTTP 服务，实现了用浏览器控制 SPP 协议的蓝牙设备。本节课我们只演示了基本的功能，而且我们从设计上保持服务器代码的简洁。接下来的课程中，我会对客户端代码进行设计，实现更加完善的封装，这样我们就可以更灵活地操作我们的蓝牙设备，来实现一些有趣的复杂的功能了。