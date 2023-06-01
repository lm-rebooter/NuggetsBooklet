## Lombok 介绍

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6324adf1878b46de9628b0abb7a7ca0a~tplv-k3u1fbpfcp-zoom-1.image)

>Lombok 项目是一个第三方的 Java 工具库，它会自动插入编辑器和构建工具中，Lombok提供了一组非常有用的注释，用来消除Java类中的大量样板代码，比如 setter getter 方法、构造方法等等，仅仅在原来的 JavaBean 类上使用 `@Data` 注解就可以替换数百行代码从而使代码变得更加清爽、简洁且易于维护。

大家可以将它理解为一个工具，仅此而已，千万不要觉得它是一个非用不可的框架。

## 为什么要用 Lombok

在讲解为什么要使用 Lombok 之前，先讲一下为什么我的大部分开源项目中没有使用 Lombok。

1. 非必要

首先是第一个原因，它并不是一个必要的插件。

我的大部分开源项目中没有使用 Lombok 这个工具，随着开源时间的增长，很多人都接触到了我的一些开源项目，因此收到了很多朋友的提醒，让我在项目中使用 Lombok 工具。但是我觉得，这仅仅是个插件、是个工具而已，它不是 JDK 也不是 MySQL 这种基础组件，也并不是每个开发者都知道它、了解它，基于这个原因，我并没有将其放入开源项目中。

2. 对新手开发者不友好

第二个原因是对于新手不友好，虽然它仅仅是个工具，但是它多少还是有一些使用成本的。

我对于 Lombok 也比较熟，用了也比较久，所以我知道使用 Lombok 不仅仅是把它整合到项目代码里去，还需要在开发工具中安装它的插件，否则代码里会一片飘红，代码上的红色波浪线会让你有些抓狂，而安装这个插件又有一点麻烦，对于新手来说 Lombok 很不友好。

3. 强迫队友

如果是自己单独写项目的话可能不用在意这个，但是在实际的企业开发工作中，往往是需要进行团队协作的。在一个开发小组中，其中某一位开发者用到了 Lombok，但是其他同事没有使用或者不知情的情况下会造成一些负面影响，Lombok 的使用要求开发者在开发工具中安装对应的插件，如果未安装插件的话，打开一个使用了 Lombok 的项目的话会提示找不到方法等错误。也就是说，如果项目组中有一个人使用了Lombok，那么其他人最好也要安装 Lombok 插件，否则协同开发时会出现一些小问题，我曾经就是在不知情的情况下被强迫过。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07cab39db4a54119b3d64192ff7995ef~tplv-k3u1fbpfcp-zoom-1.image)

#### Lombok 的优点

说完了它的小缺点，我们再来看一下为什么 Lombok 这么受欢迎，接下来我用一个简单的例子来让大家认识一下它的优点。

以下是项目中的轮播图 POJO 对象的字段及定义：

```java
//轮播图 JavaBean
public class Carousel {
  private Integer carouselId;
  private String carouselUrl;
  private String redirectUrl;
  private Integer carouselRank;
  private Byte isDeleted;
  private Date createTime;
  private Integer createUser;
  private Date updateTime;
  private Integer updateUser;
}
```

如果想要在项目中使用这个对象，我们就必须还要给每一个字段加上 setter 和 getter 方法，有可能还要写构造方法、equals() 方法、toString() 方法等等，这些方法量多而且没有技术含量，但是我们又不得不去写它们。

此时，Lombok 出现了，这个工具的主要作用是通过一些注解，消除刚刚提到的这种看似无用但是又不得不写的代码，Lombok 的解决方式如下：

```java
@Data
public class Carousel {
  private Integer carouselId;
  private String carouselUrl;
  private String redirectUrl;
  private Integer carouselRank;
  private Byte isDeleted;
  private Date createTime;
  private Integer createUser;
  private Date updateTime;
  private Integer updateUser;
}
```

仅仅加一个 `@Data` 注解即可，接下来我们再来看一下 Carousel 这个 POJO 类的结构：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/341cac88a5ab4a7c93806dd55e3f4aa3~tplv-k3u1fbpfcp-zoom-1.image)

我们仅仅在类上添加了一个注解，并没有添加 setter 和 getter 等方法，但是这些方法已经自动生成了，这就是 Lombok 的作用。

Lombok 想要解决的是在项目中 POJO 类大量的 getter/setter、equals()、toString() 等等可能不会用到但是仍然需要在类中定义的方法，在使用 Lombok 之后，将由它来自动帮你实现部分代码的生成工作，将极大减少你的代码量、精简和优化这些 POJO 类。

使用 Lombok 的原因总结如下：

- 很多人对此都提了建议，希望我将 Lombok 添加到开源项目中
- 减少部分冗余代码

既然选择了它，那它肯定也有它的优点，既然用到了它，我就要告诉大家怎样整合 Lombok、怎样在 IDEA 中安装 Lombok 插件，让你们顺利的使用它。

## Spring Boot 整合 Lombok

整合 Lombok 还是比较简单的，只需要在 Spring Boot 项目的 pom.xml 依赖文件中添加 Lombok 的依赖即可：

```xml
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <version>1.18.8</version>
  <scope>provided</scope>
</dependency>
```

这里我用到的是 1.18.8 版本，你可以根据需求自行修改这个版本号。

定义一个 POJO 并添加 `@Data` 注解：

```java
@Data
public class NewBeeMallPOJO {  
  private String title;  
  private int number;
  private Date createTime;
}
```

之后你就可以在其它类中构造 NewBeeMallPOJO 类以及调用其中的 getter/setter toString() 等方法了。

```java
NewBeeMallPOJO newBeeMallPOJO = new NewBeeMallPOJO();

newBeeMallPOJO.setNumber(2);

System.out.println(newBeeMallPOJO.toString());
```

`@Data` 注解是一个比较霸道的注解，它不仅能够生成 POJO 类所有属性的 get() 和 set() 方法，此外还提供了equals、canEqual、hashCode、toString 方法。

如果你不想要生成这么多内容，也可以使用其它的注解来实现你的需求：

- @Setter 注解在属性上，为属性提供 setting 方法
- @Getter 注解在属性上，为属性提供 getting 方法
- @Log4j 注解在类上，为类提供一个 属性名为log 的 log4j 日志对象
- @NoArgsConstructor 注解在类上，为类提供一个无参的构造方法
- @AllArgsConstructor 注解在类上，为类提供一个全参的构造方法
- @Builder 被注解的类加个构造者模式
- @Synchronized  加同步锁
- @NonNull 如果给参数加个这个注解 参数为null会抛出空指针异常
- @Value 注解和 @Data 类似，区别在于它会把所有成员变量默认定义为 private final 修饰，并且不会生成set方法。

部分注解我也写了测试 demo，代码如下所示：

```java
@AllArgsConstructor
@ToString
public class NewBeeMallPOJO3 {

  @Getter
  private String title;
  @Getter
  private int number;
  @Getter
  private Date createTime;

}
```

主要目的是测试全字段构造方法、单独的 toString() 方法以及字段的 getter 方法：

```java
@Test
public void testGetterAndToString() {
  NewBeeMallPOJO3 newBeeMallPOJO3 = new NewBeeMallPOJO3("Lombok测试", 3, new Date());

  System.out.println(newBeeMallPOJO3.getTitle());
  System.out.println(newBeeMallPOJO3.getNumber());
  System.out.println(newBeeMallPOJO3.getClass());
  System.out.println(newBeeMallPOJO3.toString());
}
```

构造者模式模式大家也可以注意一下，添加了 @Builder 注解后就可以使用这种方式来构造类的实例，案例如下：

```java
@Builder
public class NewBeeMallPOJO2 {
  private String title;
  private int number;
  private Date createTime;
}
```

```java
@Test
public void testBuilder() {
  NewBeeMallPOJO2.NewBeeMallPOJO2Builder builder = NewBeeMallPOJO2.builder();
  NewBeeMallPOJO2 newBeeMallPOJO2 =
    builder.number(1)
    .title("Lombok测试")
    .createTime(new Date())
    .build();

  System.out.println(newBeeMallPOJO2.toString());
}
```

## 笔者对 Lombok 的看法

对于类似 Lombok 这种工具的使用，其实也有一些争论，有人觉得很方便推荐大家使用，也有些人会发表一些反对言论，什么破坏封装性啦、影响代码阅读性之类的言论等等，在这里我也说一下我的看法。

1. 这个工具并不是非用不可，之前我也已经谈过，它就是一个工具而已。
2. 使用这个工具确实会给开发者带来一些便利，简化了一些开发内容。
3. 这个工具也有一些缺点，之前也谈过，我并不反对大家用这个工具，但是使用时一定要和团队中的其他开发人员进行充分的沟通。
4. Lombok 只是一个工具而已，千万不要上纲上线。

总结下来，Lombok 有一些缺点，但是我们也不能忽视它的优点，Lombok 就是一个简化开发的工具，如果觉得用起来不错就可以应用到项目中，如果觉得不合适就不用它，然后自行生成 POJO 类的 setter 和 getter方法即可，这些方法的生成也都有快捷键。一定不要上纲上线，觉得破坏封装性或者降低代码的阅读性，即使不用 Lombok 这个工具，你开发的代码就有封装性了？你写的代码阅读性就能好了？也不见得吧。

## 未安装 Lombok 插件的情况说明

后端代码里有很多都用到了 Lombok 的注解：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd9f3e963dca4330afeacc7031d32fc4~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8fad3380da94afd8e9979755d98507c~tplv-k3u1fbpfcp-zoom-1.image)

大家在下载源码后也能够看到，接下来我会介绍 Lombok 插件安装时需要注意的事情，让大家都能够无困扰的使用 Lombok 这个工具。仅仅整合到项目中是不够的，还需要在编辑器中安装 Lombok 的插件，这也是 Lombok 相比较于其它 Java 第三方工具较为另类的地方，像其它工具我们一般在项目中引入其依赖即可直接使用，而使用 Lombok 会多一个步骤，相对来说有一点麻烦。

如果 IDEA 上没有安装 Lombok 插件，那么打开项目后会出现如下情况：

![WX20210310-143748@2x](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42acb7a431bb4922a49dbe2758769d61~tplv-k3u1fbpfcp-zoom-1.image)

如上图所示：

1. IDEA 左侧源码目录出现红色波浪线警告

2. 代码编辑框中出现红色波浪线警告

还有更加离奇的事情，虽然项目中的代码一片飘红，但是项目却能够正常启动和运行，饶是如此，一般人肯定接受不了这种情况，或者说很多人也并不知道这种全是红色警告的项目能够正常启动。在正常的认知里，这种满项目都是红色波浪线的警告的代码一定都不是正确的代码。

试想一下这个场景，有人在开源网站上看到了我们的开源项目，看完项目介绍和功能演示后觉得非常喜欢，就下载源码到本地学习，这位朋友没有安装 Lombok 插件，那么在经历过成功下载源码、正常导入项目、下载完 Maven 依赖之后，他还是看到了代码中一堆的红色波浪线，此时的他是种什么样的心境呢？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27b331d5a3d147f68067f2b51be8ac21~tplv-k3u1fbpfcp-zoom-1.image)

也肯定会有人在心里嘀咕，这个开源项目的作者是坑人的家伙。

前文中也提到过 Lombok 会误伤队友的情况，我是 2017 年开始在项目中使用 Lombok，使用它的原因并不是因为我了解这个工具，而是因为在开发时被队友误伤，一位同事用了 Lombok 但是没有通知组里的其他开发人员，导致其他开发人员拉取到本地的代码里爆出一堆的红色波浪线。

## Lombok 插件安装

不止用 Lombok 会出现意外，在安装 Lombok 插件到 IDEA 中时可能也会碰到意外，关于这些可能导致你开发不顺利的情况我都有做整理，所以才会在现在这个项目中使用它。有了解决方式和闭坑技巧，我才能比较放心的给大家用，不然，我直接在项目里用它就是给大家找麻烦，惹得大家都不痛快，接下来就来讲一下 Lombok 插件的安装。

打开 IDEA 配置界面，点击 Plugins 面板，可以在 IDEA 的插件市场中直接搜索安装。

如下图所示：

![image-20210310144224487](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50410986fffc4ef1833ca945828f0b77~tplv-k3u1fbpfcp-zoom-1.image)

在搜索框中输 “Lombok”并进行搜索，之后可以看到该插件的搜索结果，点击安装即可，安装成功后需要重启 IDEA，之后再打开就可以看到之前的红色波浪线已经不复存在了。

Lombok 插件的版本是 0.32-EAP，因为本教程中使用的 IDEA 编辑器是社区版本，所以对应的 Lombok 插件也是社区版本，如果有读者在本地安装的 IDEA 为商业版本，使用的 Lombok 插件版本会有一些区别。

## Lombk 插件安装失败的问题处理

### 安装失败的原因总结

当然，以上是顺利安装的情况，过程很简单，安装速度也很快。但是有可能遇到不顺利的情况，比如我曾经就碰到过几次，原因无非有两点：

- 插件无法正常下载
- 版本冲突导致安装不成功

这里以我曾经遇到过的案例来讲一下这两种安装失败的情况。

1. 网络问题

在插件市场搜索并且点击安装按钮之后，安装界面始终没有任何反应，在半分钟左右的请求等待后 IDEA 编辑器中直接出现了错误提示弹窗。之后我又把反复的尝试了几次这个安装过程，但是得到的结果都是相同的，之后又尝试了其他的方案，但是都无法正常安装这个插件。

具体原因是与网络有很大的关系，因为 IDEA 插件的网站是国外网站，经常会出现无法访问的情况。

2. 版本不匹配的问题

第二个原因更简单，IDEA 编辑器有不同的版本，Lombok 插件也有不同的版本，如果是下载了不兼容的版本，通过本地安装的方式也无法正常的安装。

### 安装失败的问题处理

由于无法通过插件仓库下载安装，于是想着通过本地下载并手动安装的方式来把 Lombok 插件安装到 IDEA 编辑器中，过程中也遇到了一些小问题，比如不知道在哪里下载 Lombok 插件的安装包、版本号冲突无法安装等等，如果你也遇到了网络问题而导致无法正常安装 Lombok 插件，可以尝试我总结的安装过程，整个过程就是：下载插件包 → 通过本地 install 的方式安装插件。

Lombok 插件的安装包可以通过两个插件库下载，其一是 IDEA 的官方插件仓库，访问地址为：

```http://plugins.jetbrains.com/plugin/6317-lombok-plugin```

其二是 GitHub 网站 lombok-intellij-plugin 仓库中的 release 界面，访问地址是：

```http://plugins.jetbrains.com/plugin/6317-lombok-plugin```

网址打开后可以看到各个版本的 Lombok 插件信息，Lombok 插件的命名中都包含了版本信息，这个版本号也就对应了 IDEA 编辑器的版本，不同版本之间即使安装了也无法正常使用。

首先确认 IDEA 编辑器的版本号，打开 IDEA 的安装目录或者在 IDEA 编辑器中点击“About IDEA”都可以可以查看 IDEA 的版本信息，在《基础运行环境和开发工具准备》这一章节中，演示的 IDEA 版本为 2020.3 社区版，因此需要安装对应的 Lombok 插件版本也是 2020.3。

确认好 IDEA 的版本号就可以选择对应版本的 Lombok 插件，在 IDEA 的官方插件仓库中需要下载的就是 0.32-EAP 版本，发布时间为 2020 年，如下图所示：

![image-20210310152256962](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e6808ace31d4a36b71ff0e871d0d0b7~tplv-k3u1fbpfcp-zoom-1.image)

在 lombok-intellij-plugin 仓库中的 release 界面中需要下载的就是 lombok-plugin-0.32-EAP.zip，发布时间为 2020 年，如下图所示：

![image-20210310152547779](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d812cf4dc7424ca38939f8844429e13f~tplv-k3u1fbpfcp-zoom-1.image)

读者朋友们切记，在下载插件时，一定要和 IDEA 的版本对应，随着 IDEA 的更新，这些插件也会更新，本文演示的是 IDEA 2020.3 社区版本的 lombok 插件安装方式，其它版本的安装方式与此相同。

最后，通过本地安装的方式将前一个步骤中下载的 Lombok 插件包安装到 IDEA 中，依次点击 IDEA → Settings/Preferences → Plugins，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bcae448b31b497184c0420a7f36a401~tplv-k3u1fbpfcp-zoom-1.image)

在 Plugins 面板中有 install from disk 按钮，点击后选择下载的 zip 压缩包文件即可，安装成功。

在安装完插件并且重启 IDEA之后，不管是项目目录还是代码中都不会再有红色波浪线了，也希望大家在运行项目时都能够一切顺利。
