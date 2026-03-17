/**
 * 手写实现 Function.prototype.bind 方法
 * @param {Object} context - 函数执行时的上下文对象
 * @param {...*} args - 预设的参数列表（部分应用）
 * @returns {Function} - 返回一个新的绑定函数
 */
Function.prototype.myBind = function(context, ...args) {
  // 1. 保存原始函数的引用
  // 这里的 this 指向调用 myBind 方法的函数
  const fn = this;
  
  // 2. 处理上下文对象：如果 context 为 null 或 undefined，则使用全局对象
  context = context || globalThis;
  
  // 3. 创建一个唯一的临时属性名，使用 Symbol 确保不会与 context 中的现有属性冲突
  const fnSymbol = Symbol('fn');
  
  // 4. 定义并返回一个新的函数（绑定函数）
  // 使用 function 关键字而不是箭头函数，因为我们需要在构造函数调用时正确处理 this
  const boundFn = function(...boundArgs) {
    // 5. 判断是否作为构造函数调用
    // 如果是通过 new 关键字调用，this 指向新创建的实例
    // 如果是普通函数调用，this 指向传入的 context
    const isNewCall = this instanceof boundFn;
    
    // 6. 确定最终的上下文对象
    // 如果是构造函数调用，使用 this（新实例）；否则使用绑定的 context
    const finalContext = isNewCall ? this : context;
    
    // 7. 将原始函数绑定到最终的上下文对象
    finalContext[fnSymbol] = fn;
    
    // 8. 合并预设参数和调用时传入的参数
    const allArgs = [...args, ...boundArgs];
    
    // 9. 执行函数，传入合并后的参数
    const result = finalContext[fnSymbol](...allArgs);
    
    // 10. 删除临时属性
    delete finalContext[fnSymbol];
    
    // 11. 处理构造函数调用的返回值
    // 如果是构造函数调用且返回值是对象，则返回该对象；否则返回 this（新实例）
    if (isNewCall && typeof result === 'object' && result !== null) {
      return result;
    }
    
    // 12. 返回执行结果或新实例
    return isNewCall ? this : result;
  };
  
  // 13. 设置原型链，使绑定函数能够访问原始函数的原型
  // 这样绑定函数作为构造函数使用时，创建的实例可以继承原始函数的原型
  boundFn.prototype = Object.create(fn.prototype);
  
  // 14. 返回绑定函数
  return boundFn;
};

/**
 * 测试用例函数，验证 myBind 方法的功能
 */
function testBind() {
  console.log('测试 1: 基本功能 - 绑定 this 上下文');
  // 创建一个测试对象
  const obj = {
    name: 'Alice'
  };
  
  // 定义一个需要上下文的函数
  function sayHello(age, city) {
    console.log(`Hello, my name is ${this.name}, I'm ${age} years old, from ${city}.`);
    return `Hello, ${this.name}`;
  }
  
  // 使用原生 bind 方法
  console.log('使用原生 bind:');
  const boundHello1 = sayHello.bind(obj);
  const result1 = boundHello1(25, 'Beijing');
  console.log('返回值:', result1);
  
  // 使用自定义 myBind 方法
  console.log('使用自定义 myBind:');
  const boundHello2 = sayHello.myBind(obj);
  const result2 = boundHello2(25, 'Beijing');
  console.log('返回值:', result2);
  
  console.log('\n测试 2: 预设参数（部分应用）');
  // 定义一个接收多个参数的函数
  function multiply(a, b, c) {
    return a * b * c + this.value;
  }
  
  const obj2 = { value: 10 };
  
  // 预设第一个参数
  const boundMultiply = multiply.myBind(obj2, 2);
  console.log('预设第一个参数为 2:');
  console.log('multiply(2, 3, 4) + 10 =', boundMultiply(3, 4)); // 2*3*4 + 10 = 34
  
  // 预设前两个参数
  const boundMultiply2 = multiply.myBind(obj2, 2, 3);
  console.log('预设前两个参数为 2, 3:');
  console.log('multiply(2, 3, 4) + 10 =', boundMultiply2(4)); // 2*3*4 + 10 = 34
  
  console.log('\n测试 3: 作为构造函数使用');
  // 定义一个构造函数
  function Person(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // 添加原型方法
  Person.prototype.greet = function() {
    console.log(`Hello, I'm ${this.name}, ${this.age} years old.`);
  };
  
  // 创建绑定函数
  const BoundPerson = Person.myBind(null);
  
  // 使用 new 关键字调用绑定函数
  const person = new BoundPerson('Bob', 30);
  console.log('创建的实例:', person);
  person.greet();
  
  // 验证原型链
  console.log('原型链检查:', person instanceof Person);
  
  console.log('\n测试 4: null 或 undefined 作为 context');
  // 在全局对象上设置 name 属性
  globalThis.name = 'Global';
  
  // 定义一个使用全局上下文的函数
  function globalGreet(message) {
    console.log(`${message}, ${this.name}`);
  }
  
  // 当 context 为 null 时，应使用全局对象
  console.log('使用 null 作为 context:');
  const boundGreet1 = globalGreet.myBind(null);
  boundGreet1('Hello');
  
  // 当 context 为 undefined 时，应使用全局对象
  console.log('使用 undefined 作为 context:');
  const boundGreet2 = globalGreet.myBind(undefined);
  boundGreet2('Hi');
  
  console.log('\n测试 5: 多次绑定');
  // 定义一个简单的函数
  function simpleGreet() {
    console.log(`Hello, ${this.name}`);
  }
  
  const obj3 = { name: 'First' };
  const obj4 = { name: 'Second' };
  
  // 第一次绑定
  const bound1 = simpleGreet.myBind(obj3);
  console.log('第一次绑定到 obj3:');
  bound1(); // 输出: Hello, First
  
  // 第二次绑定（无效，bind 只能绑定一次）
  const bound2 = bound1.myBind(obj4);
  console.log('尝试再次绑定到 obj4（应该无效）:');
  bound2(); // 仍然输出: Hello, First
  
  console.log('\n测试 6: 构造函数返回对象');
  // 定义一个构造函数，返回自定义对象
  function ConstructorWithReturn(name) {
    this.name = name;
    return {
      customName: name + ' (custom)'
    };
  }
  
  const BoundConstructor = ConstructorWithReturn.myBind(null);
  const instance = new BoundConstructor('Test');
  console.log('构造函数返回对象时:', instance);
  console.log('instance.customName:', instance.customName);
}

// 运行测试
testBind();
