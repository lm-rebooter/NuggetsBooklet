都说 JavaScript 的成功离不开生态，它的成功并不在于它的语法设计有多优秀，能力有多强。最开始靠“浏览器里只能跑它”发家，到后面靠的是 Web 留下的不能废弃的遗产，以及谁都能来学的门槛。总结起来就是：

1.  JavaScript 是目前唯一可以运行在大多数浏览器中的语言；
2.  门槛低；
3.  生态大。

> 前两点我曾在一个问题下也这么回答过：[感觉 JS 这门语言越来越强大了，程序语言里的屌丝逆袭成高富帅的感觉，到底是什么让 JS 苟起来的？](https://www.zhihu.com/question/530656381/answer/2472495835 "https://www.zhihu.com/question/530656381/answer/2472495835")

而今天的重点则在于“生态大”。

JavaScript 生态形态发展史
------------------

今天就不考古了，就说近几年的发展史。以前我在“网页制作（对，就是这个老土的词）”方面一直是野路子出身，不会原生的 DOM 操作，只会 jQuery，实际上时至今日依旧如此。还记得刚开始写 jQuery 的时候，一个学长给我写了这么一段代码：

    $(function() {
      // ...
    });
    

然后跟我说，你不用管 `$` 这个代码块是干嘛用的，只需要记住所有的代码写在这里面就好了。我当时死活不明白，就光牢记这个模板了。就跟以前学 C++ 样，你不用管 `#include <iostream>` 是干嘛用的，你只要第一句这么写就好了。

jQuery 就是多年前非常流行的生态包之一。最开始，是开发者直接去 jQuery 官网上下载源码，然后通过 `<script />` 标签引入。后来为了分流，把 jQuery 源码发布到自己另一个域名下，然后远程引入。当年没有这种公共 CDN 给大家用，带宽是个奢侈品。再后来有了公共 CDN，大家开始直接使用公共 CDN。

AMD、UMD、CMD 等出来后，前端工程化开始萌芽。有了各种构建工具。然后各种生态库在工程化的加持下，开始有了“包”的概念，不再是单独模块了。恰逢那个时候也是 Node.js 的萌芽期，于是整个 JavaScript 领域有了两个比较流行的包管理系统：npm 与 bower。

![07-并排图1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9c957080f3c41238ed11f0599b4008f~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1484&h=490&s=90753&e=png&b=ffffff)

### Bower 的发展

Bower 的官网是这么写的：

> Web sites are made of lots of things — frameworks, libraries, assets, and utilities. Bower manages all these things for you.

帮你管理类库。它是 2012 年由 Twitter 开源出来的。年代久远，其实我也忘了怎么用了，只记得是要写一个 `.bowerrc` 或者 `bower.json`。至于类库是被安装在什么位置，怎么做整合，树状依赖怎么管理（好像只支持扁平依赖），我都忘了。而且当时的前端工程化并没有多复杂，一个项目撑死用几个拍平的大类库就够了（也有可能是因为我当时根本没参加多复杂的项目）。

当时一种流行的前端工程化是靠 Bower + Grunt（或者 Gulp）堆起来的。后来前端项目越来越复杂，树状依赖越来越深，一个 `left-pad` 都变成了一个包，并且有着庞大的用户基数，bower 也越来越难以应对这些复杂场景。

后来，Bower 自然退出了历史舞台。

### npm 的发展

npm 是什么意思？大多数人对这种全辅音字母的名词会下意识去找它的缩写。npm、npm，Node.js Package Manager。没错了，就是它。如果是在多年前，的确 npm 就是 Node.js Package Manager，毕竟它是 Node.js 的伴生产物。这不，Bower 退出历史了么，npm 顺便也扛过了前端包管理的大旗。这个时候如果再叫 Node.js Package Manager 是不是有点过分了？但问题是，咱用了这么多年的名字也不能改啊，改了别人怎么知道我是 npm 呢？

于是，npm 名字没变，意义被强行掰弯了——跟名字没有半毛钱关系。JavaScript Package Manager，这是其在 GitHub 组织、仓库的描述。实际上现在它也不再局限于为 JavaScript 管理了。在 npm 官网上，它还在继续为 npm 缩写进行挽尊，在左上角会随机一个缩写为 npm 的词组，Needy Poetic Mothers、Nothing Precedes Matter……

npm 的发展过程中，有一个`分水岭`是 npm 2 和 npm 3。其最大的区别在于，npm 2 安装依赖、生成依赖树的路径完全是一棵树；npm 3 则会将依赖拍平，只有在 SemVer 版本冲突的时候，才会继续在子树下长出来。用简单的依赖关系描述目录结构关系，如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04649ff069094627be6eda0856b2fe5c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=913&h=373&s=36529&e=png&a=1&b=ffffff)

虽然这么做，的确可以减少冗余的依赖体积，但这个问题可以通过各种方式去解（如软链接，cnpm、pnpm）。所以这么做的主要目的只剩下两个：

1.  解决 Windows 下目录层级过深导致目录字符串超长的问题；
2.  前端工程化中，构建包体积剪枝。

第一个问题，只能是解决大部分情况。在极端情况下（层级无法被缩减），还是会有超长情况发生的，就比如上图中，它的真正目录层级并没有变浅，最深的仍是“根 → A@1 → C@2 → B@2”这条关键路径。

所以，我个人狭隘的理解，**npm** **由 2 变 3，最大的目的是更好地服务前端包**。npm 发展至今日，已经到达 npm 9 了，但它的安装目录结构仍是由 npm 3 演进而来的。在 npm 的基础上，符合 Node.js 包及模块寻径的规则下，整个社区又衍生出类似 cnpm、yarn、pnpm 等包管理工具。但是这又有点奇怪，npm 到底是什么？

Node.js 下的包
-----------

要说 npm 到底是什么，我们得从 Node.js 下的包说起。

对于 Node.js 来说，你包是通过什么东西安装，从什么途径安装，等等问题是不关心的，它只关心它眼下的内容——**通过模块寻径规则能找到模块即可**。所以从原则上讲，Node.js 下的包与 npm 是分离的。只不过 npm 恰好符合了 Node.js 包的规则，用它安装出来的目录能被 Node.js 所用而已。我写个“死月 pm”只要符合规范也可以。

> ### 奥某科技的插件
> 
> 大概是 2013 年左右吧，我有幸参与过奥某科技直播网站的后端开发。那会儿各种 Web 直播站点如雨春笋般冒出，再加上那时是 Node.js 的萌芽阶段，这俩货就碰一起了。
> 
> 当年研发、工程化等还没现在这么成熟，代码也都是 SVN 管理，直接目录拷贝的，所以整个项目是带着 `node_modules` 管理的。
> 
> 我看到一种神奇的用法，当时他们有一个功能是礼物插件还是什么插件，一个插件是一个模块（或者一系列模块）。这些模块并没有在项目目录下，以某种目录形式出现，如：`lib/plugin/<插件名>.js` 或者 `lib/plugin/<插件名>/index.js`；也没有被封装成某个 npm 包发到源站上，毕竟这是一个内部业务逻辑代码，当时私有化部署源站也不流行。
> 
> 他们将这些插件直接手动写到了 `./node_modules/mod/<插件名>` 目录下。没有 `svn-ignore.txt` 去忽略 `node_modules`，使用的时候直接通过 `require('mod/<插件名>')` 的方式加载“包”。在 `node_modules` 目录中修改其他包的内容也会被持久化。
> 
> 这也从侧面说明了，对于 Node.js 来说，所谓“包”只是个目录和某种规则，手写只要符合规则即可。npm 才是用于管理这些包的存在。

### CommonJS 包规范

这个时候，我们就又得提一下 CommonJS 了。只不过这次我们提的不再是 CommonJS 模块，而是 CommonJS 包。是的，你没看错，CommonJS 不仅仅是模块的规范，它还描述了[符合 CommonJS 规范的包](https://wiki.commonjs.org/wiki/Packages/1.1 "https://wiki.commonjs.org/wiki/Packages/1.1")是什么样的。Wiki 上是这么写的：

> A CommonJS package is a cohesive wrapping of a collection of modules, code and other assets into a single form.

按 CommonJS 包规范的定义，一个包需包含包描述文件，即 `package.json`，里面需要包含各种字段。npm 下的 `package.json` 也有很多字段，有些是遵循 CommonJS 规范定义的，而有些则是 npm 自行定义的。但是毋庸置疑，npm 遵循着 Node.js 的需求，也一定程度上契合了 CommonJS 规范。

除了描述文件外，它还定义了下面几个目录：

*   可执行文件需在 `bin` 目录下；
*   JavaScript 代码需在 `lib` 目录下；
*   文档需在 `doc` 目录下；
*   单元测试文件需在 `test` 目录下。

如果你经验丰富，见多识广，你就会发现非常多早期的 npm 包都是照着这套君子规定的指引来做的。近两年开始散漫起来。毕竟，这只是 CommonJS 包规范，并不是 Node.js 的强约束，更不是 npm 的约束。

对于现在的 Node.js 来说，`package.json` 里的字段用得都不对，比 npm 用到的少。Node.js 只会用到 `package.json` 中寻径相关的字段，比如 `main`、各种映射字段、用于判断模块类型的 `type` 字段等，甚至都不会判断 `name` 是否匹配。在 CommonJS 模式下，甚至没有 `package.json` 也不影响——只要你目录符合寻径算法就好了。

也就是说，你不通过 npm，而是通过手写代码去创建如下代码是完全可以执行的：

    // ./node_modules/foo/index.js
    module.exports = {
      foo: 'hello world',
    };
    
    // ./index.js
    const { foo } = require('foo');
    console.log(foo);
    

如果你需要用 ECMAScript modules 的形式，则可以这样：

    // ./node_modules/foo/index.mjs
    export const foo = 'hello world';
    
    // ./index.mjs
    import { foo } from 'foo';
    console.log(foo);
    

你如果细心点自己去检验一下，会发现上面的 ESM 代码是跑不起来的，原因是无法找到包。这个时候有两种修改方式：

1.  创建一个 `./node_modules/foo/package.json`，里面只需要定义一个字段 `{"main":"index.mjs"}` 即可；
2.  `index.mjs` 的导入改成 `import { foo } from 'foo/index.mjs'`。

简单来说，Node.js 包参考自 CommonJS 的包，`package.json` 这些内容只用于研发时管理用，并不会被 Node.js 强依赖，只要目录合规即可。而 npm 则帮 Node.js 管理了这些依赖，生成符合规则的目录，并做一些额外的事情（构建、打包等）。

### Node.js 包、模块寻径规则

这里我们又不得不再绕回寻径规则了。所谓包，在 Node.js 眼里就是有很多模块的一个特殊目录，它可以通过不断往上级目录回溯去寻径，也可以通过目录下的元信息描述文件（`package.json`）做映射，没有这个元信息描述文件也不打紧。

Node.js 中，如果在 `require` 或 `import` 模块时，其标识不以相对路径的点（`.`、`..`）为始，又不是一个内置模块，则认为其是从某个“包”内进行导入。它会根据标识第一段（若有 `@foo/bar` 形式则以前两段）作为“包名”去当前模块所在路径的 `node_modules` 目录下寻找，接下去就是之前提到的熟悉戏码了，若找不到，就去上级目录，仍以同样内容作为“包名”，在上级目录中的 `node_modules` 目录寻找。

> 在 Node.js 眼中，“包名”就是目录名，而非 `package.json` 中的 `name`，它以目录作为事实标准。当然，在一切没有特殊的情况下，`name` 都是等同于对应目录名（包含 Scope 在内）的。

我们以之前那张图中 npm 3 的结构为例：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93d8400536d44f68b8b31960da71781a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=333&h=283&s=18618&e=png&a=1&b=fefefe)

设我当前是 `C@2` 中的 `index.js`，它的目录则是 `./node_modules/A/node_modules/C/index.js`，这个时候，它需要去 `require('D')`，那么寻径的流程为：

1.  在当前目录的 `node_modules` 下找，即 `./node_modules/A/node_modules/C/node_modules/D`，不存在；
2.  去上级目录找，即 `./node_modules/A/node_modules/D`，不存在；
3.  去上级目录找，即 `./node_modules/D`，存在。

于是就是 `./node_modules/D` 了。我们在之前[模块机制详解（中）](https://juejin.cn/book/7196627546253819916/section/7198603743657459715 "https://juejin.cn/book/7196627546253819916/section/7198603743657459715")提到过，这个寻径过程是 Node.js 通过 `Module._resolveLookupPaths()` 先生成后，再逐一遍历判断的。这里显然判断到 `./node_modules/D` 就命中了，退出遍历。

在判断命中的逻辑中，当我们到达 `./node_modules/D` 的时候，由于没有指定具体哪个文件，则需要通过两种方式来判断命中文件：

1.  读取当前目录的 `package.json`，从 `main` 字段获取映射，判断文件是否存在；
2.  若无 `package.json` 或 `main`，则默认以 `index` 加各种后缀尝试。

这里的第一种方式就是跟“包”强相关了。毕竟只有一个“包”描述文件才有 `main` 字段。

正是这种向上回溯式的 Node.js 包寻径机制，才让 npm 3+ 的拍平式依赖目录在 Node.js 中合法。毕竟，哪怕某个依赖被拍平了，就像上面的 A 和 D，D 也在寻径回溯链的某个节点上。

npm 究竟是什么？
----------

说了这么多，npm 到底是什么？Node.js 的包管理系统？那 cnpm、pnpm、yarn 又是什么？[npmjs.org](https://npmjs.org "https://npmjs.org") 和 [cnpmjs.org](https://cnpmjs.org "https://cnpmjs.org") 又各自是什么？

其实 npm 有多重语义在，在不同语义中代表不同含义。就官方言论，一个 npm 分别可以是：

1.  **Node.js 下的包管理器**：始于 2009 年开源，帮助 JavaScript 开发者们可轻易分享包；
2.  **npm 源站**：Node.js、前端应用、移动端应用等的公共包代码合辑服务；
3.  **npm CLI**：用于安装、发布上述包的客户端。

同理可得，cnpm 也分为 cnpm 仓库和 cnpm CLI，而 cnpm 源站则是官方 npm 仓库的镜像源；pnpm 则是 pnpm CLI。而这些源站 API 都是相互兼容的，所以 cnpm CLI 可以从 npm 源站安装包，反之亦然。

npm 既是源站，又是客户端。源站没什么好讲，它有海量的 JavaScript 生态包，被全球开发者发布、下载，其通过一定规范的 API 与 npm CLI 进行交互，可让开发者通过 CLI 做上述操作。而该源站的 API 也成了一个事实标准，大多数的同类包管理 CLI 都使用了同一套 API，自然这些同类的包源站也用的是同一套 API。

所以对于源站来说，除非是完全不一样的包管理 CLI，一般差异化都在 Web 页面、节点速度（比如针对国内开发者）、其他增值功能上。比如通常各大公司都在公司内部有一个私有化部署的 npm 源站，除了从官方源站同步内容外，还会有一些只有公司内部用的生态包。

对于 CLI 来说，它的主要作用就是从源站读取包信息、下载包内容，并按照某种规范排布目录，使得 Node.js 在使用的时候，能正常通过 `require()` 或是 `import` 来导入模块。不同的 CLI 排布规则不一样，但是在 Node.js 中能达到同样的效果。而排布规则的不同大多都是出于依赖体积、安装速度考虑的。

此前我们分别讲述了 npm 2、3 的包安装目录排布规则。cnpm 和 pnpm 则用的另一套方案——软链接。有兴趣的读者可自行去网上阅读一下相关资料。

以及，如果需要知道 npm 中的 `package.json` 各字段代表什么含义，有什么用，建议直接阅读 [npm 官方文档](https://docs.npmjs.com/cli/v9/configuring-npm/package-json "https://docs.npmjs.com/cli/v9/configuring-npm/package-json")。

SemVer
------

其实不想讲 [SemVer](https://semver.org/ "https://semver.org/") 的，网上资料太多了。基本上我直接复制一篇过来都直接可以用。npm 在 `package.json` 声明依赖的时候，是以 KV 形式表示的。K 表示报名，V 则表示版本号。这里的“版本号”只是个代称，除了 SemVer 的版本号之外，还可以是路径等等内容：

1.  一个 SemVer 版本号范围；
2.  URL；
3.  Git 地址；
4.  GitHub 下的 `user/repo` 形式；
5.  Tag 标签；
6.  本地路径。

如：

    {
      "dependencies": {
        "foo": "1.0.0 - 2.9999.9999",
        "bar": ">=1.0.2 <2.1.2",
        "baz": ">1.0.2 <=2.3.4",
        "boo": "2.0.1",
        "qux": "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0",
        "asd": "http://asdf.com/asdf.tar.gz",
        "til": "~1.2",
        "elf": "~1.2.3",
        "two": "2.x",
        "thr": "3.3.x",
        "lat": "latest",
        "dyl": "file:../dyl"
      }
    }
    

[规范的 SemVer 格式](https://semver.org/#backusnaur-form-grammar-for-valid-semver-versions "https://semver.org/#backusnaur-form-grammar-for-valid-semver-versions")为：`<主版本号>.<次版本号>.<修订号>-<先行版本号>+<构建号>`。其中主版本号、次版本号和修订号必须是数字。先行版本号和构建号可以是字母、数字以及小数点 `.`，不过先行版本号是不可以有前导零的，构建号可以。

我们常见的在 SemVer 前面加上 `~`、`^` 等符号，就表示这是一个 SemVer 范围。下面不严谨地讲一下，更严谨的说明可参阅 [node-semver 文档](https://github.com/npm/node-semver#advanced-range-syntax "https://github.com/npm/node-semver#advanced-range-syntax")。

### 精确匹配

如果这个范围是 SemVer 本身，则需精确匹配特定版本。

### 大于、小于

如果前面是大于、小于等符号，则范围为字面意义上的范围：

*   `<`：小于某个版本；
*   `<=`：小于等于某个版本；
*   `>`：大于某个版本；
*   `>=`：大于等于某个版本；
*   `=`：精确匹配。

### 区间匹配

区间匹配为两个版本号之间加个 `-`，表示匹配的版本需要在区间中间。如 `1.2.3 - 2.3.4` 代表 `>= 1.2.3 <= 2.3.4`。

### 通配匹配

某一段单一个 `*`、`x` 和 `X` 可代表通配。比如 `*` 代表任意版本（`>= 0.0.0`）；`1.x` 代表 `1` 为主版本的任意版本（`>= 1.0.0 < 2.0.0-0`）；`1.2.x` 则代表 `1.2` 为主次版本的任意版本（`>= 1.2.0 < 1.3.0-0`）。其实这上面的通配是可忽略的，也就是说空字符串代表任意版本，`1` 等同于 `1.x`，`1.2` 等同于 `1.2.x`。

### 波浪匹配

波浪匹配和上箭头匹配是最常见的 SemVer 匹配范围表示了。波浪匹配不允许动主次版本号，以修订版本号为最低匹配版本号去匹配。如 `~1.2.3` 则说明 `>= 1.2.3 < 1.3.0-0`；`~1.2` 则说明 `>= 1.2.0 < 1.3.0-0`，即等同于 `1.2` 或 `1.2.x`；`~0.2` 表示 `>= 0.2.0 < 0.3.0-0`。

波浪匹配有一个例外，就是若只指定了主版本号，则将版本限定为对应主版本号下的所有版本号。也就是说 `~0` 表示 `>= 0.0.0 < 1.0.0-0`。

### 上箭头匹配

上箭头匹配表示第一个非零版本段后面的版本段可被升级。例如 `^1.2.3`，第一个非零版本段是主版本号，它后面的版本段是次版本号，也就说可匹配大于该版本号的所有该主版本号下的版本号，即 `>= 1.2.3 < 2.0.0-0`；`^0.2.3` 的第一个非零是次版本号，也就是说可匹配该版本号的所有该次版本号下的版本号，即 `>= 0.2.3 < 0.3.0-0`。`^0.0.3` 只能匹配该修订号下所有先行版本号，即 `>= 0.0.3 < 0.0.4-0`。

既然讲到了先行版本号，那么可以再匹配下。`^1.2.3-beta.2` 代表 `>= 1.2.3-beta.2 < 2.0.0-0`；`^0.0.3-beta.2` 代表 `>= 0.0.3-beta.2 < 0.0.4-0`。所有不带先行版本号的 SemVer 版本都比对应版本加上任意先行版本号的 SemVer 版本大，即 `1.0.0` 是大于 `1.0.0-<xxx>` 的。

小结
--

在 JavaScript 发展的过程中，包管理器并不是一直只有 npm，实际上现在也不是。只是 npm 在设计上更符合现代 JavaScript 工程体系一些，所以渐渐地其他一些包管理器如 Bower 就式微了。

npm 既可代表 npm 源站，也可以代表 npm CLI。二者皆可有替代品，只要遵循一套服务端 API 接口即可。此外，在包管理期间安装的包需要符合 Node.js 的包寻径及使用规范。本章也就着前面的章节又过了一遍 Node.js 在这一块上面的规则。

所以，哪怕 cnpm 与 npm 安装依赖的结构不同，但是它们都符合该规范，它们都能在 Node.js 项目中使用。即使是 npm 与 cnpm 的源站 API 接口一样，通过它们不同 CLI 安装出来的路径也不一样，cnpm 的这种目录结构方式安装会比 npm 更快一些。

这就像两家不同的药厂做药，最终成分基本一致，但是它们提纯过程、员工、渠道、成本等都不一样。就如力平之和利必非，二者成分都是非诺贝特。一个是进口的，一个是国产的，价格 _（安装速度）_ 不一样，药的外观 _（目录结构）_ 不一样，非诺贝特含量不一样 _（软链接体积自然轻）_，提纯手段 _（安装源渠道）_ 不一样，但都是通过非诺贝特来降血脂 _（接口）_ 。

![07-并排图2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7ac8631d06d4ad7afc70745c33c7d26~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1554&h=634&s=555079&e=png&b=fefdfd)

> 好了，现在大家都知道我是个**死胖子**了。