本章开始将进入 **Dveops** 的开发章节，整个 **Devops** 章节的内容会非常多，篇幅有限我们将仅仅将选择主要的工程架构来讲解，更多的细节内容会放在直播（录播）中介绍。

有兴趣的同学也可以参考源码来一起看看，这一块的开发仍然在进行中，因为还有很多的调试跟前端页面的开发工作量。

## 项目搭建

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b398e8fb6c2c429eb1259a78f5549f62~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=532&h=1302&s=84130&e=png&b=252526)

首先按照之前搭建 **User** 跟 **Materials** 的流程，我们需要在 **Monorepo** 工程中创建 **Dveops** 的应用。

整体结构如下所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a4fddc15dad4078b89cf33ed69018cb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=867&h=694&s=45521&e=png&b=1c1c1c)

**接下来我们按照流程顺序一起学习下对应模块的内容**：

#### Common

首先介绍的是公共模块，这个模块中主要是对接其他系统的内容，所以我放在公共模块中，当然你也可以选择放在其他模块或者单独创建里面。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9739995f28e44e988d5d02f1c1ef480~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=612&h=493&s=39343&e=png&b=191919)

在 **IG** 这个项目中 **Common** 主要封装了 **Jenkins** 与 **Gitlab** 的业务模块，可以调用配置好的 **Jenkins** 与 **Gitlab** 的 **OpenApi**，方便其他模块使用。

同时可以发现，这两个模块并没有对接数据库的实体类，因为大部分的数据都是拆散落库到其它的表里，而且无论是 **Jenkins** 还是 **Gitlab** 都是有自己的持久化存储，所以即使需要全量数据的话，可以提供 **OpenApi** 从这对应的系统中获取。

> 这也是我为什么将这两个模块都收拢到 **Common** 的原因。

#### Helper

**Helper** 类一般是一个包含一些常用方法或功能的类，用来辅助完成某个模块或任务的功能。

在 **IG** 项目中，主要将对接三方 **OpenApi** 的功能全部放在其中，如图所示 **Helper** 中有四个模块分别是 **Feishu**、**Jenkins**、**Gitlab** 与 **Wechat**。

接下来我们以 **Gitlab** 为例子介绍一下具体的代码编写。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ed8acf999e34c6187ff3fd7670276a6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2458&h=1290&s=309244&e=png&b=1d1d1d)

如图所示，**Gitlab** 一共包含了以下几个模块：

- branch
- commits
- merge
- namespace
- project
- tags
- user

当然 **Gitlab** 本身提供了更多的能力，但我们目前只需要这些，需要接入多少功能可以按照自己的实际需求来取舍。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/027a15c9b8bd4f2d9e1c018e1db88b4e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2391&h=1099&s=258900&e=png&b=1d1d1d)

如图所示，当我们需要调用 **Gitlab Api** 的时候，需要使用 **ADMIN_PRIVATE_TOKEN** 来操作，一般来说这个是管理员账号，拥有最高的权限，但带来的限制是如果自己不做 **RBAC** 控制的话，权限会非常难以控制，所以最新的 **Gitlab Api** 可以使用管理员 **token** 授权每个用户独立 **token**，然后再使用授权的独立 **token** 去操作 **Gitlab Api**，这样很多危险操作会被限制住。

```ts
/**
 * @description: 创建分支
 */
const createBranch = async (
  { ref, projectId, branch }: IBranchList,
  access_token = '',
) => {
  const { data } = await methodV({
    url: `/projects/${projectId}/repository/branches`,
    params: {
      ref,
      branch,
    },
    query: { access_token },
    method: 'POST',
  });
  return data;
};
```
``` ts
/**
 * @description: 带 version 的通用 api 请求
 */
const methodV = async ({
  url,
  method,
  headers,
  params = {},
  query = {},
}: IMethodV): Promise<IRequest> => {
  let sendUrl = '';
  if (/^(http:\/\/|https:\/\/)/.test(url)) {
    sendUrl = url;
  } else {
    sendUrl = `${GIT_URL}/api/v4${url}`;
  }
  console.log(sendUrl, query);
  try {
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          'content-type': 'application/json',
          // 放开所有权限
          'PRIVATE-TOKEN': ADMIN_PRIVATE_TOKEN,
          ...headers,
        },
        url: sendUrl,
        method,
        params: {
          'private-token': ADMIN_PRIVATE_TOKEN,
          ...query,
        },
        data: {
          ...params,
        },
      })
        .then(({ data, status }) => {
          resolve({ data, code: status });
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    throw error;
  }
};
```

> 所以我对 **Helper** 模块的定义是：纯粹与三方项目对接的功能，不掺杂任何的业务逻辑，在对应的模块中组合具体逻辑，例如 **Jenkins Module**、**Project Module** 等。

#### Branch

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1648a71d593a447bbaaa0ccf9647fa64~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2163&h=1543&s=343249&e=png&b=1d1d1d)

**Branch** 模块的内容较为简单，它的功能是链接 **Gitlab** 或者其他的代码仓库与实际项目的中间层，所以会有 **name** 跟 **gitBranchName** 的区别，如果想做的足够闭环的的话，后续创建 **Branch** 的流程都可以在 **Devops** 项目中进行，不需要再在 **Gitlab** 中创建。

此外 **Branch** 中并没有 **Controller** ，因为在 **Devops** 中，**创建任务 && 流程是需要创建对应的代码分支**，所以也就没有必要单独提供 **Branch** 的 **Controller**。

#### Project 

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23bf310f99e94593b5e960456f1a465a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=648&h=645&s=49325&e=png&b=1a1a1a)

相比 **Branch** 而言，**Project** 模块就非常复杂，因为涉及到的配置模块非常多。

与之前的设计不同，这里将 **Project** 的 **Type** 与 **Config** 拆出来作为独立的子表，这样可以动态的增加项目类型以及通用的类型配置，组合配置起来会更加的灵活。

由于前后端都是一个项目也是自己独立开发，所以有些配置项跟流程是会在前端妥协，服务端的内容会部分的冗余。

```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export enum ProjectStatus {
  active = 1,
  deleted = 0,
}
@Entity()
export class Project {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  // 中文名，便于识别
  @ApiProperty({ example: 'hello' })
  @IsNotEmpty()
  @Column()
  zhName: string;

  // 作为部署项目的前缀路径名
  @IsNotEmpty()
  @Column()
  usName: string;

  // 描述
  @Column({ default: null })
  desc: string;

  @ApiProperty({ name: '最后一次迭代版本号' })
  @Column({ default: null })
  lastIterationVersion?: string;

  // 项目类型
  @ApiProperty({ example: [1, 2, 3] })
  @IsNotEmpty()
  @Column('simple-array')
  projectTypes: string[];

  // git project fields

  @Column({ default: null })
  gitProjectId: number;

  @Column({ default: null })
  gitNamespace: string;

  @Column({ default: null })
  gitProjectUrl: string;

  @Column({ default: null })
  gitProjectName: string;

  @Column({ default: null })
  gitProjectDesc: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime?: string;

  @Column()
  creatorName: string;

  @Column()
  creatorId: number;

  // 微服务关联id
  @Column({ type: 'simple-array', default: null })
  microserviceIds?: number[];

  // 项目状态
  @Column({ default: ProjectStatus.active })
  status?: number;
}
```

```ts
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  PrimaryColumn,
} from 'typeorm';

import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

@Entity()
export class ProjectConfiguration {
  @ApiResponseProperty()
  // @Column()
  @Generated('uuid')
  id?: number;

  @Column({ default: null })
  desc?: string;

  @PrimaryColumn({ name: 'project_id' })
  projectId: number;

  @ApiProperty({ example: 'iOS' })
  @IsNotEmpty()
  @PrimaryColumn({ name: 'project_type' })
  projectType: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime?: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime?: string;

  @Column({ type: 'json', default: null })
  deployConfig?: string;

  @Column({ type: 'json', default: null })
  nacosConfig?: string;

  @Column({ type: 'json', default: null })
  publishConfig?: string;

  @Column({ default: null })
  publishDocker?: string;

  @Column({ default: null })
  builderDocker?: string;

  @Column({ type: 'json', default: null })
  authentication?: string;

  @Column({ type: 'json', default: null })
  onlineMicroConfig?: string;

  @Column({ type: 'json', default: null })
  offlineMicroConfig?: string;
}
```

```ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectType {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  type: string;
}
```

结合上述的表结构可以看出，一个项目是可以有多个类型，这样可以兼容现在主流的跨端框架的 **CICD**。

对于微服务来说，主工程发布的时候，也可以选择多个子应用来发布，而微前端大部分都是 **Web** 类型的项目，所以我并没有通过 **ProjectType** 来区分，而是在 **Project** 表中添加 **microserviceIds** 来进行关联，这种树状结构设计，可以作为嵌套子应用的关联发布，实现无限嵌套的微前端方案，虽然实际情况比较少，我自己也没有试过 **3** 层以上的方案。

#### Iteration

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2cf2a73fc6e4d8cba5430287b875304~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2040&h=1552&s=455183&e=png&b=1d1d1d)

迭代（**Iteration**）模块的复杂度是仅次于 **Project** 的，从上图我们可以看到，迭代包含了流程以及流程节点的概念。

在之前的设计中，我们是默认流程是从 **开发** -> **测试** -> **预发** -> **生产** 一个全流程，但实际情况中并非每一个项目都需要全流程，甚至于并非每一次迭代都会需要如此完整的流程。

所以新的架构中，在 **Iteration** 基础上将**迭代**与**流程**剥离，每一轮的迭代都是可以关联对应的流程，同时每一个流程都可以有不同的流程 **Flow**，而 **Flow** 则是由每一个对应的 **Node** 节点组合而成，这样可以适配多种业务场景。

#### Deploy

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/946811eaa2e14036a0f6b6c93ce9e1e0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1299&h=591&s=60028&e=png&b=1c1c1c)

**Deploy** 的模块在业务开发中比较简单，主要是生成每一次的构建任务同时对接各个 **CICD** 的系统以及流程，此外需要保存对应的产物，也就是 **History** 模块，方便线上发布有问题的时候进行回滚。 

**一个简单的流程**：在前端发布的时候，根据对应的 **Project** 查询对应的发布配置也就是 **ProjectConfig**，同时根据 **Iteration** 查询对应的 **Process** 信息，当发布配置与流程都完成校验之后，调用 **Jenkins** 模块，完成 **CICD** 的流程，同时将生产环境的内容存储到 **History**，方便下次线上回滚数据。

#### System

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bf1864b4b2d4d29bd773bf7cefdc2e4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1738&h=1071&s=214513&e=png&b=1c1c1c)

**System** 模块是所有模块中最为简单的模块，主要是配置全局可用的基础服务，另外一个是操作日志，如果你自己接入日志系统的话，**operation** 也可以省去。


## 写在最后

**Devops** 与前面其他系统不同的是，它会与其他的系统做更多的交互，比如 **Jenkins**、**Gitlab** 或者 **K8S** 等其他在 **CICD** 链路上的会使用到的系统，除此之外还会提供 **CICD** 的微服务给物料系统使用。

同时低代码的服务端并不会太切入其他的业务里面，整套生态系统是可以进行流程自闭环，所以大部分的代码开发是纯粹的 **CURD**，并没有很多高阶的用法，但配合 **CICD** 模块，可能需要拓展的知识面会比较多。

当然如果 **Devops** 耦合了其他的业务模块，比如三方小程序、**RN**、**APP** 的内容的话，就会涉及到部分的业务开发，所以这一块的内容是需要自行的拓展，未来小册的项目也是没办法直接使用起来的。

由于服务端的内容大部分都是 **CURD**，因为会有非常多的业务逻辑跟细节在其中，这些很难在通过一两章节的文字表现出来，这也是为什么最近开始进行直播并录课的原因。

大家后期可以结合小册的架构介绍然后配合视频跟源码来学习本小册。

> 整体项目会比之前的架构设计稍微复杂点，后期项目发布第一个 **MVP** 版本的时候，我会重写服务端的架构篇。
