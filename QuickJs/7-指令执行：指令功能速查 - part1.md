引擎有大概 249 个指令，篇幅有限无法对它们一一深入介绍，但为了使大家能够快速了解这些指令的形式和作用，准备了 2 节内容对这些指令进行简要的介绍。大家可以先快速预览一遍，留下一些印象即可，方便后续回看。

对于一个指令，我们需要关注的内容是：

*   指令所在的阶段
    
    引擎有 3 个阶段，可以打印不同阶段的字节码序列。有的指令只出现在特定的阶段中，所以如果某些指令没出现，可能是打印的阶段不匹配。另外，知道指令所属的阶段也可以帮助理解其作用 - 每个阶段都有特定的作用，可以以阶段作为背景思考指令的作用
    
*   指令的参数
    
    我们会按这些指令参数的顺序列举它们的作用、位置、所占字长（字节数）
    
    有的指令参数和指令一起编码在了代码段，另一些参数则存在于操作数栈中，因此我们需要了解这些参数的位置、所占字长
    
    如果指令的参数位于代码段，那么我们就需要关注其所占字长，因为涉及到 PC 的偏移操作。参数位于操作数栈而无需关注字长时，我们通过 `n/a` 表示
    

需要重点说明的是，我们在描述操作数栈时，栈中元素的索引会由 1 开始，这是因为它们在源码中的使用形式（以 [OP\_div](https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L1861 "https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L1861") 为例）：

    CASE(OP_div):
        {
        JSValue op1, op2;
        op1 = sp[-2]; // 栈顶第 2 个
        op2 = sp[-1]; // 栈顶
        if (likely(JS_VALUE_IS_BOTH_INT(op1, op2))) {
            int v1, v2;
            if (unlikely(sf->js_mode & JS_MODE_MATH))
            goto binary_arith_slow;
            v1 = JS_VALUE_GET_INT(op1);
            v2 = JS_VALUE_GET_INT(op2);
            sp[-2] = JS_NewFloat64(ctx, (double)v1 / (double)v2);
            sp--;
        } else {
            goto binary_arith_slow;
        }
        }
        BREAK;
    

`sp[-1]` 表示栈顶元素，类似地 `sp[-2]` 表示栈顶第 2 个元素。在描述的时候也将索引调整为从 1 开始，对照源码的时候就不必在脑中再转换一遍了。

除了本节内容外，大家也可以通过文件 [instrdef.h](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/instrdef.h#L67 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/instrdef.h#L67") 对指令定义进行速查：

    DEF(       push_i32, 5, 0, 1, i32)
    DEF(     push_const, 5, 0, 1, const)
    

代码中通过 `DEF` 宏对指令进行了定义，其中的参数依次为：

*   指令名称标识
    
*   指令在代码段所占的字节长度（指令自身 + 一同编码在代码段的参数）
    
*   指令从操作数栈中弹出元素的数量
    
*   指令往操作数栈中压入元素的数量
    
*   指令编码在代码段的参数的类型（按 `_` 分隔）
    
    比如：
    
        DEF(   with_get_var, 10, 1, 0, atom_label_u8)
        
    
    代码段有 3 个参数，类型分别是：`atom`，`label`，`u8`
    

OP\_enter\_scope
----------------

指令

阶段

字长（指令 + 操作数）

OP\_enter\_scope

emitted in phase 1, removed in phase 2

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

scope 索引

代码段

2

phase 1 指令，用于进入一个新的 scope，操作数为 2 字节，表示 scope 位于 `JSFunctionDef::scopes` 中的索引。

OP\_leave\_scope
----------------

指令

阶段

字长（指令 + 操作数）

OP\_leave\_scope

emitted in phase 1, removed in phase 2

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

scope 索引

代码段

2

phase 1 指令，用于离开一个 scope、将当前 scope 设置为其父级作用域，操作数为 2 字节，表示 scope 位于 `JSFunctionDef::scopes` 中的索引。

OP\_scope\_get\_var\_undef
--------------------------

指令

阶段

字长（指令 + 操作数）

OP\_scope\_get\_var\_undef

emitted in phase 1, removed in phase 2

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#2

scope 索引

代码段

2

表示将变量压入操作数栈，如果变量不存在则压入 `undefined`，会在 phase 2 被优化掉、替换成对应作用域的变量操作指令。

替换成对应作用域的变量操作指令指的是：

*   引擎中有专门的指令获取局部变量或者全局变量等
    
*   由于 JS 词法作用域的特性，在静态阶段就能够分析出变量所属的作用域，因此会先生成携带 scope 索引的指令，后续优化的时候再替换成专门的指令
    

OP\_scope\_get\_var
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_scope\_get\_var

emitted in phase 1, removed in phase 2

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#2

scope 索引

代码段

2

表示将变量压入操作数栈，如果变量不存在则抛出异常，会在 phase 2 被优化掉、替换成对应作用域的变量操作指令。

OP\_scope\_put\_var
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_scope\_put\_var

emitted in phase 1, removed in phase 2

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#2

scope 索引

代码段

2

表示设置变量，会在 phase 2 被优化掉，替换成对应作用域的变量操作指令。

OP\_scope\_delete\_var
----------------------

指令

阶段

字长（指令 + 操作数）

OP\_scope\_delete\_var

emitted in phase 1, removed in phase 2

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#2

scope 索引

代码段

2

表示删除变量，会在 phase 2 被优化掉，替换成对应作用域的变量操作指令。

OP\_scope\_make\_ref
--------------------

指令

阶段

字长（指令 + 操作数）

OP\_scope\_make\_ref

emitted in phase 1, removed in phase 2

11 = 1 + 4 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#2

跳转 label，初始化指令序列后一条指令位置

代码段

4

#3

scope 索引

代码段

2

表示设置变量，phase 1 尚不能确定变量是否为闭包变量，后续优化中会处理该问题。

OP\_scope\_get\_ref
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_scope\_get\_ref

emitted in phase 1, removed in phase 2

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#2

scope 索引

代码段

2

表示获取变量，phase 1 尚不能确定变量是否为闭包变量，后续优化中会处理该问题。

OP\_scope\_put\_var\_init
-------------------------

指令

阶段

字长（指令 + 操作数）

OP\_scope\_put\_var\_init

emitted in phase 1, removed in phase 2

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#2

scope 索引

代码段

2

表示初始化变量，phase 1 尚不能确定变量是否为闭包变量，后续优化中会处理该问题。

OP\_scope\_get\_private\_field
------------------------------

指令

阶段

字长（指令 + 操作数）

OP\_scope\_get\_private\_field

emitted in phase 1, removed in phase 2

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#2

scope 索引

代码段

2

表示获取私有属性，phase 1 尚不能确定私有变量是否已定义，后续优化中会处理该问题。

OP\_scope\_get\_private\_field2
-------------------------------

指令

阶段

字长（指令 + 操作数）

OP\_scope\_get\_private\_field2

emitted in phase 1, removed in phase 2

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#2

scope 索引

代码段

2

表示获取私有属性、指令会将待操作对象保留在操作数栈中，phase 1 尚不能确定私有变量是否已定义，后续优化中会处理该问题。

OP\_scope\_put\_private\_field
------------------------------

指令

阶段

字长（指令 + 操作数）

OP\_scope\_put\_private\_field

emitted in phase 1, removed in phase 2

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#2

scope 索引

代码段

2

表示设置私有属性，phase 1 尚不能确定私有变量是否已定义，后续优化中会处理该问题。

OP\_set\_class\_name
--------------------

指令

阶段

字长（指令 + 操作数）

OP\_set\_class\_name

emitted in phase 1, removed in phase 2

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

类名 JSAtom

代码段

4

OP\_loc
-------

指令

阶段

字长（指令 + 操作数）

OP\_loc

emitted in phase 1, removed in phase 3

9 = 1 + 8

操作数:

序号

作用

位置

字长

#1

行列号，各占 4 字节

代码段

8

phase 1 会将指令的行列号作为指令添加到指令序列中，会在最终生成的指令序列中移除，并作为调试信息写入到 `JSFunctionDef::pc2line` 中。

OP\_label
---------

指令

阶段

字长（指令 + 操作数）

OP\_label

emitted in phase 1, removed in phase 3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

label 索引

代码段

4

表示该指令的下一条指令相对函数体整体字节码序列的首地址的偏移地址。

![op_label.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8c755e93869428285190159cd7ceaa0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1222&h=480&s=42273&e=png&b=fdfcfc)

OP\_push\_i32
-------------

指令

阶段

字长（指令 + 操作数）

OP\_push\_i32

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

有符号整型常量

代码段

4

往操作数栈中压入一个有符号的 32bit 整数。

待压入的数值编码在紧跟 `OP_push_i32` 指令的 4 字节长度中。换句话说，待压入的数值放在了代码段中。

由于待压入数字长是 4 个字节，因此指令执行后 PC 指针需要偏移 4 字节，以到达下一个指令位置：

    *sp++ = JS_NewInt32(ctx, get_u32(pc));
    pc += 4;
    

OP\_push\_const
---------------

指令

阶段

字长（指令 + 操作数）

OP\_push\_const

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

常量在常量池中的索引

代码段

4

往操作数栈中压入一个存在于常量池中的值。

对常量池中的值采用的是间接寻址。紧跟 `OP_push_const` 指令的 4 字节长度中保存的是常量在常量池中的索引。

由于索引字长是 4 个字节，因此指令执行后 PC 指针需要偏移 4 字节，以到达下一个指令位置：

    // cpool 为常量池
    *sp++ = JS_DupValue(ctx, b->cpool[get_u32(pc)]);
    pc += 4;
    

OP\_push\_minus1
----------------

指令

阶段

字长（指令 + 操作数）

OP\_push\_minus1

3

1

往操作数栈中压入固定值 `-1`。

固定值 `-1` 在源码中并不是采用的硬编码，而是通过 `opcode - OP_push_0` 计算得到：

    *sp++ = JS_NewInt32(ctx, opcode - OP_push_0);
    

由于指令都是枚举值，因此 `opcode - OP_push_0` 可以计算得出枚举值之间的差值。若希望两者的差值为 `-1`，那么 `OP_push_minus1` 的枚举值，必须位于紧贴 `OP_push_0` 之上的位置。

另外 `OP_push_minus1 ~ OP_push_7` 的指令的操作数均采用上述的形式，这就要求指令在定义时也是保持这样的顺序。

可以在 [instrdef.h](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/instrdef.h#L291 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/instrdef.h#L291") 中得到验证：

    DEF(    push_minus1, 1, 0, 1, none_int)
    DEF(         push_0, 1, 0, 1, none_int)
    DEF(         push_1, 1, 0, 1, none_int)
    DEF(         push_2, 1, 0, 1, none_int)
    DEF(         push_3, 1, 0, 1, none_int)
    DEF(         push_4, 1, 0, 1, none_int)
    DEF(         push_5, 1, 0, 1, none_int)
    DEF(         push_6, 1, 0, 1, none_int)
    DEF(         push_7, 1, 0, 1, none_int)
    

OP\_push\_0
-----------

同 [OP\_push\_minus1](#OP_push_minus1 "#OP_push_minus1")

OP\_push\_1
-----------

同 [OP\_push\_minus1](#OP_push_minus1 "#OP_push_minus1")

OP\_push\_2
-----------

同 [OP\_push\_minus1](#OP_push_minus1 "#OP_push_minus1")

OP\_push\_3
-----------

同 [OP\_push\_minus1](#OP_push_minus1 "#OP_push_minus1")

OP\_push\_4
-----------

同 [OP\_push\_minus1](#OP_push_minus1 "#OP_push_minus1")

OP\_push\_5
-----------

同 [OP\_push\_minus1](#OP_push_minus1 "#OP_push_minus1")

OP\_push\_6
-----------

同 [OP\_push\_minus1](#OP_push_minus1 "#OP_push_minus1")

OP\_push\_7
-----------

同 [OP\_push\_minus1](#OP_push_minus1 "#OP_push_minus1")

OP\_push\_i8
------------

指令

阶段

字长（指令 + 操作数）

OP\_push\_i8

3

2 = 1 + 1

操作数:

序号

作用

位置

字长

#1

有符号整型常量

代码段

1

往操作数栈中压入一个有符号的 8bit 整数。

待压入的数值在紧跟 `OP_push_i32` 指令的 1 字节长度中。

由于待压入数字长是 1 个字节，因此指令执行后 PC 指针需要偏移 1 字节，以到达下一个指令位置：

    *sp++ = JS_NewInt32(ctx, get_i8(pc));
    pc += 1;
    

OP\_push\_i16
-------------

与 [OP\_push\_i8](#OP_push_i8 "#OP_push_i8") 类似，只不过操作数字长是 2 字节

OP\_push\_const8
----------------

与 [OP\_push\_const](#OP_push_const "#OP_push_const") 类似，只不过其待压入常量的索引所占的字长是 1 个字节

OP\_fclosure8
-------------

指令

阶段

字长（指令 + 操作数）

OP\_fclosure8

3

2 = 1 + 1

操作数:

序号

作用

位置

字长

#1

常量池索引

代码段

1

往操作数栈中压入一个闭包对象，闭包对象对应的函数模板在常量池中，因此需要通过索引间接寻址。

`8` 表示索引的字长是 1 个字节。因此指令执行完成后，PC 需要继续偏移 1 个字节的长度，以到达下一个指令的位置：

    *sp++ = js_closure(ctx, JS_DupValue(ctx, b->cpool[*pc++]), var_refs, sf);
    if (unlikely(JS_IsException(sp[-1])))
        goto exception;
    

OP\_push\_empty\_string
-----------------------

指令

阶段

字长（指令 + 操作数）

OP\_push\_empty\_string

3

1

`OP_push_empty_string` 指令的操作是往操作数栈中压入一个空字符串：

    *sp++ = JS_AtomToString(ctx, JS_ATOM_empty_string);
    

空字符串常量保存在 JSAtom 数组中。`JS_ATOM_empty_string` 是空字符串常量在 JSAtom 数组中的索引

OP\_get\_length
---------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_length

3

1

操作数:

序号

作用

位置

字长

#1

待访问对象

操作数栈栈顶

n/a

获取操作数栈顶元素的 `length` 属性值。

执行步骤为：

1.  弹出栈顶元素，该元素为指令操作数
    
2.  在操作数上调用 `JS_GetProperty` 获取 `length` 属性值
    
3.  将获取的属性值压入操作数栈
    

    JSValue val;
    
    val = JS_GetProperty(ctx, sp[-1], JS_ATOM_length);
    if (unlikely(JS_IsException(val)))
        goto exception;
    JS_FreeValue(ctx, sp[-1]);
    sp[-1] = val;
    

OP\_push\_atom\_value
---------------------

指令

阶段

字长（指令 + 操作数）

OP\_push\_atom\_value

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

JSAtom 索引

代码段

4

往操作数栈中压入位于 JSAtom 数组中的值。

值通过其在 JSAtom 中的索引进行简介寻址，索引在紧跟 `OP_push_atom_value` 指令的 4 字节长度中。

由于待压入数字长是 4 个字节，因此指令执行后 PC 指针需要偏移 4 字节，以到达下一个指令位置：

    *sp++ = JS_AtomToValue(ctx, get_u32(pc));
    pc += 4;
    

OP\_undefined
-------------

指令

阶段

字长（指令 + 操作数）

OP\_undefined

3

1

往操作数栈中压入常量 `JS_UNDEFINED`。

OP\_null
--------

指令

阶段

字长（指令 + 操作数）

OP\_null

3

1

往操作数栈中压入常量 `JS_NULL`。

OP\_push\_this
--------------

指令

阶段

字长（指令 + 操作数）

OP\_push\_this

3

1

往操作数栈顶压入 `this` 对象。

该指令的调用 **只会** 发生在函数的指令序列的起始位置。

指令执行时分 2 种情况：

1.  如果是严格模式下，则待压入的 `this` 对象为函数绑定的 `this` 对象
    
2.  否则判断函数绑定的 `this` 是否为空，不为空时行为和情况 1 一致；为空时压入全局对象 `global`
    

OP\_push\_false
---------------

指令

阶段

字长（指令 + 操作数）

OP\_push\_false

3

1

往操作数栈中压入常量 `JS_FALSE`。

OP\_push\_true
--------------

指令

阶段

字长（指令 + 操作数）

OP\_push\_true

3

1

往操作数栈中压入常量 `JS_TRUE`。

OP\_object
----------

指令

阶段

字长（指令 + 操作数）

OP\_object

3

1

创建一个新的空对象并压入操作数栈中。

OP\_special\_object
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_special\_object

3

2 = 1 + 1

操作数:

序号

作用

位置

字长

#1

特殊对象类型

代码段

1

往操作数栈中追加引擎内部运行时的特殊对象。

插入的特殊对象包含不同的类型，因此 `OP_special_object` 指令的操作数为紧跟其后的 1 字节的类型枚举值。

这些特殊对象是标准中定义的、用于引擎内部执行的对象。包括下面几种类型：

    typedef enum {
      // 满足下列条件时，会产出该指令：
      // 1. 函数中使用了 `arguments`
      // 2. 且函数定义在严格模式下，或者使用了非简单形式的形参列表（包含 Destructuring assignment 或 Rest parameters）
      OP_SPECIAL_OBJECT_ARGUMENTS,
    
      // 满足下列条件时，会产出该指令：
      // 1. 函数中使用了 `arguments`
      // 2. 且函数定义在非严格模式下、或者使用简单形式的形参列表（不包含 Destructuring assignment 和 Rest parameters）
      OP_SPECIAL_OBJECT_MAPPED_ARGUMENTS,
    
      // 表示 `[[FunctionObject]]`
      OP_SPECIAL_OBJECT_THIS_FUNC,
    
      // 表示 `[[NewTarget]]`
      OP_SPECIAL_OBJECT_NEW_TARGET,
    
      // 表示 `[[HomeObject]]`
      OP_SPECIAL_OBJECT_HOME_OBJECT,
    
      // 函数代码中包含 `eval` 时会执行下面的指令，将 eval
      // 执行所需的上下文变量加入其中
      OP_SPECIAL_OBJECT_VAR_OBJECT,
    
      // 表示 `[[ImportMeta]]`
      OP_SPECIAL_OBJECT_IMPORT_META,
    } OPSpecialObjectEnum;
    

OP\_rest
--------

指令

阶段

字长（指令 + 操作数）

OP\_rest

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

rest 形参在形参列表中的索引

代码段

2

构建出 rest 实参数组。

指令的操作数是紧跟其后的 2 字节长度的内容，表示 rest 形参在形参列表中的索引：

    function fn(a, b, ...c) {}
    
    fn(1, 2, 3, 4);
    

上面的代码中，`OP_rest` 的操作数为 2，所以 `[3, 4]` 为构建出的 Rest 实参数组

OP\_drop
--------

指令

阶段

字长（指令 + 操作数）

OP\_drop

3

1

将栈顶元素弹出，弹出的元素会同时执行 `JS_FreeValue`

OP\_nip
-------

指令

阶段

字长（指令 + 操作数）

OP\_nip

3

1

操作数:

序号

作用

位置

字长

#1

栈顶第 2 个元素

操作数栈

n/a

将栈顶第 2 的元素释放掉，并对操作数栈进行 compact。

执行的步骤为：

1.  通过 `JS_FreeValue` 释放栈顶第 2 的元素
    
2.  将栈顶元素移动到原栈顶第 2 的元素的位置
    
3.  sp--
    

假设指令 `OP_nip` 时，操作数栈包含下面的内容：

    -> TOP
    a, b, c
    

执行 `OP_nip` 后，栈中的内容变为：

    -> TOP
    a, c
    

OP\_nip1
--------

指令

阶段

字长（指令 + 操作数）

OP\_nip

3

1

操作数:

序号

作用

位置

字长

#1

栈顶第 3 个元素

操作数栈

n/a

将栈顶第 3 的元素释放掉，并对操作数栈进行 compact。

假设指令 `OP_nip1` 时，操作数栈包含下面的内容：

    -> TOP
    a, b, c
    

执行 `OP_nip` 后，栈中的内容变为：

    -> TOP
    b, c
    

这样就可以理解源码中的注释了：

    CASE(OP_nip1): /* a b c -> b c */
    

OP\_dup
-------

指令

阶段

字长（指令 + 操作数）

OP\_dup

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

复制栈顶元素，并将复制后的元素压入栈中。

指令执行前后的操作数栈中的内容变化如下：

    -> TOP
    a, b, c => a, b, c, c
    

OP\_dup2
--------

指令

阶段

字长（指令 + 操作数）

OP\_dup2

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 2 个元素

操作数栈

n/a

复制栈顶的 2 的元素，并按它们原本的顺序压入栈中

指令执行前后的操作数栈中的内容变化如下：

    -> TOP
    a, b => a, b, a, b
    

OP\_dup3
--------

指令

阶段

字长（指令 + 操作数）

OP\_dup3

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 3 个元素

操作数栈

n/a

复制栈顶的 3 的元素，并按它们原本的顺序压入栈中。

指令执行前后的操作数栈中的内容变化如下：

    -> TOP
    a, b, c => a, b, c, a, b, c
    

OP\_dup1
--------

指令

阶段

字长（指令 + 操作数）

OP\_dup1

3

1

操作数:

序号

作用

位置

字长

#1

栈顶第 2 元素

操作数栈

n/a

复制栈顶的第 2 的元素，复制后的元素插入到原元素之后

指令执行前后的操作数栈中的内容变化如下：

    -> TOP
    a, b => a, a, b
    

    CASE(OP_dup1):
      // 假设栈中当前的内容为：a, b
    
      // 将栈顶元素 sp[-1] 再次压入栈中，此时栈中内容为：a, b, b
      sp[0] = sp[-1];
    
      // 虽然执行了压入操作，但由于 sp 还没有变化，所以栈顶元素还是从右往左的第 2 个 b
      // 将栈顶开始的第 2 的元素 a 复制到栈顶。此时栈中的内容变为 a, a, b
      sp[-1] = JS_DupValue(ctx, sp[-2]);
    
      // 移动 sp，移动后栈顶元素变为从右往左的第 1 个 b
      sp++;
      BREAK;
    

OP\_insert2
-----------

指令

阶段

字长（指令 + 操作数）

OP\_insert2

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

复制栈顶元素、并插入到栈顶第 2 的元素之后。

用于将栈顶元素在经过操作后依然保留在栈内，成为新的栈顶元素。

假设栈中的内容为：

    -> TOP
    a, b, c
    

栈顶元素为 c，栈顶第 2 的元素为 b。指令执行后，栈中的内容变为：

    -> TOP
    a, c, b, c
    

指令对应的源码中的执行步骤为：

    CASE(OP_insert2): /* obj a -> a obj a (dup_x1) */
      // 假设当前栈中的内容为：obj, a
    
      // 下面两行一起，表示将栈顶的两个元素右移一个位置
      // 移动后栈中的内容变为：obj, obj, a
      sp[0] = sp[-1];
      sp[-1] = sp[-2];
    
      // 经过了上面的右移后，sp[-2] 的位置空了出来，成了待插入位置
      // 复制 `sp[0]` 即 a ，并使用复制后的值覆盖 sp[-2] 的 obj
      // 栈中的内容变为：a, obj, a
      sp[-2] = JS_DupValue(ctx, sp[0]);
    
      // 移动 sp，移动后栈顶元素变为从右往左的第 1 个 a
      sp++;
      BREAK;
    

OP\_insert3
-----------

指令

阶段

字长（指令 + 操作数）

OP\_insert3

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

复制栈顶元素、并插入到栈顶第 3 的元素之后。

假设栈中的内容为：

    -> TOP
    a, b, c, d
    

栈顶元素为 d，栈顶第 3 的元素为 b。指令执行后，栈中的内容变为：

    -> TOP
    a, d, b, c, d
    

    CASE(OP_insert3): /* obj prop a -> a obj prop a (dup_x2) */
      // 假设当前栈中的内容为：obj, prop, a
    
      // 先将栈顶的 3 个元素右移一个位置
      // 移动后栈中的内容变为：obj, obj, prop, a
      sp[0] = sp[-1];
      sp[-1] = sp[-2];
      sp[-2] = sp[-3];
    
      // 经过了上面的右移后，sp[-3] 的位置空了出来，成了待插入位置
      // 复制 `sp[0]` 即 a ，并使用复制后的值覆盖 sp[-3] 的 obj（从右往左第 2 个 obj）
      // 栈中的内容变为：a, obj, prop, a
      sp[-3] = JS_DupValue(ctx, sp[0]);
      sp++;
      BREAK;
    

OP\_insert4
-----------

指令

阶段

字长（指令 + 操作数）

OP\_insert4

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

复制栈顶元素、并插入到栈顶第 4 的元素之后。

假设栈中的内容为：

    -> TOP
    a, b, c, d, e
    

栈顶元素为 e，栈顶第 4 的元素为 b。指令执行后，栈中的内容变为：

    -> TOP
    a, e, b, c, d, e
    

    CASE(OP_insert4): /* this obj prop a -> a this obj prop a */
      // 假设当前栈中的内容为：this, obj, prop, a
    
      // 先将栈顶的 4 的元素右移一个位置
      // 移动后栈中的内容变为：this, this, obj, prop, a
      sp[0] = sp[-1];
      sp[-1] = sp[-2];
      sp[-2] = sp[-3];
      sp[-3] = sp[-4];
    
      // 经过了上面的右移后，sp[-4] 的位置空了出来，成了待插入位置
      // 复制 `sp[0]` 即 a ，并使用复制后的值覆盖 sp[-4] 的 obj（从右往左第 2 个 this）
      // 栈中的内容变为：a, this, obj, prop, a
      sp[-4] = JS_DupValue(ctx, sp[0]);
      sp++;
      BREAK;
    

OP\_perm3
---------

指令

阶段

字长（指令 + 操作数）

OP\_insert4

3

1

操作数:

序号

作用

位置

字长

#1

栈顶第 2 和第 3 的元素

操作数栈

n/a

将操作数栈顶第 2 和第 3 的元素进行逆时针旋转。

假设栈中的内容为：

    -> TOP
    a, b, c
    

栈顶元素为 c 不变。栈顶第 3 的元素为 a，栈顶第 2 的元素为 b，进行逆时针旋转。指令执行后，栈中的内容变为：

    -> TOP
    b, a, c
    

OP\_rot3l
---------

指令

阶段

字长（指令 + 操作数）

OP\_rot3l

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 3 个元素

操作数栈

n/a

将操作数栈顶在内的 3 个元素进行顺时针旋转（<- left）。

假设栈中的内容为：

    -> TOP
    a, b, c
    

栈顶元素为 c，栈顶第 2 的元素为 b，栈顶第 3 的元素为 a。顺时针旋转后，栈中的内容变为：

    -> TOP
    b, c, a
    

对应的源码中的执行步骤为：

1.  将栈顶第 3 的元素 a 通过临时变量进行保存
    
2.  将栈顶第 2、1 的元素 b、c 一起左移一个元素位置。移动后原栈顶元素的位置空了出来
    
3.  将第一步保存的临时变量放置到栈顶
    

OP\_rot4l
---------

指令

阶段

字长（指令 + 操作数）

OP\_rot4l

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 4 个元素

操作数栈

n/a

将操作数栈顶在内的 4 个元素进行顺时针旋转（<- left）。

假设栈中的内容为：

    -> TOP
    a, b, c, d
    

顺时针旋转后，栈中的内容变为：

    -> TOP
    b, c, d, a
    

对应的源码中的执行步骤为：

1.  将栈顶第 4 的元素 a 通过临时变量进行保存
    
2.  将栈顶 3 个元素（b, c, d）左移一个元素位置。移动后栈顶元素的位置空了出来
    
3.  将第一步保存的临时变量放置到栈顶
    

OP\_rot5l
---------

指令

阶段

字长（指令 + 操作数）

OP\_rot4l

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 4 个元素

操作数栈

n/a

将操作数栈顶在内的 5 个元素进行顺时针旋转（<- left）。

假设栈中的内容为：

    -> TOP
    a, b, c, d, e
    

顺时针旋转后，栈中的内容变为：

    -> TOP
    b, c, d, e, a
    

对应的源码中的执行步骤为：

1.  将栈顶第 5 的元素 a 通过临时变量进行保存
    
2.  将栈顶 4 个元素（b, c, d, e）左移一个元素位置。移动后栈顶元素的位置空了出来
    
3.  将第一步保存的临时变量放置到栈顶
    

OP\_rot3r
---------

指令

阶段

字长（指令 + 操作数）

OP\_rot3r

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 3 个元素

操作数栈

n/a

将操作数栈顶在内的 5 个元素进行逆时针旋转（right ->）。

假设栈中的内容为：

    -> TOP
    a, b, c
    

栈顶元素为 c，栈顶第 2 的元素为 b，栈顶第 3 的元素为 a。逆时针旋转后，栈中的内容变为：

    -> TOP
    c, a, b
    

对应的源码中的执行步骤为：

1.  将栈顶第元素通过临时变量进行保存
    
2.  将栈顶第 3、2 的元素 a、b 右移一个元素位置。移动后栈顶第 3 的位置空了出来
    
3.  将第一步保存的临时变量，放置到栈顶第 3 的元素的位置
    

OP\_perm4
---------

指令

阶段

字长（指令 + 操作数）

OP\_perm4

3

1

操作数:

序号

作用

位置

字长

#1

栈顶第 2、3、4 的元素

操作数栈

n/a

将操作数栈顶第 2、3、4 的元素进行顺时针旋转。

假设栈中的内容为：

    -> TOP
    a, b, c, d
    

栈顶第 4、3、2 的元素分别为 a, b, c，进行顺时针旋转。指令执行后，栈中的内容变为：

    -> TOP
    c, a, b, d
    

OP\_perm5
---------

指令

阶段

字长（指令 + 操作数）

OP\_perm4

3

1

操作数:

序号

作用

位置

字长

#1

栈顶第 2、3、4、5 的元素

操作数栈

n/a

将操作数栈顶第 2、3、4、5 的元素进行顺时针旋转。

假设栈中的内容为：

    -> TOP
    a, b, c, d, e
    

栈顶第 5、4、3、2 的元素分别为 a, b, c，d 进行顺时针旋转。指令执行后，栈中的内容变为：

    -> TOP
    d, a, b, c, e
    

OP\_swap
--------

指令

阶段

字长（指令 + 操作数）

OP\_swap

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 2 个元素

操作数栈

n/a

将栈顶的 2 个元素交换位置。

假设栈中的内容为：

    -> TOP
    a, b
    

指令执行后，栈中的内容变为：

    -> TOP
    b, a
    

OP\_swap2
---------

指令

阶段

字长（指令 + 操作数）

OP\_swap2

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 4 个元素, 2 个为一组

操作数栈

n/a

将操作数栈顶的 4 个元素，2 个为一组交换位置，组内位置不变。

假设栈中的内容为：

    -> TOP
    a, b, c, d
    

指令执行后，栈中的内容变为：

    -> TOP
    c, d, a, b
    

OP\_fclosure
------------

指令

阶段

字长（指令 + 操作数）

OP\_fclosure8

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

常量池索引

代码段

4

往操作数栈中压入一个闭包对象，闭包对象对应的函数模板在常量池中，因此需要通过索引间接寻址。

索引的字长是 4 个字节。因此指令执行完成后，PC 需要继续偏移 4 个字节的长度，以到达下一个指令的位置：

    JSValue bfunc = JS_DupValue(ctx, b->cpool[get_u32(pc)]);
    pc += 4;
    *sp++ = js_closure(ctx, bfunc, var_refs, sf);
    if (unlikely(JS_IsException(sp[-1])))
        goto exception;
    

OP\_call0
---------

`OP_call0` 指令与 [OP\_call](#OP_call "#OP_call") 功能相同，只不过实参个数为 0

OP\_call1
---------

`OP_call1` 指令与 [OP\_call](#OP_call "#OP_call") 功能相同，只不过实参个数为 1

OP\_call2
---------

`OP_call2` 指令与 [OP\_call](#OP_call "#OP_call") 功能相同，只不过实参个数为 2

OP\_call3
---------

`OP_call3` 指令与 [OP\_call](#OP_call "#OP_call") 功能相同，只不过实参个数为 3

OP\_call
--------

指令

阶段

字长（指令 + 操作数）

OP\_call

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

实参的个数

代码段

2

执行函数调用，紧跟指令其后的 2 个字节为实参个数。

`OP_call` 指令调用时，操作数栈的内容如下：

    -> TOP
    fnObj, arg0, arg1, ..., argN
    

指令的执行步骤如下：

      call_argc = get_u16(pc);
      pc += 2;
      goto has_call_argc;
    has_call_argc:
      // 获取实参数组。实参也是存在于操作数栈中，通过 `sp - call_argc` 得到实参数组的首地址
      call_argv = sp - call_argc;
    
      // 将 pc 保存至 `sf->cur_pc` sf 表示 StackFrame
      // 当发生新的函数调用时，CallStack 中会压入新的 StackFrame，pc 将用于 CallStack 栈顶的函数指令的偏移
      sf->cur_pc = pc;
    
      // 执行函数调用，call_argv[-1] 为待执行的函数对象
      ret_val = JS_CallInternal(ctx, call_argv[-1], JS_UNDEFINED,
                                JS_UNDEFINED, call_argc, call_argv, 0);
      if (unlikely(JS_IsException(ret_val)))
        goto exception;
    
      if (opcode == OP_tail_call)
        goto done;
    
      // 执行结束后，将实参、以及函数对象进行释放
      for(i = -1; i < call_argc; i++)
        JS_FreeValue(ctx, call_argv[i]);
    
      // 同时缩减 sp，表示栈中元素已释放
      sp -= call_argc + 1;
    
      // 将返回值压入操作数栈中
      *sp++ = ret_val;
    

虚拟机内部的执行模块可以分为两部分：

1.  指令执行器，可以理解它是无状态的，只负责执行指令
    
2.  调用栈帧，用于保存执行状态
    

![vm_call_stack.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c60e3b8b9984472c8cca1c5cdc81a575~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1082&h=942&s=95687&e=png&b=fcfcfc)

「指令执行器」只会执行「执行状态栈」栈顶的帧中的 PC 执行的指令

> 「函数模板」保存的是函数的静态信息，比如指令集合。「函数对象」内部含了对其函数模板的引用，并包含其他运行时信息
> 
> 如果将函数模板中的指令集看成是数组的话，那么 PC（Program Counter）就是接下来待执行的指令的下标

现在回头看上面 `OP_call` 的内容，会发现更多的细节：

1.  首先，当执行到 `OP_call` 指令时，我们依然在 Caller 的栈帧中
    
2.  所以通过 `sp - call_argc` 得到实参数组的首地址，其实是指向的 Caller 栈帧中的操作数栈上的内容
    
3.  在 QuickJS 的调用约定中，实参是在 Caller 中释放的，也就是说被调函数无需考虑其参数的内存生命周期
    
4.  构造完实参后的 `JS_CallInternal` 调用，将会产生新的栈帧，所以后续「指令执行器」会执行 Callee 中的指令
    
5.  当 Callee 中的指令执行完毕后，其内部的 `OP_return` 指令会将其栈帧从「执行状态栈」中弹出
    
6.  弹出后栈顶变为原先的 Caller 的栈帧，「指令执行器」会根据执行保存的 PC 继续执行
    

OP\_tail\_call
--------------

指令

阶段

字长（指令 + 操作数）

OP\_tail\_call

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

实参的个数

代码段

2

与 [OP\_call](#OP_call "#OP_call") 功能相同，只不过其表示调用是「尾调用 - Tail Call」。

指令对应的操作并没有进行尾调用的优化，作者的 [解释](https://bellard.org/quickjs/quickjs.html#FOOT6 "https://bellard.org/quickjs/quickjs.html#FOOT6") 为：

> We believe the current specification of tails calls is too complicated and presents limited practical interests.

`OP_tail_call` 指令内进行会执行 `goto done;` 的操作：

    if (opcode == OP_tail_call_method)
      goto done;
    

这点与 [OP\_return](#OP_return "#OP_return") 指令相同。所以，虽然 `OP_tail_call` 没有执行尾调用优化，但该指令依然会带来一点性能的提升 - 避免额外增加一个 `OP_return` 指令的执行开销。

### 尾调用

尾调用的意思是，函数的最后一条指令为另一个函数调用，比如：

    function a() {
      return b(); // 尾调用
    }
    
    function a(i) {
      if (i) {
        return b(); // 尾调用
      }
    }
    

一般的业务代码中，函数的调用嵌套层级不会太深。不过当尾调用的函数又为当前函数时，则会演化为尾递归（Tail Recursion）

递归调用则可能会存在调用的嵌套层数过深，给调用栈的造成内存压力的问题（递归调又有可以分为直接递归和间接递归，这里就不展开讨论了）

虽然 QuickJS 未实现标准中描述的尾调用优化，但其他引擎中已经实现了，所以我们有必要稍微进一步地了解一下尾调用和其优化：

1.  QuickJS 中函数调用（或者递归调用）的内存开销
    
2.  为什么尾调用可以被优化，以及如何优化
    

### 函数调用的内存开销

首先了解一下 QuickJS 中执行 JS 函数调用时的方式以及内存开销

`OP_tail_call` 的前半段执行方式和 `OP_call` 一致，都可以概括为

1.  构造实参数组，实参存在于 Caller 的操作数栈中（当实参数目小于形参数目时，在 Caller 内会有 [Dup](https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L126 "https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L126") 操作）
    
2.  通过执行 C 函数 `JS_CallInternal` 的调用，来执行 Callee 函数
    
3.  由于 `JS_CallInternal` 是 C 调用，所以它存在对 C 语言调用栈的消耗
    
4.  每次 `JS_CallInternal` 调用还会 [开辟新的堆空间](https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L121 "https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L121") 以存放 JS 层面的操作数栈
    

由于 1 的消耗较低（增加引用计数），所以简单来看，每次 JS 函数调用，主要的消耗为 `JS_CallInternal` 产生的上述 3、4 两步。

假设有下面的 JS 代码：

    function acc(cur, next) {
      if (next === 0) return cur;
      return acc(cur + next, next - 1);
    }
    

当执行 `acc(5, 4)` 时，对应的 `JS_CallInternal` 调用为：

    JS_CallInternal: acc, 5, 4
      JS_CallInternal: acc, 9, 3
        JS_CallInternal: acc, 12, 2
          JS_CallInternal: acc, 14, 1
            JS_CallInternal: acc, 15, 0
    

> 上面的例子中，通过缩进表示了嵌套调用。由于 `JS_CallInternal` 是 C 调用，所以它第一个参数是被调的 JS 函数对象

结合上面提到的每次 `JS_CallInternal` 的内存消耗，可以发现当嵌套层数很深之后，将会产生不少的内存开销

### 尾调用优化

尾调用之所以可以被优化，重点就在于「尾」的定义 - 函数执行的最后一个动作：

    // A
    function fib(i, cur = 0, next = 1) {
      if (i === 0) return cur;
      return fib(i - 1, next, cur + next); // B
    }
    

我们假设 Caller 为 A，A 内部调用了 B。可以发现在调用 B 时，A 的执行状态已经没有继续保存的意义了（操作数栈和其 PC、SP）。

> 虽然 QuickJS 中 A 的操作数栈可能还是需要的，因为它上面放置了 B 的实参。但这是 QuickJS 的实现差异，和上面的通用描述并不冲突

了解问题之后，优化的方式就变得比较简单 - 释放 A 的调用栈所占的内存（B 执行时复用 A 的调用栈）。

下面将运行一些试验脚本，来体验执行效率上的差异。首先是「一般的递归调用」，对比它们改写为尾调用后的执行效率的差异：

    let fibTimes = 0;
    function fib(i) {
      fibTimes++;
    
      if (i === 0) return 0;
      if (i === 1) return 1;
      return fib(i - 1) + fib(i - 2);
    }
    
    let fibTailCallTimes = 0;
    function fibTailCall(i, cur = 0, next = 1) {
      fibTailCallTimes++;
    
      if (i === 0) return cur;
      return fibTailCall(i - 1, next, cur + next);
    }
    
    console.time("fib");
    const a = fib(40);
    console.timeEnd("fib");
    console.log(`fibTimes: ${fibTimes}`);
    
    console.time("fibTailCall");
    const b = fibTailCall(40);
    console.timeEnd("fibTailCall");
    console.log(`fibTailCallTimes: ${fibTailCallTimes}`);
    
    console.assert(a === b);
    

使用 node 执行上面的脚本，结果为：

    fib: 1.538s
    fibTimes: 331160281
    fibTailCall: 0.058ms
    fibTailCallTimes: 41
    

可以发现改写为对等的尾调用的形式后：

*   调用次数发生了明显的减少，从 331160281 次 降低至 41 次
    
*   执行时间也大大减少，从 1.538s 下降到 0.058ms
    

执行时间的减少，主要还是归功于调用次数的大大减少，所以不能很直观的看出尾调用优化后的性能提升。

为了体验尾调用的优化效果，可以分别使用 node 和 qjs 执行下面的代码：

    let fibTailCallTimes = 0;
    function fibTailCall(i, cur = 0, next = 1) {
      fibTailCallTimes++;
    
      if (i === 0) return cur;
      return fibTailCall(i - 1, next, cur + next);
    }
    
    // 先设定较小的值，看下尾调用在 Node 和 qjs 中的基础执的行效率差异
    let i = 3;
    if (console.time) {
      console.time("node-fibTailCall");
      fibTailCall(i);
      console.timeEnd("node-fibTailCall");
      console.log(`node-fibTailCallTimes: ${fibTailCallTimes}`);
    } else {
      let s = globalThis.__date_clock();
      fibTailCall(i);
      console.log("qis-fibTailCall: " + (globalThis.__date_clock() - s) / 1000);
      console.log("qis-fibTailCallTimes: " + fibTailCallTimes);
    }
    

执行结果为：

    # node
    node-fibTailCall: 0.071ms
    node-fibTailCallTimes: 4
    
    # qjs
    qis-fibTailCall: 0.013916015625
    qis-fibTailCallTimes: 4
    

可以发现 qjs 的执行效率要优于 node，继续将 i 调整为 `1000` 后的执行结果：

    # node
    node-fibTailCall: 0.187ms
    node-fibTailCallTimes: 1001
    
    # qjs
    qis-fibTailCall: 0.59912109375
    qis-fibTailCallTimes: 1001
    

> qjs 需要提高 stack-size 来完成 1001 次嵌套调用：`--stack-size 4294967296`

从上面的执行结果中可以发现，随着调用次数的增加，尾递归优化的效果会逐渐体现出来。

OP\_call\_constructor
---------------------

[OP\_call](#OP_call "#OP_call") 功能类似，操作数为紧跟指令其后的 2 字节，表示实参个数。

OP\_call\_method
----------------

指令与 [OP\_call](#OP_call "#OP_call") 功能类似，操作数为紧跟指令其后的 2 字节，表示实参个数。

与 `OP_call` 的差别在于：

1.  调用 `JS_CallInternal` 时会传递 `thisObj`
    
    `thisObj` 也在操作数栈中，因此在调用 \`\`JS\_CallInternal\` 时操作数栈中的内容类似：
    
        -> TOP
        thisObj, funcObj, arg1, ..., argN
        
    
2.  调用结束后会释放 `thisObj`
    
         // -2 的位置为 `thisObj`
         for(i = -2; i < call_argc; i++)
           JS_FreeValue(ctx, call_argv[i]);
        
    

OP\_tail\_call\_method
----------------------

与 [OP\_call\_method](#OP_call_method "#OP_call_method") 功能相似。

OP\_array\_from
---------------

指令

阶段

字长（指令 + 操作数）

OP\_array\_from

3

1 = 1 + 2

操作数:

序号

作用

位置

字长

#1

数组元素个数

代码段

2

创建一个数组对象，操作数为数组元素的个数，字长为 2 字节。数组元素存在于操作数栈之上

创建对象的方法是 [JS\_NewArray](https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2878 "https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2878")，内部会使用 `JS_CLASS_ARRAY` 作为对象的模板。

使用 `JS_CLASS_ARRAY` 为模板创建的对象其头部的 `fast_array` 将为 `1`，后续访问和设置属性时将采用数组的形式

OP\_apply
---------

指令

阶段

字长（指令 + 操作数）

OP\_apply

3

1 = 1 + 2

操作数:

序号

作用

位置

字长

#1

调用类型

代码段

2

使用指定的 `this` 和参数列表来调用函数。操作数字长为 2 字节，表示调用的类型，有 3 中取值：

*   `0` 表示 [Function.prototype.apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply")
    
*   `1` 表示 [JS\_CallConstructor2](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L330 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L330")
    
*   `2` 表示 [Reflect.apply](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply "https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply")
    

其中 `0` 和 `2` 的语义相似。`1` 会做一些执行构造函数所必须的操作。

指令调用时，操作数栈上的内容类似：

    -> TOP
    fnObj, thisObj, argsArray
    

指令内部的执行是通过函数 [js\_function\_apply](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L361 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L361") 来完成，对应的传参方式为：

    ret_val = js_function_apply(ctx, sp[-3], 2, (JSValueConst *)&sp[-2], magic)
    

OP\_return
----------

指令

阶段

字长（指令 + 操作数）

OP\_return

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

表示函数调用结束，会跳转到 [done](https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L2516 "https://github.com/hsiaosiyuan0/quickjs/blob/fc0383e2dbef784040da1f0e49ae2711984d3fea/src/vm/exec.c#L2516") 以执行下面的操作：

*   释放捕获的对象，也就是闭包中的对象
    
        if (unlikely(!list_empty(&sf->var_ref_list))) {
            /* variable references reference the stack: must close them */
            close_var_refs(rt, sf);
        }
        
    
*   释放局部变量以及操作数栈上的元素
    
        for(pval = local_buf; pval < sp; pval++) {
            JS_FreeValue(ctx, *pval);
        }
        
    
*   弹出 JS 层面的调用栈
    
        rt->current_stack_frame = sf->prev_frame;
        
    
*   结束 C 调用 `JS_CallInternal`，对应的 C 调用栈也被弹出（这点是由 C 语言的调用约定保证的）
    

OP\_return\_undef
-----------------

与 [OP\_return](#OP_return "#OP_return") 指令类似，只不过将其对应的 `JS_CallInternal` 调用的返回值设置为 `JS_UNDEFINED`

OP\_check\_ctor\_return
-----------------------

指令

阶段

字长（指令 + 操作数）

OP\_check\_ctor\_return

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

语言规范中规定了派生类的构造函数的返回值必须为 undefined 或者一个对象，该指令的作用是校验构造函数的返回值是否满足该条件。

当构造函数中使用了显式地 return 语句时，将产生该指令：

考虑下面的代码：

    class A {}
    
    class B extends A {
      constructor() {
        return a;
      }
    }
    

派生类 B 的构造函数对应的字节码为：

    ;;   constructor() {
    
        4  38 40 02 00 00             get_var a
        9  2A                         check_ctor_return
       10  EA 05                      if_false8 16
       12  0E                         drop
       13  62 00 00                   get_loc_check 0: this
       16  28                    16:  return
    
    ;;     return a;
    ;;   }
    

指令执行时，栈顶元素为 return 语句的返回值：

*   如果该值不是对象，且不是 undefined，那么将抛出运行时错误，提示「derived class constructor must return an object or undefine」
    
*   如果该值是对象，那么返回值为该对象
    
*   如果该值是 undefined，那么则将该值从栈中弹出并丢弃，返回 this
    

OP\_check\_ctor
---------------

指令

阶段

字长（指令 + 操作数）

OP\_check\_ctor

3

1

指令用于确保构造函数使用 `new` 的方式调用：

    class F {}
    let a = F(); // `OP_check_ctor` 确保这样的调用会报错
    

OP\_check\_brand
----------------

指令

阶段

字长（指令 + 操作数）

OP\_check\_brand

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 2 个元素

操作数栈

n/a

当类中包含了对私有方法的调用时，将会生成该指令，判断对象上是否包含了名为 `<brand>` 的私有属性。

比如下面的代码：

    class A {
      #a() {}
    
      b() {
        this.#a();
      }
    }
    

其中方法 `b` 对应的字节码为：

    ;; b() {
    
        0  08                         push_this
        1  C9                         put_loc0 0: this
    
    ;;     this.#a();
    
        2  C5                         get_loc0 0: this
        3  DD                         get_var_ref0 0: "#a"
        4  2C                         check_brand
        5  24 00 00                   call_method 0
    
    ;;   }
    

指令的操作数为：

    -> TOP
    obj, funObj_a
    

指令的内部操作通过函数 `JS_CheckBrand` 完成：

1.  首先校验 `funObj_a` 的 `[[HomeObject]]` 对象上是否包含了 `<brand>` 属性，该属性的值为一个 Symbol 对象 S
    
2.  再验证待访问对象 `obj` 上是否包含该键为 S 的属性，以此来验证方法 `#a` 是否为待访问对象的方法
    

指令不会变动操作数栈上的内容。

OP\_add\_brand
--------------

指令

阶段

字长（指令 + 操作数）

OP\_add\_brand

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 2 个元素

操作数栈

n/a

指令的操作数有 2 个，分别是：

    -> TOP
    obj, homeObj
    

指令内的操作如下：

1.  在 `homeObj` 上增加一个名为 `<brand>` 的属性 B，该属性的值为一个 Symbol 对象 S
    
2.  在 `obj` 使用 S 为键增加一个属性
    

指令会弹出并释放其操作数。

OP\_throw
---------

指令

阶段

字长（指令 + 操作数）

OP\_throw

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

指令的作用是抛出异常，操作数栈顶为待抛出的对象

内部执行的流程大致为：

1.  将栈顶的待抛出对象记录到 `rt->current_exception` 中
    
2.  将异常发生时的调用栈的信息，记录到 `rt->current_exception` 对象的 `stack` 属性中
    
3.  将 `JS_CallInternal` 的返回值设置为 `JS_EXCEPTION`，这样其 Caller 会感知到发生了异常
    
4.  执行和 [OP\_return](#OP_return "#OP_return") 相同的收尾工作
    

OP\_throw\_error
----------------

指令

阶段

字长（指令 + 操作数）

OP\_throw\_error

3

6 = 1 + 4 + 1

操作数:

序号

作用

位置

字长

#1

错误提示的 JSAtom

代码段

4

#2

异常类型

代码段

1

`OP_throw_error` 指令的作用是，抛出引擎执行时内部执行语义校验失败时的异常

操作数字长为紧跟指令其后的 5 个字节：

*   前 4 个字节一起为 `uint32_t` 类型，表示错误消息字符串对应的 JSAtom
    
*   最后一个字节，表示操作的类型
    

考虑下面的代码：

    const a = 1;
    a = 2; // TypeError: 'a' is read-only
    

异常抛出后的操作与 [OP\_throw](#OP_throw "#OP_throw") 指令相同。

OP\_eval
--------

指令

阶段

字长（指令 + 操作数）

OP\_eval

3

6 = 1 + 4 + 1

操作数:

序号

作用

位置

字长

#1

实参个数

代码段

2

#2

scope 索引

代码段

2

`OP_eval` 指令有 2 个作用：

1.  支持 eval 表达式
    
2.  执行一个函数调用
    

如果 callee 是 eval 函数的话，那么就执行的 eval 表达式，否则使用 `JS_CallInternal` 发起一个函数调用

该指令有 2 个参数：

1.  代码段的 2 字节字长，表示 eval 的实参个数
    
2.  代码段中紧跟上一个操作数之后的 2 字节字长，表示 scope 索引。如果是 `JS_CallInternal` 该参数将无关紧要
    

指令的执行会将实参和 callee 都从栈上弹出，并将 eval 或者 `JS_CallInternal` 的返回值压入栈顶。

OP\_regexp
----------

指令

阶段

字长（指令 + 操作数）

OP\_regexp

3

1

操作数:

序号

作用

位置

字长

#1

栈顶在内的 2 个元素

操作数栈

n/a

指令的作用是创建一个正则对象。

指令调用时，操作数栈上的内容为：

    -> TOP
    regPattern, regBytecode
    

> qjs 中会将正则也编译为字节码

正则对象的创建通过 [js\_regexp\_constructor\_internal](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/regexp.c#L87 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/intrins/regexp.c#L87") 方法完成。

OP\_get\_super
--------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_super

3

1

指令的作用是，获取栈顶元素的 `prototype`，并替换栈顶元素

OP\_import
----------

指令

阶段

字长（指令 + 操作数）

OP\_regexp

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

执行 `import()` 对应的语义，所以栈顶元素为导入路径

导入操作通过调用 [js\_dynamic\_import](https://github.com/hsiaosiyuan0/quickjs/blob/c8df07b724d71d72b7cf181434df73b418b9415d/src/vm/mod.c#L1145 "https://github.com/hsiaosiyuan0/quickjs/blob/c8df07b724d71d72b7cf181434df73b418b9415d/src/vm/mod.c#L1145") 完成。

OP\_check\_var
--------------

指令

阶段

字长（指令 + 操作数）

OP\_regexp

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

指令的作用是校验赋值表达式中、等号左边的变量是否已定义。操作数为紧跟指令其后的 4 字节，表示变量名的 JSAtom。

变量定义的校验通过调用 [JS\_CheckGlobalVar](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/vm.c#L790 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/vm.c#L790") 完成，验证的结果（JS\_Bool）压入操作数栈，成为栈顶元素，带校验的对象保留在操作数栈中。

只有赋值操作发生在 [Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode") 下时，才会生成该指令。

校验结果将会被 [OP\_put\_var\_strict](#OP_put_var_strict "#OP_put_var_strict") 指令所利用，以决定是否抛出 `ReferenceError`：

    "use strict";
    
    function fn() {
      a = 1;
    }
    

生成的字节码为：

    ;; function fn() {
    ;;   a = 1;
    
        0  36 40 02 00 00             check_var a
        5  B6                         push_1 1
        6  3B 40 02 00 00             put_var_strict a
    
    ;; }
    

OP\_get\_var\_undef
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_var\_undef

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

指令的作用是，获取全局变量。操作数为紧跟指令其后 4 字节，表示变量名的 JSAtom。

全局变量的获取操作通过 [JS\_GetGlobalVar](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/vm.c#L735 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/vm/vm.c#L735") 完成。获取的值会压入操作数栈，成为栈顶元素。

如果变量未定义，则将 `JS_UNDEFINED` 压入栈顶。

该指令目的是处理 `typeof` 表达式：

    typeof a;
    

对应的指令为：

    0  37 3E 02 00 00             get_var_undef a
    5  97                         typeof
    6  CD                         set_loc0 0: "<ret>"
    7  28                         return
    

OP\_get\_var
------------

指令与 [OP\_get\_var\_undef](#OP_get_var_undef "#OP_get_var_undef") 类似，只不过在变量未定义时，抛出异常。

该指令会将变量的引用计数加一。

OP\_put\_var
------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_var

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

指令的作用是，设置全局变量。操作数为紧跟指令其后的 4 字节字长，表示待设置的全局变量名对应的 JSAtom，栈顶元素为待设置的值。

在 [Sloppy mode](https://developer.mozilla.org/en-US/docs/Glossary/Sloppy_mode "https://developer.mozilla.org/en-US/docs/Glossary/Sloppy_mode") 下，可以通过两种方式产生全局变量：

1.  在全局作用域下使用 `var` 定义的变量
    
2.  在任意作用域下，对未定义的变量进行赋值
    

以上两种情况都会生成 `OP_put_var` 指令。

在 Strict mode 下，赋值操作则会通过 [OP\_check\_var](#OP_check_var "#OP_check_var") 和 [OP\_put\_var\_strict](#OP_put_var_strict "#OP_put_var_strict") 搭配完成，以确保上述第 2 种情况是非法的

OP\_put\_var\_init
------------------

指令的作用是，设置全局变量，其与 [OP\_put\_var](#OP_put_var "#OP_put_var") 有 2 个主要差别：

1.  变量是通过 `let|const` 定义的
    
2.  在执行该指令之前，变量一定是通过 [OP\_define\_var](#OP_define_var "#OP_define_var") 定义过的，所以 `OP_put_var_init` 指令实现中没有 `OP_put_var` 指令中「如果没有定义就设定一个」的操作
    

    let a = 1;
    

对应的指令为：

     0  3F 3E 02 00 00 80          check_define_var a,128
     6  3E 3E 02 00 00 80          define_var a,128
    12  B6                         push_1 1
    13  3A 3E 02 00 00             put_var_init a
    18  C5                         get_loc0 0: "<ret>"
    19  28                         return
    

OP\_put\_var\_strict
--------------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_var\_strict

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

指令的作用是，设置全局变量。操作数为紧跟指令其后的 4 字节字长，表示带设置的全局变量名对应的 JSAtom。

指令执行时操作数栈的内容为：

    -> TOP
    JS_Bool, JSValue
    

*   栈顶第 1 个元素类型为 JSValue，表示待设置的值
    
*   栈顶第 2 个元素类型为 JS\_Bool，表示变量是否已定义
    

栈顶第 2 元素的值来源于指令 [OP\_check\_var](#OP_check_var "#OP_check_var") 的操作结果，因此两个指令需要搭配使用，在严格模式下会生成这对指令：

    "use strict";
    
    a = 1;
    

上面代码生成的指令为：

      0  04 3E 02 00 00             push_atom_value "use strict"
      5  C9                         put_loc0 0: "<ret>"
      6  36 3F 02 00 00             check_var a
     11  B6                         push_1 1
     12  15                         insert2
     13  3B 3F 02 00 00             put_var_strict a
     18  CD                         set_loc0 0: "<ret>"
     19  28                         return
    

除了校验变量是否已定义外，该指令还会校验变量是否是只读的，即使用的 `const` 定义。

OP\_check\_define\_var
----------------------

指令

阶段

字长（指令 + 操作数）

OP\_check\_define\_var

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

指令的作用是，校验是否可以定义某个全局变量。操作数为紧跟指令其后的 4 字节字长，表示变量名对应的 JSAtom。

下面的两种情况会校验不通过：

1.  如果全局变量定义使用 `let|const`，且在全局对象上已经存在同名属性，且该属性未设置 `JS_PROP_CONFIGURABLE` 标志位
    
        let Infinity = 1; // SyntaxError: redeclaration of 'Infinity'
        // or
        let NaN = 1; // SyntaxError: redeclaration of 'NaN'
        
    
2.  如果全局变量的定义是通过函数声明语句引入的，且全局对象上已经存在同名属性，且该属性的标志位设定满足：
    
        if (!(prs->flags & JS_PROP_CONFIGURABLE) &&
          ((prs->flags & JS_PROP_TMASK) == JS_PROP_GETSET ||
            ((prs->flags & (JS_PROP_WRITABLE | JS_PROP_ENUMERABLE)) !=
            (JS_PROP_WRITABLE | JS_PROP_ENUMERABLE)))) {}
        
    
    即：
    
        !不可配置 && (是GetterOrSetter || 不可写 || 不可枚举);
        
    
    比如：
    
        function NaN() {} // TypeError: cannot define variable 'NaN'
        
    

由于 JS 语言标准中的 [Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting")，`OP_check_define_var` 会成为入口函数的第一条指令

OP\_define\_var
---------------

指令

阶段

字长（指令 + 操作数）

OP\_define\_var

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

指令的作用是，定义全局变量。操作数为紧跟指令其后的 4 字节字长，表示变量名的 JSAtom。

使用 `let|const` 定义的全局变量，具有下面的特性：

*   都具有标志位 `JS_PROP_ENUMERABLE` 和 `JS_PROP_CONFIGURABLE`
    
*   使用 `const` 定义的全局变量，没有标志位 `JS_PROP_WRITABLE`，表示只读
    
*   初始值为 `JS_UNINITIALIZED`
    

显式地使用 `var` 定义的变量才会对应该指令，具有下面的特性：

*   具有标志位 `JS_PROP_ENUMERABLE` 和 `JS_PROP_WRITABLE`，没有标志位 `JS_PROP_CONFIGURABLE`
    
*   初始值为 `JS_UNDEFINED`
    

OP\_define\_func
----------------

指令

阶段

字长（指令 + 操作数）

OP\_define\_func

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

函数名 JSAtom

代码段

4

指令的作用是，定义全局函数。操作数为紧跟指令其后的 4 字节字长，表示函数名的 JSAtom

指令执行时，栈顶元素为函数对象，指令会弹出栈顶元素，设置为全局对象上对应的属性值，属性会具有标志位：

*   `JS_PROP_ENUMERABLE`
    
*   `JS_PROP_WRITABLE`
    
*   `JS_PROP_HAS_CONFIGURABLE`
    
*   `JS_PROP_HAS_WRITABLE`
    
*   `JS_PROP_HAS_ENUMERABLE`
    

OP\_get\_loc
------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_loc

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

局部变量的索引

代码段

2

指令的作用是，将局部变量的值压入操作数栈中。操作数为紧跟指令其后的 2 字节内容，表示局部变量的索引。

局部变量以数组的形式存在于堆上，通过 `sf->var_buf` 访问，因此可以通过指针偏移快速找到某个变量。变量到其索引的映射关系，是在编译阶段处理的

指令会将变量的引用计数加一。

OP\_put\_loc
------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_loc

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

局部变量的索引

代码段

2

指令的作用是，对局部变量进行赋值。操作数为紧跟指令其后的 2 字节内容，表示局部变量的索引。

指令执行时，操作数栈顶元素为右值。指令执行时会根据变量的索引设定 `sf->var_buf` 中的元素。变量到其索引的映射关系，是在编译阶段处理的。

该指令不会增加变量的引用计数。引用计数的正确性是通过前置指令保证的：

*   当右值为表达式的运算结果时，由于右值也是新产生的对象，所以引用计数为 1，此时变量也是新对象的所有权的唯一持有者，所以无需额外增加引用计数
    
*   当右值为全局变量时，该指令的前置指令为 [OP\_get\_var](#OP_get_var "#OP_get_var")，通过后者完成对右值的引用计数的加 1 操作
    
*   当右值为形参时，该指令的前置指令为 [OP\_get\_arg](#OP_get_arg "#OP_get_arg")，通过后者完成对右值的引用计数的加 1 操作
    

OP\_set\_loc
------------

指令

阶段

字长（指令 + 操作数）

OP\_set\_loc

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

局部变量的索引

代码段

2

指令的作用是，对局部变量进行赋值，同时将右值的引用计数加 1。操作数为紧跟指令其后的 2 字节长度，表示局部变量的索引。变量到其索引的映射关系，是在编译阶段处理的。

指令运行时栈顶元素为右值对象，指令内执行赋值操作时对右值的引用计数进行加 1 操作，赋值后栈顶元素不变，依然为该右值。

对于下面的代码：

    function f() {
      var c = 1;
      var d = c;
    }
    

原本对应的指令是：

    push_1 1          # 将字面量对象压入操作数栈
    put_loc0 0: c     # 使用栈顶的对象字面量设定局部变量 c
    get_loc0 0: c     # 将局部变量的值压入栈顶，同时对其引用计数加一
    put_loc1 1: d     # 将栈顶元素赋值给局部变量 d，赋值后弹出栈顶元素
    

使用 `OP_set_loc` 指令对上面的指令集优化后：

    push_1 1          # 将对象字面量压入操作数栈顶
    set_loc0 0: c     # 使用栈顶元素设置局部变量 c，同时对栈顶元素引用计数加一，并且赋值后保留栈顶元素
    put_loc1 1: d     # 将栈顶元素赋值给局部变量 d，赋值后弹出栈顶元素
    

可以发现针对上面的代码，使用 `OP_set_loc` 可以减少一个指令的执行，从而提到执行效率。

OP\_get\_arg
------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_arg

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

参数的索引

代码段

2

指令的作用是，将实参的值压入操作数栈顶，同时对实参的值对象的引用计数加一。操作数为紧跟指令其后的 2 字节长度，表示实参的索引。

实参参以数组（连续内存）的形式保存在堆上，可以通过 `sf->arg_buf` 访问到实参数组。实参到其索引的映射关系，是在编译阶段处理的。

OP\_put\_arg
------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_arg

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

参数的索引

代码段

2

指令的作用是，设定实参的值。操作数为紧跟指令其后的 2 字节字长，表示实参的索引。

实参以数组（连续内存）的形式保存在堆上，可以通过 `sf->arg_buf` 访问到实参数组。实参到其索引的映射关系，是在编译阶段处理的。

该指令不会对右值的引用计数进行加一操作。右值的引用计数是通过前置指令保证的：

*   当右值为表达式的运算结果时，由于右值也是新产生的对象，所以引用计数为 1，此时变量也是新对象的所有权的唯一持有者，所以无需额外增加引用计数
    
*   当右值为全局变量时，该指令的前置指令为 [OP\_get\_var](#OP_get_var "#OP_get_var")，通过后者完成对右值的引用计数的加 1 操作
    
*   当右值为实参时，该指令的前置指令为 [OP\_get\_arg](#OP_get_arg "#OP_get_arg")，通过后者完成对右值的引用计数的加 1 操作
    

OP\_set\_arg
------------

指令

阶段

字长（指令 + 操作数）

OP\_set\_arg

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

参数的索引

代码段

2

指令的作用与 [OP\_put\_arg](#OP_put_arg "#OP_put_arg") 类似，不过该指令会对栈顶的右值对象进行引用计数加 1 的操作，且指令执行完毕后，栈顶元素依然为右值对象。

OP\_get\_loc8
-------------

指令与 [OP\_get\_loc](#OP_get_loc "#OP_get_loc") 类似，不过操作数为紧跟指令其后的 1 字节字长，表示局部变量的索引。

OP\_put\_loc8
-------------

指令与 [OP\_put\_loc](#OP_put_loc "#OP_put_loc") 类似，不过操作数为紧跟指令其后的 1 字节字长，表示局部变量的索引。

OP\_set\_loc8
-------------

指令与 [OP\_set\_loc](#OP_set_loc "#OP_set_loc") 类似，不过操作数为紧跟指令其后的 1 字节字长，表示局部变量的索引。

OP\_get\_loc0
-------------

指令与 [OP\_get\_loc](#OP_get_loc "#OP_get_loc") 类似，不过操作数为常量 0。

OP\_get\_loc1
-------------

指令与 [OP\_get\_loc](#OP_get_loc "#OP_get_loc") 类似，不过操作数为常量 1。

OP\_get\_loc2
-------------

指令与 [OP\_get\_loc](#OP_get_loc "#OP_get_loc") 类似，不过操作数为常量 2。

OP\_get\_loc3
-------------

指令与 [OP\_get\_loc](#OP_get_loc "#OP_get_loc") 类似，不过操作数为常量 3。

OP\_put\_loc0
-------------

指令与 [OP\_put\_loc](#OP_put_loc "#OP_put_loc") 类似，不过操作数为常量 0。

OP\_put\_loc1
-------------

指令与 [OP\_put\_loc](#OP_put_loc "#OP_put_loc") 类似，不过操作数为常量 1。

OP\_put\_loc2
-------------

指令与 [OP\_put\_loc](#OP_put_loc "#OP_put_loc") 类似，不过操作数为常量 2。

OP\_put\_loc3
-------------

指令与 [OP\_put\_loc](#OP_put_loc "#OP_put_loc") 类似，不过操作数为常量 3。

OP\_set\_loc0
-------------

指令与 [OP\_set\_loc](#OP_set_loc "#OP_set_loc") 类似，不过操作数为常量 0。

OP\_set\_loc1
-------------

指令与 [OP\_set\_loc](#OP_set_loc "#OP_set_loc") 类似，不过操作数为常量 1。

OP\_set\_loc2
-------------

指令与 [OP\_set\_loc](#OP_set_loc "#OP_set_loc") 类似，不过操作数为常量 2。

OP\_set\_loc3
-------------

指令与 [OP\_set\_loc](#OP_set_loc "#OP_set_loc") 类似，不过操作数为常量 3。

OP\_get\_arg0
-------------

指令与 [OP\_get\_arg](#OP_get_arg "#OP_get_arg") 类似，不过操作数为常量 0。

OP\_get\_arg1
-------------

指令与 [OP\_get\_arg](#OP_get_arg "#OP_get_arg") 类似，不过操作数为常量 1。

OP\_get\_arg2
-------------

指令与 [OP\_get\_arg](#OP_get_arg "#OP_get_arg") 类似，不过操作数为常量 2。

OP\_get\_arg3
-------------

指令与 [OP\_get\_arg](#OP_get_arg "#OP_get_arg") 类似，不过操作数为常量 3。

OP\_put\_arg0
-------------

指令与 [OP\_put\_arg](#OP_put_arg "#OP_put_arg") 类似，不过操作数为常量 0。

OP\_put\_arg1
-------------

指令与 [OP\_put\_arg](#OP_put_arg "#OP_put_arg") 类似，不过操作数为常量 1。

OP\_put\_arg2
-------------

指令与 [OP\_put\_arg](#OP_put_arg "#OP_put_arg") 类似，不过操作数为常量 2。

OP\_put\_arg3
-------------

指令与 [OP\_put\_arg](#OP_put_arg "#OP_put_arg") 类似，不过操作数为常量 3。

OP\_set\_arg0
-------------

指令与 [OP\_set\_arg](#OP_set_arg "#OP_set_arg") 类似，不过操作数为常量 0。

OP\_set\_arg1
-------------

指令与 [OP\_set\_arg](#OP_set_arg "#OP_set_arg") 类似，不过操作数为常量 1。

OP\_set\_arg2
-------------

指令与 [OP\_set\_arg](#OP_set_arg "#OP_set_arg") 类似，不过操作数为常量 2。

OP\_set\_arg3
-------------

指令与 [OP\_set\_arg](#OP_set_arg "#OP_set_arg") 类似，不过操作数为常量 3。

OP\_get\_var\_ref0
------------------

指令与 [OP\_get\_var\_ref0](#OP_get_var_ref "#OP_get_var_ref") 类似，不过操作数为常量 0。

OP\_get\_var\_ref1
------------------

指令与 [OP\_get\_var\_ref0](#OP_get_var_ref "#OP_get_var_ref") 类似，不过操作数为常量 0。

OP\_get\_var\_ref2
------------------

指令与 [OP\_get\_var\_ref0](#OP_get_var_ref "#OP_get_var_ref") 类似，不过操作数为常量 0。

OP\_get\_var\_ref3
------------------

指令与 [OP\_get\_var\_ref0](#OP_get_var_ref "#OP_get_var_ref") 类似，不过操作数为常量 0。

OP\_put\_var\_ref0
------------------

指令与 [OP\_put\_var\_ref](#OP_put_var_ref "#OP_put_var_ref") 类似，不过操作数为常量 0。

OP\_put\_var\_ref1
------------------

指令与 [OP\_put\_var\_ref](#OP_put_var_ref "#OP_put_var_ref") 类似，不过操作数为常量 0。

OP\_put\_var\_ref2
------------------

指令与 [OP\_put\_var\_ref](#OP_put_var_ref "#OP_put_var_ref") 类似，不过操作数为常量 0。

OP\_put\_var\_ref3
------------------

指令与 [OP\_put\_var\_ref](#OP_put_var_ref "#OP_put_var_ref") 类似，不过操作数为常量 0。

OP\_set\_var\_ref0
------------------

指令与 [OP\_set\_var\_ref](#OP_set_var_ref "#OP_set_var_ref") 类似，不过操作数为常量 0。

OP\_set\_var\_ref1
------------------

指令与 [OP\_set\_var\_ref](#OP_set_var_ref "#OP_set_var_ref") 类似，不过操作数为常量 1。

OP\_set\_var\_ref2
------------------

指令与 [OP\_set\_var\_ref](#OP_set_var_ref "#OP_set_var_ref") 类似，不过操作数为常量 2。

OP\_set\_var\_ref3
------------------

指令与 [OP\_set\_var\_ref](#OP_set_var_ref "#OP_set_var_ref") 类似，不过操作数为常量 3。

OP\_get\_var\_ref
-----------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_var\_ref

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

闭包变量索引

代码段

2

指令的作用是，将函数捕获的变量压入操作数栈中，压入前会对其进行引用计数加一的操作。操作数为紧跟指令其后的 2 字节字长，表示捕获变量的索引。

函数捕获的上层作用域中的变量都保存在函数对象的 `var_refs` 字段中，字段值为对象的连续内存，因此可以通过指针偏移快速访问。捕获变量到其索引的映射关系，是在编译阶段处理的。

OP\_put\_var\_ref
-----------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_var\_ref

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

闭包变量索引

代码段

2

指令的作用是，将闭包变量压入操作数栈顶。作数为紧跟指令其后的 2 字节字长，表示捕获变量的索引。捕获变量到其索引的映射关系，是在编译阶段处理的。

OP\_set\_var\_ref
-----------------

指令

阶段

字长（指令 + 操作数）

OP\_set\_var\_ref

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

闭包变量索引

代码段

2

指令的作用是，设定捕获变量的值。作数为紧跟指令其后的 2 字节字长，表示捕获变量的索引。捕获变量到其索引的映射关系，是在编译阶段处理的。

与 [OP\_put\_var\_ref](#OP_put_var_ref "#OP_put_var_ref") 指令不同，该指令除了会设定捕获变量的值意外，会保留位于栈顶的右值对象，并对其进行引用计数加一的操作。

OP\_get\_var\_ref\_check
------------------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_var\_ref\_check

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

闭包变量索引

代码段

2

指令的作用是，访问捕获的变量的值。操作数为紧跟指令其后的 2 字节字长，表示捕获变量的索引。捕获变量到其索引的映射关系，是在编译阶段处理的。

该指令会执行下面的操作：

*   将捕获的变量压入操作数栈顶，并将其引用计数加一，捕获的变量是使用 `let|const` 声明的
    
*   如果变量为 `JS_UNINITIALIZED` 的，则会抛出异常
    

使用 `let|const` 声明的变量将通过下面的方式初始化：

1.  首先使用 [set\_loc\_uninitialized](#set_loc_uninitialized "#set_loc_uninitialized") 指令将变量初始化为 `JS_UNINITIALIZED`
    
2.  如果是 `const` 定义的变量，那么在解析阶段就确保它一定有初始值，初始值的设定通过：
    
    1.  先使用 `push` 指令将初始值压入操作数栈顶
        
    2.  再使用 `put_loc` 将栈顶的初始值设置到变量中
        
3.  如果是 `let` 定义的变量，如果有初始值，那么使用 `const` 相同的处理方式，如果没有初始值，则通过指令的组合，将其值设置为 `undefined`
    

所以如果指令生成正确的话，变量的值应该不会为 `JS_UNINITIALIZED`，因此使用 `unlikely` 标记该分支属于稀有情况。

OP\_put\_var\_ref\_check
------------------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_var\_ref\_check

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

闭包变量索引

代码段

2

指令的作用是，设定捕获变量的值。操作数为紧跟指令其后的 2 字节字长，表示捕获变量的索引。捕获变量到其索引的映射关系，是在编译阶段处理的。

当设置的捕获变量是使用 `let|const` 声明时，将使用该指令确保变量是已初始化的。

OP\_put\_var\_ref\_check\_init
------------------------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_var\_ref\_check\_init

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

闭包变量索引

代码段

2

指令的作用主要用于校验 `this` 只能被初始化一次，该指令主要为了应对 eval 的情况。

考虑下面的代码：

    class B {}
    
    class A extends B {
      constructor() {
        eval(`super()`);
        eval(`super()`);
      }
    }
    

其中 eval 中代码对应的字节码为：

      opcodes:
        0  DF                         get_var_ref2 2: "this.active_func"
        1  34                         get_super
        2  DE                         get_var_ref1 1: "new.target"
        3  21 00 00                   call_constructor 0
        6  11                         dup
        7  67 00 00                   put_var_ref_check_init 0: this
       10  65 05 00                   get_var_ref_check 5: "<class_fields_init>"
       13  11                         dup
       14  EA 08                      if_false8 23
       16  65 00 00                   get_var_ref_check 0: this
       19  1B                         swap
       20  24 00 00                   call_method 0
       23  0E                    23:  drop
       24  CD                         set_loc0 0: "<ret>"
       25  28                         return
    

当第二个 eval 执行时，会因为 `put_var_ref_check_init` 发现 this 已经被初始化过而抛出运行时错误。

不过错误的内容有点问题，复用了 `JS_ThrowReferenceErrorUninitialized2`，因此提示消息为「未初始化」，而其实应该是「已初始化」。

    CASE(OP_put_var_ref_check_init):
      {
        int idx;
        idx = get_u16(pc);
        pc += 2;
        if (unlikely(!JS_IsUninitialized(*var_refs[idx]->pvalue))) { // 已初始化则报错
          JS_ThrowReferenceErrorUninitialized2(ctx, b, idx, TRUE); // 但是提示信息为「未初始化」
          goto exception;
        }
        set_value(ctx, var_refs[idx]->pvalue, sp[-1]);
        sp--;
      }
      BREAK;
    

OP\_set\_loc\_uninitialized
---------------------------

指令

阶段

字长（指令 + 操作数）

OP\_set\_loc\_uninitialized

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

局部变量索引

代码段

2

指令的作用是，设置局部变量的值为 `JS_UNINITIALIZED`。操作数为紧跟指令其后的 2 字节字长，表示局部变量的索引。变量到其索引的映射关系，是在编译阶段处理的

OP\_get\_loc\_check
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_loc\_check

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

局部变量索引

代码段

2

指令的作用是，确保变量是已初始化的，并将变量压入操作数栈顶。操作数为紧跟指令其后的 2 字节字长，表示局部变量的索引。变量到其索引的映射关系，是在编译阶段处理的

在构造函数中使用 `this` 将会生成该指令，确保 `this` 已经初始化

OP\_put\_loc\_check
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_loc\_check

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

局部变量索引

代码段

2

指令的作用是对局部变量赋值，赋值之前确保局部变量不为 `uninitialized`

该指令的操作数有 2 个：

1.  位于代码段的 4 字节字长，表示局部变量的索引
    
2.  栈顶元素，表示赋值内容
    

指令完成后，会弹出栈顶元素。

当形参中包含了表达式、且函数被包含 `let|const` 声明时，将产生该指令，比如下面的代码

    function f() {
      let a;
      a = 1;
    }
    

对应的字节码为：

        0  61 00 00                   set_loc_uninitialized 0: a
    
    ;;   let a ;
    
        3  06                         undefined
        4  C9                         put_loc0 0: a
    
    ;;   a = 1;
    
        5  B6                         push_1 1
        6  11                         dup
        7  63 00 00                   put_loc_check 0: a
    

对应的解释为：

1.  进入函数后首先将局部变量设置为 `uninitialized`
    
2.  随后 `let` 声明语句对应的指令 `put_loc0` 会覆盖 `uninitialized`
    
3.  接着进入赋值语句，`put_loc_check` 因为上一步的操作而通过 「局部变量不为 」 `uninitialized`校验，完成赋值
    

OP\_put\_loc\_check\_init
-------------------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_loc\_check\_init

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

局部变量索引

代码段

2

指令的作用是，确保变量未经初始化，即值为 `JS_UNINITIALIZED`。该指令的操作数为紧跟指令其后的 2 字节字长，表示局部变量的索引。变量到其索引的映射关系，是在编译阶段处理的

该指令在构造函数中使用 `super()` 时，确保 `this` 只初始化一次

OP\_close\_loc
--------------

指令

阶段

字长（指令 + 操作数）

OP\_close\_loc

3

3 = 1 + 2

操作数:

序号

作用

位置

字长

#1

闭包变量索引

代码段

2

指令的作用是，将当前调用栈中被其他函数捕获的变量引用计数加 1，并标记为 `is_detached`，这样调用结束后，释放局部变量的时候将有于引用计数大于 0 避免释放。

操作数为紧跟指令其后的 2 字节字长，表示被捕获的局部变量的索引。变量到其索引的映射关系，是在编译阶段处理的。

OP\_make\_loc\_ref
------------------

指令

阶段

字长（指令 + 操作数）

OP\_make\_loc\_ref

3

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#1

局部变量索引

代码段

2

指令主要用于解构赋值中，指令有 2 个操作数：

1.  代码段的 4 字节字长，表示变量名
    
2.  在代码段紧跟上一步的 2 字节字长，表示局部变量的索引
    

下面的代码：

    function f({ a }) {}
    
    f({});
    

会产生这样的字节码：

    ;; function f({ a }) {}
    
        0  D1                         get_arg0 0: "<null>"
        1  6F                         to_object
        2  11                         dup
        3  78 3F 02 00 00 00
           00                         make_loc_ref a,0
       10  1D                         rot3l
       11  41 3F 02 00 00             get_field a
       16  3D                         put_ref_value
       17  29                         return_undef
    

`OP_make_loc_ref` 的操作为：

1.  创建一个新的空对象 `newObj` 放在栈顶
    
2.  为 `newObj` 增加一个新的属性 `newProp`，属性名为 `a`
    
3.  将 `newProp` 指向局部变量 `a`，这样后续设置 `newProp` 的值时，会一并设置局部变量 `a` 的值
    
4.  将 `a` 对应的字符串对象压入栈顶
    

对于上面的字节码而言，`OP_make_loc_ref` 执行完毕后，栈中的元素为：

    -> TOP
    O_1, O_2, newObj, a
    

栈中元素的相应解释为：

*   `O_1` 为指令 `get_arg0` 和 `to_object` 的执行结果。`get_arg0` 将第一个实参压入了栈顶 `to_object` 将栈顶元素转换成对象
    
*   `O_2` 为 `dup` 指令的执行结果，它复制了栈顶元素 `O_1`，产生新对象 `O_2` 并压入栈顶
    
*   `newObj` 和 `a` 即为 `OP_make_loc_ref` 的操作结果
    

接着执行指令 `rot3l`，它会将栈顶的三个元素顺时针旋转，执行后栈中的元素变为：

    -> TOP
    O_1, newObj, a, O_2
    

接着执行指令 `get_field`，它会获取栈顶元素 `O_2` 的属性 `a` 的值，记为 `a_v` 并压入栈中，其中 `a` 是编译阶段确定的，因此存在于代码段、不必在操作数栈中取得。指令执行完毕后，栈中的内容变为

    -> TOP
    O_1, newObj, a, a_v
    

接着执行指令 `put_ref_value`，它会设置对象的属性，操作数分别为：

1.  要设置属性的变量，栈顶第 3 个元素 `sp[-3]`
    
2.  要设置属性的名称，栈顶第 2 个元素 `sp[-2]`
    
3.  要设置的属性值，栈顶元素 `sp[-1]`
    

对应到操作数栈中的内容，即将对象 `newObj` 的属性 `a` 的值设置为 `a_v`。上面也提到 `newObj` 的属性 `a` 和局部变量 `a` 引用同一个变量值，因此设置完毕后，局部变量 `a` 的值也会一并被设置为 `a_v`

设置完毕后，`put_ref_value` 会将 `newObj` 释放、并弹出栈顶的三个元素，栈中的元素变为：

    -> TOP
    O_1
    

不用担心 `O_1` 会产生内存泄露，在 `OP_return` 族的指令执行时，会释放局部变量和操作数栈上的活动元素。

另外一点有趣的地方在于，`return_undef` 前一个位置起初是生成了指令 `OP_dup` 的，这样可以在退出前释放掉 `O_1`，不过在 [resolve\_labels](https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/optim.c#L2039 "https://github.com/hsiaosiyuan0/quickjs/blob/1c3fe499f5a48cacccc59e57474d9acb4b07a981/src/parse/optim.c#L2039") 中被优化掉了

OP\_make\_arg\_ref
------------------

指令

阶段

字长（指令 + 操作数）

OP\_make\_arg\_ref

3

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#1

局部变量索引

代码段

2

下面的代码：

    function f(c) {
      var { c } = b;
    }
    

会产生下面的字节码：

    ;; function f(c) {
    ;;   var { c } = b;
    
        0  06                         undefined
        1  11                         dup
        2  F2                         is_undefined
        3  EB 13                      if_true8 23
        5  6F                     5:  to_object
        6  11                         dup
        7  79 3F 02 00 00 00
           00                         make_arg_ref c,0
       14  1D                         rot3l
       15  41 3F 02 00 00             get_field c
       20  3D                         put_ref_value
       21  0E                         drop
       22  29                         return_undef
       23  0E                    23:  drop
       24  38 40 02 00 00             get_var b
       29  EC E7                      goto8 5
    

指令的作用可以简单概括为，当解构赋值的目标为函数参数时，将通过该指令完成对参数的赋值。

`make_arg_ref` 的操作为：

1.  创建一个新的空对象 `newObj` 放在栈顶
    
2.  为 `newObj` 增加一个新的属性 `newProp`，属性名为 `c`
    
3.  将 `newProp` 指向实参 `c`，这样后续设置 `newProp` 的值时，会一并设置局部变量 `c` 的值
    
4.  将 `c` 对应的字符串对象压入栈顶
    

后续的操作与 [OP\_make\_loc\_ref](#OP_make_loc_ref "#OP_make_loc_ref") 相似。

上面的字节码中暴露出一个问题，当使用解构赋值时，会生成下面这段冗余的字节码序列：

        0  06                         undefined
        1  11                         dup
        2  F2                         is_undefined
        3  EB 13                      if_true8 23
    

`is_undefined` 会判断栈顶元素是否为 `undefined`，并将比较结果压入栈顶，因此 `if_true8` 将恒为 `true`。

解构赋值对应的字节码其实可以稍微简单一些，解构赋值本质上是一组合并的赋值语句，可以将它按语义拆分为单独的赋值语句，然后为每条赋值语句生成对应的字节码。

qjs 中生成这样的字节码是被自己的机制所限制，它希望在一次解析中就生成字节码，因为解析的顺序是由左往右，所以导致先生成了用于赋值的 `make_arg_ref` 序列，其后才是右值的获取 `get_var b`，这就需要两个跳转（`if_true8 23` 和 `goto8 5`）来翻转它们的执行顺序。

OP\_make\_var\_ref\_ref
-----------------------

指令

阶段

字长（指令 + 操作数）

OP\_make\_var\_ref\_ref

3

7 = 1 + 4 + 2

操作数:

序号

作用

位置

字长

#1

变量名 JSAtom

代码段

4

#1

局部变量索引

代码段

2

指令执行方式与 [OP\_make\_loc\_ref](#OP_make_loc_ref "#OP_make_loc_ref") 类似，当解构赋值的目标为闭包变量时，将通过该指令完成对闭包变量的赋值。

下面的代码：

    function f(c) {
      return function f1() {
        ({ c } = d);
      };
    }
    

对应的字节码为：

    ;; function f1() {
    ;;     ({ c } = d);
    
        0  EC 15                      goto8 22
        2  11                     2:  dup
        3  6F                         to_object
        4  11                         dup
        5  7A 3F 02 00 00 00
           00                         make_var_ref_ref c,0
       12  1D                         rot3l
       13  41 3F 02 00 00             get_field c
       18  3D                         put_ref_value
       19  0E                         drop
       20  EC 08                      goto8 29
       22  38 41 02 00 00        22:  get_var d
       27  EC E6                      goto8 2
    

OP\_make\_var\_ref
------------------

指令

阶段

字长（指令 + 操作数）

OP\_make\_var\_ref

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

全局变量名 JSAtom

代码段

4

指令的操作数为代码段的 4 字节字长、为 JSAtom，表示全局变量名

如果全局变量上包含待操作的变量名，那么会将全局变量 global 和变量名压入栈中，此时操作数栈内容为：

    -> TOP
    global, varName
    

如果全局变量上不包含待操作的变量名，那么会在原本压入 global 的位置，压入 undefined，操作数栈的内容为：

    -> TOP
    undefined, varName