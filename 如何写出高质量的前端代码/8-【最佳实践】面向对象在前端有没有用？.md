对于大部分前端同学来说，提到面向对象，通常会感到既熟悉又陌生，熟悉是因为经常听到面向对象的概念，也知道怎么用JS来实现一个类；陌生是因为几乎很少在业务开发中通过面向对象思想来解决实际问题，甚至一些工作了3-5年的前端同学，还没有真正写过一个类（Class）。其实，并不是因为技术问题不会写，而是没有意识到什么时候应该写，不知道面向对象在前端有什么应用。

今天我们一起来探讨下面向对象在前端的应用场景，以及如何使用面向对象的思想来解决前端开发中的问题，希望能够带给大家一些启发。

> 同样的，本节不会教大家怎么用JS实现类、继承等技术问题，更多的是提升大家使用面向对象解决问题的意识。

一切皆对象
=====

在前端开发中，大到我们的页面、组件，小到一个字符串、数组，几乎一切皆对象。

我们可以随便打印一个div元素，看看我们经常听到的DOM文档对象模型到底都有哪些类。

    console.dir(document.querySelector('div'));
    

可以看到一个div元素就是HTMLDivElement类的一个实例，HTMLDivElement继承自HTMLElement，HTMLElement又继承自Element，完整继承路线图如下，可以说DOM文档对象模型就是面向对象一种实现。

![div继承图.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbebaa7e0eea4f119a552c1e3ede8e14~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1065&h=94&s=17174&e=png&b=fefefe)

在JS中对字符串、数组的操作非常方便，因为它们都可以看做是一个对象，作为对象就会有属性和方法，就能直接获取或调用，不需要借助其他内置或第三方函数。

    'aabb'.length;
    'aabb'.toUpperCase();
    //虽然字面量字符串不是严格的Object类型，但是可以认为它是一个对象，因为它有属性和方法
    [1,2,3].length;
    [1,2,3].forEach(item => console.log(item));
    
    

我们已经对JS习以为常了，觉得这没有什么，然而在其他语言中进行上述操作并没有那么简单，用PHP实现的上述示例如下：

    // 获取字符串长度
    $str = "Hello, World!";
    $length = strlen($str); 
    
    // 将字符串改为大写
    $uppercaseStr = strtoupper($str);
    
    // 获取数组长度
    $fruits = array("apple", "banana", "orange", "kiwi");
    $length = count($fruits);
    
    // 遍历数组
    foreach ($fruits as $fruit) {
        echo $fruit . "<br>";
    }
    

除了JS语言本身的语法，绝大部分常见的第三方库，也都是通过面向对象的思想来实现的，比如jQuery、Vue、VueRouter、Vuex、React、eCharts、axios等等，只不过有一些库通过工厂模式将new的过程给封装起来了。

    //Vue源码，Vue的构造函数
    function Vue(options) {
      if (__DEV__ && !(this instanceof Vue)) {
        warn('Vue is a constructor and should be called with the `new` keyword')
      }
      this._init(options)
    }
    
    //axios源码
    class Axios {
        constructor(instanceConfig) {
            this.defaults = instanceConfig;
            this.interceptors = {
                request: new InterceptorManager(),
                response: new InterceptorManager()
            };
        }
        async request(configOrUrl, config) {
            //...
        }
    }
    

为什么这么多开源作者都在使用面向对象的思想去封装库呢？这肯定是有原因的，面向对象在组织大型项目时，可以很好的解决代码的复用、扩展和隔离问题，可以说不会面向对象解决问题，就很难说是一个优秀的程序员。

面向对象编程核心概念
==========

> 面向对象编程（Object-Oriented Programming，简称OOP）是一种程序设计范式，它将程序中的数据和操作数据的方法组织成对象，通过对象之间的交互来实现程序的功能。

提到面向对象编程，就绕不开这几个核心概念。

类（Class）：类是面向对象编程的基本概念，用于描述具有相似属性和行为的对象的模板。类定义了对象的属性（成员变量）和行为（方法），是创建对象的蓝图。

对象（Object）：对象是类的实例，是具体的数据实体。每个对象都有自己的状态（属性值）和行为（方法），可以通过类的构造函数来创建对象。

面向对象编程有四个基本特征：

1.  抽象：

抽象是对现实世界或问题领域的概念进行简化和概括，从而创建出更通用、更易于理解和使用的程序结构。通过抽象，将具有相同数据和行为的一组实体抽象为类；将这些实体的操作行为抽象为方法；将实体的数据抽象为属性；并将这些实体和外部打交道的属性、方法抽象为接口，从而隐藏内部的实现细节。

通过抽象，可以将对象的复杂性隐藏起来，简化对象的使用和理解。

2.  封装：

封装是将数据和操作封装在对象中，隐藏对象的内部实现细节，只暴露必要的接口供外部访问。通过封装，可以保护对象的数据不受外部直接访问和修改。

这和我们前面提到的组件的概念是相似的，组件对外提供接口（props、events和methods），要和组件进行交互就只能通过组件提供的接口进行，而不能擅自去访问、修改组件内部的实现。

封装后的对象，可以看做一个黑盒，通过这种方式简化了对象的使用方式，降低了不同对象之间的耦合，代码也更加容易维护。

比如我们对缓存Cache进行抽象和封装，缓存Cache一般包含属性：size，方法：get、set、has、clear，简单的实现如下。

    class Cache {
        constructor() {
            this._data = new Map();
        }
        get size() {
            return this._data.size;
        }
        add(key, value) {
            this._data.set(key, value);
        }
        get(key) {
            return this._data.get(key);
        }
        has(key) {
            return this._data.has(key);
        }
        clear() {
            this._data.clear();
        }
    }
    
    let cache = new Cache();
    cache.add('a', 1);
    cache.add('b', 2);
    console.log(cache.get('a')); // 1
    console.log(cache.size); // 2
    cache.clear();
    console.log(cache.size); // 0
    cache._data.set('c', 3); //错误，不能直接操作对象的私有属性，破坏了封装
    

我们不应该直接操作该类的私有属性 \_data，只能通过它对外提供的接口进行交互，否则就破坏了对象的封装特性，在其他语言中可能会有private修饰符，来将私有变量设为不可访问，不过js目前还没有提供这种特性，需要自行实现，如利用Symbol来实现类的私有变量，将\_data设为一个Symbol变量，而不再是一个普通的字符串，这样在实例化后，就无法访问到cache.\_data了。

    //利用Symbol实现私有变量
    const _data = Symbol('privateData')
    //只把Cache类导出去，_data变量不导出，外部无法访问到_data
    export class Cache {
        constructor() {
            this[_data] = new Map();
        }
        get size() {
            return this[_data].size;
        }
        add(key, value) {
            this[_data].set(key, value);
        }
        //...
    }
    

3.  继承：

继承允许一个类（子类）继承另一个类（父类）的属性和方法。子类可以重用父类的代码，并可以在其基础上进行扩展和修改。

本质上继承是一种复用策略，不过目前普通认为继承会引起深度耦合，大都推荐通过多个对象的组合来替代继承。

比如我们想要增加localStorage和sessionStorage类型的缓存，则可以继承Cache类，继承后会自动拥有父类的属性和方法，通过这种方式起到了逻辑复用的功能。

    class LocalStorageCache extends Cache {
        constructor() {
            super();
        }
    }
    
    class SessionStorageCache extends Cache {
        constructor() {
            super();
        }
    }
    
    let localCache = new LocalStorageCache();
    localCache.add('a', 1);
    console.log(localCache.get('a'));
    
    

4.  多态：

多态是指同一个方法可以根据对象的不同类型表现出不同的行为。通过多态，可以提高代码的灵活性和可扩展性。简单点说就是在面向对象编程中，子类可以重写父类的方法，即在子类中定义与父类同名的方法。当调用父类和子类的同名方法时，可以表现出不同的行为，通过这种方式实现对父类的扩展。

仍然以上面的缓存类为例，LocalStorageCache 和 SessionStorageCache 可以修改父类add等方法的实现，通过这种方式对父类进行扩展。

    class Cache {
        add(key, value) {
            this._data.set(key, value);
        }
    }
    
    class LocalStorageCache extends Cache {
        constructor() {
            super();
        }
        add(key, value) {
            //修改父类的实现
            localStorage.setItem(key, value);
        }
    }
    
    class SessionStorageCache extends Cache {
        constructor() {
            super();
        }
        add(key, value) {
           //修改父类的实现
            sessionStorage.setItem(key, value);
        }
    }
    

不难看出，抽象和封装是紧密关联的，先进行抽象，继而通过封装实现；继承和多态是紧密关联的，没有继承也就不存在多态了，而目前一般不再推荐继承。所以我们可以将面向对象编程的重心放在**如何抽象和封装**上，但也没必要全面否定继承。

面向对象和其他编程范式的对比
==============

编程范式是一种编程思想或方法论，用于指导程序员在解决问题时的思考方式和代码组织方式。它们定义了程序的结构、数据的处理方式以及解决问题的方法。

编程范式可以看作是一种编程的哲学或理念，它们提供了一套共同的原则和规则，帮助程序员更有效地解决问题和开发软件。

不同的编程范式强调不同的概念和技术，例如面向过程编程强调过程和函数的顺序执行，面向对象编程强调对象的封装和继承，函数式编程强调函数的纯粹性和不可变性等。

除了面向对象，在前端开发中，另外三种常见的编程范式包括：

*   命令式编程：它通过一系列的命令或语句来描述程序的执行步骤。在命令式编程中，程序员需要明确地指定程序的每个细节，包括数据的存储、计算的顺序以及控制流程。
    
*   面向过程编程：以过程或函数为基本单位，通过顺序执行一系列操作来解决问题。
    
*   函数式编程：将计算视为函数的求值过程，函数被视为一等公民，函数可以作为参数传递给其他函数，也可以作为返回值返回；强调函数的纯粹性和不可变性，避免副作用。
    

我们以前端开发中的菜单高亮为例，看看不同编程范式是如何解决业务问题的。需求是根据当前用户访问的路由Path，找出应该高亮的菜单项。

命令式编程
-----

首先，我们通过命令式编程来实现这个需求：

        let menu = [
                {
                    label: '用户管理',
                    index: 'user'
                },
                {
                    label: '订单管理',
                    index: 'order'
                },
                {
                    label: '统计分析',
                    index: 'statistic'
                }
            ];
        let activeMenu = null;
        
        let currentPath = 'user';
        for(let i = 0; i < menu.length; i++){
            if(menu[i].index === currentPath){
                activeMenu = menu[i];
                break;
            }
        }
        console.log(activeMenu)
    

可以看到，命令式编程自顶而下顺序执行代码，其中包含变量的声明，变量的赋值，for循环和break、if条件判断等。

命令式编程的优点是直观和易于理解。由于程序的执行顺序是明确的，程序员可以清楚地知道每个语句的执行顺序和效果。这使得调试和修改程序变得相对容易。

但是命令式编程的代码通常比较冗长，需要大量的语句来描述程序的执行步骤，就像上面这个示例，由于没有把计算过程抽象出来，在其他页面遇到相同场景时，会有大量重复代码。

面向过程编程
------

接下来通过面向过程编程来实现：

        function getActiveMenu(menu, currentPath) {
            let activeMenu = null;
        
            for (let i = 0; i < menu.length; i++) {
                if (menu[i].index === currentPath) {
                    activeMenu = menu[i];
                    break;
                }
            }
            return activeMenu
        }
    
        let menu = [
            {
                label: '用户管理',
                index: 'user'
            },
            {
                label: '订单管理',
                index: 'order'
            },
            {
                label: '统计分析',
                index: 'statistic'
            }
        ];
        
        console.log(getActiveMenu(menu, 'user'));
    

在这个示例中，我们封装了一个getActiveMenu函数，该函数入参为menu和当前路由path，返回高亮的菜单项，可以看出，相比命令式编程，面向过程编程将一组操作步骤封装成一个过程，使得这些操作可以被多次调用，提高了代码的可重用性。

面向过程编程将数据和过程分离，过程只关注如何处理数据，而不关心数据的具体内容，就像上述实现，函数getActiveMenu和要处理的数据menu是分开的，二者是独立存在的。

函数式编程
-----

我们再来看看函数式编程如何实现这个需求：

        let menu = [
            {
                label: '用户管理',
                index: 'user'
            },
            {
                label: '订单管理',
                index: 'order'
            },
            {
                label: '统计分析',
                index: 'statistic'
            }
        ];
        
        console.log(menu.find(item => item.index === 'user'));
    

在函数式编程中，函数可以被当做参数传递，通过给数组的find方法传入一个函数，可以找出符合条件的元素，看起来并不太复杂；但是如果多个页面都有这个功能，则需要分别在每个页面实现一次筛选逻辑。

面向对象编程
------

最后是压轴的面向对象编程，对于很多前端同学来说，面向对象编程实现并不直观，因为它需要一个抽象的过程。

在上面的几个实现中，我们会发现这里的需求涉及两个内容：菜单（数据）、找出高亮菜单（方法），有数据和方法，我们就可以抽象出类，这里我们用Menu类来封装菜单数据和找出高亮菜单的方法。

        class Menu {
            menuList = []
            constructor(menuList) {
                this.menuList = menuList;
            }
            getActiveMenu(currentPath){
                return this.menuList.find(item => item.index === currentPath);
            }
        }
        
        let menu = [
            {
                label: '用户管理',
                index: 'user'
            },
            {
                label: '订单管理',
                index: 'order'
            },
            {
                label: '统计分析',
                index: 'statistic'
            }
        ];
    
    
        let menuInstance = new Menu(menu);
        console.log(menuInstance.getActiveMenu('user'));
    

在这个示例中，看起来面向对象的代码较前面几个编程范式是变多了，但代码多少并不是关键，关键是我们使用与维护是否简单。

可以看到，通过面向对象封装后，获取高亮菜单的代码变得非常简单，只需要实例化Menu类，调用getActiveMenu方法即可，不需要关心具体的查询过程。

后续菜单又有了新的需求，找出某个菜单的子菜单，我们只需要Menu中封装一个getSubMenus方法即可。

        class Menu {
            menuList = []
            constructor(menuList) {
                this.menuList = menuList;
            }
            getActiveMenu(currentPath){
                return this.menuList.find(item => item.index === currentPath);
            }
            //新增需求
            getSubMenus(parentIndex){
                let activeMenu = this.getActiveMenu(parentIndex);
                return activeMenu && activeMenu.children || [];
            }
        }
    

通过Menu类，我们将菜单相关的操作组织在一起，后期的维护也比较方便。

面向对象编程优势
========

有数据有方法
------

在使用其他编程范式时，我们通常会将数据和操作分开，这会导致在使用时没有那么方便。

以前端开发中用户相关操作为例，在前端系统中，我们通常会把当前登录的用户信息存储到共享数据中，如Vuex、Redux等状态管理库中，有时我们需要根据用户信息进行权限相关判断，比如当前用户是不是超级管理员，有没有对某个资源的增删改查权限。

    let userInfo = this.$store.state.userInfo;
    
    // userInfo内容示例：
    // userInfo = {
    //     name: 'admin',
    //     permssions: [
    //         {
    //             resource: 'user',
    //             action: ['add', 'delete']
    //         },
    //         {
    //             resource: 'order',
    //             action: ['get']
    //         }
    //     ]
    // }
    
    //判断是不是超级管理员
    if(userInfo.name === 'admin'){
        
    }
    
    //获取用户权限
    let permissions = userInfo.permssions || [];
    //提前封装的角色判断方法hasPermission
    if(hasPermission(permissions, 'user', 'add')){
        
    }
    

可以看出，在使用时需要编写一些额外的代码或者借助一些utils方法，才能完成权限判断。本质上就是因为我们只是存下了用户的数据信息，但是缺少对这些数据的操作方法，换个思路，假如我们存储在共享数据中的不是简单的字面量对象，而是一个User类的实例呢？

    let user = this.$store.state.user;
    //判断是不是超级管理员
    if(user.isSuperAdmin()){
        
    }
    
    //判断用户权限
    if(user.hasPermission('user', 'add')){
        
    }
    

这样是不是比之前简单很多，现在共享的user对象，已经不再只有用户信息了，还具备了用户相关的操作方法，User类实现如下：

    class User {
        constructor(userInfo){
            this.userInfo = userInfo;
        }
        isSuperAdmin(){
            return this.userInfo.name === 'admin';
        }
        hasPermission(resource, action){
            let permissions = this.userInfo.permssions || [];
            return permissions.find(item => item.resource === resource && item.action.includes(action));
        }
    }
    
    //存储到Vuex中的是User实例
    this.$store.commit('setUser', new User(userInfo));
    

可以看到，上面的实现其实并不复杂，只是有时候想不到原来在前端还可以使用面向对象编程。

如果你发现**有数据以及对数据的操作**，就可以考虑是不是可以封装成一个类。

复用性更强
-----

前面我们说过，面向对象编程的核心特征之一就是抽象，在组件开发中我们提过一次，越是抽象的东西，复用性越强，越是具体的东西，复用性越弱。

以url的处理为例（假装我们不知道window.URL类），在前端开发中，你可能会遇到很多url的处理场景，比如判断url中是否包含某个参数，获取url中的某个参数值，拼接一组参数到url中，获取url中hash值等等，如果不进行抽象，大概率你会封装一堆处理方法。

    //url.js
    //封装url的处理方法
    
    function hasParam(url, param){
        //判断url中是否包含某个参数
    }
    
    function getParam(url, param){
        //获取url中的某个参数值
    }
    
    function removeParam(url, param){
        //移除url中的某个参数
    }
    
    function appendParams(url, params){
        //拼接一组参数到url中
    }
    
    function getHash(url){
        //获取url中的hash值
    }
    
    //....
    

尽管你可能已经封装了很多url处理方法，但是你很难说以后遇到url相关的问题，就一定可以复用这些方法，你并不能确定是否覆盖了所有的场景，比如我现在想把url的网络协议protocol由https改成http，你就不得不再封装一个protocol的替换方法。

究其原因，我们封装的这些方法都是为了解决某个具体问题，往往是提出一个问题，我们给出一个解决方法，而不是对url相关问题进行抽象，分析出url所应包含的属性和方法。

目前的浏览器中大都内置了URL类和URLSearchParams类，即使没有内置，相信大部分同学都有能力自行实现一个，通过这种封装，几乎可以应对所有URL的操作，大大提升了复用性。

    let url = new URL('https://www.baidu.com?a=1&b=2#hash');
    
    //判断url中是否包含某个参数
    url.searchParams.has('a'); // true
    
    //获取url中的某个参数值
    url.searchParams.get('a'); // '1'
    
    //移除url中的某个参数
    url.searchParams.delete('a');
    url.toString(); // 'https://www.baidu.com?b=2#hash'
    
    //拼接一组参数到url中
    url.searchParams.append('c', 3);
    url.toString(); // 'https://www.baidu.com?b=2&c=3#hash'
    
    //替换https为http
    url.protocol = 'http';
    url.toString(); // 'http://www.baidu.com?b=2&c=3#hash'
    

> 留个作业，在前端处理cookie时，你是否也封装过utils方法？能不能通过封装一个Cookie类来解决你的需求？Cookie类会有哪些属性和方法？

有上下文
----

通过面向对象这种方式，一旦实例创建完成，后续在调用方法传参时，就不必每次都携带一些上下文信息了，这让调用变的异常简单。

比如我们现在封装了一些canvas画图方法，其中有个画圆的方法drawCircle，参数有canvas上下文、圆心所在位置x、y和半径radius。

    function drawCircle(ctx, x, y, radius){
        //画圆
    }
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    let x = 50;
    let y = 50;
    let radius = 20;
    drawCircle(ctx, x, y, radius); //在(50, 50)位置画一个半径为20的圆
    

在初次画圆之后，我们还想把图形向右移动10像素，对于上面这种面向过程的代码，我们只能先修改x的值，然后继续调用drawCircle。

    function drawCircle(ctx, x, y, radius){
        //画圆
    }
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    let x = 50;
    let y = 50;
    let radius = 20;
    drawCircle(ctx, x, y, radius); //在(50, 50)位置画一个半径为20的圆
    x += 10; //移动10像素
    drawCircle(ctx, x, y, radius); //在(60, 50)位置画一个半径为20的圆
    

每次调用drawCircle时，我们都要手动传入ctx、x、y和radius，即使ctx、y和radius并没有变化，但是也必须作为参数重新传递过去，因为在面向过程中没有上下文。

假如我们封装一个Circle类，在实例化时传入ctx和x、y和radius，后续调用方法时，只需要传递变化的参数即可。

    class Circle {
        constructor(ctx, x, y, radius) {
            this.ctx = ctx;
            this.x = x;
            this.y = y;
            this.radius = radius;
        }
        
        draw(){
            //画圆
        }
        movex(offset){
            this.x += offset;
        }
        movey(offset){
            this.y += offset;
        }
    }
    
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    
    //对比这里的调用和面向过程的调用
    let circle = new Circle(ctx, 50, 50, 20);
    circle.draw(); //在(50, 50)位置画一个半径为20的圆
    circle.movex(10); //移动10像素
    circle.draw();   //在(60, 50)位置画一个半径为20的圆
    

可以看出，通过面向对象封装后，调用方式极其简单。

解决复杂问题
------

面向对象编程更强大的地方在于，它在处理大型问题时更为高效和灵活。面向对象的设计将问题分解成多个特定功能的小模块，模块和模块之间仅通过接口交互，这种模块化方法使得代码更加清晰、易于理解，同时也便于维护和扩展。而且可以多人并行开发不同的模块，只要事先定义好每个模块的功能和接口即可。

这就像组装一台电脑，通过面向过程方式组装电脑时，你是面对一个一个的小零件，一个电阻、电容、芯片、螺丝钉等细节，而通过面向对象方式组装时，你是面对一些大的模块，主板、内存条、硬盘、显卡、电源、机箱、显示器等，每个模块之间有互相链接的插槽（接口），可以很轻松地构建一个完整的电脑。

这有点像我们平时熟悉的组件化开发，只是一般面对UI渲染类的任务时我们需要将其拆分为多个组件，而面对一些非UI渲染（纯逻辑）任务时，我们可以考虑将其拆分为不同的类，最后再通过面向过程把这些类进行组装。

后面我们通过一个简化版的低代码项目来展示下，具体是怎么通过面向对象解决大型问题的。

实战-简单的低代码项目
===========

需求梳理
----

先说下我们的需求，我们想实现一套简单的低代码大屏编辑器，篇幅有限，我们只实现最核心最简单的几个模块：

*   物料区：展示提前预制的图形元素，比如圆形、矩形、三角形、多边形等，可以拖动某个图形将其放到画布上
*   画布区：使用canvas进行图形绘制，支持选中画布中的图形并进行移动，支持键盘删除图形
*   属性配置区：展示选中的图形对象的属性，并可以修改这些属性，修改后画布区会同步更新效果
*   支持保存画布数据；支持根据保存的数据重绘画布

![low-code.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfe5374552c3452a871249de01d62079~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=1425&h=725&s=298829&e=gif&f=100&b=f7f7f7) 直观的感受是，应该有个json格式的画布数据（graphData）用来存储画布上的图形信息，拖拽图形到画布上时往这个graphData中添加数据，在画布上删除图形时就删除graphData中对应的图形，编辑某个图形的属性时同样地修改这个graphData，每当graphData中的数据变化时，就根据graphData最新数据重绘整个画布。保存图形时将这个graphData提交给后端存储，下次打开页面又可以根据graphData重新绘制画布。

大致感觉graphData数据结构应该是如下格式：

    //画布数据格式
    const graphData = {
        width: 300, //画布宽度
        height: 300, //画布高度
        backgroundColor: '#fff', //画布背景色
        nodes: [
            {
                id: 'node1', //节点唯一标识
                type: 'circle', //节点类型，比如圆形、矩形等
                attributes:{
                    x: 10, //节点左上角所在位置的x坐标
                    y: 10, //节点左上角所在位置的y坐标
                    radius: 20, //圆形半径
                }
            },
            {
                id: 'node2',
                type: 'rect',
                attributes: {
                    x: 50,
                    y: 50,
                    width: 20,
                    height: 20,
                    fill: '#000',
                }
            },
            {
                id: 'node3',
                type: 'triangle',
                attributes: {
                    points:[   //多边形保存每个顶点的坐标
                        [10, 5],
                        [50, 10],
                        [10, 20]
                    ]
                }
            }
        ]
    }
    

这样思考感觉也是可以实现的，心里有了大概的思路，但是怎么组织代码结构有点困惑，我们首先看看最复杂的画布区域涉及哪些交互：

*   修改数据：
    *   如何对画布数据graphData进行频繁的变更，包括新增、删除、修改其中的node节点
*   画布Dom创建及事件监听：
    *   canvas Dom的创建
    *   canvas上事件的监听，比如鼠标的点击、拖动事件，键盘的delete按键等事件，需要响应不同的事件
*   节点绘制：
    *   不同类型的图形怎么绘制呢？以后扩展的图形类型怎么绘制？谁负责绘制图形？
    *   怎么判断哪个图形被选中了？
    *   选中的图形外面的选择框怎么绘制？
    *   当拖动一个图形时怎么修改它的位置？编辑属性怎么修改它的属性值？
*   选择：
    *   怎么查看当前选中的节点？
    *   怎么取消选中的节点？

上面提到的这些操作，如果没有合理的封装，代码结构很容易混乱，特别是如果我们后续在其他项目中也想实现类似功能，你怎么更好地复用本次的代码呢？还要思考后续如果想支持其他图形怎么扩展呢？

面向对象抽象
------

通过面向对象方式，我们可以很轻松地解决上面的问题，根据上面的分析，大致可以抽象出这样几个类：

### 图形节点 Node类

从上面需求看，我们这里有几种不同的图形：圆形、矩形、三角形和多边形，我们先看看这些图形有哪些共性和不同点，然后再思考怎么进行抽象。

要在canvas上绘制这几个图形，需要知道这样一些必要的属性，圆形需要知道它的圆心和半径；矩形需要知道它的左上角所在位置、宽高；三角形需要知道三个顶点坐标；其他多边形和三角形类似需要知道各个顶点的坐标；同时它们都有背景色和边框颜色、边框宽度等共同属性。

不同的图形类型在画布上绘制时调用的方法不太一样，比如在canvas上画一个圆和矩形所需的处理方式就不相同，所以应该让每个图形节点各自负责各自的图形绘制，只有它自己最清楚怎么绘制自己。期望它们都能提供一个固定的绘制方法名称，比如圆形和矩形都提供一个draw方法，圆形节点就根据自己的圆心和半径在画布上绘制圆形，矩形节点就根据起始位置和宽高绘制矩形。

在点击画布时，需要判断哪个图形被选中了，也就是判断点击的鼠标位置是不是在图形内部，这个不同类型的图形判断方式也是不一样的，对于一个圆形，可以根据鼠标点击位置距离圆形的距离是不是小于等于半径来判断，而对于一个矩形，则需要判断点击坐标(x，y)是否在四个顶点围成的区域内，和绘制图形一样，只有具体的图形节点才知道如何判断一个点是否在其图形内，所以需要每个节点都能提供一个判断一个点是否在其内部的方法，那么就可以很方便地实现这个功能。

每个图形在选中时，需要绘制一个高亮的外围边框，同上，这个外围边框位置、宽高计算和怎么绘制，都放在节点中实现。

选中的图形可以拖拽移动，所以图形节点还应该提供一个移动的方法。

画布上的图形都应该支持获取和编辑属性，所以节点还应该提供修改属性值的方法，比如圆形节点的半径可以修改，矩形节点的宽高也可以修改。

通过上面分析，我们可以抽象出如下几个类：

由于不同图形节点有共性，所以可以抽象出一个**图形节点基类Node**，基类抽取所有图形共有的属性和方法：

*   共有属性包括：
    
    *   id
    *   节点类型：圆形、矩形、三角形还是多边形
    *   属性attributes：对象格式，具体属性中包含哪些，每个图形不太一样
    *   画布上下文：要在画布上绘制，所以要拿到画布上下文
*   共有方法包括：
    
    *   判断某个点是否在图形内部的方法containsPoint
    *   获取/编辑属性(getAttributes、getAttribute、setAttributes、setAttribute)、
    *   绘制方法draw
    *   获取节点的外围边界getBoundingBox
    *   绘制高亮的外围边界drawBoundingBox
    *   移动方法move

    class Node {
        constructor({graphView, dataModel, id, attributes={}}) {
            this.graphView = graphView;  //画布
            this.id = id;
            this.type = 'node';   //每个节点重写自己的类型
            this.attributes = attributes;
        }
        getAttributes(){
            //获取节点所有属性
        }
        getAttribute(key){
            //获取单个属性
        }
        setAttributes(attributes){
            //设置节点所有属性
        }
        setAttribute(key, value){
            //设置单个属性
        }
        containsPoint(pointX, pointY){
            //判断一个点是否在图形内部，由具体的子类实现
        }
        draw(){
            //绘制图形，具体怎么绘制，由具体的子类实现
        }
        getBoundingBox(){
            //获取图形包围盒，由具体的子类实现
        }
        drawBoundingBox(){
            //绘制图形外围高亮边框，可统一实现，外围盒子都是矩形
        }
    }
    

不同图形节点分别抽象出不同的Node子类

*   圆形节点：CircleNode
*   矩形节点：RectNode
*   多边形节点：PolyNode，三角形和其他多边形都通过此类实现

每个子类通过多态方式，重写containsPoint（判断点是否在形状内）、draw（绘制）、getBoundingBox（获取外部矩形边框的左上角位置和宽高）、move（移动）方法。

    class CircleNode extends Node {
        constructor(graphView, id, {x, y, radius}) {
            super(graphView, id, {x, y, radius});
            this.type = 'circle';
        }
        containsPoint(pointX, pointY){
            //判断一个点是否在圆形内部，可以根据圆心和(pointX, pointY)的距离判断
            //实现待定
        }
        draw(){
            //绘制图形，实现待定
        }
        getBoundingBox(){
            //获取圆形的外部矩形边框，实现待定
        }
        move(dx, dy){
            //移动圆形，实现待定
        }
    }
    

### 画布类 GraphView

针对canvas画布我们也有一些操作，包括：

*   创建canvas的DOM
*   绘制编辑器的背景
*   监听canvas上的鼠标事件，比如点击、拖动等
*   监听键盘事件，比如支持delete或backspace删除选中的节点

我们可以把canvas的操作抽象出来，封装成一个画布模型GraphView，它负责canvas所有DOM和事件相关的操作。接下来，我们分析下画布模型GraphView应该有哪些属性和方法。

为了绘制一个画布，我们肯定需要知道画布的宽(width)、高(height)、背景色(backgroundColor)以及缩放比例(scale，通常编辑器都支持缩放画布)，后续绘制图形，需要知道canvas的2d上下文(ctx)，而事件监听，需要知道画布的DOM(canvas)。

在构造画布模型时，就应该在页面上创建出来canvas的DOM，同时绑定好鼠标和键盘事件，所以应该有一个init方法，在构造方法中调用。

当画布模型监听到了鼠标按下事件，需要做哪些操作并不应该由画布模型自己决定，而是应该由外部来决定，可以通过提供addEventListener、removeEventListener来实现，这样避免画布模型和其他模型产生深度耦合。

    class GraphView {
        constructor(dom, options = {}){
            this.dom = dom;
            this.canvas = null; //保存canvas的DOM
            this.ctx = null; //保存canvas上下文
            this.width = options.width;
            this.height = options.height;
            this.backgroundColor = options.backgroundColor;
            this.scale = window.devicePixelRatio; //缩放比例，为了在mac上效果更清晰
            this.observer = {}; //存储不同事件的观察者
            this.init();
        }
        init(){
            //创建canvas的DOM
            //绘制编辑器的背景
            //监听鼠标事件
            //监听键盘事件
        }
        getCtx(){
            //返回canvas上下文，供外部绘制图形
            return this.ctx;
        }
        getScale(){
            return this.scale;
        }
        addEventListener(type, callback){
            //供外部添加不同事件的回调方法，GraphView不关心事件交给谁处理
        }
        removeEventListener(type, callback){
            //供外部移除不同事件的回调方法
        }
        draw(){
            //绘制背景
        }
    }
    

### 数据模型类 DataModel

在前面我们提到，经常会发生对数据的操作，比如新增一个节点、删除一个节点、查找被点击的图形节点、解析画布的json数据、导出画布的json数据等，我们可以把所有数据相关的操作抽象成为一个数据模型DataModel，它负责管理画布中的数据。

就像现在前端大都采用数据驱动渲染一样，我们不应该直接去操作画布绘图，而是应该通过操作数据模型来修改画布内容，由数据模型决定如何去重绘画布。 数据模型应该是整个项目的核心，它负责调度各个模块。

数据模型应该有个节点列表nodes用来存放当前画布上的所有节点，同时它应该提供一些方法来操作节点列表，包括新增一个节点addNode、删除一个节点removeNode、查找被点击的图形节点getClickedNode、根据id查询节点等；它还应该提供查询整个画布JSON格式数据的方法getJson；在初始化时能够将JSON格式的节点数据变成我们前面抽象的图形节点。

    class DataModel {
        constructor(options = {}){
            this.nodes = [];
            this.initNodes(options.nodes)
        }
        initNodes(nodes){
            //将图形节点的json格式的数据，变成我们前面抽象的CircleNode、RectNode、PolyNode等节点
        }
        addNode(node){
            //添加node
        }
        deleteNode(node){
            //删除node
        }
        getNodeById(id){
            //根据id查询node
        }
        getClickedNode(point){
            //根据点击坐标，查找被点击的图形节点
            //遍历所有的节点，调用节点的containsPoint方法判断是否在图形内部
            //返回被点击的节点
        }
        getJson(){
            //获取json数据
        }
    }
    

这里我们还需要思考数据变化后怎么通知画布刷新，假如我们每次对dataModel进行修改都立即通知画布刷新，那么就会导致性能浪费，比如我们连续进行了如下操作：

    dataModel.addNode(CircleNode);  
    dataModel.deleteNode(CircleNode);
    dataModel.addNode(RectNode);
    dataModel.deleteNode(RectNode);
    dataModel.addNode(PolyNode);
    dataModel.deleteNode(PolyNode);
    //画布重绘几次？
    

如果每次操作都重绘画布，需要连续绘制6次，这显然很浪费性能。我们可以换个思路，在每次修改时只是标记下需要重绘，比如增加一个标志量dirty并将其设为true，但是并不立即执行，可以等浏览器空闲时，看看dirty是否为true，为true则重绘画布并将dirty设为false。

    class DataModel {
        constructor(options = {}){
            //忽略其他代码
            this.dirty = true; //通过增加标志量，看看是否需要重绘画布
            requestIdleCallback(this.checkDirty); //浏览器空闲时检查是否应该重绘画布
        }
        checkDirty(){
            if(this.dirty){
                this.render();
                this.dirty = false;
            }
            requestIdleCallback(this.checkDirty); //持续监听
        }
        render(){
            //通知画布模型重绘背景
            //遍历所有节点，调用节点的draw方法绘制
            //遍历所有选中的节点，绘制高亮边框
        }
        //忽略其他代码
    }
    

### 选择器模型类 Selector

我们还需要抽象一个选择器模型，负责管理画布上的选中节点，包括：

*   添加选中的节点
*   查询选中的节点
*   清空当前选中节点
*   选择事件变化后要能够通知外部监听者

同样地，要支持外部监听选中节点的变化，将选择器模型和其他业务模块解耦。

选择器模型很简单，需要维护一个选中的节点列表selectedNodes和监听选中变化事件的回调函数列表oberserver，同时提供对selectedNodes的操作，包括添加选中节点add、移除选中节点remove、清空选中节点clear、获取选中的节点getSelectedNodes等。

    class Selector {
        constructor(){
            this.selectedNodes = [];
            this.oberserver = []; //存储选择事件变化的监听者
        }
        add(node){
           //添加选中节点
        }
        remove(node){
            //移除选中节点
        }
        clear(){
            //清空选中节点
        }
        getSelectedNodes(){
            //获取选中的节点
        }
        addSelectChangeListener(callback){
            //添加选择事件监听者
        }
        removeSelectChangeListener(callback){
            //移除选择事件监听者
        }
    }
    

创建编辑器
-----

通过面向对象抽象，我们封装了上面几个类：

*   GraphView：负责画布的绘制、事件监听等
*   DataModel：负责画布上的节点数据管理
*   Selector：负责画布上的选中节点管理
*   Node: 图形节点
    *   CircleNode：圆形节点
    *   RectNode：矩形节点
    *   PolyNode：多边形节点

每个类都有清晰的职责，每个类的实现代码也非常的简单，但是在实现编辑器的时候，怎么让这个几个类互相配合呢？比如graphView监听到了鼠标按下事件，需要通过dataModel找到当前被点中的图形节点，然后加入选择器模型；graphView监听到了用户在拖动鼠标，那么就需要将当前选中的图形节点跟着移动；graphView监听到了delete按钮，dataModel需要删除选中的节点，同时selector也需要删除这个节点。

只有实现了这些交互，才是一个真正的编辑器，否则只是几个独立的类，并没有意义，我们可以通过封装一个createEditor方法，来调度这几个类的交互。简化版本代码如下：

    import GraphView from "@/editor/GraphView";
    import DataModel from "@/editor/DataModel";
    import Selector from "@/editor/Selector";
    
    export function createEditor(dom, graphData = {}) {
      if (typeof dom === 'string') {
        dom = document.querySelector(dom);
      }
      //初始化三个类的实例
      const graphView = new GraphView(dom, {
        width: graphData.width || 300,
        height: graphData.height || 300,
        backgroundColor: graphData.backgroundColor || '#fff',
      });
      const selector = new Selector();
      const dataModel = new DataModel(graphData, graphView, selector);
    
      let mouseDown = false; //记录当前鼠标是不是按下，用于判断是否是拖拽
      
      //画布监听到鼠标按下
      graphView.addEventListener('mousedown', (event, point) => {
        mouseDown = true;
        //通过dataModel找到被点击的图形节点
        let clickedNode = dataModel.getClickedNode(point);
        if (clickedNode) {
          //将被点击的节点加入到selector中
          selector.add(clickedNode);
        } else {
          selector.clear();
        }
      })
    
      //画布监听到鼠标抬起
      graphView.addEventListener('mouseup', (event, point) => {
        mouseDown = false;
      })
    
      //画布监听到鼠标移动
      graphView.addEventListener('mousemove', (event, point) => {
        if (mouseDown) {
          //如果鼠标按下后移动，说明想拖拽图形
          //通过selector获取选中的节点
          let selectedNodes = selector.getSelectedNodes();
          if (selectedNodes.length) {
            //遍历所有选中的节点，调用节点的移动方法
            selectedNodes.forEach(node => node.move(event.movementX, event.movementY));
          }
        }
      })
    
      //画布监听到delete
      graphView.addEventListener('delete', (event) => {
        //通过selector获取选中的节点
        let selectedNodes = selector.getSelectedNodes();
        [...selectedNodes].forEach(node => {
          //遍历所有选中的节点，将其删除
          dataModel.removeNode(node);
        });
      });
    
      return {
        graphView,
        dataModel,
        selector,
      }
    }
    

可以看出来，通过面向对象构造的类，通过面向过程方式来调度，所以编程范式并不存在谁高级谁低级的问题，每个范式都有自己的适用场景。

拖动图形到画布
-------

编辑器创建之后，我们需要实现下如何拖动图形到画布，这里可以借助H5的拖拽来实现。

在dragstart时，将图形的默认配置通过event.dataTransfer.setData存储下来。

    <template>
    <div class="material-select-wrapper">
        <div class="title">
            拖动物料到画布
        </div>
        <div v-for="(item, index) in materialList"
             :key="index"
             class="material-select-item"
             draggable
             @dragstart="dragStartHandler($event, item)"
        >
            <img :src="item.icon"
                 width="40px"
                 style="margin-right: 4px"
                 :draggable="false"
            >
            <span>{{item.label}}</span>
        </div>
    </div>
    </template>
    
    <script>
    import circlePng from "../assets/circle.png";
    import rectPng from "../assets/rect.png"
    import trianglePng from "../assets/triangle.png"
    import orangePng from "../assets/orange.png"
    export default {
        name: "MaterialSelect",
        data(){
            return {
                materialList: [
                    {
                        label: '圆形',
                        icon: circlePng,
                        type: 'circle',
                        defaultAttributes: {
                            radius: 30,
                            backgroundColor: '#ff0000',
                            borderWidth: 2,
                            borderColor: "#a000a0"
                        }
                    },
                    {
                        label: '矩形',
                        icon: rectPng,
                        type: 'rect',
                        defaultAttributes: {
                            width: 100,
                            height: 100,
                            backgroundColor: "#0000FF",
                            borderWidth: 2
                        }
                    },
                    {
                        label: '三角形',
                        icon: trianglePng,
                        type: 'poly',
                        defaultAttributes: {
                            points:[
                                [50, 0],
                                [0, 100],
                                [100, 100]
                            ],
                            backgroundColor: "#377e22",
                            borderWidth: 2
                        }
                    },
                    {
                        label: '多边形',
                        icon: orangePng,
                        type: 'poly',
                        defaultAttributes: {
                            points:[
                                [50, 0],
                                [0, 100],
                                [100, 100],
                                [100, 0],
                            ],
                            backgroundColor: "#f2a93b",
                            borderWidth: 2
                        }
                    },
                ]
            }
        },
        methods:{
            dragStartHandler(ev, item){
                ev.dataTransfer.setData('config', JSON.stringify(item))
            }
        }
    };
    </script>
    

在编辑器上监听用户拖拽松手事件，获取拖拽时配置的图形信息，然后创建对应的Node节点，创建完成后将其加入dataModel，并默认把新创建的节点选中。注意，为了获得较好的体验，需要把创建的节点的中心位置设为拖拽松手时鼠标所在位置，为此我们需要为之前抽象的Node节点增加一个setCenter方法。

    <template>
      <div id="editor" @drop="dropHandler" @dragover="dragoverHandler"></div>
    </template>
    <script>
    //忽略部分代码
    export default {
        methods:{
          dragoverHandler(event){
            event.preventDefault();
          },
          dropHandler(event){
            //获取图形的默认配置
            let config = JSON.parse(event.dataTransfer.getData('config'))
            let attributes = lodash.cloneDeep(config.defaultAttributes);
            
            //创建node节点
            let node = createNode(config.type, {
              graphView: this.graphView,
              dataModel: this.dataModel,
              id: this.dataModel.maxId + 1,
              attributes
            })
             //获取松手时鼠标所在坐标
            let {x, y} = this.graphView.getCanvasPointOfEvent(event);
            //将鼠标所在位置作为图形放置的中心
            node.setCenter(x, y);
            
            //添加到画布
            this.dataModel.addNode(node);
            //选中拖拽进来的节点
            this.selector.clear();
            this.selector.add(node);
          }
        }
    }
    </script>
    

属性编辑
----

属性编辑这块我只是简单实现下，并没有考虑很好的扩展性，重点是让大家明白整个实现过程。

属性编辑组件中监听选中节点变化事件，获取第一个选中的节点的属性进行编辑；属性编辑之后调用节点的setAttribute进行属性值修改。

    <template>
        <div class="edit-attributes-wrapper">
            <div class="title">属性编辑区</div>
            <div v-if="selectedNode">
                <el-form label-width="80px">
                    <el-form-item label="id" prop="id">
                        <el-input v-model="nodeId" disabled />
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-input v-model="nodeId" disabled />
                    </el-form-item>
                    <el-form-item v-if="['circle', 'rect'].includes(nodeType)" label="x" prop="x">
                        <el-input v-model="attributes.x" @input="editAttr('x', +$event)"/>
                    </el-form-item>
                    <el-form-item v-if="['circle', 'rect'].includes(nodeType)" label="y" prop="y">
                        <el-input v-model="attributes.y" @input="editAttr('y', +$event)"/>
                    </el-form-item>
                    <el-form-item label="背景色" prop="backgroundColor">
                        <el-input v-model="attributes.backgroundColor"
                                  type="color"
                                  @input="editAttr('backgroundColor', $event)"/>
                    </el-form-item>
                    <!-- 其他配置同上 -->
                </el-form>
            </div>
        </div>
    </template>
    
    <script>
    import lodash from "lodash";
    export default {
        name: "EditAttributes",
        data(){
            return {
                selectedNode: null,
                nodeId: null,
                nodeType: null,
                attributes: {
    
                }
            }
        },
        mounted() {
            this.$eventBus.$on("nodeSelectChange", this.setSelectedNode.bind(this));
        },
        methods: {
            setSelectedNode(nodes){
                if(nodes.length > 0){
                    //获取选中的第一个节点的属性
                    this.selectedNode = nodes[0];
                    this.nodeId = this.selectedNode.id;
                    this.nodeType = this.selectedNode.type;
                    let attributes = lodash.cloneDeep(this.selectedNode.attributes);
                    this.attributes = attributes;
                }else{
                    this.selectedNode = null;
                    this.attributes = {};
                }
            },
            editAttr(attr, value){
                //修改选中节点的属性值
                this.selectedNode.setAttribute(attr, value);
            }
        }
    };
    </script>
    

至此，一个简单的低代码大屏编辑器就实现完成了，篇幅关系不方便放全部代码，详细实现见 [低代码编辑器](https://github.com/501351981/HighQualityCode/tree/main/low-code-editor "https://github.com/501351981/HighQualityCode/tree/main/low-code-editor") 。

总结
==

面向对象编程在前端中大量被使用，无论是JS语法还是第三方库，都使用面向对象解决前端问题。

面向对象编程核心概念有：类、实例、抽象、封装、继承和多态。

使用面向对象编程，有以下优势：

*   解决了只有数据没有方法的问题，在前端开发中可以尝试使用User类替换userInfo数据，遇到有数据和对数据进行操作的场景可以尝试封装成类
*   由于有上下文，实例方法的调用传参大大减少，简化使用方式
*   抽象和封装也有利于代码的复用，越抽象的东西复用性就越强，封装的对象只通过接口通信，降低模块之间的耦合
*   面向对象非常适用于复杂的、大型的代码组织，通过面向对象抽象类，通过面向过程调度类

各个编程范式都有其适用场景和优势，可根据业务需要灵活运用。

> 课后作业：你能为实战的低代码编辑器，扩展一个图片节点吗？支持拖拽图片到画布