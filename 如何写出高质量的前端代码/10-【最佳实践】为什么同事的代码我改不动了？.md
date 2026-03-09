我想大部分前端同学都遇到过这样的情况，同事写的代码完全改不动了，经常发生代码看了2-3个小时却只修改了一两行的情况，而且即使只改了这么一两行，还居然又引发了好几个新bug，这太让人沮丧了。

今天我们就来讨论下到底什么样的原因，导致同事的代码改不动了，以及如何应对这种情况。

为什么代码改不动了
=========

千行以上单文件
-------

难改等级：★★★★★

我遇到过的难改的代码，一般都有这个特点，就是行数过多，动不动就好几千行，特别是一些前端组件，几千行的Dom代码，加上几千行js逻辑，再加上上千行的样式，没有个几个小时根本无法梳理清楚其中的脉络。这么说吧，只要是单个文件行数有几千行，就意味着逻辑混乱，也绝对不存在容易修改的情况，因为人的大脑处理的信息是有限的，不信你看看验证码，最多也就6位，信息再多点，人脑就不能很好地处理了，这是人的生理限制。

为什么会写出单个文件上千行的代码呢？原因无外乎两个：缺少结构化的思考、缺少模块划分能力。

关于结构化思考，就是将问题、任务或信息分解成更小的部分，并将它们组织成一个有序的结构，以便更清晰地理解和处理，简单来说就是把一个任务分块、分层、排序。

我们前面举过一个品牌官网开发的示例，我们把一个官网分成头部、尾部和主体内容区，主题内容再划分为banner图、关于我们、服务、联系我们几部分，通过这种划分，将一个很大的首页变成了一个可能只有几十行的非常结构化的小页面。

    <div>
        <Header/>
        <main>
            <Banner/>
            <AboutUs/>
            <Services/>
            <ContactUs/>
        </main>
        <Footer/>
    </div>
    

大型项目组织更是需要结构化思考，像Vue这种大型项目依然都是由多个小文件组成，通过模块划分，将Vue的各个功能实现分布到不同的目录下。

![vue-core.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4707c17499414089b25eda035eb05293~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=336&h=472&s=19130&e=png&b=ffffff)

印象比较深刻的就是Vue类的实现，将Vue类的功能分成init、state、render、events和lifecycle几个模块，每个模块都为Vue.prototype增加一些属性或方法，通过这种模块化的方式，构建了一个超大的Vue类。

    //所在目录：src/core/instance/index.ts
    import { initMixin } from './init'
    import { stateMixin } from './state'
    import { renderMixin } from './render'
    import { eventsMixin } from './events'
    import { lifecycleMixin } from './lifecycle'
    import { warn } from '../util/index'
    import type { GlobalAPI } from 'types/global-api'
    
    function Vue(options) {
      if (__DEV__ && !(this instanceof Vue)) {
        warn('Vue is a constructor and should be called with the `new` keyword')
      }
      this._init(options)
    }
    
    //@ts-expect-error Vue has function type
    initMixin(Vue)
    //@ts-expect-error Vue has function type
    stateMixin(Vue)
    //@ts-expect-error Vue has function type
    eventsMixin(Vue)
    //@ts-expect-error Vue has function type
    lifecycleMixin(Vue)
    //@ts-expect-error Vue has function type
    renderMixin(Vue)
    
    export default Vue as unknown as GlobalAPI
    

其中events相关实现如下：

    //所在目录：vue/src/core/instance/events.ts
    export function eventsMixin(Vue: typeof Component) {
    
        Vue.prototype.$on = function (
            event: string | Array<string>,
            fn: Function
        ): Component {
           //忽略实现
        }
        Vue.prototype.$once = function (event: string, fn: Function): Component {
            //忽略实现
        }
    
        Vue.prototype.$off = function (
            event?: string | Array<string>,
            fn?: Function
        ): Component {
            //忽略实现
        }
        Vue.prototype.$emit = function (event: string): Component {
            //忽略实现
        }
    }
    

我们的项目再复杂可能也比不上这些框架吧，那有什么理由写出那么大的单文件呢？有些同学可能不知道怎么划分，而且模块划分之后，必然会带来模块通信的问题，不知道如何进行通信。

我想，相比不知道怎么划分，更重要的是要有划分的意识，有了这个意识才能去试着锻炼自己的模块化能力，通过反复的试错、重构，慢慢掌握结构化思维和模块划分能力。在模块划分时，可以通过咱们前面讲过的MECE法则，按照模块职责或者流程顺序等维度，对模块进行划分，让每个模块相互独立。在数据通信时我们也应尽量遵循一些原则，比如尽量少使用全局变量，尽量通过传参显式传递数据，父子组件通信时只能通过接口进行，避免深度耦合等。

耦合严重
----

难改等级：★★★★★

耦合是指模块、类或组件之间相互依赖的程度。耦合是不能完全消除的，因为只要一个模块有用，就必然会被别人依赖，所以耦合只能用高耦合和低耦合来评价。高耦合意味着各个部分之间的依赖性很强，一个部分的改动可能会影响到其他部分，或者每当需要修改一个部分时，可能需要同时修改多个其他部分，增加了维护的难度，这样的代码结构容易引入bug，并且修改一个地方可能会导致意想不到的副作用。

高耦合还会带来其他问题，比如高耦合的代码往往难以进行单元测试，因为一个模块的测试可能会依赖于其他模块的状态或行为。这使得测试变得复杂，难以编写和维护，同时也降低了代码的可测试性。

高耦合的代码往往难以重用，因为一个模块的功能和实现与其他模块紧密相关，无法独立地被其他系统或项目所重用。这导致了代码的复用性降低，增加了开发成本和时间。

高耦合的代码结构限制了系统的扩展性，当需要添加新功能或修改现有功能时，可能需要改动大量的代码，而不是简单地添加新的模块或组件。这使得系统难以适应变化和需求的增长。

高耦合的代码通常会使代码结构变得混乱和难以理解，因为各个部分之间的关系复杂且不清晰。这会影响代码的可读性，使代码难以被他人理解和维护。

比如有个用户详情的组件，代码如下：

    <template>
        <div>
            <userBaseInfo ref="userBaseInfo"/>
            <userArticles ref="userArticles"/>
        </div>
    </template>
    <script>
    export default {
        methods:{
            getUserDetail(){
                let userId = this.$store.state.userInfo.id 
                    || window.currentUserId
                    || this.$route.params.userId;
                
                getUser(userId).then(res=>{
                    this.$refs.userBaseInfo.data = res.baseInfo;
                    this.$refs.userArticles.data = res.articles;
                })
                
            }
        }
    }
    </script>
    

这里的实现就存在很严重的耦合问题，首先是用户id的获取，耦合了store、全局变量和url参数；其次获取用户详情后，操作了子组件的内部data。

修改后：

    <template>
        <div>
            <userBaseInfo base-info="baseInfo"/>
            <userArticles articles="articles"/>
        </div>
    </template>
    <script>
    export default {
        props: ['userId'],
        data(){
            return {
                baseInfo: {},
                articles: []
            }
        },
        methods:{
            getUserDetail(){
                getUser(this.userId).then(res=>{
                   this.baseInfo = res.baseInfo;
                   this.articles = res.articles;
                })
                
            }
        }
    }
    </script>
    

很明显，整个组件的内部非常清晰，每个组件的数据来源也很清晰，消除了之前不必要的耦合。关于如何解耦，后面我们会有专门一个章节来讲解。

代码复制代替了代码复用
-----------

难改等级：★★★

业务开发中还会经常遇到这样的情况，感觉之前有个功能差不多，有一些方法、Dom结构和自己本次开发的需求很相似，甚至可以说完全一样，但是因为这些方法和Dom之前并没有抽取，于是很多同学就会直接复制一份，不可否认，这确实很简便，大大缩减了开发时间，用代码复制替代了代码复用。

但是如果考虑到以后的代码维护，这看起来这并不是一个明智之举，而是为自己挖坑，如果以后这个功能需要修改，或者这个功能本身就有bug，你不得不四处搜索相关代码，而且也很容易遗漏，造成一个bug修改多次的情况发生。

虽然并不致命，但是也确实为以后埋下了风险，从长远来看是非常不提倡的。

强行复用、假装复用
---------

难改等级：★★★★★

比没有复用更让人难受的是强行复用，所谓强行复用，就是不该复用的地方，硬是把它们杂糅在一起进行复用。一般出现在想要进步但是奈何编程经验不足的新手身上，他们把一些非同一业务但UI相近或者同一个实体的不同操作用一个组件或方法杂糅到一起，表面看起来多个地方都调用了同一个组件或者方法，看起来像是提高了复用性，而实际造成了非常大的逻辑耦合，导致维护时特别困难。

比如登录弹窗和修改密码弹窗，可能都有输入密码和发送验证码功能，于是乎封装了一个组件，将两个功能糅合在一起，这样的组件内部势必存在大量的分支判断，这样的复用完全没有必要，UI相近我们可以把相近部分抽取出来，比如密码校验规则、发送验证码表单组件，登录弹窗和修改密码弹窗中可以使用这些公共内容，但是弹窗依然是两个，保持独立，这样能更好应对以后需求变化。

上面这个案例还不算太难修改，反正登录和修改密码也没有太多逻辑，稍微花点时间还可以应付，我遇到更过分的是把一个实体的所有操作弹窗封装到一个弹窗里，比如添加用户弹窗、编辑用户弹窗、删除用户的提醒弹窗、修改用户单条信息的弹窗等多个弹窗，用一个弹窗来实现，导致本来很简单的功能，却让人难以维护，你很难搞懂这个弹窗里大量的分支判断是干什么用的，也说不清楚某个操作到底牵扯哪些逻辑、显示哪些Dom，一不小心导致很多bug。

    <template>
        <div>
            <UserManagerDialog ref="UserManagerDialog"/>
        </div>
    </template>
    <script>
    export default {
        methods:{
            addUser(){
                this.$refs.UserManagerDialog.showDialog({
                    type: 'add'
                })
            },
            editName(){
                this.$refs.UserManagerDialog.showDialog({
                    type: 'editName'
                })
            },
            deleteUser(){
                this.$refs.UserManagerDialog.showDialog({
                    type: 'delete'
                })
            },
        }
    }
    </script>
    

现在你想下 UserManagerDialog这个组件怎么开发，里面逻辑要混乱到什么程度，这样的复用简直是灾难。

实际开发中，强行复用的案例非常多，见到最多的一种场景就是将一个实体的各个操作处理方法强行合成一个，还以用户管理为例，当点击用户列表的各个操作时，比如新增用户、编辑用户、删除用户，都会调用同一个方法。

    <template>
        <div>
            <button @click="userOperate('add')">添加用户</button>
            <button @click="userOperate('edit')">编辑用户</button>
            <button @click="userOperate('delete')">删除用户</button>
        </div>
    </template>
    <script>
    export default {
        methods:{
            userOperate(type, data){
                if(type === 'add'){
                    
                }
                if(type === 'edit'){
    
                }
                if(type === 'delete'){
                    //弹窗二次确认
                }
                //忽略各种代码
            }
        }
    }
    </script>
    

这样的做法真的复用了吗，userOperate里面还是各种的分支，并没有减少任何一种操作的处理代码，还不如拆成三个不同的方法，如果三种操作里面真的有重复的内容，可以抽取成函数，这个函数才是真的复用。复用不是多个操作调用同一个方法，复用是当以后有新功能时，以前的代码能不能拿来就用，而不是在某个统一方法里面增加新操作的全部逻辑，假装在复用。

破坏了数据一致性
--------

难改等级：★★★

有些同学在开发之前，并没有仔细设计数据结构，没有很好地区分哪些是内部状态state、哪些是派生状态computed，导致存在破坏数据一致性的风险。

以开发一个前端搜索功能为例，我们想实现这样一个功能，有个用户列表，在列表上有两个查询输入框（姓名、类型），输入关键词后只展示筛选到的数据。很多同学喜欢用sourceData（原始数据）和tableData（查询后的数据）两个state来存储数据，大致实现如下：

    <script>
    export default {
        data(){
            return {
                sourceData: [], //原始数据
                tableData: [], //过滤后的数据，用来渲染
                name: '', //查询字段：姓名
                type: '' //查询字段： 类型
                
            }
        },
        methods:{
            init(){
                this.sourceData = []; //网络请求等赋值，这里简化表示
                this.name = '';
                this.type = '';
                this.tableData = [];
            },
            nameChange(name){
                this.name = name;
                this.tableData = this.sourceData.filter(item => (!this.name || item.name === this.name) && (!this.type || item.type === this.type));
            },
            typeChange(type){
                this.type = type;
                this.tableData = this.sourceData.filter(item => (!this.name || item.name === this.name) && (!this.type || item.type === this.type));
            },
            refreshData(sourceData){
                //每次更新sourceData都必须要修改tableData
                this.sourceData = sourceData;
                this.tableData = this.sourceData.filter(item => (!this.name || item.name === this.name) && (!this.type || item.type === this.type));
            }
        }
    }
    </script>
    

这样实现存在的问题就是，每次修改sourceData就必须同时修改tableData，一旦忘记更改，就会造成数据不一致问题。针对这个示例，只需要把tableData作为基于sourceData、name和type的计算属性即可。

    <script>
    export default {
        data(){
            return {
                sourceData: [], //原始数据
                name: '', //查询字段：姓名
                type: '' //查询字段： 类型
                
            }
        },
        computed:{
            tableData(){
                return this.sourceData.filter(item => (!this.name || item.name === this.name) && (!this.type || item.type === this.type));
            }
        },
        methods:{
            init(){
                this.sourceData = []; //网络请求等赋值，这里简化表示
                this.name = '';
                this.type = '';
            },
            refreshData(sourceData){
                //每次更新sourceData都必须要修改tableData
                this.sourceData = sourceData;
            }
        }
    }
    </script>
    

更改后你可以放心地修改sourceData，不用担心tableData会和其不一致，减少引起bug的可能。

职责不单一
-----

难改等级：★★★

很多同学喜欢在一个方法中做很多事情，导致很多逻辑都混合在一起，有时你只是想修改其中一部分代码，但是由于逻辑都混合在一起，你也不得不把所有代码看完，才能找到你想要的，而且这种封装方式让方法的复用性大大降低。

比如我们要实现一个获取用户列表的方法，其中请求用户列表Api获取列表数据，并统计其中vip用户数量、最近30天登录的vip用户数量以及最近30天登录的普通用户数量。很多同学的实现有点类似下面这段代码：

    <script>
    export default {
        data(){
            return {
                userList: [],   //用户列表
                vipCount: 0,    //vip用户数量
                activeVipsCount: 0, //最近30天登录的VIP用户数量
                activeUsersCount: 0 //最近30天登录的用户数量
            }
        },
        mounted(){
          this.getUserData();  
        },
        methods: {
            getUserData(){
                //通过封装的service获取用户列表
                userService.getUserList().then(res => {
                    this.userData = res.data || [];
                    let vipCount = 0;
                    let activeVipsCount = 0;
                    let activeUsersCount = 0;
                    this.userData.forEach(user => {
                        //计算vip数量
                        if(user.type === 'vip'){
                            vipCount++
                        }
                        //计算最近30天登录用户数量
                        if(dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))){
                            if(user.type === 'vip'){
                                activeVipsCount++
                            }
                            activeUsersCount++
                        }
                    })
                    this.vipCount = vipCount;
                    this.activeVipsCount = activeVipsCount;
                    this.activeUsersCount = activeUsersCount;
                })
            }
        }
    }
    </script>
    

如果现在你来维护这段代码，测试告诉你最近30天用户数量计算错误，你怎么查找相关逻辑，在不了解这块实现时需要通读下getUserData代码，然后在其中找到最近30天登录用户的计算逻辑，而且如果修改了activeUsersCount相关的代码，还有可能不小心影响vipCount和activeVipsCount的计算逻辑，毕竟他们在一个循环中，很容易因为逻辑牵扯引发bug。

归根结底，还是因为getUserData方法职责不单一，可以看到它不仅完成了用户数据获取，还要负责计算3种用户数量，这也导致如果其他地方只需要单纯地获取用户数据，也不敢随便调用getUserData方法，很担心里面有一些副作用导致bug。

按照单一职责修改后的代码如下：

    <script>
    export default {
        data(){
            return {
                userList: [],   //用户列表
                activeVipsCount: 0, //最近30天登录的VIP用户数量
                activeUsersCount: 0 //最近30天登录的用户数量
            }
        },
        computed:{
            vipCount(){
                return this.userData.filter(user => user.type === 'vip').length;
            },
            activeVipsCount(){
                return this.userData.filter(user => user.type === 'vip' 
                    && dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))).length;
            },
            activeUsersCount(){
                return this.userData.filter(user => dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))).length;
            }
        },
        mounted(){
            this.getUserData();
        },
        methods: {
            getUserData(){
                //通过封装的service获取用户列表
                userService.getUserList().then(res => {
                    this.userData = res.data || [];
                })
            }
        }
    }
    </script>
    

现在你可以很清楚地看到每个数据的计算逻辑，修改其中一个的计算逻辑也不会影响其他数据。可能有同学会说这样性能低，存在对this.userData的重复遍历，确实存在这个问题，不过一般我们展示在页面的数据也就几十条，多一次遍历甚至连1ms都用不到，这样的性能损失可以忽略不计，而带来的可读性、可维护性和复用性的提升却很明显。

解决方案不"正统"
---------

难改等级：★★★★★

在开发中，各种问题应该有一个相对较合理的普遍的方案，这样的方案大家能很容易理解，修改起来也比较方便，然而有时候会遇到同事的一些"骚操作"，用一些不常见的、不合理的、不彻底的方案去解决问题。

比如我们要实现一个鼠标移入文字变色的特效，正统的做法应该是尽量通过css的hover伪类来实现而不是通过监听mouseover事件去修改色值；

再比如某个第三方库有一些bug，然而也没有可替换的，有的同学就会采用手动修改node\_modules下的文件的方式去解决，这就是不正统的解决方案，比较合理的方式应该是通知库的作者修改或者将自己修改后的包发布到企业内部仓库，项目中引用修改后的库。

这种问题发生经常是因为没有进行开发方案的评审或者review，导致一些奇奇怪怪的方案用到了项目中，让人猜不到想不透改不动。

重构你的代码
======

为什么要重构
------

很不幸，似乎我们永远也无法避免遇到上面提到的"屎山"代码，有些时候是因为能力不足，不知道如何写出高质量的代码，而有时即使有非常丰富的编码经验，也会随着需求的变更、紧张的排期等原因导致代码慢慢腐败，"屎山"代码似乎不可避免。

在物理学中，有个著名的熵增定律，它描述了孤立系统中的熵（混乱度）随时间的变化趋势。熵增定律表明，在一个孤立系统中，其总混乱度（即熵）不会减少，总是增大或者不变。这意味着系统的无序性会增加，而不是减少。

编码同样遵循熵增定率，只要没有外力作用，代码混乱不可避免，必须通过重构才能让代码变的更加优雅，就像是你的房间，如果长时间不打扫不收拾，肯定会越来越乱，只有时时勤拂拭，才能避免惹尘埃。

代码的腐败还会传染，就像你在一个非常干净的会议厅里，你是不会轻易地将纸屑丢在地上的，就算有擦鼻涕纸，你甚至都会塞进裤兜里带走，而如果你走在一个垃圾堆中，你会毫不犹豫地把身上的废弃物都扔在它们之中。写代码也是一样，在一个结构清晰的项目中，你不会随便掺入一些垃圾代码，生怕因为自己将项目质量拉低，心怀敬畏；而如果是在一个屎山项目中，你会毫不犹豫且没有任何负罪感地加入一些垃圾代码，反正已经都是屎山了，也不差我这一坨。不重构只会让代码越来越糟，

很多同学都听过这么一句话，代码只要能用，就别动它，于是把这句话当做挡箭牌，拒绝进行重构，拒绝让自己提升。这句话也不是完全没有道理，但我觉得这句话是有前提的，就是这块代码如果以后不用你去维护它，只要能用你就别动它，而如果需要你维护，那就必须进行重构，不重构就必然带来工作效率的降低，你也不想一天就只能修改几行代码吧。

只有好的代码才能随着时间的推移，持续高效的产生有价值的代码，这是重构的根本原因。

![01-持续产生价值.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/669ff3138cbf495582307e4ed23add82~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1135&h=998&s=73544&e=png&b=ffffff)

何时重构
----

在美国童子军中，流传一条这样的军规：让营地比你来时更干净。我觉得在写代码时也同样适用，你对项目的每一次修改，每一个commit的提交，到底是让项目变的更整洁了，还是变的更糟糕了，我们是不是也应该让项目在每次修改后都变的更整洁。

很多同学会可能会说项目那么紧张，哪有时间重构啊？这其实是对重构有误解，弄混淆了重构和重做的概念。

重构是指在**不改变软件功能的前提下**，对代码进行修改和调整其结构，目的是提高代码的可读性和可维护性，降低修改成本。这种修改过程不会改变软件的外部行为，即程序的行为和结果对于外部使用程序（如程序员）来说没有任何变化。

而重做则通常意味着完全重新开发某个模块或项目，可能涉及对原有设计、代码或功能的全面替换或重新实现。重做可能是由于多种原因，如原始设计存在严重缺陷、技术栈过时、需求发生根本性变化等。重做通常涉及更多的资源和时间投入，因为它需要从头开始，而不是在现有基础上进行改进。

重做需要大量的资源投入，不会轻易进行，而重构是渐进式的，甚至你修改一行代码都可以算作一次重构，所以我们可以随时随地进行重构，而不需要向领导申请一个专门的重构时间，每次重构都是为了更好地开发新功能。

我一般在开发新需求之前先对老代码进行一次重构，这个过程丝毫不会影响新业务的开发，大部分时候还能加快新需求的开发进度。所以，不要再以工期紧迫为借口了，尽快养成先重构后开发的习惯。

如何重构
----

重构时我们应该遵循4个原则：

*   不改变软件的功能：不影响模块对外的功能，即不改变接口
*   小步快跑：不要一下子改太多，否则出了问题不容易查找原因，也不容易回退，
*   边改边测：一定要改一小块测一小块，步步为营
*   随时可停：重构要能随时终止，不影响业务的开发，这样也方便只在自己空闲时间重构，不占用项目排期时间

我们以前面提到的一个职责不单一的反面代码为例，演示下如何进行重构。

首先看一下源代码，我们计划把vipCount、activeVipsCount和activeUsersCount改为计算属性。

    <script>
    export default {
        data(){
            return {
                userList: [],   //用户列表
                vipCount: 0,    //vip用户数量
                activeVipsCount: 0, //最近30天登录的VIP用户数量
                activeUsersCount: 0 //最近30天登录的用户数量
            }
        },
        mounted(){
          this.getUserData();  
        },
        methods: {
            getUserData(){
                //通过封装的service获取用户列表
                userService.getUserList().then(res => {
                    this.userData = res.data || [];
                    let vipCount = 0;
                    let activeVipsCount = 0;
                    let activeUsersCount = 0;
                    this.userData.forEach(user => {
                        //计算vip数量
                        if(user.type === 'vip'){
                            vipCount++
                        }
                        //计算最近30天登录用户数量
                        if(dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))){
                            if(user.type === 'vip'){
                                activeVipsCount++
                            }
                            activeUsersCount++
                        }
                    })
                    this.vipCount = vipCount;
                    this.activeVipsCount = activeVipsCount;
                    this.activeUsersCount = activeUsersCount;
                })
            }
        }
    }
    </script>
    

第一步：将vipCount变成计算属性

*   删除data中的vipCount
*   增加计算属性vipCount，将getUserData中关于vipCount的逻辑挪到这里
*   删除getUserData中vipCount的计算逻辑

    <script>
    export default {
        data(){
            return {
                userList: [],   
                //删除
                //vipCount: 0,   
                activeVipsCount: 0, 
                activeUsersCount: 0 
            }
        },
        //新增vipCount
        computed: {
            vipCount(){
                let vipCount = 0;
                this.userData.forEach(user => {
                    if(user.type === 'vip'){
                        vipCount++
                    }
                })
                return vipCount
            }
        },
        mounted(){
          this.getUserData();  
        },
        methods: {
            getUserData(){
                //通过封装的service获取用户列表
                userService.getUserList().then(res => {
                    this.userData = res.data || [];
                    //删除
                    //let vipCount = 0;
                    let activeVipsCount = 0;
                    let activeUsersCount = 0;
                    this.userData.forEach(user => {
                        //删除
                        // if(user.type === 'vip'){
                        //     vipCount++
                        // }
                        if(dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))){
                            if(user.type === 'vip'){
                                activeVipsCount++
                            }
                            activeUsersCount++
                        }
                    })
                    //删除
                    // this.vipCount = vipCount;
                    this.activeVipsCount = activeVipsCount;
                    this.activeUsersCount = activeUsersCount;
                })
            }
        }
    }
    </script>
    

完成本次更改后，测试下各项数据是否正常，不正常查找原因，正常我们继续。

将vipCount的逻辑挪过来之后，我们会发现这里的实现很繁琐，其实就是过滤type 等于 'vip'的用户数量，继续对vipCount的代码进行修改。

    export default {
        computed: {
            vipCount(){
                return this.userData.filter(user => user.type === 'vip').length;
            }
        }
    }
    

可以看到，将vipCount的计算逻辑抽离出来之后，我们就可以很容易地进行优化，相较之前的写法，可读性显著增强，这也是重构的意义。

同样的，本次修改之后，刷新下页面看看一切是否正常，正常则进行activeVipsCount的重构。

*   删除data中的activeVipsCount
*   增加计算属性activeVipsCount，将getUserData中activeVipsCount的计算逻辑迁移过来
*   删除getUserData中关于activeVipsCount计算的代码

    <script>
    export default {
        data(){
            return {
                userList: [],
                //删除
                // activeVipsCount: 0, 
                activeUsersCount: 0 
            }
        },
        computed: {
            vipCount(){
                return this.userData.filter(user => user.type === 'vip').length;
            },
            //新增
            activeVipsCount(){
                let activeVipsCount = 0;
                this.userData.forEach(user => {
                    if(dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))){
                        if(user.type === 'vip'){
                            activeVipsCount++
                        }
                    }
                })
                return activeVipsCount;
            }
        },
        mounted(){
          this.getUserData();  
        },
        methods: {
            getUserData(){
                //通过封装的service获取用户列表
                userService.getUserList().then(res => {
                    this.userData = res.data || [];
                    //删除
                    //let activeVipsCount = 0;
                    let activeUsersCount = 0;
                    this.userData.forEach(user => {
                        if(dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))){
                            //删除
                            // if(user.type === 'vip'){
                            //     activeVipsCount++
                            // }
                            activeUsersCount++
                        }
                    })
                    //删除
                    //this.activeVipsCount = activeVipsCount;
                    this.activeUsersCount = activeUsersCount;
                })
            }
        }
    }
    </script>
    

同样地，抽取activeVipsCount之后，我们可以对其进行优化，改造繁琐的实现。

    <script>
    export default {
        data(){
            return {
                userList: [],
                activeUsersCount: 0 
            }
        },
        computed: {
            vipCount(){
                return this.userData.filter(user => user.type === 'vip').length;
            },
            //优化实现
            activeVipsCount(){
                return this.userData.filter(user => user.type === 'vip'
                    && dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))).length;
            }
        },
        mounted(){
          this.getUserData();  
        },
        methods: {
            getUserData(){
                //通过封装的service获取用户列表
                userService.getUserList().then(res => {
                    this.userData = res.data || [];
                    let activeUsersCount = 0;
                    this.userData.forEach(user => {
                        if(dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))){
                            activeUsersCount++
                        }
                    })
                    this.activeUsersCount = activeUsersCount;
                })
            }
        }
    }
    </script>
    

最后，我们采用相同的手法把activeUsersCount的逻辑抽取出来，不再赘述，直接给出抽取后的代码。

    <script>
    export default {
        data(){
            return {
                userList: [],
                activeUsersCount: 0 
            }
        },
        computed: {
            vipCount(){
                return this.userData.filter(user => user.type === 'vip').length;
            },
            activeVipsCount(){
                return this.userData.filter(user => user.type === 'vip'
                    && dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))).length;
            },
            activeUsersCount(){
                return this.userData.filter(user => dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day'))).length;
            }
        },
        mounted(){
          this.getUserData();  
        },
        methods: {
            getUserData(){
                userService.getUserList().then(res => {
                    this.userData = res.data || [];
                })
            }
        }
    }
    </script>
    

重构后，每个数量怎么来的变得非常清晰，而且重构后也非常方便我们做性能优化，比如上面activeVipsCount和activeUsersCount的计算逻辑中，都需要找到最近30天登录的用户，我们可以先把最近30天登录用户过滤出来，以减少遍历次数。

    <script>
    export default {
        data(){
            return {
                userList: [],
                activeUsersCount: 0 
            }
        },
        computed: {
            vipCount(){
                return this.userData.filter(user => user.type === 'vip').length;
            },
            //先把活跃用户列表筛选出来
            activeUsers(){
                return this.userData.filter(user => dayjs(user.loginTime).isAfter(dayjs().subtract(30, 'day')))
            },
            //从活跃用户中查找vip用户数量
            activeVipsCount(){
                return this.activeUsers.filter(user => user.type === 'vip').length;
            },
            //直接返回活跃用户数量
            activeUsersCount(){
                return this.activeUsers.length;
            }
        },
        mounted(){
          this.getUserData();  
        },
        methods: {
            getUserData(){
                userService.getUserList().then(res => {
                    this.userData = res.data || [];
                })
            }
        }
    }
    </script>
    

现在回过头来，再对比下重构前后的代码，相信你已经看到了重构的威力。

通过这种小步快跑，边改边测的方式，可以让我们很轻松地完成对原有系统的重构，而且中间是随时可以停止重构的，比如你刚重构完vipCount的计算逻辑，领导让你开发一个紧急任务，也是没有关系的，你完全可以停止重构，转去开发业务，在完成业务开发后继续进行其他功能的重构。

总结
==

如果你觉得代码改不动了，往往是犯了以下几个错误

*   单文件代码过长，超过千行：需要结构化思考、模块划分
*   模块之间耦合严重：需要解耦
*   代码复制代替了代码复用：开发前先抽取公共代码
*   强行复用、假装复用：不因UI相同而复用，同一个业务逻辑才可复用
*   破坏了数据一致性：区分元数据和派生数据，利用计算属性计算派生数据
*   职责不单一：每个底层小模块只做一件事
*   解决方案不"正统"：重视方案评审和CodeReview

通过重构，在不改变软件功能的前提下，对代码进行修改和调整其结构。

根据熵增定率，不进行重构的代码一定会越来越腐败，只有重构才能降低代码混乱程度，重构无法避免。

重构是随时的，可以在每次开发新功能之前，先对老功能进行重构，以加快新功能开发；每次代码提交都要让系统变的更整洁。

进行重构时要遵循4个原则：

*   不改变软件的功能
*   小步快跑
*   边改边测
*   随时可停