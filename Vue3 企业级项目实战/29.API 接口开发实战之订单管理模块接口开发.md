```tip
本篇文章中所涉及的源码已经整理好并上传到百度云，地址和提取密码如下：
链接: https://pan.baidu.com/s/1boO5BbMUJmdSl41s_wzvSQ 
提取码: g2r3
```

vue3-admin 是一个 Vue3 + element plus 等技术栈开发的后台管理系统，而其中的业务则是与新蜂商城相关的，这个章节我们来介绍一下订单管理模块的接口实现。

## 新蜂商城订单处理流程

新蜂商城中订单的生成到处理结束，主要有以下几个阶段：

1. 提交订单
2. 订单入库
3. 支付订单（由新蜂商城用户发起）
4. 订单流程处理（包括确认订单、取消订单、修改订单信息等操作，新蜂商城用户和管理员都可以对支付成功后的订单进行处理）

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdc81dd592394876b755a62f71e01b6a~tplv-k3u1fbpfcp-zoom-1.image)

订单模块是整个电商系统的重中之重，甚至可以说它就是电商系统的心脏，因为订单往往决定了一个电商系统的生死，而且订单模块贯穿了整个电商系统的大部分流程，各个环节都与它密不可分，从用户点击提交订单成功生成订单开始，后续的整个流程都是围绕着订单模块进行的，包括支付成功到确认收货的正常订单流程，也包括订单取消、订单退款等一系列的异常单流程。

- 正常订单流程如下：

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f4c564758564ff282532fdd1db59616~tplv-k3u1fbpfcp-zoom-1.image)

订单生成后，用户正常进行支付操作 > 商家正常进行订单确认和订单发货操作 > 最后由用户进行最后一个步骤：确认收货，这样整个订单流程就正常走完。

- 异常单流程如下：

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cef625e6e28473cb6a2f58dba796037~tplv-k3u1fbpfcp-zoom-1.image)

订单入库后，用户选择不去支付而是直接取消订单，亦或者用户正常支付但是在后续流程中选择取消订单这个步骤，至此订单就不是正常状态的订单了，因为它的流程并没有如预想的一样，不止用户可以关闭订单，如果流程中出现了意外事件，商家管理员也可以选择关闭订单。

后台管理系统中并不会处理所有的流程，涉及到的流程主要是订单搜索、订单信息查看、订单状态修改、关闭订单等，本章节主要是实现这些功能。

## 表结构设计

后台管理系统中，订单管理模块主要涉及两张表，分别是订单表和与之关联的订单项表。

除了订单主表 tb_newbee_mall_order 外，还有一个订单项关联表 tb_newbee_mall_order_item ，订单主表中存储关于订单的相关信息，而订单项表中主要存储关联的商品字段。

### 订单主表和订单项关联表设计

订单主表 tb_newbee_mall_order  表结构设计如下，主要字段为：

- user_id：用户的 id，我们根据这个字段来确定是哪个用户下的订单
- order_no：订单号，订单号是用来唯一的标识订单和后续查询订单时用的，这是每个电商系统都会有的设计
- pay_status/pay_type/pay_time：支付信息字段，包括支付状态、支付方式、支付时间
- order_status：订单状态
- create_time：添加到购物车中的时间

```sql
USE `newbee_mall_db_v2`;

DROP TABLE IF EXISTS `tb_newbee_mall_order`;

CREATE TABLE `tb_newbee_mall_order` (
  `order_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '订单表主键id',
  `order_no` varchar(20) NOT NULL DEFAULT '' COMMENT '订单号',
  `user_id` bigint(20) NOT NULL DEFAULT '0' COMMENT '用户主键id',
  `total_price` int(11) NOT NULL DEFAULT '1' COMMENT '订单总价',
  `pay_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '支付状态:0.未支付,1.支付成功,-1:支付失败',
  `pay_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0.无 1.支付宝支付 2.微信支付',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `order_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '订单状态:0.待支付 1.已支付 2.配货完成 3:出库成功 4.交易成功 -1.手动关闭 -2.超时关闭 -3.商家关闭',
  `extra_info` varchar(100) NOT NULL DEFAULT '' COMMENT '订单body',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除标识字段(0-未删除 1-已删除)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最新修改时间',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

订单项表 tb_newbee_mall_order_item 表结构设计如下，主要字段为：

- order_id：关联的订单主键 id，标识该订单项是哪个订单中的数据
- goods_id/goods_name/goods_cover_img/selling_price/goods_count：订单中的商品信息，且主要字段都做了保存，而且是下单当时的商品数据，因为商品数据也是可以更改的，如果数据发生了改变，只关联商品主键 goods_id 是不够的，更改后再去查看订单详情就不是下单时的商品数据了，因此对这几个字段都做了保存处理，作为订单快照，**记录下单当时的商品信息**
- create_time：添加到购物车中的时间

```sql
USE `newbee_mall_db_v2`;

DROP TABLE IF EXISTS `tb_newbee_mall_order_item`;

CREATE TABLE `tb_newbee_mall_order_item`  (
  `order_item_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '订单关联购物项主键id',
  `order_id` bigint(20) NOT NULL DEFAULT 0 COMMENT '订单主键id',
  `goods_id` bigint(20) NOT NULL DEFAULT 0 COMMENT '关联商品id',
  `goods_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '下单时商品的名称(订单快照)',
  `goods_cover_img` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '下单时商品的主图(订单快照)',
  `selling_price` int(11) NOT NULL DEFAULT 1 COMMENT '下单时商品的价格(订单快照)',
  `goods_count` int(11) NOT NULL DEFAULT 1 COMMENT '数量(订单快照)',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`order_item_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
```

每个字段对应的含义都在上面的 SQL 中有介绍，大家可以对照 SQL 进行理解，正确的把建表 SQL 导入到数据库中即可，关于两张表中的快照字段，包括收件信息字段和商品信息字段，大家可以做一下思考，也可以参考淘宝商城的订单快照来理解，这些信息都是可以更改的，因此不能只关联一个主键 id，一旦更改，订单信息也随之更改，不再是下单时的数据了。

## 接口实现

后台管理系统中，订单管理页面实际的展现效果如下图所示：

![image-20210426155043945](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4556e596bfd04c809f41208c2950d801~tplv-k3u1fbpfcp-zoom-1.image)

需要开发的接口如下：

- 订单列表接口
- 配货接口
- 出库接口
- 订单详情接口
- 关闭订单接口

#### 新建订单类和订单项类和 Mapper 接口

首先在 ltd.newbee.mall.entity 包中创建订单实体类和订单项类，选中 entity 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中分别输入“NewBeeMallOrder”和“NewBeeMallOrderItem”，最后在类中新增如下代码：

```java
package ltd.newbee.mall.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class NewBeeMallOrder {
    private Long orderId;

    private String orderNo;

    private Long userId;

    private Integer totalPrice;

    private Byte payStatus;

    private Byte payType;

    private Date payTime;

    private Byte orderStatus;

    private String extraInfo;

    private Byte isDeleted;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updateTime;
}
```

```java
package ltd.newbee.mall.entity;

import lombok.Data;

import java.util.Date;

@Data
public class NewBeeMallOrderItem {
    private Long orderItemId;

    private Long orderId;

    private Long goodsId;

    private String goodsName;

    private String goodsCoverImg;

    private Integer sellingPrice;

    private Integer goodsCount;

    private Date createTime;
}
```

在 ltd.newbee.mall.dao 包中新建订单实体和订单项实体的 Mapper 接口，选中 dao 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中分别输入“NewBeeMallOrderMapper”和“NewBeeMallOrderItemMapper”，并选中“Interface”选项，之后在 Mapper 文件中新增如下代码：

```java
package ltd.newbee.mall.dao;

import ltd.newbee.mall.entity.NewBeeMallOrder;
import ltd.newbee.mall.util.PageQueryUtil;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface NewBeeMallOrderMapper {
    NewBeeMallOrder selectByPrimaryKey(Long orderId);

    int updateByPrimaryKeySelective(NewBeeMallOrder record);

    List<NewBeeMallOrder> findNewBeeMallOrderList(PageQueryUtil pageUtil);

    int getTotalNewBeeMallOrders(PageQueryUtil pageUtil);

    List<NewBeeMallOrder> selectByPrimaryKeys(@Param("orderIds") List<Long> orderIds);

    int checkOut(@Param("orderIds") List<Long> orderIds);

    int closeOrder(@Param("orderIds") List<Long> orderIds, @Param("orderStatus") int orderStatus);

    int checkDone(@Param("orderIds") List<Long> asList);
}
```

```java
package ltd.newbee.mall.dao;

import ltd.newbee.mall.entity.NewBeeMallOrderItem;

import java.util.List;

public interface NewBeeMallOrderItemMapper {
    /**
     * 根据订单id获取订单项列表
     *
     * @param orderId
     * @return
     */
    List<NewBeeMallOrderItem> selectByOrderId(Long orderId);
}
```

定义了对于订单实体和订单项实体操作的数据层方法，主要是查询和修改操作。

#### 创建 Mapper 接口的映射文件

在 resources/mapper 目录下新建 NewBeeMallOrderMapper 接口和 NewBeeMallOrderItemMapper 接口的映射文件 NewBeeMallOrderMapper.xml 和 NewBeeMallOrderItemMapper.xml，之后进行映射文件的编写。

按照对应的接口方法，编写具体的 SQL 语句，最终的 NewBeeMallOrderMapper.xml 文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="ltd.newbee.mall.dao.NewBeeMallOrderMapper">
    <resultMap id="BaseResultMap" type="ltd.newbee.mall.entity.NewBeeMallOrder">
        <id column="order_id" jdbcType="BIGINT" property="orderId"/>
        <result column="order_no" jdbcType="VARCHAR" property="orderNo"/>
        <result column="user_id" jdbcType="BIGINT" property="userId"/>
        <result column="total_price" jdbcType="INTEGER" property="totalPrice"/>
        <result column="pay_status" jdbcType="TINYINT" property="payStatus"/>
        <result column="pay_type" jdbcType="TINYINT" property="payType"/>
        <result column="pay_time" jdbcType="TIMESTAMP" property="payTime"/>
        <result column="order_status" jdbcType="TINYINT" property="orderStatus"/>
        <result column="extra_info" jdbcType="VARCHAR" property="extraInfo"/>
        <result column="is_deleted" jdbcType="TINYINT" property="isDeleted"/>
        <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
        <result column="update_time" jdbcType="TIMESTAMP" property="updateTime"/>
    </resultMap>
    <sql id="Base_Column_List">
    order_id, order_no, user_id, total_price, pay_status, pay_type, pay_time, order_status,
    extra_info, is_deleted, create_time, update_time
  </sql>
    <select id="selectByPrimaryKey" parameterType="java.lang.Long" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_order
        where order_id = #{orderId,jdbcType=BIGINT}
    </select>
    <select id="selectByPrimaryKeys" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_order
        where order_id in
        <foreach collection="orderIds" item="item" index="index"
                 open="(" separator="," close=")">#{item}
        </foreach>
    </select>
    <select id="findNewBeeMallOrderList" parameterType="Map" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_order
        <where>
            <if test="orderNo!=null and orderNo!=''">
                and order_no = #{orderNo}
            </if>
            <if test="userId!=null and userId!=''">
                and user_id = #{userId}
            </if>
            <if test="payType!=null and payType!=''">
                and pay_type = #{payType}
            </if>
            <if test="orderStatus!=null">
                and order_status = #{orderStatus}
            </if>
            <if test="isDeleted!=null and isDeleted!=''">
                and is_deleted = #{isDeleted}
            </if>
            <if test="startTime != null and startTime.trim() != ''">
                and create_time &gt; #{startTime}
            </if>
            <if test="endTime != null and endTime.trim() != ''">
                and create_time &lt; #{endTime}
            </if>
        </where>
        order by create_time desc
        <if test="start!=null and limit!=null">
            limit #{start},#{limit}
        </if>
    </select>

    <select id="getTotalNewBeeMallOrders" parameterType="Map" resultType="int">
        select count(*) from tb_newbee_mall_order
        <where>
            <if test="orderNo!=null and orderNo!=''">
                and order_no = #{orderNo}
            </if>
            <if test="userId!=null and userId!=''">
                and user_id = #{userId}
            </if>
            <if test="payType!=null and payType!=''">
                and pay_type = #{payType}
            </if>
            <if test="orderStatus!=null">
                and order_status = #{orderStatus}
            </if>
            <if test="isDeleted!=null and isDeleted!=''">
                and is_deleted = #{isDeleted}
            </if>
            <if test="startTime != null and startTime.trim() != ''">
                and create_time &gt; #{startTime}
            </if>
            <if test="endTime != null and endTime.trim() != ''">
                and create_time &lt; #{endTime}
            </if>
        </where>
    </select>
    <update id="checkDone">
        update tb_newbee_mall_order
        set order_status = 2,update_time = now()
        where order_id in
        <foreach collection="orderIds" item="item" index="index"
                 open="(" separator="," close=")">#{item}
        </foreach>
    </update>
    <update id="checkOut">
        update tb_newbee_mall_order
        set order_status = 3,update_time = now()
        where order_id in
        <foreach collection="orderIds" item="item" index="index"
                 open="(" separator="," close=")">#{item}
        </foreach>
    </update>
    <update id="closeOrder">
        update tb_newbee_mall_order
        set order_status = #{orderStatus},update_time = now()
        where order_id in
        <foreach collection="orderIds" item="item" index="index"
                 open="(" separator="," close=")">#{item}
        </foreach>
    </update>
    <update id="updateByPrimaryKeySelective" parameterType="ltd.newbee.mall.entity.NewBeeMallOrder">
        update tb_newbee_mall_order
        <set>
            <if test="orderNo != null">
                order_no = #{orderNo,jdbcType=VARCHAR},
            </if>
            <if test="userId != null">
                user_id = #{userId,jdbcType=BIGINT},
            </if>
            <if test="totalPrice != null">
                total_price = #{totalPrice,jdbcType=INTEGER},
            </if>
            <if test="payStatus != null">
                pay_status = #{payStatus,jdbcType=TINYINT},
            </if>
            <if test="payType != null">
                pay_type = #{payType,jdbcType=TINYINT},
            </if>
            <if test="payTime != null">
                pay_time = #{payTime,jdbcType=TIMESTAMP},
            </if>
            <if test="orderStatus != null">
                order_status = #{orderStatus,jdbcType=TINYINT},
            </if>
            <if test="extraInfo != null">
                extra_info = #{extraInfo,jdbcType=VARCHAR},
            </if>
            <if test="isDeleted != null">
                is_deleted = #{isDeleted,jdbcType=TINYINT},
            </if>
            <if test="createTime != null">
                create_time = #{createTime,jdbcType=TIMESTAMP},
            </if>
            <if test="updateTime != null">
                update_time = #{updateTime,jdbcType=TIMESTAMP},
            </if>
        </set>
        where order_id = #{orderId,jdbcType=BIGINT}
    </update>
</mapper>
```

NewBeeMallOrderItemMapper.xml 文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="ltd.newbee.mall.dao.NewBeeMallOrderItemMapper">
    <resultMap id="BaseResultMap" type="ltd.newbee.mall.entity.NewBeeMallOrderItem">
        <id column="order_item_id" jdbcType="BIGINT" property="orderItemId"/>
        <result column="order_id" jdbcType="BIGINT" property="orderId"/>
        <result column="goods_id" jdbcType="BIGINT" property="goodsId"/>
        <result column="goods_name" jdbcType="VARCHAR" property="goodsName"/>
        <result column="goods_cover_img" jdbcType="VARCHAR" property="goodsCoverImg"/>
        <result column="selling_price" jdbcType="INTEGER" property="sellingPrice"/>
        <result column="goods_count" jdbcType="INTEGER" property="goodsCount"/>
        <result column="create_time" jdbcType="TIMESTAMP" property="createTime"/>
    </resultMap>
    <sql id="Base_Column_List">
    order_item_id, order_id, goods_id, goods_name, goods_cover_img, selling_price, goods_count, 
    create_time
  </sql>
    <select id="selectByOrderId" parameterType="java.lang.Long" resultMap="BaseResultMap">
        select
        <include refid="Base_Column_List"/>
        from tb_newbee_mall_order_item
        where order_id = #{orderItemId,jdbcType=BIGINT}
    </select>
</mapper>
```

#### 业务层代码实现

在 ltd.newbee.mall.service 包中新建业务处理类，选中 service 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallOrderService”，并选中“Interface”选项。

最后在 NewBeeMallOrderService.java 文件中新增如下代码：

```java
package ltd.newbee.mall.service;

import ltd.newbee.mall.api.admin.vo.NewBeeMallOrderDetailVO;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.PageResult;

public interface NewBeeMallOrderService {

    /**
     * 获取订单详情
     *
     * @param orderId
     * @return
     */
    NewBeeMallOrderDetailVO getOrderDetailByOrderId(Long orderId);

    /**
     * 后台分页
     *
     * @param pageUtil
     * @return
     */
    PageResult getNewBeeMallOrdersPage(PageQueryUtil pageUtil);

    /**
     * 配货
     *
     * @param ids
     * @return
     */
    String checkDone(Long[] ids);

    /**
     * 出库
     *
     * @param ids
     * @return
     */
    String checkOut(Long[] ids);

    /**
     * 关闭订单
     *
     * @param ids
     * @return
     */
    String closeOrder(Long[] ids);
}
```

订单模块的业务层方法定义以及每个方法的作用都已经编写完成。

然后在 ltd.newbee.mall.service.impl 包中新建 NewBeeMallOrderService 的实现类，选中 impl 包并右击，在弹出的菜单中选择“New → Java Class”，在弹出的窗口中输入“NewBeeMallOrderServiceImpl”，最后在 NewBeeMallOrderServiceImpl 类中新增如下代码：

```java
package ltd.newbee.mall.service.impl;

import ltd.newbee.mall.api.admin.vo.NewBeeMallOrderDetailVO;
import ltd.newbee.mall.api.admin.vo.NewBeeMallOrderItemVO;
import ltd.newbee.mall.common.NewBeeMallException;
import ltd.newbee.mall.common.NewBeeMallOrderStatusEnum;
import ltd.newbee.mall.common.PayTypeEnum;
import ltd.newbee.mall.common.ServiceResultEnum;
import ltd.newbee.mall.dao.NewBeeMallOrderItemMapper;
import ltd.newbee.mall.dao.NewBeeMallOrderMapper;
import ltd.newbee.mall.entity.NewBeeMallOrder;
import ltd.newbee.mall.entity.NewBeeMallOrderItem;
import ltd.newbee.mall.service.NewBeeMallOrderService;
import ltd.newbee.mall.util.BeanUtil;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

@Service
public class NewBeeMallOrderServiceImpl implements NewBeeMallOrderService {

    @Autowired
    private NewBeeMallOrderMapper newBeeMallOrderMapper;
    @Autowired
    private NewBeeMallOrderItemMapper newBeeMallOrderItemMapper;

    @Override
    public NewBeeMallOrderDetailVO getOrderDetailByOrderId(Long orderId) {
        NewBeeMallOrder newBeeMallOrder = newBeeMallOrderMapper.selectByPrimaryKey(orderId);
        if (newBeeMallOrder == null) {
            NewBeeMallException.fail(ServiceResultEnum.DATA_NOT_EXIST.getResult());
        }
        List<NewBeeMallOrderItem> orderItems = newBeeMallOrderItemMapper.selectByOrderId(newBeeMallOrder.getOrderId());
        //获取订单项数据
        if (!CollectionUtils.isEmpty(orderItems)) {
            List<NewBeeMallOrderItemVO> newBeeMallOrderItemVOS = BeanUtil.copyList(orderItems, NewBeeMallOrderItemVO.class);
            NewBeeMallOrderDetailVO newBeeMallOrderDetailVO = new NewBeeMallOrderDetailVO();
            BeanUtil.copyProperties(newBeeMallOrder, newBeeMallOrderDetailVO);
            newBeeMallOrderDetailVO.setOrderStatusString(NewBeeMallOrderStatusEnum.getNewBeeMallOrderStatusEnumByStatus(newBeeMallOrderDetailVO.getOrderStatus()).getName());
            newBeeMallOrderDetailVO.setPayTypeString(PayTypeEnum.getPayTypeEnumByType(newBeeMallOrderDetailVO.getPayType()).getName());
            newBeeMallOrderDetailVO.setNewBeeMallOrderItemVOS(newBeeMallOrderItemVOS);
            return newBeeMallOrderDetailVO;
        } else {
            NewBeeMallException.fail(ServiceResultEnum.ORDER_ITEM_NULL_ERROR.getResult());
            return null;
        }
    }

    @Override
    public PageResult getNewBeeMallOrdersPage(PageQueryUtil pageUtil) {
        List<NewBeeMallOrder> newBeeMallOrders = newBeeMallOrderMapper.findNewBeeMallOrderList(pageUtil);
        int total = newBeeMallOrderMapper.getTotalNewBeeMallOrders(pageUtil);
        PageResult pageResult = new PageResult(newBeeMallOrders, total, pageUtil.getLimit(), pageUtil.getPage());
        return pageResult;
    }

    @Override
    @Transactional
    public String checkDone(Long[] ids) {
        //查询所有的订单 判断状态 修改状态和更新时间
        List<NewBeeMallOrder> orders = newBeeMallOrderMapper.selectByPrimaryKeys(Arrays.asList(ids));
        String errorOrderNos = "";
        if (!CollectionUtils.isEmpty(orders)) {
            for (NewBeeMallOrder newBeeMallOrder : orders) {
                if (newBeeMallOrder.getIsDeleted() == 1) {
                    errorOrderNos += newBeeMallOrder.getOrderNo() + " ";
                    continue;
                }
                if (newBeeMallOrder.getOrderStatus() != 1) {
                    errorOrderNos += newBeeMallOrder.getOrderNo() + " ";
                }
            }
            if (StringUtils.isEmpty(errorOrderNos)) {
                //订单状态正常 可以执行配货完成操作 修改订单状态和更新时间
                if (newBeeMallOrderMapper.checkDone(Arrays.asList(ids)) > 0) {
                    return ServiceResultEnum.SUCCESS.getResult();
                } else {
                    return ServiceResultEnum.DB_ERROR.getResult();
                }
            } else {
                //订单此时不可执行出库操作
                if (errorOrderNos.length() > 0 && errorOrderNos.length() < 100) {
                    return errorOrderNos + "订单的状态不是支付成功无法执行出库操作";
                } else {
                    return "你选择了太多状态不是支付成功的订单，无法执行配货完成操作";
                }
            }
        }
        //未查询到数据 返回错误提示
        return ServiceResultEnum.DATA_NOT_EXIST.getResult();
    }

    @Override
    @Transactional
    public String checkOut(Long[] ids) {
        //查询所有的订单 判断状态 修改状态和更新时间
        List<NewBeeMallOrder> orders = newBeeMallOrderMapper.selectByPrimaryKeys(Arrays.asList(ids));
        String errorOrderNos = "";
        if (!CollectionUtils.isEmpty(orders)) {
            for (NewBeeMallOrder newBeeMallOrder : orders) {
                if (newBeeMallOrder.getIsDeleted() == 1) {
                    errorOrderNos += newBeeMallOrder.getOrderNo() + " ";
                    continue;
                }
                if (newBeeMallOrder.getOrderStatus() != 1 && newBeeMallOrder.getOrderStatus() != 2) {
                    errorOrderNos += newBeeMallOrder.getOrderNo() + " ";
                }
            }
            if (StringUtils.isEmpty(errorOrderNos)) {
                //订单状态正常 可以执行出库操作 修改订单状态和更新时间
                if (newBeeMallOrderMapper.checkOut(Arrays.asList(ids)) > 0) {
                    return ServiceResultEnum.SUCCESS.getResult();
                } else {
                    return ServiceResultEnum.DB_ERROR.getResult();
                }
            } else {
                //订单此时不可执行出库操作
                if (errorOrderNos.length() > 0 && errorOrderNos.length() < 100) {
                    return errorOrderNos + "订单的状态不是支付成功或配货完成无法执行出库操作";
                } else {
                    return "你选择了太多状态不是支付成功或配货完成的订单，无法执行出库操作";
                }
            }
        }
        //未查询到数据 返回错误提示
        return ServiceResultEnum.DATA_NOT_EXIST.getResult();
    }

    @Override
    @Transactional
    public String closeOrder(Long[] ids) {
        //查询所有的订单 判断状态 修改状态和更新时间
        List<NewBeeMallOrder> orders = newBeeMallOrderMapper.selectByPrimaryKeys(Arrays.asList(ids));
        String errorOrderNos = "";
        if (!CollectionUtils.isEmpty(orders)) {
            for (NewBeeMallOrder newBeeMallOrder : orders) {
                // isDeleted=1 一定为已关闭订单
                if (newBeeMallOrder.getIsDeleted() == 1) {
                    errorOrderNos += newBeeMallOrder.getOrderNo() + " ";
                    continue;
                }
                //已关闭或者已完成无法关闭订单
                if (newBeeMallOrder.getOrderStatus() == 4 || newBeeMallOrder.getOrderStatus() < 0) {
                    errorOrderNos += newBeeMallOrder.getOrderNo() + " ";
                }
            }
            if (StringUtils.isEmpty(errorOrderNos)) {
                //订单状态正常 可以执行关闭操作 修改订单状态和更新时间
                if (newBeeMallOrderMapper.closeOrder(Arrays.asList(ids), NewBeeMallOrderStatusEnum.ORDER_CLOSED_BY_JUDGE.getOrderStatus()) > 0) {
                    return ServiceResultEnum.SUCCESS.getResult();
                } else {
                    return ServiceResultEnum.DB_ERROR.getResult();
                }
            } else {
                //订单此时不可执行关闭操作
                if (errorOrderNos.length() > 0 && errorOrderNos.length() < 100) {
                    return errorOrderNos + "订单不能执行关闭操作";
                } else {
                    return "你选择的订单不能执行关闭操作";
                }
            }
        }
        //未查询到数据 返回错误提示
        return ServiceResultEnum.DATA_NOT_EXIST.getResult();
    }
}
```

#### 订单管理模块控制层代码实现

在 ltd.newbee.mall.api.admin 包中新建 NewBeeAdminOrderAPI 类，在 NewBeeAdminOrderAPI 控制器中新增相关接口的实现代码，最终 NewBeeAdminOrderAPI 类的代码如下：

```java
package ltd.newbee.mall.api.admin;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import ltd.newbee.mall.api.admin.param.BatchIdParam;
import ltd.newbee.mall.api.admin.vo.NewBeeMallOrderDetailVO;
import ltd.newbee.mall.common.ServiceResultEnum;
import ltd.newbee.mall.config.annotation.TokenToAdminUser;
import ltd.newbee.mall.entity.AdminUserToken;
import ltd.newbee.mall.service.NewBeeMallOrderService;
import ltd.newbee.mall.util.PageQueryUtil;
import ltd.newbee.mall.util.Result;
import ltd.newbee.mall.util.ResultGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * @author 13
 * @qq交流群 796794009
 * @email 2449207463@qq.com
 * @link https://github.com/newbee-ltd
 */
@RestController
@Api(value = "v1", tags = "8-5.后台管理系统订单模块接口")
@RequestMapping("/manage-api/v1")
public class NewBeeAdminOrderAPI {

    private static final Logger logger = LoggerFactory.getLogger(NewBeeAdminOrderAPI.class);

    @Resource
    private NewBeeMallOrderService newBeeMallOrderService;

    /**
     * 列表
     */
    @RequestMapping(value = "/orders", method = RequestMethod.GET)
    @ApiOperation(value = "订单列表", notes = "可根据订单号和订单状态筛选")
    public Result list(@RequestParam(required = false) @ApiParam(value = "页码") Integer pageNumber,
                       @RequestParam(required = false) @ApiParam(value = "每页条数") Integer pageSize,
                       @RequestParam(required = false) @ApiParam(value = "订单号") String orderNo,
                       @RequestParam(required = false) @ApiParam(value = "订单状态") Integer orderStatus, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (pageNumber == null || pageNumber < 1 || pageSize == null || pageSize < 10) {
            return ResultGenerator.genFailResult("分页参数异常！");
        }
        Map params = new HashMap(8);
        params.put("page", pageNumber);
        params.put("limit", pageSize);
        if (!StringUtils.isEmpty(orderNo)) {
            params.put("orderNo", orderNo);
        }
        if (orderStatus != null) {
            params.put("orderStatus", orderStatus);
        }
        PageQueryUtil pageUtil = new PageQueryUtil(params);
        return ResultGenerator.genSuccessResult(newBeeMallOrderService.getNewBeeMallOrdersPage(pageUtil));
    }

    @GetMapping("/orders/{orderId}")
    @ApiOperation(value = "订单详情接口", notes = "传参为订单号")
    public Result<NewBeeMallOrderDetailVO> orderDetailPage(@ApiParam(value = "订单号") @PathVariable("orderId") Long orderId, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        return ResultGenerator.genSuccessResult(newBeeMallOrderService.getOrderDetailByOrderId(orderId));
    }

    /**
     * 配货
     */
    @RequestMapping(value = "/orders/checkDone", method = RequestMethod.PUT)
    @ApiOperation(value = "修改订单状态为配货成功", notes = "批量修改")
    public Result checkDone(@RequestBody BatchIdParam batchIdParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (batchIdParam==null||batchIdParam.getIds().length < 1) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        String result = newBeeMallOrderService.checkDone(batchIdParam.getIds());
        if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult(result);
        }
    }

    /**
     * 出库
     */
    @RequestMapping(value = "/orders/checkOut", method = RequestMethod.PUT)
    @ApiOperation(value = "修改订单状态为已出库", notes = "批量修改")
    public Result checkOut(@RequestBody BatchIdParam batchIdParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (batchIdParam==null||batchIdParam.getIds().length < 1) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        String result = newBeeMallOrderService.checkOut(batchIdParam.getIds());
        if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult(result);
        }
    }

    /**
     * 关闭订单
     */
    @RequestMapping(value = "/orders/close", method = RequestMethod.PUT)
    @ApiOperation(value = "修改订单状态为商家关闭", notes = "批量修改")
    public Result closeOrder(@RequestBody BatchIdParam batchIdParam, @TokenToAdminUser AdminUserToken adminUser) {
        logger.info("adminUser:{}", adminUser.toString());
        if (batchIdParam==null||batchIdParam.getIds().length < 1) {
            return ResultGenerator.genFailResult("参数异常！");
        }
        String result = newBeeMallOrderService.closeOrder(batchIdParam.getIds());
        if (ServiceResultEnum.SUCCESS.getResult().equals(result)) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult(result);
        }
    }
}
```

1.列表接口负责接收前端传来的分页参数和过滤字段参数，如 pageNumber、pageSize 、orderNo、orderStatus ，分页参数是必传的，另外两个参数需要根据管理员选择的过滤条件来传输，后端在处理完参数后，会将数据总数和对应页面的数据列表查询出来并封装为分页数据返回给前端。实际的查询 SQL 语句在 NewBeeMallOrderMapper.xml 文件中，除了分页参数的过滤外，也针对 order_no 字段和 order_status 进行了过滤，前端请求的参数不同，执行的 SQL 也会去对应的查询该类型的分页记录，获取响应条数的记录和总数之后再进行数据封装，这个接口就是根据前端传的分页参数进行查询并返回分页数据以供前端页面进行数据渲染。

2.配货、出口、关闭订单负责接收前端的状态修改请求，处理前端传输过来的数据后，将这些记录的 order_status 改为对应的订单状态。接收的参数是一个数组，可以同时操作多条记录，只需要在前端将用户选择的记录 id 封装好再传参到后端即可，使用 @RequestBody 将前端传过来的参数封装为数组对象，如果数组为空则直接返回异常提醒，参数验证通过后则调用对应的方法进行数据库操作。

3.详情接口负责处理订单详情页面的数据查询和整理，接收的参数是订单主键 orderId，根据该字段去查询订单表中的内容，之后再去查询该订单所关联的订单项数据，最后将订单数据和订单项数据进行整理和封装并返回给前端。

## 总结

至此，后台接口的编码实现及相关知识点都介绍完毕。

今后的日子里该项目会继续优化更新，这本小册也是如此。如果有需要整理的内容，我会继续追加到这本掘金小册中来。当然，小册中的代码是为了知识点讲解，所以可能与开源仓库中的代码有一点小区别，这是正常的，仓库中的代码是最终成品，而小册中每一章节都有各自的代码，随着知识点的深入代码也越来越丰富，希望你有所收获。