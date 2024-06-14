在我们初步学习完 **NestJS** 的相关操作之后，后续将深入低代码的服务端开发，在正式开发服务端之前，本章我们一起学习下如何开发一款服务于 **CICD** 的 **CLI**。

在之前的 **CLI** 架构设计中，我们需要补充一个新的设定就是流程编排的功能，其次 **CLI** 将会被分割为两个独立模块 **ig-base-cli** 与 **ig-build-cli**，作为基础 **CICD** 与构建的 **CLI**，实现功能收敛。

接下来我们将一起看看如何实现设计中的一些功能。

## 开发自定义注册插件功能

新建批量注册命令行的工具类：

```
#!/usr/bin/env node

import * as path from "path";
import alias from "module-alias";
const packageConfig = require("../../package.json")

alias(path.resolve(__dirname, "../../"));

import { Command } from 'commander';

import internallyCommand from './internally'

import { initExtraPack } from './extra'

const program = new Command(packageConfig.commandName);

export interface ICommand {
  description: string
  command: string
  action: (value?: any) => void
}

const initCommand = (commandConfig: ICommand[]) => {
  commandConfig.forEach(config => {
    const { description, command, action } = config
    program
      .version(packageConfig.version)
      .description(description)
      .command(command)
      .action((value) => {
        action(value)
      })
  })
}

const init = () => {
  const extraPacks = initExtraPack()
  initCommand([...internallyCommand, ...extraPacks])
}

init()

program.parse(process.argv);
```

其中 **internally** 作为内置命令行工具合集，**extra** 则代表拓展命令行合集，此时你的目录结构应该如下所示：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51a85fa168334de290108a2590b57553~tplv-k3u1fbpfcp-watermark.image?)

内置命令行工具比较简单，首先注册一个 `Command`：

`src/bin/register.ts`

```
import inquirer from '@/inquirer';

const { registerPlugin } = inquirer

export const registerPluginCommand = {
  description: 'register plugin',
  command: 'register plugin',
  action: () => registerPlugin()
}

export default [
  registerPluginCommand
]
```

如何在入口文件：`src/bin/index.ts` 引入即可，其他的命令用法类似：

```
import build from './build'
import tpl from './tpl'
import git from './git'
import safety from './safety'
import register from './register'
import utils from './utils'

export default [
  ...build,
  ...safety,
  ...git,
  ...tpl,
  ...register,
  ...utils
]
```

**所以接下来我们着重讲解拓展命令行工具的模块**。

#### 注册流程

简点的注册流程图如下所示：
1. 输入第三方插件名称
2. 安装依赖
3. 注册完毕等待使用

对于主 **CLI** 来说，不可能接受太个性化、自定义的插件进来，这样会影响 **CLI** 的结构，所以我们需要对 CLI 插件的模板做一个约束，除了输出的格式与上述内置插件格式保持一致之外，我们还需要对插件名称、依赖等等做一个约束，不过这点可以以提供一个 **CLI** 插件模板来约定。

对于我们的 `@ignition-space/ig-base-cli` 来说，我们将只接受 `@ignition-space/fe-plugin-***` 命名格式的插件进来。这种规则可以根据团队的命名规范来约定，并不是唯一规范。

所以，添加模板的时候需要做两次校验，第一层校验是通过校验名字，第二层是安装依赖，如果依赖安装失败也不会添加成功。

插件的命名校验，我们可以通过 `inquirer` 的 `validate` 函数来校验：

`src/inquirer/registerPlugin.ts`

```
import inquirer from 'inquirer';
import { existNpm, npmInstall } from '@/util/npm'
import { loggerSuccess } from '@/util';
import { updatePlugin } from '@/plugin'

const promptList = [
  {
    type: 'input',
    message: '请输入插件名称:',
    name: 'pluginName',
    default: 'ig-plugin-eslint',
    validate(v: string) {
      return v.includes('fe-plugin-')
    },
    transformer(v: string) {
      return `@ignition-space/${v}`
    }
  }
];

export const registerPlugin = () => {
  inquirer.prompt(promptList).then(async (answers: any) => {
    const { pluginName } = answers
    const exist = await existNpm(`@ignition-space/${pluginName}`)
    if (exist) {
      npmInstall(`@ignition-space/${pluginName}`)
      loggerSuccess(`@ignition-space/${pluginName} register successful!`)
      updatePlugin({ name: `@ignition-space/${pluginName}` })
    }
  })
}
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c7583fa6a314f2094933fd3397032d4~tplv-k3u1fbpfcp-watermark.image?)

在通过组件命令校验之后，可以通过 `latest-version` 来校验是否已经存在发布的包，以免安装失败，注册 **command** 异常。

再校验插件的 **npm** 包无误之后，继续用 **shelljs** 来安装插件对应的依赖：

```ts
export const npmInstall = async (packageName: string) => {
  try {
    shelljs.exec(`yarn add ${packageName}`, { cwd: process.cwd() });
  } catch (error) {
    loggerError(error)
    process.exit(1)
  }
}
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/421a649229c74e288a221b244b6529e2~tplv-k3u1fbpfcp-watermark.image?)

同样最后我们需要将注册的插件以文件的形式缓存起来，下一次使用的时候读取配置文件，将插件命令注入，提供给用户使用。

```ts
export const updatePlugin = async (params: IPlugin) => {
  const { name } = params
  let isExist = false
  try {
    const pluginConfig = loadFile<IPlugin[]>(`${cacheTpl}/.plugin.json`)
    let file = [{ name }]
    if (pluginConfig) {
      isExist = pluginConfig.some(tpl => tpl.name === name)
      if (!isExist) {
        file = [
          ...pluginConfig,
          { name }
        ]
      }
    }
    writeFile(cacheTpl, '.plugin.json', file)
    loggerSuccess(`${isExist ? 'Update' : 'Add'} Plugin Successful!`)
  } catch (error) {
    loggerError(error)
  }
}
```

完成上述所有的开发之后，最后我们来执行命令看看效果：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a30f7677782482c9d567818f7a716f3~tplv-k3u1fbpfcp-watermark.image?)

`ig tEslint` 是我们从第三方插件注册得来的，可以从上图看到，已经再注册了第三方 `@ignition-space/ig-plugin-eslint` 插件之后，用户已经可以使用通过插件提供的 `tEslint` 命令了。

之后就可以让业务同学自行开发想要的插件，丰富 **CLI** 的插件市场，但是还是需要对插件的模板有一定的规范，随心所欲的结果就是不可控，所以接下来我们进行 **CLI** 插件模板的开发。

#### CLI 插件模板

插件模板最大的约束只有暴露出与内置命令一样的 **command** 注册配置，这样可以让开发第三方插件的同学有最大程度功能自定义化。

```ts
import { getEslint } from './eslint'

export const execEslint = async () => {
  await getEslint()
}

export const eslintCommand = {
  version: '0.1.0',
  description: 'start eslint and fix code',
  command: 'tEslint',
  action: () => execEslint()
}

export default [
  eslintCommand
]

module.exports = eslintCommand
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2e0b967844f4ff8a09509fc08af09fb~tplv-k3u1fbpfcp-watermark.image)

这里我是直接迁移了 **CLI** 的命令，`package.json` 里面 `bin` 字段是可以在全局安装完毕之后继续使用 `eslint` 的命令，而在 `main` 的属性中定义了 `lib/index.js` 是为了能在 **CLI** 命令入口的时候 `require` 对应的注册配置。

#### 版本检测

在注册插件的时候，我们也是利用了 `latest-version` 检测是否在 **npm** 上存在版本来判断 **npm** 包能否正常下载，它本身的功能是检测 **npm** 包是否是最新的，如果不是最新的话，可以选择更新当前版本。

同时也可以选择性在项目启动的时候就检测一遍版本，例如当 **npm** 包版本出现 **break change**，只有强制更新才能继续使用功能，不过这种配置需要看当前业务需求，比如内置命令有重大更新必须 **CLI** 升级之后才能使用的情况。

```ts
import { loggerInfo, loggerWarring } from '@/util';
const packageInfo = require('../../package.json');
import latestVersion from 'latest-version';

const parseVersion = (ver: string) => {
  return ver.split('.').toString()
}

export const checkVersion = async () => {
  const latestVer = await latestVersion('@ignition-space/ig-base-cli');
  if (parseVersion(latestVer) > parseVersion(packageInfo.version)) {
    loggerWarring(`The current version is the :  ${latestVer}`)
  } else {
    loggerInfo('The current version is the latest:')
  }
}
```

## 流程编排

与其他的 **CLI** 不同的是，我们的 **base-cli** 也提供了类型 **GitLab CI yaml** 的配置流程模式，只不过我们的组合模式会更加自由。

首先，我们定义一下流程构建的具体代码：

`src/build/index.ts`

```ts
import { ConfigExist, loadTsConfig } from "@/util/file"

import shelljs from 'shelljs'

import TaskQueue from "@/util/taskQueue"
import { loggerInfo } from "@/util"

const buildFlow = async () => {
  const taskQueue = new TaskQueue()
  const exist = ConfigExist("ig.config.ts")

  let buildConfig: any = {}
  if (exist) {
    buildConfig = loadTsConfig("ig.config.ts")
  }

  // If flow is detected, execute process orchestration
  if (buildConfig.flow) {
    const { flow } = buildConfig

    if (flow.preHook) {
      loggerInfo(`stage.preHook==>${flow.preHook}`)
      await shelljs.exec(flow.preHook)
    }

    // Add task into queue
    flow?.stages.forEach((stage: any) => {
      if (flow[stage].script) {
        loggerInfo(`stage.script==>${flow[stage].script}`)
        taskQueue.enqueue(async () => {

          if (flow[stage].preHook) {
            await shelljs.exec(flow[stage].preHook)
          }

          await shelljs.exec(flow[stage].script)

          if (flow[stage].doneHook) {
            await shelljs.exec(flow[stage].doneHook)
          }
        })
      }
    })

    if (flow.doneHook) {
      taskQueue.enqueue(async () => {
        loggerInfo(`stage.doneHook==>${flow.doneHook}`)
        await shelljs.exec(flow.doneHook)
      })
    }

    // Execute queue
    taskQueue.start()
  }
}

export {
  buildFlow
}
```

其次暴露对应的命令：

`src/bin/internally/build.ts`

```ts
import { buildFlow } from "@/build"

export const BuildFlowCommand = {
  description: 'buildFlow',
  command: 'buildFlow',
  action: () => buildFlow()
}

export default [
  BuildFlowCommand
]
```

接下来我们要能够读取实际项目中的配置文件：

`ig.config.ts` 此文件将放在所需项目中的根目录下：

```ts
export default {
  flow: {
    preHook: 'echo preHook all',
    stages: ["build", "publish"],
    build: {
      preHook: 'echo preHook build',
      script: 'echo build'
    },
    publish: {
      script: 'echo publish',
      doneHook: 'echo doneHook publish',
    },
    doneHook: 'echo doneHook all',
  }
}
```

由于配置文件格式为 **ts**，需要我们在加载的时候需要借助 `ts-node` 来解析它。

`src/util/file.ts`

```
/**
 * @description: 解析 ts 配置文件
 * @param {string} path
 * @param {string} fileName
 * @param {string} file
 * @return {*}
 */
export const loadTsConfig = (path: string) => {
  // 读取并解析 TypeScript 配置文件
  const configPath = getDirPath("../../tsconfig.json");

  // 读取并解析 TypeScript 配置文件
  // 注册 ts-node
  register({
    project: configPath,
  });

  // 加载并执行你的 TypeScript 配置文件
  const config = require(getCwdPath(path)).default;

  // 处理配置文件的逻辑
  return config
}
```

接下来运行流程编排的命令：

```
ig buildFlow
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6227ed97c05c4c3aaffad9c400c3f907~tplv-k3u1fbpfcp-watermark.image?)

> 流程编排的价值在于，可以让用户使用最擅长的语言来执行脚本，并且可以自由组合每一个步骤，当然目前的代码作为实际生产来使用还欠缺很大的火候，后期在整体开发中会逐步完成这个生态结构。

## 写在最后

由于篇幅所限，本章的内容摘取了部分主要的功能以及部分关键的代码实现，所以单独看本章的内容可能难以实现所有的功能，此时需要配合项目实际功能来对照学习。

以下是 [ig-base-cli](https://github.com/Ignition-Space/ig-base-cli) 以及 [ig-build-cli](https://github.com/Ignition-Space/ig-build-cli) 的仓库，后续也会继续更新，可以关注下。

如果你有什么疑问，欢迎在评论区提出或者加群沟通。 👏