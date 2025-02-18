先不着急写其他两个微服务，我们先来写一下前端页面。

先来写下用户注册、登录页面。

新建个 react 项目：

```
npx create-vite exam-system-frontend
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/553187f51af049e9aa1553cfba72ba4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=762&h=496&s=61382&e=png&b=010101)
进入项目目录，把开发服务跑起来：

```
npm install
npm run dev
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41bbb3f8ede747818adcf4a453484a3f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=890&h=360&s=42885&e=png&b=181818)

浏览器访问 http://localhost:5173 可以看到这个界面：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f47006ca4a434e76b7f90191c9db823a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2560&h=1300&s=163824&e=png&b=ffffff)

就说明 react 项目成功跑起来了。

然后我们添加 router：

```
npm install --save react-router-dom
```
在 main.tsx 加上路由的配置：

```javascript
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Link, Outlet } from 'react-router-dom';

function Aaa() {
  return <div>aaa</div>;
}

function Bbb(){
  return <div>bbb</div>;
}

function Layout() {
  return <div>
    <div><Link to="/aaa">to aaa</Link></div>
    <div><Link to="/bbb">to bbb</Link></div>
    <div>
      <Outlet/>
    </div>
  </div>
}

const routes = [
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "aaa",
        element: <Aaa />,
      },
      {
        path: "bbb",
        element: <Bbb />,
      }    
    ],
  }
];
const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<RouterProvider router={router}/>);
```

配置了 3 个路由：

访问 / 的时候，渲染 Layout 组件。

访问 /aaa 的时候，渲染 Aaa 组件。

访问 /bbb 的时候，渲染 Bbb 组件。

以及出错的时候，渲染 ErrorPage 组件。

其中，aaa 和 bbb 是 / 的子路由，渲染在 Layout 组件的 Outlet 的地方。

这就是 React Router 的基本用法。

测试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8881b50534a9494a90d1d367e78a75aa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=996&h=386&s=156572&e=gif&f=39&b=fdfdfd)

都没问题。

然后创建 3 个组件：Login、Register、UpdatePassword 

pages/Login/index.tsx

```javascript
export function Login() {
    return <div>login</div>   
}
```

pages/Register/index.tsx

```javascript
export function Register() {
    return <div>register</div>
}
```

pages/UpdatePassword/index.tsx

```javascript
export function UpdatePassword() {
    return <div>UpdatePassword</div>
}
```


改下 index.tsx 配置对应的路由：

```javascript
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { UpdatePassword } from './pages/UpdatePassword';

const routes = [
  {
    path: "/",
    element: <div>index</div>,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "update_password",
    element: <UpdatePassword />,
  }
];
const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<RouterProvider router={router}/>);
```
测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e554c8849984a5998e55feea9993f90~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=750&h=234&s=18928&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e6d566943aa4471a31282ccf1b13a84~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=778&h=204&s=19824&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db21bb1fb4dc4246b6856c4421b3894d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=770&h=230&s=21752&e=png&b=ffffff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6eaa12a16b034bd2a6ae2a3b511351ee~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=896&h=198&s=26451&e=png&b=ffffff)

都没啥问题。

然后来写 Login 页面：

引入 Ant Design 组件库：

```
npm install antd --save
```
在 Login 组件引入 DatePicker 组件：

```javascript
import { DatePicker } from "antd";

export function Login() {
    return <div><DatePicker/></div>   
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25ba81ac6f8542c78a03f2274b846240~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1166&h=838&s=80110&e=png&b=fefefe)

没啥问题，说明 antd 引入成功了。

然后我们把登录页面写一下：

```javascript
import { Button, Checkbox, Form, Input } from 'antd';
import './index.css';

interface LoginUser {
    username: string;
    password: string;
}

const onFinish = (values: LoginUser) => {
    console.log(values);
};


const layout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
}

const layout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 }
}

export function Login() {
    return <div id="login-container">
        <h1>考试系统</h1>
        <Form
            {...layout1}
            onFinish={onFinish}
            colon={false}
            autoComplete="off"
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                {...layout2}
            >
                <div className='links'>
                    <a href='/register'>创建账号</a>
                    <a href='/update_password'>忘记密码</a>
                </div>
            </Form.Item>

            <Form.Item
                {...layout2}
            >
                <Button className='btn' type="primary" htmlType="submit">
                    登录
                </Button>
            </Form.Item>
        </Form>
    </div>   
}
```

其中，layout 是 label 和 wrapper 的比例分配，antd 的栅格系统一共分了 24 份。

上面两个 Form.Item 是 label 4 份，wrapper 20 份。

下面两个 Form.Item 是 label 0 份，wrapper 24 份。

colon 为 false 是去掉 label 后的冒号

然后 css 部分如下：

```css
#login-container {
    width: 400px;
    margin: 100px auto 0 auto;
    text-align: center;
}
#login-container .links {
    display: flex;
    justify-content: space-between;
}
#login-container .btn {
    width: 100%;
}
```
访问 /login，可以看到现在的登录页面：


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/756096043cbe4b5792c1b1b8f6d40fa2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2124&h=868&s=76633&e=png&b=ffffff)

输入用户名、密码，点击登录：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d7db80daf13437db65aec7ca0dd5f35~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2206&h=1128&s=137457&e=png&b=ffffff)

控制台打印了拿到的表单值。

我们安装下 axios：

```
npm install --save axios
```
我们把后端用户微服务跑起来：

```
npm run start:dev user
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c959402ce9f431e8158dbb1a51d67c0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1682&h=592&s=220332&e=png&b=181818)

在前端项目创建个 interfaces/index.ts

```javascript
import axios from "axios";

const userServiceInstance = axios.create({
    baseURL: 'http://localhost:3001
    /',
    timeout: 3000
});

export async function login(username: string, password: string) {
    return await userServiceInstance.post('/user/login', {
        username, password
    });
}
```

在这里集中管理接口。

然后在 Login 组件 onFinish 里调用：

```javascript
const onFinish = async (values: LoginUser) => {
    try {
        const res = await login(values.username, values.password);
        if(res.status === 201 || res.status === 200) {
            message.success('登录成功');

            console.log(res.data);
        } 
    } catch(e: any){
        message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
    }
};
```
在 user 微服务开启跨域：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b99aaf5c2dac427bb148b740574f6f56~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1666&h=828&s=245475&e=png&b=1d1d1d)

登录下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4985322ad25c42bc939d0ed741da9944~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2336&h=1194&s=546412&e=gif&f=55&b=fefefe)

然后完善下 onFinish 方法：

```javascript
const onFinish = async (values: LoginUser) => {
    try {
        const res = await login(values.username, values.password);
        if(res.status === 201 || res.status === 200) {
            message.success('登录成功');

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userInfo', JSON.stringify(res.data.user));
        } 
    } catch(e: any){
        message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
    }
};
```

返回 success 的时候，把 token 和 userInfo 存入 localStorage

测试下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd9b9ce3946b4e76ace3b919211cdc75~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2404&h=1324&s=320795&e=gif&f=27&b=fefefe)

这样，登录的前后端功能就都完成了。

然后来写下注册页面：

实现下 Register 页面组件：

```javascript
import { Button, Form, Input, message } from 'antd';
import './index.css';
import { useForm } from 'antd/es/form/Form';

export interface RegisterUser {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    captcha: string;
}

const onFinish = async (values: RegisterUser) => {
    console.log(values);
};


const layout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

const layout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 }
}

export function Register() {
    const [form] = useForm();

    return <div id="register-container">
        <h1>考试系统</h1>
        <Form
            form={form}
            {...layout1}
            onFinish={onFinish}
            colon={false}
            autoComplete="off"
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="确认密码"
                name="confirmPassword"
                rules={[{ required: true, message: '请输入确认密码!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="邮箱"
                name="email"
                rules={[
                    { required: true, message: '请输入邮箱!' },
                    { type: "email", message: '请输入合法邮箱地址!'}
                ]}
            >
                <Input />
            </Form.Item>

            <div className='captcha-wrapper'>
                <Form.Item
                    label="验证码"
                    name="captcha"
                    rules={[{ required: true, message: '请输入验证码!' }]}
                >
                    <Input />
                </Form.Item>
                <Button type="primary">发送验证码</Button>
            </div>

            <Form.Item
                {...layout2}
            >
                <div className='links'>
                    已有账号？去<a href='/login'>登录</a>
                </div>
            </Form.Item>

            <Form.Item
                {...layout1}
                label=" "
            >
                <Button className='btn' type="primary" htmlType="submit">
                    注册
                </Button>
            </Form.Item>
        </Form>
    </div>   
}
```

和登录页面差不多，只不过多了一个验证码。

对应的 register.css 如下：

```css
#register-container {
    width: 400px;
    margin: 100px auto 0 auto;
    text-align: center;
}
#register-container .links {
    display: flex;
    justify-content: flex-end;
}
#register-container .btn {
    width: 100%;
}
#register-container .captcha-wrapper {
    display: flex;
    justify-content: flex-end;
}
```

浏览器访问下

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c6f069e29ba4cd78ee8829a670f322d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2430&h=1232&s=124771&e=png&b=ffffff)

填入信息，点击注册，控制台会打印表单值：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa5c283e3fd446aaa7b1bfcfb66208b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1894&h=1386&s=202387&e=png&b=ffffff)

然后来调用下注册接口和发送验证码的接口。

在 interfaces 里添加这两个接口：

```javascript
export async function registerCaptcha(email: string) {
    return await userServiceInstance.get('/user/register-captcha', {
        params: {
            address: email
        }
    });
}

export async function register(registerUser: RegisterUser) {
    return await userServiceInstance.post('/user/register', registerUser);
}
```
先调用发送验证码接口：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/470ee645b6534b8aac4a68009d75a28d~tplv-k3u1fbpfcp-watermark.image?)

绑定点击事件。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bed45d8784924f69944076a596327e35~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1056&h=600&s=148564&e=png&b=1f1f1f)

使用 useForm 来拿到 form 的 api

```javascript
async function sendCaptcha() {
    const address = form.getFieldValue('email');
    if(!address) {
        return message.error('请输入邮箱地址');
    }

    try {
        const res = await registerCaptcha(address);
        if(res.status === 201 || res.status === 200) {
            message.success('发送成功');
        }
    } catch(e: any) {
        message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
    }
}
```
在 sendCaptcha 里调用接口发送验证码。

测试下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f31b5fdb2e8944a2923e188367915a2f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2338&h=1116&s=142418&e=gif&f=32&b=fefefe)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9084f187cc7c4ca1b3cc06ad2595233a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=534&h=238&s=36250&e=png&b=f5f5f5)

没啥问题。

然后再来调用注册接口：

```javascript
const onFinish = async (values: RegisterUser) => {
    if(values.password !== values.confirmPassword) {
        return message.error('两次密码不一致');
    }
    const res = await register(values);

    if(res.status === 201 || res.status === 200) {
        message.success('注册成功');

    } else {
        message.error(res.data.data || '系统繁忙，请稍后再试');
    }
}
```
测试下：

填入信息，点击发送验证码：


![2024-08-26 10.22.17.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85e107a6bd784621aa4d6a4321737ad4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2338&h=1116&s=152063&e=gif&f=29&b=fefefe)

去邮箱里看一下验证码：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a5d5d2f44034f7694fb54000470198b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=546&h=308&s=38551&e=png&b=f6f6f6)

填入验证码，点击注册：

![2024-08-26 10.23.14.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f68d5a3bb994ff784437db5556869c7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2338&h=1116&s=145510&e=gif&f=19&b=fefefe)
注册成功，数据库里也看到了这条记录：


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33e62dd60b8441ee8eec1c6ec3243168~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1154&h=272&s=120557&e=png&b=f8f8f8)

这样，注册的前后端流程就走完了。

然后调用 useNavigate 的 navigate 方法，注册成功后导航到登录页：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74abcd37928b45d084f454cffb453efb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1302&h=904&s=193185&e=png&b=1f1f1f)
```javascript
const onFinish = async (values: RegisterUser) => {
    if(values.password !== values.confirmPassword) {
        return message.error('两次密码不一致');
    }
    try {
    const res = await register(values);

    if(res.status === 201 || res.status === 200) {
        message.success('注册成功');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    } 
    } catch(e: any) {
        message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
    }
}
```


![2024-08-26 10.23.14.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6144d744cdb49579ec9252220fbb344~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2338&h=1116&s=145510&e=gif&f=19&b=fefefe)

同理，login 成功也要加上跳转逻辑：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a37004c53f84616986617fee0c9a322~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1606&h=926&s=223575&e=png&b=1f1f1f)

这样，登录和注册的前后端功能就都完成了。

案例代码在小册仓库：

[前端代码](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/exam-system-frontend)

[后端代码](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/exam-system)

## 总结

这节我们打通了前后端，加上了登录、注册、首页等页面。

首先，引入了 React Router 来做路由，引入了 antd 来做 UI 组件库。

然后，引入了 axios 来发请求。

发送邮件验证码正常，注册之后数据库也多了记录，登录成功之后 localStorage 也有了用户信息。

这样，注册登录就实现了完整的前后端功能。
