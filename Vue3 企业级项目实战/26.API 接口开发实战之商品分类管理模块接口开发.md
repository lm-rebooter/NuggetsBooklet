```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1wHahK-uYAezY8IHW_O_Nxg 
提取码: 2d82
```

除了轮播图数据外，商品分类数据也是非常重要的，商城端页面中会展示商品分类信息供用户快速的搜索需要的商品。同样地，商城端只需要查询分类数据并展示给用户即可，分类数据的添加和配置则需要在后台管理系统中实现，笔者将继续讲解开发后台管理系统中的功能模块，本章节是分类数据管理模块的开发。

## 分类管理模块介绍

#### 商品分类

分类是通过比较事物之间的相似性，把具有某些共同点或相似特征的事物归属于一个不确定集合的逻辑方法，而对应的，将事物进行分门别类的作用是使一个大集合中的内容条理清楚，层次分明。分类也叫做类目，如果要设计一个商品系统，首先需要把分类系统做好，因为它是商品管理系统中非常基础也是非常重要的一个环节。

顾名思义，商品分类就是将商品进行分门别类，一部分商品是衣服，一部分商品是数码产品，另外一部分商品是美妆或者护理产品，这样处理的好处就是方便用户进行筛选和辨别，以天猫商城和京东商城为例，在商城首屏中很大一部分版面都可以进行分类的选择，在这里可以通过分类的设置快速的进入对应的商品列表页面进行商品选择。

- 天猫商城分类选择

![image-20210124162822962](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c07e49f726c349a9b48073019f2e0873~tplv-k3u1fbpfcp-zoom-1.image)

- 京东商城分类选择

![image-20210124162954809](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/171f7f65ded64c669f659f254753c4c7~tplv-k3u1fbpfcp-zoom-1.image)

#### 分类层级

通过观察以上两个商城网站的分类模块，能够看出它们对于分类层级的设计，分类层级的不同就表示商城系统需要在商品分类上继续做归类操作，因为规模和业务的不同，分类的层级肯定也会出现截然不同的效果。天猫商城和京东商城在分类层级的设计思路上是相同的，都是将分类设置成三级。

如果不设置分类层级，过多的商品分类也会造成用户筛选的困难，而进行分类层级设置后，用户在查找商品时可以遵循“**先大类后小类**”的原则。比如用户想要买一部手机，可以先在左侧的一级分类中筛选并定位到“手机/数码”这一类目中，之后在这个类目的子分类下再去进行筛选。想象一下如果没有分类层级的设计，用户就需要在众多的子分类中去逐一查找需要的分类条目，这种体验就会让用户很不适应，甚至不想用分类搜索这种方式来查找商品。所以分类层级的设置使得用户的目的性更强，且用户在进行商品类别查找时有迹可循，也能够更加快速的定位到需要的分类中。

当然，也有人会提出设计出更深层级的分类，比如四级分类、五级分类等等，层级太深也不是最好的设计，目前大部分商城应用选择的分类层级是 3 级。层级太深的话，一是对用户不太友好，层级太深反而会不利于寻找；二是对于后台管理人员也不友好，层级太深不方便管理，所以新蜂商城就直接参考天猫商城和京东商城的类目层级设计原则，将其设置成三级类目。

#### 分类模块的主要功能

新蜂商城后台管理系统中，分类模块的主要功能可以整理为以下两点：

1. 分类数据的设置

2. 商品与分类的挂靠和关联

分类数据的设置中包括分类信息的添加修改等操作，这些数据的存在才使得用户可以在商城端进行筛选。商品与分类的挂靠和关联是指将商品信息与分类信息建立联系，比如在商品表中设置一个分类 id 的关联字段，这样商品与分类二者之间就产生了关联关系，这样就能够通过对应的分类搜索到对应的商品列表，搜索功能的实现会在商城端开发中讲解，本章节主要讲解商品分类的后台管理模块的接口实现和页面制作。

## 商品分类表结构设计

在进行分类模块的接口设计和具体的功能实现前，首先将分类表的结构确定下来，虽然是新蜂商城中的分类设置成了三个层级，不过在表设计时并没有做成三张表，因为大部分字段都是一样的，所以就选择增加一个 category_level 字段来区分是哪一级的分类，同时使用 parent_id 字段来进行上下级类目之间的关联，分类表的字段设计如下：

```sql
USE `newbee_mall_db_v2`;

DROP TABLE IF EXISTS `tb_newbee_mall_goods_category`;
CREATE TABLE `tb_newbee_mall_goods_category`  (
  `category_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `category_level` tinyint(4) NOT NULL DEFAULT 0 COMMENT '分类级别(1-一级分类 2-二级分类 3-三级分类)',
  `parent_id` bigint(20) NOT NULL DEFAULT 0 COMMENT '父分类id',
  `category_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '分类名称',
  `category_rank` int(11) NOT NULL DEFAULT 0 COMMENT '排序值(字段越大越靠前)',
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0 COMMENT '删除标识字段(0-未删除 1-已删除)',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user` int(11) NOT NULL DEFAULT 0 COMMENT '创建者id',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  `update_user` int(11) NULL DEFAULT 0 COMMENT '修改者id',
  PRIMARY KEY (`category_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
```

商品类目表的字段以及每个字段对应的含义都在上面的 SQL 中有介绍，读者们可以对照 SQL 进行理解，章节 20 中介绍了本项目完整的 SQL 文件，包含分类数据，可以直接使用，接下来进行分类功能实际的编码工作。

## 分类模块后端功能实现

分类管理模块模块在后台管理系统中有 4 个接口，分别是：

- 商品类目分页列表接口
- 添加商品类目接口
- 修改商品类目接口
- 批量删除商品类目接口

接下来讲解每个接口具体的实现代码。

#### 新建分类实体类和 Mapper 接口

首先在 ltd.newbee.mall.entity 包中创建分类实体类，选中 entity 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“GoodsCategory”，最后在 GoodsCategory 类中新增如下代码：

```java
package ltd.newbee.mall.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class GoodsCategory {
    private Long categoryId;

    private Byte categoryLevel;

    private Long parentId;

    private String categoryName;

    private Integer categoryRank;

    private Byte isDeleted;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    private Integer createUser;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

    private Integer updateUser;
}
```

在 ltd.newbee.mall.dao 包中新建分类实体的 Mapper 接口，选中 dao 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“GoodsCategoryMapper”，并选中“Interface”选项，之后在 GoodsCategoryMapper.java 文件中新增如下代码：

```java
package ltd.newbee.mall.dao;

import ltd.newbee.mall.entity.GoodsCategory;
import ltd.newbee.mall.util.PageQueryUtil;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface GoodsCategoryMapper {
    int deleteByPrimaryKey(Long categoryId);

    int insert(GoodsCategory record);

    int insertSelective(GoodsCategory record);

    GoodsCategory selectByPrimaryKey(Long categoryId);

    GoodsCategory selectByLevelAndName(@Param("categoryLevel") Byte categoryLevel, @Param("categoryName") String categoryName);

    int updateByPrimaryKeySelective(GoodsCategory record);

    int updateByPrimaryKey(GoodsCategory record);

    List<GoodsCategory> findGoodsCategoryList(PageQueryUtil pageUtil);

    int getTotalGoodsCategories(PageQueryUtil pageUtil);

    int deleteBatch(Long[] ids);

    List<GoodsCategory> selectByLevelAndParentIdsAndNumber(@Param("parentIds") List<Long> parentIds, @Param("categoryLevel") int categoryLevel, @Param("number") int number);
}
```

定义了对于分类数据操作的数据层方法，包括查询、新增、修改和删除等操作。

#### 创建 GoodsCategoryMapper 接口的映射文件

在 resources/mapper 目录下新建 GoodsCategoryMapper 接口的映射文件 GoodsCategoryMapper.xml，之后进行映射文件的编写。

1.首先，定义映射文件与 Mapper 接口的对应关系，比如该示例中，需要将 GoodsCategoryMapper.xml 文件与对应的 GoodsCategoryMapper 接口之间的关系定义出来：

```xml
<mapper namespace="ltd.newbee.mall.dao.GoodsCategoryMapper">
```

2.之后，配置表结构和实体类的对应关系：

```xml
<resultMap id="BaseResultMap" type="ltd.newbee.mall.entity.GoodsCategory">
    <id column="category_id" jdbcType="BIGINT" property="categoryId"/>
    <result column="category_level" jdbcType="TINYINT" property="categoryLevel"/>
    <result column="parent_id" jdbcType="BIGINT" property="parentId"/>
    <result column="category_name" jdbcType="VARCHAR" property="categoryName"/>
    <result column="category_rank" jdbcType="INTEGER" property="categoryRank"/>
    <result column="is_deleted" jdbcType="TINYINT" property="isDeleted"/>
    <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
    <result column="create_user" jdbcType="INTEGER" property="createUser"/>
    <result column="update_time" jdbcType="TIMESTAMP" property="updateTime"/>
    <result column="update_user" jdbcType="INTEGER" property="updateUser"/>
</resultMap>
```

3.最后，按照对应的接口方法，编写具体的 SQL 语句，最终的 GoodsCategoryMapper.xml 文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="ltd.newbee.mall.dao.GoodsCategoryMapper">
    <resultMap id="BaseResultMap" type="ltd.newbee.mall.entity.GoodsCategory">
        <id column="category_id" jdbcType="BIGINT" property="categoryId"/>
        <result column="category_level" jdbcType="TINYINT" property="categoryLevel"/>
        <result column="parent_id" jdbcType="BIGINT" property="parentId"/>
        <result column="category_name" jdbcType="VARCHAR" property="categoryName"/>
        <result column="category_rank" jdbcType="INTEGER" property="categoryRank"/>
        <result column="is_deleted" jdbcType="TINYINT" property="isDeleted"/>
        <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
        <result column="create_user" jdbcType="INTEGER" property="createUser"/>
        <result column="update_time" jdbcType="TIMESTAMP" property="updateTime"/>
        <result column="update_user" jdbcType="INTEGER" property="updateUser"/>
    </resultMap>
    <sql id="Base_Column_List">
    category_id, category_level, parent_id, category_name, category_rank, is_deleted, 
    create_time, create_user, update_time, update_user
  </sql>
    <select id="findGoodsCategoryList" parameterType="Map" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_goods_category
        <where>
            <if test="categoryLevel!=null and categoryLevel!=''">
                and category_level = #{categoryLevel}
            </if>
            <if test="parentId!=null and parentId!=''">
                and parent_id = #{parentId}
            </if>
            and is_deleted = 0
        </where>
        order by category_rank desc
        <if test="start!=null and limit!=null">
            limit #{start},#{limit}
        </if>
    </select>
    <select id="getTotalGoodsCategories" parameterType="Map" resultType="int">
        select count(*) from tb_newbee_mall_goods_category
        <where>
            <if test="categoryLevel!=null and categoryLevel!=''">
                and category_level = #{categoryLevel}
            </if>
            <if test="parentId!=null and parentId!=''">
                and parent_id = #{parentId}
            </if>
            and is_deleted = 0
        </where>
    </select>
    <select id="selectByPrimaryKey" parameterType="java.lang.Long" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_goods_category
        where category_id = #{categoryId,jdbcType=BIGINT} and is_deleted=0
    </select>
    <select id="selectByLevelAndName" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_goods_category
        where category_name = #{categoryName,jdbcType=VARCHAR} and category_level = #{categoryLevel,jdbcType=TINYINT}
        and is_deleted = 0 limit 1
    </select>
    <select id="selectByLevelAndParentIdsAndNumber" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_goods_category
        where parent_id in
        <foreach item="parentId" collection="parentIds" open="(" separator="," close=")">
            #{parentId,jdbcType=BIGINT}
        </foreach>
        and category_level = #{categoryLevel,jdbcType=TINYINT}
        and is_deleted = 0
        order by category_rank desc
        <if test="number>0">
            limit #{number}
        </if>
    </select>
    <update id="deleteByPrimaryKey" parameterType="java.lang.Long">
    update tb_newbee_mall_goods_category set is_deleted=1
    where category_id = #{categoryId,jdbcType=BIGINT} and is_deleted=0
  </update>
    <update id="deleteBatch">
        update tb_newbee_mall_goods_category
        set is_deleted=1 where category_id in
        <foreach item="id" collection="array" open="(" separator="," close=")">
            #{id}
        </foreach>
    </update>
    <insert id="insert" parameterType="ltd.newbee.mall.entity.GoodsCategory">
    insert into tb_newbee_mall_goods_category (category_id, category_level, parent_id, 
      category_name, category_rank, is_deleted, 
      create_time, create_user, update_time, 
      update_user)
    values (#{categoryId,jdbcType=BIGINT}, #{categoryLevel,jdbcType=TINYINT}, #{parentId,jdbcType=BIGINT}, 
      #{categoryName,jdbcType=VARCHAR}, #{categoryRank,jdbcType=INTEGER}, #{isDeleted,jdbcType=TINYINT}, 
      #{createTime,jdbcType=TIMESTAMP}, #{createUser,jdbcType=INTEGER}, #{updateTime,jdbcType=TIMESTAMP}, 
      #{updateUser,jdbcType=INTEGER})
  </insert>
    <insert id="insertSelective" parameterType="ltd.newbee.mall.entity.GoodsCategory">
        insert into tb_newbee_mall_goods_category
        <trim prefix="(" suffix=")" suffixOverrides=",">
            <if test="categoryId != null">
                category_id,
            </if>
            <if test="categoryLevel != null">
                category_level,
            </if>
            <if test="parentId != null">
                parent_id,
            </if>
            <if test="categoryName != null">
                category_name,
            </if>
            <if test="categoryRank != null">
                category_rank,
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
            <if test="categoryId != null">
                #{categoryId,jdbcType=BIGINT},
            </if>
            <if test="categoryLevel != null">
                #{categoryLevel,jdbcType=TINYINT},
            </if>
            <if test="parentId != null">
                #{parentId,jdbcType=BIGINT},
            </if>
            <if test="categoryName != null">
                #{categoryName,jdbcType=VARCHAR},
            </if>
            <if test="categoryRank != null">
                #{categoryRank,jdbcType=INTEGER},
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
    <update id="updateByPrimaryKeySelective" parameterType="ltd.newbee.mall.entity.GoodsCategory">
        update tb_newbee_mall_goods_category
        <set>
            <if test="categoryLevel != null">
                category_level = #{categoryLevel,jdbcType=TINYINT},
            </if>
            <if test="parentId != null">
                parent_id = #{parentId,jdbcType=BIGINT},
            </if>
            <if test="categoryName != null">
                category_name = #{categoryName,jdbcType=VARCHAR},
            </if>
            <if test="categoryRank != null">
                category_rank = #{categoryRank,jdbcType=INTEGER},
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
        where category_id = #{categoryId,jdbcType=BIGINT}
    </update>
    <update id="updateByPrimaryKey" parameterType="ltd.newbee.mall.entity.GoodsCategory">
    update tb_newbee_mall_goods_category
    set category_level = #{categoryLevel,jdbcType=TINYINT},
      parent_id = #{parentId,jdbcType=BIGINT},
      category_name = #{categoryName,jdbcType=VARCHAR},
      category_rank = #{categoryRank,jdbcType=INTEGER},
      is_deleted = #{isDeleted,jdbcType=TINYINT},
      create_time = #{createTime,jdbcType=TIMESTAMP},
      create_user = #{createUser,jdbcType=INTEGER},
      update_time = #{updateTime,jdbcType=TIMESTAMP},
      update_user = #{updateUser,jdbcType=INTEGER}
    where category_id = #{categoryId,jdbcType=BIGINT}
  </update>
</mapper>
```

#### 业务层代码实现

在 ltd.newbee.mall.service 包中新建业务处理类，选中 service 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallCategoryService”，并选中“Interface”选项。

最后在 NewBeeMallCategoryService.java 文件中新增如下代码：

```java
package ltd.newbee.mall.service;

import ltd.newbee.mall.entity.GoodsCategory;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.PageResult;

import java.util.List;

public interface NewBeeMallCategoryService {

    String saveCategory(GoodsCategory goodsCategory);

    String updateGoodsCategory(GoodsCategory goodsCategory);

    GoodsCategory getGoodsCategoryById(Long id);

    Boolean deleteBatch(Long[] ids);

    PageResult getCategorisPage(PageQueryUtil pageUtil);

    List<GoodsCategory> selectByLevelAndParentIdsAndNumber(List<Long> parentIds, int categoryLevel);
}
```

分类模块的业务层方法定义以及每个方法的作用都已经编写完成。

然后在 ltd.newbee.mall.service.impl 包中新建 NewBeeMallCategoryService 的实现类，选中 impl 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallCategoryServiceImpl”，最后在 NewBeeMallCategoryServiceImpl 类中新增如下代码：

```java
package ltd.newbee.mall.service.impl;

import ltd.newbee.mall.common.ServiceResultEnum;
import ltd.newbee.mall.dao.GoodsCategoryMapper;
import ltd.newbee.mall.entity.GoodsCategory;
import ltd.newbee.mall.service.NewBeeMallCategoryService;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NewBeeMallCategoryServiceImpl implements NewBeeMallCategoryService {

    @Autowired
    private GoodsCategoryMapper goodsCategoryMapper;

    @Override
    public String saveCategory(GoodsCategory goodsCategory) {
        GoodsCategory temp = goodsCategoryMapper.selectByLevelAndName(goodsCategory.getCategoryLevel(), goodsCategory.getCategoryName());
        if (temp != null) {
            return ServiceResultEnum.SAME_CATEGORY_EXIST.getResult();
        }
        if (goodsCategoryMapper.insertSelective(goodsCategory) > 0) {
            return ServiceResultEnum.SUCCESS.getResult();
        }
        return ServiceResultEnum.DB_ERROR.getResult();
    }

    @Override
    public String updateGoodsCategory(GoodsCategory goodsCategory) {
        GoodsCategory temp = goodsCategoryMapper.selectByPrimaryKey(goodsCategory.getCategoryId());
        if (temp == null) {
            return ServiceResultEnum.DATA_NOT_EXIST.getResult();
        }
        GoodsCategory temp2 = goodsCategoryMapper.selectByLevelAndName(goodsCategory.getCategoryLevel(), goodsCategory.getCategoryName());
        if (temp2 != null && !temp2.getCategoryId().equals(goodsCategory.getCategoryId())) {
            //同名且不同id 不能继续修改
            return ServiceResultEnum.SAME_CATEGORY_EXIST.getResult();
        }
        goodsCategory.setUpdateTime(new Date());
        if (goodsCategoryMapper.updateByPrimaryKeySelective(goodsCategory) > 0) {
            return ServiceResultEnum.SUCCESS.getResult();
        }
        return ServiceResultEnum.DB_ERROR.getResult();
    }

    @Override
    public GoodsCategory getGoodsCategoryById(Long id) {
        return goodsCategoryMapper.selectByPrimaryKey(id);
    }

    @Override
    public Boolean deleteBatch(Long[] ids) {
        if (ids.length < 1) {
            return false;
        }
        //删除分类数据
        return goodsCategoryMapper.deleteBatch(ids) > 0;
    }

    @Override
    public PageResult getCategorisPage(PageQueryUtil pageUtil) {
        List<GoodsCategory> goodsCategories = goodsCategoryMapper.findGoodsCategoryList(pageUtil);
        int total = goodsCategoryMapper.getTotalGoodsCategories(pageUtil);
        PageResult pageResult = new PageResult(goodsCategories, total, pageUtil.getLimit(), pageUtil.getPage());
        return pageResult;
    }

    @Override
    public List<GoodsCategory> selectByLevelAndParentIdsAndNumber(List<Long> parentIds, int categoryLevel) {
        return goodsCategoryMapper.selectByLevelAndParentIdsAndNumber(parentIds, categoryLevel, 0);//0代表查询所有
    }
}
```

#### 分类管理模块控制层代码实现

在 ltd.newbee.mall.api.admin 包中新建 NewBeeAdminGoodsCategoryAPI 类，NewBeeAdminGoodsCategoryAPI 控制器中新增上述接口的实现代码，最终 NewBeeAdminGoodsCategoryAPI 类的代码如下：

```java
package ltd.newbee.mall.api.admin;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import ltd.newbee.mall.api.admin.param.BatchIdParam;
import ltd.newbee.mall.api.admin.param.GoodsCategoryAddParam;
import ltd.newbee.mall.api.admin.param.GoodsCategoryEditParam;
import ltd.newbee.mall.common.NewBeeMallCategoryLevelEnum;
import ltd.newbee.mall.common.ServiceResultEnum;
import ltd.newbee.mall.config.annotation.TokenToAdminUser;
import ltd.newbee.mall.entity.AdminUserToken;
import ltd.newbee.mall.entity.GoodsCategory;
import ltd.newbee.mall.service.NewBeeMallCategoryService;
import ltd.newbee.mall.util.BeanUtil;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.Result;
import ltd.newbee.mall.util.ResultGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.*;

/**
 * @author 13
 * @qq交流群 796794009
 * @email 2449207463@qq.com
 * @link https://github.com/newbee-ltd
 */
@RestController
@Api(value = "v1", tags = "8-2.后台管理系统分类模块接口")
@RequestMapping("/manage-api/v1")
public class NewBeeAdminGoodsCategoryAPI {

    private static final Logger logger = LoggerFactory.getLogger(NewBeeAdminGoodsCategoryAPI.class);

    @Resource
    private NewBeeMallCategoryService newBeeMallCategoryService;

    /**
     * 列表
     */
    @RequestMapping(value = "/categories", method = RequestMethod.GET)
    @ApiOperation(value = "商品分类列表", notes = "根据级别和上级分类id查询")
    public Result list(@RequestParam(required = false) @ApiParam(value = "页码") Integer pageNumber,
                       @RequestParam(required = false) @ApiParam(value = "每页条数") Integer pageSize,
                       @RequestParam(required = false) @ApiParam(value = "分类级别") Integer categoryLevel,
                       @RequestParam(required = false) @ApiParam(value = "上级分类的id") Long parentId, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (pageNumber == null || pageNumber < 1 || pageSize == null || pageSize < 10 || categoryLevel == null || categoryLevel < 0 || categoryLevel > 3 || parentId == null || parentId < 0) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        Map params = new HashMap(8);
        params.put("page", pageNumber);
        params.put("limit", pageSize);
        params.put("categoryLevel", categoryLevel);
        params.put("parentId", parentId);
        PageQueryUtil pageUtil = new PageQueryUtil(params);
        return ResultGenerator.genSuccessResult(newBeeMallCategoryService.getCategorisPage(pageUtil));
    }

    /**
     * 列表
     */
    @RequestMapping(value = "/categories4Select", method = RequestMethod.GET)
    @ApiOperation(value = "商品分类列表", notes = "用于三级分类联动效果制作")
    public Result listForSelect(@RequestParam("categoryId") Long categoryId, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (categoryId == null || categoryId < 1) {
            return ResultGenerator.genFailResult("缺少参数！");
        }
        GoodsCategory category = newBeeMallCategoryService.getGoodsCategoryById(categoryId);
        //既不是一级分类也不是二级分类则为不返回数据
        if (category == null || category.getCategoryLevel() == NewBeeMallCategoryLevelEnum.LEVEL_THREE.getLevel()) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        Map categoryResult = new HashMap(4);
        if (category.getCategoryLevel() == NewBeeMallCategoryLevelEnum.LEVEL_ONE.getLevel()) {
            //如果是一级分类则返回当前一级分类下的所有二级分类，以及二级分类列表中第一条数据下的所有三级分类列表
            //查询一级分类列表中第一个实体的所有二级分类
            List<GoodsCategory> secondLevelCategories = newBeeMallCategoryService.selectByLevelAndParentIdsAndNumber(Collections.singletonList(categoryId), NewBeeMallCategoryLevelEnum.LEVEL_TWO.getLevel());
            if (!CollectionUtils.isEmpty(secondLevelCategories)) {
                //查询二级分类列表中第一个实体的所有三级分类
                List<GoodsCategory> thirdLevelCategories = newBeeMallCategoryService.selectByLevelAndParentIdsAndNumber(Collections.singletonList(secondLevelCategories.get(0).getCategoryId()), NewBeeMallCategoryLevelEnum.LEVEL_THREE.getLevel());
                categoryResult.put("secondLevelCategories", secondLevelCategories);
                categoryResult.put("thirdLevelCategories", thirdLevelCategories);
            }
        }
        if (category.getCategoryLevel() == NewBeeMallCategoryLevelEnum.LEVEL_TWO.getLevel()) {
            //如果是二级分类则返回当前分类下的所有三级分类列表
            List<GoodsCategory> thirdLevelCategories = newBeeMallCategoryService.selectByLevelAndParentIdsAndNumber(Collections.singletonList(categoryId), NewBeeMallCategoryLevelEnum.LEVEL_THREE.getLevel());
            categoryResult.put("thirdLevelCategories", thirdLevelCategories);
        }
        return ResultGenerator.genSuccessResult(categoryResult);
    }

    /**
     * 添加
     */
    @RequestMapping(value = "/categories", method = RequestMethod.POST)
    @ApiOperation(value = "新增分类", notes = "新增分类")
    public Result save(@RequestBody @Valid GoodsCategoryAddParam goodsCategoryAddParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        GoodsCategory goodsCategory = new GoodsCategory();
        BeanUtil.copyProperties(goodsCategoryAddParam, goodsCategory);
        String result = newBeeMallCategoryService.saveCategory(goodsCategory);
        if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult(result);
        }
    }


    /**
     * 修改
     */
    @RequestMapping(value = "/categories", method = RequestMethod.PUT)
    @ApiOperation(value = "修改分类信息", notes = "修改分类信息")
    public Result update(@RequestBody @Valid GoodsCategoryEditParam goodsCategoryEditParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        GoodsCategory goodsCategory = new GoodsCategory();
        BeanUtil.copyProperties(goodsCategoryEditParam, goodsCategory);
        String result = newBeeMallCategoryService.updateGoodsCategory(goodsCategory);
        if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult(result);
        }
    }

    /**
     * 详情
     */
    @RequestMapping(value = "/categories/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "获取单条分类信息", notes = "根据id查询")
    public Result info(@PathVariable("id") Long id, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        GoodsCategory goodsCategory = newBeeMallCategoryService.getGoodsCategoryById(id);
        if (goodsCategory == null) {
            return ResultGenerator.genFailResult("未查询到数据");
        }
        return ResultGenerator.genSuccessResult(goodsCategory);
    }

    /**
     * 分类删除
     */
    @RequestMapping(value = "/categories", method = RequestMethod.DELETE)
    @ApiOperation(value = "批量删除分类信息", notes = "批量删除分类信息")
    public Result delete(@RequestBody BatchIdParam batchIdParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (batchIdParam == null || batchIdParam.getIds().length < 1) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        if (newBeeMallCategoryService.deleteBatch(batchIdParam.getIds())) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult("删除失败");
        }
    }
}
```

1.列表接口负责接收前端传来的分页参数，如 page 、limit 等参数，由于分类层级的设计，在获取分类列表时会分别获取对应层级的商品类目数据，所以在传参时需要将类目的层级 categoryLevel 和父级类目的 id 也带上，之后将数据总数和对应页面的数据列表查询出来并封装为分页数据返回给前端。

2.添加接口负责接收前端的 POST 请求并处理其中的参数，接收的参数分别为：

- 类目级别：  categoryLevel 字段
- 类目的父级 id ：parentId 字段
- 类目名称：categoryName 字段
- 排序值：categoryRank 字段

在这个方法里笔者使用 @RequestBody 注解将其转换为 GoodsCategoryAddParam 对象参数。代码实现中，首先会对参数进行校验，之后交给业务层代码进行数据封装并进行数据库 insert 操作，在业务层代码中也有一层逻辑验证，如果已经存在同级且同名的分类数据就不再继续添加。

3.修改接口与添加接口类似，只是接受的参数多了一个，接收的参数分别为：

- 类目 id：  categoryId 字段
- 类目级别：  categoryLevel 字段
- 类目的父级 id ：parentId 字段
- 类目名称：categoryName 字段
- 排序值：categoryRank 字段

在这个方法里依然使用 @RequestBody 注解将其转换为 GoodsCategoryEditParam 对象参数，这样处理传参比较方便，也不用自己手动去封装对象，@RequestBody 给开发提供了不少的便利 。商品类目修改接口中，依然会对传递过来的 5 个参数进行基本的校验，之后交给业务层代码处理，这里需要进行两个判断：

- 根据 id 查询数据库中是否有该记录，如果没有查询到则表示前端传递过来的数据有问题，返回错误信息。
- 查询是否有同名的类目，如果有则返回错误信息。

校验之后进行数据封装并进行数据库 update 操作，修改商品类目的 SQL 语句也在 GoodsCategoryMapper.xml 文件中，是标准的 update 修改语句，执行成功后可以查看数据库中当前记录是否如预期的一样被成功修改。

4.删除接口负责接收前端的商品分类删除请求，处理前端传输过来的数据后，将管理员选择的需要删除的商品类目记录从数据库中删除，这里的“删除”功能也是逻辑删除。该接口的参数是一个数组，可以同时删除多条商品类目记录，只需要在前端将用户选择的商品类目记录 id 封装好再传参到后端即可，接口的请求路径为 /manage-api/v1/categories，请求方法为 DELETE，并使用 @RequestBody 将前端传过来的参数封装为数组对象，如果数组为空则直接返回异常提醒，参数验证通过后则调用 deleteBatch() 批量删除方法进行数据库操作，否则将向前端返回错误信息，执行的 SQL 语句为 update 语句，将对应记录的 is_deleted 字段值设置为 1 即表示已经删除。

## 商品分类模块接口测试

最后，我们通过 Swagger 页面来测试一下这些接口。

重启项目，打开 swagger-ui 页面：

![image-20210415174825138](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6940db44f4c048f2bf5c4ff1200036aa~tplv-k3u1fbpfcp-zoom-1.image)

由于这些接口都需要登录后才能访问，首先我们访问登录接口，拿到一个可以正常进行身份认证的 token 字符串，如下图所示：

![image-20210407170852871](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef8ef147d259469a8f75f652292864bc~tplv-k3u1fbpfcp-zoom-1.image)

最终获取到一个 token 字符串，值为“ce01a7e885e55a38fdfd09c902c551a3”。

1.列表接口

点开“商品分类列表”，在 token 输入框中填入登录接口返回的 token 值并输入分页所需的 pageNumber 、 pageSize 、categoryLevel 参数，之后点击”Execute“按钮，即可得到商品分类列表数据，如下图所示：

![image-20210415174700129](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87c50af59fcd4a63a47ba696ec223c8a~tplv-k3u1fbpfcp-zoom-1.image)

大家可以在数据库表中新增一些商品分类数据，或者调整 pageSize 参数来更好的测试分页列表接口。

2.新增接口：

点开“新增分类”，在 token 输入框中填入登录接口返回的 token 值并输入新增商品分类接口中的必填参数，分别输入商品分类级别、分类名称、父类 id 和排序值，最后点击”Execute“按钮，得到如下返回结果：

![image-20210415175834529](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0282e27b7eb54df7b3a9f760baa57bd1~tplv-k3u1fbpfcp-zoom-1.image)

添加成功后可以看到列表中多了一条数据。

以上是正常情况，如果 token 不正确或者请求的参数不规范也会得到对应的错误提示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6637a19f6e964c7e8f9239ba821f1d53~tplv-k3u1fbpfcp-zoom-1.image)

“商品分类修改接口”与“商品分类新增接口”测试步骤类似，这里就省略了，大家可以自行测试。

3.详情接口：

点开“获取单条分类信息”，在 token 输入框中填入登录接口返回的 token 值和商品分类的 id，之后点击”Execute“按钮，即可得到商品分类详情数据，如下图所示：

![image-20210415180250747](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2ae0cd1b5f6410c9fc46f1a87a5beb3~tplv-k3u1fbpfcp-zoom-1.image)

而如果传入的 id 未查询到数据，会得到如下返回结果：

![image-20210413111404393](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6323cfa032148bb8e74389c09f9812c~tplv-k3u1fbpfcp-zoom-1.image)

4.删除接口：

最后是删除接口的测试，点开“批量删除分类信息”，在 token 输入框中填入登录接口返回的 token 值和需要删除的商品分类 id 数组，比如这里我想要删除 id 是 122 和 123 的两条数据，之后点击”Execute“按钮，即可完成删除步骤，如下图所示：

![image-20210415180428705](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3977868a2b014339ba18d09256b7eb98~tplv-k3u1fbpfcp-zoom-1.image)

> 注意数组中的逗号为英文逗号，如果不小心输入了中文符号会报错的。

如果此时再去查询这两条数据，无论是列表接口还是详情接口都不存在 id 122 和 123 的商品分类数据，功能测试完成。

读者们可以按照文中的思路和过程自行测试，商品分类管理模块开发完成！