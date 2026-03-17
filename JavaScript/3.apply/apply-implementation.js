/**
 * 手写实现 Function.prototype.apply 方法
 * @param {Object} context - 函数执行时的上下文对象
 * @param {Array} args - 传递给函数的参数数组
 * @returns {*} - 函数执行的返回值
 */
Function.prototype.myApply = function(context, args) {
  // 1. 处理上下文对象：如果 context 为 null 或 undefined，则使用全局对象
  // 在浏览器环境中 globalThis 是 window，在 Node.js 环境中是 global
  context = context || globalThis;
  
  // 2. 处理参数：如果 args 存在但不是数组，则抛出类型错误
  // 这与原生 apply 的行为一致
  if (args && !Array.isArray(args)) {
    throw new TypeError('CreateListFromArrayLike called on non-object');
  }
  
  // 3. 创建一个唯一的临时属性名，使用 Symbol 确保不会与 context 中的现有属性冲突
  const fnSymbol = Symbol('fn');
  
  // 4. 将当前函数（this）赋值给 context 的临时属性
  // 这里的 this 指向调用 myApply 方法的函数
  context[fnSymbol] = this;
  
  // 5. 执行函数，传入参数
  // 如果 args 存在，则展开数组作为参数；否则不传参数
  const result = args ? context[fnSymbol](...args) : context[fnSymbol]();
  
  // 6. 删除临时属性，避免对 context 对象造成污染
  delete context[fnSymbol];
  
  // 7. 返回函数执行的结果
  return result;
};

/**
 * 测试用例函数，验证 myApply 方法的功能
 */
function testApply() {
  console.log('测试 1: 基本功能 - 数组参数');
  // 创建一个测试对象
  const obj = {
    name: 'Alice'
  };
  
  // 定义一个需要上下文的函数
  function sayHello(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
    return `Hello, ${this.name}`;
  }
  
  // 使用原生 apply 方法
  console.log('使用原生 apply:');
  const result1 = sayHello.apply(obj, ['Hello', '!']);
  console.log('返回值:', result1);
  
  // 使用自定义 myApply 方法
  console.log('使用自定义 myApply:');
  const result2 = sayHello.myApply(obj, ['Hello', '!']);
  console.log('返回值:', result2);
  
  console.log('\n测试 2: 无参数情况');
  // 定义一个无参数的函数
  function greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
  
  // 使用 myApply 调用无参数函数
  greet.myApply(obj);
  
  console.log('\n测试 3: null 或 undefined 作为 context');
  // 在全局对象上设置 name 属性
  globalThis.name = 'Global';
  
  // 定义一个使用全局上下文的函数
  function globalGreet(message) {
    console.log(`${message}, ${this.name}`);
  }
  
  // 当 context 为 null 时，应使用全局对象
  console.log('使用 null 作为 context:');
  globalGreet.myApply(null, ['Hello']);
  
  // 当 context 为 undefined 时，应使用全局对象
  console.log('使用 undefined 作为 context:');
  globalGreet.myApply(undefined, ['Hi']);
  
  console.log('\n测试 4: 数组操作 - Math.max');
  // 使用 apply 找出数组中的最大值
  const numbers = [5, 6, 2, 3, 7];
  
  console.log('使用原生 Math.max.apply:');
  const max1 = Math.max.apply(null, numbers);
  console.log('最大值:', max1);
  
  console.log('使用自定义 myApply:');
  const max2 = Math.max.myApply(null, numbers);
  console.log('最大值:', max2);
  
  console.log('\n测试 5: 数组操作 - Math.min');
  console.log('使用原生 Math.min.apply:');
  const min1 = Math.min.apply(null, numbers);
  console.log('最小值:', min1);
  
  console.log('使用自定义 myApply:');
  const min2 = Math.min.myApply(null, numbers);
  console.log('最小值:', min2);
  
  console.log('\n测试 6: 数组合并');
  // 使用 apply 合并数组
  const array1 = [1, 2, 3];
  const array2 = [4, 5, 6];
  
  console.log('合并前 array1:', array1);
  console.log('使用原生 Array.prototype.push.apply:');
  Array.prototype.push.apply(array1, array2);
  console.log('合并后 array1:', array1);
  
  // 重置 array1
  const array3 = [1, 2, 3];
  console.log('使用自定义 myApply:');
  Array.prototype.push.myApply(array3, array2);
  console.log('合并后 array3:', array3);
  
  console.log('\n测试 7: 类数组对象转数组');
  // 创建一个类数组对象
  const arrayLike = {
    0: 'apple',
    1: 'banana',
    2: 'orange',
    length: 3
  };
  
  console.log('使用原生 Array.prototype.slice.call:');
  const realArray1 = Array.prototype.slice.call(arrayLike);
  console.log('转换后的数组:', realArray1);
  
  console.log('使用自定义 myCall:');
  const realArray2 = Array.prototype.slice.myCall(arrayLike);
  console.log('转换后的数组:', realArray2);
  
  console.log('\n测试 8: 参数类型检查');
  // 测试非数组参数的情况
  function testArgs() {
    console.log('Test function called');
  }
  
  try {
    console.log('传入非数组参数:');
    testArgs.myApply(obj, 'not an array');
  } catch (error) {
    console.log('捕获到错误:', error.message);
  }
  
  console.log('\n测试 9: 传递多个参数');
  // 定义一个接收多个参数的函数
  function sum(a, b, c, d, e) {
    return a + b + c + d + e + this.value;
  }
  
  const obj2 = { value: 10 };
  const args = [1, 2, 3, 4, 5];
  const sumResult = sum.myApply(obj2, args);
  console.log('Sum result:', sumResult); // 预期结果: 1+2+3+4+5+10 = 25
  
  console.log('\n测试 10: 空数组参数');
  // 测试传入空数组的情况
  function emptyArgsTest() {
    console.log(`Function called with this.name = ${this.name}`);
  }
  
  emptyArgsTest.myApply(obj, []);
  
  console.log('\n测试 11: 继承场景');
  // 使用 apply 实现构造函数继承
  function Animal(name) {
    this.name = name;
  }
  
  function Dog(name, breed) {
    Animal.apply(this, [name]);
    this.breed = breed;
  }
  
  const dog = new Dog('Rex', 'German Shepherd');
  console.log('Dog instance:', dog);
  console.log('dog.name:', dog.name);
  console.log('dog.breed:', dog.breed);
}

// 运行测试
testApply();
