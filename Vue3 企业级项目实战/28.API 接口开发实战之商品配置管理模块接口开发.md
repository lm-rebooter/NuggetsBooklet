```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1FFWQCu2qKVFiOAdKa-dysg 
提取码: u7fh
```

## 商城首页推荐商品模块介绍

商城首页中还有三个版块需要渲染数据，分别是：

- **热销商品**
- **新品上线**
- **推荐商品**

在商城首页中的展示版面如下图所示：

![截图 2021-04-25 17.20.50](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71ffe3d6375a4eef9233320e9ae9e218~tplv-k3u1fbpfcp-zoom-1.image)

在商城首页中设计这三个版块，主要是为了丰富版面，使得页面不是那么单调。

当然，这部分的设计也参考了当前主流线上商城的商品推荐设计，不过这些线上商城都有大量的正式数据做支撑，做的肯定要比新蜂商城复杂的多。比如热销商品，一定是在大量实际订单的统计下做出来的数据渲染，又比如商品推荐，也一定是在用户的浏览痕迹和下单习惯上计算出来的。目前来说，新蜂商城的开发人员只有笔者一个人，订单也只有模拟数据，如果要做到淘宝、京东那种效果是不现实的，因此新蜂商城中的热销商品、新品上线、推荐商品这三个版块中的数据是在后台中配置的，首页渲染前直接读取数据就可以，这些数据并没有进行实时的数据统计。

> 注意：这三个模块也可以使用真实数据来实现，比如新品上线中的数据可以读取最新添加的几条商品数据，热销商品中的数据可以读取下单量最高的几条商品，这也是一种实现思路。

新蜂商城中这三个版块中的内容是在后台进行配置的，页面显示效果如下：

![image-20210424171752928](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a0c2b56e71545f9a6d921e3764e5ace~tplv-k3u1fbpfcp-zoom-1.image)

**接下来会介绍这种方式的实现，主要是后台管理系统中，首页配置管理模块的接口开发。**

## 首页配置管理模块接口设计及实现

#### 首页配置表结构设计

通过商城首页中的展示内容可以得出几个主要的字段，首先是配置项的类别，其次是配置项中的商品属性，这里笔者设计了一个商品 id 字段，以此来建立配置项与商品的关系，在实现查询功能时，就可以先查出配置项的数据，之后根据配置项中的商品 id 字段去查找对应的商品，其它则是一些基础的功能字段，表结构如下：

```sql
USE `newbee_mall_db_v2`;

DROP TABLE IF EXISTS `tb_newbee_mall_index_config`;
CREATE TABLE `tb_newbee_mall_index_config`  (
  `config_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '首页配置项主键id',
  `config_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '显示字符(配置搜索时不可为空，其他可为空)',
  `config_type` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1-搜索框热搜 2-搜索下拉框热搜 3-(首页)热销商品 4-(首页)新品上线 5-(首页)为你推荐',
  `goods_id` bigint(20) NOT NULL DEFAULT 0 COMMENT '商品id 默认为0',
  `redirect_url` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '##' COMMENT '点击后的跳转地址(默认不跳转)',
  `config_rank` int(11) NOT NULL DEFAULT 0 COMMENT '排序值(字段越大越靠前)',
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0 COMMENT '删除标识字段(0-未删除 1-已删除)',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user` int(11) NOT NULL DEFAULT 0 COMMENT '创建者id',
  `update_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最新修改时间',
  `update_user` int(11) NULL DEFAULT 0 COMMENT '修改者id',
  PRIMARY KEY (`config_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
```

每个字段对应的含义都在上面的 SQL 中有介绍，读者们可以对照 SQL 进行理解，正确的把建表 SQL 导入到数据库中即可，接下来进行编码工作。

#### 新建首页配置实体类和 Mapper 接口

首先在 ltd.newbee.mall.entity 包中创建首页配置实体类，选中 entity 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“IndexConfig”，最后在 IndexConfig 类中新增如下代码：

```java
package ltd.newbee.mall.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class IndexConfig {
    private Long configId;

    private String configName;

    private Byte configType;

    private Long goodsId;

    private String redirectUrl;

    private Integer configRank;

    private Byte isDeleted;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    private Integer createUser;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;

    private Integer updateUser;
}
```

在 ltd.newbee.mall.dao 包中新建首页配置实体的 Mapper 接口，选中 dao 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“IndexConfigMapper”，并选中“Interface”选项，之后在 IndexConfigMapper.java 文件中新增如下代码：

```java
package ltd.newbee.mall.dao;

import ltd.newbee.mall.entity.IndexConfig;
import ltd.newbee.mall.util.PageQueryUtil;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface IndexConfigMapper {

    /**
     * 删除一条记录
     * @param configId
     * @return
     */
    int deleteByPrimaryKey(Long configId);

    /**
     * 保存一条新记录
     * @param record
     * @return
     */
    int insert(IndexConfig record);

    /**
     * 保存一条新记录
     * @param record
     * @return
     */
    int insertSelective(IndexConfig record);

    /**
     * 根据主键查询记录
     * @param configId
     * @return
     */
    IndexConfig selectByPrimaryKey(Long configId);

    /**
     * 修改记录
     * @param record
     * @return
     */
    int updateByPrimaryKeySelective(IndexConfig record);

    /**
     * 修改记录
     * @param record
     * @return
     */
    int updateByPrimaryKey(IndexConfig record);

    /**
     * 查询分页数据
     * @param pageUtil
     * @return
     */
    List<IndexConfig> findIndexConfigList(PageQueryUtil pageUtil);

    /**
     * 查询总数
     * @param pageUtil
     * @return
     */
    int getTotalIndexConfigs(PageQueryUtil pageUtil);

    /**
     * 批量删除
     * @param ids
     * @return
     */
    int deleteBatch(Long[] ids);
}
```

定义了对于首页配置实体操作的数据层方法，包括查询、新增、修改和删除等操作。

#### 创建 IndexConfigMapper 接口的映射文件

在 resources/mapper 目录下新建 IndexConfigMapper 接口的映射文件 IndexConfigMapper.xml，之后进行映射文件的编写。

1.首先，定义映射文件与 Mapper 接口的对应关系，比如该示例中，需要将 IndexConfigMapper.xml 文件与对应的 IndexConfigMapper 接口之间的关系定义出来：

```xml
<mapper namespace="ltd.newbee.mall.dao.IndexConfigMapper">
```

2.之后，配置表结构和实体类的对应关系：

```xml
<resultMap id="BaseResultMap" type="ltd.newbee.mall.entity.IndexConfig">
  <id column="config_id" jdbcType="BIGINT" property="configId"/>
  <result column="config_name" jdbcType="VARCHAR" property="configName"/>
  <result column="config_type" jdbcType="TINYINT" property="configType"/>
  <result column="goods_id" jdbcType="BIGINT" property="goodsId"/>
  <result column="redirect_url" jdbcType="VARCHAR" property="redirectUrl"/>
  <result column="config_rank" jdbcType="INTEGER" property="configRank"/>
  <result column="is_deleted" jdbcType="TINYINT" property="isDeleted"/>
  <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
  <result column="create_user" jdbcType="INTEGER" property="createUser"/>
  <result column="update_time" jdbcType="TIMESTAMP" property="updateTime"/>
  <result column="update_user" jdbcType="INTEGER" property="updateUser"/>
</resultMap>
```

3.最后，按照对应的接口方法，编写具体的 SQL 语句，最终的 IndexConfigMapper.xml 文件如下：

```xml
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="ltd.newbee.mall.dao.IndexConfigMapper">
    <resultMap id="BaseResultMap" type="ltd.newbee.mall.entity.IndexConfig">
        <id column="config_id" jdbcType="BIGINT" property="configId"/>
        <result column="config_name" jdbcType="VARCHAR" property="configName"/>
        <result column="config_type" jdbcType="TINYINT" property="configType"/>
        <result column="goods_id" jdbcType="BIGINT" property="goodsId"/>
        <result column="redirect_url" jdbcType="VARCHAR" property="redirectUrl"/>
        <result column="config_rank" jdbcType="INTEGER" property="configRank"/>
        <result column="is_deleted" jdbcType="TINYINT" property="isDeleted"/>
        <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
        <result column="create_user" jdbcType="INTEGER" property="createUser"/>
        <result column="update_time" jdbcType="TIMESTAMP" property="updateTime"/>
        <result column="update_user" jdbcType="INTEGER" property="updateUser"/>
    </resultMap>
    <sql id="Base_Column_List">
    config_id, config_name, config_type, goods_id, redirect_url, config_rank, is_deleted, 
    create_time, create_user, update_time, update_user
  </sql>

    <select id="findIndexConfigList" parameterType="Map" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_index_config
        <where>
            <if test="configType!=null and configType!=''">
                and config_type = #{configType}
            </if>
            and is_deleted = 0
        </where>
        order by config_rank desc
        <if test="start!=null and limit!=null">
            limit #{start},#{limit}
        </if>
    </select>
    <select id="getTotalIndexConfigs" parameterType="Map" resultType="int">
        select count(*) from tb_newbee_mall_index_config
        <where>
            <if test="configType!=null and configType!=''">
                and config_type = #{configType}
            </if>
            and is_deleted = 0
        </where>
    </select>

    <select id="selectByPrimaryKey" parameterType="java.lang.Long" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_index_config
        where config_id = #{configId,jdbcType=BIGINT} and is_deleted=0
    </select>
    <update id="deleteByPrimaryKey" parameterType="java.lang.Long">
    update tb_newbee_mall_index_config set is_deleted=1
    where config_id = #{configId,jdbcType=BIGINT} and is_deleted=0
  </update>
    <update id="deleteBatch">
        update tb_newbee_mall_index_config
        set is_deleted=1,update_time=now() where is_deleted=0 and config_id in
        <foreach item="id" collection="array" open="(" separator="," close=")">
            #{id}
        </foreach>
    </update>
    <insert id="insert" parameterType="ltd.newbee.mall.entity.IndexConfig">
    insert into tb_newbee_mall_index_config (config_id, config_name, config_type, 
      goods_id, redirect_url, config_rank, 
      is_deleted, create_time, create_user, 
      update_time, update_user)
    values (#{configId,jdbcType=BIGINT}, #{configName,jdbcType=VARCHAR}, #{configType,jdbcType=TINYINT}, 
      #{goodsId,jdbcType=BIGINT}, #{redirectUrl,jdbcType=VARCHAR}, #{configRank,jdbcType=INTEGER}, 
      #{isDeleted,jdbcType=TINYINT}, #{createTime,jdbcType=TIMESTAMP}, #{createUser,jdbcType=INTEGER}, 
      #{updateTime,jdbcType=TIMESTAMP}, #{updateUser,jdbcType=INTEGER})
  </insert>
    <insert id="insertSelective" parameterType="ltd.newbee.mall.entity.IndexConfig">
        insert into tb_newbee_mall_index_config
        <trim prefix="(" suffix=")" suffixOverrides=",">
            <if test="configId != null">
                config_id,
            </if>
            <if test="configName != null">
                config_name,
            </if>
            <if test="configType != null">
                config_type,
            </if>
            <if test="goodsId != null">
                goods_id,
            </if>
            <if test="redirectUrl != null">
                redirect_url,
            </if>
            <if test="configRank != null">
                config_rank,
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
            <if test="configId != null">
                #{configId,jdbcType=BIGINT},
            </if>
            <if test="configName != null">
                #{configName,jdbcType=VARCHAR},
            </if>
            <if test="configType != null">
                #{configType,jdbcType=TINYINT},
            </if>
            <if test="goodsId != null">
                #{goodsId,jdbcType=BIGINT},
            </if>
            <if test="redirectUrl != null">
                #{redirectUrl,jdbcType=VARCHAR},
            </if>
            <if test="configRank != null">
                #{configRank,jdbcType=INTEGER},
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
    <update id="updateByPrimaryKeySelective" parameterType="ltd.newbee.mall.entity.IndexConfig">
        update tb_newbee_mall_index_config
        <set>
            <if test="configName != null">
                config_name = #{configName,jdbcType=VARCHAR},
            </if>
            <if test="configType != null">
                config_type = #{configType,jdbcType=TINYINT},
            </if>
            <if test="goodsId != null">
                goods_id = #{goodsId,jdbcType=BIGINT},
            </if>
            <if test="redirectUrl != null">
                redirect_url = #{redirectUrl,jdbcType=VARCHAR},
            </if>
            <if test="configRank != null">
                config_rank = #{configRank,jdbcType=INTEGER},
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
        where config_id = #{configId,jdbcType=BIGINT}
    </update>
    <update id="updateByPrimaryKey" parameterType="ltd.newbee.mall.entity.IndexConfig">
    update tb_newbee_mall_index_config
    set config_name = #{configName,jdbcType=VARCHAR},
      config_type = #{configType,jdbcType=TINYINT},
      goods_id = #{goodsId,jdbcType=BIGINT},
      redirect_url = #{redirectUrl,jdbcType=VARCHAR},
      config_rank = #{configRank,jdbcType=INTEGER},
      is_deleted = #{isDeleted,jdbcType=TINYINT},
      create_time = #{createTime,jdbcType=TIMESTAMP},
      create_user = #{createUser,jdbcType=INTEGER},
      update_time = #{updateTime,jdbcType=TIMESTAMP},
      update_user = #{updateUser,jdbcType=INTEGER}
    where config_id = #{configId,jdbcType=BIGINT}
  </update>
</mapper>
```

#### 业务层代码实现

在 ltd.newbee.mall.service 包中新建业务处理类，选中 service 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallIndexConfigService”，并选中“Interface”选项。

最后在 NewBeeMallIndexConfigService.java 文件中新增如下代码：

```java
package ltd.newbee.mall.service;

import ltd.newbee.mall.controller.vo.NewBeeMallIndexConfigGoodsVO;
import ltd.newbee.mall.entity.IndexConfig;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.PageResult;

import java.util.List;

public interface NewBeeMallIndexConfigService {
    
    /**
     * 查询后台管理系统首页配置分页数据
     *
     * @param pageUtil
     * @return
     */
    PageResult getConfigsPage(PageQueryUtil pageUtil);

    /**
     * 新增一条首页配置记录
     *
     * @param indexConfig
     * @return
     */
    String saveIndexConfig(IndexConfig indexConfig);

    /**
     * 修改一条首页配置记录
     *
     * @param indexConfig
     * @return
     */
    String updateIndexConfig(IndexConfig indexConfig);

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    Boolean deleteBatch(Long[] ids);

    /**
     * 根据id查询详情
     *
     * @param id
     * @return
     */
    IndexConfig getIndexConfigById(Long id);
}
```

首页配置模块的业务层方法定义以及每个方法的作用都已经编写完成。

然后在 ltd.newbee.mall.service.impl 包中新建 NewBeeMallIndexConfigService 的实现类，选中 impl 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallIndexConfigServiceImpl”，最后在 NewBeeMallIndexConfigServiceImpl 类中新增如下代码：

```java
package ltd.newbee.mall.service.impl;

import ltd.newbee.mall.common.ServiceResultEnum;
import ltd.newbee.mall.dao.IndexConfigMapper;
import ltd.newbee.mall.entity.IndexConfig;
import ltd.newbee.mall.service.NewBeeMallIndexConfigService;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewBeeMallIndexConfigServiceImpl implements NewBeeMallIndexConfigService {

    @Autowired
    private IndexConfigMapper indexConfigMapper;

    @Override
    public PageResult getConfigsPage(PageQueryUtil pageUtil) {
        List<IndexConfig> indexConfigs = indexConfigMapper.findIndexConfigList(pageUtil);
        int total = indexConfigMapper.getTotalIndexConfigs(pageUtil);
        PageResult pageResult = new PageResult(indexConfigs, total, pageUtil.getLimit(), pageUtil.getPage());
        return pageResult;
    }

    @Override
    public String saveIndexConfig(IndexConfig indexConfig) {
        if (indexConfigMapper.insertSelective(indexConfig) > 0) {
            return ServiceResultEnum.SUCCESS.getResult();
        }
        return ServiceResultEnum.DB_ERROR.getResult();
    }

    @Override
    public String updateIndexConfig(IndexConfig indexConfig) {
        IndexConfig temp = indexConfigMapper.selectByPrimaryKey(indexConfig.getConfigId());
        if (temp == null) {
            return ServiceResultEnum.DATA_NOT_EXIST.getResult();
        }
        if (indexConfigMapper.updateByPrimaryKeySelective(indexConfig) > 0) {
            return ServiceResultEnum.SUCCESS.getResult();
        }
        return ServiceResultEnum.DB_ERROR.getResult();
    }

    @Override
    public IndexConfig getIndexConfigById(Long id) {
        return indexConfigMapper.selectByPrimaryKey(id);
    }

    @Override
    public Boolean deleteBatch(Long[] ids) {
        if (ids.length < 1) {
            return false;
        }
        //删除数据
        return indexConfigMapper.deleteBatch(ids) > 0;
    }
}
```

#### 首页管理模块控制层代码实现

在 ltd.newbee.mall.api.admin 包中新建 NewBeeAdminIndexConfigAPI 类，在 NewBeeAdminIndexConfigAPI 控制器中新增相关接口的实现代码，最终 NewBeeAdminIndexConfigAPI 类的代码如下：

```java
package ltd.newbee.mall.api.admin;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import ltd.newbee.mall.api.admin.param.BatchIdParam;
import ltd.newbee.mall.api.admin.param.IndexConfigAddParam;
import ltd.newbee.mall.api.admin.param.IndexConfigEditParam;
import ltd.newbee.mall.common.IndexConfigTypeEnum;
import ltd.newbee.mall.common.ServiceResultEnum;
import ltd.newbee.mall.config.annotation.TokenToAdminUser;
import ltd.newbee.mall.entity.AdminUserToken;
import ltd.newbee.mall.entity.IndexConfig;
import ltd.newbee.mall.service.NewBeeMallIndexConfigService;
import ltd.newbee.mall.util.BeanUtil;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.Result;
import ltd.newbee.mall.util.ResultGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * @author 13
 * @qq交流群 796794009
 * @email 2449207463@qq.com
 * @link https://github.com/newbee-ltd
 */
@RestController
@Api(value = "v1", tags = "8-4.后台管理系统首页配置模块接口")
@RequestMapping("/manage-api/v1")
public class NewBeeAdminIndexConfigAPI {

    private static final Logger logger = LoggerFactory.getLogger(NewBeeAdminIndexConfigAPI.class);

    @Resource
    private NewBeeMallIndexConfigService newBeeMallIndexConfigService;

    /**
     * 列表
     */
    @RequestMapping(value = "/indexConfigs", method = RequestMethod.GET)
    @ApiOperation(value = "首页配置列表", notes = "首页配置列表")
    public Result list(@RequestParam(required = false) @ApiParam(value = "页码") Integer pageNumber,
                       @RequestParam(required = false) @ApiParam(value = "每页条数") Integer pageSize,
                       @RequestParam(required = false) @ApiParam(value = "1-搜索框热搜 2-搜索下拉框热搜 3-(首页)热销商品 4-(首页)新品上线 5-(首页)为你推荐") Integer configType, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (pageNumber == null || pageNumber < 1 || pageSize == null || pageSize < 10) {
            return ResultGenerator.genFailResult("分页参数异常！");
        }
        IndexConfigTypeEnum indexConfigTypeEnum = IndexConfigTypeEnum.getIndexConfigTypeEnumByType(configType);
        if (indexConfigTypeEnum.equals(IndexConfigTypeEnum.DEFAULT)) {
            return ResultGenerator.genFailResult("非法参数！");
        }
        Map params = new HashMap(8);
        params.put("page", pageNumber);
        params.put("limit", pageSize);
        params.put("configType", configType);
        PageQueryUtil pageUtil = new PageQueryUtil(params);
        return ResultGenerator.genSuccessResult(newBeeMallIndexConfigService.getConfigsPage(pageUtil));
    }

    /**
     * 添加
     */
    @RequestMapping(value = "/indexConfigs", method = RequestMethod.POST)
    @ApiOperation(value = "新增首页配置项", notes = "新增首页配置项")
    public Result save(@RequestBody @Valid IndexConfigAddParam indexConfigAddParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        IndexConfig indexConfig = new IndexConfig();
        BeanUtil.copyProperties(indexConfigAddParam, indexConfig);
        String result = newBeeMallIndexConfigService.saveIndexConfig(indexConfig);
        if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult(result);
        }
    }


    /**
     * 修改
     */
    @RequestMapping(value = "/indexConfigs", method = RequestMethod.PUT)
    @ApiOperation(value = "修改首页配置项", notes = "修改首页配置项")
    public Result update(@RequestBody @Valid IndexConfigEditParam indexConfigEditParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        IndexConfig indexConfig = new IndexConfig();
        BeanUtil.copyProperties(indexConfigEditParam, indexConfig);
        String result = newBeeMallIndexConfigService.updateIndexConfig(indexConfig);
        if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult(result);
        }
    }

    /**
     * 详情
     */
    @RequestMapping(value = "/indexConfigs/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "获取单条首页配置项信息", notes = "根据id查询")
    public Result info(@PathVariable("id") Long id, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        IndexConfig config = newBeeMallIndexConfigService.getIndexConfigById(id);
        if (config == null) {
            return ResultGenerator.genFailResult("未查询到数据");
        }
        return ResultGenerator.genSuccessResult(config);
    }

    /**
     * 删除
     */
    @RequestMapping(value = "/indexConfigs", method = RequestMethod.DELETE)
    @ApiOperation(value = "批量首页配置项信息", notes = "批量首页配置项信息")
    public Result delete(@RequestBody BatchIdParam batchIdParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (batchIdParam == null || batchIdParam.getIds().length < 1) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        if (newBeeMallIndexConfigService.deleteBatch(batchIdParam.getIds())) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult("删除失败");
        }
    }

}
```

1.列表接口负责接收前端传来的分页参数，如 pageNumber、pageSize 等参数，另外一个重要的参数就是 configType，通过这个参数就能够区分不同类型的首页配置项，之后将数据总数和对应页面的数据列表查询出来并封装为分页数据返回给前端。实际的查询 SQL 语句在 IndexConfigMapper.xml 文件中，除了分页参数的过滤外，也针对 config_type 字段进行了过滤，前端请求的 configType 参数不同，执行的 SQL 也会去对应的查询该类型的分页记录，获取响应条数的记录和总数之后再进行数据封装，这个接口就是根据前端传的分页参数进行查询并返回分页数据以供前端页面进行数据渲染。

2.添加接口负责接收前端的 POST 请求并处理其中的参数，接收的参数为 configName 字段、configType字段和 redirectUrl 字段、goodsId 字段和 configRank 字段，在这个方法里使用 @RequestBody 注解将其转换为 IndexConfigAddParam 参数对象，并使用 @Valid 注解标注以便对参数进行基本的验证。需要注意的一点是，在这个方法中并不会存储和设置任何关于商品表的其他字段，也不会对商品表进行操作，只是设置了 goods_id 字段将配置项和对应的商品记录之间的关联关系存储下来。

3.删除接口负责接收前端的配置项删除请求，处理前端传输过来的数据后，将这些记录从数据库中删除，这里的“删除”功能并不是真正意义上的删除，而是逻辑删除。将接收的参数设置为一个数组，可以同时删除多条记录，只需要在前端将用户选择的记录 id 封装好再传参到后端即可，接口的请求路径为 /manage-api/v1/indexConfigs，方法为 DELETE，并使用 @RequestBody 将前端传过来的参数封装为数组对象，如果数组为空则直接返回异常提醒，参数验证通过后则调用 deleteBatch() 批量删除方法进行数据库操作。

## 首页配置管理模块接口测试

最后，我们通过 Swagger 页面来测试一下这些接口。

重启项目，打开 swagger-ui 页面：

![image-20210424155338344](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/036f49d8330d41288b2f2a101f591649~tplv-k3u1fbpfcp-zoom-1.image)

由于这些接口都需要登录后才能访问，首先我们访问登录接口，拿到一个可以正常进行身份认证的 token 字符串，如下图所示：

![image-20210407170852871](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93c67e781b1b45f684eb133bbd37d6bf~tplv-k3u1fbpfcp-zoom-1.image)

最终获取到一个 token 字符串，值为“ce01a7e885e55a38fdfd09c902c551a3”。

1.列表接口

点开“首页配置列表”，在 token 输入框中填入登录接口返回的 token 值并输入分页所需的 pageNumber 、 pageSize 和 configType 参数，这些是必传参数，之后点击”Execute“按钮：

![image-20210424172944530](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5be50018dc4a4b79b146f9d52b0835cd~tplv-k3u1fbpfcp-zoom-1.image)

首页配置列表测试数据如下，如下图所示：

![image-20210424173009386](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4780d9e5196144cd8bb12dc59107e67a~tplv-k3u1fbpfcp-zoom-1.image)

大家可以自行调整查询参数，来更好的测试分页列表接口。

2.新增接口：

点开“新增首页配置项”，在 token 输入框中填入登录接口返回的 token 值并输入新增商品接口中的必填参数，分别输入配置项名称、配置类别、商品 id、排序值字段，最后点击”Execute“按钮，得到如下返回结果：

![image-20210424173242934](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ee9a508c10443d28ac593e41b1d051c~tplv-k3u1fbpfcp-zoom-1.image)

添加成功后可以看到列表中多了一条数据。

以上是正常情况，如果 token 不正确或者请求的参数不规范也会得到对应的错误提示：

![image-20210424173318497](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa47548271f8431f9d1b7cae71643c17~tplv-k3u1fbpfcp-zoom-1.image)

“首页配置项修改接口”与“新增首页配置项接口”测试步骤类似，这里就省略了，大家可以自行测试。

3.详情接口：

点开“获取单条首页配置项信息”，在 token 输入框中填入登录接口返回的 token 值和配置项的 id，之后点击”Execute“按钮，即可得到配置项的详情数据，如下图所示：

![image-20210424173447138](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4167e89843fc4616a57cf927068e6da8~tplv-k3u1fbpfcp-zoom-1.image)

而如果传入的 id 未查询到数据，会得到如下返回结果：

![image-20210424173518763](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0aeff30b0e548059f1176a0c0349428~tplv-k3u1fbpfcp-zoom-1.image)

4.删除接口：

最后是删除接口的测试，点开“批量删除首页配置项信息”，在 token 输入框中填入登录接口返回的 token 值和需要删除的配置项 id 数组，比如这里我想要删除 id 是 39 和 40 的两条数据，之后点击”Execute“按钮，即可完成删除步骤，如下图所示：

![image-20210424173658710](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcdd00cdc2564d279890eaae2b038756~tplv-k3u1fbpfcp-zoom-1.image)

> 注意数组中的逗号为英文逗号，如果不小心输入了中文符号会报错的。

如果此时再去查询这两条数据，无论是列表接口还是详情接口都不存在 id 为 39 和 40 的配置项数据，功能测试完成。

读者们可以按照文中的思路和过程自行测试，首页配置项管理模块的接口开发完成！