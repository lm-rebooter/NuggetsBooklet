### 本资源由 itjc8.com 收集整理
# 第 11 节 基于 ECharts 的基础表达性统计图表 · 散点图与折线图

经过了对 JavaScript 中各种数据结构的学习和应用，我们已经掌握了绝大部分在实际开发中所需要使用到的数据操作技能。而接下来，我们便可以开始将这些技能应用到我们所收集到的数据上，并将经过处理的数据使用可视化数据图表进行展示。

## 11.1 散点图 Scatter

在数据统计处理开发中，最主要的数据类型通常是离散型单值数值类型，比如学校班级中的每一个学生的身高体重信息、记账本中的每一次支出的价格等等。

而就比如班级中的身高体重信息，因为严格意义上人与人之间并没有一定的顺序，所以要展示每一个个体的数据应该选用散点图来展示离散的数值数据。

我们首先假设男生的一般身高范围在 155 厘米到 180 厘米之间，而女生的身高范围在 145 厘米到 170 厘米之间。一般来说两者身高在这两个范围会呈正态分布，但为了方便学习，我们假设性地将其看作是均匀分布。我们可以利用这两个范围随机生成一些学生的身高数据，此处假设男女比例相等即各占 50%。

```
const students = []
const n = 50

const heightRanges = {
  male: [ 155, 180 ],
  female: [ 145, 170 ]
}

function getRandomInt(min, max) {
  return Math.round(min + Math.random() * (max - min))
}

for (let i = 0; i < 50; ++i) {
  const gender = Math.random() > 0.5 ? 'male' : 'female'
  const [ min, max ] = heightRanges[gender]
  
  const student = {
    id: i + 1,
    gender: gender,
    height: getRandomInt(min, max)
  }

  students.push(student)
}

console.log(students)
//=> 
// [
//   { id: 1, gender: "male", height: 157 },
//   { id: 2, gender: "male", height: 165 },
//   { id: 3, gender: "female", height: 157 },
//   { id: 4, gender: "female", height: 169 },
//   ...
// ]

```

## 11.2 ECharts 简单入门

ECharts 是由百度开发并开源的一个基于 JavaScript 和 Canvas（在 4.0 中支持了 SVG 渲染）数据可视化图表工具库，而且目前已经被捐赠与 Apache 基金会，更名为 Apache ECharts。它并不需要开发者有非常丰富的数据可视化经验，便可以利用所提供的[参考实例](http://echarts.baidu.com/examples/)开发出美观、实用、性能优秀的可视化图表。

### 11.2.1 可视化图表基本元素

使用 ECharts 绘制可视化图表需要提供以下几种元素（对应不同的图表组件），以组成一个完整的数据图表。

1.  数据（必需）
2.  数据系列（必需）
3.  坐标轴

除此之外还有如辅助线、标记文本、图例等等元素。ECharts 以图表配置为主要使用方式，使用的时候将所需要展示在图表上的元素加入到图表配置中即可。

### 11.2.2 数据集 `dataset`

从 ECharts 4.0 版本开始，它提供了一个非常适合我们学习和使用的数据集配置方法 `dataset`，它的主要用法是使用我们在第 10 节中所学习过的行式数据集以及列式数据集。

**行式数据集**

```
// Row-oriented Dataset
const empsRows = [
  { RowId: '001', EmpId: '10', Lastname: 'Smith', Firstname: 'Joe', Salary: 40000 },
  { RowId: '002', EmpId: '12', Lastname: 'Jones', Firstname: 'Mary', Salary: 50000 },
  { RowId: '003', EmpId: '11', Lastname: 'Johnson', Firstname: 'Cathy', Salary: 44000 },
  { RowId: '004', EmpId: '22', Lastname: 'Jones', Firstname: 'Bob', Salary: 55000 },
  { RowId: '005', EmpId: '24', Lastname: 'Steve', Firstname: 'Mike', Salary: 62000 }
]

const option = {
  dataset: {
    source: empsRows
  }
}

```

**列式数据集**

```
// Column-oriented Dataset
const empsColumns = {
  RowId: [ '001', '002', '003', '004', '005' ],
  EmpId: [ '10', '12', '11', '22', '24' ],
  Lastname: [ 'Smith', 'Jones', 'Johnson', 'Jones', 'Steve' ],
  Firstname: [ 'Joe', 'Mary', 'Cathy', 'Bob', 'Mike' ],
  Salary: [ 40000, 50000, 44000, 55000, 62000 ]
}

const option = {
  dataset: {
    source: empsColumns
  }
}

```

### 11.2.3 数据系列 `series`

准备好数据集以后，便需要将其与所需要的数据系列（如本节将会介绍的散点图和折线图）进行绑定，使数据可以真正地展示在数据图表上。

```
// 散点图 Scatter
const option = {
  {
    type: 'scatter',
    encode: {
      x: 'Firstname',
      y: 'Salary'
    }
  }
}

```

在这个数据系列中，我们指定了数据系列的类型为 `scatter`，即我们需要的散点图。然后通过 `encode` 绑定前面在 `dataset` 中数据的维度，如 `x` 坐标轴绑定到 `Firstname`，`y` 坐标轴绑定到 `Salary` 上。

### 11.2.4 坐标轴 `axis`

准备好了数据集和用于展示的数据系列之后，因为我们所需要展示的数据图表类型为散点图，所以至少需要一个坐标轴来作为数据的载体，而在一般情况下我们所使用的坐标轴为直角坐标轴（即一个 X 坐标轴和一个 Y 坐标轴）。

```
const option = {
  xAxis: {
    type: 'category' // X 坐标轴数据为名义数据（分类数据）
  },
  yAxis: {
    type: 'value' // Y 坐标轴为计量数据（数值数据）
  }
}

```

### 11.2.5 组合图表元素

我们将上面准备好的三个图表元素组合在一起，然后将得到的图表配置传到 ECharts 的实例中，这里以行式数据集为例。

```
const empsRows = [
  { RowId: '001', EmpId: '10', Lastname: 'Smith', Firstname: 'Joe', Salary: 40000 },
  { RowId: '002', EmpId: '12', Lastname: 'Jones', Firstname: 'Mary', Salary: 50000 },
  { RowId: '003', EmpId: '11', Lastname: 'Johnson', Firstname: 'Cathy', Salary: 44000 },
  { RowId: '004', EmpId: '22', Lastname: 'Jones', Firstname: 'Bob', Salary: 55000 },
  { RowId: '005', EmpId: '24', Lastname: 'Steve', Firstname: 'Mike', Salary: 62000 }
]

const option = {
  dataset: {
    source: empsRows
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value'
  },
  series: {
    type: 'scatter',
    encode: {
      x: 'Firstname',
      y: 'Salary'
    }
  }
}

```

在 CodePen 中我们创建一个新的 Pen，然后加入一个新的 JavaScript 依赖，详细方法请见第 1 节。

```
https://cdn.staticfile.org/echarts/4.1.0/echarts.min.js

```

要让数据图表展现在页面上，首先得有一个用于承载图表的容器元素，我们在 CodePen 的 HTML 代码框中创建一个简单的 `div` 元素，并在 CSS 代码框中为其定义合适的尺寸样式。

```
<!-- HTML -->
<div id="chart"></div>

```

```
/* CSS */
#chart {
  width: 600px;
  height: 400px;
}

```

然后在 JavaScript 代码框中我们使用 ECharts 工具库的 API 将该元素进行 ECharts 图表的初始化。

```
const chartEl = document.querySelector('#chart')
const myChart = echarts.init(chartEl)

```

最后，将前面准备好的图表配置应用到该 ECharts 实例上，我们便可以在预览框中看到可视化图表的效果了。

```
const option = {
  dataset: {
    source: empsRows
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value'
  },
  series: {
    type: 'scatter',
    encode: {
      x: 'Firstname',
      y: 'Salary'
    }
  }
}

myChart.setOption(option)

```

![ECharts 简单散点图示例](https://user-gold-cdn.xitu.io/2018/7/21/164bb2ce33f4535f?w=600&h=400&f=png&s=17605)

## 11.3 使用 ECharts 实现散点图绘制

学会了 ECharts 的基本使用方式后，让我们回到正题，学习如何使用 ECharts 绘制一个用于展示班级内各同学身高的散点图。

实际上我们只需要将上面这个图表配置中的数据集换成所需要展示的 `students`，然后将数据系列中的 `encode` 维度绑定更改为学生 ID 和身高信息。

```
{
  type: 'scatter',
  encode: {
    x: 'id',
    y: 'height'
  }
}

```

于是便可以得到一个初步的可视化图表。

![身高图表 - 1](https://user-gold-cdn.xitu.io/2018/7/21/164bbb10d771b392?w=600&h=400&f=png&s=22205)

### 11.3.1 优化图表

虽然我们确实使用了 ECharts 来将我们所生成的数据进行了可视化，但我们也同样发现这个图表并不尽如人意：

1.  图表中数据点都分布在图表的上方，图表的下半部分有一大片的空白区域；
2.  坐标轴上没有任何的提示信息，单从图表数据无法判断数据的语义信息；
3.  除了身高数据以外，数据中还提供了每一位学生的性别信息 `gender`（分别为 `male` 和 `female`），希望能够在图表中有所表示。

我们可以一步一步地来对既有图表进行优化，首先便是解决图表空白区域太多的问题。产生这个问题的原因是因为数据普遍分布在 145 ~ 180 之间，所以 0 ~ 145 这个区间便完全空白。

**拉伸数轴**

要解决这个问题只需要在 Y 坐标轴上让 ECharts 对数轴进行拉伸，去掉空白区域。

```
const option = {
  yAxis: {
    type: 'value',
    scale: true
  }
}

```

![身高图表 - 2](https://user-gold-cdn.xitu.io/2018/7/21/164bbb10d7680342?w=600&h=400&f=png&s=20053)

非常好！接下来让我们继续对图表进行优化，因为我们前面并没有在图表中加入任何提示信息，所以在图表上并没有显示任何关于数据内容的文本说明。

**添加数据信息**

这显然不是一个优秀的可视化图表所应该有的问题，所以我们需要为我们的图表数据加上一些提示信息。我们可以分别在 X 轴和 Y 轴上加入对应数据的名称，并让它们显示在指定的位置。

```
const option = {
  xAxis: {
    type: 'category',
    name: '学号',
    nameLocation: 'middle',
    nameGap: 25
  },
  yAxis: {
    type: 'value',
    scale: true,
    
    name: '身高',
    nameLocation: 'end'
  }
}

```

`name` 属性对应的是指定坐标轴所需要显示的名字（即数据名称），`nameLocation` 为名字的显示方位。详细请参考 [ECharts 配置项文档](http://echarts.baidu.com/option.html#xAxis.nameLocation)。

![身高图表 - 3](https://user-gold-cdn.xitu.io/2018/7/21/164bbb10d7986aaa?w=600&h=400&f=png&s=21051)

最后一个需要优化的东西便是我们希望能够在图表上体现出男生和女生之间的身高差异，这个需要将图表中的数据散点体现出性别的差异。一般来说我们会使用 ECharts 中的图例组件（`legend`）来表示不同的数据分组，但比较遗憾的是目前 ECharts 并不支持直接使用 `dataset` 中的某一个数据进行直接分组（截至 ECharts 版本 4.1.0）。

**数据分组**

要实现这个需求，目前需要将男生的数据和女生的数据分别使用各自的数据系列进行表示，但是因为使用了 `dataset` 来统一集中数据配置，而通过 `encode` 也并不支持对 `dataset` 中的数据维度进行筛选。

所以我们可以另辟蹊径，使用 ECharts 中的另外一个组件视觉映射（`visualMap`）来实现这个功能。一般来说这个组件主要用于表示不同范围或不同程度的数据所对应的不同表现方式（如不同的颜色），比如 0 ~ 10、10 ~ 20、20 ~ 30 等。

但 ECharts 的 VisualMap 组件除了支持区间范围之外，还支持完全匹配某一个值来作为一个区间。那么我们便可以利用这个特性来匹配不同的性别参数，只需要在将其匹配目标指定为我们的性别维度 `gender` 即可。更详尽的关于 VisualMap 使用方法请参考[官方文档](http://echarts.baidu.com/option.html#visualMap)。

```
const option = {
  visualMap: {
    type: 'piecewise', // piecewise 表示的是分段式，continuous 则为连续式
    dimension: 'gender',
    pieces: [
      { value: 'male', label: '男生', color: '#1890ff' },
      { value: 'female', label: '女生', color: '#f5222d' }
    ],
    orient: 'horizontal'
  }
}

```

![身高图表 - 4](https://user-gold-cdn.xitu.io/2018/7/21/164bbb10d784e7f9?w=600&h=400&f=png&s=22908)

## 11.4 折线图 Lines

折线图与散点图相比，虽然都是用于表示一个或多个计量数据，但折线图因为其视觉效果的设计使其更适合用于表示**计量数据随时间或某种特定有序排列的数值变化趋势**。

就好比我们经常能在电视新闻中看到国家统计局会公布国内 GDP 值的环比、同比变化率以及呈现 GDP 值变化的折线图。而在企业中也非常喜欢使用折线图来表示企业的增长，如企业市值的变化等等。

同样是为了方便学习，我们可以假设性地设定一个会随时间年份变化的计量数据，即每一年的数据都有一点差别。而因为折线图所表示的是变化趋势，所以为了迎合该特性，我们在生成随机数据的时候，也可以采用随机生成变化率，而不是直接生成每一个点的数据。

### 11.4.1 生成随机时间序列

假设我们限定每一个单位时间内，当前值较前一个值的变化率绝对值不会超过 ![r \quad (0 < r < 1)](https://juejin.im/equation?tex=r%20%5Cquad%20(0%20%3C%20r%20%3C%201))。

![\left| \frac{T_{i} - T_{i-1}}{T_{i-1}}\right| < r](https://juejin.im/equation?tex=%5Cleft%7C%20%5Cfrac%7BT_%7Bi%7D%20-%20T_%7Bi-1%7D%7D%7BT_%7Bi-1%7D%7D%5Cright%7C%20%3C%20r)

那么我们便可以使用 JavaScript 中用于生成均匀分布在开区间 ![(0, 1)](https://juejin.im/equation?tex=(0%2C%201))（不包含 0 与 1）随机数的 `Math.random()` 生成需要的随机数 ![rand](https://juejin.im/equation?tex=rand)，然后通过以下公式得到一个均匀分布在区间 ![(-r, r)](https://juejin.im/equation?tex=(-r%2C%20r)) 的随机系数。

![\text{coefficient} = 2r(rand - 0.5)](https://juejin.im/equation?tex=%5Ctext%7Bcoefficient%7D%20%3D%202r(rand%20-%200.5))

该公式的推演过程如下。

![random-range](https://user-gold-cdn.xitu.io/2018/7/21/164bd31c470076a9?w=527&h=388&f=png&s=27488)

使用 JavaScript 实现便为如下代码。

```
function randomCoefficient(r) {
  const rand = Math.random()
  const coefficient = (rand - 0.5) * 2 * r

  return coefficient
}

```

这样每一项数据便为上一项数据加上该变化率。

![T_i = T_{i-1}*(1+\text{coefficient}) \quad (i=1,2,\cdots, n)](https://juejin.im/equation?tex=T_i%20%3D%20T_%7Bi-1%7D*(1%2B%5Ctext%7Bcoefficient%7D)%20%5Cquad%20(i%3D1%2C2%2C%5Ccdots%2C%20n))

我们假设数据集的第一项为 100，数据项总数目为 50，得到以下数据生成代码。

```
const X = [ 100 ]
const n = 50 - 1
const r = 0.1

function randomCoefficient(r) {
  const rand = Math.random()
  const coefficient = (rand - 0.5) * 2 * r

  return coefficient
}

for (let i = 0; i < n; ++i) {
  const coefficient = randomCoefficient(r)
  const newValue = X[i] * (1 + coefficient)

  X.push(newValue)
}

console.log(X) //=> [ 100, 95.23, ... ]

const data = X.map(function(x, i) {
  return { time: i + 1, value: x }
})

```

### 11.4.2 绘制折线图

得到了绘制所需要的数据集后，我们便可以将其应用到我们上面所使用到的数据图表中，替换掉原本的散点图数据。当然你也可以直接重新创建一个图表配置，以加深对知识的印象。

```
const option = {
  dataset: {
    source: data
  },
  xAxis: {
    type: 'value',
    name: 'i',
    nameLocation: 'middle',
    nameGap: 25
  },
  yAxis: {
    type: 'value',
    scale: true,
    name: 'x',
    nameLocation: 'end'
  },
  series: {
    type: 'line',
    encode: {
      x: 'time',
      y: 'value'
    }
  }
}

```

![line-chart-1](https://user-gold-cdn.xitu.io/2018/7/21/164bd31c4d3e92ad?w=600&h=400&f=png&s=31407)

### 11.4.3 优化折线图

我们已经得到了一个看着还不错的折线图，但是“图”如其名，数据图表中的线条都是以直线相连的折线。

受数据采集、图表规模等因素的限制和影响，数据点之间的区间有的时候并不是完全空白的。就好比某空气质量传感器每小时整时记录当前的空气质量，那么就在这个时间区间两端的两个空气质量值是否能代表这中间的 58 分钟呢？这在数学上需要使用到插值的方法进行数据的填充，当然这也不在本小册的范围之内，感兴趣的同学可以自行参考《数值分析》相关的教材。

在 ECharts 中折线图直接提供了一个使用方法非常简单的功能，能将原本的折线变成光滑的曲线图，我们只需要在类型为 `line` 的数据系列中加入一项 `smooth` 即可。

```
{
  type: 'line',
  smooth: true,
  encode: {
    x: 'time',
    y: 'value'
  }
}

```

![line-chart-2](https://user-gold-cdn.xitu.io/2018/7/21/164bd45e519a9f82?w=600&h=400&f=png&s=31274)

## 小结

我们在这一节中学习了如何使用 ECharts 创建简单的散点图和折线图，并知道了如何根据实际的需求选择合适的可视化类型。同时我们还学会了如何创建简单的随机数据以满足我们绘制图表的需要。最后还学会了如何对我们所创建的图表一步一步地进行优化，以更好地满足我们的可视化需求。

### 习题

1.  请阅读 ECharts 配置项文档，研究如何将 11.3 中创建的散点图中的数据点根据数值的大小变化点的大小；
2.  请创建两个具有相同时间范围的不同随机时间序列数据，并展示在同一个图表中，其中都采用折线图的方式展示；
3.  请对上一题中你所创建的图表进行优化。