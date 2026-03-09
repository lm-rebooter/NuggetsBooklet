从过去面向计算机硬件编程的语言（汇编），到现在更符合人类思考和抽象习惯的高级语言（C++、Java、Python、JavaScript、PHP、Ruby等），编程已经变成了人类逻辑到机器逻辑的映射。随着硬件成本越来越低，程序的主要受众不再是机器，而是人本身，大多数时候代码的可读性比代码的性能更加重要。

可读性是代码易维护的前提条件，一段读不懂的代码是无法维护的，一段不易读的代码维护效率是低下的，提升代码可读性是每个程序员必须要修炼的第一层编码内功。

提升代码可读性是有很多行之有效的方法的，包括使用清晰易懂的命名、添加必要的注释、通过抽象和封装写出更加短小的函数和组件、保持清晰的代码结构、使用简洁且富有表现力的代码、明确的指明数据来源等，只要在编程中刻意训练，我们是可以快速提升自己的代码可读性的。

下面详细介绍下提升代码可读性的7大类方法。

一、 好的命名是成功的一半
=============

**提升代码可读性的最快速最有效的方法就是重视命名**，别的技能大都需要大量的学习才行，而命名是我们很快可以掌握的，只要转变了认知，从今天起开始认识到命名的重要性，便能迅速提高你的代码可读性。在很多书籍中，也都提到了命名的重要性，可能很多同学已经比较熟悉了，但是由于命名对可读性的提升非常大，所以在这里仍然赘述一下。

想要快速提高编程水平，从重视每一个命名开始！

1.1 见名知意
--------

好的命名要能反应代码的意图，具有自解释性，看到名称就能知道作者想要表达什么业务含义。

在CodeReview中经常可以看到这样的变量命名：

    let arr = []  //arr是存储什么的？
    let obj = {}  //obj代表什么资源? 
    let str = '' //str有什么用处
    

每次看到这样的命名，完全不知道要表达什么，比如arr，看起来是个数组，可是这个数组究竟存放什么内容数据呢？不知道，必须继续往下看。

修改后如下，不需要看后续代码，即可明白变量意图。

    let newsList = []    //新闻列表
    let newsDetail = {}  //新闻详情 
    let newsAuthor = ''  //新闻作者
    

在过往的CodeReview中，还会频繁遇到如下函数参数命名：

    //某个事件的处理函数
    function handle(e){
        //e是什么，结构是怎么样的，必须去查看调用处的代码，才只能e的含义
        if(e === 0){
    
        }
    }
    
    function getColor(data){
        //data是什么，有什么业务含义?到底根据什么来获取颜色？
    }
    
    function create(flag){
        //flag是啥? 什么情况下是true？什么情况下是false？
        if(flag){
    
        }else{
    
        }
    }
    

在上述示例中，你无法一眼看出参数代表的业务含义，不明白参数也就无法确定这个函数内部的逻辑到底是否合理。这时候为了搞懂这个函数的意义，必须要去查看函数在哪里调用，传递的参数代表什么，而如果调用方命名也不合理，就要继续查看调用方的调用方，为了弄明白一个函数的含义，你甚至要查找3、4个函数，这明显违背了最小知识原则，大大加深了代码阅读障碍，很可能的情况是，在你进入到第4个函数时，你忘记了自己要干嘛。

假如将上述getColor函数参数简单修改下：

    function getColor(installStatus){
        switch (installStatus){
            case 'success':
                return 'green'
            case 'fail':
                return 'red'
            default:{
                return 'black'
            }
        }
    }
    

现在试着说下这个函数的功能：这应该是一个获取颜色函数，参数是"安装状态"，状态成功返回绿色，失败返回红色，其他情况返回黑色，不需要去阅读任何上下文，就能明白这个函数的作用。

同样的将上述create方法改成createUser，参数flag改为isAdmin，是不是瞬间清晰了，这是一个创建用户的方法，根据是否是超级管理员执行不同的逻辑，非常地清晰。

    //bad 改造前
    function create(flag){
        if(flag){
    
        }else{
    
        }
    }
    
    //good 改造后
    function createUser(isAdmin){
        if(isAdmin){
    
        }else{
    
        }
    }
    

良好的命名让我们可以见名知意，不需要去了解上下文，不需要看任何注释，就能理解其要表达的业务含义。

### 1.1.1 推荐的命名方式

命名通常是为了表达这几种业务含义：某种资源、某个状态、某个事件、某个动作、某种条件

*   资源命名

一般为"资源名称 + 资源类型"：如 newsList(新闻列表)、newsDetail(新闻详情)，而如果只是单纯的用list或者detail命名，通用性太强，不知道想要表达什么资源的列表/详情，特别是一个页面有多种资源时。

*   状态命名

最好也加上资源名称，如appInstallStatus(应用安装状态)、dialogVisible(弹窗显示状态)、tableLoading(表格加载状态)。

*   事件处理函数命名

一般为动宾短语，如deleteNews、createNews，或者deleteNewsHandler、createNewsHandler，尽量不要叫 deleteData 或 deleteFun 这样的通用性的词，存在多种资源时不知道要删除什么。

*   动作命名

一般为动宾短语，也可以是个句子，关键要把做的事情表达清楚，如getNewsDetail、updateNewsStatus。

*   条件命名

条件一般为布尔值，布尔值一般分为这几种：是什么(is\*\*)、可以吗(can\*\*)、应该吗(should\*\*)、有吗(has\*\*)

*   是什么: isAdmin、isAdd、isEmpty
*   可以吗：canDelete、canSave
*   应该吗：shouldUseCache
*   有吗：hasDeletePermission
*   进行时/过去式：enabled/disabled、destroying/destroyed、loading、visible

1.2 去除无意义的词
-----------

在命名中有时会有一些无意义的废话，比如命名中包含数据类型，通常可以去除或者换成更友好的词。

    //bad，看后面赋值知道是数组，但是更想知道业务含义
    let newsArr = []
    //good
    let newsList = []
    
    
    //bad，这肯定是函数，无需多言，Fun毫无意义
    function deleteFun(){
    
    }
    //good
    function deleteResource(){
    }
    
    function deleteResourceHandler(){
    }
    

1.3 名称要有明显区分
------------

好名字应该有分区度，避免歧义，比如一下几个变量：

    //bad
    let news = {}
    let newsData = []
    let newsInfo = []
    let newsDetail = {}
    

你能弄清楚news、newsData、newsInfo、newsDetail到底有什么区别呢？看起来好像是一个意思，当它们处是同一个模块内部时，让人非常困惑。

把业务相关词汇加上去就清楚多了：

    //good
    let newsSummary = {}   //新闻概要
    let newsLabels = []   //新闻标签
    let newsComments = [] //新闻评论
    let newsDetail = {}   //新闻详情
    

1.4 好名字可以念出来
------------

现在试着给同事介绍下以下两个函数：

    function delProdFun(){
    
    }
    
    function deleteProductHandler(){
    
    }
    

当要和同事讨论delProdFun函数时："李哥，你写的那个d-e-l-p-r-o-d-f-u-n（逐个单词念出来）函数好像有点问题哎~"

代码是要和别人沟通的，必须能够通过人的语言讲出来，否则写的时候自己没感觉，一到多人沟通的时候可能要闹笑话了。

很多同学都喜欢用缩写，仿佛这样代码更简洁一样，实际这样做弊大于利，首先，很多缩写并不规范，别人大概率看不懂要表达什么，其次缩写后不方便读出来。如无必要，尽量不用简写，除非是一些约定俗成的简写，如IP、HTTP、ID、No等。

1.5 好名字不怕长
----------

有时候会担心名字太长会不会不太好，是不是太长了写的就慢，其实不是，目前编辑器都有提示功能， 写出几个字符就会有推荐名称可以选择，不会增加编码负担。

而且长的名字通常具有较好的表现力，能把要做的事通过命名表现出来，相当于通过命名写好了注释和文档。

    function getUser(id){
    
    }
    
    //看到函数名就知道怎么传参
    function getUserById(id){
    
    }
    
    
    //函数名较短，需要注释来说明函数用途
    //同步函数，把命名空间同步到其他集群
    function sync(){
    
    }
    
    function syncNamespaceToOtherCluster(){
        //无需注释，见名知意，同步命名空间到其他集群
    }
    

较短的名称一般很容易和别人重复，而较长的名字一般都有其特定场景，不容易和其他业务重复，对于全局搜索也比较友好。

当然了，你也没必要写出300字长的命名，不要走极端，一般用几个单词就能表达清楚含义，在尽量精简的同时，不必担心使用长单词有什么不好。

1.6 拒绝误导
--------

更有甚者，有时候命名和要表达的意思可能是反的，这种误导性的命名，可以当做bug处理了。

特别是在一些Boolean值应用时很容易出现，千万不要笑，这种表达相反含义的命名，确实发生过。

    function deleteUser(hasPermission) {
        if (hasPermission) {
            //hasPermission 表达的是无权限
        }
    }
    

不过幸好，一般都不会犯这样的错误，但是下面这个错误非常常见，比如在get命名的函数中会做很多set的工作。

    function getDetail(){
        requrst(url,params).then(_=>{
            setData()
        })
    }
    

当你在别处看到getDetail()函数调用时，你根本想不到这里居然修改了其他数据，还以为只是一个简单的get操作。

再比如在获取cache或者localStorage时做一些set操作，命名和要做的事情不一致，或者名称只说了一件事，但函数内部干了多件事，这也算是一种误导吧。

    function getCache(key){
        if(!cacheData[key]){
            setCache(key, '')  //没想到get操作中有set操作
        }else{
            clearCache(key)  //没想到get操作中有清空操作
            return cacheData[key]
        }
    }
    

1.7 统一表达
--------

一个团队沟通要想高效，必须使用相同的语言，一致的表达方式，可以减少不必要的学习及认知成本，写代码也是一样。 特别是在涉及一些业务问题时，同一个业务，如果使用不同的词语来表达，难免增加不必要的沟通理解成本。

### 1.7.1 制定一个领域词汇表

你的业务中一定有很多特有的概念，可以将业务领域内的这些概念抽取出来形成一个词汇表，一般为名词，代指业务中涉及的资源和概念。 一来后续新人进入可以通过这些名词来了解业务的大概面貌； 二来统一了大家在业务方面的认知，减少沟通成本，看到这个命名的词就知道别人在表达啥业务，而不是同一个业务不同人用不同的词语表达。

比如user、member、customer都可能用来表示用户，那么什么时候用哪个词怎么界定呢？如果没有规范随便命名，可能会导致理解上的偏差，你以为是客户，实际别人要表示的是注册用户，无形中增加了很多理解上的障碍，甚至是误导。

领域词汇表示例：

变量名

含义

备注

USER

普通注册用户

CUSTOMER

客户

签订过合同的用户

SKU

最小存货单位

COMMODITY

商品

PRODUCT

产品

CONTRACT

合同

ORDER

订单

领域词汇表的作用是用来统一认知，在变量命名时根据领域词汇表中的名称来命名，让代码更加可读。

除了业务领域统一用词外，还有一些通用的字段也可以规范下来，比如创建时间到底是用created\_time还是created\_at，创建人是created\_by还是creator，虽然表达含义并无多大区别，但是如果多个地方随机变化使用，也会让人感觉不够规范专业。

### 1.7.2 统一命名格式

一个团队必须统一命名格式，不同格式的命名表达不同的含义，通过命名就可以知道变量是做什么用的， 而且也让外人看来，更加的专业，增强信任感。试想一下，假如我们对外提供了一个接口，有的返回的变量格式是下划线， 有的是大驼峰，别人又怎么能相信功能是靠谱的呢？

一般常见的命名规范如下：

*   变量：小驼峰，如newsDetail
*   函数：小驼峰，如getNewsDetail
*   类名：大驼峰，如EventBus
*   常量：大写+下划线分割，如NEWS\_STATUS
*   目录：小写+中划线分割，如file-name
*   文件：小写+中划线分割，如 event-bus.js，团队内部统一即可
*   组件：大驼峰，如FormTable.vue，如果是目录下的index文件，则用小写，如index.vue
*   css class：css类名一般应为小写+中划线，参考html元素的规范，html中一般小写+中划线，如form-title，而不是formTitle

有了规范，在CR时就可以针对问题进行评论，否则有时候会感觉，这样也行那样也行，最后造成代码的混乱。

二、小而美
=====

除了命名之外，第二个最容易掌握的技巧就是把代码弄短。

虽然短小不是目的，但却是提高代码可读性的一个关键手段，短小的代码有以下好处：

*   短小的东西天然的更容易理解，相比动辄几百上千行的函数或者文件，几行或者10-20行的代码需要更小的认知负担
*   短小的代码更有可能做到单一职责，也更有可能被复用
*   要实现短小的代码，就逼迫你去思考代码的结构，而不是稀里糊涂地杂糅一堆代码

每次接手一个几千行的Vue组件时，都会由衷的感慨一句"oh shit"，不管你有多少理由写出这样的代码，一定在某种程度上是缺乏深度思考和代码设计的，很少遇到一个优秀的开源库，里面出现上千行的代码，一般都100-300行之间，他们的复杂度通常都要比我们平时写的业务复杂的多，他们都没有超过千行，我们又有什么理由呢？不要为自己思想上的懒惰找借口，出来混，迟早要还的。

我们可以通过拆分函数、组件化、模块化等方式来实现小而美的代码。

2.1 拆分函数
--------

假设我们有一个名为 processUserData 的长函数，它接受一些用户数据，对其进行处理并返回结果。该函数的代码可能类似于下面这样：

    function processUserData(userData) {
        let processedData = {};
        let firstName = userData.firstName;
        let lastName = userData.lastName;
        let fullName = firstName + ' ' + lastName;
        processedData.name = fullName;
    
        let age = userData.age;
        let birthYear = new Date().getFullYear() - age;
        processedData.birthYear = birthYear;
    
        let email = userData.email;
        let isEmailValid = validateEmail(email);
        processedData.isEmailValid = isEmailValid;
    
        let password = userData.password;
        let isPasswordValid = validatePassword(password);
        processedData.isPasswordValid = isPasswordValid;
    
        return processedData;
    }
    
    function validateEmail(email) {
        // 校验邮箱逻辑，此处省略具体实现
        return true;
    }
    
    function validatePassword(password) {
        // 校验密码逻辑，此处省略具体实现
        return true;
    }
    

现在试着阅读上面的代码，逻辑不是很复杂，应该都可以读懂，但是存在一个问题，基本上必须要把processUserData函数的全部实现读完（14行左右），才能知道整个函数的作用。

我们可以将该函数拆分为以下几个小函数：

1.  getFullName ：从用户数据中获取完整姓名
2.  calculateBirthYear ：从用户数据中获取年龄并计算出出生年份
3.  validateEmail ：验证用户数据中的电子邮件地址
4.  validatePassword ：验证用户数据中的密码
5.  processUserData ：调用上述四个函数，对用户数据进行处理并返回结果

拆分后的代码可能如下所示：

    function getFullName(userData) {
        let firstName = userData.firstName;
        let lastName = userData.lastName;
        return firstName + ' ' + lastName;
    }
    
    function calculateBirthYear(age) {
        return new Date().getFullYear() - age;
    }
    
    function validateEmail(email) {
        // validate email logic
        return true;
    }
    
    function validatePassword(password) {
        // validate password logic
        return true;
    }
    
    function processUserData(userData) {
        let processedData = {};
        processedData.name = getFullName(userData);
        processedData.birthYear = calculateBirthYear(userData.age);
        processedData.isEmailValid = validateEmail(userData.email);
        processedData.isPasswordValid = validatePassword(userData.password);
        return processedData;
    }
    

现在再试着阅读processUserData，只需要读5行就能大致明白该函数的作用。假如如果现在有个bug，processedData.birthYear计算不正确，那么你会很快定位到，应该只需要去查看calculateBirthYear的实现即可。

通过将长函数拆分成多个小函数，可以让你更快的了解到整个函数的全貌，而不会陷入到实现的细节中去，除非你关心某块细节的实现，才需要进入相应的小函数中去查看。

拆分函数并不能将一块代码的长度降低，有时候还可能会让代码变的更长，但是却能让你更加快速地了解函数的结构和要表达的意图。

拆分成小函数后，每个小函数基本上就做一件事，这样就更容易实现复用，比如上述拆分出来的calculateBirthYear函数可能其他地方也需要使用，这样也提高了代码的复用性。

2.2 组件化拆分页面
-----------

我们知道Class类是封装了数据和方法，而组件Component则是封装了UI和逻辑。将一个复杂页面中紧密结合的UI和逻辑抽取出来，封装为一个组件，然后通过多个组件的组合构成一个功能更强大的组件，最终聚合为一个页面。

在现代web开发中，我们可以认为一切皆组件，页面是个顶层组件，由一个个功能模块组件构成，功能模块组件再由一些更细小的UI组件构成。通过这种组件化的开发，很容易看清整个功能模块的结构组成，要修改某块代码，只需要进入相应的组件即可，而不必在一个超大的文件中翻找。

现在的前端组件化开发已经非常成熟了，Vue和React等框架为我们实现组件化提供了很好的支持，我们可以很方便的进行组件开发，我们没有理由再写出那种一个页面几千上万行的代码，每次看到一个文件几千行就会忍不住吐槽，修改起来总要上下来回滚动，搜索想要查找的逻辑，很难看清楚页面的整体设计思路，可读性非常差。

通过组件拆分这种方式开发，也非常符合分治的思想，将大任务拆分为小任务， 然后逐个去实现，一个大的功能也许很复杂，但是具体到一个个的小组件上，都是一个可以实现的小任务，自上而下拆分，自下而上再去实现，就和我们拆分工作是一个逻辑。

在实现一个复杂功能的时候，我一般习惯上来就按照功能拆分成不同的组件，每个组件内先随便放置一个Div占位，然后再一个一个去实现其中的逻辑。

以一个公司的官网开发为例，可以根据网站的布局和功能将页面划分为几个组件：

*   Header：头部组件，展示公司标志、导航菜单和搜索栏
*   Banner：横幅组件，展示产品或服务的幻灯片图片或视频。
*   AboutUs：关于我们组件，展示公司的历史、使命和团队成员。
*   Services：服务组件，展示公司的服务或产品，以及它们的特点
*   ContactUs：联系我们组件，展示公司的各个部门联系方式
*   Footer：底部组件，展示友情链接、备案信息等

    <template>
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
    </template>
    
    <script>
    import Header from './components/Header.vue';
    import Banner from './components/Banner.vue';
    import AboutUs from './components/AboutUs.vue';
    import Services from './components/Services.vue';
    import ContactUs from './components/ContactUs.vue';
    import Footer from './components/Footer.vue';
    
    export default {
        name: 'App',
        components: {
            Header,
            Banner,
            AboutUs,
            Services,
            ContactUs,
            Footer
        }
    };
    </script>
    

在开发时首先写几个空的组件文件，并不去真正实现，可以只是简单的返回一个div， 先把整体的页面架子搭好，然后再去依次实现，自上而下设计，自下而上实现，化整为零，化繁为简。

    <!--./components/Header.vue-->
    <template>
        <div>
            这是Header组件，暂时还未实现
        </div>
    </template>
    <script>
    export default {
        name: 'Header',
    };
    </script>
    

这个例子或许很简单，官网嘛，逻辑并不会很复杂，好像不做组件化设计也并不能怎样，但是如果是实现一个低代码的大屏设计器呢，不组件化开发根本不可能，我之前工作中就通过这种方式，完成了一个功能复杂的低代码大屏的开发，一个低代码设计器大致可以分为顶部ToolBar，主体内容左侧是物料选择MaterialSelect、绘图区域DrawingArea以及属性编辑区域PropertyEditing，每个组件再去细分，然后逐个去实现。

    <template>
        <div>
            <!--顶部工具栏-->
            <ToolBar/>
            <main>
                <!--物料选择-->
                <MaterialSelect />
                <!--绘图区域-->
                <DrawingArea/>
                <!--属性编辑-->
                <PropertyEditing/>
            </main>
        </div>
    </template>
    

组件化开发的代码不仅可读性强，而且还有个附带的好处，就是可以多人并行开发，如果不这么拆分，就算有10个人，也只能一个人写，其他人看着。 毕竟我们没法10个人在一个文件里面去写代码，那样造成的冲突不敢想象。

组件化拆分带来的另一个好处就是复用，通过抽取小的公共的组件，能够大大提升后续功能的开发速度，提升研发效率及质量。

根据我的经验，一般一个Vue组件文件，不建议超过300行，其中Template模板部分不建议超过100行，否则就带来很大的阅读负担。

相信我，小文件一定比大文件更易读，如果不是，那一定是拆分人的错，通常出现这种问题，都是没有做到组件内部高内聚，组件和组件之间低耦合，通常是组件划分不合理，导致耦合严重，比如多个子组件之间互相调用，才让人觉得还不如一个大文件更可读。

2.3 臃肿的utils
------------

在开发中经常会遇到一个超大的utils文件，各种工具函数没有地方放置了都一股脑的丢进utils.js中，导致utils文件动辄几千甚至上万行，如果来了一个新人，看到这个utils，很可能不知道究竟有哪些方法可以用，当他需要一个工具函数时，干脆再写一个丢进这个文件中，导致整个文件的可读性越来越差。

我们应该进行对utils进行合理的模块化拆分，通过结构化的思考，将utils工具函数进行分类，比如可以分为cookie操作、date处理、url处理、event事件处理等，将原来的一个utils.js拆分为多个小的功能更聚合的文件，如果来了一个新人，想查找日期处理有哪些方法，很容易就定位到date.js中，由于这个文件很小，很快就能获取到自己想要的信息，也就是我们的项目可读性增强了。

当然了，不只是utils文件，其他别的文件也是一样的道理，通过模块化拆分，将大文件拆成多个小文件，和上面说到的组件化是一个意思。

2.4 超大的类
--------

一般我们前端在写业务时很少遇到写类的情况，但是如果是要写一些底层库，通常还是避免不了的，针对超大的类，也有很多方法减少类文件的大小。比如我们常用的Vue，本身就是一个类，如果把一个Vue类的所有属性和方法集中在一个文件，可读性肯定是非常差的。

以Vue类的实现为例：

    import { initMixin } from './init'
    import { stateMixin } from './state'
    import { renderMixin } from './render'
    import { eventsMixin } from './events'
    import { lifecycleMixin } from './lifecycle'
    import { warn } from '../util/index'
    
    //Vue类的构造函数
    function Vue (options) {
        if (process.env.NODE_ENV !== 'production' &&
            !(this instanceof Vue)
        ) {
            warn('Vue is a constructor and should be called with the `new` keyword')
        }
        this._init(options)
    }
    
    //在不同的文件中，给Vue类增加相应的方法
    initMixin(Vue)
    stateMixin(Vue)
    eventsMixin(Vue)
    lifecycleMixin(Vue)
    renderMixin(Vue)
    
    export default Vue
    

主文件中，仅仅定义一个构造函数 function Vue()， 并没有为其添加任何属性和方法。通过将Vue类的功能进行结构化的拆分，分成几个不同的文件去为Vue类增加方法。

以state.js为例，在stateMixin方法中，为Vue增加原型方法，这样就通过多个文件，共同创建一个超大型的类。

    export function stateMixin(Vue: Class<Component>) {
        Vue.prototype.$set = set
        Vue.prototype.$delete = del
    
        Vue.prototype.$watch = function () {
            //...
        }
    }
    
    

除了这种方式来实现一个超大的类外，还可以将一个大类中的不同模块拆分成不同的类，然后在这个大类中进行组合。 比如一个组件类Component，可能包含数据管理、渲染管理、事件管理，那么我们就可以把数据管理Store和事件管理Event单独抽出去实现， 在组件类中组合Store和Event两个类，共同完成一个复杂的任务，这样组件类Component的文件长度就大大降低了。

    import Store from './store.js'
    import Event from './Event.js'
    class Component {
        constructor({el, template, data, computed, mounted, updated, methods}) {
            this.store = new Store({data, computed});
            this.event = new Event();
        }
    
    }
    

无论是拆分函数，还是拆分组件、模块、utils、类等，主要还是要遵循我们前面提到的单一职责原则，只要满足了这个原则，一般来说文件都不会很大，无论可读性还是复用性，都会比较好。

三、清晰的结构
=======

清晰的代码结构也能让代码更可读，下面我们介绍几种常见的让代码结构更清晰的方法。

3.1 使用卫语句
---------

卫语句也就是提前return，防止if嵌套层次太深。

    function getScoreLabel(score) {
        if (socre > 60) {
            if (score > 80) {
                return 'A'
            } else {
                return 'B'
            }
        } else {
            return 'C';
        }
    }
    

使用卫语句改写后如下，改写的关键就是翻转if条件，让其尽快return。

    function getScoreLabel() {
        if (socre <= 60) {
            return 'C';
        }
    
        if (socre <= 80) {
            return 'B';
        }
        return 'A'
    }
    

可以看出，相对原有写法，使用卫语句逻辑更加清晰，更容易看懂不同条件下返回什么内容。

3.2 switch代替多个if else
---------------------

    function commandHandle(command){
        if(command === 'install'){
            install()
        }else if(command === 'start'){
            start()
        }else if(command === 'restart'){
            restart()
        }else{
            showToast('未知命令')
        }
    }
    

switch比较适合这种判断条件比较单一的情况，如判断是否等于某个字符串或者数字，如果if条件存在3个及以上，使用switch相对来说结构更加清晰。

    function commandHandle(command){
        switch (command){
            case 'install':
                install();
                break;
            case 'start':
                start();
                break;
            case 'restart':
                restart();
                break
            default:{
                showToast('未知命令')
            }
        }
    }
    

当然如果事情如此简单，我们还可以进行更进一步的优化，通过一个map来指定每个命令对应的动作。

    function commandHandle(command) {
        let commandHandleMap = {
            install,
            start,
            restart,
            default: () => showToast('未知命令')
        }
    
        let handle = commandHandleMap[command] || commandHandleMap['default']
        handle()
    }
    

3.3 跳出链式调用
----------

这里的链式调用是指在一个函数A中调用函数B，函数B中调用函数C，如果要弄明白整个流程， 则需要沿着链条一步一步往下去查看，有些情况可以将链式调用改为顺序结构。

以平时最常见的一个组件初始化为例，在下面这个例子中，首先在组件挂载时调用init，init中调用获取数据getData， 获取数据后调用格式化数据formatData，格式化数据之后再调用setFormData给表单赋初始值。

    <script>
    export default {
        mounted(){
            this.init()
        },
        methods:{
            init(){
                this.getData()
            },
            getData(){
                request(url).then(res =>{
                    this.formatData(res)
                })
            },
            formatData(res){
                let initData = res.map(item => item)
                this.setFormData(initData)
            },
            setFormData(initData){
                this.formData = initData
            }
        }
    }
    </script>
    

如果想要弄明白init中到底发生了什么，必须需要沿着链条一个一个去阅读相关实现，伴随着在函数中跳来跳去，增加了很大的认知负担。

我们只需在函数中返回数据，就可以将链式调用改为顺序结构。

    <script>
    export default {
        mounted() {
            this.init()
        },
        methods: {
            async init() {
                let data = await this.getData()
                let formData = this.formatData(data)
                this.setFormData(formData)
            },
            getData() {
                return request(url).then(res => {
                    return res
                })
            },
            formatData(res) {
                return res.map(item => item)
            },
            setFormData(initData) {
                this.formData = initData
            }
        }
    }
    </script>
    

改写之后可以清楚看到init中发生了3件事，获取数据、格式化数据、给表单赋值，对整体流程有了明确的认识，后面有需要可以再分别进入具体函数进行查看。

3.4 使用管道代替循环
------------

使用管道操作可以大大简化代码的写法，去除一些无用的代码干扰，只关注需要关注的数据。

比如从一个应用列表找出运行中的应用id，使用for循环写法如下：

    let appList = [
        {
            id: 1,
            name: '应用1',
            status: 'running'
        },
        {
            id: 2,
            name: '应用2',
            status: 'destroyed'
        }
    ]
    
    function getRunningAppId(){
        let ids = [];
        for(let i = 0; i < appList.length; i++){
            if(appList[i].status === 'running'){
                ids.push(appList[i].id)
            }
        }
        return ids
    }
    
    

使用管道改写后

    let appList = [
        {
            id: 1,
            name: '应用1',
            status: 'running'
        },
        {
            id: 2,
            name: '应用2',
            status: 'destroyed'
        }
    ]
    
    function getRunningAppId(){
        return appList.filter(app => items.status =='running').map(app => app.id)
    }
    
    

管道操作将关注点聚焦到过滤条件是什么，想要的map数据结构是什么，也就是将焦点聚焦到业务需求，而不是关注点被噪音代码分散。

3.5 同一个层次对话
-----------

一个函数（或组件）内部的实现，应该在做同一个层次的事情。

比如在一个战略会议上，别人发言都是谈方向谈策略，你不能发言说自己明天的工作安排是什么，这样的细节和抽象混合在一起，显然是不在一个层面对话，也是非常不合适的。

假设有个执行命令的函数，支持的命令有安装install、卸载destroy和删除delete，现在看看这块代码有什么问题：

    function executeCommand(command, params){
        switch (command){
            case 'install':
                installApp(params);
                break;
            case 'destroy':
                destroyApp(params);
                break;
            case 'delete':
                if(params.id){
                    showToast("id不能为空")
                }
                request.delete('/api/v1/user').then(res=>{
                    showToast("删除成功")
                })
            default:{
    
            }
        }
    }
    
    function installApp(params){
        //安装代码
    }
    function destroyApp(params){
        //卸载代码
    }
    

可以看出来，在executeCommand函数中，install和destroy的抽象层级较高，delete抽象层级较低，在面向细节编程，很明显delete命令的处理和其他两个不在一个层级上，导致整段代码看起来怪怪的，可读性不是很好。

    function executeCommand(command, params){
        switch (command){
            case 'install':
                installApp(params);
                break;
            case 'destroy':
                destroyApp(params);
                break;
            case 'delete':
                deleteApp(params);
                break
            default:{
    
            }
        }
    }
    
    function installApp(params){
        //安装代码
    }
    function destroyApp(params){
        //卸载代码
    }
    function deleteApp(params){
        if(params.id){
            showToast("id不能为空")
        }
        request.delete('/api/v1/user').then(res=>{
            showToast("删除成功")
        })
    }
    

改写也非常简单，只需要把delete相关操作抽取出来封装成一个函数即可，现在对比下两个executeCommand方法，看看哪个可读性更好。

3.6 明确的参数结构
-----------

使用js编程遇到的一个很大问题就是，当参数是个对象时，不知道参数的数据结构，导致进行函数调用时，需要阅读完整的上下文， 才能了解到参数到底是个什么结构，在不使用typeScript的情况下，我们可以通过注释和对象解构来表明对象的具体结构。

    //反例
    function addNews(news){
        //不知道news的结构
    }
    

可以通过js的对象解构来表明参数结构，这样别人调用这个函数，就知道传入什么结构数据了，代码可读性比单纯写一个对象变量更加好。

    function addNews({title, content, keywords}){
        //现在知道了添加news时对象可以包含title、content、keywords三个属性
    }
    

四、简洁有力的表达
=========

简洁的代码更有表现力，啰里啰嗦的代码表达容易制造更多理解上的障碍。简洁的代码就像是干净的桌面上放了一颗明亮的宝石，啰嗦的代码就像是混乱的桌面上藏了一颗宝石，必须拨开干扰才能发现你想要的东西。

4.1 简化Bool值返回
-------------

有时候会在满足不同条件时返回不同Bool值，这时可以把条件直接作为返回值，以简化代码。

    //反例
    function pass(score){
        if(score >= 60){
            return true
        }else{
            return false
        }
    }
    

改写成下面的代码是否更易懂。

    //正例
    function pass(score){
        return score >= 60
    }
    

再举一个我CodeReview中遇到的例子，需求是判断文件是否能预览，只支持pdf和docx格式的文件预览。

    //反例
    function canPreview(fileName){
        let flag = false;
        if(fileName.endsWith('.pdf') || fileName.endsWith('.docx')){
            flag = true;
        }else{
            flag = false;
        }
        return flag;
    }
    

上面这个实现就太啰嗦了，完全可以一行代码实现，而且还更加易读。

    //正例
    function canPreview(fileName){
        return fileName.endsWith('.pdf') || fileName.endsWith('.docx')
    }
    

4.2 短路求值
--------

当使用逻辑与运算符 && 时，如果第一个操作数为false，则不会对第二个操作数进行求值，直接返回false，否则返回第二个操作数的值，利用这个特点我们可以通过短路求值简化代码写法。

    //改写前
    if(condition){
        doSomething()
    }
    //改写后
    condition && doSomething()
    

4.3 三元运算赋值
----------

通过三元运算符，可以简化一些条件赋值操作。

    let num = 6;
    let isEven = false;
    if(num % 2 === 0){
        isEven = true;
    }
    

通过三元运算改写：

    let num = 6;
    let isEven = num % 2 === 0 ? true : false;
    

需要注意的是，三元运算符虽然可以简化代码，但如果嵌套过多或者条件过于复杂，会影响代码的可读性和维护性。因此，在实际开发中需要根据具体情况选择使用。

4.4 善用德摩根定律简化判断条件
-----------------

德摩根定律是关于命题逻辑规律的一对法则。奥古斯都·德·摩根首先发现了在命题逻辑中存在着以下关系：

*   非(P 且 Q) = (非 P) 或 (非 Q)
*   非(P 或 Q) = (非 P) 且 (非 Q)

德摩根定律在简化判断条件时非常有用，比如下面的代码：

    if (!(x > 0 && y > 0)) {  
       
    }
    

你能说说上面这个条件是什么含义吗？通过德摩根定律简化后：

    if (x <= 0 || y <= 0) {  
       
    }
    

现在是不是清晰多了，当遇到对一组条件取反时，可以考虑是不是可以运用德摩根定律简化判断条件。

4.5 语义化的表达
----------

在判断字符串中是否包含某个字符串时，indexOf和includes相比，明显includes的语义性更强，这也是为什么js在es6中增加includes的原因。

    if(fileName.indexOf('pdf') !== -1){
    
    }
    
    if(fileName.includes('pdf')){
    
    }
    

在判断某个变量是否等于多个值中的一个时，也可以用includes改写，不仅简洁，后续增加新的值时修改也更简单。

    if(status === 'running' || status === 'stop'){
    
    }
    
    //更加简洁语义化的表达
    if(['running','stop'].includes(status)){
    
    }
    

在条件判断时，有时条件比较复杂，不是很容易看懂条件想要表达的业务含义，比如：

    if(userLevel == 'vip' && orderAmount > 1000 && quantity > 5){
        discount = 0.2; 
    }
    

我们可以将这种复杂条件提取出来，用一个语义化的变量来代替，这样代码可读性会更好。

    let isVipWithBigOrder = userLevel == 'vip' && orderAmount > 1000 && quantity > 5;
    if(isVipWithBigOrder){
        discount = 0.2; 
    }
    

在DOM中也是一样，经常会有比较复杂的条件和复杂的字符串拼接，也可以通过封装函数进行更加语义化的表达，如下示例：

    <template>
        <div v-for="item in data">
            <span v-if="!(item.children && item.children.length)"></span>
        </div>
    </template>
    

通过语义化改造为：

    <template>
        <div v-for="item in data">
            <span v-if="isLeaf(item)"></span>
        </div>
    </template>
    <script>
    export default {
        methods: {
            //判断是否为叶子节点
            isLeaf(item){
                return !(item.children && item.children.length)
            }
        }
    }
    </script>
    

语义化的表达还有很多例子，我们平时需要多注意下同一个功能不同写法之间的区别。

4.6 多用ES6语法
-----------

ES6的很多语法非常简洁，比如箭头函数、对象解构、数组解构、模板字符串、扩展运算符等，使用这些语法可以简化代码。

### 箭头函数替代普通函数

箭头函数相对普通函数代码更加简洁，特别是箭头函数可以直接返回而不用return语句，可以极大简化代码，特别是在一些创建回调函数场景，用处很大。

    let products = [
        {
            id: 1,
            name: '产品1',
            price: 25
        },
        {
            id: 2,
            name: '产品2',
            price: 50
        }
    ]
    
    //使用普通函数
    let productIds = products.map(function (product){
        return product.id
    })
    //箭头函数
    let productIds2 = products.map(product => product.id)
    

对比两个写法，箭头函数明显更加直观，箭头函数可以让关注点聚焦在要表达的业务含义上，不会受到无关语法代码干扰。

如果用箭头函数返回一个对象，也非常方便，只需要将{}用()扩起来即可，比如根据一个对象数组生成下拉选择的options：

    let products = [
        {
            id: 1,
            name: '产品1',
            price: 25
        },
        {
            id: 2,
            name: '产品2',
            price: 50
        }
    ]
    
    //使用普通函数
    let productOptions = products.map(function (product){
        let option = {};
        option.value = product.id;
        option.label = product.name;
        return option;
    })
    //箭头函数
    let productOptions = products.map(product => ({
        value: product.id,
        label: product.name
    }))
    

### 对象解构

对象结构可以简化变量定义，代码更加简洁，比如下面的代码：

    let a = obj.a;
    let b = obj.b;
    let c = obj.c;
    

改造为

    let {a,b,c} = obj;
    

ES6现在大家应该很熟悉了，不再赘述相关示例，其他的大家自行总结。

五、不要玩魔术
=======

所谓玩魔术，就是在预期之外发生了一些变化，比如莫名其妙有个值可以使用，或者某个值突然变化了，异或突然之间产生了某种副作用。

总之不在显式的预期范围内的，都有点像玩魔术，写代码应该尽量减少这种魔术，这不是惊喜，通常是惊吓。

5.1 数据来源在预期之内
-------------

以react为例，目前引入了hooks来进行逻辑的复用，相较于之前的高阶组件，hooks的调用更加显式。

通常高阶组件会向被包裹的组件传递属性, 比如下面这个，会向组件传递一个data属性，如果一个组件被多个高阶组件包裹， 则会传递更多属性。

    function hoc(WrappedComponent) {
        // ...并返回另一个组件...
        return class extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    data:[]
                };
            }
            //...省略业务代码
            render() {
                //高阶组件会向组件传递属性
                return <WrappedComponent data={this.state.data} {...this.props} />;
            }
        };
    }
    

在组件内部可以通过this.props来进行获取，那么当你只看这个组件时，这个props下的data属性从何而来？ 要想搞明白这个魔术数据，可能你要沿着包裹一层一层往外查看，增加了阅读障碍。

    
    class ChildComponent extends React.Component {
        constructor(props) {
            super(props);
            console.log(this.props.data)
        }
    }
    

而采用hooks这没有这方面的疑问，所有的数据来源都是清晰明确的，可以直接看出data是从useData来的。

    function ChildComponent(){
        let data = useData()
    }
    

vue中的mixin也是有点像玩魔术，引入mixin后，组件内部多了很多可以访问的属性和方法， 但是这个属性和方法并没有在当前组件定义，如果没有仔细看mixin，甚至觉得这是写代码人的bug， 而且如果引入多个mixin，就更不清楚这些变量和方法从何而来，这简直是在玩魔术， 所以目前vue改用了组合式Api来解决这些问题。

这种魔术的数据来源，节省了一次引入的工作，可是这个节省的工作却导致可读性大大降低，得不偿失。

程序员最怕的是不确定性，让一切尽在掌握之中才是最佳做法，不要在背后偷偷做事情。

5.2 减少依赖全局数据
------------

注意这里说的是全局数据，包括全局变量以及其他一些全局共享的数据，如vuex、redux，全局数据也是一种魔术，它很神秘，不知从何而来，也不知要往那里去，神出鬼没。

使用全局数据进行首次开发的人很爽，通过全局共享，降低了各模块之间传参的复杂度，但是对于后续维护的人来说， 很不友好，不明白全局数据首次在什么时机设置，对使用的时序有没有限制，比如我在首次设置之前调用就为空，可能会出错， 其次不知道有什么人会对其进行修改，也不知道我对全局数据的修改对其他人有什么影响，多个模块通过全局数据紧紧耦合在一起。

**如无必要，尽量减少全局数据**

前几年曾经看到过这样一些react代码，将各个组件的内部数据全部放到redux中，包括不需要共享的内部state，现在看来这是一种糟糕的设计。

全局数据只存放多模块组件共享的最小量数据，最大限度减低全局数据带来的耦合和阅读故障，如果某个值不需要多组件共享，就不要放入全局。

**将全局数据改为参数**

比如在一些utils函数中可能也用到了全局数据，按理说utils是不应该耦合全局数据的，希望utils是一些简单的纯函数，可以在业务代码中调用utils中的函数，然后将全局数据传递过来。

比如我曾经见到过这样的写法，utils提供了一个diff方法，将传递过来的source数据和全局数据中的某个值进行比对：

    //utils中的一个函数
    function diff(source) {
        //依赖全局数据store
        let target = store.state.targetData
        //对比source和target
    }
    

现在在某个页面的代码中，有人调用了diff函数，试问，如果别人看到这段代码，知道diff操作究竟在和谁比较吗？

    diff(sourceData)
    

我们可以将全局数据变为一个参数，在调用方传递过来

    function diff(source, target){
        //对比source和target
    }
    
    //调用方
    diff(source, store.state.project)
    

通过这样的改写，再看到diff函数，你至少能知道究竟是谁和谁进行diff，将业务逻辑集中在业务代码中，这样utils不和业务耦合，假如后续要和其他数据进行diff，只需要传参即可，不像之前，只能和全局数据中的某个属性进行对比，通过简单的改写不仅增加了代码的可读性，还增加了可复用性和可测试性。

5.3 尽可能使用纯函数
------------

纯函数是所有函数式编程语言中使用的概念。

所谓纯函数就是指在相同的输入条件下，总是返回相同的输出结果，并且不会对外部环境产生任何副作用的函数。纯函数不会修改传入的参数，也不会改变全局变量或者调用其他不纯的函数。它们只依赖于输入参数，而不依赖于外部的状态或者数据。

纯函数有以下特点。

**1\. 输入不变输出不变**

比如一个加法函数，无论什么时候调用，无论调用多少次，只要输入确定了，你总能轻易的预料到输出。

    function add(a,b){
        return a + b
    }
    

类似于数学中的函数 f(x) = 2\*x + 1，x给定了f(x)也是确定的。

**2\. 不依赖外部，只依赖参数**

纯函数的输入只来自参数，而不会使用全局变量或者外部变量

下面的函数就不是纯函数，依赖了外部变量

    let sum = 0
    function add(a,b){
        return sum +a + b
    }
    

**3\. 纯函数没有副作用**

副作用包含很多，比如

*   修改参数
*   修改全局量的值或者外部变量
*   进行网络请求
*   进行dom的操作
*   进行定时器的调用

比如以下这个就不是纯函数，因为它修改了参数

    function addItem(arr, item){
        arr.push(item)
    }
    

这样就是纯函数，或者深度克隆arr再push也可以

    function addItem(arr, item){
        return [...arr, item]
    }
    

在实际编程中，肯定不能做到100%全是纯函数，但是我们应该加大纯函数的占比，尽量编写纯函数。

纯函数是最让人放心的函数，它不玩魔术，就像数学中的函数一样，只要给定同样的输入，必然给出同样的输出，纯函数是可信赖的，由于它的这些特性，让代码的可读性更好。

5.4 杜绝魔术数字
----------

代码中硬编码的数字和字符串通常被称为"魔术数字"、"魔术字符串"，尤其是魔术数字，可读性非常差，是业务代码开发中出现频率非常高的一个问题。

    function getColor(status){
       if(status === 0){
           return 'green';
       }else if(status === 1){
           return 'red';
       }else{
           return 'grey'
       }
    }
    

魔术数字/字符串的优化非常简单，只要将它们提取为常量即可，但是在实际业务开发中还是经常会发生，主要还是对这个问题的认识不足，偶尔也是有些偷懒，没有坚定地执行我们编码的原则和规范。

    const APP_STATUS = {
        RUNNING: 0,
        STOPPED: 1
    }
    function getColor(status){
        if(status === APP_STATUS.RUNNING){
            return 'green';
        }else if(status === APP_STATUS.STOPPED){
            return 'red';
        }else{
            return 'grey'
        }
    }
    

一般这些魔术数字对应着后端接口返回的状态，如果接口返回值调整了，只要修改常量配置即可，不会造成大面积的代码修改，也不会造成修改遗漏。而如果没有进行这种常量配置，则会给前端带来一些无意义的维护工作，也就是前后端没有解耦，所以魔术数字不只是带来可读性问题，对可维护性以及前后端的耦合也有很大负面影响，一定要重视！

六、只写必要的注释
=========

个人认为靠注释提升代码可读性只是一种无奈之举，并不推荐大范围编写注释，当你要编写注释时应该首先思考下，你为什么认为要写这段注释？是不是代码本身出现了问题？能不能从代码层面先去优化，而不是通过注释绕开优化代码。

    //bad
    let list =[]; //用户列表
    
    //good
    let userList = []; 
    

注释不要写废话，显而易见的逻辑就不要加注释了，只会干扰阅读视线。

    //下一步
    function nextStep(){
        
    }
    

更不要写误导性注释，当然了，大部分误导性注释是因为代码后期变更了，但是注释没有及时变更，所以修改代码时一定要记得修改注释，这也是为什么不推荐大范围编写注释的原因，很多人是只修改代码不修改注释的。

    //删除用户
    editUser();
    

那什么时候应该写注释呢？

*   实现逻辑违背直觉，需要解释一下原因

    // 产品说这里先不要做校验
    

    // 这里要兼容2.0版本之前的数据，2.0版本之前数据是数组格式，现在改成了对象格式
    

*   有需要改进的地方，但是暂时没有时间优化

    // todo li，这里实现不够优雅，后续优化
    

*   业务逻辑确实非常复杂，需要解释一下

    // 启动设备时需要对设备健康状态进行全面检查，包括：****
    

*   开发中的临时注释

对于一些复杂的业务实现，可以在开发中先通过注释的方式整理思路，等开发完成后再删除注释，这里的注释和可读性没有关系了，是一种辅助开发的手段。

    function startDevice(){
        //第一步，先校验设备信息是否具备启动条件
        
        //第二步，启动设备
        
        //第三步，启动设备后需要持续检查设备的健康状态
    }
    

必要的注释是非常有用的，对代码可读性有很大的帮助，但是非必要的注释可能会起负面作用，所以在编写注释时应该考虑清楚，你真的需要注释吗？

七、良好统一的代码风格
===========

良好且统一的代码风格，能够减少阅读的障碍，也在一定程度上提升代码的可读性，包括统一的命名规范、统一的缩进/留白/换行规范以及符合认知的代码顺序。

统一的命名规范在前面"好的命名是成功的一半"中我们已经讲过，包括制定领域词汇表，统一的命名格式等，这里不再赘述。

对于统一格式大家都比较认同，大部分前端团队都会制定自己的风格规范，而且社区也有成熟的规范可参考，如Airbnb前端规范。 这里要说的是，这些规范并不应该要求团队成员去记忆，一来记这些规范并没有太大的意义，对大家也没有什么提升，二来对新人不友好，新人学习成本高，三来规范靠记忆是很难执行的。

可以借助 eslint + prettier + stylelint + gitHook 等工具在代码提交前，检查代码问题并统一格式化，我们的目的是收获统一风格的代码产出，而不是要求大家记忆一堆规则。

这里重点说下代码顺序问题。

组件选项顺序
------

在组件开发时，组件中的代码结构也应该按照一定的顺序排列，这样更有利于阅读代码，比如计算属性computed应该放在data的后面，因为计算属性是依赖data的；同样地，如果有两个计算属性A、B，A是由B计算出来的，那么A应该放在B的后面，谁在前面，直觉上就是先计算谁，所以应该将代码位置顺序和代码执行顺序保持一致。

Vue2的组件官方推荐顺序如下，我们可以作为参考，其他框架也是一样的道理。

1.  副作用 (触发组件外的影响)
    *   el
2.  全局感知 (要求组件以外的知识)
    *   name
    *   parent
3.  组件类型 (更改组件的类型)
    *   functional
4.  模板修改器 (改变模板的编译方式)
    *   delimiters
    *   comments
5.  模板依赖 (模板内使用的资源)
    *   components
    *   directives
    *   filters
6.  组合 (向选项里合并 property)
    *   extends
    *   mixins
7.  接口 (组件的接口)
    *   inheritAttrs
    *   model
    *   props/propsData
8.  本地状态 (本地的响应式 property)
    *   data
    *   computed
9.  事件 (通过响应式事件触发的回调)
    *   watch
    *   生命周期钩子 (按照它们被调用的顺序)
        *   beforeCreate
        *   created
        *   beforeMount
        *   mounted
        *   beforeUpdate
        *   updated
        *   activated
        *   deactivated
        *   beforeDestroy
        *   destroyed
10.  非响应式的 property (不依赖响应系统的实例 property)
    *   methods
11.  渲染 (组件输出的声明式描述)
    *   template/render
    *   renderError

元素 attribute 的顺序
----------------

合理的Dom元素顺序也能够提升可读性，可以把重要的属性放在前面，如v-if条件、v-model等，这样可以在第一时间找到你想要的内容；不同类型的属性顺序也应该遵循一定的规范，比如我们通常把事件放在最后配置，这样当你想要查找组件的@click事件时，只要查看最后几条属性就行。

我们以Vue推荐的元素attribute 顺序为例，来体会下属性顺序应该怎么安排。

1.  定义 (提供组件的选项)
    
    *   is
2.  列表渲染 (创建多个变化的相同元素)
    
    *   v-for
3.  条件渲染 (元素是否渲染/显示)
    
    *   v-if
    *   v-else-if
    *   v-else
    *   v-show
    *   v-cloak
4.  渲染方式 (改变元素的渲染方式)
    
    *   v-pre
    *   v-once
5.  全局感知 (需要超越组件的知识)
    
    *   id
6.  唯一的 attribute (需要唯一值的 attribute)
    
    *   ref
    *   key
7.  双向绑定 (把绑定和事件结合起来)
    
    *   v-model
8.  其它 attribute (所有普通的绑定或未绑定的 attribute)
    
9.  事件 (组件事件监听器)
    
    *   v-on
10.  内容 (覆写元素的内容)
    
    *   v-html
    *   v-text

CSS属性顺序
-------

虽然CSS规范并没有规定特定的属性顺序，但在编写CSS时，保持一致的属性顺序可以使代码更加易于阅读和维护。

比如下面这个，你觉得好理解.box的样式吗？

    .box {
        font-size: 14px;
        border: 1px solid #ccc;
        width: 100px;
        left: 10px;
        color: #fff;
        position: absolute;
        background: red;
    }
    

编写CSS的顺序也应该和我们的直觉顺序保持一致，在设置一个元素样式时，我们肯定先要知道它在屏幕的位置，然后要知道它的盒子模型的一些信息，包括大小啊边框啊内边距之类的，接着是盒子内部的背景，最后再是盒子内部的文本样式等，大致遵循一个由外及内的顺序。

一般推荐的顺序：

1.  布局和定位相关
    *   display
    *   position (包括 top, right, bottom, left, z-index)
    *   float
    *   clear
    *   visibility
    *   overflow
2.  盒模型相关
    *   box-sizing
    *   width、height
    *   margin、padding
    *   border
3.  背景
    *   background-color、background-image、background-repeat、background-position、background-size
4.  文本相关
    *   color
    *   font
    *   text-decoration
    *   text-align
    *   vertical-align
    *   ...
5.  其他

上述只是推荐顺序，并不是绝对正确，大家可以根据自己的习惯来调整，但整体顺序是这样的。

如果按照这个顺序，我们再来修改下上面的.box样式，对比下是不是清晰多了

    .box {
        position: absolute;
        left: 10px;
        width: 100px;
        border: 1px solid #ccc;
        background: red;
        color: #fff;
        font-size: 14px;
    }
    

另外一些相关性较强的属性应该放置在一起，比如display设为flex时，flex相关的属性应该紧密放置在一起，position设为absolute时，left、top等属性应该紧随其后，这样更方便阅读。

import顺序
--------

我们经常会看到混乱的import顺序，这块也是大家经常忽略的。

通常可以按照如下顺序来导入：

1.  系统内置方法

如Node.js的内置模块

    import fs from 'fs';  
    import path from 'path';
    

2.  第三方模块

    import axios from 'axios';  
    import _ from 'lodash';
    

3.  组件

组件再按照公共组件、业务组件和当前组件的特有的子组件的顺序来引入。

    import CommonButton from 'base/CommonButton';  
    import UserInfo from 'user/UserInfo';  
    import ChildComponent from './ChildComponent';
    

4.  api相关service

    import userService from 'user/service';  
    

5.  配置及utils

    import USER_STATUS from 'user/status';
    import {formatMobile} from 'utils/format';
    

总结
==

重视命名是最简单高效的提升代码可读性的方法，好的命名应该具有自解释性，可以做到见名知意；命名要有区分度，减少歧义；慎用缩写，好名称要能读出来；好名称不怕长，表达清楚意义最重要；命名和内容要一致，拒绝误导；团队应该制作一套统一的词汇表及命名规范。

小而美的代码更容易理解，可以通过拆分函数、模块化、组件化开发来降低单个文件的大小。

清晰的结构有利于提升可读性，使用卫语句尽早return；使用switch替代多个if-else；将一些链式代码改为同步代码；使用管道操作替代循环；结构化编程，一个模块内的代码应该处在一个抽象层次；参数的结构要清晰。

代码应该尽量简洁，不要啰里啰嗦，可以简化Boolean类型的返回；使用短路求值和三元运算来简化代码；善用德摩根定律简化判断条件；表达尽量语义化；尽量使用ES6更加简洁的语法，如用箭头函数替代普通函数。

不要玩魔术，尽可能显式传递数据，减少依赖全局变量，尽量使用纯函数。

只编写必要的注释，当你写注释时应该考虑能不能通过优化代码来替代注释。

团队应该使用良好且统一的代码风格，尽量借助工具来实现风格检查和美化，注意代码编写的顺序。