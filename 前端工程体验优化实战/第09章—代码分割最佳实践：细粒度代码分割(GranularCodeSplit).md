代码分割是前端优化中最常用的手段之一，所有的前端优化文章都会介绍`vendors、common`之类的代码分割方案，但是这种陈旧的解决方案，健壮性不强，优化效果也不好。

所以我们不再赘述这种方案，而是一起学习一种近年新发明的代码分割最佳实践——**细粒度代码分割(Granular Code Split)**，解决代码分割长久以来的三大痛点。

首先我们先复习一下代码分割的基本原理。

## 1. 代码分割原理和配置

代码分割是利用现代前端打包构建工具的能力，将单个构建产物文件主动拆分为多个文件，从而提高缓存命中率、改善用户体验的优化。

以`Webpack@5`为例，代码分割的配置项主要有：

### 1. `chunks`

值类型：`String | function (chunks) => string`

功能：指定哪些类型的区块可以被纳入分割出的新区块。

> 注：区块（Chunk）是 Webpack 的概念，有三种产生途径：
>
> 1.  每个入口`entry`对应一个区块；
> 2.  动态加载（Dynamic Import），即`import('module-path')` 语法引入的模块，会生成独立的chunk；
> 3.  代码分割会产生新区块；
>
> 在打包产物中，每个区块通常会对应一个独立的文件。

`chunks`有4种值：

*   `'async'`：分割出的新区块只允许包含动态加载的区块。
*   `'initial'`：分割出的新区块只允许包含**非**动态加载的区块。
*   `'all'`：分割出的新区块可以包含动态加载和**非**动态加载的区块。
*   `函数`：配置一个函数，接收目标区块的数据作为参数，返回布尔值，表示目标区块能否被纳入分割出的新区块，例如：

``` js
module.exports = {
  optimization: {
    splitChunks: { 
      chunks(chunk) {
        // 分割出的新区块排除 name 为 `excluded-chunk` 的区块
        return chunk.name !== 'excluded-chunk';
      },
    },
  },
};
```
`chunks`配置示例：
``` js
module.exports = {
  optimization: {
    splitChunks: {
      // 分割出的新区块可以包含动态加载和非动态加载2种类型的区块。
      chunks: 'all',
     },
   },
 };
```
> 注：第6节《懒加载》中，我们介绍过，懒加载不生效的常见原因之一就是被`splitChunks.chunks`配置干扰。

### 2. `minSize`

> 值类型：`Number`

功能：指定分割所产生的新区块的最小体积，单位为字节（byte），小于`minSize`字节的新区块，将不会被创建，也就不会产生对应的打包产物文件。

`minSize`和 `maxSize`衡量的都是组成区块的**未压缩前的源码体积**，不一定等于构建产物文件的体积。

未压缩前的源码体积可以参考`webpack-bundle-analyzer-plugin`中的`Stat`体积，打包产物文件的体积则是`Parsed`体积。

配置示例：
``` js
module.exports = {
  optimization: {
    splitChunks: {
       // 如果新区块未压缩前源码体积小于 100 KB，
       // 将不会被创建，也就不会产生独立的构建产物文件。
       minSize: 1024 * 1024 * 0.1, // 100 KB
     },
   },
 };
```
### 3. `maxSize`

> 值类型：`Number`

功能：指定新区块的最大体积，单位为字节（byte），大于`maxSize`字节的新区块，将被拆分为多个更小的新区块。

配置示例：
``` js
module.exports = {
  optimization: {
    splitChunks: {
       // 如果新区块未压缩前源码体积大于 1 MB，
       // 新区块将会被拆分为多个体积较小的区块，
       // 相应的产生多个构建产物文件。
       maxSize: 1024 * 1024 * 1, // 1 MB
     },
   },
 };
```
### 4. `minChunks`

> 值类型：`Number`

功能：指定模块最少被多少个区块共同引用，才能被纳入分割出的新区块。

例如如下3个文件及其代码：
``` js
// common-module.js
export n = 1

// a.js
import { n } from 'common-module.js'

// b.js
import { n } from 'common-module.js'
```
上述代码中，`common-module.js` 被`a.js`和`b.js`2个区块同时引入，当我们在 Webpack 配置中指定`splitChunk.minChunks`值：

*   为 2 时，`common-module.js`就会被纳入分割出的新区块。
*   为 3 时，`common-module.js`就**不会**被纳入分割出的新区块，因为`common-module.js`不满足我们指定的 **“模块最少被3个区块共同引用”** 的配置规则。

配置示例：
``` js
    module.exports = {
      optimization: {
        splitChunks: {
          minChunks: 2, 
         },
       },
     };
```

### 5. `maxInitialRequests`

> 值类型：`Number`

功能：指定最多可以拆分为多少个**同步**加载的新区块，常用于和`maxAsyncRequests`配合，控制代码分割产生的最大文件数量。

配置示例：
``` js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      maxInitialRequests: 20,
     },
   },
 };
```
### 6. `maxAsyncRequests`

> 值类型：`Number`

功能：指定最多可以分割出多少个**异步**加载（即动态加载`import()`）的新区块，常用于和`maxInitialRequests`配合控制代码分割产生的最大文件数量。

配置示例：
``` js
module.exports = {
  optimization: {
    splitChunks: {
      maxAsyncRequests: 10,
     },
   },
 };
```

### 7. `name`

> 值类型：`String | Boolean | function (module, chunks, cacheGroupKey) => string`

功能：指定分割出的区块名，区块名是Webpack运行时内部用来区分不同区块的id。

区块名不一定等于打包产物的文件名，当没有指定`cacheGroup.filename`时，区块名才会被用作产物文件名。

推荐使用下文介绍的`cacheGroup.filename`指定文件名，因为功能更强大。

另外，对多个新区块或多个`cacheGroup[i]`配置**相同**的`name`，会使这些区块被合并，最终会被打包进同一产物文件中。

相反地，对多个区块配置**不同**的`name`，会使这些区块各自独立，最终多个独立的产物文件。

配置示例：
``` js
module.exports = {
  optimization: {
    splitChunks: {
      name(module, chunks, cacheGroupKey) {
        const moduleFileName = module
              .identifier()
              .split('/')
              .reduceRight((item) => item);
        const allChunksNames = 
          chunks.map((item) => item.name).join('~');
        return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`
        }
     },
   },
 };
```
### 8. `cacheGroups`

> 值类型：`Object`

功能：指定有独立配置的区块，既可以继承上述`splitChunks`的配置，也可以指定专属当前区块的独立配置。下文中会进一步详细介绍。

可以理解为继承自`splitChunks`的**子类**，一方面继承了父类`splitChunks`分割区块的能力和配置属性，另一方面也有自己的私有属性。

配置示例：
``` js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 指定一个独立的 vendor 区块分组，
        // 包含独立的内容（test）
        // 有指定的名称（name）
        // 可以包含动态加载和非动态加载的区块（chunks: 'all'）
        vendor: {
          test: /[\/]node_modules[\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
     },
   },
 };
```
> 注：不同属性的**优先级**有所不同，当多个属性冲突时，会按照优先级生效。
>
> 例如当同时设置`maxSize: 10000`导致新区块被拆分的数量大于`maxInitialRequest: 5`时，`maxSize`会使`maxInitialRequest`失效，使最终的初始化请求数量大于指定的5个。
>
> 属性的优先级是：`minSize` > `maxSize` > `maxInitialRequest/maxAsyncRequests`
>
> 上述`splitChunks`配置以Webpack\@5版本为例：<https://webpack.js.org/plugins/split-chunks-plugin/>

上述配置既可以声明在`optimization.splitChunks`，作用于**所有**`cacheGroup[name]`。也可以声明在某一个`cacheGroup[name]`中，单独作用于所在的`cacheGroup[name]`。

但是下面几项配置项则**只能**声明在`optimization.splitChunks.cacheGroup[i]`中：

### 9. `test`

指定当前缓存组`cacheGroup`区块包含模块的匹配规则。

> 值类型：`Regex | String | function (module, { chunkGraph,moduleGraph }) => boolean`

其值有3种类型：

*   正则表达式：用于对模块文件的**绝对路径**，调用`regExp.test(modulePath)`方法，判断当前缓存组区块是否包含目标模块文件。
*   函数：接收`(module, { chunkGraph, moduleGraph })`作为参数，返回布尔值表示当前缓存组区块是否包含目标模块文件。
*   字符串：用于对模块文件的**绝对路径**，调用`modulePath.startsWith(str)`方法，判断当前缓存组区块是否包含目标模块文件。

> 注：[Webpack SplitChunkPlugin cacheGroup\[name\].test 源码链接](https://github.com/webpack/webpack/blob/6a8b3044cbe308bed3a1270c08cca4152f983ad9/lib/optimize/SplitChunksPlugin.js#LL520C11-L520C11)
>
> 模块文件绝对路径示例：/Users/nn/Desktop/Programing/front-end-app/node_modules/axios/lib/helpers/combineURLs.js

配置示例：
``` js
splitChunks: {
  cacheGroups: {
    svgGroup: {
      test(module) {
        const path = require('path');
        return module.resource?.endsWith('.svg')
      },
    },
    vendors: {
      test: /[\/]node_modules[\/]/,
    },
    lodash: {
      test: 'lodash',
    },
}
```
### 10. `priority`

指定当前缓存组区块的优先级，当一个模块文件满足多个缓存组区块的匹配规则（`.test`属性）时，最终会将模块文件分割进`priority` 值更大的那个缓存组区块。

> 值类型：`Number`

配置示例：
``` js
splitChunks: {
  cacheGroups: {
    vendors: {
      test: /[\/]node_modules[\/]/,
      priority: 1,
    },
    vendorsVIP: {
      test: /[\/]node_modules[\/]/,
      // 因为 vendorsVIP 的 priority 为 2，
      // 大于 vendors 的 1，且两者匹配规则相同，
      // 所以打包产物文件将只有 vendorsVIP.js，
      // 不会有vendors.js
      priority: 2,
    },
}
```
### 11. `filename`

指定区块对应打包产物文件的文件名，支持：

*   使用`[contenthash]`等文件名替换符
*   指定文件类型，即文件的后缀名


> 值类型：`String | Boolean | function (pathData, assetInfo) => string`

> `splitChunks.name`功能相对较少，既不支持`[contenthash]`特殊替换符，也无法指定文件的后缀类型。
>
> 例如，指定`name: 'vendor.[chunkhash].ts',`，构建的产出文件会是 `vendor.[chunkhash].ts.js`。

配置示例：
``` js
splitChunks: {
  cacheGroups: {
      vendor: {
        test: /[\/]node_modules[\/]/,
        filename: 'vendor.[chunkhash].js',
        chunks: 'all',
      },
  },
}
```
### 12. `enforce`

> 值类型：`Boolean`

指定是否忽略`maxSize, minSize, maxAsyncRequests, maxInitialRequests`等配置项的限制，强制生成当前缓存组对应的区块。

例如，缓存组匹配规则匹配到代码的体积小于`minSize`，默认将不会产生对应区块。但如果对缓存组指定`enforce: true`，就会忽略`minSize`的限制，仍然分割出体积小于`minSize`的区块。

配置示例：
``` js
splitChunks: {
  cacheGroups: {
    minSize: 20000,
    vendors: {
      test: /[\/]node_modules[\/]/,
      enforce: true,
    },
}
```
13. **默认**`splitChunks`配置

此外，`Webpack`有一套**默认**的`splitChunks`配置如下：

> Webpack 源码：<https://github.com/webpack/webpack/blob/2dc8755dc40e24e3ba5760e96738b74990116711/lib/config/defaults.js#L1380>

``` js
    // ...
    const NODE_MODULES_REGEXP = /[\/]node_modules[\/]/i;

    if (splitChunks) {
        A(splitChunks, "defaultSizeTypes", () =>
                css ? ["javascript", "css", "unknown"] : ["javascript", "unknown"]
        );
        D(splitChunks, "hidePathInfo", production);
        D(splitChunks, "chunks", "async");
        D(splitChunks, "usedExports", optimization.usedExports === true);
        D(splitChunks, "minChunks", 1);
        F(splitChunks, "minSize", () => (production ? 20000 : 10000));
        F(splitChunks, "minRemainingSize", () => (development ? 0 : undefined));
        F(splitChunks, "enforceSizeThreshold", () => (production ? 50000 : 30000));
        F(splitChunks, "maxAsyncRequests", () => (production ? 30 : Infinity));
        F(splitChunks, "maxInitialRequests", () => (production ? 30 : Infinity));
        D(splitChunks, "automaticNameDelimiter", "-");
        const cacheGroups =
                /** @type {NonNullable<OptimizationSplitChunksOptions["cacheGroups"]>} */
                (splitChunks.cacheGroups);
        F(cacheGroups, "default", () => ({
                idHint: "",
                reuseExistingChunk: true,
                minChunks: 2,
                priority: -20
        }));
        F(cacheGroups, "defaultVendors", () => ({
                idHint: "vendors",
                reuseExistingChunk: true,
                test: NODE_MODULES_REGEXP,
                priority: -10
        }));
    }
```
这套默认配置有几点值得关注：

*   区分了`production`和`development`环境，有不同的配置；

*   指定了`minSize`为，在`production`环境为20KB，在`development`环境为10KB，小于这一体积的模块，将不会被分割为新区块，也就不会产生独立构建产物文件。

*   自带2个缓存组：

    *   `default`包含所有共同引用大于2个区块的模块：`minChunks: 2`
    *   `defaultVendors`包含所有来自`/node_modules/`目录的模块：`test: NODE_MODULES_REGEXP`,

有时我们的自定义配置不生效，往往就是因为和这套默认配置有所冲突，需要通过覆盖默认配置，避免冲突。

下面的代码示例，演示的就是关闭默认缓存组的配置方式：
```  js
splitChunks: {
  cacheGroups: {
    default: false,
    defaultVendors: false,
  },
},
```

## 2. 痛点

Webpack的代码分割功能非常灵活，但也导致我们在使用时会遇到许多痛点，主要有：

*   **配置复杂，开发体验不佳**：各类繁杂的配置项令开发者困惑，难以确定拆分目标模块；
*   **配置方案健壮性不强，可维护性不好**：拆分配置方案无法适应项目的快速迭代变化，需要经常调整；
*   **用户体验不好**：拆分效果不好，拆分出的模块每次打包上线都会变化，不便于配合**增量构建**进行缓存，没有实现最优缓存效果，甚至使用户体验恶化；

那么如何解决这些痛点？代码分割的最佳实践是什么？

## 3. 最佳实践：细粒度代码分割

**细粒度代码分割（Granular Code Split）** 是近年来发明的代码分割通用解决方案，其经过 Next.js, Gastby 等前端SSR框架多年的实践验证，能有效解决上述痛点，显著改善开发体验和用户体验。

其核心思路是通过拆分出更多的区块、更多产物文件，让每个产物文件拥有自己的哈希版本号文件名，对产物文件的缓存有效性做**细粒度**的控制，让前端项目在多次打包上线后，仍然能复用之前的产物文件，不必重新下载静态资源。

> - Next.js 实现MR：https://github.com/vercel/next.js/pull/7696
>
> - Gastby 实现MR：https://github.com/gatsbyjs/gatsby/pull/22253 

### 1. 核心配置

细粒度代码分割的核心Webpack配置如下：
``` js
// webpack.production.config.js
const crypto = require('crypto');

const MAX_REQUEST_NUM = 20;
// 指定一个 module 可以被拆分为独立 区块（chunk） 的最小源码体积（单位：byte）
const MIN_LIB_CHUNK_SIZE = 10 * 1000;

const isModuleCSS = (module) => {
  // ...
};

module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: {
      maxInitialRequests: MAX_REQUEST_NUM,
      maxAsyncRequests: MAX_REQUEST_NUM,
      minSize: MIN_LIB_CHUNK_SIZE,
      cacheGroups: {
        defaultVendors: false,
        default: false,
        lib: {
          chunks: 'all',
          test(module) {
            return (
              module.size() > MIN_LIB_CHUNK_SIZE &&
              /node_modules[/\]/.test(module.identifier())
            );
          },
          name(module) {
            const hash = crypto.createHash('sha1');
            // ...
            return `lib.${hash.digest('hex').substring(0, 8)}`;
          },
          priority: 3,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        shared: {
          chunks: 'all',
          name(module, chunks) {
            return `shared.${crypto
              .createHash('sha1')
              .update(
                chunks.reduce((acc, chunk) => {
                  return acc + chunk.name;
                }, ''),
              )
              .digest('hex')
              .substring(0, 8)}${isModuleCSS(module) ? '.CSS' : ''}`;
          },
          priority: 1,
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  },
  // ...
};
```
这份代码分割配置分割出了2类区块：

*   `lib`：主要匹配规则为`test(module)`，指定`lib`缓存组包含来自`node_modules`目录，源码体积大于`MIN_LIB_CHUNK_SIZE`的模块。

`lib`缓存组用于把**体积较大**的NPM包模块，拆分为独立区块，产生独立产物文件，从而在多次打包发版、更新哈希版本号文件名的同时，避免让用户再次下载这些大体积模块，提高缓存命中率，减少资源下载体积，改善用户体验。

*   `shared`: 主要匹配规则为`minChunks: 2`，指定`shared`缓存组包含被2个及以上区块共用的模块代码。

例如`module-a`在前端页面A和页面B都有引用，`module-a`就会被拆分为一个名为`shared.[hash]`的区块，最终生成一个独立的JS文件，并保持独立的哈希版本号文件名，以便于在页面A和页面B之间复用，既能减少2个页面的JS体积，又能提高多次打包发版后的缓存命中率。

> 注：Next和Gatsby都有额外的`framework`缓存组，但笔者实测，大多数情况下`lib`缓存组可以替代`framework`，发挥相同的分割作用。
>
> 故上述示例并不包含`framework`缓存组，不过欢迎各位微调配置，尝试增加其他缓存组，追求更极致的代码分割优化效果。

### 2. 优点

配合在文件名中用哈希字符串控制版本的长期缓存，细粒度代码分割有显著的优点：

*   **开发体验好**：配置统一通用，自动选择拆分目标模块，不必人工判断哪些模块需要拆分，降低了代码分割的使用门槛；

*   **健壮性强**：以不变应万变，用这套不变的代码分割配置可以应对不断更新迭代的各类型前端项目，不必经常更新配置，便于维护；

*   **用户体验好**：分割颗粒度较细，产物文件稳定，多次构建部署后，仍有较多文件名称内容不变，缓存命中率高，缓存效果好，有利于改善用户体验。

我们通过一个例子，来具体的理解：

代码改动         | 版本 \ 方案  | 传统粗粒度代码分割`vendors`&& `common` <br/>前端应用加载产物文件：<br/> | 细粒度代码分割`lib`&& `shared`：<br/>前端应用加载产物文件： <br/> | 差异 |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 无            | 第1次打包后，： | 1. bundle.1.js <br/>2.  vendors.1.js（包含`axios`库）<br/>3.  common.1.js（包含`lodash`库）<br/> | 1. bundle.1.js <br/>2.  vendors.1.js <br/>3.  common.1.js <br/>4.  lib.1.js（包含`axios`库）<br/>5.  shared.1.js（包含`lodash`库）<br/> | 优化后，细粒度代码分割会把`axios`库和`lodash`库，拆分为独立的产物文件。 |
| 更新`lodash`版本 | 第2次打包后：  | 1.  bundle.1.js <br/>2.  vendors.1.js（包含`axios`库）<br/>3.  因为包含`lodash`库，文件名中的哈希版本号更新为：common.**2**.js，用户需要**重新下载**体积达**100KB**的文件。 | 1. bundle.1.js <br/>3.  vendors.1.js <br/>3.  common.1.js <br/>4.  lib.1.js（包含`axios`库）<br/>5.  shared.**2**.js（包含`lodash`库）<br/> <br/>重新下载文件体积：**10KB**        | 优化前，用户需要下载**100KB体积巨大**的`common.2.js`。<br/>优化后，用户只需要下载**15KB体积较小**的`shared.2.js`一个文件。<br/>**优化后，其他静态资源文件都可以复用上一版本的缓存，加载资源更少，用户体验更好。** |
| 更新`axios`版本  | 第3次打包后：  | 1.  bundle.1.js <br/>2.  因为包含`axios`库，文件名中的哈希版本号更新为：vendors.**2**.js，用户需要**重新下载**体积达**500KB**的文件。<br/>3.  common.**2**.js        | 1.  bundle.1.js<br/>2.  vendors.1.js<br/>3.  common.1.js<br/>4.  lib.**2**.js（包含`axios`库）<br/>5.  shared.2.js（包含`lodash`库）<br/> <br/>重新下载文件体积：**20KB** | 优化前，用户需要下载**500KB体积巨大**的`vendors.2.js`。<br/>优化后，用户只需要下载**20KB体积较小**的`lib.2.js`一个文件。



下一节，我们将一起学习实现细粒度代码分割的代码改造示例。