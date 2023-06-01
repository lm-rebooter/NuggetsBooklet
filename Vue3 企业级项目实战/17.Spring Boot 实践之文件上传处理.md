文件上传是比较常见和被用户熟知的功能模块，常用场景有头像设置、产品预览图、报表文件保存等等，在这些场景中都需要使用到文件上传功能，本篇文章将会对文件上传的大致流程及功能设计进行详细的介绍，并结合实践案例讲解如何使用 Spring Boot 实现文件上传及相关注意事项，对文件上传的整个流程进行闭环。

本篇文章所涉及到的知识点如下：

- Spring MVC 文件上传流程解读
- Spring Boot 文件上传功能实现
- Spring Boot 文件上传路径回显

```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1Qg7sWcCT56wLhnikZeG3-Q 
提取码: c2p5
```

## Spring MVC 文件上传流程

在模块功能实现前，十三先通过源码分析，具体介绍下 Spring MVC 是如何进行文件上传处理的，其中包括源码代码调用过程以及对 Spring MVC 框架里文件处理部分代码的解析。

### 源码调用链

利用 Spring MVC 实现文件上传功能，离不开对 MultipartResolver 的设置，MultipartResolver 这个类你可以将其视为 Spring MVC 实现文件上传功能时的工具类，这个类也只会在文件上传中发挥作用。在配置了具体实现类之后，Spring MVC 中的 DispatcherServlet 在处理请求时会调用 MultipartResolver 中的方法判断此请求是不是文件上传请求。如果是，DispatcherServlet 将调用 MultipartResolver 的 resolveMultipart(request) 方法对该请求对象进行装饰并返回一个新的 MultipartHttpServletRequest 供后继处理流程使用。注意，此时的请求对象会由 HttpServletRequest 类型转换成 MultipartHttpServletRequest 类型（或者 MultipartHttpServletRequest 的实现类），这个类中会包含所上传的文件对象，可供后续流程直接使用，而无需自行在代码中实现对文件内容的读取逻辑。

根据这一过程，十三绘制了如下代码调用时序图：

![multipart-source](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf4c401dc3b1411581a90bd2bc8cd533~tplv-k3u1fbpfcp-zoom-1.image)

如上图所示，当收到请求时，DispatcherServlet 的 checkMultipart() 方法会调用 MultipartResolver 的 isMultipart() 方法判断请求中是否包含文件。

如果请求数据中包含文件，则调用 MultipartResolver 的 resolveMultipart() 方法对请求的数据进行解析，然后将文件数据解析成 MultipartFile 并封装在 MultipartHttpServletRequest（继承了 HttpServletRequest）对象中，最后传递给 Controller 控制器。

### 源码分析

从上面的时序图中，可以看出我们选用的 MultipartResolver 是 StandardServletMultipartResolver 实现类：

```
//StandardServletMultipartResolver实现了MultipartResolver接口，是它的一个具体实现类

public class StandardServletMultipartResolver implements MultipartResolver{
   ....
}
```

接下来，我们更进一步，深入到源码中，具体分析时序图所展示的、实现文件上传的代码调用过程。

**首先，我们看下 DispatcherServlet 收到 Request 请求后的执行步骤。**

- 首先分析判断 HttpServletRequest 请求，判断此对象中是否包含文件信息。

- 如果包含文件，则调用相应的方法将文件对象封装到 HttpServletRequest 对象中，源码如下：

```java
	protected HttpServletRequest checkMultipart(HttpServletRequest request) throws MultipartException {
    	//1.判断是否包含文件
		if (this.multipartResolver != null && this.multipartResolver.isMultipart(request)) {
			if (WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class) != null) {
				if (request.getDispatcherType().equals(DispatcherType.REQUEST)) {
					logger.trace("Request already resolved to MultipartHttpServletRequest, e.g. by MultipartFilter");
				}
			}
			else if (hasMultipartException(request) ) {
				logger.debug("Multipart resolution previously failed for current request - " +
						"skipping re-resolution for undisturbed error rendering");
			}
			else {
				try {
					//2.将文件对象封装到Request中
					return this.multipartResolver.resolveMultipart(request);
				}
				catch (MultipartException ex) {
					if (request.getAttribute(WebUtils.ERROR_EXCEPTION_ATTRIBUTE) != null) {
						logger.debug("Multipart resolution failed for error dispatch", ex);
						// Keep processing error dispatch with regular request handle below
					}
					else {
						throw ex;
					}
				}
			}
		}
		// If not returned before: return original request.
		return request;
	}
```

其中 `this.multipartResolver.isMultipart(request)` 则是调用 StandardServletMultipartResolver 的 `isMultipart()` 方法，源码如下：

```
	public boolean isMultipart(HttpServletRequest request) {
		return StringUtils.startsWithIgnoreCase(request.getContentType(), "multipart/");
	}
```

对请求头中的 contentType 对象进行判断，请求的 contentType 不为空且 contentType 的值以 `multipart/` 开头，此时会返回 true，否则将不会将这次请求标示为文件上传请求。

返回 true 后，表明此次请求中含有文件，接下来 DispatcherServlet 将会调用 `resolveMultipart(request)` 重新封装 Request 对象，实际调用的是 StandardServletMultipartResolver  的 `resolveMultipart()` 方法，源码如下：

```java
	public MultipartHttpServletRequest resolveMultipart(HttpServletRequest request) throws MultipartException {
		return new StandardMultipartHttpServletRequest(request, this.resolveLazily);
	}
```

跟踪源码调用链，得出最终调用的方法是：

```java
	public StandardMultipartHttpServletRequest(HttpServletRequest request, boolean lazyParsing)
			throws MultipartException {

		super(request);
		if (!lazyParsing) {
			parseRequest(request);
		}
	}


	private void parseRequest(HttpServletRequest request) {
		try {
			Collection<Part> parts = request.getParts();
			this.multipartParameterNames = new LinkedHashSet<>(parts.size());
			MultiValueMap<String, MultipartFile> files = new LinkedMultiValueMap<>(parts.size());
			for (Part part : parts) {
				String headerValue = part.getHeader(HttpHeaders.CONTENT_DISPOSITION);
				ContentDisposition disposition = ContentDisposition.parse(headerValue);
				String filename = disposition.getFilename();
				if (filename != null) {
					if (filename.startsWith("=?") && filename.endsWith("?=")) {
						filename = MimeDelegate.decode(filename);
					}
					files.add(part.getName(), new StandardMultipartFile(part, filename));
				}
				else {
					this.multipartParameterNames.add(part.getName());
				}
			}
			setMultipartFiles(files);
		}
		catch (Throwable ex) {
			handleParseFailure(ex);
		}
	}
```

由上面代码可以看出，该方法是对请求对象中的文件参数进行解析和处理，文件解析最终的实现方法是 Request 类中的 getParts() 方法，由于篇幅限制就不再继续贴代码了，通过阅读源码我们可以得知，checkMultipart() 方法最终会得到一个 StandardMultipartHttpServletRequest 对象，该对象是 MultipartHttpServletRequest 接口类的一个实现类，同时该类中含有已经解析的文件对象，之后就可以在具体的 Controller 类中直接使用文件对象，而不用自行实现文件对象的解析了。

## Spring Boot 文件上传功能实现

这一小节将会通过一个文件上传案例的实现来讲解如何使用 Spring Boot 进行文件上传功能。

在 Spring Boot 中也是通过 MultipartResolver 类进行文件上传，与普通的 Spring web 项目不同的是，Spring Boot 在自动配置 DispatcherServlet 时已经配置好了 MultipartResolver ，这个知识点在前文的自动配置讲解中也有提到，因此无需再像原来那样在 SpringMVC 配置文件中增加文件上传配置的 bean。

### 常用配置

由于 Spring Boot 自动配置机制的存在，我们并不需要进行多余的设置，只要已经在 pom 文件中引入了 web starter 模块即可直接进行文件上传功能，在前面的实验中我们已经将 web 模块整合到项目中，因此无需再进行整合。虽然不用配置也可以使用文件上传，但是有些开发者可能会在文件上传时有一些特殊的需求，因此也需要对 Spring Boot 中 MultipartFile 的常用设置进行介绍，配置和默认值如下：

![multipart-config](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f67eef5f2c4426d92f4a4fcea0bf447~tplv-k3u1fbpfcp-zoom-1.image)

配置含义注释：

- **spring.servlet.multipart.enabled** 

  是否支持 multipart 上传文件，默认支持

- **spring.servlet.multipart.file-size-threshold** 

  文件大小阈值，当大于这个阈值时将写入到磁盘，否则存在内存中，（默认值 0 ，一般情况下不用特意修改）

- **spring.servlet.multipart.location** 

  上传文件的临时目录

- **spring.servlet.multipart.max-file-size** 

  最大支持文件大小，默认 1 M ，该值可适当的调整

- **spring.servlet.multipart.max-request-size=10Mb **

  最大支持请求大小，默认 10 M

- **spring.servlet.multipart.resolve-lazily** 

  判断是否要延迟解析文件（相当于懒加载，一般情况下不用特意修改）

### 上传功能实现

#### 新建文件上传页面

在 static 目录中新建 upload-test.html，上传页面代码如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Spring Boot 文件上传测试</title>
</head>
<body>
<form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="file" />
    <input type="submit" value="文件上传" />
</form>
</body>
</html>
```

这应该是大家都很熟悉的一个文件上传页面 demo ，文件上传的请求地址为 /upload，请求方法为 post，需要注意的是在文件上传时要设置 enctype="multipart/form-data"，页面中包含一个文件选择框和一个提交框，如下所示：

![upload-test](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/452321a67caf47aa8728669153da7e7f~tplv-k3u1fbpfcp-zoom-1.image)

#### 新建文件上传处理 Controller

在 controller 包下新建 UploadController 并编写实际的文件上传逻辑代码，代码如下：

```java
package ltd.newbee.mall.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

@Controller
public class UploadController {
    // 文件保存路径为 D 盘下的 upload 文件夹，可以按照自己的习惯来修改
    private final static String FILE_UPLOAD_PATH = "D:\\upload\\";
    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ResponseBody
    public String upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return "上传失败";
        }
        String fileName = file.getOriginalFilename();
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
        //生成文件名称通用方法
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
        Random r = new Random();
        StringBuilder tempName = new StringBuilder();
        tempName.append(sdf.format(new Date())).append(r.nextInt(100)).append(suffixName);
        String newFileName = tempName.toString();
        try {
            // 保存文件
            byte[] bytes = file.getBytes();
            Path path = Paths.get(FILE_UPLOAD_PATH + newFileName);
            Files.write(path, bytes);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "上传成功";
    }
}
```

由于已经 Spring Boot 已经自动配置了 MultipartFile ，因此能够直接在控制器方法中使用 MultipartFile 读取文件信息， **@RequestParam** 中的文件名称需要与文件上传前端页面设置的 name 属性一致，如果文件为空则返回上传失败，如果不为空则生成一个新的文件名，之后读取文件流并写入到指定的上传路径中，最后返回上传成功。

### 上传路径

需要注意的是文件上传路径的设置，我们在代码中设置的文件保存路径为 `"D:\\upload\\"` ，即 D 盘下的 upload 文件夹，当然，你也可以按照自己的习惯来修改为其他的目录。这种写法是 Windows 系统下的路径写法，如果你是 Linux 系统的话，写法与此不同，比如我们想把文件上传到 `"/opt/newbee/upload"` 目录下，就需要把路径设置代码改为 ```private final static String FILE_UPLOAD_PATH = "/opt/newbee/upload/"```，这一点需要大家注意，两种系统的写法存在一些差异。

回到本次文件上传测试中，如果文件存储目录还没有创建的话，首先需要创建该目录，之后我们启动项目进行文件上传测试。

#### 文件上传功能测试

之后我们启动 spring-boot 项目，在启动成功后打开浏览器并输入测试页面地址 /upload-test.html，在该页面选择需要上传的文件并进行点击上传按钮，之后可以等待后端业务处理了，如果看到上传成功的提示，并且在 upload 目录中看到保存的新文件文件则表示功能实现成功，如果文件较大可以适当调整配置项的值。

![upload-test](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a180f0a9e684f2ab76f6ca0cb8c8333~tplv-k3u1fbpfcp-zoom-1.image)

之后我们需要确认文件是否已经上传到既设定的文件目录中，只需要查看 upload 目录下是否存在该文件即可，文件上传测试完成！

## Spring Boot 文件上传路径回显

网上很多的 Spring Boot 文件上传教程，通常只讲如何实现上传功能，之后就不再继续讲解了，虽然也给了教程和代码，但是正常情况下，我们上传文件是要实际应用到业务中的，比如图片上传，上传后我们需要知道它的路径，最好能够在页面中直接看到它的回显效果，像前一个步骤中，我们只是成功的完成了文件上传，但是如何去访问这个文件还不得而知。Spring Boot 不像普通的 web 项目可以上传到 webapp 指定目录中，通常的做法是**使用自定义静态资源映射目录，以此来实现文件上传整个流程的闭环**，比如前一小节中的实际案例，在文件上传到 upload 目录后，增加一个自定义静态资源映射，使得 upload 下的静态资源可以通过该映射地址被访问到，新建 config 包，并在包中新增 SpringBootWebMvcConfigurer 类，实现方法如下：

```java
package ltd.newbee.mall.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class NeeBeeMallWebMvcConfigurer implements WebMvcConfigurer {

    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/upload/**").addResourceLocations("file:D:\\upload\\");
    }
}
```

通过该设置，所有以 /upload/ 开头的静态资源请求都会映射到 D 盘的 upload 目录下，与前面上传文件时设置目录类似，不同的系统比如 Linux 和 Windows，文件路径的写法不同。

**注意：路径前需要添加** `file:` **前缀。**

之后修改一下文件上传时的返回信息，把路径拼装并返回到页面上，以便于我们进行测试，UploadController 代码修改如下：

```java
return "上传成功，图片地址为：/upload/" + newFileName;
```

接下来我们来测试一下上传的文件能否被访问到，重启项目并进行文件上传，过程如下：

![upload-test2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b22fe1c9f094eea9bc1134a2379c179~tplv-k3u1fbpfcp-zoom-1.image)

这样，一个简单的文件上传和回显的案例就完成了，首先将文件上传到指定文件夹中，之后设置静态资源映射规则使得一部分请求返回指定文件夹中的资源进行文件路径回显。

## 实验总结

本篇文章首先对文件上传的流程及功能设计进行了介绍，之后结合实践案例讲解如何使用 Spring Boot 实现文件上传以及如何对已上传的文件进行路径回显，希望通过本实验的讲解，大家都能够掌握如何使用 Spring Boot 进行文件上传，本文演示时都是使用的图片文件，同学们在练习时也可以使用其他格式的文件进行测试，希望大家多多动手练习，以更快的掌握该知识点，后续在图片管理模块实践中我们会继续对该功能进行拓展讲解。