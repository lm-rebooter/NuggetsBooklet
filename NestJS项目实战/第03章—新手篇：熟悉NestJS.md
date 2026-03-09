## 前言

经过了需求分析以及技术选型之后，我们正式步入了第三个环节：**脚手架搭建**。

**工欲善其事，必先利其器**，`NestJS` 为开发者提供了很多开箱即用的功能，我们可以根据团队的需求搭建一套适配所有业务开发的基础脚手架。因此，接下来的 2 章是基础篇的教学，我将带领大家逐步学习怎么搭建一套基础业务脚手架，便于后期快速开发业务。

>本章的内容比较基础，如果使用过 NestJs 的同学或者对 IoC 模式熟悉的同学可以快速略过。

## 控制反转 IoC

在之前的介绍中有提到，`NestJS` 作为开发体验上最接近于传统后端的开发框架，其中最大的相同点就是 **IoC**，也就是 `Java` 中经常提到的**控制反转**。

在接下去使用 `NestJS` 的开发过程中会大量接触到 **IoC** 模式，所以先对 **IoC** 做一个简单概念解析，了解一下什么是 **IoC**，以及为什么要使用 **IoC**。

> **控制反转**（Inversion of Control，缩写为 **IoC**）是[面向对象编程](https://baike.baidu.com/item/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%BC%96%E7%A8%8B/254878)中的一种设计原则，可以用来降低计算机[代码](https://baike.baidu.com/item/%E4%BB%A3%E7%A0%81/86048)之间的[耦合度](https://baike.baidu.com/item/%E8%80%A6%E5%90%88%E5%BA%A6/2603938)。其中最常见的方式叫做[依赖注入](https://baike.baidu.com/item/%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5/5177233)**（Dependency Injection，简称DI**），还有一种方式叫“依赖查找”（Dependency Lookup）。通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体将其所依赖的对象的引用传递给它。也可以说，依赖被注入到对象中。

如果学过 `Java` 的同学应该会比较熟悉，但如果是前端同学刚刚接触的话，可能会比较陌生，一时间难以上手。纯文字版本的解释难免晦涩，接下来我们用一个简单的小例子来解释 **IoC** 容器的使用：

```js
class A {
  constructor(params) {
    this.params = params
  }
}

class B extends A {
  constructor(params) {
    super(params)
  }
  run() {
    console.log(this.params);
  }
}

new B('hello').run();
```
我们可以看到，**B** 中代码的实现是需要依赖 **A** 的，**两者的代码耦合度非常高。在两者之间的业务逻辑复杂程度增加的情况下，维护成本与代码可读性都会随着增加，并且很难再多引入额外的模块进行功能拓展**。

为了解决这个情况，我们可以引入一个 **IoC** 容器：
```js
class A {
  constructor(params) {
    this.params = params
  }
}

class C {
  constructor(params) {
    this.params = params
  }
}

class Container {
  constructor() { this.modules = {} }

  provide(key, object) { this.modules[key] = object }

  get(key) { return this.modules[key] }
}

const mo = new Container();

mo.provide('a', new A('hello'))
mo.provide('c', new C('world'))

class B {
  constructor(container) {
    this.a = container.get('a');
    this.c = container.get('c');
  }
  run() {
    console.log(this.a.params + ' ' + this.c.params)
  }
}

new B(mo).run();
```
如上述代码所示，在引入 **IoC** 容器 `container` 之后，**B** 与 **A** 的代码逻辑已经解耦，可以单独拓展其他功能，也可以方便地加入其他模块 **C**。所以在面对复杂的后端业务逻辑中，引入 **IoC** 可以降低组件之间的耦合度，实现系统各层之间的解耦，减少维护与理解成本。

> 当然，上述的 **Demo** 只是一个非常简单的例子，实际开发过程中场景远比 **Demo** 更加复杂。

## Nest CLI

与所有的主流框架一样，`NestJs` 也有自己的 [Nest CLI](https://github.com/nestjs/nest-cli) 工具，除了提供创建基础模板的功能之外，额外提供了很多方便的功能。

与前端项目的开发模式不同，在后端业务开发中存在着大量可复用或者有规则的模块，善于使用 `CLI` 可以帮助我们节约大量的重复工作，现在我们来一起学一下 `CLI` 的运用。首先看下 `CLI` 提供了多少的功能：

```
$ nest --help
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/033026f8259846ee9f491e67fdecdbed~tplv-k3u1fbpfcp-watermark.image?)

如上图所示，运行完 `help` 命令之后，可以使用 `generate` 便捷地生成常用文件，例如**超频使用**的 `Controller` 以及 `Service` 的文件等。

#### 使用规则

除了 `nest --help` 查看全局命令之外，运行`nest <command> --help` 可以查看特定于命令的选项。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9409f599ecc40be8c8517f506a37297~tplv-k3u1fbpfcp-watermark.image?)


| 命令         | 别名  | 描述                                                              |
| ---------- | --- | --------------------------------------------------------------- |
| `new`      | `n` | 搭建一个新的标准模式应用程序，包含所有需要运行的样板文件。|
| `generate` | `g` | 根据原理图生成或修改文件。                             |

通用的命令选项

选项                                    | 描述                                           |
| ------------------------------------- | -------------------------------------------- |
| `--dry-run`                           | 报告将要进行的更改，但不更改文件系统，别名: -d。         |
| `--skip-git`                          | 跳过 `git` 存储库初始化，别名: -g。                   |
| `--skip-install`                      | 跳过软件包安装，别名：-s。                            |
| `--package-manager [package-manager]` | 指定包管理器，使用 `npm` 或 `yarn`，必须全局安装包管理器，别名: -p。   |
| `--language [language]`               | 指定编程语言(`TS` 或 `JS`)，别名: -l。                  |
| `--collection [collectionName]`       | 指定逻辑示意图集合，使用已安装的包含原理的 `npm` 软件包的软件包名称，别名：-c。|

> 在常规项目中，使用**创建模板和文件这两个命令**最多，所以小册只列举了这两个功能，如果你想了解更多的 `CLI` 功能可以直接查看[源文档](https://docs.nestjs.com/cli/overview)。

#### 配置规则

直接通过 `CLI` 创建的项目根路径下会自动生成一个 `nest-cli.json` 配置文件： 

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/141a0784f4754767ab7236d42f5cd7c6~tplv-k3u1fbpfcp-watermark.image?)

```
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "root": "src"
}
```

默认生成的配置文件有如上一些属性：

| 配置属性 | 属性描述 |
| --- | --- |
| collection          |  用于配置生成部件的 schematics 组合的点，一般无需修改 |
| sourceRoot          |  默认项目根目录 |
| --- | --- |
| compilerOptions     |  编译选项与设置 |
| generateOptions     |  全局生成的选项和选项的设置 |
| monorepo            |  启用 monorepo |
| project             |  monorepo 模式结构项目配置 |
| --- | --- |
| assets              |  额外文件类型资源处理，非 TS 与 JS 类型 |
| watchAssets         |  是否使用 watch 模式来监控指定资源文件 |

> `monorepo` 模式开发有它的优点，如果是个人维护或者是关联性比较高的项目可以尝试使用 `monorepo` 来开发项目，但是小册选择的网关项目拆出的三个模块虽然有一定的关系，但物料以及用户系统同时还会与 `DevOps` 等其他系统有关联，所以会使用 `multirepo` 维护三个不同的项目，以微服务的模式关联各个模块功能。

## 创建项目工程模板

在查看完 `Nest CLI` 的常用命令之后，可以使用以下命令快速创建一个简单的工程模板：

```
$ npm i -g @nestjs/cli
$ nest new gateway
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9be61963c4bf400b925f4445f9fb7f6b~tplv-k3u1fbpfcp-watermark.image?)

#### 项目文件介绍

除去配置常见的配置文件之外，在 `src` 目录下有一些 `NestJS` 标准的文件规范：

```
src
 ├── app.controller.spec.ts
 ├── app.controller.ts
 ├── app.module.ts
 ├── app.service.ts
 └── main.ts
```

| 文件名 | 文件描述 |
| --- | --- |
| app.controller.ts      |  常见功能是用来处理 http 请求以及调用 service 层的处理方法 |
| app.module.ts          |  根模块用于处理其他类的引用与共享。                 |
| app.service.ts         |  封装通用的业务逻辑、与数据层的交互（例如数据库）、其他额外的一些三方请求 |
| main.ts                |  应用程序入口文件。它使用 `NestFactory` 用来创建 Nest 应用实例。 |

在后续开发项目的过程中，使用约定俗成的 `name.[type]` 规则来创建对应的类型文件，便于查找对应的模块。

#### 第一个 http 请求

依赖安装完毕之后，可以使用如下命令启动 `NestJS` 应用，然后浏览器即可访问 [http://localhost:3000/](http://localhost:3000/) ：出现如下界面即代表项目已经正常启动了。

```
$ npm run start
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd6ca06553cc45f18162ce05b100cef3~tplv-k3u1fbpfcp-watermark.image?)

服务正常启动之后，接下来我们要开始写下第一个功能【用户模块】。

首先运行如下命令，`CLI` 会快速帮助我们自动生成一个用户的 `UserController`

```
$ nest g co user
```

不过此命令同时也会生成后缀为 `spec` 的测试文件，虽然有测试功能非常好，但在快速开发过程中，并非每一个功能都需要自动化测试覆盖，只要保证主要的功能有用例覆盖即可。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/695e104a35584d0983d4705b3cdfdff4~tplv-k3u1fbpfcp-watermark.image?)

如果不需要每一次生成 `spec` 文件，可以在根目录下的 `nest-cli.json` 添加如下配置，禁用测试用例生成，后续再使用 `CLI` 创建 `Controller` 或者 `Service` 类型文件的时候，将不会继续生成：

```
  "generateOptions": {
    "spec": false
  }
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e4056a6db47430ba49fa4f537e1a442~tplv-k3u1fbpfcp-watermark.image?)

回归正题，在创建 `UserController` 的同时 `CLI` 也会自动在 `app.module.ts` 里面帮我们注册好 `Controller`。整个过程非常简便，只要在 `UserController` 写下第一个 `http` 请求即可。

```
import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  getHello(): string {
    return 'hello, world!';
  }
}
```

等待程序重新编译运行完毕之后，在浏览器输入 http://localhost:3000/user 访问即可看到：【**你好，世界！**】

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/309b5021d7514ac1ac16ee667c97485c~tplv-k3u1fbpfcp-watermark.image?)

#### 第一个 CURD

在小试牛刀之后，下面我们要开始借助 `CLI` 的能力快速生成 `CURD` 模块：
-   生成一个模块 (nest g mo) 来组织代码，使其保持清晰的界限（Module）。
-   生成一个控制器 (nest g co) 来定义 CRUD 路径（Controller）。
-   生成一个服务 (nest g s) 来表示/隔离业务逻辑（Service）。
-   生成一个实体类/接口来代表资源数据类型（Entity）。

可以看出一个最简单的 `CURD` 涉及的模块也会非常多（至少需要以上四个模块才能完成一个基础的 `CURD` 功能），并且要运行多个命令才能得到想要的结果，所幸 `Nest CLI` 已经集成了这样的功能来帮助我们减少重复的工作量：

```
$ nest g resource user 
```

> 之前我们已经生成 `user` 的 `controller` 文件，所以在使用此条命令之前需要将之前生成的 `user` 目录全部删除，同时删除 `app.module.ts` 中的 `UserController` 引入。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83e636a4559c47feb3f7f297fdb81c5f~tplv-k3u1fbpfcp-watermark.image?)


> 第一次使用这个命令的时候，除了生成文件之外还会自动使用 `npm` 帮我们更新资源，安装一些额外的插件，后续再次使用就不会更新了。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ada9368017b496d956fecdf78b4d8f7~tplv-k3u1fbpfcp-watermark.image?)

安装依赖之后可以看到，我们借助 `Nest CLI` 快速生成了一套标准的 `CURD` 模块甚至 `dto` 文件也一并生成了，后续只需要更新用户模块的业务逻辑即可。

## 写在最后

本章主要是介绍了 **IoC** 设计模式以及如何借助 `CLI` 创建了简单的工程模板与 `CURD` 模块。可以看到， `Nest CLI` 对比其他一些 `CLI` 工具在针对开发功能优化这块做得非常不错，特别是模块生成跟自动注册这块逻辑。不过，也是基于后端有一套规则可循这些功能才能实现，这也正是前后端项目不太一样的地方。 

虽然 `NestJs` 提供了一个简单的工程模板，但这个模板离实际可用的工程差距还有点大，接下来将与大家一起逐步添加对应的功能，使之达到一个符合实际项目开发要求的模板。

> 基础篇的内容大部分都是围绕着 `NestJS` 提供的功能模块开发，所以有一些细节的部分可以参考 `NestJS` 的英文文档一起阅读，小册中使用到的部分会尽可能讲解得详细一点。


本章的 **Demo** 地址放在 [demo/v1](https://github.com/boty-design/gateway/tree/demo/v1)，需要的同学自取。

如果你有什么疑问，欢迎在评论区提出或者加群沟通。 👏