# 原型链（Prototype Chain）详解

## 概述

原型链是 JavaScript 中实现继承的核心机制，它允许对象继承另一个对象的属性和方法。理解原型链对于掌握 JavaScript 的面向对象编程至关重要。

## 基本概念

### 什么是原型？

在 JavaScript 中，每个对象都有一个原型（prototype），原型本身也是一个对象。当访问对象的属性或方法时，如果对象本身没有该属性或方法，JavaScript 会沿着原型链向上查找，直到找到该属性或方法，或者到达原型链的终点（null）。

### 什么是原型链？

原型链是由对象的原型组成的链状结构。当访问一个对象的属性时，JavaScript 会首先在对象本身查找，如果找不到，就会查找对象的原型，然后是原型的原型，以此类推，直到找到该属性或到达原型链的终点。

## 基本语法

### 创建对象的几种方式

#### 1. 对象字面量

```javascript
const obj = {
  name: 'Alice',
  age: 30
};
```

#### 2. 构造函数

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const person = new Person('Bob', 25);
```

#### 3. Object.create()

```javascript
const proto = {
  greet: function() {
    console.log(`Hello, ${this.name}!`);
  }
};

const obj = Object.create(proto);
obj.name = 'Charlie';
```

### 原型的访问方式

#### 1. __proto__ 属性

```javascript
const obj = {};
console.log(obj.__proto__); // Object.prototype
```

#### 2. Object.getPrototypeOf()

```javascript
const obj = {};
console.log(Object.getPrototypeOf(obj)); // Object.prototype
```

#### 3. 构造函数的 prototype 属性

```javascript
function Person() {}
console.log(Person.prototype); // Person 的原型对象
```

## 核心特性

### 1. 原型继承

JavaScript 通过原型链实现继承，子类可以继承父类的属性和方法。

```javascript
function Animal() {
  this.type = 'animal';
}

Animal.prototype.eat = function() {
  console.log('Eating...');
};

function Dog() {
  Animal.call(this);
  this.name = 'dog';
}

// 设置原型继承
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log('Woof!');
};

const dog = new Dog();
dog.eat(); // 继承自 Animal
dog.bark(); // Dog 自己的方法
```

### 2. 原型链的结构

- **Object.prototype**：所有对象的最终原型
- **Function.prototype**：所有函数的原型
- **Array.prototype**：所有数组的原型
- **自定义构造函数的原型**：由开发者定义

### 3. 原型链的查找机制

当访问对象的属性或方法时，JavaScript 会按照以下顺序查找：
1. 对象本身
2. 对象的原型
3. 原型的原型
4. 以此类推，直到 Object.prototype
5. 如果还找不到，返回 undefined

### 4. 原型的修改

修改原型会影响所有继承自该原型的实例。

```javascript
function Person() {}

const person1 = new Person();
const person2 = new Person();

// 修改原型
Person.prototype.sayHello = function() {
  console.log('Hello!');
};

// 所有实例都能访问新方法
person1.sayHello(); // Hello!
person2.sayHello(); // Hello!
```

### 5. 属性遮蔽

如果实例上定义了与原型相同名称的属性，会遮蔽原型上的属性。

```javascript
function Person() {}

Person.prototype.age = 18;

const person = new Person();
console.log(person.age); // 18

// 实例上定义同名属性
person.age = 30;
console.log(person.age); // 30 - 遮蔽了原型上的属性
```

## 常见用法

### 1. 构造函数模式

使用构造函数创建对象，并在原型上定义方法。

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
};

const person = new Person('Alice');
person.sayHello(); // Hello, my name is Alice
```

### 2. 原型模式

使用原型创建对象，共享方法和属性。

```javascript
const personProto = {
  sayHello: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

function createPerson(name) {
  const person = Object.create(personProto);
  person.name = name;
  return person;
}

const person = createPerson('Bob');
person.sayHello(); // Hello, my name is Bob
```

### 3. 组合模式

结合构造函数和原型模式，构造函数用于初始化实例属性，原型用于定义共享方法。

```javascript
function Person(name, age) {
  // 实例属性
  this.name = name;
  this.age = age;
  this.friends = [];
}

// 共享方法
Person.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
};

Person.prototype.addFriend = function(friend) {
  this.friends.push(friend);
};

const person1 = new Person('Alice', 30);
const person2 = new Person('Bob', 25);

person1.addFriend(person2);
console.log(person1.friends.length); // 1
```

### 4. 原型链继承

使用原型链实现继承。

```javascript
function Parent() {
  this.parentProp = 'parent';
}

Parent.prototype.parentMethod = function() {
  console.log('Parent method');
};

function Child() {
  Parent.call(this); // 调用父构造函数
  this.childProp = 'child';
}

// 设置原型继承
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.childMethod = function() {
  console.log('Child method');
};

const child = new Child();
console.log(child.parentProp); // parent
child.parentMethod(); // Parent method
console.log(child.childProp); // child
child.childMethod(); // Child method
```

### 5. ES6 Class

使用 ES6 Class 语法实现继承。

```javascript
class Parent {
  constructor() {
    this.parentProp = 'parent';
  }
  
  parentMethod() {
    console.log('Parent method');
  }
}

class Child extends Parent {
  constructor() {
    super(); // 调用父构造函数
    this.childProp = 'child';
  }
  
  childMethod() {
    console.log('Child method');
  }
}

const child = new Child();
console.log(child.parentProp); // parent
child.parentMethod(); // Parent method
console.log(child.childProp); // child
child.childMethod(); // Child method
```

### 6. 扩展内置对象

扩展内置对象的原型。

```javascript
// 扩展 Array 原型
Array.prototype.last = function() {
  return this[this.length - 1];
};

const arr = [1, 2, 3, 4, 5];
console.log(arr.last()); // 5

// 扩展 String 原型
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const str = 'hello';
console.log(str.capitalize()); // Hello
```

### 7. 原型链的检查

使用 instanceof 检查对象是否属于某个构造函数的实例。

```javascript
function Person() {}
const person = new Person();

console.log(person instanceof Person); // true
console.log(person instanceof Object); // true

const arr = [];
console.log(arr instanceof Array); // true
console.log(arr instanceof Object); // true
```

### 8. 原型的性能优化

将方法定义在原型上，而不是构造函数内部，以节省内存。

```javascript
// 不好的做法：每个实例都有自己的方法副本
function Person(name) {
  this.name = name;
  this.sayHello = function() {
    console.log(`Hello, ${this.name}`);
  };
}

// 好的做法：所有实例共享同一个方法
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, ${this.name}`);
};
```

## 原型链的优缺点

### 优点

1. **代码复用**：通过原型链实现继承，避免代码重复
2. **内存效率**：原型上的方法和属性被所有实例共享，节省内存
3. **灵活性**：可以动态修改原型，影响所有实例
4. **简洁性**：相比其他语言的继承方式，原型链更加简洁
5. **强大的继承机制**：支持多重继承（通过原型链）

### 缺点

1. **引用类型的原型属性**：原型上的引用类型属性会被所有实例共享，可能导致意外修改
2. **原型链查找开销**：深层原型链可能导致属性查找性能下降
3. **构造函数参数传递**：继承时难以向父构造函数传递参数
4. **instanceof 可能不准确**：在复杂的原型链中，instanceof 可能返回意外结果
5. **原型链的修改可能影响所有实例**：修改原型会影响所有继承自该原型的实例

## 常见问题

### 1. 引用类型的原型属性问题

**问题**：原型上的引用类型属性会被所有实例共享，一个实例修改后会影响其他实例。

**解决方案**：在构造函数中初始化引用类型属性，而不是在原型上定义。

```javascript
// 不好的做法
function Container() {}
Container.prototype.items = [];

const c1 = new Container();
const c2 = new Container();
c1.items.push('item');
console.log(c2.items); // ['item'] - 两个实例共享同一个数组

// 好的做法
function Container() {
  this.items = []; // 在构造函数中初始化
}

const c1 = new Container();
const c2 = new Container();
c1.items.push('item');
console.log(c2.items); // [] - 每个实例都有自己的数组
```

### 2. 忘记修复 constructor 指向

**问题**：使用 Object.create() 继承时，constructor 会指向父构造函数。

**解决方案**：手动修复 constructor 指向。

```javascript
function Parent() {}
function Child() {}

Child.prototype = Object.create(Parent.prototype);
console.log(Child.prototype.constructor); // Parent - 错误

// 修复 constructor 指向
Child.prototype.constructor = Child;
console.log(Child.prototype.constructor); // Child - 正确
```

### 3. 原型链的性能问题

**问题**：深层原型链可能导致属性查找性能下降。

**解决方案**：
- 避免过深的原型链
- 对于频繁访问的属性，考虑在实例上缓存
- 使用 Object.hasOwnProperty() 检查属性是否存在

### 4. 继承时的构造函数调用

**问题**：继承时需要正确调用父构造函数。

**解决方案**：在子构造函数中使用 call() 或 apply() 调用父构造函数。

```javascript
function Parent(name) {
  this.name = name;
}

function Child(name, age) {
  Parent.call(this, name); // 调用父构造函数
  this.age = age;
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

### 5. 扩展内置对象的风险

**问题**：扩展内置对象的原型可能与未来的 JavaScript 标准冲突。

**解决方案**：
- 谨慎扩展内置对象
- 使用前缀命名自定义方法
- 考虑使用组合而不是修改内置对象

## 原型链的应用场景

### 1. 面向对象编程

使用原型链实现类和继承，构建复杂的应用。

### 2. 库和框架开发

许多 JavaScript 库和框架（如 jQuery、React）都使用原型链来实现核心功能。

### 3. 工具函数的组织

将相关的工具函数组织在原型上，提高代码的可维护性。

### 4. 插件系统

使用原型链实现插件系统，允许扩展核心功能。

### 5. 原型继承的替代方案

#### 1. 混入（Mixin）

```javascript
const mixin = {
  sayHello() {
    console.log(`Hello, ${this.name}`);
  }
};

function Person(name) {
  this.name = name;
  Object.assign(this, mixin);
}

const person = new Person('Alice');
person.sayHello(); // Hello, Alice
```

#### 2. 工厂函数

```javascript
function createPerson(name) {
  const person = {
    name,
    sayHello() {
      console.log(`Hello, ${this.name}`);
    }
  };
  return person;
}

const person = createPerson('Bob');
person.sayHello(); // Hello, Bob
```

#### 3. 模块模式

```javascript
const personModule = (function() {
  const privateMethod = function() {
    console.log('Private method');
  };
  
  return {
    createPerson: function(name) {
      return {
        name,
        sayHello() {
          console.log(`Hello, ${this.name}`);
          privateMethod();
        }
      };
    }
  };
})();

const person = personModule.createPerson('Charlie');
person.sayHello(); // Hello, Charlie
```

## 原型链与其他概念的关系

### 1. 原型链与 this

在原型方法中，this 指向调用该方法的实例。

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
};

const person1 = new Person('Alice');
const person2 = new Person('Bob');

person1.sayHello(); // this 指向 person1
person2.sayHello(); // this 指向 person2
```

### 2. 原型链与闭包

闭包可以访问外部函数的变量，而原型链允许对象访问原型的属性和方法。

```javascript
function createCounter() {
  let count = 0;
  
  function Counter() {}
  
  Counter.prototype.increment = function() {
    count++;
    return count;
  };
  
  return new Counter();
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
```

### 3. 原型链与 ES6 Class

ES6 Class 是原型链的语法糖，底层仍然使用原型链实现。

```javascript
// ES6 Class
class Person {
  constructor(name) {
    this.name = name;
  }
  
  sayHello() {
    console.log(`Hello, ${this.name}`);
  }
}

// 等价于
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, ${this.name}`);
};
```

### 4. 原型链与 instanceof

instanceof 运算符通过检查对象的原型链来确定对象是否属于某个构造函数的实例。

```javascript
function Person() {}
const person = new Person();

console.log(person instanceof Person); // true
console.log(person instanceof Object); // true

const arr = [];
console.log(arr instanceof Array); // true
console.log(arr instanceof Object); // true
```

## 性能优化

### 1. 避免过深的原型链

过深的原型链会导致属性查找性能下降，建议原型链深度不超过 3-4 层。

### 2. 合理使用原型方法

将共享的方法定义在原型上，而不是在构造函数内部，以节省内存。

### 3. 缓存频繁访问的属性

对于频繁访问的原型属性，可以在实例上缓存，减少原型链查找开销。

```javascript
function Person(name) {
  this.name = name;
  // 缓存原型方法
  this.sayHello = this.sayHello.bind(this);
}

Person.prototype.sayHello = function() {
  console.log(`Hello, ${this.name}`);
};
```

### 4. 使用 Object.hasOwnProperty()

在遍历对象属性时，使用 Object.hasOwnProperty() 只遍历实例自身的属性，避免原型链查找。

```javascript
function printOwnProperties(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      console.log(`${prop}: ${obj[prop]}`);
    }
  }
}
```

### 5. 避免修改内置对象的原型

修改内置对象的原型可能导致与其他代码的冲突，建议使用其他方式扩展功能。

## 总结

原型链是 JavaScript 中实现继承的核心机制，它允许对象继承另一个对象的属性和方法。理解原型链对于掌握 JavaScript 的面向对象编程至关重要。

### 核心要点

1. **原型链的结构**：对象 → 构造函数.prototype → Object.prototype → null
2. **原型继承**：通过设置构造函数的 prototype 属性实现
3. **属性查找**：沿着原型链向上查找，直到找到属性或到达 null
4. **原型的修改**：修改原型会影响所有继承自该原型的实例
5. **性能优化**：合理使用原型方法，避免过深的原型链

### 最佳实践

1. **使用组合模式**：构造函数初始化实例属性，原型定义共享方法
2. **修复 constructor 指向**：使用 Object.create() 继承时，手动修复 constructor 指向
3. **在构造函数中初始化引用类型**：避免原型上的引用类型属性被所有实例共享
4. **谨慎扩展内置对象**：避免与未来的 JavaScript 标准冲突
5. **使用 ES6 Class**：利用现代语法糖，提高代码可读性

原型链是 JavaScript 中一个强大而灵活的特性，它为 JavaScript 的面向对象编程提供了基础。掌握原型链的工作原理和使用方法，对于编写高质量的 JavaScript 代码至关重要。

通过合理使用原型链，可以创建结构清晰、性能优化的代码，同时充分利用 JavaScript 的面向对象特性。无论是构建简单的应用还是复杂的框架，原型链都是 JavaScript 开发者必须掌握的核心概念之一。
