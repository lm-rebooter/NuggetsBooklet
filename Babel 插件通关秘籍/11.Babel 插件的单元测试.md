单元测试可以保证代码质量，我们写完代码实现了功能之后，要书写对应功能点的单测，这样有很多好处：

- 单测就是文档，可以根据单测了解插件的功能
- 代码改动跑一下单测就知道功能是否正常，快速回归测试，方便后续迭代

那 babel 插件应该怎样做单测？

## babel 插件单元测试的方式

babel 插件做的事情就是对 AST 做转换，那么我们很容易可以想到几种测试的方式：

- 测试转换后的 AST，是否符合预期
- 测试转换后生成的代码，是否符合预期（如果代码比较多，可以存成快照，进行快照对比）
- 转换后的代码执行一下，测试是否符合预期

分别对应的代码（使用 jest）：

#### AST测试

这种测试方法就是判断AST 修改的对不对

```javascript 
it('包含guang', () => {
  const {ast} = babel.transform(input, {plugins: [plugin]});
  
  const program = ast.program;
  const declaration = program.body[0].declarations[0];
  
  assert.equal(declaration.id.name, 'guang');// 判断 AST 节点的值
});
```
#### 生成代码的快照测试

这种测试方法是每次测试记录下快照，后面之前的对比下：

```javascript
it('works', () => {
  const {code} = babel.transform(input, {plugins: [plugin]});
  
  expect(code).toMatchSnapshot();
});
```
#### 执行测试

这种测试就是执行下转换后的代码，看执行是否正常：

```javascript
it('替换baz为foo', () => {
  var input = `
    var foo = 'guang';
    // 把baz重命名为foo
    var res = baz;
  `;
  
  var {code} = babel.transform(input, {plugins: [plugin]});
  
  var f = new Function(`
    ${code};
    return res;
  `);
  var res = f();
  
  assert(res === 'guang', 'res is guang');
});

```

这三种方式都可以，一般还是第二种方式用的比较多，babel 也是封装了这种方式，提供了 babel-plugin-tester 包。

## babel-plugin-tester

babel-plugin-tester 就是对比生成的代码的方式来实现的。

可以直接对比输入输出的字符串，也可以对比文件，还可以对比快照：

```javascript
import pluginTester from 'babel-plugin-tester';
import xxxPlugin from '../xxx-plugin';

pluginTester({
  plugin: xxxPlugin,
  fixtures: path.join(__dirname, '__fixtures__'), // 保存测试点的地方
  tests: {
    'case1:xxxxxx': '"hello";', // 输入输出都是同个字符串
    'case2:xxxxxx': { // 指定输入输出的字符串
      code: 'var hello = "hi";',
      output: 'var olleh = "hi";',
    },
    'case3:xxxxxx': { // 指定输入输出的文件，和真实输出对比
      fixture: 'changed.js',
      outputFixture: 'changed-output.js',
    },
    'case4:xxxxxx': { // 指定输入字符串，输出到快照文件中，对比测试
      code: `
        function sayHi(person) {
          return 'Hello ' + person + '!'
        }
      `,
      snapshot: true,
    },
  },
});
```

这三种方式本质上都一样，但是根据情况，如果比较少的内容可以直接对比字符串，内容比较多的时候可以使用快照测试，或者指定输出内容，然后对比测试。

## 总结

这一节我们了解了 babel 插件测试的几种思路，babel-plugin-tester 是利用对结果进行对比的思路，对比方式可以选择直接对比字符串、对比 fixture 文件的内容和实际输出内容、对比快照这 3 种方式。

学完这一节，我们可以给 babel 插件加上单元测试来保证质量了。
