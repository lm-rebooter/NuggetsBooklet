> 本章内容是基于 **DevOps** 体系的精简版本，如果有阅读过之前 **DevOps** 小册的同学，可以快速掠过。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb94ed7d1ded4d41b92e64d77630648f~tplv-k3u1fbpfcp-zoom-1.image)

开局先放一张镇楼图，上图我在行云集团做的通用型 **CI/CD** 解决方案 **ALL IN DOCKER**，所有的操作构建与发布过程都在 **Docker** 中操作。

但很多公司和团队都有自己的基础设施和规范，包括使用不同的构建集成工具和仓库管理工具，比如使用 **Jenkins**、**Drone**、**GitLab CI**、**Github Action** 等等三方工具，不同的仓库管理工具如 **GitLab**、**GitHub**、**Gitee** 等。

我们产品的需求开发中会涉及到**私有化部署**以及**个性化定制**，所以需要设计一个通用性的 **CICD** 方案，不能让用户有新的学习成本与额外的使用维护负担，同时我们的发布不仅仅只有前端资源还可以包含服务端。

所以基于 **Docker** 的通用型方案，依然是我推荐的首选之一。

> 在这个方案中，我们会尽可能的减少三方构建工具的使用。尽量降低学习与使用的成本，但是 **Docker** 相关的一些内容还是需要补充的。

**一个通用型的 Devops 方案中，需要包含流程管理、持续构建、持续部署等**。

## 基于 GitFlow 的流程设计

**GitFlow** 的核心是通过在项目的不同阶段对 **branch** 的不同操作包括但不限于 **create**、**marge**、**rebase** 等来实现一个完整的高效率的工作流程。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eba4786e5ba46d0991dd69fae989937~tplv-k3u1fbpfcp-watermark.image?)

*   **Production**: 这个分支包含最近发布到生产环境的代码，最近发布的 **Release**，并且只能从其他分支合并，不能在这个分支直接修改，一般将 **Matser** 作为 **Production** 分支；
*   **Develop**: 包含所有要发布到下一个 **Release** 的代码，这个主要合并于其他分支，比如 **Feature** 分支；
*   **Feature**：用来开发一个新的功能，一旦开发完成，合并回 **Develop** 分支，并进入下一个 **Release**；
*   **Release**：当需要发布一个新 **Release** 的时候，基于 **Develop** 分支创建一个 **Release** 分支，完成 **Release** 后，合并到 **Master** 和 **Develop** 分支；
*   **Hotfix**: 当在线上环节发现新的 **Bug** 时候，需要创建一个 **Hotfix** 分支, 完成修复后，合并回 **Master** 和 **Develop** 分支，所以 **Hotfix** 的改动会进入下一个 **Release**。

整体的分支管理流程如下图所示

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e48ee7b35b684ceeb41b0ee2bf875bfa~tplv-k3u1fbpfcp-zoom-1.image)

通过服务端来控制整个 **GitFlow** 流程图如下所示：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f22c74bec9b4dbcbea217df7309ab4c~tplv-k3u1fbpfcp-watermark.image?)

服务端需要做的分支管理功能主要如下：

1.  控制每个分支的版本号；
2.  处理多分支集成发布的情况；
3.  防止生产环节发布缺失功能；
4.  锁定发布分支与发布环境，防止功能冲突。

## 基于 Docker 的 CICD

#### Docker 的优势

**第一优势**：**跨平台**，由于 `Docker` 的镜像能够提供除了系统内核之外完成的运行环境，所以能在任何系统中都能提供**一致的运行环境**，这样就不需要考虑不同系统中间兼容性的问题，也就不存在虚拟机在各系统中间的配置不同的情况。

**第二优势**：就是借助于跨平台的特性，`Docker` 可以将很多配置复杂的服务端中间件打包成基础镜像提供给开发使用。这样无疑能够大大降低配置成本，开发只需要知道常规的 `Docker` 相关的命令或者直接运行提供的容器编排脚本就可以搭建出需要使用的服务端环境。同时公共的镜像仓库上已经有很多这种基础镜像，例如 `Mysql`、`Redis`、`Node` 等等，按需提取即可。

**第三优势**：这点对于运维同学比较好操作，`Docker` 能提供快速迁移以及配合 `k8s`，能够快速的伸缩副本，减少运维的工作成本与负担。

> 这里简单介绍一下 **Docker** 相关的内容，学起来其实比想象中简单很多，不用过于抵触，更多的 **Docker** 相关的细节请移步《[工程化专栏](https://juejin.cn/column/7140245864781447175)》，里面会有比较多关于 **Docker** 方面的介绍，小册里面就不过多介绍了。

#### 持续构建与部署

为了完成持续构建与部署的功能，我们需要设计一个通用性的构建镜像：

1.  **基础镜像**：选择一个适合前端项目的基础镜像，例如 **Alpine Linux**、**Linux** 等；
2.  **安装必要的软件**：在基础镜像上安装必要的软件，例如构建工具、依赖管理工具、图片服务、上传工具等；
3.  **添加缓存和代理**：为了加速构建过程，可以添加缓存和代理。例如使用 **npm** 的缓存，以避免重复下载相同的软件包，以及借助 **Docker** 的文件联合系统架构，避免重复构建相同的层，提高构建效率；
4.  **清理冗余文件**：构建完成后需要清理不必要的文件，以确保镜像的大小尽可能小。例如安装软件包时下载的缓存文件、日志文件、临时文件等等。

> 在通用性的构建镜像之上，我们还需要针对各个不同的体系定制不同的业务构建镜像提供给不同的业务使用，所以在设计构建触发的时候需要有使用不同镜像构建的功能。

> 具体的 **Dockerfile** 脚本以及其他设计的内容都会放在对应的实战篇进行详细解说。

#### 基于 NestJS 的任务队列与调度

文章最开始的时候提过到了，在这套方案里面我们会尽可能的减少对于三方工具的依赖，在之前的 **ALL IN DOCKER** 的方案中，是借助了 **Jenkins** 的任务队列来下发各个构建任务。

当我们不再依赖于 **Jenkins** 的时候就需要自己来开发任务队列的模块了。

*   **任务队列**

`bull` 是一个基于 **Redis** 的高性能队列库，用于实现队列功能。`@nestjs/bull` 是 **NestJS** 对 `bull` 的封装，提供了更加便捷的使用方式。

可以使用 `@nestjs/bull` 中的 `@InjectQueue` 装饰器来注入队列服务。如下所示：

```ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EventQueue {
  constructor(@InjectQueue('event') private readonly queue: Queue) {}

  async addJob(jobData: any) {
    await this.queue.add(jobData);
  }

  async processJob(jobHandler: (jobData: any) => void) {
    this.queue.process(async (job) => {
      jobHandler(job.data);
    });
  }

  async getJobCounts() {
    const counts = await this.queue.getJobCounts();
    return {
      waiting: counts.waiting || 0,
      active: counts.active || 0,
      completed: counts.completed || 0,
      failed: counts.failed || 0,
    };
  }
}
```

*   **任务调度**

在低代码产品中我们需要提供**定时发布、上下架**的功能，而 **NestJS** 也提供了这样的能力 **NestJS Schedule**。

1.  **创建任务调度器**：可以使用 **NestJS Schedule** 中的 `@Cron` 装饰器来定义一个任务调度器。如下代码所示，创建了一个每分钟调用一次的任务调度器：

```ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskScheduler {
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    console.log('Called every minute');
  }
}
```

2.  **注册任务调度器**：使用任务调度器，需要使用 `ScheduleModule.forRoot()` 方法注册 **NestJS Schedule** 模块：

```ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskScheduler } from './schedulers/task.scheduler';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TaskScheduler],
})
export class AppModule {}
```

在上述的代码中，我们在 `providers` 数组中添加了 `TaskScheduler`，并在 `imports` 数组中注册了 **NestJS Schedule** 模块。

> 这里的具体设计细节后续会在对应的服务端开发中展开讲解，因为是设计篇，所以不想放一些示例的内容，这样没有上下文联系，学起来会比较分散。

## 写在最后

本章主要是介绍了 **CI/CD** 相关的设计，无论是工程化的专栏还是 **Devops** 的小册，都对相关的设计做了很多的介绍，所以本章的内容就不做过多介绍，感兴趣的同学可以多看一下，拓展一下相关的知识体系。

但与之前不同的是，这次我们并不打算借助三方工具来减少成本，而是全部自己开发来减少用户的学习与使用成本。

如果你有什么疑问或者更好的建议，欢迎在评论区提出或者加群沟通。 👏

> 后续有空的话，会在工程化的专栏里面继续添加一些 **Docker** 相关的内容，可以随手关注于一下。
