### 本资源由 itjc8.com 收集整理
﻿软件开发一般不会上来就是最终版本，而是会一个版本一个版本的迭代。

新版本上线前都会经过测试，但就算这样，也不能保证上线了不出问题。

所以，在公司里上线新版本代码一般都是通过灰度系统。

灰度系统可以把流量划分成多份，一份走新版本代码，一份走老版本代码。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-1.png)

而且灰度系统支持设置流量的比例，比如可以把走新版本代码的流程设置为 5%，没啥问题再放到 10%，50%，最后放到 100% 全量。

这样可以把出现问题的影响降到最低。

不然一上来就全量，万一出了线上问题，那就是大事故。

而且灰度系统不止这一个用途，比如产品不确定某些改动是不是有效的，就要做 AB 实验，也就是要把流量分成两份，一份走 A 版本代码，一份走 B 版本代码。

那这样的灰度系统是怎么实现的呢？

其实很多都是用 nginx 实现的。

nginx 是一个反向代理的服务，用户请求发给它，由它转发给具体的应用服务器。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-2.png)

这一层也叫做网关层。

由它负责转发请求给应用服务器，那自然就可以在这里控制流量的分配，哪些流量走版本 A，哪些流量走版本 B。

下面我们实现一下：

首先，我们准备两个版本的代码。

这里创建个 nest 项目：

```
npx nest new gray_test -p npm
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-3.png)

把 nest 服务跑起来：

```
npm run start
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-4.png)

浏览器访问下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-5.png)

看到 hello world 代表 nest 服务跑起来了。

然后改下 AppService：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-6.png)

修改下端口：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-7.png)

然后再 npm run start：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-8.png)

浏览器访问下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-9.png)

现在我们就有了两个版本的 nest 代码。

接下来的问题是，如何用 nginx 实现灰度，让一部分请求走一个版本的代码，一部分请求走另一个版本呢？

我们先跑一个 nginx 服务。

docker desktop 搜索 nginx 镜像（这步需要科学上网），点击 run：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-10.png)

设置容器名为 gray1，端口映射宿主机的 82 到容器内的 80

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-11.png)

现在访问 http://localhost:82 就可以看到 nginx 页面了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-12.png)

我们要修改下配置文件，把它复制出来：

```
docker cp gray1:/etc/nginx/conf.d ~/nginx-config
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-13.png)

然后编辑下这个 default.conf

添加这么一行配置：
```nginx
location ^~ /api {
    rewrite ^/api/(.*)$ /$1 break;
    proxy_pass http://192.168.1.6:3001;
}
```
这行就是加了一个路由，把 /api/ 开头的请求转发给 http://宿主机IP:3001 这个服务。

用 rewrite 把 url 重写了，比如 /api/xxx 变成了 /xxx。

然后我们重新跑个 nginx 容器：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-14.png)

容器名为 gray2，端口映射 83 到容器内的 80。

指定数据卷，挂载本地的 ～/nginx-config 目录到容器内的 /etc/nginx/conf.d 目录。

点击 run。

然后看下 files 部分：

可以看到容器内的 /etc/nginx/conf.d 目录标识为了 mounted。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-15.png)

点开看看：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-16.png)

这就是本地的那个文件。

我们在本地改一下试试：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-17.png)

容器内也同样修改了。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-18.png)

在容器内修改这个文件，本地同样也会修改。

也就是说挂载数据卷之后，容器内的这个目录就是本地目录，是同一份。

然后我们访问下 http://localhost:83/api/ 看看：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-19.png)

nest 服务访问成功了。

现在我们不是直接访问 nest 服务了，而是经历了一层 nginx 反向代理或者说网关层。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-20.png)

自然，我们可以在这一层实现流量控制的功能。

前面我们讲负载均衡的时候，是这么配的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-21.png)

默认会轮询把请求发给 upstream 下的 server。

现在需要有多组 upstream：

```nginx
upstream version1.0_server {
    server 192.168.1.6:3000;
}
 
upstream version2.0_server {
    server 192.168.1.6:3001;
}

upstream default {
    server 192.168.1.6:3000;
}
```
有版本 1.0 的、版本 2.0 的，默认的 server 列表。

然后需要根据某个条件来区分转发给哪个服务。

我们这里根据 cookie 来区分：

```nginx
set $group "default";
if ($http_cookie ~* "version=1.0"){
    set $group version1.0_server;
}

if ($http_cookie ~* "version=2.0"){
    set $group version2.0_server;
}

location ^~ /api {
    rewrite ^/api/(.*)$ /$1 break;
    proxy_pass http://$group;
}
```
如果包含 version=1.0 的 cookie，那就走 version1.0_server 的服务，有 version=2.0 的 cookie 就走 version2.0_server 的服务，否则，走默认的。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-22.png)

这样就实现了流量的划分，也就是灰度的功能。

然后我们重新跑下容器：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-23.png)

这时候，你访问 http://localhost:83/api/ 走到的就是默认的版本。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-24.png)

然后带上 version=2.0 的 cookie，走到的就是另一个版本的代码：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-25.png)

这样，我们就实现了灰度的功能。

但现在还有一个问题：

什么时候设置的这个 cookie 呢？

比如我想实现 80% 的流量走版本 1.0，20% 的流量走版本 2.0

其实公司内部一般都有灰度配置系统，可以配置不同的版本的比例，然后流量经过这个系统之后，就会返回 Set-Cookie 的 header，里面按照比例来分别设置不同的 cookie。

比如随机数载 0 到 0.2 之间，就设置 version=2.0 的 cookie，否则，设置 version=1.0 的 cookie。

这也叫做流量染色。

完整的灰度流程是这样的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第66章-26.png)

第一次请求的时候，会按照设定的比例随机对流量染色，也就是设置不同 cookie。

再次访问的时候会根据 cookie 来走到不同版本的代码。

其中，后端代码会根据 cookie 标识来请求不同的服务（或者同一个服务走不同的 if else），前端代码可以根据 cookie 判断走哪段逻辑。

这就实现了灰度功能，可以用来做 5% 10% 50% 100% 这样逐步上线的灰度上线机制。

也可以用来做产品的 AB 实验。

公司里都会用这样的灰度系统。

## 总结

新版本代码的上线基本都会用灰度系统，可以逐步放量的方式来保证上线过程不会出大问题，也可以用来做产品 AB 实验。

我们可以用 nginx 实现这样的功能。

nginx 有反向代理的功能，可以转发请求到应用服务器，也叫做网关层。

我们可以在这一层根据 cookie 里的 version 字段来决定转发请求到哪个服务。

在这之前，还需要按照比例来给流量染色，也就是返回不同的 cookie。

不管灰度系统做的有多复杂，底层也就是流量染色、根据标记转发流量这两部分，我们完全可以自己实现一个。
