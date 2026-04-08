OP\_goto
--------

指令

阶段

字长（指令 + 操作数）

OP\_goto

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

指令的操作数为代码段的相对当前 pc 位置的后面 4 字节字长的待跳转地址的偏移量，指令执行后会将 pc 指针累加该偏移量以完成偏移

OP\_goto16
----------

指令的执行方式与 [OP\_goto](#OP_goto "#OP_goto") 类似，不过操作数为代码段的 2 字节字长。

OP\_goto8
---------

指令的执行方式与 [OP\_goto](#OP_goto "#OP_goto") 类似，不过操作数为代码段的 1 字节字长。

OP\_if\_true
------------

指令

阶段

字长（指令 + 操作数）

OP\_if\_true

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

#2

PC 偏移量

代码段

4

指令的操作数有 2 个：

1.  相对当前 PC 位置的后面 4 字节字长，表示条件判断成功后的待跳转地址的偏移量
    
2.  栈顶元素，指令会弹出并判断栈顶元素是否等于 true，如果条件成立，将对 PC 累加上一条提到的 4 字节偏移量
    

OP\_if\_false
-------------

指令

阶段

字长（指令 + 操作数）

OP\_if\_false

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

#2

PC 偏移量

代码段

4

指令判断栈顶的操作数是否为 `false`，条件成立时进行跳转。

跳转的方式是，对 PC 指针累加一定的偏移量。偏移量在紧跟 `OP_if_false` 指令的 4 字节长度中。

代码段中的指令顺序排列大致可以表示成下面的形式：

    OP_if_false, DistanceValue, ..., Target
    

偏离量 DistanceValue 在指令生成阶段的计算方式为：

    DistanceValue = 目标指令的位置 - PC_of_DistanceValue（DistanceValue 这个值自身所在的指令位置）
    

因此 `OP_if_false` 执行时的 PC 的偏移可以表示成下面的形式：

    PC = PC_of_DistanceValue + DistanceValue
    

上面的式子可以进一步对应到源码中的实现：

    pc = (pc - 4) + (int32_t)get_u32(pc - 4)
    

这样就和下面的源码中的偏移相对应了：

    int res;
    JSValue op1;
    
    op1 = sp[-1];
    
    // 上面代码中 `SWITCH(pc)` 时，PC 已经做过 1 字节的偏移了
    // 所以到这个位置，PC 指向的是 Distance
    // 继续加 4 后，才是下一个指令的地址
    pc += 4;
    if ((uint32_t)JS_VALUE_GET_TAG(op1) <= JS_TAG_UNDEFINED) {
        res = JS_VALUE_GET_INT(op1);
    } else {
        res = JS_ToBoolFree(ctx, op1);
    }
    sp--;
    if (!res) {
        // OP_if_false, DistanceValue, ..., Target
        // `PC = PC_of_DistanceValue + DistanceValue`
        // `pc = (pc - 4) + (int32_t)get_u32(pc - 4)`
        pc += (int32_t)get_u32(pc - 4) - 4;
    }
    if (unlikely(js_poll_interrupts(ctx)))
        goto exception;
    

`OP_if_false` 的 Distance 字长为 4 字节，因此支持 4GB 范围内的跳转。

OP\_if\_true8
-------------

指令与 [OP\_if\_true](#OP_if_true "#OP_if_true") 类似，不过偏移量为 1 字节字长。

OP\_if\_false8
--------------

指令与 [OP\_if\_false](#OP_if_false "#OP_if_false") 类似，只不过偏移量的字长为 1 字节。

OP\_catch
---------

指令

阶段

字长（指令 + 操作数）

OP\_catch

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

PC 偏移量

代码段

4

指令的操作数只有一个，为代码段的偏移量（4 字节），PC 累加该偏移量后会跳转到 `catch` 子句对应的字节码首地址。

下面的代码：

    function f(a, b, b) {
      a;
      try {
        b;
      } catch (error) {
        c;
      }
    }
    
    f();
    

会生成这样的字节码：

    ;; function f(a, b, b) {
    ;;   a;
    
        0  D1                         get_arg0 0: a
        1  0E                         drop
    
    ;;   try {
    
        2  6C 08 00 00 00             catch 11
    
    ;;     b;
    
        7  D3                         get_arg2 2: b
        8  0E                         drop
    
    ;;   } catch (error) {
    
        9  0E                         drop
       10  29                         return_undef
       11  C9                    11:  put_loc0 0: error
       12  6C 0C 00 00 00             catch 25
    
    ;;     c;
    
       17  38 42 02 00 00             get_var c
       22  0E                         drop
    
    ;;   }
    
       23  0E                         drop
       24  29                         return_undef
    
    ;; }
    

再结合 `OP_catch` 的实现：

    CASE(OP_catch):
      {
        int32_t diff;
        diff = get_u32(pc);
        sp[0] = JS_NewCatchOffset(ctx, pc + diff - b->byte_code_buf);
        sp++;
        pc += 4;
      }
      BREAK;
    

可以发现 `OP_catch` 指令的操作数只有一个，为代码段的偏移量（4 字节），PC 累加该偏移量后会跳转到 `catch` 子句对应的字节码首地址。

在指令的实现中，会计算出 `catch` 子句对应的字节码首地址相对代码段首地址的偏移量：`pc + diff - b->byte_code_buf`，然后将数值通过 `CatchOffset` 对象包裹，压入到栈顶。

之所以要这么做，是因为 `OP_catch` 指令的操作数的偏移量是相对于其自身指令地址的偏移量，该值并不会立即被使用，而是等到发生异常时才去消费，到那时的 PC 是不确定的。而如果是相对代码段首地址 `b->byte_code_buf` 的偏移量，则可以方便地得出目标指令地址。

当引擎在执行过程中遇到异常时，会通过类似下面的语句跳转到异常处理的代码：

    goto exception;
    

`exception` 段代码如下：

     exception:
      if (is_backtrace_needed(ctx, rt->current_exception)) {
        /* add the backtrace information now (it is not done
           before if the exception happens in a bytecode
           operation */
        sf->cur_pc = pc;
        build_backtrace(ctx, rt->current_exception, NULL, 0, 0);
      }
      if (!JS_IsUncatchableError(ctx, rt->current_exception)) {
        while (sp > stack_buf) {
          JSValue val = *--sp;
          JS_FreeValue(ctx, val);
          if (JS_VALUE_GET_TAG(val) == JS_TAG_CATCH_OFFSET) {
            int pos = JS_VALUE_GET_INT(val);
            if (pos == 0) {
              /* enumerator: close it with a throw */
              JS_FreeValue(ctx, sp[-1]); /* drop the next method */
              sp--;
              JS_IteratorClose(ctx, sp[-1], TRUE);
            } else {
              *sp++ = rt->current_exception;
              rt->current_exception = JS_NULL;
              pc = b->byte_code_buf + pos;
              goto restart;
            }
          }
        }
      }
    

主要环节的解释为：

*   其中 `while (sp > stack_buf) {` 部分的循环，会将栈中元素从栈顶还是依次弹出并释放
    
*   同时，如果判断对象是 `CatchOffset`，则其值为相对代码段首地址的偏移量，继续对 pc 进行累加偏移 `pc = b->byte_code_buf + pos`
    
*   `goto restart` 会跳转到 `JS_CallInternal` 方法的开头部分，继续在 pc 处执行指令
    

OP\_gosub
---------

指令

阶段

字长（指令 + 操作数）

OP\_gosub

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

PC 偏移量

代码段

4

指令主要做两件事情：

1.  其操作数为代码段的 4 字节字长偏移量，对 pc 累加该偏移量，之后引擎会跳转到 finally 子句的代码首地址继续执行
    
2.  会将其下一条指令（例子中的 `OP_drop`）的相对代码段首地址的偏移量，用 int 对象包裹后压入到操作数栈顶。该栈顶元素会被后续的 `OP_ret` 指令消费，跳回 `OP_drop`
    

可以通过下面的代码所生成的字节码感受指令的执行方式：

    function f(a, b, c, d) {
      a;
      try {
        b;
      } catch (error) {
        c;
      } finally {
        d;
      }
      e;
    }
    
    f();
    

会生成下面的字节码：

    ;; function f(a, b, c, d) {
    ;;   a;
    
        0  D1                         get_arg0 0: a
        1  0E                         drop
    
    ;;   try {
    
        2  6C 10 00 00 00             catch 19
    
    ;;     b;
    
        7  D2                         get_arg1 1: b
        8  0E                         drop
    
    ;;   } catch (error) {
    
        9  0E                         drop
       10  06                         undefined
       11  6D 1F 00 00 00             gosub 43
       16  0E                         drop
       17  EC 1C                      goto8 46
       19  C9                    19:  put_loc0 0: error
       20  6C 10 00 00 00             catch 37
    
    ;;     c;
    
       25  D3                         get_arg2 2: c
       26  0E                         drop
    
    ;;   } finally {
    
       27  0E                         drop
       28  06                         undefined
       29  6D 0D 00 00 00             gosub 43
       34  0E                         drop
       35  EC 0A                      goto8 46
       37  6D 05 00 00 00        37:  gosub 43
       42  2F                         throw
    
    ;;     d;
    
       43  D4                    43:  get_arg3 3: d
       44  0E                         drop
    
    ;;   }
    
       45  6E                         ret
    
    ;;   e;
    
       46  38 44 02 00 00        46:  get_var e
    
    ;; }
    
       51  29                         return_undef
    

OP\_ret
-------

指令

阶段

字长（指令 + 操作数）

OP\_ret

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

指令的操作数为栈顶元素，会将栈顶元素视为相对代码段首地址的偏移量，并使用代码段首地址加上该值，结果赋值给 pc。该指令主要与 `OP_gosub` 指令配合使用，用于释放 `OP_gosub` 指令之前的 `undefined` 指令产生的冗余对象。

OP\_for\_in\_start
------------------

指令

阶段

字长（指令 + 操作数）

OP\_for\_in\_start

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

指令的操作数为栈顶元素，该指令会弹出栈顶元素，并以栈顶元素为基础，创建一个 iterator 后压入栈顶。

比如下面的代码：

    function f() {
      var b = {};
      for (var a in b) {
        a;
      }
    }
    

会生成下面的字节码：

    ;; function f() {
    ;;   var b = {};
    
        0  0B                         object
        1  C9                         put_loc0 0: b
    
    ;;   for (var a in b) {
    
        2  C5                         get_loc0 0: b
        3  7C                         for_in_start
        4  EC 04                      goto8 9
        6  CA                     6:  put_loc1 1: a
    
    ;;     a;
    
        7  C6                         get_loc1 1: a
        8  0E                         drop
    
    ;;   }
    
        9  7F                     9:  for_in_next
       10  EA FB                      if_false8 6
       12  0E                         drop
    
    ;; }
    

OP\_for\_in\_next
-----------------

指令

阶段

字长（指令 + 操作数）

OP\_for\_in\_next

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

指令的操作数为栈顶元素，该元素为使用 `OP_for_in_start` 创建的引擎内部的 iterator 对象。

指令内会调用 `iterator` 的 `next` 方法，并将 `next` 的返回值和一个 bool 值压入操作数栈。

_这样的说法并不是精确，因为内部的 iterator 对象并不会真的有 `next` 方法，但是有类似的实现机制_

指令执行完成后，操作数栈中的内容为：

    -> TOP
    nextVal, flag_a
    

为了完成循环，`OP_for_in_next` 指令后面会紧跟一个 `OP_if_false` 指令。该指令会消费栈顶的 `flag_a` 来决定是是否继续循环

qjs 生成的指令中，使用 `OP_if_false` 跳转到循环开头，因此 `OP_for_in_next` 指令内如果判断要继续循环，那么压入的 `flag_a` 值需要为 `false`。

可以通过下面的代码以及与之对应的字节码，来理解指令的执行方式：

    function f() {
      var b = {};
      for (var a in b) {
        a;
      }
    }
    

对应的字节码为：

    ;; function f() {
    ;;   var b = {};
    
        0  0B                         object
        1  C9                         put_loc0 0: b
    
    ;;   for (var a in b) {
    
        2  C5                         get_loc0 0: b
        3  7C                         for_in_start
        4  EC 04                      goto8 9
        6  CA                     6:  put_loc1 1: a
    
    ;;     a;
    
        7  C6                         get_loc1 1: a
        8  0E                         drop
    
    ;;   }
    
        9  7F                     9:  for_in_next
       10  EA FB                      if_false8 6
       12  0E                         drop
    
    ;; }
    

`if_false8` 后面紧跟一个 `drop` 是为了释放 `OP_for_in_next` 指令压入的 `nextVal`

OP\_for\_of\_start
------------------

指令

阶段

字长（指令 + 操作数）

OP\_for\_of\_start

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

指令会弹出栈顶元素，并尝试获取栈顶元素的 `Symbol.iterator` 属性值，如果该值为函数，继续调用该函数创建一个 `iterator` 对象压入栈顶。

指令执行后，操作数栈中的元素为：

    -> TOP
    iterator, nextMethod, CatchOffset
    

比如下面的代码：

    function f() {
      var b = {};
      for (var a of b) {
        a;
      }
    }
    

会生成下面的字节码：

    ;; function f() {
    ;;   var b = {};
    
        0  0B                         object
        1  C9                         put_loc0 0: b
    
    ;;   for (var a of b) {
    
        2  C5                         get_loc0 0: b
        3  7D                         for_of_start
        4  EC 04                      goto8 9
        6  CA                     6:  put_loc1 1: a
    
    ;;     a;
    
        7  C6                         get_loc1 1: a
        8  0E                         drop
    
    ;;   }
    
        9  80 00                  9:  for_of_next 0
       11  EA FA                      if_false8 6
       13  0E                         drop
       14  83                         iterator_close
    
    ;; }
    

OP\_for\_of\_next
-----------------

指令

阶段

字长（指令 + 操作数）

OP\_for\_of\_next

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

与 [OP\_for\_in\_next](#OP_for_in_next "#OP_for_in_next") 相似，只不过它操作的对象为 JavaScript 环境中的 JS 对象，而后者是引擎内部实现的 iterator 对象。

`OP_for_of_next` 的操作数为代码段的 4 字节字长，表示操作数地址相对栈顶的偏移量，不过该偏移量依然是个中间值，可以直接作用在 sp 上的偏移量需要用 -3 作为减数，减去代码段的 4 字节字长的偏移量

比如下面的代码：

    const [a, b, ...{ pop, push, ...rest }] = [1, 2];
    

对应的字节码为：

      opcodes:
        0  3F 3E 02 00 00 80          check_define_var a,128
        6  3F 3F 02 00 00 80          check_define_var b,128
       12  3F 0B 01 00 00 80          check_define_var pop,128
       18  3F 0C 01 00 00 80          check_define_var push,128
       24  3F 40 02 00 00 80          check_define_var rest,128
       30  3E 3E 02 00 00 80          define_var a,128
       36  3E 3F 02 00 00 80          define_var b,128
       42  3E 0B 01 00 00 80          define_var pop,128
       48  3E 0C 01 00 00 80          define_var push,128
       54  3E 40 02 00 00 80          define_var rest,128
       60  06                         undefined
       61  11                         dup
       62  F2                         is_undefined
       63  EB 54                      if_true8 148
       65  7D                    65:  for_of_start
       66  80 00                      for_of_next 0
       68  0E                         drop
       69  3A 3E 02 00 00             put_var_init a
       74  80 00                      for_of_next 0
       76  0E                         drop
       77  3A 3F 02 00 00             put_var_init b
       82  26 00 00                   array_from 0
       85  B5                         push_0 0
       86  80 02                 86:  for_of_next 2
       88  EB 05                      if_true8 94
       90  51                         define_array_el
       91  8F                         inc
       92  EC F9                      goto8 86
       94  0E                    94:  drop
       95  0E                         drop
       96  6F                         to_object
       97  0B                         object
    

可以发现其中有 `for_of_next 0` 和 `for_of_next 2`。以 `for_of_next 0` 为例：

*   `0` 即为代码段 4 字节长度的相对偏移量
    
*   直接作用在 sp 上的偏移量 `offset = -3 - 0`
    
*   因此指令的第一个操作数为 `sp[-3]`，第二个操作数为 `sp[-2]`
    
*   `for_of_next` 指令的作用是调用对象上的 `next` 方法，因此 `sp[-3]` 为待操作对象，`sp[-2]` 为 `next` 方法的函数对象
    

那么 `sp[3]` 和 `sp[-2]` 从何而来，就归功于 `for_of_start` 指令了，翻看上面提到的 `for_of_start` 指令执行后，操作数栈中的内容为：

    -> TOP
    iterator, nextMethod, CatchOffset
    

这也就解释了为什么 `for_of_next` 的第一个操作数的 sp 直接偏移量最大为 `-3` 了 - 因为如果 `for_of_next` 紧跟着 `for_of_start`，那么第一个操作数的 sp 直接偏移量为 `-3`，如果两者之间还有其他会向操作数栈中压入元素的指令，那么这个直接偏移量就是小于 `-3`

指令执行完成后，操作数栈中的内容为：

    -> TOP
    nextVal, flag_a
    

OP\_for\_await\_of\_start
-------------------------

指令

阶段

字长（指令 + 操作数）

OP\_for\_await\_of\_start

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

栈顶元素

操作数栈

n/a

与 [OP\_for\_of\_start](#OP_for_of_start "#OP_for_of_start") 类似，只不过获取的是栈顶元素上的 `Symbol.asyncIterator` 属性值。

指令执行后，操作数栈中的元素为：

    -> TOP
    iterator, nextMethod, CatchOffset
    

考虑到下面的代码：

    (async function () {
      for await (num of asyncIterable) {
        print(num);
      }
    })();
    

对应的字节码为：

    ;; async function () {
    ;;   for await (num of asyncIterable) {
    
        0  38 3F 02 00 00             get_var asyncIterable
        5  7E                         for_await_of_start
        6  EC 12                      goto8 25
        8  39 3E 02 00 00         8:  put_var num
    
    ;;     print(num);
    
       13  38 3A 02 00 00             get_var print
       18  38 3E 02 00 00             get_var num
       23  EF                         call1 1
       24  0E                         drop
    
    ;;   }
    
       25  14                    25:  dup3
       26  0E                         drop
       27  24 00 00                   call_method 0
       30  8B                         await
       31  82                         iterator_get_value_done
       32  EA E7                      if_false8 8
       34  0E                         drop
       35  83                         iterator_close
    
    ;; }
    

其中 `call_method 0` 即为调用 `iterator` 上 `next` 方法的操作。有趣的是它之前的指令序列：

       25  14                    25:  dup3
       26  0E                         drop
    

之所以要 `dup3` 的原因是，`call_method` 会弹出栈上的 `iterator` 和 `next`，为了确保下次循环它们还在栈上，故需 dup 一下。

另外一个意思的点在于 `call_method` 之后的 `await` 指令。我们知道 `next` 方法是异步的，所以调用后并不会返回预期的计算结果。这里先通过 `await` 指令释放函数对 CPU 的控制权，待 `next` 内部的异步操作完成后，会恢复该函数以继续执行。

OP\_iterator\_get\_value\_done
------------------------------

指令

阶段

字长（指令 + 操作数）

OP\_iterator\_get\_value\_done

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

指令用于判断 `next` 方法的返回值是否表示以完成，指令执行完毕后，操作数栈中的内容类似：

    -> TOP
    value, done
    

`done` 会被 `OP_iterator_get_value_done` 之后的 `if_false8` 弹出消费掉，如果是 `false` 则循环得以继续。

OP\_iterator\_check\_object
---------------------------

指令

阶段

字长（指令 + 操作数）

OP\_iterator\_check\_object

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

指令会校验栈顶元素是否为对象，如果不是则抛出异常。

该指令会与 `iterator_next` 配合，考虑下面的代码：

    function* f() {
      yield* a;
    }
    

对应的字节码为：

    ;; function* f() {
    
        0  87                         initial_yield
    
    ;;   yield* a
    
        1  38 3F 02 00 00             get_var a
        6  7D                         for_of_start
        7  0E                         drop
        8  06                         undefined
        9  06                         undefined
       10  85                    10:  iterator_next
       11  81                         iterator_check_object
       12  42 69 00 00 00             get_field2 done
       17  EB 38                      if_true8 74
       19  89                    19:  yield_star
       20  11                         dup
       21  EB 04                      if_true8 26
       23  0E                         drop
       24  EC F1                      goto8 10
    

OP\_iterator\_close
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_iterator\_close

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

用于执行 `iterator` 对象上的 `return` 方法

指令执行时操作数栈上的内容为：

    -> TOP
    iterator, nextMethod, CatchOffset
    

指令执行完毕后，会将上面的内容都从栈中弹出

考虑下面的代码：

    const LIMIT = 3;
    
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        let i = 0;
        return {
          next() {
            const done = i === LIMIT;
            const value = done ? undefined : i++;
            return Promise.resolve({ value, done });
          },
          return() {
            // This will be reached if the consumer called 'break' or 'return' early in the loop.
            print("done");
            return { done: true };
          },
        };
      },
    };
    
    (async () => {
      for await (const num of asyncIterable) {
        console.log(num);
        if (num === 1) break;
      }
    })();
    

会产生下面的输出：

    0
    1
    done
    

OP\_iterator\_close\_return
---------------------------

指令

阶段

字长（指令 + 操作数）

OP\_iterator\_close\_return

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素到 CatchOffset 之间的元素

操作数栈

n/a

指令是为了处理 `for...of` 中的 `return` 语义。指令执行时，操作数栈中的内容为：

    -> TOP
    iterator, nextMethod, CatchOffset, ..., retVal
    

该指令执行后，操作数栈上的内容会变为：

    -> TOP
    retVal, iterator, nextMethod, CatchOffset
    

也就是说，指令会：

1.  将执行前栈上 `CatchOffset` 到 `retVal` 之间的临时变量都释放掉
    
2.  并逆时针调整栈上的内容，位置的调整是为了执行接下来的 `OP_iterator_close` 指令
    

`OP_iterator_close` 指令执行完毕后，栈上的内容变为：

    -> TOP
    retVal
    

接着通过 `OP_return` 执行完成调用栈的退出。

考虑下面的代码：

    const myIterable = {};
    myIterable[Symbol.iterator] = function* () {
      yield 1;
      yield 2;
      yield 3;
    };
    
    function f() {
      for (let n of myIterable) {
        return print(n);
      }
    }
    
    print(f());
    

其中 `for...of` 对应的字节码为：

    ;; function f() {
    ;;   for (let n of myIterable) {
    
        0  61 00 00                   set_loc_uninitialized 0: n
        3  38 3E 02 00 00             get_var myIterable
        8  7D                         for_of_start
        9  EC 0E                      goto8 24
       11  C9                    11:  put_loc0 0: n
    
    ;;     return print(n); //0123456789
    
       12  38 3A 02 00 00             get_var print
       17  62 00 00                   get_loc_check 0: n
       20  EF                         call1 1
       21  84                         iterator_close_return
       22  83                         iterator_close
    
    ;;   }
    
       23  28                         return
       24  80 00                 24:  for_of_next 0
       26  EA F0                      if_false8 11
       28  0E                         drop
       29  83                         iterator_close
    

OP\_iterator\_next
------------------

指令

阶段

字长（指令 + 操作数）

OP\_iterator\_next

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素在内的 4 个元素

操作数栈

n/a

指令的操作数为：

    -> TOP
    generator, next, catchOffset, arg
    

指令会调用 `generator` 对象上的内置方法 `next` 对应的操作函数 `js_generator_next`：

    CASE(OP_iterator_next):
      /* stack: iter_obj next catch_offset val */
      {
        JSValue ret;
        ret = JS_Call(ctx, sp[-3], sp[-4],
                1, (JSValueConst *)(sp - 1));
        if (JS_IsException(ret))
          goto exception;
        JS_FreeValue(ctx, sp[-1]);
        sp[-1] = ret;
      }
      BREAK;
    

OP\_iterator\_call
------------------

指令

阶段

字长（指令 + 操作数）

OP\_iterator\_call

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素在内的 4 个元素

操作数栈

n/a

指令会调用 `generator` 对象上的内置方法 `throw` 或者 `return`：

*   `iterator_call 1` 会调用 `throw`
    
*   `iterator_call 0` 会调用 `return`
    

OP\_lnot
--------

指令

阶段

字长（指令 + 操作数）

OP\_lnot

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

指令的操作数为栈顶元素，指令内部的执行步骤为：

1.  如果元素为 primitive value，则直接取它们的 int 值
    
2.  如果元素为对象，则需要做布尔值的转换
    
3.  将上面的操作结果取反，这一步的结果为 C 语言的布尔值，因此再包装为 JS 的布尔值压入栈中
    

所以指令会弹出栈顶元素，并对其等价的布尔值取反后，压入 JS 的布尔值

OP\_get\_field
--------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_field

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

栈顶元素，待访问对象

操作数栈

n/a

#2

属性名 JSAtom

代码段

4

指令的作用是取对象上的属性，因此操作数为 2 个，其中对象为栈顶元素，属性名称为代码段的 4 字节字长、为 JSAtom。

指令会弹出并释放栈顶元素，将获取到的属性值压入栈顶。

OP\_get\_field2
---------------

指令的操作数与 [OP\_get\_field](#OP_get_field "#OP_get_field") 相同，执行方式也相似，差异在于 `OP_get_field2` 不会弹出栈顶元素，因此指令执行完毕后栈中的元素为：

    -> TOP
    obj, propVal
    

OP\_put\_field
--------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_field

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

栈顶元素，属性值

操作数栈

n/a

#2

栈顶第 2 个元素，待访问对象

操作数栈

n/a

#3

属性名 JSAtom

代码段

4

指令的作用是设置对象的属性，因此操作数有 3 个，其中对象和待设置的属性值在操作数栈中，属性名在代码段的 4 字节字长、为 JSAtom

指令执行时，操作数栈中的内容为：

    -> TOP
    obj, propVal
    

指令执行完毕后，会上面的内容，同时释放 `obj`

_释放只是引用计数减一，真实的内存的释放时机为对象的引用计数为 0 时_

OP\_private\_symbol
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_private\_symbol

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

属性名 JSAtom

代码段

4

指令的内部操作为：

1.  以私有变量名创建一个 Symbol 对象，变量名为代码段的 4 字节字长、为 JSAtom
    
2.  将新创建的 Symbol 对象压入栈顶
    

OP\_get\_private\_field
-----------------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_private\_field

3

1

指令的作用是获取私有属性的值，因此其操作数有 2 个，分别是待访问的对象，和通过私有变量名创建的 Symbol 对象。

指令执行时，栈中的操作数为：

    -> TOP
    obj, privateField_symbol
    

指令会将操作数从栈上弹出并释放，将获取的属性值压入栈中。

OP\_put\_private\_field
-----------------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_private\_field

3

1

指令的作用是设置私有属性的值，因此其操作数有 3 个，指令执行时操作数栈中的内容为：

    -> TOP
    obj, privateField_symbol,val
    

指令执行后，会弹出并释放 `obj` 和 `privateField_symbol`，对于 `val` 仅弹出不释放，因为 `JS_SetPrivateField` 方法内并没有增加 `val` 的引用计数，这样可以减少 2 次对引用 `val` 计数的操作

对于下面的代码：

    class A {
      f() {
        this.#a = 1;
      }
    }
    

对私有属性赋值的部分字节码为：

    ;;     this.#a = 1;
    
        2  C5                         get_loc0 0: this
        3  B6                         push_1 1
        4  15                         insert2
        5  DD                         get_var_ref0 0: "#a"
        6  45                         put_private_field
    

其中 `get_var_ref0` 的作用就是将表示私有属性名的 symbol 压入操作数栈，该 symbol 对象是在类创建支出生成的，对于 `f` 方法而且属于被其捕获的闭包变量。

OP\_define\_private\_field
--------------------------

指令

阶段

字长（指令 + 操作数）

OP\_define\_private\_field

3

1

指令的作用是定义私有属性，因此其操作数有 3 个，指令执行时操作数栈中的内容为：

    obj, privateField_symbol,val
    

指令执行后：

*   弹出并释放 `privateField_symbol`
    
*   弹出 `val`，没有释放操作是因为 `JS_DefinePrivateField` 内没有对 `val` 增加引用计数
    

指令后 `obj` 依然在操作数栈中。

OP\_define\_field
-----------------

指令

阶段

字长（指令 + 操作数）

OP\_define\_field

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素，属性值

操作数栈

n/a

#2

栈顶第 2 个元素，待访问对象

操作数栈

n/a

#3

属性名 JSAtom

代码段

4

指令的作用定义属性，因此其操作数有 3 个，其中待访问对象和属性值存在于操作数栈中，属性名则为代码段的 4 字节字长、为 JSAtom。

指令执行时，栈中的内容为：

    -> TOP
    obj, val
    

指令执行后，仅弹出 `val`，因此 `obj` 依然存在于操作数栈中。

指令内的操作是通过 [JS\_DefinePropertyValue](https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2573 "https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2573") 方法完成。

OP\_set\_name
-------------

指令

阶段

字长（指令 + 操作数）

OP\_set\_name

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素，待操作对象

操作数栈

n/a

#2

属性名 JSAtom

代码段

4

`OP_set_name` 指令作用是设置对象上的 `name` 属性，有 2 个操作数：

1.  栈顶元素，表示待操作的对象
    
2.  代码段的 4 字节字长、为 JSAtom 表示 `name` 属性对应的值
    

执行执行完毕后，不会弹出和释放栈顶元素

指令内部通过 [JS\_DefinePropertyValue](https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2573 "https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2573") 方法完成属性赋值操作。

OP\_set\_name\_computed
-----------------------

指令

阶段

字长（指令 + 操作数）

OP\_set\_name\_computed

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素，待操作对象

操作数栈

n/a

#2

栈顶第 2 个元素，表示属性值

操作数栈

n/a

指令作用是设置对象上的 `name` 属性，有 2 个操作数：

1.  栈顶元素，表示待操作的对象
    
2.  栈顶第 2 个元素，表示属性值
    

指令对应的函数为 [JS\_DefineObjectNameComputed](https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2670 "https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2670")，函数内首先对属性值转字符串，而对赋值的赋值操作通过 [JS\_DefinePropertyValue](https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2573 "https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2573") 完成

OP\_set\_proto
--------------

指令

阶段

字长（指令 + 操作数）

OP\_set\_proto

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素，属性值

操作数栈

n/a

#2

栈顶第 2 个元素，待操作对象

操作数栈

n/a

在对象字面量中尝试设置属性 `__proto__` 时会产生该指令

下面的代码：

    const a = {
      __proto__: {},
    };
    

对应的字节码为：

      opcodes:
        0  3F 3E 02 00 00 80          check_define_var a,128
        6  3E 3E 02 00 00 80          define_var a,128
       12  0B                         object
       13  0B                         object
       14  4F                         set_proto
       15  3A 3E 02 00 00             put_var_init a
       20  C5                         get_loc0 0: "<ret>"
       21  28                         return
    

指令的操作数为 2 个：

1.  栈顶元素为待设置的属性值
    
2.  栈顶第 2 个元素为待操作的对象
    

指令内部的操作主要通过 [JS\_SetPrototypeInternal](https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L17 "https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L17") 函数完成。

只有当属性值为对象时，才会进行设置。指令执行完毕后，会弹出并释放栈顶元素。

OP\_set\_home\_object
---------------------

指令

阶段

字长（指令 + 操作数）

OP\_set\_home\_object

3

1

操作数:

序号

作用

位置

字长

#1

栈顶元素，函数对象

操作数栈

n/a

#2

栈顶第 2 个元素，属性值

操作数栈

n/a

指令的作用是设置函数对象的 `[[HomeObject]]`，因此操作数有 2 个：

1.  栈顶元素为函数对象
    
2.  栈顶第 2 个元素为待设置的值
    

指令的内部操作通过 [js\_method\_set\_home\_object](https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L674 "https://github.com/hsiaosiyuan0/quickjs/blob/4b8cc2711bc5023eee90ae46e922a29ab33dbb39/src/vm/func.c#L674") 函数完成。

OP\_define\_method
------------------

指令

阶段

字长（指令 + 操作数）

OP\_define\_method

3

1

指令的作用是定义字面量或者类中的方法，包括 `getter` 和 `setter`。

`OP_define_method` 和 [OP\_define\_method\_computed](#OP_define_method_computed "#OP_define_method_computed") 共用一套逻辑，它们的差异仅参与操作数中属性名的处理方式。

`OP_define_method` 的属性名为代码段的 4 字节字长、为 JSAtom，因此栈中元素为：

    -> TOP
    obj, val
    

`OP_define_method_computed` 的属性名因为是某个表达式的求值结果，故存在于栈上，栈中元素为：

    -> TOP
    obj, propName, val
    

除了栈上的操作数以外，两个方法都有一个代码段的 4 字节字长操作数，表示属性的 attributes：

    #define OP_DEFINE_METHOD_METHOD 0
    #define OP_DEFINE_METHOD_GETTER 1
    #define OP_DEFINE_METHOD_SETTER 2
    #define OP_DEFINE_METHOD_ENUMERABLE 4
    

因此：

    define_method f,4 # 定义 method，相当于 OP_DEFINE_METHOD_METHOD | OP_DEFINE_METHOD_ENUMERABLE
    
    define_method f,5 # 定义 getter OP_DEFINE_METHOD_GETTER | OP_DEFINE_METHOD_ENUMERABLE
    
    define_method f,6 # 定义 setter OP_DEFINE_METHOD_SETTER | OP_DEFINE_METHOD_ENUMERABLE
    

方法的定义操作主要通过 `JS_DefineProperty` 函数完成，对于定义是否是

指令执行完毕后，会将 `obj` 之后的元素从栈上弹出并释放

结合下面的代码感受指令的执行方式：

    class A {}
    

对应的字节码为：

      opcodes:
        0  3F 3E 02 00 00 80          check_define_var A,128
        6  3E 3E 02 00 00 82          define_var A,130
       12  61 01 00                   set_loc_uninitialized 1: A
       15  06                         undefined
       16  61 02 00                   set_loc_uninitialized 2: "<class_fields_init>"
       19  BF 00                      push_const8 0: [bytecode <null>]
       21  56 3E 02 00 00 00          define_class A,0
       27  06                         undefined
       28  CB                         put_loc2 2: "<class_fields_init>"
    

OP\_define\_method\_computed
----------------------------

见 [OP\_define\_method](#OP_define_method "#OP_define_method")

OP\_define\_class
-----------------

指令

阶段

字长（指令 + 操作数）

OP\_define\_class

3

1

操作数:

序号

作用

位置

字长

#1

类名 JSAtom

代码段

4

#2

是否有父类

代码段

1

#3

栈顶，构造函数对象

操作数栈

n/a

#4

栈顶第 2 个元素，父类构造函数对象

操作数栈

n/a

指令的作用是定义一个类，操作数为：

1.  代码段的 4 字节字长、为 JSAtom，表示类名
    
2.  代码段的 1 字节字长，表示是否有父类，为 1 表示有父类
    
3.  操作数栈顶元素，表示子类的构造函数对象
    
4.  如果有父类的话，那栈顶第 2 个元素为父类的构造函数对象；如果没有父类的话，那么为内置的 Function 对象
    

指令执行完毕后：

1.  栈顶元素设置为子类构造函数对象的 proto
    
2.  栈顶第 2 个元素设置为子类的构造函数对象
    

OP\_define\_class\_computed
---------------------------

指令

阶段

字长（指令 + 操作数）

OP\_define\_class\_computed

3

1

操作数:

序号

作用

位置

字长

#1

类名 JSAtom

代码段

4

#2

是否有父类

代码段

1

#3

栈顶，构造函数对象

操作数栈

n/a

#4

栈顶第 2 个元素，父类构造函数对象

操作数栈

n/a

#5

栈顶第 3 个元素，属性名

操作数栈

n/a

指令的作用是，当类名来源于计算值时，通过该指令来定义类

考虑下面的代码：

    var a = {
      ["test"]: class {},
    };
    
    print(a.test.name);
    

对应的字节码为：

      opcodes:
        0  3F 3E 02 00 00 00          check_define_var a,0
        6  3E 3E 02 00 00 00          define_var a,0
       12  0B                         object
       13  04 A2 01 00 00             push_atom_value test
       18  06                         undefined
       19  61 01 00                   set_loc_uninitialized 1: "<class_fields_init>"
       22  BF 00                      push_const8 0: [bytecode <null>]
       24  57 2F 00 00 00 00          define_class_computed "",0
       30  06                         undefined
       31  CA                         put_loc1 1: "<class_fields_init>"
       32  0E                         drop
       33  68 01 00                   close_loc 1: "<class_fields_init>"
       36  51                         define_array_el
    

可以对比 `OP_define_class` 中字节码的例子，发现多出这一条指令 `push_atom_value test`，该指令即对应代码中的属性名计算过程，因为是字符串常量，所以压入的是其对应的 JSAtom 值。

`OP_define_class_computed` 的操作数与 `OP_define_class` 相似，差异在于前者多一个位于操作数栈上的参数，为栈顶的第 3 个元素，表示属性名。

OP\_get\_array\_el
------------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_array\_el

3

1

操作数:

序号

作用

位置

字长

#1

栈顶，属性名

操作数栈

n/a

#2

栈顶第 2 个元素，待访问对象

操作数栈

n/a

指令的作用是访问数组元素，有 2 个操作数：

1.  栈顶元素为属性名，也就是索引
    
2.  栈顶第 2 个元素为待访问的对象
    

指令内部的操作通过 `JS_GetPropertyValue` 函数完成

执行执行完毕后，会将操作数从栈中弹出并释放，将取得的数组元素压入栈中

OP\_get\_array\_el2
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_array\_el

3

1

操作数:

序号

作用

位置

字长

#1

栈顶，属性名

操作数栈

n/a

#2

栈顶第 2 个元素，待访问对象

操作数栈

n/a

指令的作用与 `OP_get_array_el` 相同，都是访问数组元素，差异在于前者只会弹出栈顶元素、即索引，将对象留在操作数栈中。

该指令用于函数调用时对 callee 访问的优化，考虑下面的代码：

    let o = {
      a: "test",
      1: function () {
        print(this.a);
      },
    };
    
    o[1](); // 打印 test
    

对应的字节码为：

      opcodes:
        0  3F 3E 02 00 00 80          check_define_var o,128
        6  3E 3E 02 00 00 82          define_var o,130
       12  0B                         object
       13  04 A2 01 00 00             push_atom_value test
       18  4C 3F 02 00 00             define_field a
       23  C0 00                      fclosure8 0: [bytecode <null>]
       25  4D 01 00 00 80             set_name "1"
       30  4C 01 00 00 80             define_field "1"
       35  3A 3E 02 00 00             put_var_init o
       40  38 3E 02 00 00             get_var o
       45  B6                         push_1 1
       46  48                         get_array_el2
       47  24 00 00                   call_method 0
       50  CD                         set_loc0 0: "<ret>"
       51  28                         return
    

因为 `o[1]()` 调用时，`thisObj` 是 `o`，所以为了优化指令数量，使用了 `OP_get_array_el2` 指令将对象保留在栈中。

OP\_get\_ref\_value
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_ref\_value

3

1

操作数:

序号

作用

位置

字长

#1

栈顶，属性名

操作数栈

n/a

#2

栈顶第 2 个元素，待访问对象

操作数栈

n/a

指令的作用分为两种情况：

1.  phase 1 阶段指令生成阶段的标记（表示获取闭包捕获的变量），会在后续的处理中被优化掉
2.  运行时的操作

其中运行时的操作可以描述为：

*   指令有 2 个操作数，分别是栈顶的属性名，以及栈顶第 2 个元素表示待访问对象
    
*   执行会在当访问对象上根据属性名取得属性的值，并将属性值压入栈顶
    

考虑下面的代码：

    function f() {
      var a = 1;
      return function () {
        return a++;
      };
    }
    

内层函数对应的字节码为：

        3  C2 0C 00 00 00             line_num 12
        8  BB 3F 02 00 00 00
           00 00 00 01 00             scope_make_ref a,0:26,1
       19  3C                         get_ref_value
       20  91                         post_inc
       21  B6 00 00 00 00             label 0:26
       26  19                    26:  perm4
       27  3D                         put_ref_value
       28  28                         return
    

上面的字节码是 phase 1 阶段的产物，会被后续的阶段所优化。但就上面的指令解释如下：

1.  `get_ref_value` 指令执行时，操作数栈中的内容为：
    
        -> TOP
        obj, propName
        
    
    `get_ref_value` 的会获取对象的属性值，并压入栈中，指令执行后，栈中内容变为：
    
        -> TOP
        obj, propName, propVal
        
    
2.  `post_inc` 指令的作用是对栈顶元素加 1，并将计算结果重新压入栈中，因此指令执行完毕后，栈中内容变为：
    
        -> TOP
        obj, propName, propVal, newVal_inc
        
    
3.  因为对于 `a++` 这样表达式而言，递增之前的旧值是需要的，所以通过 `perm4` 将栈中的内容变换顺序：
    
        -> TOP
        propVal, obj, propName, newVal_inc
        
    
4.  随后执行 `put_ref_value` 指令，该指令会设置对象的属性，因此操作数为栈顶的 3 个元素，设置完毕后，会将它们都从操作数栈中弹出，指令执行完毕后，栈中的内容变为：
    
        -> TOP
        propVal
        
    

OP\_get\_super\_value
---------------------

指令

阶段

字长（指令 + 操作数）

OP\_get\_super\_value

3

1

操作数:

序号

作用

位置

字长

#1

栈顶，属性名

操作数栈

n/a

#2

栈顶第 2 个元素，待访问对象

操作数栈

n/a

#2

栈顶第 3 个元素，`thisObj`

操作数栈

n/a

指令的作用是访问父类中的属性，值有 3 个操作数：

1.  栈顶元素为属性名
    
2.  栈顶第 2 个元素为待访问的对象
    
3.  栈顶第 3 个元素为 `thisObj`
    

指令会将操作数都弹出，并将访问到的属性值压入栈顶。

考虑下面的代码：

    class A {
      f() {
        super.a;
      }
    }
    

对应的字节码为：

        5  C5                         get_loc0 0: this
        6  C6                         get_loc1 1: "<home_object>"
        7  34                         get_super
        8  04 40 02 00 00             push_atom_value a
       13  4A                         get_super_value
    

上面执行序列的解释为：

1.  `get_loc0 0: this` 将 `this` 压入操作数栈
    
2.  `get_loc1 1: "<home_object>"` 将函数的 \[\[HomeObject\]\] 压入操作数栈
    
3.  `get_super` 将栈顶元素替换为 \[\[HomeObject\]\] 对象的 prototype 属性
    
4.  `push_atom_value a` 向操作数栈中压入属性名
    

此时操作数栈中的内容为：

    -> TOP
    thisObj, [[HomeObject]].prototype, a
    

然后执行指令 `get_super_value`，指令内部通过调用函数 `JS_GetPropertyInternal` 完成对属性的访问，其函数签名为：

    JSValue JS_GetPropertyInternal(JSContext *ctx, JSValueConst obj,
                                   JSAtom prop, JSValueConst this_obj,
                                   BOOL throw_ref_error);
    

函数形参中包含 `thisObj` 是因为如果属性通过 getter 函数访问，那么将使用传递的 `thisObj` 作为调用 getter 函数的 this 对象。

结合上面的代码可以发现，实参 `thisObj` 为子类的实例，可以通过下面的代码感受指令的执行：

    class B {
      get b() {
        return this.a;
      }
    }
    
    class A extends B {
      a = "a";
    
      f() {
        return super.b;
      }
    }
    
    print(new A().f()); // a
    

OP\_put\_array\_el
------------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_array\_el

3

1

操作数:

序号

作用

位置

字长

#1

栈顶，属性值

操作数栈

n/a

#2

栈顶第 2 个元素，属性名

操作数栈

n/a

#3

栈顶第 3 个元素，待操作对象

操作数栈

n/a

指令的作用是执行通过下标对属性的设置，指令有 3 个操作数。

指令会将其操作数全部从栈中弹出

考虑下面的代码：

    a[1] = 1;
    

对应的字节码为：

        0  38 3E 02 00 00             get_var a
        5  B6                         push_1 1
        6  71                         to_propkey2
        7  B6                         push_1 1
        8  16                         insert3
        9  49                         put_array_el
    

指令序列对应的解释为：

1.  `get_var a` 将全局变量 a 压入栈顶
    
2.  `push_1 1` 表示见属性名 1 压入操作数栈，成为栈顶元素
    
3.  `to_propkey2` 的作用是将栈顶元素转换为可以作为属性名的值
    

此时操作数栈中的内容为：

    -> TOP
    a, propName_1, 1
    

`insert3` 指令会将栈顶元素复制并插入到栈顶第 3 个元素之间，因此指令执行后栈中的内容变为：

    -> TOP
    1, a, propName_1, 1
    

接着指令 `put_array_el` 会弹出栈顶的三个元素，完成属性的赋值操作，内部赋值操作通过函数 `JS_SetPropertyValue` 完成，指令执行完毕后栈中元素变为

    -> TOP
    1
    

将 1 留在操作数栈中是考虑到这样的语法 `b = a[1] = 1`，所以如果该值不需要，会加上 drop 指令完成对栈的清理。

OP\_put\_ref\_value
-------------------

见 [OP\_get\_ref\_value](#OP_get_ref_value "#OP_get_ref_value")

OP\_put\_super\_value
---------------------

指令

阶段

字长（指令 + 操作数）

OP\_put\_super\_value

3

1

操作数:

序号

作用

位置

字长

#1

栈顶，属性值

操作数栈

n/a

#2

栈顶第 2 个元素，属性名

操作数栈

n/a

#3

栈顶第 3 个元素，待操作对象

操作数栈

n/a

#4

栈顶第 4 个元素，`thisObj`

操作数栈

n/a

指令的作用是设置父类中的属性，该指令有 4 个操作数：

1.  栈顶元素为待设置的属性值
    
2.  栈顶第 2 个元素为属性名
    
3.  栈顶第 3 个元素为待设置的对象
    
4.  栈顶第 4 个元素为 thisObj
    

指令操作会将操作数都从栈上弹出，指令内部的操作通过函数 [JS\_SetPropertyGeneric](https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L1545 "https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L1545") 完成

指令的 `thisObj` 的作用与其在 [OP\_get\_super\_value](#op_get_super_value "#op_get_super_value") 的作用相似，为了调用 setter 函数时设定其 this。

OP\_define\_array\_el
---------------------

指令

阶段

字长（指令 + 操作数）

OP\_define\_array\_el

3

1

操作数:

序号

作用

位置

字长

#1

栈顶，属性值

操作数栈

n/a

#2

栈顶第 2 个元素，属性名

操作数栈

n/a

#3

栈顶第 3 个元素，待操作对象

操作数栈

n/a

指令的作用执行解构赋值中的 Spread 语法，指令内部通过函数 [JS\_DefinePropertyValueValue](https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2583 "https://github.com/hsiaosiyuan0/quickjs/blob/a96adc73a9e001cc81a7309766d8b98a3a3391b1/src/vm/obj.c#L2583") 完成对属性的设置

指令有 3 个操作数：

1.  栈顶元素为待设置的属性值
    
2.  栈顶第 2 个元素为属性名
    
3.  栈顶第 3 个元素为待访问的对象
    

指令执行后会将属性值从栈中弹出，属性名、待访问对象依然在栈中。

考虑下面的代码：

    let c = {};
    let b = [1, 2, 3];
    let d;
    [d, ...c] = b;
    print(c); // 2,3
    

其中解构赋值对应的字节码为：

       68  80 02                      for_of_next 2
       70  0E                         drop
       71  3D                         put_ref_value
       72  7B 3E 02 00 00             make_var_ref c
       77  26 00 00                   array_from 0
       80  B5                         push_0 0
       81  80 04                 81:  for_of_next 4
       83  EB 05                      if_true8 89
       85  51                         define_array_el
       86  8F                         inc
       87  EC F9                      goto8 81
       89  0E                    89:  drop
       90  0E                         drop
       91  3D                         put_ref_value
    

`...c` 相关的指令序列解释为：

1.  `make_var_ref` 将 global 对象和变量名 c 压入操作数栈：
    
        -> TOP
        global, varName_c
        
    
2.  `array_from 0` 创建一个新的数组，操作数栈内容变为
    
        -> TOP
        global, varName_c, arr
        
    
3.  `push_0 0` 压入一个常量 0：
    
        -> TOP
        global, varName_c, arr, 0
        
    
4.  `for_of_next 4` 会调用 iterator 上的 next 方法，将值压入栈顶：
    
        -> TOP
        global, varName_c, arr, 0, nextVal
        
    
5.  `define_array_el` 将使用栈中的 `arr, 0, nextVal` 完成其操作，结束后将 `nextVal` 弹出：
    
        -> TOP
        global, varName_c, arr, 0
        
    
6.  `inc` 将栈顶元素加 1：
    
        -> TOP
        global, varName_c, arr, 1
        
    
7.  ...循环继续，直到 `for_of_next` 操作的 iterator 已完成其迭代
    

OP\_append
----------

指令

阶段

字长（指令 + 操作数）

OP\_append

3

1

操作数:

序号

作用

位置

字长

#1

栈顶，源对象

操作数栈

n/a

#2

栈顶第 2 个元素，源对象中其实属性索引

操作数栈

n/a

#3

栈顶第 3 个元素，目标写入对象

操作数栈

n/a

指令的作用是将一个 enumerable 对象追加到另一个对象中，为了实现 Spread 语法

指令有 3 个操作数，分别为：目标对象，源对象，起始追加处的索引，因此指令执行时，操作数栈中的内容为：

    -> TOP
    dstObj, startPos, srcObj
    

指令执行完毕后，会将 `srcObj` 从栈中弹出，并将追加后的累计索引压入操作数栈，因此指令执行完毕后，栈中的内容变为：

    -> TOP
    dstObj, newPos
    

考虑到下面的代码：

    const a = [];
    const b = [...a];
    

对应的字节码为：

      opcodes:
        0  3F 3E 02 00 00 80          check_define_var a,128
        6  3F 3F 02 00 00 80          check_define_var b,128
       12  3E 3E 02 00 00 80          define_var a,128
       18  3E 3F 02 00 00 80          define_var b,128
       24  26 00 00                   array_from 0
       27  3A 3E 02 00 00             put_var_init a
       32  26 00 00                   array_from 0
       35  B5                         push_0 0
       36  38 3E 02 00 00             get_var a
       41  52                         append
       42  0E                         drop
       43  3A 3F 02 00 00             put_var_init b
       48  C5                         get_loc0 0: "<ret>"
       49  28                         return
    

注意 `append` 与 `put_var_init` 之间的 `drop` 指令，目的就是弹出栈上的 `newPos`。

OP\_copy\_data\_properties
--------------------------

指令

阶段

字长（指令 + 操作数）

OP\_copy\_data\_properties

3

1

指令的作用场景有 2 个，分别为：

1.  将一个对象的属性追加到另一个对象中：`const a = {...b}`
    
2.  解构赋值：`({a, ...b} = c)`
    

指令的操作数有 3 个，分别为目标对象，源对象，以及设置目标对象时、需要从源对象中排除在外的属性列表

指令的操作数位于操作数栈中，3 个操作数的 sp 直接偏移量，需要用 `-1` 减去编码在代码段中的 4 字节字长：

    stack offsets (-1 based),
    2 bits for target,
    3 bits for source,
    3 bits for exclusionList
    

三个操作数的 sp 直接偏移量计算方式如下：

1.  首先取得 pc 处的 4 字节字长转换成整型
    
2.  因为 target 占据了最低位的 2bits，所以其值的计算方式为 `-1 - (mask & 3)`，`3` 的 bits 为 `ob11`
    
3.  因为 source 是高于 target 的 3bits, 所以需要先右移 2 位，然后取得最低 3 位 `-1 - ((mask >> 2) & 7)`，`7` 的 bits 为 `0b111`
    
4.  因为 exclusionList 为高于 source 的 3bits，且 source 之前还有 2bits 的 target，所以需要先右移 5 位，然后取得最低 3 位 `-1 - ((mask >> 5) & 7)`
    

换句话说，指令的操作数并不是固定的栈顶 3 个元素，而是在静态阶段可以确定的一个变化值。

指令执行后不会变动操作数栈中的值。

OP\_add
-------

指令

阶段

字长（指令 + 操作数）

OP\_add

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

指令的作用是将栈顶的两个元素弹出并相加，然后将相加的结果压入栈中。

指令执行时栈中的内容为：

    -> TOP
    op1, op2
    

指令执行后，栈中的内容变为：

    -> TOP
    result_op1+op2
    

OP\_add\_loc
------------

指令

阶段

字长（指令 + 操作数）

OP\_add\_loc

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

局部变量索引

代码段

4

#2

栈顶元素，待设置的值

操作数栈

n/a

指令的作用是，弹出栈顶元素，将其与某个局部变量相加，并加相加后的结果重新赋值给该局部变量。

考虑下面的代码：

    function f() {
      var a;
      a = a + 1;
    }
    

对应的字节码为：

      opcodes:
    ;; function f() {
    ;;   var a;
    ;;   a = a + 1;
    
        0  B6                         push_1 1
        1  94 00                      add_loc 0: a
    
    ;; }
    

该指令是优化后产生的指令，比如当指令序列满足下面一些条件时，会进行优化：

*   `get_loc(n) push_atom_value(x) add dup put_loc(n) drop -> push_atom_value(x) add_loc(n)`
    
*   `get_loc(n) push_i32(x) add dup put_loc(n) drop -> push_i32(x) add_loc(n)`
    
*   `get_loc(n) get_loc(x) add dup put_loc(n) drop -> get_loc(x) add_loc(n)`
    
*   `get_loc(n) get_arg(x) add dup put_loc(n) drop -> get_arg(x) add_loc(n)`
    
*   `get_loc(n) get_var_ref(x) add dup put_loc(n) drop -> get_var_ref(x) add_loc(n)`
    

所以比如下面的代码：

    function f() {
      var a = 1;
      a = 2;
      a = a + 1;
    }
    

将不会生成 `OP_add_loc`，对应的字节码为：

    ;; function f() {
    ;;   var a = 1;
    
        0  B6                         push_1 1
        1  C9                         put_loc0 0: a
    
    ;;   a = 2;
    
        2  B7                         push_2 2
        3  CD                         set_loc0 0: a
    
    ;;   a = a + 1;
    
        4  B6                         push_1 1
        5  9D                         add
        6  C9                         put_loc0 0: a
    
    ;; }
    

OP\_sub
-------

指令

阶段

字长（指令 + 操作数）

OP\_sub

3

5 = 1 + 4

操作数:

序号

作用

位置

字长

#1

栈顶在内的 2 个元素

操作数栈

n/a

指令的作用是弹出栈顶的 2 个元素执行减法操作，并将计算结果重新压入栈中。

因为指令生成顺序的关系，栈顶元素为减法操作的被减数，栈顶第 2 个元素为减法操作的减数。

指令内部会先判断两个操作数是否都为整数或者浮点数，如果满足条件的话，会直接对它们进行算数运算，因此速度较快；否则将通过 [js\_binary\_arith\_slow](https://github.com/hsiaosiyuan0/quickjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/ops.c#L905 "https://github.com/hsiaosiyuan0/quickjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/ops.c#L905") 函数执行相对速度较慢的减法运算。

OP\_mul
-------

与 [OP\_sub](#OP_sub "#OP_sub") 相似，不过是执行的乘法运算。

OP\_div
-------

与 [OP\_sub](#OP_sub "#OP_sub") 相似，不过是执行的乘法运算。

OP\_mod
-------

与 [OP\_sub](#OP_sub "#OP_sub") 相似，不过是执行的求模运算。

OP\_pow
-------

与 [OP\_sub](#OP_sub "#OP_sub") 相似，不过是执行的幂运算运算，另外一点需要注意的是，该指令直接执行 `js_binary_arith_slow` 函数。

OP\_plus
--------

指令

阶段

字长（指令 + 操作数）

OP\_plus

3

1

指令的作用是将栈顶元素转换成数值类型，如果栈顶元素已经是数值类型，那么该指令不做任何操作，否则通过 `js_unary_arith_slow` 函数完成转换操作。

OP\_neg
-------

指令

阶段

字长（指令 + 操作数）

OP\_neg

3

1

指令的作用是将栈顶元素转换成负数的数值类型，如果栈顶元素已经为整型或者浮点类型，那么将会执行相对快速的转换操作，否则通过 `js_unary_arith_slow` 函数完成转换操作。

OP\_inc
-------

指令

阶段

字长（指令 + 操作数）

OP\_inc

3

1

指令的作用是弹出栈顶元素，对其加 1，并将计算结果重新压入操作数栈。如果栈顶元素已经是整型，且小于 `INT32_MAX`，那么将直接进行加法操作，否则通过 `js_unary_arith_slow` 函数完成操作。

OP\_dec
-------

指令

阶段

字长（指令 + 操作数）

OP\_dec

3

1

指令的作用是弹出栈顶元素，对其减 1，并将计算结果重新压入操作数栈。如果栈顶元素已经是整型，且大于 `INT32_MIN`，那么将直接进行减法操作，否则通过 `js_unary_arith_slow` 函数完成操作。

OP\_post\_inc
-------------

指令

阶段

字长（指令 + 操作数）

OP\_post\_inc

3

1

指令的作用是对栈顶元素加 1，操作数有 1 个，即为栈顶元素。

指令执行完毕后，会将加 1 后的新值压入操作数栈，因此指令执行完毕后，操作数栈中的内容为：

    -> TOP
    oldVal, newVal_inc
    

OP\_post\_dec
-------------

指令

阶段

字长（指令 + 操作数）

OP\_post\_dec

3

1

指令的作用是对栈顶元素减 1，操作数有 1 个，即为栈顶元素。

指令执行完毕后，会将减 1 后的新值压入操作数栈，因此指令执行完毕后，操作数栈中的内容为：

    -> TOP
    oldVal, newVal_dec
    

OP\_inc\_loc
------------

指令

阶段

字长（指令 + 操作数）

OP\_inc\_loc

3

1

指令的作用是对操作数进行加 1 运算，与 `OP_inc` 不同，前者的操作数并不位于操作数栈，而是直接操作局部变量，通过编码在代码段的 4 字节字长作为局部变量的索引、以取得局部变量的值，并对其加 1 后将结果赋值给局部变量。

如果局部变量为整型，且小于 `INT32_MAX`，那么将直接进行算数运算，否则通过 `js_unary_arith_slow` 函数完成操作。

该指令并不是直接生成的，而是一个优化指令，主要用于优化循环中的 update 部分，考虑下面的代码：

    function f() {
      for (var a = 0; a < 10; a++) {}
    }
    

对应的字节码为：

    ;;   for (var a = 0; a < 10; a++) {}
    
        0  B5                         push_0 0
        1  C9                         put_loc0 0: a
        2  C5                     2:  get_loc0 0: a
        3  BD 0A                      push_i8 10
        5  A3                         lt
        6  EA 05                      if_false8 12
        8  93 00                      inc_loc 0: a
       10  EC F7                      goto8 2
    

因为作为循环 update 部分的 `a++`，其原始值是不需要的，因此通过优化成 `inc_loc` 以减少一次 drop 指令的执行

OP\_dec\_loc
------------

指令与 [OP\_inc\_loc](#OP_inc_loc "#OP_inc_loc") 指令类似，只不过是执行的减 1 操作。

OP\_not
-------

指令

阶段

字长（指令 + 操作数）

OP\_not

3

1

指令的作用是对栈顶元素进行取反操作，如果元素为整型，那么直接执行整型的取反操作，否则通过 `js_not_slow` 函数完成操作。

执行会弹出栈顶的操作数，并将计算结果重新压入操作数栈顶。

OP\_shl
-------

指令

阶段

字长（指令 + 操作数）

OP\_shl

3

1

指令的作用是对元素进行比特位左移操作，栈顶元素为需要左移的位数，栈顶第 2 个元素为需要进行位移操作的目标对象。

如果目标对象为整型，那么直接进行整型的左移操作，否则将通过 `js_binary_logic_slow` 函数完成操作。

指令会弹出栈顶的 2 个操作数，并将计算结果重新压入栈中。

OP\_shr
-------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是无符号右移操作。

OP\_sar
-------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是有符号右移操作。

OP\_and
-------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是逻辑与运算。

OP\_or
------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是逻辑或运算。

OP\_xor
-------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是异或运算。

OP\_lt
------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是比较运算，并且如果操作数不是整型，会通过 `js_relational_slow` 完成操作。

OP\_lte
-------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是比较运算，并且如果操作数不是整型，会通过 `js_relational_slow` 完成操作。

OP\_gt
------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是比较运算，并且如果操作数不是整型，会通过 `js_relational_slow` 完成操作。

OP\_gte
-------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是比较运算，并且如果操作数不是整型，会通过 `js_relational_slow` 完成操作。

OP\_eq
------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是比较运算，并且如果操作数不是整型，会通过 `js_eq_slow` 完成操作。

OP\_neq
-------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是比较运算，并且如果操作数不是整型，会通过 `js_eq_slow` 完成操作。

OP\_strict\_eq
--------------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是比较运算，并且如果操作数不是整型，会通过 `js_strict_eq_slow` 完成操作。

OP\_strict\_neq
---------------

与指令 [OP\_shl](#OP_shl "#OP_shl") 类似，不过是执行的是比较运算，并且如果操作数不是整型，会通过 `js_strict_eq_slow` 完成操作。

OP\_in
------

指令

阶段

字长（指令 + 操作数）

OP\_in

3

1

指令用于判断对象是否包含某个属性，栈顶元素为对象，栈顶第 2 个元素为待检测存在性的属性名。

指令会弹出栈顶的 2 个操作数，并将判断结果作为新的布尔值压入操作数栈顶。

指令内部的操作是通过 `js_operator_in` 函数完成的。

OP\_instanceof
--------------

指令

阶段

字长（指令 + 操作数）

OP\_instanceof

3

1

指令用于判断某个元素是否为另一个元素的实例，栈顶元素为 `instanceof` 的右值，栈顶第 2 个元素为左值

指令会弹出栈顶的 2 个操作数，并将判断结果作为新的布尔值压入操作数栈顶

指令内部的操作是通过 [js\_operator\_instanceof](https://github.com/hsiaosiyuan0/quickjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/ops.c#L2273 "https://github.com/hsiaosiyuan0/quickjs/blob/d9068af9b0e919366d8c044f7e92b390f9a30cf9/src/vm/ops.c#L2273") 函数完成的

OP\_typeof
----------

指令

阶段

字长（指令 + 操作数）

OP\_typeof

3

1

指令的作用是判断栈顶元素的类型，指令会弹出栈顶元素，获取代表其类型的字符串并重新压入栈顶。指令内部获取元素类型的操作是通过 `js_operator_typeof` 函数完成的

OP\_delete
----------

指令

阶段

字长（指令 + 操作数）

OP\_delete

3

1

指令的作用是删除对象中的某个属性，栈顶元素为待删除的属性名，栈顶第 2 个元素为目标对象

指令内部会弹出栈顶的 2 个操作数，并通过 `JS_DeleteProperty` 函数完成属性删除操作，并将该函数的返回值通过布尔值包裹重新压入栈顶

OP\_delete\_var
---------------

指令

阶段

字长（指令 + 操作数）

OP\_delete\_var

3

1

指令的作用是删除全局变量，属性名为代码段的 4 字节字长、为 JSAtom，待操作对象为 `ctx->global_obj`，删除操作通过 `JS_DeleteProperty` 函数完成

OP\_to\_object
--------------

指令

阶段

字长（指令 + 操作数）

OP\_to\_object

3

1

指令的作用是，弹出栈顶元素，并通过 `JS_ToObject` 函数将其转换成对象，并将转换结果压入栈顶

OP\_to\_propkey
---------------

指令

阶段

字长（指令 + 操作数）

OP\_to\_propkey

3

1

指令的作用是，弹出栈顶元素，并将其转换为可以作为属性名的值

如果栈顶元素已经为 `JS_TAG_INT`、`JS_TAG_STRING` 或者 `JS_TAG_SYMBOL` 那么重新将其压入栈顶，否则通过 `JS_ToPropertyKey` 函数进行转换，并将处理结果压入栈顶

OP\_to\_propkey2
----------------

指令

阶段

字长（指令 + 操作数）

OP\_to\_propkey2

3

1

指令的作用与 [OP\_to\_propkey](#OP_to_propkey "#OP_to_propkey") 类似，不过该指令会先校验待访问对象不为 `null` 或者 `undefined`，校验失败则报错

待校验的待访问对象为栈顶第 2 个元素。

OP\_with\_get\_var
------------------

指令

阶段

字长（指令 + 操作数）

OP\_with\_get\_var

3

9 = 4 + 4 + 1

操作数:

序号

作用

位置

字长

#1

变量名

代码段

4

#2

PC 偏移量

代码段

4

#3

是否 with 语句内

代码段

1

#4

栈顶元素

操作数栈

n/a

指令的作用是实现 with 语句的变量访问，指令有 3 个操作数：

1.  位于代码段的 4 字节字长，表示变量名
    
2.  在代码段紧跟上一个操作数的 4 字节字长，表示 pc 的跳转偏移量
    
3.  在代码段紧跟上一个操作数的 1 字节字长，表示是否为 with 语句内
    
4.  栈顶元素，表示待操作的对象
    

指令会将栈顶的操作数弹出，并将变量值压入栈顶

考虑下面的代码：

    let a = { b: 1 };
    
    with (a) {
      print(b);
    }
    

`with` 部分对应的字节码为：

       29  61 01 00                   set_loc_uninitialized 1: "<with>"
       32  6F                         to_object
       33  CA                         put_loc1 1: "<with>"
       34  06                         undefined
       35  C9                         put_loc0 0: "<ret>"
       36  C6                         get_loc1 1: "<with>"
       37  76 3A 02 00 00 0B
           00 00 00 01                with_get_ref print,53,1
       47  06                         undefined
       48  38 3A 02 00 00             get_var print
       53  C6                    53:  get_loc1 1: "<with>"
       54  72 3F 02 00 00 0A
           00 00 00 01                with_get_var b,69,1
       64  38 3F 02 00 00             get_var b
       69  24 01 00              69:  call_method 1
       72  CD                         set_loc0 0: "<ret>"
    

相关指令序列的解释为：

1.  `get_loc1 1: "<with>"` 指令将待操作对象压入栈顶
    
2.  `with_get_ref print,53,1` 会尝试在待操作对象上、以变量名为属性名，找到对应的属性
    
    如果找到对应的属性，会将值压入栈顶，否则 pc 累加一个偏移量，跳过 `get_var print` 的部分
    
3.  执行 `get_var print` 指令。如果上一步 `with_get_ref` 没有在对象上找到对应的属性，那么指令中的 pc 偏移地址将不会被累加，那么引擎会执行到这一步，这一步的操作就是将全局变量 b 压入栈顶
    
    注意这一步的指令并不一定是 `get_var`，如果变量 b 存在于被捕获的闭包中，那么这一步指令为 `get_var_ref_check`
    

所以 `with` 中访问对象的步骤可以概括为：

1.  首先尝试在 with 对象中查找与变量名相同的属性
    
2.  将变量名视为一般情况（回归词法作用域），生成其对应的变量访问指令，比如：
    
    *   若为局部变量，那么就是 `get_loc_check`
        
    *   若为闭包变量，那么就是 `get_var_ref_check`
        
    *   若为全局变量，那么就是 `get_var`
        

OP\_with\_put\_var
------------------

指令

阶段

字长（指令 + 操作数）

OP\_with\_put\_var

3

9 = 4 + 4 + 1

指令用于执行 with 语句中的变量赋值语句，指令有 4 个操作数：

1.  位于代码段的 4 字节字长，表示变量名
    
2.  在代码段紧跟上一个操作数的 4 字节字长，表示 pc 的跳转偏移量
    
3.  在代码段紧跟上一个操作数的 1 字节字长，表示是否为 with 语句内
    
4.  栈顶元素，表示待操作的对象
    
5.  栈顶第 2 的元素，表示待赋值的变量值
    

指令执行后会将操作数都弹出。

指令执行的方式与 [OP\_with\_get\_var](#OP_with_get_var "#OP_with_get_var") 类似，都是两段式的：

1.  首先以 with 对象为操作目标，尝试用变量名作为属性名完成对属性的赋值
    
2.  如果属性不存在，则退回到词法作用域的处理方式
    

OP\_with\_delete\_var
---------------------

指令

阶段

字长（指令 + 操作数）

OP\_with\_delete\_var

3

9 = 4 + 4 + 1

指令用于执行 with 语句中的 delete 语句，指令有 3 个操作数：

1.  位于代码段的 4 字节字长，表示变量名
    
2.  在代码段紧跟上一个操作数的 4 字节字长，表示 pc 的跳转偏移量
    
3.  在代码段紧跟上一个操作数的 1 字节字长，表示是否为 with 语句内
    
4.  栈顶元素，表示待操作的对象
    

指令会将栈顶元素弹出，并将 delete 语句的执行结果压入栈顶

指令执行的方式与 [OP\_with\_get\_var](#OP_with_get_var "#OP_with_get_var") 类似，都是两段式的：

1.  首先以 with 对象为操作目标，尝试用变量名作为属性名完成对属性的删除
    
2.  如果属性不存在，则退回到词法作用域的处理方式
    

OP\_with\_make\_ref
-------------------

指令

阶段

字长（指令 + 操作数）

OP\_with\_make\_ref

3

6 = 1 + 4 + 1

指令的作用是指令 with 语句内的解构赋值，该指令有 2 个操作数：

1.  代码段的 4 字节字长、为 JSAtom，表示解构赋值的左侧的变量名
    
2.  在代码段紧跟上一个操作数的 1 字节字长，表示是否为 with 语句内
    

与 [OP\_with\_get\_var](#OP_with_get_var "#OP_with_get_var") 类似，`OP_with_make_ref` 通用是两段式的操作：

1.  如果 with 对象上存在变量名的属性，那么直接对该属性赋值
    
2.  否则退回到词法作用域的处理方式，交由 `make_loc_ref` 指令序列处理
    

考虑下面的代码：

    function f() {
      let b;
    
      return function () {
        let b;
        let a = { c: { b: 3 }, b: 2 };
    
        with (a) {
          ({ b } = c);
          print(b);
        }
    
        console.log(b);
        console.log(JSON.stringify(a));
      };
    }
    
    f()();
    

其中解构赋值部分的字节码为：

       40  11                         dup
       41  C7                         get_loc2 2: "<with>"
       42  75 3F 02 00 00 0C
           00 00 00 01                with_make_ref b,59,1
       52  78 3F 02 00 00 00
           00                         make_loc_ref b,0
       59  1D                    59:  rot3l
       60  41 3F 02 00 00             get_field b
       65  3D                         put_ref_value
       66  0E                         drop
       67  EC 13                      goto8 87
       69  C7                    69:  get_loc2 2: "<with>"
    

对应的解释为：

1.  `with_make_ref` 将变量名压入栈顶，因为 with 对象上存在名为 `b` 的属性，因此跳转到 `59`处继续执行
    
    操作数栈中的内容为：
    
        -> TOP
        withObj, withObj, b
        
    
2.  `59: rot3l` 将栈顶的三个元素逆时针旋转，操作数栈中的内容变为：
    
        -> TOP
        withObj, b, withObj
        
    
3.  `get_field` 指令中，属性名是编码在代码段中的，因此只需栈顶的 withObj，操作数栈中的内容变为：
    
        -> TOP
        withObj, b, b_v
        
    
4.  `put_ref_value` 将 `withObj` 中的属性 `b` 的值置为 `b_v`
    

OP\_with\_get\_ref
------------------

指令

阶段

字长（指令 + 操作数）

OP\_with\_get\_ref

3

9 = 4 + 4 + 1

指令用于在 with 语句内方便变量，指令有 3 个操作数：

1.  位于代码段的 4 字节字长，表示变量名
    
2.  在代码段紧跟上一个操作数的 4 字节字长，表示 pc 的跳转偏移量
    
3.  在代码段紧跟上一个操作数的 1 字节字长，表示是否为 with 语句内
    
4.  栈顶元素，表示待操作的对象
    

指令内部操作与 [OP\_with\_get\_var](#OP_with_get_var "#OP_with_get_var") 相似，差别在于该指令不会将待操作对象从栈中弹出，指令操作后栈中内容为：

    -> TOP
    withObj, val
    

OP\_with\_get\_ref\_undef
-------------------------

指令

阶段

字长（指令 + 操作数）

OP\_with\_get\_ref\_undef

3

9 = 4 + 4 + 1

指令用于在 with 语句内方便变量，指令有 3 个操作数：

1.  位于代码段的 4 字节字长，表示变量名
    
2.  在代码段紧跟上一个操作数的 4 字节字长，表示 pc 的跳转偏移量
    
3.  在代码段紧跟上一个操作数的 1 字节字长，表示是否为 with 语句内
    
4.  栈顶元素，表示待操作的对象
    

指令内部操作与 [OP\_with\_get\_var](#OP_with_get_var "#OP_with_get_var") 相似，差别在于该指令不会将待操作对象从栈中弹出，而是将其位置置为 undefined，指令操作后栈中内容为：

    -> TOP
    undefined, val
    

OP\_await
---------

指令

阶段

字长（指令 + 操作数）

OP\_await

3

1

指令会将函数的返回值设置为 `FUNC_RET_AWAIT` 然后跳转到 `done_generator` 段：

      if (b->func_kind != JS_FUNC_NORMAL) {
      done_generator:
        sf->cur_pc = pc;
        sf->cur_sp = sp;
      } else {
      done:
        if (unlikely(!list_empty(&sf->var_ref_list))) {
          /* variable references reference the stack: must close them */
          close_var_refs(rt, sf);
        }
        /* free the local variables and stack */
        for(pval = local_buf; pval < sp; pval++) {
          JS_FreeValue(ctx, *pval);
        }
      }
      rt->current_stack_frame = sf->prev_frame;
      return ret_val;
    

`done_generator` 的作用就是保存当前调用栈帧的 pc 和 sp，我们可以称之为暂定点，这样后续调用栈恢复的时候，就可以从暂定点继续执行。

`OP_await` 在返回之前，是没有释放操作数栈以及闭包中的内容的，这是因为该栈帧并没有真正结束。

OP\_yield
---------

指令与 [OP\_await](#OP_await "#OP_await") 类似，只不过返回值为 `FUNC_RET_YIELD`。

OP\_yield\_star
---------------

指令与 [OP\_await](#OP_await "#OP_await") 类似，只不过返回值为 `FUNC_RET_YIELD_STAR`。

OP\_async\_yield\_star
----------------------

指令与 [OP\_await](#OP_await "#OP_await") 类似，只不过返回值为 `FUNC_RET_YIELD_STAR`。

OP\_return\_async
-----------------

指令与 [OP\_await](#OP_await "#OP_await") 类似，只不过返回值为 `JS_UNDEFINED`。

OP\_initial\_yield
------------------

指令

阶段

字长（指令 + 操作数）

OP\_initial\_yield

3

1

Generator 函数第一次被调用在语义上只是生成了 Generator 对象，函数体并没有执行，因此该指令就是函数内部将参数都初始化后返回

指令生成处的注释也可见一斑：

    /* generator function: yield after the parameters are evaluated */
    if (func_kind == JS_FUNC_GENERATOR ||
        func_kind == JS_FUNC_ASYNC_GENERATOR)
        emit_op(s, OP_initial_yield);
    

指令与 [OP\_await](#OP_await "#OP_await") 类似，只不过返回值为 `JS_UNDEFINED`

OP\_nop
-------

指令

阶段

字长（指令 + 操作数）

OP\_nop

3

1

指令表示空操作

OP\_is\_undefined\_or\_null
---------------------------

指令

阶段

字长（指令 + 操作数）

OP\_is\_undefined\_or\_null

3

1

指令的作用是弹出并判断栈顶元素是否为 `undefined` 或 `null`，并且判断结果压入栈顶。

OP\_is\_undefined
-----------------

指令

阶段

字长（指令 + 操作数）

OP\_is\_undefined

3

1

指令的作用是弹出并判断栈顶元素是否为 `undefined`，并且判断结果压入栈顶。

OP\_is\_null
------------

指令

阶段

字长（指令 + 操作数）

OP\_is\_null

3

1

指令的作用是弹出并判断栈顶元素是否为 `null`，并且判断结果压入栈顶。

OP\_typeof\_is\_undefined
-------------------------

指令

阶段

字长（指令 + 操作数）

OP\_typeof\_is\_undefined

3

1

指令的作用是弹出并判断栈顶元素的 `typeof` 结果是否为 `undefined`，并且判断结果压入栈顶。

OP\_typeof\_is\_function
------------------------

指令

阶段

字长（指令 + 操作数）

OP\_typeof\_is\_function

3

1

指令的作用是弹出并判断栈顶元素的 `typeof` 结果是否为 `function`，并且判断结果压入栈顶。

OP\_invalid
-----------

指令

阶段

字长（指令 + 操作数）

OP\_invalid

3

1

指令是一个占位指令，表示内部生成了错误的指令。