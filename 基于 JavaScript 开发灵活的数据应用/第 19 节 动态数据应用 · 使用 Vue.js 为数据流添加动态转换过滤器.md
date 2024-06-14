### 本资源由 itjc8.com 收集整理
# 第 19 节 动态数据应用 · 使用 Vue.js 为数据流添加动态转换过滤器

在上一节中我们学习了如何利用 Vue.js 配合我们之前所学习过的数据处理方法来处理流式数据。在这一节中，我们将继续学习如何利用 Vue.js 来应对结构不确定的数据流。

## 19.1 基于数据的动态转换过滤器

在上一节中我们通过一个既定的 `typeSet` 来模拟一个不断产生数据的流式数据集，而在我们使用 Vue.js 进行构建的数据应用中，也是根据这个 `typeSet` 来**提前**生成了一个用于过滤数据的过滤器。

但有的时候前端的数据应用并不知道来自其他数据服务的数据内容究竟有哪些过滤项，那么我们便需要根据数据应用所得到的实际数据来生成过滤器。

```
function mockDataSource(typesSet) {
  const dataset = []

  const timer = setInterval(() => {
    const randomType = typesSet[Math.round(Math.random() * (typesSet.length - 1))]

    dataset.push({
      type: randomType,
      timestamp: Date.now(),
      value: Math.random().toString(32).substr(2)
    })
  }, 1e3)

  return {
    dataset,
    stop() {
      clearInterval(timer)
    }
  }
}

const dataSource = mockDataSource(Array(10).fill(1).map((_, i) => `type${i + 1}`))

```

这段代码中我们模拟了一个包含多种可过滤数据 `type` 的流式数据集，且该数据集过滤字段内容是“不可预知”的。那么我先把它利用 Vue.js 展示到页面上看一下。

![](https://user-gold-cdn.xitu.io/2019/1/22/16873ea78a8e44ef?w=434&h=326&f=gif&s=138516)

DEMO 在线地址：[https://codepen.io/iwillwen/pen/oJKMaK?editors=1010](https://codepen.io/iwillwen/pen/oJKMaK?editors=1010)

很好，现在我们再把上一节中层间实现过的类型过滤器应用到这里来。但不一样的是这一次这个流式数据集中所包含的类型都是不可知的，那么按照我们上一节中所学习到的方法，我们则可以将流式数据集中的类型集通过流失处理的方式也处理成一个数据流，应用到过滤器选项中。

我们可以通过使用 Lodash 中的 `groupBy` 方法先将流式数据集按照 `type` 字段进行聚合，然后再通过 `keys` 方法得到聚合后的聚合键集，从而得到动态的过滤选项。

```
<div id="app">
  <label for="type">Type Filter: </label>
  <select name="type" id="type" v-model="typeFilter">
    <option value="none">None</option>
    <option>----------</option>
    <option v-for="type in typesSet" :value="type" :key="type">{{type}}</option>
  </select>

  <table>
    <tr>
      <th>Type</th>
      <th>Timestamp</th>
      <th>Value</th>
    </tr>
    <tr v-for="item in filteredDataset" :key="item.timestamp">
      <td>{{item.type}}</td>
      <td>{{item.timestamp}}</td>
      <td>{{item.value}}</td>
    </tr>
  </table>
</div>

```

```
function mockDataSource(typesSet) {
  const dataset = []

  const timer = setInterval(() => {
    const randomType = typesSet[Math.round(Math.random() * (typesSet.length - 1))]

    dataset.push({
      type: randomType,
      timestamp: Date.now(),
      value: Math.random().toString(32).substr(2)
    })
  }, 1e3)

  return {
    dataset,
    stop() {
      clearInterval(timer)
    }
  }
}

const dataSource = mockDataSource(Array(10).fill(1).map((_, i) => `type${i + 1}`))

new Vue({
  el: '#app',
  data: {
    typeFilter: 'none',
    dataset: dataSource.dataset
  },
  computed: {
    typesSet() {
      return _.keys(_.groupBy(this.dataset, 'type'))
    },
    
    filteredDataset() {
      if (this.typeFilter === 'none') {
        return this.dataset
      }
      
      return this.dataset.filter(item => item.type === this.typeFilter)
    }
  }
})

```

DEMO 在线地址：[https://codepen.io/iwillwen/pen/PXMBvb?editors=1010](https://codepen.io/iwillwen/pen/PXMBvb?editors=1010)

![](https://user-gold-cdn.xitu.io/2019/1/22/16873eab27e72097?w=434&h=326&f=gif&s=277568)

## 19.2 更复杂的动态转换过滤器

笔者在工作中经常会遇到一些非常复杂的动态数据开发需求，其中不乏如 BI（Business Intelligence）之类的项目，具体可以参考如 Superset、Metabase 等等优秀的开源项目。在这些项目中，数据与数据应用之间是相隔离的（特别是通用的开源项目），也就是数据应用除了知道数据源以一个二维表的形式存在以外，对这个数据集的内容和结构完全不清楚。

一般这种情况会出现一个可配置的方案，也就是数据应用本身是一个可配置的通用转换、过滤、展示工具，而数据源和表结构则以配置的方式传递给数据应用。为了表达这种情况的极端性，我们先从模拟一个较为复杂的数据集开始。

```
function genTypes(columnName, count = 10) {
  return Array(count).fill(1).map((_, i) => `${columnName}-type${i + 1}`)
}

function genColumns(count = 10) {
  return Array(count).fill(1).map((_, i) => {
    const columnName = `column${i + 1}`
    const types = genTypes(columnName)

    return {
      name: columnName, types
    }
  })
}

function mockDataSource(columnsCount = 10) {
  const dataset = []

  const columns = genColumns(columnsCount)

  const timer = setInterval(() => {
    const timestamp = Date.now()
    const value = Math.random().toString(32).substr(2)
    
    const item = {
      timestamp, value
    }

    columns.forEach(({ name, types }) => {
      const randomType = types[Math.round(Math.random() * (types.length - 1))]

      item[name] = randomType
    })

    dataset.push(item)
  }, 1e3)

  return {
    dataset,
    stop() {
      clearInterval(timer)
    }
  }
}

const dataSource = mockDataSource(4)

setInterval(() => {
  console.log(dataSource.dataset[dataSource.dataset.length - 1]) // The last inserted one
}, 1e3)
//=> { timestamp: 1547970415609, value: '4ta9d9chh9o', column1: 'column1-type1', column2: 'column2-type7', column3: 'column3-type2', column4: 'column4-type6' }
//=> { timestamp: 1547970416612, value: 'cobh86f288', column1: 'column1-type7', column2: 'column2-type6', column3: 'column3-type9', column4: 'column4-type1' }
//=> ...

```

### 19.2.1 将未知结构的数据集展示在页面上

在这个例子中我们模拟了一个拥有多个不同字段的数据集，而且其中的每一个字段都有多种不确定的可过滤值。现在我们需要将这个数据集展示到页面上，由于数据应用在开发的时候是不清楚数据集的结构的，所以在展示之前首先需要对数据集进行转换以得到该数据集的字段列表。

因为数据结构在数据到达之前是不可知的，而且一般情况下我们需要约定数据集中的每一个个体数据都严格符合整体结构。这样的情况下，便可以通过取得数据集中的第一个记录来取得该数据集的整体结构。

```
<div id="app">
  <table>
    <tr>
      <th v-for="column in columnNames" :key="column">{{column}}</th>
    </tr>
    <tr v-for="(item, i) in dataset" :key="i">
      <td v-for="column in columnNames" :key="column">
        {{item[column]}}
      </td>
    </tr>
  </table>
</div>

```

```
// ...

new Vue({
  el: '#app',

  data: {
    dataset: dataSource.dataset
  },

  computed: {
    columnNames() {
      if (this.dataset && this.dataset.length > 0) {
        return _.keys(this.dataset[0])
      }

      return []
    }
  }
})

```

DEMO 在线地址：[https://codepen.io/iwillwen/pen/NeQmRX?editors=1010](https://codepen.io/iwillwen/pen/NeQmRX?editors=1010)

![](https://user-gold-cdn.xitu.io/2019/1/22/16873eae36e84a83?w=772&h=412&f=gif&s=433108)

### 19.2.2 为未知结构的数据集添加动态过滤器

我们已经将这个复杂的数据集通过动态地感知到其结构以后展示在了页面上，那么接下来便需要对这个数据集进行转换过滤了，因为对各种不确定的数据集进行各种操作正正就是 BI 项目的基本需求。

而且对于这种拥有多个不同字段的数据集，数据应用拥有高度可配置的过滤机制往往是最起码的要求。数据表格展示作为最基本的数据展示方式，我们可以回想一下数据应用领域中的“老大哥”——Microsoft Excel。对于 Excel 本身来说，每一个处理的表格文件都是一个不确定的数据集，而作为用户的我们可以通过其中的“筛选过滤”功能对数据集中的各种字段进行过滤，而且这个机制是可以多字段叠加的。那么在我们开发的数据应用中该如何进行开发呢？

首先需要设计好的是，因为在这个需求中我们要控制两个对象，一个是数据集本身，另外一个则是控制过滤器本身的配置集。我们将这个过滤器的配置集单独处理，每个过滤器包含两个值：字段名和过滤目标值。默认情况下每一个过滤器都是为了将数据集中的制定字段的指定值记录过滤出来，当然在实际应用开发中很有可能还有有更多的选项，比如大于小于之类的过滤方式。

```
const filters = [
  {
    column: '<column>',
    value: '<value>'
  },
  // ...
]

```

当我们只有一个过滤器的时候，我们可以直接判断数据集中的每一个记录中的指定字段是否为指定过滤值。那么当有多个过滤器时，我们可以使用 JavaScript 中的一个原生 API `Array.prototype.every` 来完成这一操作。

```
const row = { /* ... */ }
const filters = [ /* ... */ ]

const isPassed = filters.every(filter => {
  if (filter.column === 'none' || filter.value === 'none') {
    return true
  }
  
  return row[filter.column] === filter.value
})

```

通过 Vue.js 的一些比较基本的使用方法，我们可以非常方便地对过滤器的配置集进行管理。

```
new Vue({
  
  // ...
  
  data: {
    // ...
  
    filters: []
  },
  
  methods: {
    addFilter() {
      this.filters.push({
        column: 'none',
        value: 'none'
      })
    },
    removeFilter(index) {
      this.filters.splice(index, 1)
    }
  }
})

```

但是要让用户能够通过数据应用所提供的功能，来为数据集添加动态过滤器，那么首先就得让用户知道当前有哪些可选值。所以跟需要知道数据集结构中有哪些字段一样，过滤器的可选值还包含了每一个字段中有哪些现有值可以作为过滤的目标值。那么还记得我们在第 10 节中曾经学习过的行式数据集和列式数据集的转换方法吗？在默认的行式数据集中，我们很难通过某一个字段名取得该字段的所有可选值。但是使用列式数据集在处理这个需求时，则变得有着非常好的天然优势。配合着 Lodash 的 `_.uniq` 取得每一个字段中的所有唯一值。

```
new Vue({
  // ...
  
  data: {
    // ...
  
    dataset: dataSource.dataset
  },
  
  computed: {
    colOrientedDataset() {
      return rowOriented2ColOriented(this.dataset)
    },

    columnNames() {
      if (this.dataset && this.dataset.length > 0) {
        return _.keys(this.dataset[0])
      }

      return []
    },

    optionsOfColumns() {
      return _.fromPairs(
        this.columnNames.map(columnName => [ columnName, _.uniq(this.colOrientedDataset[columnName]) ])
      )
    },
  }
})

```

取得这些信息之后，就可以在页面上开发过滤器的控制组件了。我们使用一个简单的列表来表示这个过滤器的配置集，而列表中的每一个元素包含两个 `<select>` 组件分别对应着过滤器的对应字段和过滤目标值。`<select>` 组件中则分别使用前面准备好的 `columnNames` 和 `optionsOfColumns` 来生成 `<option>` 可选项。

```
<div id="app">
  <button @click="addFilter">Add Filter</button>

  <ul id="filters">
    <li v-for="filter, i in filters" :key="i">
      <select v-model="filter.column">
        <option value="none">None</option>
        <option
          v-for="columnName in columnNames"
          :value="columnName"
          :key="columnName"
        >
          {{columnName}}
        </option>
      </select>
      =
      <select v-model="filter.value">
        <option value="none">None</option>
        <option
          v-for="option in (optionsOfColumns[filter.column] || [])"
          :value="option"
          :key="option"
        >
          {{option}}
        </option>
      </select>

      <button @click="removeFilter(i)">x</button>
    </li>
  </ul>
</div>

```

最后我们将这些元素都整合起来便可以得到一个相当不错的效果。

```
<div id="app">
  <button @click="addFilter">Add Filter</button>

  <ul id="filters">
    <li v-for="filter, i in filters" :key="i">
      <select v-model="filter.column">
        <option value="none">None</option>
        <option
          v-for="columnName in columnNames"
          :value="columnName"
          :key="columnName"
        >
          {{columnName}}
        </option>
      </select>
      =
      <select v-model="filter.value">
        <option value="none">None</option>
        <option
          v-for="option in (optionsOfColumns[filter.column] || [])"
          :value="option"
          :key="option"
        >
          {{option}}
        </option>
      </select>

      <button @click="removeFilter(i)">x</button>
    </li>
  </ul>

  <table>
    <tr>
      <th v-for="column in columnNames" :key="column">{{column}}</th>
    </tr>
    <tr v-for="(item, i) in filteredDataset" :key="i">
      <td v-for="column in columnNames" :key="column">
        {{item[column]}}
      </td>
    </tr>
  </table>
</div>

```

```
// ...

const dataSource = mockDataSource(4)

function applyColumn(colDataset, columnName) {
  if (!_.has(colDataset, columnName)) {
    colDataset[columnName] = []
  }

  return colDataset
}

function rowOriented2ColOriented(rowDataset) {
  let colDataset = {}

  rowDataset.forEach(function(row, i) {
    const columnNames = _.keys(row)

    columnNames.forEach(function(columnName) {
      colDataset = applyColumn(colDataset, columnName)
      colDataset[columnName][i] = row[columnName]
    })
  })

  return colDataset
}

new Vue({
  el: '#app',

  data: {
    filters: [],
    dataset: dataSource.dataset
  },

  computed: {
    colOrientedDataset() {
      return rowOriented2ColOriented(this.dataset)
    },

    columnNames() {
      if (this.dataset && this.dataset.length > 0) {
        return _.keys(this.dataset[0])
      }

      return []
    },

    optionsOfColumns() {
      return _.fromPairs(
        this.columnNames.map(columnName => [ columnName, _.uniq(this.colOrientedDataset[columnName]) ])
      )
    },

    filteredDataset() {
      return this.dataset.filter(row => {
        return this.filters.every(({ column, value }) => {
          if (column === 'none' || value === 'none') {
            return true
          }

          return row[column] === value
        })
      })
    }
  },

  methods: {
    addFilter() {
      this.filters.push({
        column: 'none',
        value: 'none'
      })
    },
    removeFilter(index) {
      this.filters.splice(index, 1)
    }
  }
})

```

DEMO 在线地址：[https://codepen.io/iwillwen/pen/Rvbeox?editors=1010](https://codepen.io/iwillwen/pen/Rvbeox?editors=1010)

![](https://user-gold-cdn.xitu.io/2019/1/22/16873eb14d43bd23?w=780&h=503&f=gif&s=1742963)

## 小结

在本小节中我们从较为简单的流式数据集触发，一步一步地尝试添加动态过滤器，并且也从简单的、确定的数据集向更常见的复杂且不确定结构的数据集学习，最后在这种数据集上结合软件工程中的“分治”手段将复杂的问题切分为三个部分：动态数据源、动态数据源的转换过滤展示以及过滤机制的控制管理。相信从第一节开始学习到现在的你已经掌握了非常多的各种数据结构和对他们进行逻辑处理的方法，那么在最后一节中我们将着手开发一个实际的项目，把我们曾经学习过的东西应用起来。

### 习题

尝试在过滤器机制中为每一个过滤器添加过滤方法，即从原本的等于添加如大于、小于、不等于、包含、不包含等等，完成后在评论区提交你的 CodePen 地址。