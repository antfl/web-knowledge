/**
 * 手写实现 Function.prototype.call 方法
 * @param {Object} context - 函数执行时的上下文对象
 * @param {...*} args - 传递给函数的参数列表
 * @returns {*} - 函数执行的返回值
 */
Function.prototype.myCall = function(context, ...args) {
  // 1. 处理上下文对象：如果 context 为 null 或 undefined，则使用全局对象
  // 在浏览器环境中 globalThis 是 window，在 Node.js 环境中是 global
  context = context || globalThis;
  
  // 2. 创建一个唯一的临时属性名，使用 Symbol 确保不会与 context 中的现有属性冲突
  // Symbol 是 ES6 引入的一种新的原始数据类型，每个 Symbol 值都是唯一的
  const fnSymbol = Symbol('fn');

  // 3. 将当前函数（this）赋值给 context 的临时属性
  // 这里的 this 指向调用 myCall 方法的函数
  context[fnSymbol] = this;
  
  // 4. 执行函数，传入参数
  // 通过 context[fnSymbol]() 的方式调用，此时函数内部的 this 会指向 context
  const result = context[fnSymbol](...args);
  
  // 5. 删除临时属性，避免对 context 对象造成污染
  delete context[fnSymbol];
  
  // 6. 返回函数执行的结果
  return result;
};

/**
 * 测试用例函数，验证 myCall 方法的功能
 */
function testCall() {
  console.log('测试 1: 基本功能 - 带参数的函数调用');
  // 创建一个测试对象
  const obj = {
    name: 'Alice'
  };
  
  // 定义一个需要上下文的函数
  function sayHello(age) {
    console.log(`Hello, my name is ${this.name}, I'm ${age} years old.`);
    return `Hello, ${this.name}`;
  }
  
  // 使用原生 call 方法调用函数
  console.log('使用原生 call:');
  sayHello.call(obj, 25);
  
  // 使用自定义 myCall 方法调用函数
  console.log('使用自定义 myCall:');
  const result = sayHello.myCall(obj, 25);
  console.log('返回值:', result);
  
  console.log('\n测试 2: 无参数情况');
  // 定义一个无参数的函数
  function greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
  
  // 使用 myCall 调用无参数函数
  greet.myCall(obj);
  
  console.log('\n测试 3: null 或 undefined 作为 context');
  // 在全局对象上设置 name 属性
  globalThis.name = 'Global';
  
  // 定义一个使用全局上下文的函数
  function globalGreet() {
    console.log(`Hello from ${this.name}`);
  }
  
  // 当 context 为 null 时，应使用全局对象
  console.log('使用 null 作为 context:');
  globalGreet.myCall(null);
  
  // 当 context 为 undefined 时，应使用全局对象
  console.log('使用 undefined 作为 context:');
  globalGreet.myCall(undefined);
  
  console.log('\n测试 4: 传递多个参数');
  // 定义一个接收多个参数的函数
  function sum(a, b, c) {
    return a + b + c + this.value;
  }
  
  // 创建一个带有 value 属性的对象
  const obj2 = { value: 10 };
  
  // 使用 myCall 传递多个参数
  const sumResult = sum.myCall(obj2, 1, 2, 3);
  console.log('Sum result:', sumResult); // 预期结果: 1+2+3+10 = 16
}

// 运行测试
testCall();
