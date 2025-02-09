日历组件想必大家都用过，在各个组件库里都有。

比如 antd 的 Calendar 组件（或者 DatePicker 组件）：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09c6879de7524b86954c204db9e53506~tplv-k3u1fbpfcp-watermark.image?)

那这种日历组件是怎么实现的呢？

其实原理很简单，今天我们就来自己实现一个。

首先，要过一下 Date 的 api：

创建 Date 对象时可以传入年月日时分秒。

比如 2023 年 7 月 30，就是这么创建：

```javascript
new Date(2023, 6, 30);
```

可以调用 toLocaleString 来转成当地日期格式的字符串显示：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78612afc9d824ca1bc0dd62ecc05f81d~tplv-k3u1fbpfcp-watermark.image?)

有人说 7 月为啥第二个参数传 6 呢？

因为 Date 的 month 是从 0 开始计数的，取值是 0 到 11：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be98fc0eda5c45d28eddca3189a2ef50~tplv-k3u1fbpfcp-watermark.image?)

而日期 date 是从 1 到 31。

而且有个小技巧，当你 date 传 0 的时候，取到的是上个月的最后一天：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de5bbe74b5c04341b60e2e2cca1a704e~tplv-k3u1fbpfcp-watermark.image?)

-1 就是上个月的倒数第二天，-2 就是倒数第三天这样。

这个小技巧有很大的用处，可以用这个来拿到每个月有多少天：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1421c06d6b5848c9bc41705d2a1716b4~tplv-k3u1fbpfcp-watermark.image?)

2023 年一月 31 天、二月 28 天、三月 31 天。。。

除了日期外，也能通过 getFullYear、getMonth 拿到年份和月份：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/969daa4d5cd449b78547268dc23b95c5~tplv-k3u1fbpfcp-watermark.image?)

还可以通过 getDay 拿到星期几。

比如今天（2023-7-19）是星期三：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/256a8d8fe1a74b748b8abb99a09098d5~tplv-k3u1fbpfcp-watermark.image?)

就这么几个 api 就已经可以实现日历组件了。

不信？我们来试试看：

用 cra 创建 typescript 的 react 项目：

```
npx create-react-app --template=typescript mini-calendar-test
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c09a568320a41179606104a45636e9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=308&s=99692&e=png&b=000000)

我们先来写下静态的布局：

一个 header，然后是从星期日到星期六，再下面是从 1 到 31：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fca913daf8d4afd99c6dfb8a087f373~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=948&h=960&s=118617&e=png&b=fdfdfd)

改下 App.tsx:

```javascript
import React from 'react';
import './index.css';

function Calendar() {
  return (
    <div className="calendar">
      <div className="header">
        <button>&lt;</button>
        <div>2023 年 7 月</div>
        <button>&gt;</button>
      </div>
      <div className="days">
        <div className="day">日</div>
        <div className="day">一</div>
        <div className="day">二</div>
        <div className="day">三</div>
        <div className="day">四</div>
        <div className="day">五</div>
        <div className="day">六</div>
        <div className="empty"></div>
        <div className="empty"></div>
        <div className="day">1</div>
        <div className="day">2</div>
        <div className="day">3</div>
        <div className="day">4</div>
        <div className="day">5</div>
        <div className="day">6</div>
        <div className="day">7</div>
        <div className="day">8</div>
        <div className="day">9</div>
        <div className="day">10</div>
        <div className="day">11</div>
        <div className="day">12</div>
        <div className="day">13</div>
        <div className="day">14</div>
        <div className="day">15</div>
        <div className="day">16</div>
        <div className="day">17</div>
        <div className="day">18</div>
        <div className="day">19</div>
        <div className="day">20</div>
        <div className="day">21</div>
        <div className="day">22</div>
        <div className="day">23</div>
        <div className="day">24</div>
        <div className="day">25</div>
        <div className="day">26</div>
        <div className="day">27</div>
        <div className="day">28</div>
        <div className="day">29</div>
        <div className="day">30</div>
        <div className="day">31</div>
      </div>
    </div>
  );
}

export default Calendar;
```

直接跑起来看下渲染结果再讲布局：

```
npm run start
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e42728dcebf458b8dc8c327ba5a7d27~tplv-k3u1fbpfcp-watermark.image?)

这种布局还是挺简单的：

header 就是一个 space-between 的 flex 容器：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c6aac1529dc460da9cc044a029ec864~tplv-k3u1fbpfcp-watermark.image?)

下面是一个 flex-wrap 为 wrap，每个格子宽度为 100% / 7 的 flex 容器：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94798a90d05b4cedb56ad218cda2c758~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8922dd22da2447a38b9a9fc3b934f071~tplv-k3u1fbpfcp-watermark.image?)

全部样式如下：

```css
.calendar {
  border: 1px solid #aaa;
  padding: 10px;
  width: 300px;
  height: 250px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.days {
  display: flex;
  flex-wrap: wrap;
}

.empty, .day {
  width: calc(100% / 7);
  text-align: center;
  line-height: 30px;
}

.day:hover {
  background-color: #ccc;
  cursor: pointer;
}
```
然后我们再来写逻辑：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03e58c7c4f9b47299f705ee8c13b363d~tplv-k3u1fbpfcp-watermark.image?)

首先，我们肯定要有一个 state 来保存当前的日期，默认值是今天。

然后点击左右按钮，会切换到上个月、下个月的第一天。

```javascript
const [date, setDate] = useState(new Date());

const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
};

const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
};
```

然后渲染的年月要改为当前 date 对应的年月：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/407a28f8c6644a43bdb35a3009fa41d6~tplv-k3u1fbpfcp-watermark.image?)

```javascript
const monthNames = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
];
```

我们试试看：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1280eb5c25c04948be584a147a94357a~tplv-k3u1fbpfcp-watermark.image?)

年月部分没问题了。

再来改下日期部分：

我们定义一个 renderDays 方法：

```javascript
const daysOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

const renderDays = () => {
    const days = [];

    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    for (let i = 1; i <= daysCount; i++) {
      days.push(<div key={i} className="day">{i}</div>);
    }

    return days;
};
```
首先定义个数组，来存储渲染的内容。

然后计算当前月有多少天，这里用到了前面那个 new Date 时传入 date 为 0 的技巧。

再计算当前月的第一天是星期几，也就是 new Date(year, month, 1).getDay()

这样就知道从哪里开始渲染，渲染多少天了。

然后先一个循环，渲染 day - 1 个 empty 的块。

再渲染 daysCount 个 day 的块。

这样就完成了日期渲染：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67156d126e764dd3885a509177f986b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1216&h=1304&s=270458&e=png&b=1f1f1f)

我们来试试看：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4432dc0073d34f66b5dee492cbbf54b6~tplv-k3u1fbpfcp-watermark.image?)

没啥问题。

这样，我们就完成了一个 Calendar 组件！

是不是还挺简单的？

确实，Calendar 组件的原理比较简单。

接下来，我们增加两个参数，value 和 onChange。

这俩参数和 antd 的 Calendar 组件一样。

value 参数设置为 date 的初始值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aa99b11b5324719b00e2ca6948c2aac~tplv-k3u1fbpfcp-watermark.image?)

我们试试看：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95ca0fa280ea494a948a5346de5629b2~tplv-k3u1fbpfcp-watermark.image?)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d6070cdeee040da8dd8bd21315ae1df~tplv-k3u1fbpfcp-watermark.image?)

年月是对了，但是日期对不对我们也看不出来，所以还得加点选中样式：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e82366355e56421a9661d5f3484bac1c~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26ccd528c4834afa84f537895fe20285~tplv-k3u1fbpfcp-watermark.image?)

现在就可以看到选中的日期了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be5612d872e745f69dcd490d41ee39a9~tplv-k3u1fbpfcp-watermark.image?)

没啥问题。

然后我们再加上 onChange 的回调函数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d5afbea2e7a45f6b881a134a7df774e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1398&h=748&s=178581&e=png&b=1f1f1f)

```javascript
const clickHandler = onChange?.bind(null, new Date(date.getFullYear(), date.getMonth(), i));
```

就是在点击 day 的时候，调用 bind 了对应日期的 onChange 函数。

我们试试看：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1478aa38c3aa466da365bbf63f92300f~tplv-k3u1fbpfcp-watermark.image?)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/818e215df8b0432f9fac6051f8b0ea55~tplv-k3u1fbpfcp-watermark.image?)

也没啥问题。

现在这个 Calendar 组件就是可用的了，可以通过 value 来传入初始的 date 值，修改 date 之后可以在 onChange 里拿到最新的值。

大多数人到了这一步就完成 Calendar 组件的封装了。

这当然没啥问题。

但其实你还可以再做一步，提供 ref 来暴露一些 Canlendar 组件的 api。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49971ea0652d4d6395d97fa132b8ab1f~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f361faa0c0ae458995e2202ae497532d~tplv-k3u1fbpfcp-watermark.image?)

前面章节讲过，useImperativeHandle 可以自定义 ref 的内容。

然后用的时候就可以通过 useRef 创建 ref 对象，设置到 Calendar 的 ref 属性上，拿到转发出的 ref 内容：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb99048d2c48439e9c0fee148e0276e3~tplv-k3u1fbpfcp-watermark.image?)

试试看：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ef34f23e0e64a5d8b8a6a57a959712e~tplv-k3u1fbpfcp-watermark.image?)

ref 的 api 也都生效了。

这就是除了 props 之外，另一种暴露组件 api 的方式。

现在的 Calender 除了本月的日期外，其余的地方是用空白填充的。很多日历用的是上个月、下个月的日期。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66d6435f71884aa5b10800ea8431c3b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=950&h=970&s=122164&e=png&b=fdfdfd)

这个也很简单，new Date(year, month + 1, 0) 是拿到当前月的第一天，那 -1 就是上个月的最后一天，-2 就是倒数第二天。

下个月的也是同理，用当前月最后一天 +1、+2 即可。

全部代码如下：

```javascript
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import './index.css';

interface CalendarProps {
  value?: Date,
  onChange?: (date: Date) => void
}

interface CalendarRef {
  getDate: () => Date,
  setDate: (date: Date) => void,
}

const InternalCalendar: React.ForwardRefRenderFunction<CalendarRef, CalendarProps> = (props, ref) => {
  const {
    value = new Date(),
    onChange,
  } = props;

  const [date, setDate] = useState(value);

  useImperativeHandle(ref, () => {
    return {
      getDate() {
        return date;
      },
      setDate(date: Date) {
        setDate(date)
      }
    }
  });

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const monthNames = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];

  const daysOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderDays = () => {
    const days = [];

    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    for (let i = 1; i <= daysCount; i++) {
      const clickHandler = onChange?.bind(null, new Date(date.getFullYear(), date.getMonth(), i));
      if(i === date.getDate()) {
        days.push(<div key={i} className="day selected" onClick={clickHandler}>{i}</div>);  
      } else {
        days.push(<div key={i} className="day" onClick={clickHandler}>{i}</div>);
      }
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <div>{date.getFullYear()}年{monthNames[date.getMonth()]}</div>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="days">
        <div className="day">日</div>
        <div className="day">一</div>
        <div className="day">二</div>
        <div className="day">三</div>
        <div className="day">四</div>
        <div className="day">五</div>
        <div className="day">六</div>
        {renderDays()}
      </div>
    </div>
  );
}

const Calendar = React.forwardRef(InternalCalendar);

function Test() {
  const calendarRef = useRef<CalendarRef>(null);

  useEffect(() => {
    console.log(calendarRef.current?.getDate().toLocaleDateString());

    setTimeout(() => {
      calendarRef.current?.setDate(new Date(2024, 3, 1));
    }, 3000);
  }, []);

  return <div>
    {/* <Calendar value={new Date('2023-3-1')} onChange={(date: Date) => {
        alert(date.toLocaleDateString());
    }}></Calendar> */}
    <Calendar ref={calendarRef} value={new Date('2024-8-15')}></Calendar>
  </div>
}
export default Test;
```
```css
.calendar {
  border: 1px solid #aaa;
  padding: 10px;
  width: 300px;
  height: 250px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.days {
  display: flex;
  flex-wrap: wrap;
}

.empty, .day {
  width: calc(100% / 7);
  text-align: center;
  line-height: 30px;
}

.day:hover, .selected {
  background-color: #ccc;
  cursor: pointer;
}
```

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/mini-calendar-test)。

## 总结

Calendar 或者 DatePicker 组件我们经常会用到，今天自己实现了一下。

其实原理也很简单，就是 Date 的 api。

new Date 的时候 date 传 0 就能拿到上个月最后一天的日期，然后 getDate 就可以知道那个月有多少天。

然后再通过 getDay 取到这个月第一天是星期几，就知道怎么渲染这个月的日期了。

我们用 react 实现了这个 Calendar 组件，支持传入 value 指定初始日期，传入 onChange 作为日期改变的回调。

除了 props 之外，还额外提供 ref 的 api，通过 forwarRef + useImperativeHandle 的方式。

整天用 Calender 组件，不如自己手写一个吧！
