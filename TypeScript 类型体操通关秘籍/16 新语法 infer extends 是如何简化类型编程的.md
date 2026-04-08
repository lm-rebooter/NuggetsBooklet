# 16 新语法 infer extends 是如何简化类型编程的
我们知道，TypeScript 支持 infer 来提取类型的一部分，通过模式匹配的方式。

比如元组类型提取最后一个元素的类型：

```Plain Text
type Last<Arr extends unknown[]> = 
    Arr extends [...infer rest,infer Ele]
        ? Ele 
        : never;

```
![image](images/T4-K2bYngCx01yVaCScXYR8U19Yeg3MrRMdtz2S4OMU.webp)

比如函数提取返回值类型：

```Plain Text
type GetReturnType<Func extends Function> = 
    Func extends (...args: any[]) => infer ReturnType 
        ? ReturnType 
        : never;

```
![image](images/S8Xdx-oIJcPL8X1bwNT_mpRV5xsFzHx0O8ACvYKqCZM.webp)

比如字符串提取一部分，然后替换：

```Plain Text
type ReplaceStr<
    Str extends string,
    From extends string,
    To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}` 
        ? `${Prefix}${To}${Suffix}` : Str;

```
![image](images/0vvjrFGIUCs9XqaLI20iYhooktmWLr5sEXrXdeLveuw.webp)

**模式匹配就是通过一个类型匹配一个模式类型，需要提取的部分通过 infer 声明一个局部变量，这样就能从局部变量里拿到提取的类型。**

infer 的模式匹配用法还是挺好理解的。

但是 infer 有一个问题，比如这样：

![image](images/Eoeq42fuo0dQUw0zMBCA4ctOMziNTAS8XZwduAyWBGI.webp)

从 string 数组中提取的元素，默认会推导为 unknown 类型，这就导致了不能直接把它当 string 用：

![image](images/nUJ2f30_aQ7pRzKstCos9DLT-gwLN7EJwKteOsnZxg4.webp)

那怎么办呢？

之前的处理方式是这样的：

![image](images/C4tt44RxEMVen7x8TW1qyIdXQyUoRUCffvscv-0ynrE.webp)

加一层判断，这样 Last 就推导为 string 类型了。

或者也可以和 string 取交叉类型：

![image](images/T0veTraLxihdfFIbvGCcmFlhdNEUfePY-0_yswp4qaM.webp)

这样也可以作为 string 来用。

但是我们明明知道这里就是 string，却还需要 & string 或者 xxx extends string 来转换一次，这也太麻烦了。

TS 也知道有这个问题，所以在 4.7 就引入了新语法：infer extends。

现在我们可以这样写：

![image](images/LbWxUE10WXEcegwAKpxwzZpPzklIyc0ChV9vBIRUGHs.webp)

**infer 的时候加上 extends 来约束推导的类型，这样推导出的就不再是 unknown 了，而是约束的类型。**

[试一下](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2Fplay%3Fts%3D4.8.0-beta%23code%2FC4TwDgpgBAKhDOwAyBDRAeAggJ21CAHsBAHYAm8Ui2AliQOYDaAugHxQC8UAUFH1DjyFi5SowB0kugDMIeAEoJgAGigy5UVIma9%2BegPxQABoABzQHAqgADlAVHKB6M0BY-wBIA3luBQAZFWC0GAXyO6enwAXFAkEABucgDc3NygkLBKrgBMWLj4RKQUXj5MbJw8eoKZIjkSUiSyCkqq6niuOkH8hq6l2ZTUdPSBzS3G5tb2zq7%2BvX1QoeFR2OP8U5ExcQnQcIiuAMzpQlmiud0s7Fy9JcIdUBXi9VCKiHVVGm1ne10MTX2Gppa2ji5owGMJgsZrEgA "https://www.typescriptlang.org/play?ts=4.8.0-beta#code/C4TwDgpgBAKhDOwAyBDRAeAggJ21CAHsBAHYAm8Ui2AliQOYDaAugHxQC8UAUFH1DjyFi5SowB0kugDMIeAEoJgAGigy5UVIma9+egPxQABoABzQHAqgADlAVHKB6M0BY-wBIA3luBQAZFWC0GAXyO6enwAXFAkEABucgDc3NygkLBKrgBMWLj4RKQUXj5MbJw8eoKZIjkSUiSyCkqq6niuOkH8hq6l2ZTUdPSBzS3G5tb2zq7+vX1QoeFR2OP8U5ExcQnQcIiuAMzpQlmiud0s7Fy9JcIdUBXi9VCKiHVVGm1ne10MTX2Gppa2ji5owGMJgsZrEgA")

这个语法是 TS 4.7 引入的，在 4.8 又完善了一下。

比如这样一个类型：

```Plain Text
type NumInfer<Str> = 
    Str extends `${infer Num extends number}`
        ? Num
        : never;

```
在 4.7 的时候推导结果是这样：

![image](images/F6pffhbFYSC15ZzoM_kRuNTNpzei_gdZhK4egm4YiZY.webp)

而 4.8 就是这样了：

![image](images/dPLOfmKWGbrr9ij2W8chivq2L8m8fJF4UjjNkC_GEDY.webp)

也就是说 4.7 的时候推导出的就是 extends 约束的类型，但是 4.8 的时候，如果是基础类型，会推导出字面量类型。

有了这个语法之后，除了能简化类型编程的逻辑之外，也能实现一些之前实现不了的功能：

比如提取枚举的值的类型：

```Plain Text
enum Code {
    a = 111,
    b = 222,
    c = "abc"
}

```
我们都是这样写：

![image](images/jUasV5MxTnvguZZB_iUJWzFUQMT5rYvH0N2FfigCkUw.webp)

但是有的值明明是数字，却被作为了字符串，所以要再处理一下，转换成数字类型，这时候就可以用 infer extends 了：

```Plain Text
type StrToNum<Str> =
  Str extends `${infer Num extends number}`
    ? Num
    : Str

```
做完 string 到 number 的转换，就拿到了我们想要的结果：

![image](images/BqbYZNVDq57c_i98D-IeyUcvCz9-bheY5LKabNt_Q9Q.webp)

这就是 infer extends 的第二个作用。

处理 string 转 number 之外，也可以转 boolean、null 等类型：

![image](images/u8MY06wcAE6VtrWGnO-d8a9C64MsyFaoQwOSfPt46rw.webp)

![image](images/RORTiis50OyeHbVaMdraLfuJgPet3DFrnzx-Qt4eo1c.webp)

[试一下](https://link.juejin.cn/?target=https%3A%2F%2Fwww.typescriptlang.org%2Fplay%3Fts%3D4.8.0-beta%23code%2FKYOwrgtgBAwg9gE2FA3gKCpqBDKBeKARmIBoMsAjfKAJjrKygGNqBybCp1tAXzTQAuATwAOyAMoCATgBU4AOUgAeSVIB8%2BcqqjAAHgNAIAzlAAGAEhQBLEADNgUqIuh6DIY1HAQKDnqfKYAPxOkAFQAFxQqvzCYlBSwCYEqnLOShYo8Eh%2BagDcMaIS0nIAQnBwADbA2CAq0hp4WtI6%2BoYmGTb2jmWVLW4eFOVVNX5hwT0VYZHRgoXxiTTUKXAT1bWs0mDArHkFccuKFRV16pqY2q5tZpadDiFHfVfgR6OMwYeTjNPSe8gJRgBmJbFBRgI5KVjPCo7XJAA "https://www.typescriptlang.org/play?ts=4.8.0-beta#code/KYOwrgtgBAwg9gE2FA3gKCpqBDKBeKARmIBoMsAjfKAJjrKygGNqBybCp1tAXzTQAuATwAOyAMoCATgBU4AOUgAeSVIB8+cqqjAAHgNAIAzlAAGAEhQBLEADNgUqIuh6DIY1HAQKDnqfKYAPxOkAFQAFxQqvzCYlBSwCYEqnLOShYo8Eh+agDcMaIS0nIAQnBwADbA2CAq0hp4WtI6+oYmGTb2jmWVLW4eFOVVNX5hwT0VYZHRgoXxiTTUKXAT1bWs0mDArHkFccuKFRV16pqY2q5tZpadDiFHfVfgR6OMwYeTjNPSe8gJRgBmJbFBRgI5KVjPCo7XJAA")

## 总结
Typescript 支持 infer 类型，可以通过模式匹配的方式，提取一部分类型返回。

但是 infer 提取出的类型是 unknown，后面用的时候需要类似和 string 取交叉类型，或者 xxx extends string 这样的方式来转换成别的类型来用。这样比较麻烦。

所以 TS 4.7 实现了 infer extends 的语法，可以指定推导出的类型，这样简化了类型编程。

而且，infer extends 还可以用来做类型转换，比如 string 转 number、转 boolean 等。

要注意的是，4.7 的时候，推导出的只是 extends 约束的类型，比如 number、boolean，但是 4.8 就能推导出字面量类型了，比如 1、2、true、false 这种。

有了 infer extends，不但能简化类型编程，还能实现一些之前很难实现的类型转换。