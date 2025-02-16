### 本资源由 itjc8.com 收集整理
﻿Nginx 是流行的服务器，一般用它对静态资源做托管、对动态资源做反向代理。

Docker 是流行的容器技术，里面可以跑任何服务。

那 Docker + Nginx 如何结合使用呢？

我们来试一下：

搜索 nginx（这一步需要科学上网，因为要访问 hub.docker.com 这个网站），点击 run：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-1.png)

输入容器名和要映射的端口：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-2.png)

这里把宿主机的 81 端口映射到容器内的 80 端口，点击 run。

这时候就可以看到 docker 容器跑起来了，并且打印了日志：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-3.png)

浏览器访问下 http://localhost:81 可以看到 nginx 欢迎页面：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-4.png)

这很明显是容器里跑的服务。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-5.png)

但是现在的页面是默认的，我想用 nginx 来托管我的一些静态 html 页面怎么做呢？

首先我们要知道现在的配置文件和页面都存在哪里。

在 files 面板可以看到容器内的文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-6.png)

里面的 /usr/share/nginx/html/ 目录下面就是所有的静态文件。

双击点开 index.html 看看：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-7.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-8.png)

和我们浏览器看到的页面一毛一样。

也就是说，这个目录就是保存静态文件的目录。

那我们在这个目录下放我们自己的 html 不就行了？

我们先把这个目录复制出来：

```
docker cp  nginx1:/usr/share/nginx/html ~/nginx-html
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-9.png)

docker cp 这个命令就是用于在宿主机和容器之间复制文件和目录的。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-10.png)

比如我们把这个目录再复制到容器里：

```
docker cp  ~/nginx-html nginx1:/usr/share/nginx/html-xxx
```

可以看到容器内就多了这个目录：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-11.png)

然后我们在这个目录下添加两个 html 来试试看：

```
echo aaa > aaa.html

echo bbb > bbb.html

docker cp  ~/nginx-html nginx1:/usr/share/nginx/html
````
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-12.png)

但当目标目录存在的时候，docker 会把他复制到目标目录下面：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-13.png)

我们需要先删除容器的这个目录，再复制：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-14.png)

```
docker cp  ~/nginx-html nginx1:/usr/share/nginx/html
```
这样就好了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-15.png)

然后浏览器访问下试试：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-16.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-17.png)

现在就可以访问容器内的这些目录了。

也就是说只要放到 /usr/share/nginx/html 下的文件，都可以通过被访问到。

可是为什么呢？

这是因为 nginx 的默认配置。

我们看下 nginx 配置文件，也就是 /etc/nginx/nginx.conf。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-18.png)

复制出来看看：

```
docker cp  nginx1:/etc/nginx/nginx.conf ~/nginx-html
```

这是就是 nginx 的默认配置：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-19.png)

其实这个 nginx.conf 叫做主配置文件，里面一般做一些全局的配置，比如错误日志的目录等等。

可以看到 http 下面有个 include 引入了 /etc/nginx/conf.d/*.conf 的配置。

一般具体的路由配置都是在这些子配置文件里。

目录 conf.d 是 configuration directory 的意思。

我们把这个目录也复制出来看看：

```
docker cp  nginx1:/etc/nginx/conf.d ~/nginx-html
```

这里面就配置了 localhost:80 的虚拟主机下的所有路由。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-20.png)

虚拟主机是什么呢？

就是可以用一台 nginx 服务器来为多个域名和端口的提供服务。

只要多加几个 server 配置就可以。

这里我们就配置 localhost:80 这一个虚拟主机。

下面的 location 就是路由配置。

比如这个配置：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-21.png)

它就配置了 / 下的所有路由，都是在 root 指定的目录查找。

所以 http://localhost/aaa.html 就是从 /usr/share/nginx/html/aaa.html 找的。

location 支持的语法有好几个，我们分别试一下：
```nginx
location = /111/ {
    default_type text/plain;
    return 200 "111 success";
}

location /222 {
    default_type text/plain;
    return 200 $uri;
}

location ~ ^/333/bbb.*\.html$ {
    default_type text/plain;
    return 200 $uri;
}

location ~* ^/444/AAA.*\.html$ {
    default_type text/plain;
    return 200 $uri;
}
```
把之前的 location / 删掉，添加这样几个路由配置。

具体这些配置都是什么意思待会再说。

把这个文件复制到容器内：

```
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```
然后在容器内的 terminal 执行：

```
nginx -s reload
```
重新加载配置文件。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-22.png)

然后来看第一条路由：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-23.png)

location 和路径之间加了个 =，代表精准匹配，也就是只有完全相同的 url 才会匹配这个路由。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-24.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-25.png)

不带 = 代表根据前缀匹配，后面可以是任意路径。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-26.png)

这里的 $uri 是取当前路径。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-27.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-28.png)

然后如果想支持正则，就可以加个 ~。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-29.png)

这里的正则语法不难看懂，就是 /333/bbb 开头，然后中间是任意字符，最后 .html 结尾的 url。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-30.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-31.png)

但是它是区分大小写的，比如这样就不行了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-32.png)

换成小写就可以：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-33.png)

如果想让正则不区分大小写，可以再加个 \*

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-34.png)

试一下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-35.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-36.png)

任意的大小写都是可以的。

此外，还有一种语法：

在配置文件加上这个配置：

```
location /444 {
    default_type text/plain;
    return 200 'xxxx';
}
```

然后复制到容器里，并 reload：

```
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-37.png)

这时候就有两个 /444 的路由了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-38.png)

这时候浏览器访问，还是匹配上面的那个路由：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-39.png)

如果想提高优先级，可以使用 ^~

改成这样：

```
location ^~ /444 {
    default_type text/plain;
    return 200 'xxxx';
}
```
然后复制到容器里，并 reload：

```
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-40.png)

这时候同一个 url，匹配的就是下面的路由了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-41.png)

也就是说 ^~ 能够提高前缀匹配的优先级。

总结一下，一共 4 个 location 语法：

location = /aaa 是精确匹配 /aaa 的路由。

location /bbb 是前缀匹配 /bbb 的路由。

location ~ /ccc.\*.html 是正则匹配。可以再加个 \* 表示不区分大小写 location ~\* /ccc.\*.html 

location ^~ /ddd 是前缀匹配，但是优先级更高。

 这 4 种语法的优先级是这样的：

**精确匹配（=） > 高优先级前缀匹配（^~） > 正则匹配（～ ~\*） > 普通前缀匹配**

我们现在是直接用 return 返回的内容，其实应该返回 html 文件。

可以这样改：

```
location /222 {
    alias /usr/share/nginx/html;
}

location ~ ^/333/bbb.*\.html$ {
    alias /usr/share/nginx/html/bbb.html;
}
```
然后复制到容器里，并 reload：

```
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-42.png)

都是能正确返回对应的 html 的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-43.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-44.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-45.png)

前面用过 root：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-46.png)

root 和 alias 有什么区别呢？

比如这样的两个配置：

```
location /222 {
    alias /dddd;
}

location /222 {
    root /dddd;
}
```

同样是 /222/xxx/yyy.html，如果是用 root 的配置，会把整个 uri 作为路径拼接在后面。

也就是会查找 /dddd/222/xxx/yyy.html 文件。

如果是 alias 配置，它会把去掉 /222 之后的部分路径拼接在后面。

也就是会查找 /dddd/xxx/yyy.html 文件。

也就是 我们 **root 和 alias 的区别就是拼接路径时是否包含匹配条件的路径。**

这就是 nginx 的第一个功能：静态文件托管。

主配置文件在 /etc/nginx/nginx.conf，而子配置文件在 /etc/nginx/conf.d 目录下。

默认的 html 路径是 /usr/share/nginx/html。

然后来看下 nginx 的第二大功能：动态资源的反向代理。

什么是正向、什么是反向呢？

从用户的角度看，方向一致的就是正向，反过来就是反向。

比如这样两个代理：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-47.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-48.png)

第一个是正向代理，第二个是反向代理。

第一个代理是代理的用户请求，和用户请求方向一致，叫做正向代理。

第二个代理是代理服务器处理用户请求，和用户请求方向相反，叫做反向代理。

测试 nginx 做反向代理服务器之前，我们先创建个 nest 服务。

```
npx nest new nest-app -p npm
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-49.png)

把服务跑起来：

```
npm run start:dev
```
![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-50.png)

浏览器就访问 http://localhost:3000 看到 hello world 就代表 nest 服务跑成功了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-51.png)

添加一个全局的前缀 /api

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-52.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-53.png)

改下 nginx 配置，添加个路由：

```
location ^~ /api {
    proxy_pass http://192.168.1.6:3000;
}
```

这个路由是根据前缀匹配 /api 开头的 url， ^~ 是提高优先级用的。

然后复制到容器里，并 reload：

```
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-54.png)

然后你访问 http://localhost:81/api 就可以看到 nest 服务返回的响应了：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-55.png)

也就是这样的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-56.png)

为什么要多 nginx 这一层代理呢？

自然是可以在这一层做很多事情的。

比如修改 header：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-57.png)

然后复制到容器里，并 reload：

```
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-58.png)

在 nest 服务的 handler 里注入 headers，打印一下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-59.png)

然后浏览器访问下。

直接访问 nest 服务的话，是没有这个 header 的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-60.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-61.png)

访问 nginx 的反向代理服务器，做一次中转：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-62.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-63.png)

这就是反向代理服务器的作用，可以透明的修改请求、响应。

而且，还可以用它实现负载均衡。

在 controlller 里打印下访问日志：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-64.png)

把 nest 服务停掉，然后重新 npm run start

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-65.png)

3001 和 3002 端口各跑一个：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-66.png)

浏览器访问下，都是正常的：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-67.png)

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-68.png)

控制台也打印了访问日志：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-69.png)

问题来了，现在有一个 nginx 服务器，两个 nest 服务器了，nginx 该如何应对呢？

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-70.png)

nginx 的解决方式就是负载均衡，把请求按照一定的规则分到不同的服务器。

改下 nginx 配置文件：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-71.png)

在 upstream 里配置它代理的目标服务器的所有实例。

下面 proxy_pass 通过 upstream 的名字来指定。

然后复制到容器里，并 reload：

```
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-72.png)

这时候我访问 http://localhost:81/api 刷新 5 次页面：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-73.png)

可以看到两个 nest 服务，一个 3 次，一个 2 次。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-74.png)

因为默认是轮询的方式。

一共有 4 种负载均衡策略：

- 轮询：默认方式。
- weight：在轮询基础上增加权重，也就是轮询到的几率不同。
- ip_hash：按照 ip 的 hash 分配，保证每个访客的请求固定访问一个服务器，解决 session 问题。
- fair：按照响应时间来分配，这个需要安装 nginx-upstream-fair 插件。

我们测试下 weight 和 ip_hash 的方式。

添加一个 weight=2，默认是 1，这样两个服务器轮询到的几率是 2 比 1。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-75.png)

然后复制到容器里，并 reload：

```
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-76.png)

按 command + k，把 nest 服务的控制台日志清空下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-77.png)

然后我访问了 8 次 http://localhost:81/api

看打印的日志来看，差不多就是 2:1 的轮询几率。

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-78.png)

这就是带权重的轮询。

我们再试下 ip_hash 的方式；

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-79.png)

然后复制到容器里，并 reload：

```
docker cp ~/nginx-html/conf.d/default.conf nginx1:/etc/nginx/conf.d/default.conf
```

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-80.png)

按 command + k，把 nest 服务的控制台日志清空下：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-81.png)

再次访问了 http://localhost:81/api

可以看到一直请求到了一台服务器：

![](//liushuaiyang.oss-cn-shanghai.aliyuncs.com/nest-docs/image/第65章-82.png)

这就是 Nginx 的负载均衡的策略。

## 总结

我们通过 docker 跑了 nginx 服务器，并使用了它的静态资源托管功能，还有动态资源的反向代理功能。

nginx 的配置文件在 /etc/nginx/nginx.conf 里，它默认还引入了 /etc/nginx/conf.d 下的子配置文件。

默认 html 都放在 /usr/share/nginx/html 下。

我们可以通过 docker cp 来把容器内文件复制到宿主机来修改。

修改 nginx 配置，在 server 里配置路由，根据不同的 url 返回不同的静态文件。

有 4 种 location 语法：

- location /aaa 根据前缀匹配
- location ^~ /aaa 根据前缀匹配，优先级更高
- location = /aaa 精准匹配
- location ~ /aaa/.\*html 正则匹配
- location ~\* /aaa/.\*html 正则匹配，而且不区分大小写

优先级是 精确匹配（=） > 高优先级前缀匹配（^~） > 正则匹配（～ ~\*） > 普通前缀匹配

除了静态资源托管外，nginx 还可以对动态资源做反向代理。

也就是请求发给 nginx，由它转发给应用服务器，这一层也可以叫做网关。

nginx 反向代理可以修改请求、响应信息，比如设置 header。

当有多台应用服务器的时候，可以通过 upstream 配置负载均衡，有 4 种策略：轮询、带权重的轮询、ip_hash、fair。

掌握了静态资源托管、动态资源的反向代理+负载均衡，就算是掌握了 Nginx 的核心用法了。



