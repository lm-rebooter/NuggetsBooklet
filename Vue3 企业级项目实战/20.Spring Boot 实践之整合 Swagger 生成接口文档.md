Swagger 是一款 RESTful 接口的文档在线自动生成+功能测试功能软件，本文将会介绍这款工具并在 Spring Boot 项目中集成 Swagger。

我们的新蜂商城 Vue 版本开发过程就一直在用 Swagger 这个工具，主要用来 生成接口文档以及进行接口测试工作，大家在运行源码后也可以通过 swagger-ui 页面看到新蜂商城的所有 API 文档，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e83294db61034294a77f11c5bebdb1dd~tplv-k3u1fbpfcp-zoom-1.image)

本文主要知识点如下：

- 认识 Swagger
- Spring Boot 集成 Swagger
- Swagger 接口测试

```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1xZHvXMxvfdGNTYigu_mSYQ 
提取码: vcb9
```

## 什么是 Swagger

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/740210cbe25f48d2a702559af67cce82~tplv-k3u1fbpfcp-zoom-1.image)

Swagger 为开发者提供了一套规范去定义接口和接口相关的信息，通过 springfox-swagger 依赖 jar 包可以将基于 Spring MVC 和 Spring Boot 项目的项目代码，自动生成 JSON 格式的描述文件，我们可以通过这套接口描述数据生成各种接口文档。

目前有很大一部分 Spring Boot 的开发者会将其用来构建 RESTful API，而我们构建RESTful API的目的通常都是由于多终端的原因，这些终端会共用很多底层业务逻辑，因此我们会抽象出这样一层来同时服务于多个移动端或者Web前端。这样一来，我们的RESTful API就有可能要面对多个开发人员或多个开发团队：iOS 开发、Android 开发或是Web开发等。为了减少与其他团队平时开发期间的频繁沟通成本，传统做法我们会创建一份 API 文档来记录所有接口细节，然而这样的做法有以下几个问题：

- 由于接口众多，并且细节复杂（需要考虑不同的HTTP请求类型、HTTP头部信息、HTTP请求内容等），编写一份完整的 API 文档非常吃力。
- 随着时间推移，不断修改接口实现的时候都必须同步修改接口文档，维护起来十分麻烦。

为了解决上面这样的问题，主要是简化开发人员的开发成本以及减少前后端开发人员之间的交流成本，就不得不提一下当前最流行的 API 管理工具 Swagger，你可以叫它“丝袜哥”。

Swagger 的目标是为 RESTful  API 定义一个标准的，与语言无关的接口，使人和计算机在看不到源码或者看不到文档或者不能通过网络流量检测的情况下能发现和理解各种服务的功能，在 Spring Boot 项目中集成 Swagger 可以使用注解来标记出需要在 API 文档中展示的信息，Swagger 会根据项目中标记的注解来生成对应的 API 文档。当然，不仅仅是 Spring Boot 项目，在其他技术栈的项目中也可以通过对应的整合方式去使用 Swagger。

## Swagger 可以做什么

有人熟悉 Swagger 这个工具，也有很多人并不熟悉这个工具，但是大部分人通常都把它当做一个接口文档的生成和展示工具，但是它能够做的事情并不止于此，在 Swagger 的官网里就列举出了它能做的事情，见下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3960483f38ff48cf8cd9b5cea28602b0~tplv-k3u1fbpfcp-zoom-1.image)

总结如下：

- 辅助接口设计
- 辅助接口开发
- 生成接口文档
- 进行接口测试
- Mock 接口
- 接口管理
- 接口检测

Swagger 的功能确实非常强大，它可以轻松的整合到 Spring Boot 中并生成 RESTful API文档，既可以减少我们创建文档的工作量，同时说明内容又整合入实现代码中，让维护文档和修改代码整合为一体，可以让我们在修改代码逻辑的同时方便的修改文档说明，另外 Swagger 也提供了强大的页面测试功能来调试每个 API 接口。

总结下来就是非常方便，能够给开发人员带来极大的便利，因此我也非常推荐大家在项目中使用 Swagger 来维护接口文档。

## Spring Boot 整合 Swagger

介绍完 Swagger，接下来我会进行实际的编码，通过一个 Demo 让大家快速的体验到 Swagger 在项目中的使用。

### 依赖文件

首先，在 pom.xml 中加入 Swagger 的依赖信息，pom.xml 文件更新如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.3.7.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>ltd.newbee.mall</groupId>
	<artifactId>swagger-demo</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>swagger-demo</name>
	<description>Demo project for Spring Boot</description>

	<properties>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<!-- swagger2 -->
		<dependency>
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger2</artifactId>
			<version>2.8.0</version>
		</dependency>
		<dependency>
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger-ui</artifactId>
			<version>2.8.0</version>
		</dependency>
		<!-- swagger2 -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

    <repositories>
        <repository>
            <id>alimaven</id>
            <name>aliyun maven</name>
            <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>	

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>

```

### 创建 Swagger 配置类

新建 config 包，在 config 包中新增 Swagger2Config.java，代码如下：

```java
package ltd.newbee.mall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class Swagger2Config {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("ltd.newbee.mall.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("swagger-api文档")
                .description("swagger文档 by 13")
                .version("1.0")
                .build();
    }
}

```

如上代码所示，类上的两个注解含义为：

- @Configuration，启动时加载此类
- @EnableSwagger2，表示此项目启用 Swagger API 文档

api() 方法用于返回实例 Docket（Swagger API 摘要），也是在该方法中指定需要扫描的控制器包路径，只有此路径下的 Controller 类才会自动生成 Swagger API 文档。

apiInfo() 方法中主要是配置一些基础信息，包括配置页面展示的基本信息包括，标题、描述、版本、服务条款、联系方式等。

配置完成之后启动项目，在浏览器中输入网址 /swagger-ui.html，即可看到 Swagger 页面，效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e85a03f63a4744c4b947030f74a1154b~tplv-k3u1fbpfcp-zoom-1.image)

此时只有基础的配置信息，并没有文档信息，接下来我们需要在我们配置的 basePackage("ltd.newbee.mall.controller") 包中新建 Controller 类。

### 创建 Controller 类并新增接口信息

在 controller 包下新增 TestSwaggerController.java，代码如下：

```java
package ltd.newbee.mall.controller;

import ltd.newbee.mall.entity.User;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class TestSwaggerController {

    static Map<Integer, User> usersMap = Collections.synchronizedMap(new HashMap<Integer, User>());

    // 初始化 usersMap
    static {
        User user = new User();
        user.setId(1);
        user.setName("newbee1");
        user.setPassword("111111");
        User user2 = new User();
        user2.setId(2);
        user2.setName("newbee2");
        user2.setPassword("222222");
        usersMap.put(1, user);
        usersMap.put(2, user2);
    }

    @ApiOperation(value = "获取用户列表", notes = "")
    @GetMapping("/users")
    public List<User> getUserList() {
        List<User> users = new ArrayList<User>(usersMap.values());
        return users;
    }

    @ApiOperation(value = "新增用户", notes = "根据User对象新增用户")
    @ApiImplicitParam(name = "user", value = "用户实体", required = true, dataType = "User")
    @PostMapping("/users")
    public String postUser(@RequestBody User user) {
        usersMap.put(user.getId(), user);
        return "新增成功";
    }

    @ApiOperation(value = "获取用户详细信息", notes = "根据id来获取用户详细信息")
    @ApiImplicitParam(name = "id", value = "用户id", required = true, dataType = "int")
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Integer id) {
        return usersMap.get(id);
    }

    @ApiOperation(value = "更新用户详细信息", notes = "")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "用户id", required = true, dataType = "int"),
            @ApiImplicitParam(name = "user", value = "用户实体user", required = true, dataType = "User")
    })
    @PutMapping("/users/{id}")
    public String putUser(@PathVariable Integer id, @RequestBody User user) {
        User tempUser = usersMap.get(id);
        tempUser.setName(user.getName());
        tempUser.setPassword(user.getPassword());
        usersMap.put(id, tempUser);
        return "更新成功";
    }

    @ApiOperation(value = "删除用户", notes = "根据id删除对象")
    @ApiImplicitParam(name = "id", value = "用户id", required = true, dataType = "int")
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Integer id) {
        usersMap.remove(id);
        return "删除成功";
    }

}
```

我们新增了一个 controller 类并定义了 5 个接口，并且在每个接口上通过`@ApiOperation`注解来给API增加说明、通过`@ApiImplicitParams`、`@ApiImplicitParam`注解来给参数增加说明。

## 接口测试

在介绍 Swagger 的时候我们就说过，它不仅仅是一个接口文档工具，它也是一个接口测试工具，我们可以通过它向后端发送请求、传输参数并获取返回数据，通过这种方式我们也能够进行接口测试，接下来对这些接口进行实际的测试。

### 用户列表接口

首先我们点进列表接口，接口的右上方有 Try it out 按钮：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0a5ac43ea7d416f9f02c62aef70740c~tplv-k3u1fbpfcp-zoom-1.image)

点击它来准备发送用户列表接口请求，之后页面上会出现 Execute 按钮：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa49eb7f774e4226a8cd1f74d77350e8~tplv-k3u1fbpfcp-zoom-1.image)

点击它之后会实际的向后端发送用户列表请求，请求成功后可以在页面中看到请求信息，以及返回数据，在 Response body 信息框中我们可以看到两条用户数据，接口请求成功且数据如预期中的数据一致，证明这个接口是没有问题的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2af4036d8354d5bae2d830b579cf484~tplv-k3u1fbpfcp-zoom-1.image)

### 用户添加接口

首先我们点进新增接口，接口的右上方有 Try it out 按钮，点击它来尝试发送请求，由于这个接口需要传输用户数据，因此页面上会出现用户信息录入框，我们在这里依次填写需要添加的用户数据，之后页面上会出现 Execute 按钮，点击它之后会实际的向后端发送用户添加请求，请求成功后可以在页面中看到添加成功。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0c6040b6caf454cbb49d8df930e10aa~tplv-k3u1fbpfcp-zoom-1.image)

为了验证是否已经添加成功，我们再去请求依次用户列表请求，此时 Response body 信息框中我们可以看到 3 条用户数据，接口请求成功且数据如预期中的数据一致，证明用户添加这个接口也是没有问题的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0378637bbb384bf1b76850266da8dc96~tplv-k3u1fbpfcp-zoom-1.image)

### 用户详情接口

点进用户详情接口，接口的右上方有 Try it out 按钮，点击它来尝试发送请求，由于这个接口需要传输用户 id，因此页面上会出现 id 录入框，我们在这里想要查询 id 为 4 的用户数据就在信息录入框中输入 4，之后页面上会出现 Execute 按钮，点击它之后会实际的向后端发送用户详情信息请求，请求成功后可以在页面中看到 id 为 4 的用户数据：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e85a5ba52250439db1ea8d1713f3e350~tplv-k3u1fbpfcp-zoom-1.image)

接口请求成功且数据如预期中的数据一致，证明用户详情这个接口也是没有问题的。

### 用户更新接口

测试过程与用户添加接口类似，省略。

### 用户删除接口

测试过程与用户详情类似，删除成功后可以再次请求列表接口确认接口的实现逻辑是否正确。

## 总结

由于用户更新接口和用户删除接口的操作过程与前面的几个类似因此选择了省略，同学们可以自行测试。

同时，你也可以根据本文内容多写几个 Controller 类来熟悉一下 Swagger，多多练习才能进步。