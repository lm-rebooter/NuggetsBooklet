# 为用户处理模块增加 log 管理

作为一个程序员，log 管理几乎是必备技能，本小节将在原来代码的基础上，增加 log 管理，以方便调试。进入 log 目录，并创建 users 目录。
 
![](https://user-gold-cdn.xitu.io/2018/4/7/1629e7188017afcc?w=853&h=186&f=png&s=18537)
进入 `users_views.py`，导入 `logging` 模块，并指定 log 目录文件（`log/users/users.log`），指定 log 级别（`DEBUG`）和 log 保留方式（这里设定按天保存，保留 30 天的 log 记录），并在处理方法中加入对应的 log 信息。
 
![](https://user-gold-cdn.xitu.io/2018/4/7/1629e71ad3457ad9?w=534&h=588&f=png&s=38020)
 
![](https://user-gold-cdn.xitu.io/2018/4/7/1629e71c8fccad36?w=475&h=394&f=png&s=24933)
`users_views.py` 的完整代码如下：

```python
#! /usr/bin/python3
# -*- coding:utf-8 -*-

import tornado.web
from tornado.escape import json_decode
import logging
from logging.handlers import TimedRotatingFileHandler

#从commons中导入http_response方法
from common.commons import (
    http_response,
)

#从配置文件中导入错误码
from conf.base import (
    ERROR_CODE,
)
 

########## Configure logging #############
logFilePath = "log/users/users.log"
logger = logging.getLogger("Users")  
logger.setLevel(logging.DEBUG)  
handler = TimedRotatingFileHandler(logFilePath,  
                                   when="D",  
                                   interval=1,  
                                   backupCount=30)  
formatter = logging.Formatter('%(asctime)s \
%(filename)s[line:%(lineno)d] %(levelname)s %(message)s',)  
handler.suffix = "%Y%m%d"
handler.setFormatter(formatter)
logger.addHandler(handler)
 
 
class RegistHandle(tornado.web.RequestHandler):
    """handle /user/regist request
    :param phone: users sign up phone
    :param password: users sign up password
    :param code: users sign up code, must six digital code
    """
        
    def post(self):
        try:
            #获取入参
            args = json_decode(self.request.body)
            phone = args['phone']
            password = args['password']
            verify_code = args['code']
        except:
            #获取入参失败时，抛出错误码及错误信息
            logger.info("RegistHandle: request argument incorrect")
            http_response(self, ERROR_CODE['1001'], 1001)
            return 
            
        #处理成功后，返回成功码“0”及成功信息“ok”
        logger.debug("RegistHandle: regist successfully")
        http_response(self, ERROR_CODE['0'], 0)
```

再次执行 `main.py`
 
![](https://user-gold-cdn.xitu.io/2018/4/7/1629e7200615e2a4?w=998&h=169&f=png&s=25114)

HTTP 客户端发起正确的注册请求
 
![](https://user-gold-cdn.xitu.io/2018/4/7/1629e721e89630dc?w=760&h=577&f=png&s=25499)

查看 `log/users/users.log`
 
![](https://user-gold-cdn.xitu.io/2018/4/7/1629e723ba998464?w=1135&h=191&f=png&s=27275)

在日志文件中，日志的格式包含时间、文件名、打印代码行数、log 级别和自定义 log 信息。这些信息足以满足问题定位及排错。在前面的配置信息中，我们定义的 log 级别是 `DEBUG`，下面看看入参出错时，报的 `INFO` 日志。
 
![](https://user-gold-cdn.xitu.io/2018/4/7/1629e72638e45fe7?w=745&h=568&f=png&s=25457)

查看 `log/users/users.log`
 
![](https://user-gold-cdn.xitu.io/2018/4/7/1629e7283ad03005?w=1221&h=291&f=png&s=46000)

这里看到日志文件中多出了一行日志，级别为 INFO。前面我们也提到，我们定义了日志文件的记录保留，本小册由于是新建讲解项目，还无法直接查看日志保留记录。这里贴出之前项目的记录，可以看到历史保留文件是以天为后缀的，当天的文件还是在 `users.log` 中。
 
![](https://user-gold-cdn.xitu.io/2018/4/7/1629e72a64423a2c?w=742&h=450&f=png&s=28047)

## 代码下载

到目前为止，服务器端代码如下：  
[demo7](https://github.com/Jawish185/demo7.git)

## 小结

本小节简单介绍了日志服务在服务器端开发中的应用，开发者可以自定义 log 级别及其历史保留记录。开发者可以根据自己的喜好及习惯，去定义具体的级别和信息。下一小节，我们将讲解如何利用 ORM 的方式和数据库打交道，并将用户注册信息写入数据库中。
