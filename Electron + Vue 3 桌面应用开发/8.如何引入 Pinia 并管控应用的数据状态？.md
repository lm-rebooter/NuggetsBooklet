我们一般都会考虑统筹管理一个上了规模的 Vue 项目的数据状态，对于基于 Vue2.x 创建的前端项目来说，Vuex 是个不错的选择；但对于使用 Vue3.x 创建前端项目来说，可能 Pinia 才是更好的选择。

相对于 Vuex 来说，Pinia 有以下几方面的优势。

- **Pinia 没有`mutations`**，相应的工作都在`actions`中完成，而且`actions`直接支持异步函数。
- **Pinia 完美支持 `TypeScript`**，Vuex 在这方面做得不是很好。
- **Pinia 对开发工具支持很好**，尤其是 `VS Code`，智能提示很完善，这方面 Vuex 做得不是很好。Pinia 对调试工具（`vue-devtools`）也支持得很好。
- **不需要再使用名称空间来控制 `store`**，也不需要再考虑 store 的嵌套问题。
- **Pinia 性能优于 Vuex**。

接下来我们就从“如何为工程引入 Pinia，如何创建 Store，如何创建数据模型，如何使用 Store，如何订阅 Store，如何完成 Store 间的互访”等几个方面讲解如何使用 Pinia 管控应用的数据状态。

## 为项目引入 Pinia

使用如下命令为项目安装 `Pinia` 依赖：

```
npm install pinia -D
```

安装完成后，修改渲染进程的入口文件，使其加载 `Pinia` 插件

```ts
// src\renderer\main.ts
import { createApp } from "vue";
import "./assets/style.css";
import "./assets/icon/iconfont.css";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";

createApp(App).use(createPinia()).use(router).mount("#app");
```

## 创建 Store

接下来，我们在`src\renderer\store`目录下为我们的应用创建第一个 Store 程序，代码如下：

```ts
//src\renderer\store\useChatStore.ts
import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { ModelChat } from "../../model/ModelChat";
//初始化模拟数据
let prepareData = () => {
  let result = [];
  for (let i = 0; i < 10; i++) {
    let model = new ModelChat();
    model.fromName = "聊天对象" + i;
    model.sendTime = "昨天";
    model.lastMsg = "这是此会话的最后一条消息" + i;
    model.avatar = `https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c`;
    result.push(model);
  }
  return result;
};
//定义一个Store
export const useChatStore = defineStore("chat", () => {
  let data: Ref<ModelChat[]> = ref(prepareData());
  let selectItem = (item: ModelChat) => {
    if (item.isSelected) return;
    data.value.forEach((v) => (v.isSelected = false));
    item.isSelected = true;
  };
  return { data, selectItem };
});
```

在这个文件中，我们通过 export 暴露了一个 `useChatStore` 方法，这个方法是通过 Pinia 的`defineStore`方法创建的，在 Vue 业务组件中执行这个函数实例才会得到真正的 Store。

我们**使用`defineStore(name,function)`的形式创建 Store，这种形式的 Store 叫作`Setup Stores`**。Pinia 还提供了另一种形式的 Store ：[Option Stores](https://pinia.vuejs.org/core-concepts/#option-stores)，具体可以参阅 Pinia 的官方文档。你如果也像我一样倾向于使用 Vue 组件的 Setup API（这也是 Vue 作者推荐的方式），那么使用 Pinia 的`Setup Stores`会更方便，编码风格也一致。

这个 Store 的状态数据存储在：`data`属性中，这是一个被`Ref`对象包裹着的数组，数组里的内容是我们通过`prepareData`方法模拟的（模拟了十个聊天会话对象）。

这个 Store 还提供了一个`Action`方法：`selectItem`，这个方法用于选中某个具体的聊天会话。

代码中的 ModelChat 是数据模型定义类，接下来我们就介绍这个数据模型。

## 数据模型

聊天会话的数据模型是在`src\model`目录下定义的，因为应用的主进程和渲染进程都可能会用到数据模型，所以我们把它放置在`renderer`和`main`的同级目录下。以后我们还会在这个目录下定义更多的模型。

`ModelChat`模型的代码如下所示：

```ts
// src\model\ModelChat.ts
import { ModelBase } from "./ModelBase";
export class ModelChat extends ModelBase {
  fromName?: string;
  sendTime?: number | string;
  isSelected = false;
  lastMsg?: string;
  avatar?: string;
  /**
   * 0单聊，1群聊，2公众号，3文件传输助手
   */
  chatType?: number;
}
```

**模型主要用于描述对象携带的信息**，所以模型里的类并没有具体的方法。

由于所有的模型都会拥有一些共同的字段，所以我们把这些字段放置在模型的基类`ModelBase`中，这个类的代码如下所示：

```ts
// src\model\ModelBase.ts
import crypto from "crypto";
export class ModelBase {
  id: string;
  constructor() {
    this.id = crypto.randomUUID();
  }
}
```

这里我们暂时只提供了一个公共字段：`id`，**凡继承于`ModelBase`的子类都将拥有这个字段**，而且这个字段是随模型实例化的时候自动创建的。也就是说，只有`new ModelXXXX`时才会创建这个字段，`let model = obj as ModelXXXX`时不会创建这个字段。

我们使用 Node.js `crypto`模块的`randomUUID`方法来生成每个聊天会话的 ID，这将为我们把数据存储在数据库中打下基础。

> 无论是`ModelChat`模型还是我们后文介绍到的其他模型，都只用作演示用途，实际项目中的模型要比这些模型复杂得多。

## 使用 Store

首先我们把模型中模拟的 10 个聊天会话显示在界面上，代码如下所示：

```ts
<script setup lang="ts">
// src\renderer\Window\WindowMain\Chat\ChatBoard.vue
import { onMounted } from "vue";
import { useChatStore } from "../../../store/useChatStore";
import ChatItem from "./ChatItem.vue";
import ChatSearch from "./ChatSearch.vue";
let store = useChatStore();
onMounted(() => {
  //选中第七个会话
  store.selectItem(store.data[6]);
});
</script>
```

```html
<template>
  <div class="ChatList">
    <ChatSearch />
    <div class="ListBox">
      <ChatItem :data="item" v-for="item in store.data" :key="item.id" />
    </div>
  </div>
</template>
```

在这段代码中，我们通过 Vue 的`v-for`指令渲染了一个自定义组件列表（`ChatItem`）。

**store 对象是通过`useChatStore`方法获取的**，`useChatStore`方法就是我们前面介绍的`useChatStore.ts`导出的方法。得到 store 对象之后，可以直接使用`store.data`获取 Store 对象里的数据。

在当前组件`ChatBoard`渲染完成后，我们调用了`store`对象的`selectItem`方法，选中了第 7 个会话

具体每一个聊天会话对象是通过自定义组件的 `data` 属性传递到组件内部的。

实际上我们在`ChatBoard`组件渲染完成时，还可以通过如下代码来选中某个聊天会话：

```ts
store.$patch((v) => (v.data[5].isSelected = true));
```

`ChatItem`自定义组件的代码如下所示：

```ts
<script setup lang="ts">
// src\renderer\Window\WindowMain\Chat\ChatItem.vue
import { ModelChat } from "../../../../model/ModelChat";
import { useChatStore } from "../../../store/useChatStore";
defineProps<{ data: ModelChat }>();
let store = useChatStore();
let itemClick = (item: ModelChat) => {
  //选中当前会话
  store.selectItem(item);
};
</script>
```

```html
<template>
  <div @click="itemClick(data)" :class="['chatItem', { chatItemSelected: data.isSelected }]">
    <div class="avatar">
      <img :src="data.avatar" alt="" />
    </div>
    <div class="chatInfo">
      <div class="row">
        <div class="fromName">{{ data.fromName }}</div>
        <div class="timeName">{{ data.sendTime }}</div>
      </div>
      <div class="row">
        <div class="lastMsg">{{ data.lastMsg }}</div>
        <div class="subscribe"></div>
      </div>
    </div>
  </div>
</template>
```

在这段代码中，我们使用`defineProps`方法接收父组件传来的数据。

聊天会话对象里的数据在这个自定义组件中被展开，渲染给用户。

**当用户点击这个自定义组件的时候，程序执行了 Store 对象的`selectItem`方法，这个方法负责选中用户点击的组件，改变了用户点击组件的样式，同时还取消了原来选中的组件**。

## 订阅 Store

无论是用户点击`ChatItem`组件选中一个聊天会话，还是`ChatBoard`渲染完成后选中一个聊天会话，我们都应该通知其他组件，选中的聊天会话变更了。

这里我们在`MessageBoard`组件中演示这个功能，代码如下所示：

```ts
<script setup lang="ts">
//src\renderer\Window\WindowMain\Chat\MessageBoard.vue
import { ref } from "vue";
import BarTop from "../../../Component/BarTop.vue";
import { useChatStore } from "../../../store/useChatStore";
let store = useChatStore();
let logInfo = ref("");
let curId = "";
//订阅Store内数据的变化
store.$subscribe((mutations, state) => {
  let item = state.data.find((v) => v.isSelected);
  let id = item?.id as string;
  if (id != curId) {
    logInfo.value = `现在应该加载ID为${item?.id}的聊天记录`;
    curId = id;
  }
});
</script>
```

```html
<template>
  <div class="MessageBord">
    <BarTop />
    <div class="MessageList">{{ logInfo }}</div>
  </div>
</template>
```

在上面代码中我们**使用`store`对象的`$subscribe`方法订阅了数据变更事件**，无论什么时候 store 内的数据发生了变化，都会执行我们为`$subscribe`方法提供的回调函数。

> 用户点击`ChatItem`组件选中一个聊天会话时，无论是通过`selectItem`方法更新数据，还是通过`$patch`方法更新数据，都会触发订阅事件。

我们在订阅回调中，验证选中的会话是否发生了变化（有可能是当前 store 其他数据对象的变化触发了订阅回调），如果是，那么就给出提示（此处仅仅用于演示）。

订阅回调函数有两个参数 ，第一个是 `mutations` 参数，这个参数的`events`属性携带着变更前的值和变更后的值，但这个属性只有在开发环境下存在，生产环境下不存在。**订阅的第二个参数是 state，这个参数包含 store 中的数据**。

以这种方式更新 store 里的数据，不利于复用数据更新的逻辑，接下来我就介绍可以复用数据更新逻辑的方案。

## store 的互访

让我们新建一个模型类，代码如下所示：

```ts
//src\model\ModelMessage.ts
import { ModelBase } from "./ModelBase";
export class ModelMessage extends ModelBase {
  createTime?: number;
  receiveTime?: number;
  messageContent?: string;
  chatId?: string;
  fromName?: string;
  avatar?: string;
  //** 是否为传入消息 */
  isInMsg?: boolean;
}
```

这个模型用于描述聊天的消息，聊天会话模型与这个模型之间的关系是一对多的关系（1:n），它们之间的关系字段就是`ModelChat`模型的 id 字段和`ModelMessage`模型的`chatId`字段。后面的代码中我们还会进一步描述这种关系。

然后创建`useMessageStore`，用于管理消息的状态数据，代码如下：

```ts
//src\renderer\store\useMessageStore.ts
import { ModelChat } from "./../../model/ModelChat";
import { ModelMessage } from "./../../model/ModelMessage";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMessageStore = defineStore("message", () => {
  let data = ref<ModelMessage[]>([]);
  let msg1 = `醉里挑灯看剑，梦回吹角连营。八百里分麾下灸，五十弦翻塞外声。沙场秋点兵。马作的卢飞快，弓如霹雳弦惊。了却君王天下事，嬴得生前身后名。可怜白发生`;
  let msg2 = `怒发冲冠，凭栏处，潇潇雨歇。抬望眼，仰天长啸，壮怀激烈。 三十功名尘与土，八千里路云和月。莫等闲，白了少年头，空悲切！ 靖康耻，犹未雪；臣子恨，何时灭?驾长车，踏破贺兰山缺！ 壮志饥餐胡虏肉，笑谈渴饮匈奴血。待从头，收拾旧山河，朝天阙！`;
  let initData = (chat: ModelChat) => {
    let result = [];
    for (let i = 0; i < 10; i++) {
      let model = new ModelMessage();
      model.createTime = Date.now();
      model.isInMsg = i % 2 === 0;
      model.messageContent = model.isInMsg ? msg1 : msg2;
      model.fromName = model.isInMsg ? chat.fromName : "我";
      model.avatar = chat.avatar;
      model.chatId = chat.id;
      result.push(model);
    }
    data.value = result;
  };
  return { data, initData };
});
```

如你所见，消息数据我们也是模拟出来的，这里模拟了 10 条消息，我们预期用户切换会话的时候，执行`initData`方法，初始化当前会话的消息。

现在我们修改一下`MessageBoard`组件的的代码，如下所示：

```ts
<script setup lang="ts">
import { ModelChat } from "../../../../model/ModelChat";
import BarTop from "../../../Component/BarTop.vue";
import { useChatStore } from "../../../store/useChatStore";
import { useMessageStore } from "../../../store/useMessageStore";
import MessageItem from "./MessageItem.vue";
let chatStore = useChatStore();
let messageStore = useMessageStore();
let curId = "";
//订阅Store内数据的变化
chatStore.$subscribe((mutations, state) => {
  let item = state.data.find((v) => v.isSelected) as ModelChat;
  if (item.id != curId) {
    messageStore.initData(item);
    curId = item.id;
  }
});
</script>
```

```html
<template>
  <div class="MessageBord">
    <BarTop />
    <div class="MessageList">
      <MessageItem :data="item" v-for="item in messageStore.data" :key="item.id" />
    </div>
  </div>
</template>
```

现在**当选中的聊天会话切换时，我们执行了`messageStore`对象的`initData`方法，这样就初始化了`messageStore`内部的状态数据**。

`MessageItem`是我们新创建的一个 Vue 组件，这个组件用于显示一条消息的具体信息。代码如下所示：

```ts
<script setup lang="ts">
//src\renderer\Window\WindowMain\Chat\MessageItem.vue
import { ModelMessage } from "../../../../model/ModelMessage";
defineProps<{ data: ModelMessage }>();
</script>
```

```html
<template>
  <template v-if="data.isInMsg">
    <div class="messageItem left">
      <div class="avatar">
        <img :src="data.avatar" alt="" />
      </div>
      <div class="msgBox">
        <div class="fromName">{{ data.fromName }}</div>
        <div class="msgContent">{{ data.messageContent }}</div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="messageItem right">
      <div class="msgBox">
        <div class="msgContent">{{ data.messageContent }}</div>
      </div>
      <div class="avatar">
        <img :src="data.avatar" alt="" />
      </div>
    </div>
  </template>
</template>
```

这段代码我们就不多做解释了，现在我们的界面变成了下面这样子：


![5.1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6210bb3b3043424aa68cfd37b716e245~tplv-k3u1fbpfcp-watermark.image?)

有心的读者可能已经发现了，如果我们在切换选中的聊天会话时，直接初始化`messageStore`里的数据，就完全不需要在`MessageBord`组件里订阅`chatStore`的数据变更了。

`pinia`是支持这种操作的，现在我们修改一下`useChatStore`的代码，如下所示：

```ts
// src\renderer\store\useChatStore.ts
import { useMessageStore } from "./useMessageStore";
export const useChatStore = defineStore("chat", () => {
  let data: Ref<ModelChat[]> = ref(prepareData());
  let selectItem = (item: ModelChat) => {
    if (item.isSelected) return;
    data.value.forEach((v) => (v.isSelected = false));
    item.isSelected = true;
    let messageStore = useMessageStore(); //新增的行
    messageStore.initData(item); //新增的行
  };
  return { data, selectItem };
});
```

你会发现我们**完全可以在`selectItem`方法内使用`messageStore`提供的方法**。

删除掉订阅逻辑之后，不但提升了性能，减少了内存消耗，还使我们的代码逻辑变得更加清晰了。

## 总结

本节我们介绍了如何为工程引入 Pinia，如何创建 Store，如何创建数据模型，如何使用 Store，如何订阅 Store，如何完成 Store 间的互访等内容。

本节的内容技术难度并不高，但工程实战性特别强，希望你在学习本节内容时体会一个工程内有数百个 Store 时该如何组织管控应用的数据状态。

下一节我们将介绍如何为应用引入客户端数据库。

## 源码

本节示例代码请通过如下地址自行下载：

[源码仓储](https://gitee.com/horsejs_admin/electron-jue-jin/tree/pinia)
