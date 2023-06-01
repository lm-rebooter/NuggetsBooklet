我们知道，TypeScript 支持 infer 来提取类型的一部分，通过模式匹配的方式。

比如元组类型提取最后一个元素的类型：

```typescript
type Last<Arr extends unknown[]> = 
    Arr extends [...infer rest,infer Ele]
        ? Ele 
        : never;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb6b26ec804b4bad902108b846b04604~tplv-k3u1fbpfcp-watermark.image?)

比如函数提取返回值类型：

```typescript
type GetReturnType<Func extends Function> = 
    Func extends (...args: any[]) => infer ReturnType 
        ? ReturnType 
        : never;
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7093a4345d79478e92cec8ab8306a8b1~tplv-k3u1fbpfcp-watermark.image?)

比如字符串提取一部分，然后替换：

```typescript
type ReplaceStr<
    Str extends string,
    From extends string,
    To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}` 
        ? `${Prefix}${To}${Suffix}` : Str;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b38c21a0f2f94024a523da588057c4ff~tplv-k3u1fbpfcp-watermark.image?)

**模式匹配就是通过一个类型匹配一个模式类型，需要提取的部分通过 infer 声明一个局部变量，这样就能从局部变量里拿到提取的类型。**

infer 的模式匹配用法还是挺好理解的。

但是 infer 有一个问题，比如这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6022266e758241cdb6727df05dfb7c01~tplv-k3u1fbpfcp-watermark.image?)

从 string 数组中提取的元素，默认会推导为 unknown 类型，这就导致了不能直接把它当 string 用：


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d73fb694895d4dd9b2ac22951b1af62c~tplv-k3u1fbpfcp-watermark.image?)

那怎么办呢？

之前的处理方式是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3740978c8b847d2a7be77e2f5f07fd0~tplv-k3u1fbpfcp-watermark.image?)

加一层判断，这样 Last 就推导为 string 类型了。

或者也可以和 string 取交叉类型：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/854eb7496f3c43cdbe4a6e8e60f8b143~tplv-k3u1fbpfcp-watermark.image?)

这样也可以作为 string 来用。

但是我们明明知道这里就是 string，却还需要 & string 或者 xxx extends string 来转换一次，这也太麻烦了。

TS 也知道有这个问题，所以在 4.7 就引入了新语法：infer extends。

现在我们可以这样写：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41ecbe95c16d45c98b12141d8c653d63~tplv-k3u1fbpfcp-watermark.image?)

**infer 的时候加上 extends 来约束推导的类型，这样推导出的就不再是 unknown 了，而是约束的类型。**

[试一下](https://www.typescriptlang.org/play?ts=4.8.0-beta#code/C4TwDgpgBAKhDOwAyBDRAeAggJ21CAHsBAHYAm8Ui2AliQOYDaAugHxQC8UAUFH1DjyFi5SowB0kugDMIeAEoJgAGigy5UVIma9+egPxQABoABzQHAqgADlAVHKB6M0BY-wBIA3luBQAZFWC0GAXyO6enwAXFAkEABucgDc3NygkLBKrgBMWLj4RKQUXj5MbJw8eoKZIjkSUiSyCkqq6niuOkH8hq6l2ZTUdPSBzS3G5tb2zq7+vX1QoeFR2OP8U5ExcQnQcIiuAMzpQlmiud0s7Fy9JcIdUBXi9VCKiHVVGm1ne10MTX2Gppa2ji5owGMJgsZrEgA)

这个语法是 TS 4.7 引入的，在 4.8 又完善了一下。

比如这样一个类型：

```typescript
type NumInfer<Str> = 
    Str extends `${infer Num extends number}`
        ? Num
        : never;
```

在 4.7 的时候推导结果是这样：


![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b1625294f5f4de68a0351dc31e73a08~tplv-k3u1fbpfcp-watermark.image?)

而 4.8 就是这样了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d80ea71fccc24d68a2ed99c7a5b008a9~tplv-k3u1fbpfcp-watermark.image?)

也就是说 4.7 的时候推导出的就是 extends 约束的类型，但是 4.8 的时候，如果是基础类型，会推导出字面量类型。

有了这个语法之后，除了能简化类型编程的逻辑之外，也能实现一些之前实现不了的功能：

比如提取枚举的值的类型：

```typescript
enum Code {
    a = 111,
    b = 222,
    c = "abc"
}
```
我们都是这样写：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db28a55919464599b0f346d71f9cc822~tplv-k3u1fbpfcp-watermark.image?)

但是有的值明明是数字，却被作为了字符串，所以要再处理一下，转换成数字类型，这时候就可以用 infer extends 了：

```typescript
type StrToNum<Str> =
  Str extends `${infer Num extends number}`
    ? Num
    : Str
```
做完 string 到 number 的转换，就拿到了我们想要的结果：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c809ce782cb6461a9eaa21be1e1b79d8~tplv-k3u1fbpfcp-watermark.image?)

这就是 infer extends 的第二个作用。

处理 string 转 number 之外，也可以转 boolean、null 等类型：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aee1f9d80c1645e48991d5eabba22af8~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3518ad7481a47c38137509ae7ffd433~tplv-k3u1fbpfcp-watermark.image?)

[试一下](https://www.typescriptlang.org/play?ts=4.8.0-beta#code/KYOwrgtgBAwg9gE2FA3gKCpqBDKBeKARmIBoMsAjfKAJjrKygGNqBybCp1tAXzTQAuATwAOyAMoCATgBU4AOUgAeSVIB8+cqqjAAHgNAIAzlAAGAEhQBLEADNgUqIuh6DIY1HAQKDnqfKYAPxOkAFQAFxQqvzCYlBSwCYEqnLOShYo8Eh+agDcMaIS0nIAQnBwADbA2CAq0hp4WtI6+oYmGTb2jmWVLW4eFOVVNX5hwT0VYZHRgoXxiTTUKXAT1bWs0mDArHkFccuKFRV16pqY2q5tZpadDiFHfVfgR6OMwYeTjNPSe8gJRgBmJbFBRgI5KVjPCo7XJAA)

## 总结

Typescript 支持 infer 类型，可以通过模式匹配的方式，提取一部分类型返回。

但是 infer 提取出的类型是 unknown，后面用的时候需要类似和 string 取交叉类型，或者 xxx extends string 这样的方式来转换成别的类型来用。这样比较麻烦。

所以 TS 4.7 实现了 infer extends 的语法，可以指定推导出的类型，这样简化了类型编程。

而且，infer extends 还可以用来做类型转换，比如 string 转 number、转 boolean 等。

要注意的是，4.7 的时候，推导出的只是 extends 约束的类型，比如 number、boolean，但是 4.8 就能推导出字面量类型了，比如 1、2、true、false 这种。

有了 infer extends，不但能简化类型编程，还能实现一些之前很难实现的类型转换。
