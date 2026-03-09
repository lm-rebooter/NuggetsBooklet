上节实现了 Google 账号登录的后端代码，这节在前端代码里调用下就好了。

类似 https://login.docker.com/u/login 

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3fddf163690c4a25886d4beda26556fb~tplv-k3u1fbpfcp-watermark.image?)

在登录框下加个 google 账号登录的按钮。

改下 Login.tsx

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/302b79cb7f95478698ef6181c471bd14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1424&h=1104&s=193700&e=png&b=1f1f1f)

```javascript
<Form.Item
    {...layout2}
>
    <div>
        <a href="#" onClick={() => {
            window.location.href = "http://localhost:3005/user/google";
        }}>Google 账号登录</a>
    </div>
</Form.Item>
```
点击的时候跳转 google 登录页面。

试一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b3c94eb04b04110b582aa98f62363bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2734&h=1712&s=662929&e=gif&f=42&b=fdfdfd)

跳转没问题。

再看下 cookie：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3987e6983ebb4ab3b94e1ceb0f7f4e7f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1740&h=752&s=172668&e=png&b=f8f6fc)

也没问题。

接下来只需要在首页处理下 cookie，同步登录状态就好了。

那怎么同步登录状态呢？

看下之前的登录流程：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee3f4e7c9ff44cb5acc911dff6acbdca~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3038&h=1412&s=777220&e=gif&f=28&b=fbf8fc)

登录后再 localStorage 里保存了 access_token、refresh_token、user_info 这三个信息，这就是保存了登录状态了。

那现在只要判断下有这三个 cookie，就把它设置到 localStorage，然后刷新下页面不就好了？

安装下操作 cookie 的包：

```
npm install --save js-cookie
npm i --save-dev @types/js-cookie
```
然后在 Index 组件里写下逻辑：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7846fad7def24d8c9552792a81631332~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1188&h=1036&s=247203&e=png&b=1f1f1f)

```javascript
useEffect(() => {
    const userInfo = cookies.get('userInfo');
    const accessToken = cookies.get('accessToken');
    const refreshToken = cookies.get('refreshToken');

    if(userInfo && accessToken && refreshToken) {
        localStorage.setItem('user_info', userInfo);
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        cookies.remove('userInfo');
        cookies.remove('accessToken');
        cookies.remove('refreshToken');
    }
}, []);
```

如果 cookie 包含 userInfo、accessToken、refreshToken，就设置到 localStorage，然后把 cookie 删掉。

再试下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf8d1399919f49b7a31df9f5f5be9fd1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2714&h=1700&s=676775&e=gif&f=34&b=fdfdfd)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/667ae1eed1e34989a1e58ea5ba6fae79~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2722&h=1386&s=153951&e=png&b=ffffff)

登录成功！

短时间内再次登录不需要再次授权：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/048d0bfaf4a34381ac063d91ca4a10ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2744&h=1672&s=345026&e=gif&f=27&b=fdfdfd)

你用 [dockerhub](https://hub.docker.com/u/login) 也是这样：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96b458a937574ef0a402e39fbd7baa08~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2786&h=1718&s=429905&e=gif&f=37&b=f9f9fb)

这样，Google 账号登录的前端代码就完成了。

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/meeting_room_booking_system_frontend_user)

## 总结

这节我们实现了 Google 账号登录的前端部分。

点击 Google 登录按钮的时候修改 location.href 为 /user/google 触发 Google 账号登录授权。

授权后会回调 /user/callback/google，我们在接口查询了用户信息，通过 cookie 返回 userInfo 和 jwt 的 token，然后重定向到首页。