> 在面向对象思想中，对象的基本关系可以分为：泛化、实现、依赖、关联、组合、聚合。

## 泛化

泛化的标志为**实线三角形**，如下：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a3a9dc0f12746dea15150a1ce5097a8~tplv-k3u1fbpfcp-zoom-1.image" alt="泛化"  /></p>

表现在代码层面就是**继承（extends）**，三角形指向的是父类，简单记忆就是：**实线三角指向父类**，上图就表示 B 继承 A。

## 实现

实现的标志为**虚线三角形**，如下：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de34428d648e42828a9af65f26a3b528~tplv-k3u1fbpfcp-zoom-1.image" alt="实现"  /></p>

表示在代码层面就是**实现（implements）**，三角形指向的是接口，简单记忆就是：**虚线三角指向父接口**，上图就表示 B 实现 A。

## 泛化和实现的区别

- 泛化表示的是一种本能，表示**是什么**，是与生俱来的，比如`A extends B`，那么 A 就是 B，也就是 **is** 关系。
- 实现表示的是一种扩展关系，表示**可以干什么**，是后天的，比如`A implements B`，表示 A 拥有 B 的功能，也就是 A 可以做 B 能做的事，也就是 **has** 关系，但是 A 却不是 B，它只是拥有 B 的本领而已，这是一种扩展关系。

泛化和实现都表示类之间的一种纵向关系，这是一种 **`单向的上下级关系`**，`A extends/implements B`，`B`就不可能`extends/implements A`。正是这种严格的上下级关系，保证了进行面向对象设计时边界是正确的、清晰的。

## 关联

关联的标志为**实线箭头**，如下：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d58c30889414b9fa96d1e69145948eb~tplv-k3u1fbpfcp-zoom-1.image" alt="关联"  /></p>

表示在代码层面就是**成员变量**，箭头指向的是被关联类，简单记忆就是：**实线箭头指向被关联**，上图表示 B 关联 A，也就是 A 是 B 的成员变量。


## 依赖

依赖的标志为**虚线箭头**，如下：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe2a7672c46c4c24a5d86d4e9f7368fb~tplv-k3u1fbpfcp-zoom-1.image" alt="依赖"  /></p>

表示在代码层面就是**局部变量（包括局部变量、函数参数以及返回值）**，箭头指向的是被依赖类，简单记忆就是：**虚线箭头指向被依赖**，上图表示 B 依赖 A，也就是 A 是 B 的局部变量。


## 关联和依赖的区别

- 关联表示的是一种强依赖关系，这种关系是**长期**的，**表示在代码层面就是成员变量**，我们知道：成员变量的生命周期一般和持有它的对象是相同的。
- 而依赖表示的是一种**临时**的关系，**表示在代码层面就是局部变量**，我们知道：局部变量的生命周期都是跟随方法的，从方法入栈开始到方法出栈为止。

所以，关联的生命周期要大于依赖的生命周期，换句话说，**关联是一种“强”依赖，或者说是一种“长”依赖**。

关联和依赖的相同点就是：“它们都表示类之间的一种 **`横向的平等关系`**”，依赖和被依赖、关联和被关联的两个类之间不存在上下级关系，可以是 A 依赖 B，也可以是 B 依赖 A，这是一种平等的关系。


## 组合

组合的标志为**实心菱形**，如下：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/488f29c5b74a4efd86b58ab7aa661d2a~tplv-k3u1fbpfcp-zoom-1.image" alt="关联"  /></p>

表示在代码层面跟关联是一样的，也是**局部变量**，但是关联表示的是平等关系，而组合表示的是一种**整体-局部**关系，菱形指向的是整体，简单记忆就是：**实心菱形指向整体**，上图表示 A 持有 B，也就是 B 是 A 的一部分，这是一种强关联，B 不能脱离 A 而存在。


## 聚合

聚合的标志为**空心菱形**，如下：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48b533e9127348fda35da7b78cb4d772~tplv-k3u1fbpfcp-zoom-1.image" alt="关联"  /></p>

表示在代码层面和组合是一样的，只能从语义层级来区分，聚合跟组合的唯一区别就是：**聚合对象可以独立存在，组合对象不能独立存在**，比如上图，B 是 A 的一部分，并且 B 可以脱离 A 而存在。简单记忆就是：**空心菱形指向整体**。

## 组合/聚合、关联/依赖的区别

组合跟聚合都是一种“强关联”，表示一种“整体-局部”的关系，被组合的类不能独立存在，比如数据库和数据表，没有数据库肯定没有数据表；而被聚合的类则可以独立存在，比如汽车和轮子，轮子可以脱离汽车而存在。它们两个的区别只能从语义方面划分，换句话说：**组合是一种强聚合**。

再来看聚合和关联，聚合一定是关联关系，而关联是一种强依赖，所以聚合也是依赖；而组合是一种强聚合，所以组合也是依赖。所以：组合是聚合，聚合是关联，关联是依赖。只不过它们的耦合强度不同，整体来说就是：**`组合>聚合>关联>依赖`**。从设计层面来说，依赖和关联表示的是两个类之间的一种“横向平等”的关系，而组合和聚合表示的是两个类之间的一种“整体-局部”的关系，它们描述的维度不同，这个需要在设计的时候从语义层面来区分进而决策。

> 总结：泛化/实现表示的是一种纵向的上下级关系；依赖/关联表示的是一种横向的平等关系；组合/聚合表示的是一种“整体-局部”的关系。

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fe9f851d88648d4b9339c5d3de24de2~tplv-k3u1fbpfcp-zoom-1.image" alt="6种关系"  /></p>



## UML 图实践：观察者模式

观察者模式的定义很简单：A 观察了 B，B 改变了就会通知 A，A 就可以收到 B 的通知。因为 B 要通知 A，所以 B 肯定持有 A，也就是说：被观察者持有观察者，这听起来有点儿不太对劲。那我们可以理解为：订阅/发布模式，A 是订阅者，订阅了 B，B 肯定要有 A 的联系方式，等到 B 改变了，就通过 A 的联系方式通知 A，这里 A 的联系方式就是 A 对象的引用，B 持有 A 的引用，等到自己发生改变了，就通过 A 的引用来调用 A 的方法从而通知 A，**我们称订阅者 A 为 Observer，被订阅者 B 为 Subject**。


理解了类的基本关系之后，我们来看观察者模式的类图，说实话，设计模式的精髓就在于类图，而不是代码。直接上图：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81b54195742c47b2b6704bee904645bd~tplv-k3u1fbpfcp-zoom-1.image" alt="观察者模式"  /></p>

图很简单，我们一点一点来看。

1. 看 Subject，有 abstract 标记，说明是个抽象类，里面有 3 个 "+" 修饰的方法，说明有 3 个 public 的方法，我们可以直接写出代码：

```java
public abstract class Subject {
    public void attach(Observer o);
    public void detach(Observer o);
    public void notify();
}
```

2. 同样看 Observer，它是个 interface，可以写出如下代码：

```java
public interface Observer {
    public void update();
}
```

3. 再来看两个具体类，我们看到了“泛化”和“实现”的标记，分别表示继承和实现，于是可以写出：

```java
public class ConcreteSubject extends Subject {

}

public class ConcreteObserver implements Observer {

}
```

4. 最后，我们看到了那个“聚合”的标记，它表示 Observer 是 Subject 的一部分，也就是说，Observer 是 Subject 的成员变量，并且是 1:n(n>=0) 的，既然是 n 个，说明是个集合，那么 Subject 内部持有一个 Observer 集合，于是我们修改 Subject 的代码：

```java
public abstract class Subject {
    private List<Observer> observers;
    public void attach(Observer o);
    public void detach(Observer o);
    public void notify();
}
```

5. 再进一步，我们根据观察者模式的定义，知道核心功能为：注册、移除、通知，于是我们可以写出最终代码：

```java
public abstract class Subject {
    // 观察者集合，根据类图的“聚合”推出
    private List<Observer> observers = new ArrayList<>();

    // 添加观察者，根据观察者模式的定义推出
    public void attach(Observer o) {
        if(o == null) return;
        observers.add(o);
    }

    // 移除观察者，根据观察者模式的定义推出
    public void detach(Observer o) {
        observers.remove(o);
    }

    // 通知更新，根据观察者模式的定义推出
    public void notify() {
        for(Observer o: observers) o.update();
    }
}
```

于是我们就得到了最终的顶层代码的实现，至于具体的逻辑，就要视具体的业务逻辑来实现了。


**到这里，估计有小伙伴就会有如下疑问了**。

1. 为什么是聚合而不是组合？

    因为 Observer 可以脱离 Subject 而存在，组合的前提是：B 不能脱离 A 而存在，换句话说：要想有 B，必须先有 A。而我们要创建 Observer，显然不需要有 Subject，所以不需要组合。

2. 那么为什么是聚合而不是关联？

    可以是关联！因为聚合本来就是强关联，但是不准确，我们知道，关联表示的是一种平等关系，如果 A 关联 B，B 也能关联 A，而在观察者模式中，显然是被观察者通知观察者，而不是观察者通知被观察者，所以显然应该是：被观察者持有观察者，反之则不行（因为没法 notify 了）。所以，用聚合更准确！

3. 为什么 Subject 定义为抽象类，而 Observer 定义为接口？

    我们知道，抽象类使用的是泛化，而泛化表示一种本能，是天性，我们的 Subject 本来就是用来被观察的，而不是“可以被观察的”，因为如果“可以被观察的”，那么也就“可以不被观察”，这样的话，如果某个地方真的“不被观察”了，也就是不实现 notify() 方法了，那么它就失去了最基本的功能，失去了本能，那么它就没有存在的意义（不能更新要它何用），这是不对的。所以我们用更加“强硬”的泛化来明确表示出“它的本能”，必须实现！
    
    而 Observer 定义为接口，表示“拥有”这个能力，也就是说：可以观察，也可以不观察，当需要的时候，就实现这个接口来表示拥有观察的能力，否则就不实现这个接口，这不是强制的，而是可选择的，所以我们定义为比较“弱势”的接口来表示它的这种后天的扩展的能力！

4. 观察者模式有什么缺点呢?

    很明显，被观察者采用了聚合的方式持有了观察者，notify 的时候通过遍历的方式向下分发结果，那么如果遍历过程中一个 observer 出现了异常，就会导致后续 observer 接收不到通知！怎么解决呢？我们可以将每一个 notify 的调用添加保护，比如：

```java
public void notify() {
    for(Observer o: observers){
        try {
            o.update();
        }catch {Exception e} {
            // 处理异常
        }
    }
}
```



- 这样可以解决，但是还有问题，比如后续的 observer2 依赖于前面的 observer1 的结果，而 observer1 没处理完就抛出了异常，那么 observer2 得到的结果就是错的，这样可能导致连缀问题！所以，需要在设计的时候充分考虑，采取合理的方案。


## 总结

本节我们着重讲了对象之间的六种关系以及它们的 UML 图的绘制，如下。

* `泛化`：也就是继承，实线三角形指向父类。
* `实现`：也就是接口实现，虚线三角形指向父接口。
* `关联`：也就是成员变量，实线箭头指向被关联。
* `依赖`：也就是局部变量，虚线箭头指向被依赖。
* `组合`：也是关联，强调整体-局部关系，局部不可独立存在，实心菱形指向整体。
* `聚合`：也是关联，强调整体-局部关系，局部可独立存在，空心菱形指向整体。

大家可以在理解的基础上去记忆，下一节，我们就着重讲解需求的分析和大纲设计。




