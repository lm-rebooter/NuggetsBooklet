作为前端开发，想必经常做的事情就是：调接口、画页面、调接口、画页面...

调用的接口大概率是 restful 的，也就是类似这种：

/students 查询所有学生信息

/student/1 查询 id 为 1 的学生信息

上面说的是 get 请求。

如果对 /student/1 发送 POST、PUT、DELETE 请求，就分别代表了新增、修改、删除。

这就是 restful 风格的 web 接口。

这种接口返回什么信息是服务端那边决定的，客户端只是传一下参数。

而不同场景下需要的数据不同，这时候可能就得新开发一个接口。特别是在版本更新的时候，接口会有所变动。

这样就很容易导致一大堆类似的接口。

facebook 当时也遇到了这个问题，于是他们创造了一种新的接口实现方案：GraphQL。

用了 GraphQL 之后，返回什么数据不再是服务端说了算，而是客户端自己决定。

服务端只需要提供一个接口，客户端通过这个接口就可以取任意格式的数据，实现 CRUD。

比如想查询所有的学生，就可以这样：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69766c3214044ea9bb39bccec27ea53f~tplv-k3u1fbpfcp-watermark.image?)

想再查询他们的年龄，就可以这样：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4e0ec81d7bd4ed4bf6c0db6313cdabd~tplv-k3u1fbpfcp-watermark.image?)

想查询老师的名字和他教的学生，就可以这样：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29f59758180547c0b5e36f6f8bb85ad4~tplv-k3u1fbpfcp-watermark.image?)

而这些都是在一个 http 接口里完成的！

感受了 GraphQL 的好处了没？

**一个 http 接口就能实现所有的 CRUD！**

那这么强大的 GraphQL 是怎么实现的呢？

我们先写个 demo 快速入门一下：

facebook 提供了 graphql 的 npm 包，但那个封装的不够好，一般我们会用基于 graphql 包的 @apollo/server 和 @apollo/client 的包来实现 graphql。

```
mkdir graphql-crud-demo
cd graphql-crud-demo
npm init -y
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fddedf2692a44a91af0ef6c0f02271bb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=936&h=668&s=94837&e=png&b=010101)

安装用到的包：

```
npm install @apollo/server
```
然后在 index.js 写一下这段代码：

```javascript
import { ApolloServer } from '@apollo/server';

const typeDefs = `
  type Student {
    id: String,
    name: String,
    sex: Boolean
    age: Int
  }

  type Teacher {
    id: String,
    name: String,
    age: Int,
    subject: [String],
    students: [Student]
  }

  type Query {
    students: [Student],
    teachers: [Teacher],
  }

  schema {
    query: Query
  }
`;
```

比较容易看懂，定义了一个 Student 的对象类型，有 id、name、sex、age 这几个字段。

又定义了一个 Teacher 的对象类型，有 id、name、age、subject、students 这几个字段。students 字段是他教的学生的信息。

然后定义了查询的入口，可以查 students 和 teachers 的信息。

这样就是一个 schema。

对象类型和对象类型之间有关联关系，老师关联了学生、学生也可以关联老师，关联来关联去这不就是一个图么，也就是 graph。

GraphQL 全称是 graph query language，就是从这个对象的 graph 中查询数据的。

现在我们声明的只是对象类型的关系，还要知道这些类型的具体数据，取数据的这部分叫做 resolver。

```javascript
const students = [
    {
      id: '1',
      name: async () => {
        await '取数据';
        return '光光'
      },
      sex: true,
      age: 12
    },
    {
      id: '2',
      name:'东东',
      sex: true,
      age: 13
    },
    {
      id: '3',
      name:'小红',
      sex: false,
      age: 11
    },
];

const teachers = [
  {
    id: '1',
    name: '神光',
    sex: true,
    subject: ['体育', '数学'],
    age: 28,
    students: students
  }
]

const resolvers = {
    Query: {
      students: () => students,
      teachers: () => teachers
    }
};
```

resolver 是取对象类型对应的数据的，每个字段都可以写一个 async 函数，里面执行 sql、访问接口等都可以，最终返回取到的数据。

当然，直接写具体的数据也是可以的。

这样有了 schema 类型定义，有了取数据的 resovler，就可以跑起 graphql 服务了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92e02989bef0441da2b47d057ffcda1c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1400&h=1164&s=182844&e=png&b=1f1f1f)

也就是这样：

```javascript
import { startStandaloneServer } from '@apollo/server/standalone' 

const server = new ApolloServer({
    typeDefs,
    resolvers,
});
  
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
  
console.log(`🚀  Server ready at: ${url}`);
```
传入 schema 类型定义和取数据的 resolver，就可以用 node 把服务跑起来。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a76c82f15d347deb8b0dc7bc9e1258f~tplv-k3u1fbpfcp-watermark.image?)

有同学可能问了，node 可以直接解析 esm 模块么？

可以的。只需要在 package.json 中声明 type 为 module：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/764dd70c276645b1a20049d0b2605955~tplv-k3u1fbpfcp-watermark.image?)

那所有的 .js 就都会作为 esm 模块解析：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88a61d897c2f4578ad9196303fd98126~tplv-k3u1fbpfcp-watermark.image?)

跑起来之后，浏览器访问一下：

就可以看到这样的 sandbox，这里可以执行 graphql 的查询：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3d94c3284c84d7ab5e5be77ff428e86~tplv-k3u1fbpfcp-watermark.image?)

（graphql 接口是监听 POST 请求的，用 get 请求这个 url 才会跑这个调试的工具）

我查询所有学生的 id、name、age 就可以这样：

```graphql
query Query {
    students {
        name,
        id
    }
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b278c7267b504004ab7ae454b5050424~tplv-k3u1fbpfcp-watermark.image?)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81b8b08007a34bc996425019a8650349~tplv-k3u1fbpfcp-watermark.image?)

这里 “光光” 那个学生是异步取的数据，resolver 会执行对应的异步函数，拿到最终数据：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f11da7e9bb294f35a96b8ab225353ef8~tplv-k3u1fbpfcp-watermark.image?)

取老师的信息就可以这样：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecd1871863014c3dafe5d3760efe03c9~tplv-k3u1fbpfcp-watermark.image?)

这样我们就实现了一个 graphql 接口！

感觉到什么叫客户端决定取什么数据了么？

当然，我们这里是在 sandbox 里测的，用 @apollo/client 包也很简单。

比如 react 的 graphql 客户端是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bc53b8890a94cb183fe664fe801049e~tplv-k3u1fbpfcp-watermark.image?)

一个 gql 的 api 来写查询语言，一个 useQuery 的 api 来执行查询。

学起来很简单。

我们之后还是直接在 sandbox 里测试。

有的同学可能会说，如果我想查询某个名字的老师的信息呢？

怎么传参数？

graphql 当然是支持的，这样写：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8b2178e3ad842fba02af787140d7f70~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1226&h=1112&s=143647&e=png&b=1f1f1f)

```
type Query {
    students: [Student],
    teachers: [Teacher],
    studentsbyTeacherName(name: String!): [Student]
}
```

新加一个 query 入口，声明一个 name 的参数。（这里 String 后的 ! 代表不能为空）

然后它对应的 resolver 就是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46045692e6374bcfacaa01b5f3c11308~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1120&h=946&s=132917&e=png&b=1f1f1f)

```javascript
const resolvers = {
    Query: {
      students: () => students,
      teachers: () => teachers,
      studentsbyTeacherName: async (...args) => {
        console.log(args);

        await '执行了一个异步查询'
        return students
      }
    }
};
```
studentsbyTeacherName 字段的 resolver 是一个异步函数，里面执行了查询，然后返回了查到的学生信息。

我们打印下参数看看传过来的是什么。

有参数的查询是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc9883cfac5c4990a19e3804ea397d8f~tplv-k3u1fbpfcp-watermark.image?)

传入老师的 name 参数为 111，返回查到的学生的 id、name 信息。

可以看到返回的就是查询到的结果。

而服务端的 resolver 接收到的参数是这样的：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ec04705f8a04fe78a88d61fb74d1033~tplv-k3u1fbpfcp-watermark.image?)

其余的几个参数不用管，只要知道第二个参数就是客户端传过来的查询参数就好了。

这样我们就可以根据这个 name 参数实现异步的查询，然后返回数据。

这就实现了有参数的查询。

不是说 graphql 能取代 restful 做 CRUD 么？那增删改怎么做呢？

其实看到上面的有参数的查询应该就能想到了，其实写起来差不多。

在 schema 里添加这样一段类型定义：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d60bf2fdfd24d019ba09a3ec5a3c41b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1186&h=1100&s=153842&e=png&b=1f1f1f)
```grqphql
type Res {
    success: Boolean
    id: String
}

type Mutation {
    addStudent(name:String! age:Int! sex:Boolean!): Res

    updateStudent(id: String! name:String! age:Int! sex:Boolean!): Res

    deleteStudent(id: String!): Res
}

schema {
    mutation: Mutation
    query: Query
}
```
和有参数的查询差不多，只不过这部分增删改的类型要定义在 mutation 部分。

然后 resolver 也要有对应的实现：

```javascript
async function addStudent (_, { name, age, sex }) {
    students.push({
        id: '一个随机 id',
        name,
        age,
        sex
    });
    return {
      success: true,
      id: 'xxx'
    }
}

async function updateStudent (_, { id, name, age, sex }) {

    return {
      success: true,
      id: 'xxx'
    }
}

async function deleteStudent (_, { id }) {
    return {
      success: true,
      id: 'xxx'
    }
}
  
const resolvers = {
    Query: {
      students: () => students,
      teachers: () => teachers,
      studentsbyTeacherName: async (...args) => {
        console.log(args);

        await '执行了一个异步查询'
        return students
      }
    },
    Mutation: {
        addStudent: addStudent,
        updateStudent: updateStudent,
        deleteStudent: deleteStudent
    }
};

```

和 query 部分差不多，只不过这里实现的是增删改。

我只对 addStudent 做了实现。

我们测试下：

执行 addStudent，添加一个学生：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccd06869e4ad41d089fa746b37868c23~tplv-k3u1fbpfcp-watermark.image?)

然后再次查询所有的学生：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14e66d3982aa44789cc022c3fb47c38e~tplv-k3u1fbpfcp-watermark.image?)

就可以查到刚来的小刚同学。

这样，我们就可以在一个 graphql 的 POST 接口里完成所有的 CRUD！

全部代码如下，大家可以跑一跑（注意要在 package.json 里加个 type: "module"）

```javascript
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone' 

const typeDefs = `
  type Student {
    id: String,
    name: String,
    sex: Boolean
    age: Int
  }

  type Teacher {
    id: String,
    name: String,
    age: Int,
    subject: [String],
    students: [Student]
  }

  type Query {
    students: [Student],
    teachers: [Teacher],
    studentsbyTeacherName(name: String!): [Student]
  }

  type Res {
    success: Boolean
    id: String
  }

  type Mutation {
    addStudent(name:String! age:Int! sex:Boolean!): Res

    updateStudent(id: String! name:String! age:Int! sex:Boolean!): Res

    deleteStudent(id: String!): Res
  }

  schema {
    mutation: Mutation
    query: Query
  }
`;

const students = [
    {
      id: '1',
      name: async () => {
        await '取数据';
        return '光光'
      },
      sex: true,
      age: 12
    },
    {
      id: '2',
      name:'东东',
      sex: true,
      age: 13
    },
    {
      id: '3',
      name:'小红',
      sex: false,
      age: 11
    },
];

const teachers = [
  {
    id: '1',
    name: '神光',
    sex: true,
    subject: ['体育', '数学'],
    age: 28,
    students: students
  }
]

async function addStudent (_, { name, age, sex }) {
    students.push({
        id: '一个随机 id',
        name,
        age,
        sex
    });
    return {
      success: true,
      id: 'xxx'
    }
}

async function updateStudent (_, { id, name, age, sex }) {

    return {
      success: true,
      id: 'xxx'
    }
}

async function deleteStudent (_, { id }) {
    return {
      success: true,
      id: 'xxx'
    }
}
  
const resolvers = {
    Query: {
      students: () => students,
      teachers: () => teachers,
      studentsbyTeacherName: async (...args) => {
        console.log(args);

        await '执行了一个异步查询'
        return students
      }
    },
    Mutation: {
        addStudent: addStudent,
        updateStudent: updateStudent,
        deleteStudent: deleteStudent
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});
  
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
  
console.log(`🚀  Server ready at: ${url}`);
```
完成了 graphql 的入门，我们再稍微思考下它的原理。graphql 是怎么实现的呢？

回顾整个流程，我们发现涉及到两种 DSL（领域特定语言），一个是 schema 定义的 DSL，一个是查询的 DSL。

服务端通过 schema 定义的 DSL 来声明 graph 图，通过 resolver 来接受参数，执行查询和增删改。

客户端通过查询的 DSL 来定义如何查询和如何增删改，再发给服务端来解析执行。

通过这种 DSL 实现了动态的查询。

确实很方便很灵活，但也有缺点，就是 parse DSL 为 AST 性能肯定是不如 restful 那种直接执行增删改查高的。

具体要不要用 graphql 还是要根据具体场景来做判断。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/graphql-crud-demo)。
## 总结

restful 接口是 url 代表资源，GET、POST、PUT、DELETE 请求代表对资源的增删改查。

这种接口返回什么数据完全由服务端决定，每次接口变动可能就得新加一种接口。

为了解决这种问题，facebook 创造了 graphql，这种接口返回什么数据完全由客户端决定。增删改查通过这一个接口就可以搞定。

graphql 需要在服务端定义 schema，也就是定义对象类型和它的字段，对象类型和对象类型之间会有关联，也就是一个 graph，查询就是从这个 graph 里查询数据。

除了 schema 外，还需要有 resolver，它负责接受客户端的参数，完成具体数据的增删改查。

graphql 会暴露一个 post 接口，通过查询语言的语法就可以从通过这个接口完成所有增删改查。

本地测试的时候，get 请求会跑一个 sandbox，可以在这里测试接口。

整个流程涉及到两种新语言： schema 定义语言和 query 查询语言。入门之后向深入的话就是要学下这两种 DSL 的更多语法。

感受到 graphql 的强大之处了么？一个接口就可以实现所有的 CRUD！
