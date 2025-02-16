前面学了 AudioContext，它可以通过调整波形、频率产生不同的声音。

这节我们就用它来实现一个在线钢琴。

css 我们用过 CSS Modules、用过 tailwind，这节用 css in js 方法 styled-components 来写。

创建个项目：

```
npx create-vite online-piano
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90fff9fb67284f83bf98177308694638~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=812&h=376&s=69223&e=png&b=000000)

安装 styled-components

```javascript
npm install

npm install --save styled-components
```

去掉 index.css 和 StrictMode：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5711302b486a47f8ae579120f8dd7add~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1016&h=444&s=84214&e=png&b=1f1f1f)

然后改下 App.tsx：

```javascript
import { styled, createGlobalStyle, css } from "styled-components"

function App() {

  const keys: Record<string, { frequency: number }> = {
    A: {
      frequency: 196
    },
    S: {
      frequency: 220
    },
    D: {
      frequency: 246
    },
    F: {
      frequency: 261
    },
    G: {
      frequency: 293
    },
    H: {
      frequency: 329
    },
    J: {
      frequency: 349
    },
    K: {
      frequency: 392
    }
  }

  const GlobalStyles = createGlobalStyle`
    body {
      background: #000;
    }
  `;


  const KeysStyle = styled.div`
    width: 800px;
    height: 400px;
    margin: 40px auto;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow: hidden;
  `
  const textStyle = css`
    line-height: 500px;
    text-align: center;
    font-size: 50px;
  `

  const KeyStyle = styled.div`
    border: 4px solid black;
    background: #fff;
    flex: 1;
    ${textStyle}

    &:hover {
      background: #aaa;
    }
  `

  const play = (key: string) => {
    const frequency = keys[key]?.frequency;
    if(!frequency) {
      return;
    }


  }

  return <KeysStyle as='section'>
    {
      Object.keys(keys).map((item: any) => {
        return  <KeyStyle as='div' key={item}>
          <div onClick={() => play(item)}>
            <span>{item}</span>
          </div>
        </KeyStyle>
      })
    }
    <GlobalStyles />
  </KeysStyle>
}

export default App
```
这里用一个对象来保存所有的 key 和对应的频率。

用 styled-components 来写样式。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fce6606898e74fec9525beb3d51b5f67~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=850&h=1234&s=149078&e=png&b=1f1f1f)

这里用到 3 个 styled-components 的 api：

用 styled.xxx 写样式组件。

用 createGlobalStyle 写全局样式。

用 css 创建复用的 css 片段。

样式组件自然就是可以当作组件来用的：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d972d23fb7a4d649a119d2134917f4c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=946&h=660&s=106772&e=png&b=1f1f1f)

这也是用了 styled-components 的代码的特点。

可以用 as 修改渲染的标签。

跑起来看下：

```
npm run start:dev
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c150844c18948d5bd27066e56aa8df8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=812&h=262&s=36746&e=png&b=191919)

看下效果：

![2024-08-30 21.49.47.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/568dc20fe192487cb197ae1a7f2a46e8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2862&h=1352&s=238208&e=gif&f=30&b=010101)

没啥问题。

打开控制台看下：


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03d841bb08f141a694a08900235cfc89~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1380&h=1152&s=270357&e=png&b=ffffff)

可以看到，className 是编译过的，完全不用担心样式冲突问题。

这就是 styled-components 的好处之一。

这样，样式部分就写完了。

然后我们来写 Audio 部分：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5e670827da4473b95945b83b40c0d55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1272&h=1052&s=219847&e=png&b=1f1f1f)

```javascript
const context = useMemo(()=> {
    return new AudioContext();
}, []);

const play = (key: string) => {
    const frequency = keys[key]?.frequency;
    if(!frequency) {
      return;
    }

    const osc = context.createOscillator();
    osc.type = 'sine';

    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);

    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);

    osc.start(context.currentTime);

    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1);
    osc.stop(context.currentTime + 1);
}
```
我们从上到下看下代码：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2c06c59a39144c7b80cfc8b829f71ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=756&h=678&s=116984&e=png&b=1f1f1f)

首先，创建 AudioContext，这个不需要每次渲染都创建，所以用 useMemo 包裹。

然后创建 oscillator 节点、gain 节点、destination 节点，连接起来。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b7355f7f1854403a0d0b69d6b46eaea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=256&s=21626&e=png&b=ffffff)

这些我们比较熟悉了。

重点是下面部分：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ebf8ffbc79b466a9e9253d9d713e7b1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1098&h=278&s=70095&e=png&b=1f1f1f)

前面我们用 GainNode 修改音量的方式都是直接改 value。

其实它可以按照某种规律修改音量。

我们在 currentTime 当前时间设置音量为 0 

然后 0.01 秒后设置为 1，也就是声音是逐渐变大的（linear 是线性）

然后在 1 秒后设置音量为 0.01，也就是声音指数级的变小。（exponential 是指数级）

这样，按每个键声音都是一秒，但这一秒内有音量从小到大再到小的变化。

大概是这样变化的：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbd718aa645b4e2ba5654e5a668a6ab0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1040&h=644&s=37988&e=png&b=ffffff)

这样听起来就很自然。

正好 start 到 stop 间隔 1 秒，就是按照上面的规律变化的音量：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4003712280a487da5e70f795d54a739~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1074&h=306&s=70213&e=png&b=1f1f1f)

我们试一下：


![2024-08-30 21.49.47.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0966e2b04004261b4b17df93b7fd6fe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2862&h=1352&s=238208&e=gif&f=30&b=010101)

声音是这样的：

[jaudio](https://lf-activity-static.juejin.cn/obj/juejin-activity-static/user_book/2788017216685118_1725027188795_5197.mp3)

是不是很自然！

如果没有音量变化是什么样呢？

注释掉试试：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6735ae3938ab45798867687ae007e393~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1166&h=342&s=68165&e=png&b=1f1f1f)

听下现在的声音：

[jaudio](https://lf-activity-static.juejin.cn/obj/juejin-activity-static/user_book/2788017216685118_1725027422304_7077.mp3)

音量完全没变化，听起来就不好听。

现在我们可以点击对应的键来演奏音乐了。

但这样不方便，我们再加上键盘控制：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e30922f76bc482aab29e22a5b4ce854~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=1030&s=213262&e=png&b=1f1f1f)

监听 keydown 事件，调用 play 方法传入 key 就可以了。

但按键盘不会触发 hover 效果，所以我们手动加一下 className 来显示按下的效果。

在 global style 加一下这个全局的 className：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76a19c7c451441c68c16bdf06c3d2ee8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=888&h=468&s=58856&e=png&b=1f1f1f)

全局 className 不会被编译。

试一下：


![2024-08-30 22.09.23.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ca3aeaa76cd4835be6f071f7824e1dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2862&h=1352&s=307704&e=gif&f=42&b=000000)

这样，按键盘就可以弹奏了。

然后我们用它来演奏几首歌曲：

从网上找下歌曲的简谱：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/112b8ad8b11444f1ba064a84e0224e2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=602&h=430&s=81533&e=png&b=fefefe)

这里我们就只演奏第一句吧


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b694d35c59444a4882e483d2b3ddf432~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1140&h=1184&s=191253&e=png&b=1f1f1f)


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4939618806ca4f5aa543f51227924e94~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=1184&s=150814&e=png&b=1f1f1f)

我们定义了简谱数字和键的对应关系。

然后不同的时间按下不同的键就可以了。

```javascript
import { useEffect, useMemo } from "react";
import { styled, createGlobalStyle, css } from "styled-components"

function App() {

  const keys: Record<string, { frequency: number }> = {
    A: {
      frequency: 196
    },
    S: {
      frequency: 220
    },
    D: {
      frequency: 246
    },
    F: {
      frequency: 261
    },
    G: {
      frequency: 293
    },
    H: {
      frequency: 329
    },
    J: {
      frequency: 349
    },
    K: {
      frequency: 392
    }
  }

  const GlobalStyles = createGlobalStyle`
    body {
      background: #000;
    }
    .pressed {
      background: #aaa;
    }
  `;


  const KeysStyle = styled.div`
    width: 800px;
    height: 400px;
    margin: 40px auto;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow: hidden;
  `
  const textStyle = css`
    line-height: 500px;
    text-align: center;
    font-size: 50px;
  `

  const KeyStyle = styled.div`
    border: 4px solid black;
    background: #fff;
    flex: 1;
    ${textStyle}

    &:hover {
      background: #aaa;
    }
  `

  const context = useMemo(()=> {
    return new AudioContext();
  }, []);

  const play = (key: string) => {
    const frequency = keys[key]?.frequency;
    if(!frequency) {
      return;
    }

    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;
  
    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);
  
    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);

    osc.start(context.currentTime);
  
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1);
    osc.stop(context.currentTime + 1);

    document.getElementById(`key-${key}`)?.classList.add('pressed');
    setTimeout(()=> {
      document.getElementById(`key-${key}`)?.classList.remove('pressed');
    }, 100)
  }

  useEffect(()=> {
    document.addEventListener('keydown', (e) => {
      play(e.key.toUpperCase());
    })
  }, []);

  const map: Record<number, string> = {
    1: 'A',
    2: 'S',
    3: 'D',
    4: 'F',
    5: 'G',
    6: 'H',
    7: 'J',
    8: 'K'
  }

  function playSong1() {
    const music = [
        [6, 1000],
        [5, 1000],
        [3, 1000],
        [5, 1000],
        [8, 1000],
        [6, 500],
        [5, 500],
        [6, 1000]
    ];

    let startTime = 0;
    music.forEach((item) => {
      setTimeout(() => {
        play(map[item[0]]);
      }, startTime);
      startTime += item[1]
    })   
  }

  return <div>
    <KeysStyle as='section'>
      {
        Object.keys(keys).map((item: any) => {
          return  <KeyStyle as='div' key={item}>
            <div onClick={() => play(item)} id={`key-${item}`}>
              <span>{item}</span>
            </div>
          </KeyStyle>
        })
      }
      <GlobalStyles />
    </KeysStyle>
    <div className='songs'>
      <button onClick={() => playSong1()}>世上只有妈妈好</button>
    </div>
  </div>
}

export default App
```

听一下：

![2024-08-30 22.36.06.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/143292c0274847a98e0e4812488a53ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2862&h=1352&s=197555&e=gif&f=65&b=010101)

[jaudio](https://lf-activity-static.juejin.cn/obj/juejin-activity-static/user_book/2788017216685118_1725028699155_9504.mp3)

再加一首《奢香夫人》：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f72e6b3b930401685b0a054c95827bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=1152&s=549179&e=png&b=fdfdfd)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/471b9c684bce4cb9bc29131a479479d5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1172&h=1410&s=235750&e=png&b=1f1f1f)

抽取一个 playMusic 的方法，并且 startTime 缩短一半。

```javascript
function playMusic(music: number[][]) {
    let startTime = 0;
    music.forEach((item) => {
      setTimeout(() => {
        play(map[item[0]]);
      }, startTime * 0.5);
      startTime += item[1]
    }) 
}

function playSong2() {
    const music = [
        [6, 1000],
        [6, 1000],
        [6, 1000],
        [3, 500],
        [6, 500],
        [5, 1000],
        [3, 500],
        [2, 500],
        [3, 1000]
    ];

    playMusic(music)
}
```

```javascript
<button onClick={() => playSong2()}>奢香夫人</button>
```

听一下：

![2024-08-30 23.03.28.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/685c4b2c65dc44029909f05a55e1a688~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2862&h=1352&s=167052&e=gif&f=39&b=010101)

[jaudio](https://lf-activity-static.juejin.cn/obj/juejin-activity-static/user_book/2788017216685118_1725030624858_9137.mp3)

至此，我们的在线钢琴就完成了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/online-piano)

## 总结

上节学了 AudioContext 的振荡器调音，这节我们基于 AudioContext 实现了一个在线钢琴。

不同键只是振动频率不同，然后按下的时候设置音量有个从小到大再到小的变化就好了。

我们用 styled-components 写的样式，它是通过组件的方式来使用某段样式。

我们监听了 keydown 事件，触发不同键的按下的处理。

然后根据简谱，通过不同 setTimeout 实现了乐曲的自动播放。

做完这个案例，我们会对 AudioContext 有更深的理解。
