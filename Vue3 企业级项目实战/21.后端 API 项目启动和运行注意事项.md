之前的几篇内容已经讲解了一些基础的知识点，在正式进入开发之前呢，我们先来体验一下这个开源的前后端分离 Vue3 企业级项目，本篇文章主要是讲一些注意事项，让大家可以顺利的运行源码并进行个性化修改。

牵涉到的项目模块如下：

- 后端 API 项目
- **vue3-admin 项目(详见[《Vue3 实战项目启动篇》](https://juejin.cn/book/6933939264455442444/section/6933954525510238223))**

>一个 Spring Boot 后端项目和一个前端 Vue 项目，相关的基础环境也需要搭建好。

由于牵涉到的项目较多，所以这些知识点会在多篇文章中介绍，**接下来的两篇文章主要是讲解一下项目的启动和需要特别注意的个性化配置，让大家可以快速上手使用 vue3-admin 实战项目。**

<p style="color:red;">这里需要对大家特别提醒一下，后端接口我已经在服务器上部署和上线了，供大家直接查看和调用，如果你只想看 Vue 项目基础环境的搭建和启动而不想搭建后端项目环境，可以直接看第 11 讲专门介绍前端环境搭建和启动的文章。</p>

[点击查看 API 在线接口文档](http://backend-api-02.newbee.ltd/swagger-ui.html)

课程所讲解的这个 Vue3 企业级项目已经于 2021 年 4 月正式开源到 GitHub 和 Gitee 两个平台，为了让大家更快的体验到咱们的实战项目，我安排在这一篇文章把最终的实战项目的使用和注意事项提前分享给大家，主要是为了给大家能够获得更好的学习体验，不用等到咱们全部看完这本小册才看了解到这个开源项目的使用和部署教程，大家可以在学习小册的同时也能够尽快的了解咱们的这个企业级的 Vue3 实战项目。

>如果有其他部署或者使用问题，我也会继续对本文进行知识点的补充。

## 下载源码

在后端 API 项目部署项目之前，首先我们需要把项目的源码下载到本地，在 GitHub 平台和国内的码云平台都创建了代码仓库，考虑到国内访问 GitHub 网站可能速度上有些慢，所以在国内的开源平台码云上也创建了一个代码仓库，两个仓库会保持同步更新，Github 和码云的地址分别为：

- [newbee-mall-api in GitHub](https://github.com/newbee-ltd/newbee-mall-api)

- [newbee-mall-api in Gitee](https://gitee.com/newbee-ltd/newbee-mall-api)

可以直接点击链接到对应的仓库中查看源码及相关文件。

### 命令行下载

本地安装了 Git 环境的话，可以直接在命令行中使用 git clone 命令把仓库中的文件全部下载到本地，以 newbee-mall-api 项目为例，执行的命令如下。

通过 GitHub 下载：

```shell
git clone https://github.com/newbee-ltd/newbee-mall-api.git
```

通过 Gitee 下载：

```shell
git clone https://gitee.com/newbee-ltd/newbee-mall-api.git
```

打开 cmd 命令行，之后切换到对应的目录，比如你想要下载到 D 盘的 java-dev 目录，那就先执行 cd 切换到该目录下，执行执行 clone 命令，过程如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dbc56f3c1bf4aeb91f131eec3d2658d~tplv-k3u1fbpfcp-zoom-1.image)

之后就可以等待文件下载，全部下载完成后就能够在 java-dev 目录下看到咱们的项目源码了，如果使用 GitHub 的链接下载较慢的话，可以通过国内的码云链接执行 git clone 操作。

### 直接下载

除了通过命令行下载之外，我们也可以选择更直接的方式，GitHub 和码云这两个开源平台也都提供了对应的下载功能，我们可以在仓库中直接点击对应的下载按钮来下载源码。

在 GitHub 网站上直接下载代码，过程如下：

![image-20210310175736773](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d973c62149046fea3e0e75eb51b6937~tplv-k3u1fbpfcp-zoom-1.image)

在代码仓库页面上有一个绿色的 "Clone or download" 按钮，点击该按钮，之后再点击 "Download Zip" 按钮就可以下载代码的压缩包文件，下载完成后解压就能够导入到 IDEA 或者 Eclipse 编辑其中进行开发或者修改。

在码云网站上直接下载代码，过程如下：

![image-20210310174626452](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93755729d1fa49fca35ba8086d506ee8~tplv-k3u1fbpfcp-zoom-1.image)

在代码仓库页面上有一个 "克隆/下载" 按钮，点击该按钮之后再点击 "下载Zip" ，码云这里多了一步验证操作，输入正确的验证码就可以下载代码的压缩包文件，下载完成后解压就能够导入到 IDEA 或者 Eclipse 编辑器中进行开发或者修改。

## 目录结构讲解

下载代码并解压之后，我们就可以在编辑器中打开项目了， 后端 API 项目是一个标准的 Maven 项目。

主体目录结构如下：

```dictionary
newbee-mall-api
    ├── src/main/java
         └── ltd.newbee.mall
         		├── common // 存放相关的常量配置及枚举类
         		├── config // 存放 web 配置类
         		├── api // 存放控制类，包括所有的 API 处理类
         		      	├── admin // 后台管理系统端 API
         						└── mall // 商城端 API
         		├── dao // 存放数据层接口
         		├── entity // 存放实体类
         		├── service // 存放业务层方法
         		├── util // 存放工具类
         		└── NewBeeMallAPIApplication // Spring Boot 项目主类
    ├── src/main/resources
         ├── mapper // 存放 MyBatis 的通用 Mapper文件
         ├── application.properties // 项目配置文件
         ├── newbee_mall_v2_schema.sql // 项目所需的 SQL 文件 
         └── upload.zip // 商品图片
    └── pom.xml // Maven 配置文件
```

前后端分离开发模式中，后端开发者主要就是提供前端页面所需的接口，该项目提供了 Vue3 企业级实战项目所需要的全部接口，接口文档的生成是使用 Swagger，启动后大家也会看到所有的接口类。

除了 Spring Boot 项目的基础目录外，我还在 resources 目录中上传了 newbee_mall_v2_schema.sql 文件和 upload.zip 文件，这是项目启动时所需的两个文件，newbee_mall_v2_schema.sql 是 Vue3 企业级项目的 SQL 文件，包含了项目所需的所有表结构和初始化数据，upload.zip 文件则是商品图片文件，我在商品表中存储了数百条记录，主要是为了大家可以更好的学习和体验，这些数据的图片文件就是 upload.zip 这个压缩包，如果没有这个压缩包，你在启动项目后看到所有页面的商品图片都是 404，这并不是一个很好的学习体验，这两个文件的作用即是如此，后面我会继续介绍它们的使用和配置。

## 启动项目

这一个小节我们来讲一下 API 项目的启动以及启动前的准备工作。

### 导入数据库

打开 MySQL 管理软件，之后新建一个数据库，命名为 newbee_mall_db_v2，当然，也可以是其它名称，这里**可以自行定义数据库名称**。数据库创建完成后就可以将 newbee_mall_v2_schema.sql 文件导入到该数据库中，导入成功后可以看到数据库如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b69f6f1cf03d4e0d9eeb4e953e800cb2~tplv-k3u1fbpfcp-zoom-1.image)

### 修改数据库连接配置

导入成功后，我们进行第二步操作，打开 application.properties 配置文件，修改数据库连接的相关信息，默认的数据库配置如下：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/newbee_mall_db_v2?useUnicode=true&serverTimezone=Asia/Shanghai&characterEncoding=utf8&autoReconnect=true&useSSL=false&allowMultiQueries=true
spring.datasource.username=root
spring.datasource.password=123456
```

需要修改的主要是：

- 数据库地址和数据库名称 localhost:3306/newbee_mall_db_v2
- 数据库登录账户名称 root
- 账户密码 123456

你需要根据你自己的数据库地址和账号信息进行修改，数据库名称默认为 newbee_mall_db_v2，如果你更改了名称你也需要将数据库连接中的数据库名称修改掉。application.properties 配置文件的其他配置项可以不进行修改，只有数据库连接的这三个配置项需要根据各人的配置不同而进行修改。

### 静态资源目录设置

完成前面两个步骤其实就可以启动项目了，但是在启动项目之后，可能会出现图片无法显示的问题，这里就需要进行静态资源目录设置了，tb_newbee_mall_goods_info 是商品表，该表在前一步初始化时已经新增了数百条商品记录，这些记录中都有商品主图的列并且有值，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8f712a1ef9f4bb7b4bfde07f724350d~tplv-k3u1fbpfcp-zoom-1.image)

所有的商品图片我也都上传了，就是 upload.zip 压缩包，解压后就能够看到这数百张商品图片文件，为了商品图片能够正确的显示，我们还需要进行两步操作，**首先是解压 upload.zip 压缩包并将这些文件放到一个文件夹中**，比如 D 盘下的 upload 文件夹下，或者 E 盘下的 mall/images 文件夹中，或者其他的文件夹中，根据个人习惯来放置这些图片文件即可。之后我们进行第二步操作，配置静态资源目录，这个配置项是在 ltd.newbee.mall.common 包的 Constants 类中，变量名称为 **FILE_UPLOAD_DIC**，代码如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ae2966746504364b4a5381f68f4be3a~tplv-k3u1fbpfcp-zoom-1.image)

默认的配置为 ```"D:\\upload\\"```，即 D 盘下的 upload 文件夹下，如果你将图片文件放到了 E 盘下的 mall/images 文件夹，则将该变量的值修改为 ```"E:\\mall\\images\\"```，如果是其它文件夹也是对应的修改该变量值。

**一定要注意，路径最后有一个斜杠，已经有不少同学因为没注意最后的斜杠导致无法访问图片。**

> 以上都是 Windows 系统下的写法，如果是 Linux 系统则写法为 "/opt/newbee/upload/"，将 FILE_UPLOAD_DIC 变量的值修改为放置图片文件的目录路径即可。

### 启动并查看接口文档

在上面几个步骤做完之后我们就可以启动这个 API 项目了，过程如下：

![run](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df40abd5348b40a79bf007292c6fd56d~tplv-k3u1fbpfcp-zoom-1.image)

点击启动按钮，之后等待项目启动即可，文中的演示图我选择的是通过 IDEA 工具栏方式启动 Spring Boot 项目，你也可以通过其它方式来启动，这个知识点在《项目搭建及启动》章节已经讲解过。通过控制台可以看到项目在 4.6 秒钟就成功启动，监听的端口为 28019，<span style="color:red;">这个端口号可以通过修改 application.properties 中的 server.port 配置项来修改</span>。

之后我们在浏览器中输入 http://localhost:28019/swagger-ui.html 就能够看到蜂商城的接口文档啦，恭喜你，启动成功！

如果使用的Swagger版本是3.0.0，接口文档地址有所改变，如下所示：

http://localhost:28019/swagger-ui/index.html

这一点需要注意。

关于 Swagger 的相关知识点，可以在《Spring Boot 实践之整合 Swagger 生成接口文档》中学习。

![mall-api](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d36af1b2fff040ec87acd9e4332564eb~tplv-k3u1fbpfcp-zoom-1.image)

> 如果你修改了启动端口号，访问地址也需要对应的修改。

## 注意事项及总结

这篇文章的结尾我们来讲一下项目的注意事项，这些问题是我经常会被同学们问到的，这里做一个整理和总结。

### 项目地址

商城 API 系统的访问地址如下，由于是提供接口供前端联调，所以这里我们只需要访问接口文档地址即可：

- **BASE_URL** + /swagger-ui.html

> 其中 BASE_URL 为主机名+端口号

### 账号及密码

账号和密码也是经常会被问到的，项目启动成功了，但是由于权限的问题无法完整的体验商城的所有功能，这就需要几个测试账号来解决啦。该项目也初始化了几条用户记录和管理员记录，数据分别存储在 tb_newbee_mall_admin_user 表中，你也可以自行添加和修改这些记录。

**后台管理系统管理员的测试账号及密码**

- 账号：admin 密码：123456
- 账号：newbee-admin1 密码：123456
- 账号：newbee-admin2 密码：123456

> 表中的密码字段，存储的都是密码经过 MD5 加密后的字符串，如果你想要直接通过数据库来修改密码的话可以将密码进行 MD5 转换，之后将加密后的字符串放到数据表的密码这一列中。
