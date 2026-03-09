网络请求是前端使用最频繁的一个功能，一个设计良好的网络请求能很好地消除代码重复、提升开发效率且易于扩展，在日常开发中，相信大家一定会对网络请求进行一定程度的封装，但具体要封装哪些内容、封装到何种程度，可能每个项目并不完全一样，今天我们来探讨下如何进行网络请求封装，希望有一些内容能带给大家一些启发。

网络请求存在的问题
---------

假设我们正在开发一个用户列表组件UserList，里面需要请求用户列表接口 "/api/v1/users" 以获取用户数据，我们使用最常见的http库axios来实现这个请求，如果没有进行任何封装，大概实现如下。

    //UserList组件内部
    
    getUsers(){
        axios.get('/api/v1/users', {
            params: {
                page: 1,
                page_size: 10
            }
        }).then(response =>{
            if(response.status === 200 && response.data.code === 200){
                this.users = response.data.data || []
            }
        }).catch(e =>{
            alert(e.message)
            console.log(e)
        })
    }
    

现在先不要急着往下看，可以试着说说上面这段代码存在什么问题？看你能说出来几点。

我觉得上面这段代码的问题至少包括以下5点：

*   url地址采取了硬编码形式访问
*   请求成功的处理逻辑会存在重复
*   请求失败的处理逻辑会存在重复，失败逻辑处理不全面
*   不应该将getUsers方法放在某个组件中
*   不应该直接调用axios进行网络请求（可能会有疑问，后面我们会讲）

接下来的内容会从接口地址封装、接口服务封装和请求方法封装三个层面，来详细说明为什么会有以上5点问题，并总结出一个更加合理的网络请求编程范式。

接口地址的封装
-------

假设现在有10个页面或组件都用到了用户列表接口（/api/v1/users），如果我们在写代码时以硬编码的方式（直接使用/api/v1/users这个字符串）引用了这10个接口，一旦有一天后端调整了用户列表的接口，比如将 "/api/v1/users" 改为 "/api/v2/users"，那么我们就要在多个文件中找到这10处引用，然后修改成新的接口地址，这无疑存在很多重复工作，而且也容易因为遗漏而引起新的bug，最关键的是这种硬编码方式导致我们前端的代码严重耦合后端的接口设计，后端的每次接口变更都会给前端带来大量的维护工作，你肯定也不想因为后端的变化而让你加班赶工吧。

所有的接口地址都不应该以硬编码的形式被使用，而是应该以常量的形式封装起来，如果后端修改了接口地址，我们只需要修改接口的配置文件即可，无需修改任何业务代码，实现了前后端的隔离，解除了前端网络请求对后端接口地址的依赖，这也体现了封装的好处：**隔离变化**。

以用户相关的接口为例，可能的配置如下：

    //api.js
    export const userApis = {
        users: '/api/v1/users',       //查询用户列表的接口
        user: '/api/v1/user',         //创建用户接口 
        userDetail: '/api/v1/user/{id}' //查看用户详情、 修改用户信息、删除用户
    }
    

上面就是现在比较流行的RESTful风格的接口，每个接口对应的是一种资源，接口路径中并不体现增删改查动作，网络请求的method（GET、POST、PUT、DELETE 等）代表着接口的动作类型。

上面这种封装并无太多不妥，使用中唯一感觉不太爽的地方就是每次调用某个接口时，不太确定到底该用哪种method，虽然我猜想删除一个用户应该使用"DELETE"方法，但是为了保险起见，还是要去接口文档中看一眼，那我们为何不在录入接口地址时，把method信息也一并录入呢。

    //api.js
    export const userApis = {
       getUsers: {
          url: '/api/v1/users',
          method: 'GET'
       },
       addUser: {
          url: '/api/v1/user',
          method: 'POST'
       },
       getUserDetail: {
          url: '/api/v1/user/{id}',
          method: 'GET'
       },
       updateUser: {
          url: '/api/v1/user/{id}',
          method: 'PUT'
       },
       deleteUser: {
          url: '/api/v1/user/{id}',
          method: 'DELETE'
       }
    }
    

上面这种一个接口对应一个对象的封装方式，感觉有点太繁琐了，就为了存储url和method而使用对象感觉不太值当，我们可以采用数组或者字符串拼接方的式修改一下。

    //数组形式
    export const userApis1 = {
       getUsers: ['GET', '/api/v1/users'],
       addUser: ['POST', '/api/v1/user'],
       getUserDetail: ['GET','/api/v1/user/{id}'],
       updateUser: ['PUT', '/api/v1/user/{id}'],
       deleteUser: ['DELETE','/api/v1/user/{id}']
    }
    //字符串形式
    export const userApis2 = {
       getUsers: 'GET /api/v1/users',
       addUser: 'POST /api/v1/user',
       getUserDetail: 'GET /api/v1/user/{id}',
       updateUser: 'PUT /api/v1/user/{id}',
       deleteUser: 'DELETE /api/v1/user/{id}'
    }
    

这样就清爽多了，对比我们最开始的RESTful风格的接口，这种封装的好处就是多了接口的method信息，在录入接口时，我们可以对着接口文档一次性把需要的配置全部录入进来，后续调用时就不用去文档看需要什么method了，直接从配置中解析出来即可；坏处就是接口配置的数量变多了，比如原来RESTful风格的 userDetail现在变成了三个：getUserDetail、updateUser和deleteUser。

    //两种风格对比
    
    //RESTful风格接口
    export const userApis1 = {
        userDetail: '/api/v1/user/{id}' // 3种method对应下面3个配置，配置变多了
    }
    //封装了method和url的形式
    export const userApis2 = {
       getUserDetail: 'GET /api/v1/user/{id}',
       updateUser: 'PUT /api/v1/user/{id}',
       deleteUser: 'DELETE /api/v1/user/{id}'
    }
    
    // 后续封装一个网络请求方法request，支持解析路径中的method和url
    // 如，request('GET /api/v1/users')
    

这两种配置方式各有优缺点，根据自己的喜好进行选择即可，我个人更倾向于第二种。总之只要把接口地址封装起来，不通过硬编码方式访问就可以。

接口服务service的封装
--------------

在开篇的示例中，我们提到了getUsers方法不应该放在具体的页面或者组件中，为什么这么说呢？现在假设有10个组件都需要获取用户列表和删除用户，那么这10个组件中肯定都需要实现自己的getUsers方法和deleteUser方法，简化版本的实现示例如下，我们用一个对象代表一个前端组件，简化组件的实现逻辑，大家只关注getUsers和deleteUser方法即可。

    import request from '/base/utils/request.js'
    import userApis from '/domain/user/api.js';
    
    //组件1中
    const component1 = {
       getUsers(){
          //假设request是我们封装的一个网络请求方法
          //userApis.getUsers是我们上面封装的url：'GET /api/v1/users'
          request(userApis.getUsers, {
             params: {
                page: 1,
                page_size: -1  //假设-1代表请求全部数据
             }
          }).then(res =>{
             this.usersList = res.data || [];
          })
       },
       deleteUser(){
           request(userApis.deleteUser, {
               params: {
                   id: this.userId
               }
           }).then(res =>{
               showToast('删除成功')
           })
       }
    }
    
    //组件N中
    const componentN = {
       getUsers(){
          request(userApis.getUsers, {
             params: {
                page: 1,
                page_size: -1  //假设-1代表请求全部数据
             }
          }).then(res =>{
             this.usersList = res.data || [];
          })
       },
       deleteUser(){
          request(userApis.deleteUser, {
             params: {
                id: this.userId
             }
          }).then(res =>{
             showToast('删除成功')
          })
       }
    }
    

在这个示例中，我们使用提前封装的一个设计良好的request方法进行网络请求，假设它已经非常完美了，已经对成功或失败逻辑做了处理，那么上面的示例你还觉得有什么问题吗？

看起来代码确实也不复杂，好像不进行封装也没什么大不了，但是却存在很多重大设计问题。

### 违反最小知识原则

现在我们试想一下，团队里来了一个新人，他现在需要开发一个新的组件，这个新组件中也需要请求用户列表、删除某个用户，他怎么实现getUsers，deleteUser呢？他现在还不知道请求用户列表的接口是什么，是不是第一步就是要去翻看API文档，找到这两个接口的详细介绍，然后才能确定用哪个接口、每个接口的参数具体格式是什么，他必须要对接口的设计了然于胸才可能实现这两个方法，换句话说，为了实现这两个方法，他必须进行大量的知识储备，这违反了最小知识原则。

如果我们提前将用户的增删改查封装成一个service，再来看下。

    // /domain/user/service.js
    // 提前封装好了用户的增删改查
    
    import userApis from './api.js';
    export function getUsers(page=1, page_size=-1){
       return request(userApis.getUsers, {
          params: {
             page: page ,
             page_size: page_size
          }
       })
    }
    export function deleteUser(userId){
       return request(userApis.deleteUser, {
          params: {
             id: userId
          }
       })
    }
    

现在一个新人要在组件中实现获取用户列表和删除用户功能，只需要调用service中的方法即可，他不再需要去翻看接口文档，只要知道到 '/domain/user/service.js'中已经封装好了各种调用方法即可，相信哪怕一个没有经验的新人也能很快完成这个功能开发。

    //组件中调用service封装好的方法
    import {getUsers, deleteUser} from '/domain/user/service.js'
    const componentNew = {
        getUserList(){
            getUsers().then(res =>{
                this.userList = res.data || [];
            })
        },
        deleteUserHandler(){
            deleteUser(this.userId).then(res=>{
               showToast('删除成功')
            })
        }
    }
    

### 耦合了后端的接口设计

没有进行service封装时，传参要严格和后端对应，如果后端调整了参数命名或结构，那么所有的调用都要跟着更改。

比如删除用户接口，刚开始后端要求传一个int类型的用户id，后来随着需求变化，删除用户接口支持了批量功能，后端要求id必须传数组，而且id也变成了ids。

    //最开始的10个组件中都通过这种方式调用
    function deleteUser(){
       request(userApis.deleteUser, {
          params: {
             id: this.userId
          }
       }).then(res =>{
          showToast('删除成功')
       })
    }
    
    //接口变更后，需要进行如下更改
    function deleteUserNew(){
       request(userApis.deleteUser, {
          params: {
             ids: [this.userId]   //参数名和类型都发生了变化
          }
       }).then(res =>{
          showToast('删除成功')
       })
    }
    

在后端进行这个接口设计变更后，你不得不搜索所有删除用户接口的调用，然后调整传参命名和结构，带来大量的工作不说，很容易造成遗漏，而如果万一遗漏造成了bug，你说这是后端人员修改接口的责任还是前端人员调用格式错误的责任？

而如果业务组件中只调用service服务则不存在这个问题，我们只需要修改service中的deleteUser一处代码即可，即省力又省心。

    // /domain/user/service.js
    
    // 对删除用户的参数userId进行兼容，如果以前传的不是数组，则转为数组
    // 业务中原有的调用不需要修改
    export function deleteUser(userId){
       return request(userApis.deleteUser, {
          params: {
             ids: Array.isArray(userId) ? userId : [userId]
          }
       })
    }
    

通过增加service这一层，隔离了业务组件对接口设计的依赖，降低了耦合，任他后端千变万化，前端代码岿然不动。

### 增加重复工作

如果我们要对接口返回的数据进行格式化，比如将后端返回的时间戳转为我们前端需要的格式，没有封装service就需要在多个业务组件中重复进行，而封装了service则只需要在某个方法中处理一次即可。

    // /domain/user/service.js
    import dayjs from 'dayjs'
    import userApis from './api.js';
    
    export function getUsers(page=1, page_size=-1){
       return request(userApis.getUsers, {
          params: {
             page: page ,
             page_size: page_size
          }
       }).then(res =>{
          (res.data || []).forEach(user =>{ 
              user.create_time = dayjs(user.create_time).format('DD/MM/YYYY')
          })
          return res;
       })
    }
    
    

所以你看，将所有的服务请求都封装到service.js中，在业务组件中调用service.js中提供的服务是一个非常简单且重要的事情。

网络请求方法request的封装
----------------

很多同学会在service中直接调用axios、fetch或其他http库进行网络请求，这样做违反了**依赖倒置原则**。

什么是依赖倒置原则呢？简单点说就是上层应用不应该依赖底层实现。从我们项目开发角度来说，项目代码属于上层应用，axios等库属于底层实现，项目要进行网络请求，不应该是axios有什么方法我就调用什么方法、axios提供了怎样的参数顺序和结构我就怎么传参，而是我的项目想要一个什么样的网络请求，怎么通过axios去实现它，要把axios当做底层工具，而你站在上层去提要求，第三方库是服务于你的，而不是反过来被第三方库绑架。

违反依赖倒置原则，会造成项目和第三方库深度耦合，不利于后期更换第三方库。以axios为例，如果我们在上面封装的service.js中大量使用axios.get、axios.post...，那么当有一天不想使用axios了，而是换成一个更牛的库newFetch（假想的），你怎么做呢，是不是要把所有的网络请求都替换一遍呢？假如newFetch和axios的参数名称不一致，这想起来都是一种灾难。

有同学说，这是过度设计吧，我的项目不会更换axios库的，我肯定会一直用到项目结束的。

首先没有什么第三方库是永远不变的，只是周期久一点而已，当年大家都还在用jQuery进行网络请求，现在可能都换成了axios，相信以后也会有新的库出现，就算没有新库出现，axios本身也是在迭代当中，也会有变化，当然也有可能某天axios不再维护了，或者授权模式发生了变更，谁又能说得准呢，总不能把自己的命运交到别人手上吧。

其次，也不是一定要让你封装一个全新的网络请求，只要转变下观念，不要在业务中出现axios这样具体的第三方库名也是可以的，你只要将axios.get改成request.get就可以了，虽然只是个命名的转变，但是背后的意义却不一样。假如我们把axios替换成了newFetch（一个想象的未来http库），你总不能在页面中还叫axios.get吧，显然很不合适，但如果你在业务中使用的是request.get，就毫无违和感，你不需要更改一行业务代码，你只要把request的实现修改一下即可，记住，你要的是网络请求，而不是axios！

     // /base/utils/requst.js
    // 封装一个自己的网络请求，哪怕现在你完全使用axios去实现
    
    import axios from 'axios';
    
    const axiosInstance = axios.create();
    export default axiosInstance;
    

    // /domain/user/service.js
    import request from 'base/utils/request.js';
    export function getUsers(page = 1, page_size = -1) {
       // 重要的事情说3遍
       //一定要叫request或者network，而不是axios
       //一定要叫request或者network，而不是axios
       //一定要叫request或者network，而不是axios
       return request(userApis.getUsers);
    }
    

看到这里会不会很失望，说好的封装一个网络请求方法，原来只要在使用时改一下名字就可以啊，就这么简单吗？的确，就这么简单，表面是改个名字，本质上是避免依赖倒置，而且axios确实已经做的很优秀了，提供了很好的交互API，而且还支持request、response拦截，我们可以很方便的进行参数处理和请求成功/失败处理，通过这种简单的改变，我们就获取了应对未来变化的能力，项目有足够的扩展能力，同时我们也没有进行过度的设计，没有增加开发成本。

### 实战

接下来，我们基于axios将我们的请求库request完整实现下，给大家一点参考，毕竟光说不练嘴把式。

开发任何一个组件、js库之前，都不要着急去写它的实现，而是要先假设你已经开发完了，看看别人应该怎么去用，怎么去用才是目标，怎么实现只是手段，做任何事都要先有目标然后再去行动，这也是新人最容易犯的错误，想到哪写到哪，对目标制定不重视。

我们先设定下要实现的request怎么使用：

    request('GET /api/v1/users', {
        params:{
            page: 1,
           page_size: 20
        }
    }).then(res=>{
        // res就是接口返回的有效数据，如果你们的接口返回格式为{code: 200, data: {}, message: ''}
        // 这里的res就代表data
    })
    
    //catch 会自动调用toast展示错误信息
    
    request('DELETE /api/v1/user/{id}', {
       params:{
          id: 1
       }
    })
    
    

我们的request要能支持前面提到的特殊格式的url，形如 'GET /api/v1/users'，能够自动解析method；请求返回Promise；在Promise.then中可以拿到接口的有效数据；Promise.catch中自动进行错误处理；如果url中含有模板变量，如{id}，要能从params中解析到id的值替换{id}。

在axios中，取消网络请求比较复杂，我们希望这块可以进行改进，增加一个getCancelMethod配置，通过该配置能直接拿到cancel方法。

    let cancel = null;
    
    request('GET /api/v1/users',{
        getCancelMethod: (c)=>{
           cancel = c;
        }
    }).then(res=>{
        // res就是接口返回的有效数据，如果你们的接口返回格式为{code: 200, data: {}, message: ''}
        // 这里的res就代表data
    })
    
    cancel();
    

目标有了，接下来需要分析怎么怎么实现了，我们可以通过axios的请求拦截器来拦截来处理url、配置cancelToken；通过响应拦截器来处理成功和失败的数据和交互，并不是很麻烦，我们开始编码。

首先，创建一个axios实例并将其导出。

    // /domain/user/service.js
    import axios from "axios";
    const instance = axios.create();
    
    export default instance
    

接下来我们开始处理url，将method从url配置中提取出来，通过字符串的split方法，将url配置通过空字符串分割成数组，保险起见，我们使用正则 /\\s+/ 来表示多个空格，降低配置出错的概率。

    //提取请求url中的method
    instance.interceptors.request.use(function (config) {
        let urlConfig = config.url.split(/\s+/);  //避免method和url之间有多个空格，导致取错
        if(urlConfig.length > 1){
            config.method = urlConfig[0].toLowerCase();
            config.url = urlConfig[1];
        }
        return config;
    });
    

对url的处理还缺少一个模板变量的替换，我不准备在上面的代码中继续添加这块逻辑，而是重新增加一个拦截器单独处理，确保一个拦截器只做一个工作，这样也更符合编程中的**单一职责**原则，可读性和维护性都更加好。

    //处理url中的参数
    instance.interceptors.request.use(function (config) {
        let url = config.url;
        let params = config.params;
        url = url.replace(/{(\w+)}/g, function (match, $1) {
           if(params[$1]){
               let value = params[$1];
               delete params[$1];
               return encodeURIComponent(value);
           }
        });
        config.url = url;
        return config;
    });
    

url的处理到此完毕，接下来实现取消请求的配置getCancelMethod，这个也是通过请求拦截来实现，同样的我们不应该将这个实现和上面url的拦截放到一起。

    import axios from "axios";
    const CancelToken = axios.CancelToken;
    
    //处理获取取消请求的配置
    instance.interceptors.request.use(function (config) {
       if(config.getCancelMethod && typeof config.getCancelMethod === 'function'){
          config.cancelToken = new CancelToken(function executor(c) {
             config.getCancelMethod(c);
          })
    
          delete config.getCancelMethod;
       }
       return config;
    });
    

最后是成功和失败的处理，假设我们的接口格式固定为{code,data,message}，如果code===200则只把data返回，其他情况以toast的形式将message展示给用户；失败时根据code码进行异常处理，如果401未登录则跳转到登录页面，其他情况展示错误信息。

    // 成功、失败处理
    instance.interceptors.response.use(function (response) {
        let {code, data, message} = response.data || {};
        if(code && code === 200){
            return Promise.resolve(data)
        }else{
            Notification({
                message: message || '接口错误',
                type: 'error'
            });
            return Promise.reject(response.data)
        }
    }, function (error) {
        if(error instanceof axios.AxiosError){
            switch (error.response.status){
                case 401:
                    location.href = '/login';
                    return
                default:{
                    Notification({
                        message: error.message || '接口异常',
                        type: 'error'
                    });
                }
            }
        }
        return Promise.reject(error);
    });
    

至此，前面我们对request的要求都已经实现了，完整代码如下：

    import axios from "axios";
    import { Notification } from 'element-ui';
    
    const instance = axios.create();
    const CancelToken = axios.CancelToken;
    
    //处理url中的参数
    instance.interceptors.request.use(function (config) {
       let url = config.url;
       let params = config.params;
       url = url.replace(/{(\w+)}/g, function (match, $1) {
          if(params[$1]){
             let value = params[$1];
             delete params[$1];
             return encodeURIComponent(value);
          }
       });
       config.url = url;
       return config;
    });
    
    //提取请求url中的method
    instance.interceptors.request.use(function (config) {
       let urlConfig = config.url.split(/\s+/);
       if(urlConfig.length > 1){
          config.method = urlConfig[0].toLowerCase();
          config.url = urlConfig[1];
       }
       return config;
    });
    
    
    
    //处理获取取消请求的配置
    instance.interceptors.request.use(function (config) {
       if(config.getCancelMethod && typeof config.getCancelMethod === 'function'){
          config.cancelToken = new CancelToken(function executor(c) {
             config.getCancelMethod(c);
          })
    
          delete config.getCancelMethod;
       }
       return config;
    });
    
    // 成功、失败处理
    instance.interceptors.response.use(function (response) {
       let {code, data, message} = response.data || {};
       if(code && code === 200){
          return Promise.resolve(data)
       }else{
          Notification({
             message: message || '接口错误',
             type: 'error'
          });
          return Promise.reject(response.data)
       }
    }, function (error) {
       if(error instanceof axios.AxiosError){
          switch (error.response.status){
             case 401:
                location.href = '/login';
                return
             default: {
                Notification({
                   message: error.message || '接口异常',
                   type: 'error'
                });
             }
          }
       }
       return Promise.reject(error);
    });
    
    export default instance
    

现在一个完整的request方法已经开发完成了，后续如果要更换成其他http库，我们就只需要修改request.js即可。

[代码示例](https://github.com/501351981/HighQualityCode/tree/main/network "https://github.com/501351981/HighQualityCode/tree/main/network")

从项目角度看网络请求
----------

### 文件目录结构

在第一节中我们提到过将业务代码分为三层：基础层、领域层和应用层，其中request.js属于基础层的utils；每个业务模块的配置，包括api.js和service.js属于领域层；对service.js中提供的方法的调用属于业务层，每个文件的存放位置如下：

    ├── base         //基础层
    │    └── utils          
    │       └── request.js  //封装的网络请求        
    ├── domain       //领域层
    │    └── user          
    │       ├── api.js        //用户接口配置
    │       └── service.js    //用户相关请求配置
    └── src          //应用层
        └── pages         //页面组件
            └── user-list    //请求 /domain/user/service 中的方法
    

### 网络请求层次结构

下图是项目中一个理想的网络请求分层结构：

![request-level.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0820a9c86b14d548f9087cea9e4b5b4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=513&h=352&s=22725&e=png&b=fefefe)

业务层代码只能调用service提供的方法，不能直接引用api或者request方法，更不能直接调用axios等第三方库。

service引用每个服务的api配置和封装的request方法完成网络请求，同样的在service中不能直接调用第三方http库。

request方法由第三方库来实现，可以通过axios或者fetch等任何http库来实现，更换第三方库不会影响其它层。

### 网络请求开发流程

分层之后，开发一个业务模块就有了固定的顺序，任何人只要按照这个顺序无脑进行即可。

1.  阅读API文档，创建api.js，进行API接口配置
2.  创建service服务，封装业务模块的增删改查方法
3.  创建业务组件，调用service服务

通过固化这个开发流程，可以大大提高开发速度和项目质量。

总结
--

其实想要写好网络请求并不难，只要保证以下三点即可：

*   所有的API不能硬编码，必须封装为常量
*   所有的增删改查必须封装为service服务，不能在业务模块中单独实现
*   任何业务代码和service中都不能出现第三方库调用

本节我们还反复提到了封装的概念，封装的目的是为了**隔离变化**，通过对api和service的封装，我们隔离了后端的变化对前端的影响，如果每次后端一变更接口你就需要进行大量的修改，那么是不是因为缺少封装？

本节还提到了2个新的设计原则：最小知识原则和依赖倒置原则。

*   最小知识原则：对一个功能模块的更改最好不要依赖大量的知识储备，在设计时就要考虑别人怎么用最简单，最好让一个新人就能快速上手。
    
*   依赖倒置原则：上层应用不应该依赖底层实现，而是要从甲方的角度去提要求，要关注我们需要什么，怎么用第三库来实现，而不是别人有什么我们用什么。通过依赖倒置原则解除了项目对第三方库（如axios）的依赖，实现了解耦。
    

开发一个项目的网络请求遵循一个固定的开发范式：配置api、创建service，然后业务调用service，心中要有一个分层架构图，上层只能调用下层，且不能跨层调用。