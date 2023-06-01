```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/13ohK8v1E7CVPEmYKjt5v4Q 
提取码: 2nfn
```

## 谈谈登录

#### 什么是登录

这里说的是互联网范畴的登录，通常供多人使用的网站或程序应用系统为每位用户配置了一套独特的用户名和密码，用户可以使用各自的用户名和密码进入系统，以便系统能识别该用户的身份，从而保持该用户的使用习惯或使用数据。用户使用这套用户名和密码进入系统，以及系统验证进入是成功或失败的过程，称为 “ 登录 ” 。

![登录页面](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1915b0aab0948b78b9d2986750ad864~tplv-k3u1fbpfcp-zoom-1.image)

登录成功之后，用户就可以合法地使用该账号具有的各项能力，例如，淘宝用户可以正常浏览商品和完成购买行为等；论坛用户可以查看/更改资料，收发帖子等等；OA 等系统管理员用户可以正常地处理各种数据和信息，从最简单的角度来说就是输入你的用户名和密码就可以进入一个 “ 系统 ” 进行访问和操作了。

#### 用户登录状态

客户端（通常是浏览器）在连上 Web 服务器后，若想获得 Web 服务器中的各种资源，需要遵守一定的通讯格式。Web 项目通常使用的是 HTTP 协议，HTTP 协议用于定义客户端与 Web 服务器通讯的格式。而 HTTP 协议又是无状态的协议，也就是说，这个协议是无法记录用户访问状态的，其每次请求都是独立的没有任何关联的，一个请求就是一个请求。

以商城项目为例，在新蜂商城 Vue 版本中包括多个页面，在页面跳转过程中和通过接口进行数据交互时我们需要知道用户的状态，尤其是用户登录的状态，以便我们知道这是否是一个正常的用户，这个用户是否处于合法的登录状态，这样才能在页面跳转和接口请求时知道是否可以让当前用户来操作一些功能或是获取一些数据。

因此需要在每个页面对用户的身份进行验证和确认，但现实情况是，不可能让用户在每个页面上都输入用户名和密码，这是一个多么反人类的设计啊，应该不会有用户想要去使用这种系统，所以在设计时，要求用户进行一次登录操作即可。为了实现这一功能就需要一些辅助技术，用得最多的技术就是浏览器的 Cookie，而在 Java Web 开发中，用的比较多的是 Session，将用户登录的信息存放其中，这样就可以通过读取 Cookie 或者 Session 中的数据获得用户的登录信息，从而达到记录状态、验证用户这一目的。

#### 用户眼中的登录

用户系统是很多产品最基础的构成之一，在设计和规划系统时首先应该想到的就是登陆功能，账号密码优先是最常见的一种登录注册设计，适用于普遍场景，这种方式也有利于产品引导用户完善更多的资料，留存自己的用户信息。淘宝以淘宝账号密码登录为最优先，京东则以京东账号密码登录为最优先，知乎也是以账号密码登录为最优先，且会隐藏第三方授权登录，QQ 是以 QQ 号和密码为登录形式。

由身边比较常用的例子也可以看出账密登录是多么普遍的形式，账号可以是用户名，可以是手机号，可以是 QQ 号码等多种形式，但是最终在功能实现中它们都被称作账号，账号+密码构成了最常见的登录形式。

![taobao-login-page](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bc685ea332942fdad6f2005d07ab6dd~tplv-k3u1fbpfcp-zoom-1.image)

## 登录流程设计

前文中简单地介绍了登录是怎么一回事，这一节将会进行本系统的登录流程设计。

通过前文的叙述也可以得出登录的本质，即身份验证和登录状态的保持，在实际编码中是如何实现的呢？

首先，在数据库中查询这条用户记录，伪代码如下：

```sql
select * from xxx_user where account_number = 'xxxx';
```

如果不存在这条记录则表示身份验证失败，登录流程终止；如果存在这条记录，则表示身份验证成功，接下来则需要进行登录状态的存储和验证了，存储伪代码如下：

```
//通过 Cookie 存储
Cookie cookie = new Cookie("userName",xxxxx);

//通过 Session 存储
session.setAttribute("userName",xxxxx);
验证逻辑的伪代码如下：

//通过 Cookie 获取需要验证的数据并进行比对校验
Cookie cookies[] = request.getCookies();
if (cookies != null){
    for (int i = 0; i < cookies.length; i++)
           {
               Cookie cookie = cookies[i];
               if (name.equals(cookie.getName()))
               {
                    return cookie;
               }
           }
}

//通过session获取需要验证的数据并进行比对校验
session.getAttribute("userName");
```

以上就是通用的登录流程设计。

登录的本质就是身份验证和登录状态的保持，不过还有一点不能忽略，就是登录功能的安全验证设计，一般的做法是将密码加密存储，不过千万不要在 Cookie 中存放用户密码，加密的密码也不行。因为这个密码可以被人获取并尝试离线穷举，同样的，有些网站会在 Cookie 中存储一些用户的其他敏感信息，这些都是不安全的行为。

在本课程的实战项目中将对登录功能进行优化改造，通过生成用户令牌 Token 的形式进行用户状态的保持和验证，简单理解起来的话，这里所说的 Token 就是后端生成的一个字符串，该字符串与用户信息做关联，Token 字符串通过一些无状态的数据生成并不包含用户敏感信息。

简版流程图如下：

![login-check-simple](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6b381ac5a0a456c8c41833afae0b2df~tplv-k3u1fbpfcp-zoom-1.image)

当然，还有一些验证操作是必须的，比如前端在发送数据时需要验证数据格式及有效性，后端接口在访问之前也需要验证用户信息是否有效，因此完整版的登录验证流程如下：

![login-check-detail](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b91cc99799b480da67318386200e112~tplv-k3u1fbpfcp-zoom-1.image)

## 管理员模块表结构设计

项目中使用到的表都是以 tb_newbee_mall_ 为前缀的，这一点希望大家注意，**如果表名不是以该前缀开头则为测试表，是用来演示相关知识点的**，管理员系统的登录模块相关的表结构设计如下，之后的项目开发中我们会一直使用 newbee_mall_db_v2 数据库：

```sql
CREATE DATABASE /*!32312 IF NOT EXISTS*/`newbee_mall_db_v2 ` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `newbee_mall_db_v2 `;

DROP TABLE IF EXISTS `tb_newbee_mall_admin_user`;

CREATE TABLE `tb_newbee_mall_admin_user` (
  `admin_user_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '管理员id',
  `login_user_name` varchar(50) NOT NULL COMMENT '管理员登陆名称',
  `login_password` varchar(50) NOT NULL COMMENT '管理员登陆密码',
  `nick_name` varchar(50) NOT NULL COMMENT '管理员显示昵称',
  `locked` tinyint(4) DEFAULT '0' COMMENT '是否锁定 0未锁定 1已锁定无法登陆',
  PRIMARY KEY (`admin_user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

LOCK TABLES `tb_newbee_mall_admin_user` WRITE;
/*!40000 ALTER TABLE `tb_newbee_mall_admin_user` DISABLE KEYS */;

INSERT INTO `tb_newbee_mall_admin_user` (`admin_user_id`, `login_user_name`, `login_password`, `nick_name`, `locked`)
VALUES
	(1,'admin','e10adc3949ba59abbe56e057f20f883e','十三',0),
	(2,'newbee-admin1','e10adc3949ba59abbe56e057f20f883e','新蜂01',0),
	(3,'newbee-admin2','e10adc3949ba59abbe56e057f20f883e','新蜂02',0);
	
DROP TABLE IF EXISTS `tb_newbee_mall_admin_user_token`;

CREATE TABLE `tb_newbee_mall_admin_user_token` (
  `admin_user_id` bigint(20) NOT NULL COMMENT '用户主键id',
  `token` varchar(32) NOT NULL COMMENT 'token值(32位字符串)',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `expire_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'token过期时间',
  PRIMARY KEY (`admin_user_id`),
  UNIQUE KEY `uq_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

在数据库中新建 tb_newbee_mall_admin_user 管理员表和 tb_newbee_mall_admin_user_token 管理员 Token 记录表，并在表中新增了几条用户数据用于测试，之后我们在演示登陆功能时会用到，管理员表主要是用于存储基本信息等内容，而 Token 记录表则是用于存储 Token 与用户之间的关系，在用户认证时，通过 Token 字符串查询到对应的用户信息。

>这里的密码是加密方式的，只做了一层的 MD5 加密处理，一般情况下，也会对原密码进行加密处理后，再进行一次加密处理。

前端在登录和注册时，传输的密码也不是明文密码，而是前端进行 MD5 加密后的字符串，当然，除了 MD5 加密之外，还有其他的字符串加密方式，大家可以自行选择。

## 接口实现

#### 参数定义

![登录页面](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb0aa62f95c44a468f09bcf661dbf2f0~tplv-k3u1fbpfcp-zoom-1.image)

如上图登录页面所示，在登录时前端需要向后端传输两个参数：登录名和密码，后端定义登录参数类如下：

```java
package ltd.newbee.mall.api.admin.param;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Data
public class AdminLoginParam implements Serializable {

    @ApiModelProperty("登录名")
    @NotEmpty(message = "登录名不能为空")
    private String userName;

    @ApiModelProperty("用户密码(需要MD5加密)")
    @NotEmpty(message = "密码不能为空")
    private String passwordMd5;
}
```

类定义上添加 `@Data`，省去定义 set get 方法的步骤；

`@ApiModelProperty` 注解为 Swagger 接口文档所需的注解；

`@NotEmpty` 为参数验证的注解，`message` 中定义当对应参数为空时提示的异常信息。

#### 接口实现

新增 NewBeeAdminManageUserAPI 类，对登录请求进行处理，代码如下：

```java
package ltd.newbee.mall.api.admin;

import io.swagger.annotations.Api;
import ltd.newbee.mall.api.admin.param.AdminLoginParam;
import ltd.newbee.mall.common.Constants;
import ltd.newbee.mall.service.AdminUserService;
import ltd.newbee.mall.util.Result;
import ltd.newbee.mall.util.ResultGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@Api(value = "v1", tags = "后台管理系统管理员模块接口")
@RequestMapping("/manage-api/v1")
public class NewBeeAdminManageUserAPI {

    @Resource
    private AdminUserService adminUserService;

    private static final Logger logger = LoggerFactory.getLogger(NewBeeAdminManageUserAPI.class);

    @RequestMapping(value = "/adminUser/login", method = RequestMethod.POST)
    public Result<String> login(@RequestBody AdminLoginParam adminLoginParam) {
        if (adminLoginParam == null || StringUtils.isEmpty(adminLoginParam.getUserName()) || StringUtils.isEmpty(adminLoginParam.getPasswordMd5())) {
            return ResultGenerator.genFailResult("用户名或密码不能为空");
        }
        String loginResult = adminUserService.login(adminLoginParam.getUserName(), adminLoginParam.getPasswordMd5());
        logger.info("manage login api,adminName={},loginResult={}", adminLoginParam.getUserName(), loginResult);

        //登录成功
        if (!StringUtils.isEmpty(loginResult) && loginResult.length() == Constants.TOKEN_LENGTH) {
            Result result = ResultGenerator.genSuccessResult();
            result.setData(loginResult);
            return result;
        }
        //登录失败
        return ResultGenerator.genFailResult(loginResult);
    }
}
```

`@PostMapping("/adminUser/login")` 表示登录请求为 POST 方式，请求路径为 `/manage-api/v1/adminUser/login`，首先使用 `@RequestBody` 注解对登录参数进行接收并封装成 AdminLoginParam 对象，`@Valid` 注解的作用为参数验证，定义参数时我们使用了 `@NotEmpty` 注解，表示该参数不能为空，如果在这里不添加 `@Valid` 注解，则非空验证不会执行。

之后就是调用业务层的 login() 方法进行登陆逻辑的处理，并根据业务层返回的内容封装请求结果并响应给前端。

#### 业务层逻辑代码

登陆方法的业务处理代码如下：

```java
@Service
public class AdminUserServiceImpl implements AdminUserService {

    @Resource
    private AdminUserMapper adminUserMapper;

    @Resource
    private NewBeeAdminUserTokenMapper newBeeAdminUserTokenMapper;

    @Override
    public String login(String userName, String password) {
        AdminUser loginAdminUser = adminUserMapper.login(userName, password);
        if (loginAdminUser != null) {
            //登录后即执行修改token的操作
            String token = getNewToken(System.currentTimeMillis() + "", loginAdminUser.getAdminUserId());
            AdminUserToken adminUserToken = newBeeAdminUserTokenMapper.selectByPrimaryKey(loginAdminUser.getAdminUserId());
            //当前时间
            Date now = new Date();
            //过期时间
            Date expireTime = new Date(now.getTime() + 2 * 24 * 3600 * 1000);//过期时间 48 小时
            if (adminUserToken == null) {
                adminUserToken = new AdminUserToken();
                adminUserToken.setAdminUserId(loginAdminUser.getAdminUserId());
                adminUserToken.setToken(token);
                adminUserToken.setUpdateTime(now);
                adminUserToken.setExpireTime(expireTime);
                //新增一条token数据
                if (newBeeAdminUserTokenMapper.insertSelective(adminUserToken) > 0) {
                    //新增成功后返回
                    return token;
                }
            } else {
                adminUserToken.setToken(token);
                adminUserToken.setUpdateTime(now);
                adminUserToken.setExpireTime(expireTime);
                //更新
                if (newBeeAdminUserTokenMapper.updateByPrimaryKeySelective(adminUserToken) > 0) {
                    //修改成功后返回
                    return token;
                }
            }

        }
        return ServiceResultEnum.LOGIN_ERROR.getResult();
    }


    /**
     * 获取token值
     *
     * @param timeStr
     * @param userId
     * @return
     */
    private String getNewToken(String timeStr, Long userId) {
        String src = timeStr + userId + NumberUtil.genRandomNum(6);
        return SystemUtil.genToken(src);
    }
}
```

管理员登陆的方法中共 30 行代码左右，总结一下就是先查询并验证管理员身份，之后进行 Token 值的生成和过期时间的设置，最后将用户的 Token 数据保存到数据库中。

我们结合前文中登陆的流程图来理解，用户登陆的详细过程如下：

- 首先，根据用户名称和密码查询管理员数据，如果存在则继续后续流程
- 生成 Token 值，这里你可以简单的将其理解为生成一个随机字符串，在这一步其实已经完成了登录逻辑，只是后续需要对 Token 值进行查询，所以还需要将用户的 Token 信息入库
- 根据管理员 id 查询 Token 信息表，以此结果来决定是进行 Token 更新操作或者新增操作
- 根据当前时间获取 Token 过期时间
- 封装用户 Token 信息并进行入库操作（新增或者修改）
- 最后，返回 Token 值

至此，用户的逻辑就完成了，在自己测试时可以关注一下数据库中的相关记录，功能完成时 Token 值是否正确入库。

## 总结

启动 Spring Boot 项目，并在浏览器中输入 Swagger 接口文档地址：`http://localhost:8080/swagger-ui.html`，之后就可以进行登录接口的调用测试了，过程如下图所示。

依次点开接口文档，之后在参数栏填入登录信息和密码字段：

![image-20210407114338200](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fb8661095a24566a0556ef816946829~tplv-k3u1fbpfcp-zoom-1.image)

点击 Execute 按钮，就可以发送登录请求了，结果如下图所示：

![image-20210407114454319](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c93dbc3907d14bd09414552a0c4f13c1~tplv-k3u1fbpfcp-zoom-1.image)

如果登录信息都正确，我们也可以得到一个 Token 字段，在 Result 对象的 data 字段中，因为整合了 Swagger，所以这些接口测试我们都可以在接口文档里进行操作，非常的便捷和直观。

登录功能完成，代码中主要做的就是验证登录信息并生成 Token 值，当然这只是第一步，生成身份验证信息，接下来的一篇文章中我们会继续介绍管理员登录模块中的用户身份保持和身份验证。