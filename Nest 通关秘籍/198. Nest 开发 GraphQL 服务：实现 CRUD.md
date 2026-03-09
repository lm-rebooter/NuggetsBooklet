上节我们知道了什么是 graphql，它就是通过模式定义语言 SDL（Schema Definition Language) 定义对象和对象之间关系的 schema：

比如：

```graphql
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
```
这个 schema 只是类型，负责实现 schema 对应数据的部分叫做 resolver：

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
}
```

schema 结合 resolver，这样客户端就可以按照 schema 的结构来存取数据了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4e0ec81d7bd4ed4bf6c0db6313cdabd~tplv-k3u1fbpfcp-watermark.image?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccd06869e4ad41d089fa746b37868c23~tplv-k3u1fbpfcp-watermark.image?)

这节我们在 Nest 里集成下 graphql。

新建个项目：

```bash
nest new nest-graphql
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae91a37c7137471f85db27c26146a19d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=838&h=680&s=156963&e=png&b=010101)

进入项目，安装 graphql 和 apollo 的包：

```bash
npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql
```
在 main.ts 引入 GraphQLModule：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/327c41609033436bbf1bda3f0d43e11f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=904&h=662&s=134591&e=png&b=1f1f1f)

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
创建 schema 文件  schema.graphql

```graphql
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

type Mutation {
  addStudent(name:String! age:Int! sex:Boolean!): Res

  updateStudent(id: String! name:String! age:Int! sex:Boolean!): Res

  deleteStudent(id: String!): Res
}
```
这里直接复制的上节的 schema 定义。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca60e14b25d04c7aa150b858e3249608~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1156&h=1076&s=147152&e=png&b=1f1f1f)

语法高亮需要安装下 graphql 插件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af46b00b892f4b5dadfbff2f71543acf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1812&h=658&s=198913&e=png&b=1e1e1e)

然后定义它的 resolver：

```
nest g resolver student
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf3e6c5e967f42fb93cbe03c529ff28e~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=820&h=146&s=35714&e=png&b=191919)

实现下 Query、Mutation 对应的逻辑：

```javascript
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

const students = [ 
    { id: 1, name: '光光', sex: true, age: 20},
    { id: 2, name: '东东', sex: true, age: 21},
    { id: 3, name: '小红', sex: false, age: 20},
];

const teachers = [
    { 
        id: 1, 
        name: "小刚", 
        age: 30, 
        subject: ['体育', '英语'],
        students: students
    },
]

@Resolver()
export class StudentResolver {

    @Query("students")
    students() {
        return students;
    }


    @Query("teachers")
    teachers() {
        return teachers;
    }

    @Mutation()
    addStudent(
        @Args('name') name: string, 
        @Args('age') age: number, 
        @Args('sex') sex: boolean
    ) {
        const id = Math.floor(Math.random() * 1000);
        students.push({
            id,
            name,
            age,
            sex
        });
        return {
            id,
            success: true
        }
    }

    @Mutation()
    updateStudent(
        @Args('id') id,
        @Args('name') name: string, 
        @Args('age') age: number, 
        @Args('sex') sex: boolean
    ) { 
        const index = students.findIndex(item => {
            return item.id === parseInt(id)
        });

        if(index ===-1) {
            return {
                id: null,
                success: true
            }
        }

        students[index].name = name;
        students[index].age = age;
        students[index].sex = sex;
        return {
            id,
            success: true
        }
    }

    @Mutation()
    deleteStudent(@Args('id') id) { 
        const index = students.findIndex(item => {
            return item.id === parseInt(id)
        });
        
        if(index ===-1) {
            return {
                id: null,
                success: true
            }
        }

        students.splice(index, 1);
        return {
            id,
            success: true
        }
    }
      
}
```
比较容易看懂，用 @Query 和 @Mutation 分别实现 Query 和 Mutation 对应的方法。

把服务跑起来：

```
npm run start:dev
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff1fe508fbfc4ea18cc8edce5ef5d826~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1712&h=434&s=166035&e=png&b=181818)

浏览器访问下 http://localhost:3000/graphql

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ac8ef484b594e7d97224df7c89e47db~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2570&h=1202&s=119911&e=png&b=162330)

右侧可以看到 schema 定义还有文档：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/323f012922874bb394bc46f423956f9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1512&h=1216&s=158758&e=png&b=14222e)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a1bb4ce382d4c6c9115fa32b6b23998~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1256&h=1072&s=135420&e=png&b=fefefe)

这个东西就是 graphql 的接口文档了。

我们在左侧输入下查询语法：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2e2baa8df6149e6be4046c4947c6204~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2102&h=1194&s=284060&e=gif&f=47&b=121e2a)

```graphql
query Xxx {
  students {
    id
    name
    age
  }
}
```
对新手来说，写 query language 还是有点难度的，因为不熟悉。

上节那个 playground 就好很多，可以直接生成。

我们换上节的 playground：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b9c8831abaf45539f9ff13afcedc995~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1576&h=808&s=213674&e=png&b=1f1f1f)

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { StudentResolver } from './student/student.resolver';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    })
  ],
  controllers: [AppController],
  providers: [AppService, StudentResolver],
})
export class AppModule {}
```
刷新就可以看到换成 apollo 的 playground 的了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ad558ef58bd464a80fa660fb99a6d5f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2574&h=1314&s=477261&e=gif&f=61&b=eff3f5)

点击加号就可以生成查询。

试一下添加：

```graphql
mutation Mutation($name: String!, $age: Int!, $sex: Boolean!) {
  addStudent(name: $name, age: $age, sex: $sex) {
    id
    success
  }
}
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/712eadf8f43b4e8e86066ec81dd3a93d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2042&h=982&s=135862&e=png&b=ffffff)

再查一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c9abc22469f44c595c624890219ed78~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2090&h=1148&s=180941&e=png&b=ffffff)

可以看到，添加成功了。

然后再来试下修改：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b6a174eb9704e7b90a40840c030fc81~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1986&h=950&s=149523&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d45c7b20f70a48f2b754cf1947a5fb43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2076&h=1146&s=145665&e=png&b=ffffff)

修改成功！

试下删除：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab65578834f8469cab46a63fe7456027~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2046&h=852&s=121176&e=png&b=ffffff)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c285fa6dbee94712b80fe4651f2f5edf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1980&h=876&s=126404&e=png&b=ffffff)

删除成功！

其实还少了个根据 id 查询的方法。

在 schema 里加一下：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10fa5a17fc794210aad1bd57df3f1564~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=710&h=432&s=56273&e=png&b=1f1f1f)

! 代表必填。

在 resolver 里加一下它的实现：

```javascript
@Query("studentById")
studentById(@Args('id') id) {
    return students.find(item => {
        return item.id === id
    });
}
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/232b2550ef44477e83536e4ae581fa0d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2176&h=970&s=139870&e=png&b=ffffff)

查询成功！

至此，Nest + GrphQL 的 CRUD 就完成了。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nest-graphql)。

## 总结

这节我们在 Nest 里集成了 GraphQL，并做了 CRUD。

graphql 主要是分为 schema、resolver 两部分。

GraphQLModule.forRoot 指定 typePaths 也就是 schema 文件的位置。

然后用 nest g resolver 生成 resolver 文件，实现 Query、Mutaion 的方法。

并且还可以切换 playground 为 apollo 的。

之后就可以在 palyground 里发送 graphql 请求，做 CRUD 了。



