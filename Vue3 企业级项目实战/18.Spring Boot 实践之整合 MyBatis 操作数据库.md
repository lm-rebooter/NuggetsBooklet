## MyBatis  简介

MyBatis 的前身是 Apache 社区的一个开源项目 iBatis，于 2010 年更名为 MyBatis。

MyBatis 是支持定制化 SQL、存储过程以及高级映射的优秀的持久层框架，避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集，使得开发人员更加关注 SQL 本身和业务逻辑，不用再去花费时间关注整个复杂的 JDBC 操作过程。

以下为 MyBatis 的结构图：

![MyBatis](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6fd850873b244c58cf411c368cf3468~tplv-k3u1fbpfcp-zoom-1.image)

MyBatis 的优点如下：

- 封装了 JDBC 大部分操作，减少开发人员工作量；
- 相比一些自动化的 ORM 框架，“半自动化”使得开发人员可以自由的编写 SQL 语句，灵活度更高；
- Java 代码与 SQL 语句分离，降低维护难度；
- 自动映射结果集，减少重复的编码工作；
- 开源社区十分活跃，文档齐全，学习成本不高。

鉴于 MyBatis 框架受众更广且后续实践课程的技术选型包含 MyBatis，因此会在本章节内容中介绍它，以及如何使用 Spring Boot 整合 MyBatis 框架对数据层进行功能开发。

```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1UtmS8W7k6XxUT_P3pD57Rw 
提取码: qxp2
```

## mybatis-springboot-starter 介绍

Spring Boot 框架的核心特性包括简化配置并快速开发，当开发者们需要整合某一个功能时，只需要引入其特定的场景启动器 ( starter ) 即可，比如 Web 模块整合、JDBC 模块整合、Thymeleaf 模块整合，开发者们在编码前只需要在 pom.xml 文件中引入对应的 starter 依赖即可。

Spring 官方并没有提供 MyBatis 的场景启动器，但是 MyBatis 官方却紧紧的抱住了 Spring 的大腿，MyBatis 团队提供了 MyBatis 整合 Spring Boot 项目时的场景启动器，也就是 **mybatis-springboot-starter**，大家通过命名方式也能够发现其中的区别，Spring 官方提供的启动器的命名方式都为 **spring-boot-starter-***，与 MyBatis 官方提供的 starter 组件还是有一些差别的，接下来认识一下 **mybatis-springboot-starter** 场景启动器。

MyBatis 官网地址为 [http://www.mybatis.org](http://www.mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/index.html)，感兴趣的读者可以去官网查看更多内容，在官网中对 **mybatis-springboot-starter**  的介绍如下所示：

```
The MyBatis-Spring-Boot-Starter help you build quickly MyBatis applications on top of the Spring Boot. 
```

MyBatis-Spring-Boot-Starter 可以帮助开发者快速创建基于 Spring Boot 的 MyBatis 应用程序，那么使用 **MyBatis-Spring-Boot-Starter** 可以做什么呢？

- 构建独立的 MyBatis 应用程序
- 零模板
- 更少的 XML 配置代码甚至无 XML 配置

## MyBatis 自动配置详解

在正式使用 MyBatis 开发功能之前，先来结合其自动配置源码了解一下 mybatis-spring-boot-starter 场景启动器做了哪些操作，知其然也要知其所以然。

**1.mybatis-spring-boot-starter 依赖：**

在 pom 文件中引入 spring-boot-starter-jdbc 依赖，如下图所示：

![image-20210107142441792](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a00de09d9a6f4ff38779f97b1563079b~tplv-k3u1fbpfcp-zoom-1.image)

点击 mybatis-spring-boot-starter 并进入 mybatis-spring-boot-starter-2.1.3.pom 文件，源码如下：

![image-20210107142736233](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d65af53538344f09a2566ac2e378995~tplv-k3u1fbpfcp-zoom-1.image)

通过源码可以看到，该 pom 文件中引入了 MyBatis 相关依赖以及其自动配置依赖包，同时可以看到该 pom 文件中也包含 JDBC 场景启动器，如果开发者没有在主 pom 配置文件中引入的话，这里也会引入并使用默认的 HikariCP 数据源。

**2.mybatis-spring-boot-starter 自动配置类：**

通过 Maven Libraries 查找 MyBatis 的依赖文件可以得到其自动配置类，名称为 MybatisAutoConfiguration ，该自动配置类与官方的自动配置类不同，它并不是定义在 spring-boot-autoconfigure-2.3.7.RELEASE.jar 中的 org.springframework.boot.autoconfigure 包中，而是定义在 mybatis-spring-boot-autoconfigure-2.1.3.jar 中的 org.mybatis.spring.boot.autoconfigure 包中，目录结构如下：

![image-20210107143055609](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/795fb599503a4455aeb6e3b76cdb497a~tplv-k3u1fbpfcp-zoom-1.image)

跟入 MybatisAutoConfiguration  类，其源码及注释如下：

```java
@org.springframework.context.annotation.Configuration // 配置类
@ConditionalOnClass({ SqlSessionFactory.class, SqlSessionFactoryBean.class }) // 判断当前 classpath 下是否存在指定类，若存在则将当前的配置装载入 Spring 容器
@ConditionalOnSingleCandidate(DataSource.class) // 在当前 IOC 容器中存在 DataSource 数据源对象时
@EnableConfigurationProperties(MybatisProperties.class) // MyBatis 的配置项
@AutoConfigureAfter({ DataSourceAutoConfiguration.class, MybatisLanguageDriverAutoConfiguration.class })// 自动配置时机
public class MybatisAutoConfiguration implements InitializingBean {
  
  private static final Logger logger = LoggerFactory.getLogger(MybatisAutoConfiguration.class);

  private final MybatisProperties properties;

  private final Interceptor[] interceptors;

  private final TypeHandler[] typeHandlers;

  private final LanguageDriver[] languageDrivers;

  private final ResourceLoader resourceLoader;

  private final DatabaseIdProvider databaseIdProvider;

  private final List<ConfigurationCustomizer> configurationCustomizers;

  public MybatisAutoConfiguration(MybatisProperties properties, ObjectProvider<Interceptor[]> interceptorsProvider,
      ObjectProvider<TypeHandler[]> typeHandlersProvider, ObjectProvider<LanguageDriver[]> languageDriversProvider,
      ResourceLoader resourceLoader, ObjectProvider<DatabaseIdProvider> databaseIdProvider,
      ObjectProvider<List<ConfigurationCustomizer>> configurationCustomizersProvider) {
    this.properties = properties;
    this.interceptors = interceptorsProvider.getIfAvailable();
    this.typeHandlers = typeHandlersProvider.getIfAvailable();
    this.languageDrivers = languageDriversProvider.getIfAvailable();
    this.resourceLoader = resourceLoader;
    this.databaseIdProvider = databaseIdProvider.getIfAvailable();
    this.configurationCustomizers = configurationCustomizersProvider.getIfAvailable();
  }
    
  @Bean // 注册 SqlSessionFactory 到 IOC 容器中
  @ConditionalOnMissingBean // 在当前 IOC 容器中不存在 SqlSessionFactory 类型的 bean 时注册
  public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
    SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
    factory.setDataSource(dataSource);
    factory.setVfs(SpringBootVFS.class);
    if (StringUtils.hasText(this.properties.getConfigLocation())) {
      factory.setConfigLocation(this.resourceLoader.getResource(this.properties.getConfigLocation()));
    }
    applyConfiguration(factory);
    if (this.properties.getConfigurationProperties() != null) {
      factory.setConfigurationProperties(this.properties.getConfigurationProperties());
    }
    if (!ObjectUtils.isEmpty(this.interceptors)) {
      factory.setPlugins(this.interceptors);
    }
    if (this.databaseIdProvider != null) {
      factory.setDatabaseIdProvider(this.databaseIdProvider);
    }
    if (StringUtils.hasLength(this.properties.getTypeAliasesPackage())) {
      factory.setTypeAliasesPackage(this.properties.getTypeAliasesPackage());
    }
    if (this.properties.getTypeAliasesSuperType() != null) {
      factory.setTypeAliasesSuperType(this.properties.getTypeAliasesSuperType());
    }
    if (StringUtils.hasLength(this.properties.getTypeHandlersPackage())) {
      factory.setTypeHandlersPackage(this.properties.getTypeHandlersPackage());
    }
    if (!ObjectUtils.isEmpty(this.typeHandlers)) {
      factory.setTypeHandlers(this.typeHandlers);
    }
    if (!ObjectUtils.isEmpty(this.properties.resolveMapperLocations())) {
      factory.setMapperLocations(this.properties.resolveMapperLocations());
    }
    Set<String> factoryPropertyNames = Stream
        .of(new BeanWrapperImpl(SqlSessionFactoryBean.class).getPropertyDescriptors()).map(PropertyDescriptor::getName)
        .collect(Collectors.toSet());
    Class<? extends LanguageDriver> defaultLanguageDriver = this.properties.getDefaultScriptingLanguageDriver();
    if (factoryPropertyNames.contains("scriptingLanguageDrivers") && !ObjectUtils.isEmpty(this.languageDrivers)) {
      // Need to mybatis-spring 2.0.2+
      factory.setScriptingLanguageDrivers(this.languageDrivers);
      if (defaultLanguageDriver == null && this.languageDrivers.length == 1) {
        defaultLanguageDriver = this.languageDrivers[0].getClass();
      }
    }
    if (factoryPropertyNames.contains("defaultScriptingLanguageDriver")) {
      // Need to mybatis-spring 2.0.2+
      factory.setDefaultScriptingLanguageDriver(defaultLanguageDriver);
    }

    return factory.getObject();
  }

  @Bean // 注册 SqlSessionTemplate 到 IOC 容器中
  @ConditionalOnMissingBean // 在当前 IOC 容器中不存在 SqlSessionTemplate 类型的 bean 时注册
  public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
    ExecutorType executorType = this.properties.getExecutorType();
    if (executorType != null) {
      return new SqlSessionTemplate(sqlSessionFactory, executorType);
    } else {
      return new SqlSessionTemplate(sqlSessionFactory);
    }
  }
 
  public static class AutoConfiguredMapperScannerRegistrar implements BeanFactoryAware, ImportBeanDefinitionRegistrar {

    private BeanFactory beanFactory;

    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {

      if (!AutoConfigurationPackages.has(this.beanFactory)) {
        logger.debug("Could not determine auto-configuration package, automatic mapper scanning disabled.");
        return;
      }

      logger.debug("Searching for mappers annotated with @Mapper");

      List<String> packages = AutoConfigurationPackages.get(this.beanFactory);
      if (logger.isDebugEnabled()) {
        packages.forEach(pkg -> logger.debug("Using auto-configuration base package '{}'", pkg));
      }

      BeanDefinitionBuilder builder = BeanDefinitionBuilder.genericBeanDefinition(MapperScannerConfigurer.class);
      builder.addPropertyValue("processPropertyPlaceHolders", true);
      builder.addPropertyValue("annotationClass", Mapper.class);
      builder.addPropertyValue("basePackage", StringUtils.collectionToCommaDelimitedString(packages));
      BeanWrapper beanWrapper = new BeanWrapperImpl(MapperScannerConfigurer.class);
      Stream.of(beanWrapper.getPropertyDescriptors())
          // Need to mybatis-spring 2.0.2+
          .filter(x -> x.getName().equals("lazyInitialization")).findAny()
          .ifPresent(x -> builder.addPropertyValue("lazyInitialization", "${mybatis.lazy-initialization:false}"));
      registry.registerBeanDefinition(MapperScannerConfigurer.class.getName(), builder.getBeanDefinition());
    }

    @Override
    public void setBeanFactory(BeanFactory beanFactory) {
      this.beanFactory = beanFactory;
    }

  }

  @org.springframework.context.annotation.Configuration // 配置类
  @Import(AutoConfiguredMapperScannerRegistrar.class) // 引入 AutoConfiguredMapperScannerRegistrar 类
  @ConditionalOnMissingBean({ MapperFactoryBean.class, MapperScannerConfigurer.class }) // 在当前 IOC 容器中不存在 MapperFactoryBean 和 MapperScannerConfigurer 类型的 bean 时注册
  public static class MapperScannerRegistrarNotFoundConfiguration implements InitializingBean {

    @Override
    public void afterPropertiesSet() {
      logger.debug(
          "Not found configuration for registering mapper bean using @MapperScan, MapperFactoryBean and MapperScannerConfigurer.");
    }

  }
}
```

**DataSourceAutoConfiguration 类的注解释义如下：**

- @Configuration(proxyBeanMethods = false) 

  指定该类为配置类。

- @ConditionalOnClass({{ SqlSessionFactory.class, SqlSessionFactoryBean.class }) 

  判断当前 classpath 下是否存在指定类：SqlSessionFactory 类和 SqlSessionFactoryBean 类，存在则生效。

- @ConditionalOnSingleCandidate(DataSource.class) 

  判断 IOC 容器中是否存在类型为 DataSource 的 bean，存在则生效。

- @AutoConfigureAfter({ DataSourceAutoConfiguration.class, MybatisLanguageDriverAutoConfiguration.class })

  自动配置的时机。

结合该自动配置类的源码及源码注释可得知，Mybatis 自动配置类的自动配置触发机制为：当前项目的类路径中存在 SqlSessionFactory 类和 SqlSessionFactoryBean 类且 IOC 容器中存在 DataSource 类型的 bean，因为当前项目引入了 spring-boot-starter-jdbc 和 mybatis-spring-boot-starter 两个场景启动器，启动器中包含了相关依赖，且引入 spring-boot-starter-jdbc 后数据源已自动配置，该知识点前文已经讲解，因此 IOC 容器中存在 DataSource 类型的 bean，即 MyBatis 自动配置类会生效。

**3.DataSourceAutoConfiguration 自动配置类的作用**

以上是 MyBatis 自动配置流程生效的解释，接下来是另外一个问题，MyBatis 自动配置步骤做了哪些事情？

通过前文的条件注解分析可知，当自动配置流程开始且条件满足后，自动配置类 DataSourceAutoConfiguration 进行自动配置时会判断当前 IOC 容器中是否存在 SqlSessionFactory 和 SqlSessionTemplate 类型的 bean，如果存在则不做操作，如果不存在则初始化 SqlSessionFactory 类和 SqlSessionTemplate 类并注册到 IOC 容器中，MyBatis 框架对于数据库的访问和相关操作都是基于这两个对象展开。

除此之外，DataSourceAutoConfiguration 自动配置类还有一个静态内部类 MapperScannerRegistrarNotFoundConfiguration 类，当项目中不存在 @MapperScan 注解时生效，它是用于扫描项目中标注了 @Mapper 注解的接口，将这些接口与 xxxMapper.xml 文件一一映射后注入到 IOC 容器中以供业务代码调用来操作数据库，查看 @Mapper 注解的源码可知，它的定义中并没有 @Component 注解，因此 Spring 框架本身并不支持 @Mapper 注解的扫描，所以需要由 MyBatis 框架来完成这个操作，这一步的操作就由 MapperScannerRegistrarNotFoundConfiguration 类引入的 AutoConfiguredMapperScannerRegistrar 类来完成。当项目中存在 @MapperScan 注解时，Mapper 文件的扫描和配置工作就由 MapperScannerRegistrar 类来完成，感兴趣的读者可以自行查看这部分源码，这里就不再展开叙述。

在未使用 Spring Boot 框架配置 MyBatis 组件时，需要在 Spring 配置文件中增加 MyBatis 相关配置才能够正常的使用 MyBatis 框架，配置文件如下：

```xml
<bean id="dataSource"
      class="org.springframework.jdbc.datasource.DriverManagerDataSource">
  <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
  <property name="url"
            value="jdbc:mysql://localhost:3306/db"/>
  <property name="username" value="root"/>
  <property name="password" value="123456"/>
</bean>

<!-- 配置mybatis的sqlSessionFactory -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <property name="dataSource" ref="dataSource"/>
  <!-- 自动扫描mappers.xml文件 -->
  <property name="mapperLocations" value="classpath:com/**/mappers/*.xml"></property>
  <!-- mybatis配置文件 -->
  <property name="configLocation" value="classpath:mybatis-config.xml"></property>
</bean>

<!-- DAO接口所在包名，Spring会自动查找其下的类 -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
  <property name="basePackage" value="com.core.dao"/>
  <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"></property>
</bean>
```

其实，以上源码分析中，DataSourceAutoConfiguration 自动配置类所做的就是之前开发者们需要手动完成的 MyBatis 配置文件中的内容，只是在 Spring Boot 项目中，这个步骤由 Spring Boot 框架接管了。与 Spring 项目中需要手动配置 MyBatis 相比，Spring Boot 自动配置了使用 MyBatis 框架时所需的相关组件，这个过程对于开发者来说是无感知的，虽然源码看起来比较吃力，但是实际使用的时候其实并不会有这种感觉，书中介绍这部分源码只是为了大家能够更好的理解 Spring Boot 项目中对于 MyBatis 框架的自动配置，知晓其原理。

实际开发过程中，开发者们只需引入 starter 依赖即可零配置使用 MyBatis 框架进行编码，这也是 Spring Boot 框架“约定优于配置”特性的体现，如果开发者不进行自定义的配置，就可以把相关的配置过程交给 Spring Boot 框架，如果有自定义的需求，那么开发者也可以自己去配置 MyBatis 框架相关的组件，有了自定义的配置，MyBatis 自动配置流程的部分步骤就不会执行。

总结下来可以发现，mybatis-spring-boot-starter 场景启动器首先在项目中引入了 MyBatis 的相关依赖，而其中的自动配置类会向 Spring 的 IOC 容器中注册 SqlSessionFactory 和 SqlSessionTemplate 两个 MyBatis 开发中必不可缺的对象，并扫描 Mapper 组件注册到 IOC 容器中。

读者朋友们可以参考本节内容进行源码探索，学习 MyBatis 的自动配置原理。

## Spring Boot 整合 MyBatis 过程

源码分析之后，接下来将结合实际的代码案例讲解一下 Spring Boot 框架整合 MyBatis 操作数据库的流程。

#### 添加依赖

想要把 MyBatis 框架整合到 Spring Boot 项目中，首先需要将其依赖配置增加到 pom.xml 文件中，本书代码案例中选择的 mybatis-springboot-starter 版本为 2.1.3，需要 Spring Boot 版本达到 2.0 或者以上版本，同时需要将数据源依赖和 JDBC 依赖也添加到配置文件中，pom.xml 配置文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.3.7.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>ltd.newbee.mall</groupId>
	<artifactId>newbee-mall</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>newbee-mall</name>
	<description>mysql-demo</description>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-jdbc</artifactId>
		</dependency>

		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<scope>runtime</scope>
		</dependency>

		<!-- 引入 MyBatis 场景启动器，包含其自动配置类及 MyBatis 3 相关依赖 -->
		<dependency>
			<groupId>org.mybatis.spring.boot</groupId>
			<artifactId>mybatis-spring-boot-starter</artifactId>
			<version>2.1.3</version>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
			<exclusions>
				<exclusion>
					<groupId>org.junit.vintage</groupId>
					<artifactId>junit-vintage-engine</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

	<repositories>
		<repository>
			<id>alimaven</id>
			<name>aliyun maven</name>
			<url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
			<releases>
				<enabled>true</enabled>
			</releases>
			<snapshots>
				<enabled>false</enabled>
			</snapshots>
		</repository>
	</repositories>

</project>
```

这样，MyBatis 的场景启动器和相关依赖就整合进项目中了。

#### application.properties 配置

Spring Boot 整合 MyBatis 时几个比较需要注意的配置参数：

- **mybatis.config-location**

  配置 mybatis-config.xml 路径，mybatis-config.xml 中配置 MyBatis 基础属性，如果项目中配置了 mybatis-config.xml 文件需要设置该参数

- **mybatis.mapper-locations**

  配置 Mapper 文件对应的 XML 文件路径

- **mybatis.type-aliases-package**

  配置项目中实体类包路径

```xml
mybatis.config-location=classpath:mybatis-config.xml
mybatis.mapper-locations=classpath:mapper/*Dao.xml
mybatis.type-aliases-package=ltd.newbee.mall.entity
```

开发时只配置 mapper-locations 即可，最终的 application.properties 文件如下：

```properties
spring.datasource.name=newbee-mall-datasource
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/test_db?useUnicode=true&serverTimezone=Asia/Shanghai&characterEncoding=utf8&autoReconnect=true&useSSL=false&allowMultiQueries=true&useAffectedRows=true
spring.datasource.username=root
spring.datasource.password=123456

mybatis.mapper-locations=classpath:mapper/*Mapper.xml
```

> 各位开发者可以根据自己数据库的配置修改帐号和密码。

#### 启动类增加 Mapper 扫描

在启动类中添加对 Mapper 包扫描 @MapperScan，Spring Boot 启动的时候会自动加载包路径下的 Mapper 接口：

```java
@SpringBootApplication
@MapperScan("ltd.newbee.mall.dao") //添加 @Mapper 注解
public class NewbeeMallApplication {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

当然也可以直接在每个 Mapper 接口上面添加 @Mapper 注解，但是如果 Mapper 接口数量较多，在每个 Mapper  接口上加注解是比较繁琐的，建议使用扫描注解。

## Spring Boot 整合 MyBatis 进行数据库的增删改查

在开发项目之前需要在 MySQL 中先创建数据库和表作为项目演示使用，SQL 语句如下：

```sql
DROP TABLE IF EXISTS `tb_user`;

CREATE TABLE `tb_user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '登录名',
  `password` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '密码',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

/*Data for the table `jdbc_test` */

insert  into `tb_user`(`id`,`name`,`password`) values (1,'Spring Boot','123456'),(2,'MyBatis','123456'),(3,'Thymeleaf','123456'),(4,'Java','123456'),(5,'MySQL','123456'),(6,'IDEA','123456');
```

在数据库中新建了一个名称为 tb_user 的数据表，表中有 id , name , password 三个字段，在本机测试时可以直接将以上 SQL 拷贝到 MySQL 中执行即可。

接下来是功能实现步骤，使用 MyBatis 进行数据的增删改查操作。

#### 新建实体类和 Mapper 接口

新建 entity 包并在 entity 包下新建 User 类，将 tb_user 中的字段映射到该实体类中，代码如下：

```java
package ltd.newbee.mall.entity;

public class User {

    private Integer id;
    private String name;
    private String password;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```

新建 dao 包并在 dao 包中新建 UserDao 接口，并定义增删改查四个方法，代码如下：

```java
package ltd.newbee.mall.dao;
import ltd.newbee.mall.entity.User;
import java.util.List;

/**
 * @author 十三
 * MyBatis 功能测试
 */
public interface UserDao {
    /**
     * 返回数据列表
     *
     * @return
     */
    List<User> findAllUsers();

    /**
     * 添加
     *
     * @param User
     * @return
     */
    int insertUser(User User);

    /**
     * 修改
     *
     * @param User
     * @return
     */
    int updUser(User User);

    /**
     * 删除
     *
     * @param id
     * @return
     */
    int delUser(Integer id);
}
```

#### 创建 Mapper 接口的映射文件

在 resources 目录下新建 mapper 目录，并在 mapper 目录下新建 Mapper 接口的映射文件 UserMapper.xml，之后进行映射文件的编写。

1.首先，定义映射文件与 Mapper 接口的对应关系，比如该示例中，需要将 UserMapper.xml 文件与对应的 UserDao 接口类之间的关系定义出来：

```xml
<mapper namespace="ltd.newbee.mall.dao.UserDao">
```

2.之后，配置表结构和实体类的对应关系：

```xml
<resultMap type="ltd.newbee.mall.entity.User" id="UserResult">
  <result property="id" column="id"/>
  <result property="name" column="name"/>
  <result property="password" column="password"/>
</resultMap>
```

3.最后，按照对应的接口方法，编写增删改查方法具体的 SQL 语句，最终的 UserMapper.xml 文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="ltd.newbee.mall.dao.UserDao">
  <resultMap type="ltd.newbee.mall.entity.User" id="UserResult">
    <result property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="password" column="password"/>
  </resultMap>

  <select id="findAllUsers" resultMap="UserResult">
    select id,name,password from tb_user
    order by id desc
  </select>

  <insert id="insertUser" parameterType="ltd.newbee.mall.entity.User">
    insert into tb_user(name,password)
    values(#{name},#{password})
  </insert>

  <update id="updUser" parameterType="ltd.newbee.mall.entity.User">
    update tb_user
    set
    name=#{name},password=#{password}
    where id=#{id}
  </update>

  <delete id="delUser" parameterType="int">
    delete from tb_user where id=#{id}
  </delete>
</mapper>
```

#### 新建 MyBatisController 

为了对 MyBatis 进行功能测试，在 controller 包下新建 MyBatisController 类，并新增 4 个方法分别接收对于 tb_user 表的增删改查请求，代码如下：

```java
package ltd.newbee.mall.controller;

import ltd.newbee.mall.dao.UserDao;
import ltd.newbee.mall.entity.User;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
public class MyBatisController {

    @Resource
    UserDao userDao;

    // 查询所有记录
    @GetMapping("/users/mybatis/queryAll")
    public List<User> queryAll() {
        return userDao.findAllUsers();
    }

    // 新增一条记录
    @GetMapping("/users/mybatis/insert")
    public Boolean insert(String name, String password) {
        if (StringUtils.isEmpty(name) || StringUtils.isEmpty(password)) {
            return false;
        }
        User user = new User();
        user.setName(name);
        user.setPassword(password);
        return userDao.insertUser(user) > 0;
    }

    // 修改一条记录
    @GetMapping("/users/mybatis/update")
    public Boolean update(Integer id, String name, String password) {
        if (id == null || id < 1 || StringUtils.isEmpty(name) || StringUtils.isEmpty(password)) {
            return false;
        }
        User user = new User();
        user.setId(id);
        user.setName(name);
        user.setPassword(password);
        return userDao.updUser(user) > 0;
    }

    // 删除一条记录
    @GetMapping("/users/mybatis/delete")
    public Boolean delete(Integer id) {
        if (id == null || id < 1) {
            return false;
        }
        return userDao.delUser(id) > 0;
    }
}
```

上述步骤完成后，项目的代码目录如下图所示：

![WX20210111-160615@2x](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c1c7a75c3a34d5fb17e8f01dd48673d~tplv-k3u1fbpfcp-zoom-1.image)

编码完成后启动 Spring Boot 项目，启动成功后打开浏览器中对以上四个功能进行验证。

**1.Spring Boot 整合 MyBatis 向数据库中新增记录。**

在地址栏输入如下地址：

```http://localhost:8080/users/mybatis/insert?name=十三&password=1234567```

传参分别为“十三”和“1234567”，表示向数据库中新增一条记录，其中 name 字段值为“十三”，password 字段值为“1234567”，页面返回结果如下：

![image-20210107173053707](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c02d01b9fad242d186f6c7847918a815~tplv-k3u1fbpfcp-zoom-1.image)

此时查看数据库中的记录，可以看到已经新增成功，新的记录已经生成，数据如下图所示：

![image-20210107173605571](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d4f7cbe68b0422e856d543d44361d30~tplv-k3u1fbpfcp-zoom-1.image)

**2.Spring Boot 整合 MyBatis 删除数据库中的记录。**

在地址栏输入如下地址：

```http://localhost:8080/delete?id=3```

传参为 5，表示从数据库表中删除一条 id 为 5 的记录，页面返回结果如下：

![image-20210107173759835](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e97fbc255fb432c8509fc96c56dc6b8~tplv-k3u1fbpfcp-zoom-1.image)



此时查看数据库中的记录，id 为 5 的记录已经被删除成功，数据如下图所示：

![image-20210107173901505](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/387a270e65124324a32e6f48aa67e122~tplv-k3u1fbpfcp-zoom-1.image)

**3.Spring Boot 整合 MyBatis 修改数据库中的记录。**

在地址栏输入如下地址：

```http://localhost:8080/users/mybatis/update?id=1&name=book01&password=12345678```

传参分别为为 “1”、“book01”和“12345678”，表示修改数据库表中 id 为 1 的记录，页面返回结果如下：

![image-20210107174052760](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9d02bbfdc2f44949aeafb260e23b80d~tplv-k3u1fbpfcp-zoom-1.image)

此时查看数据库中的记录，id 为 1 的记录已经修改成功，数据如下图所示：

![image-20210107174139644](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70ecf557e0b146cc9a2f0558c5ee2353~tplv-k3u1fbpfcp-zoom-1.image)

**4.Spring Boot 整合 MyBatis 查询数据库中的记录。**

在地址栏输入如下地址：

```http://localhost:8080/users/mybatis/queryAll```

该请求会查询出数据库中的所有记录，页面返回结果如下：

![image-20210107174216282](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef1744fc6197448db054c0781feac785~tplv-k3u1fbpfcp-zoom-1.image)

以上为笔者进行功能测试的步骤，大家在测试时也可以尝试多添加几条记录，如果能够正常获取到记录以及正确的 操作 tb_user 表中的记录就表示功能整合成功！