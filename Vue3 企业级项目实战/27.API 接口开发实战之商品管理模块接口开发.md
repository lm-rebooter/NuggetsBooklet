```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1Ya6t3hmn-b_Qewg2qMREjA 
提取码: 6pdg
```

商品模块是一个商城系统中不可或缺的功能模块，本章节将进行商品管理模块的功能开发。

## 商品模块简介

电子商务这些年在国内的高速发展加速了为电子商务服务的软件行业的发展，随之诞生了很多与之密切相关的网店和商城系统，该行业已经有很多成熟的商业模式，举例如下：

- **B2C**

  这种模式属于企业与消费者之间的电子商务，企业在电子商务平台上进行销售，消费者选择并购买，是一种很常见的电子商务模式，天猫商城、京东商城就是这种模式。

- **C2C**

  这种模式属于消费者与消费者之间的电子商务，这种模式对商家的包容性很大，很多店家并不是企业而是个人店主，淘宝、微店就是这种模式。

- **O2O**

  线上到线下再到线上，线上消费，线下服务。美团、飞猪是该领域的佼佼者，使用者更多的感受应该是生活服务平台。

>  以上列举的都是成熟的大型企业级产品，新蜂商城虽然也算是购物网站，属于电子商务产品，但它的角色更应该是 Java 开发人员的一个学习资源和练习项目，虽然具有商城的基因，不过想要实际的上线以供企业进行商业使用还需要进行二次开发。

在购物网站中，购物行为必然建立在商品的基础之上，作为交易的基础，商品管理可以说是电商系统最重要的部分，它是整个电商系统的数据基础，用于记录与商品有关的数据，虽然系统逻辑不复杂，但是由于操作的数据比较多，需要掌控细节，订单，营销，支付，物流等环节都需要从商品模块中获取和操作数据。

接下来会对商品模块进行分析并作出表结构设计，并进行商品管理模块接口的开发。

## 商品信息表结构设计

为了设计商品信息表的字段，笔者主要参考了一些知名线上商城的设计，比如天猫商城和京东商城的商品详情页，通过观察其中的内容可以大致得出一些商品信息的必要字段，页面显示内容如下：

- 天猫商城商品详情页

![image-20210126175613573](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/870d15f287c5477aa65b9a197ecd0e22~tplv-k3u1fbpfcp-zoom-1.image)

- 京东商城商品详情页

![image-20210126180217715](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de19023e154e43218c52d0e2de6bb14c~tplv-k3u1fbpfcp-zoom-1.image)

简单来说，由于用户在阿里系、京东系等产品长期引导下形成的使用习惯，商品信息的设计和模块划分比较一致，这种模式已经渐渐的沉淀下来并形成一种无形中的规则，主要分为：

- **商品基础信息**
- **商品图片**
- **商品详情内容**
- **商品价格信息**

通过上图中的一些信息可以得出商品详情的必要字段：

- 商品名称
- 商品简介
- 商品原价
- 商品实际售价
- 商品详情内容
- 商品主图/商品封面图

以上是字段是商品信息实体应该具有的基础字段，新蜂商城系统上在此基础上增加了几个字段：

- 商品库存(订单出库及仓库数据统计)
- 分类 id (与商品类目的关联关系)
- 销售状态(可以控制商品是否能够正常销售)

最终，商品信息表的 SQL 设计如下，在数据库中直接执行如下 SQL 语句即可：

```sql
USE `newbee_mall_db_v2`;

DROP TABLE IF EXISTS `tb_newbee_mall_goods_info`;

CREATE TABLE `tb_newbee_mall_goods_info`  (
  `goods_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品表主键id',
  `goods_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '商品名',
  `goods_intro` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '商品简介',
  `goods_category_id` bigint(20) NOT NULL DEFAULT 0 COMMENT '关联分类id',
  `goods_cover_img` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '/admin/dist/img/no-img.png' COMMENT '商品主图',
  `goods_carousel` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '/admin/dist/img/no-img.png' COMMENT '商品轮播图',
  `goods_detail_content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '商品详情',
  `original_price` int(11) NOT NULL DEFAULT 1 COMMENT '商品价格',
  `selling_price` int(11) NOT NULL DEFAULT 1 COMMENT '商品实际售价',
  `stock_num` int(11) NOT NULL DEFAULT 0 COMMENT '商品库存数量',
  `tag` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '商品标签',
  `goods_sell_status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '商品上架状态 0-下架 1-上架',
  `create_user` int(11) NOT NULL DEFAULT 0 COMMENT '添加者主键id',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '商品添加时间',
  `update_user` int(11) NOT NULL DEFAULT 0 COMMENT '修改者主键id',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '商品修改时间',
  PRIMARY KEY (`goods_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
```

商品信息表的字段以及每个字段对应的含义都在上面的 SQL 中有介绍，读者们可以对照 SQL 进行理解，正确的把建表 SQL 导入到数据库中即可，如果有需要，读者们也可以自行根据该 SQL 设计进行扩展。

## 商品信息添加接口开发与联调

商品添加接口负责接收前端的 POST 请求并处理其中的参数，接收的参数为用户在商品信息编辑页面输入的所有字段内容，字段名称与对应的含义如下：

1. "**goodsName**": 商品名称
2. "**goodsIntro**": 商品简介
3. "**goodsCategoryId**": 分类 id (下拉框中选择)
4. "**tag**": 商品小标签字段
5. "**originalPrice**": 商品原价(更多的是起到展示作用)
6. "**sellingPrice**": 商品实际售价(展示以及后续订单流程的计算都会使用到)
7. "**stockNum**": 商品库存
8. "**goodsDetailContent**": 商品详情内容
9. "**goodsCoverImg**": 商品主图/商品封面图
10. "**goodsSellStatus**": 商品销售状态(上架和下架两种状态)

#### 新建商品实体类和 Mapper 接口

首先在 ltd.newbee.mall.entity 包中创建商品实体类，选中 entity 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallGoods”，最后在 NewBeeMallGoods 类中新增如下代码：

```java
package ltd.newbee.mall.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class NewBeeMallGoods {
    private Long goodsId;

    private String goodsName;

    private String goodsIntro;

    private Long goodsCategoryId;

    private String goodsCoverImg;

    private String goodsCarousel;

    private Integer originalPrice;

    private Integer sellingPrice;

    private Integer stockNum;

    private String tag;

    private Byte goodsSellStatus;

    private Integer createUser;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    private Integer updateUser;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

    private String goodsDetailContent;
}
```

在 ltd.newbee.mall.dao 包中新建商品实体的 Mapper 接口，选中 dao 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallGoodsMapper”，并选中“Interface”选项，之后在 NewBeeMallGoodsMapper.java 文件中新增如下代码：

```java
package ltd.newbee.mall.dao;

import ltd.newbee.mall.entity.NewBeeMallGoods;

public interface NewBeeMallGoodsMapper {
  
    /**
     * 保存一条新记录
     * @param record
     * @return
     */
    int insertSelective(NewBeeMallGoods record);
}
```

NewBeeMallGoodsMapper 用于定义对于商品操作的数据层方法，此时只添加了 insert 方法，其它方法会在后续功能中介绍。

#### 创建 NewBeeMallGoodsMapper 接口的映射文件

在 resources/mapper 目录下新建 NewBeeMallGoodsMapper 接口的映射文件 NewBeeMallGoodsMapper.xml，之后进行映射文件的编写。

1.首先，定义映射文件与 Mapper 接口的对应关系，比如该示例中，需要将 NewBeeMallGoodsMapper.xml 文件与对应的 NewBeeMallGoodsMapper 接口之间的关系定义出来：

```xml
<mapper namespace="ltd.newbee.mall.dao.NewBeeMallGoodsMapper">
```

2.之后，配置表结构和实体类的对应关系：

```xml
<resultMap id="BaseResultMap" type="ltd.newbee.mall.entity.NewBeeMallGoods">
  <id column="goods_id" jdbcType="BIGINT" property="goodsId"/>
  <result column="goods_name" jdbcType="VARCHAR" property="goodsName"/>
  <result column="goods_intro" jdbcType="VARCHAR" property="goodsIntro"/>
  <result column="goods_category_id" jdbcType="BIGINT" property="goodsCategoryId"/>
  <result column="goods_cover_img" jdbcType="VARCHAR" property="goodsCoverImg"/>
  <result column="goods_carousel" jdbcType="VARCHAR" property="goodsCarousel"/>
  <result column="original_price" jdbcType="INTEGER" property="originalPrice"/>
  <result column="selling_price" jdbcType="INTEGER" property="sellingPrice"/>
  <result column="stock_num" jdbcType="INTEGER" property="stockNum"/>
  <result column="tag" jdbcType="VARCHAR" property="tag"/>
  <result column="goods_sell_status" jdbcType="TINYINT" property="goodsSellStatus"/>
  <result column="create_user" jdbcType="INTEGER" property="createUser"/>
  <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
  <result column="update_user" jdbcType="INTEGER" property="updateUser"/>
  <result column="update_time" jdbcType="TIMESTAMP" property="updateTime"/>
</resultMap>
```

3.最后，按照对应的接口方法，编写具体的 SQL 语句，最终的 NewBeeMallGoodsMapper.xml 文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="ltd.newbee.mall.dao.NewBeeMallGoodsMapper">
    <resultMap id="BaseResultMap" type="ltd.newbee.mall.entity.NewBeeMallGoods">
        <id column="goods_id" jdbcType="BIGINT" property="goodsId"/>
        <result column="goods_name" jdbcType="VARCHAR" property="goodsName"/>
        <result column="goods_intro" jdbcType="VARCHAR" property="goodsIntro"/>
        <result column="goods_category_id" jdbcType="BIGINT" property="goodsCategoryId"/>
        <result column="goods_cover_img" jdbcType="VARCHAR" property="goodsCoverImg"/>
        <result column="goods_carousel" jdbcType="VARCHAR" property="goodsCarousel"/>
        <result column="original_price" jdbcType="INTEGER" property="originalPrice"/>
        <result column="selling_price" jdbcType="INTEGER" property="sellingPrice"/>
        <result column="stock_num" jdbcType="INTEGER" property="stockNum"/>
        <result column="tag" jdbcType="VARCHAR" property="tag"/>
        <result column="goods_sell_status" jdbcType="TINYINT" property="goodsSellStatus"/>
        <result column="create_user" jdbcType="INTEGER" property="createUser"/>
        <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
        <result column="update_user" jdbcType="INTEGER" property="updateUser"/>
        <result column="update_time" jdbcType="TIMESTAMP" property="updateTime"/>
    </resultMap>
    <resultMap extends="BaseResultMap" id="ResultMapWithBLOBs" type="ltd.newbee.mall.entity.NewBeeMallGoods">
        <result column="goods_detail_content" jdbcType="LONGVARCHAR" property="goodsDetailContent"/>
    </resultMap>
       <insert id="insertSelective" parameterType="ltd.newbee.mall.entity.NewBeeMallGoods">
        insert into tb_newbee_mall_goods_info
        <trim prefix="(" suffix=")" suffixOverrides=",">
            <if test="goodsId != null">
                goods_id,
            </if>
            <if test="goodsName != null">
                goods_name,
            </if>
            <if test="goodsIntro != null">
                goods_intro,
            </if>
            <if test="goodsCategoryId != null">
                goods_category_id,
            </if>
            <if test="goodsCoverImg != null">
                goods_cover_img,
            </if>
            <if test="goodsCarousel != null">
                goods_carousel,
            </if>
            <if test="originalPrice != null">
                original_price,
            </if>
            <if test="sellingPrice != null">
                selling_price,
            </if>
            <if test="stockNum != null">
                stock_num,
            </if>
            <if test="tag != null">
                tag,
            </if>
            <if test="goodsSellStatus != null">
                goods_sell_status,
            </if>
            <if test="createUser != null">
                create_user,
            </if>
            <if test="createTime != null">
                create_time,
            </if>
            <if test="updateUser != null">
                update_user,
            </if>
            <if test="updateTime != null">
                update_time,
            </if>
            <if test="goodsDetailContent != null">
                goods_detail_content,
            </if>
        </trim>
        <trim prefix="values (" suffix=")" suffixOverrides=",">
            <if test="goodsId != null">
                #{goodsId,jdbcType=BIGINT},
            </if>
            <if test="goodsName != null">
                #{goodsName,jdbcType=VARCHAR},
            </if>
            <if test="goodsIntro != null">
                #{goodsIntro,jdbcType=VARCHAR},
            </if>
            <if test="goodsIntro != null">
                #{goodsCategoryId,jdbcType=BIGINT},
            </if>
            <if test="goodsCoverImg != null">
                #{goodsCoverImg,jdbcType=VARCHAR},
            </if>
            <if test="goodsCarousel != null">
                #{goodsCarousel,jdbcType=VARCHAR},
            </if>
            <if test="originalPrice != null">
                #{originalPrice,jdbcType=INTEGER},
            </if>
            <if test="sellingPrice != null">
                #{sellingPrice,jdbcType=INTEGER},
            </if>
            <if test="stockNum != null">
                #{stockNum,jdbcType=INTEGER},
            </if>
            <if test="tag != null">
                #{tag,jdbcType=VARCHAR},
            </if>
            <if test="goodsSellStatus != null">
                #{goodsSellStatus,jdbcType=TINYINT},
            </if>
            <if test="createUser != null">
                #{createUser,jdbcType=INTEGER},
            </if>
            <if test="createTime != null">
                #{createTime,jdbcType=TIMESTAMP},
            </if>
            <if test="updateUser != null">
                #{updateUser,jdbcType=INTEGER},
            </if>
            <if test="updateTime != null">
                #{updateTime,jdbcType=TIMESTAMP},
            </if>
            <if test="goodsDetailContent != null">
                #{goodsDetailContent,jdbcType=LONGVARCHAR},
            </if>
        </trim>
    </insert>
</mapper>
```

#### 业务层代码实现

在 ltd.newbee.mall.service 包中新建业务处理类，选中 service 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallGoodsService”，并选中“Interface”选项。

最后在 NewBeeMallGoodsService.java 文件中新增如下代码：

```java
package ltd.newbee.mall.service;

import ltd.newbee.mall.entity.NewBeeMallGoods;

public interface NewBeeMallGoodsService {
  
    /**
     * 添加商品
     *
     * @param goods
     * @return
     */
    String saveNewBeeMallGoods(NewBeeMallGoods goods);
}
```

然后在 ltd.newbee.mall.service.impl 包中新建 NewBeeMallGoodsService 的实现类，选中 impl 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallGoodsServiceImpl”，最后在 NewBeeMallGoodsServiceImpl 类中新增如下代码：

```java
package ltd.newbee.mall.service.impl;

import ltd.newbee.mall.common.ServiceResultEnum;
import ltd.newbee.mall.dao.NewBeeMallGoodsMapper;
import ltd.newbee.mall.entity.NewBeeMallGoods;
import ltd.newbee.mall.service.NewBeeMallGoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NewBeeMallGoodsServiceImpl implements NewBeeMallGoodsService {

    @Autowired
    private NewBeeMallGoodsMapper goodsMapper;

    @Override
    public String saveNewBeeMallGoods(NewBeeMallGoods goods) {
        if (goodsMapper.insertSelective(goods) > 0) {
            return ServiceResultEnum.SUCCESS.getResult();
        }
        return ServiceResultEnum.DB_ERROR.getResult();
    }
}
```

#### 20.4.4 商品添加接口控制层代码实现

在 ltd.newbee.mall.api.admin 包中新建 NewBeeAdminGoodsInfoAPI 类，新增商品添加接口的实现代码，代码如下：

```java
/**
 * 添加
 */
@RequestMapping(value = "/goods", method = RequestMethod.POST)
@ApiOperation(value = "新增商品信息", notes = "新增商品信息")
public Result save(@RequestBody @Valid GoodsAddParam goodsAddParam, @TokenToAdminUser AdminUserToken adminUser) {
    logger.info("adminUser:{}", adminUser.toString());
    NewBeeMallGoods newBeeMallGoods = new NewBeeMallGoods();
    BeanUtil.copyProperties(goodsAddParam, newBeeMallGoods);
    String result = newBeeMallGoodsService.saveNewBeeMallGoods(newBeeMallGoods);
    if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
        return ResultGenerator.genSuccessResult();
    } else {
        return ResultGenerator.genFailResult(result);
    }
}
```

商品信息添加接口中，首先会对参数进行校验，这里使用 @RequestBody 转换参数并使用 @Valid 标注，对接受到的参数进行逐一验证，GoodsAddParam 类的源码如下：

```java
package ltd.newbee.mall.api.admin.param;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
public class GoodsAddParam {

    @ApiModelProperty("商品名称")
    @NotEmpty(message = "商品名称不能为空")
    private String goodsName;

    @ApiModelProperty("商品简介")
    @NotEmpty(message = "商品简介不能为空")
    private String goodsIntro;

    @ApiModelProperty("分类id")
    @NotNull(message = "分类id不能为空")
    @Min(value = 1, message = "分类id最低为1")
    private Long goodsCategoryId;

    @ApiModelProperty("商品主图")
    @NotEmpty(message = "商品主图不能为空")
    private String goodsCoverImg;

    @ApiModelProperty("originalPrice")
    @NotNull(message = "originalPrice不能为空")
    @Min(value = 1, message = "originalPrice最低为1")
    @Max(value = 1000000, message = "originalPrice最高为1000000")
    private Integer originalPrice;

    @ApiModelProperty("sellingPrice")
    @NotNull(message = "sellingPrice不能为空")
    @Min(value = 1, message = "sellingPrice最低为1")
    @Max(value = 1000000, message = "sellingPrice最高为1000000")
    private Integer sellingPrice;

    @ApiModelProperty("库存")
    @NotNull(message = "库存不能为空")
    @Min(value = 1, message = "库存最低为1")
    @Max(value = 100000, message = "库存最高为100000")
    private Integer stockNum;

    @ApiModelProperty("商品标签")
    @NotEmpty(message = "商品标签不能为空")
    private String tag;

    private Byte goodsSellStatus;

    @ApiModelProperty("商品详情")
    @NotEmpty(message = "商品详情不能为空")
    private String goodsDetailContent;
}
```

之后交给业务层代码进行操作，并向数据库中插入一条商品数据。

## 商品信息修改接口开发

修改接口的实现与添加接口类似，唯一的不同点就是修改接口需要知道修改的是哪一条，因此可以模仿添加接口来实现商品信息修改接口，商品信息修改接口负责接收前端的 POST 请求并处理其中的参数，接收的参数为管理员用户在商品信息编辑页面输入的所有字段内容以及待修改商品信息的主键 id，字段名称与对应的含义如下：

1. "**goodsId**": 商品信息主键
2. "**goodsName**": 商品名称
3. "**goodsIntro**": 商品简介
4. "**goodsCategoryId**": 分类 id (下拉框中选择)
5. "**tag**": 商品小标签字段
6. "**originalPrice**": 商品原价(更多的是起到展示作用)
7. "**sellingPrice**": 商品实际售价(展示以及后续订单流程的计算都会使用到)
8. "**stockNum**": 商品库存
9. "**goodsDetailContent**": 商品详情内容
10. "**goodsCoverImg**": 商品主图/商品封面图
11. "**goodsSellStatus**": 商品销售状态(上架和下架两种状态)

#### 数据层代码实现

在商品实体的 Mapper 接口 NewBeeMallGoodsMapper.java 文件中新增如下方法：

```java
/**
 * 根据主键id获取记录
 * @param goodsId
 * @return
 */
NewBeeMallGoods selectByPrimaryKey(Long goodsId);

/**
 * 修改一条记录
 * @param record
 * @return
 */
int updateByPrimaryKeySelective(NewBeeMallGoods record);
```

之后，在映射文件 NewBeeMallGoodsMapper.xml 中按照对应的接口方法，编写具体的 SQL 语句，新增代码如下：

```java
<sql id="Base_Column_List">
goods_id, goods_name, goods_intro,goods_category_id, goods_cover_img, goods_carousel, original_price,selling_price, stock_num, tag, goods_sell_status, create_user, create_time, update_user, update_time
</sql>
  
<sql id="Blob_Column_List">
  goods_detail_content
</sql>
  
<select id="selectByPrimaryKey" parameterType="java.lang.Long" resultMap="ResultMapWithBLOBs">
    select
    <include refid="Base_Column_List"/>
    ,
    <include refid="Blob_Column_List"/>
    from tb_newbee_mall_goods_info
    where goods_id = #{goodsId,jdbcType=BIGINT}
</select>

<update id="updateByPrimaryKeySelective" parameterType="ltd.newbee.mall.entity.NewBeeMallGoods">
    update tb_newbee_mall_goods_info
    <set>
        <if test="goodsName != null">
            goods_name = #{goodsName,jdbcType=VARCHAR},
        </if>
        <if test="goodsIntro != null">
            goods_intro = #{goodsIntro,jdbcType=VARCHAR},
        </if>
        <if test="goodsCategoryId != null">
            goods_category_id = #{goodsCategoryId,jdbcType=BIGINT},
        </if>
        <if test="goodsCoverImg != null">
            goods_cover_img = #{goodsCoverImg,jdbcType=VARCHAR},
        </if>
        <if test="goodsCarousel != null">
            goods_carousel = #{goodsCarousel,jdbcType=VARCHAR},
        </if>
        <if test="originalPrice != null">
            original_price = #{originalPrice,jdbcType=INTEGER},
        </if>
        <if test="sellingPrice != null">
            selling_price = #{sellingPrice,jdbcType=INTEGER},
        </if>
        <if test="stockNum != null">
            stock_num = #{stockNum,jdbcType=INTEGER},
        </if>
        <if test="tag != null">
            tag = #{tag,jdbcType=VARCHAR},
        </if>
        <if test="goodsSellStatus != null">
            goods_sell_status = #{goodsSellStatus,jdbcType=TINYINT},
        </if>
        <if test="createUser != null">
            create_user = #{createUser,jdbcType=INTEGER},
        </if>
        <if test="createTime != null">
            create_time = #{createTime,jdbcType=TIMESTAMP},
        </if>
        <if test="updateUser != null">
            update_user = #{updateUser,jdbcType=INTEGER},
        </if>
        <if test="updateTime != null">
            update_time = #{updateTime,jdbcType=TIMESTAMP},
        </if>
        <if test="goodsDetailContent != null">
            goods_detail_content = #{goodsDetailContent,jdbcType=LONGVARCHAR},
        </if>
    </set>
    where goods_id = #{goodsId,jdbcType=BIGINT}
</update>
```

#### 业务层代码实现

在商品业务层代码 NewBeeMallGoodsService.java 中新增如下方法：

```java
/**
 * 修改商品信息
 *
 * @param goods
 * @return
 */
String updateNewBeeMallGoods(NewBeeMallGoods goods);

/**
 * 获取商品详情
 *
 * @param id
 * @return
 */
NewBeeMallGoods getNewBeeMallGoodsById(Long id);
```

之后在 NewBeeMallGoodsServiceImpl 类中将上述方法实现，新增如下代码：

```java
@Override
public String updateNewBeeMallGoods(NewBeeMallGoods goods) {
    NewBeeMallGoods temp = goodsMapper.selectByPrimaryKey(goods.getGoodsId());
    if (temp == null) {
        return ServiceResultEnum.DATA_NOT_EXIST.getResult();
    }
    goods.setUpdateTime(new Date());
    if (goodsMapper.updateByPrimaryKeySelective(goods) > 0) {
        return ServiceResultEnum.SUCCESS.getResult();
    }
    return ServiceResultEnum.DB_ERROR.getResult();
}

@Override
public NewBeeMallGoods getNewBeeMallGoodsById(Long id) {
    return goodsMapper.selectByPrimaryKey(id);
}
```

updateNewBeeMallGoods() 这个方法可以结合商品信息添加的业务层方法来理解，不同的点是updateNewBeeMallGoods() 方法会判断是否存在当前想要修改的记录，之后再调用执行 update 语句进行数据库修改。

#### 商品添加接口控制层代码实现

在 NewBeeMallGoodsInfoAPI 类中新增 update() 方法，接口的映射地址为 /manage-api/v1/goods，请求方法为 PUT，新增代码如下：

```java
/**
 * 修改
 */
@RequestMapping(value = "/goods", method = RequestMethod.PUT)
@ApiOperation(value = "修改商品信息", notes = "修改商品信息")
public Result update(@RequestBody @Valid GoodsEditParam goodsEditParam, @TokenToAdminUser AdminUserToken adminUser) {
    logger.info("adminUser:{}", adminUser.toString());
    NewBeeMallGoods newBeeMallGoods = new NewBeeMallGoods();
    BeanUtil.copyProperties(goodsEditParam, newBeeMallGoods);
    String result = newBeeMallGoodsService.updateNewBeeMallGoods(newBeeMallGoods);
    if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
        return ResultGenerator.genSuccessResult();
    } else {
        return ResultGenerator.genFailResult(result);
    }
}
```

首先对参数进行校验，之后交给业务层代码进行操作，与添加接口不同的是传参，修改参数类 GoodsEditParam 代码中多了一个主键 id 的字段，通过这个字段确定将要修改的是哪一条商品数据。

## 商品信息管理模块接口实现

因为商品信息添加和商品信息修改接口都已经实现，在管理模块中也仅仅只需要列表功能和商品上下架功能了，因此只介绍分页接口和商品上下架接口，另外两个接口在之前已经开发和联调完成。

#### 数据层代码实现

在商品实体的 Mapper 接口 NewBeeMallGoodsMapper.java 文件中新增如下方法：

```java
/**
 * 查询分页数据
 * @param pageUtil
 * @return
 */
List<NewBeeMallGoods> findNewBeeMallGoodsList(PageQueryUtil pageUtil);

/**
 * 查询总数
 * @param pageUtil
 * @return
 */
int getTotalNewBeeMallGoods(PageQueryUtil pageUtil);

/**
 * 批量修改记录
 * @param orderIds
 * @param sellStatus
 * @return
 */
int batchUpdateSellStatus(@Param("goodsIds")Long[] goodsIds,@Param("sellStatus") int sellStatus);
```

之后，在映射文件 NewBeeMallGoodsMapper.xml 中按照对应的接口方法，编写具体的 SQL 语句，新增代码如下：

```java
<select id="findNewBeeMallGoodsList" parameterType="Map" resultMap="BaseResultMap">
    select
    <include refid="Base_Column_List"/>
    from tb_newbee_mall_goods_info
    order by goods_id desc
    <if test="start!=null and limit!=null">
        limit #{start},#{limit}
    </if>
</select>

<select id="getTotalNewBeeMallGoods" parameterType="Map" resultType="int">
    select count(*) from tb_newbee_mall_goods_info
</select>
        
<update id="batchUpdateSellStatus">
    update tb_newbee_mall_goods_info
    set goods_sell_status=#{sellStatus},update_time=now() where goods_id in
    <foreach item="id" collection="goodsIds" open="(" separator="," close=")">
        #{id}
    </foreach>
</update>
```

#### 20.8.2 业务层代码实现

在商品业务层代码 NewBeeMallGoodsService.java 中新增如下方法：

```java
/**
 * 后台分页
 *
 * @param pageUtil
 * @return
 */
PageResult getNewBeeMallGoodsPage(PageQueryUtil pageUtil);

/**
 * 批量修改销售状态(上架下架)
 *
 * @param ids
 * @return
 */
Boolean batchUpdateSellStatus(Long[] ids,int sellStatus);
```

之后在 NewBeeMallGoodsServiceImpl 类中将上述方法实现，新增如下代码：

```java
@Override
public PageResult getNewBeeMallGoodsPage(PageQueryUtil pageUtil) {
    List<NewBeeMallGoods> goodsList = goodsMapper.findNewBeeMallGoodsList(pageUtil);
    int total = goodsMapper.getTotalNewBeeMallGoods(pageUtil);
    PageResult pageResult = new PageResult(goodsList, total, pageUtil.getLimit(), pageUtil.getPage());
    return pageResult;
}

@Override
public Boolean batchUpdateSellStatus(Long[] ids, int sellStatus) {
    return goodsMapper.batchUpdateSellStatus(ids, sellStatus) > 0;
}
```

#### 20.8.3 控制层代码实现

在 NewBeeMallGoodsController 类中新增列表接口和商品销售状态批量修改接口的实现方法，代码如下：

```java
/**
 * 列表
 */
@RequestMapping(value = "/goods/list", method = RequestMethod.GET)
@ApiOperation(value = "商品列表", notes = "可根据名称和上架状态筛选")
public Result list(@RequestParam(required = false) @ApiParam(value = "页码") Integer pageNumber,
                   @RequestParam(required = false) @ApiParam(value = "每页条数") Integer pageSize,
                   @RequestParam(required = false) @ApiParam(value = "商品名称") String goodsName,
                   @RequestParam(required = false) @ApiParam(value = "上架状态 0-上架 1-下架") Integer goodsSellStatus, @TokenToAdminUser AdminUserToken adminUser) {
    logger.info("adminUser:{}", adminUser.toString());
    if (pageNumber == null || pageNumber < 1 || pageSize == null || pageSize < 10) {
        return ResultGenerator.genFailResult("参数异常！");
    }
    Map params = new HashMap(8);
    params.put("page", pageNumber);
    params.put("limit", pageSize);
    if (!StringUtils.isEmpty(goodsName)) {
        params.put("goodsName", goodsName);
    }
    if (goodsSellStatus != null) {
        params.put("goodsSellStatus", goodsSellStatus);
    }
    PageQueryUtil pageUtil = new PageQueryUtil(params);
    return ResultGenerator.genSuccessResult(newBeeMallGoodsService.getNewBeeMallGoodsPage(pageUtil));
}

/**
 * 批量修改销售状态
 */
@RequestMapping(value = "/goods/status/{sellStatus}", method = RequestMethod.PUT)
@ApiOperation(value = "批量修改销售状态", notes = "批量修改销售状态")
public Result delete(@RequestBody BatchIdParam batchIdParam, @PathVariable("sellStatus") int sellStatus, @TokenToAdminUser AdminUserToken adminUser) {
    logger.info("adminUser:{}", adminUser.toString());
    if (batchIdParam == null || batchIdParam.getIds().length < 1) {
        return ResultGenerator.genFailResult("参数异常！");
    }
    if (sellStatus != Constants.SELL_STATUS_UP && sellStatus != Constants.SELL_STATUS_DOWN) {
        return ResultGenerator.genFailResult("状态异常！");
    }
    if (newBeeMallGoodsService.batchUpdateSellStatus(batchIdParam.getIds(), sellStatus)) {
        return ResultGenerator.genSuccessResult();
    } else {
        return ResultGenerator.genFailResult("修改失败");
    }
}
```

1.列表接口负责接收前端传来的分页参数，如 page 、limit 等参数，之后将数据总数和对应页面的数据列表查询出来并封装为分页数据返回给前端。SQL 语句在 NewBeeMallGoodsMapper.xml 文件中，一般的分页也就是使用 limit 关键字实现，获取相应条数的记录和总数之后再进行数据封装，这个接口就是根据前端传的分页参数，进行查询并返回商品信息的分页数据以供前端页面进行数据渲染。

2.商品信息表中有销售状态字段，根据这个字段来确定商品是否处于正常销售状态，如果是下架商品则需要限制部分功能，因此在后台管理系统中设置了商品的批量上下架功能。销售状态批量修改接口负责接收前端的商品上架或者商品下架请求，处理前端传输过来的数据后，将这些商品信息记录的销售状态修改掉，将接收的参数设置为一个数组，可以同时操作多条记录，只需要在前端将用户选择的记录 id 封装好再传参到后端即可。使用 @RequestBody 注解将前端传过来的参数，参数验证通过后则调用 batchUpdateSellStatus() 批量修改方法进行数据库操作，以上 SQL 语句的含义就是将这些 id 的商品信息记录的 goods_sell_status 批量修改掉。

## 商品管理模块接口测试

最后，我们通过 Swagger 页面来测试一下这些接口。

重启项目，打开 swagger-ui 页面：

![image-20210420222801737](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/511497efed1f4c1d9343dc3a874a0dce~tplv-k3u1fbpfcp-zoom-1.image)

由于这些接口都需要登录后才能访问，首先我们访问登录接口，拿到一个可以正常进行身份认证的 token 字符串，如下图所示：

![image-20210407170852871](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0da8d3b1b51a4cb99f4f81251ee8661c~tplv-k3u1fbpfcp-zoom-1.image)

最终获取到一个 token 字符串，值为“ce01a7e885e55a38fdfd09c902c551a3”。

1.列表接口

点开“商品列表”，在 token 输入框中填入登录接口返回的 token 值并输入分页所需的 pageNumber 、 pageSize 参数，商品名称和商品状态并不是必传参数，需要过滤时再传，之后点击”Execute“按钮：

![image-20210420223045858](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bba538f277d644be9672d3adf1938f1d~tplv-k3u1fbpfcp-zoom-1.image)

商品列表测试数据如下，如下图所示：

![image-20210420223242783](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eccf1b6a38f9451cbfecba5ee1c15a76~tplv-k3u1fbpfcp-zoom-1.image)

大家可以自行调整查询参数，来更好的测试分页列表接口。

2.新增接口：

点开“新增商品信息”，在 token 输入框中填入登录接口返回的 token 值并输入新增商品接口中的必填参数，分别输入商品分类 id、商品名称、商品简介、商品详情、商品主图、库存、价格等参数，最后点击”Execute“按钮，得到如下返回结果：

![image-20210420223836807](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86385d3d7b1046cfb8d477f97942e337~tplv-k3u1fbpfcp-zoom-1.image)

添加成功后可以看到列表中多了一条数据。

以上是正常情况，如果 token 不正确或者请求的参数不规范也会得到对应的错误提示：

![image-20210420223913796](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d2cfe6e43264f38a3c77190c62cdd9a~tplv-k3u1fbpfcp-zoom-1.image)

“商品修改接口”与“商品新增接口”测试步骤类似，这里就省略了，大家可以自行测试。

3.详情接口：

点开“获取单条分类信息”，在 token 输入框中填入登录接口返回的 token 值和商品的 id，之后点击”Execute“按钮，即可得到商品详情数据，如下图所示：

![image-20210420224227652](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d990faab0ee04ff9abe8a126f15a9899~tplv-k3u1fbpfcp-zoom-1.image)

![image-20210420224258139](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71129ad499f8466d882a21178dee488b~tplv-k3u1fbpfcp-zoom-1.image)

返回的数据中不仅仅包括商品信息，还有商品分类的详细数据。

而如果传入的 id 未查询到数据，会得到如下返回结果：

![image-20210413111404393](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eab9e19ec7a848529f702897ca3500ab~tplv-k3u1fbpfcp-zoom-1.image)

4.修改销售状态接口：

最后是修改销售状态接口的测试，点开“批量修改销售状态”，在 token 输入框中填入登录接口返回的 token 值和需要修改状态的商品 id 数组，比如这里我想要将 id 为 10909 和 10912 的两条商品状态修改为“下架”，则需要输入两个 id 并在 sellStatus 字段处填写 1 ，之后点击”Execute“按钮，即可完成该步骤，如下图所示：

![image-20210420224651139](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f883985c2afb46c4be5cdbc067ac78b5~tplv-k3u1fbpfcp-zoom-1.image)

![image-20210420224725891](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ef2d88d83e94f4d9fb49172d84e1610~tplv-k3u1fbpfcp-zoom-1.image)

> 注意数组中的逗号为英文逗号，如果不小心输入了中文符号会报错的。

如果此时再去查询这两条数据，无论是列表接口还是详情接口，商品的 sellStatus 都是 1，即“下架”状态，功能测试完成。

读者们可以按照文中的思路和过程自行测试，商品管理模块的接口开发完成！