

随着移动网络的发展与演化，我们手机上现在除了有原生 App，还能跑“WebApp”——它即开即用，用完即走。一个优秀的 WebApp 甚至可以拥有和原生 App 媲美的功能和体验。 

我认为，WebApp 就是我们前端性能优化的产物，是我们前端工程师对体验不懈追求的结果，是 Web 网页在性能上向 Native 应用的一次“宣战”。

WebApp 优异的性能表现，要归功于浏览器存储技术的广泛应用——这其中除了我们上节提到的缓存，本地存储技术也功不可没。        
    
## 故事的开始：从 Cookie 说起
Cookie 的本职工作并非本地存储，而是“维持状态”。

在 Web 开发的早期，人们亟需解决的一个问题就是状态管理的问题：HTTP 协议是一个无状态协议，服务器接收客户端的请求，返回一个响应，故事到此就结束了，服务器并没有记录下关于客户端的任何信息。那么下次请求的时候，如何让服务器知道“我是我”呢？ 

在这样的背景下，Cookie 应运而生。

Cookie 说白了就是一个存储在浏览器里的一个小小的文本文件，它附着在 HTTP 请求上，在浏览器和服务器之间“飞来飞去”。它可以携带用户信息，当服务器检查 Cookie 的时候，便可以获取到客户端的状态。

关于 Cookie 的详细内容，我们可以在 Chrome 的 Application 面板中查看到：  

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/22/166002bebabcf363~tplv-t2oaga2asx-image.image)  

如大家所见，**Cookie 以键值对的形式存在**。    
   
### Cookie的性能劣势
#### Cookie 不够大 

大家知道，Cookie 是有体积上限的，它最大只能有 4KB。当 Cookie 超过 4KB 时，它将面临被裁切的命运。这样看来，Cookie 只能用来存取少量的信息。 

#### 过量的 Cookie 会带来巨大的性能浪费   

**Cookie 是紧跟域名的**。我们通过响应头里的 Set-Cookie 指定要存储的 Cookie 值。默认情况下，domain 被设置为设置 Cookie 页面的主机名，我们也可以手动设置 domain 的值：

```
Set-Cookie: name=xiuyan; domain=xiuyan.me

```
  
**同一个域名下的所有请求，都会携带 Cookie**。大家试想，如果我们此刻仅仅是请求一张图片或者一个 CSS 文件，我们也要携带一个 Cookie 跑来跑去（关键是 Cookie 里存储的信息我现在并不需要），这是一件多么劳民伤财的事情。Cookie 虽然小，请求却可以有很多，随着请求的叠加，这样的不必要的 Cookie 带来的开销将是无法想象的。     
  
随着前端应用复杂度的提高，Cookie 也渐渐演化为了一个“存储多面手”——它不仅仅被用于维持状态，还被塞入了一些乱七八糟的其它信息，被迫承担起了本地存储的“重任”。在没有更好的本地存储解决方案的年代里，Cookie 小小的身体里承载了 4KB 内存所不能承受的压力。 
     
为了弥补 Cookie 的局限性，让“专业的人做专业的事情”，Web Storage 出现了。   
   
## 向前一步：Web Storage

Web Storage 是 HTML5 专门为浏览器存储而提供的数据存储机制。它又分为 Local Storage 与 Session Storage。这两组概念非常相近，我们不妨先理解它们之间的区别，再对它们的共性进行研究。   
   
### Local Storage 与 Session Storage 的区别  

两者的区别在于**生命周期**与**作用域**的不同。

- 生命周期：Local Storage 是持久化的本地存储，存储在其中的数据是永远不会过期的，使其消失的唯一办法是手动删除；而 Session Storage 是临时性的本地存储，它是会话级别的存储，当会话结束（页面被关闭）时，存储内容也随之被释放。 

- 作用域：Local Storage、Session Storage 和 Cookie 都遵循同源策略。但 Session Storage 特别的一点在于，即便是相同域名下的两个页面，只要它们**不在同一个浏览器窗口中**打开，那么它们的 Session Storage 内容便无法共享。   
  
### Web Storage 的特性

- 存储容量大： Web Storage 根据浏览器的不同，存储容量可以达到 5-10M 之间。 

- 仅位于浏览器端，不与服务端发生通信。

### Web Storage 核心 API 使用示例

Web Storage 保存的数据内容和 Cookie 一样，是文本内容，以键值对的形式存在。Local Storage 与 Session Storage 在 API 方面无异，这里我们以 localStorage 为例： 
  
- 存储数据：setItem()
  
```javascript
localStorage.setItem('user_name', 'xiuyan')
```
  
- 读取数据： getItem()
  
```javascript
localStorage.getItem('user_name')
```
  
- 删除某一键名对应的数据： removeItem()
  
```javascript
localStorage.removeItem('user_name')
```

- 清空数据记录：clear()

```javascript
localStorage.clear()
```
   
### 应用场景  
#### Local Storage 

Local Storage 在存储方面没有什么特别的限制，理论上 Cookie 无法胜任的、可以用简单的键值对来存取的数据存储任务，都可以交给 Local Storage 来做。

这里给大家举个例子，考虑到 Local Storage 的特点之一是**持久**，有时我们更倾向于用它来存储一些内容稳定的资源。比如图片内容丰富的电商网站会用它来存储 Base64 格式的图片字符串： 

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/22/16600d07e6abdd81~tplv-t2oaga2asx-image.image) 

有的网站还会用它存储一些不经常更新的 CSS、JS 等静态资源。      
   
#### Session Storage

Session Storage 更适合用来存储生命周期和它同步的**会话级别**的信息。这些信息只适用于当前会话，当你开启新的会话时，它也需要相应的更新或释放。比如微博的 Session Storage 就主要是存储你本次会话的浏览足迹：   

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/29/16623d7a9457d1df~tplv-t2oaga2asx-image.image)

lasturl 对应的就是你上一次访问的 URL 地址，这个地址是即时的。当你切换 URL 时，它随之更新，当你关闭页面时，留着它也确实没有什么意义了，干脆释放吧。这样的数据用 Session Storage 来处理再合适不过。     
   
这样看来，Web Storage 确实也够强大了。那么 Web Storage 是否能 hold 住所有的存储场景呢？  

答案是否定的。大家也看到了，Web Storage 是一个从定义到使用都非常简单的东西。它使用键值对的形式进行存储，这种模式有点类似于对象，却甚至连对象都不是——它只能存储字符串，要想得到对象，我们还需要先对字符串进行一轮解析。

说到底，Web Storage 是对 Cookie 的拓展，它只能用于存储少量的简单数据。当遇到大规模的、结构复杂的数据时，Web Storage 也爱莫能助了。这时候我们就要清楚我们的终极大 boss——IndexedDB！

## 终极形态：IndexedDB

IndexedDB 是一个**运行在浏览器上的非关系型数据库**。既然是数据库了，那就不是 5M、10M 这样小打小闹级别了。理论上来说，IndexedDB 是没有存储上限的（一般来说不会小于 250M）。它不仅可以存储字符串，还可以存储二进制数据。   

IndexedDB 从推出之日起，其优质教程就层出不绝，我们今天不再着重讲解它的详细操作。接下来，我们遵循 MDN 推荐的操作模式，通过一个基本的 IndexedDB 使用流程，旨在对 IndexedDB 形成一个感性的认知：

1. 打开/创建一个 IndexedDB 数据库（当该数据库不存在时，open 方法会直接创建一个名为 xiaoceDB 新数据库）。

```javascript
  // 后面的回调中，我们可以通过event.target.result拿到数据库实例
  let db
  // 参数1位数据库名，参数2为版本号
  const request = window.indexedDB.open("xiaoceDB", 1)
  // 使用IndexedDB失败时的监听函数
  request.onerror = function(event) {
     console.log('无法使用IndexedDB')
   }
  // 成功
  request.onsuccess  = function(event){
    // 此处就可以获取到db实例
    db = event.target.result
    console.log("你打开了IndexedDB")
  }
```
  
2. 创建一个 object store（object store 对标到数据库中的“表”单位）。

  ```javascript
  // onupgradeneeded事件会在初始化数据库/版本发生更新时被调用，我们在它的监听函数中创建object store
  request.onupgradeneeded = function(event){
    let objectStore
    // 如果同名表未被创建过，则新建test表
    if (!db.objectStoreNames.contains('test')) {
      objectStore = db.createObjectStore('test', { keyPath: 'id' })
    }
  }  
  ```

3. 构建一个事务来执行一些数据库操作，像增加或提取数据等。

```javascript
  // 创建事务，指定表格名称和读写权限
  const transaction = db.transaction(["test"],"readwrite")
  // 拿到Object Store对象
  const objectStore = transaction.objectStore("test")
  // 向表格写入数据
  objectStore.add({id: 1, name: 'xiuyan'})
```

4. 通过监听正确类型的事件以等待操作完成。

```javascript
  // 操作成功时的监听函数
  transaction.oncomplete = function(event) {
    console.log("操作成功")
  }
  // 操作失败时的监听函数
  transaction.onerror = function(event) {
    console.log("这里有一个Error")
  }
  
```
  
### IndexedDB 的应用场景

通过上面的示例大家可以看出，在 IndexedDB 中，我们可以创建多个数据库，一个数据库中创建多张表，一张表中存储多条数据——这足以 hold 住复杂的结构性数据。IndexedDB 可以看做是 LocalStorage 的一个升级，当数据的复杂度和规模上升到了 LocalStorage 无法解决的程度，我们毫无疑问可以请出 IndexedDB 来帮忙。  
  
## 小结

浏览器缓存/存储技术的出现和发展，为我们的前端应用带来了无限的转机。近年来基于缓存/存储技术的第三方库层出不绝，此外还衍生出了 [PWA](https://lavas.baidu.com/pwa) 这样优秀的 Web 应用模型。可以说，现代前端应用，尤其是移动端应用，之所以可以发展到在体验上叫板 Native 的地步，主要就是仰仗缓存/存储立下的汗马功劳。    
   
（阅读过程中有任何想法或疑问，或者单纯希望和笔者交个朋友啥的，欢迎大家添加我的微信xyalinode与我交流哈~）
    

