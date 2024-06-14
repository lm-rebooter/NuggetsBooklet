## 前言

本篇我们讲解使用 Docker 部署我们的 Next.js 项目。

## Docker 直接部署

如果只是把项目部署上去，其实并不复杂。我给大家一个简单的、用于理解学习、演示核心要点的示例：

### 下载代码

我们以 Day11 分支的代码为例，此时我们的代码中使用了 Prisma + MySQL。

下载我们的 day11 分支代码：

```bash
git clone -b day11 git@github.com:mqyqingfeng/next-react-notes-demo.git
```

先本地运行一下，验证代码无问题：

```bash
# 注意本地开启 MySQL 后运行：
npm i && npm run dev
```

### 构建镜像

项目根目录新建 `.dockerignore`文件，代码如下：

```bash
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.next
docker
.git
```

项目根目录新建 `Dockerfile`，代码如下：

```bash
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install --registry=https://registry.npmmirror.com

RUN npx prisma generate

RUN chmod +x /startup.sh

EXPOSE 3000

ENTRYPOINT ["/startup.sh"]
```

注意：这里的镜像构建指令并不复杂，相信大家有[《实战篇 | React Notes | Docker 快速入门》](https://juejin.cn/book/7307859898316881957/section/7330567768579637299)的基础，都很容易理解。关于最后一句指令，我们并没有使用 `CMD`，而是 `ENTRYPOINT`，两者作用类似。使用 `ENTRYPOINT`，我们将执行内容放到了脚本文件 `startup.sh`中。

项目根目录新建 `startup.sh`文件，代码如下：

```bash
#!/bin/sh

MIGRATION_STATUS=$(npx prisma migrate status)

if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
    echo "No migrations needed."
else
    echo "Running migrations..."
    npx prisma migrate deploy
fi

npm run build && npm run start
```

执行的内容并不复杂，主要是因为我们使用了 Prisma，所以需要运行 `prisma generate`和`prisma migrate deploy`。`prisma generate`我们已经放到了构建指令中，`prisma migrate deploy`我们放到了运行脚本中。

项目根目录新建 `docker-compose.yml`文件，代码如下：

```bash
version: "3.9"

networks:
  react-notes:
    driver: bridge

services:

  mysql:
    image: mysql:8.0
    container_name: mysql
    command: --default-authentication-plugin=caching_sha2_password
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=admin
      - MYSQL_DATABASE=notes
      - MYSQL_USER=notes
      - MYSQL_PASSWORD=cpZfriEBbmJjWeiR
    ports:
      - '3306:3306'
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h127.0.0.1', '-P3306']
      interval: 5s
      timeout: 2s
      retries: 20
    networks:
      - react-notes

  next-app:
    container_name: next-app
    build:
      context: .
    restart: always
    ports:
      - 3000:3000
    networks:
      - react-notes
    depends_on:
      mysql:
        condition: service_healthy
```

在这段代码中，这里我们声明了 `mysql`的容器名为 `mysql`，并建立了一个名为 `notes` 的 MySQL 用户，对应修改根目录的 `env`文件为：

```bash
DATABASE_URL="mysql://notes:cpZfriEBbmJjWeiR@mysql:3306/notes"
```

稍微复杂一点的是 `healthcheck`，这是为了保证  mysql 完全运行后才运行 `next-app`。我们可以看到 `next-app`的 `depends_on` 里有 `mysql`，依赖的条件是 `service_healthy`，也就是说 `mysql` 的 `healthcheck` 要先通过才会运行 `next-app`。

### 服务器运行

服务器安装 Docker 和 Docker Compose，我是直接用宝塔安装了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f10eeac0383c46b88e4f5fc28a1f2741~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2964\&h=1008\&s=218772\&e=png\&b=fdfdfd)

注：安装的速度不算快，大概等待了 20 分钟。服务器直接安装可以参考：[《安装Docker并使用（Linux）》](https://help.aliyun.com/zh/ecs/use-cases/deploy-and-use-docker-on-alibaba-cloud-linux-2-instances)。

然后把代码推送到服务器，注意如果服务器已经开启了 MySQL，先关闭 MySQL。最后命令行进入服务器项目目录，运行 `docker compose up`，我们就成功的将项目运行在了服务器的 `3000` 端口。

如果参照过[《实战篇 | React Notes | 服务器部署》](https://juejin.cn/book/7307859898316881957/section/7309114747482275850)，因为已经设置过 Nginx，所以会将域名 `notes.yayujs.com`代理到 3000 端口，所以直接访问：<https://notes.yayujs.com/> 就会生效：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fdba5c3d57441179604541ff1baa46b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2314\&h=1420\&s=215361\&e=png\&b=f5f6f9)

如果你没有设置过，宝塔里也支持容器快捷的设置反向代理、绑定到具体的域名上：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f36725e335a434bbb8af55c85526e7d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3748\&h=1864\&s=503814\&e=png\&b=7c7c7c)

## Docker 本地开发

现在我们非常随意的就用 Docker 把代码部署到了服务器上。但是这样的方法只能说——又不是不能用……

问题依然很多，比如用了数据库却没有做数据持久化、Next.js 项目没有开启 `standalone` 输出模式，Docker 的镜像构建太过随意导致构建包很大等等……

实际上，选择用 Docker 选择的是一种开发方式。也就是说，不是在本地开发完了项目，最后用 Docker 部署一下，而是在本地开发项目的时候，就已经开始使用 Docker 了。

所以学习本篇不要着急，我们从头开始说起。

### 下载代码

先说说日常开发项目怎么使用 Docker。我们依然以 Day11 分支的代码为例，此时我们的代码中用了 Prisma + MySQL。

下载我们的 day11 分支代码：

```bash
git clone -b day11 git@github.com:mqyqingfeng/next-react-notes-demo.git
```

老规矩，先本地运行一下，验证代码无问题：

```bash
# 注意要在本地开启 MySQL 后运行：
npm i && npm run dev
```

### `.dockerignore`

项目根目录新建 `.dockerignore`文件，代码如下：

```bash
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.next
docker
.git
```

### `dev.Dockerfile`

项目根目录新建 `dev.Dockerfile`，代码如下：

```bash
FROM node:18-alpine

# RUN apt-get update -y
# RUN apt-get install -y openssl

WORKDIR /app

COPY . .

RUN npm i --registry=https://registry.npmmirror.com;

RUN chmod +x /app/dev.startup.sh

ENTRYPOINT ["sh", "/app/dev.startup.sh"]
```

在这段代码中：

我们新建的是 `dev.Dockerfile`，但跟 Next.js 的 `.env.development`不同的是，`.env.development` Next.js 是会自动读取的，但 Docker 并不会自动读取 `dev.Dockerfile`，所以名字其实可以乱取，我们只是为了方便区分不同环境的 Dockerfile。（PS：Docker 其实也支持[开发环境](https://docs.docker.com/desktop/dev-environments/)，不过目前处于开发停滞状态）

再解释下代码的含义。`RUN apt-get`这两句是为了避免出现类似于下面这样的错误提示（如果你遇到了这个问题的话，参考此 [GitHub Issue](https://github.com/prisma/prisma/issues/19729)，没有遇到就不用写了）：

> Prisma Client could not locate the Query Engine for runtime "debian-openssl-1.1.x".
>
> This happened because Prisma Client was generated for "debian-openssl-3.0.x", but the actual deployment required "debian-openssl-1.1.x".
>
> Add "debian-openssl-1.1.x" to `binaryTargets` in the "schema.prisma" file and run `prisma generate` after saving it:

然后指定工作目录，拷贝所有文件、安装依赖包、给脚本文件添加运行权限。最后用 ENTRYPOINT 指定了容器启动脚本。因为我们用了 Prisma，脚本内容比较多，所以单独使用了一个脚本文件。

### dev.startup.sh

项目根目录新建 `dev.startup.sh`文件，代码如下：

```bash
#!/bin/sh

MIGRATION_STATUS=$(npx prisma migrate status)

if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
    echo "No migrations needed."
else
    echo "Running migrations..."
    npx prisma migrate deploy
fi

npx prisma generate

if [ -f yarn.lock ]; then 
    yarn dev;
elif [ -f package-lock.json ]; then 
    npm run dev;
elif [ -f pnpm-lock.yaml ]; then 
    pnpm dev;
else 
    npm run dev;
fi
```

这段代码并不复杂，一是  Prisma 相关处理，二是运行 `npm run dev`开启开发模式。你可能会问，`prisma generate`怎么又放到了脚本里执行？之前不是放在镜像构建指令里吗？其实这里放哪里都可以的。（但是线上部署的时候因为开启了 standalone 输出模式只能放在构建指令中）

### dev.docker-compose.yml

项目根目录新建 `dev.docker-compose.yml` 文件，代码如下：

```bash
version: "3.8"

networks:
  react-notes-dev:
    driver: bridge

services:
  next-app-dev:
    container_name: next-app
    build:
      context: .
      dockerfile: dev.Dockerfile
    env_file:
      - .env
      - .env.development
    volumes:
      - .:/app
    restart: always
    ports:
      - 3000:3000
    networks:
      - react-notes-dev
    depends_on:
      mysql:
        condition: service_healthy
      
  mysql:
    image: mysql:8.0
    container_name: next-app-mysql
    command: --default-authentication-plugin=caching_sha2_password
    restart: unless-stopped
    # volumes:
    #   - ./docker/data/mysql/:/var/lib/mysql/
    environment:
      - MYSQL_ROOT_PASSWORD=admin
      - MYSQL_DATABASE=notes
      - MYSQL_USER=notes
      - MYSQL_PASSWORD=cpZfriEBbmJjWeiR
    ports:
      - '3306:3306'
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h127.0.0.1', '-P3306']
      interval: 5s
      timeout: 2s
      retries: 20
    networks:
      - react-notes-dev
```

这段代码也很好理解，注意 `next-app` 的数据卷，因为我们将项目的所有内容都挂载到工作目录 `/app` 下，当我们修改项目文件时，Docker 里运行的项目也会正常发生修改，所以即便使用了 Docker 也继续支持热更新。

根目录的 `.env.development`文件对应修改为：

```bash
DATABASE_URL="mysql://notes:cpZfriEBbmJjWeiR@next-app-mysql:3306/notes"
```

此时运行 `docker compose -f dev.docker-compose.yml up`，本地访问 `http://localhost:3000/`应该已经可以正常运行：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64220caad6f3443ab4cc10d16bf4832a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2066\&h=1402\&s=190810\&e=png\&b=f6f7fa)

### host

使用 `next-auth` 的时候，如果部署到线上环境，可能需要额外设置一下 `AUTH_URL`。对于初学者而言，又有可能忘记这件事情，于是明明在本地运行没有问题，但发布到线上后就出现了问题……干脆我们本地开发的时候就直接使用线上域名进行开发！

我们设想的开发方式是本地浏览器访问 `https://notes.yayujs.com`就会进入我们本地启用的页面。为此你需要修改主机的 `host`:

```bash
# 修改 host 文件
vim /etc/hosts

# 添加如下：
127.0.0.1 notes.yayujs.com
```

其实修改 host 并不算复杂，但是发布到线上又需要注释掉对应的域名才能查看效果，开发本地又需要解开注释才能查看效果。一来二去也就麻烦了，为此你可以使用 [SwitchHosts](https://switchhosts.vercel.app/zh) 这个软件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc729867964240c0a7454d949b6c148a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1600\&h=960\&s=75890\&e=png\&b=ffffff)

借助 SwitchHosts 这个软件，你可以轻松切换 host。

注意：如果切换 host 后，浏览器没有成功解析，你可以进行这样一些尝试：

有可能是浏览器做了 DNS 缓存或其他处理。浏览器打开 `chrome://net-internals/#sockets`，点击 `Flush Socket Pools`。注意 Flush 的是当前窗口里的所有页面。

有可能是使用了代理导致。这个时候就需要将你的域名放到代理的排除名单里。我们以 ClashX 为例，打开 `~/.config/clash`，添加一个名为 `proxyIgnoreList.plist`的文件，代码如下：

    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <array>
        <string>192.168.0.0/16</string>
        <string>10.0.0.0/8</string>
        <string>172.16.0.0/12</string>
        <string>127.0.0.1</string>
        <string>localhost</string>
        <string>*.local</string>
        <string>http://notes.yayujs.com</string>
        <string>https://notes.yayujs.com</string>
    </array>
    </plist>

在 `<string>`标签中添加要排除的域名，然后重启 ClashX 即可。

设置 host 后，此时访问 <http://notes.yayujs.com:3000/>：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/898c1187d9d048d5bd903979b0ab77f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2066\&h=1402\&s=195133\&e=png\&b=f6f7fa)

注：此时也只是能正常访问首页，功能比如登录还有问题

### nginx

我们的目标是本地访问 `https://notes.yayujs.com`的时候可以进入我们的开发页面，通过 switchHosts 关闭相关 host 的时候，访问 `https://notes.yayujs.com`则会进入我们的线上部署页面。为此我们需要用到 nginx 镜像。

修改 `dev.docker-compose.yml` 文件，完整代码如下：

```bash
version: "3.8"

networks:
  react-notes-dev:
    driver: bridge

services:
  next-app-dev:
    container_name: next-app
    build:
      context: .
      dockerfile: dev.Dockerfile
    env_file:
      - .env
      - .env.development
    volumes:
      - .:/app
    restart: always
    ports:
      - 3000:3000
    networks:
      - react-notes-dev
    depends_on:
      mysql:
        condition: service_healthy
      
  mysql:
    image: mysql:8.0
    container_name: next-app-mysql
    command: --default-authentication-plugin=caching_sha2_password
    restart: unless-stopped
    # volumes:
    #   - ./docker/data/mysql/:/var/lib/mysql/
    environment:
      - MYSQL_ROOT_PASSWORD=admin
      - MYSQL_DATABASE=notes
      - MYSQL_USER=notes
      - MYSQL_PASSWORD=cpZfriEBbmJjWeiR
    ports:
      - '3306:3306'
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h127.0.0.1', '-P3306']
      interval: 5s
      timeout: 2s
      retries: 20
    networks:
      - react-notes-dev

  nginx:
    image: nginx
    container_name: next-app-nginx
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/ssl/notes.yayujs.com.key:/etc/nginx/ssl/notes.yayujs.com.key
      - ./docker/ssl/notes.yayujs.com.pem:/etc/nginx/ssl/notes.yayujs.com.pem
    ports:
      - 80:80
      - 443:443
    restart: always
    networks:
      - react-notes-dev
    depends_on:
      - next-app-dev
```

项目根目录新建 `docker`文件夹，然后新建 `nginx.conf`，代码如下：

```javascript
events {
    worker_connections   1000;
}
http {
    include /etc/nginx/mime.types;
    upstream nextjs_upstream {
        server next-app:3000;
    }
    server {
        listen 80;
        listen 443 ssl;
        server_name  notes.yayujs.com;

        ssl_certificate /etc/nginx/ssl/notes.yayujs.com.pem;
        ssl_certificate_key /etc/nginx/ssl/notes.yayujs.com.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        
        gzip on;
        gzip_proxied any;
        gzip_comp_level 4;
        gzip_types text/css application/javascript image/svg+xml;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;

        location / {
          proxy_pass http://nextjs_upstream;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header REMOTE-HOST $remote_addr;
          add_header X-Cache $upstream_cache_status;
          proxy_set_header X-Host $host;
          proxy_set_header X-Scheme $scheme;
          proxy_connect_timeout 30s;
          proxy_read_timeout 86400s;
          proxy_send_timeout 30s;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
        }
    }
}
```

同时在 `docker`目录下新建 `ssl`文件夹，然后放入开启 https 会用到的 key 和 pem 文件。

注：按理说这些再加上设置 AUTH\_URL 就够了，但是因为用的是 next-auth v5 beta 版本，目前还不算稳定，如果不使用 AUTH\_URL，点击 `signIn` 的时候跳转地址的 callbackUrl 会设置为 `localhost:3000`，如果添加 `AUTH_URL`，会出现报错：

> TypeError: next\_dist\_server\_web\_exports\_next\_request\_\_WEBPACK\_IMPORTED\_MODULE\_0\_\_ is not a constructor

根据这个 [GitHub Issue](https://github.com/nextauthjs/next-auth/issues/9922) 的描述，此问题会由 Next.js 修复，但目前还没有发布到稳定版。对此我的处理方式是在 `next-auth` 的 `redirects` 回调函数中做一层处理，修改 `auth.js`：

```javascript
import NextAuth from "next-auth"
// import GitHub from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { addUser, getUser } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers:[CredentialsProvider({
    // 显示按钮文案 (e.g. "Sign in with...")
    name: "密码登录",
    // `credentials` 用于渲染登录页面表单
    credentials: {
      username: { label: "账号", type: "text", placeholder: "输入您的账号" },
      password: { label: "密码", type: "password", placeholder: "输入您的密码" }
    },
    // 处理从用户收到的认证信息
    async authorize(credentials, req) {
      // 默认情况下不对用户输入进行验证，确保使用 Zod 这样的库进行验证
      let user = null

      // 登陆信息验证
      user = await getUser(credentials.username, credentials.password)

      // 密码错误
      if (user === 1) return null

      // 用户注册
      if (user === 0) {
        user = await addUser(credentials.username, credentials.password)
      }

      if (!user) {
        throw new Error("User was not found and could not be created.")
      }

      return user
    }
  })],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname.startsWith("/note/edit")) return !!auth
      return true
    },
    async jwt({ token, user, account }) {
      if (account && account.type === "credentials" && user) {
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.userId = token.userId
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      if (baseUrl.indexOf(":3000") > -1) return url
      return baseUrl
    }
  },
  trustHost: true
})
```

运行：

```bash
# 删除掉之前的容器
docker compose -f dev.docker-compose.yml down
# 重新构建镜像
docker compose -f dev.docker-compose.yml up --build
```

本地访问 <https://notes.yayujs.com>，此时应该可以正常运行：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cf6f360baeb42759c2d47975f13281b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2724\&h=924\&s=179622\&e=png\&b=f6f7fa)

那么问题来了，如果我切换了 host，我如何知道浏览器打开的地址访问的是线上还是本地呢？

方法有很多种，一种简单的方式是查看页面请求头，如果是本地：

![截屏2024-02-20 16.39.06.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77dd7483d4054df58655b1acf09c310a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2844\&h=986\&s=383087\&e=png\&b=fefefe)

如果是线上：

![截屏2024-02-20 16.40.20.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0876cedc756343d0b886c5c68d9cbad8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2834\&h=950\&s=397105\&e=png\&b=fefefe)

如果切换后没有生效，就参照上节讲的两种方式试试。

至此我们就用 Docker 搭建了一个开发环境，我们的目标是：

1.  提供一个一致的开发环境，不用在每台主机上都配置一遍
2.  模拟复制一个线上环境，不用担心漏掉某些配置
3.  正常本地开发 Next.js 项目的功能如热更新继续支持，能够实时查看效果

## Docker 生产部署

接下来我们看看生产部署的时候要做些什么。

其实主要就两件事情，一是编译和运行生产版本，二是减少镜像大小，毕竟我们开发时构建的镜像包都快有 1G 了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1b08af1f74a4adea1bb5b1a66b9aba9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2556\&h=234\&s=54098\&e=png\&b=f9f9fa)

这谁能忍？（其实我能忍，但为了显得我精益求精、既要又要还要，我们还是努力优化一下……）

减少镜像的大小，主要是开启 Next.js 项目的 standalone 模式，然后优化镜像构建。

注：关于 standalone 输出模式的介绍可以查看[《API 篇 | next.config.js（下）》](https://juejin.cn/book/7307859898316881957/section/7309079467967414310)

那就让我们开始吧。

修改 `next.config.js`，开启 standalone 输出模式，代码如下：

```javascript
const nextConfig = {
  output: 'standalone'
}
module.exports = nextConfig
```

项目根目录新建 `prod.Dockerfile`，代码如下：

```dockerfile
FROM node:18-alpine AS base

FROM base AS builder

WORKDIR /app

COPY . .

RUN npm i --registry=https://registry.npmmirror.com;

RUN npx prisma generate

RUN npm run build;

FROM base AS runner

WORKDIR /app

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED 1

COPY prisma ./prisma/
COPY prod.startup.sh ./prod.startup.sh
RUN chmod +x /app/prod.startup.sh

ENTRYPOINT ["sh", "/app/prod.startup.sh"]
```

项目根目录新建 `prod.startup.sh`，代码如下：

```bash
#!/bin/sh

MIGRATION_STATUS=$(npx prisma migrate status)

if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
    echo "No migrations needed."
else
    echo "Running migrations..."
    npx prisma migrate deploy
fi

node server.js
```

项目根目录新建 `prod.docker-compose.yml`，代码如下：

```yaml
version: "3.8"

networks:
  react-notes-prod:
    driver: bridge

services:
  next-app-prod:
    container_name: next-app
    build:
      context: .
      dockerfile: prod.Dockerfile
    env_file:
      - .env
      - .env.production
    restart: always
    ports:
      - 3000:3000
    networks:
      - react-notes-prod
    depends_on:
      mysql:
        condition: service_healthy
      
  mysql:
    image: mysql:8.0
    container_name: next-app-mysql
    command: --default-authentication-plugin=caching_sha2_password
    restart: unless-stopped
    # volumes:
    #   - ./docker/data/mysql/:/var/lib/mysql/
    environment:
      - MYSQL_ROOT_PASSWORD=admin
      - MYSQL_DATABASE=notes
      - MYSQL_USER=notes
      - MYSQL_PASSWORD=cpZfriEBbmJjWeiR
    ports:
      - '3306:3306'
    healthcheck:
      test: ['CMD', 'mysqladmin', 'ping', '-h127.0.0.1', '-P3306']
      interval: 5s
      timeout: 2s
      retries: 20
    networks:
      - react-notes-prod

  nginx:
    image: nginx
    container_name: next-app-nginx
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/ssl/notes.yayujs.com.key:/etc/nginx/ssl/notes.yayujs.com.key
      - ./docker/ssl/notes.yayujs.com.pem:/etc/nginx/ssl/notes.yayujs.com.pem
    ports:
      - 80:80
      - 443:443
    restart: always
    networks:
      - react-notes-prod
    depends_on:
      - next-app-prod
```

修改 `.env`：

```bash
DATABASE_URL="mysql://notes:cpZfriEBbmJjWeiR@next-app-mysql:3306/notes"
```

修改 `.env.production`：

```bash
# 注释掉 AUTH_URL，因为会导致报错，预计会在 Next.js v14.1.1 版本修复
# AUTH_URL=https://notes.yayujs.com
```

因为容器名不能重复，我们删除掉之前用于开发模式的容器：

```bash
docker compose -f dev.docker-compose.yml down
```

然后构建镜像并运行生产模式的容器：

```javascript
docker compose -f prod.docker-compose.yml up
```

此时本地应该可以正常访问：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51c8e657d9ad47bf8d85b9d8cb9d983a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1974\&h=1088\&s=153185\&e=png\&b=f5f6f9)

查看镜像大小：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e7b556b89144e2690b4c5cdcf535655~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2210\&h=220\&s=52964\&e=png\&b=161b1f)

镜像从之前的 830M 优化到了现在的 169M，可喜可贺！（懒得继续优化了……）

部署到线上的方式也很简单：

将代码推送到服务器上，然后登陆服务器，进入到项目根目录，运行相同的命令：

```bash
docker compose -f prod.docker-compose.yml up
```

如果参照[《实战篇 | React Notes | 服务器部署》](https://juejin.cn/book/7307859898316881957/section/7309114747482275850)在宝塔设置过 Node 项目，记得删除 Node 项目或者修改对应的 Nginx 配置，否则可能会因为端口占用影响容器运行。

现在我们又一次用 Docker 把代码部署到了服务器上，还做了不少优化，但是这样的方法只能说——勉强能用……

大问题基本解决，小问题依然很多：比如还是没有解决数据库持久化问题，不过这个比较简单，参考上篇 [《实战篇 | React Notes | Docker 快速入门》](https://juejin.cn/book/7307859898316881957/section/7330567768579637299)即可自己创建数据卷。如果大家在实际的开发中用到 Redis，比如用 Redis 做数据缓存，也可以参考《实战篇 | React Notes | Docker 快速入门》中的 Docker Compose 配置。

比如目前我们虽然构建了两个镜像，但因为容器名不能重复，所以我们运行本地或者线上的时候，都要删除掉之前的容器再重新开一个容器，如果分别建立两个容器，Nginx 配置需要做两份或者改为读取环境变量的方式，这又要做一点配置工作。此外流程上还可以借助 Jenkins 实现 CI/CD，优化开发流程……

总之任重而道远。Docker 会用就好用，不会用的时候要踩一堆坑，我们慢慢讲解。后面的项目我们会继续用 Docker 作为基本的开发方式。

本篇项目源码：<https://github.com/mqyqingfeng/next-react-notes-demo/tree/day12>

## 参考链接

1.  <https://stackoverflow.com/questions/76698529/how-to-update-the-prisma-in-a-production-docker-instance>
2.  <https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose/next-app/dev.Dockerfile>
3.  <https://github.com/prisma/prisma/blob/main/docker/docker-compose.yml>
4.  <https://github.com/prisma/prisma-examples/blob/latest/databases/mongodb/docker-compose.yml>
5.  <https://github.com/nextauthjs/next-auth/issues/9922>
6.  <https://gist.github.com/malteneuss/a7fafae22ea81e778654f72c16fe58d3>
7.  <https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client>
