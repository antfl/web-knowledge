/**
 * ============================================
 * JavaScript 事件循环 (Event Loop) 实现与演示
 * ============================================
 * 
 * 事件循环是 JavaScript 的核心机制，负责协调同步代码和异步代码的执行。
 * 由于 JavaScript 是单线程语言，事件循环使得异步操作成为可能。
 */

// ============================================
// 第一部分：基础概念演示
// ============================================

console.log('========== 基础执行顺序演示 ==========');

console.log('1. 同步代码 - 第 1 行');

setTimeout(() => {
  console.log('2. setTimeout - 宏任务');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise.then - 微任务');
});

console.log('4. 同步代码 - 最后 1 行');

// 预期输出顺序：1 -> 4 -> 3 -> 2


// ============================================
// 第二部分：微任务与宏任务的优先级
// ============================================

console.log('\n========== 微任务 vs 宏任务优先级 ==========');

setTimeout(() => {
  console.log('setTimeout 1 - 宏任务');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1 - 微任务');
});

Promise.resolve().then(() => {
  console.log('Promise 2 - 微任务');
});

setTimeout(() => {
  console.log('setTimeout 2 - 宏任务');
}, 0);

// 预期输出顺序：Promise 1 -> Promise 2 -> setTimeout 1 -> setTimeout 2
// 说明：微任务在当前宏任务结束后立即执行，优先级高于下一个宏任务


// ============================================
// 第三部分：嵌套异步任务
// ============================================

console.log('\n========== 嵌套异步任务 ==========');

setTimeout(() => {
  console.log('外层 setTimeout');
  
  Promise.resolve().then(() => {
    console.log('内层 Promise（在 setTimeout 中）');
  });
  
  setTimeout(() => {
    console.log('内层 setTimeout');
  }, 0);
}, 0);

Promise.resolve().then(() => {
  console.log('外层 Promise');
});

// 预期输出顺序：外层 Promise -> 外层 setTimeout -> 内层 Promise -> 内层 setTimeout


// ============================================
// 第四部分：async/await 的执行顺序
// ============================================

console.log('\n========== async/await 执行顺序 ==========');

async function asyncFunction() {
  console.log('async 函数开始');
  await Promise.resolve();
  console.log('await 后的代码');
}

console.log('同步代码 1');
asyncFunction();
console.log('同步代码 2');

// 预期输出顺序：同步代码 1 -> async 函数开始 -> 同步代码 2 -> await 后的代码
// 说明：await 会暂停 async 函数的执行，将后续代码放入微任务队列


// ============================================
// 第五部分：复杂场景分析
// ============================================

console.log('\n========== 复杂场景分析 ==========');

console.log('Script 开始');

setTimeout(() => {
  console.log('setTimeout 1');
  
  Promise.resolve().then(() => {
    console.log('Promise 1 in setTimeout 1');
  });
}, 0);

setTimeout(() => {
  console.log('setTimeout 2');
  
  Promise.resolve().then(() => {
    console.log('Promise 2 in setTimeout 2');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 3');
  
  setTimeout(() => {
    console.log('setTimeout 3 in Promise');
  }, 0);
});

Promise.resolve().then(() => {
  console.log('Promise 4');
});

console.log('Script 结束');

// 预期输出顺序：
// Script 开始 -> Script 结束 -> Promise 3 -> Promise 4 -> setTimeout 1 -> Promise 1 in setTimeout 1
// -> setTimeout 2 -> Promise 2 in setTimeout 2 -> setTimeout 3 in Promise


// ============================================
// 第六部分：手写 Promise 模拟事件循环
// ============================================

console.log('\n========== 手写 Promise 模拟 ==========');

class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        // 使用微任务模拟 Promise 的异步特性
        queueMicrotask(() => {
          this.onFulfilledCallbacks.forEach(fn => fn());
        });
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        queueMicrotask(() => {
          this.onRejectedCallbacks.forEach(fn => fn());
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.state === 'rejected') {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled(this.value);
              resolve(x);
            } catch (error) {
              reject(error);
            }
          });
        });

        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.reason);
              resolve(x);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }
}

// 测试手写的 Promise
const myPromise = new MyPromise((resolve) => {
  console.log('MyPromise 执行器 - 同步');
  resolve('成功');
});

myPromise.then((value) => {
  console.log('MyPromise then:', value);
});

console.log('同步代码结束');


// ============================================
// 第七部分：常见面试题
// ============================================

console.log('\n========== 面试题 1 ==========');

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

// 预期输出：
// script start -> async1 start -> async2 -> promise1 -> script end -> async1 end -> promise2 -> setTimeout


console.log('\n========== 面试题 2 ==========');

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

// 预期输出：1 -> 6 -> 4 -> 2 -> 3 -> 5


console.log('\n========== 面试题 3 ==========');

setTimeout(() => {
  console.log('0');
}, 0);

new Promise((resolve, reject) => {
  console.log('1');
  resolve();
}).then(() => {
  console.log('2');
  new Promise((resolve, reject) => {
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

new Promise((resolve, reject) => {
  console.log('7');
  resolve();
}).then(() => {
  console.log('8');
});

// 预期输出：1 -> 7 -> 2 -> 3 -> 8 -> 4 -> 6 -> 5 -> 0


// ============================================
// 第八部分：Node.js 事件循环差异
// ============================================

console.log('\n========== Node.js 事件循环说明 ==========');
console.log(`
Node.js 的事件循环与浏览器有差异：

1. 阶段划分不同：
   - timers: 执行 setTimeout 和 setInterval 的回调
   - pending callbacks: 执行系统操作的回调
   - idle, prepare: 内部使用
   - poll: 获取新的 I/O 事件
   - check: 执行 setImmediate 的回调
   - close callbacks: 执行 close 事件的回调

2. 微任务执行时机：
   - process.nextTick: 优先级最高，在当前操作完成后立即执行
   - Promise.then: 在阶段切换时执行

3. setTimeout vs setImmediate:
   - 在主模块中，setTimeout 和 setImmediate 的执行顺序不确定
   - 在 I/O 回调中，setImmediate 总是先于 setTimeout
`);


// ============================================
// 第九部分：实用工具函数
// ============================================

console.log('\n========== 实用工具函数 ==========');

/**
 * 延迟执行函数 - 使用 Promise
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 批量执行异步任务，控制并发数
 * @param {Array} tasks - 任务数组
 * @param {number} concurrency - 并发数
 */
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

/**
 * 重试机制
 * @param {Function} fn - 要执行的函数
 * @param {number} retries - 重试次数
 * @param {number} delay - 延迟时间
 */
async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay);
  }
}

console.log('工具函数已定义：sleep, asyncPool, retry');


// ============================================
// 第十部分：可视化事件循环
// ============================================

console.log('\n========== 事件循环可视化 ==========');

function visualizeEventLoop() {
  console.log(`
┌─────────────────────────────────────────────────────────────┐
│                    事件循环 (Event Loop)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                          │
│  │   调用栈      │  ← 同步代码在这里执行                      │
│  │  (Call Stack)│                                          │
│  └──────────────┘                                          │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐     ┌──────────────┐                     │
│  │   微任务队列   │ ←── │  Promise.then │                     │
│  │ (Microtasks) │     │  queueMicrotask│                     │
│  │              │     │  MutationObserver│                   │
│  └──────────────┘     └──────────────┘                     │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐     ┌──────────────┐                     │
│  │   宏任务队列   │ ←── │  setTimeout   │                     │
│  │  (Macrotasks)│     │  setInterval  │                     │
│  │              │     │  setImmediate │                     │
│  │              │     │  I/O 操作      │                     │
│  │              │     │  UI 渲染       │                     │
│  └──────────────┘     └──────────────┘                     │
│                                                             │
│  执行顺序：                                                 │
│  1. 执行同步代码（调用栈）                                   │
│  2. 执行所有微任务（清空微任务队列）                          │
│  3. 执行一个宏任务                                           │
│  4. 重复步骤 2-3                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
  `);
}

visualizeEventLoop();


// ============================================
// 总结
// ============================================

console.log('\n========== 总结 ==========');
console.log(`
事件循环核心要点：

1. JavaScript 是单线程语言，通过事件循环实现异步编程

2. 任务分类：
   - 同步任务：立即执行，阻塞主线程
   - 异步任务：放入队列，稍后执行
     - 宏任务 (Macrotasks)：setTimeout、setInterval、I/O、UI 渲染
     - 微任务 (Microtasks)：Promise.then、queueMicrotask、MutationObserver

3. 执行顺序：
   同步代码 → 微任务队列（全部） → 宏任务队列（一个） → 循环

4. async/await 本质：
   - async 函数返回 Promise
   - await 会暂停函数执行，将后续代码转为微任务

5. 浏览器 vs Node.js：
   - 浏览器：简单的宏任务/微任务模型
   - Node.js：更复杂的阶段划分，多了 process.nextTick

掌握事件循环，是理解 JavaScript 异步编程的关键！
`);
