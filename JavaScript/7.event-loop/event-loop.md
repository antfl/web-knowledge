# JavaScript 事件循环 (Event Loop)

## 目录

1. [什么是事件循环](#什么是事件循环)
2. [为什么需要事件循环](#为什么需要事件循环)
3. [核心概念](#核心概念)
4. [执行机制详解](#执行机制详解)
5. [宏任务与微任务](#宏任务与微任务)
6. [async/await 的执行顺序](#asyncawait-的执行顺序)
7. [常见面试题分析](#常见面试题分析)
8. [浏览器 vs Node.js 事件循环](#浏览器-vs-nodejs-事件循环)
9. [实际应用场景](#实际应用场景)
10. [最佳实践](#最佳实践)

---

## 什么是事件循环

事件循环（Event Loop）是 JavaScript 的**核心执行机制**，它负责协调同步代码和异步代码的执行顺序。由于 JavaScript 是**单线程语言**，事件循环使得异步编程成为可能，避免了阻塞主线程。

### 简单理解

想象事件循环是一个不断转动的轮子：
- 轮子每转一圈，检查有没有待执行的任务
- 有任务就执行，没有就继续等待
- 这样 JavaScript 就可以"同时"处理多个任务

---

## 为什么需要事件循环

### JavaScript 的单线程特性

JavaScript 从诞生起就是单线程的，这主要是因为：

1. **简化编程模型**：单线程避免了多线程的复杂性（锁、竞态条件等）
2. **DOM 操作安全**：多线程同时操作 DOM 会导致页面混乱
3. **历史原因**：JavaScript 最初设计用于简单的网页交互

### 单线程的问题

如果没有事件循环，JavaScript 会遇到：

```javascript
// 同步代码会阻塞主线程
console.log('开始');
const result = fetchDataSync(); // 假设耗时 5 秒
console.log('结束'); // 必须等 5 秒后才能执行

// 页面在这 5 秒内完全卡死，无法响应用户操作
```

### 事件循环的解决方案

```javascript
console.log('开始');
fetchDataAsync().then(result => {
  console.log('数据获取完成');
});
console.log('结束');
// 输出：开始 -> 结束 -> 数据获取完成

// 页面不会卡死，用户可以继续操作
```

---

## 核心概念

### 1. 调用栈 (Call Stack)

调用栈是 JavaScript 执行同步代码的地方，遵循**后进先出 (LIFO)** 原则。

```javascript
function a() {
  console.log('函数 a');
  b();
}

function b() {
  console.log('函数 b');
  c();
}

function c() {
  console.log('函数 c');
}

a();

// 调用栈变化：
// 1. a() 入栈
// 2. b() 入栈
// 3. c() 入栈
// 4. c() 执行完，出栈
// 5. b() 执行完，出栈
// 6. a() 执行完，出栈
```

### 2. 任务队列 (Task Queue)

任务队列用于存放异步任务的回调函数，分为：
- **宏任务队列 (Macrotask Queue)**
- **微任务队列 (Microtask Queue)**

### 3. Web APIs

浏览器提供的 API，如：
- `setTimeout` / `setInterval`
- `fetch` / `XMLHttpRequest`
- `DOM` 事件监听
- `Promise`

---

## 执行机制详解

### 事件循环的执行流程

```
┌─────────────────────────────────────────────────────────────┐
│                    事件循环执行流程                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 执行同步代码（调用栈中的所有代码）                         │
│           ↓                                                 │
│  2. 调用栈清空后，检查微任务队列                               │
│           ↓                                                 │
│  3. 执行所有微任务（直到微任务队列为空）                       │
│           ↓                                                 │
│  4. 执行一个宏任务                                            │
│           ↓                                                 │
│  5. 重复步骤 2-4（循环往复）                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 详细步骤说明

```javascript
console.log('1. 同步代码开始');

setTimeout(() => {
  console.log('2. setTimeout 回调');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise 回调');
});

console.log('4. 同步代码结束');

// 执行过程分析：
// 1. 执行同步代码：输出 1、4
// 2. setTimeout 回调进入宏任务队列
// 3. Promise 回调进入微任务队列
// 4. 调用栈清空，检查微任务队列
// 5. 执行 Promise 回调：输出 3
// 6. 微任务队列清空，执行宏任务
// 7. 执行 setTimeout 回调：输出 2

// 最终输出：1 -> 4 -> 3 -> 2
```

---

## 宏任务与微任务

### 宏任务 (Macrotasks)

宏任务包括：
- `setTimeout`
- `setInterval`
- `setImmediate` (Node.js)
- `I/O` 操作
- `UI` 渲染
- `script` 标签中的整体代码

**特点**：
- 每个宏任务执行完后，会检查并执行所有微任务
- 宏任务之间可能会进行 UI 渲染

### 微任务 (Microtasks)

微任务包括：
- `Promise.then` / `Promise.catch` / `Promise.finally`
- `queueMicrotask`
- `MutationObserver`
- `process.nextTick` (Node.js，优先级最高)

**特点**：
- 在当前宏任务结束后立即执行
- 微任务执行期间产生的新微任务也会继续执行
- 直到微任务队列为空，才会执行下一个宏任务

### 优先级对比

```javascript
console.log('开始');

setTimeout(() => {
  console.log('setTimeout - 宏任务');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1 - 微任务');
});

Promise.resolve().then(() => {
  console.log('Promise 2 - 微任务');
});

console.log('结束');

// 输出顺序：
// 开始 -> 结束 -> Promise 1 -> Promise 2 -> setTimeout
// 说明：微任务优先于宏任务执行
```

---

## async/await 的执行顺序

### async 函数的本质

`async` 函数本质上是 `Promise` 的语法糖：

```javascript
// async 函数返回 Promise
async function foo() {
  return 'hello';
}
// 等价于
function foo() {
  return Promise.resolve('hello');
}
```

### await 的执行机制

`await` 会暂停 `async` 函数的执行，将后续代码放入微任务队列：

```javascript
async function asyncFunction() {
  console.log('async 开始');
  await Promise.resolve();
  console.log('await 后的代码');
}

console.log('同步 1');
asyncFunction();
console.log('同步 2');

// 执行过程：
// 1. 输出：同步 1
// 2. 进入 asyncFunction，输出：async 开始
// 3. 遇到 await，暂停函数执行
// 4. 输出：同步 2
// 5. 调用栈清空，执行微任务
// 6. 恢复 asyncFunction 执行，输出：await 后的代码

// 最终输出：同步 1 -> async 开始 -> 同步 2 -> await 后的代码
```

### 复杂示例

```javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

async1();

new Promise((resolve) => {
  console.log('promise1');
  resolve();
}).then(() => {
  console.log('promise2');
});

console.log('script end');

// 执行分析：
// 1. 输出：script start
// 2. 进入 async1，输出：async1 start
// 3. 调用 async2，输出：async2
// 4. await async2()，将后续代码（console.log('async1 end')）放入微任务队列
// 5. 执行 Promise，输出：promise1
// 6. then 回调放入微任务队列
// 7. 输出：script end
// 8. 调用栈清空，执行微任务队列
// 9. 微任务队列：[async1 end, promise2]
// 10. 输出：async1 end
// 11. 输出：promise2
// 12. 执行宏任务，输出：setTimeout

// 最终输出：
// script start -> async1 start -> async2 -> promise1 -> script end 
// -> async1 end -> promise2 -> setTimeout
```

---

## 常见面试题分析

### 面试题 1：基础执行顺序

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 答案：1 -> 4 -> 3 -> 2
```

### 面试题 2：嵌套异步

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => {
    console.log('5');
  }, 0);
});

console.log('6');

// 执行分析：
// 1. 输出：1、6
// 2. setTimeout 进入宏任务队列
// 3. Promise.then 进入微任务队列
// 4. 执行微任务：输出 4，setTimeout 进入宏任务队列
// 5. 执行第一个宏任务：输出 2，Promise.then 进入微任务队列
// 6. 执行微任务：输出 3
// 7. 执行第二个宏任务：输出 5

// 答案：1 -> 6 -> 4 -> 2 -> 3 -> 5
```

### 面试题 3：Promise 链式调用

```javascript
setTimeout(() => {
  console.log('0');
}, 0);

new Promise((resolve) => {
  console.log('1');
  resolve();
}).then(() => {
  console.log('2');
  new Promise((resolve) => {
    console.log('3');
    resolve();
  }).then(() => {
    console.log('4');
  }).then(() => {
    console.log('5');
  });
}).then(() => {
  console.log('6');
});

new Promise((resolve) => {
  console.log('7');
  resolve();
}).then(() => {
  console.log('8');
});

// 执行分析：
// 1. setTimeout 进入宏任务队列
// 2. Promise 1：输出 1，then 进入微任务队列
// 3. Promise 2：输出 7，then 进入微任务队列
// 4. 执行微任务队列：[Promise1.then, Promise2.then]
// 5. Promise1.then：输出 2，内部 Promise 输出 3，then 进入微任务队列，then 进入微任务队列
// 6. Promise2.then：输出 8
// 7. 继续执行微任务队列：[内部 Promise.then, Promise1.then的第二个then]
// 8. 内部 Promise.then：输出 4，then 进入微任务队列
// 9. Promise1.then的第二个then：输出 6
// 10. 执行微任务：输出 5
// 11. 执行宏任务：输出 0

// 答案：1 -> 7 -> 2 -> 3 -> 8 -> 4 -> 6 -> 5 -> 0
```

---

## 浏览器 vs Node.js 事件循环

### 浏览器事件循环

浏览器的事件循环相对简单：

```
┌─────────────────────────────────────┐
│         浏览器事件循环               │
├─────────────────────────────────────┤
│                                     │
│  1. 执行同步代码                     │
│  2. 执行所有微任务                   │
│  3. 执行一个宏任务                   │
│  4. 可能进行 UI 渲染                 │
│  5. 重复步骤 2-4                     │
│                                     │
└─────────────────────────────────────┘
```

### Node.js 事件循环

Node.js 的事件循环分为 6 个阶段：

```
┌─────────────────────────────────────┐
│        Node.js 事件循环              │
├─────────────────────────────────────┤
│                                     │
│  1. timers：setTimeout/setInterval  │
│  2. pending callbacks：系统回调      │
│  3. idle, prepare：内部使用          │
│  4. poll：获取新的 I/O 事件          │
│  5. check：setImmediate              │
│  6. close callbacks：close 事件      │
│                                     │
│  微任务执行时机：                     │
│  - process.nextTick：当前操作后       │
│  - Promise.then：阶段切换时          │
│                                     │
└─────────────────────────────────────┘
```

### 关键差异

```javascript
// 浏览器中
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
// 输出：promise -> timeout

// Node.js 中
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
// 输出不确定（取决于性能）

// 但在 I/O 回调中
const fs = require('fs');
fs.readFile('file.txt', () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  // 输出：immediate -> timeout
});
```

---

## 实际应用场景

### 1. 优化长任务

```javascript
// 不好的做法：阻塞主线程
function processLargeArray(array) {
  for (let i = 0; i < array.length; i++) {
    heavyComputation(array[i]);
  }
}

// 好的做法：使用事件循环分片执行
async function processLargeArrayAsync(array, chunkSize = 100) {
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunk.forEach(item => heavyComputation(item));
    
    // 让出主线程，让 UI 更新
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}
```

### 2. 控制并发数

```javascript
async function asyncPool(tasks, concurrency) {
  const results = [];
  const executing = [];

  for (const [index, task] of tasks.entries()) {
    const promise = Promise.resolve().then(() => task());
    results.push(promise);

    if (tasks.length >= concurrency) {
      const e = promise.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}

// 使用示例
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
const tasks = urls.map(url => () => fetch(url));
asyncPool(tasks, 2); // 最多同时发起 2 个请求
```

### 3. 重试机制

```javascript
async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay);
  }
}

// 使用示例
retry(() => fetchData(), 3, 1000);
```

### 4. 防抖与节流

```javascript
// 防抖：事件停止触发后才执行
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流：固定时间间隔执行
function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

---

## 最佳实践

### 1. 避免阻塞主线程

```javascript
// ❌ 不好的做法
function heavyTask() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    // 阻塞 5 秒
  }
}

// ✅ 好的做法
async function heavyTask() {
  const chunks = 100;
  for (let i = 0; i < chunks; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    // 处理一部分数据
  }
}
```

### 2. 合理使用微任务

```javascript
// ❌ 不要创建无限微任务循环
function infiniteMicrotasks() {
  Promise.resolve().then(() => {
    console.log('微任务');
    infiniteMicrotasks(); // 危险！会阻塞宏任务
  });
}

// ✅ 使用宏任务让出控制权
function properAsync() {
  Promise.resolve().then(() => {
    console.log('微任务');
    setTimeout(properAsync, 0); // 使用宏任务
  });
}
```

### 3. 错误处理

```javascript
// ❌ 未处理的 Promise 错误
Promise.reject(new Error('错误'));

// ✅ 正确处理错误
Promise.reject(new Error('错误')).catch(err => {
  console.error('捕获错误:', err);
});

// ✅ async/await 中使用 try-catch
async function fetchData() {
  try {
    const result = await fetch('/api/data');
    return result.json();
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
}
```

### 4. 性能优化

```javascript
// ✅ 批量处理 DOM 操作
function updateDOM(items) {
  // 使用 requestAnimationFrame 在下一帧更新
  requestAnimationFrame(() => {
    items.forEach(item => {
      // DOM 操作
    });
  });
}

// ✅ 使用 queueMicrotask 延迟执行
function processData(data) {
  // 立即返回，延迟处理
  queueMicrotask(() => {
    heavyProcessing(data);
  });
}
```

---

## 总结

### 核心要点

1. **单线程模型**：JavaScript 是单线程的，通过事件循环实现异步

2. **任务分类**：
   - 同步任务：立即执行
   - 异步任务：放入队列稍后执行
     - 宏任务：setTimeout、I/O、UI 渲染
     - 微任务：Promise.then、queueMicrotask

3. **执行顺序**：
   ```
   同步代码 → 微任务队列（全部） → 宏任务队列（一个） → 循环
   ```

4. **async/await**：
   - `async` 函数返回 Promise
   - `await` 将后续代码转为微任务

5. **浏览器 vs Node.js**：
   - 浏览器：简单的事件循环模型
   - Node.js：更复杂的阶段划分

### 记忆口诀

```
同步代码先执行，
微任务紧随其后，
宏任务一个一个来，
循环往复不停歇。
```

掌握事件循环，是理解 JavaScript 异步编程的关键，也是面试中的高频考点！
