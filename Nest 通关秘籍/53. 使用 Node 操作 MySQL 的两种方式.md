前面我们学习了 MySQL 的数据库、表、增删改查等，目的还是在 Node 应用里操作它。

这节我们就来学习下用 mysql2 和 typeorm 两种方式来操作 MysSQL 数据库。

先来看下 mysql2:

它是用的最多的连接 mysql 的 npm 包，是 mysql 包的升级版，有更多特性。

我们创建个目录，然后进入这个目录执行 npm init -y 创建 package.json。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/198e7a1ef31743f49799bbb42392d07c~tplv-k3u1fbpfcp-watermark.image?)

然后安装 mysql2

    npm install --save mysql2 

添加这样一个 index.js：

```javascript
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'guang',
  database: 'practice'
});

connection.query(
  'SELECT * FROM customers',
  function(err, results, fields) {
    console.log(results);
    console.log(fields.map(item => item.name)); 
  }
);
```

连接 mysql server，指定用户名、密码、要操作的数据库（这里要改成你自己的 mysql 连接密码）。

然后通过 query 方法跑一个查询 sql。

results 是结果，fields 是一些元信息，比如字段名这些。

node 执行下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39575fc93dfe4e468daa39de47aebc69~tplv-k3u1fbpfcp-watermark.image?)

和我们在 mysql workbench 里执行效果一样。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64a85415cb7f4e9cafdc2882c6ee8b0b~tplv-k3u1fbpfcp-watermark.image?)

查询也可以指定占位符：

```javascript
connection.query(
    'SELECT * FROM customers WHERE name LIKE ?',
    ['李%'],
    function(err, results, fields) {
        console.log(results);
        console.log(fields.map(item => item.name)); 
    }
);
```

我们查询了姓李的顾客有哪些：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/740183baff8a4df69d2fe245232a0fa8~tplv-k3u1fbpfcp-watermark.image?)

当然，增删改也是可以的。

比如我们插入一条数据：

```sql
connection.execute('INSERT INTO customers (name) VALUES (?)',
    ['光'], (err, results, fields) => {
    console.log(err);
});
```

在 mysql workbench 里可以看到，确实插入了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d479b595b70c4d5ca013db16e8d4a5ba~tplv-k3u1fbpfcp-watermark.image?)

再来试下修改。

```javascript
connection.execute('UPDATE customers SET name="guang" where name="光"',
(err) => {
    console.log(err);
});
```

把刚才插入的记录改个名字。

node 跑一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81ca6a47da704829bdebe38a158f156d~tplv-k3u1fbpfcp-watermark.image?)

点下刷新，可以看到确实修改了：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/398da9cf22184817ba22c8e743c0160a~tplv-k3u1fbpfcp-watermark.image?)

再试试删除：

```javascript
connection.execute('DELETE  FROM customers where name=?',
    ['guang'],
    (err) => {
        console.log(err);
    });
```

执行后数据库中这条记录也删除了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cfa8bd7e0c94e46839a112260091478~tplv-k3u1fbpfcp-watermark.image?)

这就是用 mysql2 做增删改查的方式。

是不是还挺简单的，就和我们在 mysql workbench 里写 sql 差不多。

当然，这些 api 也都有 promise 版本。

这样写：

```sql
const mysql = require('mysql2/promise');

(async function() {

    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'guang',
        database: 'practice'
    });

    const [results, fields] = await connection.query('SELECT * FROM customers');

    console.log(results);
    console.log(fields.map(item => item.name)); 

})();
```

结果一样：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f05d163e3e9433b9b67090975adf221~tplv-k3u1fbpfcp-watermark.image?)

这是最基本的使用：需要操作数据库的时候，建立连接，用完之后释放连接。

但这样性能并不高。

因为数据库的连接建立还是很耗时的，而且一个连接也不够用。

我们一般都是用连接池来管理：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1958a1babf864c7abca8166dec40e97a~tplv-k3u1fbpfcp-watermark.image?)

连接池中放着好几个 mysql 的连接对象，用的时候取出来执行 sql，用完之后放回去，不需要断开连接。

mysql2 自然也封装了连接池的功能。

这样用：

```javascript
const mysql = require('mysql2/promise');

(async function() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'guang',
        database: 'practice',
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, 
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });

    const [results] = await pool.query('select * from customers');
    console.log(results);
})();
```

只要把 createConnection 换成 createPool 就好了。query 或者 execute 的时候会自动从 pool 中取 connection 来用，用完会放回去。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/518eb14a89ca416e933318ca978260ac~tplv-k3u1fbpfcp-watermark.image?)

或者你也可以手动取：

```javascript
const connection = await pool.getConnection();

const [results] = await connection.query('select * from orders');
console.log(results);
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9afd05d94fbd4154acb805fa9656d17c~tplv-k3u1fbpfcp-watermark.image?)

回过头来再看看这些 option：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f83ffc6c8dc646ac9f7180deb0895a7b~tplv-k3u1fbpfcp-watermark.image?)

connectionLimit 是指定最多有多少个连接，比如 10 个，那就是只能同时用 10个，再多需要排队等。

maxIdle 是指定最多有多少个空闲的，超过这个数量的空闲连接会被释放。

waitForConnections 是指如果现在没有可用连接了，那就等待，设置为 false 就是直接返回报错。

idleTimeout 是指空闲的连接多久会断开。

queueLimit 是可以排队的请求数量，超过这个数量就直接返回报错说没有连接了。设置为 0 就是排队没有上限。

enableKeepAlive、keepAliveInitialDelay 是保持心跳用的，用默认的就好。

这就是 mysql2 的用法，是不是还会挺简单的？

只要建立个连接或者连接池，就可以在 node 里执行 sql 了。

但是我们一般不会直接这样执行 sql，而是会用 ORM 框架。

**ORM 是 Object Relational Mapping，对象关系映射。也就是说把关系型数据库的表映射成面向对象的 class，表的字段映射成对象的属性映射，表与表的关联映射成属性的关联。**

其实这个想法也很自然，比如我们前面执行的这些 sql：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e253cffe2fdb440d8a515e403510a9c4~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f0d16b99b824b03945d76d9616cd147~tplv-k3u1fbpfcp-watermark.image?)

返回的不就是 js 对象么。

那不如直接操作这个对象，让 ORM 框架自动执行 sql 去同步数据库。

TypeORM 就是一个流行的 ORM 框架。

我们来试一下：

新建一个项目：

    npx typeorm@latest init --name typeorm-mysql-test --database mysql

通过 typeorm 的 init 命令创建一个项目， --name 指定项目名，--database 指定连接的数据库。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9338fc5a7f5643e28e63a4cc49bd5ab3~tplv-k3u1fbpfcp-watermark.image?)

修改下 data-source.ts

```typescript
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "guang",
    database: "practice",
    synchronize: true,
    entities: [User],
    migrations: [],
    subscribers: [],
    connectorPackage: 'mysql2',
    extra: {
        authPlugin: 'sha256_password',
    }
})
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20311814f7a94017b919efc47163af3b~tplv-k3u1fbpfcp-watermark.image?)

用户名密码，要操作的数据库，这些很容易理解。

指定用 mysql2 包来连接，就是我们前面测试的那个。

然后添加一个验证的插件，sha256\_password，这个是切换密码的加密方式的，新版本 mysql 改成这种密码加密方式了。

还要手动安装下 mysql2 这个驱动包：

    npm install --save mysql2

然后执行 npm run start。

这时候你会发现 practice 数据库多了个表：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36e165fdaf9a4494b8a65cc0a5a5628f~tplv-k3u1fbpfcp-watermark.image?)

打开看一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a3338303dfd49e69a58ddc7820979fe~tplv-k3u1fbpfcp-watermark.image?)

它还有一条数据。

而且控制台也打印了查询出来的这条数据：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/436b9fb2421c4e7cac7c86bc7f1118ce~tplv-k3u1fbpfcp-watermark.image?)

怎么做到的呢？

我们看下代码，有这样一个 entity，通过装饰器声明了主键列和其他的列：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16240ef5954c4a389d9eba0f6510121d~tplv-k3u1fbpfcp-watermark.image?)

在 index.ts 里创建了一个 User 的对象，调用 save 方法保存这个对象，通过 find 方法查询这个对象：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aea70c6020d54037b1083209fdc1b647~tplv-k3u1fbpfcp-watermark.image?)

然后数据库里就创建好了表、插入了数据，并且还把它查了出来。

这就是 ORM。

有没有感觉很神奇，它是怎么实现的呢？

我们看下它打印的 sql 就懂了。

加一个 logging 为 true 的选项：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8e7c12c0bf54c90b5f960e1b8979a2d~tplv-k3u1fbpfcp-watermark.image?)

然后去数据库把那个 user 表删掉。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40d1f18fa78c4cbebb0d0780f8355375~tplv-k3u1fbpfcp-watermark.image?)

再重新 npm run start：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c94579eec20a4efbb943f8f678d391c2~tplv-k3u1fbpfcp-watermark.image?)

看到它打印的 CREATE TABLE、INSERT INTO、SELECT 的 sql 语句了么？

这就是 ORM 的实现原理。

它会根据你在 class 的属性上加的装饰器来生成建表 sql。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13fa6a00c32f4fdf8e1c521da38a8d24~tplv-k3u1fbpfcp-watermark.image?)

然后 save 这个 class 的对象，就会执行 insert into 来插入数据。

find 方法会执行 select 来查询数据。

这样，对表的增删改查就变成了对对象的操作。

此外，可以看到每个涉及到修改的 sql 都包了一层事务，这样出了错可以回滚：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d975d42524a74d629e64b9f354c88b36~tplv-k3u1fbpfcp-watermark.image?)

[typeorm 案例代码](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/typeorm-mysql-test) 和 [mysql2 案例代码](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/mysql2-test) 都在小册仓库。

## 总结

我们学习了 Node 里操作数据库的两种方式：

一种是直接用 mysql2 连接数据库，发送 sql 来执行。

一种是用 ORM 库，比如 typeorm，它是基于 class 和 class 上的装饰器来声明和表的映射关系的，然后对表的增删改查就变成了对象的操作以及 save、find 等方法的调用。它会自动生成对应的 sql。

主流的方案还是 ORM 的方案，下节我们继续深入学习 typeorm。
