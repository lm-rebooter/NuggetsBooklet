### 本资源由 itjc8.com 收集整理
# 第 12 节 · 基于ECharts 的基础表达性统计图表 · 柱状图与饼图

在上一节中我们学习了 ECharts 的基本使用方法以及如何使用 ECharts 绘制散点图与折线图。散点图主要用于表示多个数据点在一维或二维特征空间中的分布情况，而折线图主要用于表示某一个计量数据在一定的顺序范围内的变化情况。

学习了这两种数据可视化图表之后，相信你已经对数据可视化的原理有了一定的认识。数据可视化的出发点永远是数据本身，图表绘制过程中需要通过理解数据所包含的实际意义，并根据需求选择合适的可视化图表。那么，我相信你已经准备好学习接下来更多的数据可视化图表了。

## 12.1 柱状图 Bar

在我们日常生活中能看到的数据可视化图表中，柱状图可能会占据着大多数，因为它非常适合用于展示同一量纲下不同计量数据值的区别。比如需要对比某年某市多所高中的本科录取人数、本科率等，柱状图绝对是最适合的选择。

### 12.1.1 准备数据

柱状图所需要的数据集非常简单，每一个类目对应着一个柱状数据，柱状的高度对应着该类目的计量数据。假设某年某市 4 所高中的本科录取人数以及本科率如下表所示。

学校

高中 A

高中 B

高中 C

高中 D

本科录取人数

![N_A](https://juejin.im/equation?tex=N_A)

![N_B](https://juejin.im/equation?tex=N_B)

![N_C](https://juejin.im/equation?tex=N_C)

![N_D](https://juejin.im/equation?tex=N_D)

本科率

![P_A](https://juejin.im/equation?tex=P_A)

![P_B](https://juejin.im/equation?tex=P_B)

![P_C](https://juejin.im/equation?tex=P_C)

![P_D](https://juejin.im/equation?tex=P_D)

其中，我们假设数列 ![N](https://juejin.im/equation?tex=N) 中的每一个元素都为大于 1000 小于 1500 的随机数，而数列 ![P](https://juejin.im/equation?tex=P) 中的元素则为大于 0.85 小于 1 的随机数。同样，我们使用 JavaScript 生成一个符合这些约束的数据集，以便于学习。

```
const N = []
const P = []
const n = 4

function getRandomInt(min, max) {
  return Math.round(min + Math.random() * (max - min))
}

for (let i = 0; i < n; ++i) {
  N.push(getRandomInt(1000, 1500))
  P.push(getRandomInt(85, 100) / 100)
}

console.log(N) //=> [ 1395, 1318, 1447, 1437 ]
console.log(P) //=> [ 0.96, 0.89, 0.98, 0.99 ]

```

得到了两个数列之后，还需要将它们整合起来成为一个 ECharts 可用的行式数据集。

```
const schools = []

for (let i = 0; i < n; ++i) {
  schools.push({
    name: String.fromCharCode(65 + i),
    N: N[i],
    P: P[i]
  })
}

console.log(schools) //=> [ { name: 'A', N: 1395, P: 0.96 }, ... ]

```

### 12.1.2 绘制柱状图

我们还是继续使用上一节中设计好的图表配置进行修改，首先将 `dataset.source` 改成我们现在需要用的 `schools` 学校数据集。

```
const option = {
  dataset: {
    source: schools
  }
}

```

然后将 `series` 中的 `type` 改成目前我们需要使用的柱状图 `bar`，并同时修改 `encode` 中的维度绑定以符合我们新的数据集。

```
const option = {
  series: {
    type: 'bar',
    encode: {
      x: 'name',
      y: 'N'
    }
  }
}

```

最后得到完整的图表配置项，将其应用到 ECharts 实例中查看效果。

```
const option = {
  dataset: {
    source: schools
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      encode: {
        x: 'id',
        y: 'N'
      }
    }
  ]
}

myChart.setOption(option)

```

![bar-chart-1](https://user-gold-cdn.xitu.io/2018/7/28/164df2fd8440161a?w=600&h=400&f=png&s=16131)

由此可见，我们在使用 ECharts 的时候，只需要关注如何组织数据、如何选择可视化图表类型便可以在一定程度上得到所需要的数据图表。

### 12.1.3 优化图表

在日常生活中柱状图应该会是我们使用频率最多的一种数据可视化图表类型，而在平常所看到的柱状图中除了柱状图本身以外，还有很多辅助元素供图表阅读者更好地理解数据。接下来就来为我们所创建的柱状图表添加一些元素来进行优化，使得这个图表更加完善和直观。

**添加数据标签**

在上面的图表中，虽然左侧有 Y 坐标轴提供数值指示的功能，但因为 Y 坐标轴所能标识的数值有限，而柱状图本身也并不具备标明精确数值的功能，所以我们需要添加数据标签以准确指明数值。

在 `bar` 数据系列中添加一个 `label` 配置，以显示一个数值标签。

```
const option = {
  series: [
    {
      type: 'bar',
      encode: {
        x: 'id',
        y: 'N'
      },
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      }
    }
  ]
}

```

![bar-chart-2](https://user-gold-cdn.xitu.io/2018/7/30/164eb68364b10877?w=600&h=400&f=png&s=18792)

**添加平均值辅助线**

除了对数值进行标识之外，对于标识不同分类数值的柱状图来说，通常还需要向读者传递一些统计信息，比如该数值的平均值等。在 ECharts 中为图表添加这些信息可以用到 `markLine` 组件来添加带数值的辅助线。

比如我们需要为某一个柱状图数据系列添加一个表示均值的辅助线，可以如下修改配置项。

```
const option = {
  series: [
    {
      type: 'bar',
      encode: {
        x: 'id',
        y: 'N'
      },
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      },
      markLine: {
        data: [
          { type: 'average', name: '平均值' }
        ]
      }
    }
  ]
}

```

![bar-chart-3](https://user-gold-cdn.xitu.io/2018/7/30/164eb683669a5eb4?w=600&h=400&f=png&s=20252)

可以看到已经有一条横向的虚线表示了该柱状图数据序列的平均值，但因为这条线的颜色与柱状图的颜色相同，视觉效果上并不如意。所以我们可以为这条线加一些样式，使其与柱状图相区分开来。

```
const option = {
  series: [
    {
      type: 'bar',
      encode: {
        x: 'id',
        y: 'N'
      },
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      },
      markLine: {
        data: [
          {
            type: 'average',
            name: '平均值',
            lineStyle: {
              color: '#ffa39e'
            }
          }
        ]
      }
    }
  ]
}

```

![bar-chart-4](https://user-gold-cdn.xitu.io/2018/7/30/164eb6837de1ddff?w=600&h=400&f=png&s=19751)

### 12.1.4 绘制多个数据系列

我们在准备数据的时候，除了每一个学校的本科录取人数以外，还有该学校的本科率。而上面我们所绘制的图表中只使用到了一个数据系列来表示本科录取人数，所以我们接下来为了让可视化图表更好地表达我们所准备的数据内容，需要将本科率也展示在图表上。

我们可以首先在 `series` 配置中添加一个新的 `bar` 数据系列，并将数据绑定 `encode.y` 改为 `P` 即各学校的本科率。

```
const option = {
  series: [
    {
      type: 'bar',
      encode: {
        x: 'id',
        y: 'N'
      },
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      },
      markLine: {
        data: [
          {
            type: 'average',
            name: '平均值',
            lineStyle: {
              color: '#ffa39e'
            }
          }
        ]
      }
    },
    {
      type: 'bar',
      encode: {
        x: 'id',
        y: 'P'
      },
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      },
      markLine: {
        data: [
          {
            type: 'average',
            name: '平均值',
            lineStyle: {
              color: '#096dd9'
            }
          }
        ]
      }
    }
  ]
}

```

![bar-chart-5](https://user-gold-cdn.xitu.io/2018/7/30/164eb68368169972?w=600&h=400&f=png&s=23375)

为什么并没有看到另外一个柱状图？这是因为本科录取人数的数据范围在 1000 到 1500 之间，而本科率的范围则在 0 到 1 之间，而且量纲也相异。所以我们需要借助其他辅助手段对图表进行优化。

虽然说我们比较常用的坐标轴为笛卡尔坐标系也就是直角坐标系，只有一个 X 坐标轴和一个 Y 坐标轴。但若需要将不同量纲的数据在同一个数据图表中展示，就可以使用多个不同的 Y 坐标轴表示。

我们需要在 `yAxis` 上添加一个新的 Y 坐标轴，然后把本科率的数据系列绑定到这个坐标轴上。

```
const option = {
  yAxis: [
    {
      type: 'value',
      name: '本科录取人数'
    },
    {
      type: 'value',
      name: '本科率'
    }
  ],
  series: [
    {
      type: 'bar',
      encode: {
        x: 'id',
        y: 'N'
      },
      label: {
        normal: {
          show: true,
          position: 'top'
        }
      },
      markLine: {
        data: [
          {
            type: 'average',
            name: '平均值',
            lineStyle: {
              color: '#ffa39e'
            }
          }
        ]
      }
    },
    {
      type: 'bar',
      yAxisIndex: 1, // 绑定副 Y 坐标轴
      encode: {
        x: 'id',
        y: 'P'
      },
      label: {
        normal: {
          show: true,

          position: 'top'
        }
      },
      markLine: {
        data: [
          {
            type: 'average',
            name: '平均值',
            lineStyle: {
              color: '#096dd9'
            }
          }
        ]
      }
    }
  ]
}

```

![bar-chart-6](https://user-gold-cdn.xitu.io/2018/7/30/164eb68377785366?w=600&h=400&f=png&s=30784)

## 12.2 饼图

我们知道柱状图可以用于展示不同组别的数值数据的大小，而饼图的作用则是将不同组别的数值数据合并在同一个数轴上，并以更直观的方式展示不同组别之间的大小关系。

### 12.2.1 绘制基本饼图

同样是通过修改数据系列的类型为 `pie`，然后更改数据绑定 `encode` 中的维度信息。因为饼状图并不需要使用到直角坐标系，所以我们这里可以将前面一直都有使用到的 `xAxis` 和 `yAxis` 删除。

```
const option = {
  dataset: {
    source: schools
  },
  series: {
    type: 'pie',
    encode: {
      itemName: 'name',
      value: 'N'
    }
  }
}

```

![pie-chart-1](https://user-gold-cdn.xitu.io/2018/8/3/164fda5368832041?w=600&h=400&f=png&s=18748)

### 12.2.2 添加数据标签

与柱状图相同，这个饼图虽然已经能够比较直观地表达出不同组别之间数据的大小关系，但是却无法直观地表达准确的数据值。所以我们也需要为饼图添加数据标签以表明准确的数值数据。

可以通过修改 ECharts 中饼图的 `label` 也就是标签，来显示每一个组别的组别名、准确数值及其百分比。在 `label.formatter` 中添加 `{@name}` 以显示组别名（维度 `name`），添加 `{@N}` 以显示每一个学校的本科录取人数，以及内置的变量 `{d}` 以显示每一个学校的百分比。

```
const option = {
  dataset: {
    source: schools
  },
  series: {
    type: 'pie',
    label: {
      formatter: '{@name}: {@N} ({d}%)'
    },
    encode: {
      value: 'N',
      itemName: 'name'
    }
  }
}

```

![pie-chart-2](https://user-gold-cdn.xitu.io/2018/8/3/164fda5368a0616f?w=600&h=400&f=png&s=26799)

## 小结

在这一节中我们学习了另外两种简单的数据图表——柱状图和饼图的使用，至此我们已经学习了 4 种基本的数据图表类型，这已经足够我们将它们使用到 90% 以上的数据可视化任务中了。但这其实还不够，我们还需要学习一些更为复杂的数据图表类型，以将它们相互组合完成更多样化的需求。