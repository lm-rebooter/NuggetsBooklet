保证代码的稳定性和可靠性，是软件工程的一个重要目标。其中，软件测试的作用毫无疑问，是非常大的。

软件测试又分为单元测试、集成测试和功能测试，这三者分别对应软件开发的不同阶段。其中，集成测试和功能测试往往由专门的质量部门（QA）工程师来负责，而单元测试则属于模块开发者需要关注的范畴。这一节课，我们就来谈谈单元测试。

所谓单元测试，就是对系统模块的每个功能单元进行的测试，一般针对的是函数、类或单个组件，不涉及系统和集成。

单元测试的好处很明显，完善的单元测试用例能够极大地保证系统模块的稳定和可靠。尤其当我们对系统模块进行升级或重构的时候，运行单元测试能够确保我们的修改不会对原有的功能造成影响，产生预料不到的 Bug。一般来说，一个比较优质的模块都会有配套的单元测试用例。

## 为 Babel 插件项目添加单元测试

还记得前面的章节中，我们实现过一个 Babel 插件，用来支持向量和矩阵的运算。这个插件的完整代码我放在了 [GitHub 仓库](https://github.com/akira-cn/babel-plugin-transform-gl-matrix) 中，你可以直接 clone 下来。

接下来，我要讲一讲如何给这个插件添加单元测试。

## 选择并安装单元测试框架

可以选择的 JavaScript 单元测试框架非常多，比较有名的有 Mocha、Jasmine、AVA、Jest 等等。在这里，选择 [Jest](https://jestjs.io/) 作为我们的单元测试框架。

Jest 框架的特点有：

-   由 Facebook 开发和维护
-   开箱即用配置少，API 简单
-   支持断言（Assertion）和仿真（Mock）
-   支持快照（Snap）测试
-   基于 Istanbul 的测试覆盖度报告
-   智能并行测试，执行速度快

Jest 安装非常简单，几乎不用安装其他的依赖，只需要安装 jest 一个模块。

```
npm install --save-dev jest
```

然后，我们在 package.json 中的 scripts 字段进行相应的配置:

```
{
  ...
  "scripts": {
    ... 省略 ...
    "test": "jest",
  },
}
```

如上配置所示，我们将 test 命令设置为 "jest"。jest 默认执行的是项目目录下所有 `*.test.js` 文件。然后，在 test 目录下，创建`index.test.js`文件，暂时让它的内容为空，运行`npm test`。

这时候，命令行终端将输出了一些错误信息：

```
 FAIL  test/index.test.js
  ● Test suite failed to run
​
    [BABEL]: You appear to be using a native ECMAScript module plugin, which is only supported when running Babel asynchronously. (While processing: /.../babel-plugin-transform-gl-matrix/src/index.js)
```

报错是因为，我们的模块采用了 ESModule 的方式导出，而 Jest 默认是采用 CommonJS 的方式导入的。

那在这里，我们可以使用最新的 Jest 原生支持 ESM 的特性，不过需要安装`cross-env`：

```
npm install --save-dev cross-env
```

安装之后，我们修改 package.json 中的 scripts 字段：

```
{
  ...
  "scripts": {
    ... 省略 ...
    "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest",
  },
}
```

这样，我们再次运行`npm test`，就可以看到以下输出：

```
 FAIL  src/vector2d.test.js
  ● Test suite failed to run
​
    Your test suite must contain at least one test.
​
      at onResult (node_modules/@jest/core/build/TestScheduler.js:173:18)
​
Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.696 s
Ran all test suites.
```

因为这时候我们的`vector2d.test.js`文件为空文件，并没有添加任何的测试用例，所以报了上面这个错。

现在我们可以添加测试用例：

```
import {
  vec2,
  vec3,
  mat2,
  mat2d,
  mat3,
  mat4,
  quat,
  quat2,
  glMatrix,
} from 'gl-matrix';
​
glMatrix.setMatrixArrayType(Array);
​
test('mat2d expand', () => {
  const arr = [1, 2, 3, 4, 5, 6];
  const m1 = mat2d(...arr);
  const m2 = mat2d.fromValues(...arr);
  expect(m1).toEqual(m2);
});
```

这时候，如果我们运行上面这段测试用例，ESLint 就会报告错误。因为 test 和 expect 未定义，所以我们需要修改一下配置文件`.eslintrc.js`，添加 env 配置项`jest: true`，这样 eslint 就可以识别 jest 框架定义的方法了。

Jest 框架以 test 方法定义测试用例，它的第一个参数是用例名，第二个参数是一个回调函数，表示一个测试用例。框架会自动执行这个测试用例中的代码。Jest 支语义化的断言，可以用非常语义化的方式书写测试规则，比如上面代码中的`expect(m1).toBe(m2)` ，它的含义是期望 m1 等于 m2。这里 Jest 会深度比较两个对象的每个属性，所以相当于 deepEquals。关于 Jest 支持的各种断言，可以查看[官方文档](https://jestjs.io/docs/en/expec)。

有了测试用例，我们可以执行`npm test`，测试用例运行通过，控制台上的输出结果如下：

```
> jest
​
 PASS  test/index.test.js
  ✓ mat2d expand (2 ms)
​
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.795 s, estimated 6 s
Ran all test suites.
```

## 异步测试

Jest 框架中，test 的回调函数不仅可以支持普通函数，也可以支持异步函数。所以，如果要测试异步方法，可以如下面代码这么用（async/await），非常方便。

```
test('some case', async () => {
  const result = await foo.bar();
  expect(result).toBe('something');
});
```

另外，如果异步函数不是 Promise 规范的，而是回调函数，Jest 也能支持，比如：

```
test('fetch data', (done) => {
  function callback(data) {
    expect(data).toBe('something');
    done()
  }
  fetchData(url, callback);
});
```

上面的代码，我们给 test 的回调函数指定参数 done，那么只有当 done 被调用时，测试用例才会运行结束。

## 测试覆盖率

除了运行测试用例，Jest 内置了测试覆盖率检查。所谓测试覆盖率，是指所有的测试用例执行后，究竟覆盖了多少代码。

例如，假设模块`foo.js`有一个函数如下：

```
function foo(a, b) {
  if(a > 0 && b > 0) {
    return 10;
  } else if(b > 0) {
    return 0;
  } else {
    return -10;
  }
}
```

`foo.test.js`单元测试用例如下：

```
test('foo', () => {
  expect(foo(1, 2)).toBe(10);
  expect(foo(-1, -2)).toBe(-10);
});
```

那么单元测试代码覆盖到了`if(a > 0 && b > 0)`的这个逻辑分支，以及最后的`else`这个逻辑分支，但是没有覆盖到`if(b > 0)`这个逻辑分支。单元测试代码覆盖检查，会把未能覆盖到的代码逻辑给检测出来。

测试覆盖度是评判一个库代码可靠性和质量的一个重要衡量标准，一般来说，测试覆盖度越高，库的可靠性和质量越高。

要用 Jest 检查测试覆盖率也非常简单，我们只需在`package.json`文件中添加一个脚本命令`test:coverage`：

```
{
  ...
  "scripts": {
    ...省略...

    "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest",
    "test:coverage": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --coverage",
  },
}
```

那么我们运行`npm run test:coverage`，就能运行单元测试并报告测试覆盖率结果了，最终命令行终端输出如下：

```
> jest --coverage

 PASS  test/foo.test.js
 PASS  test/index.test.js
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |      80 |    83.33 |     100 |      80 |                   
 foo.js   |      80 |    83.33 |     100 |      80 | 5                 
----------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        0.903 s, estimated 1 s
Ran all test suites.
```

这个结果中显示，目前的代码覆盖率是 80%，没有覆盖到的代码是`foo.js`第 5 行，我们看一下`foo.js`文件，第 5 行对应的代码是：

```
  else if(b > 0) {
    return 0;
  }
```

那么我们在`foo.test.js`再添加一个断言：

```
import foo from './foo.js'

test('foo', () => {
  expect(foo(1, 2)).toBe(10);
  expect(foo(-1, -2)).toBe(-10);
  expect(foo(-1, 2)).toBe(0);
});
```

然后重新运行`npm run test:coverage`，这次的结果如下：

```
> jest --coverage

 PASS  test/foo.test.js
 PASS  test/index.test.js
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
 foo.js   |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        0.818 s, estimated 1 s
Ran all test suites.
```

这样，我们的单元测试覆盖度达到了完全的 100%。

**注意**，因为我们对`index.test.js`测试的是 Babel 插件转换的`gl-matrix` API，而这个是通过第三方库方式载入的，所以这部分代码是不会被测试覆盖率检查的。如果要保证 case 覆盖`gl-matrix`库的所有 API，我们可以将`gl-matrix`拉取到项目本地进行测试，而不是直接通过 NPM 安装。

## 测试驱动开发（TDD）

在软件工程领域，有一种开发模式叫做测试驱动开发，英文全称 Test-Driven Development，简称 TDD。

TDD 的开发流程是，先编写测试用例代码，然后再编写实际的逻辑代码，也就是说，我们在开发插件的时候，可以先写`index.test.js`，完善其中的测试用例，然后再实现插件逻辑，最终让所有的测试用例都成功通过。

如果我们使用测试驱动开发，会让我们的库更加稳定可靠，我们所有的代码都有对应的测试用例，尽可能达成测试覆盖度 100%，这是一种值得去实践的良好的开发模式，而且特别适合于开发通用的 JS 库和基础模块。

在本课程中，由于篇幅所限，就不详细展开介绍测试驱动开发了，但是有兴趣的同学，可以在项目中实践。关于前端测试和 TDD，我们以后会在前端测试的专门课程中再深入介绍。

## 小结

Jest 是一种 JavaScript 单元测试框架。它的安装和使用非常简单：

1.  安装 jest 包： `npm install --save-dev jest`
2.  如果要支持 ESM，还要安装 cross-env 包： `npm install --save-dev cross-env`
3.  在 package.json 文件中配置 Jest 脚本命令：

```
"scripts": {
  "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest",
  "test:coverage": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --coverage",
}
```

4.  运行测试命令行：npm test，默认执行项目目录下所有 *.test.js 文件
5.  运行 npm run test:coverage 命令可以查看该项目的测试覆盖率