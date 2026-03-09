
**GeoHash 是一种坐标编码算法，其目的是将一个经纬度坐标编码成一个 Base 32 字符串。**

地球经度范围为东经 180° 到西经 180°，纬度范围是南纬 90° 到北纬 90°。在 GeoHash 算法中，将西经设置为负，东经设置为正，南纬设置为负，北纬设置正，则得到经度范围是 [-180，180]，纬度范围是 [-90，90]。每个 GeoHash 都表示地球上的一块区域。例如，我们以赤道和本初子午线为边界，就可以将地球划分为 4 个区域，如下图所示，我们可以为每个区域设置一个二进制编码：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00113f39ac024eb48103a27b7934ac5e~tplv-k3u1fbpfcp-zoom-1.image" alt=""  /></p>

上图只将地球划分为四个区域，没有什么作用，因为粒度实在太大了，实现不了精确的定位和范围搜索功能。我们可以继续对整个地球进行更细致的划分，得到更精准的一个个小区域，如下图所示，然后将这些表示小块区域的二进制进行 Base32 编码得到的字符串，也就是 `GeoHash 编码`。

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a985d75e8d8148499b49e1e51a9f5393~tplv-k3u1fbpfcp-zoom-1.image" alt=""  /></p>

下面我们来看计算（40.085138, 116.327313）这个坐标的 GeoHash 的核心流程。

1.  首先，将地区的经度分为 [-180, 0]、[0, 180]，116° 位于右侧的 [0, 180] 区间，我们使用 1 进行标识。
2.  然后，继续将 [0, 180] 这个经度范围分为 [0, 90] 以及 [90, 180] 两份，116° 依旧位于右侧的 [90, 180] 区间内，继续用 1 进行标识，得到 11。
3.  下面继续切分下去，116° 会落到 [90, 135]、[112.5,135] 这几个区间中，对应编码依次变成 110、1101 。前三步的过程如下图所示：


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d95d5e0c08274d54a70ad0688d625f85~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

4.  重复上述切分经度的逻辑 20 次，我们会得到一个非常逼近 116.327313 的经度区间，同时，我们还会得到了 11010010101110001011 这个编码值，这个编码值就用来表示这个逼近 116.327313 的经度区间。
5.  同理，重复切分纬度的逻辑 20 次，我们也会得到一个逼近 40.085138 的纬度区间，对应的编码是 10111001000000101000。
6.  为了得到一个完整的 GeoHash 值，我们需要对经度区间编码和纬度区间编码进行组合，这个过程也称为“组码”。这里会在偶数位存储经度编码，奇数位存储纬度编码，如下图所示，得到的 1110011101001001100010101000010011001010。


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f94d2f9c9b74b47ada6fca6382c5f88~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

7.  最后，使用 Base32 对组码之后的值进行编码，得到 GeoHash 字符串。这里的 Base 32 使用了 0 ~ 9、b ~ z（去掉 a、i、l、o 四个字母）共 32 个字母和数字，映射表如下图所示：

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51d4744549894362b539b42f01598fa4~tplv-k3u1fbpfcp-zoom-1.image" alt=""  /></p>

例如，上述示例中（40.085138, 116.327313）这个坐标的 GeoHash 就是 wx4sp16b。


## 写入 GEO 实现分析

了解了 GeoHash 的基本功能之后，我们来简单介绍一下 Redis 中 Geo 功能。

在最开始，Redis 的 Geo 功能以扩展模块的形式存在，直到在 Redis 3.2 版本，Redis 合并了 Geo 模块，Geo 功能成为了 Redis 默认支持的功能之一。

下面开始介绍第一条与 GEO 相关的命令 —— `GEOADD 命令`，其完整格式如下：

```
GEOADD key [ NX | XX] [CH] longitude latitude member [ longitude latitude member ...]
```

GEOADD 命令的功能是：将经纬度计算成 GeoHash 值，然后将 GeoHash 值转成整数作为 member 参数的 score 值，一并存储到 Key 指定的 Sorted Set 集合中。很明显，GEOADD 命令底层使用的是 Sorted Set 集合作为存储，所以 GEOADD 命令里面就有两个核心逻辑需要展开介绍了：一个是计算 GeoHash 值的具体算法实现，另一个是将 GEOADD 命令改写成 ZADD 的逻辑。

首先来看 Redis 对 GeoHash 算法的实现，通过前文对 GeoHash 概念的介绍，同学们可能最先想到的是使用二分法来计算 GeoHash 值的流程。虽然这是可以实现的，但是效率略低。Redis 使用坐标转化的算法实现，其核心逻辑位于 `geohashEncode() 函数`，片段如下：

```c
int geohashEncode(const GeoHashRange *long_range, 

    const GeoHashRange *lat_range, double longitude, double latitude, 

    uint8_t step, GeoHashBits *hash) {

    ... // 省略其他边界检查的逻辑

    

    // 计算经纬度的偏移量

    double lat_offset =

        (latitude - lat_range->min) / (lat_range->max - lat_range->min);

    double long_offset =

        (longitude - long_range->min) / (long_range->max - long_range->min);

    // 

    lat_offset *= (1ULL << step);

    long_offset *= (1ULL << step);

    hash->bits = interleave64(lat_offset, long_offset);

    return 1;

}
```

在展开分析这段代码之前，我们先来了解一下 GeoHashRange 结构体。它其中记录了 min、max 两个 double 值，表示一个经纬度的范围。这里的 long_range、lat_range 参数都是 GeoHashRange 类型的指针，分别记录了经纬度的最大值和最小值，即 [-180, 180]、[-90, 90]。

再看 GeoHashBits 结构体，其中维护了一个 uint64_t 类型的 bits 字段，用来存储计算 GeoHash 的二进制结果，还维护了一个 step 字段，用来记录经纬度划分的次数，Redis 中默认是 26 次，也就是说 GeoHash 中经纬度对应的编码分别为 26 位，整个 GeoHash 二进制为 52 位，使用 Base32 编码为每 5 位进行一次编码，最终会得到一个 11 位的 GeoHash 字符串。

了解了核心结构体的作用，我们接下来看 geohashEncode() 函数本身的算法。

首先是计算目标经度在整个经度范围 [-180, 180] 内的偏移，经度也是同理。然后将经纬度的偏移量乘以 2 的 26 次方，也就是划分 26 次。简单理解一下这里乘以 2^26 的逻辑，下图展示了划分 3 次之后的编码情况，我们看到编码是从低到高递增的：


<p align=center><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d924c151684434599554f194121c4a1~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

假设我们按照上面的算法计算西经 60°，在划分 3 次的场景中的编码，首先得到西经 60° 落在整个 360° 的 (-60 - (-180)) / 360 = 1 / 3 处，如下图所示，也就是 1/3 * 2^3 = 2 这个区域，对应的编码为 010。


<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc9630444da34cbfa45bd0236b5ed859~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

计算完经纬度的编码，最后会调用 interleave64() 函数进行组码，并将最终的 GeoHash 值返回。

介绍完 GeoHash 值的计算之后，接下来看命令的修改逻辑。下面是生成 ZADD 命令以及参数的代码片段和相关注释，其核心原理就是将经纬度参数替换成 GeoHash 值作为 score 值，将 member 参数保留作为 value 值，然后将 GEOADD 命令替换成 ZADD 命令，最后调用 zaddCommand() 函数执行完成 Sorted Set 的写入。

```c
void geoaddCommand(client *c) {

    ... // 省略其他逻辑

    argv[0] = createRawStringObject("zadd",4); // 将argv[0]设置为ZADD命令

    for (i = 0; i < elements; i++) {

        ... // 省略其他逻辑

        // 将计算得到的GeoHash值作为score

        robj *score = createObject(OBJ_STRING, sdsfromlonglong(bits));

        // 跳过参数中的经纬度参数，只保留member参数作为value值

        robj *val = c->argv[longidx + i * 3 + 2];

        // 将score以及value值记录到argv数组中

        argv[longidx+i*2] = score;

        argv[longidx+1+i*2] = val;

        incrRefCount(val);

    }

    // 将client中的argv、argc字段替换成上面新生成的argv和argc

    replaceClientCommandVector(c,argc,argv);

    // 执行ZADD命令

    zaddCommand(c);

}
```


## 查询实现分析

通过对 GEOADD 命令的分析我们知道，实际写入 Sorted Set 的数据是 GeoHash 值以及 member 值。接下来，我们就可以通过 `GEOHASH 命令`从该 Sorted Set 集合中获取指定 member 对应的 GeoHash 字符串了。GEOHASH 命令的核心逻辑是先通过 zsetScore() 函数从 Sorted Set 中获取对应的 score 值，也就是 GeoHash 值，然后对 GeoHash 值进行 Base32 编码，即每 5 位转换成前文介绍的 Base32 表中的一个字符，得到 GeoHash 字符串返回给客户端。

在有的场景中，我们需要查询的并不是一个 GeoHash 字符串，而是 member 对应的大致坐标，此时我们可以使用 `GEOPOS 命令`，该命令会先从 Sorted Set 中查询出 GeoHash 值，然后调用 geohashDecode() 函数按照逆向的组码逻辑，拆分出经纬度对应区域编码值，按照经纬度对应的区域编码值确定对应区域的经纬度范围。例如下图所示，前文提到的西经 60° 在切分 3 次的场景中对应 010 区域，该区域的经度范围是 [-90, -45]。最后，调用 geohashDecodeAreaToLongLat() 函数，将经纬度对应的中心点作为该 member 值对应的坐标值返回给客户端。


<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f4b09b3d18142e9bb8701016ac12a27~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

除了简单查询 member 的大致位置之外，还会有**计算两个 member 的大致距离**的需求，我们可以使用 `GEODIST 命令`来实现该需求。GEODIST 命令会计算同一个 Sorted Set 中，两个 member 之间的距离。

GEODIST 命令的核心是：先根据上面介绍的 GEOPOS 命令的逻辑查询到两个 member 对应的大致坐标，然后通过 geohashGetDistance() 函数计算两个坐标之间的距离。有的同学可能觉得直接使用勾股定理就可以了，但是地球是一个椭球形，我们需要使用 Haversine 公式才能正确地计算两点的距离。至于 Haversine 公式的推导过程这里就不做过多展开，同学们可以在 geohashGetDistance() 函数中看到 Haversine 公式的完整实现。

另外，还有两个问题需要说明：一个是如果要计算在不同 Sorted Set 中的两个点的距离，就需要我们在应用层进行处理；另一个是 Redis 使用 GeoHash 的中心点大致表示 member 的坐标，此时在计算两个点的时候，就会出现一些误差，例如下图所示，A、B 两点的距离应该小于两个 GeoHash 中心点的距离，如果业务无法容忍该误差，我们就需要使用其他更精确的解决方案。


<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24f96e293614482da13490dacbb2fa29~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

除了单点坐标查询、两点之间的距离计算之外，在有的场景中，还可能会**查询一个指定范围内出现的点**，例如查找周边商家这种需求。此时就可以使用 `GEOSEARCH 命令`，该命令在 Redis 6.2.0 版本之前对应的是 GEORADIUS 命令，在 6.2.0 版本之后，GEORADIUS 被标记为废弃命令，推荐使用 GEOSEARCH 命令。

下面是 GEOSEARCH 的命令中各个子命令和参数的含义：

```
GEOSEARCH key [FROMMEMBER member] # 使用member作为中心进行查询

 [FROMLONLAT longitude latitude] # 使用指定的经纬度作为中心进行查询

 [BYRADIUS radius M|KM|FT|MI] # 按照圆形范围进行查找，radius为圆形区域的半径

 [BYBOX width height M|KM|FT|MI] # 按照矩形范围进行查找，width、height是矩形的宽和高

 [ASC|DESC]  # 按照距离搜索中心点的距离进行正序或逆序排序

 [COUNT count [ANY]] # 结果集中member的个数

 [WITHCOORD] [WITHDIST] [WITHHASH] #结果集中同时返回经纬度、距中心点距离或是GeoHash值
```

GEOSEARCH 命令对应的核心逻辑位于 georadiusGeneric() 函数，下面是该函数的核心步骤。

1.  首先，georadiusGeneric() 函数会解析 GEOSEARCH 命令的参数。第一步就是解析 FROMMEMBER 子命令，如果是根据经纬度查询，则将经纬度信息记录到 shape.xy 数组中；如果是根据 member 元素的位置查询，则从底层的 Sorted Set 中查找对应 GeoHash 值并计算其中心坐标作为查询中心点，记录到 shape.xy 数组中。这里的 shape 其实是 GeoShape 结构体，它用来表示一个查询区域，具体定义如下：

```c++
typedef struct {

    int type; // 查询查询区域的形状，目前有CIRCULAR_TYPE、RECTANGLE_TYPE两个可选值

    double xy[2]; // 查询中心点的经纬度坐标

    double conversion; // 查询范围的单位转换成m的进制，例如，指定单位是km时，

                       // 该值为1000,指定单位是m时，该值为1

    double bounds[4]; // 记录查询的边界范围，bounds[0]、bounds[1]分别记录了纬

                     // 度的最大值和最小值，bounds[2]、bounds[3]记录了经度的最

                     // 大值和最小值

    union {

        // type为CIRCULAR_TYPE时表示按照圆形区域进行查询，radius记录了圆形的半径

        double radius;

        // type为RECTANGLE_TYPE时表示按照矩形区域进行查询，width、eight记录了宽和高

        struct {

            double height;

            double width;

        } r;

    } t;

} GeoShape;
```

在 georadiusGeneric() 函数中除了填充 GeoShape.xy 数组记录中心点坐标之外，还会解析 BYRADIUS 等子命令填充 shape.type 字段，解析 BYRADIUS 子命令的参数填充 GeoShape.t 以及 GeoShape.conversion 字段，这里就不再一一展开介绍了。

2.  接下来进入 geohashCalculateAreasByShapeWGS84() 函数，根据中心点、搜索距离、搜索形状查询在搜索范围内的 GeoHash 值。

   -  第一步是通过 geohashBoundingBox() 函数计算此次搜索的经纬度范围。其中不仅根据中心点和搜索范围计算经纬度范围，还会根据搜索范围所处的实际位置进行计算，如下图所示，因为地球是一个扁平的椭球形，所以当中心点在北半球、南半球或赤道附近的时候，搜索经纬度范围的估算方法也会有所不同。


<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0618c8d8f3cc4ff08411df678eb66c7e~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

  -   第二步是通过计算中心点周围的 9 个 GeoHash 块，这 9 个 GeoHash 块所覆盖的范围就是此次搜索范围。这里会先通过 geohashEstimateStepsByRadius() 函数推算这 9 个 GeoHash 块的精度（也就是 step 值），其中会根据我们的查询半径（或矩形对角线的一半）的长度计算该精度，例如我们查询半径比较大，得到的 step 值就会比较小，相应的，GeoHash 值长度会比较短，整个 GeoHash 块覆盖的区域也就比较大大，其核心逻辑片段如下：

```
uint8_t geohashEstimateStepsByRadius(double range_meters, double lat) {

    if (range_meters == 0) return 26;

    int step = 1;

    while (range_meters < MERCATOR_MAX) {

        range_meters *= 2;

        step++;

    }

    step -= 2;

    ... // 省略接近南北极时对step的校正

}
```

确定完 GeoHash 精度之后，就可以计算中心点所在的 GeoHash 块，以及其周围 8 个方向相邻的 GeoHash 块，如下所示：


<p align=center><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/234b4509670748cf906a272a80d6e2c0~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

-  接下来，对上图 9 个 GeoHash 块进行校验，保证中心点到 9 个 GeoHash 的边界位置，超过我们的查询半径，也就是上图红色的虚线圈。如果未超过查询半径，就需要降低 step，重新计算搜索范围，也就是以新的 step 重新计算这 9 个 GeoHash 块。下面是相关的代码片段：

```
 if (geohashGetDistance(longitude,latitude,longitude,north.latitude.max)

            < radius_meters) decrease_step = 1;
```

除了与查询半径校验之外，还会与前文步骤 a 中得到的此次查询的经纬度范围进行校验，下面是相关的代码片段：

```
// 如果中心点所在GeoHash块的最小值纬度值已经小于了此次搜索范围，

// 则当前GeoHash块南边的GeoHash块都无需再搜索了，因为已经超出了此次搜索的范围

if (area.latitude.min < min_lat) { 

    // 这里会将neighbors.south中的GeoHash清空，后续不会查询落在其中的member

    GZERO(neighbors.south); 

    GZERO(neighbors.south_west);

    GZERO(neighbors.south_east);

}

... // 纬度的最大值以及经度的最大值和最小值也都会进行对应的校验，这里都不再展开
```

-  最后，返回 GeoHashRadius 实例，GeoHashRadius 结构体中就记录了中心点所在的 GeoHash 块以及相邻的 8 个 GeoHash 块。

<!---->

3.  确定了此次搜索的 GeoHash 块之后，Redis 会调用 membersOfAllNeighbors() 函数查找落在上述 9 个 GeoHash 块中的 member，也就得到了此次搜索的结果集。membersOfAllNeighbors() 函数中会遍历 9 个 GeoHash 块，其中每个 GeoHash 块都能覆盖多个 52 位 GeoHash 值的范围。因为存储在底层 Sorted Set 中的 GeoHash 值为 52 位的，其精度高于搜索的 9 块 GeoHash，这 9 块 GeoHash 每块都包含多个 52 位 GeoHash 块。如下图 north_west 这个 GeoHash 块所示，在我们拿到 north_west 中的最大和最小的 52 位 GeoHash 值之后，我们就可以将其作为 score 的范围，扫描底层的 Sorted Set，拿到 north_west 块能覆盖的 member。


<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a600592bced64f8d8f2c1ab11c508a7b~tplv-k3u1fbpfcp-watermark.image?" alt="image.png"  /></p>

同理，membersOfAllNeighbors() 函数也是这么处理其他剩余的 8 个待搜索 GeoHash 块的。最后，将这 9 个 GeoHash 块所覆盖的所有 member ，即为此次 GEOSEARCH 命令的查询结果集。

## 总结

在这一节中，我们重点介绍了 Redis 对 GEO 能力的支持。首先，我们介绍了 GEO 的基本概念，然后接着分析了 Redis 写入 GEO 的 GEOADD 命令以及该命令的底层实现，最后还讲解了 Redis 查询 GEO 数据的 GEOHASH 命令以及范围搜索的 GEOSEARCH 命令。