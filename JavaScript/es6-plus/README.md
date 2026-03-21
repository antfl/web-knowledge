# JavaScript ES6+ 新特性

## 目录

1. [let 和 const](#let-和-const)
2. [箭头函数](#箭头函数)
3. [解构赋值](#解构赋值)
4. [模板字符串](#模板字符串)
5. [扩展运算符](#扩展运算符)
6. [类](#类)
7. [模块化](#模块化)
8. [Promise](#promise)
9. [async/await](#asyncawait)
10. [Map 和 Set](#map-和-set)
11. [Symbol](#symbol)
12. [Proxy 和 Reflect](#proxy-和-reflect)
13. [可选链和空值合并](#可选链和空值合并)
14. [迭代器和生成器](#迭代器和生成器)
15. [对象方法扩展](#对象方法扩展)
16. [数组方法扩展](#数组方法扩展)
17. [字符串方法扩展](#字符串方法扩展)
18. [数值方法扩展](#数值方法扩展)

---

## let 和 const

### 基本概念

ES6 引入了 `let` 和 `const` 两个新的变量声明关键字，用于替代 `var`。

### let - 块级作用域

```javascript
// let 声明的变量具有块级作用域
if (true) {
  let x = 10;
  console.log(x); // 10
}
// console.log(x); // ReferenceError: x is not defined

// for 循环中的 let
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}
// console.log(i); // ReferenceError: i is not defined
```

### const - 常量

```javascript
// const 声明的常量不能重新赋值
const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

// 但 const 声明的对象可以修改属性
const obj = { name: '张三' };
obj.name = '李四';
console.log(obj.name); // '李四'

// const 声明的数组可以修改元素
const arr = [1, 2, 3];
arr.push(4);
console.log(arr); // [1, 2, 3, 4]
```

### 暂时性死区

```javascript
// 在变量声明之前使用变量会报错
// console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 10;

// 函数内部也有暂时性死区
function test() {
  // console.log(y); // ReferenceError
  let y = 20;
}
```

### let/const vs var

| 特性 | let/const | var |
|------|----------|-----|
| 作用域 | 块级作用域 | 函数作用域 |
| 变量提升 | 存在暂时性死区 | 变量提升为 undefined |
| 重复声明 | 不允许 | 允许 |
| 全局属性 | 不会成为 window 属性 | 成为 window 属性 |

---

## 箭头函数

### 基本语法

```javascript
// 基本箭头函数
const add = (a, b) => a + b;
console.log(add(1, 2)); // 3

// 单个参数可以省略括号
const square = x => x * x;
console.log(square(5)); // 25

// 多行代码需要大括号
const sum = (a, b) => {
  console.log('计算中...');
  return a + b;
};
```

### this 指向

```javascript
// 箭头函数的 this 指向外层作用域
const obj = {
  name: '对象',
  regular: function() {
    console.log('普通函数 this:', this.name); // '对象'
  },
  arrow: () => {
    console.log('箭头函数 this:', this.name); // undefined（指向全局）
  }
};

obj.regular();
obj.arrow();

// 使用箭头函数解决 this 问题
const timer = {
  count: 0,
  start: function() {
    setInterval(() => {
      this.count++;
      console.log(this.count);
    }, 1000);
  }
};
timer.start();
```

### 箭头函数的限制

```javascript
// 1. 不能用作构造函数
const Person = (name) => {
  this.name = name;
};
// const p = new Person('张三'); // TypeError: Person is not a constructor

// 2. 没有 arguments 对象
const func = () => {
  // console.log(arguments); // ReferenceError: arguments is not defined
};

// 3. 不能使用 yield
// const gen = () => { yield 1; }; // SyntaxError
```

---

## 解构赋值

### 数组解构

```javascript
// 基本解构
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// 跳过元素
const [first, , third] = [1, 2, 3];
console.log(first, third); // 1 3

// 剩余元素
const [x, y, ...rest] = [1, 2, 3, 4, 5];
console.log(rest); // [3, 4, 5]

// 默认值
const [p, q, r = 10] = [1, 2];
console.log(r); // 10

// 交换变量
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2 1
```

### 对象解构

```javascript
// 基本解构
const { name, age } = { name: '张三', age: 25 };
console.log(name, age); // '张三' 25

// 重命名
const { name: userName, age: userAge } = { name: '李四', age: 30 };
console.log(userName, userAge); // '李四' 30

// 剩余属性
const { title, ...other } = { title: '标题', author: '作者', date: '2024' };
console.log(other); // { author: '作者', date: '2024' }

// 默认值
const { x = 10, y = 20 } = { x: 5 };
console.log(x, y); // 5 20

// 嵌套解构
const user = {
  info: {
    name: '王五',
    address: {
      city: '北京'
    }
  }
};
const { info: { name: userName2, address: { city } } } = user;
console.log(userName2, city); // '王五' '北京'
```

### 函数参数解构

```javascript
// 对象参数解构
function greet({ name, age }) {
  console.log(`你好，我是${name}，今年${age}岁`);
}
greet({ name: '张三', age: 25 });

// 数组参数解构
function sum([a, b, c]) {
  return a + b + c;
}
console.log(sum([1, 2, 3])); // 6

// 默认值
function createUser({ name = '匿名', age = 0 } = {}) {
  return { name, age };
}
console.log(createUser()); // { name: '匿名', age: 0 }
```

---

## 模板字符串

### 基本语法

```javascript
// 使用反引号定义
const name = '张三';
const age = 25;
const message = `你好，我是${name}，今年${age}岁`;
console.log(message); // '你好，我是张三，今年25岁'
```

### 多行字符串

```javascript
// 多行字符串
const multiline = `
  第一行
  第二行
  第三行
`;
console.log(multiline);

// 等价于
const multiline2 = '\n  第一行\n  第二行\n  第三行\n';
```

### 表达式插入

```javascript
// 插入表达式
const a = 10, b = 20;
const result = `${a} + ${b} = ${a + b}`;
console.log(result); // '10 + 20 = 30'

// 调用函数
function getGreeting(name) {
  return `你好，${name}`;
}
const greeting = `${getGreeting('张三')}`;
console.log(greeting); // '你好，张三'

// 三元表达式
const status = true;
const message2 = `状态: ${status ? '成功' : '失败'}`;
console.log(message2); // '状态: 成功'
```

### 标签模板

```javascript
// 标签模板
function tag(strings, ...values) {
  console.log('字符串数组:', strings);
  console.log('值数组:', values);
  return strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || '');
  }, '');
}

const name = '张三';
const age = 25;
const tagged = tag`Hello ${name}, age ${age}`;
console.log(tagged);

// 实际应用：HTML 转义
function html(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    const value = values[i]
      ? String(values[i]).replace(/&/g, '&amp;')
                         .replace(/</g, '&lt;')
                         .replace(/>/g, '&gt;')
      : '';
    return acc + str + value;
  }, '');
}

const userInput = '<script>alert("XSS")</script>';
const safeHtml = html`<div>${userInput}</div>`;
console.log(safeHtml);
```

---

## 扩展运算符

### 数组扩展

```javascript
// 数组合并
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// 数组拷贝
const arrCopy = [...arr1];
console.log(arrCopy); // [1, 2, 3]

// 数组去重
const arr3 = [1, 2, 3, 3, 2, 1];
const unique = [...new Set(arr3)];
console.log(unique); // [1, 2, 3]

// 字符串转数组
const str = 'hello';
const chars = [...str];
console.log(chars); // ['h', 'e', 'l', 'l', 'o']
```

### 对象扩展

```javascript
// 对象合并
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 2, c: 3, d: 4 }

// 对象拷贝
const objCopy = { ...obj1 };
console.log(objCopy); // { a: 1, b: 2 }

// 添加属性
const updated = { ...obj1, e: 5 };
console.log(updated); // { a: 1, b: 2, e: 5 }

// 覆盖属性
const overridden = { ...obj1, a: 10 };
console.log(overridden); // { a: 10, b: 2 }
```

### 函数参数

```javascript
// 剩余参数
function sumAll(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}
console.log(sumAll(1, 2, 3, 4, 5)); // 15

// 展开参数
const arr4 = [1, 2, 3];
console.log(Math.max(...arr4)); // 3

// 数组作为参数
function multiply(a, b, c) {
  return a * b * c;
}
console.log(multiply(...arr4)); // 6
```

---

## 类

### 基本语法

```javascript
// 定义类
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(`你好，我是${this.name}`);
  }

  get info() {
    return `${this.name} - ${this.age}岁`;
  }

  set info(value) {
    const [name, age] = value.split(' - ');
    this.name = name;
    this.age = parseInt(age);
  }
}

const person = new Person('张三', 25);
person.sayHello();
console.log(person.info);
person.info = '李四 - 30岁';
console.log(person.name);
```

### 继承

```javascript
// 父类
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name}发出声音`);
  }
}

// 子类
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name}汪汪叫`);
  }

  fetch() {
    console.log(`${this.name}去捡球`);
  }
}

const dog = new Dog('旺财', '金毛');
dog.speak();
dog.fetch();
```

### 静态方法

```javascript
class Calculator {
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }
}

console.log(Calculator.add(1, 2)); // 3
console.log(Calculator.multiply(3, 4)); // 12
```

---

## 模块化

### 导出

```javascript
// 命名导出
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export class Calculator {
  // ...
}

// 默认导出
export default class MyCalculator {
  // ...
}

// 混合导出
export const E = 2.71828;
export default function() {
  console.log('默认导出');
}
```

### 导入

```javascript
// 命名导入
import { PI, add } from './math.js';

// 默认导入
import Calculator from './calculator.js';

// 重命名导入
import { PI as PI_VALUE } from './math.js';

// 导入所有
import * as Math from './math.js';

// 导入但不使用
import './styles.css';
```

### 动态导入

```javascript
// 动态导入
async function loadModule() {
  const module = await import('./math.js');
  console.log(module.add(1, 2));
}

loadModule();
```

---

## Promise

### 基本用法

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  }, 1000);
});

promise
  .then(result => {
    console.log('结果:', result);
  })
  .catch(error => {
    console.error('错误:', error);
  })
  .finally(() => {
    console.log('完成');
  });
```

### Promise 链式调用

```javascript
Promise.resolve(1)
  .then(value => {
    console.log(value); // 1
    return value + 1;
  })
  .then(value => {
    console.log(value); // 2
    return value + 1;
  })
  .then(value => {
    console.log(value); // 3
  });
```

### Promise.all

```javascript
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log(results); // [1, 2, 3]
  })
  .catch(error => {
    console.error('错误:', error);
  });
```

### Promise.race

```javascript
const promise1 = new Promise(resolve => setTimeout(() => resolve('A'), 1000));
const promise2 = new Promise(resolve => setTimeout(() => resolve('B'), 500));

Promise.race([promise1, promise2])
  .then(result => {
    console.log(result); // 'B'
  });
```

---

## async/await

### 基本用法

```javascript
// async 函数返回 Promise
async function fetchData() {
  try {
    const data = await new Promise(resolve => {
      setTimeout(() => resolve('数据'), 1000);
    });
    console.log('获取到数据:', data);
    return data;
  } catch (error) {
    console.error('错误:', error);
  }
}

fetchData();
```

### 并行执行

```javascript
async function parallelFetch() {
  const [data1, data2] = await Promise.all([
    new Promise(resolve => setTimeout(() => resolve('数据1'), 500)),
    new Promise(resolve => setTimeout(() => resolve('数据2'), 300))
  ]);
  console.log('并行获取:', data1, data2);
}

parallelFetch();
```

### 错误处理

```javascript
async function handleErrors() {
  try {
    const result = await Promise.reject('错误');
    console.log(result);
  } catch (error) {
    console.error('捕获错误:', error);
  } finally {
    console.log('清理资源');
  }
}

handleErrors();
```

---

## Map 和 Set

### Map

```javascript
// 创建 Map
const map = new Map();

// 添加键值对
map.set('name', '张三');
map.set('age', 25);
map.set(1, '数字键');

// 获取值
console.log(map.get('name')); // '张三'

// 检查键是否存在
console.log(map.has('age')); // true

// 删除键值对
map.delete('age');

// 获取大小
console.log(map.size); // 2

// 遍历
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// 获取所有键和值
console.log(map.keys()); // MapIterator {'name', 1}
console.log(map.values()); // MapIterator {'张三', '数字键'}
console.log(map.entries()); // MapIterator {['name', '张三'], [1, '数字键']}
```

### Set

```javascript
// 创建 Set
const set = new Set([1, 2, 3, 3, 2, 1]);

// 添加元素
set.add(4);

// 检查元素是否存在
console.log(set.has(3)); // true

// 删除元素
set.delete(2);

// 获取大小
console.log(set.size); // 3

// 遍历
set.forEach(value => {
  console.log(value);
});

// 数组去重
const arr = [1, 2, 3, 3, 2, 1];
const unique = [...new Set(arr)];
console.log(unique); // [1, 2, 3]
```

---

## Symbol

### 基本用法

```javascript
// 创建 Symbol
const sym1 = Symbol('description');
const sym2 = Symbol('description');

console.log(sym1 === sym2); // false
console.log(typeof sym1); // 'symbol'

// 作为对象属性键
const obj = {
  [sym1]: '值1',
  [sym2]: '值2',
  name: '普通属性'
};

console.log(obj[sym1]); // '值1'
console.log(obj.name); // '普通属性'

// 获取所有 Symbol 键
const symbols = Object.getOwnPropertySymbols(obj);
console.log(symbols); // [Symbol(description), Symbol(description)]
```

### 内置 Symbol

```javascript
// Symbol.iterator - 定义迭代器
const iterable = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const item of iterable) {
  console.log(item);
}

// Symbol.toStringTag - 自定义对象类型描述
class MyArray {
  get [Symbol.toStringTag]() {
    return 'MyArray';
  }
}

const myArray = new MyArray();
console.log(Object.prototype.toString.call(myArray)); // '[object MyArray]'
```

---

## Proxy 和 Reflect

### Proxy 基本用法

```javascript
const target = {
  name: '张三',
  age: 25
};

const proxy = new Proxy(target, {
  get(target, property, receiver) {
    console.log(`获取属性: ${property}`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`设置属性: ${property} = ${value}`);
    return Reflect.set(target, property, value, receiver);
  }
});

console.log(proxy.name);
proxy.age = 26;
```

### 数据验证

```javascript
const validator = {
  set(target, property, value) {
    if (property === 'age' && typeof value !== 'number') {
      throw new TypeError('年龄必须是数字');
    }
    if (property === 'age' && value < 0) {
      throw new RangeError('年龄不能为负数');
    }
    target[property] = value;
    return true;
  }
};

const person = new Proxy({}, validator);
person.age = 25;
console.log(person.age); // 25

// person.age = -1; // RangeError: 年龄不能为负数
// person.age = '25'; // TypeError: 年龄必须是数字
```

### 只读对象

```javascript
const readOnly = (obj) => {
  return new Proxy(obj, {
    set(target, property) {
      console.warn(`属性 ${property} 是只读的`);
      return false;
    }
  });
};

const config = readOnly({ apiKey: '12345' });
config.apiKey = '67890'; // 警告：属性 apiKey 是只读的
console.log(config.apiKey); // '12345'
```

---

## 可选链和空值合并

### 可选链

```javascript
const user = {
  info: {
    name: '张三',
    address: {
      city: '北京'
    }
  }
};

// 可选链访问
const city = user?.info?.address?.city;
console.log(city); // '北京'

// 安全访问数组
const items = user?.items?.[0]; // undefined

// 安全调用方法
const result = user.getInfo?.(); // undefined 如果 getInfo 不存在

// 与空值合并结合
const defaultCity = user?.info?.address?.city ?? '未知';
console.log(defaultCity); // '北京'
```

### 空值合并

```javascript
// ?? 只处理 null 和 undefined
const value1 = null ?? '默认值';
console.log(value1); // '默认值'

const value2 = undefined ?? '默认值';
console.log(value2); // '默认值'

const value3 = 0 ?? '默认值';
console.log(value3); // 0

const value4 = '' ?? '默认值';
console.log(value4); // ''

const value5 = false ?? '默认值';
console.log(value5); // false

// 与 || 的区别
const value6 = 0 || '默认值';
console.log(value6); // '默认值'（|| 会处理所有假值）

const value7 = 0 ?? '默认值';
console.log(value7); // 0（?? 只处理 null 和 undefined）
```

---

## 迭代器和生成器

### 迭代器

```javascript
// 自定义迭代器
const iterable = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    const data = this.data;
    
    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const item of iterable) {
  console.log(item);
}

// 使用展开运算符
console.log([...iterable]); // [1, 2, 3]
```

### 生成器

```javascript
// 基本生成器
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// 生成器迭代
for (const value of generator()) {
  console.log(value);
}

// 无限生成器
function* infiniteGenerator() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const infiniteGen = infiniteGenerator();
console.log(infiniteGen.next().value); // 0
console.log(infiniteGen.next().value); // 1
```

---

## 对象方法扩展

### Object.assign

```javascript
// 对象合并
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const merged = Object.assign({}, obj1, obj2);
console.log(merged); // { a: 1, b: 2 }

// 浅拷贝
const copy = Object.assign({}, obj1);
console.log(copy); // { a: 1 }
```

### Object.keys

```javascript
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // ['a', 'b', 'c']
```

### Object.values

```javascript
console.log(Object.values(obj)); // [1, 2, 3]
```

### Object.entries

```javascript
console.log(Object.entries(obj)); // [['a', 1], ['b', 2], ['c', 3]]
```

### Object.fromEntries

```javascript
const entries = [['a', 1], ['b', 2]];
const obj2 = Object.fromEntries(entries);
console.log(obj2); // { a: 1, b: 2 }
```

---

## 数组方法扩展

### Array.from

```javascript
// 类数组转数组
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
const arr = Array.from(arrayLike);
console.log(arr); // ['a', 'b', 'c']

// 使用映射函数
const arr2 = Array.from([1, 2, 3], x => x * 2);
console.log(arr2); // [2, 4, 6]
```

### Array.of

```javascript
console.log(Array.of(1, 2, 3)); // [1, 2, 3]
console.log(Array.of(1)); // [1]
```

### find

```javascript
const arr = [1, 2, 3, 4, 5];
const found = arr.find(item => item > 3);
console.log(found); // 4
```

### findIndex

```javascript
const index = arr.findIndex(item => item > 3);
console.log(index); // 3
```

### includes

```javascript
console.log(arr.includes(3)); // true
console.log(arr.includes(6)); // false
```

### flat

```javascript
const nested = [1, [2, [3, [4]]]];
console.log(nested.flat()); // [1, 2, [3, [4]]]
console.log(nested.flat(2)); // [1, 2, 3, [4]]
console.log(nested.flat(Infinity)); // [1, 2, 3, 4]
```

### flatMap

```javascript
const arr3 = [1, 2, 3];
const mapped = arr3.flatMap(x => [x, x * 2]);
console.log(mapped); // [1, 2, 2, 4, 3, 6]
```

---

## 字符串方法扩展

### includes

```javascript
const str = 'Hello World';
console.log(str.includes('World')); // true
console.log(str.includes('world')); // false
```

### startsWith

```javascript
console.log(str.startsWith('Hello')); // true
console.log(str.startsWith('World')); // false
```

### endsWith

```javascript
console.log(str.endsWith('World')); // true
console.log(str.endsWith('Hello')); // false
```

### repeat

```javascript
console.log('abc'.repeat(3)); // 'abcabcabc'
```

### padStart

```javascript
console.log('5'.padStart(3, '0')); // '005'
console.log('abc'.padStart(5, 'x')); // 'xxabc'
```

### padEnd

```javascript
console.log('5'.padEnd(3, '0')); // '500'
console.log('abc'.padEnd(5, 'x')); // 'abcxx'
```

### trimStart / trimEnd

```javascript
const str2 = '  hello  ';
console.log(str2.trimStart()); // 'hello  '
console.log(str2.trimEnd()); // '  hello'
```

---

## 数值方法扩展

### Number.isInteger

```javascript
console.log(Number.isInteger(10)); // true
console.log(Number.isInteger(10.5)); // false
console.log(Number.isInteger('10')); // false
```

### Number.isNaN

```javascript
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN('NaN')); // false
```

### Number.isFinite

```javascript
console.log(Number.isFinite(10)); // true
console.log(Number.isFinite(Infinity)); // false
```

### Math.trunc

```javascript
console.log(Math.trunc(4.9)); // 4
console.log(Math.trunc(-4.9)); // -4
```

### Math.sign

```javascript
console.log(Math.sign(5)); // 1
console.log(Math.sign(-5)); // -1
console.log(Math.sign(0)); // 0
```

### Math.cbrt

```javascript
console.log(Math.cbrt(8)); // 2
console.log(Math.cbrt(27)); // 3
```

---

## 总结

### ES6+ 核心特性

1. **let 和 const**：块级作用域，避免变量提升问题
2. **箭头函数**：简洁语法，this 指向外层作用域
3. **解构赋值**：方便地从数组和对象中提取值
4. **模板字符串**：更灵活的字符串拼接
5. **扩展运算符**：数组和对象的展开和合并
6. **类**：面向对象编程的语法糖
7. **模块化**：import/export，代码组织更清晰
8. **Promise**：异步编程的标准方案
9. **async/await**：同步写法处理异步
10. **Map 和 Set**：新的数据结构
11. **Symbol**：唯一的标识符
12. **Proxy 和 Reflect**：元编程能力
13. **可选链和空值合并**：简化代码，提高安全性
14. **迭代器和生成器**：自定义迭代行为
15. **对象/数组/字符串/数值方法扩展**：更丰富的 API

掌握 ES6+ 新特性，是现代 JavaScript 开发的必备技能！