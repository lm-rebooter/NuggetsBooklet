在编码过程中，有时会遇到一些比较纠结的情况，比如应不应该抽取组件，怎么抽取组件，颗粒度究竟要到什么程度，组件或者方法调用怎么传参更好；有时候在review别人代码时，感觉代码写的有问题，但是又说不出来到底哪里有问题，不知道如何评价一段代码是好或者不好；或者你认为一段代码写的有问题，而同事认为写的没问题，怎么客观评价这块代码呢？是时候了解下常见的编程原则了。

所谓**编程原则**，就是前人们经过大量的实践和试错，为我们总结的一些特别有价值的基本准则、规范或原理，这些编程原则能够指导我们如何进行编码以及如何进行决策（取舍），也能够用来评价一段代码的质量高低。

编程原则和我们做人的原则是一样的，你的种种行为只是做人原则的一种外化，而原则是行为的内在驱动力。就像一个人把如果诚信和道义作为自己的做人原则，那么他就不会去欺骗朋友换取自己的利益，而如果一个人以维护自己最大利益为做人原则，那么他可能就会为了晋升去伤害身边的人。而当面对利益还是道义的取舍时，我们通过做人原则来进行决策。 树立正确的编程原则就像树立正确的做人原则一样重要，正确的编程原则可以指导我们写出高质量的代码，错误的原则或者没有原则，则会让我们的代码陷入混乱。

当然，世界上没有绝对正确的原则，但是经过多年的实践，前人也给我们留下了一些相对正确的编程原则，值得我们去学习、实践，有了这些原则，就相当于有了思想上的武器，由内而外地驱动你写出高质量的代码，这些原则包括不限于：最少知识原则LOD、DRY原则（Don't Repeat Yourself）、KISS原则、YAGNI原则（You Ain't Gonna Need It）、SOLID原则（单一职责原则、开闭原则、里氏替换原则、接口隔离原则和依赖倒置原则）以及高内聚低耦合原则。

最少知识原则LOD
=========

> 最少知识原则（The Least Knowledge Principle），也被称为迪米特法则（Law of Demeter），它是由伊恩·荷兰（Ian Holland）在1987年提出的。这一原则产生于美国东北大学（Northeastern University）的一个名为迪米特（Demeter）的研究项目，后来被UML创始者之一的布奇（Booch）普及，并在经典著作《程序员修炼之道》（The Pragmatic Programmer）中被提及而广为人知。

最少知识原则是一种面向对象的设计原则，它的核心理念是**只与你的直接朋友交谈，不跟'陌生人'说话**，强调对象之间应该尽量减少彼此的依赖关系，即一个类对于其他类知道的越少越好，一个对象应当对其他对象有尽可能少的了解，只和朋友通信，不和陌生人说话。

在平时前端开发中，面向对象的业务代码可能写的不够多，这里我们可以将对象的概念平替为函数或者组件，比如一个组件应该只和自己的子组件进行直接通信，而不能试图访问孙子组件的data、state或者method，一旦你直接和孙子组件进行通信，说明你就要了解孙子组件的实现，这就增大了维护当前组件的知识量，试想一下，本来维护一个组件只需要知道当前组件的内部结构和子组件的接口，现在又必须要了解孙子组件的接口，这无疑增加了维护的困难。

这是我在我的微信朋友圈看到的一段真实代码：

    function setEditorContent(content){
        this.$refs['editor'].$refs['innerEditor'].setContent(content);
    }
    

可以大概猜测出这段代码的意图，这是一个设置编辑器内容的方法，首先通过$refs\['editor'\]获取到某个子组件实例，然后再继续调用$refs\['innerEditor'\]来获取孙子组件实例，最后调用孙子组件的setContent方法来修改编辑器内容。

这段代码为以后的维护带来风险，为了维护当前这个组件，首先我们要知道子组件内有个ref为innerEditor的孙子组件，这个孙子组件有个setContent方法，这无疑增加了维护时的学习成本；其次如果子组件内部发生了调整，比如内部的ref不再叫innerEditor了，那这里就会出错了，有人可能说了，那子组件不改这里，不就没问题了？

如果你现在维护一个组件，你会对什么内容负责？是不是肯定只对暴露的接口负责，也就是只要我保证组件对外提供的props、methods、events、slots保持不变，我们就可以认为我们的变更不会影响到别的组件，你肯定不会想到仅仅是修改了内部实现中的某个组件的ref名称，居然导致父组件出错了。如果父组件真的依赖子组件的实现，那你维护这个子组件的时候，是不是就要知道我的某个内部实现是不能变的，这无疑也是增加了维护所需的知识量，试想如果团队来了一个新人，这个知识他怎么会知道呢，也就是说因为这种耦合的代码写法，导致维护一个组件的知识量大量上升。

正确的做法应该是子组件提供一个setContent方法，我们只要直接调用子组件方法即可，至于子组件内部怎么实现这个setContent，父组件并不关心。

    function setEditorContent(content){
        this.$refs['editor'].setContent(content);
    }
    

更佳的做法是，我根本不需要知道子组件需要通过setContent方法修改其内容，我们只修改子组件的属性即可，子组件内部来通过监听value变化来设置编辑器内容，让父组件无感知。

    <template>
        <Editor v-model="content"/>
    </template>
    <script>
    export default {
        data(){
            return {
                content: '' 
            }
        },
        methods:{
            setEditorContent(content){
                this.content = content;
            }
        }
    }
    </script>
    

我还曾经见到同事写过这样的代码：

     let codeMirrorDom = this.$refs['code-mirror'].$el;
     let scrollTop = codeMirrorDom.querySelector('.CodeMirror-scroll').scrollTop;
    

这里虽然没有依赖孙子组件，但是你却必须要知道子组件的详细实现，即子组件内部有个class为"CodeMirror-scroll"的元素，一旦子组件的这个元素类名发生变化，则会导致不可预期的bug发生，这都是违反最小知识原则的。

再举个函数调用的示例：

    function getData(rowData){
        let type = rowData.row.type;
        let status = rowData.row.detail.status; //必须了解参数下的子属性、孙子属性对象结构
    }
    

在这个函数实现中，你必须要知道参数rowData的具体结构，一般我们可能需要了解某个对象参数有哪些属性，但是我们不应该还去了解参数的某个孙子属性、重孙属性结构，假设我们要根据类型type和status去获取数据，那么直接给我传递过来type和status即可，而不必额外去学习参数对象的具体格式。

假如你的同事让你来实现这个getData方法，你觉得下面那种更好理解，需要的知识量更少？

    function getData(rowData){
        //必须要知道rowData的结构
    }
    
    function getData2(type, status){
        
    }
    

最小知识原则的最大价值就是解耦，在组件开发时，要和子组件、孙子组件的的具体实现解耦；在类开发时，要和子类、孙子类的具体实现解耦；在函数开发时，要和参数的子属性、孙子属性实现解耦。所有的道理都是相通的，都是避免两块代码或者数据耦合太深，减少维护时所需的知识量。

狭义最少知识 VS 广义最少知识
----------------

以上关于最少知识原则的概念，我将其称为**狭义最少知识原则**，即只规范了对象和子对象、孙子对象的依赖关系，而在编程中，只关注父子孙对象的依赖关系是远远不够的。

广义的最少知识原则我们可以理解为，在开发、维护、使用某段代码时，尽可能的需要最少的知识，简单的说就是别人怎么样只通过少量的业务知识储备，就可以去轻松地维护或者使用你写的代码。

我们通过几个简单的示例来说明什么是广义的最少知识原则。

最常见的就是硬编码一些状态值，比如下面这段代码，当你要维护这段代码时，你需要哪些知识储备？至少要知道不同数字代表的状态含义吧，这就是维护这段代码的前提，维护一段代码的前提肯定越少越好。

    function sync(app){
        if(app.status === 0){
            
        }else if(app.status === 1){
            
        }
    }
    

修改方式大家肯定也都知道，只需要用常量字符串代替这些硬编码数字即可。

再比如前端最常见的API调用，我们一般会把所有的业务请求封装起来，简化调用时对后端接口的了解。

我们以封装一个获取新闻详情的调用为例：

    //serve.js
    //把各种资源的操作封装起来
    import axios from 'axios'
    import url from './const/url.js'
    export function getNewsDetail(newsId){
        return axios.get(url.newsDetail, {
            params:{
                id: newsId
            }
        })
    }
    

在需要获取新闻详情时，只需要调用getNewsDetail方法，并把新闻id传递进去即可，这样在开发相关业务时，不需要知道获取新闻的具体url是什么，也不需要知道后端要求的参数结构是什么，只要知道获取新闻详情调用这个方法即可，减少了业务维护的知识储备量。

    import {getNewsDetail} from './serve.js'
    
    getNewsDetail(1)
    

各种示例不再赘述，总结起来就一点，当你在开发一个组件、一个函数、一个模块时，思考下，如果一个新人来维护，他需要多少知识储备才能顺利上手，需要的知识储备越少越好，这就是我们说的广义最少知识原则。

DRY原则
=====

> DRY原则（Don't Repeat Yourself）是一种重要的编程原则，强调避免代码重复。它的核心思想是，任何一段代码都应该在系统中只有唯一的一份存在，而不应该重复出现。

个人感觉IT开发相比现实世界中的各种开发工作，最大的优势就是复用成本极低，在现实世界中想要复制一个工作，仍然要投入大量的资源，而IT开发中的复用就非常简单，一个函数写好后，只要在多个地方引入调用即可，不需要额外增加工作量，所以我们更应该好好利用软件开发的这个特性，将复用性做好。

而在业务开发中，造成代码重复的原因主要有以下三个：

1.  不知道有重复：就像我们前面在设计文档一节中提到的，在开发一些基础组件和库时，没有进行宣贯，平时团队也缺少代码Review，团队内部沟通不畅，大家不知道有可共享的资源，导致重复造轮子。
    
2.  知道有重复，懒着抽取：想让代码整洁就和维持房间整洁一样，都需要付出努力，一旦懒惰，代码就会慢慢腐败，主观上我们需要提升对DRY原则的重视，客观上还是要增加团队的CodeReview机制，不合理的代码要打回重写。不要只顾开发爽，维护才是耗时最长的阶段，尽量不要欠下技术债。
    
3.  知道有重复，但没法复用：这种情况大概率是设计不符合单一职责原则，导致复用起来难度较大，或者强行复用导致耦合加深，最终放弃复用。
    

关于提升代码复用性，后面我们会有一个专门的章节来介绍，这里不再展开。

KISS原则
======

> KISS原则是“保持简单和愚蠢（Keep It Simple and Stupid）”的缩写，强调在解决问题或设计产品时要保持简单性和易用性。

在产品设计时，经常会听到一种说法，就是要把用户当"傻子"，这里并不是对用户人格的一种贬低，而是说用户在使用产品之前，很可能并不具备较深的知识储备，不能要求用户有过高的专业性。

同时由于每个用户的过往知识、经验、学习能力、性格（急躁）等各不相同，为了满足绝大部分用户使用产品的易用性，必须以用户的水平下限作为我们产品设计的依据，而不是看用户的水平上限。只有一个"傻子"一样的人都能用明白，才说明产品真的做到了易用。这就和白居易把自己写的诗读给一个目不识丁的老奶奶听一样，只要老奶奶听不懂他就改，最终白居易的诗才真的达到了通俗易懂。

这个原则不只是应用在产品设计上，编码上也是一样的，大到一个开源项目，小到一个公共组件/函数，只要你的代码是有使用用户的，都要记住，用户是"傻子"，不要对用户有过高的预期。

以我的开源项目 vue-office为例，在此之前如果要进行文件预览（docx、excel、pdf）是比较麻烦的，虽然代码不是那么复杂，但是对于一个新手来说，还是有很多学习成本的，以使用pdf.js进行pdf预览为例。

    <template>
      <div>
        <div v-for="pageNum in numPages" :key="pageNum">
          <canvas :ref="`pdfCanvas-${pageNum}`"></canvas>
        </div>
      </div>
    </template>
    
    <script>
    import pdfjsLib from 'pdfjs-dist';
    
    export default {
      name: 'PdfPreview',
      props: {
        pdfUrl: {
          type: String,
          required: true
        }
      },
      data() {
        return {
          numPages: 0
        };
      },
      mounted() {
        this.renderPdf();
      },
      methods: {
        renderPdf() {
          pdfjsLib.getDocument(this.pdfUrl).promise.then(pdf => {
            this.numPages = pdf.numPages;
    
            for (let pageNum = 1; pageNum <= this.numPages; pageNum++) {
              pdf.getPage(pageNum).then(page => {
                const canvas = this.$refs[`pdfCanvas-${pageNum}`][0];
                const context = canvas.getContext('2d');
                const viewport = page.getViewport({ scale: 1 });
    
                canvas.width = viewport.width;
                canvas.height = viewport.height;
    
                page.render({
                  canvasContext: context,
                  viewport: viewport
                });
              });
            }
          });
        }
      }
    };
    </script>
    

这还是简化之后的例子，里面没有包括引用Worker文件、cmaps文件等内容，而且针对Vue2和3还需要做一些示例修改，虽然不到100行代码，但是如果让一个新手去做，不一定能做出很好的效果，考虑的也不一定全面，比如大文件的懒加载、宽高自适应、低版本浏览器的兼容等，也正是基于此，才有了vue-office项目，虽然本质上还是借助第三方库来实现，但是简化了实现细节，可以让小白用户几分钟内完成多种文件的预览。

vue-office进行pdf预览：

    <vue-office-pdf
        src="https://**.pdf"
    />
    

可以看出，使用非常简单，只要传递一个pdf文件url，即可完成预览，为了支持多种场景属性src支持多种格式，包括url、Blob、ArrayBuffer、Response，同时支持Vue2和Vue3，自动根据用户环境切换不同版本代码。正是基于KISS原则的指导，才有了这个开源项目的成功，目前收获3k+ star。

保持简单的重要手段是封装，就像空调遥控器上往往都会有个睡眠模式，按了睡眠模式后空调通常会进行以下几个操作：

*   调整温度：自动调整空调的温度设置，使室内温度逐渐升高或降低，以提供更适合睡眠的环境。
*   调整风速：减小风速，以避免直接吹向人体。
*   调整噪音：减小空调的运转声音，以提供更安静的睡眠环境。
*   调整定时功能：空调在一定时间后自动关闭或调整温度，以节省能源并确保你在睡眠过程中保持舒适。 这不就是我们通常说的一键操作嘛，一次按键进行多个动作，在我们设计模式中也可以称为外观模式。

外观模式并不神奇，以项目中常用的Button按钮封装为例，我们项目中通常有这几种操作，添加、编辑、导入、导出、删除等，不同操作按钮通常有不同的样式和图标，如添加按钮通常type设为"primary"，并且配置一个"加号"icon，删除按钮type则为"danger"，并配一个"删除"icon，然后如果每个人都要记住不同按钮怎么配置则比较麻烦，我们可以通过外观模式来简化这个配置。

    //封装前：
    // 添加按钮
    <el-button type="primary" icon="el-icon-plus"></el-button>
    
    //编辑按钮
    <el-button type="warning" icon="el-icon-edit"></el-button>
    
    //删除按钮
    <el-button type="danger" icon="el-icon-delete"></el-button>
    
    

我们可以封装一个MyButton按钮，提供一个operate属性，当operate为add时，将按钮的type设为"primary"同时icon设为"el-icon-plus"，其他操作也一样逻辑，这样使用起来就变的非常简单了。

    //添加按钮
    <my-button operate="add"/>
    
    //编辑按钮
    <my-button operate="edit"/>
    
    //删除按钮
    <my-button operate="delete"/>
    

好了，这样封装后，是不是使用时就变的简单了。

当然了易用性和扩展性天然会存在一些冲突，在提升易用性的同时，需要考虑特殊场景如何简单地进行扩展，编程就是平衡的艺术。

YAGNI原则
=======

> YAGNI原则是软件开发中的一种原则，它代表着"You Ain't Gonna Need It"，意思是"你不会需要它"。这个原则的核心思想是在开发过程中，不要去实现那些当前并不需要的功能。

YAGNI原则的目的是**避免过度设计和开发**，以及避免浪费时间和资源在不必要的功能上。根据这个原则，开发人员应该专注于当前需要解决的问题，而不是预测未来可能出现的需求。

YAGNI原则的应用可以帮助开发团队更加敏捷地开发软件，减少不必要的复杂性和开发成本。它鼓励开发人员保持简单，只实现当前需要的功能，并在未来需要时再进行扩展和改进。

然而，YAGNI原则并不意味着完全忽视未来的需求。它只是提醒开发人员在做决策时要权衡利弊，并避免过度设计和开发。在实践中，开发人员需要根据具体情况和项目需求来决定是否应用YAGNI原则。

过度设计 VS 不设计
-----------

在实际编程工作中，很多人可能拿YAGNI作为挡箭牌，以不要过度设计为由，从而不进行设计，最常见的就是组件抽取。

有的同学可能觉得只要没有其他页面复用，就不用抽取组件，抽取了就是过度设计，个人认为这是不正确的，提前抽取组件，以应对未来可能的复用需求，不一定属于过度设计，就算未来没有复用需求，我们也应该根据业务模块进行组件划分，以简化整个项目的结构，让项目更加清晰易读可维护，如果抽取的组件未来复用了更好，不复用也并没有坏处。

以掘金首页为例，假如我现在接到这样一个页面开发任务：

![07 掘金首页-组件封装示例.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5fb352e18d0474e8089d97829f89832~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1860&h=1132&s=1161751&e=png&b=fefdfd)

我会考虑将列表项封装成一个组件ArticleItem，这样我列表的开发逻辑就很清晰，只需要请求相应数据，然后将文章列表循序传递给ArticleItem组件即可渲染出整个列表，其次我可以预见列表展示可能会在多个场景出现，比如未来的文章详情底部可能会有相似文章推荐等，就算没有也没关系，现在的抽取本身就有价值。

但是我不会在此刻把文章标题抽取成为一个组件，首先我现在还没看到别的页面有这个复用场景，其次抽取文章标题并不会对我现在的代码结构带来多大的简化效果，最后如果真的有一天要进行文章标题的抽取我也可以轻松实现，并不会带来很大的成本，综合这些考虑，我决定暂不进行如此细粒度的组件抽取。

是否过度设计取决于抽取的颗粒度，在需求没有出现之前，没有必要进行特别细粒度的组件抽取，但是不进行组件抽取则是一种懒政的行为。

开发中遇到的另一个常见场景是，接到需求后直接进入了开发，而不进行设计，更不编写设计文档，代码写到哪算哪，怎么说呢，写代码和建设大楼一样，就算不是盖一个摩天大楼，哪怕是盖个猪圈不提前设计也有推到重来的可能。

面向现在 VS 面向未来
------------

YAGNI原则告诉我们应该面向现在编程，设计方案应该是刚刚好解决了现在的问题，不多也不少，不要去实现那些当前并不需要的功能。

比如我们实现一个根据状态返回色值的方法，假设现在只有两个状态(成功和失败)，那么我们只需要通过if else来实现即可，没有必要因为你觉得以后状态可能会变成3个或者更多，而在当下使用switch或者策略模式来实现当前这个需求。

    //这就够了，恰到好处
    function getColorByStatus(status){
        if(status === 'success'){
            return 'green'
        }
        return 'red'
    }
    
    // 仅仅两个状态没必要
    function getColorByStatus2(status){
        switch (status){
            case 'success':
                return 'green';
            default:{
                return 'red'
            }
        }
    }
    

虽然编码应该着重基于当前需求，但是我们仍然要重视未来可能的需求变化，确保未来需求变化之后，你是有应对策略的，特别是针对一些老数据升级相关的策略，这些想明白了之后才能大胆的基于当前需求编码，否则适当做一些提前工作，也不失是一种未雨绸缪的好方法。

就像上面我举的这个是用if else 还是 switch的问题，你完全可以大胆的基于当前需求选择最合适的编码方案，等以后真的status变成了多个，你再换成switch也不迟，并不会有多大的重构成本，相比之下，保持当前代码的可读性才是更重要的。

单一职责原则SRP
=========

> 单一职责原则（Single Responsibility Principle）指出一个类或模块应该有且只有一个引起它变化的原因。简而言之，单一职责原则要求一个类或模块只负责一项职责或功能。

单一职责原则的核心思想是将一个类或模块的功能划分为独立的、高内聚的部分，每个部分只负责一个明确的职责，在我们前端领域可以将类或模块替换为组件、模块、函数等概念，也就是一个组件、模块或者函数应该只有一个明确的职责，在维护时只有一个引起它变化的原因。

听起来单一职责很简单，但是实际使用时却是一个十分不好掌握的一个原则，一个模块的职责并不是那么容易划分。

我们通过一个实际的例子先来看下什么是单一职责。

函数开发示例
------

假设我们现在想要实现这样一个功能，通过元素id获取页面上的某个Dom元素，然后为它添加class类名。很自然地我们想到要实现一个名为addClass函数，仅仅实现这个需求非常简单，可能的实现如下：

    <div id="test">测试内容</div>
    
    <script>
        function addClass(id, className){
            let dom = document.getElementById(id)
    
            dom.classList.add(className)
        }
    
        addClass('test', 'red')
    </script>
    

我们来分析下这个addClass函数，实际它做了两件事，首先根据id获取元素，然后修改Dom元素的类名，现在看起来一切正常，并没有什么不妥。

接着需求发生了变化，不光要支持根据元素id修改类名，还要支持class选择器和元素选择器，这时必须要修改addClass函数的实现了（假装不知道有document.querySelector方法）

    function addClass(selector, className){
            let dom
            if(selector.startsWith('#')){
                //id选择器
                dom = document.getElementById(selector.substr(1));
            }else if(selector.startsWith('.')){
                //类选择器
                dom = document.getElementsByClassName(selector.substr(1));
            }else {
                //tag选择器
                dom = document.getElementsByTagName(selector)
            }
    
    
            dom.classList.add(className)
    }
    addClass('#test', 'red')
    

没过多久，需求又发生了变化，上面的实现每次只能添加一个class类名，我们想要一次添加多个类名，传递的类名要支持数组和字符串两种格式，继续修改addClass方法。

    function addClass(selector, className){
            let dom
            if(selector.startsWith('#')){
                //id选择器
                dom = document.getElementById(selector.substr(1));
            }else if(selector.startsWith('.')){
                //类选择器
                dom = document.getElementsByClassName(selector.substr(1));
            }else {
                //tag选择器
                dom = document.getElementsByTagName(selector)
            }
    
            //增加对className格式的判断
            if(Array.isArray(className)){
                className.forEach(name => dom.classList.add(name))
            }else{
                dom.classList.add(className)
            }
    
        }
    
        addClass('#test', ['red', 'blue'])
    

通过上面的示例我们可以看出，修改addClass函数有两个原因

*   如何选择要修改的元素
*   如何修改元素的类名

很明显现在这样设计就不符合单一职责原则，但是不符合原则会怎样呢，目前来看仿佛一切正常，别急，那就继续变更需求。

现在有了新需求，想要通过id、类、元素选择器选中元素，然后删除元素的某个类名，也就是要增加一个removeClass方法，其中选中元素的逻辑和addClass是一样的。

    function removeClass(selector, className){
            let dom
            if(selector.startsWith('#')){
                //id选择器
                dom = document.getElementById(selector.substr(1));
            }else if(selector.startsWith('.')){
                //类选择器
                dom = document.getElementsByClassName(selector.substr(1));
            }else {
                //tag选择器
                dom = document.getElementsByTagName(selector)
            }
    
            dom.classList.remove(className)
    }
    

可以看到addClass和removeClass在选择元素方面存在着重复代码，为后续的维护带来成本，之所以存在重复就是因为这两个方法职责并不单一，一个函数做了两件事，导致多个函数中的重复部分无法复用，原因找到了解决起来也就非常简单，我们只需封装三个职责单一的函数即可：

*   selectDom：只负责选择Dom元素
*   addClass：只为Dom元素添加类名
*   removeClass：只为Dom元素移除类名

        function selectDom(selector){
            let dom;
            if(selector.startsWith('#')){
                //id选择器
                dom = document.getElementById(selector.substr(1));
            }else if(selector.startsWith('.')){
                //类选择器
                dom = document.getElementsByClassName(selector.substr(1));
            }else {
                //tag选择器
                dom = document.getElementsByTagName(selector);
            }
            return dom;
        }
        
        function addClass(dom, className){
            if(Array.isArray(className)){
                className.forEach(name => dom.classList.add(name))
            }else{
                dom.classList.add(className)
            }
    
        }
    
        function removeClass(dom, className){
            dom.classList.remove(className)
        }
    

经过这个修改之后，如果后续想要增加新的元素选择方式，则只需修改selectDom方法即可，不再会影响addClass和removeClass方法，同样的修改添加样式和删除样式需求，也只会影响各自对应的方法，而不影响其他方法。

组件开发示例
------

封装组件是现在前端开发中最主要的工作，在Vue和React项目开发中，一切皆组件，大到一个页面，小到一个按钮，都可以看作是一个组件。

框架虽然鼓励用户进行组件化开发，然而却不能强制控制组件化的粒度，所以每个人写出来的页面差别甚大，特别是一些前端新手写出来的页面，动辄2000行以上，所有的UI、逻辑、样式杂糅在一起，让后面维护的人甚是头大，就算是修改一个小功能，都要去阅读大量的代码，带来极大的维护成本，究其原因，就是没有按照单一职责原则进行组件设计。

下面这样一个用户列表，如果交给你开发，你会如何划分组件？

![07 用户列表.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb20aed573c9449dab28b5c4fb68dd12~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=651&h=233&s=33420&e=png&b=fdfdfd)

我们先来根据UI图梳理下需求：

*   操作区：这里仅有1个添加用户按钮，点击之后一般会弹窗进行用户添加，或者跳转到添加用户界面
*   搜索区：根据用户角色进行筛选，用户角色下拉选项数据通过请求角色列表获取
*   表格展示区：
    *   姓名：姓名可以点击，点击之后抽屉展示用户详细信息
    *   角色：不同角色有不同的颜色标识
    *   手机：隐藏手机号中间4位
*   表格操作区：
    *   删除：点击删除后，二次确认是否确定删除，确定后删除数据，刷新表格
    *   编辑：点击后弹窗进行用户信息修改

可以看到，这个用户列表是一个混合了多个功能的组件，至少包括了添加用户、搜索、用户信息展示（姓名展示、角色展示、手机号展示）、用户管理（删除、编辑）四个功能，如果所有功能杂糅到一个组件中，势必造成单个文件过大，可读性和复用性都不好。

按照单一职责进行组件划分：

*   操作按钮组件 UserOperate：
    *   组件职责：实现用户添加操作
    *   属性：无
    *   事件：对外暴露添加成功事件，主组件接收后刷新表格
*   搜索组件 UserSearch
    *   组件职责：负责维护搜索表单
    *   属性：默认筛选项的值
    *   事件：对外暴露search事件，主组件接收后刷新表格
*   表格展示组件，一般都有第三方UI组件，无需封装
*   用户姓名 UserName
    *   组件职责：展示用户姓名
    *   属性：用户姓名、用户id
*   用户角色 UserRole
    *   组件职责：根据不同角色类型展示不同icon和名称
    *   属性：用户角色
*   用户手机 UserMobile
    *   组件职责：隐藏手机号中间4位
*   用户管理 UserManager
    *   组件职责：用户的管理，这里将删除和编辑混合到一起，虽然可能违反单一职责原则，但是太细的话也没有必要，如果操作很多，每个很复杂，可以酌情拆分
    *   事件：对外暴露删除成功、编辑成功事件，主组件接收后刷新表格
*   主组件 UserList
    *   组件职责：负责整合各个组件，根据搜索条件请求数据，赋值给用户表格

按照单一职责拆分后，主组件结构清晰，需要修改哪一块需求，可以迅速定位到相关子组件，不再像之前一样需要阅读大量代码才能定位到要修改的内容。

单一职责优缺点
-------

通过上面两个示例，我们可以看到，符合单一职责的代码有以下几个优点：

*   增强代码的可读性：单一职责代码一般比较精简，减少了复杂性，可读性更强；
    
*   增强代码的可维护性性：每个模块职责清晰，更加容易去除或者更换某个职责的模块，而不用担心影响其他职责的模块
    
*   提升代码的复用性：单一职责原则使得每个模块的功能更加独立和自治，可以更容易地被其他部分引用和复用。这样可以减少代码的重复，提高代码的可重用性，从而提高开发效率
    
*   提高代码的可扩展性：当一个模块只负责一项职责时，新增功能或修改现有功能时只需要修改相关的模块，而不会影响到其他部分。这使得系统更加灵活和易于扩展，可以更容易地应对变化和需求的变更。
    
*   提高代码的可测试性：单一职责原则使得每个模块的职责明确，因此可以更容易地编写针对每个职责的单元测试，而不必Mock大量的测试数据
    

虽然遵循单一职责会提升代码的可读性、可维护性、可复用性、可扩展性和可测试性，但是也存在以下几个问题，需要在编写代码时去平衡：

*   模块的数量/层级会增加：遵循单一职责原则必然会导致模块的数量或层级增加，这可能会增加代码的复杂性和维护成本，取决于模块的粒度划分是否合理。
    
*   职责划分困难：有时候，将功能划分为独立的职责可能并不是一件容易的事情。在某些情况下，职责之间可能存在一些交叉和重叠，这可能导致职责的划分变得困难，比如上面的表格操作区域，是把删除按钮和编辑按钮封装到一起作为一个表格项管理组件，还是把他们拆开成两个组件，是比较难权衡的
    
*   跨职责的协调和通信：由于将一个大功能划分成不同的小模块，就必然会带来小模块之间通信的问题，这可能会增加代码的复杂性。
    

所以说在软件开发领域，并不存在"银弹"，不能没有原则，也不能完全套用原则，就像咱们古人推崇的中庸之道，干啥都别过分，写代码就是平衡的艺术。

开放封闭原则OCP
=========

> 开闭原则（Open-Closed Principle，OCP）指出软件实体（类、模块、函数等）应该对扩展开放，对修改关闭。

这个定义很抽象，具体来说，开放封闭原则内核包含以下两个方面：

*   对扩展开放：当需要添加新功能时，应该尽可能地开放类、模块、函数等的扩展点，通过扩展点给使用者增加新功能的机会。
    
*   对修改关闭：当需要修改现有功能时，应该尽可能地关闭类、模块、函数等的修改点，尽量通过扩展的方式来变更功能，而不是修改原有功能。
    

在我们前端开发中，除了开发一些公共库之外，很少会用到类，我们先以Vue组件封装为例来体会下什么是开闭原则。

假设我们现在开发一个表单标题组件，需求就是在标题的左侧添加一个绿色的竖线，如下图所示。

![05-表单标题1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3affabc6b03b4739a5aa095478b144b4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=493&h=166&s=11499&e=png&b=fefefe)

Vue实现如下

    <template>
        <div class="form-title">
            <div class="title">
                {{ title }}
            </div>
        </div>
    </template>
    <script>
    export default {
        name: 'FormTitle',
        props: {
            title: {
                type: String
            }
        }
    
    };
    </script>
    
    <style scoped lang="scss">
    .form-title {
        .title {
            height: 16px;
            line-height: 16px;
            padding-left: 8px;
            border-left: green 4px solid;
            font-size: 16px;
        }
    }
    </style>
    

上述实现并没有考虑扩展性，现在开发中遇到以下两种场景，一个是标题右侧展示一个问号，鼠标移入后展示一段提示信息，另一种是标题右侧有个按钮，点击执行某个动作。

![05-表单标题2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/caf6f855fee542fdaf304fa43d3fb8fc~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=407&h=146&s=17558&e=png&b=fefefe)

如何实现这两个场景呢，一种是我们继续修改上述FormTitle组件的实现，比如对外暴露一个icon属性，传递了icon则标题右侧展示icon；同时再暴露一个buttonLabel属性，传递button的文案。

虽然这样也可以实现，但是不满足开闭原则，首先这样的实现没有扩展性，假如后续标题右侧展示两个button按钮，又要如何处理呢？并没有提供一个统一的扩展方案，即不满足对扩展开放；同时为了满足需求，对原有的FormTitle代码进行了大量的修改，即不满足对修改关闭。

假如我们在FormTitle组件的标题右侧引入了一个插槽，则可以完美应对各种各样的需求。

    <template>
        <div class="form-title">
            <div class="title">
                {{ title }}
                <slot></slot>
            </div>
        </div>
    </template>
    

引入插槽之后，上面两个新需求可以非常容易实现，而不需要修改原有的FormTitle组件。

    <template>
        <div>
            <FormTitle title="表单标题">
                <i class="icon-question"></i>
            </FormTitle>
            <FormTitle title="表单标题">
                <button>按钮</button>
            </FormTitle>
        </div>
    </template>
    

通过这个例子可以看出，通过使用插槽机制，让组件FormTitle扩展性大大增强，为以后的新需求提供了扩展机制，而不必修改FormTitle的实现，我们说这样的设计是符合开闭原则的。

再来看一个纯js的例子，假设我们实现一个表单校验的工具，可以校验某个值是否是合法的手机号、邮箱等。

    const formValidate = new FormValidate();
    formValidate.validate('mobile', '111111'); //false
    formValidate.validate('mobile', '13156678909'); //true
    formValidate.validate('email', 'aaa'); //false
    formValidate.validate('email', 'test@qq.com'); //true
    

我们来试着实现这样一个FormValidate类，它有个validate方法，根据参数type类型进行正则校验。

    class FormValidate {
        validate(type, value){
            if(type === 'mobile'){
                return /^1[3-9]\d{9}$/.test(value)
            }else if(type === 'email'){
                return /^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*$/.test(value)
            }else {
                return false;
            }
        }
    }
    

假如我们现在要增加对用户名的校验，如何实现呢？按照上面的实现方法，我们需要修改原有的FormValidate实现。

    class FormValidate {
        validate(type, value){
            if(type === 'username'){
                if(!value) {
                    return false;
                }else if(value.length <=30){
                    return true;
                } else{
                    return false;
                }
            }
            //其他逻辑
        }
    }
    

这个实现方式就不符合开闭原则，没有对扩展开放，没有对修改关闭。我们重构下FormValidate类的实现方式，增加一个addValidateMethod方法，通过该方法添加自定义的校验方法。

    class FormValidate {
        validateMethods = {};
        validate(type, value){
            if(this.validateMethods[type]){
                return this.validateMethods[type](value);
            }
            return false;
        }
        addValidateMethod(type, validateMethods){
            this.validateMethods[type] = validateMethods;
        }
    }
    
    const formValidate = new FormValidate();
    
    formValidate.addValidateMethod('mobile', (value) => /^1[3-9]\d{9}$/.test(value));
    
    formValidate.addValidateMethod('email', (value) => /^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*$/.test(value));
    
    formValidate.addValidateMethod('username', (value) => {
        if(!value) {
            return false;
        }else if(value.length <=30){
            return true;
        } else{
            return false;
        }
    });
    
    formValidate.validate('mobile', '111111'); //false
    formValidate.validate('mobile', '13156678909'); //true
    formValidate.validate('email', 'aaa'); //false
    formValidate.validate('email', 'test@qq.com'); //true
    

后续假如想再增加对ip地址的校验，只需要调用addValidateMethod方法添加ip的校验函数即可，无需修改原有FormValidate类，这样的实现方式满足对扩展开放对修改关闭的原则，符合开闭原则。

开闭原则是提升代码可扩展性的一个重要原则，特别是当你想要开源一些基础组件或者方法库时，这个原则的指导作用会更加明显，因为对于用户来说，第三方开源库大都通过引入使用，已经天然地关闭了源码修改通道，所以只有你的开源库对扩展开放，用户才能根据自己需求进行扩展，这会大大影响你的开源库的受众范围。

里氏替换原则 LSP
==========

> 里氏替换原则（Liskov Substitution Principle，LSP）是由Barbara Liskov提出。LSP的核心思想是，任何基类（父类）可以被其子类替换，而不会影响程序的正确性。

简单点说如果S是T的子类，那么都可以将所有出现T的地方都换成它的子类S，而不出错。

    class S extends T {
        
    }
    
    let instance = new T();
    instance.method();
    
    //符合里氏替换原则的情况下,可以将T换成S，程序一定可以正常运行
    let instance = new S();
    instance.method();
    

这在前端并不好理解，因为前端很少有这种子类替换基类的情况，我们可以通过一个组件的继承来说明里氏替换原则。

在使用ElementUI组件库进行项目开发时，有时可能要改造部分组件，比如我对ElButton组件不太满意，我想给这个组件增加一个属性operate，当operate为add、edit、delete时分别设置不同的type，以此来规范项目中按钮的type类型。也就是我要开发一个基于ElButton组件的子组件MyButton（这里的子组件可以理解为继承的组件）。

如果我的MyButton这么实现，看看会有什么问题：

    <template>
        <el-button :type="type">
            <slot></slot>
        </el-button>
    </template>
    
    <script>
    export default {
        name: "MyButton",
        props:{
            operate:{
                type: String
            }
        },
        computed:{
            type(){
                let typeMap = {
                    add: 'primary',
                    edit: 'warning',
                    delete: 'danger'
                }
                return typeMap[this.operate] || 'default'
            }
        }
    };
    </script>
    

显然，如果这么实现，页面中凡是用到ElButton的地方，是不能用MyButton替换的，因为MyButton支持的属性很少，没有兼容父组件的输入，也就是说子组件对于输入的要求比父组件严格。

    <ElButton type="primary" size="small">添加</ElButton>
    
    <!--不能使用MyButton组件替换，不支持type和size属性-->
    <MyButton type="primary" size="small">添加</MyButton>
    

也就是说MyButton的实现不符合里氏替换原则，我们可以经过简单改造，让MyButton支持ElButton的全部属性和事件，可以利用v-bind="attrs"和v−on\="attrs" 和 v-on="attrs"和v−on\="listeners"，将传递给MyButton的所有属性和事件监听，转移到ElButton组件上。

    <template>
        <el-button v-bind="$attrs" :type="type" v-on="$listeners">
            <slot></slot>
        </el-button>
    </template>
    
    <script>
    export default {
        name: "MyButton",
        props:{
            operate:{
                type: String
            }
        },
        computed:{
            type(){
                let typeMap = {
                    add: 'primary',
                    edit: 'warning',
                    delete: 'danger'
                }
                return this.$attrs.type || typeMap[this.operate] || 'default'
            }
        }
    };
    </script>
    

通过这样的改造后，业务中凡是用到ElButton的地方都可以放心地替换为MyButton。

现在总结下，一个组件要想满足里氏替换原则，必须满足以下条件：

*   子组件的输入不能比父组件严格：
    *   子组件必须支持父组件所有属性，可以多，但不能少；
    *   同一个属性子组件要允许更宽泛的格式，比如父组件某属性只支持String格式，子组件可以支持String、Number等多种情况，但不能反过来
    *   同一个属性子组件允许更宽泛的校验，比如父组件要求某属性为1-10，子组件可以要求0-100，但是不能反过来
*   子组件的输出不能比父组件宽松：
    *   比如父组件的某个method返回值为String和Number，子组件可以只返回Number格式，但是不能返回Array格式
    *   父组件某个method返回数据范围为1-9，子组件不能返回0-10的数据，但可以返回2-8的数据

这里将"组件"换成"类"等其他概念都是相通的，只是后端可能经常使用类的概念，前端更多使用组件这个概念。

接口隔离原则 ISP
==========

> 接口隔离原则（Interface Segregation Principle，ISP），客户端不应该依赖它不需要的接口; 类间的依赖关系应该建立在最小的接口上。

这里说的接口不是API接口，而是面向对象中的接口Interface，比如有个学生接口Student，它包含了学习语文、学习数学、学习物理等方法，现在如果要开发一个文科生类来实现这个Interface，由于文科生不需要学习物理，但是也必须写一个空的学习物理方法。文科生类和理科生类由于都基于共同的Interface实现，无形之中产生了耦合，也许有一天理科生不再学习物理了，但这就对文科生类产生了影响，这就不符合接口隔离原则，接口隔离原则的目的是降低类之间的耦合性。

同样的，我们可以将这个思想应用到前端开发中，即在实现一个方法、组件时，不要依赖不需要的内容（数据、组件等），依赖关系应该尽可能小。

先来个非常简单的示例来说明下，假设现在需要实现一个获取阅读类用户详情的方法，如果用户是普通用户获取用户最近收藏的文章数，如果用户是签约作者获取用户最近发表文章数。

    function getUserDetail(rowData){
        let type = rowData.row.type;
        let id = rowData.row.id;
        //根据id获取用户基本信息
        //根据type类型决定是获取收藏文章数还是发表文章数
    }
    

这个实现有什么问题呢？对于getUserDetail方法来说，只要拿到用户id和类型type两个数据即可，现在却依赖了一个庞大的对象rowData，这种没必要的依赖关系导致了getUserDetail方法和rowData结构的耦合，一旦rowData结构发生变化，getUserDetail方法也会收到影响，这本可以避免的。

    //我不关心id和type怎么来，给我就行了
    function getUserDetail(id, type){
        //根据id获取用户基本信息
        //根据type类型决定是获取收藏文章数还是发表文章数
    }
    

这个示例相信很好理解，现在我们再看一个组件封装的例子，看看怎么利用接口隔离原则来指导组件封装。

假设某个知识网站存在两种用户：普通读者和签约作者，现在需要在页面上展示用户的基本信息，要求是除了展示头像和姓名外，普通用户展示最近收藏文章数，签约作者展示新增粉丝数，如下图所示，想一下这个用户信息组件UserInfo应该怎么设计？

![07 不同用户个人信息.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4478930b7d44bbd8d2cda8ead764f4d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=517&h=305&s=22733&e=png&b=fefefe)

一种思路是我们直接实现一个UserInfo组件，在内部根据type类型，请求不同的接口，渲染不同的UI，用vue简单实现如下：

    <template>
        <div>
            <img :src="avatar"/>
            <div>
                <span>{{ name }}</span>
              
                <span v-if="type === 'reader'">普通用户，最近收藏了 {{collectCount}} 篇文章</span>
                <span v-else>签约作者，最近新增了 {{ fansCount }} 个粉丝</span>
            </div>
        </div>
    </template>
    
    <script>
    export default {
        name: "UserInfo",
        props: ['userId', 'type'],
        data(){
            return {
                avatar: '',      //头像
                name: '',        //姓名
                collectCount: 0, //收藏数量
                fansCount: 0,    //粉丝数量
            }
        },
        mounted() {
            //根据userId获取用户基本信息
            //根据type获取用户收藏数量或粉丝数量
        }
    };
    </script>
    

这么实现看似没有什么问题，但是却隐藏了一个耦合逻辑，由于普通用户详情和签约作者详情都是基于这一个组件渲染，在展示普通用户详情时，有可能引发签约作者相关代码执行，这本是不必要的依赖。而且在修改签约作者相关需求时，稍有不慎就可能影响到普通用户详情的展示，当然了，现在这个示例很简单，元素、数据以及方法都很少，不太容易引入额外的bug，但如果这个页面足够复杂，谁也无法保证二者是否会互相影响。

普通用户详情应该基于普通用户详情组件ReaderUserInfo进行展示，签约作者详情基于签约作者组件 WriterUserInfo组件展示，ReaderUserInfo 和 WriterUserInfo 可以复用相同部分BaseUserInfo，不同部分各自处理各自的逻辑。

BaseUserInfo实现如下，展示用户头像和名称，并提供插槽用来扩展其他要展示的信息。

    <template>
        <div>
            <img :src="avatar"/>
            <div>
                <span>{{ name }}</span>
                <slot></slot>
            </div>
        </div>
    </template>
    
    <script>
    export default {
        name: "BaseInfo",
        props: ['userId'],
        data(){
            return {
                avatar: '',      //头像
                name: '',        //姓名
            }
        },
        mounted() {
            //根据userId获取用户基本信息
        }
    };
    </script>
    

普通用户详情ReaderUserInfo实现如下：

    <template>
        <BaseUserInfo>
            <span>普通用户，最近收藏了 {{collectCount}} 篇文章</span>
        </BaseUserInfo>
    </template>
    
    <script>
    import BaseUserInfo from "@/BaseUserInfo";
    export default {
        name: "ReaderUserInfo",
        components:{
            BaseUserInfo
        },
        props: ['userId'],
        data(){
            return {
              fansCount: 0
            }
        },
        mounted() {
            //获取用户收藏文章数量
        }
    };
    </script>
    

签约作者详情WriterUserInfo实现如下：

    <template>
        <BaseUserInfo>
          <span>签约作者，最近新增了 {{ fansCount }} 个粉丝</span>
        </BaseUserInfo>
    </template>
    
    <script>
    import BaseUserInfo from "@/BaseUserInfo";
    export default {
        name: "WriterUserInfo",
        components:{
            BaseUserInfo
        },
        props: ['userId'],
        data(){
            return {
              fansCount: 0
            }
        },
        mounted() {
            //获取用户粉丝数量
        }
    };
    </script>
    

通过这种改造之后，普通用户详情组件和签约作者详情组件不再发生高度耦合，每个组件只包含应该包含的最少量代码，而且组件内部实现也不再有令人讨厌的各种if-else，增强了代码可读性。

通过遵守接口隔离原则，可以让我们写出更加解耦的函数、模块或组件，而且也肯定会更加符合单一职责原则，同时也降低各个模块的代码量，并增强代码可读性以及可维护性。

依赖倒置原则 DIP
==========

> 依赖倒置原则（Dependency Inversion Principle）是指高层模块不应该依赖于低层模块的具体实现，而应该依赖于抽象，抽象不应该依赖于具体实现，具体实现应该依赖于抽象。

通过依赖倒置原则，可以改变高层（如业务层）与底层（如第三方底层库）之间的依赖关系的，将高层与底层实现解耦。

比如公司为福特和本田两家公司开发了一套自动驾驶系统，只要安装到两家汽车上就能实现自动驾驶功能。

我们定义了一个自动驾驶系统类AutoSystem，一个福特汽车类FordCar，一个本田汽车类HondaCar。

假设福特汽车和本田的启动方法不一样，一个是run、一个是driver，在自动驾驶系统里面要启动汽车就要区分二者。

    class HondaCar{
        run(){
            console.log("本田开始启动了");
        }
    }
    class FordCar{
        driver(){
            console.log("福特开始启动了");
        }
    }
    
    class AutoSystem {
        run(car){
            if(car instanceof HondaCar){
                car.run()
            }else if(car instanceof FordCar){
                car.driver()
            }
        }
    }
    

现在公司业务壮大了，即将为宝马汽车安装自动驾驶系统，宝马汽车的启动汽车方法为startCar，那么自动驾驶系统又要进行修改，以支持宝马汽车。

    class HondaCar{
        run(){
            console.log("本田开始启动了");
        }
    }
    class FordCar{
        driver(){
            console.log("福特开始启动了");
        }
    }
    class BmwCar {
        startCar(){
            console.log("宝马开始启动了");
        }
    }
    
    class AutoSystem {
        run(car){
            if(car instanceof HondaCar){
                car.run()
            }else if(car instanceof FordCar){
                car.driver()
            }else if(car instanceof BmwCar){
                car.startCar()
            }
        }
    }
    

随着后续业务的壮大，自动驾驶系统里面会充斥着各种if-else，这还是只存在启动汽车一个方法的示例，实际情况肯定更复杂，每次谈下合作方，自动驾驶系统都要做大量的适配，显然这是很不合理的，自动驾驶系统和具体车型存在严重耦合。这正是因为高层应用依赖了底层实现，假设我们要求所有的汽车都应该有固定的方法，也就是后端常说的接口interface，那么自动驾驶系统就不再需要频繁改动，每次增加新的车型，只要增加相应的汽车类接口。

    class HondaCar{
        run(){
            console.log("本田开始启动了");
        }
    }
    class FordCar{
        run(){
            console.log("福特开始启动了");
        }
    }
    class BmwCar {
        run(){
            console.log("宝马开始启动了");
        }
    }
    
    class AutoSystem {
        run(car){
            car.run()
        }
    }
    

可以看到自动驾驶类AutoSystem大大简化了，而且后续也不再耦合具体车型了，这里自动驾驶系统类可以看做高层模块，每个汽车类可以看做底层模块，高层不应该依赖于底层的实现，而应该制定规范，让底层模块去实现，这样高层模块就不再依赖底层模块。

再举个前端项目中经常会遇到的示例。

在绝大部分前端项目中都会用到网络请求的第三方库，比如axios、fetch等，如果我们直接在页面中直接调用axios的方法进行网络请求，那么假如有一天我们要更换网络请求库，或者升级网络请求库的版本，如果新的请求库方法名称、传参顺序和之前的不一致了，就会带来大量的修改工作，也就是我们的系统和第三方库严重耦合在了一起。

再深入思考一下，我们其实需要的是网络请求，而不是axios，我们要怎么进行网络请求，不应该依赖于axios提供怎样的接口，而是我们想要定义怎样的网络请求接口，然后利用axios或者其他任意网络请求库去实现它。我们常犯的问题是市面上的第三方库怎么设计的我们就怎么用，而不是我们想要怎样的服务标准，然后用第三方库去实现它，记住，一流的程序员定标准。

回到正题，我们可以定义一个网络请求模块request，定义自己想要的方法和传参顺序，request内部调用axios的接口进行实现。

    import axios from 'axios'
    function request(url, options){
        return axios(url, options).then(res =>{
            
        }).catch(e =>{
            
        })
    }
    
    function get(url, params){
        return request(url, {
            method: 'GET',
            params
        })
    }
    
    function post(url, body, params){
        return request(url, {
            method: 'POST',
            body,
            params
        })
    }
    export default {
        get,
        post
    }
    

改造后的页面中的网络请求

    import request from '@/utils/request'
    function getData(url, params){
        request.get(url, params)
    }
    

通过这样的改造，即使以后axios的接口传参方式发生了变更，或者我们直接更换axios为fetch，也都非常容易进行，只需要修改request的实现即可，业务代码无需任何变更。因为我们通过这种依赖倒置的方式，已经完成了项目和第三方库的解耦。

![04-网络请求解耦.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b45acaf192341f288e611f3aaee0c76~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1194&h=884&s=114442&e=png&b=fefefe)

后端也存在类似的问题，比如后端进行日志保存时，如果直接依赖Log4j这样的日志框架，则后续要更换日志框架就会带来大量的修改， 同样的，我们可以封装一个日志类，然后用第三方的Log4j去实现它，完成项目和具体日志框架的解耦。

高内聚低耦合
======

> 高内聚低耦合是判断软件设计好坏的一个标准，它强调类应该具有高内聚性和低耦合性。具体来说，高内聚意味着将相关代码组织在一起，以便它们可以共同完成一个任务或实现一个功能；而低耦合则意味着将模块之间的依赖关系降至最低，以便更容易进行维护和修改。

高内聚低耦合是一个非常重要的软件设计原则，通常项目中最难修改的问题都是因为强耦合造成的，最经典的就是修改一个模块的bug导致其他模块引发了N个新的bug，让人非常的痛苦。

高内聚描述的是模块内部的紧密关系的，一个模块内部的子模块应该是为了共同完成一个任务而被组织在一起的，他们之间应该有很强的逻辑相关性。

有个常见的反例就是项目下的utils.js，其中经常包含很多不太相关的方法，有的是处理日期的，有的是处理字符串的，还有的是处理前端存储相关的，各个方法之间并没有逻辑相关性，唯一的共同点就是他们都是工具函数，这个内聚性就比较低。

    //utils.js
    
    //格式化日期
    export function formatDate(date, formatter){
    
    }
    
    //生成随机字符串
    export function generateRandomString(length){
    
    }
    //方法之间没有相关性
    

低耦合是描述模块之间的依赖关系的，模块之间的耦合有很多种方式，比如模块之间互相调用方法、依赖共同的全局数据，都会造成模块之间互相影响。

比如在前面我们提到的，组件之间不通过接口通信，而是强行访问组件内部的非公开状态或方法，都是一种深度耦合。

    
    this.$refs['editor'].$refs['innerEditor'].setContent('');
    

现在前端的组件化开发就是高内聚低耦合的一个非常好的实践，它允许我们将界面拆分成小的、可重用的部分，每个部分都负责一个特定的功能或展示。每个组件都高度内聚，只关注自己的功能和UI展示，并且与其他组件低耦合，通过props和events进行必要的数据传递和交互。如果你的组件内部各功能之间联系并不那么紧密，那么可能是时候拆分组件了。

我们看看下面这段简化的关于编辑用户和删除用户的代码：

    <template>
        <button class="edit-user"
            @click="editUser" 
        >
          编辑用户
        </button>
        <button @click="deleteUser">删除用户</button>
        <edit-user-dialog ref="edit-user-dialog"/>
    </template>
    <script>
    export default {
        methods:{
            editUser(){
                //编辑用户逻辑
            },
            deleteUser(){
                //删除用户逻辑
            }
        }
    }
    </script>
    <style>
    .edit-user {
    
    }
    </style>
    

其中，有一部分Dom、逻辑和样式是关于编辑用户操作的，而还有一部分Dom、逻辑是关于删除用户的。本应该紧密关联的编辑用户的代码，分散在了各处，其中还穿插着删除用户的代码，两块本应各自内聚到一起的代码现在混在了一起，导致整体的内聚性变低了，这是我们业务开发中非常常见的一个问题。

其实我们完全可以把编辑相关的抽取到一起，删除相关的抽取到一起。针对这个简单的示例，日常开发中并不是必须要抽取，代码量并不多，不抽取问题也不大，而对于一些复杂的页面，是值得按照这个思路去抽取的，这里只是为了说明思路，用了一个比较简单的示例。

把编辑用户的代码抽取为一个新的组件，可以看到，Dom、逻辑、样式都是高度内聚的，我们平时抽取组件也都是按照这个原则进行的。

    <template>
        <button class="edit-user"
            @click="editUser" 
        >
          编辑用户
        </button>
        <edit-user-dialog ref="edit-user-dialog"/>
    </template>
    <script>
    export default {
        methods:{
            editUser(){
                //编辑用户逻辑
            }
        }
    }
    </script>
    <style>
    .edit-user {
    
    }
    </style>
    

所谓**高**内聚**低**耦合而不是**纯**内聚**无**耦合，也是因为这本来就是比较难把握的，模块之间不可能没有耦合，没有耦合也就没法相互支撑了，模块内部也不可能无限制的抽取，过度追求内聚也导致封装层次过深，所以还是那句话，软件开发是平衡的艺术。

后面我们有专门的一节内容来讲解如何降低耦合，这里也不再展开。

总结
==

*   **最少知识原则LOD：**

只与你的直接"朋友"交谈，不跟"陌生人"说话，即模块(包括组件、对象)只和最紧密相关的模块通过接口通信，尽量减少关联的模块数量。

广义的最少知识原则可以理解为，只通过少量的业务知识储备，就可以去轻松地维护或者使用你写的代码。

*   **DRY原则：**

不要重复自己，尽量使用函数、类或模块来封装可复用的代码片段。重复发生原因有多种，有的是因为不知道有重复，这种大都是团队沟通和工作流程问题；有的是因为没有认识到重复的危害，懒着去提取；还有的是因为代码耦合严重，导致无法复用。根据重复发生的原因针对性解决。

*   **KISS原则（Keep It Simple, Stupid）**：

要把用户当”傻子“，用户不只是产品的用户，你的同事也是你代码的用户，保持代码简单易懂，避免过度复杂化，尽量使用简洁的解决方案

*   **YAGNI原则（You Ain't Gonna Need It）：**

不要过度设计，选用刚刚好能解决当下问题的方案，面向现在编程而不是面向未来编程。

但要注意不过度设计不等于不设计，该提取组件的，该抽取方法的一样要抽取，不是复用才要抽取，不能把这个原则当做自己不进行前端设计的挡箭牌。

*   **SOLID原则：**
    
    *   **单一职责原则（SRP）**：一个模块只有一个修改它的原因
    *   **开闭原则（OCP）**：对扩展开发，对修改关闭
    *   **里氏替换原则（LSP）**：任何基类（父类）可以被其子类替换
    *   **接口隔离原则（ISP）**：实现一个方法、组件时，不要依赖不需要的内容（数据、组件等），依赖关系应该尽可能小
    *   **依赖倒置原则（DIP）**：高层模块不应该依赖于低层模块的具体实现
*   **高内聚低耦合**：模块内部应该紧密相关，模块之间的依赖应该尽量减少。