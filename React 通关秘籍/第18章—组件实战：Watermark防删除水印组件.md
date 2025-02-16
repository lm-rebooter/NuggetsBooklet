很多网页会加上水印，用于版权标识、防止盗用等。

比如这样：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3936f1b365a4bf690a0d220898de561~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1132&h=978&s=286930&e=png&b=fdfdfd)

[ant design](https://ant.design/components/watermark-cn/) 和 [arco design](https://arco.design/react/components/watermark) 都提供了 Watermark 水印组件。

这种水印是咋实现的呢？

调试下就知道了：

arco design 的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b225f38aebe3473b8ce9319eb5d8abfe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2476&h=1330&s=440465&e=png&b=ffffff)

ant desigin 的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88e9e983710f43f18bafc898e35238a2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2472&h=1352&s=597400&e=png&b=fefefe)

首先，有一个 div 覆盖在需要加水印的区域，宽高 100%，绝对定位，设置 pointer-events:none 也就是不响应鼠标事件。

然后 background 设置 repeat，用 background image 平铺。

那这个 image 是什么呢？

点击这个 data url：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48f361ed02084862b32deb47b6d9bddc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1322&h=916&s=182786&e=png&b=fbfbfb)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a203bd7396614618af4aae784cd47525~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2098&h=1146&s=95796&e=png&b=0e0e0e)

是个包含文字的图片。

而我们并没有传入图片作为参数：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cc88af7bbb44ee891ff0fcbbf2f1545~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=636&h=540&s=60865&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/821c09b31c3641c99956e464d0b9a62d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=690&h=358&s=44871&e=png&b=f7f8fa)

所以说要用 canvas 画出来，做一些旋转，并导出 base64 的图片，作为这个 div 的背景就好了。

当然，也可以传入图片作为水印：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71a4e176dac748fb8f10922a14523b24~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1710&h=762&s=110175&e=png&b=ffffff)

同样是用 canvas 画出来。

那怎么画呢？

根据[传入的参数](https://ant.design/components/watermark-cn#watermark)来画：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/317b114f90c34e89bb5593a9695f0c93~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1796&h=1232&s=204792&e=png&b=fefefe)

上面是 antd 的 Watermark 组件的参数。

可以传入宽高、旋转角度、字体样式、水印间距、水印偏移等。

虽然参数很多，但只是一些细节。

arco design 的 Watermark 组件画出的图片是上面的样子，所以 repeat 之后是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09853d2ab8dd4d3cae0a271277eb029a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1678&h=844&s=59761&e=png&b=ffffff)

如果仔细看你会发现 ant design 的 Watermark 组件是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/544b9913c5574e3eba2ee8030a2611ad~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1850&h=1132&s=121991&e=png&b=ffffff)

交错排列的。

这是因为它 canvas 画的内容就是交错的 2 个：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c6f24c2ab4e4e30b89817e8ff7689a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2096&h=1304&s=160287&e=png&b=e6e5e5)

整体思路是很清晰的：**用 canvas 把文字或者图片画出来，导出 base64 的 data url 设置为 div 的重复背景，这个 div 整个覆盖在需要加水印的元素上，设置 pointer-events 是 none。**

此外，上节还讲过通过 MutationObserver 监听 dom 的修改，改了之后重新添加水印。

antd 就是这么做的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46c803113ecd469cb1341c094636a47a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=1126&s=295537&e=jpg&b=1f1f1f)

思路理清了，我们来写下代码：

```
npx create-vite
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a310e622e924992b27a064dc24657f7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=890&h=432&s=82593&e=png&b=010101)

去掉 index.css 和 StrictMode：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4458be297c864415ab6f98998f25216b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=888&h=422&s=75356&e=png&b=1f1f1f)

然后写下 Watermark/index.tsx

```javascript
import { useRef, PropsWithChildren, CSSProperties, FC } from 'react';

export interface WatermarkProps extends PropsWithChildren {
    style?: CSSProperties;
    className?: string;
    zIndex?: string | number;
    width?: number;
    height?: number;
    rotate?: number;
    image?: string;
    content?: string | string[];
    fontStyle?: {
      color?: string;
      fontFamily?: string;
      fontSize?: number | string;
      fontWeight?: number | string;
    };
    gap?: [number, number];
    offset?: [number, number];
    getContainer?: () => HTMLElement;
}
  

const Watermark: FC<WatermarkProps>  = (props) => {

    const {
        className,
        style,
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        fontStyle,
        gap,
        offset
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    return props.children ? (
        <div
            className={className}
            style={style}
            ref={containerRef}
        >
            {props.children}
        </div>
    ) : null;
}

export default Watermark;
```
style、className 就不用解释了。

width、height、rotate、offset、gap 等都是水印的参数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/317bc4cae2204e3089c1b73f5f8ad30f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=738&h=586&s=98429&e=png&b=1f1f1f)

gap 是两个水印之间的空白距离。

offset 是水印相对于 container 容器的偏移量，也就是左上角的空白距离。

然后我们封装个 useWatermark 的自定义 hook 来绘制水印：

```javascript
import { useRef, PropsWithChildren, CSSProperties, FC, useCallback, useEffect } from 'react';
import useWatermark from './useWatermark';

export interface WatermarkProps extends PropsWithChildren {
    style?: CSSProperties;
    className?: string;
    zIndex?: string | number;
    width?: number;
    height?: number;
    rotate?: number;
    image?: string;
    content?: string | string[];
    fontStyle?: {
      color?: string;
      fontFamily?: string;
      fontSize?: number | string;
      fontWeight?: number | string;
    };
    gap?: [number, number];
    offset?: [number, number];
    getContainer?: () => HTMLElement;
}

const Watermark: FC<WatermarkProps>  = (props) => {

    const {
        className,
        style,
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        fontStyle,
        gap,
        offset
    } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    const getContainer = useCallback(() => {
        return props.getContainer ? props.getContainer() : containerRef.current!;
    }, [containerRef.current, props.getContainer]);

    const { generateWatermark } = useWatermark({
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        fontStyle,
        gap,
        offset,
        getContainer,
    });

    useEffect(() => {
        generateWatermark({
            zIndex,
            width,
            height,
            rotate,
            image,
            content,
            fontStyle,
            gap,
            offset,
            getContainer,
        });
    }, [
        zIndex,
        width,
        height,
        rotate,
        image,
        content,
        JSON.stringify(props.fontStyle),
        JSON.stringify(props.gap),
        JSON.stringify(props.offset),
        getContainer,
    ]);

    return props.children ? (
        <div
            className={className}
            style={style}
            ref={containerRef}
        >
            {props.children}
        </div>
    ) : null;
}

export default Watermark;
```

getContainer 默认用 containerRef.current，或者传入的 props.getContainer。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97ed0188c61442aaa18fb6541a72bce2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1138&h=1140&s=156677&e=png&b=1f1f1f)

调用 useWatermark，返回 generateWatermark 方法。

然后当参数变化的时候，重新调用 generateWatermark 绘制水印。

getContainer 我们加了 useCallback 避免每次都变，对象参数（fontSize）、数组参数（gap、offset）用 JSON.stringify 序列化后再放到 deps 数组里：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13e8cd5b0a0243659bad16b67499262e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=644&h=920&s=92163&e=png&b=1f1f1f)

然后来实现 useWatermark 的 hook。

新建 Watermark/useWatermark.ts

```javascript
import { useEffect, useState } from 'react';
import { WatermarkProps } from '.';
import { merge } from 'lodash-es';

export type WatermarkOptions = Omit<WatermarkProps, 'className' | 'style' | 'children'>; 

export default function useWatermark(params: WatermarkOptions) {
  const [options, setOptions] = useState(params || {});
  
  function drawWatermark() {

  }

  useEffect(() => {
    drawWatermark();
  }, [options]);

  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      setOptions(merge({}, options, newOptions));
    },
    destroy: () => {
    },
  };
}
```
参数就是 WatermarkProps 去了 style、className、children。

把传入的参数保存到 options 的 state，根据它渲染。

调用返回的 generateWatermark 的时候设置 options 触发重绘。

这里用到了 lodash-es 包的 merge 来合并参数。

安装下：

```
npm install --save lodash-es

npm i --save-dev @types/lodash-es
```

然后来处理下 options，和默认 options 做下合并：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efb55ec9a98948f3bf575bfc040cc3fe~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=1264&s=289884&e=png&b=1f1f1f)

这里的 toNumber 会把第一个参数转为 number，如果不是数字的话就返回第二个参数的默认值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c04100ab72c1455e89d914c2d3866061~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=458&s=92661&e=png&b=1f1f1f)

具体的合并逻辑是这样的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4240ce67ccd442a983dd76ff2b8427b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1182&h=596&s=162365&e=png&b=1f1f1f)


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83482633cb9d4727b22bb4ceb8e4ae1e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1378&h=842&s=223343&e=png&b=1f1f1f)

先合并传入的 options

然后如果没有传入的会用默认值。

fontStyle 是默认 fontStyle 和传入的 fontStyle 的合并

width 的默认值，如果是图片就用默认 width，否则 undefined，因为后面文字宽度是动态算的。

offset 的默认值是 0。

因为处理完之后肯定是有值的，所以断言为 Required\<WatermarkOptions> 类型。

这个 Required 是去掉可选用的，相对的，Partial 是给属性添加可选修饰。

合并完之后，就拿到绘制的 options 了。

```javascript
import { useEffect, useRef, useState } from 'react';
import { WatermarkProps } from '.';
import { merge } from 'lodash-es';

export type WatermarkOptions = Omit<WatermarkProps, 'className' | 'style' | 'children'>; 

export function isNumber(obj: any): obj is number {
  return Object.prototype.toString.call(obj) === '[object Number]' && obj === obj;
}

const toNumber = (value?: string | number, defaultValue?: number) => {
  if(value === undefined) {
    return defaultValue;
  }
  if (isNumber(value)) {
    return value;
  }
  const numberVal = parseFloat(value);
  return isNumber(numberVal) ? numberVal : defaultValue;
};

const defaultOptions = {
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: '16px',
    color: 'rgba(0, 0, 0, 0.15)',
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
  },
  getContainer: () => document.body,
};

const getMergedOptions = (o: Partial<WatermarkOptions>) => {
  const options = o || {};

  const mergedOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    width: toNumber(options.width, options.image ? defaultOptions.width : undefined),
    height: toNumber(options.height, undefined)!,
    getContainer: options.getContainer!,
    gap: [
      toNumber(options.gap?.[0], defaultOptions.gap[0]),
      toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
    ],
  } as Required<WatermarkOptions>;

  const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
  const mergedOffsetY = toNumber(mergedOptions.offset?.[1] || mergedOptions.offset?.[0], 0)!;
  mergedOptions.offset = [ mergedOffsetX, mergedOffsetY ];

  return mergedOptions;
};

export default function useWatermark(params: WatermarkOptions) {
  const [options, setOptions] = useState(params || {});

  const mergedOptions = getMergedOptions(options);

  function drawWatermark() {

  }

  useEffect(() => {
    drawWatermark();
  }, [options]);

  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      setOptions(merge({}, options, newOptions));
    },
    destroy: () => {
    },
  };
}
```

有了 options，接下来创建 dom，开始绘制：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45ee1df418e54878917fb4b53339b53a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=978&h=1182&s=229107&e=png&b=1f1f1f)
    
用 useRef 保存水印元素的 dom。
    
调用 getCanvasData 方法来绘制，返回 base64Url、width、height 这些信息。
    
生成水印的 dom 元素，挂载到 container 下，设置 style。

注意 background-size 是 gap + width、gap + height 算出的。

接下来只要实现 getCanvasData 方法，用 cavas 画出水印就好了。
    
```javascript
import { useEffect, useRef, useState } from 'react';
import { WatermarkProps } from '.';
import { merge } from 'lodash-es';

export type WatermarkOptions = Omit<WatermarkProps, 'className' | 'style' | 'children'>; 

export function isNumber(obj: any): obj is number {
  return Object.prototype.toString.call(obj) === '[object Number]' && obj === obj;
}

const toNumber = (value?: string | number, defaultValue?: number) => {
  if(!value) {
    return defaultValue;
  }
  if (isNumber(value)) {
    return value;
  }
  const numberVal = parseFloat(value);
  return isNumber(numberVal) ? numberVal : defaultValue;
};

const defaultOptions = {
  rotate: -20,
  zIndex: 1,
  width: 100,
  gap: [100, 100],
  fontStyle: {
    fontSize: '16px',
    color: 'rgba(0, 0, 0, 0.15)',
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
  },
  getContainer: () => document.body,
};

const getMergedOptions = (o: Partial<WatermarkOptions>) => {
  const options = o || {};

  const mergedOptions = {
    ...options,
    rotate: options.rotate || defaultOptions.rotate,
    zIndex: options.zIndex || defaultOptions.zIndex,
    fontStyle: { ...defaultOptions.fontStyle, ...options.fontStyle },
    width: toNumber(options.width, options.image ? defaultOptions.width : undefined),
    height: toNumber(options.height, undefined)!,
    getContainer: options.getContainer!,
    gap: [
      toNumber(options.gap?.[0], defaultOptions.gap[0]),
      toNumber(options.gap?.[1] || options.gap?.[0], defaultOptions.gap[1]),
    ],
  } as Required<WatermarkOptions>;

  const mergedOffsetX = toNumber(mergedOptions.offset?.[0], 0)!;
  const mergedOffsetY = toNumber(mergedOptions.offset?.[1] || mergedOptions.offset?.[0], 0)!;
  mergedOptions.offset = [ mergedOffsetX, mergedOffsetY ];

  return mergedOptions;
};



const getCanvasData = async (
  options: Required<WatermarkOptions>,
): Promise<{ width: number; height: number; base64Url: string }> => {

};



export default function useWatermark(params: WatermarkOptions) {
  const [options, setOptions] = useState(params || {});

  const mergedOptions = getMergedOptions(options);
  const watermarkDiv = useRef<HTMLDivElement>();

  const container = mergedOptions.getContainer();
  const { zIndex, gap } = mergedOptions;

  function drawWatermark() {
    if (!container) {
      return;
    }

    getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {
      const wmStyle = `
      width:100%;
      height:100%;
      position:absolute;
      top:0;
      left:0;
      bottom:0;
      right:0;
      pointer-events: none;
      z-index:${zIndex};
      background-position: 0 0;
      background-size:${gap[0] + width}px ${gap[1] + height}px;
      background-repeat: repeat;
      background-image:url(${base64Url})`;

      if (!watermarkDiv.current) {
        const div = document.createElement('div');
        watermarkDiv.current = div;
        container.append(div);
        container.style.position = 'relative';
      }

      watermarkDiv.current?.setAttribute('style', wmStyle.trim());
    });
  }

  useEffect(() => {
    drawWatermark();
  }, [options]);

  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      setOptions(merge({}, options, newOptions));
    },
    destroy: () => {
    },
  };
}
```

接下来实现 getCanvasData 方法。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04aac08748cc4a0ab3e5243855029803~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=858&h=638&s=115669&e=png&b=1f1f1f)

创建个 canvas 元素，拿到画图用的 context。

封装 drawText、drawImage 两个方法，优先绘制 image。

然后封装个 configCanvas 方法，用来设置 canvas 的宽高、rotate、scale：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc00dde7dc1f439c90e42c55dfdcfd7d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=1032&s=218732&e=png&b=1f1f1f)

宽高同样是 gap + width、gap + height。

用 tanslate 移动中心点到 宽高的一半的位置再 schale、rotate。

因为不同屏幕的设备像素比不一样，也就是 1px 对应的物理像素不一样，所以要在单位后面乘以 devicePixelRatio。

我们设置了 scale 放大 devicePixelRatio 倍，这样接下来绘制尺寸就不用乘以设备像素比了。

```javascript
const getCanvasData = async (
  options: Required<WatermarkOptions>,
): Promise<{ width: number; height: number; base64Url: string }> => {

  const { rotate, image, content, fontStyle, gap } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  const ratio = window.devicePixelRatio;

  const configCanvas = (size: { width: number, height: number }) => {
    const canvasWidth = gap[0] + size.width;
    const canvasHeight = gap[1] + size.height;

    canvas.setAttribute('width', `${canvasWidth * ratio}px`);
    canvas.setAttribute('height', `${canvasHeight * ratio}px`);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);
    ctx.scale(ratio, ratio);

    const RotateAngle = (rotate * Math.PI) / 180;
    ctx.rotate(RotateAngle);
  };

  const drawText = () => {
    
  };

  function drawImage() {
  
  }
  
  return image ? drawImage() : drawText();
};
```

先来实现 drawImage：

```javascript
function drawImage() {
  return new Promise<{ width: number; height: number; base64Url: string }>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    img.src = image;
    img.onload = () => {
      let { width, height } = options;
      if (!width || !height) {
        if (width) {
          height = (img.height / img.width) * +width;
        } else {
          width = (img.width / img.height) * +height;
        }
      }
      configCanvas({ width, height });

      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      return resolve({ base64Url: canvas.toDataURL(), width, height });
    };
    img.onerror = () => {
      return drawText();
    };
  });
}
```
new Image 指定 src 加载图片。

onload 的时候，对于没有设置 width 或 height 的时候，根据图片宽高比算出另一个值。

然后调用 configCanvas 修改 canvas 的宽高、缩放、旋转。

之后在中心点绘制一张图片，返回 base64 的结果。

当加载失败时，onerror 里绘制文本。

这里的 crssOrign 设置 anonymous 是跨域的时候不携带 cookie，而 refererPolicy 设置 no-referrer 是不携带 referer，都是安全相关的。

然后实现 drawText：

```javascript
const drawText = () => {
  const { fontSize, color, fontWeight, fontFamily } = fontStyle;
  const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize;

  ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
  const measureSize = measureTextSize(ctx, [...content], rotate);

  const width = options.width || measureSize.width;
  const height = options.height || measureSize.height;

  configCanvas({ width, height });

  ctx.fillStyle = color!;
  ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
  ctx.textBaseline = 'top';

  [...content].forEach((item, index) => {
    const { height: lineHeight, width: lineWidth } = measureSize.lineSize[index];

    const xStartPoint = -lineWidth / 2;
    const yStartPoint = -(options.height || measureSize.originHeight) / 2 + lineHeight * index;

    ctx.fillText(
      item,
      xStartPoint,
      yStartPoint,
      options.width || measureSize.originWidth
    );
  });
  return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
};
```
fontSize 转为 number。

如果没有传入 width、height 就自己计算，这个 measureTextSize 待会实现。

设置 textBaseline 为 top，顶部对齐。

然后依次绘制文字。

绘制文字要按照坐标来，在 measureTextSize 里计算出每一行的 lineSize，也就是行高、行宽。

在行宽的一半的地方开始绘制文字，行内每个文字的位置是行高的一半 * index。

然后实现 measureTextSize 方法：

```javascript
const measureTextSize = (
  ctx: CanvasRenderingContext2D,
  content: string[],
  rotate: number
) => {
  let width = 0;
  let height = 0;
  const lineSize: Array<{width: number, height: number}> = [];

  content.forEach((item) => {
    const {
      width: textWidth,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent,
    } = ctx.measureText(item);

    const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

    if (textWidth > width) {
      width = textWidth;
    }

    height += textHeight;
    lineSize.push({ height: textHeight, width: textWidth });
  });

  const angle = (rotate * Math.PI) / 180;

  return {
    originWidth: width,
    originHeight: height,
    width: Math.ceil(Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width)),
    height: Math.ceil(Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle))),
    lineSize,
  };
};
```
ctx.measureText 是用来测量文字尺寸的。

fontBoudingAscent 是 baseline 到顶部的距离，而 fontBoundingBoxDescent 是到底部的距离：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ee0ae9e0e03451aaf227adbe0f9e1ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1578&h=512&s=131003&e=png&b=fdfdfd)

加起来就是行高。

然后如果有旋转的话，要用 sin、cos 函数算出旋转后的宽高。

这样经过计算和绘制，文字和图片的水印就都完成了。

我们测试下：

改下 App.tsx
```javascript
import Watermark from "./Watermark";

const App = () => {
  return <Watermark
    content={['测试水印', '神说要有光']}
  >
   <div style={{height: 800}}>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
   </div>
  </Watermark>
};

export default App;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0c992c64352448b9e78cf1f98b80369~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2204&h=1038&s=375103&e=png&b=fefefe)

把 gap 设为 0：

```javascript
import Watermark from "./Watermark";

const App = () => {
  return <Watermark
    content={['测试水印', '神说要有光']}
    gap={[0, 0]}
    fontStyle={{
        color: 'green'
    }}
  >
   <div style={{height: 800}}>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
   </div>
  </Watermark>
};

export default App;
```
也没问题：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7532a390db5d4bbb8b9c434656539353~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1486&h=842&s=880166&e=png&b=fefefe)

只是现在 offset 还没有支持，也就是左上角的空白距离。

这个就是改下 left、top 的值就好了，当然，width、height 也要从 100% 减去这块距离。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f649fb393dd459580712d918df7b69b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936&h=352&s=80293&e=png&b=1f1f1f)

```javascript
const offsetLeft = mergedOptions.offset[0] + 'px';
const offsetTop = mergedOptions.offset[1] + 'px';

const wmStyle = `
width:calc(100% - ${offsetLeft});
height:calc(100% - ${offsetTop});
position:absolute;
top:${offsetTop};
left:${offsetLeft};
bottom:0;
right:0;
pointer-events: none;
z-index:${zIndex};
background-position: 0 0;
background-size:${gap[0] + width}px ${gap[1] + height}px;
background-repeat: repeat;
background-image:url(${base64Url})`;
```
测试下：

```javascript
import Watermark from "./Watermark";

const App = () => {
  return <Watermark
    content={['测试水印', '神说要有光']}
    gap={[0, 0]}
    offset={[50, 100]}
    fontStyle={{
        color: 'green'
    }}
  >
   <div style={{height: 800}}>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos quod deserunt quidem quas in rem ipsam ut nesciunt asperiores dignissimos recusandae minus, eaque, harum exercitationem esse sapiente? Eveniet, id provident!</p>
   </div>
  </Watermark>
};

export default App;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0394549023345b5a9491cc251691498~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1262&h=1220&s=533143&e=png&b=fdfbfb)

这样水印组件就完成了。

但现在的水印组件作用并不大，因为只要打开 devtools 就能轻易删掉。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd6935c1babd467baa1e5d58fd0c7252~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1972&h=1270&s=1769904&e=gif&f=23&b=d2e6fb)

我们要加上防删功能，前面讲过，用 MutationObserver：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5c5c8c6d47f4e7e8a4c80bbec122026~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=842&h=332&s=84625&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/098b9edacf1447f7ad49d3a921f97224~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1454&h=1072&s=243766&e=png&b=1f1f1f)

创建完水印节点后，首先 disnonnect 去掉之前的 MutationObserver 的监听，然后创建新的 MutationObserver 监听 container 的变动。

```javascript
export default function useWatermark(params: WatermarkOptions) {
  const [options, setOptions] = useState(params || {});

  const mergedOptions = getMergedOptions(options);
  const watermarkDiv = useRef<HTMLDivElement>();
  const mutationObserver = useRef<MutationObserver>();

  const container = mergedOptions.getContainer();
  const { zIndex, gap } = mergedOptions;

  function drawWatermark() {
    if (!container) {
      return;
    }

    getCanvasData(mergedOptions).then(({ base64Url, width, height }) => {

      const offsetLeft = mergedOptions.offset[0] + 'px';
      const offsetTop = mergedOptions.offset[1] + 'px';

      const wmStyle = `
      width:calc(100% - ${offsetLeft});
      height:calc(100% - ${offsetTop});
      position:absolute;
      top:${offsetTop};
      left:${offsetLeft};
      bottom:0;
      right:0;
      pointer-events: none;
      z-index:${zIndex};
      background-position: 0 0;
      background-size:${gap[0] + width}px ${gap[1] + height}px;
      background-repeat: repeat;
      background-image:url(${base64Url})`;

      if (!watermarkDiv.current) {
        const div = document.createElement('div');
        watermarkDiv.current = div;
        container.append(div);
        container.style.position = 'relative';
      }

      watermarkDiv.current?.setAttribute('style', wmStyle.trim());

      if (container) {
        mutationObserver.current?.disconnect();

        mutationObserver.current = new MutationObserver((mutations) => {
          const isChanged = mutations.some((mutation) => {
            let flag = false;
            if (mutation.removedNodes.length) {
              flag = Array.from(mutation.removedNodes).some((node) => node === watermarkDiv.current);
            }
            if (mutation.type === 'attributes' && mutation.target === watermarkDiv.current) {
              flag = true;
            }
            return flag;
          });
          if (isChanged) {
            watermarkDiv.current = undefined;
            drawWatermark();
          }
        });

        mutationObserver.current.observe(container, {
          attributes: true,
          subtree: true,
          childList: true,
        });
      }
    });
  }

  useEffect(() => {
    drawWatermark();
  }, [options]);

  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      setOptions(merge({}, options, newOptions));
    },
    destroy: () => {
    },
  };
}
```
上节讲过，MutationObserver 可以监听子节点的变动和节点属性变动：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d2b3290ac244c319a307dfe74d9aad8~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35be2e97254f41d9b04e8e7544a1c12b~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e22cf73b71342069320a7067fc7d9ef~tplv-k3u1fbpfcp-watermark.image?)

所以我们判断水印是否删除是通过判断是否修改了 watermark 节点的属性，是否增删了 watermark 节点：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7809dec7c3de4774b0c791bc3af969e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1414&h=682&s=152320&e=png&b=1f1f1f)

是的话，就把 watermarkDiv.current 置空然后重新绘制。

测试下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c61ea9bda874c68a65280b11703cd6d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2656&h=1438&s=3083503&e=gif&f=39&b=fdfdfd)

现在修改节点属性，或者删掉水印节点的时候，就会绘制一个新的。

这样，就达到了防止删除水印的功能。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/watermark-component)

## 总结

这节我们实现了 Watermark 水印组件。

水印的实现原理就是加一个和目标元素宽高一样的 div 覆盖在上面，设置 pointer-events:none 不响应鼠标事件。

然后背景用水印图片 repeat 实现。

这个水印图片是用 canvas 画的，传入文字或者图片，会计算 gap、文字宽高等，在正确的位置绘制出来。

之后转成 base64 之后设置为 background-image。

此外，还要支持防删除功能，也就是用 MutationObserver 监听水印节点的属性变动、节点删除等，有变化就重新绘制一个。

这样，我们就实现了有防删功能的 Watermark 水印组件。
