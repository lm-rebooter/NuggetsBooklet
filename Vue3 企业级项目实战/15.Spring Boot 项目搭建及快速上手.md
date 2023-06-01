在介绍完基础环境搭建之后，本章节将讲解如何使用 IDEA 进行 Spring Boot 项目的创建和开发，和读者朋友们一起编写本书中的第一个 Spring Boot 项目，希望大家能够尽快上手和体验 Spring Boot 项目开发。

## Spring Boot 项目创建

```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1EwHHHv_6ld9Qif7nD8vbpQ 
提取码: ji6q
```

现在就来给大家演示，如何创建一个 Spring Boot 项目。

#### 认识 Spring Initializr

Spring 官方提供了 Spring Initializr 来进行 Spring Boot 项目的初始化，这是一个在线生成 Spring Boot 基础项目的工具，可以将其理解为 Spring Boot 项目的“初始化向导”，帮助开发者快速创建一个 Spring Boot 项目。

下面将讲解如何使用 Spring Initializr 来快速的初始化一个 Spring Boot 骨架工程。

首先，访问 Spring 官方提供的 Spring Initializr 网站，打开浏览器中并输入 Spring Initializr 的网站地址：

```bash
https://start.spring.io
```

页面效果如下：

![image-20201230103952476](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bc2498ca4d644af9a687d5a17402130~tplv-k3u1fbpfcp-zoom-1.image)

通过上图可以看到 Spring Initializr 页面中展示的内容，如果想初始化一个 Spring Boot 项目需要提前进行简单的配置，对页面中的配置项进行勾选和输入即可，默认情况下相关配置项已经有缺省值，可以根据实际情况进行简单的修改。

#### Spring Boot 项目初始化配置

需要配置的参数释义如下：

- Project：表示将要初始化的 Spring Boot 项目类型，可以选择 Maven 构建或者 Gradle 构建，本项目将选择常用的 Maven 方式。
- Language：表示编程语言的选择，支持  Java 、Kotlin 和 Groovy。
- Spring Boot：表示将要初始化的 Spring Boot 项目所使用的 Spring Boot 版本，由于更新迭代较快，Spring Initializr 页面中会展示最新的几个 Spring Boot 版本号，之前的版本号虽然不会在这里展示，但是依然可以正常使用。
- Project Metada：表示项目的基础设置，包括项目包名的设置、打包方式、JDK 版本选择等等。
  - Group：即 GroupID，表示项目组织的标识符，实际对应 Java 的包结构，是 main 目录里 Java 的目录结构。
  - Artifact：即 ArtifactId，表示项目的标识符，实际对应项目的名称，也就是项目根目录的名称。
  - Description：表示项目描述信息。
  - Package name：表示项目包名。
  - Packaging：表示项目的打包方式，有两种选择：Jar 和 War，在 Spring Boot 项目初始化时，如果选用的方式不同，那么导入的打包插件也有区别。
  - Java：表示 JDK 版本的选择，有 15、11 和 8 三个版本供开发者选择。
- Dependencies：表示将要初始化的 Spring Boot 项目所需的依赖和 starter，如果不选择的话默认生成的项目中仅有核心模块 spring-boot-starter 和测试模块 spring-boot-starter-test。在这个配置项中可以设置项目中所需的 starter，比如 Web 开发所需的依赖，数据库开发所需的依赖等等。

#### 使用 Spring Initializr 初始化一个 Spring Boot 项目

Spring Initializr 页面中的配置项需要开发者逐一进行设置，过程非常简单，根据项目情况依次填写即可。

本次演示中，开发语言选择 Java，Project 项目类型选项中勾选 Maven Project，因为本地安装的项目管理工具是 Maven。Spring Boot 版本选择为 2.3.7，当然也可以选择其他稳定版本，根据实际开发的情况去选择即可，即使这里已经选择一个版本号，在初始化成功后也能够在项目中的 pom.xml 文件或者 build.gradle 文件中修改 Spring Boot 版本号。

项目基础信息中，Group 输入框中填写“ltd.newbee.mall”，Artifact 输入框中填写“newbee-mall”，Name 输入框中填写“newbee-mall”，Description 输入框中填写“NEWBEE商城”，Package name 输入框中填写“ltd.newbee.mall”，Packaging 打包方式选择 Jar，JDK 版本选择 8。

由于即将开发的是一个 Web 项目，因此需要添加 web-starter 依赖，点击 Dependencies 右侧的“ADD DEPENDENCIES”按钮，在弹出的弹框中输入关键字“web”并选择“Spring Web：Build web, including RESTful, applications using Spring MVC. Uses Apache Tomcat as the default embedded container.”选项。

![image-20201230104215631](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07bfb20635944e20ad70aa06408fbdcf~tplv-k3u1fbpfcp-zoom-1.image)

很明显，该项目中将会采用 Spring MVC 开发框架并且使用了 Tomcat 作为默认的嵌入式容器。

最终，初始化 Spring Boot 项目的选项配置完成，如下图所示：

![image-20201230104240154](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7956a4bcdd3b4134a5c3b206ccda2e77~tplv-k3u1fbpfcp-zoom-1.image)

点击页面底部的“Generate”按钮，即可获取到一个 Spring Boot 基础项目的代码压缩包，使用 Spring Initializr 方式创建一个 Spring Boot 项目的过程讲解完成。

#### 其它方式创建 Spring Boot 项目

除了使用官方推荐的 Spring Initializr 方式创建 Spring Boot 项目，开发者们也可以选择其它方式创建 Spring Boot 项目。

##### IDEA 编辑器初始化 Spring Boot 项目

IDEA 编辑器中内置了初始化 Spring Boot 项目的插件，可以直接新建一个 Spring Boot 项目，创建过程如下图所示：

![image-20201230111323318](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a12d4e45ead24bbea63e0082ec2b5d20~tplv-k3u1fbpfcp-zoom-1.image)

需要注意的是，这种方式仅在商业版本的 IDEA 编辑器中支持，IDEA 编辑器社区版本在默认情况下，不支持直接生成 Spring Boot 项目。

##### Maven 命令行创建 Spring Boot 项目

除了以上两种方式之外，可以使用 Maven 命令也可以创建一个新的项目，操作方式如下。

打开命令行工具并将目录切换到对应的文件夹中，之后运行以下命令：

`mvn archetype:generate -DinteractiveMode=false -DgroupId=ltd.newbee.mall -DartifactId=newbee-mall -Dversion=0.0.1-SNAPSHOT`

在构建成功后可以生成一个 Maven 骨架项目，但是由于生成的项目仅仅是骨架项目，因此 pom.xml 文件中需要自己添加依赖，主方法启动类也需要自行添加，没有以上两种方式方便快捷，因此不是特别推荐。

当然，如果计算机中已经存在 Spring Boot 项目则直接打开即可，点击“Open”按钮跳出文件选择框，点击选择想要导入的项目目录直接打开，导入成功就可以进行 Spring Boot 项目开发。

## Spring Boot 项目目录结构介绍

使用 IDEA 编辑器打开项目之后，即可看到 Spring Boot 项目的目录结构。

![dictionary](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dde46bcc333b4d31bd7df8115113d5c7~tplv-k3u1fbpfcp-zoom-1.image)

如上图所示，Spring Boot 的目录结构主要由以下部分组成：

```properties
newbee-mall
    ├── src/main/java
    ├── src/main/resources
    ├── src/test/java
		└── pom.xml
```

1. src/main/java 表示 Java 程序开发目录，开发者们在该目录下进行业务代码的开发。这个目录对于 Java Web 开发者们来说应该比较熟悉，唯一的不同点是 Spring Boot 项目中会多一个主程序类。

2. src/main/resources 表示配置文件目录，主要用于存放静态文件、模板文件和配置文件。与普通的 Spring 项目相比有些区别，如上图所示，该目录下有 static 和 templates 两个目录，是 Spring Boot 项目默认的静态资源文件目录和模板文件目录，在 Spring Boot 项目中是没有 webapp 目录的，默认是使用 static 和 templates 两个文件夹。
   - static 目录用于存放静态资源文件，如 JavaScript 文件、图片、CSS 文件。
   - templates 目录用于存放模板文件，如 Thymeleaf 模板文件或者 FreeMarker 文件。
3. src/test/java 表示测试类文件夹，与普通的 Spring 项目差别不大。

4. pom.xml 用于配置项目依赖。

以上即为 Spring Boot 项目的目录结构，与普通的 Spring 项目存在一些差异，不过在平常开发过程中这个差异的影响并不大，说到差别较大的地方应该是部署和启动方式的差异，接下来将详细介绍  Spring Boot 项目的启动方式。

## 启动 Spring Boot 项目

#### 在 IDEA 编辑器中启动 Spring Boot 项目

由于 IDEA 编辑器对于 Spring Boot 项目的支持非常友好，在项目导入成功后会被自动识别为 Spring Boot 项目，可以很快的进行启动操作。

在 IDEA 编辑器中，有以下三种方式可以启动 Spring Boot 项目：

- 主类上的启动按钮：点开程序启动类，比如本次演示的 NewBeeMallApplication.java，在 IDEA 代码编辑区域中可以看到左侧有两个绿色的启动按钮，点击任意一个按钮即可启动 Spring Boot 项目。

- 右键运行 Spring Boot 的主程序类：同普通 Java 类的启动方式类似，在左侧 Project 侧边栏或者类文件编辑器中，执行右键点击操作，可以看到启动 main() 方法的按钮，如下图所示，点击“ Run 'NewbeeMallApplication.main()' ”即可启动 Spring Boot 项目。

![image-20201230142739075](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/162cfef634294200af61cb73c6bd8d7d~tplv-k3u1fbpfcp-zoom-1.image)

- 工具栏中的 Run / Debug 按钮：点击工具栏中的 Run / Debug 按钮也可以启动 Spring Boot 项目，如下图所示。

![idea-run](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f13075032a444eea1b345b55646241d~tplv-k3u1fbpfcp-zoom-1.image)

Spring Boot 项目启动时与普通的 Java Web 项目相比更加便捷，启动项目减少了几个中间步骤，不用去配置 Servlet 容器，也不用打包并且发布到 Servlet 容器再去启动，而是直接运行主方法即可启动项目，开发调试都十分方便且节省开发时间。

#### Maven插件启动

项目初始化时，配置项中选择的项目类型为 Maven Project，pom.xml 文件中会默认引入 spring-boot-maven-plugin 插件依赖，因此可以直接使用 Maven 命令来启动 Spring Boot 项目，插件配置如下：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

> 如果 pom.xml 文件中没有该 Maven 插件配置，是无法通过这种方式启动Spring Boot 项目的，这一点需要注意。

Maven插件启动 Spring Boot 项目的步骤如下：

首先点击下方工具栏中的 Terminal 打开命令行窗口，之后在命令行中输入命令 `mvn spring-boot:run`并执行该命令，即可启动 Spring Boot 项目，效果与之前介绍的启动方式一样。

![image-20201230143603197](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecfec837158a4a8c98ad9cad02edecb6~tplv-k3u1fbpfcp-zoom-1.image)

#### java -jar 命令启动

项目初始化时，配置项中选择的打包方式为 Jar ，项目开发完成进行打包后的结果是一个 Jar 包文件，通过 Java 命令行运行 Jar 包的命令为 `java -jar xxx.jar` ，因此可以使用这种方式启动 Spring Boot 项目，步骤如下：

- 首先，点击下方工具栏中的 Terminal 打开命令行窗口

- 之后使用 Maven 命令将项目打包，执行命令为:`mvn clean package -Dmaven.test.skip=true`，等待打包结果即可

- 打包成功后进入 target 目录，切换目录的命令为 `cd target`

- 最后是启动已经生成的 Jar 包文件，执行命令为`java -jar newbee-mall-0.0.1-SNAPSHOT.jar`

整个步骤的操作过程如下图所示：

![image-20201230144501331](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/740657eecfcb4eec839c6093e191047d~tplv-k3u1fbpfcp-zoom-1.image)

读者朋友们可以按照以上步骤练习几次。

> 需要注意的是，每次在项目启动之前，如果使用了其他方式启动了工程，需要将其关掉，否则会因为端口占用，导致启动报错而无法正常启动 Spring Boot 项目。

#### Spring Boot 项目启动日志

无论使用以上哪种方式，Spring Boot 项目启动时都会在控制台上打出启动日志，如果一切正常则很快就能够启动成功，启动日志如下所示：

```bash
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v2.3.7.RELEASE)

2021-03-13 14:50:10.137  INFO 21651 --- [           main] ltd.newbee.mall.NewbeeMallApplication    : Starting NewbeeMallApplication with PID 21651
2021-03-13 14:50:10.143  INFO 21651 --- [           main] ltd.newbee.mall.NewbeeMallApplication    : No active profile set, falling back to default profiles: default
2021-03-13 14:50:12.492  INFO 21651 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2021-03-13 14:50:12.517  INFO 21651 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2021-03-13 14:50:12.518  INFO 21651 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.41]
2021-03-13 14:50:12.702  INFO 21651 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2021-03-13 14:50:12.702  INFO 21651 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 2405 ms
2021-03-13 14:50:13.105  INFO 21651 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Initializing ExecutorService 'applicationTaskExecutor'
2021-03-13 14:50:13.695  INFO 21651 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2021-03-13 14:50:13.725  INFO 21651 --- [           main] ltd.newbee.mall.NewbeeMallApplication    : Started NewbeeMallApplication in 3.634 seconds (JVM running for 6.557)
```

日志最开始为 Spring Boot 的启动 Banner 和 Spring Boot 的版本号，中间部分为 Tomcat 启动信息及 ServletWebServerApplicationContext 加载完成信息，最末尾则是 Tomcat 的启动端口和项目启动时间，通过以上日志信息，可以看出 Spring Boot 启动成功共花费 3.634 秒，Tomcat 服务器监听的端口号为 8080。

## 开发第一个Spring Boot 项目

项目成功启动后，打开浏览器访问 8080 端口，看到的页面却是一个 Whitelabel Error Page 页面，如下图所示：

![image-20210113150227072](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afb08f99b93b47f6a24f5b4ba8f5d3ac~tplv-k3u1fbpfcp-zoom-1.image)

这个页面是 Spring Boot 项目的默认错误页面，由页面内容可以看出此次访问的报错为 404 错误，访问其他地址也都会是这个页面，此时的 Web 服务中并没有任何可访问的资源，因为生成 Spring Boot 项目之后，并没有在项目中增加任何一行代码，没有接口，也没有页面。

此时，需要自行实现一个 Controller 来看一下 Spring Boot 如何处理 Web 请求，接下来使用 Spring Boot 实现一个简单的接口，步骤如下：

1. 在根目录ltd.newbee.mall 单击鼠标右键，在弹出的菜单栏中选择“New → Package”，之后新建名称为 controller 的 Java 包：

![WX20210113-151438@2x](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cde1325941ec48d9b69ab64beff704a5~tplv-k3u1fbpfcp-zoom-1.image)

2. 在 ltd.newbee.mall.controller 单击鼠标右键，在弹出的菜单栏中选择“New → Java Class”，之后新建名称为 HelloController 的 Java 类，此时的目录结构如下图所示：

![image-20210113151911617](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/226d19021dd149fb94b2c4cfa66a08e3~tplv-k3u1fbpfcp-zoom-1.image)

3. 在 HelloController 类中输入如下代码：

```java
package ltd.newbee.mall.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HelloController {

    @GetMapping("/hello")
    @ResponseBody
    public String hello() {
        return "hello,spring boot!";
    }
}
```

以上这段 Controller 代码实现，读者们应该很熟悉，写法与 Spring 项目开发时是相同的，代码的含义是处理请求路径为 /hello 的 GET 请求并返回一个字符串。

编码完成后，重新启动项目，启动成功后在浏览器中输入以下请求地址：

`http://localhost:8080/hello`

这时页面上展示的内容已经不是错误信息，而是 HelloController 中的正确返回信息，如下图所示，咱们的第一个 Spring Boot 项目实例就完成了！

![image-20210113160717677](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80c634b742ad4aa786fb48ba59daee21~tplv-k3u1fbpfcp-zoom-1.image)

## 总结

本篇文章主要介绍了如何创建一个 Spring Boot 项目，并使用 IDEA 编辑器开发 Spring Boot 项目。

首先是 Spring Boot 项目的创建，根据个人开发经验，在新建 Spring Boot 项目时，笔者建议开发者们使用 Spring Initializr 向导构建的方式，因为向导构建的方式生成的代码比较齐全，可以直接使用。采用 Maven 构建的方式则需要进行 pom.xml 文件配置和主程序类的编写，采用向导构建方式可以尽可能的避免人为错误的出现，也更加节省时间。

 Spring Boot 项目的启动方式也列举了三种：

- IDEA 直接启动
- Maven 插件启动
- 命令行启动

以上三种方式都很简单，在练习时读者朋友们可以自行选择适合自己的启动方式。

日常开发中通常是使用 IDEA 上的按钮或者快捷键直接启动项目，这也比较符合开发者们的开发习惯，Maven 插件启动也是一种 Spring Boot 项目的启动方式，直接运行 Maven 命令即可启动项目。最后是命令行启动项目的方式，这个方式一般是在服务器上部署项目时使用，因为项目上线时通常是在生产环境的服务器上，上线时直接将 Jar 包文件传上去，之后再运行 ` java -jar xxx.jar ` 即可启动 Spring Boot 项目。