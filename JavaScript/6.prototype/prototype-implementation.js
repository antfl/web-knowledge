/**
 * 原型链（Prototype Chain）示例代码
 * 演示原型链的各种用法和特性
 */

// 示例 1: 基本原型链
function Person(name) {
  this.name = name;
}

// 在 Person 的原型上添加方法
Person.prototype.sayHello = function() {
  console.log(`Hello, my name is ${this.name}`);
};

// 测试基本原型链
const person1 = new Person('Alice');
const person2 = new Person('Bob');
console.log('示例 1 - 基本原型链:');
person1.sayHello(); // Hello, my name is Alice
person2.sayHello(); // Hello, my name is Bob
console.log('person1 和 person2 共享同一个 sayHello 方法:', person1.sayHello === person2.sayHello); // true

// 示例 2: 原型链继承
function Employee(name, jobTitle) {
  // 调用父构造函数
  Person.call(this, name);
  this.jobTitle = jobTitle;
}

// 设置原型链继承
Employee.prototype = Object.create(Person.prototype);
// 修复 constructor 指向
Employee.prototype.constructor = Employee;

// 在 Employee 的原型上添加方法
Employee.prototype.sayJob = function() {
  console.log(`I am a ${this.jobTitle}`);
};

// 测试原型链继承
const employee1 = new Employee('Charlie', 'Engineer');
console.log('\n示例 2 - 原型链继承:');
employee1.sayHello(); // 继承自 Person
employee1.sayJob(); //  Employee 自己的方法
console.log('employee1 是 Employee 的实例:', employee1 instanceof Employee); // true
console.log('employee1 是 Person 的实例:', employee1 instanceof Person); // true
console.log('employee1 是 Object 的实例:', employee1 instanceof Object); // true

// 示例 3: 原型对象
console.log('\n示例 3 - 原型对象:');
console.log('Person.prototype:', Person.prototype);
console.log('Employee.prototype:', Employee.prototype);
console.log('person1.__proto__:', person1.__proto__);
console.log('Person.prototype === person1.__proto__:', Person.prototype === person1.__proto__); // true
console.log('Employee.prototype === employee1.__proto__:', Employee.prototype === employee1.__proto__); // true

// 示例 4: 原型链查找
function Animal() {
  this.type = 'Animal';
}

Animal.prototype.eat = function() {
  console.log('Eating...');
};

function Dog(name) {
  Animal.call(this);
  this.name = name;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log('Woof!');
};

// 测试原型链查找
const dog = new Dog('Rex');
console.log('\n示例 4 - 原型链查找:');
dog.bark(); // Dog 原型上的方法
dog.eat(); // Animal 原型上的方法
console.log('dog.type:', dog.type); // Animal 构造函数中定义的属性
console.log('dog.name:', dog.name); // Dog 构造函数中定义的属性

// 示例 5: 修改原型
console.log('\n示例 5 - 修改原型:');
// 向 Person.prototype 添加新方法
Person.prototype.sayAge = function(age) {
  console.log(`I am ${age} years old`);
};

// 所有 Person 实例都能访问新方法
person1.sayAge(30); // I am 30 years old
person2.sayAge(25); // I am 25 years old
// Employee 实例也能访问，因为它继承自 Person
employee1.sayAge(35); // I am 35 years old

// 示例 6: 原型链的终点
console.log('\n示例 6 - 原型链的终点:');
console.log('Object.prototype.__proto__:', Object.prototype.__proto__); // null
console.log('Function.prototype.__proto__:', Function.prototype.__proto__); // Object.prototype
console.log('Function.__proto__:', Function.__proto__); // Function.prototype

// 示例 7: 构造函数与原型
console.log('\n示例 7 - 构造函数与原型:');
console.log('Person.constructor:', Person.constructor);
console.log('Person.prototype.constructor:', Person.prototype.constructor);
console.log('person1.constructor:', person1.constructor);

// 示例 8: 使用 Object.getPrototypeOf
console.log('\n示例 8 - 使用 Object.getPrototypeOf:');
console.log('Object.getPrototypeOf(person1):', Object.getPrototypeOf(person1));
console.log('Object.getPrototypeOf(employee1):', Object.getPrototypeOf(employee1));
console.log('Object.getPrototypeOf(Employee.prototype):', Object.getPrototypeOf(Employee.prototype));

// 示例 9: 使用 Object.setPrototypeOf
function Cat(name) {
  this.name = name;
}

const cat = new Cat('Whiskers');
console.log('\n示例 9 - 使用 Object.setPrototypeOf:');
console.log('cat.sayHello 存在吗?', typeof cat.sayHello === 'function'); // false

// 设置 cat 的原型为 Person.prototype
Object.setPrototypeOf(cat, Person.prototype);
console.log('设置原型后，cat.sayHello 存在吗?', typeof cat.sayHello === 'function'); // true
cat.sayHello(); // Hello, my name is Whiskers

// 示例 10: 使用 __proto__
console.log('\n示例 10 - 使用 __proto__:');
const obj = {};
const proto = { greeting: 'Hello' };
obj.__proto__ = proto;
console.log('obj.greeting:', obj.greeting); // Hello

// 示例 11: 原型继承的多种方式
// 方式 1: Object.create
console.log('\n示例 11 - 原型继承的多种方式:');
const parent = { name: 'Parent', sayName: function() { console.log(this.name); } };
const child1 = Object.create(parent);
child1.name = 'Child 1';
child1.sayName(); // Child 1

// 方式 2: 构造函数
function Parent() {
  this.name = 'Parent';
}
Parent.prototype.sayName = function() { console.log(this.name); };

function Child() {
  Parent.call(this);
  this.name = 'Child';
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child2 = new Child();
child2.sayName(); // Child

// 方式 3: ES6 Class
class ParentClass {
  constructor() {
    this.name = 'ParentClass';
  }
  sayName() {
    console.log(this.name);
  }
}

class ChildClass extends ParentClass {
  constructor() {
    super();
    this.name = 'ChildClass';
  }
}

const child3 = new ChildClass();
child3.sayName(); // ChildClass

// 示例 12: 原型方法与实例方法
function Car(make) {
  this.make = make;
  // 实例方法（每个实例都有自己的副本）
  this.start = function() {
    console.log(`${this.make} is starting`);
  };
}

// 原型方法（所有实例共享）
Car.prototype.stop = function() {
  console.log(`${this.make} is stopping`);
};

const car1 = new Car('Toyota');
const car2 = new Car('Honda');
console.log('\n示例 12 - 原型方法与实例方法:');
car1.start(); // Toyota is starting
car2.start(); // Honda is starting
car1.stop(); // Toyota is stopping
car2.stop(); // Honda is stopping
console.log('start 方法是否相同:', car1.start === car2.start); // false
console.log('stop 方法是否相同:', car1.stop === car2.stop); // true

// 示例 13: 原型链中的 this 指向
console.log('\n示例 13 - 原型链中的 this 指向:');
const person = new Person('David');
const employee = new Employee('Eve', 'Manager');

Person.prototype.introduce = function() {
  console.log(`I am ${this.name}`);
};

person.introduce(); // I am David
employee.introduce(); // I am Eve

// 示例 14: 原型链与属性遮蔽
console.log('\n示例 14 - 原型链与属性遮蔽:');
// 在原型上定义属性
Person.prototype.age = 18;
console.log('person1.age (原型):', person1.age); // 18

// 在实例上定义同名属性，会遮蔽原型上的属性
person1.age = 30;
console.log('person1.age (实例):', person1.age); // 30
console.log('person2.age (原型):', person2.age); // 18

// 示例 15: 使用 hasOwnProperty
console.log('\n示例 15 - 使用 hasOwnProperty:');
console.log('person1.hasOwnProperty("name"):', person1.hasOwnProperty('name')); // true
console.log('person1.hasOwnProperty("age"):', person1.hasOwnProperty('age')); // true
console.log('person2.hasOwnProperty("age"):', person2.hasOwnProperty('age')); // false
console.log('person1.hasOwnProperty("sayHello"):', person1.hasOwnProperty('sayHello')); // false

// 示例 16: 枚举原型属性
console.log('\n示例 16 - 枚举原型属性:');
// 遍历实例的所有可枚举属性（包括原型链上的）
for (let prop in person1) {
  console.log(`${prop}: ${person1[prop]}`);
}

// 只遍历实例自身的属性
console.log('\n只遍历实例自身的属性:');
for (let prop in person1) {
  if (person1.hasOwnProperty(prop)) {
    console.log(`${prop}: ${person1[prop]}`);
  }
}

// 示例 17: 原型链与 instanceof
console.log('\n示例 17 - 原型链与 instanceof:');
console.log('person1 instanceof Person:', person1 instanceof Person); // true
console.log('person1 instanceof Object:', person1 instanceof Object); // true
console.log('employee1 instanceof Employee:', employee1 instanceof Employee); // true
console.log('employee1 instanceof Person:', employee1 instanceof Person); // true
console.log('employee1 instanceof Object:', employee1 instanceof Object); // true
console.log('{} instanceof Object:', {} instanceof Object); // true
console.log('[] instanceof Array:', [] instanceof Array); // true
console.log('[] instanceof Object:', [] instanceof Object); // true

// 示例 18: 原型链与函数
console.log('\n示例 18 - 原型链与函数:');
function myFunction() {}
console.log('myFunction.prototype:', myFunction.prototype);
console.log('Function.prototype:', Function.prototype);
console.log('myFunction instanceof Function:', myFunction instanceof Function); // true
console.log('Function instanceof Function:', Function instanceof Function); // true
console.log('Function.prototype instanceof Object:', Function.prototype instanceof Object); // true

// 示例 19: 原型链与数组
console.log('\n示例 19 - 原型链与数组:');
const arr = [1, 2, 3];
console.log('arr.__proto__:', arr.__proto__);
console.log('Array.prototype:', Array.prototype);
console.log('arr instanceof Array:', arr instanceof Array); // true
console.log('arr instanceof Object:', arr instanceof Object); // true

// 示例 20: 扩展内置对象的原型
console.log('\n示例 20 - 扩展内置对象的原型:');
// 扩展 Array 原型
Array.prototype.last = function() {
  return this[this.length - 1];
};

const numbers = [1, 2, 3, 4, 5];
console.log('numbers.last():', numbers.last()); // 5

// 扩展 String 原型
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const message = 'hello world';
console.log('message.capitalize():', message.capitalize()); // Hello world

// 示例 21: 原型链的性能
console.log('\n示例 21 - 原型链的性能:');
// 创建大量实例
function LargeObject() {
  this.instanceProp = 'instance';
}

LargeObject.prototype.prototypeProp = 'prototype';

console.time('创建 10000 个实例');
const objects = [];
for (let i = 0; i < 10000; i++) {
  objects.push(new LargeObject());
}
console.timeEnd('创建 10000 个实例');

console.log('objects[0].instanceProp:', objects[0].instanceProp);
console.log('objects[0].prototypeProp:', objects[0].prototypeProp);
console.log('所有实例共享 prototypeProp:', objects[0].prototypeProp === objects[1].prototypeProp); // true

// 示例 22: 原型链与继承链
console.log('\n示例 22 - 原型链与继承链:');
function Grandparent() {
  this.grandparentProp = 'grandparent';
}

Grandparent.prototype.grandparentMethod = function() {
  console.log('Grandparent method');
};

function Parent() {
  Grandparent.call(this);
  this.parentProp = 'parent';
}

Parent.prototype = Object.create(Grandparent.prototype);
Parent.prototype.constructor = Parent;
Parent.prototype.parentMethod = function() {
  console.log('Parent method');
};

function Child() {
  Parent.call(this);
  this.childProp = 'child';
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
Child.prototype.childMethod = function() {
  console.log('Child method');
};

const child = new Child();
console.log('child.grandparentProp:', child.grandparentProp);
console.log('child.parentProp:', child.parentProp);
console.log('child.childProp:', child.childProp);
child.grandparentMethod();
child.parentMethod();
child.childMethod();
console.log('child instanceof Child:', child instanceof Child); // true
console.log('child instanceof Parent:', child instanceof Parent); // true
console.log('child instanceof Grandparent:', child instanceof Grandparent); // true
console.log('child instanceof Object:', child instanceof Object); // true

// 示例 23: 原型链与原型继承的陷阱
console.log('\n示例 23 - 原型链与原型继承的陷阱:');
// 陷阱 1: 引用类型的原型属性
function Container() {}
Container.prototype.items = [];

const container1 = new Container();
const container2 = new Container();

container1.items.push('item1');
console.log('container1.items:', container1.items); // ['item1']
console.log('container2.items:', container2.items); // ['item1'] - 注意：两个实例共享同一个数组

// 正确的做法：在构造函数中初始化引用类型
function SafeContainer() {
  this.items = [];
}

const safeContainer1 = new SafeContainer();
const safeContainer2 = new SafeContainer();

safeContainer1.items.push('item1');
console.log('safeContainer1.items:', safeContainer1.items); // ['item1']
console.log('safeContainer2.items:', safeContainer2.items); // [] - 每个实例都有自己的数组

// 陷阱 2: 忘记修复 constructor 指向
function A() {}
function B() {}
B.prototype = Object.create(A.prototype);
console.log('B.prototype.constructor:', B.prototype.constructor); // A - 错误

// 修复 constructor 指向
B.prototype.constructor = B;
console.log('修复后 B.prototype.constructor:', B.prototype.constructor); // B - 正确

// 示例 24: 使用 Object.create 实现原型继承
console.log('\n示例 24 - 使用 Object.create 实现原型继承:');
const base = {
  baseProp: 'base',
  baseMethod: function() {
    console.log('Base method');
  }
};

const derived = Object.create(base, {
  derivedProp: {
    value: 'derived',
    writable: true,
    enumerable: true,
    configurable: true
  },
  derivedMethod: {
    value: function() {
      console.log('Derived method');
    },
    writable: true,
    enumerable: true,
    configurable: true
  }
});

console.log('derived.baseProp:', derived.baseProp);
derived.baseMethod();
console.log('derived.derivedProp:', derived.derivedProp);
derived.derivedMethod();

// 示例 25: ES6 Class 的原型链
console.log('\n示例 25 - ES6 Class 的原型链:');
class AnimalClass {
  constructor(type) {
    this.type = type;
  }
  eat() {
    console.log(`${this.type} is eating`);
  }
}

class DogClass extends AnimalClass {
  constructor(name) {
    super('dog');
    this.name = name;
  }
  bark() {
    console.log(`${this.name} is barking`);
  }
}

const dogClass = new DogClass('Rex');
dogClass.eat();
dogClass.bark();
console.log('dogClass instanceof DogClass:', dogClass instanceof DogClass); // true
console.log('dogClass instanceof AnimalClass:', dogClass instanceof AnimalClass); // true
console.log('dogClass instanceof Object:', dogClass instanceof Object); // true

console.log('\n所有示例执行完毕！');
