## MVC 自动配置内容

```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1rbfEcYrtrZnmyqQJ6qvavQ 
提取码: 8ust
```

如下图所示，是 Spring Boot 2.3.7 版本的官方解释文档，在 4.7.1 小节中介绍了 Spring Boot 项目对于 Spring MVC 的自动配置内容。

![mvc-auto-config](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8fca17c6a9e47f190d506b066ed5e5b~tplv-k3u1fbpfcp-zoom-1.image)

文档地址为 [boot-features-spring-mvc-auto-configuration](https://docs.spring.io/spring-boot/docs/2.3.7.RELEASE/reference/htmlsingle/#boot-features-spring-mvc-auto-configuration)。

通过官方文档的介绍可以发现，Spring Boot 还做了如下的默认配置：

- 自动配置了视图解析器
- 静态资源文件处理
- 自动注册了大量的转换器和格式化器
- 提供了 HttpMessageConverter 对请求参数和返回结果进行处理
- 自动注册了 MessageCodesResolver 
- 默认欢迎页配置
- favicon 自动配置
- 可配置的 Web 初始化绑定器

以上自动配置都是在 WebMvcAutoConfiguration 自动配置类中操作的。

## WebMvcAutoConfiguration 源码分析

WebMvcAutoConfiguration 自动配置类定义在 spring-boot-autoconfigure-2.3.7.RELEASE.jar 包的 org.springframework.boot.autoconfigure.web 包中，WebMvcAutoConfiguration 类的源码及注释如下：

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)
@AutoConfigureAfter({ DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class,
		ValidationAutoConfiguration.class })
public class WebMvcAutoConfiguration {
  ... 省略部分代码
}
```

**WebMvcAutoConfiguration 类的注解释义如下：**

- @Configuration(proxyBeanMethods = false) 

  指定该类为配置类。

- @ConditionalOnWebApplication(type = Type.SERVLET) 

  当前应用是一个 Servlet Web 应用的时候，这个配置类才生效。

- @AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)

  类的加载顺序，数值越小越先加载，优先加载。

- @ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })

  判断当前 classpath 下是否存在指定类：Servlet 类、 DispatcherServlet 类和 WebMvcConfigurer 类，存在时生效。

- @ConditionalOnMissingBean(WebMvcConfigurationSupport.class)

  判断 IOC 容器中是否存在 WebMvcConfigurationSupport 类型的 bean，不存在时生效。

- @AutoConfigureAfter({ DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class,
  		ValidationAutoConfiguration.class }) 

  自动配置的时机在 DispatcherServletAutoConfiguration 等三个自动配置类之后。

通过源码可得知，WebMvcAutoConfiguration 自动配置类的自动配置触发条件为：当前项目类型必须为 SERVLET （前文中有讲解 WebApplicationType.SERVLET），当前 classpath 下存在 Servlet 类、 DispatcherServlet 类和 WebMvcConfigurer 类且并未向 IOC 容器中注册 WebMvcConfigurationSupport 类型的 bean，@AutoConfigureAfter 注解又定义了自动配置类生效是在 DispatcherServletAutoConfiguration 、 TaskExecutionAutoConfiguration、ValidationAutoConfiguration 自动配置之后。

以上条件都满足时，WebMvcAutoConfiguration 就会开始进行自动配置操作了。

WebMvcAutoConfiguration 中有3个主要的内部类：

- WebMvcAutoConfigurationAdapter
- EnableWebMvcConfiguration
- ResourceChainCustomizerConfiguration

![image-20210102235905573](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/870fca24f7244f94ad98d74ab10da2a2~tplv-k3u1fbpfcp-zoom-1.image)

具体的自动配置逻辑实现都是在这三个内部类中进行实现。

## ViewResolver 视图解析器自动配置

SpringMVC 中的 Controller 控制器可以返回各种各样的视图，比如 JSP 、JSON、 Velocity 、FreeMarker、Thymeleaf、HTML字符流等等，这些视图的解析就涉及到各种视图（即 View）对应的各种视图解析器（即 ViewResolver），视图解析器的作用是将逻辑视图转为物理视图，所有的视图解析器都必须实现ViewResolver接口。

SpringMVC 提供了不同的策略，可以在 Spring Web 上下文中配置一种或多种解析策略，并指定他们之间的先后顺序，每一种映射策略对应一个具体的视图解析器实现类。开发者可以设置一个视图解析器或混用多个视图解析器并指定解析器的优先顺序，SpringMVC 会按视图解析器顺序的优先顺序对逻辑视图名进行解析，直到解析成功并返回视图对象，否则抛出异常。 

在 WebMvcAutoConfigurationAdapter 内部类中，在前置条件满足的情况下自动配置类会向 IOC 容器中注册三个视图解析器，分别是：

- InternalResourceViewResolver
- BeanNameViewResolver
- ContentNegotiatingViewResolver

源码和注释如下：

```java
public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer {
		...省略部分代码


		@Bean
		@ConditionalOnMissingBean // IOC 容器中没有 InternalResourceViewResolver 类的bean时，向容器中注册一个 InternalResourceViewResolver 类型的 bean
		public InternalResourceViewResolver defaultViewResolver() {
			InternalResourceViewResolver resolver = new InternalResourceViewResolver();
			resolver.setPrefix(this.mvcProperties.getView().getPrefix());
			resolver.setSuffix(this.mvcProperties.getView().getSuffix());
			return resolver;
		}

		@Bean
		@ConditionalOnBean(View.class) // IOC 容器中存在 View.class
		@ConditionalOnMissingBean // 满足上面一个条件同时 IOC 容器中没有 BeanNameViewResolver 类的bean时，向容器中注册一个 BeanNameViewResolver 类型的 bean
		public BeanNameViewResolver beanNameViewResolver() {
			BeanNameViewResolver resolver = new BeanNameViewResolver();
			resolver.setOrder(Ordered.LOWEST_PRECEDENCE - 10);
			return resolver;
		}

		@Bean
		@ConditionalOnBean(ViewResolver.class) // IOC 容器中存在 ViewResolver.class
		@ConditionalOnMissingBean(name = "viewResolver", value = ContentNegotiatingViewResolver.class) // 满足上面一个条件同时 IOC 容器中没有名称为 viewResolver 且类型为 ContentNegotiatingViewResolver 类的bean时，向容器中注册一个 ContentNegotiatingViewResolver 类型的 bean
		public ContentNegotiatingViewResolver viewResolver(BeanFactory beanFactory) {
			ContentNegotiatingViewResolver resolver = new ContentNegotiatingViewResolver();
			resolver.setContentNegotiationManager(beanFactory.getBean(ContentNegotiationManager.class));
			// ContentNegotiatingViewResolver uses all the other view resolvers to locate
			// a view so it should have a high precedence
			resolver.setOrder(Ordered.HIGHEST_PRECEDENCE);
			return resolver;
		}
```

BeanNameViewResolver：在控制器中一个方法的返回值的字符串会根据 BeanNameViewResolver 去查找 Bean 的名称为返回字符串的 View 来渲染视图。

InternalResourceViewResolver：这是极为常用的 ViewResolver，主要通过设置前缀、后缀以及控制器中方法来返回视图名的字符串，以得到实际视图内容。

ContentNegotiatingViewResolver：这是一个特殊的视图解析器，官方文档中介绍如下：它并不会自己处理各种视图，而是委派给其他不同的 ViewResolver 来处理不同的 View，级别为最高，详细内容可以查看官方文档：[ContentNegotiatingViewResolver-doc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/view/ContentNegotiatingViewResolver.html)

在普通的 web 项目中，开发者们需要自己手动配置视图解析器，配置文件如下：

```xml
    <!-- 视图解析器 -->
    <bean id="viewResolver"
          class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/"/>
        <property name="suffix" value=".jsp"></property>
    </bean>
```

与之相对比，Spring Boot 的自动配置机制会直接在项目启动过程中将视图解析器注册到 IOC 容器中，而不需要开发者再去做多余的配置。当然，如果不想使用默认的策略，也可以自行添加视图解析器到 IOC 容器中。

## 自动注册 Converter 、Formatter

在 WebMvcAutoConfigurationAdapter 内部类中，含有 addFormatters() 方法，该方法会向 FormatterRegistry 添加 IOC 容器中所有的 Converter、GenericConverter、Formatter 类型的 bean。

addFormatters() 方法源码如下：

```java
	@Override
	public void addFormatters(FormatterRegistry registry) {
		ApplicationConversionService.addBeans(registry, this.beanFactory);
	}
```

实际调用的逻辑代码为 ApplicationConversionService 类的 addBeans() 方法，该方法源码如下：

```java
	public static void addBeans(FormatterRegistry registry, ListableBeanFactory beanFactory) {
		Set<Object> beans = new LinkedHashSet<>();
		beans.addAll(beanFactory.getBeansOfType(GenericConverter.class).values());
		beans.addAll(beanFactory.getBeansOfType(Converter.class).values());
		beans.addAll(beanFactory.getBeansOfType(Printer.class).values());
		beans.addAll(beanFactory.getBeansOfType(Parser.class).values());
		for (Object bean : beans) {
			if (bean instanceof GenericConverter) {
				registry.addConverter((GenericConverter) bean);
			}
			else if (bean instanceof Converter) {
				registry.addConverter((Converter<?, ?>) bean);
			}
			else if (bean instanceof Formatter) {
				registry.addFormatter((Formatter<?>) bean);
			}
			else if (bean instanceof Printer) {
				registry.addPrinter((Printer<?>) bean);
			}
			else if (bean instanceof Parser) {
				registry.addParser((Parser<?>) bean);
			}
		}
	}
```

为了方便读者们理解，这里简单地举一个案例。

在 controller 包中新建 TestController 类并新增 typeConversionTest() 方法，参数分别为：

- goodsName：参数类型为 String 
- weight：参数类型为 float
- type：参数类型为 int
- onSale：参数类型为 Boolean

typeConversionTest() 方法代码如下：

```java
@RestController
public class TestController {

    @RequestMapping("/test/type/conversion")
    public void typeConversionTest(String goodsName, float weight, int type, Boolean onSale) {
        System.out.println("goodsName:" + goodsName);
        System.out.println("weight:" + weight);
        System.out.println("type:" + type);
        System.out.println("onSale:" + onSale);
    }
}
```

编码完成后重启 Spring Boot 项目，项目启动成功后在浏览器中输入地址进行请求，看一下控制台中的打印结果。

第一次请求：

```http://localhost:8080/test/type/conversion?goodsName=iPhoneX&weight=174.5&type=1&onSale=true```

打印结果如下：

```
goodsName:iPhoneX
weight:174.5
type:1
onSale:true
```

第二次请求：

```http://localhost:8080/test/type/conversion?goodsName=iPhone8&weight=174.5&type=2&onSale=0```

打印结果如下：

```
goodsName:iPhone8
weight:174.5
type:2
onSale:false
```
其实这就是 SpringMVC 中的类型转换，HTTP 请求传递的数据都是字符串 String 类型的，上面这个方法在 Controller 中定义，如果该方法对应的地址接收到到浏览器的请求的话，并且请求中含有 goodsName（String 类型）、weight（float类型）、type（int类型）、onSale（Boolean类型）参数且都已经被进行正确的类型转换，大家可以在本地自行测试几次。

以上是简单的类型转换，如果业务需要的话也可以进行自定义类型转换器添加到项目中。

## 消息转换器 HttpMessageConverter

HttpMessageConverter 的设置也是通过 WebMvcAutoConfigurationAdapter 完成的，源码如下：

```java
	@Override
	public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
		this.messageConvertersProvider
				.ifAvailable((customConverters) -> converters.addAll(customConverters.getConverters()));
	}
```

在使用 SpringMVC 框架开发 Web 项目时，大家应该都使用过 @RequestBody、@ResponseBody 注解进行请求实体的转换和响应结果的格式化输出，以普遍使用的 JSON 数据为例，这两个注解的作用分别可以将请求中的数据解析成 JSON 并绑定为实体对象以及将响应结果以 JSON 格式返回给请求发起者，但 HTTP 请求和响应是基于文本的，也就是说在 SpringMVC 内部维护了一套转换机制，也就是开发者们通常所说的“将 JSON 格式的请求信息转换为一个对象，将对象转换为 JSON 格式并输出为响应信息 ”，这些就是 HttpMessageConverter 的作用。

举一个简单的例子，在项目中新建 entity 包并定义一个实体类 SaleGoods，之后通过 @RequestBody、@ResponseBody 注解进行参数的读取和响应，代码如下：

```java
// 实体类
public class SaleGoods {
    private Integer id;
    private String goodsName;
    private float weight;
    private int type;
    private Boolean onSale;
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getGoodsName() {
        return goodsName;
    }
    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }
    public float getWeight() {
        return weight;
    }
    public void setWeight(float weight) {
        this.weight = weight;
    }
    public Boolean getOnSale() {
        return onSale;
    }
    public void setOnSale(Boolean onSale) {
        this.onSale = onSale;
    }
    public int getType() {
        return type;
    }
    public void setType(int type) {
        this.type = type;
    }
    @Override
    public String toString() {
        return "SaleGoods{" +
                "id=" + id +
                ", goodsName='" + goodsName + '\'' +
                ", weight=" + weight +
                ", type=" + type +
                ", onSale=" + onSale +
                '}';
    }
}
```

在 TestController 控制器中新增 httpMessageConverterTest() 方法，代码如下：

```java
@RestController
public class TestController {

    @RequestMapping(value = "/test/httpmessageconverter", method = RequestMethod.POST)
    public SaleGoods httpMessageConverterTest(@RequestBody SaleGoods saleGoods) {
        System.out.println(saleGoods.toString());
        saleGoods.setType(saleGoods.getType() + 1);
        saleGoods.setGoodsName("商品名：" + saleGoods.getGoodsName());
        return saleGoods;
    }
    
}
```

上述代码的作用就是拿到封装好的 SaleGoods 对象，进行简单的属性修改后，最后将对象数据返回。

编码完成后重启项目，并发送请求数据进行测试，请求数据如下：

```json
{	
	"id":1,
	"goodsName":"Spring Boot 2 教程",
	"weight":10.5,
	"type":2,
	"onSale":true
}
```

由于是 POST 请求，因此没有直接使用浏览器访问，而是使用 postman 软件进行模拟请求，最终获得结果如下：

![image-20210102235744872](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/018cd4b8ffc642a39ec31e9bdbf4c7f5~tplv-k3u1fbpfcp-zoom-1.image)

由于消息转换器的存在，对象数据的读取不仅简单而且完全正确，响应时也不用自行封装工具类，使得开发过程变得更加灵活和高效，开发者们使用 Spring Boot 开发项目完全不用再去做额外的配置，只需关心业务编码即可。

## Spring Boot 对静态资源的映射规则

对比 Spring Boot 项目和普通 Spring Web项目的目录结构，很明显地发现目录结构中仅有 java 和 resources两个目录，用于存放资源文件的 webapp 目录在Spring Boot 项目的目录结构中根本不存在，那么 Spring Boot 是如何处理静态资源的呢？WebMvc 自动配置时针对资源文件的访问做了哪些配置？

结合源码来看一下，这部分配置依然是通过 WebMvcAutoConfigurationAdapter 内部类完成的，源码如下：


```java
		@Override
		public void addResourceHandlers(ResourceHandlerRegistry registry) {
			if (!this.resourceProperties.isAddMappings()) {
				logger.debug("Default resource handling disabled");
				return;
			}
			Duration cachePeriod = this.resourceProperties.getCache().getPeriod();
			CacheControl cacheControl = this.resourceProperties.getCache().getCachecontrol().toHttpCacheControl();
            // webjars 文件访问配置
			if (!registry.hasMappingForPattern("/webjars/**")) {
				customizeResourceHandlerRegistration(registry.addResourceHandler("/webjars/**")
						.addResourceLocations("classpath:/META-INF/resources/webjars/")
						.setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl));
			}
            // 静态资源映射配置
			String staticPathPattern = this.mvcProperties.getStaticPathPattern();
			if (!registry.hasMappingForPattern(staticPathPattern)) {
				customizeResourceHandlerRegistration(registry.addResourceHandler(staticPathPattern)
						.addResourceLocations(getResourceLocations(this.resourceProperties.getStaticLocations()))
						.setCachePeriod(getSeconds(cachePeriod)).setCacheControl(cacheControl));
			}
		}
```

如以上源码所示，静态资源的映射是在 addResourceHandlers() 方法中进行映射配置的，类似于 SpringMVC 配置文件中的如下配置代码：

```xml 
<mvc:resources mapping="/images/**" location="/images/" />
```

回到 addResourceHandlers() 源码中来，staticPathPattern 变量值为 "/**"，该值的默认值在 WebMvcProperties 类中。实际的静态资源存放目录通过 getResourceLocations() 方法获取，跟入该方法：

```java
@ConfigurationProperties(prefix = "spring.resources", ignoreUnknownFields = false)
public class ResourceProperties {

	private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {
			"classpath:/META-INF/resources/", "classpath:/resources/",
			"classpath:/static/", "classpath:/public/" };

	private String[] staticLocations = CLASSPATH_RESOURCE_LOCATIONS;
    
	public String[] getStaticLocations() {
		return this.staticLocations;
	}
}    
```

可以得到 Spring Boot 默认的静态资源处理目录为：

- "classpath:/META-INF/resources/",
- "classpath:/resources/"
- "classpath:/static/"
- "classpath:/public/" 

访问当前项目的任何资源，都能够去静态资源的文件夹中查找对应的资源，不存在资源则会显示相应的错误页面，因此在开发 Web 项目时只需要包含这几个目录中的任意一个或者多个，之后将静态资源文件放入其中即可。

为了验证该配置，可以在类路径下分别创建 resources 目录、public 目录、static目录，并分别在三个文件夹中放入静态文件，分别是 PNG 格式文件、CSS 格式文件、HTML 格式文件和 JS 格式文件：

![image-20210111171736604](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7dc9a0c764b64216872fd67fc149af69~tplv-k3u1fbpfcp-zoom-1.image)

之后重启 Spring Boot，启动成功后在打开浏览器并输入以下请求地址分别进行请求：

- http://localhost:8080/logo.png
- http://localhost:8080/main.css
- http://localhost:8080/test.html
- http://localhost:8080/test.js

访问结果如下：

![image-20210105101430358](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7b196fa19d44aeaaee30e3bae6c8a91~tplv-k3u1fbpfcp-zoom-1.image)

![image-20210105101444100](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c0099591f94422fba44f80d46a2a305~tplv-k3u1fbpfcp-zoom-1.image)

![image-20210111171632077](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b80ed1c8226342b482a9cde2fd3b971a~tplv-k3u1fbpfcp-zoom-1.image)

![image-20210105101504213](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/100eb640b35f46fe806c46fe116b501b~tplv-k3u1fbpfcp-zoom-1.image)

可以发现静态资源虽然在不同的目录中但是都能够被正确的返回，这就是 Spring Boot 对静态资源的拦截处理。

当然，开发时也可以在 Spring Boot 项目配置文件中修改这些属性，比如将拦截路径改为 "/static/**"，并将静态资源目录修改为 /file-test，那么默认配置就会失效而使用开发者自定义的配置，修改 application.properties 文件，添加如下配置：

```properties
spring.mvc.static-path-pattern=/static/**
spring.resources.static-locations=classpath:/file-test/
```

修改后，重启 Spring Boot 项目，再次使用原来的 URL 访问以上三个资源文件将会报 404 的错误，如下图所示：

![image-20210105101650250](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb3a94184f974cefb4ec0be33235ed52~tplv-k3u1fbpfcp-zoom-1.image)

如果想要正常访问则需要新建 static-test 目录并将静态资源文件移动到 file-test 目录下，且修改访问路径为：

- http://localhost:8080/static/logo.jpg
- http://localhost:8080/static/main.css
- http://localhost:8080/static/test.js

如下图所示，此时页面中就不会出现 404 错误。

![image-20210105103417115](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48043dcd3413449b9366e3eee3826ad3~tplv-k3u1fbpfcp-zoom-1.image)

## 默认欢迎页和 favicon 配置

#### 默认欢迎页配置

除了静态资源映射之外，Spring Boot 也默认配置了 welcomePage 和 favicon，这两个配置都和静态资源映射相关联，首先来看 welcomePage 的设置，源码如下：

```java
		@Bean
		public WelcomePageHandlerMapping welcomePageHandlerMapping(ApplicationContext applicationContext,
				FormattingConversionService mvcConversionService, ResourceUrlProvider mvcResourceUrlProvider) {
			WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(
					new TemplateAvailabilityProviders(applicationContext), applicationContext, getWelcomePage(),
					this.mvcProperties.getStaticPathPattern());
			welcomePageHandlerMapping.setInterceptors(getInterceptors(mvcConversionService, mvcResourceUrlProvider));
			welcomePageHandlerMapping.setCorsConfigurations(getCorsConfigurations());
			return welcomePageHandlerMapping;
		}

		private Optional<Resource> getWelcomePage() {
			String[] locations = getResourceLocations(this.resourceProperties.getStaticLocations());
			return Arrays.stream(locations).map(this::getIndexHtml).filter(this::isReadable).findFirst();
		}

		private Resource getIndexHtml(String location) {
            // 静态资源目录下的 index.html 文件
			return this.resourceLoader.getResource(location + "index.html");
		}
```

通过源码可以得出，在进行 WebMvc 自动配置时会向 IOC 容器中注册一个 WelcomePageHandlerMapping 类型的 bean，即默认欢迎页，其路径为静态资源目录下的 index.html ，静态资源目录的知识点前文中已经讲解。

在实际进行该功能测试时可以先访问一下当前项目根路径，比如启动项目后访问 http://localhost:8080 地址，结果如下图所示：

![image-20210105103539468](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/646c84de520b4334a1f59876e1ff59ad~tplv-k3u1fbpfcp-zoom-1.image)

此时，服务器返回的是 404 错误页面。

但是，如果开发者在静态资源目录下添加 index.html 就能够看到欢迎页效果，在静态资源目录下新增 index.html 文件，比如选择默认的 /static/ 目录，如下图所示：

![image-20210105103732646](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f0fba5b440948598eef752a73abcecd~tplv-k3u1fbpfcp-zoom-1.image)

index.html 代码如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>welcome page</title>
</head>
<body>
这里是默认欢迎页
</body>
</html>
```

编码完成重启项目，启动成功后，再访问 http://localhost:8080 地址，结果如下图所示：

![image-20210105103823642](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21fef94db6fb4306bd8ccadbda2b439b~tplv-k3u1fbpfcp-zoom-1.image)

此时，可以看到首页已经不再是错误页面了。

#### favicon 图标

> **Favicon**是 *favorites icon* 的缩写，亦被称为**website icon**（网页图标）、**page icon**（页面图标）或 **urlicon**（URL图标）。Favicon 是与某个网站或网页相关联的图标。

不同的网站会放置自身特有的 favicon 图标，如下图所示分别是Spring 、百度、掘金 、GitHub 官方网站的 favicon 图标：

![image-20210105103952622](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92a044334f3c4b84bdb0095d4e487fb5~tplv-k3u1fbpfcp-zoom-1.image)

Spring Boot 框架支持开发者对 favicon 图标进行配置并显示，不过由于版本的迭代，对于 favicon 图标的支持做了一些调整。在 Spring Boot 2.2.x 版本之前，Spring Boot 会默认提供一个 favicon 图标，如下图左侧的那个类似叶子一样的图标。本书所讲解的案例和源码中选择的 Spring Boot 版本都是 2.3.7，可以看到网页中已经不显示 favicon 图标，如下图所示，右侧的浏览器标签栏中不存在 favicon 图标，原因是 Spring Boot 2.2.x 版本之后的版本中已经不再提供默认的 favicon 图标。

![image-20210103002159179](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e565089c0f4d4039a0d96db1adeaf8c7~tplv-k3u1fbpfcp-zoom-1.image)

Spring 官方并没有对 favicon 图标做出特别的说明，不过，官方开发人员在 Spring Boot 开源仓库的 issue 中有提及此事，链接地址为[Remove default favicon](https://github.com/spring-projects/spring-boot/issues/17925)，删除默认图标的原因是担心这个行为会导致网站信息泄露，如果 Spring Boot 继续提供默认的 favicon 图标，这个绿色叶子的小图标很容易被其他人看出项目的开发框架为 Spring Boot。

因此，在Spring Boot 2.2.x 版本之后的版本中不再提供默认的 favicon 图标，开发者不配置自定义的 favicon 图标则浏览器标签栏中就不显示 favicon 图标，开发者如果配置了自定义的 favicon 图标则浏览器标签栏中会显示开发者所配置的 favicon 图标。

结合源码拓展一下知识点，在 Spring Boot 2.2.x 之前的版本中，默认对 favicon 图标进行了设置，源码如下：

```java
		@Configuration //配置类
		@ConditionalOnProperty(value = "spring.mvc.favicon.enabled", matchIfMissing = true) //通过 spring.mvc.favicon.enabled 配置来确定是否进行设置，默认为 true
		public static class FaviconConfiguration implements ResourceLoaderAware {

			private final ResourceProperties resourceProperties;

			private ResourceLoader resourceLoader;

			public FaviconConfiguration(ResourceProperties resourceProperties) {
				this.resourceProperties = resourceProperties;
			}

			@Override
			public void setResourceLoader(ResourceLoader resourceLoader) {
				this.resourceLoader = resourceLoader;
			}

			@Bean
			public SimpleUrlHandlerMapping faviconHandlerMapping() {
				SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
				mapping.setOrder(Ordered.HIGHEST_PRECEDENCE + 1);
				mapping.setUrlMap(Collections.singletonMap("**/favicon.ico",
						faviconRequestHandler()));
				return mapping;
			}

			@Bean
			public ResourceHttpRequestHandler faviconRequestHandler() {
				ResourceHttpRequestHandler requestHandler = new ResourceHttpRequestHandler();
				requestHandler.setLocations(resolveFaviconLocations());
				return requestHandler;
			}

			private List<Resource> resolveFaviconLocations() {
				String[] staticLocations = getResourceLocations(
						this.resourceProperties.getStaticLocations());
				List<Resource> locations = new ArrayList<>(staticLocations.length + 1);
				Arrays.stream(staticLocations).map(this.resourceLoader::getResource)
						.forEach(locations::add);
				locations.add(new ClassPathResource("/"));
				return Collections.unmodifiableList(locations);
			}

```

而在Spring  Boot 2.2.x 之后的版本中，这部分源码已经被删除，spring.mvc.favicon.enabled 配置项也被标记为“过时”。

在 Spring Boot 官方文档中也能够看出，其实 Spring Boot 框架依然支持 favicon 图标的显示，只是该图标文件需要开发者自行配置。

> ##### Custom Favicon
>
> As with other static resources, Spring Boot looks for a `favicon.ico` in the configured static content locations. If such a file is present, it is automatically used as the favicon of the application.

接下来就通过一个实际的案例来讲解如何在 Spring Boot 项目中显示开发者自定义的 favicon 图标。

首先需要制作一个 favicon 文件，并将其放入 static 目录下，也可以是其他静态资源目录。之后再重启项目进行访问，如下图所示，可以看到 favicon 已经替换为自定义设置的 favicon 图标。

> 由于浏览器缓存的原因，可能会出现“自定义 favicon 图标未生效”的错觉，尝试刷新几次页面即可。

![image-20210102235434993](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48b4e099bd1f4847a5a50f9ce40a4e39~tplv-k3u1fbpfcp-zoom-1.image)

## 总结

通过实例的讲解和源码学习，可以发现 Spring Boot 在进行 Web 项目开发时为开发者提供了如此全面而便利的默认设置，以往需要在 web.xml 或者 SpringMVC 配置文件中设置的内容，都改为以编码的方式进行自动注入和实现，开发者在使用 Spring Boot 进行项目开发时，甚至一行配置都不用写就可以直接上手开发功能，不用做任何配置就已经有了视图解析器，也不用自行添加消息转换器，SpringMVC  框架需要的一些功能都已经默认加载完成，对于开发者们来说，开发 Web 项目时 Spring Boot 框架算得上是一件神兵利器。当然，如果这些默认配置不符合实际的业务需求，开发者们也可以自行配置，Spring Boot 也提供了对应的配置参数以及辅助类进行实现，非常灵活。
