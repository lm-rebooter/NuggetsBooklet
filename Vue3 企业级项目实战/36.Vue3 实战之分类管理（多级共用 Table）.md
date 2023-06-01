## 前言

认真学完上一节的同学，基本上对 `Element Plus` 组件创建 `Table` 已经是轻车熟路了。路由监听这块知识点，在平时业务开发中使用的频率极高，建议大家去看看 `vue-router` 的[官方文档](https://next.router.vuejs.org/zh/index.html)，已经有小伙伴将最新的文档翻译成中文了，对英文文档不感冒的同学非常友好，`Vue` 的生态非常繁荣。

本小节我们继续来学习一个新的知识点，当然主要也是围绕 `Table` 组件这块知识。我们在业务开发中时常会碰到这样的需求，一级表格页面，点击详情后，对应的是一级表格的二级表格。点击二级表格详情，进入到三级表格。并且还不能切换左侧的菜单栏，也就是在同一个菜单栏下，渲染三个相同的 `Table` 列表页。这就是后台管理系统的二级、三级页面。

#### 本章节知识点

- 通过路径判断，设置返回按钮。

- 多路径公用同一个组件。

## 新建分类页

先打开 `App.vue` 设置好对应的菜单，我们需要在代码中设置一个新的一级菜单，如下所示：

```html
<!--App.vue-->
...
<el-sub-menu index="3">
  <template #title>
    <span>模块管理</span>
  </template>
  <el-menu-item-group>
    <el-menu-item index="/category"><el-icon><Menu /></el-icon>分类管理</el-menu-item>
  </el-menu-item-group>
</el-sub-menu>
...
```

`index` 设置为 3，分类管理路径设置为 `/category`，此时需要在默认打开的参数下，把 3 添加进去：

```js
defaultOpen: ['1', '2', '3'],
```

然后，在 `src/views` 下，新建一个 `Category.vue` 文件，用于分类页面的开发。

最后前往 `/src/router.js` 文件中，配置好路由相关参数，代码如下：

```js
import Category from '@/views/Category.vue'
...
{
  path: '/category',
  name: 'category',
  component: Category
}
```

还有一个地方不要忘了，需要在 `src/utils/index.js` 文件中添加对应的头部名称：

```js
export const pathMap = {
  index: '首页',
  login: '登录',
  add: '添加商品',
  swiper: '轮播图配置',
  hot: '热销商品配置',
  new: '新品上线配置',
  recommend: '为你推荐配置',
  category: '分类管理',
}
```

重启项目，显示效果如下图所示：

![](https://s.yezgea02.com/1618381479358/WeChat3b3590373f15ba5a73513495caf1dc77.png)

## API 数据接入

完成上述操作后，打开 `Category.vue` 文件，进行模板文件的代码编写，如下所示：

**template**

```html
<template>
  <el-card class="category-container">
    <el-table
      :load="state.loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="分类名称"
      >
      </el-table-column>
      <el-table-column
        prop="categoryRank"
        label="排序值"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="220"
      >
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.categoryId)">修改</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleNext(scope.row)">下级分类</a>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDeleteOne(scope.row.categoryId)"
          >
            <template #reference>
              <a style="cursor: pointer">删除</a>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--总数超过一页，再展示分页器-->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="state.total"
      :page-size="state.pageSize"
      :current-page="state.currentPage"
      @current-change="changePage"
    />
  </el-card>
</template>
```

同样，先引入列表数据，之后再编写一些添加删除修改操作，列表接入逻辑的代码如下所示：

**script**

```html
<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'

const router = useRouter() // 声明路由实例
const route = useRoute() // 获取路由参数
const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  type: 'add', // 操作类型
  level: 1,
  parent_id: 0
})
onMounted(() => {
  getCategory()
})
// 获取分类列表
const getCategory = () => {
  const { level = 1, parent_id = 0 } = route.query
  state.loading = true
  axios.get('/categories', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      categoryLevel: level,
      parentId: parent_id
    }
  }).then(res => {
    state.tableData = res.list
    state.total = res.totalCount
    state.currentPage = res.currPage
    state.loading = false
    state.level = level
    state.parentId = parent_id
  })
}
const changePage = (val) => {
  state.currentPage = val
  getCategory()
}
</script>
```

此时我们查看浏览器，列表数据已经可以正常展示，效果如下图所示：

![](https://s.yezgea02.com/1618384851143/WeChata8a896c2fdfdf3c45f6a528330b4b590.png)

> 温馨提示，如果列表数据没有的话，可能是有些调皮的家伙登录了admin账号，在线上将分类数据都删除了，大家可以进入线上地址，自行添加一些数据。地址如下：http://vue3-admin.newbee.ltd，账号：admin，密码：123456。

## 二级页面

接下来完成二级页面的功能制作，点击下一级分类，进入到二级页面。

首先，我们需要创建一个二级的子路由，路由配置项内，可以设置二级子路由，需要在 `/src/router/index.js` 做如下配置：

```js
{
  path: '/category',
  name: 'category',
  component: Category,
  children: [
    {
      path: '/category/level2',
      name: 'level2',
      component: Category,
    },
    {
      path: '/category/level3',
      name: 'level3',
      component: Category,
    }
  ]
},
```

`/category` 路径下，可以配置 `children` 属性，它是一个数组类型，数组内便是上级路由的子路由，我们此处将 `name` 设置成 `level2`、`level3`，它们都是子路由，这样的编码便于后续的路由监听操作。

设置完之后，进入 `Category.vue` 组件，添加路由监听逻辑，代码如下所示：

```html
<script setup>
...
const unwatch = router.afterEach((to) => {
  // 每次路由变化的时候，都会触发监听时间，重新获取列表数据
  if (['category', 'level2', 'level3'].includes(to.name)) {
    getCategory()
  }
})
onUnmounted(() => {
  unwatch()
})
</script>
```

此时我们点击「下一级分类」时，需要切换路由，并且写上等级参数和父级的 `id` 属性。因为每一级请求的数据，需要发送的参数都不一样。

- 一级分类：level = 1；parent_id = 0。

- 二级分类：level = 2；parent_id = 一级分类 id

- 三级分类：level = 3; parent_id = 二级分类 id

按照这样的逻辑，我们编写 `handleNext` 方法如下：

```js
const handleNext = (item) => {
  const levelNumber = item.categoryLevel + 1
  if (levelNumber == 4) {
    ElMessage.error('没有下一级')
    return
  }
  router.push({
    name: `level${levelNumber}`,
    query: {
      level: levelNumber,
      parent_id: item.categoryId
    }
  })
}
```

`item` 是列表的单项数据，`categoryLevel` 为当前分类的等级。比如，我在一级分类点击「下一级分类」，下一级分类需要的 `level` 参数是 2，所以这个声明了 `const levelNumber = item.categoryLevel + 1`，如果 `levelNumber` 为 4 时，说明当前等级已经是 3，我们需要 return 这个方法，并且提示没有下一级分类。亦或是在第三级的列表，隐藏掉「下一级分类」按钮。

然后通过 `router.push` 的形式修改浏览器地址路径，`router.afterEach` 就能监听到，并且触发 `getCategory` 方法，重新获取列表数据，并且 `getCategory` 方法内，通过 `route` 去获取浏览器地址栏上的查询参数，如下：

```js
const { level = 1, parent_id = 0 } = route.query // 默认没有的情况下，level 为 1，parent_id 为 0
```

还有头部名称配置别忘了，打开 `/src/utils/index.js`：

```js
export const pathMap = {
  index: '首页',
  login: '登录',
  add: '添加商品',
  swiper: '轮播图配置',
  hot: '热销商品配置',
  new: '新品上线配置',
  recommend: '为你推荐配置',
  category: '分类管理',
  level2: '分类二级管理',
  level3: '分类三级管理',
}
```

刷新浏览器，查看功能是否正常，切换效果如下图所示则代表成功了。

![](https://s.yezgea02.com/1618387082667/Kapture%202021-04-14%20at%2015.57.54.gif)

注意左上角，进入二级页面后，需要添加一个返回按钮，方便回到上级页面。此时我们需要给 `components/Header.vue` 添加一些逻辑，首先是模板部分：

**template**

```diff
<div class="left">
+  <el-icon class="back" v-if="state.hasBack" @click="back"><Back /></el-icon>
  <span style="font-size: 20px">{{ state.name }}</span>
</div>
```

**script**

```html
<script>
  export default {
    setup() {
      const state = reactive({
        ...
        hasBack: false, // 是否展示返回icon
      })

      router.afterEach((to) => {
        const { id } = to.query
        state.name = pathMap[to.name]
        // level2 和 level3 需要展示返回icon
        state.hasBack = ['level2', 'level3'].includes(to.name)
      })
      // 返回方法
      const back = () => {
        router.back()
      }

      return {
        ...
        back
      }
    }
  }
</script>
```

**css**

```css
.header .left .back {
  border: 1px solid #e9e9e9;
  padding: 5px;
  border-radius: 50%;
  margin-right: 5px;
  cursor: pointer;
}
```

观察浏览器网页变化，如下图所示：

![](https://s.yezgea02.com/1618389784373/Kapture%202021-04-14%20at%2016.42.54.gif)

## 新增、修改、删除逻辑

这部分的新增修改逻辑和上一节的弹窗类似，但是弹窗内容不同，所以不建议将弹窗都封装成同一个组件。

在 `/src/components` 文件夹下新建一个弹窗组件 `DialogAddCategory.vue`，代码如下：

```html
<template>
  <el-dialog
    :title="state.type == 'add' ? '添加分类' : '修改分类'"
    v-model="state.visible"
    width="400px"
  >
    <el-form :model="state.ruleForm" :rules="state.rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="商品名称" prop="name">
        <el-input type="text" v-model="state.ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="rank">
        <el-input type="number" v-model="state.ruleForm.rank"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  type: String, // 用于判断是添加还是编辑
  reload: Function // 添加或修改完后，刷新列表页
})

const formRef = ref(null)
const route = useRoute()
const state = reactive({
  visible: false,
  categoryLevel: 1,
  parentId: 0,
  ruleForm: {
    name: '',
    rank: ''
  },
  rules: {
    name: [
      { required: 'true', message: '名称不能为空', trigger: ['change'] }
    ],
    rank: [
      { required: 'true', message: '编号不能为空', trigger: ['change'] }
    ]
  },
  id: ''
})
// 获取详情
const getDetail = (id) => {
  axios.get(`/categories/${id}`).then(res => {
    state.ruleForm = {
      name: res.categoryName,
      rank: res.categoryRank
    }
    state.parentId = res.parentId
    state.categoryLevel = res.categoryLevel
  })
}
// 开启弹窗
const open = (id) => {
  state.visible = true
  if (id) {
    state.id = id
    // 如果是有 id 传入，证明是修改模式
    getDetail(id)
  } else {
    // 否则为新增模式
    // 新增类目，从路由获取分类 level 级别和父分类 id
    const { level = 1, parent_id = 0 } = route.query
    state.ruleForm = {
      name: '',
      rank: ''
    }
    state.parentId = parent_id
    state.categoryLevel = level
  }
}
// 关闭弹窗
const close = () => {
  state.visible = false
}
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (props.type == 'add') {
        // 添加方法
        axios.post('/categories', {
          categoryLevel: state.categoryLevel, // 分类等级
          parentId: state.parentId, // 当前分类的父分类 id
          categoryName: state.ruleForm.name, // 分类名称
          categoryRank: state.ruleForm.rank // 分类权重
        }).then(() => {
          ElMessage.success('添加成功')
          state.visible = false
          // 接口回调之后，运行重新获取列表方法 reload
          if (props.reload) props.reload()
        })
      } else {
        // 修改方法
        axios.put('/categories', {
          categoryId: state.id,
          categoryLevel: state.categoryLevel,
          parentId: state.categoryLevel,
          categoryName: state.ruleForm.name,
          categoryRank: state.ruleForm.rank
        }).then(() => {
          ElMessage.success('修改成功')
          state.visible = false
          // 接口回调之后，运行重新获取列表方法 reload
          if (props.reload) props.reload()
        })
      }
    }
  })
}
</script>
```

弹窗的关键逻辑，都已经在代码中进行注释。要注意的是父组件是可以通过 ref 方法，拿到弹窗组件的所有 return 的方法。

学习过程中如果遇到代码执行错误等问题，请注意检查是否是 `Element Plus` 的版本升级所致，实在找不出，请到本小节文章底部下载本节源码，对比学习。

接下来我们把 `Table` 的头部加上，`el-card` 支持具名插槽 `#header`，在插槽内编写内容，就会展示在 `el-card` 组件的头部。

打开 `Category.vue` 文件，在模板下添加如下代码：

**template**

```html
<template>
  <el-card class="category-container">
    <template #header>
      <div class="header">
        <el-button type="primary" :icon="Plus" @click="handleAdd">增加</el-button>
        <el-popconfirm
          title="确定删除吗？"
          confirmButtonText='确定'
          cancelButtonText='取消'
          @confirm="handleDelete"
        >
          <template #reference>
            <el-button type="danger" :icon="Delete">批量删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </template>
    ...
    <DialogAddCategory ref='addCate' :reload="getCategory" :type="state.type" />
  <el-card>
</template>
```

业务逻辑添加情况如下：

**script**

```html
<script setup>
import DialogAddCategory from '@/components/DialogAddCategory.vue'

const addCate = ref(null)
const state = reactive({
  ...
  multipleSelection: [], // 选中项
})
...
// 添加分类
const handleAdd = () => {
  state.type = 'add' // 传入弹窗组件用于弹窗 title 判断
  addCate.value.open()
}
// 修改分类
const handleEdit = (id) => {
  state.type = 'edit' // 传入弹窗组件用于弹窗 title 判断
  addCate.value.open(id)
}
// 选择项
const handleSelectionChange = (val) => {
  // 多选 checkbox
  state.multipleSelection = val
}
// 批量删除
const handleDelete = () => {
  if (!state.multipleSelection.length) {
    ElMessage.error('请选择项')
    return
  }
  axios.delete('/categories', {
    data: {
      ids: state.multipleSelection.map(i => i.categoryId)
    }
  }).then(() => {
    ElMessage.success('删除成功')
    getCategory()
  })
}
// 单个删除
const handleDeleteOne = (id) => {
  axios.delete('/categories', {
    data: {
      ids: [id]
    }
  }).then(() => {
    ElMessage.success('删除成功')
    getCategory()
  })
}
</script>
```

这里要注意的是 `multipleSelection` 用于选项的存储，`@selection-change` 方法是 `el-table` 组件的 `checkbox` 发生变化时触发的方法。

如果遇到页面方法点击报错的情况，多半是声明后，没有 `return` 所致，别问我是怎么知道的，我踩了无数次这样的坑。

##总结

本小节和上一小节的内容相比，页面虽然都是用同一个，但是上一个是三个不同的 `menu`，而本小节的是在同一个 `menu` 下，分别加载不同的数据内容。

涉及到了子路由的知识点，并且再次巩固了 `Table` 组件的使用。

#### 本章源码地址

[点击下载](https://s.yezgea02.com/1663555654865/admin05.zip)

> 文档最近更新时间：2022 年 9 月 20 日。