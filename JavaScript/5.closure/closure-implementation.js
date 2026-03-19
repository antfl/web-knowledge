/**
 * 闭包（Closure）示例代码
 * 演示闭包的各种用法和特性
 */

// 示例 1: 基本闭包
function createCounter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

// 测试基本闭包
const counter = createCounter();
console.log('示例 1 - 基本闭包:');
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// 示例 2: 带参数的闭包
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

// 测试带参数的闭包
const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log('\n示例 2 - 带参数的闭包:');
console.log('double(5):', double(5)); // 10
console.log('triple(5):', triple(5)); // 15

// 示例 3: 立即执行函数表达式 (IIFE) 创建闭包
const privateCounter = (function() {
  let count = 0;
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getValue: function() {
      return count;
    }
  };
})();

console.log('\n示例 3 - IIFE 创建闭包:');
console.log('初始值:', privateCounter.getValue()); // 0
console.log('increment:', privateCounter.increment()); // 1
console.log('increment:', privateCounter.increment()); // 2
console.log('decrement:', privateCounter.decrement()); // 1

// 示例 4: 闭包中的变量共享
function createFunctionArray() {
  const functions = [];
  
  for (var i = 0; i < 5; i++) {
    // 问题：所有函数都引用同一个 i 变量
    functions.push(function() {
      return i;
    });
  }
  
  return functions;
}

function createFunctionArrayFixed() {
  const functions = [];
  
  for (var i = 0; i < 5; i++) {
    // 解决：使用闭包捕获当前的 i 值
    functions.push((function(j) {
      return function() {
        return j;
      };
    })(i));
  }
  
  return functions;
}

// 测试变量共享问题
const functions = createFunctionArray();
const functionsFixed = createFunctionArrayFixed();
console.log('\n示例 4 - 闭包中的变量共享:');
console.log('未修复版本:');
functions.forEach((func, index) => {
  console.log(`function ${index}:`, func()); // 都输出 5
});
console.log('修复版本:');
functionsFixed.forEach((func, index) => {
  console.log(`function ${index}:`, func()); // 输出 0, 1, 2, 3, 4
});

// 示例 5: 模块模式
const calculator = (function() {
  // 私有变量
  let result = 0;
  
  // 私有方法
  function validateNumber(num) {
    return typeof num === 'number' && !isNaN(num);
  }
  
  // 公共接口
  return {
    add: function(num) {
      if (validateNumber(num)) {
        result += num;
        return this;
      }
      throw new Error('Invalid number');
    },
    subtract: function(num) {
      if (validateNumber(num)) {
        result -= num;
        return this;
      }
      throw new Error('Invalid number');
    },
    multiply: function(num) {
      if (validateNumber(num)) {
        result *= num;
        return this;
      }
      throw new Error('Invalid number');
    },
    divide: function(num) {
      if (validateNumber(num)) {
        if (num === 0) {
          throw new Error('Cannot divide by zero');
        }
        result /= num;
        return this;
      }
      throw new Error('Invalid number');
    },
    reset: function() {
      result = 0;
      return this;
    },
    getResult: function() {
      return result;
    }
  };
})();

console.log('\n示例 5 - 模块模式:');
console.log('5 + 3:', calculator.add(5).add(3).getResult()); // 8
console.log('8 * 2:', calculator.multiply(2).getResult()); // 16
console.log('16 - 4:', calculator.subtract(4).getResult()); // 12
console.log('12 / 2:', calculator.divide(2).getResult()); // 6
console.log('重置:', calculator.reset().getResult()); // 0

// 示例 6: 记忆化 (Memoization)
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      console.log('从缓存中获取结果');
      return cache[key];
    }
    console.log('计算新结果');
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

// 测试记忆化
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFibonacci = memoize(fibonacci);
console.log('\n示例 6 - 记忆化:');
console.log('fibonacci(10):', memoizedFibonacci(10)); // 计算新结果
console.log('fibonacci(10):', memoizedFibonacci(10)); // 从缓存中获取结果
console.log('fibonacci(11):', memoizedFibonacci(11)); // 计算新结果

// 示例 7: 事件处理中的闭包
function createEventHandler() {
  let clickCount = 0;
  
  return function() {
    clickCount++;
    console.log(`按钮被点击了 ${clickCount} 次`);
  };
}

// 测试事件处理
const handleClick = createEventHandler();
console.log('\n示例 7 - 事件处理中的闭包:');
console.log('模拟点击 1:');
handleClick(); // 按钮被点击了 1 次
console.log('模拟点击 2:');
handleClick(); // 按钮被点击了 2 次
console.log('模拟点击 3:');
handleClick(); // 按钮被点击了 3 次

// 示例 8: 闭包与 setTimeout
function delayedGreeting(name) {
  return function() {
    console.log(`Hello, ${name}!`);
  };
}

const greetAlice = delayedGreeting('Alice');
const greetBob = delayedGreeting('Bob');
console.log('\n示例 8 - 闭包与 setTimeout:');
setTimeout(greetAlice, 100); // Hello, Alice!
setTimeout(greetBob, 200); // Hello, Bob!

// 示例 9: 闭包与 this
const obj = {
  value: 42,
  getValue: function() {
    // 保存 this 引用
    const self = this;
    return function() {
      return self.value;
    };
  },
  getValueArrow: function() {
    // 箭头函数继承 this
    return () => this.value;
  }
};

const getValue = obj.getValue();
const getValueArrow = obj.getValueArrow();
console.log('\n示例 9 - 闭包与 this:');
console.log('普通函数:', getValue()); // 42
console.log('箭头函数:', getValueArrow()); // 42

// 示例 10: 闭包的内存管理
function createHeavyObject() {
  // 创建一个大对象
  const heavyObject = new Array(1000000).fill('data');
  
  return function() {
    return heavyObject.length;
  };
}

console.log('\n示例 10 - 闭包的内存管理:');
const getLength = createHeavyObject();
console.log('大对象长度:', getLength()); // 1000000
// 注意：即使 createHeavyObject 执行完毕，heavyObject 仍然被闭包引用，不会被垃圾回收

// 示例 11: 闭包实现私有变量
class Counter {
  constructor() {
    // 私有变量
    let count = 0;
    
    // 公共方法通过闭包访问私有变量
    this.increment = function() {
      count++;
      return count;
    };
    
    this.decrement = function() {
      count--;
      return count;
    };
    
    this.getValue = function() {
      return count;
    };
  }
}

const counterObj = new Counter();
console.log('\n示例 11 - 闭包实现私有变量:');
console.log('初始值:', counterObj.getValue()); // 0
console.log('increment:', counterObj.increment()); // 1
console.log('increment:', counterObj.increment()); // 2
console.log('decrement:', counterObj.decrement()); // 1

// 示例 12: 柯里化 (Currying)
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// 测试柯里化
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log('\n示例 12 - 柯里化:');
console.log('curriedAdd(1)(2)(3):', curriedAdd(1)(2)(3)); // 6
console.log('curriedAdd(1, 2)(3):', curriedAdd(1, 2)(3)); // 6
console.log('curriedAdd(1, 2, 3):', curriedAdd(1, 2, 3)); // 6

// 示例 13: 函数组合
function compose(...fns) {
  return function(initialValue) {
    return fns.reduceRight((acc, fn) => fn(acc), initialValue);
  };
}

// 测试函数组合
const doubleArrow = x => x * 2;
const add5 = x => x + 5;
const square = x => x * x;

const composedFunction = compose(square, add5, doubleArrow);
console.log('\n示例 13 - 函数组合:');
console.log('composedFunction(3):', composedFunction(3)); // ((3 * 2) + 5)² = 121

// 示例 14: 闭包实现防抖 (Debouncing)
function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 测试防抖
function handleInput(value) {
  console.log('处理输入:', value);
}

const debouncedHandleInput = debounce(handleInput, 300);
console.log('\n示例 14 - 防抖:');
console.log('输入 "h":');
debouncedHandleInput('h');
console.log('输入 "he":');
debouncedHandleInput('he');
console.log('输入 "hel":');
debouncedHandleInput('hel');
console.log('输入 "hell":');
debouncedHandleInput('hell');
console.log('输入 "hello":');
debouncedHandleInput('hello');
// 300ms 后只会执行一次，输出: 处理输入: hello

// 示例 15: 闭包实现节流 (Throttling)
function throttle(fn, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 测试节流
function handleScroll() {
  console.log('滚动事件触发');
}

const throttledHandleScroll = throttle(handleScroll, 1000);
console.log('\n示例 15 - 节流:');
console.log('第一次滚动:');
throttledHandleScroll(); // 滚动事件触发
console.log('立即第二次滚动:');
throttledHandleScroll(); // 无输出
console.log('立即第三次滚动:');
throttledHandleScroll(); // 无输出
// 1秒后才能再次触发

console.log('\n所有示例执行完毕！');
