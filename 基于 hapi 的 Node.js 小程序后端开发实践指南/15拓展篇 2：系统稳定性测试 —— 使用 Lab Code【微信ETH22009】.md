# 拓展篇 2：系统稳定性测试 —— 使用 Lab & Code

测试框架，是运行测试的工具。通过它，可以为 JavaScript 应用添加测试，从而保证代码的质量。现行的 Javascript 常用流行测试库有 Jasmine，Mocha， Karma 等，虽然框架的名称不同，但背后的核心套件却大同小异。

以常见的 JavaScript 单元测试框架 Mocha 为例。我们要为一个求和模块 `sum` 方法来做一个简单的单元测试：

```js
// sum.js

module.exports = (x, y) => x + y

// sum.test.js

const sum = require('./sum.js');
const expect = require('chai').expect;

// 测试套件(test suite) -- describe
describe('求和模块的测试', () => {
  // 测试用例(test case) -- it
  it('1 加 2 应该等于 3', () => {
    // 测试断言(test expect) -- expect
    expect(sum(1, 2)).to.be.equal(3);
  });
});
```

由案例中的注视标记可以大致了解到单元测试的三个关键术语：

- **describe**：测试套件
- **it**：测试用例  
- **expect**：测试断言

一个完整的测试，可以由多个 describe 组成；
每个 describe 里可以包含多个 describe 或者多个 it ；
每个 it 里可以包涵多个 expect，来最终描述每个测试用例，得到最终的程序执行结果校验。

其他还有一些高级的属性，诸如 before / after / beforeEach / afterEach 等测试用例生命周期的钩子，以及其他特性，我们可以后续再系统学习。

## Lab & Code

Lab & Code 是 hapi 的配套测试框架。

### Lab

Lab 库支持 async/await，尽可能保持测试引擎的足够简单，并包含了我们希望从现代 Node.js 测试框架程序中需要的所有特性。提供了 describe 和 it，以及生命周期的钩子等功能。

Lab 仅使用 async/await 功能，并包含了你希望从现代 Node.js测试框架程序中需要的所有特性。

### Code

Code 库用于提供 expect 断言的相关函数库，code-expect 与 mocha-expect 用法上几乎完全一致。

### 使用 Lab & Code 测试求和模块

```js
// sum.js

module.exports = (x, y) => x + y

// sum.test.js
var const = require('./sum.js');
// requires for testing
const Code        = require('code');
const Lab         = require('lab');
const lab         = Lab.script();

// 测试框架方法提取
const describe    = lab.describe;
const it          = lab.it;
const expect      = Code.expect;

// 测试套件(test suite) -- describe
describe('求和模块的测试', () => {
  // 测试用例(test case) -- it
  it('1 加 2 应该等于 3', () => {
    // 测试断言(test expect) -- expect
    expect(sum(1, 2)).to.equal(3);
  });
});
```

执行单元测试命令 `node node_modules/lab/bin/lab -v`。 `-v` 的参数打印测试明细，在只想关注错误的测试用例结果时，可以不带上此参数，保持控制台信息输出的简洁性。

```bash
  # 执行结果
  求和模块的测试
    ✓ 1 加 2 应该等于 3

  1 tests complete
  Test duration: 236 ms
  No global variable leaks detected
```

## 在 hapi 中测试 API 接口

以测试用户登录为例，我们希望测试接口的异步调用是否返回 200 的状态编码，并且返回的 response 的 result 中，签发的 JWT payload 中的信息如 userid、openid 符合预期。

hapi 的测试用例中，直接使用 app.inject，即服务器 server 自身的 API，来实现指定接口的调用。代码如下：

```js
// users.test.js

const app = require('../app.js')

// appJWT 用于暂存已登录的用户jwt，供后续需要 jwt 登录认证的测试套件使用
let appJWT = ''
describe("POST: /user/login-jwt-test", () => {  
  it("状态码200并且返回了正确的jwt", async() => {
    const response = await app.inject({
      method: 'POST',
      url: '/users/login-jwt-test'
    })
    expect(response.statusCode).to.equal(200)
    const JWT = require('jsonwebtoken')
    appJWT = response.result
    const jwtPayload = JWT.decode(response.result)
    expect(jwtPayload.userId).to.equal(1)
    expect(jwtPayload.openId).to.equal(1)
  })
})

// 获取店铺列表需要用到 authorization 的 jwt 验证，语法实现如下
describe("GET /shops", () => {
  it("状态码200", async() => {
    const response = await app.inject({
      method: 'GET',
      url: '/shops',
      headers: {
        authorization: appJWT
      }
    })
    expect(response.statusCode).to.equal(200)  
  })
})
```

hapi 的单元测试框架还会在执行基础测试后，贴心地检测系统中是否存在有全局变量，例如下述的全局变量声明：

```js
foo = 'bar';
hello = 'hapi';
```

在运行完测试后，会红字提示： *The following leaks were detected:foo，hello*，引起开发者的重视。

而 *No global variable leaks detected* 的结果，则表示系统中不存在任何的全局变量，较好地确保了变量作用域的安全可靠性。

## 常用的断言表达式

```js
// 相等或不相等 equal()
expect(1 + 2).to.be.equal(3);
expect(1 + 2).to.be.not.equal(4);
expect(hello).to.be.deep.equal({ hapi: 'hapi' });

// 布尔值检测 boolean
expect(true).to.be.true();
expect(false).to.not.be.false();

// 数据类型检测 type
expect('hapi').to.be.a.string();
expect({ hello: 'hapi' }).to.be.an.object();
expect(hello).to.be.an.instanceof(Hello);

// 包含检测 include
expect([1,2,3]).to.include(2);
expect('hello hapi').to.contain('hapi');
expect({ hello: 'hapi' }).to.include.keys('hello');

// 判空检测 empty()
expect('').to.be.empty();
expect([]).to.be.empty();
expect({}).to.be.empty();

// 正则匹配 match()
expect('foobar').to.match(/^foo/);

// 断言条件与 and
expect('hello hapi').to.be.a.string().and.contain('hapi');
```

> [断言表达式详细手册](https://github.com/hapijs/code/blob/master/API.md)。

## coverage

coverage 用于量化代码的被测试的比例与程度。被测试的代码数量处以总代码量所得的比例即为覆盖率值。

开启测试覆盖率，可以帮助我们快速定位测试用例所未涵盖的代码区域，决定是否追加测试用例，并且高覆盖率的测试用例，能在一定程度上确保我们的系统基础可执行性。

执行 `node node_modules/lab/bin/lab -v -c`，追加的 `-c` 可以额外统计测试用例的覆盖率。覆盖率的测试结果会以比例与未覆盖明细的方式输出显示。

```bash
Coverage: 92.26% (57/736)
models/index.js missing coverage on line(s): 35, 41, 49, 50
routes/hello-hapi.js missing coverage on line(s): 8, 9
```

当然，实际的项目实践中，业务型系统做得越深，代码覆盖率 100% 的实现成本也会越来越高。能效与稳定性之间的平衡点会存在一个分寸的问题，盲目追求 100% 是极度不可取的。我们有几种手法可以帮助优化 coverage 的质量。

1）使用 threshold

针对 coverage，可以设定一个 `-t (--threshold)` 的参数，来设定一个域值。比如 `-t 80` 表征覆盖率高于 80% 即满足要求，用来粗颗粒度降低覆盖标准。笔者以为，这样的域值调整意义不大，更多的是一种心理暗示。

2） 使用 `--coverage-exclude` / `--coverage-path`

`--coverage-exclude` 与 `--coverage-exclude` 可以帮助我们直接排除或指定一些目录或是单个文件，来更加明确覆盖率所要覆盖的目标，但精度仅限于文件。一些快速迭代的局部业务级代码，或是非核心主干的代码，可以采用这种方式。

3） 使用 `/* $lab:coverage:(off|on)$ */`

使用 `/* $lab:coverage:(off|on)$ */` 可以帮助我们在最终单个文件中的任意代码部分，增加一个特殊约定的表达式，来标记不需要测试覆盖的局部代码，从而提升测试的有效覆盖率。例如：

```js
/* $lab:coverage:off$ */
if (typeof value === 'symbol') {
    // do something with value
}
/* $lab:coverage:on$ */
```

## 使用 .labrc.js 来进行配置

.labrc.js 是 Lab 的直观配置文件，我们把 .labrc.js 放在当前工程目录的根目录，后续执行 Lab 的指令，将自动从 .labrc.js 中提取相应的运行参数。下面是一个简单的例子等价于执行了 `lab -c -t 100`。

```js
module.exports = {
  coverage: true, //开启覆盖率测试
  threshold: 100,  //覆盖率搁值为 100%
};
```

> [Lab 说明手册](https://github.com/hapijs/lab)。

## 小结

关键词：单元测试，Lab，Code，coverage 覆盖率

本小节，我们介绍了如何使用 Lab & Code，解决测试用例过程中所需要解决的常见问题，从套件定义、用例声明，到最终的断言验证，并通过 coverage 量化测试用例的覆盖率。

基于 REST 接口的开发，一个相对好的习惯是先完成接口文档的书写。利用 hapi-swagger 和 Joi，可以高效地帮助我们完成接口文档化任务。接下来便是书写测试用例，将测试用例通过 BDD 或者 TDD 的方式，进行组合书写，最终得到一套文档完备、测试配套的良好接口。这是一个值得去持续实践优化与体会的好习惯。

**本小节参考代码汇总**

[断言表达式详细手册](https://github.com/hapijs/code/blob/master/API.md)

[Lab 说明手册](https://github.com/hapijs/lab)


