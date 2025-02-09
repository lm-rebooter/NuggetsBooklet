基本的布局完成了，我们来添加一些参数：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad04e19e36074b8193b32176742a63ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986&h=708&s=175040&e=png&b=1f1f1f)

```javascript
export interface CalendarProps {
    value: Dayjs;
    style?: CSSProperties;
    className?: string | string[];
    // 定制日期显示，会完全覆盖日期单元格
    dateRender?: (currentDate: Dayjs) => ReactNode;
    // 定制日期单元格，内容会被添加到单元格内，只在全屏日历模式下生效。
    dateInnerContent?: (currentDate: Dayjs) => ReactNode;
    // 国际化相关
    locale?: string;
    onChange?: (date: Dayjs) => void;
}
```

style 和 className 用于修改 Calendar 组件外层容器的样式。

内部的布局我们都是用的 flex，所以只要外层容器的样式变了，内部的布局会自动适应。

dateRender 是用来定制日期单元格显示的内容的。

比如加一些日程安排，加一些农历或者节日信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40838b7c5be24a31972ef2de2c4e1805~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1464&h=944&s=77627&e=png&b=ffffff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ab74da1b1a740f0a21347b238d3270f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=928&h=804&s=83664&e=png&b=fefefe)

dateRender 是整个覆盖，连带日期的数字一起，而 dateInnerContent 只会在日期的数字下添加一些内容。

这两个 props 是不一样的。

locale 是用于国际化的，比如切换到中文显示或者是英文显示。

onChange 是当选择了日期之后会触发的回调。

然后实现下这些参数对应的逻辑。

首先是 className 和 style：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5d42ab5e7f944809d35f8d4128a2074~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=812&h=556&s=76401&e=png&b=1f1f1f)

```javascript
function Calendar(props: CalendarProps) {

    const {
        value,
        style,
        className,
    } = props;

    const classNames = cs("calendar", className);

    return <div className={classNames} style={style}>
        <Header></Header>
        <MonthCalendar {...props}/>
    </div>
}
```
这里用 classnames 这个包来做 className 的合并。

```
npm install classnames
```
它可以传入对象或者数组，会自动合并，返回最终的 className：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe280117f3fb46c39c45035446a0d2df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=808&h=134&s=25647&e=png&b=f7f7f7)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/478d424e5432401eac1e3d4587656537~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=974&h=122&s=34158&e=png&b=f7f7f7)

当 className 的确定需要一段复杂计算逻辑的时候，就用 classname 这个包。

测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b14e913ef9c43b1b6c9625c0d6d7cb2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1646&h=500&s=94709&e=png&b=1f1f1f)

```javascript
import dayjs from 'dayjs';
import Calendar from './Calendar';

function App() {
  return (
    <div className="App">
      <Calendar value={dayjs('2023-11-08')} className={'aaa'} style={{background: 'yellow'}}></Calendar>
    </div>
  );
}

export default App;

```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/245a7527fe844e64ab6ce352f2a7ccf4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2398&h=1412&s=133389&e=png&b=ffff54)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84aedaf1345b405cb41645358e6a64dd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=802&h=248&s=78127&e=png&b=fcfcfc)

className 和 style 的处理没问题。

然后我们处理下一个 props： dateRender 和 dateInnerContent。

在 MonthCalendar 里把它取出来，传入到 renderDays 方法里：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/baf098c0ab864264990f3e0e44e14220~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1252&h=972&s=187202&e=png&b=1f1f1f)

```javascript
const {
    dateRender,
    dateInnerContent
} = props;
```
```javascript
renderDays(allDays, dateRender, dateInnerContent)
```
dateRender 的处理也很简单，就是把渲染日期的逻辑换一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10d52506a90949748b73afe6ef6954b3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1540&h=806&s=162397&e=png&b=1f1f1f)

在 App.tsx 里传入 dateRender 参数：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f198d12dd6234ca7a68c3177d17721df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1542&h=660&s=125409&e=png&b=1f1f1f)

```javascript
import dayjs from 'dayjs';
import Calendar from './Calendar';

function App() {
  return (
    <div className="App">
      <Calendar value={dayjs('2023-11-08')} dateRender={(value) => {
        return <div>
          <p style={{background: 'yellowgreen', height: '50px'}}>{value.format('YYYY/MM/DD')}</p>
        </div>
      }}></Calendar>
    </div>
  );
}

export default App;
```
这样，渲染的内容就换成自定义的了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4856e1d44a8d40ce8ba64893d2647487~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2424&h=1356&s=205462&e=png&b=fcfcfc)

不过现在我们没有做内容溢出时的处理：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16142f16334c49acb0b95668e6071252~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1608&h=640&s=125836&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4ee9ca327fb4055bfd4baa90ab6b2ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2220&h=950&s=89363&e=png&b=a7cc4f)

加个 overflow: hidden 就好了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c4b48ab99454401b610bfe3805f5737~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1024&h=862&s=113803&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a95bb3ea12364443bf5cc50a6eb934cc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2434&h=1402&s=209214&e=png&b=a7cc4f)
而且之前加 padding 的位置也不对。

改一下渲染日期的逻辑，如果传了 dateRender 那就整个覆盖日期单元格，否则就是只在下面渲染 dateInnerContent 的内容：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e331642accc41e1b6d1d903d3f703ca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1914&h=1034&s=272471&e=png&b=1f1f1f)

```javascript
function renderDays(
    days: Array<{ date: Dayjs, currentMonth: boolean}>,
    dateRender: MonthCalendarProps['dateRender'],
    dateInnerContent:  MonthCalendarProps['dateInnerContent']
) {
    const rows = [];
    for(let i = 0; i < 6; i++ ) {
        const row = [];
        for(let j = 0; j < 7; j++) {
            const item = days[i * 7 + j];
            row[j] = <div className={
                "calendar-month-body-cell " + (item.currentMonth ? 'calendar-month-body-cell-current' : '')
            }>
                {
                    dateRender ? dateRender(item.date) : (
                        <div className="calendar-month-body-cell-date">
                            <div className="calendar-month-body-cell-date-value">{item.date.date()}</div>
                            <div className="calendar-month-body-cell-date-content">{dateInnerContent?.(item.date)}</div>
                        </div>
                    )
                }
            </div>
        }
        rows.push(row);
    }
    return rows.map(row => <div className="calendar-month-body-row">{row}</div>)
}
```
改下对应的样式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33bd14fe20b44cb8950b55dd02aa69e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=830&h=790&s=103467&e=png&b=202020)

把加 padding 的位置改为内部的元素。

测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d07e7c30017649d1b21bfb2ae8957a08~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1586&h=664&s=126331&e=png&b=1f1f1f)

```javascript
import dayjs from 'dayjs';
import Calendar from './Calendar';

function App() {
  return (
    <div className="App">
      <Calendar value={dayjs('2023-11-08')} dateInnerContent={(value) => {
        return <div>
          <p style={{background: 'yellowgreen', height: '30px'}}>{value.format('YYYY/MM/DD')}</p>
        </div>
      }}></Calendar>
    </div>
  );
}

export default App;
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a768a64d2de4427913c003f47abc232~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2416&h=1406&s=242124&e=png&b=fefefe)

这样，dateRender 和 dateInnerContent 的逻辑就完成了。

接下来做国际化，也就是 locale 参数的处理。

国际化就是可以让日历支持中文、英文、日文等，其实也很简单，就是把写死的文案换成按照 key 从配置中取的文案就行了。

定义下用到的 ts 类型 src/Calendar/locale/interface.ts

```javascript
export interface CalendarType {
    formatYear: string;
    formatMonth: string;
    today: string;
    month: {
        January: string;
        February: string;
        March: string;
        April: string;
        May: string;
        June: string;
        July: string;
        August: string;       
        September: string;
        October: string;
        November: string;
        December: string;
    } & Record<string, any>;
    week: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    } & Record<string, any>
}
```
然后分别定义中文和英文的配置：

src/Calendar/locale/zh-CN.ts

```javascript
import { CalendarType } from "./interface";

const CalendarLocale: CalendarType = {
    formatYear: 'YYYY 年',
    formatMonth: 'YYYY 年 MM 月',
    today: '今天',
    month: {
        January: '一月',
        February: '二月',
        March: '三月',
        April: '四月',
        May: '五月',
        June: '六月',
        July: '七月',
        August: '八月',
        September: '九月',
        October: '十月',
        November: '十一月',
        December: '十二月',
    },
    week: {
        monday: '周一',
        tuesday: '周二',
        wednesday: '周三',
        thursday: '周四',
        friday: '周五',
        saturday: '周六',
        sunday: '周日',
    }
}

export default CalendarLocale;
```

src/Calendar/locale/zh-CN.ts

把会用到的文案列出来。

然后再写个英文版：

src/Calendar/locale/en-US.ts

```javascript
import { CalendarType } from "./interface";

const CalendarLocale: CalendarType = {
    formatYear: 'YYYY',
    formatMonth: 'MMM YYYY',
    today: 'Today',
    month: {
        January: 'January',
        February: 'February',
        March: 'March',
        April: 'April',
        May: 'May',
        June: 'June',
        July: 'July',
        August: 'August',
        September: 'September',
        October: 'October',
        November: 'November',
        December: 'December',
    },
    week: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
    },
}

export default CalendarLocale;
```

我们先把上面的周一到周日的文案替换了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58861e3f6c624c4fb9d170d51dedbe92~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=828&h=188&s=16351&e=png&b=fefefe)

在 MonthCalendar 引入中文的资源包：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abd559e74c9a4914b3b26211e8f3a191~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=842&h=190&s=42882&e=png&b=1f1f1f)

然后把之前写死的文案，改成按照 key 从资源包中取值的方式：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e5c2d6715554aeeb67c0497af613c85~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1560&h=1034&s=212364&e=png&b=1f1f1f)

```javascript
function MonthCalendar(props: MonthCalendarProps) {

    const {
        dateRender,
        dateInnerContent
    } = props;

    const weekList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

    const allDays = getAllDays(props.value);

    return <div className="calendar-month">
        <div className="calendar-month-week-list">
            {weekList.map((week) => (
                <div className="calendar-month-week-list-item" key={week}>
                    {CalendarLocale.week[week]}
                </div>
            ))}
        </div>
        <div className="calendar-month-body">
            {
                renderDays(allDays, dateRender, dateInnerContent)
            }
        </div>
    </div>
}
```

现在渲染出来的是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/625b8a70d4aa452eb8eb8f92fe9a15a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=792&h=416&s=35846&e=png&b=fefefe)

只要改一下用的资源包：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/158e69f532f7488bb61626a093c49858~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=904&h=258&s=56739&e=png&b=202020)

文案就变了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a220a04bef5423aa909fb3a41081231~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=812&h=280&s=33739&e=png&b=fefdfd)

这就是国际化。

当然，现在我们是手动切换的资源包，其实应该是全局统一配置的。

这个可以通过 context 来做：

新建 src/Calendar/LocaleContext.tsx

```javascript
import { createContext } from "react";

export interface LocaleContextType {
    locale: string;
}

const LocaleContext = createContext<LocaleContextType>({
    locale: 'zh-CN'
});

export default LocaleContext;
```
然后在 Calendar 组件里用 provider 修改 context 的值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c370135a76024996bff480fe35966402~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=992&h=1056&s=179029&e=png&b=1f1f1f)

如果传入了参数，就用指定的 locale，否则，就从浏览器取当前语言：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8ad08bd97a04848857198317c219a6b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=424&h=210&s=20259&e=png&b=ffffff)

加一个国际化资源包的入口：

src/Calendar/locale/index.ts

```javascript
import zhCN from "./zh-CN";
import enUS from "./en-US";
import { CalendarType } from "./interface";

const allLocales: Record<string, CalendarType>= {
    'zh-CN': zhCN,
    'en-US': enUS
}

export default allLocales;
```
把 MonthCalendar 组件的 locale 改成从 context 获取的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/018ea90bc25a4ffb99897214a8749a18~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1114&h=858&s=178665&e=png&b=1f1f1f)

```javascript
const localeContext = useContext(LocaleContext);

const CalendarLocale = allLocales[localeContext.locale];
```

这样，当不指定 locale 时，就会按照浏览器的语言来设置：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1620fb40385420b8afd5165de15ba73~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=796&h=442&s=35771&e=png&b=fefefe)

当指定 locale 时，就会切换为指定语言的资源包：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8fc40c996f941fabcca4ebec2f603c3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=468&s=79980&e=png&b=1f1f1f)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56242c5291e149bea44b13d199f27374~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=840&h=190&s=25138&e=png&b=fefefe)

接下来，我们实现 value 和 onChange 参数的逻辑。

在 MonthCalendar 里取出 value 参数，传入 renderDays 方法：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75acc198365c480dad75e52e117388c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1334&h=1124&s=233547&e=png&b=1f1f1f)

用 classnames 的 api 来拼接 className，如果是当前日期，就加一个 xxx-selected 的 className：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/308bab0216f74bb3b57cab2abea03641~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1572&h=1318&s=296996&e=png&b=1f1f1f)

```javascript
function renderDays(
    days: Array<{ date: Dayjs, currentMonth: boolean}>,
    dateRender: MonthCalendarProps['dateRender'],
    dateInnerContent:  MonthCalendarProps['dateInnerContent'],
    value: Dayjs
) {
    const rows = [];
    for(let i = 0; i < 6; i++ ) {
        const row = [];
        for(let j = 0; j < 7; j++) {
            const item = days[i * 7 + j];
            row[j] = <div className={
                "calendar-month-body-cell " + (item.currentMonth ? 'calendar-month-body-cell-current' : '')
            }
            >
                {
                    dateRender ? dateRender(item.date) : (
                        <div className="calendar-month-body-cell-date">
                            <div className={
                                cs("calendar-month-body-cell-date-value",
                                    value.format('YYYY-MM-DD') === item.date.format('YYYY-MM-DD')
                                        ? "calendar-month-body-cell-date-selected"
                                        : ""
                                )
                            }>{item.date.date()}</div>
                            <div className="calendar-month-cell-body-date-content">{dateInnerContent?.(item.date)}</div>
                        </div>
                    )
                }
            </div>
        }
        rows.push(row);
    }
    return rows.map(row => <div className="calendar-month-body-row">{row}</div>)
}
```
添加对应的样式：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/954e7f1c16454f9b9a1a4cb1787e42ff~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=862&h=888&s=130289&e=png&b=1f1f1f)

```css
&-selected {
    background: blue;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
}
```
现在渲染出来是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49f34937e36840aa8c7f915fe353793a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=830&h=450&s=41310&e=png&b=fefefe)

然后我们加上点击的处理：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb5dc1f6df73403fadc080edaa930b71~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=920&h=516&s=107777&e=png&b=1f1f1f)

```javascript
interface MonthCalendarProps extends CalendarProps {
    selectHandler?: (date: Dayjs) => void
}
```
添加一个 selectHandler 的参数，传给 renderDays 方法。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a50f65e85924b9cae201b1cd446b065~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1378&h=1156&s=208365&e=png&b=1f1f1f)

renderDays 方法里取出来，给日期添加上点击事件：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e2897d8428441fc819753099a2b462b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1324&h=1322&s=283299&e=png&b=1f1f1f)

```javascript
function renderDays(
    days: Array<{ date: Dayjs, currentMonth: boolean}>,
    dateRender: MonthCalendarProps['dateRender'],
    dateInnerContent:  MonthCalendarProps['dateInnerContent'],
    value: Dayjs,
    selectHandler: MonthCalendarProps['selectHandler']
) {
    const rows = [];
    for(let i = 0; i < 6; i++ ) {
        const row = [];
        for(let j = 0; j < 7; j++) {
            const item = days[i * 7 + j];
            row[j] = <div className={
                "calendar-month-body-cell " + (item.currentMonth ? 'calendar-month-body-cell-current' : '')
            }
                onClick={() => selectHandler?.(item.date)}
            >
                {
                    dateRender ? dateRender(item.date) : (
                        <div className="calendar-month-body-cell-date">
                            <div className={
                                cs("calendar-month-body-cell-date-value",
                                    value.format('YYYY-MM-DD') === item.date.format('YYYY-MM-DD')
                                        ? "calendar-month-body-cell-date-selected"
                                        : ""
                                )
                            }>{item.date.date()}</div>
                            <div className="calendar-month-cell-body-date-content">{dateInnerContent?.(item.date)}</div>
                        </div>
                    )
                }
            </div>
        }
        rows.push(row);
    }
    return rows.map(row => <div className="calendar-month-body-row">{row}</div>)
}
```
然后这个参数是在 Calendar 组件传进来的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdcbf3f66fa84b7a879d221f9b3d96ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1354&h=1220&s=237538&e=png&b=1f1f1f)

我们添加一个 state 来存储当前日期，selectHandler 里调用 onChange 的参数，并且修改当前日期。

```javascript
function Calendar(props: CalendarProps) {

    const {
        value,
        style,
        className,
        dateRender,
        dateInnerContent,
        locale,
        onChange
    } = props;

    const [curValue, setCurValue] = useState<Dayjs>(value);

    const classNames = cs("calendar", className);
        
    function selectHandler(date: Dayjs) {
        setCurValue(date);
        onChange?.(date);
    }

    return <LocaleContext.Provider value={{
        locale: locale || navigator.language
    }}>
        <div className={classNames} style={style}>
            <Header></Header>
            <MonthCalendar {...props} value={curValue} selectHandler={selectHandler}/>
        </div>
    </LocaleContext.Provider>
}
```
试一下，改下 App.tsx：

```javascript
import dayjs from 'dayjs';
import Calendar from './Calendar';

function App() {
  return (
    <div className="App">
      <Calendar value={dayjs('2023-11-08')} onChange={(date) => {
          alert(date.format('YYYY-MM-DD'));
      }}></Calendar>
    </div>
  );
}

export default App;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d20e3db58d79408b8ec2f1f50d05887f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2090&h=1322&s=512748&e=gif&f=44&b=fdfdfd)

然后实现下 Header 组件里的日期切换：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e27952c11d440eda8e7003daa164e28~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1424&h=948&s=215045&e=png&b=1f1f1f)

根据传入的 value 来展示日期，点击上下按钮的时候会调用传进来的回调函数：

```javascript
import { Dayjs } from "dayjs";
interface HeaderProps {
    curMonth: Dayjs;
    prevMonthHandler: () => void;
    nextMonthHandler: () => void;
}
function Header(props: HeaderProps) {

    const {
        curMonth,
        prevMonthHandler,
        nextMonthHandler
    } = props;

    return <div className="calendar-header">
        <div className="calendar-header-left">
            <div className="calendar-header-icon" onClick={prevMonthHandler}>&lt;</div>
            <div className="calendar-header-value">{curMonth.format('YYYY 年 MM 月')}</div>
            <div className="calendar-header-icon" onClick={nextMonthHandler}>&gt;</div>
            <button className="calendar-header-btn">今天</button>
        </div>
    </div>
}

export default Header;
```

然后在 Calendar 组件创建 curMonth 的 state，点击上下按钮的时候，修改月份：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0531069b511c4f2c81e607223178e0c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1782&h=1260&s=292861&e=png&b=1f1f1f)

```javascript
function Calendar(props: CalendarProps) {

    const {
        value,
        style,
        className,
        dateRender,
        dateInnerContent,
        locale,
        onChange
    } = props;

    const [curValue, setCurValue] = useState<Dayjs>(value);

    const [curMonth, setCurMonth] = useState<Dayjs>(value);

    const classNames = cs("calendar", className);
        
    function selectHandler(date: Dayjs) {
        setCurValue(date);
        onChange?.(date);
    }

    function prevMonthHandler() {
        setCurMonth(curMonth.subtract(1, 'month'));
    }

    function nextMonthHandler() {
        setCurMonth(curMonth.add(1, 'month'));
    }

    return <LocaleContext.Provider value={{
        locale: locale || navigator.language
    }}>
        <div className={classNames} style={style}>
            <Header curMonth={curMonth} prevMonthHandler={prevMonthHandler} nextMonthHandler={nextMonthHandler}></Header>
            <MonthCalendar {...props} value={curValue} selectHandler={selectHandler}/>
        </div>
    </LocaleContext.Provider>
}
```

测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed079a76ffc14ccfab0c256ee9bccb9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1956&h=1112&s=178900&e=gif&f=38&b=fdfdfd)

但现在月份是变了，但下面的日历没有跟着变。

因为我们之前是拿到 value 所在月份来计算的日历，现在要改成 curMonth 所在的月份。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a378ba80c565474c8b188965af6ce384~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1364&h=664&s=159426&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32e78e080b764d96b23d1d6926cb6026~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=968&h=716&s=124515&e=png&b=1f1f1f)

这样，月份切换时，就会显示那个月的日历了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/283b867cb36e4bce8b60ef3939806c8f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1996&h=1112&s=212853&e=gif&f=29&b=fdfdfd)

然后我们加上今天按钮的处理：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72a775402c054141ace51916f711afb3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1410&h=1004&s=235489&e=png&b=1f1f1f)

```javascript
import { Dayjs } from "dayjs";
interface HeaderProps {
    curMonth: Dayjs;
    prevMonthHandler: () => void;
    nextMonthHandler: () => void;
    todayHandler: () => void;
}
function Header(props: HeaderProps) {

    const {
        curMonth,
        prevMonthHandler,
        nextMonthHandler,
        todayHandler
    } = props;

    return <div className="calendar-header">
        <div className="calendar-header-left">
            <div className="calendar-header-icon" onClick={prevMonthHandler}>&lt;</div>
            <div className="calendar-header-value">{curMonth.format('YYYY 年 MM 月')}</div>
            <div className="calendar-header-icon" onClick={nextMonthHandler}>&gt;</div>
            <button className="calendar-header-btn" onClick={todayHandler}>今天</button>
        </div>
    </div>
}

export default Header;
```

在 Calendar 里传入 todayHandler：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1071cbdc899940838a6f20ea84af0380~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=1246&s=274943&e=png&b=1f1f1f)

```javascript
function todayHandler() {
    const date = dayjs(Date.now());

    setCurValue(date);
    setCurMonth(date);
    onChange?.(date);
}
```
同时修改日期和当前月份，并且还要调用 onChange 回调。

测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc321f45d0eb4c41b9370dcc1b9f2162~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2156&h=1158&s=228529&e=gif&f=32&b=fdfdfd)

此外，我们希望点击上下月份的日期的时候，能够跳转到那个月的日历：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c3bfecf64b54141a52ffa578216d05f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1974&h=1424&s=118292&e=gif&f=21&b=fdfdfd)

这个也简单，切换日期的时候顺便修改下 curMonth 就好了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af4e90038f894dd1a33c50c325f05320~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=968&h=798&s=152852&e=png&b=1f1f1f)

测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3316ab7f8999417fa05e8a592c8a1a16~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2178&h=1430&s=215113&e=gif&f=36&b=fdfdfd)

最后，还要加上 Header 的国际化：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4aba691c98f4fe683e72f596c13cd50~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1592&h=974&s=248124&e=png&b=1f1f1f)

就是把写死的文案，改成丛资源包取值的方式就好了。

```javascript
function Header(props: HeaderProps) {

    const {
        curMonth,
        prevMonthHandler,
        nextMonthHandler,
        todayHandler
    } = props;

    const localeContext = useContext(LocaleContext);
    const CalendarContext = allLocales[localeContext.locale];

    return <div className="calendar-header">
        <div className="calendar-header-left">
            <div className="calendar-header-icon" onClick={prevMonthHandler}>&lt;</div>
            <div className="calendar-header-value">{curMonth.format(CalendarContext.formatMonth)}</div>
            <div className="calendar-header-icon" onClick={nextMonthHandler}>&gt;</div>
            <button className="calendar-header-btn" onClick={todayHandler}>{CalendarContext.today}</button>
        </div>
    </div>
}
```
试试看：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/337adbc1fc504ab0a0e1b171e0d10c02~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1438&h=596&s=47215&e=png&b=fefefe)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce58656e43d949f0b104feedc34cf55d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1136&h=488&s=83174&e=png&b=1f1f1f)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98fa652a7c5c4805b20b63860527dcc8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1622&h=670&s=59858&e=png&b=fefefe)

没啥问题。

这样，我们的 Calendar 组件就完成了。

最后我们再来优化下代码：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/635e7fb2fa15465cb6a1990b0111d07d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=968&h=924&s=159132&e=png&b=1f1f1f)

重复逻辑可以抽离出个方法：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e0dbb87d7c0400ab07920ce002b408f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=924&h=930&s=157221&e=png&b=1f1f1f)

```javascript
function changeDate(date: Dayjs) {
    setCurValue(date);
    setCurMonth(date);
    onChange?.(date);
}
```
渲染逻辑抽离出来的函数，放在组件外需要传很多参数，而这个函数只有这里用，可以移到组件内：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1741a3d1f9364cadbe6976694e98374d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1190&h=612&s=124363&e=png&b=1f1f1f)

这样就不用传那些参数了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55ea3164867c4910861c6930978604bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1300&h=1288&s=254128&e=png&b=1f1f1f)

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/react-course-code/tree/main/calendar-component)。

## 总结

上节我们实现了布局，这节加上了参数并且实现了这些参数对应的逻辑。

className 和 style 用于修改外层容器的样式，内部用的 flex 布局，只要容器大小变了，内容会自动适应。

dateRender 和 dateInnerConent 是用于修改日期单元格的内容的，比如显示节日、日程安排等。

locale 是切换语言，国际化就是把写死的文案换成从资源包取值的方式，我们创建了 zh-CN 和 en-US 两个资源包，并且可以通过 locale 参数来切换。

通过 createContext 创建 context 对象来保存 locale 配置，然后通过 Provider 修改其中的值，这样子组件里就通过 useContext 把它取出来就知道当前语言了。

日历组件是一个常用组件，而且是经常需要定制的那种，因为各种场景下对它有不同的要求，所以能够自己实现各种日历组件是一个必备技能。
