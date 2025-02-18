我们会用 class-validator 的装饰器对 dto 对象做校验。

那 class-validator 都有哪些装饰器可用呢？

这节我们来过一遍。

```
nest new class-validator-decorators
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d7af944d38b4d50bf41fed5602c29c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1026&h=688&s=313314&e=png&b=010101)

创建个 CRUD 模块：

```
nest g resource aaa --no-spec
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/607e2e7bd0f84e2487119252fa87892f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=792&h=346&s=86022&e=png&b=191919)

全局启用 ValidationPipe，对 dto 做校验：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3d0bd2c1e09499990ab88db86e58899~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=978&h=426&s=100502&e=png&b=1f1f1f)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bc21983dce14461b605477ebe7d107b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=900&h=482&s=98919&e=png&b=1f1f1f)

```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
```

安装用到的 class-validator 和 class-transformer 包：

```
npm install --save class-validator class-transformer
```
然后在 create-aaa.dto.ts 加一下校验：

```javascript
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAaaDto {

    @IsNotEmpty({message: 'aaa 不能为空'})
    @IsString({message: 'aaa 必须是字符串'})
    @IsEmail({}, {message: 'aaa 必须是邮箱'})
    aaa: string;

}
```
把服务跑起来：

```
npm run start:dev
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5416023b3e8f4e64a42b9416bc7f8f8f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1532&h=510&s=244441&e=png&b=181818)

postman 里访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/609738a364a44bdaa23b259fd7851cef~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=806&h=790&s=79083&e=png&b=fcfcfc)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f1c0389b2624006aca0d0e512c226b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=696&h=744&s=71630&e=png&b=fcfcfc)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a30f1fddf7984de6a498ed5b440d65af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=662&h=536&s=46342&e=png&b=fbfbfb)

这就是 class-validator 的装饰器的用法。

类似这种装饰器有很多。

和 @IsNotEmpty 相反的是 @IsOptional：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5448bb691b364a85825ecef18d6569ea~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=834&h=384&s=87688&e=png&b=1f1f1f)

加上之后就是可选的了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1732de37c6ce40d48ba1c0af69e26bcb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=728&h=572&s=45140&e=png&b=fbfbfb)

上节学的 PartialType 就是用的 IsOptional 装饰器实现的。

@IsIn 可以限制属性只能是某些值：

```javascript
@IsNotEmpty({message: 'aaa 不能为空'})
@IsString({message: 'aaa 必须是字符串'})
@IsEmail({}, {message: 'aaa 必须是邮箱'})
@IsIn(['aaa@aa.com', 'bbb@bb.com'])
aaa: string;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75a1ff9e712e4bef89e486dcfc8004d7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1086&h=752&s=89576&e=png&b=fcfcfc)

还有 @IsNotIn，可以限制属性不能是某些值：

```javascript
@IsNotEmpty({message: 'aaa 不能为空'})
@IsString({message: 'aaa 必须是字符串'})
@IsEmail({}, {message: 'aaa 必须是邮箱'})
@IsNotIn(['aaa@aa.com', 'bbb@bb.com'])
aaa: string;
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e69acf3dc0934e72aeb069e601e04e93~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1180&h=682&s=94930&e=png&b=fcfcfc)

@IsBoolean、@IsInt、@IsNumber、@IsDate 这种就不说了。

@IsArray 可以限制属性是 array：

```javascript
@IsArray()
bbb:string;
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d0593ba68f54db9b3af50642aa1cb26~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=670&h=570&s=50464&e=png&b=fbfbfb)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc4a4af2eb82415ab4a8737d2cd32bf6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=658&h=770&s=68187&e=png&b=fcfcfc)

@ArrayContains 指定数组里必须包含的值：

```javascript
@IsArray()
@ArrayContains(['aaa'])
bbb:string;
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3be40954cfd472f8d7f086149fc2ed3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=722&h=744&s=73050&e=png&b=fbfbfb)

类似的还有 @ArrayNotContains 就是必须不包含的值。

@ArrayMinSize 和 @ArrayMaxSize 限制数组的长度。

@ArrayUnique 限制数组元素必须唯一：

```javascript
@IsArray()
@ArrayNotContains(['aaa'])
@ArrayMinSize(2)
@ArrayMaxSize(5)
@ArrayUnique()
bbb:string;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/287585c939b447d08e223b8fa903c78c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=880&h=768&s=89883&e=png&b=fcfcfc)

前面讲过 @IsNotEmpty，和它类似的还有 @IsDefined。

@IsNotEmpty 检查值是不是 ''、undefined、null。

@IsDefined 检查值是不是 undefined、null。

当你允许传空字符串的时候就可以用 @IsDefined。

```javascript
@IsDefined()
ccc: string;
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f21e0ae4480b41c2a6abb4ba2ac19a5d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=682&h=646&s=54520&e=png&b=fbfbfb)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d650e234876a48d599fdaa56ee30f05c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=760&h=800&s=77837&e=png&b=fcfcfc)

如果是 @IsNotEmpty，那空字符串也是不行的：

```javascript
// @IsDefined()
@IsNotEmpty()
ccc: string;
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13ca17d521374bcebd274a7d967f8621~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=694&h=786&s=74939&e=png&b=fcfcfc)

数字可以做更精准的校验：

```javascript
@IsPositive()
@Min(1)
@Max(10)
@IsDivisibleBy(2)
ddd:number;
```
@IsPositive 是必须是正数、@IsNegative 是必须是负数。

@Min、@Max 是限制范围。

@IsDivisibleBy 是必须被某个数整除。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/504219b2805e4ec1994db65e0f6a85e3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=798&h=848&s=95801&e=png&b=fcfcfc)

@IsDateString 是 ISO 标准的日期字符串：

```javascript
@IsDateString()
eee: string;
```
也就是这种：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b35e18bb026a47089a3d7e3f4275ba80~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=550&h=148&s=20010&e=png&b=ffffff)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba93bb8349dd49958630659abecab434~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=702&h=650&s=64697&e=png&b=fbfbfb)

还有几个字符串相关的：

@IsAlpha 检查是否只有字母

@IsAlphanumeric 检查是否只有字母和数字

@Contains 是否包含某个值

```javascript
@IsAlphanumeric()
@Contains('aaa')
fff: string;
```

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2da3a04f915844538acc9475883c636d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=788&h=836&s=99112&e=png&b=fdfdfd)

字符串可以通过 @MinLength、@MaxLength、@Length 来限制长度：

```javascript
@MinLength(2)
@MaxLength(6)
ggg: string;
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/983c5b4ec6d0484c816835525cf5778d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=892&h=746&s=87899&e=png&b=fcfcfc)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20a4d78a891a4e829c98817b24a019a9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=922&h=824&s=98238&e=png&b=fdfdfd)

也可以用 @Length：

```javascript
@Length(2, 6)
ggg: string;
```
还可以校验颜色值的格式：@IsHexColor、@IsHSL、@IsRgbColor

校验 IP 的格式：@IsIP

校验端口： @IsPort

校验 JSON 格式 @IsJSON

常用的差不多就这些，更多的可以看 [class-validator 的文档](https://www.npmjs.com/package/class-validator#validation-decorators)。

此外，如果某个属性是否校验要根据别的属性的值呢？

这样：

```javascript
@IsBoolean()
hhh: boolean;

@ValidateIf(o => o.hhh === true)
@IsNotEmpty()
@IsHexColor()
iii: string;
```
如果 hhh 传了 true，那就需要对 iii 做校验，否则不需要。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b0e21cc11f347deabcf76d552754ada~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=788&h=764&s=84550&e=png&b=fcfcfc)

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9686efe0623d4289965192ce3521fa97~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=688&h=582&s=58467&e=png&b=fcfcfc)

此外，如果这些内置的校验规则都不满足需求呢？

那就自己写！

创建 my-validator.ts

```javascript
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class MyValidator implements ValidatorConstraintInterface {
    validate(text: string, validationArguments: ValidationArguments) {
        console.log(text, validationArguments)
        return true;
    }
}
```
用 @ValidatorConstraint 声明 class 为校验规则，然后实现 ValidatorConstraintInterface 接口。

用一下：
```javascript
@Validate(MyValidator, [11, 22], {
    message: 'jjj 校验失败',
})
jjj: string;
```

访问下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42044f93b98e4fa3aaad129cd07a64ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=832&h=668&s=70494&e=png&b=fcfcfc)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0ec622e3aec4e75946a44e6601071b4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=856&h=1016&s=181442&e=png&b=1a1a1a)

第一个参数传入的字段值，第二个参数包含更多信息，比如 @Validate 指定的参数在 constraints 数组里。

这样，我们只要用这些做下校验然后返回 true、false 就好了。

比如这样：

```javascript
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class MyValidator implements ValidatorConstraintInterface {
    validate(text: string, validationArguments: ValidationArguments) {
        // console.log(text, validationArguments)
        return text.includes(validationArguments.constraints[0]);
    }
}
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d291e4fac9143b4b1e8141cc23f8076~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=722&h=798&s=83723&e=png&b=fcfcfc)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80db0e02573a437b85f220471afac3ed~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=688&h=660&s=58450&e=png&b=fbfbfb)

内容包含 11 的时候才会校验通过。

那如果这个校验是异步的呢？

返回 promise 就行：

```javascript
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint()
export class MyValidator implements ValidatorConstraintInterface {
    async validate(text: string, validationArguments: ValidationArguments) {
        // console.log(text, validationArguments)
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                resolve(text.includes(validationArguments.constraints[0]));
            }, 3000);
        })
    }
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bff85edb9364b2ea117226a3f15bbf7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=646&h=804&s=73948&e=png&b=fcfcfc)

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bb15421b41a44ed992160382aceb3ae~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=646&h=684&s=57691&e=png&b=fbfbfb)

这样用起来还是不如内置装饰器简单：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/363e89978931443bbde6c756880c3c14~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=646&h=262&s=33870&e=png&b=1f1f1f)

可以用我们前面学的创建自定义装饰器的方式来包装一下：

创建 my-contains.decorator.ts

```javascript
import { applyDecorators } from '@nestjs/common';
import { Validate, ValidationOptions } from 'class-validator';
import { MyValidator } from './my-validator';

export function MyContains(content: string, options?: ValidationOptions) {
  return applyDecorators(
     Validate(MyValidator, [content], options)
  )
}
```
用 applyDecorators 组合装饰器生成新的装饰器。

然后用起来就可以这样：

```javascript
@MyContains('111', {
    message: 'jjj 必须包含 111'
})
jjj: string;
```

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c457a9d48a9d4461b12bfbdafefd1c19~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=648&h=776&s=72920&e=png&b=fcfcfc)

我们封装出了 @Contains，其实内置的那些装饰器我们都可以自己封装出来。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/class-validator-decorators)

## 总结

我们过了一遍 class-validator 的常用装饰器。

它们可以对各种类型的数据做精确的校验。

然后 @ValidateIf 可以根据别的字段来决定是否校验当前字段。

如果内置的装饰器不符合需求，完全可以自己实现，然后用 @Validate 来应用，用自定义装饰器 applyDecorators 包一层之后，和 class-validator 的内置装饰器就一模一样了。

所有的 class-validator 内置装饰器我们完全可以自己实现一遍。
