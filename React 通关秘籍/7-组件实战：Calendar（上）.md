上节我们实现了 mini calendar，为啥要加个 mini 呢？

因为它与真实用的 Calendar 组件相比，还是过于简单了。

这节我们再来写一个复杂一些的，真实项目用的 Calendar 组件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dbbb19c32af43bca385ed8d51b34e08~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1162&h=1080&s=172565&e=gif&f=34&b=fefefe)

用 cra 创建个项目：

```
npx create-react-app --template typescript calendar-component
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe784e9083f742a29dc4bf02003f1616~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1072&h=214&s=41630&e=png&b=010101)

先不着急写，我们先理一下思路：

日历组件的核心是什么？

是拿到每月的天数，每月的第一天是星期几。

比如这个月：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72dbb2aa686045e1be92662f7173ba1c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1348&h=1060&s=75638&e=png&b=ffffff)

我们知道这个月有 30 天，第一天是周三，那就知道如何显示这个月的日历了。

那如何知道每月的天数呢？

上节讲过，用 Date 的 api 就可以。

当然，也可以用 dayjs，它封装了这些：

安装 dayjs：

```
npm install --save dayjs
```
在 test.js 写如下代码：

```javascript
const dayjs = require('dayjs');

console.log(dayjs('2023-11-1').daysInMonth());

console.log(dayjs('2023-11-1').startOf('month').format('YYYY-MM-DD'));

console.log(dayjs('2023-11-1').endOf('month').format('YYYY-MM-DD'));

```

创建一个 dayjs 的对象，然后用 daysInMonth 方法可以拿到这个月的天数，用 startOf、endOf 可以拿到这个月的第一天和最后一天的日期。

跑一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d0d1cfa5fa048b98aad1bcfb0346423~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=988&h=546&s=90696&e=png&b=1d1d1d)

这次 Calendar 组件我们用 dayjs 的 api 来实现。

很多组件库的 Calendar 组件都是基于 dayjs 设置和返回日期的。

比如 antd 的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8ad0a10e27143d89ec5a13e0ced7ee3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1174&h=642&s=103374&e=png&b=ffffff)

下面正式来写 Calendar 组件。

创建 src/Calendar/index.tsx

```javascript
import './index.scss';

function Calendar() {
    return <div className="calendar">
        
    </div>
}

export default Calendar;
```
还有样式 src/Calendar/index.scss

```scss
.calendar {
    width: 100%;

    height: 200px;
    background: blue;
}
```
这里用到了 scss，需要安装下用到的包：

```
npm install --save sass
```

然后在 App.tsx 里引入 Calendar 组件：

```javascript
import Calendar from './Calendar';

function App() {
  return (
    <div className="App">
      <Calendar></Calendar>
    </div>
  );
}

export default App;
```

跑一下：

```
npm run start
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed1e3ecdcc21437fa72677402a85a8b9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1448&h=560&s=40837&e=png&b=0000f5)

这样，sass 就引入成功了。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b4e84d8b2664a22a9867ca15fadfb43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1176&h=934&s=60960&e=png&b=ffffff)

这个组件可以分为 Header 和 MonthCalendar 两个组件。

我们先写下面的 MonthCalender 组件：

首先是周日到周六的部分：

src/Calendar/MonthCalendar.tsx

```javascript
function MonthCalendar() {

    const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    return <div className="calendar-month">
        <div className="calendar-month-week-list">
            {weekList.map((week) => (
                <div className="calendar-month-week-list-item" key={week}>
                    {week}
                </div>
            ))}
        </div>
    </div>
}

export default MonthCalendar;
```
先把周日到周一渲染出来，然后在 src/Calendar/index.scss 里写下样式：

```scss
.calendar {
    width: 100%;
}

.calendar-month {
    &-week-list {
        display: flex;
        padding: 0;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;

        &-item {
            padding: 20px 16px;
            text-align: left;
            color: #7d7d7f;
            flex: 1;
        }
    }
}
```

样式用 display:fex 加 flex:1，这样就是每个列表项平分剩余空间，然后加上 padding。

在 src/Calendar/index.tsx 里引入：

```javascript
import MonthCalendar from './MonthCalendar';
import './index.scss';

function Calendar() {
    return <div className="calendar">
        <MonthCalendar/>
    </div>
}

export default Calendar;
```
这样，上面的 week list 就完成了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d6bb8c17242494e878df8410a0034b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1618&h=734&s=49768&e=png&b=ffffff)

然后是下面部分：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b77583980934b52886450775ad1b3bd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1390&h=1024&s=67184&e=png&b=ffffff)

思路前面分析过了，就是拿到当前月份的天数和第一天是星期几，前后用上个月和下个月的日期填充。

我们给 Calendar 组件加一个 value 的 props，也就是当前日期。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/696d646f6d4d4ddfaa86c200605087ec~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=776&h=604&s=99682&e=png&b=1f1f1f)

value 我们选择用 Dayjs 类型，当然，用 Date 也可以。

```javascript
import { Dayjs } from 'dayjs';
import MonthCalendar from './MonthCalendar';
import './index.scss';

export interface CalendarProps {
    value: Dayjs
}

function Calendar(props: CalendarProps) {
    return <div className="calendar">
        <MonthCalendar {...props}/>
    </div>
}

export default Calendar;

```
在 MonthCalendar 也加上 props：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/675476c965a34a8595c178150d188dbd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1228&h=854&s=151798&e=png&b=1f1f1f)

```javascript
interface MonthCalendarProps extends CalendarProps {

}
```

在 App.tsx 传入参数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8281d41ec894fa1a571a318b48755e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=498&s=74682&e=png&b=1f1f1f)

这样，MonthCalendar 就可以根据传入的 value 拿到当前的月份信息了。

我们加一个 getAllDays 方法，打个断点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c58b94861ee84b53955d4807d189addd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1088&h=900&s=177882&e=png&b=1f1f1f)

```javascript
function getAllDays(date: Dayjs) {
    const daysInMonth = date.daysInMonth();
    const startDate = date.startOf('month');
    const day = startDate.day()    

}
```

```javascript
const allDays = getAllDays(props.value);
```
然后创建个调试配置：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/917e19e1c21247a1b70c95b15672be16~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=600&h=386&s=44720&e=png&b=191919)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2527e79243214b90b0cdf16f0125b9cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986&h=566&s=99586&e=png&b=202020)

点击调试启动：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9abb4e07b2d447ccaa5429085b01c4e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1478&h=880&s=269935&e=png&b=1d1d1d)

可以看到，拿到了这个月的天数，是 30 天。

接下来我们边调试边写。

不管这个月有多少天，我们日历都是固定 6 * 7 个日期：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c82af0df9fd4471991f87de3d141c024~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1394&h=1034&s=67311&e=png&b=ffffff)

所以创建一个 6 * 7 个元素的数组，这个月第一天之前的用第一天的日期 -1、-2、-3 这样计算出来：

```javascript
function getAllDays(date: Dayjs) {
    const daysInMonth = date.daysInMonth();
    const startDate = date.startOf('month');
    const day = startDate.day()    

    const daysInfo = new Array(6 * 7);

    for(let i = 0 ; i < day; i++) {
        daysInfo[i] = {
            date: startDate.subtract(day - i, 'day').format('YYYY-MM-DD')
        }
    }
    
    debugger;

}
```

11 月 1 日是星期三：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c54afc485b564a49ac44845b2e5f958b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=976&h=586&s=106460&e=png&b=1f1f1f)

那也就是要在之前填充星期日、星期一、星期二，这 3 天的日期：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71098bd5f3b54f16a48fc0914a2bca78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1068&h=610&s=91467&e=png&b=202020)

这里用 dayjs 的 subtract 方法就可以计算当前日期 -1、-2、-3 的日期。

再写一段逻辑，点击刷新：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f248c12d36bd4fffb12b417ab56438e6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1270&h=888&s=168064&e=png&b=1f1f1f)

```javascript
function getAllDays(date: Dayjs) {
    const daysInMonth = date.daysInMonth();
    const startDate = date.startOf('month');
    const day = startDate.day()    

    const daysInfo = new Array(6 * 7);

    for(let i = 0 ; i < day; i++) {
        daysInfo[i] = {
            date: startDate.subtract(day - i, 'day').format('YYYY-MM-DD')
        }
    }

    for(let i = day ; i < daysInfo.length; i++) {
        daysInfo[i] = {
            date: startDate.add(i - day, 'day').format('YYYY-MM-DD')
        }
    }

    debugger;

}
```
这个循环就是填充剩下的日期的，从 startDate 开始 +1、+2、+3 计算日期。

hover 上去可以看到，计算的结果是对的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72e57f9880ba4c4da65825088e801a03~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=816&h=798&s=134259&e=png&b=202020)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d69335c71c5e4405b06f22ee2b78df5a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=754&h=684&s=124217&e=png&b=202020)

然后把 format 删掉，这里不需要格式化。再添加一个属性标识是否是当前月份的。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e773a5e3ad5497ea7cd74735c4a9d52~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1034&h=920&s=159144&e=png&b=1f1f1f)

```javascript
function getAllDays(date: Dayjs) {
    const startDate = date.startOf('month');
    const day = startDate.day()    

    const daysInfo = new Array(6 * 7);

    for(let i = 0 ; i < day; i++) {
        daysInfo[i] = {
            date: startDate.subtract(day - i, 'day'),
            currentMonth: false
        }
    }

    for(let i = day ; i < daysInfo.length; i++) {
        const calcDate = startDate.add(i - day, 'day');

        daysInfo[i] = {
            date: calcDate,
            currentMonth: calcDate.month() === date.month()
        }
    }

    return daysInfo;
}
```

就是先 -1、-2、-3 计算本月第一天之前的日期，然后从第一天开始 +1、+2、+3 计算之后日期。

返回值处打个断点，刷新下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfa24544c8fe47dbbdad5dc4a7b50952~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=960&s=208083&e=png&b=202020)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1f872dd94b04dd1aa5134667c071490~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=860&h=874&s=190514&e=png&b=202020)

当前月份的日期、之前几天的日期、之后几天的日期都有了。

这样，日历的数据就准备好了。

其实上一节我们也是这么做的，只不过用的是 Date 的 api，而这节换成 dayjs 的 api 了。

再声明下返回的数组的类型：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e91f6cb23ab4955ae5b97d8ee589f19~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1256&h=888&s=150464&e=png&b=1f1f1f)

```javascript
const daysInfo: Array<{date: Dayjs, currentMonth: boolean}> = new Array(6 * 7);
```
数据准备好了，接下来就可以渲染了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/013a82250eba4960afbe736eefaab47f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1332&h=1200&s=260401&e=png&b=1f1f1f)

```javascript
<div className="calendar-month-body">
    {
        renderDays(allDays)
    }
</div>
```
```javascript
function renderDays(days: Array<{ date: Dayjs, currentMonth: boolean}>) {
    const rows = [];
    for(let i = 0; i < 6; i++ ) {
        const row = [];
        for(let j = 0; j < 7; j++) {
            const item = days[i * 7 + j];
            row[j] = <div className="calendar-month-body-cell">{item.date.date()}</div>
        }
        rows.push(row);
    }
    return rows.map(row => <div className="calendar-month-body-row">{row}</div>)
}
```
这里就是把 6 * 7 个日期，按照 6 行，每行 7 个来组织成 jsx。

scss 部分如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13ddc7e49bf94210aad7697d7645c858~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=1076&s=128184&e=png&b=202020)

```scss
&-body {
    &-row {
        height: 100px;
        display: flex;
    }
    &-cell {
        flex: 1;
        border: 1px solid #eee;
        padding: 10px
    }

}
```
每行的每个单元格用 flex:1 来分配空间，然后设置个 padding。

渲染出来是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52521c1c4d034e65b40b1dbf16024343~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=1442&s=107998&e=png&b=fefefe)

然后当前月和其他月份的日期加上个不同颜色区分：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af1e383bdaf04b87a53efd4f6c6c156b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1650&h=502&s=126736&e=png&b=1f1f1f)

```javascript
function renderDays(days: Array<{ date: Dayjs, currentMonth: boolean}>) {
    const rows = [];
    for(let i = 0; i < 6; i++ ) {
        const row = [];
        for(let j = 0; j < 7; j++) {
            const item = days[i * 7 + j];
            row[j] = <div className={
                "calendar-month-body-cell " + (item.currentMonth ? 'calendar-month-body-cell-current' : '')
            }>{item.date.date()}</div>
        }
        rows.push(row);
    }
    return rows.map(row => <div className="calendar-month-body-row">{row}</div>)
}
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/280ecf24f1c8458588b4c1d93720ac02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=600&h=582&s=51663&e=png&b=1f1f1f)

```scss
color: #ccc;
&-current {
    color: #000;
}
```

这样，我们的日历就基本完成了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28b2d86b3eea440dbbf6d78d9a9f2f92~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1998&h=1454&s=114493&e=png&b=fefefe)

切换日期是在 Header 部分做的，接下来写下这部分：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85467aea224a4b33a8d8da36909fb14f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1170&h=988&s=61605&e=png&b=ffffff)

写下 src/Calendar/Header.tsx：

```javascript
function Header() {
    return <div className="calendar-header">
        <div className="calendar-header-left">
            <div className="calendar-header-icon">&lt;</div>
            <div className="calendar-header-value">2023 年 11 月</div>
            <div className="calendar-header-icon">&gt;</div>
            <button className="calendar-header-btn">今天</button>
        </div>
    </div>
}

export default Header;
```
还有对应的样式：

```scss
.calendar-header {
    &-left {
        display: flex;
        align-items: center;

        height: 28px;
        line-height: 28px;
    }

    &-value {
        font-size: 20px;
    }

    &-btn {
        background: #eee;
        cursor: pointer;
        border: 0;
        padding: 0 15px;
        line-height: 28px;

        &:hover {
            background: #ccc;
        }
    }
  
    &-icon {
        width: 28px;
        height: 28px;

        line-height: 28px;
    
        border-radius: 50%;
        text-align: center;
        font-size: 12px;

        user-select: none;
        cursor: pointer;

        margin-right: 12px;
        &:not(:first-child) {
            margin: 0 12px;
        }

        &:hover {
            background: #ccc;
        }
    }
  
}
```
这部分就是用 flex + margin 来实现布局，就不展开讲了。

渲染出来是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6963058499547e3a9f123b5761e40e1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=998&h=596&s=48136&e=png&b=fefefe)

这样我们就完成了布局部分。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/calendar-component)。

## 总结

这节我们开始实现一个真实的 Calendar 组件。

我们不再用 Date 获取当前月、上个月、下个月的天数和星期几，而是用 dayjs 的 api。

我们完成了布局部分，包括用于切换月份的 Header 和每个月的日期 MonthCalender 组件。

我们使用 sass 来管理样式。

上面的周几、下面的日期我们都是用的 flex 布局，这样只要外层容器大小变了，内层就会跟着变。

下节我们来实现具体的组件逻辑。
