```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1YM4-0FCfbkMHb5pE5I-LNw 
提取码: hd4w
```

大部分商城网站都会在商城首页放置轮播图模块，不过商城端的轮播图效果是呈现给用户看的，只需要展示功能就可以。而轮播图数据的添加和配置则需要在后台管理系统中实现，这样商城端才能够查询出数据并展现给用户，笔者将继续讲解开发后台管理系统中的功能模块，本章节是轮播图数据管理模块的开发。

## 轮播图模块介绍

横跨屏幕的轮播首图是时下比较流行的网页设计手法，网站设计师会通过这种覆盖用户视线的图片，给用户营造一种身临其境的视觉感受，这非常符合人类视觉优先的信息获取方式，大部分网站也都会在首屏选择这种设计，优质的首图能够让用户明白他们可以从这个网站获取一些什么。

购物网站更是如此，在首屏轮播图中往往会有各种推荐商品、优惠活动等等，在这个区域内，商城管理者可以放置抓人眼球的商品图片，可以放置不久后即将上线的主力产品，也可以放置用户最关心的促销通知等等，淘宝网如此，京东商城如此，其它的商城也有这种首屏轮播图的网页设计。

- 小米商城首屏轮播

![image-20210122174202994](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5a5da800850433dbe1166d174df85c9~tplv-k3u1fbpfcp-zoom-1.image)

- 京东商城首屏轮播

![image-20210122174456753](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd8ad5571121420498a65f170eea0506~tplv-k3u1fbpfcp-zoom-1.image)

在新蜂商城中笔者也添加了首屏轮播的效果，视觉效果如下：

![image-20210122174605568](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7381e8ec864d47ebb93e7637d567274a~tplv-k3u1fbpfcp-zoom-1.image)

本章节主要讲解轮播图的后台管理模块 API 的实现。

不同的时间需要策划不同的促销活动，随着时间的推移商城管理员也会不断上线新品满足用户的需要，因此轮播区域的图片不可能是一成不变的，管理员用户需要根据需要对它进行配置和更改。

## 轮播图管理模块后端功能实现

#### 轮播图表结构设计

在进行接口设计和具体的功能实现前，首先将表结构确定下来，通过对轮播图的介绍，读者们应该也可以大致看出来几个主要的字段，首先是轮播图片的图片地址，其次是点击轮播图后的跳转链接，这两个是比较重要的字段，其它则是一些基础的功能字段，新蜂商城中轮播图的表结构如下：

```sql
USE `newbee_mall_db_v2`;

DROP TABLE IF EXISTS `tb_newbee_mall_carousel`;
CREATE TABLE `tb_newbee_mall_carousel`  (
  `carousel_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '首页轮播图主键id',
  `carousel_url` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '轮播图片url',
  `redirect_url` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '\'##\'' COMMENT '点击后的跳转地址(默认不跳转)',
  `carousel_rank` int(11) NOT NULL DEFAULT 0 COMMENT '排序值(字段越大越靠前)',
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0 COMMENT '删除标识字段(0-未删除 1-已删除)',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user` int(11) NOT NULL DEFAULT 0 COMMENT '创建者id',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `update_user` int(11) NOT NULL DEFAULT 0 COMMENT '修改者id',
  PRIMARY KEY (`carousel_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
```

轮播图表的字段以及每个字段对应的含义都在上面的 SQL 中有介绍，大家可以对照 SQL 进行理解，正确的把建表 SQL 导入到数据库中即可，接下来进行编码工作。

#### 轮播图管理模块接口介绍

轮播图模块在后台管理系统中有 5 个接口，分别是：

- 轮播图分页列表接口
- 添加轮播图接口
- 根据 id 获取单条轮播图记录接口
- 修改轮播图接口
- 批量删除轮播图接口

接下来介绍这些功能具体的实现代码。

#### 新建轮播图实体类和 Mapper 接口

首先在 ltd.newbee.mall.entity 包中创建轮播图实体类，选中 entity 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“Carousel”，最后在 Carousel 类中新增如下代码：

```java
package ltd.newbee.mall.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class Carousel {
    private Integer carouselId;

    private String carouselUrl;

    private String redirectUrl;

    private Integer carouselRank;

    private Byte isDeleted;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    private Integer createUser;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

    private Integer updateUser;
}
```

在 ltd.newbee.mall.dao 包中新建轮播图实体的 Mapper 接口，选中 dao 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“CarouselMapper”，并选中“Interface”选项，之后在 CarouselMapper.java 文件中新增如下代码：

```java
package ltd.newbee.mall.dao;

import ltd.newbee.mall.entity.Carousel;
import ltd.newbee.mall.util.PageQueryUtil;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CarouselMapper {
    int deleteByPrimaryKey(Integer carouselId);

    int insert(Carousel record);

    int insertSelective(Carousel record);

    Carousel selectByPrimaryKey(Integer carouselId);

    int updateByPrimaryKeySelective(Carousel record);

    int updateByPrimaryKey(Carousel record);

    List<Carousel> findCarouselList(PageQueryUtil pageUtil);

    int getTotalCarousels(PageQueryUtil pageUtil);

    int deleteBatch(Long[] ids);

    List<Carousel> findCarouselsByNum(@Param("number") int number);
}
```

定义了对于轮播图操作的数据层方法，包括查询、新增、修改和删除等操作。

#### 创建 CarouselMapper 接口的映射文件

在 resources/mapper 目录下新建 CarouselMapper 接口的映射文件 CarouselMapper.xml，之后进行映射文件的编写。

1.首先，定义映射文件与 Mapper 接口的对应关系，比如该示例中，需要将 CarouselMapper.xml 文件与对应的 CarouselMapper 接口之间的关系定义出来：

```xml
<mapper namespace="ltd.newbee.mall.dao.CarouselMapper">
```

2.之后，配置表结构和实体类的对应关系：

```xml
<resultMap id="BaseResultMap" type="ltd.newbee.mall.entity.Carousel">
  <id column="carousel_id" jdbcType="INTEGER" property="carouselId"/>
  <result column="carousel_url" jdbcType="VARCHAR" property="carouselUrl"/>
  <result column="redirect_url" jdbcType="VARCHAR" property="redirectUrl"/>
  <result column="carousel_rank" jdbcType="INTEGER" property="carouselRank"/>
  <result column="is_deleted" jdbcType="TINYINT" property="isDeleted"/>
  <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
  <result column="create_user" jdbcType="INTEGER" property="createUser"/>
  <result column="update_time" jdbcType="TIMESTAMP" property="updateTime"/>
  <result column="update_user" jdbcType="INTEGER" property="updateUser"/>
</resultMap>
```

3.最后，按照对应的接口方法，编写具体的 SQL 语句，最终的 CarouselMapper.xml 文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="ltd.newbee.mall.dao.CarouselMapper">
    <resultMap id="BaseResultMap" type="ltd.newbee.mall.entity.Carousel">
        <id column="carousel_id" jdbcType="INTEGER" property="carouselId"/>
        <result column="carousel_url" jdbcType="VARCHAR" property="carouselUrl"/>
        <result column="redirect_url" jdbcType="VARCHAR" property="redirectUrl"/>
        <result column="carousel_rank" jdbcType="INTEGER" property="carouselRank"/>
        <result column="is_deleted" jdbcType="TINYINT" property="isDeleted"/>
        <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
        <result column="create_user" jdbcType="INTEGER" property="createUser"/>
        <result column="update_time" jdbcType="TIMESTAMP" property="updateTime"/>
        <result column="update_user" jdbcType="INTEGER" property="updateUser"/>
    </resultMap>
    <sql id="Base_Column_List">
    carousel_id, carousel_url, redirect_url, carousel_rank, is_deleted, create_time, 
    create_user, update_time, update_user
  </sql>
    <select id="findCarouselList" parameterType="Map" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_carousel
        where is_deleted = 0
        order by carousel_rank desc
        <if test="start!=null and limit!=null">
            limit #{start},#{limit}
        </if>
    </select>
    <select id="getTotalCarousels" parameterType="Map" resultType="int">
        select count(*) from tb_newbee_mall_carousel
        where is_deleted = 0
    </select>
    <select id="selectByPrimaryKey" parameterType="java.lang.Integer" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_carousel
        where carousel_id = #{carouselId,jdbcType=INTEGER}
    </select>
    <select id="findCarouselsByNum" parameterType="int" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_carousel
        where is_deleted = 0
        order by carousel_rank desc
        limit #{number}
    </select>
    <delete id="deleteByPrimaryKey" parameterType="java.lang.Integer">
    delete from tb_newbee_mall_carousel
    where carousel_id = #{carouselId,jdbcType=INTEGER}
  </delete>
    <insert id="insert" parameterType="ltd.newbee.mall.entity.Carousel">
    insert into tb_newbee_mall_carousel (carousel_id, carousel_url, redirect_url, 
      carousel_rank, is_deleted, create_time, 
      create_user, update_time, update_user
      )
    values (#{carouselId,jdbcType=INTEGER}, #{carouselUrl,jdbcType=VARCHAR}, #{redirectUrl,jdbcType=VARCHAR}, 
      #{carouselRank,jdbcType=INTEGER}, #{isDeleted,jdbcType=TINYINT}, #{createTime,jdbcType=TIMESTAMP}, 
      #{createUser,jdbcType=INTEGER}, #{updateTime,jdbcType=TIMESTAMP}, #{updateUser,jdbcType=INTEGER}
      )
  </insert>
    <insert id="insertSelective" parameterType="ltd.newbee.mall.entity.Carousel">
        insert into tb_newbee_mall_carousel
        <trim prefix="(" suffix=")" suffixOverrides=",">
            <if test="carouselId != null">
                carousel_id,
            </if>
            <if test="carouselUrl != null">
                carousel_url,
            </if>
            <if test="redirectUrl != null">
                redirect_url,
            </if>
            <if test="carouselRank != null">
                carousel_rank,
            </if>
            <if test="isDeleted != null">
                is_deleted,
            </if>
            <if test="createTime != null">
                create_time,
            </if>
            <if test="createUser != null">
                create_user,
            </if>
            <if test="updateTime != null">
                update_time,
            </if>
            <if test="updateUser != null">
                update_user,
            </if>
        </trim>
        <trim prefix="values (" suffix=")" suffixOverrides=",">
            <if test="carouselId != null">
                #{carouselId,jdbcType=INTEGER},
            </if>
            <if test="carouselUrl != null">
                #{carouselUrl,jdbcType=VARCHAR},
            </if>
            <if test="redirectUrl != null">
                #{redirectUrl,jdbcType=VARCHAR},
            </if>
            <if test="carouselRank != null">
                #{carouselRank,jdbcType=INTEGER},
            </if>
            <if test="isDeleted != null">
                #{isDeleted,jdbcType=TINYINT},
            </if>
            <if test="createTime != null">
                #{createTime,jdbcType=TIMESTAMP},
            </if>
            <if test="createUser != null">
                #{createUser,jdbcType=INTEGER},
            </if>
            <if test="updateTime != null">
                #{updateTime,jdbcType=TIMESTAMP},
            </if>
            <if test="updateUser != null">
                #{updateUser,jdbcType=INTEGER},
            </if>
        </trim>
    </insert>
    <update id="updateByPrimaryKeySelective" parameterType="ltd.newbee.mall.entity.Carousel">
        update tb_newbee_mall_carousel
        <set>
            <if test="carouselUrl != null">
                carousel_url = #{carouselUrl,jdbcType=VARCHAR},
            </if>
            <if test="redirectUrl != null">
                redirect_url = #{redirectUrl,jdbcType=VARCHAR},
            </if>
            <if test="carouselRank != null">
                carousel_rank = #{carouselRank,jdbcType=INTEGER},
            </if>
            <if test="isDeleted != null">
                is_deleted = #{isDeleted,jdbcType=TINYINT},
            </if>
            <if test="createTime != null">
                create_time = #{createTime,jdbcType=TIMESTAMP},
            </if>
            <if test="createUser != null">
                create_user = #{createUser,jdbcType=INTEGER},
            </if>
            <if test="updateTime != null">
                update_time = #{updateTime,jdbcType=TIMESTAMP},
            </if>
            <if test="updateUser != null">
                update_user = #{updateUser,jdbcType=INTEGER},
            </if>
        </set>
        where carousel_id = #{carouselId,jdbcType=INTEGER}
    </update>
    <update id="updateByPrimaryKey" parameterType="ltd.newbee.mall.entity.Carousel">
    update tb_newbee_mall_carousel
    set carousel_url = #{carouselUrl,jdbcType=VARCHAR},
      redirect_url = #{redirectUrl,jdbcType=VARCHAR},
      carousel_rank = #{carouselRank,jdbcType=INTEGER},
      is_deleted = #{isDeleted,jdbcType=TINYINT},
      create_time = #{createTime,jdbcType=TIMESTAMP},
      create_user = #{createUser,jdbcType=INTEGER},
      update_time = #{updateTime,jdbcType=TIMESTAMP},
      update_user = #{updateUser,jdbcType=INTEGER}
    where carousel_id = #{carouselId,jdbcType=INTEGER}
  </update>
    <update id="deleteBatch">
        update tb_newbee_mall_carousel
        set is_deleted=1,update_time=now() where carousel_id in
        <foreach item="id" collection="array" open="(" separator="," close=")">
            #{id}
        </foreach>
    </update>
</mapper>
```

#### 业务层代码实现

在 ltd.newbee.mall.service 包中新建业务处理类，选中 service 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallCarouselService”，并选中“Interface”选项。

最后在 NewBeeMallCarouselService.java 文件中新增如下代码：

```java
package ltd.newbee.mall.service;

import ltd.newbee.mall.entity.Carousel;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.PageResult;

public interface NewBeeMallCarouselService {

    PageResult getCarouselPage(PageQueryUtil pageUtil);

    String saveCarousel(Carousel carousel);

    String updateCarousel(Carousel carousel);

    Carousel getCarouselById(Integer id);

    Boolean deleteBatch(Long[] ids);
}
```

轮播图模块的业务层方法定义以及每个方法的作用都已经编写完成。

然后在 ltd.newbee.mall.service.impl 包中新建 NewBeeMallCarouselService 的实现类，选中 impl 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallCarouselServiceImpl”，最后在 NewBeeMallCarouselServiceImpl 类中新增如下代码：

```java
package ltd.newbee.mall.service.impl;

import ltd.newbee.mall.common.ServiceResultEnum;
import ltd.newbee.mall.dao.CarouselMapper;
import ltd.newbee.mall.entity.Carousel;
import ltd.newbee.mall.service.NewBeeMallCarouselService;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NewBeeMallCarouselServiceImpl implements NewBeeMallCarouselService {

    @Autowired
    private CarouselMapper carouselMapper;


    @Override
    public PageResult getCarouselPage(PageQueryUtil pageUtil) {
        List<Carousel> carousels = carouselMapper.findCarouselList(pageUtil);
        int total = carouselMapper.getTotalCarousels(pageUtil);
        PageResult pageResult = new PageResult(carousels, total, pageUtil.getLimit(), pageUtil.getPage());
        return pageResult;
    }

    @Override
    public String saveCarousel(Carousel carousel) {
        if (carouselMapper.insertSelective(carousel) > 0) {
            return ServiceResultEnum.SUCCESS.getResult();
        }
        return ServiceResultEnum.DB_ERROR.getResult();
    }

    @Override
    public String updateCarousel(Carousel carousel) {
        Carousel temp = carouselMapper.selectByPrimaryKey(carousel.getCarouselId());
        if (temp == null) {
            return ServiceResultEnum.DATA_NOT_EXIST.getResult();
        }
        temp.setCarouselRank(carousel.getCarouselRank());
        temp.setRedirectUrl(carousel.getRedirectUrl());
        temp.setCarouselUrl(carousel.getCarouselUrl());
        temp.setUpdateTime(new Date());
        if (carouselMapper.updateByPrimaryKeySelective(temp) > 0) {
            return ServiceResultEnum.SUCCESS.getResult();
        }
        return ServiceResultEnum.DB_ERROR.getResult();
    }

    @Override
    public Carousel getCarouselById(Integer id) {
        return carouselMapper.selectByPrimaryKey(id);
    }

    @Override
    public Boolean deleteBatch(Long[] ids) {
        if (ids.length < 1) {
            return false;
        }
        //删除数据
        return carouselMapper.deleteBatch(ids) > 0;
    }
}
```

#### 轮播图管理模块控制层代码实现

在 ltd.newbee.mall.api.admin 包中新建 NewBeeAdminCarouselAPI 类，NewBeeAdminCarouselAPI 控制器中新增上述接口的实现代码，最终 NewBeeAdminCarouselAPI 类的代码如下：

```java
package ltd.newbee.mall.api.admin;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import ltd.newbee.mall.api.admin.param.BatchIdParam;
import ltd.newbee.mall.api.admin.param.CarouselAddParam;
import ltd.newbee.mall.api.admin.param.CarouselEditParam;
import ltd.newbee.mall.common.ServiceResultEnum;
import ltd.newbee.mall.config.annotation.TokenToAdminUser;
import ltd.newbee.mall.entity.AdminUserToken;
import ltd.newbee.mall.entity.Carousel;
import ltd.newbee.mall.service.NewBeeMallCarouselService;
import ltd.newbee.mall.util.BeanUtil;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.Result;
import ltd.newbee.mall.util.ResultGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * @author 13
 * @qq交流群 796794009
 * @email 2449207463@qq.com
 * @link https://github.com/newbee-ltd
 */
@RestController
@Api(value = "v1", tags = "8-1.后台管理系统轮播图模块接口")
@RequestMapping("/manage-api/v1")
public class NewBeeAdminCarouselAPI {

    private static final Logger logger = LoggerFactory.getLogger(NewBeeAdminCarouselAPI.class);

    @Resource
    NewBeeMallCarouselService newBeeMallCarouselService;

    /**
     * 列表
     */
    @RequestMapping(value = "/carousels", method = RequestMethod.GET)
    @ApiOperation(value = "轮播图列表", notes = "轮播图列表")
    public Result list(@RequestParam(required = false) @ApiParam(value = "页码") Integer pageNumber,
                       @RequestParam(required = false) @ApiParam(value = "每页条数") Integer pageSize, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (pageNumber == null || pageNumber < 1 || pageSize == null || pageSize < 10) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        Map params = new HashMap(4);
        params.put("page", pageNumber);
        params.put("limit", pageSize);
        PageQueryUtil pageUtil = new PageQueryUtil(params);
        return ResultGenerator.genSuccessResult(newBeeMallCarouselService.getCarouselPage(pageUtil));
    }

    /**
     * 添加
     */
    @RequestMapping(value = "/carousels", method = RequestMethod.POST)
    @ApiOperation(value = "新增轮播图", notes = "新增轮播图")
    public Result save(@RequestBody @Valid CarouselAddParam carouselAddParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (StringUtils.isEmpty(carouselAddParam.getCarouselUrl())
                || Objects.isNull(carouselAddParam.getCarouselRank())) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        Carousel carousel = new Carousel();
        BeanUtil.copyProperties(carouselAddParam, carousel);
        String result = newBeeMallCarouselService.saveCarousel(carousel);
        if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult(result);
        }
    }


    /**
     * 修改
     */
    @RequestMapping(value = "/carousels", method = RequestMethod.PUT)
    @ApiOperation(value = "修改轮播图信息", notes = "修改轮播图信息")
    public Result update(@RequestBody CarouselEditParam carouselEditParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (Objects.isNull(carouselEditParam.getCarouselId())
                || StringUtils.isEmpty(carouselEditParam.getCarouselUrl())
                || Objects.isNull(carouselEditParam.getCarouselRank())) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        Carousel carousel = new Carousel();
        BeanUtil.copyProperties(carouselEditParam, carousel);
        String result = newBeeMallCarouselService.updateCarousel(carousel);
        if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult(result);
        }
    }

    /**
     * 详情
     */
    @RequestMapping(value = "/carousels/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "获取单条轮播图信息", notes = "根据id查询")
    public Result info(@PathVariable("id") Integer id, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        Carousel carousel = newBeeMallCarouselService.getCarouselById(id);
        if (carousel == null) {
            return ResultGenerator.genFailResult(ServiceResultEnum.DATA_NOT_EXIST.getResult());
        }
        return ResultGenerator.genSuccessResult(carousel);
    }

    /**
     * 删除
     */
    @RequestMapping(value = "/carousels", method = RequestMethod.DELETE)
    @ApiOperation(value = "批量删除轮播图信息", notes = "批量删除轮播图信息")
    public Result delete(@RequestBody BatchIdParam batchIdParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (batchIdParam == null || batchIdParam.getIds().length < 1) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        if (newBeeMallCarouselService.deleteBatch(batchIdParam.getIds())) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult("删除失败");
        }
    }

}
```

1.列表接口负责接收前端传来的分页参数，如 page 、limit 等参数，之后将数据总数和对应页面的数据列表查询出来并封装为分页数据返回给前端，接口的映射地址为 /manage-api/v1carousels，请求方法为 GET，业务层 getCarouselPage() 方法获取响应条数的记录和总数之后再进行数据封装，这个接口就是根据前端传的分页参数进行查询并返回分页数据以供前端页面进行数据渲染。

2.添加接口负责接收前端的 POST 请求并处理其中的参数，接收的参数为 carouselUrl 字段、redirectUrl 字段和 carouselRank字段，在这个方法里笔者使用了 @RequestBody 注解将其转换为 CarouselAddParam 对象参数。

3.删除接口负责接收前端的轮播图删除请求，处理前端传输过来的数据后，将这些记录从数据库中删除，这里的“删除”功能并不是真正意义上的删除，而是逻辑删除，将接受的参数设置为一个数组，可以同时删除多条记录，只需要在前端将用户选择的记录 id 封装好再传参到后端即可，接口的请求路径为 /manage-api/v1carousels，请求方法为 DELETE，并使用 @RequestBody 将前端传过来的参数封装为数组对象，如果数组为空则直接返回异常提醒，参数验证通过后则调用 deleteBatch() 批量删除方法进行数据库操作。

> 逻辑删除是目前企业开发中比较常用的一种实现方法，比如本章节的轮播图模块的删除功能，就是将轮播图表中的 is_deleted 字段设置为 1，表示该记录已被删除，而不是执行 DELETE 语句将数据删除。

## 轮播图模块接口测试

最后，我们通过 Swagger 页面来测试一下这些接口。

重启项目，打开 swagger-ui 页面：

![image-20210413104357450](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aac2cb29ecb6423780abe347d395367d~tplv-k3u1fbpfcp-zoom-1.image)

由于这些接口都需要登录后才能访问，首先我们访问登录接口，拿到一个可以正常进行身份认证的 token 字符串，如下图所示：

![image-20210407170852871](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7bb3783cdf643ff8efb75bf6bc2bfd0~tplv-k3u1fbpfcp-zoom-1.image)

最终获取到一个 token 字符串，值为“ce01a7e885e55a38fdfd09c902c551a3”。

1.列表接口

点开“轮播图列表”，在 token 输入框中填入登录接口返回的 token 值并输入分页所需的 pageNumber 和 pageSize 参数，之后点击”Execute“按钮：

![image-20210413104705521](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49971bda57414d44869c7cbb6d09d0a4~tplv-k3u1fbpfcp-zoom-1.image)

即可得到轮播图列表数据，如下图所示：

![image-20210413104818956](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03b3ccd27abe46c88776ec4ed661ce29~tplv-k3u1fbpfcp-zoom-1.image)

大家可以在数据库表中新增一些轮播图数据，或者调整 pageSize 参数来更好的测试分页列表接口。

2.新增接口：

点开“新增轮播图”，在 token 输入框中填入登录接口返回的 token 值并输入新增轮播图接口中的必填参数：

![image-20210413110235927](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bd49c9833be4bf4b94ec318c205e692~tplv-k3u1fbpfcp-zoom-1.image)

分别输入轮播图 URL、跳转链接和排序值，最后点击”Execute“按钮，得到如下返回结果：

![image-20210413110415001](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a17f93df922b4686bb7d5191549bd82f~tplv-k3u1fbpfcp-zoom-1.image)

添加成功后可以看到列表中多了一条数据。

以上是正常情况，如果 token 不正确或者请求的参数不规范也会得到对应的错误提示：

![image-20210413110526618](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cf136bda37141a7b495949aab46778a~tplv-k3u1fbpfcp-zoom-1.image)

“轮播图修改接口”与“轮播图新增接口”测试步骤类似，这里就省略了，大家可以自行测试。

3.详情接口：

点开“获取单条轮播图信息”，在 token 输入框中填入登录接口返回的 token 值和轮播图的 id，之后点击”Execute“按钮，即可得到轮播图详情数据，如下图所示：

![image-20210413111248679](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d72004ff70a147ab96a095df65ed004c~tplv-k3u1fbpfcp-zoom-1.image)

而如果传入的 id 未查询到数据，会得到如下返回结果：

![image-20210413111404393](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4402a90341a472ebad93caf0daba382~tplv-k3u1fbpfcp-zoom-1.image)

4.删除接口：

最后是删除接口的测试，点开“批量删除轮播图信息”，在 token 输入框中填入登录接口返回的 token 值和需要删除的轮播图 id 数组，比如这里我想要删除 id 是 15 和 16 的两条数据，之后点击”Execute“按钮，即可完成删除步骤，如下图所示：

![image-20210413112248677](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43f4ad6e041b4c868ac23293c913ad33~tplv-k3u1fbpfcp-zoom-1.image)

> 注意数组中的逗号为英文逗号，如果不小心输入了中文符号会报错的。

如果此时再去查询这两条数据，无论是列表接口还是详情接口都不存在 id 15 和 16 的轮播图数据，功能测试完成。

读者们可以按照文中的思路和过程自行测试，轮播图管理模块开发完成！