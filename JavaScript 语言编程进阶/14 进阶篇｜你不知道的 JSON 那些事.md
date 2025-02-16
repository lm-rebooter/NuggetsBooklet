现在我们开启进阶篇的课程，这一部分我们主要掌握一些高级对象的使用，在涉及比较专业的场合中往往它们是不可代替的。本章节我们就从 JavaScript 中内置的最简单结构化数据 JSON 开始。

结构化数据是指按照特定格式和规则组织的数据，每个数据字段都有明确的定义和类型。结构化数据的特点是易于处理、存储和分析，因为数据的结构和关系已经明确。在 JavaScript 诞生的初期，常见的文本形式的结构化数据通常是 **XML**。

但是 XML 需要大量的“<>”标签来描述结构关系，因此体积浪费上比较严重，对于解析和网络传输上要明显逊色于 JSON。

JSON 全称叫做 `JavaScript Object Notation`，可见它一开始就与 JavaScript 脱不开关系。大神 **Douglas Crockford** 在 2002 年就发布了第一版 JSON 规范，但微软在 IE8 才开始内置对 JSON API 的支持，在此之前，都需要引用第三方库来实现。ECMAScript 规范引入 JSON 要到 ES5。

事实上，JSON 在 ECMA 是有独立规范的，那就是 `ECMA-404`。它只有十几页，里面定义了各种语法相关的符号，比如大括号、中括号、逗号、分号，都是有明确的 Unicode 值的。同时它也定义了 JSON 支持的 7 种取值，分别是 **object**、**array**、**number**、**string**、**true**、**false** 和 **null**。

<p align="center"><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e310aa3927ca47128e14b3eb49bff5b5~tplv-k3u1fbpfcp-watermark.image"></p>




## JSON 的解析

单单一个数字、一个双引号字符串、一个 true 或 false，以及一个 null 都是合法的 JSON 数据，并非只有大括号（{}）、中括号（\[]）包起来的结构才算。于是像下列解析都能够成功：

```js
JSON.parse("8")
JSON.parse(`"Hello"`)
JSON.parse("true")
JSON.parse("false")
JSON.parse("null")
```

但是需要注意，JSON 只支持十进制的数字，像 `JSON.parse("0x01")` 甚至 `JSON.parse("01")` 这样都是不可以被成功解析的。从这张图就可以看得出来 JSON 支持的数字格式：

<p align="center"><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18bf0e419cf3423ea4e45d633324459d~tplv-k3u1fbpfcp-watermark.image"></p>

同时，对于 JavaScript 中的特殊数字，比如 `Infinity`、`NaN`，JSON 都是不支持的，解析会报错。此外，`undefined` 也不属于 JSON 的合法类型。

以上是 `JSON.parse` 对于一些不常见数据格式的解析策略。如果你给它传入了一个非字符串类型的参数，那么会通过 `ToString()` 函数来转换。

应该有很多人不知道，`JSON.parse` 还支持第二个参数 `reviver`，用来精确控制解析后的值。举一个例子：

```js
JSON.parse(`{
    "name": "Mike",
    "education": {
        "college": "MIT",
        "major": "computer"
    },
    "experiences": [{
        "from": "2017-08-20",
        "to": "2018-03-05",
        "employer": "Google"
    },
    {
        "from": "2018-03-17",
        "to": "2020-07-28",
        "employer": "Microsoft"
    }]
}`, function(key, value) {
    console.log(this, key, value);
    return value;
})
```

`reviver` 内部有三个变量可以利用，分别是 `this`、`key` 和 `value`。

key 不用多说，自然是某一层级下某一字段的键，需要注意的是，最外层这个结构也被包含在了一个虚拟对象中：

```js
{
  '': {
    name: 'Mike',
    education: { college: 'MIT', major: 'computer' },
    experiences: [ [Object], [Object] ]
  }
}
```

并且 key 为空字符串。大家可以专门打印一下所有的 key，它们形成下面这种顺序：

```js
"name"
"college"
"major"
"education"
"from"
"to"
"employer"
"0"
"from"
"to"
"employer"
"1"
"experiences"
""
```

可见这是一个`深度优先遍历`的顺序，最后一个一定是空串。`this` 即指向当前这个 key 所在的对象结构，因此不要用箭头函数来声明 `reviver`，否则会篡改 this。

即便有 this 和 key，`reviver` 参数在实际使用中仍然面临着比较大的限制，因为 key 会重复，这时候你就只能用 this 来辨别当前 key-value 的位置，但是 this 作为一个数据结构，同样不方便用来定位。因此，建议在被解析的 JSON 数据有明确、简单的结构时，可以考虑使用 `reviver`。

> 你可以试试用 `reviver` 来生成 JSON 本来不支持的数据类型，比如 Symbol、BigInt。




## 序列化成 JSON

与解析相对应的就是序列化：`JSON.stringify`。大家应该可以理解被序列化的对象`不可以包含环形引用`，否则无法展开为树形平面的 JSON 格式，不信的话可以试试：

```js
JSON.stringify(document)
```

然后我们来瞧一瞧一些特殊格式的变量在被序列化后是什么：

```js
JSON.stringify(null)               // 'null'
JSON.stringify(undefined)          // undefined
JSON.stringify(true)               // 'true'
JSON.stringify(false)              // 'false'
JSON.stringify("abc")              // '"abc"'
JSON.stringify(123)                // '123'
JSON.stringify(Symbol("sym"))      // undefined
JSON.stringify([2, 3, 4])          // '[2,3,4]'
JSON.stringify(function foo(){})   // undefined
```

我们遍历这些不同类型数据的目的是想提醒大家，在向 `JSON.stringify` 传递参数的时候，要对类型有预期，要知道传错类型的后果是什么。大家已经看到了，这个函数并不是始终都返回一个字符串，还可能是 undefined，因此像下面这种代码，你应该可以猜到可能报什么错吧：

```js
function toJSON(variable) {
    return JSON.strinify(variable).trim(); // ⚠️
}
```

总结一下 `JSON.stringify` 只能正常处理 JSON 所支持的类型：字符串、数字、布尔、对象和 null。对象中的函数不被支持，会返回 undefined，而 undefined 又会被丢弃。即便是数字也有例外：

```js
JSON.stringify(Infinity) // 'null'
JSON.stringify(NaN) // 'null'
JSON.stringify(1n) // ❌ VM1315:1 Uncaught TypeError: Do not know how to serialize a BigInt
```

`Infinity` 和 `NaN` 都会序列化成 “null”，而 `BigInt` 压根就直接抛出异常了。

从这一点上来看，我们就知道这样一种对象深克隆（clone）办法：先序列化成 JSON 字符串，再 parse 成对象，会存在明显的**失真**问题。

```js
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

clone({ m: () => {}, s: Symbol('s') }) // {}
clone([1, Infinity, NaN]) // [1, null, null]
```

这样显然是不可取的，建议你还是老老实实地手动遍历属性去实现克隆。

即便目的不是克隆，序列化一个对象也是常见的操作，比如 POST 接口提交，就要把对象变成 JSON 文本，塞入到 body 中去。

一般来说，对于对象而言，`JSON.stringify` 会递归遍历自身的**可枚举的、以字符串为 key 的属性**。根据我们前面学习过的遍历对象的知识，这正好是 `Object.keys/values/entries` 的逻辑。于是，`JSON.stringify` 在普通对象上的遍历过程大致是：

```js
function stringify(obj) {
    for (const [key, value] of Object.entries(obj)) {
        if (isObject(value)) {
            stringify(value) // 递归
        }
    }
}
```

但是，重点来了，如果你的对象有一个叫做 **`toJSON`** 的函数，在自身也好，在原型链上也好，那么 `JSON.stringify` 就调用这个函数而不再去遍历对象属性。

当然 toJSON 的返回值并不会直接作为 `JSON.stringify` 的输出，更像是递归传入 `JSON.stringify`。我把 `JSON.stringify` 的关键逻辑画成下面的图：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f2a9f897d7c421b97251f28f86884be~tplv-k3u1fbpfcp-watermark.image?)

目前在 ECMAScript 内置的对象类型中，只有 **Date** 定义了 toJSON，它返回了等价于调用 **toISOString** 的字符串：

```js
JSON.stringify({now: new Date}) // {"now":"2023-07-10T13:11:15.960Z"}
```

本质上来说，`JSON.stringify` 就是一套映射函数，对于对象（包括数组）这种结构化数据进行递归调用。toJSON 就如同开了一个后门，能够更简单地让对象决定自己的 JSON 表述是什么样子的。

> 💡 ECMAScript 最早在 ES5 引入 JSON API 时，就支持了 `toJSON` 的功能，现在回想起来，那个时候还不支持 Symbol，否则的话，会不会更有可能预设一个 *Symbol.toJSON* 来实现同样的能力呢？

如果你的对象中有一些属性不想被序列化，那么可以考虑定义成不可枚举的，或者以 Symbol 而不是 String 为 key。如果这样不方便，我们也有办法，那就需要使用 `JSON.stringify` 的第二个参数 `replacer` 了。

`replacer` 可以是一个函数也可以是一个数组，TypeScript 是这样定义的：

```ts
stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): string;
```

当作为函数的时候，它和 `JSON.parse` 中的 `reviver` 有异曲同工之妙，只不过 `reviver` 先遍历到最底层的节点，而 `replacer` 先遍历最上层的节点。我们还是以前面的数据为例：

```js
JSON.stringify({
    "name": "Mike",
    "education": {
        "college": "MIT",
        "major": "computer"
    },
    "experiences": [{
        "from": "2017-08-20",
        "to": "2018-03-05",
        "employer": "Google"
    },
    {
        "from": "2018-03-17",
        "to": "2020-07-28",
        "employer": "Microsoft"
    }]
}, function(key, value) {
    console.log(key);
    return value;
})
```

console.log 的打印结果是：

```
""
"name"
"education"
"college"
"major"
"experiences"
"0"
"from"
"to"
"employer"
"1"
"from"
"to"
"employer"
```

`replacer` 函数的作用就是“篡改”序列化之后的数据，举个简单的例子：

```js
JSON.stringify({
    name: 'Tom'
}, function(key ,val) {
    if (key === 'name') return 'Mike';
    return val;
});
```

其结果就是 `{"name":"Mike"}`。当然了，和 `reviver` 一样，`replacer` 也有 key 冲突等问题，不再多说。

`replacer` 还可以是一个数组，不过这个时候它就只能发挥一个白名单的作用，并不能实现值的替换。

数组的成员只能是数字或者字符串。数字会被 `ToString` 转换成字符串，当数字作为一个对象的属性名时也会这样做。

`replacer` 也会认可 String 对象和 Number 对象，甚至它们的子类，比如：

```js
class MyString extends String {}

JSON.stringify({
    name: 'Tom',
    age: 15
}, [new MyString("name")]); // {"name": "Tom"}
```

根据遍历的顺序，我们知道，如果上层的 key 没有出现在 `replacer` 数组中，那么其 value 会被直接丢弃，即便里面有 key 在 `replacer` 中：

```js
JSON.stringify({
    name: 'Tom',
    education: {
        college: "MIT",
        major: "computer"
    }
}, ["name", "major"]); // {"name": "Tom"}
```

> 💡 如果要序列化的对象有不同层级、语义的同名 key，那么要更小心地使用 `replacer`。

另外，如果要序列化一个数组，那么数组形式的 `replacer` 是无效的：

```js
JSON.stringify(
    [1,2,3,4,5],
    [0,3] // ❌ 参数无效
) // "[1,2,3,4,5]"
```

到目前为止，`JSON.stringify` 输出的字符串还都是单行的，为了更好地阅读，我们习惯于使用它的第三个参数 `space`。

`space` 可以是数字也可以是字符串（包括它们的对象形式），语义上代表缩进的字符或者空白的个数。如果是数字，比如 N，那么格式化后的 JSON 字符串每层级就会缩进 N 个空格（0x20）：

```js
JSON.stringify(
    {
        name: "Mike",
        education: {
            college: "MIT",
            major: "computer",
        },
    },
    null,
    8
);
```

8 空格缩进：

```js
{
        "name": "Mike",
        "education": {
                "college": "MIT",
                "major": "computer"
        }
}
```

如果我们想缩进 Tab（0x9） 而不是空格，那么就需要把 `space` 设置成字符串：

```js
JSON.stringify(
    {
        name: "Mike",
        education: {
            college: "MIT",
            major: "computer",
        },
    },
    null,
    '\u0009' // Tab
);
```

需要注意的是，缩进字符不能超过 10 个，`space` 如果是数字，超过 10 会被当作 10；如果是字符串，超过 10 的码元会被截断，比如：

```js
JSON.stringify({ name: 'Mike' },null, new Array(12).fill('/').join('')) // 12
```

得到的是：

```
{
//////////"name": "Mike"
}
```

你可以数一数，缩进只有 10 个 “/”，而不是传入的 12。

> 💡 注意多码元字符可能会被在中间截断，造成字符破坏。

以上就是 JSON 的解析和序列化的细节知识，掌握它们能够增强你所写代码的健壮性和简洁性。在实际开发中，还有一些涉及到 JSON 的场景。





## JSON 的常见场景

JSON 的文本特征，最适合用来做网络传输。在 fetch 之前，我们使用 `XMLHttpRequest` 也可以直接解析 JSON 格式的响应内容：

```js
const xhr = new XMLHttpRequest();

xhr.responseType = 'json';
```

这样最后 **xhr.response** 就直接是 JSON 对象。如果服务端可以返回多种格式，但是期望它返回 JSON，那么就需要主动设置 HTTP 的 **Accept** 请求头：

```js
xhr.setRequestHeader('Accept', 'application/json');
```

如果发送出去的数据也是 JSON，那么：

```js
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.open('POST', '/submit');

xhr.send(JSON.stringify({ name: 'Mike' }));
```

这样发送出去的 HTTP 请求大概就是：

```http
POST /submit HTTP/1.1
Accept: application/json
ContentType: application/json

{"name":"Mike"}
```

以上等价的 `fetch` 写法就是：

```js
fetch("/submit", {
    headers: {
        accept: "application/json",
        "content-type": "application/json",
    },
    body: JSON.stringify{name: "Mike"},
    method: "POST",
});
```


一些网络封装库，如 **jQuery**、**axios** 等等为了简化使用，都已经将以上 JSON 细节隐藏了起来，但大家都应该知道其原理，该操作什么。





## 小结

本文作为进阶篇的首篇，为大家展现了即便是最常见的 JSON API，也隐藏了大量足以影响代码健壮性的细节，有时候往往就是对代码细节的把握，才能体现一个人能力水平的高低。

简短总结，掌握 JSON 规范中定义的那几种有限数据类型，就能判断 `JSON.parse` 能工作的范围。相比之下，`JSON.stringify` 有更多的策略，比如什么样的 JavaScript 类型会被映射到什么样的 JSON 类型。再加上 `toJSON` “后门”的影响，导致一个对象转换成 JSON 字符串再解析回来，往往和原来有较大差别。

它们各自的额外参数，都能在解析和序列化过程中发挥作用，影响最后的结果。在数据结构清晰可预测的条件下，往往可以作为一种高级用法，简化业务的实现。

JSON 常常用作网络通信的格式，但作为线下的配置文件，比如 package.json，也存在着诸如不支持注释的不便之处，这时候可能是一些社区拓展方案，比如 [json5](https://json5.org/) 的用武之处，大家可以进一步了解。

下一节，我们来掌握一些常用的内存数据结构。
