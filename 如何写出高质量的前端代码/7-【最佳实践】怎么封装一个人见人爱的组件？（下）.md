书接上文，本节我们继续介绍如何提升组件的另外两个指标：可读性和正交性，并探讨写好一个组件的正确流程，最后我们运用本章所学知识开发一个组件，演示下我是如何在实际工作中进行组件开发思考和设计的。

如何写出好组件
-------

### 可读性

能不能很快知道一个组件是做什么用的、怎么实现的，主要依靠组件的可读性，要提升组件可读性需要很多技巧，不是一招一式可以解决的，也不是一朝一夕可以练就的，需要在每次编写组件时反复推敲。

提升可读性也有一些具体的方法，我们一起来看下。

*   **组件命名**

组件命名要能体现组件的功能，看一眼名字就能知道这个组件大概是做什么用的，比如AddUserDialog，一看就知道这个组件是添加用户用的，而且是个弹窗组件。

关于命名，后面我们单独开设一个章节来详细讲解，这里就不多说了。

*   **顶部注释**

组件顶部可以增加一段注释，介绍这个组件的作用、适用场景、注意的问题等，当然了一些项目中还会添加作者、创建/修改时间等信息，但是我觉得这些信息不是必须的，因为组件的作者和修改时间在git中都能查到，而且一个组件会经手很多人，信息也容易失真。

*   **结构化开发**

一个组件有一个组件的主线任务，组件内的代码应该围绕主线任务展开，非主线任务应该封装成子组件、utils库、配置文件等供其调用，我们要能一眼看到这个组件的主线任务是如何开展的，而不是被一些杂乱的信息阻碍视线。

以添加用户弹窗为例，它的主线任务是什么呢？是不是主要包括：初始化表单数据、配置表单校验规则和请求添加用户的API。至于其他的，比如用户头像怎么上传，上传后怎么裁剪、上传时候调用什么接口，就不属于主线任务，就不应该将这些细节放在这个组件内部，否则大量的这种杂乱信息会让你摸不清主线，搞不懂整个组件的实现逻辑，你可以将这些细节抽取到一个新的组件之中。

一个组件应该由多个单一功能的子组件构成，而不是所有细节混在一块。

*   **显式修改数据**

组件内部的数据变化应该全部是显式的，不要通过隐式的方式去修改数据，比如在父组件中给子组件传值，子组件却在内部修改了父组件的值，如下所示，在child1和child2中对父组件的formData进行了修改，那么当你在看这个组件的时候，你知道formData会被谁修改吗，会怎样修改呢？你能轻易地读懂该组件的逻辑吗？肯定不会的，你必须要把所有的子组件也查看一遍，你才会知晓formData的变化过程。

    <template>
        <div>
            <child1 :data="formData" />
            <child2 :data="formData" />
        </div>
    </template>
    <script>
    export default {
        data(){
            return {
                formData:{
                    key1: {},
                    key2: {}
                }
            }
        }
    }
    </script>
    

**子组件不能修改父组件传递过来的props数据**，这应该是组件开发的一个重要原则，谨记。

更好的方式就是子组件对外抛出事件。

    <template>
        <div>
            <child1 :data="formData" @change="child1Change"/>
            <child2 :data="formData" @change="child2Change"/>
        </div>
    </template>
    <script>
    export default {
        data(){
            return {
                formData:{
                    key1: {},
                    key2: {}
                }
            }
        },
        methods:{
            child1Change(value){
                this.formData.key1 = value;
            },
            child2Change(value){
                this.formData.key2 = value;
            }
        }
    }
    </script>
    

改造后的数据变更逻辑一目了然，如果formData.key1的值不符合预期，那么你很容易知道要去排查child1的实现，这对我们后续排查bug非常重要。

*   **区分元数据和派生数据**

现在组件开发都是数据驱动，所以应该重视数据的设计，对于每个组件的内部状态，我们应该仔细思考下，哪些是必须的数据，即元数据，哪些是基于元数据产生的数据，也就是vue中的计算属性，我们可以把这些称为派生数据。

比如现在有个用户列表页，展示用户列表，总人数和vip人数，如果没有很好的划分数据，可能会用三个状态表示这三个数据。

    <script>
    export default {
        data(){
            return {
                userList: [],
                totalCount: 0,
                vipCount: 0
            }
        },
        methods:{
            init(){
                this.userList = [
                    {id:1, name: 'zhangsan', isVip: true}, 
                    {id: 2, name: 'lisi', isVip: false}
                ];
                this.totalCount = this.userList.length;
                this.vipCount = this.userList.filter(item => item.isVip).length;
            },
            updateUserList(){
                this.userList = [
                    {id:1, name: 'zhangsan', isVip: true},
                    {id: 2, name: 'lisi', isVip: false}
                ];
                this.totalCount = this.userList.length;
                this.vipCount = this.userList.filter(item => item.isVip).length;
            }
        }
    }
    </script>
    

可以看出没有仔细区分元数据和派生数据，会导致整体逻辑非常繁琐/重复，而且当元数据变更时，一定要记得同步修改其他数据，一旦忘记了修改，就会导致bug。

totalCount和vipCount依赖userList，所以它们两个应该是派生数据，可以将他们改造为计算属性。

    <script>
    export default {
        data(){
            return {
                userList: []
            }
        },
        computed:{
            totalCount(){
                return this.userList.length;
            },
            vipCount(){
                return this.userList.filter(item => item.isVip).length;
            }
        },
        methods:{
            init(){
                this.userList = [
                    {id:1, name: 'zhangsan', isVip: true}, 
                    {id: 2, name: 'lisi', isVip: false}
                ];
            },
            updateUserList(){
                this.userList = [
                    {id:1, name: 'zhangsan', isVip: true},
                    {id: 2, name: 'lisi', isVip: false}
                ];
            }
        }
    }
    </script>
    

修改后，各个数据怎么变化一清二楚，能够很快了解整个组件的数据变化过程。

如果你发现每次修改一个数据后，都要紧跟着修改另一个数据，那么要考虑是不是应该把它作为派生数据处理了。

*   **不要滥用watch**

对于watch，vue官方文档中有着很明确的说明，只有会产生副作用的场景，才会用到watch，其他场景不应该用watch，而是计算属性，也就是咱们说的派生数据。

我们将上面的例子改为通过watch来实现，对比计算属性看看有什么缺点。

    <script>
    export default {
        data(){
            return {
                userList: [],
                totalCount: 0,
                vipCount: 0
            }
        },
        watch:{
            userList(){
                this.totalCount = this.userList.length;
                this.vipCount =this.userList.filter(item => item.isVip).length;
            }
        },
        methods:{
            init(){
                this.userList = [];
            },
            updateUserList(userList){
                this.userList = userList;
            }
            //其他逻辑
        }
    }
    </script>
    

虽然也可以看到totalCount和vipCount的变化逻辑，但是你能确定只有在这个watch中会修改这两个数据吗？万一还有其他方法修改totalCount和vipCount呢。而对于计算属性，则不存在这个问题，因为计算属性是只读的，不会存在其他方法对其进行修改。而且使用watch还要关注数据的初始化值问题，以及watch是否立即执行问题。

尽量使用计算属性替代watch吧。

### 正交性

正交性代表着耦合程度，耦合低，正交性好，反之正交性差，后面我们专门会有一个章节来介绍如何提升正交性。

组件的耦合一般可以分为这几种：父组件耦合子组件、子组件耦合父组件、组件耦合外部数据、组件耦合太多的业务逻辑等。

*   **父组件耦合子组件**

父组件和子组件通信一般只能有这3种：传递props属性、接收子组件事件和调用子组件对外提供的方法，这是符合组件设计哲学的三种通信方式，子组件对父组件来说，应该相当于一个黑盒，父组件只能通过子组件提供的接口进行通信。

以下是一些不推荐的使用方式：

a. 访问组件的内部状态

如下，父组件试图修改子组件的内部数据

    <template>
        <MyButton ref="button">按钮</MyButton>
    </template>
    <script>
    export default {
        mounted(){
            //错误用法，不应该直接操作其内部data
            this.$refs['button'].color = 'red';
        }
    }
    </script>
    

b. 访问子组件的内部dom

    <template>
        <MyButton ref="button">按钮</MyButton>
    </template>
    <script>
    export default {
        mounted(){
            //错误用法，不应该直接操作其内部data
            this.$refs['button'].$refs['innerButton'].method();
        }
    }
    </script>
    

这种情况更糟糕，不仅耦合了子组件，还耦合了孙组件，如果后续我们要优化这个MyButton组件，谁能想到，你只是修改了某个dom的ref名称，就导致系统出现了bug。

正确做法应该在MyButton中提供一个对外的method，在这个method内部调用$refs\['innerButton'\].method()。

*   **子组件耦合父组件**

子组件和父组件通信，标准的做法只有两种：接收父组件传来的props、向父组件抛出事件，除此之外都属于非标操作。

同样的，我们看看子组件不推荐的做法：

a. 修改props

前面我们说过这个了，子组件不能擅自修改父组件传来的props，这会导致父组件的可读性降低，父组件中无法预期是谁修改了自己的内部状态；其二，如果父组件传来的props后面改成克隆数据，这不就产生bug了吗？

    <script>
    export default {
        props: ['data'],
        methods:{
            edit(){
                // 错误，不能修改props
                this.data.type = 'vip'
            }
        }
    }
    </script>
    

b.调用父组件方法或修改父组件数据

    <script>
    export default {
        methods:{
            edit(){
                this.$parent.data.type = 'vip'; //修改父组件方法
                this.$parent.method();  //调用父组件方法
            }
        }
    }
    </script>
    

当你在看父组件逻辑时，你做梦也想不到居然有子组件把它的内部状态给修改了。

c. 子组件指挥父组件做事

子组件只能向父组件上报自己完成了什么事情，而不应该指挥父组件去做一些事，子组件是父组件的下级，指挥父组件就越权了。

比如我们前面常说的添加用户弹窗组件AddUserDialog，在添加用户后，需要向父组件抛出事件，很多同学都喜欢抛出类似"refresh"名称的事件，告诉父组件刷新用户列表。

    <script>
    //AddUserDialog
    export default {
        methods:{
            save(){
               this.$emit('refresh');
            }
        }
    }
    </script>
    

添加用户完成后，父组件一定是进行刷新操作吗？子组件又如何知道别人将会怎么使用自己呢？当你抛出refresh事件的时候，是不是已经耦合了父组件的处理逻辑呢？如果父组件不是进行refresh操作怎么办？

    <template>
        <AddUserDialog @refresh="reload"/>
    </template>
    <script>
    export default {
        methods:{
            reload(){
               //父组件并没有采用refresh，而是采用了重载reload，显然这很不好
            }
        }
    }
    </script>
    

父组件需要怎么处理事件，是父组件的事情，子组件只需要告诉父组件，当前发生了什么即可，比如可以抛出名为addSuccess、success、saved、addFail、error等事件。

    <template>
        <AddUserDialog @addSuccess="reload"/>
    </template>
    <script>
    export default {
        methods:{
            reload(){
               
            }
        }
    }
    </script>
    

*   **组件耦合外部数据**

外部数据有很多不同的类型，如全局变量、全局状态、url参数、cookie、localStorage等。如果一个组件耦合了外部数据，那么这个组件就很难复用，你不能保证换一个环境还能有这些外部数据，这些外部数据本身就代表着某种业务逻辑，耦合外部数据也就耦合了具体业务。

比如一个用户详情组件，可能需要获取用户id，如果直接从url中获取，那么这个组件就耦合了url参数，如果我们想在用户列表中查看用户详情，可能就用不了这个组件了，因为用户列表的url中不会有具体的userId。

    // 用户详情组件，耦合了url参数
    <script>
    export default {
        data(){
            return {
                userId: this.$route.params.userId   //耦合了url参数
            }
        }
    }
    </script>
    

更好的方式是将userId作为props传入，这样就可以在任意地方使用这个组件了，组件本身不再关心userId从何而来，url获取也好，列表获取也好，都不是这个组件需要关心的事情。

我们避免不了要使用外部数据，只是尽量减少耦合外部数据的组件数量，比如用户详情页面肯定要通过url获取用户id的，这是不可避免的，但是用户详情中调用的其他组件，未必都需要从url获取这个id，完全可以通过props传入。

*   **组件耦合过多业务逻辑**

有时候为了组件调用方便，我们会把很多业务逻辑放在组件内部，这确实提升了组件的易用性，但是也带来了耦合问题。

比如某个系统有用户列表、VIP列表、超级VIP列表，三者复用同一个组件 MemberList，用户列表有添加用户按钮，VIP列表有添加VIP按钮，超级VIP列表有添加超级VIP按钮，用户列表允许删除用户，而VIP和超级VIP不允许删除，为了实现这个功能，我们对外暴露了一个type属性，三个页面分别传递不同的type，简化版实现如下：

    //MemberList组件
    <template>
        <div>
            <div class="operate">
                <button v-if="type==='ordinary'">添加用户</button>
                <button v-if="type==='vip'">添加VIP</button>
                <button v-if="type==='super-vip'">添加超级VIP</button>
            </div>
            <MyTable>
                <template slot="operate" slot-scope="props">
                    <button v-if="type!=='ordinary'">删除</button>
                </template>
            </MyTable>
            <!-- 省略各种逻辑 -->
        </div>
    </template>
    <script>
    export default {
        props: ['type'],
    }
    </script>
    

调用确实很简单，符合咱们前面说的提升易用性的原则，但是这样有什么坏处呢？

    <MemberList type="ordinary"/>
    <MemberList type="vip"/>
    <MemberList type="super-vip"/>
    

当一个新人面对MemberList组件的时候，很难说清楚每个type都对应哪些操作，他必须仔细翻看全部代码才能有所了解，当要修改一些逻辑时，也很容易因为不了解不同业务的需求而导致bug产生。

那我们换个思路，如果对外暴露一些属性来控制某个按钮的显隐呢，比如canAddUser、canAddVIP、canAddSuperVIP、canDelete，每个属性控制一个按钮的显隐，这样就可以把MemberList组件的内部逻辑改造如下：

    //MemberList组件
    <template>
        <div>
            <div class="operate">
                <button v-if="canAddUser">添加用户</button>
                <button v-if="canAddVIP">添加VIP</button>
                <button v-if="canAddSuperVIP">添加超级VIP</button>
            </div>
            <MyTable>
                <template slot="operate" slot-scope="props">
                    <button v-if="canDelete">删除</button>
                </template>
            </MyTable>
            <!-- 省略各种逻辑 -->
        </div>
    </template>
    <script>
    export default {
        props: ['canAddUser', 'canAddVIP', 'canAddSuperVIP', 'canDelete']
    }
    </script>
    

调用时告诉组件显示哪些按钮。

    <!--用户列表-->
    <MemberList :can-add-user="true" can-delete="true"/>
    <!--VIP列表-->
    <MemberList :can-add-vip="true" can-delete="false"/>
    <!--超级VIP列表-->
    <MemberList :can-add-super-vip="true" can-delete="false"/>
    

通过这种改造有几个好处，第一组件内部没有耦合业务逻辑，每个按钮显示与否仅取决于外部怎么调用，第二可以通过调用方传参知道每个页面具体有哪些逻辑，比如你看到上面用户列表的传参就能知道，用户列表页可以展示添加用户按钮和删除按钮。把控制权交给业务方也有好处，首先业务方肯定知道应该展示什么不展示什么，其次方便业务方修改逻辑，比如有一天VIP列表允许删除了，就把canDelete设为true即可，不需要修改组件内部逻辑。

通过这种改造，确实降低了MemberList的易用性，但是减少了耦合，也增加了调用方的可读性，所以组件开发并不是简单的提升某一个指标，而是要综合考虑各种因素，进行一个平衡。

**平衡术**是软件开发中的一个重要技术，需要经验积累，反复思考，才能窥探一二。

开发组件的流程
-------

那么在日常组件开发中，我们应该遵循怎样的流程才能写好组件呢？作者平时开发组件一般遵循这样的流程：明确组件定位 -> 列举组件使用示例 -> 确定组件的接口 -> 设计组件的内部数据 -> 梳理组件的交互逻辑 -> 编码。

### 明确组件的定位

在开发一个组件之前，我们要先想清楚我们这个组件到底属于什么类型的组件，比如是通用组件还是业务组件，是纯UI组件还是带状态组件，是表单组件还是展示组件，不同类型的组件定位，决定着后续组件如何设计。

我们以国外一个高赞的组件库chakra-ui(github当前33.6k)中的table组件为例，如果用这个组件写你的业务你感觉怎样？你觉得这是个好组件吗？

    <!--chakra-->
    <TableContainer>
      <Table variant='simple'>
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <Thead>
          <Tr>
            <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>millimetres (mm)</Td>
            <Td isNumeric>25.4</Td>
          </Tr>
          <Tr>
            <Td>feet</Td>
            <Td>centimetres (cm)</Td>
            <Td isNumeric>30.48</Td>
          </Tr>
          <Tr>
            <Td>yards</Td>
            <Td>metres (m)</Td>
            <Td isNumeric>0.91444</Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
    

如果每个业务表格都用这个组件写，会不会觉得简直要疯了，这样实现一个业务表格代码也太多了吧，易用性太差了。可是如果我们用它作为基础组件，在它之上封装一个定制的表格组件会不会很容易，因为它的每个部分都可以通过代码进行修改，所以可以很容易的进行各种扩展，这么想是不是这个组件也没有之前想的那么差，所以要评价一个组件好不好，首先要看这个组件的定位是什么，不同定位的组件有不同评价标准。

对于一个基础组件来说，更重要的是通用性，易用性可以适当让步；而作为一个业务组件，易用性则显得更重要些。当你要开发一个组件时，你必须先想明白，我写的这个组件是通用的，还是只为某个具体业务服务的，如果是通用的，就不应该耦合业务逻辑。

如果你想实现一个表单组件，那么它就应该支持名为value的属性，并对外抛出onChange事件；如果你认为这个表单组件是受控组件，那么它就应该监听value的变化并更新内部状态；如果你认为它是非受控组件，那么value只用于初始化内部状态。

明确组件的定位至关重要，后面怎么设计，都依赖于它的定位，所以在开发一个组件之前，先想一想你到底想要一个什么样的组件。

### 列举组件使用示例

在开发组件时，不要着急编码，先假设组件已经开发好了，给出怎么使用的示例，然后交给团队进行评审，看看你开发的组件是否符合大家的需求，而不是等代码都写完了才拿出来评审。

比如我要开个一个显示日志的组件，我可能会先写出来最终的使用方式，如下：

    <!--组件支持传递log内容-->
    <CommonLog :log="log"/>
    
    <!--组件支持自行获取log内容， 需要传递一个函数-->
    <CommonLog :get-log="getLogFunction"/>
    <script>
         export default {
             methods: {
                 getLogFunction(){
                     return '';
                 }
             }
         }
    </script>
    
    <!--组件支持自动刷新数据，间隔为2000ms-->
    <CommonLog :get-log="getLogFunction" 
               auto-refresh
               :interval="2000"
    />
    
    <!--其他示例-->
    

有了这个使用示例，别人就知道了以后怎么使用你的组件，也可以据此给你提出修改建议，这个示例也相当于我们开发的目标，做事情之前应该先定目标。

### 确定组件的接口

组件的接口一般包含四部分：属性props、事件events、方法methods和插槽slots。

可以像ElementUI文档那样，将每个组件的接口以图表形式展示出来，同样的，接口应该在开发之前就确定并参与评审。

以Input组件为例，我们来看看它的接口文档。

Input 属性

参数

说明

类型

可选值

默认值

type

类型

string

text，textarea 和其他 原生 input 的 type 值

text

value / v-model

绑定值

string / number

—

—

Input 事件

事件名称

说明

回调参数

blur

在 Input 失去焦点时触发

(event: Event)

focus

在 Input 获得焦点时触发

(event: Event)

Input 方法

方法名

说明

参数

focus

使 input 获取焦点

—

blur

使 input 失去焦点

—

Input 插槽

name

说明

prefix

输入框头部内容，只对 type="text" 有效

suffix

输入框尾部内容，只对 type="text" 有效

### 设计组件的内部数据

在前面我们讲过，组件的内部数据可以分为元数据（data）和派生数据（computed），开发一个组件之前，应该先把所有组件用到的数据列举出来，然后看看哪些是元数据，哪些可以根据元数据推算出来，进而确定组件的数据结构。

同样的可以将元数据和计算数据以伪代码形式展示出来。

    // 用代码或伪代码形式，展示组件的内部数据结构
    export default {
        data(){
            return {
                loading: false, //是否展示loading
                list: [] //列表数据
            }
        },
        computed:{
            vipList(){
                //对list进行过滤，找出所有vip会员。
                return this.list(item => item.isVip);
            },
            vipCount(){
                //vipList的长度
                return this.vipList.length;
            }
        }
    }
    

### 梳理组件的交互逻辑

现在数据有了，就差逻辑了，我们可以用图或者文字的形式，描述下组件内部各个交互的具体流程是怎样的。

有时候为了效率，就不画图了，简单列举下每个交互的处理逻辑。

    组件挂载时：请求**接口，初始化**数据
    点击删除按钮时： 校验**，然后二次确认，确认后将loading设为true，调用**接口，关闭loading，toast删除成功
    点击保存按钮时：表单校验，不通过滚动到表单失败处；通过后loading设为true，调用**接口，关闭loading，toast添加成功
    

### 编码

到了这里，才能进入编码阶段，有很多同学是跳过了以上所有步骤直接来到这里，一遍开发一边想，哪里不合适了再去调整，这样做有很多问题。

*   直接编码无法进行设计评审，评审成了后置工作而非前置工作
*   容易考虑不周遗漏逻辑
*   容易底层设计不对，导致推翻重来
*   无法锻炼设计能力，不利于以后开发大型组件

有了前面详细的设计文档，编码阶段就变的很轻松了，基本上照着文档抄，编码过程中只是进行微小的改动。

怎么知道自己的设计能力强不强呢，就看编码相比你的设计改动了多少，改动的越少，说明你的设计能力越强，改动的越多，说明设计能力还需要继续锻炼，经过一段时间的刻意训练，相信你会爱上设计。

实战
--

关于组件相关的理论部分我们已经学习完了，接下来我们通过一个实际组件的封装来看看怎么运用我们本节所学的知识。

在很多列表页中，我们都会看到如下图所示的搜索表单，左侧是一些表单项，每个列表页各不相同，右侧固定为两个按钮，点击查询按钮，会触发列表根据表单项的值进行刷新，点击重置按钮会将表单项恢复为初始值，同时也会触发列表刷新。篇幅限制对组件做一些简化，暂不考虑搜索项过多时的展开收起功能，我们假定搜索项一般只有1-3个，不会发生需要隐藏的情况。

![demo-ui.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb5f3163394f496bb9b372372d617c88~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=981&h=61&s=7564&e=png&b=fefefe)

如果不进行封装，每个列表都会有很多重复代码，其中查询和重置操作无论在UI还是处理逻辑上，每个列表页都是相同的，没必要都写一套；表单项的配置有点繁琐，每次都要维护一个Form，为此我们想封装一个搜索表单组件SearchForm来解决这个问题。

接下来的内容均是我开发这个组件之前先撰写的。

### 组件定位

我期望实现一个项目通用的**基础组件**SearchForm，所以该组件**不应该耦合任何业务逻辑**。由于是基础组件，所以在**通用性上要加强**，要能满足各种场景，比如每个搜索项的label和表单项要支持自定义，每个表单项的宽度，表单项之间的间隔，label的宽度等都要能够支持自定义。

为了让大家更爱用我的这个组件，我要**加强组件的易用性**设计，期望可以通过一个config配置来驱动表单的生成，减少页面中繁琐的dom元素。

### 使用示例

*   示例1：通过一个数组配置表单项，表单对外暴露search事件，通知列表刷新。

这个数组配置怎么命名呢，在ElementUI中经常用fields表示表单项，所以我们沿用这个习惯，将这个数组命名为fields，在fields中配置每个搜索项的key、label和组件component，component可以为字符串，如input、select、radio、switch等常见的表单类型。

    <template>
        <SearchForm :fields="fields" @search="search"/>
    </template>
    <script>
    export default {
        data(){
            return{
                fields:[
                    {
                        key: 'rule',
                        label: '规则名称',
                        component: 'input'
                    },
                    {
                        key: 'description',
                        label: '描述',
                        component: 'input'
                    }
                ]
            }
        },
        methods:{
            search({rule, description}){
                //根据搜索项的值进行查询
            }
        }
    }
    </script>
    

可以看出，咱们要封装的这个组件大大简化了搜索表单的代码，简单配置就完成了复杂的功能。

*   示例2：组件的样式支持配置

支持配置每个表单项之间的间隔，我们参考ElementUI布局组件，将这个间隔属性命名为gutter，默认间隔我们设为20px；支持配置所有表单项的默认label宽度，在ElementUI经常使用labelWidth表示这个属性。

同时支持配置每个表单项的宽度、label宽度、类名className，便于后续用户扩展自定义样式。

    <template>
        <SearchForm :gutter="20"
                    :labelWidth="'120px'"
                    :fields="fields"
        />
    </template>
    <script>
    export default {
        data(){
            return{
                fields:[
                    {
                        key: 'rule',
                        label: '规则名称',
                        component: 'input',
                        width: '300px',
                        labelWidth: '100px',
                        className: 'rule'
                    },
                    {
                        key: 'description',
                        label: '描述',
                        component: 'input'
                    }
                ]
            }
        }
    }
    </script>
    

*   示例3：表单项支持自定义组件。

上面我们配置的component是一些常见表单项的名称，如果不满足用户需求，则可以传递过来一个自定义组件。

    <template>
        <SearchForm :fields="fields" />
    </template>
    <script>
    import CustomComponent from './CustomComponent.vue'
    export default {
        data(){
            return{
                fields:[
                    {
                        key: 'rule',
                        label: '规则名称',
                        component: CustomComponent,
                    }
                ]
            }
        }
    }
    </script>
    

*   示例4：支持通过插槽形式扩展表单项

每个表单项提供两个插槽：label的插槽和表单项的插槽，label插槽名称为 `${key}-label`，表单项插槽名和key值相同。

    <template>
        <SearchForm :fields="fields" >
            <!-- 支持插槽扩展label  -->
            <template slot="rule-label">
                <span>规则名称<i class="el-icon-question"></i></span>
            </template>
            <!-- 支持扩展表单项 -->
            <template slot="rule" slot-scope="{formData}">
                <el-input v-model="formData.rule" />
            </template>
        </SearchForm>
    </template>
    <script>
    import CustomComponent from './CustomComponent.vue'
    export default {
        data(){
            return{
                fields:[
                    {
                        key: 'rule'
                    }
                ]
            }
        }
    }
    </script>
    

*   示例5：表单项支持设置默认值

表单首次挂载时，支持设置每个表单项的默认值defaultValue，后续不再监听defaultValue值的变化，除非手动调用SearchForm的方法resetFields。

    <template>
        <SearchForm ref="SearchForm" :fields="fields" />
    </template>
    <script>
    export default {
        data(){
            return{
                fields:[
                    {
                        key: 'rule',
                        component: 'input',
                        defaultValue: 'test'
                    }
                ]
            }
        },
        methods:{
            resetFields(){
                //将表单值恢复为每个表单项的defaultValue
                this.$refs.SearchForm.resetFields();
            }
        }
    }
    </script>
    

*   示例6：表单项支持设置属性和事件

每个表单项可以配置其支持的所有属性props和事件events。需要注意一点就是，像Select这种组件，我们支持通过options来配置选项，这不是原生的Select或ElementUI 中的el-select的功能，所以需要实现一种特殊的Select子组件。

    <template>
        <SearchForm :fields="fields"/>
    </template>
    <script>
    export default {
        data(){
            return{
                fields:[
                    {
                        key: 'rule',
                        label: '规则名称',
                        component: 'input',
                        componentProps: {
                            placeholder: '请输入规则名称',
                            maxlength: 30
                        },
                        componentEvents:{
                            change(value){
                                //规则的change事件
                            }
                        }
                    },
                    {
                        key: 'type',
                        label: '规则名称',
                        component: 'select',
                        componentProps: {
                            placeholder: '请选择类型',
                            options: [
                                {label: '类型1', value: 'type1'},
                                {label: '类型2', value: 'type2'},
                            ]
                        }
                    }
                ]
            }
        }
    }
    </script>
    

*   示例7：获取SearchForm的当前值

    <template>
        <SearchForm ref="SearchForm"/>
    </template>
    <script>
    export default {
        methods:{
            getSearchFormData(){
                //获取组件当前用户输入的值
                this.$refs.SearchForm.getFields();
            }
        }
    }
    </script>
    

通过这7个示例的展示，相信你对我们要封装的组件怎么使用已经有所了解，根据这些示例你可以发表你的修改意见了，这就是我们列举示例的意义。

### 组件接口

上述示例从不同场景展示了SearchForm如何使用，接下来我们将组件的所有props、events、methods、slots统一整理下。

SearchForm 属性props

参数

说明

类型

可选值

默认值

gutter

间隔，单位像素

number

\-

20

labelWidth

label宽度

string / number

—

—

fields

表单项配置

array

—

\[\]

SearchForm 事件events

事件名称

说明

回调参数

search

触发搜索事件

(values)

SearchForm 方法methods

方法名

说明

参数

resetFields

重置搜索表单为初始值

—

getFields

获取表单当前值

—

SearchForm 插槽slots

name

说明

表单key-label

每个表单项的label插槽

表单key

每个表单项的插槽

### 组件内部数据

前面展示的都是组件对外的效果，接下来我们思考下组件实现的内部细节。

从前面需求看，组件内部至少应该有以下几个状态

*   formData【元数据】：用来存放组件的表单项当前值
*   componentsMap【元数据】: 存储fields中配置的component字符串值与真实组件的对应关系，如'input' 对应饿了么的Input组件，select对应我们开发的特殊的Select组件。
*   defaultValues【计算属性】: 表单的默认值，应该是基于fields的一个计算属性
*   innerFields【计算属性】：经过处理的fields，基于fields和labelWidth的计算属性，用来准备好渲染所需的真正数据，比如每个表单项的宽度、label宽度、最终渲染使用的表单组件等。如果没有这个计算属性，在渲染dom时逻辑可能比较复杂，可读性不好。

### 组件内部交互逻辑

*   mounted：
    *   初始化formData数据：将formData值设为defaultValues
*   表单项渲染逻辑：
    *   表单项应该通过动态组件的方式实现
    *   遍历fields，根据每个field的component类型来决定用什么组件，如果是字符串，则从componentsMap中找出相应的组件，找不到则默认采用ElInput；如果component类型为Vue组件，则直接使用该组件渲染
*   点击搜索按钮逻辑
    *   对外抛出search事件，参数为当前formData值
*   点击重置按钮逻辑
    *   将formData值设为defaultValues

至此，组件的整体设计基本完成，当然组件内部还需要引用一些子组件，至于子组件的设计和这个是类似的，不再赘述。

### 编码实现

对于props、data、computed等内容，我们直接照抄上述设计文档实现即可。

最终SearchForm组件完整实现如下：

    <template>
        <div class="search-form">
            <div class="search-form-fields">
                <div class="search-form-field" v-for="(field, index) in innerFields"
                     :key="field.key"
                     :style="{
                       width: field.width,
                       marginRight: index < fields.length - 1 ? gutter + 'px' : 0
                     }"
                >
                    <span class="search-form-field-label"
                          :style="{
                                  width: field.labelWidth,
                               }"
                    >
                         <slot :name="`${field.key}-label`">{{ field.label }}：</slot>
                    </span>
    
                    <div class="search-form-field-component">
                        <slot :name="field.key" :formData="formData">
                            <component
                                :is="field.component"
                                size="mini"
                                v-model="formData[field.key]"
                                v-bind="field.componentProps"
                                v-on="field.componentEvents"
                                style="width: 100%"
                            />
                        </slot>
                    </div>
    
                </div>
            </div>
            <div class="search-form-buttons">
                <el-button size="mini"
                           @click="resetFields"
                >重置
                </el-button>
                <el-button type="primary" size="mini"
                           @click="search"
                >查询
                </el-button>
            </div>
        </div>
    </template>
    
    <script>
    import SearchFormSelect from "./SearchFormSelect";
    
    export default {
        name: "SearchForm",
        props: {
            gutter: {
                type: Number,
                default: 20
            },
            labelWidth: {
                type: [String, Number]
            },
            fields: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                formData: {},
                componentsMap: {
                    'input': 'el-input',
                    'select': SearchFormSelect
                }
            };
        },
        computed: {
            defaultValues() {
                return this.fields.reduce((values, field) => {
                    values[field.key] = field.defaultValue;
                    return values;
                }, {});
            },
            innerFields() {
                return this.fields.map(field => {
                    let width = '250px';
                    if (field.width) {
                        width = typeof field.width === 'number' ? field.width + 'px' : field.width;
                    }
    
                    let labelWidth = undefined;
                    if (this.labelWidth) {
                        labelWidth = typeof this.labelWidth === 'number' ? this.labelWidth + 'px' : this.labelWidth;
                    }
                    if (field.labelWidth) {
                        labelWidth = typeof field.labelWidth === 'number' ? field.labelWidth + 'px' : field.labelWidth;
                    }
                    let component = '';
                    if (typeof field.component === 'string') {
                        component = this.componentsMap[field.component] || 'el-input';
                    } else {
                        component = field.component;
                    }
                    return {
                        ...field,
                        width,
                        labelWidth,
                        component
                    };
                });
            }
        },
        mounted() {
            this.formData = {...this.defaultValues};
        },
        methods: {
            search() {
                this.$emit('search', {...this.formData});
            },
            resetFields() {
                this.formData = {...this.defaultValues};
                this.$emit('search', {...this.formData});
            },
            getFields() {
                return {...this.formData};
            }
        }
    
    };
    </script>
    
    <style scoped lang="less">
    .search-form {
        display: flex;
        align-items: center;
    
        .search-form-fields {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-right: 10px;
    
            .search-form-field {
                display: flex;
                align-items: center;
    
                .search-form-field-label {
                    display: inline-block;
                    text-align: right;
                    margin-right: 4px;
                }
    
                .search-form-field-component {
                    flex: 1;
                }
            }
        }
    }
    </style>
    

整体的实现和我们上面的设计基本吻合，没有太大的出入，作者花了半个小时的时间实现了这个组件，大部分时间花在了样式调整上，逻辑上并没有耗费什么时间，当把组件的设计做好之后，编码工作其实并不难。

[示例代码](https://github.com/501351981/HighQualityCode/tree/main/component "https://github.com/501351981/HighQualityCode/tree/main/component")

总结
--

组件化开发是分治思想的体现，在技术层面和工作流程层面都有很多益处。

技术层面：

*   分离关注点，提升了代码的可读性
*   提升了代码的复用性
*   UI更一致，利于团队规范的执行
*   提升可测试性，单一公共组件更容易进行测试

工作流程层面：

*   方便多人协作：只要提前定义好组件的职责和接口，可以多人并行开发
*   前端人才结构分层：建议搭建自己的团队组件库，可以减低业务开发门槛

何时抽取组件，可以从复用性、复杂度、结构化编程、分离关注点几个角度去考虑。

一个好的组件需要平衡复用性、扩展性、易用性、可读性和正交性，编程就是平衡的艺术。

*   学会抽象，遵守单一职责原则，有利于提升组件的复用性
*   插槽可用于扩展DOM，钩子函数可用于扩展逻辑，支持自定义类可用于扩展样式，尽量不在基础组件中使用 !important
*   组件最好能傻瓜式使用，减少配置，默认值就可以满足大部分场景，命名要符合用户习惯
*   提升组件可读性需要结合多种手段：组件命名、顶部注释、结构化开发、显式修改数据、区分元数据和派生数据、不要滥用watch等，切记，子组件不可修改父组件传递的props
*   为了提升组件正交性，要尽量减少父子组件的耦合、组件与外部数据的耦合以及组件和业务逻辑的耦合，组件之间进行通信只能通过对方提供的接口进行，不可擅自访问组件内部的状态和DOM，子组件不要指挥父组件做事

要开发一个组件，需要遵循以下流程：

*   明确组件的定位：不同定位的组件有不同的评价指标，基础组件更专注通用性，业务组件更专注易用性
*   列举组件各个场景的使用方法：在未开发之前就能让其他同事感知到该组件是否是他们需要的
*   确定组件的接口：props、events、methods和slots
*   设计组件内部的数据：区分哪些是元数据，哪些是派生数据
*   梳理组件的交互逻辑：通过图、表形式，列举不同交互的处理逻辑
*   编码：编码是最后一个流程，而不是第一个流程

要开发一个人见人爱的组件并不容易，但也有章可循，希望大家更注重组件开发前的设计工作。