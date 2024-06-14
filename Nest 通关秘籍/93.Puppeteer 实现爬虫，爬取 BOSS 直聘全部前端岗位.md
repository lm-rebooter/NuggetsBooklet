我们在找工作的时候，都会用 boss 直聘、拉钩之类的 APP 投简历。

根据职位描述筛选出适合自己的来投。

此外，职位描述也是我们简历优化的方向，甚至是平时学习的方向。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64f41bb318ea4ac0ad747e5d79575265~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1578&h=1028&s=271262&e=png&b=fefefe)

所以我觉得招聘网站的职位描述还是挺有价值的，就想把它们都爬取下来存到数据库里。

今天我们一起来实现下。

爬取数据我们使用 Puppeteer 来做，然后用 TypeORM 把爬到的数据存到 mysql 表里。

创建个项目：

```
mkdir jd-spider
cd jd-spider
npm init -y
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91c31c077058466c9a56e27bdafb0450~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=860&h=666&s=125266&e=png&b=000000)

进入项目，安装 puppeteer：

```
npm install --save puppeteer
```

我们要爬取的是 boss 直聘的网站数据。

首先，进入[搜索页面](https://www.zhipin.com/web/geek/job?query=%E5%89%8D%E7%AB%AF&city=100010000)，选择全国范围，搜索前端：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3608e2ed5b014e768043743f7b6f7f00~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1942&h=1268&s=1338255&e=gif&f=40&b=fcfcfc)

然后职位列表的每个点进去查看描述，把这个岗位的信息和描述抓取下来：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25f97e689fb3435d884efbdcd298bf9d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1942&h=1268&s=2453118&e=gif&f=37&b=fdfdfd)

创建 test.js

```javascript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
        width: 0,
        height: 0
    }
});

const page = await browser.newPage();

await page.goto('https://www.zhipin.com/web/geek/job');

await page.waitForSelector('.job-list-box');

await page.click('.city-label', {
    delay: 500
});

await page.click('.city-list-hot li:first-child', {
    delay: 500
});

await page.focus('.search-input-box input');

await page.keyboard.type('前端', {
    delay: 200
});

await page.click('.search-btn', {
    delay: 1000
});
```
调用 launch 跑一个浏览器实例，指定 headless 为 false 也就是有界面。

defaultView 设置 width、height 为 0 是网页内容充满整个窗口。

然后就是自动化的流程了：

首先进入职位搜索页面，等 job-list-box 这个元素出现之后，也就是列表加载完成了。

就点击城市选择按钮，选择全国。

然后在输入框输入前端，点击搜索。

然后跑一下。

跑之前在 package.json 设置 type 为 module，也就是支持 es module 的 import：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d84b572a639e4c54b2ab475caa175dfd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=526&h=346&s=47857&e=png&b=202020)

```
node ./test.js
```
它会自动打开一个浏览器窗口：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b49f9a105fe4b80b6974a4506253d34~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2224&h=1328&s=963516&e=gif&f=41&b=1a1a1a)

然后执行自动化脚本：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b5eb0ec636c4aae9bab904cae3dca43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2224&h=1328&s=3039422&e=gif&f=55&b=fefefe)

这样，下面的列表数据就是可以抓取的了。

不过这里其实没必要这么麻烦，因为只要你 url 里带了 city 和 query 的参数，会自动设置为搜索参数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb3816d3f7e34a10910630998a969310~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1904&h=1294&s=421979&e=png&b=fefefe)

所以直接打开这个 url 就可以：

```javascript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
        width: 0,
        height: 0
    }
});

const page = await browser.newPage();

await page.goto('https://www.zhipin.com/web/geek/job?query=前端&city=100010000');

await page.waitForSelector('.job-list-box');
```
然后我们要拿到页数，用来访问列表的每页数据。

怎么拿到页数呢？

其实就是拿 options-pages 的倒数第二个 a 标签的内容：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f65f7ab734a4cf5ae1c3ef69510d665~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1396&h=708&s=181545&e=png&b=ffffff)

```javascript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
        width: 0,
        height: 0
    }
});

const page = await browser.newPage();

await page.goto('https://www.zhipin.com/web/geek/job?query=前端&city=100010000');

await page.waitForSelector('.job-list-box');

const res = await page.$eval('.options-pages a:nth-last-child(2)', el => {
    return parseInt(el.textContent)
});

console.log(res);
```

$eval 第一个参数是选择器，第二个参数是对选择出的元素做一些处理后返回。

跑一下：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4551f481f16941ec9d9030172d8edd10~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=740&h=166&s=19530&e=png&b=191919)

页数没问题。

然后接下来就是访问每页的列表数据了。

就是在 url 后再带一个 page 的参数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca2993be235b46f991bcfc4cc613d4e1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1360&h=876&s=203355&e=png&b=fefefe)

然后，我们遍历访问每页数据，拿到每个职位的信息：

```javascript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
        width: 0,
        height: 0
    }
});

const page = await browser.newPage();

await page.goto('https://www.zhipin.com/web/geek/job?query=前端&city=100010000');

await page.waitForSelector('.job-list-box');

const totalPage = await page.$eval('.options-pages a:nth-last-child(2)', e => {
    return parseInt(e.textContent)
});

const allJobs = [];
for(let i = 1; i <= totalPage; i ++) {
    await page.goto('https://www.zhipin.com/web/geek/job?query=前端&city=100010000&page=' + i);

    await page.waitForSelector('.job-list-box');

    const jobs = await page.$eval('.job-list-box', el => {
        return [...el.querySelectorAll('.job-card-wrapper')].map(item => {
            return {
                job: {
                    name: item.querySelector('.job-name').textContent,
                    area: item.querySelector('.job-area').textContent,
                    salary: item.querySelector('.salary').textContent
                },
                link: item.querySelector('a').href,
                company: {
                    name: item.querySelector('.company-name').textContent,
                }
            }
        })
    });
    allJobs.push(...jobs);
}

console.log(allJobs);
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fc855414f844db4b4a1d312fd8e9e55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1520&h=1144&s=267097&e=png&b=1f1f1f)

具体的信息都是从 dom 去拿的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59e84b44db2845ceba1383ae9bf99a48~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1632&h=866&s=315365&e=png&b=fefefe)

跑一下试试：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff27d24e98bf48b5b3308f9983b59b72~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2224&h=1124&s=2368796&e=gif&f=32&b=fcfcfc)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5234507b1ff644e0932b9b843ed2c1bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1464&h=1004&s=265647&e=png&b=181818)

可以看到，它会依次打开每一页，然后把职位数据爬取下来。

做到这一步还不够，我们要点进去这个链接，拿到 jd 的描述。

[](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38c311e0bdcf4db6b8d15bf173ed058f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1076&h=756&s=122606&e=png&b=1f1f1f)
```javascript
for(let i = 0; i< allJobs.length; i ++) {
    await page.goto(allJobs[i].link);

    try{
        await page.waitForSelector('.job-sec-text');

        const jd= await page.$eval('.job-sec-text', el => {
            return el.textContent
        });
        allJobs[i].desc = jd;

        console.log(allJobs[i]);
    } catch(e) {}
}

```
try catch 是因为有的页面可能打开会超时导致中止，这种就直接跳过好了。

跑一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba3dcdb20d1742b8a40ecd6a0157b748~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2224&h=1124&s=779848&e=gif&f=36&b=2f495d)

它同样会自动打开每个岗位详情页，拿到职位描述的内容，并打印在控制台。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3644003abe114974a64c1e1db1d96f0a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1686&h=910&s=10214544&e=gif&f=43&b=181818)

接下来只要把这些存入数据库就好了。

我们新建个 nest 项目：

```
npm install -g @nestjs/cli

nest new boss-jd-spider
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8bae052c7e149d0832a978a267c674b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=888&h=692&s=159575&e=png&b=020202)

用 docker 把 mysql 跑起来：

从 [docker 官网](https://docker.com/)下载 docker desktop，这个是 docker 的桌面端：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d7da48155df448698ae5fc57072fe0b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2380\&h=1336\&s=459767\&e=png\&b=ffffff)

跑起来后，搜索 mysql 镜像（这步需要科学上网），点击 run：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/659eaef5c4b8445a8c7224981515c1fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2368\&h=1460\&s=326395\&e=png\&b=7a7a7b)

输入容器名、端口映射、以及挂载的数据卷，还要指定一个环境变量：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33961dc3a8cd4d9c805c2ff096a1caf9~tplv-k3u1fbpfcp-watermark.image#?w=1332\&h=1428\&s=187941\&e=png\&b=ffffff)

端口映射就是把宿主机的 3306 端口映射到容器里的 3306 端口，这样就可以在宿主机访问了。

数据卷挂载就是把宿主机的某个目录映射到容器里的 /var/lib/mysql 目录，这样数据是保存在本地的，不会丢失。

而 MYSQL\_ROOT\_PASSWORD 的密码则是 mysql 连接时候的密码。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7db618f4e4b4ca3b0b44752450d4322~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2232\&h=1326\&s=496885\&e=png\&b=ffffff)

跑起来后，我们用 GUI 客户端连上，这里我们用的是 mysql workbench，这是 mysql 官方提供的免费客户端：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1311f9991e248de8a9cdd92c9b72a15~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=270\&h=270\&s=40789\&e=png\&b=9b5801)

连接上之后，点击创建 database：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76b5b5d5a2814853a3f87e23d92e4724~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1384&h=800&s=238779&e=png&b=e6e4e4)

指定名字、字符集为 utf8mb4，然后点击右下角的 apply。

创建成功之后在左侧就可以看到这个 database 了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3f6a454a1504779aedf6dc13f4fea4d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=540&h=244&s=39017&e=png&b=e5e0df)

当然，现在还没有表。

我们在 Nest 里用 TypeORM 连接 mysql。

安装用到的包：
```
npm install --save @nestjs/typeorm typeorm mysql2
```
mysql2 是数据库驱动，typeorm 是我们用的 orm 框架，而 @nestjs/tyeporm 是 nest 集成 typeorm 用的。

在 AppModule 里引入 TypeORM，指定数据库连接配置：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c69193db961c4c4d87d54e0157b511b0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=994&h=1078&s=190450&e=png&b=1f1f1f)

```javascript
TypeOrmModule.forRoot({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "guang",
  database: "boss-spider",
  synchronize: true,
  logging: true,
  entities: [],
  poolSize: 10,
  connectorPackage: 'mysql2',
  extra: {
      authPlugin: 'sha256_password',
  }
}),
```

然后创建个 entity：

src/entities/Job.ts

```javascript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Job {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 30,
        comment: '职位名称'
    })
    name: string;

    @Column({
        length: 20,
        comment: '区域'
    })
    area: string;

    @Column({
        length: 10,
        comment: '薪资范围'
    })
    salary: string;

    @Column({
        length: 600,
        comment: '详情页链接'
    })    
    link: string;

    @Column({
        length: 30,
        comment: '公司名'
    })   
    company: string;

    @Column({
        type: 'text',
        comment: '职位描述'
    })
    desc: string;
}
```
链接可能很长，所以设置为 600，而职位描述就更长了，直接设置 text 就行，它可以存储大段文本。

在 AppModule 引入：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bc3c5de72ff4723a73124fad378655d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=844&h=908&s=168374&e=png&b=1f1f1f)

把服务跑起来：

```
npm run start:dev
```
TypeORM会自动建表:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80140981a5b749e4a6cb19025a340660~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1974&h=724&s=305999&e=png&b=191919)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb92d013305347c9b41c408dbfbf9e81~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1134&h=566&s=208834&e=png&b=efecec)

然后我们加个启动爬虫的接口：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/844085e6df0f4deeadd7db63bd40e7df~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=984&h=748&s=133242&e=png&b=1f1f1f)

```javascript
@Get('start-spider')
startSpider() {
    this.appService.startSpider();
    return '爬虫已启动';
}
```
安装 puppeteer：

```
npm install --save puppeteer
```
在 AppService 里实现 startSpider：

```javascript
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async startSpider() {
    const browser = await puppeteer.launch({
        headless: false
        ,
        defaultViewport: {
            width: 0,
            height: 0
        }
    });

    const page = await browser.newPage();

    await page.goto('https://www.zhipin.com/web/geek/job?query=前端&city=100010000');

    await page.waitForSelector('.job-list-box');

    const totalPage = await page.$eval('.options-pages a:nth-last-child(2)', e => {
        return parseInt(e.textContent)
    });

    const allJobs = [];
    for(let i = 1; i <= totalPage; i ++) {
        await page.goto('https://www.zhipin.com/web/geek/job?query=前端&city=100010000&page=' + i);

        await page.waitForSelector('.job-list-box');

        const jobs = await page.$eval('.job-list-box', el => {
            return [...el.querySelectorAll('.job-card-wrapper')].map(item => {
                return {
                    job: {
                        name: item.querySelector('.job-name').textContent,
                        area: item.querySelector('.job-area').textContent,
                        salary: item.querySelector('.salary').textContent
                    },
                    link: item.querySelector('a').href,
                    company: {
                        name: item.querySelector('.company-name').textContent
                    }
                }
            })
        });
        allJobs.push(...jobs);
    }

    // console.log(allJobs);

    for(let i = 0; i< allJobs.length; i ++) {
        await page.goto(allJobs[i].link);

        try{
            await page.waitForSelector('.job-sec-text');

            const jd= await page.$eval('.job-sec-text', el => {
                return el.textContent
            });
            allJobs[i].desc = jd;

            console.log(allJobs[i]);
        } catch(e) {}
    }
  }
  
}
```

这里原封不动的把之前的爬虫逻辑复制了过来，只是把 headless 设置为了 true，因为我们不需要界面。

浏览器访问下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c3771b0555b4cd5aad11e492399018b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=908&h=252&s=24791&e=png&b=ffffff)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/006ea5a260a24df28e00a679b60bbe99~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1806&h=1226&s=674664&e=png&b=181818)

爬虫跑的没啥问题。

不过这个过程中 boss 可能会检测到你访问频率过高，会让你做下是不是真人的验证：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e8590f9018b478eb63031c00a22d30f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1780&h=1102&s=155397&e=png&b=eef0f5)

这个就是验证码点点就好了。

然后我们把数据存到数据库里：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38e011871cd14870a8a1dfcdfc720566~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1092&h=990&s=204799&e=png&b=1f1f1f)

用 EntityManager 来 save 就好了：

```javascript
@Inject(EntityManager)
private entityManager: EntityManager;
```
```javascript
const job = new Job();

job.name = allJobs[i].job.name;
job.area = allJobs[i].job.area;
job.salary = allJobs[i].job.salary;
job.link = allJobs[i].link;
job.company = allJobs[i].company.name;
job.desc = allJobs[i].desc;

await this.entityManager.save(Job, job);
```
再跑下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/174db8ed016140e7b2252ebe22320461~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=832&h=210&s=23434&e=png&b=ffffff)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/854c4ef9a33b48c6a9845d27007b5588~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1686&h=910&s=5167759&e=gif&f=35&b=1a1a1a)

去数据库里看下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbc3086343d94d75a3820a58ea0c1188~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1250&h=648&s=424247&e=png&b=f7f7f7)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cc9688ff68a44dd8b68de63dc11896c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1256&h=656&s=471799&e=png&b=f6f6f6)

这样，你就可以对这些职位描述做一些搜索，分析之类的了。
 
比如搜索职位描述中包含 react 的岗位：

```sql
SELECT * FROM `boss-spider`.job where `desc` like "%React%";
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84c759b449424ca19a591b127e5402d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1234&h=766&s=412429&e=png&b=f7f7f7)

这样，爬虫就做完了。

如果想在前端实时看到爬取到的数据，可以通过 SSE 来实时返回：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e357dd1fdcda4a5a8dda77c91834beea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=792&h=184&s=22514&e=png&b=ffffff)

这样用：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4b36d04da9b4038ba500018334d6a32~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=702&h=526&s=76304&e=png&b=202020)

这里我们就不改了。

案例代码上传了 nest 小册仓库：https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/boss-jd-spider

## 总结

我们通过 puppeteer 实现了对 BOSS 直聘网站的前端职位的爬取，并用 Nest + TypeORM 把数据保存到了数据库里。

这样就可以在本地对这些职位数据做一些处理或分析了。
