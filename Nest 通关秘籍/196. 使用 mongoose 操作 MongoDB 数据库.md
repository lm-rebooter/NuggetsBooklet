上节我们用了下 mongodb，这节在 node 里操作下。

在 node 里操作 mongodb 我们常用的是 mongoose 这个包。

创建个项目：

```shell
mkdir mongoose-test
cd mongoose-test
npm init -y
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e48c14c0e614f0da197e64dedb68c43~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=842&h=648&s=130689&e=png&b=010101)

进入项目，安装 mongoose 包。

```shell
npm install --save mongoose
```
在 Docker Desktop 里把 mongodb 的容器跑起来：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e609de4add42458db6d479c4bc8bac0d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1556&h=1422&s=225825&e=png&b=ffffff)

然后用 node 代码连接下。

创建 index.js

```javascript
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/guang');

  const PersonSchema = new mongoose.Schema({
    name: String,
    age: Number,
    hobbies: [String]
  });

  const Person = mongoose.model('Person', PersonSchema);

  const guang = new Person();
  guang.name = 'guang';
  guang.age = 20;

  await guang.save();

  const dong = new Person();
  dong.name = 'dong';
  dong.age = 21;
  dong.hobbies = ['reading', 'football']

  await dong.save();

  const persons = await Person.find();
  console.log(persons);
}
```
首先创建 Schema 描述对象的形状，然后根据 Schema 创建 Model，每一个 model 对象存储一个文档的信息，可以单独 CRUD。

因为 collection 中的 document 可以是任意形状：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/158f074fb746421cb4305fc414812065~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=782&h=720&s=88926&e=png&b=ffffff)

我们需要先用 Schema 声明具体有哪些属性再操作。

跑一下：
```
node index.js
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efc1d197546849428f5fa9bba93682b6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=788&h=502&s=57369&e=png&b=181818)

在 MongoDB Compass 里看下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3950ec7aec954110b33d66d0f3a13255~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1496&h=1092&s=172815&e=png&b=ffffff)

两条数据都插入了。

而且在 mongoose 里查询的语法和上节我们学的 mongodb 的 api 一模一样：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7ccf5f5f94542719b70f77e8d36caa4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1010&h=1248&s=185273&e=png&b=1d1d1d)

```javascript
const persons = await Person.find(
    {
        $and: [{age: { $gte: 20 }}, { name: /dong/}]
    }
);
console.log(persons);
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b6f7b636f924a69987ede310e6e2c9f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=980&h=1336&s=193811&e=png&b=1c1c1c)

```javascript
const persons = await Person.find(
    {
        age: { $in: [20, 21]}
    }
);
console.log(persons);
```

增删改查的方法都比较简单，就不一个个试了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7b09557e16b4cb98e82919d6b24a656~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=764&h=366&s=60278&e=png&b=202020)

然后在 nest 项目里操作下。

创建个项目：

```shell
nest new nest-mongoose
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c14d5986b404bf68745ece8b23237c4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=876&h=692&s=267519&e=png&b=010101)

进入项目，安装用到的包：

```
npm install @nestjs/mongoose mongoose
```
在 AppModule 里引入下 MongooseModule

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35ac95afe35e4a998eb10f927b7bc53f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030&h=576&s=118033&e=png&b=1f1f1f)

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/guang')
      
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
创建个模块：

```
nest g resource dog --no-spec
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f0945238d0a4c47bd1d83eabcd1dd9c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=886&h=354&s=91308&e=png&b=191919)

改下 dog.entities.ts
```javascript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Dog {
  @Prop()
  name: string;

  @Prop()
  age: number;
  
  @Prop([String])
  tags: string[];
}

export type DogDocument = HydratedDocument<Dog>;

export const DogSchema = SchemaFactory.createForClass(Dog);
```
用 @Schema 创建 schema，然后用 @Prop 声明属性。

之后用 SchemaFactory.createForClass 来根据 class 创建 Schema。

这个 HydratedDocument 只是在 Dog 类型的基础上加了一个 _id 属性：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa17b584540e4447b0dbaf4396f0d2f0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1030&h=204&s=44603&e=png&b=202020)

然后 dog.module.ts 里注入 Schema 对应的 Model

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6d1dd8ccacc4e12b1c498be487678ba~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1168&h=574&s=136405&e=png&b=1f1f1f)

```javascript
import { Module } from '@nestjs/common';
import { DogService } from './dog.service';
import { DogController } from './dog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dog, DogSchema } from './entities/dog.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dog.name, schema: DogSchema }])
  ],
  controllers: [DogController],
  providers: [DogService],
})
export class DogModule {}
```

这样在 DogService 里就可以用 Model 来做 CRUD 了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/002c5256776d417b90bcc40e7ec93815~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=970&h=772&s=166339&e=png&b=1f1f1f)

```javascript
import { Injectable } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dog } from './entities/dog.entity';

@Injectable()
export class DogService {

  @InjectModel(Dog.name)
  private dogModel: Model<Dog>;

  create(createDogDto: CreateDogDto) {
    return 'This action adds a new dog';
  }

  findAll() {
    return this.dogModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} dog`;
  }

  update(id: number, updateDogDto: UpdateDogDto) {
    return `This action updates a #${id} dog`;
  }

  remove(id: number) {
    return `This action removes a #${id} dog`;
  }
}
```
然后我们改下 create-dog.dto.ts

```javascript
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateDogDto {

    @IsString()
    @IsNotEmpty()
    @Length(30)
    name: string;

    @IsNumber()
    @IsNotEmpty()
    age: number;
  
    tags: string[];
}
```
安装用到的包：

```
npm install class-validator class-transformer
```
之后完善下 DogService：

```javascript
import { Injectable } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dog } from './entities/dog.entity';

@Injectable()
export class DogService {

  @InjectModel(Dog.name)
  private dogModel: Model<Dog>;

  create(createDogDto: CreateDogDto) {
    const dog = new this.dogModel(createDogDto);
    return dog.save();
  }

  findAll() {
    return this.dogModel.find();
  }

  findOne(id: string) {
    return this.dogModel.findById(id);
  }

  update(id: string, updateDogDto: UpdateDogDto) {
    return this.dogModel.findByIdAndUpdate(id, updateDogDto);
  }

  remove(id: number) {
    return this.dogModel.findByIdAndDelete(id);
  }
}
```
之前把 id 转为 number 的 + 去掉，因为 mongodb 的 id 是 stirng：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3058a06adfd4029ac9654146c626744~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=898&h=416&s=87290&e=png&b=1f1f1f)

把服务跑起来：

```
npm run start:dev
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca34d224e24040d0b27835c1f3cdd57a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1484&h=602&s=287710&e=png&b=181818)

然后在 postman 里测试下：


先创建 2 个 dog：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9aa525eff4a544879ed1eb094fc177fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=844&h=794&s=82377&e=png&b=fcfcfc)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/747e2e7c304b474bb9e0f993aa23cd08~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=710&h=894&s=87157&e=png&b=fcfcfc)

查询下全部：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a325ef05347426caaa483bc99dd6255~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=806&h=968&s=97520&e=png&b=fcfcfc)

单个：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ad64e510d9d4e85812dad313ad48c5a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=954&h=822&s=83485&e=png&b=fdfdfd)

然后修改下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad603485e70341658479127a23385270~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=942&h=772&s=91229&e=png&b=fcfcfc)

再查询下：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5983ca8c705d4a1289153c16396606d0~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=860&h=948&s=98824&e=png&b=fdfdfd)

之后删除：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f936ee5049af4dd9b1acad29bd5fefcd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=986&h=688&s=80735&e=png&b=fcfcfc)

在 Mongodb Compass 里点击刷新，也可以看到数据确实被删掉了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12633613196540f199e0b5cf0d9e5fc7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2466&h=862&s=145297&e=png&b=ffffff)

这就是在 nest 里对 MongoDB 做 CRUD 的方式。

案例代码在小册仓库：

[mongoose 操作 mongodb](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/mongoose-test)

[nest 集成 mongoose](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/nest-mongoose)

## 总结

我们学习了用 mongoose 操作 MongoDB 以及在 Nest 里集成 mongoose。

主要是通过 Schema 描述形状，然后创建 Model，通过一个个 model 对象保存数据和做 CRUD。

因为 mongodb 本身提供的就是 api 的操作方式，而 mongoose 的 api 也是对底层 api 的封装，
所以基本可以直接上手用。
