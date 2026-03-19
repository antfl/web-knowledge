# 闭包（Closure）详解

## 概述

闭包是 JavaScript 中一个强大而重要的概念，它允许函数访问其词法作用域之外的变量。简单来说，闭包是指有权访问另一个函数作用域中变量的函数。

## 基本概念

### 什么是闭包？

闭包是一个函数，它记住了创建它时的环境（词法作用域），即使在创建它的函数执行完毕后，仍然可以访问该环境中的变量。

### 闭包的形成条件

1. **函数嵌套**：一个函数定义在另一个函数内部
2. **内部函数引用外部函数的变量**：内部函数使用了外部函数作用域中的变量
3. **外部函数返回内部函数**：内部函数被返回并在外部被引用

## 基本语法

### 简单闭包示例

```javascript
function outerFunction() {
  let outerVariable = '外部变量';
  
  function innerFunction() {
    console.log(outerVariable); // 内部函数访问外部变量
  }
  
  return innerFunction;
}

const closure = outerFunction();
closure(); // 输出: 外部变量
```

### 带参数的闭包

```javascript
function createGreeting(greeting) {
  return function(name) {
    console.log(`${greeting}, ${name}!`);
  };
}

const sayHello = createGreeting('Hello');
sayHello('Alice'); // 输出: Hello, Alice!

const sayHi = createGreeting('Hi');
sayHi('Bob'); // 输出: Hi, Bob!
```

## 核心特性

### 1. 词法作用域

闭包遵循词法作用域规则，即函数在定义时就确定了它的作用域，而不是在执行时。

```javascript
function outer() {
  let x = 10;
  
  function inner() {
    console.log(x);
  }
  
  return inner;
}

const closure = outer();
closure(); // 输出: 10
```

### 2. 变量持久化

闭包会保持对外部变量的引用，即使外部函数已经执行完毕。

```javascript
function createCounter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

### 3. 数据封装

闭包可以创建私有变量，实现数据封装。

```javascript
const counter = (function() {
  let privateCount = 0;
  
  return {
    increment: function() {
      privateCount++;
      return privateCount;
    },
    reset: function() {
      privateCount = 0;
      return privateCount;
    }
  };
})();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.reset()); // 0
```

### 4. 多个闭包共享同一作用域

如果多个闭包来自同一个外部函数，它们会共享同一个作用域。

```javascript
function createCounters() {
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
    getCount: function() {
      return count;
    }
  };
}

const counters = createCounters();
console.log(counters.increment()); // 1
console.log(counters.increment()); // 2
console.log(counters.decrement()); // 1
console.log(counters.getCount()); // 1
```

## 常见用法

### 1. 模块模式

使用闭包创建模块化代码，实现私有变量和方法。

```javascript
const module = (function() {
  // 私有变量
  let privateVar = 0;
  
  // 私有方法
  function privateMethod() {
    return privateVar;
  }
  
  // 公共接口
  return {
    publicMethod: function() {
      privateVar++;
      return privateMethod();
    },
    reset: function() {
      privateVar = 0;
    }
  };
})();

console.log(module.publicMethod()); // 1
console.log(module.publicMethod()); // 2
module.reset();
console.log(module.publicMethod()); // 1
```

### 2. 记忆化（Memoization）

使用闭包缓存函数结果，提高性能。

```javascript
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(40)); // 快速计算，因为有缓存
```

### 3. 事件处理

在事件处理中使用闭包保存状态。

```javascript
function setupEventHandlers() {
  let count = 0;
  
  document.getElementById('button').addEventListener('click', function() {
    count++;
    console.log(`按钮被点击了 ${count} 次`);
  });
}

setupEventHandlers();
```

### 4. 柯里化（Currying）

使用闭包实现函数柯里化。

```javascript
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

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
```

### 5. 防抖和节流

使用闭包实现防抖和节流函数。

#### 防抖（Debouncing）

```javascript
function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const debouncedSearch = debounce(function(query) {
  console.log('搜索:', query);
}, 300);

// 输入时只会在停止输入 300ms 后执行
```

#### 节流（Throttling）

```javascript
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

const throttledScroll = throttle(function() {
  console.log('滚动事件');
}, 1000);

// 滚动时每 1000ms 只执行一次
```

### 6. 函数工厂

使用闭包创建函数工厂。

```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

## 闭包的优缺点

### 优点

1. **数据封装**：创建私有变量，避免全局变量污染
2. **状态保持**：在函数执行完毕后仍然保持状态
3. **模块化**：实现模块化代码，提高代码可维护性
4. **函数工厂**：动态创建具有特定行为的函数
5. **回调函数**：在回调函数中访问外部作用域的变量

### 缺点

1. **内存泄漏**：闭包会保持对外部变量的引用，可能导致内存泄漏
2. **性能影响**：闭包会增加内存使用，可能影响性能
3. **调试困难**：闭包的作用域链可能使调试变得困难
4. **变量共享**：多个闭包共享同一作用域可能导致意外行为

## 常见问题

### 1. 闭包中的 this 指向

**问题**：在闭包中，`this` 的指向可能不是预期的。

**解决方案**：使用箭头函数或保存 `this` 引用。

```javascript
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
console.log(getValue()); // 42
```

### 2. 循环中的闭包问题

**问题**：在循环中创建闭包时，所有闭包可能引用同一个变量。

**解决方案**：使用立即执行函数表达式（IIFE）或 let/const。

```javascript
// 问题代码
function createFunctions() {
  const functions = [];
  for (var i = 0; i < 5; i++) {
    functions.push(function() {
      return i;
    });
  }
  return functions;
}

// 解决方法 1: 使用 IIFE
function createFunctionsFixed() {
  const functions = [];
  for (var i = 0; i < 5; i++) {
    functions.push((function(j) {
      return function() {
        return j;
      };
    })(i));
  }
  return functions;
}

// 解决方法 2: 使用 let
function createFunctionsLet() {
  const functions = [];
  for (let i = 0; i < 5; i++) {
    functions.push(function() {
      return i;
    });
  }
  return functions;
}
```

### 3. 内存泄漏

**问题**：闭包可能导致内存泄漏，特别是在浏览器环境中。

**解决方案**：及时解除引用，避免不必要的闭包。

```javascript
function createClosure() {
  const largeObject = new Array(1000000).fill('data');
  
  return function() {
    return largeObject.length;
  };
}

let closure = createClosure();
console.log(closure());

// 不再需要时，解除引用
closure = null;
// 现在 largeObject 可以被垃圾回收
```

## 闭包的应用场景

### 1. 私有变量和方法

使用闭包创建私有变量和方法，实现信息隐藏。

```javascript
const bankAccount = (function() {
  let balance = 0;
  
  function validateAmount(amount) {
    return typeof amount === 'number' && amount > 0;
  }
  
  return {
    deposit: function(amount) {
      if (validateAmount(amount)) {
        balance += amount;
        return balance;
      }
      throw new Error('Invalid amount');
    },
    withdraw: function(amount) {
      if (validateAmount(amount) && amount <= balance) {
        balance -= amount;
        return balance;
      }
      throw new Error('Invalid amount or insufficient funds');
    },
    getBalance: function() {
      return balance;
    }
  };
})();

console.log(bankAccount.deposit(100)); // 100
console.log(bankAccount.withdraw(50)); // 50
console.log(bankAccount.getBalance()); // 50
```

### 2. 函数组合

使用闭包实现函数组合。

```javascript
function compose(...fns) {
  return function(initialValue) {
    return fns.reduceRight((acc, fn) => fn(acc), initialValue);
  };
}

const double = x => x * 2;
const add5 = x => x + 5;
const square = x => x * x;

const composed = compose(square, add5, double);
console.log(composed(3)); // ((3 * 2) + 5)² = 121
```

### 3. 延迟执行

使用闭包实现延迟执行。

```javascript
function delay(fn, ...args) {
  return function(delayTime) {
    setTimeout(() => {
      fn.apply(this, args);
    }, delayTime);
  };
}

const delayedGreeting = delay(function(name) {
  console.log(`Hello, ${name}!`);
}, 'Alice');

delayedGreeting(1000); // 1秒后输出: Hello, Alice!
```

### 4. 配置函数

使用闭包创建配置函数。

```javascript
function createLogger(level) {
  return function(message) {
    console.log(`[${level.toUpperCase()}] ${message}`);
  };
}

const infoLogger = createLogger('info');
const errorLogger = createLogger('error');

infoLogger('This is an info message');
// 输出: [INFO] This is an info message

errorLogger('This is an error message');
// 输出: [ERROR] This is an error message
```

### 5. 缓存函数

使用闭包实现缓存函数。

```javascript
function withCache(fn) {
  const cache = new Map();
  
  return function(key) {
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(key);
    cache.set(key, result);
    return result;
  };
}

const getExpensiveData = withCache(function(id) {
  console.log(`Fetching data for ${id}`);
  // 模拟昂贵的操作
  return { id, data: `Data for ${id}` };
});

console.log(getExpensiveData(1)); // 首次获取
console.log(getExpensiveData(1)); // 从缓存获取
console.log(getExpensiveData(2)); // 首次获取
```

## 闭包与其他概念的关系

### 闭包与作用域

闭包依赖于词法作用域，它可以访问其定义时的作用域链上的所有变量。

### 闭包与垃圾回收

闭包会保持对外部变量的引用，这可能会影响垃圾回收。只有当闭包本身被垃圾回收时，它引用的变量才会被考虑回收。

### 闭包与箭头函数

箭头函数没有自己的 `this`，它会继承外层作用域的 `this`，这使得箭头函数在某些情况下比普通函数更适合作为闭包。

```javascript
// 普通函数作为闭包
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

// 箭头函数作为闭包
function createCounterArrow() {
  let count = 0;
  return () => {
    count++;
    return count;
  };
}
```

### 闭包与模块系统

现代 JavaScript 模块系统（如 ES6 模块）使用闭包的原理来实现模块的私有性。

```javascript
// module.js
let privateVariable = 0;

export function increment() {
  privateVariable++;
  return privateVariable;
}

export function getValue() {
  return privateVariable;
}

// main.js
import { increment, getValue } from './module.js';

console.log(increment()); // 1
console.log(getValue()); // 1
```

## 性能优化

### 1. 避免不必要的闭包

只在需要时使用闭包，避免创建不必要的闭包。

### 2. 及时解除引用

当闭包不再需要时，及时解除引用，以便垃圾回收。

### 3. 优化闭包的使用

```javascript
// 不好的做法
function processArray(array) {
  return array.map(function(item) {
    // 每次调用都会创建新的闭包
    return item * 2;
  });
}

// 好的做法
function createMapper(multiplier) {
  return function(item) {
    return item * multiplier;
  };
}

const doubleMapper = createMapper(2);
function processArrayOptimized(array) {
  return array.map(doubleMapper);
}
```

### 4. 使用 WeakMap 存储缓存

对于缓存场景，使用 WeakMap 可以避免内存泄漏。

```javascript
function memoize(fn) {
  const cache = new WeakMap();
  
  return function(obj) {
    if (cache.has(obj)) {
      return cache.get(obj);
    }
    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}
```

## 总结

闭包是 JavaScript 中一个强大的特性，它允许函数访问其词法作用域之外的变量。闭包的主要用途包括：

1. **数据封装**：创建私有变量和方法
2. **状态保持**：在函数执行完毕后仍然保持状态
3. **模块化**：实现模块化代码
4. **函数工厂**：动态创建具有特定行为的函数
5. **回调函数**：在回调函数中访问外部作用域的变量
6. **记忆化**：缓存函数结果，提高性能
7. **防抖和节流**：优化事件处理

虽然闭包可能会导致内存泄漏和性能问题，但只要合理使用，它是 JavaScript 中一个非常有用的工具。理解闭包的工作原理和使用场景，对于编写高质量的 JavaScript 代码至关重要。

闭包是 JavaScript 中实现函数式编程的基础之一，它使得 JavaScript 能够实现许多高级特性，如柯里化、函数组合等。掌握闭包是成为一名优秀 JavaScript 开发者的必备技能。
