```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1t6UQyzcYa9rhnqY5wVt1Vg 
提取码: b65z
```

在前一个实验中我们实现了用户的登陆接口，该功能已经完成，但是身份认证的整个流程并没有完善，该流程中应该包括登陆功能、身份认证、访问拦截、退出功能，我们仅仅完成了第一步，因此本实验将会对该流程进行完善，将接下来的功能点完成。

新蜂商城第一个版本后台管理系统中，身份验证使用的方式是 `session` +拦截器实现，目的是为了验证是否登录，也就是简单的权限认证。现在这个版本是前后端分离的版本，我们用了一种新的方式，前文中我们也介绍到，登录成功后会有一个 `token` 值，那么我们该怎样使用这个 `token` 字符串呢？

## 身份认证

我们继续结合登录验证流程来讲一下：

![login-check-detail](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/860c814708d4471abad72f6ef70b6caf~tplv-k3u1fbpfcp-zoom-1.image)

前文中处理的流程分支是 token 不存在之后的登录处理流程，如果 token 存在我们该怎样进行身份认证？

#### 前端存储和使用 token

后端生成 token，前端存储和使用 token，在请求登录接口成功后，前端的处理方式首先会将 token 字符串存储到 `localStorage` 中，实现代码在 vue3-admin 项目的 `Login.vue` 文件中：

```js
    const submitForm = async () => {
      loginForm.value.validate((valid) => {
        if (valid) {
          axios.post('/adminUser/login', {
            userName: state.ruleForm.username || '',
            passwordMd5: md5(state.ruleForm.password)
          }).then(res => {
            localSet('token', res)
            window.location.href = '/'
          })
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    }
```

这是 web 端实现时的方案，将登录成功后的 token 值存储到 `localStorage` 对象中，如果是 iOS 开发或者安卓开发可能又有其对应的存储方式，不过存储的目的就是在后续请求中带上 token 值，使得后端在处理请求时可能进行身份认证。

有了 token 值，在过期时间内我们都可以使用它来进行资源请求，新蜂商城 Vue 版本是如何将 token 值放到请求中的呢？

具体实现代码在 `axios.js` 中：

```js
// 请求头，headers 信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localGet('token') || ''
// 默认 post 请求，使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json'
```

如果存在 token 值则将其放入到请求 header 对象中，此 header 参数的名称即为 `token`，打开控制台可以看到具体的请求样例：

![image-20210407120005916](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afccd2459ca64c4a8e46947e9cd79e23~tplv-k3u1fbpfcp-zoom-1.image)

这是 vue3-admin 项目中几个具体的请求案例，在 Request Headers 中就有 token 参数，该值就是之前登陆成功后存储到 `localStorage`中的值。

以上就是前端处理 token 值需要注意的点，接下来我们来讲解后端代码中是如何处理 token 的。

#### 后端处理 token 及身份验证

- 第一步是生成 token，这个在前一个章节中已经介绍。
- 第二步是获取到前端请求中的 token 值。
- 第三步是验证 token 值，是否存在、是否过期等等。

完成登录功能后，则需要对管理员的登录状态进行验证，这里所说的登录状态保持即 “ Token 值是否存在及 Token 值是否有效 ” 。

而 Token 值是否有效则通过后端代码实现，由于大部分接口都需要进行登录验证，如果每个方法都添加查询用户数据的语句则有些多余，因此对方法做了抽取，通过注解切面的形式来返回用户信息。

- 自定义参数注解

我们自定义 `@TokenToAdminUser` 注解，使用注解和 AOP 方式将管理员登录对象注入到方法中：

```java
package ltd.newbee.mall.config.annotation;

import java.lang.annotation.*;

@Target({ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface TokenToAdminUser {

    /**
     * 当前用户在request中的名字
     *
     * @return
     */
    String value() default "adminUser";

}
```

- 自定义方法参数解析器

在需要用户身份信息的方法中加上 `@TokenToAdminUser` 注解，之后通过方法参数解析器来获得当前登录的对象信息。

自定义方法参数解析器 `TokenToAdminUserMethodArgumentResolver`，需实现`HandlerMethodArgumentResolver` 类，代码如下：

```java
package ltd.newbee.mall.config.handler;

import ltd.newbee.mall.common.Constants;
import ltd.newbee.mall.common.NewBeeMallException;
import ltd.newbee.mall.common.ServiceResultEnum;
import ltd.newbee.mall.config.annotation.TokenToAdminUser;
import ltd.newbee.mall.dao.NewBeeAdminUserTokenMapper;
import ltd.newbee.mall.entity.AdminUserToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class TokenToAdminUserMethodArgumentResolver implements HandlerMethodArgumentResolver {

    @Autowired
    private NewBeeAdminUserTokenMapper newBeeAdminUserTokenMapper;

    public TokenToAdminUserMethodArgumentResolver() {
    }

    public boolean supportsParameter(MethodParameter parameter) {
        if (parameter.hasParameterAnnotation(TokenToAdminUser.class)) {
            return true;
        }
        return false;
    }

    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        if (parameter.getParameterAnnotation(TokenToAdminUser.class) instanceof TokenToAdminUser) {
            String token = webRequest.getHeader("token");
            if (null != token && !"".equals(token) && token.length() == Constants.TOKEN_LENGTH) {
                AdminUserToken adminUserToken = newBeeAdminUserTokenMapper.selectByToken(token);
                if (adminUserToken == null) {
                    NewBeeMallException.fail(ServiceResultEnum.ADMIN_NOT_LOGIN_ERROR.getResult());
                } else if (adminUserToken.getExpireTime().getTime() <= System.currentTimeMillis()) {
                    NewBeeMallException.fail(ServiceResultEnum.ADMIN_TOKEN_EXPIRE_ERROR.getResult());
                }
                return adminUserToken;
            } else {
                NewBeeMallException.fail(ServiceResultEnum.ADMIN_NOT_LOGIN_ERROR.getResult());
            }
        }
        return null;
    }

}
```

该方法的执行逻辑如下：

1. 首先获取请求头中的 token 值，不存在则返回错误信息给前端，存在则继续后续流程。

2. 通过 token 值来查询 AdminUserToken 对象，是否存在或者是否过期，不存在或者已过期则返回错误信息给前端，正常则继续后续流程。


- 配置方法参数解析器

最后在 `WebMvcConfigurer` 中配置 `TokenToAdminUserMethodArgumentResolver` 使其生效，代码如下：

```java
package ltd.newbee.mall.config;

import ltd.newbee.mall.common.Constants;
import ltd.newbee.mall.config.handler.TokenToAdminUserMethodArgumentResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class NeeBeeMallWebMvcConfigurer implements WebMvcConfigurer {

    @Autowired
    private TokenToAdminUserMethodArgumentResolver tokenToAdminUserMethodArgumentResolver;

    /**
     * @param argumentResolvers
     * @tip @TokenToAdminUser 注解处理方法
     */
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(tokenToAdminUserMethodArgumentResolver);
    }
}
```

## 身份验证测试

这样，需要进行登录判断的接口加上 @TokenToAdminUser 注解即可，之后再进行相应的逻辑判断，十三也增加了两个接口进行状态保持的测试，请看下面代码：

```java
@GetMapping(value = "/test1")
@ApiOperation(value = "测试接口", notes = "方法中含有@TokenToAdminUser注解")
public Result<String> test1(@TokenToAdminUser AdminUserToken userToken) {
  //此接口含有@TokenToAdminUser注解，即需要登陆验证的接口。
  Result result = null;
  if (userToken == null) {
    //如果通过请求header中的token未查询到用户的话即token无效，登陆验证失败，返回未登录错误码。
    result = ResultGenerator.genErrorResult(419, "未登录！");
    return result;
  } else {
    //登陆验证通过。
    result = ResultGenerator.genSuccessResult("登陆验证通过");
  }
  return result;
}

@GetMapping(value = "/test2")
@ApiOperation(value = "测试接口", notes = "方法中无@TokenToAdminUser注解")
public Result<String> test2() {
  //此接口不含@TokenToAdminUser注解，即访问此接口无需登陆验证，此类接口在实际开发中应该很少，为了安全起见应该所有接口都会做登陆验证。
  Result result = ResultGenerator.genSuccessResult("此接口无需登陆验证，请求成功");
  //直接返回业务逻辑返回的数据即可。
  return result;
}
```

启动项目并访问 Swagger 接口页面，首先测试无需身份验证的接口，可以看到，由于不需要登录验证，接口直接返回了数据。

![image-20210407121303973](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c60883ab9ac4a569569aa202fbdd048~tplv-k3u1fbpfcp-zoom-1.image)

之后是测试需要身份验证的接口，如下图所示，由于是直接发起请求，并没有在请求头中放入 token 参数，在 `Curl` 那一栏中也可以看到，并没有 token 传输到后端，所以直接返回 419 错误码，提示未登录。

![image-20210407121401229](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9efeac8f392a4e539733ff6386b4b5b4~tplv-k3u1fbpfcp-zoom-1.image)

因为 token 参数是我们自定义的，如果没有在编码层面做修改，Swagger 肯定不会在页面中生成 token 参数，这里我们需要修改 Swagger 的配置，使得可以在 swagger-ui 页面可以传输 token 参数，Swagger 配置类修改如下：

```java
package ltd.newbee.mall.config;

import ltd.newbee.mall.entity.AdminUserToken;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Parameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableSwagger2
public class Swagger2Config {

    @Bean
    public Docket api() {

        ParameterBuilder tokenParam = new ParameterBuilder();
        List<Parameter> swaggerParams = new ArrayList<Parameter>();
        tokenParam.name("token").description("用户认证信息")
                .modelRef(new ModelRef("string")).parameterType("header")
                .required(false).build(); //header中的ticket参数非必填，传空也可以
        swaggerParams.add(tokenParam.build());    //根据每个方法名也知道当前方法在设置什么参数

        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .ignoredParameterTypes(AdminUserToken.class)
                .select()
                .apis(RequestHandlerSelectors.basePackage("ltd.newbee.mall.api"))// 修改为自己的 controller 包路径
                .paths(PathSelectors.any())
                .build()
                .globalOperationParameters(swaggerParams);
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("接口文档")
                .description("swagger接口文档")
                .version("3.0")
                .build();
    }
}
```

使用 ParameterBuilder 来定义 tokenParam，token 是一个字符串，且发送请求时是放在 Request Header 中，所以做了如下配置： `modelRef(new ModelRef("string")).parameterType("header")`，最后将该参数放入 `globalOperationParameters` 中，这里我们只配置了一个 token 参数，如果有其他全局参数也可以通过这种方式来配置。

重启项目并打开 Swagger 页面，可以看到在参数栏已经有 token 参数，且类型为请求头中的 string 字符串。执行登录接口获取一个 token 值并填入 input 框中，可以看到此时的返回码是 200，且 message 为”登录验证通过“，在 `Curl` 那一栏中也可以看到此时的传参中增加了 token 请求头，验证通过。

![image-20210407121702346](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bec85e6196a40c69534a2677dec8256~tplv-k3u1fbpfcp-zoom-1.image)

如果请求中不存在 Token 或者 Token 值是错误的，则验证身份失败，返回错误码 419，而如果填入正确的 Token 值，则返回登录验证成功，这样我们的身份验证编码就完成了。

## 管理员模块接口完善

讲完注册登录和身份认证流程，我们继续来完善管理员模块。

如下图所示，分别是”修改密码“页面和页面右上角的管理员信息展示区域：

![image-20210407163404666](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9e0158651b04683b99fb161f0785160~tplv-k3u1fbpfcp-zoom-1.image)

”管理员信息展示区域“会展示管理员的部分信息，退出登录的按钮也在这里。修改账户页面则是更改管理员信息，这些功能点都需要后端提供接口来进行处理，所以需要增加四个接口：

- 获取管理员信息接口
- 修改密码接口
- 修改基本信息接口
- 退出登录接口

新增代码如下：

```java
@RequestMapping(value = "/adminUser/profile", method = RequestMethod.GET)
public Result profile(@TokenToAdminUser AdminUserToken adminUser) {
  logger.info("adminUser:{}", adminUser.toString());
  AdminUser adminUserEntity = adminUserService.getUserDetailById(adminUser.getAdminUserId());
  if (adminUserEntity != null) {
    adminUserEntity.setLoginPassword("******");
    Result result = ResultGenerator.genSuccessResult();
    result.setData(adminUserEntity);
    return result;
  }
  return ResultGenerator.genFailResult(ServiceResultEnum.DATA_NOT_EXIST.getResult());
}

@RequestMapping(value = "/adminUser/password", method = RequestMethod.PUT)
public Result passwordUpdate(@RequestBody UpdateAdminPasswordParam adminPasswordParam, @TokenToAdminUser AdminUserToken adminUser) {
  logger.info("adminUser:{}", adminUser.toString());
  if (StringUtils.isEmpty(adminPasswordParam.getNewPassword()) || StringUtils.isEmpty(adminPasswordParam.getOriginalPassword())) {
    return ResultGenerator.genFailResult(ServiceResultEnum.PARAM_ERROR.getResult());
  }
  if (adminUserService.updatePassword(adminUser.getAdminUserId(), adminPasswordParam.getOriginalPassword(), adminPasswordParam.getNewPassword())) {
    return ResultGenerator.genSuccessResult();
  } else {
    return ResultGenerator.genFailResult(ServiceResultEnum.DB_ERROR.getResult());
  }
}

@RequestMapping(value = "/adminUser/name", method = RequestMethod.PUT)
public Result nameUpdate(@RequestBody UpdateAdminNameParam adminNameParam, @TokenToAdminUser AdminUserToken adminUser) {
  logger.info("adminUser:{}", adminUser.toString());
  if (StringUtils.isEmpty(adminNameParam.getLoginUserName()) || StringUtils.isEmpty(adminNameParam.getNickName())) {
    return ResultGenerator.genFailResult(ServiceResultEnum.PARAM_ERROR.getResult());
  }
  if (adminUserService.updateName(adminUser.getAdminUserId(), adminNameParam.getLoginUserName(), adminNameParam.getNickName())) {
    return ResultGenerator.genSuccessResult();
  } else {
    return ResultGenerator.genFailResult(ServiceResultEnum.DB_ERROR.getResult());
  }
}

@RequestMapping(value = "/logout", method = RequestMethod.DELETE)
public Result logout(@TokenToAdminUser AdminUserToken adminUser) {
  logger.info("adminUser:{}", adminUser.toString());
  adminUserService.logout(adminUser.getAdminUserId());
  return ResultGenerator.genSuccessResult();
}
```

由于这四个接口都需要管理员状态下才能正常的请求，所以方法定义时都使用了 @TokenToAdminUser 注解。

接下来是这几个接口的实现逻辑。

- **获取管理员信息接口**

  使用 @TokenToAdminUser 注解 已经得到了当前登录管理员的 Token 信息对象 AdminUserToken，根据管理员 id 查询完整的管理员数据，处理完数据并返回管理员信息给前端。

- **修改管理员信息接口**

  分别定义了 UpdateAdminNameParam 对象、UpdateAdminPasswordParam 来接收管理员修改的信息字段，需要修改的字段主要有昵称、密码，并使用 @RequestBody 注解来接收，之后调用业务层的 updatePassword() 方法、updateName()  方法来进行入库操作，将这些字段修改掉。

- **退出登录接口**

  这个接口的逻辑比较简单，只需要将该管理员在 token 表中的记录删除掉即可，也就是将当前的 token 值设置为无效的，既然退出登录了肯定不能让当前的 token 值可以继续进行身份验证。

## 管理员模块接口测试

最后，我们通过 Swagger 页面来测试一下这些接口。

重启项目，打开 swagger-ui 页面：

![image-20210407171554536](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c313b5e45eef45cd8c6fdf204a6157cf~tplv-k3u1fbpfcp-zoom-1.image)

#### 登录

首先我们访问登录接口，拿到一个可以正常进行身份认证的 token 字符串，如下图所示：

![image-20210407170852871](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccec2ab9c2464bd8aa0c684682d3b8d4~tplv-k3u1fbpfcp-zoom-1.image)

最终获取到一个 token 字符串，值为“ce01a7e885e55a38fdfd09c902c551a3”。

由于在 Swagger 配置中，将 token 设置成全局的 header 参数，所以每个请求上都会有 token 参数，不过不填写也依然可以正常调用，有些接口不需要身份认证的。

#### 获取管理员信息

点开“管理员信息接口”，在 token 输入框中填入登录接口返回的 token 值，之后点击”Execute“按钮，即可得到管理员信息数据，如下图所示：

![image-20210407170956070](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8acec6d4143b47b2a7fcda9df514e8a6~tplv-k3u1fbpfcp-zoom-1.image)

后端需要处理的内容就是这些，根据前端传入的参数返回相应的结果，至于前端怎么处理这些数据、怎么显示，都是前端开发人员所考虑的，我们后端保证接口参数和响应结果正常即可。

#### 修改管理员信息

这里以修改管理员昵称为测试案例，在 token 输入框中填入登录接口返回的 token 值，并且将需要修改的字段内容放入请求体 body 中，如下图所示：

![image-20210407171137773](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6522b6c8ea1d43bdbc1b016f6fab44bf~tplv-k3u1fbpfcp-zoom-1.image)

之后点击”Execute“按钮，即可完成修改操作，如下图所示：

![image-20210407171200754](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80bd0808be244ce08bc01f1ed5ef7c50~tplv-k3u1fbpfcp-zoom-1.image)

此时后端响应结果为修改成功，我们再次请求guan管理员信息接口，得到了如下结果：

![image-20210407171231271](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/505537c7816b42908d5812b15e3e1cb3~tplv-k3u1fbpfcp-zoom-1.image)

昵称、介绍字段都已经是修改后的内容了，修改接口测试成功。

#### 退出登录

点开“退出登录接口”，在 token 输入框中填入登录接口返回的 token 值，之后点击”Execute“按钮，即可完成修改操作，如下图所示：

![image-20210407171712951](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cf7bfd7270d4520a46adcb6531f8c7a~tplv-k3u1fbpfcp-zoom-1.image)

后端返回的是接口处理成功的响应，此时我们再用这个 token 进行接口请求，会得到如下结果：

![image-20210407171748685](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f834ad6758b548efb65943de05697209~tplv-k3u1fbpfcp-zoom-1.image)

因为执行了退出登录的逻辑，将 token 信息删除，所以原来的 token 已经失效了，再次使用失效的 token 值来进行接口请求，后端响应的肯定是”管理员未登录！“。

接口测试完成。