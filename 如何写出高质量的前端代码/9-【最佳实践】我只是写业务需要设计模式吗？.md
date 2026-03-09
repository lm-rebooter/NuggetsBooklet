提到设计模式，大家一般都会觉得设计模式很牛，要想成为高级前端必须学好设计模式，然而面对业务开发时，往往又不知道如何应用这些模式，找不到合适的应用场景，学了一遍又一遍，最终成为了应付面试的技能，而没有为业务开发带来任何帮助。

于是乎产生了这样的疑问，前端业务开发真的需要设计模式吗？本节我们就来讨论下如何在前端业务开发中应用设计模式。

前端学习设计模式的困境
===========

背景
--

设计模式的概念最早由计算机科学家克里斯托夫·亚历山大（Christopher Alexander）在建筑领域提出，他在1977年的著作《建筑模式语言》中首次提出了“设计模式”的概念，用于描述解决建筑设计中常见问题的可重复方案。

后来，设计模式的概念被引入到软件工程领域。在1994年，四位著名的计算机科学家厄尔·甘普尔（Erich Gamma）、理査德·海尔姆（Richard Helm）、拉尔夫·约翰逊（Ralph Johnson）和约翰·维利迪斯（John Vlissides）合作编写了《设计模式：可复用面向对象软件的基础》（Design Patterns: Elements of Reusable Object-Oriented Software）一书，该书系统地介绍了23种常见的设计模式，成为了设计模式领域的经典之作。

该书中，设计模式提出了一种在**面向对象编程**中解决常见问题的方案，这些方案是经过反复验证的，并且被广泛地应用于软件工程领域。

为什么前端学习设计模式这么难
--------------

可以说设计模式诞生之初就是为了解决面向对象编程中的各种问题，包括如何更好地组织代码、如何提升代码复用性、可维护性以及正交性。然而在前端开发中，我们不得不承认，确实很少需要创建类，所以前端同学很难将设计模式直接迁移、应用到前端开发，我觉得这是前端学习设计模式困难的最大原因。

其次，设计模式主要是用来解决一些复杂的、困难的问题，大家经常会看到一些知名前端库中应用一些设计模式，比如大家熟知的Vue中的观察者模式，大家都知道观察者模式是什么，甚至也能手撸一个观察者模式的实现，但是很难在业务中找到观察者模式的应用场景。前端开发的很多复杂性被框架解决了，导致前端业务开发只需要关注业务逻辑，也在很大程度上减少了设计模式的使用场景，前端同学缺少应用设计模式的机会，这也是前端学习设计模式困难的另一个客观原因。

再次，很多同学学习设计模式只关注其形，而忽略了一个模式的本质，比如策略模式，大家知道策略模式可以解决一系列算法的复用问题，但是为什么要用策略模式去解决算法的复用问题，这样做的意义是什么？前端没有太多算法怎么办，那还怎么应用策略模式呢？只关注设计模式的形式、结构，而忽略了设计模式背后解决问题的思想、原则，这是导致无法在前端业务开发中应用设计模式的重要原因。

所以在学习设计模式时，我们需要从设计模式的思想、原则、本质入手，学习设计模式是如何组织代码，提升代码复用性、可维护性、正交性的，这样才能更加灵活地应用、改造、创造设计模式。

设计模式的核心思想
=========

为什么会有设计模式呢，本质还是为了应对**变化**，变化是软件工程中不可避免的，在我们前端开发中，每天都会遇到很多变化，接口的修改、需求的变更、第三方库的升级、框架的迭代，甚至是领导的更换等，都会对我们的前端项目带来变数，可以说在前端开发中，唯一不变的就是变化，而设计模式就是教我们如何更优雅地应对这些变化。

个人认为，大部分设计模式应对变化的底层思想主要体现在：如何隔离变化与如何扩展。

隔离变化
----

隔离变化就是将变化引起的变更，控制在较小的范围内，尽量减少对其他模块或者整体流程的影响。

### 分离敏态代码和稳态代码

在软件开发中，找出应用中经常发生变化或者将来可能发生变化的部分，将其与稳定不变的部分隔离开来，从而使得变化不会影响其他部分，也就是分离敏态代码和稳态代码。

以工厂模式为例，在我们上一节，实现了一个低代码编辑器，其中有个功能是拖拽组件到画布时，实例化图形节点，将其添加到数据模型dataModel中。

    //拖拽到画布的处理方法
    function dropHandler(){
        //获取图形的默认配置
        let config = JSON.parse(event.dataTransfer.getData('config'))
    
        let node = null;
        //以后会有更多type
        switch (config.type) {
            case 'rect':
                node = new Rect(config);
                break;
            case 'circle':
                node = new Circle(config);
                break;
            case 'poly':
                node = new Poly(config);
                break;
        }
        
        dataModel.addNode(node);
    }
    

可以预见，后期我们将会扩展很多中不同类型的图形节点，比如图片节点、文字节点等，那么只要我们扩展一种节点，都要修改一次dropHandler方法，但其实dropHandler的核心逻辑并没有发生任何变更，那么在这里实例化节点就是敏态代码，而drop处理流程就是稳态代码，应该将变化的部分抽取出来。

    function createNode(config){
        let node = null;
        //以后会有更多type
        switch (config.type) {
            case 'rect':
                node = new Rect(config);
                break;
            case 'circle':
                node = new Circle(config);
                break;
            case 'poly':
                node = new Poly(config);
                break;
        }
        return node;
    }
    
    function dropHandler(){
        let config = JSON.parse(event.dataTransfer.getData('config'));
        let node = createNode(config);
        dataModel.addNode(node);
    }
    

利用工厂模式改造后，将图形节点的创建逻辑抽取出来，未来无论我们新增多少种图形节点，都只需要修改createNode方法，从而减少因为修改dropHandler里面的代码而引发意外的bug。

虽然在我们前端，很少有实例化对象的场景，但是只要明白了隔离变化这个底层思想，就很容易进行迁移。比如我要实现一个设置dom节点的css类的方法setClassName，现在参数el支持形如"#id"和".className"两种形式，未来可能需要支持更多选择器形式。

    function setClassName(el, className){
        let dom = el;
        if(el.startsWith('#')){
            //根据id获取dom
        }else if(el.startsWith('.')){
            //根据class获取dom
        }
        dom.className = className;
    }
    

在上述实现中，我们是不是应该将获取dom对象这块代码抽取出来呢？以防止未来扩展更多的选择器形式导致setClassName方法内部代码发生变更，改造后：

    function getDom(el){
        let dom = el;
        if(el.startsWith('#')){
            //根据id获取dom
        }else if(el.startsWith('.')){
            //根据class获取dom
        }
        return dom;
    }
    function setClassName(el, className){
       let dom = getDom(el);
        dom.className = className;
    }
    

这里并没有实例化对象，但是是不是和工厂模式有异曲同工之妙呢？

除了工厂模式，还有很多模式也都体现了隔离变化的思想。比如，策略模式将变化的算法提取出来，封装成一个个策略，通过配置不同的策略，从而让算法可以自由切换；模板方法模式中处理流程或算法是不变的，变的是不同子类的实现细节；迭代器模式中不变的是遍历方式，变化的是被遍历的数据结构...

### 隔离使用方和提供方

在隔离变化中，还有一些设计模式侧重于隔离使用方和提供方，以降低使用方的变化对提供方的影响，降低使用方和提供方的耦合。

仍然以我们上一节开发的低代码编辑器为例，其中我们实现了这样的功能，监听canvas画布上的鼠标点击事件，当鼠标点中某个图形时，让某个图形节点呈现选中状态，如果不采用任何设计模式，可能实现如下，在图形类GraphView中调用数据模型DataModel和选择器模型Selector的方法，这就造成了GraphView耦合DataModel和Selector，一旦DataModel和Selector的实现发生变化，或者鼠标按钮的事件处理逻辑发生变更，都需要修改GraphView的代码，这显然是不太合理的。

    class GraphView {
        _listenMouseEvents(){
            //监听画布鼠标按下事件
            this.canvas.addEventListener('mousedown', (e) => {
                let point = this.getCanvasPointOfEvent(e)
                
                //从dataModel中获取节点，耦合dataModel
                let clickedNode = this.dataModel.getClickedNode(point);
                //调用选择器将其选中，耦合selector
                this.selector.add(clickedNode);
            })
        }
    }
    

看到这个示例，比较容易想到观察者模式、发布订阅模式和事件总线模式，其中，GraphView是数据提供方、生产方，向外发布鼠标点击事件；dataModel和selector是数据使用方、消费方，订阅事件。参照观察者模式，我们需要对GraphView进行改造，为其增加registerObserver、removeObserver、notifyObservers三个方法，而DataModel和Selector两个类需要实现update方法。

    // 观察者接口  
    interface Observer {  
        update(message: string);    
    }  
      
    // 主题接口  
    interface Subject {  
        registerObserver(observer: Observer);  
        removeObserver(observer: Observer);  
        notifyObservers(observer: Observer);  
    }  
    

这样就解除了GraphView类对DataModel和Selector的耦合。

但是我们有必要完全套用这个模式吗？这样改造给DataModel和Selector带来了不必要的update方法，也不利于我们看清楚鼠标点击之后到底发生了什么逻辑。

所以在我的实现中，没有完全照搬观察者模式，而是按照隔离使用方和提供方这个底层思想，进行了符合自己需求的改造。

    //省略无关代码后的GraphView类
    class GraphView {
        constructor(){
            this.observer = {}; //存储不同事件的观察者
            this._listenMouseEvents();
        }
        addEventListener(type, callback){
            if(!this.observer[type]){
                this.observer[type] = [];
            }
            this.observer[type].push(callback);
        }
        removeEventListener(type, callback){
            if(!this.observer[type]){
                return;
            }
            if(!callback){
                this.observer[type] = [];
                return;
            }
            this.observer[type] = this.observer[type].filter(item => item !== callback);
        }
        _listenMouseEvents(){
            //私有方法：监听鼠标事件
            this.canvas.addEventListener('mousedown', (e) => {
                this.observer['mousedown'] && this.observer['mousedown'].forEach(callback =>{
                    callback(e, this.getCanvasPointOfEvent(e));
                })
            })
            this.canvas.addEventListener('mouseup', (e) => {
                this.observer['mouseup'] && this.observer['mouseup'].forEach(callback =>{
                    callback(e);
                })
            });
            this.canvas.addEventListener('mousemove', (e) => {
                this.observer['mousemove'] && this.observer['mousemove'].forEach(callback =>{
                    callback(e);
                })
            });
        }
    }
    
    //使用时
    const graphView = new GraphView();
    const selector = new Selector();
    const dataModel = new DataModel();
    //关心鼠标按下事件就订阅，传递过来一个callback回调函数
    graphView.addEventListener('mousedown', (event, point)=>{
        let clickedNode = dataModel.getClickedNode(point);
        selector.add(clickedNode);
    })
    

除了上面提到的观察者模式、发布订阅模式和事件总线模式，还有很多设计模式本质上都是为了隔离使用方和提供方。

适配器模式：适配器模式用于将一个类的接口转换成客户希望的另一个接口。通过适配器模式，可以隔离使用方和提供方之间的不匹配，使得它们可以协同工作而不需要修改原有的代码。

代理模式：代理模式用于控制对对象的访问。通过代理模式，可以在使用方和提供方之间引入一个代理对象，代理对象可以控制对真实对象的访问，并在必要时进行一些额外的处理，从而实现对真实对象的访问控制和隔离。

外观模式：外观模式提供了一个统一的接口，用于访问子系统中的一组接口。通过外观模式，可以隐藏子系统的复杂性，为使用方提供一个简单的接口，从而隔离使用方和提供方之间的复杂性。

中介者模式：中介者模式定义了一个对象，它封装了一组对象如何交互的细节，使得这些对象不需要直接相互引用。中介者对象负责协调多个对象之间的交互，从而降低了它们之间的耦合度。

这么多模式虽然表现形式不同，但是其内核都是一致的，理解了这个内核，可以让我们更加关注模块之间的解耦，至于怎么解耦，可以参考这么多模式的实现并结合业务特定需求，自行改造即可，无需生搬硬套。

对扩展开放，对修改关闭
-----------

设计模式在指导如何进行类的扩展时，一般都要求遵循开闭原则（对扩展开放、对修改关闭原则）。

扩展其实也是一种变化，一般来说扩展大都是为某个类增加一个新的功能。在设计模式中，如果为一个类增加新功能，通常都不会直接去修改这个类的实现，而是通过某种方式去扩展该类的功能，这些设计模式大都遵循开闭原则，即对扩展开发，对修改关闭。

以装饰器模式为例，如果要修改一个类，我们可以创建一个装饰器类，用来包装原始对象，并在保持原始对象类的基础上给原始对象添加新的功能。装饰器类通常会实现与原始对象相同的接口，这样客户端代码就可以透明地使用装饰后的对象。

一个经典的示例就是计算coffee的价格。

假设我们有一个简单的 Coffee 类，它有一个 getCost 方法用于计算咖啡的价格：

    class Coffee {  
      getCost() {  
        return 5; // 假设基础咖啡的价格是5元  
      }  
    }
    

现在我们想要给咖啡添加调料，比如牛奶和蔗糖，并且每种调料都会增加咖啡的价格。没有使用设计模式时，大概的实现如下：

    class Coffee {
        construct() {
            this.condiment = {
                milk: 1,
                sugar: 2
            }; //存放咖啡的调料及数量
        }
    
        getCost() {
            let cost = 5;
            if (this.condiment['milk']) {
                cost += this.condiment['milk'] * 1; //每份牛奶加1元
            }
            if (this.condiment['sugar']) {
                cost += this.condiment['sugar'] * 0.5; //每份蔗糖加0.5元
            }
            return cost; // 假设基础咖啡的价格是5元  
        }
    }
    

这样实现有个缺点，假设后期想要扩展调料，比如新增奶昔、珍珠等等，都要去修改原有Coffee类的实现，而且在Coffee类里还要知道每种调料的价格，对于扩展非常的不方便。 我们可以使用装饰器模式来实现这个功能，而不需要修改 Coffee 类。

首先，我们创建一个装饰器基类 CoffeeDecorator，它实现了与 Coffee 相同的接口：

    class CoffeeDecorator {  
      constructor(coffee) {  
        this.coffee = coffee;  
      }  
      
      getCost() {  
        return this.coffee.getCost();  
      }  
    }
    

接下来，我们创建具体的装饰器类 MilkDecorator 和 SugarDecorator，它们分别用于给咖啡添加奶精和糖浆，并增加相应的价格：

    class MilkDecorator extends CoffeeDecorator {  
      getCost() {  
        return super.getCost() + 2; // 奶精增加2元  
      }  
    }  
      
    class SugarDecorator extends CoffeeDecorator {  
      getCost() {  
        return super.getCost() + 1; // 糖浆增加1元  
      }  
    }
    

现在，我们可以使用这些装饰器来动态地组合咖啡和调料，并计算总价格：

    const coffee = new Coffee();  
    const coffeeWithMilk = new MilkDecorator(coffee);  
    const coffeeWithMilkAndSugar = new SugarDecorator(coffeeWithMilk);  
      
    console.log(coffee.getCost()); // 输出: 5  
    console.log(coffeeWithMilk.getCost()); // 输出: 7  
    console.log(coffeeWithMilkAndSugar.getCost()); // 输出: 8
    

现在如果你想扩展新的调料，只需要新增一个调料装饰器即可，调料的价格也维护在调料装饰器内部，用户下单选择了哪些调料，就用哪些装饰器依次包裹coffee实例，可以看出新调料的扩展变的简单，而且不会影响原有的Coffee类的实现。

相信大家都能看明白这个示例，也能理解这样做的好处，但是在前端也很少存在这种计算价格的场景啊，所以我们才说，学习设计模式，重要的是学习其背后的思想，然后迁移到前端，后面我们会有具体的示例，暂时不再展开了。

设计模式在前端应用
=========

设计模式有很多，我们本节也不能把每个模式都讲解一遍，只重点挑选几个在前端业务开发中使用频率比较高的模式，展示下如何通过这些模式隔离变化和扩展功能。

策略模式
----

> 策略模式（Strategy Pattern）允许在**运行时**根据不同的情况选择不同的算法或策略。该模式将算法或策略封装起来，使得它们可以**相互替换**，此模式可以让算法的变化**隔离于**使用算法的客户之外。

在这个定义中，我们需要重点关注几个关键词：

*   运行时：运行时意味着可以动态替换策略，你可以根据情况（接口返回值、用户交互传入值等）使用不同的策略，而不是提前固定好的。
    
*   相互替换：多个策略遵循相同的接口，如果策略是一种类，那就有相同的属性和方法；而在咱们前端，策略可以认为是函数或对象，如果是函数那么就有相同的形参和返回值，如果是对象就有相同的结构。
    
*   隔离变化：策略模式的目的就是隔离算法的变化，将变化的算法抽取到策略中，将不变的部分留在调用策略的客户中。
    

我们通过几个示例来看看策略模式在前端怎么应用。

假设现在需要开发一个获取用户列表的方法getUser，要求是前端可以对用户列表进行排序，排序方式要支持姓名、创建时间和所属部门的升降排序，现在先花一分钟时间思考下，如何实现这个getUser方法呢，getUser方法的参数是什么？

从需求来看，getUser应该至少需要两个参数：要排序的字段sortKey(name|createTime|department)、排序升降方式sortDirection(asc|desc)，我们先按这个思路实现下，看看有什么问题。

    function getUser(sortKey, sortDirection){
        //忽略通过请求获取用户数据相关代码
        let users = [
            {name: '用户1', createTime: '2023-10-1', department: '前端部'},
            {name: '用户2', createTime: '2023-10-2', department: '后端部'},
        ];
        
        switch (sortKey){
            case 'name':
                if(sortDirection === 'asc'){
                    //按照名称升序排序
                }else{
                    //按照名称降序排序
                }
                break;
            case 'createTime':
                if(sortDirection === 'asc'){
                    //按照创建时间升序排序
                }else{
                    //按照创建时间降序排序
                }
                break;
            case 'department':
                if(sortDirection === 'asc'){
                    //按照部门升序排序
                }else{
                    //按照部门降序排序
                }
                break;
        }
        return users;
    }
    
    getUser('name', 'asc'); //按照名称升序获取用户
    getUser('createTime', 'desc'); //按照创建时间降序获取用户
    

这样实现可以满足需求，但是也存在一些可读性和可维护性方面的问题

首先是这样的代码可读性较差，体现在两个方面，第一个点是getUser函数中充斥着大量的分支语句(switch、if)，每个分支都会增加阅读的成本，分支越多，嵌套分支越深，理解起来就越困难；第二个点是排序部分所占的代码比重在getUser函数中过高，有点头轻脚重的感觉，代码不够结构化。

在可维护性方面，后续如果要增加一些新的排序方式，你就必须要先理解getUser方法的实现原理，然后再修改getUser方法中关于排序的实现，别小看这个修改，虽然你只是想修改排序部分，但是难保不会引入新的bug，毕竟你是在修改同一个函数。

能不能将排序实现抽出去呢？不同的排序可以看成不同的算法或者策略，我们在调用getUser方法时传递想要的排序策略不就可以了吗，按照这个思路修改下：

    const nameAscStrategy = function (users){  }; //按照名称升序排序
    const nameDescStrategy = function (users){  }; //按照名称降序排序
    const createTimeAscStrategy = function (users){  }; //按照创建时间升序排序
    const createTimeDescStrategy = function (users){  }; //按照创建时间降序排序
    const departmentAscStrategy = function (users){  }; //按照部门升序排序
    const departmentDescStrategy = function (users){  }; //按照部门降序排序
    
    
    function getUser(sortStrategy){
        //忽略通过请求获取用户数据相关代码
        let users = [
            {name: '用户1', createTime: '2023-10-1', department: '前端部'},
            {name: '用户2', createTime: '2023-10-2', department: '后端部'},
        ];
        
        return sortStrategy(users);
    }
    
    getUser(nameAscStrategy); //按照名称升序获取用户
    getUser(createTimeDescStrategy); //按照创建时间降序获取用户
    

现在我们再来看看getUser方法的实现，是不是瞬间清爽了很多！里面不再有让人讨厌的分支语句了，可以说非常地优雅~~后续再有新的排序方式，也不需要修改getUser方法，只需要创建一个新的排序策略即可。

为了让策略更加高内聚，我们可以将所有策略集中放到一个对象下。

    const SORT_STRATEGY = {
        nameAsc: function (users){},
        nameDesc: function (users){},
        createTimeAsc: function (users){},
        createTimeDesc: function (users){},
        departmentAsc: function (users){},
        departmentDesc: function (users){}
    }
    function getUser(sortStrategy){
        //忽略通过请求获取用户数据相关代码
        let users = [
            {name: '用户1', createTime: '2023-10-1', department: '前端部'},
            {name: '用户2', createTime: '2023-10-2', department: '后端部'},
        ];
    
        return sortStrategy(users);
    }
    
    getUser(SORT_STRATEGY.nameAsc); //按照名称升序获取用户
    getUser(SORT_STRATEGY.createTimeDesc); //按照创建时间降序获取用户
    
    

可以看到通过策略模式，隔离了策略变化对主代码的影响，消除了主代码中的分支语句，将每个分支变成了一条条独立的策略，对代码的可读性和可维护性都有很大提升。

这种做法在前端中随处可见，比如根据后端接口返回的状态status展示不同的文案或颜色。

    function getStatusColor(status){
        if(status === 'success'){
            return 'green';
        }else if(status === 'fail'){
            return 'red';
        }else{
            return 'blue';
        }
    }
    function getStatusLabel(status){
        if(status === 'success'){
            return '成功';
        }else if(status === 'fail'){
            return '失败';
        }else{
            return '进行中';
        }
    }
    

这段代码存在几个问题，第一是太啰嗦了，第二，如果后续接口返回状态发生变更，比如用数字1、2、3来表示状态，我们就需要修改业务代码，可以通过类策略模式进行简单的改造。

首先在项目下增加关于状态status的常量配置：

    //const.js
    export const STATUS = {
        success: 'success',
        fail: 'fail',
        run: 'run'
    }
    
    export const STATUS_LABEL = {
        [STATUS.success]: '成功',
        [STATUS.fail]: '失败',
        [STATUS.run]: '进行中'
    }
    
    export const STATUS_COLOR = {
        [STATUS.success]: 'green',
        [STATUS.fail]: 'red',
        [STATUS.run]: 'blue'
    }
    

业务代码简化为：

    import {STATUS_LABEL, STATUS_COLOR} from 'const.js'
    
    function getStatusColor(status){
        return STATUS_COLOR[status]
    }
    function getStatusLabel(status){
        return STATUS_LABEL[status]
    }
    

后续无论是状态值由字符串改为数字，还是新增状态，我们都无需修改任何业务代码，只需要更改配置文件即可，每条配置就相当于一条策略，通过这种类策略模式，隔离了接口变化对前端业务代码的影响，而且消除了代码中丑陋的分支代码。

模板方法模式
------

> 模板方法模式：在一个方法中定义一个算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以不改变一个算法的结构即可重新定义该算法的某些特定步骤。

在模板方法模式中，不变的是算法骨架，算法骨架可以是一个处理事务的流程；而变化的是算法的具体实现，而具体实现由子类完成。按照这种模式，后续如果想增加新的子类，只要按照算法骨架的要求实现各个方法即可，而流程不变，这对我们扩展子类提供了方便，隔离了子类变化对核心流程的影响。

以冲泡一杯饮料为例，无论是冲泡咖啡还是冲泡奶茶，他们都有相似的步骤，比如烧水、准备原料、加入调料、搅拌，只是每一步细节不一样，我们先定义这样一个算法的骨架，即冲泡步骤，然后把具体的实现放在子类中实现。

    //定义一个饮料基类
    class Drink {
        //定义一个冲泡方法，定义执行的步骤
        brew(){
            this.boilingWater(); //烧水
            this.prepareMaterials(); //准备原料
            this.addSeasoning(); //加入调料
            this.mixing(); //搅拌
        }
        boilingWater(){
            //子类实现
        }
        prepareMaterials(){
            //子类实现
        }
        addSeasoning(){
            //子类实现
        }
        mixing(){
            //子类实现
        }
    }
    class Coffee extends Drink{
        boilingWater(){
            //咖啡的实现
        }
        prepareMaterials(){
            //咖啡的实现
        }
        addSeasoning(){
            //咖啡的实现
        }
        mixing(){
            //咖啡的实现
        }
    }
    class MilkTea extends Drink{
        boilingWater(){
            //奶茶的实现
        }
        prepareMaterials(){
            //奶茶的实现
        }
        addSeasoning(){
            //奶茶的实现
        }
        mixing(){
            //奶茶的实现
        }
    }
    
    const coffee = new Coffee();
    coffee.brew();
    const milkTea = new MilkTea();
    milkTea.brew();
    

如果只关注这个形式，我们很难在前端找到应用场景，但是这个思想是可以借用的。

比如我们前端经常会遇到一些页签，每个页签下的功能肯定都不一样，但是每个页签可能会有一些相似的处理流程，比如都需要进行数据初始化、都要进行表单校验等，假如我们实现下图这个需求，没有使用设计模式时，大致实现如下。

![页签弹窗.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8f4f26338c441d9a66572bb342556e4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=582&h=366&s=19082&e=png&b=fefefe)

    <template>
        <my-dialog @confirm="confirmHandler">
            <my-tabs @change="tabChangeHandler">
                <el-tab-pane name="样式配置">
                    <!--样式配置组件-->
                </el-tab-pane>
                <el-tab-pane name="存储配置">
                    <!--存储配置组件-->
                </el-tab-pane>
                <el-tab-pane name="系统配置">
                    <!--系统配置组件-->
                </el-tab-pane>
            </my-tabs>
            
        </my-dialog>
    </template>
    <script>
    export default {
        methods: {
            //切换页签
            tabChangeHandler(tab) {
                switch (tab) {
                    case '样式配置':
                        //样式配置的初始化
                        break;
                    case '存储配置':
                        //存储配置的初始化
                        break;
                    case '系统配置':
                        //系统配置的初始化
                        break;
                }
            },
            //提交表单
            confirmHandler() {
                //样式配置的校验
                //存储配置的校验
                //系统配置的校验
            }
        }
    }
    </script>
    

如果按照上述实现，后续我们新增或者删除一种配置，需要修改Dom结构、tabChangeHandler方法和confirmHandler方法等多处代码，不仅会增加工作量，而且很容易因为修改不慎导致bug产生，影响该功能的扩展性，而如果我们采用类似命令模式的方式，定义好处理的流程，比如initData、validate等方法，在不同时机调用这些方法，而方法的具体实现存在于每个页签的配置中。

    <template>
        <!-- 新增页签无需修改Dom -->
        <my-dialog @confirm="confirmHandler">
            <my-tabs @change="tabChangeHandler">
                <el-tab-pane v-for="(tab, key) in tabs" :name="tab.name">
                    <component :is="tab.component"/>
                </el-tab-pane>
            </my-tabs>
        </my-dialog>
    </template>
    <script>
    export default {
        data(){
            return {
                //新增tab，只需要修改此处
                tabs: {
                    style: {
                        label: '样式配置',
                        component: StyleComponent,
                        initData: this.styleInit,
                        validate: this.styleValidate
                    },
                    storage: {
                        label: '存储配置',
                        component: StorageComponent,
                        initData: this.storageInit,
                        validate: this.storageValidate
                    },
                    system: {
                        label: '系统配置',
                        component: SystemComponent,
                        initData: this.systemInit,
                        validate: this.systemValidate
                    }
                }
            }
        },
        methods: {
            //切换页签，新增页签无需变化
            tabChangeHandler(tab) {
                this.tabs[tab].initData();
            },
            //提交表单，新增页签无需变化
            confirmHandler() {
                //遍历tabs调用validate
            }
        }
    }
    </script>
    

可以看出，通过这种改造后，新增一个页签无需修改任何Dom和方法，只要修改data中关于每个页签的配置tabs即可，通过这种方式隔离了页签的变化对整个弹窗处理流程的影响。

通过上面这个示例，可以看出策略模式和模板方法模式有一些相同点，都是把变更缩小在一个很小的局部，减少局部变化对整体的影响，我想这才是这两个设计模式的精髓所在。

适配器模式
-----

首先看下适配器模式的定义

> 适配器模式：通过增加一个适配中间层，将一个类的接口转换成客户端所期望的另一个接口。适配器模式允许不兼容的接口之间进行协同工作，使得客户端能够使用不同接口的对象。

如下图所示，可能有多个服务方，每个服务方的接口各不相同，通过适配器可将其转为符合使用方要求的接口形式。

![10-3适配器示意图.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f76729b22b644acaa13d3052742585e~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=754&h=294&s=31663&e=png&b=fefefe)

还有一种场景是服务方接口发生了变更，但是我们不希望修改现有的代码，这时可以增加一个适配器，通过封装和转换，使得客户端可以无缝地与新接口进行交互。

适配器模式通常包含以下3个角色：

目标接口（Target Interface）：客户端所期望的接口，适配器将现有的接口转换为目标接口。

适配器（Adapter）：适配器是一个具体的函数、类或对象，它实现了目标接口，并将客户端的请求委托给被适配的对象。

被适配者（Adaptee）：被适配者是现有的类或对象，它具有不兼容的接口，适配器将其接口转换为目标接口。

适配器模式的核心思想是通过适配器来解决不兼容的接口问题，将服务方和使用方隔离开来，通过这种方式将服务方的变更局限在适配器，从而减少对使用方的修改。

下面我们通过几个示例加深对适配器模式的理解。

比如后端接口中的所有时间字段都是ISO 8601格式的(例：2023-11-10T10:33:56)，但是在页面展示上，UI设计师要求必须展示成这样"2023/11/10 10:33:56"，为了解决这个问题，你需要在每个用到时间的地方都写一个转换方法，这样工作量就很大了。

换个思路，如果我们在获取到后端数据之后，都统一做一下转换呢，这样在UI渲染时就可以直接使用了。

    function timeAdaptor(data) {
        //将接口中的 创建时间和更新时间 格式化成我们想要的格式
        ['createTime', 'updateTieme'].forEach(key => {
            if (data[key]) {
                const date = new Date(createTime);
                const formattedTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                data[key] = formattedTime;
            }
        })
        return data;
    }
    

这样，我们就可以在获取到后端数据之后，直接调用 timeAdaptor 方法，将时间格式转换成我们想要的格式，如果你们封装了自己的网络请求，可以在每个网络请求结束后自动进行这个转换，以后开发业务代码时再也不用考虑日期格式的转换了。

除了适配接口中时间格式问题，还可以用来转换后端返回的数据中key的格式，比如前端期望数据key为小驼峰形式(如userName)，而后端喜欢使用下划线(user\_name)，那么我们可以在增加一个key值格式适配器即可。

    function responseKeyAdaptor(response){
        //将对象key值由下划线格式转为小驼峰
    }
    

在我的开源库 [vue-office](https://github.com/501351981/vue-office "https://github.com/501351981/vue-office") 中就有个真实的适配器模式应用示例。

事情是这样的，我想实现excel的带样式预览，但是我又不想从头开始完成这个功能，于是就找了一些第三方库。目前没有直接完成这个功能的库，每个库都只完成一部分功能，比如exceljs可以读取excel文件，将文件内容解析成一个对象；x-data-spreadsheet可以通过配置一个对象以excel的样式将数据渲染到浏览器中，但是问题是exceljs输出的数据格式和x-data-spreadsheet输入的数据格式并不相同，于是我就分析二者的数据格式，最终通过实现一个适配器，完成了excel的带样式渲染。

    //输入为 exceljs读取excel产生的对象
    //输出为x-data-spreadsheet所需的对象
    export function transferExcelToSpreadSheet(workbook, options){
        let workbookData = [];
        workbook.eachSheet((sheet) => {
            let sheetData = { name: sheet.name,styles : [], rows: {},cols:{}, merges:[],media:[] };
    
            // 收集合并单元格信息
            let mergeAddressData = [];
            for(let mergeRange in sheet._merges) {
                sheetData.merges.push(sheet._merges[mergeRange].shortRange);
            }
            //其他各种转换: 行列数据、样式等
            
            workbookData.push(sheetData)
        })
        
        return workbookData;
    }
    

从这些示例可以看出，通过适配器模式，将使用方和提供方隔离开，避免二者的变化影响对方，任何一方发生变化，都只会引起适配器代码的变更，把变更操作集中在了有限的适配器中，减低了对整个系统的影响。

装饰器模式
-----

装饰器模式，也有人称为装饰者模式，是我们非常常见的一个设计模式。我们先看下装饰器模式的定义

> 装饰器模式是指允许在**不修改现有对象**的情况下，**动态地**向对象添加额外的行为或功能。装饰器模式通过将对象包装在一个装饰器对象中，从而在运行时动态地添加新的行为或修改现有行为。

装饰器模式核心要求是在不修改现有对象（类、函数、组件等）的情况下，扩展对象的行为或功能，也就是咱们前面说过的扩展原则：对扩展开放，对修改关闭。

我们通过三个场景来加深对装饰器模式的理解。

### 扩展第三方库方法

假设我们现在想要给第三方库lodash的方法加一个日志功能，即在某个方法被调用之前，将调用信息存储到日志中。

由于lodash是个第三方库，我们并不能修改其源码，此时，可以创建一个日志装饰器，通过拦截lodash的方法调用实现这个需求。

    function logDecorator(obj, methodName) {
        const originalMethod = obj[methodName];
    
        obj[methodName] = function (...args) {
            console.log(`${methodName}方法被调用`);
            return originalMethod.apply(this, args);
        };
    }
    
    logDecorator(lodash, 'get');
    lodash.get({a: 5}, 'a') //这里会打印 get方法被调用
    

这种方式在前端开发中经常会用到，比如在我的开源库 [vue-office](https://github.com/501351981/vue-office "https://github.com/501351981/vue-office") 中就多次使用该方法扩展xSpreadSheet的功能。

    //监听excel底部页签的切换事件
    //在切换事件后刷新页面数据
    let swapFunc = xs.bottombar.swapFunc;
    xs.bottombar.swapFunc = function (index) {
        swapFunc.call(xs.bottombar, index);
        //刷新页面数据
    };
    

### 扩展类

上述示例我感觉并不够经典，不能完全反应装饰器模式的定义，因为装饰器模式中要求不能修改现有对象，在上述示例中，虽然没有修改现有对象所属的Class类，但是修改了对象实例的方法。

我们来看一个更经典的示例，和开头提到的计算价格类似，只是更贴近前端开发场景。

假设我们有一个简单的购物车对象，包含一个items数组来存储购物车中的商品，拥有一个计算购物车中物品价格的方法 getTotalPrice。

    class ShoppingCart {
      constructor() {
        this.items = [];
      }
    
      addItem(item) {
        this.items.push(item);
        console.log(`Item added: ${item}`);
      }
    
      getTotalPrice() {
        return this.items.reduce((total, item) => total + item.price, 0);
      }
    }
    

当然了，在购物时计算价格并不是这么简单，比如在有商家打折、优惠券、Vip会员折扣、满减等优惠场景叠加时，价格的计算就会很复杂，如果把所有计算逻辑都放到购物车类中，那么ShoppingCart的实现会非常复杂，这时可以把各种优惠方式做成一个个装饰器，通过嵌套装饰器来完成复杂的逻辑计算。

我们先来实现一个折扣装饰器DiscountDecorator，装饰器的构造参数中包含要装饰的对象，即购物车实例cart。

    class DiscountDecorator {
      constructor(cart, discount) {
        this.cart = cart;
        this.discount = discount; // 折扣
      }
    
      //实现购物车的方法
      addItem(item) {
        this.cart.addItem(item);
      }
      
      getTotalPrice() {
        const totalPrice = this.cart.getTotalPrice();
        const discountedPrice = totalPrice * this.discount;
        return discountedPrice;
      }
    }
    

在折扣装饰器中实现了购物车对象的全部方法，这样就能在任何使用购物车对象的地方，替换成被折扣装饰器装饰后的对象。

现在，我们可以使用装饰器类来装饰原始的购物车对象：

    const cart = new ShoppingCart();
    const discountCart = new DiscountDecorator(cart, 0.9);
    
    discountCart.addItem({ name: 'Product 1', price: 10 });
    discountCart.addItem({ name: 'Product 2', price: 20 });
    
    console.log(discountCart.getTotalPrice()); //（ 10 + 20 ）*0.9 = 27
    

如果还有优惠券功能，我们再实现一个优惠券装饰器 CouponDecorator：

    class CouponDecorator {
      constructor(cart, coupon) {
        this.cart = cart;
        this.coupon = coupon; // 优惠券金额
      }
    
      addItem(item) {
        this.cart.addItem(item);
      }
    
      getTotalPrice() {
        const totalPrice = this.cart.getTotalPrice();
        const totalPriceWithCoupon = totalPrice - this.coupon;
        return totalPriceWithCoupon;
      }
    }
    

现在有两个装饰器了，我们可以根据用户下单实际情况组合多种不同的装饰器。

    const cart = new ShoppingCart();
    const discountCart = new DiscountDecorator(cart, 0.9);
    const couponCart = new CouponDecorator(discountCart, 5);
    
    couponCart.addItem({ name: 'Product 1', price: 10 });
    couponCart.addItem({ name: 'Product 2', price: 20 });
    
    console.log(couponCart.getTotalPrice()); // （10 + 20）* 0.9 - 5 = 22
    
    

可以看到，通过装饰器模式，我们可以动态地给购物车对象添加多个不同的装饰器，每个装饰器都可以添加不同的行为或功能，但是我们没有修改购物车对象的任何代码。通过这种方式，我们可以灵活地扩展和定制对象的功能，实现更复杂的功能组合，如果后续产品提出要根据用户是否会员，给予一定优惠，我们也完全不用修改之前的逻辑，只要增加一个会员装饰器即可，将需求变化引起的变更隔离在有限的代码内。

这里要注意一点，装饰器要实现原有对象的全部方法，确保所有使用被装饰对象的地方，都可以无缝替换为装饰后的对象。

### 扩展组件

装饰器模式这种思想同样适用于组件开发，只不过可能不完全符合装饰器模式定义，需要适当的改造。

以Vue组件开发为例，假设我们想在每个表单的底部添加一个提交按钮，在点击提交按钮之后进行表单验证，并在验证失败时显示错误消息。我们可以使用装饰者模式来实现这个需求。

首先，我们创建一个装饰者组件FormValidatorDecorator.vue，它接受一个原始组件作为插槽，并在原始组件的基础上添加额外的行为：

    <template>
      <div class="form-validator-decorator">
        <slot></slot>
        <button @click="handleSubmit">提交</button>
        <div v-if="showError" class="error-message">{{ errorMessage }}</div>
      </div>
    </template>
    
    <script>
    export default {
      data() {
        return {
          showError: false,
          errorMessage: '',
        };
      },
      methods: {
        handleSubmit() {
          // 进行表单验证
          if (this.validateForm()) {
            // 验证通过，执行原始组件的提交逻辑
            this.$slots.default[0].submitForm();
          } else {
            // 验证失败，显示错误消息
            this.showError = true;
            this.errorMessage = 'Form validation failed';
          }
        },
        validateForm() {
          // 进行表单验证的逻辑，返回验证结果
          return this.$slots.default[0].validate();
        },
      },
    };
    </script>
    

现在，我们可以使用装饰者组件来装饰原始的表单组件：

    <template>
      <form-validator-decorator>
        <Form></Form>
      </form-validator-decorator>
    </template>
    
    <script>
    import Form from './Form.vue';
    import FormValidatorDecorator from './FormValidatorDecorator.vue';
    
    export default {
      components: {
        Form,
        FormValidatorDecorator,
      },
    };
    </script>
    

这样，我们就成功地给表单组件添加了一个额外的行为，即表单验证功能。在用户点击提交按钮时，会先进行表单验证，如果验证通过，则执行原始组件的提交逻辑；如果验证失败，则显示错误消息。

通过装饰者模式，我们可以动态地给Vue组件添加多个不同的装饰器，每个装饰器都可以添加不同的行为或样式，而不会影响原始组件的代码。

类似的场景很多，比如给每个组件的右上角增加全屏操作按钮、给图片增加预览按钮或者给组件增加拖拽缩放功能、展开收起功能等，都可以通过装饰器模式进行开发。

    
    <template>
        <!--全屏装饰器，右上角显示全屏按钮-->
        <full-screen-decorator>
            <!--拖拽缩放缩放装饰器，让组件可以通过拖拽调节宽高-->
            <drag-scale-decorator>
                <!--展开收起装饰器，让组件可以收缩成一个小图标-->
                <collapse-decorator>
                    <component/>
                </collapse-decorator>
            </drag-scale-decorator>
        </full-screen-decorator>
    </template>
    

通过组合多种装饰器，可以为组件增加各种不同的功能，试想下，如果不采用装饰器模式，如何实现这个功能呢，是不是要封装大量的组件，比如支持全屏的A组件、支持全屏和缩放的A组件、支持缩放和展开收起的B组件、支持全屏和缩放的B组件...这样势必会造成组件数量爆炸，而通过装饰器模式，我们只需要实现有限的几个装饰器，然后通过各种组合，就可以产生支持各种不同行为的新组件。

总结
==

前端业务最大的特点就是变化多，而设计模式就是为了应对变化而提出来的一些经典解决范式，所以设计模式很适合前端业务开发。

但前端学习设计模式是比较困难的，因为设计模式最初是为了解决面向对象编程中的问题而提出的，场景很难照搬到前端业务开发。

前端学习设计模式应该关注其核心思想，其中最核心的就是隔离变化，将各种变化引起的代码变更隔离在有限的范围内，减少变化对系统或者流程的影响；针对功能扩展，应该遵循对扩展开发、对修改关闭的原则。