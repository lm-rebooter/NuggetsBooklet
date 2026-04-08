表单开发是前端同学绕不开的一个话题，特别是在一些管理系统中，表单开发是前端同学的一个主要工作，占用了大部分开发时间，然而很多糟糕的代码也都出现在表单相关工作中，很多表单的可读性、可维护性很差，更别提复用性了，如何优雅地进行表单开发，是提升前端代码质量的重要一环，今天我们就一起探讨下表单开发中的各种常见问题及解决方案。

什么是表单组件
=======

在讨论表单存在的问题之前，我们先搞明白一个概念，什么是表单组件？很多工作多年的同学，可能都无法说清楚什么是表单组件，这就导致在开发表单组件时弄出一些不伦不类的东西。

比如下面这种，有一个自定义表单组件MyFormItem，它有一个属性data接收表单数据formData，并在组件内部对formData进行修改，你觉得有什么问题吗？

    <template>
        <el-form>
            <el-form-item>
                <MyFormItem :data="formData"/>
            </el-form-item>
        </el-form>
    </template>
    <script>
    export default {
        data(){
            return {
                formData:{
                    name: '',
                    age: 18
                }
            }
        }
    }
    </script>
    

这就是一个常见的表单组件开发反例，首先表单组件MyFormItem的值不应该命名为'data'，而应该统一命名为'value'；其次这个表单组件肯定会在内部直接修改formData，这不符合组件开发的规范，即组件不应该直接修改props，且我们不知道组件内部会对formData进行怎样的修改，必须深入到内部实现才能知道。

表单组件是有固定的开发范式的，具体可以分为受控组件和非受控组件两种。

受控组件
----

所谓受控组件，就是组件的内部状态可以通过修改属性值的方式进行控制，受控组件必须满足以下2个条件：

*   存在一个名为value的属性
    *   组件的初始值由value属性值决定
    *   value属性值变化后组件的内部状态也必须跟着变化
*   组件对外抛出onChange事件
    *   组件内部状态变化后，以抛出onChange事件的方式将表单项的最新值传递给父组件

简单来说，受控组件必须有value属性和onChange事件，且value变化会导致组件数据更新。这样组件的行为就能够被使用方完全控制，所以称为受控组件。

以下图这样一个重量表单组件为例，我们来演示下如何开发一个受控组件。

![shoukong.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/787395c3ff0b4d749c2be824c91b5b17~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=416&h=183&s=9694&e=png&b=fefefe)

期望该重量组件的数据形式为'重量+单位'，如'10g'，是一个字符串。该组件在接收到外部数据后，能够从字符串中提取出重量值和单位，分别赋给input输入框和select选择组件，每当input和select值发生变更，都会将input的值和select的值组合成字符串抛出。

    <template>
        <div>
            <el-input-number :value="number" @change="numberChange"/>
            <el-select :value="unit" @change="unitChange">
                <el-option label="克" value="g" />
                <el-option label="千克" value="kg" />
                <el-option label="吨" value="t" />
            </el-select>
        </div>
    </template>
    
    <script>
    export default {
        name: "WeightFormItem",
        model: {
            event: 'change'
        },
        props: {
            value: {
                type: String,
                default: ''
            }
        },
        computed: {
            //重量数值部分
            number(){
                let number = parseFloat(this.value)
                return isNaN(number) ? undefined : number;
            },
            //重量单位部分
            unit(){
                let match = (this.value || '').match(/[a-z]+/)
                if(match){
                    return match[0];
                }
                return 'g'
            }
        },
        methods:{
            numberChange(number){
                this.$emit('change', `${typeof number === "undefined" ? '' : number}${this.unit}`)
            },
            unitChange(unit){
                this.$emit('change', `${typeof this.number === "undefined" ? '' : this.number}${unit}`)
            }
        }
    };
    </script>
    

在上述实现中，我们通过计算属性，将value的变化传递给el-input-number和el-select组件，而省去了监听（watch）value变化的过程，通过这种方式让组件可以随着外部value的变化而变化；同时组件内部因为用户操作导致的变化，也及时通过change事件抛给父组件（Vue中通常不使用onChange，而是change）。

在Vue中，受控组件的使用非常简单，只要通过v-model双向绑定数据即可，大大简化了表单的处理逻辑。

     <WeightFormItem v-model="weight"/>
    

非受控组件
-----

和受控组件对应的是非受控组件，即组件的内部状态由组件自身进行维护，而不是受到外部传递过来的props控制，一般来说，非受控组件应该满足以下2个条件：

*   对外提供一个名为defaultValue的属性
    *   组件的初始状态由defaultValue决定
    *   后续组件的状态随着用户交互而进行变化，但不通知父组件
*   对外提供一个可以获取组件内部状态的方法
    *   一般通过ref方式访问组件的内部状态value，如$refs.\*\*\*.value（不建议直接访问组件内部状态）
    *   建议提供一个method方法获取内部状态，如getValue()

在上述受控组件示例中，我们封装了一个重量表单组件，接下来用非受控方式来实现该组件：

    <template>
        <div>
            <el-input-number v-model="number"/>
            <el-select v-model="unit">
                <el-option label="克" value="g" />
                <el-option label="千克" value="kg" />
                <el-option label="吨" value="t" />
            </el-select>
        </div>
    </template>
    
    <script>
    export default {
        name: "WeightFormItem",
        props: {
            defaultValue: {
                type: String,
                default: ''
            }
        },
        data(){
            //根据初始化计算重量数值
            let number = parseFloat(this.defaultValue)
            if(isNaN(number)){
                number = undefined
            }
    
            //根据初始化计算重量单位
            let match = (this.defaultValue || '').match(/[a-z]+/)
            let unit = match &&  match[0]
    
          return {
              number,
              unit
          }
        },
        methods:{
            getValue(){
                return  `${typeof this.number === "undefined" ? '' : this.number}${this.unit}`
            }
        }
    };
    </script>
    

通过非受控组件方式开发的重量表单组件，内部维护了两个状态number和unit，它们的初始值由属性defaultValue的值决定，后续number和unit的值只会受到用户交互影响，不再由外部进行控制。

再来看看非受控组件的使用：

    <template>
      <WeightFormItem ref="weight" :default-value="weight"/>
    </template>
    <script>
    export default {
        data(){
            return {
              weight: '10kg'
            }
        },
        methods:{
            submit(){
                console.log(this.$refs.weight.getValue());
            }
        }
    }
    </script>
    

只能通过ref的方式获取组件的表单值。

在日常业务开发中，建议尽量采用**受控组件**的方式去开发表单组件，一般来说受控组件的使用更加简单，而且因为受控，给了父组件足够的灵活性，可以满足各种场景。比如一个编辑用户信息的表单，首次挂载时，通常会给表单设置默认数据，而后会请求API接口获取用户的信息并赋值给表单，如果表单组件不可控，那么此时就无法正确渲染用户信息了。

当然了，非受控组件也有它的优势，像Ant Design组件库中的表单组件，通常都同时支持受控组件和非受控组件两种方式，但这无疑会增加组件的开发复杂度，对于业务中的表单组件开发，采用受控组件方式就足够了。

表单开发常见问题及解决方案
=============

问题1：充满细节
--------

表单本身具有很高的复杂性，它包含了数据、UI和逻辑，如果没有合理的设计，很容易变的混乱。

在我多年的工作中，发现表单开发最大的问题就是**充满细节**，一个表单通常会包含多个表单项，而每个表单项一般也都会有不少的业务逻辑，如果将所有的表单项逻辑聚集在一个文件中，就会因为过多的细节而导致看不清整个表单的脉络，从而降低了代码的可读性和可维护性。

比如一个商品管理表单，里面包含商品名称、商品图片、商品分类、sku等多个表单项。

![shangpin.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bbdb27abf7343a694063a2e79e08296~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=409&h=392&s=31175&e=png&b=fdfdfd)

如果将这些表单项的具体实现都放在一个文件中，则很难看清整个表单的工作流程：如何初始化数据、如何双向绑定每个表单项的值、如何提交数据。取而代之的是各种细节：商品图片上传前校验、调用接口上传图片、如何增加/删除一张图片；调用某个接口获取商品分类列表数据，然后再渲染一个商品分类下拉选择框；如何添加/移除一种sku等。这些细节很容易把人搞得晕头转向。

这里就不用代码演示了，没有几百行根本展示不下，相信大家都能体会到，而且确实有很多同学在开发表单时，喜欢将每个表单项的实现细节都放到整个表单组件中。 这会带来以下几种问题：

*   **表单项实现逻辑分散**：

一个表单项的实现代码分散在多个地方：Dom、JS、Style，很难搞明白一个表单项的完整逻辑，不符合高内聚的编程原则，比如上面这个商品分类下拉选择框，它的渲染逻辑藏在template中，它还涉及data中的categoryOptions，它获取下拉选项的逻辑藏在methods中的getCategoryOptions方法中，如果这个页面有几百行，那么你就必须来回查找才能看得懂它的完整逻辑，因为它们太分散了。

    <template>
    <!--省略其他代码-->
    <el-form-item>
        <el-select v-model="formData.category">
            <el-option v-for="item in categoryOptions"
                :key="item"
                :label="item"
                :value="item"
            ></el-option>
        </el-select>
    </el-form-item>
    </template>
    
    <script>
    export default {
        data(){
            return {
                //省略其他数据
                formData:{
                    category: ''
                },
                categoryOptions:[]
            }
        },
        methods:{
           //省略其他method
           getCategoryOptions(){
               //获取商品分类的选项
           }
        }
      
    }
    
    <script>
    

*   **表单项无法在多个表单中复用**

由于没有抽取单独的表单项组件，从而无法在其他表单中复用，只能每次都重新开发一遍。

有的很复杂的表单项大家容易想到提取出来，但是针对一些不那么复杂的，往往就忽视了，比如上面的商品分类，它的实现没有那么复杂，只是要调用接口获取商品分类列表，然后渲染一个下拉选择框，但是如果一个表单中有几个这样的组件，也会让整个表单变的混乱，而且多个表单中都实现这样一套逻辑，也增加了工作量和后期维护难度，建议也把这种作为一个表单项组件提取出来。

*   **表单文件行数过大**

不进行表单项组件抽取，面向细节开发表单，很容易造成一个表单组件达到数千行，甚至上万行，很多垃圾代码都出现在表单中。

*   **掩盖了表单核心逻辑**

细节过多，导致本末倒置，无法看清表单的核心逻辑。

最终，因为这种堆砌细节的实现方式，导致表单代码经常难以维护，复用性也很差，每次开发表单都是从头开始。

解决方式也非常简单，就是将表单项提取出来，作为一个单独的组件，一个表单应该由多个表单项组件构成。

![form-item.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90f406a7bf7e4f7e91ccb3caf2677b80~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=424&h=289&s=19859&e=png&b=fefefe)

上述商品管理表单，通过封装表单项方式可能的代码实现如下：

    <template>
      <el-form :model="formData">
        <form-item label="商品名称" prop="name">
          <el-input v-model="formData.name"/>
        </form-item>
        <form-item label="商品图片" prop="pics">
          <ProductPicsFormItem v-model="formData.pics"/>
        </form-item>
        <form-item label="商品分类" prop="category">
          <ProductCategoryFormItem v-model="formData.category"/>
        </form-item>
        <form-item label="sku" prop="sku">
          <ProductSkuFormItem v-model="formData.sku"/>
        </form-item>
      </el-form>
    </template>
    <script>
    export default {
      data() {
        return {
          formData: {
            name: '',
            pics: [],
            category: '',
            sku: []
          }
        }
      },
      mounted() {
        if (this.$route.params.id) {
          //编辑，获取商品数据
          productService.getDetail(this.$route.params.id).then((res) => {
            this.formData = res
          })
        }
      },
      methods: {
        submit() {
          //提交表单数据
        }
      }
    }
    </script>
    

可以看出，通过这种方式开发的表单，代码非常简洁，逻辑也非常清晰。如果某个表单项出问题了，只需要进入相应的表单项组件进行修改即可，可维护性大大增强；而且提取的表单项组件还可以用到其他表单，复用性也大大增强；即使没有任何复用场景，通过提取表单项组件也简化了主表单的开发逻辑，可读性大大增强。

问题2：繁琐的Dom
----------

这里提到的繁琐的Dom其实也是一种细节，但是和上面提到的"充满细节"侧重点有所不同。上面讲到的细节主要是指因为表单项本身很复杂，把很复杂的实现过程都放到表单中，导致产生了过多的实现细节；而这里说的繁琐的Dom是指表单项本身并不是很复杂，但是有非常多的属性配置，导致产生了很多繁琐的Dom。

看下下面这个示例：

    
    <template>
      <el-form
          :model="formData"
          size="mini"
          label-width="100px"
      >
        <el-form-item
            prop="name"
            label="名称"
        >
          <el-input
              v-model="formData.name"
              placeholder="请填写名称"
              minlength="2"
              maxlength="30"
              clearable
          />
        </el-form-item>
        <el-form-item
            prop="tag"
            label="标签"
        >
          <el-select
              v-model="formData.tag"
              class="w-100"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择或输入标签"
              @visible-change="$event && getTags()"
          >
            <el-option
                v-for="(item, index) in tagOptions"
                :key="index"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    

仅仅只是2个表单项，Dom就有30来行代码，而随着表单项的增多，代码行数也会越来越多，每次看到这样繁琐的Dom都感觉头大，根本无法看清整个表单的结构，特别是下拉选择类组件，还要考虑如何渲染option，总感觉这样的Dom结构非常的啰嗦，期望能够通过数据来驱动Form表单的渲染。

对此，也有很多库做过尝试，比如通过配置表单的方式驱动页面渲染：

    <template>
      <config-form 
          :model="formData"
          :fields="fields"
      />
    </template>
    <script>
    export default {
      data() {
        return {
          formData: {},
          fields: {
              name: {
                  label: '名称',
                  component: 'input',
                  componentProps: {
                    placeholder: '请填写名称',
                    minlength: 2,
                    maxlength: 30,
                    clearable: true
                  },
                  rules: [{required: true}]
              },
              tag: {
                  label: '标签',
                  component: 'select',
                  componentProps: {
                      className: 'w-100',
                      multiple: true,
                      filterable: true,
                      allowCreate: true,
                      defaultFirstOption: true,
                      placeholder: '请选择或输入标签',
                      options: this.getTags,
                  },
                  rules: [{required: true}]
              }
          }
        }
      }
    }
    </script>
    

通过这种方式大大简化了表单的Dom结构，以更紧凑的JS对象的方式来描述表单结构，通过数据驱动表单的生成。同时也可以将**表单项的校验规则rules和表单项的其他配置放置在一起，让每个表单项的配置更加高内聚**，如果你想修改某个表单项，就只需要关注它对应的JS对象即可，不需要像之前一样在Dom和JS之间来回切换。

使用配置表单方式也面临一些挑战，比如我们想实现在"名称输入框"后面加一个图标，就很难通过配置来实现，最好搭配插槽支持一些特殊表单项的实现。

    <template>
      <config-form  
        :model="formData"
        :fields="fields"
      >
        <!--通过插槽扩展某个表单项的label-->
        <template slot="name-label">
          <span style="color:red;">姓名</span>
        </template>
        <!--通过插槽扩展某个表单项的表单部分-->
        <template slot="name">
          <div>
            <el-input v-model="formData.name"/>
            <i class="el-icon-question"></i>
          </div>
        </template>
      </config-form>
    </template>
    

通过这种方式，增强了配置表单对特殊表单样式的支持。然而对于一些特殊布局，配置表单显得很麻烦，比如我们想实现第一行放置一个表单元素，第二行放置两个表单元素，配置表单就显得很棘手，同样地，我们也可以通过插槽形式来支持自定义表单布局，而具体每个表单项如何渲染，仍然由配置决定。

    <template>
      <config-form  
        :model="formData"
        :fields="fields"
      >
        <template slot="layout">
          <el-row>
            <el-col :span="24">
              <!-- 如何渲染由配置决定，这里相当于一个占位符 -->
              <config-form-item prop="name"/>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <config-form-item prop="age"/>
            </el-col>
            <el-col :span="12">
              <config-form-item prop="address"/>
            </el-col>
          </el-row>
        </template>
      </config-form>
    </template>
    <script>
    export default {
        data(){
            return {
              formData:{},
              fields: {
                  name: {
                      label: '名称',
                      component: 'input',
                  },
                  age: {
                      label: '年龄',
                      component: 'number',
                  },
                  address: {
                      label: '地址',
                      component: 'textarea',
                  }
              }
            }
        }
    }
    </script>
    

针对配置表单，可以参考我封装的ConfigForm库，[github](https://github.com/501351981/config-form "https://github.com/501351981/config-form")，当然了，配置表单也并不是特别完美解决这个问题，这里也只是尝试给出一种方案，抛砖引玉。

问题3：表单项组件封装不规范
--------------

在本文最开始我们就讨论了受控组件和非受控组件，二者都有固定的开发范式：**受控组件要求必填提供value属性和onChange事件，非受控组件需要提供defaultValue和getValue方法**，而很多同学没有严格按照这种方式进行封装，导致可读性较差，耦合较深。

比如上面提到的选择分类的表单项组件CategoryFormItem，如果没有按照受控组件的规范进行开发，而是接收整个表单数据formData作为属性data的值。

    <template>
        <el-form>
            <el-form-item name="category">
                <CategoryFormItem :data="formData"/>
            </el-form-item>
        </el-form>
    </template>
    

在CategoryFormItem中，必然需要通过formData.category来获取/设置分类数据，这就造成了耦合。如果在表单中不再使用formData.category存储分类数据，而是改成了formData.group，那么表单项组件CategoryFormItem就必须跟着修改，这不就是耦合嘛。而如果采用受控组件形式，则不需要任何变化；其次这种方式可读性也较差，你不知道CategoryFormItem内部都更改了formData的哪些值。

所以，**只要封装表单项组件，就严格遵守受控组件和非受控组件的规范**。

问题4：校验规则不统一
-----------

在表单开发中，还有一个常见的小问题，就是某个表单项的校验规则可能不统一，比如业务中"用户名"有固定要求：以字母开头，长度不能超过30个字符。但是在多个表单中都可能输入用户名，很容易发生多个表单中校验不一致的问题，因此可以把相同业务的校验规则整理到一个常量中进行引用。

    // /const/validate.js
    
    export const UserNameValidate = [
        {
            pattern: /^[a-zA-Z]\w{0,29}$/, 
            message: '用户名必须以字母开头，只能包含字母数组和下划线，不超过30个字符'
        }
    ]
    
    

这样确保了校验规则的一致性，后期校验规则变化改起来也非常简单，避免产生遗漏。

不过要注意，**只有相同业务才应该复用校验规则，不同业务，即使校验规则相同，也应该拆成两个**，比如用户名和产品名刚开始可能遵循相同的校验规则，但是它们就不应该复用同一个校验规则，因为分属不同的业务，产品名规则变化不一定会引起用户名规则的变化，而如果之前将它们复用了同一个校验规则，则维护起来就非常麻烦，这时候应该牺牲复用性而降低耦合。

复杂业务表单的开发
=========

在表单开发中，比较麻烦的是复杂业务表单的开发，它们常常有几十甚至上百个字段需要编辑，如果把所有内容放到一个表单中，势必导致这个表单的逻辑非常复杂，文件大小也会非常大，这也是我们经常看到的万行代码的高发地。

针对复杂业务，通常我们可以利用分治思想来解决。将一个大型任务分解成多个小任务，小任务是很容易解决的，解决后再通过聚合多个小任务的结果，最终完成大型任务的开发。复杂业务的表单开发同样可以借用这样的思想和方法。

比如现在有个非常复杂的表单，其中基本信息和详细信息都有很多表单项。

![big-form.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/05f249eafa5f45359ff879e0c284f80a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=671&h=364&s=18535&e=png&b=fefefe)

我们可以将整个表单具体实现拆成2个子表单：基本信息表单BaseForm和详细信息表单DetailForm，每个表单各自管理各自的表单项配置及表单校验，在主表单提交时，可以分别调用两个子表单的校验方法validate，如果全部校验通过，则拿到各自表单的数据，然后调用API传递给后端。

这个思路比较好理解，但是在实现中我们还要考虑主子表单的数据流转问题，这里可以参考前面提到的受控组件和非受控组件规范。这里一个子表单可以看做是一个受控或非受控组件，如果子表单是非受控组件，那么它应该提供一个名为defaultValue的属性来接受子表单初始化数据；如果子表单是受控组件，那么它应该支持value和onChange事件，可以支持Vue的v-model双向绑定；不管子表单是受控组件还是非受控组件，都应该提供一个名为validate的方法，供主表单调用，以进行表单校验。

接下来我们通过两种方式来实现这个复杂表单。

非受控组件方式实现
---------

非受控组件方式实现时，子表单BaseForm和DetailForm都有一个名为defaultValue的属性，用来接受表单的初始化数据，而一旦初始化完成，子表单数据不再受控，可以在validate方法通过后拿到表单的最新数据。

我们先看下主表单的实现逻辑：

    <template>
      <div>
          <BaseForm ref="baseForm" :defaultValue="formData.baseInfo"/>
          <DetailForm ref="detailForm" :defaultValue="formData.detail"/>
          <el-button @click="submit">提交</el-button>
      </div>
    </template>
    
    <script>
    import BaseForm from "@/components/big-form/BaseForm";
    import DetailForm from "@/components/big-form/DetailForm";
    export default {
      name: 'BigForm',
        components: {
            BaseForm,
            DetailForm
        },
        data(){
          return {
              formData: {
                  baseInfo: {
                      name: ''
                  },
                  detail: {
                      description: ''
                  }
              }
          }
        },
        methods:{
            submit(){
                Promise.all([
                    this.$refs.baseForm.validate(),
                    this.$refs.detailForm.validate()
                ]).then(([baseFormData, detailFormData]) =>{
                    //拿到表单的最新数据
                    console.log(baseFormData, detailFormData)
                }).catch(error=>{
                    console.log(error)
                })
            }
        }
    }
    </script>
    

每个子表单都提供一个validate方法，该方法最好返回Promise，这样我们可以利用Promise.all来判断全部子表单是否均校验通过。validate方法在子表单校验成功后最好将表单最新数据返回，这样就不需要额外再提供一个获取子表单最新数据的方法了。

以BaseForm为例，看看子表单的非受控方式实现：

    <template>
    <div>
        <div>基础信息</div>
        <el-form ref="form" :model="formData" :rules="rules">
            <el-form-item prop="name" label="姓名">
                <el-input v-model="formData.name" />
            </el-form-item>
        </el-form>
    </div>
    </template>
    
    <script>
    export default {
        name: "BaseForm",
        props: {
            defaultValue: {
                type: Object,
                defaultValue: ()=> ({})
            }
        },
        data(){
            return {
                //初始化表单数据
                formData: {...this.defaultValue},
                rules:{
                    name: [{required: true, message: '姓名不能为空'}]
                }
            }
        },
        methods:{
            validate(){
                return this.$refs.form.validate().then(_=>{
                    //校验成功后返回表单最新数据
                    return this.formData;
                })
            }
        }
    
    };
    </script>
    

其中主要关注两个地方：formData的初始化和validate方法。由于是非受控组件，只进行一次数据初始化，后续自行维护表单数据，直到被主表单调用validate方法后，才将最新数据传递给主表单。

采用非受控方式开发子表单非常简单，缺点就是主表单不能及时获取每个子表单的最新数据，一旦其他子表单需要共享数据，就比较麻烦。

受控组件方式实现
--------

受控组件方式，子表单BaseForm和DetailForm支持属性value和onChange事件，在Vue中支持v-model双向绑定，这样主表单可以实时获取子表单数据，表单多个表单之间互动，也无需像非受控组件那样，在validate方法中返回子表单最新数据。

主表单实现如下：

    <template>
      <div id="app">
          <BaseForm ref="baseForm" v-model="formData"/>
          <DetailForm ref="detailForm" v-model="formData"/>
          <el-button @click="submit">提交</el-button>
      </div>
    </template>
    
    <script>
    import BaseForm from "@/components/big-form/BaseForm";
    import DetailForm from "@/components/big-form/DetailForm";
    export default {
      name: 'App',
        components: {
            BaseForm,
            DetailForm
        },
        data(){
          return {
              formData: {
                  name: '',
                  description: ''
              }
          }
        },
        methods:{
            submit(){
                Promise.all([
                    this.$refs.baseForm.validate(),
                    this.$refs.detailForm.validate()
                ]).then(_ =>{
                    //主表单中的formData就是表单最新数据
                    console.log('this.formData', this.formData)
                }).catch(error=>{
                    console.log(error)
                })
            }
        }
    }
    </script>
    

子表单实现的难点是如何在任意一个表单项数据发生变更后，通过change事件将子表单最新数据抛出去，如果给每个表单项增加事件监控则会显得非常繁琐。这里我们可以增加一个计算属性formData赋给表单的model属性，计算属性formData采用get和set方式实现，当获取formData数据时，就返回子表单的属性value，而当表单的model发生变化时，则通过set方法，将change事件抛出去。

    <template>
    <div>
        <div>基础信息</div>
        <el-form ref="form" :model="formData" :rules="rules">
            <el-form-item prop="name" label="姓名">
                <el-input v-model="formData.name" />
            </el-form-item>
        </el-form>
    </div>
    </template>
    
    <script>
    export default {
        name: "BaseForm",
        model: {
          //默认的是input事件，为了遵循受控组件的规范，我们改为change事件
          event: 'change'
        },
        props: {
            value: {
                type: Object,
                defaultValue: ()=> ({})
            }
        },
        data(){
            return {
                rules:{
                    name: [{required: true, message: '姓名不能为空'}]
                }
            }
        },
        computed: {
            formData:{
                get(){
                    return this.value
                },
                set(val){
                    this.$emit('change', val)
                }
            }
        },
        methods:{
            validate(){
                return this.$refs.form.validate();
            }
        }
    
    };
    </script>
    

> 为了实现双向绑定v-model，并遵循受控组件的规范，我们增加model的配置，将event设为 "change"，默认是"input"

无论是受控组件方式还是非受控组件方式，都能将复杂表单拆分成多个简单的小表单，并无本质区别，只是受控组件方式的主表单可以一直获取最新且完整的表单数据，而非受控组件则会推迟到全部子表单校验成功后；不过非受控组件的开发逻辑相对简单点，各有优势，可以根据是否需要子表单互动来决定使用哪一种。

总结
==

本节我们介绍了表单组件的两种重要范式：受控组件和非受控组件。只要开发表单项组件，就要符合这两种范式的规范要求：

*   受控组件：支持属性value和事件onChange
*   非受控组件：支持属性defaultValue和getValue方法

建议平时以开发受控组件为主，以简化表单项组件的使用(v-model)。

表单开发中常见的问题及解决方案：

问题

解决方案

充满细节

将表单项提取为组件

繁琐的Dom

通过配置驱动表单生成，可以使用配置表单

表单封装不规范

遵守受控组件和非受控组件的开发要求

表单校验不统一

提取常用校验规则到常量中

针对业务开发中的复杂表单问题，可以利用分治思想，将复杂表单拆分成多个简单小表单，每个小表单遵循受控组件和非受控组件规范，并额外提供一个validate方法。