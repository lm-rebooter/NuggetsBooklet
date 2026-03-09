引擎的目的是为了执行计算，计算的内容（通常而言的算法）一般由高级语言编写，高级是相对引擎能够直接识别的语言来说。将高级语言转换为引擎可以识别的低级语言（字节码）的过程即为编译。

先向大家介绍编译是不合理的，因为在没有了解低级语言是如何被执行前，是很难理解编译的行为，及其产生的指令序列。从本节开始，我们将先逐步了解指令是如何被引擎解析与执行的，然后再介绍指令是如何生成的。

本节我们将介绍一些虚拟机的基本知识，并通过几行简单的代码实现一个原型虚拟机。

运行时、引擎、虚拟机
----------

在讨论编程语言实现时，我们常常看到这几个名词：

*   「运行时 Runtime」，代表是 CSharp 的 Common Language Runtime (CLR)
    
*   「虚拟机 Virtual machine」，代表是 Java virtual machine (JVM)
    
*   「引擎 Engine」，代表是 JavaScript 的 V8 引擎。
    

虚拟机突出的是对底层计算模型的模拟，比如 JVM 会模拟 CPU 指令执行，提供线程支持等等。

运行时则突出的是对语言特性所需的运行时组件的支持，比如 CLR 也提供了虚拟机的功能，但是与 JVM 只注重对 Java 的支持不同，CLR 目标不是某个特定语言，而是相对通用的语言特性集合（比如包含了对 Closure/Coroutine 的支持）强调的是运行时的组件。

引擎表示的内容则比较宽泛，通常来说表示驱动一类程序的核心功能，比如 JavaScript 引擎，驱动了由 JavaScript 编写的程序。

为什么叫 JavaScript 引擎而不是虚拟机呢？可能是由于：

*   JavaScript 语言本身的 Single-threaded 的特性
    
*   以及其语言规范中并不强调对底层平台的模拟
    

使得 JS 引擎在实现的时候不必达到 JVM 和 CLR 对底层平台的模拟程度，在已有了 JVM 和 CLR 的情况下，JS 引擎就略显单薄，再称为虚拟机就有点不太合适。

JS 引擎内部也有模拟 CPU 指令执行的组件，我们可以称之为指令解析器，不过为了方便讨论，我们暂且称之为虚拟机（VM）。

slowjs 目录
---------

我们再回顾下 slowjs 的目录划分：

    ├── qjs
    └── src
        ├── parse
        ├── utils
        └── vm
            └── intrins
            └── instr.h
            └── exec.c
    

*   `src` 目录下是引擎的功能：
    
    *   `vm` 下是虚拟机，其中 `instr.h` 和 `exec.c` 分别包含了字节码的定义和及执行
        
        *   `intrins` 是 JavaScript 语言规范中的内置对象
            
            当前的虚拟机实现并不像 CLR 那样从通用角度出发，换句话说，更多的考虑的是 JavaScript 语言的运行，所以 `intrins` 目录就作为了 `vm` 的子目录
            
        *   `exec.c` 是对底层计算方式的模拟，比如模式 CPU 执行指令时的 [Fetch–decode–execute Cycle](https://en.wikipedia.org/wiki/Instruction_cycle "https://en.wikipedia.org/wiki/Instruction_cycle")
            
    *   `parse` 下是将 JavaScript 编译成字节码的功能。
        
        这部分独立于 VM 是因为 VM 消费的是字节码，未来 `parse` 接收的输入可以更加的丰富，比如直接处理 TypesScript（宏伟蓝图）
        
*   `qjs` 则是运行时，它使用了 `src` 中引擎的功能，提供类似 Nodejs 的功能和交互方式
    

可以简单的认为 qjs 命令行程序使用了「引擎」，而「引擎」内包含了部分「虚拟机」功能。

也可以将 qjs 与 Chrome、Nodejs 类比，它们都是运行时，都使用了 v8 引擎，并在引擎之上提供了更加丰富的运行时组件 - 浏览器中的 DOM 和 Nodejs 中访问文件系统的能力。

虚拟机的分类
------

虚拟机中，指令的参数和计算结果被称为操作数，根据存放操作数的数据结构的不同，可以将虚拟机分为：

*   基于栈的虚拟机，代表有 JVM，quickjs
    
*   基于寄存器的虚拟机，代表有 CLua
    

基于栈的虚拟机，使用一个栈结构来存放操作数，栈的特点是后进先出（LIFO），基于栈的这个特性，指令的设计以及虚拟机的实现可以变得相对简单。

基于寄存器的虚拟机，使用内存来模拟 CPU 的寄存器，所以在指令中，会内嵌需要操作的寄存器。因为涉及到寄存器的分配，所以虚拟机的实现就相对复杂。好处就是计算过程模拟得更加彻底，可能会方便虚拟机进一步加入 JIT 的能力。

我们来看一个简单的例子：

    a + b
    

对于上面这样使用高级语言描述的表达式，对应的基于栈的虚拟机，指令序列可能得形式为：

    // 三条指令
    LOAD_a
    LOAD_b
    ADD
    

而对于基于寄存器的虚拟机来说，如果变量 a 和 b 刚好在寄存器上时：

    // 单条指令
    ADD R_a, R_b, R_x
    

寄存器的分配是在编译期间决定的，会受到我们需要模拟的寄存器总数的影响。

看起来基于寄存器的虚拟机因为指令相对紧凑、执行效率似乎会更高。不过，像是虚拟机这样比较复杂的软件，影响效率的因素很多，单点的差异并不一定会对整体结果产生决定性的影响。

Instruction cycle
-----------------

上一章节我们提到虚拟机内部都有模拟 CPU 执行的 [Fetch–decode–execute Cycle](https://en.wikipedia.org/wiki/Instruction_cycle "https://en.wikipedia.org/wiki/Instruction_cycle") 的单元，它还有一个别名 Instruction cycle。

在基于栈的虚拟机内部 Instruction cycle 工作方式大概表现为：

![stack_instr_cycle.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1435336bfcf44e3f94950bc039005b3d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1092&h=924&s=86588&e=png&b=ffffff)

上图包含这些信息：

*   Stack 是一块连续内存，其中存放了指令所需的操作数
    
*   SP 指针指向 Stack 栈顶的元素，VM 通过调整 SP 来调整栈的高度
    
*   Code 是一块连续的内层，其中存放了 VM 需要执行的指令
    
*   PC 指向的指令是当前 VM 正在执行的指令，VM 通过调整 PC 来执行下一条指令
    
*   IC（Instruction cycle） 和 Code 之间的箭头表示：
    
    *   IC 会执行 PC 位置的指令
        
    *   会有更新 PC 的指令，即这些指令被 IC 执行后又会更新 PC
        
*   IC 和 Stack 之间的箭头表示：
    
    *   IC 在执行指令时，需要使用 Stack 上的内容作为操作数
        
    *   IC 执行指令后，操作结果又会再存放 Stack 上
        

原型虚拟机
-----

接下来我们将使用 TypeScript 来实现一个用于示意虚拟机内部执行方式的原型虚拟机。

### Deno

使用 TypeScript 可以简化对数据类型的描述过程。

为了简化 TypeScript 的环境配置，我们使用 Deno 来执行我们的代码。没有接触过 Deno 的同学可以先简单地将其看成为可以直接执行 TypeScript 的 Nodejs。

Deno 的安装方式可以参考其 [官方文档](https://deno.land/manual@v1.32.1/getting_started/installation "https://deno.land/manual@v1.32.1/getting_started/installation")。这里我们介绍一下在 WSL 中的安装方式：

首先运行下面的命令：

    curl -fsSL https://deno.land/x/install/install.sh | sh
    

安装完成后，我们可以看到类似下面的提示：

    Deno was installed successfully to /home/qjs/.deno/bin/deno
    Manually add the directory to your $HOME/.bashrc (or similar)
      export DENO_INSTALL="/home/qjs/.deno"
      export PATH="$DENO_INSTALL/bin:$PATH"
    

这个提示让我们将 Deno 可执行文件的路径加入到 `PATH` 环境变量中，我们可以执行下面的命令：

    echo 'export DENO_INSTALL="/home/qjs/.deno"' >> ~/.bashrc
    echo 'PATH="$DENO_INSTALL/bin:$PATH"' >> ~/.bashrc
    source ~/.bashrc
    

> 大家注意将 echo 后面单引号的内容替换自己环境中实际的输出结果

我们可以通过命令 `deno --version` 打印安装的版本：

    $ deno --version
    deno 1.32.1 (release, x86_64-unknown-linux-gnu)
    v8 11.2.214.9
    typescript 5.0.2
    

### 字节码

接下来我们将逐步实现一个基于栈的原型虚拟机。首先设计的就是字节码：

    enum OPCode {
      LOAD_0,
      LOAD_1,
      LOAD_2,
      ADD,
    }
    

我们使用 `enum` 来存放字节码，当前包含 2 类共 4 个字节码。`LOAD_n` 的字节码表示将 `n` 指代的常量压入操作数栈，`ADD` 指令表示弹出操作数栈顶的两个元素，将它们的累加结果重新压入操作数栈。

### VM

我们通过实现一个 VM 类来组织我们的虚拟机代码，也就是实现之前介绍 Instruction cycle 时涉及的一些组件：

![stack_instr_cycle.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1435336bfcf44e3f94950bc039005b3d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1092&h=924&s=86588&e=png&b=ffffff)

我们需要 4 个属性分别模拟 `Stack`、`SP` 以及 `Code`、`PC`：

    class VM {
      sp = 0;
      stack: Uint32Array;
    
      pc = 0;
      code: OPCode[] = [];
    
      constructor(code: OPCode[], stackSize: number) {
        this.code = code;
        this.stack = new Uint32Array(stackSize);
        this.sp = stackSize;
      }
    }
    

为了简化问题，我们的 stack 选择了 `Uint32Array` 类型，也就是暂时先处理 `Uint32` 类型的计算。

`stackSize` 表示操作数栈的最大尺寸，我们的例子中表示的是 `stack` 数组的长度，在未来更加具体的实现中则为字节数。程序所需的操作数栈最大尺寸是可以在静态阶段确定的。

### Stack

解下来我们添加两个方法：`push`，`pop`，分别用于对操作数的压栈和出栈。

    class VM {
      push(v: number) {
        assert(this.sp > 0, "stack overflow");
        this.stack[--this.sp] = v;
      }
    
      pop() {
        assert(this.sp < this.stack.length, "stack underflow");
        return this.stack[this.sp++];
      }
    }
    

我们操作数栈增长方向是向下的，称为「向下增长 Grow downwards」。简单来说就是新添加的操作数放置在低地址。

假设我们有下面的指令序列：

    LOAD_1
    LOAD_2
    

指令执行后操作数栈的内容为：

![stack_grow_downwards.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13717c81252043adba1d06ca103e4b16~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=398&h=678&s=29172&e=png&b=ffffff)

可以看到后执行的指令 `LOAD_2` 压入的操作数 `2` 对应的数组索引值要小于先执行的指令 `LOAD_1` 压入的操作数 `1` 的索引值。索引值对应到未来更加具体的实现就是内存地址。

因为是往低地址压入操作数，所以 `push` 方法中使用的是 `--this.sp`，并且我们通过 `assert` 确保不会因为过度压入操作数而导致操作数栈的溢出。

与压入操作数相反，弹出操作数的方式则是逐渐升高 `sp`，即 `pop` 方法中的 `this.sp++`，同样我们也使用 `assert` 确保过度的弹出操作，导致操作数栈的下溢。

与栈相同功能的还有「堆 Heap」，堆和栈一样同属内存，由于栈的大小是固定的，所以需要堆这样大小不确定的存储结构来作为互补。

因为同属于内存，所以主要讨论它们的数据访问的性能。栈上数据的访问性能较高于堆，这是因为栈上的内存是连续的可以有效地利用 CPU 缓存，并且栈上的内存无需额外的释放操作，对于「垃圾」内容只需后续覆盖它们即可。

### Instruction cycle

接下来则是具体的 Instruction cycle 实现部分，我们将执行 `Code` 中的指令，同时将操作数的变化体现在 `Stack` 中：

    class VM {
      ic() {
        while (this.pc < this.code.length) {
          const op = this.code[this.pc];
          switch (op) {
            case OPCode.LOAD_1:
            case OPCode.LOAD_2: {
              const i = op - OPCode.LOAD_0;
              this.push(i);
              this.pc++;
              break;
            }
            case OPCode.ADD: {
              const rhs = this.pop();
              const lhs = this.pop();
              this.push(lhs + rhs);
              this.pc++;
              break;
            }
            default:
              throw new Error("unsupported opcode");
          }
        }
      }
    }
    

上面的代码有这几个需要说明的地方：

*   首先是 `while` 循环，它就体现了我们之前说的 「Fetch–decode–execute Cycle」 中的 `Cycle`
    
*   作为演示程序，我们需要给 `while` 设定一个停止条件，当 PC 越过 Code 的边界，我们就停止指令执行的循环
    
*   PC 表示的是当前执行指令对应的地址，所以我们通过 `this.code[this.pc]` 取出指令，这一步就对应 `Fetch`
    
*   取得指令之后，我们就要对其进行解码 `Decode`，所谓解码就是将其映射到对应的操作上，也就是 `switch` 语句的作用
    
*   最后是对指令的执行 `Execute`，也就是 `case` 子句中的内容，我们需要累加 PC，这样才能使得一条指令得以执行
    

### 运行

有了 VM 类之后，我们可以实例化并运行它感受一下：

    const vm = new VM([OPCode.LOAD_1, OPCode.LOAD_2, OPCode.ADD], 20);
    vm.ic();
    console.log(vm.top());
    

*   我们构造 VM 时传递的 Code 共 3 个指令，完成的操作是：
    
    *   向操作数栈压入常量 1
    *   向操作数栈压入常量 2
    *   弹出操作数栈顶的两个元素，将它们的累加结果重新压入操作数栈
*   `top` 方法用于访问操作数栈顶的元素
    

整体程序代码如下：

点击展开

    import { assert } from "std/testing/asserts.ts";
    
    enum OPCode {
      LOAD_0,
      LOAD_1,
      LOAD_2,
      ADD,
    }
    
    class VM {
      sp = 0;
      stack: Uint32Array;
    
      pc = 0;
      code: OPCode[] = [];
    
      constructor(code: OPCode[], stackSize: number) {
        this.code = code;
        this.stack = new Uint32Array(stackSize);
        this.sp = stackSize;
      }
    
      push(v: number) {
        assert(this.sp > 0, "stack overflow");
        this.stack[--this.sp] = v;
      }
    
      pop() {
        assert(this.sp < this.stack.length, "stack underflow");
        return this.stack[this.sp++];
      }
    
      top() {
        return this.stack[this.sp];
      }
    
      ic() {
        while (this.pc < this.code.length) {
          const op = this.code[this.pc];
          switch (op) {
            case OPCode.LOAD_1:
            case OPCode.LOAD_2: {
              const i = op - OPCode.LOAD_0;
              this.push(i);
              this.pc++;
              break;
            }
            case OPCode.ADD: {
              const rhs = this.pop();
              const lhs = this.pop();
              this.push(lhs + rhs);
              this.pc++;
              break;
            }
            default:
              throw new Error("unsupported opcode");
          }
        }
      }
    }
    
    const vm = new VM([OPCode.LOAD_1, OPCode.LOAD_2, OPCode.ADD], 20);
    vm.ic();
    console.log(vm.top());

通过指令 `deno run vm.ts` 运行后可以看到控制台打印的结果 `3`。

虚拟机调用栈
------

上一节我们实现了虚拟机中的核心部件 Instruction cycle。这一节我们将拓展它的功能，为其加入函数调用的能力。

### 函数

函数大家已经非常熟悉了，我们会把一些对通用问题的处理方法，封装到一个个函数中，然后将这些函数按需求进行组合，形成应用程序。这其中就涉及到 2 点：

*   函数需要可以封装一些处理逻辑
    
*   函数之间需要可以进行组合
    

我们来看一下「处理逻辑」在虚拟机眼中是什么样子，假设我们有下面一段代码：

    prev_stmts;
    a + b;
    next_stmts;
    

`prev_stmts` 指代位于 `a + b` 之前的语句，类似的 `next_stmts` 指代位于 `a + b` 之后的语句。

它对应的字节码的形式可能为：

![plain_opcode.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25d8a04a55a04c33b7f1872c56e06180~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=458&h=1142&s=42835&e=png&b=ffffff)

后面我们发现 `a + b` 其实是一个可以复用的逻辑，于是我们将其封装起来：

![vm_ops_split.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e130fbcaa3b5433abf3e5808034f0e4a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=876&h=1142&s=59107&e=png&b=ffffff)

我们将 `a + b` 涉及的指令抽出来后，通过 `Add` 函数名指代它们。

可以看到原本的顺序执行发生了变化：

*   观察 `Add` 头尾的箭头，函数被调用时，需要跳转到其指令序列的头部进行执行
    
*   当指令序列执行完毕后，需要再跳转回调用发生的地方继续执行
    

为了能够返回调用点，我们需要记录调用发生的位置。除此之外我们还需要记录调用前的 SP，因为当我们使用 Instruction cycle 来执行被调函数的内容时，也会修改 SP，如果不保存调用前的 SP，那么当被调函数执行完毕返回调用方时，就丢失了原本的 SP 信息。

因为寄存器的数量有限，这些状态信息自然是需要保存在内存中，于是就需要选取合适的数据结构。假设我们有一组函数调用关系：

    a -> b -> c
    

这些调用的状态会按下面的顺序创建（可以先不拘泥于状态具体包含哪些内容）：

    state_a, state_b, state_c
    

由于调用是逐级返回的，在调用返回的时候，它对应的调用状态也需要被释放，于是它们的释放顺序是：

    state_c, state_b, state_a
    

通过观察不难发现，后创建的状态需要先被释放，也就是「后进先出 LIFO」，这很容易让我们联想到使用「栈」来存储这样的数据：

*   存储调用状态的栈就称为「调用栈 Call Stack」
    
*   调用栈中的元素我们称之为「调用栈帧 Call Frame」
    

下面是调用栈的示意图：

![vm_call_stack.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82dc474f18784db3a0ac94d082f69ded~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1082&h=942&s=95687&e=png&b=fcfcfc)

### 调用栈

因为函数其实就是一组指令序列，我们可以通过下面的结构来表示函数：

    class Fn {
      constructor(public code: OPCode[] = []) {}
    }
    

为了让被调函数执行完毕后，发起调用的函数然可以继续之前的状态执行，我们需要保存调用状态：调用方的位置信息，以及进去被调函数之前的 SP：

    class CallFrame {
      sp = 0;
      pc = 0;
      fn = 0;
    }
    

在我们的虚拟机实现中，PC 是一个相对地址，加上我们不同的函数指令是分开存放的，所以还需要保存函数指令的基地址，也就是 `fn` 的作用，它表示函数的编号。

我们还需要添加两个指令表示函数的调用和返回操作：

    enum OPCode {
      CALL,
      RET,
    }
    

接着我们调整一下 VM 的属性：

    class VM {
      sp = 0;
      stack: Uint32Array;
    
      pc = 0;
      fn = 0;
    
      callStack: CallFrame[] = [];
    
      fns: Fn[];
      code: OPCode[] = [];
    
      constructor(stackSize: number, fns: Fn[] = []) {
        this.stack = new Uint32Array(stackSize);
        this.sp = stackSize;
        this.fns = fns;
      }
    }
    

调整的内容说明为：

*   增加了 `fns` 用于存放函数
    
*   增加了 `fn` 表示当前执行的函数在 `fns` 中的索引
    
*   增加了 `callStack` 作为调用栈
    
*   构造函数也做了相应的调整适应属性的调整
    

我们增加一个 getter 辅助方法用于访问当前活动的调用栈帧：

    class VM {
      get cf() {
        return this.callStack[this.callStack.length - 1];
      }
    }
    

接着我们准备实现 `CALL` 指令对应的操作。`CALL` 指令表示发起函数调用，在我们当前的指令设计中，被调函数由紧跟 `CALL` 指令下一条指令位置上的数值来确定，该数值表示函数在 `fns` 中的索引。

`CALL` 指令对应的操作如下：

    class VM {
      ic() {
        while (this.pc < this.code.length) {
          const op = this.code[this.pc];
          switch (op) {
            // ..
            case OPCode.CALL: {
              const nf = new CallFrame();
              nf.fn = this.code[this.pc + 1];
              this.pc += 2;
    
              const cf = this.cf;
              cf.sp = this.sp;
              cf.pc = this.pc;
    
              this.code = this.fns[nf.fn].code;
              this.pc = 0;
              this.callStack.push(nf);
              break;
            }
            // ...
          }
        }
      }
    }
    

上面的操作中我们主要做了几件事情：

*   创建了一个新的调用栈帧 `nf`，用于表示即将发起的调用
    
*   因为 `CALL` 指令下一条指令位置上的数值表示被调函数在 `fns` 中的索引，所以通过 `this.code[this.pc + 1]` 将被调函数记录到 `nf` 中
    
*   `this.pc += 2` 则是将 PC 偏移到调用返回后需要执行的指令处
    
*   接着在发起调用之前，我们记录了当前调用栈帧的 PC 和 SP
    
*   然后我们将 `this.code` 设置成了被调函数的指令序列，并重置了 PC，再将新创建的调用栈帧压入调用栈
    

因为发起函数的状态信息我们已经保存在了调用栈中，`RET` 指令的操作只需要将执行完毕的被调函数对应的操作数栈帧弹出，之后顶层的调用栈帧中保存的即为调用发起方的状态信息，我们只需将其恢复即可：

    class VM {
      ic() {
        while (this.pc < this.code.length) {
          const op = this.code[this.pc];
          switch (op) {
            // ...
            case OPCode.RET: {
              this.callStack.pop();
              const cf = this.cf;
              if (!cf) return;
    
              this.sp = cf.sp;
              this.pc = cf.pc;
              this.code = this.fns[cf.fn].code;
              break;
            }
            // ...
          }
        }
      }
    }
    

为了方便测试，我们再添加一个打印操作数栈顶元素的指令：

    enum OPCode {
      PRINT,
    }
    
    class VM {
      ic() {
        while (this.pc < this.code.length) {
          const op = this.code[this.pc];
          switch (op) {
            // ...
            case OPCode.PRINT: {
              console.log({ TOP: this.pop() });
              this.pc++;
              break;
            }
            // ...
          }
        }
      }
    }
    

我们在 `CALL` 指令对应的操作中会访问当前调用栈帧，但当我们在执行入口函数的时候，当前调用栈帧还不存在，并且为了让 VM 的接口更加清晰，我们增加一个 `run` 方法：

    class VM {
      run(main: number) {
        const nf = new CallFrame();
        nf.fn = main;
        this.code = this.fns[nf.fn].code;
        this.callStack.push(nf);
    
        this.ic();
      }
    }
    

以上就是目前做的调整，我们可以通过下面的方式测试运行的效果：

    const vm = new VM(20, [
      new Fn([OPCode.CALL, 1, OPCode.CALL, 2, OPCode.RET]),
      new Fn([OPCode.LOAD_1, OPCode.LOAD_2, OPCode.ADD, OPCode.PRINT, OPCode.RET]),
      new Fn([OPCode.LOAD_2, OPCode.LOAD_2, OPCode.ADD, OPCode.PRINT, OPCode.RET]),
    ]);
    vm.run(0);
    

上面的测试中需要说明的是：

*   我们创建了 3 个函数
    
*   函数 0 会分别调用 函数 1 和 函数 2
    
*   函数 1 中会计算并打印常量 1 和 2 累加的结果
    
*   函数 2 中会计算并打印常量 2 和 2 累加的结果
    
*   我们使用 函数 0 作为入口函数
    

所有上面的修改合并起来后：

点击展开

    import { assert } from "std/testing/asserts.ts";
    
    enum OPCode {
      LOAD_0,
      LOAD_1,
      LOAD_2,
      ADD,
    
      CALL,
      RET,
    
      PRINT,
    }
    
    class Fn {
      constructor(public code: OPCode[] = []) {}
    }
    
    class CallFrame {
      sp = 0;
      pc = 0;
      fn = 0;
    }
    
    class VM {
      sp = 0;
      stack: Uint32Array;
    
      pc = 0;
      fn = 0;
    
      callStack: CallFrame[] = [];
    
      fns: Fn[];
      code: OPCode[] = [];
    
      constructor(stackSize: number, fns: Fn[] = []) {
        this.stack = new Uint32Array(stackSize);
        this.sp = stackSize;
        this.fns = fns;
      }
    
      push(v: number) {
        assert(this.sp > 0, "stack overflow");
        this.stack[--this.sp] = v;
      }
    
      pop() {
        assert(this.sp < this.stack.length, "stack underflow");
        return this.stack[this.sp++];
      }
    
      top() {
        return this.stack[this.sp];
      }
    
      run(main: number) {
        const nf = new CallFrame();
        nf.fn = main;
        this.code = this.fns[nf.fn].code;
        this.callStack.push(nf);
    
        this.ic();
      }
    
      get cf() {
        return this.callStack[this.callStack.length - 1];
      }
    
      ic() {
        while (this.pc < this.code.length) {
          const op = this.code[this.pc];
          switch (op) {
            case OPCode.LOAD_1:
            case OPCode.LOAD_2: {
              const i = op - OPCode.LOAD_0;
              this.push(i);
              this.pc++;
              break;
            }
            case OPCode.ADD: {
              const rhs = this.pop();
              const lhs = this.pop();
              this.push(lhs + rhs);
              this.pc++;
              break;
            }
            case OPCode.CALL: {
              const nf = new CallFrame();
              nf.fn = this.code[this.pc + 1];
              this.pc += 2;
    
              const cf = this.cf;
              cf.sp = this.sp;
              cf.pc = this.pc;
    
              this.code = this.fns[nf.fn].code;
              this.pc = 0;
              this.callStack.push(nf);
              break;
            }
            case OPCode.RET: {
              this.callStack.pop();
              const cf = this.cf;
              if (!cf) return;
    
              this.sp = cf.sp;
              this.pc = cf.pc;
              this.code = this.fns[cf.fn].code;
              break;
            }
            case OPCode.PRINT: {
              console.log({ TOP: this.pop() });
              this.pc++;
              break;
            }
            default:
              throw new Error("unsupported opcode");
          }
        }
      }
    }
    
    const vm = new VM(20, [
      new Fn([OPCode.CALL, 1, OPCode.CALL, 2, OPCode.RET]),
      new Fn([OPCode.LOAD_1, OPCode.LOAD_2, OPCode.ADD, OPCode.PRINT, OPCode.RET]),
      new Fn([OPCode.LOAD_2, OPCode.LOAD_2, OPCode.ADD, OPCode.PRINT, OPCode.RET]),
    ]);
    vm.run(0);

通过 `deno run vm.ts` 查看的效果类似：

    { TOP: 3 }
    { TOP: 4 }
    

### 调用约定

我们的原型虚拟机已经支持了函数的定义和调用，但还缺少一个实用的功能 - 传递出入参。如果不支持出入参传递的话，那么函数就只能成为一个个无法连接的孤岛了。

于是我们需要一个方案，用于规定「调用方 Caller」和「被调方 Callee」之间需要经过怎样的配合来完成出入参的传递。这样的方案称为 [调用约定 Calling convention](https://en.wikipedia.org/wiki/Calling_convention "https://en.wikipedia.org/wiki/Calling_convention")。

更具体地说，调用约定中需要明确的是：

*   Caller 需要将参数放在哪里、怎样的形式，参传递给 Callee
    
*   类似的，Callee 需要将出参放在哪里，以怎样的形式传递给 Caller
    
*   出入参所占用的内存要如何释放
    

因为寄存器的数量是有限的，为了不影响参与计算的寄存器数量，我们可以将出入参放置在内存中，并且可以进一步选择放置在操作数栈中，方便出入参所占内存的释放。

调用约定并没有固定的标准，比如在 C 语言中，不同的编译器或者平台就可能会使用不同的调用约定。

对于我们的原型虚拟机来说，可以这么设计：在 Caller 发起对 Callee 之前，将需要传递给 Callee 的参数压入操作数栈。对于调用 `fn1(3, 4)` 的指令序列看起来类似：

    LOAD_4
    LOAD_3
    LOAD_2
    CALL 1
    

上面的指令序列的内容是：

*   将实参按它们的倒序压入操作数栈
    
*   实参压入后，将实参的个数也压入栈
    

我们把实参个数也传递给 Callee，让 Callee 来完成对入参所占内存释放工作，使我们返回值的传递变得简单一些。

我们可以通过一个例子来理解参数倒序入栈的好处。比如 `fn(a, b)`，我们先压入 `b` 和 `a`，再压入参数的数量 `N`：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1aa3b9bca29b407092056e7df942eb6d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=582&h=662&s=29337&e=png&b=ffffff)

因为 `SP` 是会变动的，所以我们引入 `BP` 来作为 Callee 操作数栈的基础地址，也就是刚进入 Callee 时的 `SP` 值。这样我们就可以通过 `[BP + n]` 访问第 `n` 个参数（`n` 从 `1` 开始）

我们的调用约定中规定， Callee 调用结束后，需要将其返回值放置在栈顶。所以当 Callee 中 `RET` 之前最后一条指令执行完毕后，操作数栈中的内容类似：

![call_convention_callee_before_ret.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bdfe351e1504b46892ff197b14e0df8~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=396&h=662&s=23608&e=png&b=ffffff)

为了方便 Caller 使用返回值，我们希望在回到 Caller 后，传递给 Callee 的参数可以得到释放，并且栈顶元素就是 Callee 的返回值：

![call_convention_ret_transform.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3391b664a8a4eb39229545751574c58~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=916&h=742&s=55658&e=png&b=fefefe)

上图中需要说明的一些内容是：

*   `OPD_X` 和 `OPD_Y` 表示 Caller 中的操作数
    
*   通过 `SP` 的偏移，将传递给 Callee 的内存进行了释放
    
*   对于 Caller 来说，栈顶元素即 Callee 的返回值
    

了解了上面的内容后，我们开始调整我们的代码。首先修改 `CallFrame` 增加 `BP`：

    class CallFrame {
      bp = 0;
      // ...
    }
    

然后是在 `CALL` 对应的操作，我们需要设置 Callee 的 `BP`：

    class VM {
      ic() {
        while (this.pc < this.code.length) {
          const op = this.code[this.pc];
          switch (op) {
            case OPCode.CALL: {
              const nf = new CallFrame();
              nf.fn = this.code[this.pc + 1];
              nf.bp = this.sp; // 记录 BP
              // ...
            }
          }
        }
      }
    }
    

接着修改 `RET` 指令对应的操作，在其中完成对入参的释放，以及将返回值放置到 Caller 的可视的操作数栈的栈顶：

    class VM {
      ic() {
        while (this.pc < this.code.length) {
          const op = this.code[this.pc];
          switch (op) {
            case OPCode.RET: {
              this.callStack.pop();
              const cf = this.cf; // caller's frame
              if (!cf) return;
    
              const retval = this.stack[this.sp]; // 1
              const argN = this.stack[cf.sp];     // 2
    
              this.sp = cf.sp + argN;             // 3
              this.stack[this.sp] = retval;       // 4
    
              this.pc = cf.pc;
              this.code = this.fns[cf.fn].code;
              break;
            }
          }
        }
      }
    }
    

上面代码对应的解释为：

1.  记录操作数栈顶元素，即返回值
    
2.  因为 Caller 发起调用前，向操作数栈最后压入的是参数的数量，所以通过 `cf.sp` 可以访问到参数数量
    
3.  释放参数可以通过 `cf.sp + argN` 来完成
    
4.  上一步将 N 个参数进行了释放，不过还剩余 1 个原本存放 N 的位置，直接将返回值放置在 `SP` 对应的位置即可，省去一对出入栈操作
    

为了在 Callee 中可以访问参数，我们需增加一个新的指令簇 `PUSHA`：

    enum OPCode {
      PUSHA_1,
      PUSHA_2,
    }
    

`PUSHA` 系列指令的操作是通过 `BP` 访问到参数，并将其压入操作数栈顶：

    class VM {
      ic() {
        while (this.pc < this.code.length) {
          const op = this.code[this.pc];
          switch (op) {
            case OPCode.PUSHA_1:
            case OPCode.PUSHA_2: {
              const i = op - OPCode.PUSHA_1 + 1;
              this.push(this.stack[this.cf.bp + i]);
              this.pc++;
              break;
            }
          }
        }
      }
    }
    

我们将通过运行一小段程序来测试上面的调整：

    fn1(a, b) => a + b
    
    fn2(a, b) => a - b
    
    main() =>
      fn2(fn1(1, 3), 1)
    

上面这一小段伪代码描述的程序内容为：

*   定义了函数 `fn1`，可以完成对入参的累加，并返回累加结果
    
*   定义了函数 `fn2`，可以求得入参的差值，并返回计算结果
    
*   定义了一个入口函数 `main`，并且其中完成一个嵌套调用
    

`main` 函数的指令序列为：

    new Fn([
      OPCode.LOAD_1, // fn2 的实参列表中的 1
    
      // 构造调用 fn1 所需的参数，分别是倒序的实参列表和实参数量
      OPCode.LOAD_3, OPCode.LOAD_1, OPCode.LOAD_2, 
      OPCode.CALL, 1, // 通过 fn1 在函数列表中的下标 1 对其发起调用
    
      // fn1 调用完成后，栈顶为其返回值，调用 fn2 还需要继续压入实参个数 2
      OPCode.LOAD_2,
      OPCode.CALL, 2, // 通过 fn2 在函数列表中的下标 2 对其发起调用
    
      OPCode.PRINT, // 打印栈顶元素，即 fn2 的计算结果
    
      OPCode.RET,
    ])
    

`fn1` 和 `fn2` 的函数体类似，我们可以看下 `fn2` 中的指令序列：

    new Fn([
      OPCode.PUSHA_1, // 向操作数栈中压入第 1 个参数，即 4
      OPCode.PUSHA_2, // 向操作数栈中压入低 2 个参数，即 1
    
      OPCode.SUB,     // 将栈顶的 2 个元素弹出，并累加计算它们的差值
                      // 在我们的例子中，左手边（lhs - left hand side）的操作数将是 4，
                      // 右手边的操作数将是 1，因此计算结果为 3 并压入操作数栈顶
      OPCode.RET,
    ])
    

上面的修改合并后的整体代码如下：

点击展开

    import { assert } from "std/testing/asserts.ts";
    
    enum OPCode {
      LOAD_0,
      LOAD_1,
      LOAD_2,
      LOAD_3,
    
      ADD,
      SUB,
    
      CALL,
      RET,
      POP,
      PUSHA_1,
      PUSHA_2,
    
      PRINT,
    }
    
    class Fn {
      constructor(public code: OPCode[] = []) {}
    }
    
    class CallFrame {
      bp = 0;
      sp = 0;
      pc = 0;
      fn = 0;
    }
    
    class VM {
      sp = 0;
      stack: Uint32Array;
    
      pc = 0;
      fn = 0;
    
      callStack: CallFrame[] = [];
    
      fns: Fn[];
      code: OPCode[] = [];
    
      constructor(stackSize: number, fns: Fn[] = []) {
        this.stack = new Uint32Array(stackSize);
        this.sp = stackSize;
        this.fns = fns;
      }
    
      push(v: number) {
        assert(this.sp > 0, "stack overflow");
        this.stack[--this.sp] = v;
      }
    
      pop() {
        assert(this.sp < this.stack.length, "stack underflow");
        return this.stack[this.sp++];
      }
    
      top() {
        return this.stack[this.sp];
      }
    
      run(main: number) {
        const nf = new CallFrame();
        nf.fn = main;
        this.code = this.fns[nf.fn].code;
        this.callStack.push(nf);
    
        this.ic();
      }
    
      get cf() {
        return this.callStack[this.callStack.length - 1];
      }
    
      ic() {
        while (this.pc < this.code.length) {
          const op = this.code[this.pc];
          switch (op) {
            case OPCode.LOAD_1:
            case OPCode.LOAD_2:
            case OPCode.LOAD_3: {
              const i = op - OPCode.LOAD_0;
              this.push(i);
              this.pc++;
              break;
            }
            case OPCode.ADD: {
              const rhs = this.pop();
              const lhs = this.pop();
              this.push(lhs + rhs);
              this.pc++;
              break;
            }
            case OPCode.SUB: {
              const rhs = this.pop();
              const lhs = this.pop();
              this.push(lhs - rhs);
              this.pc++;
              break;
            }
            case OPCode.CALL: {
              const nf = new CallFrame();
              nf.fn = this.code[this.pc + 1];
              nf.bp = this.sp;
              this.pc += 2;
    
              const cf = this.cf;
              cf.sp = this.sp;
              cf.pc = this.pc;
    
              this.code = this.fns[nf.fn].code;
              this.pc = 0;
              this.callStack.push(nf);
    
              break;
            }
            case OPCode.PUSHA_1:
            case OPCode.PUSHA_2: {
              const i = op - OPCode.PUSHA_1 + 1;
              this.push(this.stack[this.cf.bp + i]);
              this.pc++;
              break;
            }
            case OPCode.RET: {
              this.callStack.pop();
              const cf = this.cf; // caller's frame
              if (!cf) return;
    
              const retval = this.stack[this.sp];
              const argN = this.stack[cf.sp];
    
              this.sp = cf.sp + argN;
              this.stack[this.sp] = retval;
    
              this.pc = cf.pc;
              this.code = this.fns[cf.fn].code;
              break;
            }
            case OPCode.POP: {
              const n = this.code[++this.pc];
              for (let i = 0; i < n; i++) this.pop();
              break;
            }
            case OPCode.PRINT: {
              console.log({ TOP: this.pop() });
              this.pc++;
              break;
            }
            default:
              throw new Error("unsupported opcode: " + op);
          }
        }
      }
    }
    
    // fn1(a, b) => a + b
    // fn2(a, b) => a - b
    // main() =>
    //  fn2(fn1(1, 3), 1)
    const vm = new VM(20, [
      new Fn([
        OPCode.LOAD_1,
    
        OPCode.LOAD_3, OPCode.LOAD_1, OPCode.LOAD_2,
        OPCode.CALL, 1,
    
        OPCode.LOAD_2,
        OPCode.CALL, 2,
    
        OPCode.PRINT,
    
        OPCode.RET,
      ]),
      new Fn([
        OPCode.PUSHA_1,
        OPCode.PUSHA_2,
        OPCode.ADD,
        OPCode.RET,
      ]),
      new Fn([
        OPCode.PUSHA_1,
        OPCode.PUSHA_2,
        OPCode.SUB,
        OPCode.RET,
      ]),
    ]);
    vm.run(0);

通过命令 `deno run vm.ts` 可以看到栈顶元素即 `fn2` 的计算结果 `3`：

    { TOP: 3 }
    

小结
--

本节我们介绍了虚拟机的基本概念，并实现了原型虚拟机，不难发现下面几点：

*   从 VM 的角度看，函数就是一组可以重复执行的指令序列
    
*   为了使得函数能够返回，需要记录发生调用时 VM 的执行状态，这些信息存放在调用栈帧中，再通过调用栈串联以记录调用关系
    
*   出入参的传递和内存管理通过「调用约定」来规定，不同的调用约定之间的调用细节可能会不同
    

到这里我们已经对虚拟机内部执行的核心逻辑有了具体的感知。当然，虚拟机还包含其他一些指令功能，比如：用于实现高级语言的「条件判断」或者「循环」语句的跳转指令，以及对「闭包」和异步函数调用的支持，这些都超出了原型的范畴，会在后面的章节中结合引擎源码进行介绍。