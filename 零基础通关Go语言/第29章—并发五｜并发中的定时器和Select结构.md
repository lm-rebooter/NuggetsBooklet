趁热打铁，上一讲中我给大家介绍了 Go 并发编程中单向通道的构建，本讲就来练习单向通道的使用。

Go 语言提供了封装好的定时器，分别是 Timer 和 Ticker 。前者可以让特定的代码延迟执行，后者可以让特定的代码周期性执行。此外，对于通道发送方和接收方多对一的情况，Go 语言还内置了 Select 结构，用于在接收方识别发送方的角色，然后对其发送来的数据做分别处理。

概括来说，本讲将向大家介绍如下内容：

1. Go 语言中的定时器
   - Timer
   - Ticker
2. 并发中的 Select 结构

## 定时器

开篇已经提到，Go 语言中的定时器分为两种，一个是用于延迟执行的 Timer，另一个是周期性反复执行的 Ticker。它们都已经内置在 Go SDK 中的 time 包，我们先从 Timer 开始。

### Timer

若要使用 Timer，实现预约任务，要借助 time 包中的 Timer 类型，该类型的变量通过 time.NewTimer() 函数返回。

从 Go 源码角度看，Timer 是一个结构体类型，其定义如下：

```go
type Timer struct {
    C <-chan Time
    r runtimeTimer
}
```

注意那个名为 C 的单向通道，它是一个只能读取的单向通道，通道内传送的数据类型是Time类型。

在实际使用时，先调用 time.NewTimer() 函数给定预约时间长度，然后从 C 中接收数据。接收数据消耗的时长就是之前给定的时长。下面我们来看一个示例：

现有一款网络下载软件，假定现在要实现一个预约下载功能，要求使用 time 包，该怎样逐步完成呢？

首先需要调用 time.NewTimer() 函数，并将其返回值赋给某个变量，代码如下：

```go
downloadTimer := time.NewTimer(time.Second * 2)
```

该延迟将执行下载任务，因此将变量命名为 downloadTimer。为了节省测试时间，暂且将延迟时间设为 2 秒。

然后，从 downloadTimer 中接收值。一旦接收值的操作开始，计时也会随之开始。代码如下：

```go
<-downloadTimer.C
```

这里将接收到 Time 类型的值，单纯的延迟执行无需关注该值，只要能成功接收到，便表示时间到了。

再然后便是要执行的具体任务了，此处输出一些文字，表示调度下载任务开始。

最后，即使在任务执行期间发生宕机，也要确保预约定时器能够顺利退出，我们使用断言（defer）停止定时器。

上述步骤完整代码如下：

```go
func main() {
   downloadTimer := time.NewTimer(time.Second * 2)
   defer downloadTimer.Stop()
   <-downloadTimer.C
   fmt.Println("开始下载")
}
```

运行这段代码，控制台一上来不会有任何输出。稍候 2 秒，可以看到“开始下载”字样。

`❗️ 注意：预约定时器是一次性的。示例中只能从 downloadTimer 通道接收一次值，若多次接收则会引发宕机。若要重复使用 downloadTimer，可调用 downloadTimer.Reset() 函数，并传入时长。`

### Ticker

Ticker是 Go 封装的另一种类型的定时器，就像 Mac 中的系统监视器或 Windows 中的任务管理器中的 CPU 使用率，默认会每隔几秒钟刷新一次。Ticker 在应对这样的需求非常好用且易于实现。

在 Go 语言中使用 Ticker 与使用 Timer 非常相似，区别在于 Timer 是一次性的，Ticker 是可以反复接收值的。请大家结合下面的代码理解：

```go
func main() {
   cpuUsageTicker := time.NewTicker(time.Second * 1)
   defer cpuUsageTicker.Stop()
   for {
      <-cpuUsageTicker.C
      fmt.Println("获取实时CPU使用率")
   }
}
```

这段代码模拟了获取 CPU 使用量的需求，运行这段代码后，控制台将每隔 1 秒钟输出一次“获取实时CPU使用率”。当然，最后不要忘了使用断言确保定时器的正常关闭。

`💡 提示：无论 Timer 还是 Ticker，调用 stop() 方法会立即停止数据的发送，但很可能都不会立即关闭通道。这是为了保证正常接收而设计的，不过别担心，Go 程序会在合适的时机自动关闭通道。` 

## Select结构

在某些时候，我们还会面对另外一种情况，就是**一个数据接收结构处理多个发送者传来的数据，而且这些发送者使用的还是不同的通道。像这种情况，就要用到 Select 结构了。**

还用下载工具来举例，如果将呈现在用户面前的 UI 界面作为接收方，任务的调度（即下载开始、暂停、结束、删除等等）和下载进度的回传（即已完成的下载百分比）作为两个发送方。这两个发送方通过各自的通道同时向接收方发送数据，接收方则根据通道的不同，对数据做相应的处理和展示。

程序开始后，在第 2 秒和第 4 秒的时候添加新的下载。每隔 1 秒回传当前下载任务的总大小和已完成的大小。接收方从控制台输出新的下载文件，并以百分比表示下载进度，输出到控制台中。整个程序运行持续 10 秒，接下来我们逐步实现这个过程。

首先构建两条通道和一个结构体，结构体中保存单个任务的当前下载位置和总量，我们将其命名为 process。两条通道分别传送 process 和 int 类型的数据。相应代码片段如下：

```go
type process struct {
   current int
   total   int
}
chan1 := make(chan process)
chan2 := make(chan int)
```

接着，实现下载进度回传的发送方函数。假设文件的总大小为 10 个单位，每 1 秒可下载 1 个单位，即 10 秒钟下载完整个文件。每秒向 chan1 传送 process 类型的数据，将当前进度发送出去。整个函数的代码如下：

```go
func sendFunc1(chan1 chan process) {
   for i := 0; i < 10; i++ {
      chan1 <- process{
         current: i,
         total:   10,
      }
      time.Sleep(1 * time.Second)
   }
}
```

再来实现新增下载任务的函数。要求在第 2 和第 4 秒的时候新增任务，这部分实现起来较为简单，相关代码如下：

```go
func sendFunc2(chan2 chan int) {
   time.Sleep(2 * time.Second)
   chan2 <- 1
   time.Sleep(2 * time.Second)
   chan2 <- 1
}
```

接下来重点关注接收方的处理方式：

```go
func recvFunc(chan1 chan process, chan2 chan int) {
   for {
      select {
      case processInfo := <-chan1:
         fmt.Printf("当前任务进度：%d\n", 100.0*processInfo.current/processInfo.total)
      case <-chan2:
         fmt.Println("添加了新任务")
      }
   }
}
```

可以看到，该函数体中，首先使用了 for 循环，以便源源不断地接收和处理数据。由 select 语句开始，与由大括号括起来的部分，一起构成了 select 结构。case 后面紧跟着的是条件，即通道。如此便可分开接收和处理 chan1 和 chan2 的数据了。

最后，完善 main() 函数，使用协程的方式调用上述三个函数，完成题目要求。完整的代码如下：

```go
type process struct {
   current int
   total   int
}

func main() {
   chan1 := make(chan process)
   chan2 := make(chan int)
   go recvFunc(chan1, chan2)
   go sendFunc1(chan1)
   go sendFunc2(chan2)
   time.Sleep(10 * time.Second)
   fmt.Println("下载完成")
}

func sendFunc1(chan1 chan process) {
   for i := 0; i < 10; i++ {
      chan1 <- process{
         current: i,
         total:   10,
      }
      time.Sleep(1 * time.Second)
   }
}

func sendFunc2(chan2 chan int) {
   time.Sleep(2 * time.Second)
   chan2 <- 1
   time.Sleep(2 * time.Second)
   chan2 <- 1
}

func recvFunc(chan1 chan process, chan2 chan int) {
   for {
      select {
      case processInfo := <-chan1:
         fmt.Printf("当前任务进度：%d\n", 100.0*processInfo.current/processInfo.total)
      case <-chan2:
         fmt.Println("添加了新任务")
      }
   }
}
```

程序运行后，可以看到控制台如下输出：

> 当前任务进度：0
>
> 当前任务进度：10
>
> 添加了新任务
>
> 当前任务进度：20
>
> 当前任务进度：30
>
> 添加了新任务
>
> 当前任务进度：40
>
> 当前任务进度：50
>
> 当前任务进度：60
>
> 当前任务进度：70
>
> 当前任务进度：80
>
> 当前任务进度：90
>
> 下载完成

## 小结

🎉 恭喜，您完成了本次课程的学习！

📌 以下是本次课程的重点内容总结：

1.  Go 语言中的定时器
    - Timer
    - Ticker
2.  并发中的 Select 结构

本讲内容接着单向通道的话题展开，介绍了 Go 语言中已封装好的两种定时器：用于延迟执行的 Timer 以及用于周期性反复执行的 Ticker。它们的使用方法很类似，但要注意二者的区别：前者是“一次性”的。若要反复使用相应的 timer，需要调用 Reset() 进行重置；后者则没有这个限制。另外，为了确保定时器能正常结束，记得使用断言的方式调用 stop() 函数。

此外，本讲还介绍了并发中的 Select 结构，它在处理多个发送者传来的数据且这些发送者使用的还是不同的通道时特别有用。在实际开发中，Select 结构可以帮助我们将类似的接收器归为一类，使代码的结构更加清晰。

➡️ 在下次课程中，我们会继续介绍 Go 语言中的并发，具体内容如下：

1. 并发中的锁和原子操作