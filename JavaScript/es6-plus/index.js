/**
 * ============================================
 * JavaScript ES6+ 新特性实现与演示
 * ============================================
 * 
 * ES6+ 引入了许多新特性，大大提升了 JavaScript 的开发效率和代码质量。
 * 本文件涵盖了 ES6+ 的核心新特性及其使用示例。
 */

// ============================================
// 第一部分：let 和 const
// ============================================

console.log('========== let 和 const ==========');

// let - 块级作用域变量
function testLet() {
  if (true) {
    let x = 10;
    console.log('块内:', x);
  }
  // console.log(x); // ReferenceError: x is not defined
}

testLet();

// const - 常量
const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

const obj = { name: '张三' };
obj.name = '李四';
console.log('const 对象可以修改属性:', obj.name);

// 暂时性死区
// console.log(typeof x); // ReferenceError: 在声明前访问变量
let x = 10;
console.log('声明后访问:', x);


// ============================================
// 第二部分：箭头函数
// ============================================

console.log('\n========== 箭头函数 ==========');

// 基本语法
const add = (a, b) => a + b;
console.log('箭头函数:', add(1, 2));

// 单个参数可以省略括号
const square = x => x * x;
console.log('平方:', square(5));

// 多行代码需要大括号
const sum = (a, b) => {
  console.log('计算中...');
  return a + b;
};

// this 指向
const arrowObj = {
  name: '对象',
  regular: function() {
    console.log('普通函数 this:', this.name);
  },
  arrow: () => {
    console.log('箭头函数 this:', this.name);
  }
};

arrowObj.regular();
arrowObj.arrow();


// ============================================
// 第三部分：解构赋值
// ============================================

console.log('\n========== 解构赋值 ==========');

// 数组解构
const [a, b, c] = [1, 2, 3];
console.log('数组解构:', a, b, c);

const [first, , third] = [1, 2, 3];
console.log('跳过元素:', first, third);

const [x1, y1, ...rest] = [1, 2, 3, 4, 5];
console.log('剩余元素:', rest);

// 对象解构
const { name, age } = { name: '张三', age: 25 };
console.log('对象解构:', name, age);

const { name: userName, age: userAge } = { name: '李四', age: 30 };
console.log('重命名:', userName, userAge);

const { title, ...other } = { title: '标题', author: '作者', date: '2024' };
console.log('剩余属性:', other);

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
console.log('嵌套解构:', userName2, city);

// 默认值
const { x2 = 10, y2 = 20 } = { x2: 5 };
console.log('默认值:', x2, y2);


// ============================================
// 第四部分：模板字符串
// ============================================

console.log('\n========== 模板字符串 ==========');

const name3 = '张三';
const age3 = 25;

const message = `你好，我是${name3}，今年${age3}岁`;
console.log('模板字符串:', message);

// 多行字符串
const multiline = `
  第一行
  第二行
  第三行
`;
console.log('多行字符串:', multiline);

// 表达式
const result = `1 + 1 = ${1 + 1}`;
console.log('表达式:', result);

// 标签模板
function tag(strings, ...values) {
  console.log('字符串数组:', strings);
  console.log('值数组:', values);
  return strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || '');
  }, '');
}

const tagged = tag`Hello ${name3}, age ${age3}`;
console.log('标签模板:', tagged);


// ============================================
// 第五部分：扩展运算符
// ============================================

console.log('\n========== 扩展运算符 ==========');

// 数组扩展
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log('数组合并:', combined);

const arrCopy = [...arr1];
console.log('数组拷贝:', arrCopy);

// 对象扩展
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log('对象合并:', merged);

const objCopy = { ...obj1 };
console.log('对象拷贝:', objCopy);

// 函数参数
function sumAll(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}
console.log('函数参数:', sumAll(1, 2, 3, 4, 5));


// ============================================
// 第六部分：类
// ============================================

console.log('\n========== 类 ==========');

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

class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }

  study() {
    console.log(`${this.name}正在学习`);
  }
}

const student = new Student('小明', 18, '高三');
student.sayHello();
student.study();
console.log('getter:', student.info);
student.info = '小红 - 17岁';
console.log('setter 后:', student.name);


// ============================================
// 第七部分：模块化
// ============================================

console.log('\n========== 模块化 ==========');

// 导出（在另一个文件中）
// export const PI = 3.14159;
// export function add(a, b) { return a + b; }
// export default class Calculator { ... }

// 导入（在当前文件中）
// import { PI, add } from './math.js';
// import Calculator from './calculator.js';
// import * as Math from './math.js';


// ============================================
// 第八部分：Promise
// ============================================

console.log('\n========== Promise ==========');

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  }, 1000);
});

promise
  .then(result => {
    console.log('Promise 结果:', result);
    return '继续';
  })
  .then(result => {
    console.log('链式调用:', result);
  })
  .catch(error => {
    console.error('错误:', error);
  })
  .finally(() => {
    console.log('Promise 完成');
  });

// Promise.all
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log('Promise.all:', results);
  });

// Promise.race
Promise.race([promise1, promise2, promise3])
  .then(result => {
    console.log('Promise.race:', result);
  });


// ============================================
// 第九部分：async/await
// ============================================

console.log('\n========== async/await ==========');

async function fetchData() {
  try {
    console.log('开始获取数据');
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

// 并行执行
async function parallelFetch() {
  const [data1, data2] = await Promise.all([
    new Promise(resolve => setTimeout(() => resolve('数据1'), 500)),
    new Promise(resolve => setTimeout(() => resolve('数据2'), 300))
  ]);
  console.log('并行获取:', data1, data2);
}

parallelFetch();


// ============================================
// 第十部分：Map 和 Set
// ============================================

console.log('\n========== Map 和 Set ==========');

// Map
const map = new Map();
map.set('name', '张三');
map.set('age', 25);
console.log('Map:', map.get('name'));
console.log('Map 大小:', map.size);
console.log('Map 是否存在:', map.has('name'));
map.delete('age');
console.log('Map 删除后:', map.size);

// Map 遍历
map.forEach((value, key) => {
  console.log(`Map 遍历: ${key} = ${value}`);
});

// Set
const set = new Set([1, 2, 3, 3, 2, 1]);
console.log('Set:', set);
console.log('Set 大小:', set.size);
console.log('Set 添加:', set.add(4));
console.log('Set 删除:', set.delete(2));
console.log('Set 是否存在:', set.has(3));

// Set 遍历
set.forEach(value => {
  console.log('Set 遍历:', value);
});


// ============================================
// 第十一部分：Symbol
// ============================================

console.log('\n========== Symbol ==========');

const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log('Symbol 比较:', sym1 === sym2);

const objSym = {
  [sym1]: '值1',
  [sym2]: '值2',
  name: '普通属性'
};
console.log('Symbol 对象:', objSym);
console.log('Symbol 键:', Object.getOwnPropertySymbols(objSym));


// ============================================
// 第十二部分：Proxy 和 Reflect
// ============================================

console.log('\n========== Proxy 和 Reflect ==========');

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

console.log('Proxy 获取:', proxy.name);
proxy.age = 26;


// ============================================
// 第十三部分：可选链和空值合并
// ============================================

console.log('\n========== 可选链和空值合并 ==========');

const user1 = {
  info: {
    name: '张三',
    address: {
      city: '北京'
    }
  }
};

const city1 = user1?.info?.address?.city;
console.log('可选链:', city1);

const user2 = null;
const userName3 = user2?.name;
console.log('可选链 null:', userName3);

const value1 = null ?? '默认值';
console.log('空值合并:', value1);

const value2 = 0 ?? '默认值';
console.log('空值合并 0:', value2);

const value3 = '' ?? '默认值';
console.log('空值合并 空字符串:', value3);


// ============================================
// 第十四部分：迭代器和生成器
// ============================================

console.log('\n========== 迭代器和生成器 ==========');

// 迭代器
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
  console.log('迭代器:', item);
}

// 生成器
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();
console.log('生成器:', gen.next().value);
console.log('生成器:', gen.next().value);
console.log('生成器:', gen.next().value);
console.log('生成器:', gen.next().done);

// 无限生成器
function* infiniteGenerator() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const infiniteGen = infiniteGenerator();
console.log('无限生成器:', infiniteGen.next().value);
console.log('无限生成器:', infiniteGen.next().value);
console.log('无限生成器:', infiniteGen.next().value);


// ============================================
// 第十五部分：对象方法扩展
// ============================================

console.log('\n========== 对象方法扩展 ==========');

// Object.assign
const obj3 = { a: 1 };
const obj4 = { b: 2 };
const mergedObj = Object.assign({}, obj3, obj4);
console.log('Object.assign:', mergedObj);

// Object.keys
const obj5 = { a: 1, b: 2, c: 3 };
console.log('Object.keys:', Object.keys(obj5));

// Object.values
console.log('Object.values:', Object.values(obj5));

// Object.entries
console.log('Object.entries:', Object.entries(obj5));

// Object.fromEntries
const entries = [['a', 1], ['b', 2]];
const obj6 = Object.fromEntries(entries);
console.log('Object.fromEntries:', obj6);


// ============================================
// 第十六部分：数组方法扩展
// ============================================

console.log('\n========== 数组方法扩展 ==========');

// Array.from
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
const arr3 = Array.from(arrayLike);
console.log('Array.from:', arr3);

// Array.of
const arr4 = Array.of(1, 2, 3);
console.log('Array.of:', arr4);

// find
const arr5 = [1, 2, 3, 4, 5];
const found = arr5.find(item => item > 3);
console.log('find:', found);

// findIndex
const index = arr5.findIndex(item => item > 3);
console.log('findIndex:', index);

// includes
const hasValue = arr5.includes(3);
console.log('includes:', hasValue);

// flat
const arr6 = [1, [2, [3, [4]]]];
const flattened = arr6.flat(2);
console.log('flat:', flattened);

// flatMap
const arr7 = [1, 2, 3];
const mapped = arr7.flatMap(x => [x, x * 2]);
console.log('flatMap:', mapped);


// ============================================
// 第十七部分：字符串方法扩展
// ============================================

console.log('\n========== 字符串方法扩展 ==========');

const str = 'Hello World';

// includes
console.log('includes:', str.includes('World'));

// startsWith
console.log('startsWith:', str.startsWith('Hello'));

// endsWith
console.log('endsWith:', str.endsWith('World'));

// repeat
console.log('repeat:', 'abc'.repeat(3));

// padStart
console.log('padStart:', '5'.padStart(3, '0'));

// padEnd
console.log('padEnd:', '5'.padEnd(3, '0'));

// trimStart
console.log('trimStart:', '  hello  '.trimStart());

// trimEnd
console.log('trimEnd:', '  hello  '.trimEnd());


// ============================================
// 第十八部分：数值方法扩展
// ============================================

console.log('\n========== 数值方法扩展 ==========');

// Number.isInteger
console.log('isInteger:', Number.isInteger(10));

// Number.isNaN
console.log('isNaN:', Number.isNaN(NaN));

// Number.isFinite
console.log('isFinite:', Number.isFinite(10));

// Math.trunc
console.log('trunc:', Math.trunc(4.9));

// Math.sign
console.log('sign:', Math.sign(-5));

// Math.cbrt
console.log('cbrt:', Math.cbrt(8));


// ============================================
// 总结
// ============================================

console.log('\n========== 总结 ==========');
console.log(`
ES6+ 新特性核心要点：

1. let 和 const：
   - 块级作用域
   - const 定义常量
   - 暂时性死区

2. 箭头函数：
   - 简洁的语法
   - this 指向外层作用域
   - 不能用作构造函数

3. 解构赋值：
   - 数组解构
   - 对象解构
   - 默认值

4. 模板字符串：
   - 反引号定义
   - \${} 插入表达式
   - 多行字符串

5. 扩展运算符：
   - 数组扩展 [...arr]
   - 对象扩展 {...obj}
   - 函数参数 ...args

6. 类：
   - class 关键字
   - extends 继承
   - getter/setter

7. 模块化：
   - import/export
   - 默认导出
   - 命名导出

8. Promise：
   - 异步编程
   - then/catch/finally
   - Promise.all/race

9. async/await：
   - 同步写法处理异步
   - try/catch 错误处理
   - Promise 并行执行

10. Map 和 Set：
    - Map 键值对集合
    - Set 唯一值集合
    - 丰富的 API

11. Symbol：
    - 唯一的标识符
    - 对象属性键
    - 避免属性冲突

12. Proxy 和 Reflect：
    - 拦截对象操作
    - 元编程
    - 数据验证

13. 可选链和空值合并：
    - ?. 可选链
    - ?? 空值合并
    - 简化代码

14. 迭代器和生成器：
    - 自定义迭代
    - function* 生成器
    - yield 暂停执行

掌握 ES6+ 新特性，是现代 JavaScript 开发的必备技能！
`);