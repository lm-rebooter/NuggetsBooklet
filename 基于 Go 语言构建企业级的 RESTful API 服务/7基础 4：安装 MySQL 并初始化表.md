# 安装 MySQL 并初始化表

## 本节核心内容

+ 如何安装 MySQL 数据库
+ 如何创建示例需要的数据库和表

本节主要是为第 12 节「用户业务逻辑处理」做准备工作。

## 准备工作

**安装 MySQL**

apiserver 用的是 MySQL，所以首先要确保服务器上安装有 MySQL，执行如下命令来检查是否安装了 MySQL（CentOS 7 上是 mariadb-server，CentOS 6 上是 mysql-server，这里以 CentOS 7 为例）：
```
$ rpm -q mariadb-server
```
如果提示 `package mariadb-server is not installed` 则说明没有安装 MySQL，需要手动安装。如果出现 `mariadb-server-xxx.xxx.xx.el7.x86_64` 则说明已经安装。

安装 MySQL 的步骤为：

1. 安装 MySQL 和 MySQL 客户端


```
$ sudo yum -y install mariadb  mariadb-server
```

2. 启动 MySQL

```
$ sudo systemctl start mariadb
```

3. 设置开机启动

```
$ sudo systemctl enable mariadb
```

4. 设置初始密码

```
$ sudo mysqladmin -u root password root
```

> 因为版权原因，在 CentOS 7 中用的是基于 MySQL fork 的一个开源分支 MariaDB，它的功能和用法跟 MySQL 完全一样。
> 
> 如果你的系统之前已经安装过 MySQL，需要在 conf/config.yaml 配置文件中更新配置。

**创建示例需要的数据库和表**

1. 创建 `db.sql`，内容为：

```sql
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `db_apiserver` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `db_apiserver`;

--
-- Table structure for table `tb_users`
--

DROP TABLE IF EXISTS `tb_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_tb_users_deletedAt` (`deletedAt`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_users`
--

LOCK TABLES `tb_users` WRITE;
/*!40000 ALTER TABLE `tb_users` DISABLE KEYS */;
INSERT INTO `tb_users` VALUES (0,'admin','$2a$10$veGcArz47VGj7l9xN7g2iuT9TF21jLI1YGXarGzvARNdnt4inC9PG','2018-05-27 16:25:33','2018-05-27 16:25:33',NULL);
/*!40000 ALTER TABLE `tb_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-28  0:25:41
```

2. 登录 MySQL:

```
$ mysql -uroot -p 
```
3. source `db.sql`

```
mysql> source db.sql
```
可以看到，db.sql 创建了 `db_apiserver` 数据库和 `tb_users` 表，并默认添加了一条记录（用户名：admin，密码：admin）：

```sql
mysql> select * from tb_users \G;
*************************** 1. row ***************************
       id: 0
 username: admin
 password: $2a$10$veGcArz47VGj7l9xN7g2iuT9TF21jLI1YGXarGzvARNdnt4inC9PG
createdAt: 2018-05-28 00:25:33
updatedAt: 2018-05-28 00:25:33
deletedAt: NULL
1 row in set (0.00 sec)
```

## 在配置文件中添加数据库配置

API 启动需要连接数据库，所以需要在配置文件 `conf/config.yaml` 中配置数据库的 IP、端口、用户名、密码和数据库名信息。

![](https://user-gold-cdn.xitu.io/2018/6/2/163be547b5b845dd?w=1713&h=1087&f=png&s=95176)

## 小结

本小节通过一步步操作，介绍了如何安装 MySQL 数据库，以及如何创建小册示例需要的数据库和表，为后面的小节作好环境准备。