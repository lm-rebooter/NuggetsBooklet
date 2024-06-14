不同于上一节介绍的函数，Class 虽然也是从 ES6 开始就一直陪伴着我们，但它被使用的频率就要少得多。因为对于相当一部分前端开发者来说，JavaScript 是踏入编程世界后第一门深度接触的编程语言。而面向过程和面向对象这两个概念，显然是前者在 JavaScript 中更为主流。

而面向过程和面向对象指的分别是什么？你可以认为它们是实现同一种效果的不同手段而已。比如类比到做一锅黄焖鸡，面向对象要求你分别建立鸡肉对象、土豆对象、青椒对象、锅对象等等，这些对象携带着自己的信息，只要将它们组合在一起就是一道菜。而面向过程的范式则是，按照顺序逐步完成这道菜，依次备菜、起锅烧油、煎炒、焖等等。

无论使用哪种方式，最后你都能得到这道黄焖鸡，唯一的区别在于你的执行流程不同。面向对象强调对象的封装、组合与交互，而面向过程强调程序的执行流程。我们再来看一个代码层面的例子，假设我们需要计算一个圆形的面积与周长。使用面向对象的编程范式，我们需要对“圆形”这个概念抽象并建立一个对象：

```typescript
class Circle {
  constructor(radius) {
    // 要描述圆形，最重要的一个属性就是半径
    this.radius = radius;
  }
  
  getArea() {
    return Math.PI * this.radius ** 2;
  }
  
  getCircumference() {
    return 2 * Math.PI * this.radius;
  }
}

const circle = new Circle(5);

console.log(`面积为：${circle.getArea()}， 周长为：${circle.getCircumference()}.`);
```

而使用面向过程的编程范式中则是这样的：

```typescript
function getArea(radius) {
  return Math.PI * radius ** 2;
}

function getCircumference(radius) {
  return 2 * Math.PI * radius;
}

const radius = 5;
console.log(`面积为：${getArea(radius)}， 周长为：${getCircumference(radius)}.`);
```

可以看到，面向过程的写法中我们并没有建立圆这个概念，虽然我们知道是在计算圆的面积与周长，但代码中出现的却只有圆的半径。

同时我们可以发现，函数与 Class，分别是面向过程和面向对象这两种编程范式中的底层实现依赖。函数我们很容易理解，它接受一个入参再返回一个出参，对过程的封装使得我们可以将执行流程中的备菜、起锅烧油、煎炒等都封装成函数，并按照顺序调用。那么，为什么我们在面向对象的编程范式中需要 Class 的存在？

不妨先想想，ES6 中的 Class 是如何使用的？我们首先定义一个 Class：

```typescript
class Person {
  name;
  age;

  constructor(personName, personAge) {
    this.name = personName;
    this.age = personAge;
  }
  
  getDesc(): string {
    return `${this.name} at ${this.age} years old`;
  }
}
```

然后通过实例化这个 Class，来获得拥有不同信息的 Person 实例：

```typescript
const person1 = new Person("Linbudu", 18);
const person2 = new Person("Charles", 20);
```

定义在 Person 内部的属性与方法都会被实例继承：

```typescript
person1.name; // Linbudu
person1.getDesc(); // Linbudu at 18 years old
```

而如果是面向过程的写法，由于我们并没有建立 Person 对象这个概念，就需要通过一个个变量和函数来进行维护：

```typescript
const person1 = {
  name: 'Linbudu',
  age: 18
}

const getPersonDesc = (person) => {
  return `${person.name} at ${person.age} years old`;
}
```

这些变量与函数会分散在代码里的各处，虽然我们知道这些都是属于 Person 相关的操作，但代码层面可体现不出来。因此 Class 的第一个好处就体现出来了：封装性。它将一个对象相关的所有属性和方法封装在 Class 内部，供外界进行交互。

而随着项目的开发，程序中的对象也会越来越多，它们有可能是 Person 和 Student 这样存在父子关系的对象（即，Student 一定是 Person），也可能是 Person 和 Animal 这样可能存在引用关系的对象（即，Person 中有个属性 pet 是 Animal 的实例）...，这些对象之间很可能存在公用的属性和方法，比如 Student 和 Worker 中都包括了来自于 Person 的那部分属性，我们肯定不希望每次都重新定义它们。此时，可以通过继承 Person ，额外添加属性和方法来实现一个新的对象：

```typescript
class School {}

class Student extends Person {
  grade: number;
  school: School;
}

class Job {}

class Worker extends Person {
  salary: number;
  job: Job;
}
```

这就是我们需要 Class 的另一个重要原因：继承能力。通过对已知对象的一层层扩展，我们能够构建出清晰的关系链，大大减少重复属性的编写，获得更简洁与易于维护的代码。

总结一下，Class 之所以被视为面向对象编程范式中最重要的概念，主要就是因为它提供了很好的封装与继承能力，让我们能够更直观地建模出程序中的各个对象类型。

那么接下来，我们就可以直接来学习 TypeScript 中 Class 的语法了，其实并没有什么新的知识，相比 ES6 的 Class，现在我们只是多了一道类型描述：

```typescript
class Person {
  name: string;
  age: number;

  constructor(personName: string, personAge: number) {
    this.name = personName;
    this.age = personAge;
  }

  getDesc(): string {
    return `${this.name} at ${this.age} years old`;
  }
}

const person = new Person("Linbudu", 18);

console.log(person.getDesc()); // Linbudu at 18 years old
```

在上面的例子中，我们的 name 属性和 age 属性在完成实例化赋值后，就完全暴露给了外部环境，这其实是不太稳妥的行为，我们可以将它标记为私有的属性，这样就只能在类的内部访问它，而对外界是否能够访问，取决于我们是否提供了接口：

```typescript
class Person {
  private name: string;
  private age: number;

  constructor(personName: string, personAge: number) {
    this.name = personName;
    this.age = personAge;
  }

  public getDesc(): string {
    return `${this.name} at ${this.age} years old`;
  }

  public getName(): string {
    return this.name;
  }

  public getUpperCaseName(): string {
    return this.name.toLocaleUpperCase();
  }
}

const person = new Person('Linbudu', 18);

console.log(person.name); // 属性“name”为私有属性，只能在类“Person”中访问。
console.log(person.getName()); // Linbudu
console.log(person.getUpperCaseName()); // LINBUDU
```

在这里，我们使用 private 关键字，将 name 和 age 属性标记为私有的，并使用与 private 对应的 public 关键字，提供了 getName 这样的公开方法，来让外界能够获取我们的私有属性，同时你也可以看到，由于我们是通过方法形式提供的读取，在这个过程里我们还可以接受参数，对属性进行转换等等。

类似于函数，Class 中的方法也支持重载，语法也完全一致，毕竟 Class 的方法和函数本是一家人嘛：

```typescript
class Person {
  feedPet(catFood: CatFood): void;
  feedPet(dogFood: DogFood): void;
  feedPet(rabbitFood: RabbitFood): void;
  feedPet(food: CatFood | DogFood | RabbitFood): void {}
}
```

最后，Class 还有一个不那么常用的使用方式，即作为工具方法的命名空间。举例来说，此前我们可能会在 utils 文件夹下封装很多通用的函数：

```typescript
export function isSameDate(){ } // 判断两个日期是否是同一天

export function diffDate(){ } // 判断两个日期的差值

export function getRandomInt(){ } // 获取随机整数

// ...
```

如果这些工具方法都放置在一个文件内部，那使用起来就可能显得混乱：你在一个文件里同时导出了用于处理日期、数字、数组、业务逻辑的工具方法，而如果要拆分成多个文件，可能又会出现部分文件里只有寥寥一两个函数的情况。此时你可以考虑使用 Class ，将一批功能类似的方法收拢到一个 Class 内部：

```typescript
export class DateUtils {
  static isSameDate(){ }
  static diffDate(){ }
}

export class NumberUtils { }
export class UserListUtils { }
// ...
```

这里的 static 称为“静态成员”，之前我们在 Class 内直接定义或使用 public / private 修饰的属性与方法称为“实例成员”，因为它们需要实例化 Class 之后才能在实例上访问：

```typescript
class User {
  name: string;
}

const user = new User();
user.name;
```

而标记为静态成员后，我们可以不实例化就直接访问这个成员，它就像是直接定义在这个 Class，而不是它实例上的成员：

```typescript
import { DateUtils } from './utils';

DateUtils.isSameDate();
```

是不是这样就清晰多了？类似的，如图片地址、配置信息这样的常量，也可以使用 Class + 静态成员来定义。

在这一节，我们主要学习了 TypeScript 中的 Class 语法，首先最重要的一定是它与上一节我们学习的函数的区别，包括它赋予我们的对对象进行建模与继承的能力。而接着，我们了解了 Class 中的实例成员与静态成员，包括使用实例成员来描述提供给实例的属性与方法，以及使用静态成员来实现对工具方法的命名空间收敛。Class 在我们的日常开发中并不是常客，但在某些场景下它也有着自己独特的地位，尤其是在你需要对一个对象进行完整抽象的情况下。