# Promise 详解

## 概述

Promise 是 JavaScript 中用于处理异步操作的一种机制，它代表了一个异步操作的最终完成（或失败）及其结果值。Promise 提供了一种更优雅的方式来处理异步代码，避免了回调地狱（callback hell），使代码更加可读和可维护。

## 基本概念

### Promise 的三种状态

- **pending**：初始状态，既不是成功也不是失败
- **fulfilled**：操作成功完成，返回结果值
- **rejected**：操作失败，返回失败原因

### 状态转换

- 从 pending 到 fulfilled
- 从 pending 到 rejected
- 一旦状态改变，就不会再变，状态凝固

## 基本语法

### 创建 Promise

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 操作成功 */) {
    resolve(value); // 成功时调用
  } else {
    reject(reason); // 失败时调用
  }
});
```

### 使用 Promise

```javascript
promise.then(
  value => { /* 成功处理 */ },
  reason => { /* 失败处理 */ }
);

// 或使用 catch 处理失败
promise.then(value => {
  /* 成功处理 */
}).catch(reason => {
  /* 失败处理 */
});
```

## 核心特性

### 1. 链式调用

Promise 的 `then` 方法返回一个新的 Promise，这使得我们可以链式调用多个异步操作。

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => processData(data))
  .then(result => displayResult(result))
  .catch(error => handleError(error));
```

### 2. 错误处理

Promise 提供了统一的错误处理机制，无论是在执行器中抛出的错误，还是在 `then` 回调中抛出的错误，都可以被 `catch` 捕获。

```javascript
new Promise((resolve, reject) => {
  throw new Error('执行器错误');
}).catch(error => {
  console.log('捕获到错误:', error.message);
});
```

### 3. 异步执行

Promise 的回调函数是异步执行的，即使 Promise 立即完成。

```javascript
console.log('1');
new Promise(resolve => {
  console.log('2');
  resolve();
}).then(() => {
  console.log('3');
});
console.log('4');
// 输出顺序: 1, 2, 4, 3
```

### 4. 状态凝固

Promise 的状态一旦改变，就不会再变，结果也会被缓存。

```javascript
const promise = new Promise((resolve, reject) => {
  resolve('成功');
});

// 多次添加回调
promise.then(value => console.log('第一次:', value));
promise.then(value => console.log('第二次:', value));
// 两次都输出: 成功
```

## 实现原理

### 核心实现步骤

1. **状态管理**：维护 pending、fulfilled、rejected 三种状态
2. **回调队列**：存储成功和失败的回调函数
3. **异步执行**：确保回调函数异步执行
4. **链式调用**：`then` 方法返回新的 Promise
5. **值传递**：处理回调函数的返回值

### 关键技术点

1. **执行器函数**：立即执行，接收 resolve 和 reject 两个参数
2. **状态转换**：只能从 pending 变为 fulfilled 或 rejected
3. **回调执行**：状态改变时执行对应的回调队列
4. **Promise 解析**：处理 then 方法返回的各种值
5. **错误传播**：错误会沿着 Promise 链传播

## 静态方法

### 1. Promise.resolve()

创建一个已解决的 Promise。

```javascript
// 创建已解决的 Promise
const promise = Promise.resolve('成功');

// 等价于
const promise = new Promise(resolve => resolve('成功'));
```

### 2. Promise.reject()

创建一个已拒绝的 Promise。

```javascript
// 创建已拒绝的 Promise
const promise = Promise.reject('失败');

// 等价于
const promise = new Promise((resolve, reject) => reject('失败'));
```

### 3. Promise.all()

等待所有 Promise 完成，返回结果数组。

```javascript
Promise.all([
  fetch('https://api.example.com/data1'),
  fetch('https://api.example.com/data2'),
  fetch('https://api.example.com/data3')
]).then(responses => {
  // 所有请求都成功
  return Promise.all(responses.map(response => response.json()));
}).then(data => {
  console.log('所有数据:', data);
});
```

### 4. Promise.race()

等待第一个完成的 Promise。

```javascript
Promise.race([
  fetch('https://api.example.com/data'),
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('超时')), 5000);
  })
]).then(response => {
  console.log('请求成功');
}).catch(error => {
  console.log('请求失败:', error.message);
});
```

### 5. Promise.allSettled()

等待所有 Promise 完成，无论成功或失败。

```javascript
Promise.allSettled([
  Promise.resolve('成功 1'),
  Promise.reject('失败 2'),
  Promise.resolve('成功 3')
]).then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log('成功:', result.value);
    } else {
      console.log('失败:', result.reason);
    }
  });
});
```

### 6. Promise.any()

等待第一个成功的 Promise。

```javascript
Promise.any([
  Promise.reject('失败 1'),
  Promise.resolve('成功 2'),
  Promise.reject('失败 3')
]).then(value => {
  console.log('第一个成功:', value);
}).catch(errors => {
  console.log('所有都失败:', errors);
});
```

## 实例方法

### 1. then()

注册成功和失败的回调。

```javascript
promise.then(
  value => { /* 成功回调 */ },
  reason => { /* 失败回调 */ }
);
```

### 2. catch()

注册失败的回调，相当于 `then(null, onRejected)`。

```javascript
promise.catch(reason => {
  /* 失败回调 */
});
```

### 3. finally()

无论 Promise 成功还是失败，都会执行的回调。

```javascript
promise
  .then(value => { /* 成功处理 */ })
  .catch(reason => { /* 失败处理 */ })
  .finally(() => {
    /* 清理操作 */
  });
```

## 使用场景

### 1. 网络请求

```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      reject(new Error('网络错误'));
    };
    xhr.send();
  });
}

fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 2. 定时器

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(1000)
  .then(() => console.log('1秒后执行'))
  .then(() => delay(2000))
  .then(() => console.log('再等2秒后执行'));
```

### 3. 文件操作

```javascript
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', event => {
  const file = event.target.files[0];
  readFile(file)
    .then(content => console.log('文件内容:', content))
    .catch(error => console.error(error));
});
```

### 4. 并行操作

```javascript
const promises = [
  fetch('https://api.example.com/user'),
  fetch('https://api.example.com/posts'),
  fetch('https://api.example.com/comments')
];

Promise.all(promises)
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(([user, posts, comments]) => {
    console.log('用户:', user);
    console.log('帖子:', posts);
    console.log('评论:', comments);
  });
```

### 5. 异步流程控制

```javascript
function step1() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('步骤 1');
      resolve(1);
    }, 1000);
  });
}

function step2(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('步骤 2，接收值:', value);
      resolve(value + 1);
    }, 1000);
  });
}

function step3(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('步骤 3，接收值:', value);
      resolve(value + 1);
    }, 1000);
  });
}

step1()
  .then(step2)
  .then(step3)
  .then(result => {
    console.log('最终结果:', result);
  });
```

## 常见问题

### 1. 回调地狱

**问题**：多层嵌套的回调函数，代码可读性差。

**解决方案**：使用 Promise 链式调用。

```javascript
// 回调地狱
asyncOperation1(function(result1) {
  asyncOperation2(result1, function(result2) {
    asyncOperation3(result2, function(result3) {
      // 处理结果
    });
  });
});

// 使用 Promise
asyncOperation1()
  .then(result1 => asyncOperation2(result1))
  .then(result2 => asyncOperation3(result2))
  .then(result3 => {
    // 处理结果
  });
```

### 2. 错误处理

**问题**：异步操作中的错误难以捕获。

**解决方案**：使用 Promise 的 catch 方法。

```javascript
// 错误的做法
try {
  asyncOperation(function(result) {
    // 这里的错误不会被外部的 try-catch 捕获
    throw new Error('异步错误');
  });
} catch (error) {
  console.log('捕获错误:', error);
}

// 正确的做法
asyncOperation()
  .then(result => {
    throw new Error('异步错误');
  })
  .catch(error => {
    console.log('捕获错误:', error);
  });
```

### 3. Promise 链中的错误传播

**问题**：Promise 链中的错误会一直传播到第一个 catch。

**解决方案**：合理使用 catch 处理错误。

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('网络响应错误');
    }
    return response.json();
  })
  .then(data => {
    // 处理数据
    if (!data.valid) {
      throw new Error('数据无效');
    }
    return processData(data);
  })
  .catch(error => {
    // 所有错误都会被这里捕获
    console.error('处理错误:', error);
  });
```

### 4. Promise.all 的错误处理

**问题**：Promise.all 中只要有一个 Promise 失败，整个操作就会失败。

**解决方案**：使用 Promise.allSettled 或手动处理每个 Promise。

```javascript
// 使用 Promise.allSettled
Promise.allSettled([
  fetch('https://api.example.com/data1'),
  fetch('https://api.example.com/data2'),
  fetch('https://api.example.com/data3')
]).then(results => {
  const successfulResults = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
  console.log('成功的结果:', successfulResults);
});
```

## 与 async/await 结合

Promise 是 async/await 的基础，async/await 提供了更简洁的语法来处理 Promise。

### 基本用法

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log('数据:', data);
    return data;
  } catch (error) {
    console.error('错误:', error);
    throw error;
  }
}

fetchData();
```

### 并行操作

```javascript
async function fetchMultipleData() {
  try {
    const [user, posts, comments] = await Promise.all([
      fetch('https://api.example.com/user').then(r => r.json()),
      fetch('https://api.example.com/posts').then(r => r.json()),
      fetch('https://api.example.com/comments').then(r => r.json())
    ]);
    console.log('用户:', user);
    console.log('帖子:', posts);
    console.log('评论:', comments);
  } catch (error) {
    console.error('错误:', error);
  }
}

fetchMultipleData();
```

## 性能优化

### 1. 避免创建不必要的 Promise

```javascript
// 不好的做法
function getData() {
  return new Promise(resolve => {
    resolve('数据');
  });
}

// 好的做法
function getData() {
  return Promise.resolve('数据');
}
```

### 2. 合理使用 Promise.all

对于并行操作，使用 Promise.all 可以提高效率。

```javascript
// 串行执行（慢）
async function serialRequests() {
  const result1 = await fetch('https://api.example.com/data1');
  const result2 = await fetch('https://api.example.com/data2');
  const result3 = await fetch('https://api.example.com/data3');
  return [result1, result2, result3];
}

// 并行执行（快）
async function parallelRequests() {
  const [result1, result2, result3] = await Promise.all([
    fetch('https://api.example.com/data1'),
    fetch('https://api.example.com/data2'),
    fetch('https://api.example.com/data3')
  ]);
  return [result1, result2, result3];
}
```

### 3. 处理大型 Promise 链

对于大型 Promise 链，考虑使用 async/await 使代码更清晰。

```javascript
// 使用 Promise 链
function complexOperation() {
  return step1()
    .then(result1 => step2(result1))
    .then(result2 => step3(result2))
    .then(result3 => step4(result3))
    .then(result4 => step5(result4));
}

// 使用 async/await
async function complexOperation() {
  const result1 = await step1();
  const result2 = await step2(result1);
  const result3 = await step3(result2);
  const result4 = await step4(result3);
  return step5(result4);
}
```

## 实现细节

### 1. 执行器函数立即执行

Promise 的执行器函数是立即执行的，而不是延迟执行。

```javascript
console.log('1');
const promise = new Promise((resolve, reject) => {
  console.log('2');
  resolve();
});
console.log('3');
promise.then(() => console.log('4'));
console.log('5');
// 输出顺序: 1, 2, 3, 5, 4
```

### 2. 回调函数异步执行

Promise 的回调函数总是异步执行的，即使 Promise 立即完成。

```javascript
const promise = Promise.resolve();

console.log('1');
promise.then(() => console.log('2'));
console.log('3');
// 输出顺序: 1, 3, 2
```

### 3. 值穿透

如果 `then` 方法没有提供对应状态的回调函数，值会穿透到下一个 `then`。

```javascript
Promise.resolve('值')
  .then() // 没有提供回调
  .then() // 没有提供回调
  .then(value => console.log('最终值:', value)); // 输出: 最终值: 值

Promise.reject('错误')
  .then() // 没有提供回调
  .catch() // 没有提供回调
  .catch(reason => console.log('最终错误:', reason)); // 输出: 最终错误: 错误
```

### 4. Promise 解析

`then` 方法的返回值会被 Promise 解析，无论返回的是什么值。

```javascript
// 返回普通值
Promise.resolve(1)
  .then(value => value + 1) // 返回 2
  .then(value => console.log(value)); // 输出: 2

// 返回 Promise
Promise.resolve(1)
  .then(value => Promise.resolve(value + 1)) // 返回 Promise
  .then(value => console.log(value)); // 输出: 2

// 返回 thenable 对象
Promise.resolve(1)
  .then(value => ({ then: function(resolve) { resolve(value + 1); } }))
  .then(value => console.log(value)); // 输出: 2
```

## 边界情况处理

### 1. 循环引用

```javascript
// ❌ 错误示例：循环引用
const promise = new Promise((resolve) => {
  resolve(promise); // 循环引用
});

// ✅ 正确处理：检测循环引用
class SafePromise extends Promise {
  constructor(executor) {
    super((resolve, reject) => {
      executor(
        value => {
          if (value === this) {
            reject(new TypeError('循环引用'));
          } else {
            resolve(value);
          }
        },
        reject
      );
    });
  }
}

// 使用示例
new SafePromise((resolve) => {
  resolve('值');
}).then(value => console.log('值:', value));
```

### 2. 未处理的 Promise 拒绝

```javascript
// 监听未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的 Promise 拒绝:', event.reason);
  event.preventDefault(); // 阻止默认的控制台警告
});

// 测试
Promise.reject(new Error('未处理的错误'));

// ✅ 正确处理：始终添加错误处理
Promise.reject(new Error('错误'))
  .catch(error => console.log('错误已处理:', error.message));
```

### 3. Promise 链中的错误恢复

```javascript
// ✅ 错误恢复模式
function recoverablePromise(promise, recovery) {
  return promise.catch(error => {
    console.log('尝试恢复错误:', error.message);
    return recovery(error);
  });
}

// 使用示例
recoverablePromise(
  fetch('https://api.example.com/data'),
  (error) => {
    return { data: 'default', error: error.message };
  }
).then(data => {
  console.log('数据:', data);
});
```

### 4. Promise.all 的部分失败处理

```javascript
// ❌ Promise.all：一个失败就全部失败
Promise.all([
  Promise.resolve(1),
  Promise.reject('失败'),
  Promise.resolve(3)
]).catch(error => {
  console.log('全部失败:', error);
});

// ✅ Promise.allSettled：获取所有结果
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('失败'),
  Promise.resolve(3)
]).then(results => {
  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
  
  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);
  
  console.log('成功:', successful);
  console.log('失败:', failed);
});
```

### 5. Promise 链中的值穿透

```javascript
// 值穿透示例
Promise.resolve('值')
  .then() // 没有提供回调
  .then() // 没有提供回调
  .then(value => console.log('最终值:', value)); // 输出: 最终值: 值

Promise.reject('错误')
  .then() // 没有提供回调
  .catch() // 没有提供回调
  .catch(reason => console.log('最终错误:', reason)); // 输出: 最终错误: 错误
```

### 6. Promise 的内存泄漏

```javascript
// ❌ 错误示例：未清理的引用
class Component {
  constructor() {
    this.data = new Array(1000000).fill('data');
    this.loadData();
  }

  loadData() {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.data), 1000);
    });
  }
}

// ✅ 正确示例：及时清理引用
class Component {
  constructor() {
    this.data = new Array(1000000).fill('data');
    this.loadData();
  }

  loadData() {
    return new Promise(resolve => {
      setTimeout(() => {
        const data = this.data;
        this.data = null; // 清理引用
        resolve(data);
      }, 1000);
    });
  }

  destroy() {
    this.data = null; // 组件销毁时清理
  }
}
```

### 7. Promise 的超时和取消

```javascript
// ✅ 带超时的 Promise
function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// 使用示例
withTimeout(
  new Promise(resolve => setTimeout(() => resolve('完成'), 3000)),
  2000
).catch(error => console.log('错误:', error.message)); // 输出: 错误: Timeout
```

### 8. Promise 的并发限制

```javascript
// ✅ 限制并发数量
async function limitConcurrency(tasks, limit) {
  const results = [];
  const executing = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    
    results.push(promise);
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// 使用示例
const tasks = Array(100).fill(0).map((_, i) => 
  () => new Promise(resolve => 
    setTimeout(() => resolve(i), 100)
  )
);

limitConcurrency(tasks, 10).then(results => {
  console.log('所有任务完成:', results);
});
```

### 9. Promise 的错误边界

```javascript
// ✅ 全局错误处理
class PromiseErrorBoundary {
  constructor() {
    this.handlers = [];
    this.setupGlobalHandler();
  }

  setupGlobalHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.handlers.forEach(handler => handler(event.reason));
      event.preventDefault();
    });
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }
}

// 使用示例
const errorBoundary = new PromiseErrorBoundary();

errorBoundary.addHandler(error => {
  console.error('捕获到未处理的 Promise 错误:', error);
});

Promise.reject(new Error('测试错误'));
```

### 10. Promise 的类型检查

```javascript
// ✅ 检查是否为 Promise
function isPromise(value) {
  return value instanceof Promise || 
    (value !== null && typeof value === 'object' && typeof value.then === 'function');
}

// 使用示例
console.log(isPromise(Promise.resolve())); // true
console.log(isPromise({ then: () => {} })); // true
console.log(isPromise({})); // false
console.log(isPromise(null)); // false

// ✅ 检查是否为 thenable
function isThenable(value) {
  return value !== null && 
    typeof value === 'object' && 
    typeof value.then === 'function';
}

// 使用示例
console.log(isThenable({ then: () => {} })); // true
console.log(isThenable(Promise.resolve())); // true
console.log(isThenable({})); // false
```

### 11. Promise 的状态检查

```javascript
// ✅ 检查 Promise 状态（非标准方法）
function getPromiseState(promise) {
  const pendingState = { state: 'pending' };
  
  return Promise.race([
    promise.then(
      value => ({ state: 'fulfilled', value }),
      reason => ({ state: 'rejected', reason })
    ),
    new Promise(resolve => setTimeout(() => resolve(pendingState), 0))
  ]);
}

// 使用示例
const promise = new Promise(resolve => {
  setTimeout(() => resolve('完成'), 1000);
});

getPromiseState(promise).then(state => {
  console.log('Promise 状态:', state); // pending
});

setTimeout(() => {
  getPromiseState(promise).then(state => {
    console.log('Promise 状态:', state); // fulfilled
  });
}, 1500);
```

### 12. Promise 的错误分类

```javascript
// ✅ 自定义错误类型
class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 使用示例
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new ApiError('API 错误', response.status);
    }
    
    const data = await response.json();
    
    if (!data.valid) {
      throw new ValidationError('数据验证失败');
    }
    
    return data;
  } catch (error) {
    if (error instanceof NetworkError) {
      console.error('网络错误:', error.message);
    } else if (error instanceof ApiError) {
      console.error('API 错误:', error.message, error.status);
    } else if (error instanceof ValidationError) {
      console.error('验证错误:', error.message);
    } else {
      console.error('未知错误:', error.message);
    }
    throw error;
  }
}
```

### 13. Promise 的超时和重试组合

```javascript
// ✅ 超时和重试组合
async function fetchWithRetryAndTimeout(url, options = {}) {
  const { maxRetries = 3, timeout = 5000, retryDelay = 1000 } = options;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await withTimeout(
        fetch(url),
        timeout
      ).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      });
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      console.log(`重试 ${attempt + 1}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}

function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// 使用示例
fetchWithRetryAndTimeout('https://api.example.com/data', {
  maxRetries: 3,
  timeout: 3000,
  retryDelay: 1000
}).then(data => {
  console.log('数据:', data);
}).catch(error => {
  console.error('错误:', error.message);
});
```

### 14. Promise 的取消和清理

```javascript
// ✅ 可取消的 Promise
class CancellablePromise {
  constructor(executor) {
    this.cancelled = false;
    this.cleanup = null;
    this.promise = new Promise((resolve, reject) => {
      executor(
        value => this.cancelled ? reject(new Error('Cancelled')) : resolve(value),
        reason => this.cancelled ? reject(new Error('Cancelled')) : reject(reason),
        cleanup => this.cleanup = cleanup
      );
    });
  }

  cancel() {
    this.cancelled = true;
    if (this.cleanup) {
      this.cleanup();
    }
  }

  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
}

// 使用示例
const cancellablePromise = new CancellablePromise((resolve, reject, cleanup) => {
  const timer = setTimeout(() => resolve('完成'), 2000);
  cleanup(() => clearTimeout(timer));
});

cancellablePromise.then(console.log);
cancellablePromise.cancel(); // 取消 Promise 并清理资源
```

### 15. Promise 的批量处理和错误恢复

```javascript
// ✅ 批量处理，部分失败不影响其他
async function batchProcess(items, processor, options = {}) {
  const { maxConcurrent = 5, continueOnError = true } = options;
  
  const results = [];
  const errors = [];
  
  for (let i = 0; i < items.length; i += maxConcurrent) {
    const batch = items.slice(i, i + maxConcurrent);
    
    const batchResults = await Promise.allSettled(
      batch.map(item => processor(item))
    );
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        errors.push(result.reason);
        if (!continueOnError) {
          throw result.reason;
        }
      }
    }
  }
  
  return { results, errors };
}

// 使用示例
const items = [1, 2, 3, 4, 5];

batchProcess(
  items,
  async (item) => {
    if (item === 3) {
      throw new Error(`处理 ${item} 失败`);
    }
    return item * 2;
  },
  { maxConcurrent: 2, continueOnError: true }
).then(({ results, errors }) => {
  console.log('成功结果:', results);
  console.log('错误:', errors);
});
```

## 调试技巧

### 1. Promise 状态追踪

```javascript
class TrackedPromise extends Promise {
  constructor(executor) {
    super((resolve, reject) => {
      executor(
        value => {
          console.log('Promise resolved:', value);
          resolve(value);
        },
        reason => {
          console.log('Promise rejected:', reason);
          reject(reason);
        }
      );
    });
  }
}

// 使用示例
new TrackedPromise((resolve) => {
  setTimeout(() => resolve('完成'), 1000);
});
```

### 2. Promise 链追踪

```javascript
function tracePromise(promise, name = 'Promise') {
  return promise.then(
    value => {
      console.log(`${name} resolved:`, value);
      return value;
    },
    reason => {
      console.error(`${name} rejected:`, reason);
      throw reason;
    }
  );
}

// 使用示例
tracePromise(
  fetch('https://api.example.com/data')
    .then(response => response.json()),
  'API 请求'
).then(data => {
  console.log('处理数据:', data);
});
```

### 3. Promise 超时警告

```javascript
function warnSlowPromise(promise, timeout = 3000, name = 'Promise') {
  const timer = setTimeout(() => {
    console.warn(`${name} 执行超过 ${timeout}ms`);
  }, timeout);
  
  return promise.finally(() => {
    clearTimeout(timer);
  });
}

// 使用示例
warnSlowPromise(
  fetch('https://api.example.com/data'),
  3000,
  'API 请求'
).then(response => {
  console.log('响应:', response);
});
```

### 4. Promise 错误堆栈追踪

```javascript
function withStackTrace(promise) {
  const stack = new Error().stack;
  
  return promise.catch(error => {
    error.stack = `${error.stack}\n\nPromise created at:\n${stack}`;
    throw error;
  });
}

// 使用示例
withStackTrace(
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error('测试错误')), 100);
  })
).catch(error => {
  console.error('错误:', error);
});
```

### 5. Promise 执行时间监控

```javascript
function timedPromise(promise, name = 'Promise') {
  const startTime = performance.now();
  
  return promise.finally(() => {
    const duration = performance.now() - startTime;
    console.log(`${name} 执行时间: ${duration.toFixed(2)}ms`);
  });
}

// 使用示例
timedPromise(
  fetch('https://api.example.com/data'),
  'API 请求'
).then(response => {
  console.log('响应:', response);
});
```

### 6. Promise 内存使用监控

```javascript
function monitorMemory(promise, name = 'Promise') {
  const before = process.memoryUsage ? process.memoryUsage().heapUsed : 0;
  
  return promise.finally(() => {
    if (process.memoryUsage) {
      const after = process.memoryUsage().heapUsed;
      const diff = (after - before) / 1024 / 1024;
      console.log(`${name} 内存变化: ${diff.toFixed(2)} MB`);
    }
  });
}

// 使用示例
monitorMemory(
  Promise.resolve().then(() => {
    const largeArray = new Array(1000000).fill('data');
    return largeArray.length;
  }),
  '大数据处理'
).then(result => {
  console.log('结果:', result);
});
```

### 7. Promise 重试监控

```javascript
function monitoredRetry(fn, maxRetries = 3, name = 'Promise') {
  let attempts = 0;
  
  async function attempt() {
    attempts++;
    console.log(`${name} 尝试 ${attempts}/${maxRetries}`);
    
    try {
      return await fn();
    } catch (error) {
      if (attempts >= maxRetries) {
        console.error(`${name} 所有重试失败`);
        throw error;
      }
      
      console.warn(`${name} 重试 ${attempts} 失败:`, error.message);
      return attempt();
    }
  }
  
  return attempt();
}

// 使用示例
monitoredRetry(
  () => fetch('https://api.example.com/data').then(r => r.json()),
  3,
  'API 请求'
).then(data => {
  console.log('数据:', data);
});
```

### 8. Promise 并发监控

```javascript
function monitorConcurrency(promises, name = 'Promise') {
  let active = 0;
  let maxActive = 0;
  
  const monitoredPromises = promises.map(promise => {
    active++;
    maxActive = Math.max(maxActive, active);
    
    return promise.finally(() => {
      active--;
    });
  });
  
  Promise.allSettled(monitoredPromises).then(() => {
    console.log(`${name} 最大并发数: ${maxActive}`);
  });
  
  return Promise.all(monitoredPromises);
}

// 使用示例
monitorConcurrency(
  Array(10).fill(0).map((_, i) => 
    fetch(`https://api.example.com/data/${i}`)
  ),
  '批量请求'
).then(results => {
  console.log('所有请求完成:', results);
});
```

### 9. Promise 成功率统计

```javascript
class PromiseStats {
  constructor(name = 'Promise') {
    this.name = name;
    this.stats = {
      total: 0,
      success: 0,
      failure: 0,
      times: []
    };
  }

  monitor(promise) {
    this.stats.total++;
    const startTime = performance.now();
    
    return promise
      .then(value => {
        this.stats.success++;
        this.stats.times.push(performance.now() - startTime);
        return value;
      })
      .catch(error => {
        this.stats.failure++;
        this.stats.times.push(performance.now() - startTime);
        throw error;
      });
  }

  getStats() {
    const successRate = (this.stats.success / this.stats.total * 100).toFixed(2);
    const avgTime = this.stats.times.length > 0
      ? (this.stats.times.reduce((a, b) => a + b, 0) / this.stats.times.length).toFixed(2)
      : 0;
    
    return {
      name: this.name,
      total: this.stats.total,
      success: this.stats.success,
      failure: this.stats.failure,
      successRate: `${successRate}%`,
      avgTime: `${avgTime}ms`
    };
  }

  printStats() {
    const stats = this.getStats();
    console.log(`${this.name} 统计:`, stats);
  }
}

// 使用示例
const stats = new PromiseStats('API 请求');

stats.monitor(fetch('https://api.example.com/data1'));
stats.monitor(fetch('https://api.example.com/data2'));
stats.monitor(fetch('https://api.example.com/data3'));

setTimeout(() => {
  stats.printStats();
}, 1000);
```

### 10. Promise 可视化追踪

```javascript
class PromiseTracer {
  constructor() {
    this.traces = new Map();
  }

  trace(promise, name = 'Promise') {
    const trace = {
      name,
      startTime: performance.now(),
      endTime: null,
      status: 'pending',
      children: []
    };
    
    this.traces.set(promise, trace);
    
    return promise
      .then(value => {
        trace.status = 'fulfilled';
        trace.endTime = performance.now();
        trace.value = value;
        return value;
      })
      .catch(error => {
        trace.status = 'rejected';
        trace.endTime = performance.now();
        trace.error = error;
        throw error;
      });
  }

  printTraces() {
    console.log('Promise 追踪记录:');
    for (const trace of this.traces.values()) {
      const duration = trace.endTime 
        ? (trace.endTime - trace.startTime).toFixed(2) + 'ms'
        : 'pending';
      
      console.log(`- ${trace.name}: ${trace.status} (${duration})`);
    }
  }
}

// 使用示例
const tracer = new PromiseTracer();

tracer.trace(
  fetch('https://api.example.com/data'),
  'API 请求'
).then(data => {
  console.log('数据:', data);
  tracer.printTraces();
});
```

## 实战场景

### 1. 请求取消

#### 使用 AbortController 取消请求

```javascript
class RequestManager {
  constructor() {
    this.pendingRequests = new Map();
  }

  request(url, options = {}) {
    const requestId = this.generateRequestId(url, options);
    
    // 如果有相同请求正在执行，取消之前的请求
    if (this.pendingRequests.has(requestId)) {
      this.pendingRequests.get(requestId).abort();
    }

    const controller = new AbortController();
    this.pendingRequests.set(requestId, controller);

    return fetch(url, {
      ...options,
      signal: controller.signal
    }).finally(() => {
      this.pendingRequests.delete(requestId);
    });
  }

  generateRequestId(url, options) {
    return `${url}-${JSON.stringify(options)}`;
  }

  cancelAll() {
    this.pendingRequests.forEach(controller => controller.abort());
    this.pendingRequests.clear();
  }
}

// 使用示例
const requestManager = new RequestManager();

// 发起请求
const request1 = requestManager.request('https://api.example.com/data1');
const request2 = requestManager.request('https://api.example.com/data2');

// 取消所有请求
requestManager.cancelAll();
```

#### 组件卸载时取消请求

```javascript
class DataFetcher {
  constructor() {
    this.controller = new AbortController();
  }

  async fetchData(url) {
    try {
      const response = await fetch(url, {
        signal: this.controller.signal
      });
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求已取消');
        return null;
      }
      throw error;
    }
  }

  destroy() {
    this.controller.abort();
  }
}

// 在组件中使用
class Component {
  constructor() {
    this.dataFetcher = new DataFetcher();
  }

  async loadData() {
    const data = await this.dataFetcher.fetchData('https://api.example.com/data');
    console.log('数据:', data);
  }

  destroy() {
    this.dataFetcher.destroy();
  }
}

// 使用示例
const component = new Component();
component.loadData();

// 组件卸载时
component.destroy();
```

### 2. 请求缓存

#### 简单的 Promise 缓存

```javascript
class PromiseCache {
  constructor() {
    this.cache = new Map();
    this.pending = new Map();
  }

  async get(url) {
    // 检查缓存
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // 检查是否有相同的请求正在进行
    if (this.pending.has(url)) {
      return this.pending.get(url);
    }

    // 发起新请求
    const promise = fetch(url)
      .then(response => response.json())
      .then(data => {
        this.cache.set(url, data);
        this.pending.delete(url);
        return data;
      })
      .catch(error => {
        this.pending.delete(url);
        throw error;
      });

    this.pending.set(url, promise);
    return promise;
  }

  clear() {
    this.cache.clear();
    this.pending.clear();
  }
}

// 使用示例
const cache = new PromiseCache();

// 第一次请求
cache.get('https://api.example.com/data').then(data => {
  console.log('第一次请求:', data);
});

// 第二次请求（使用缓存）
cache.get('https://api.example.com/data').then(data => {
  console.log('第二次请求（缓存）:', data);
});
```

#### 带过期时间的缓存

```javascript
class ExpiringCache {
  constructor(defaultTTL = 60000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  async get(key, factory, ttl = this.defaultTTL) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() < cached.expiresAt) {
      return cached.value;
    }

    const value = await factory();
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl
    });

    return value;
  }

  clear() {
    this.cache.clear();
  }

  cleanExpired() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now >= cached.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// 使用示例
const cache = new ExpiringCache(5000); // 5秒过期

cache.get(
  'user-data',
  () => fetch('https://api.example.com/user').then(r => r.json()),
  5000
).then(data => {
  console.log('用户数据:', data);
});

// 5秒后会重新请求
```

### 3. 批量请求

#### 批量请求管理器

```javascript
class BatchRequest {
  constructor(batchSize = 10, delay = 100) {
    this.batchSize = batchSize;
    this.delay = delay;
    this.queue = [];
    this.timer = null;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      
      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.delay);
      }
    });
  }

  async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const batch = this.queue.splice(0, this.batchSize);
    
    try {
      const results = await Promise.all(
        batch.map(item => item.request())
      );
      batch.forEach((item, index) => item.resolve(results[index]));
    } catch (error) {
      batch.forEach(item => item.reject(error));
    }
  }

  async flushAll() {
    while (this.queue.length > 0) {
      await this.flush();
    }
  }
}

// 使用示例
const batchRequest = new BatchRequest(10, 100);

// 添加请求
batchRequest.add(() => fetch('https://api.example.com/data1'));
batchRequest.add(() => fetch('https://api.example.com/data2'));
batchRequest.add(() => fetch('https://api.example.com/data3'));

// 等待所有请求完成
batchRequest.flushAll().then(() => {
  console.log('所有请求完成');
});
```

#### 并发限制的请求池

```javascript
class RequestPool {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async request(fn) {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    this.running++;
    
    try {
      return await fn();
    } finally {
      this.running--;
      
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next();
      }
    }
  }

  async batch(requests) {
    return Promise.all(requests.map(req => this.request(req)));
  }
}

// 使用示例
const pool = new RequestPool(3); // 最多3个并发请求

const requests = Array(10).fill(0).map((_, i) => 
  () => fetch(`https://api.example.com/data/${i}`).then(r => r.json())
);

pool.batch(requests).then(results => {
  console.log('所有请求完成:', results);
});
```

### 4. 请求重试

#### 指数退避重试

```javascript
class RetryRequest {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
  }

  async request(fn, retryCount = 0) {
    try {
      return await fn();
    } catch (error) {
      if (retryCount >= this.maxRetries) {
        throw error;
      }

      const delay = Math.min(
        this.baseDelay * Math.pow(2, retryCount),
        this.maxDelay
      );

      console.log(`重试 ${retryCount + 1}/${this.maxRetries}，等待 ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return this.request(fn, retryCount + 1);
    }
  }
}

// 使用示例
const retryRequest = new RetryRequest({
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000
});

retryRequest.request(() => 
  fetch('https://api.example.com/data').then(r => r.json())
).then(data => {
  console.log('数据:', data);
});
```

#### 智能重试（根据错误类型）

```javascript
class SmartRetry {
  constructor() {
    this.retryableErrors = [408, 429, 500, 502, 503, 504];
  }

  shouldRetry(error) {
    if (error.response) {
      return this.retryableErrors.includes(error.response.status);
    }
    return error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT';
  }

  async request(fn, maxRetries = 3, delay = 1000) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (!this.shouldRetry(error) || i === maxRetries - 1) {
          throw error;
        }

        const waitTime = delay * Math.pow(2, i);
        console.log(`重试 ${i + 1}/${maxRetries}，等待 ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  }
}

// 使用示例
const smartRetry = new SmartRetry();

smartRetry.request(() => 
  fetch('https://api.example.com/data').then(r => r.json())
).then(data => {
  console.log('数据:', data);
});
```

### 5. 请求超时

#### 带超时的请求

```javascript
class TimeoutRequest {
  constructor(defaultTimeout = 5000) {
    this.defaultTimeout = defaultTimeout;
  }

  async request(url, options = {}, timeout = this.defaultTimeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`请求超时 (${timeout}ms)`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// 使用示例
const timeoutRequest = new TimeoutRequest(3000);

timeoutRequest.request('https://api.example.com/data')
  .then(data => console.log('数据:', data))
  .catch(error => console.error('错误:', error.message));
```

### 6. 请求队列

#### 优先级请求队列

```javascript
class PriorityRequestQueue {
  constructor() {
    this.queue = [];
    this.running = 0;
    this.maxConcurrent = 3;
  }

  add(request, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.process();
    });
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    this.running++;

    try {
      const result = await item.request();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// 使用示例
const queue = new PriorityRequestQueue();

// 添加不同优先级的请求
queue.add(
  () => fetch('https://api.example.com/critical').then(r => r.json()),
  10 // 高优先级
);

queue.add(
  () => fetch('https://api.example.com/normal').then(r => r.json()),
  5 // 中优先级
);

queue.add(
  () => fetch('https://api.example.com/low').then(r => r.json()),
  1 // 低优先级
);
```

### 7. 请求去重

#### 请求去重管理器

```javascript
class RequestDeduplicator {
  constructor() {
    this.pending = new Map();
  }

  async request(key, fn) {
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    const promise = fn()
      .finally(() => {
        this.pending.delete(key);
      });

    this.pending.set(key, promise);
    return promise;
  }
}

// 使用示例
const deduplicator = new RequestDeduplicator();

// 同时发起多个相同请求
const request1 = deduplicator.request(
  'user-data',
  () => fetch('https://api.example.com/user').then(r => r.json())
);

const request2 = deduplicator.request(
  'user-data',
  () => fetch('https://api.example.com/user').then(r => r.json())
);

const request3 = deduplicator.request(
  'user-data',
  () => fetch('https://api.example.com/user').then(r => r.json())
);

// 所有请求共享同一个 Promise
Promise.all([request1, request2, request3]).then(([data1, data2, data3]) => {
  console.log('所有请求完成:', data1, data2, data3);
});
```

## 高级话题

### 1. Promise 与事件循环

Promise 的回调函数是微任务，会在宏任务执行完后立即执行。

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0); // 宏任务

Promise.resolve().then(() => console.log('3')); // 微任务

console.log('4');
// 输出: 1, 4, 3, 2
```

**事件循环执行机制**：
1. 执行同步代码
2. 执行所有微任务
3. 执行一个宏任务
4. 重复步骤 2-3

**微任务队列**：
- Promise.then/catch/finally
- queueMicrotask
- MutationObserver

**宏任务队列**：
- setTimeout/setInterval
- setImmediate (Node.js)
- I/O 操作
- UI 渲染

### 2. Promise 性能优化

#### 避免创建不必要的 Promise

```javascript
// ❌ 不好的做法
function getData() {
  return new Promise(resolve => {
    resolve('数据');
  });
}

// ✅ 好的做法
function getData() {
  return Promise.resolve('数据');
}
```

#### 合理使用 Promise.all

对于并行操作，使用 Promise.all 可以提高效率。

```javascript
// ❌ 串行执行（慢）
async function serialRequests() {
  const result1 = await fetch('https://api.example.com/data1');
  const result2 = await fetch('https://api.example.com/data2');
  const result3 = await fetch('https://api.example.com/data3');
  return [result1, result2, result3];
}

// ✅ 并行执行（快）
async function parallelRequests() {
  const [result1, result2, result3] = await Promise.all([
    fetch('https://api.example.com/data1'),
    fetch('https://api.example.com/data2'),
    fetch('https://api.example.com/data3')
  ]);
  return [result1, result2, result3];
}
```

#### 处理大型 Promise 链

对于大型 Promise 链，考虑使用 async/await 使代码更清晰。

```javascript
// ❌ 使用 Promise 链
function complexOperation() {
  return step1()
    .then(result1 => step2(result1))
    .then(result2 => step3(result2))
    .then(result3 => step4(result3))
    .then(result4 => step5(result4));
}

// ✅ 使用 async/await
async function complexOperation() {
  const result1 = await step1();
  const result2 = await step2(result1);
  const result3 = await step3(result2);
  const result4 = await step4(result3);
  return step5(result4);
}
```

#### 限制并发数量

```javascript
async function limitConcurrency(tasks, limit = 5) {
  const results = [];
  const executing = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    
    results.push(promise);
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// 使用示例
const tasks = Array(100).fill(0).map((_, i) => 
  () => fetch(`https://api.example.com/data/${i}`)
);

limitConcurrency(tasks, 10).then(results => {
  console.log('所有请求完成:', results);
});
```

### 3. Promise 的取消模式

#### 使用 AbortController

```javascript
class CancellableFetch {
  constructor() {
    this.controller = new AbortController();
  }

  async fetch(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: this.controller.signal
      });
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求已取消');
      }
      throw error;
    }
  }

  cancel() {
    this.controller.abort();
  }
}

// 使用示例
const cancellableFetch = new CancellableFetch();
cancellableFetch.fetch('https://api.example.com/data');
cancellableFetch.cancel(); // 取消请求
```

#### 自定义可取消 Promise

```javascript
class CancellablePromise {
  constructor(executor) {
    this.cancelled = false;
    this.promise = new Promise((resolve, reject) => {
      executor(
        value => this.cancelled ? reject(new Error('Cancelled')) : resolve(value),
        reason => this.cancelled ? reject(new Error('Cancelled')) : reject(reason)
      );
    });
  }

  cancel() {
    this.cancelled = true;
  }

  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
}

// 使用示例
const cancellablePromise = new CancellablePromise((resolve) => {
  setTimeout(() => resolve('完成'), 2000);
});

cancellablePromise.then(console.log);
cancellablePromise.cancel(); // 取消 Promise
```

### 4. Promise 的内存管理

#### 避免内存泄漏

```javascript
// ❌ 错误示例：循环引用导致内存泄漏
const promise = new Promise((resolve) => {
  const obj = { promise };
  resolve(obj);
});

// ✅ 正确示例：及时清理引用
const promise = new Promise((resolve) => {
  const obj = { data: 'value' };
  resolve(obj);
  obj.data = null; // 清理引用
});
```

#### 使用 WeakMap 避免强引用

```javascript
// ✅ 使用 WeakMap 避免阻止垃圾回收
const cache = new WeakMap();

function fetchData(url) {
  if (cache.has(url)) {
    return Promise.resolve(cache.get(url));
  }
  
  return fetch(url).then(response => {
    const data = response.json();
    cache.set(url, data); // 使用 WeakMap，不会阻止垃圾回收
    return data;
  });
}
```

### 5. Promise 的错误边界

#### 全局错误处理

```javascript
// 监听未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的 Promise 拒绝:', event.reason);
  event.preventDefault(); // 阻止默认的控制台警告
});

// 测试
Promise.reject(new Error('未处理的错误'));
```

#### 错误恢复模式

```javascript
function recoverablePromise(promise, recovery) {
  return promise.catch(error => {
    console.log('尝试恢复错误:', error.message);
    return recovery(error);
  });
}

// 使用示例
recoverablePromise(
  fetch('https://api.example.com/data'),
  (error) => {
    return { data: 'default', error: error.message };
  }
).then(data => {
  console.log('数据:', data);
});
```

### 6. Promise 的组合模式

#### Promise 链式组合

```javascript
function pipe(...fns) {
  return value => fns.reduce((promise, fn) => 
    promise.then(fn), 
    Promise.resolve(value)
  );
}

// 使用示例
const processData = pipe(
  data => data.map(item => item * 2),
  data => data.filter(item => item > 10),
  data => data.reduce((sum, item) => sum + item, 0)
);

processData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .then(result => console.log('结果:', result));
```

#### Promise 并行组合

```javascript
function parallel(...fns) {
  return Promise.all(fns.map(fn => fn()));
}

// 使用示例
parallel(
  () => fetch('https://api.example.com/user'),
  () => fetch('https://api.example.com/posts'),
  () => fetch('https://api.example.com/comments')
).then(([user, posts, comments]) => {
  console.log('并行结果:', { user, posts, comments });
});
```

### 7. Promise 的超时和重试

#### 指数退避重试

```javascript
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`重试 ${attempt}/${maxRetries}，等待 ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 使用示例
retryWithBackoff(
  () => fetch('https://api.example.com/data').then(r => r.json()),
  3,
  1000
).then(data => console.log('数据:', data));
```

#### 带超时的 Promise

```javascript
function withTimeout(promise, timeout, errorMessage = '操作超时') {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(errorMessage)), timeout)
    )
  ]);
}

// 使用示例
withTimeout(
  fetch('https://api.example.com/data'),
  5000,
  '请求超时'
)
  .then(response => console.log('请求成功'))
  .catch(error => console.log('请求失败:', error.message));
```

### 8. Promise 的性能监控

#### Promise 执行时间监控

```javascript
function timedPromise(promise, name = 'Promise') {
  const startTime = performance.now();
  
  return promise.finally(() => {
    const duration = performance.now() - startTime;
    console.log(`${name} 执行时间: ${duration.toFixed(2)}ms`);
  });
}

// 使用示例
timedPromise(
  fetch('https://api.example.com/data'),
  'API 请求'
).then(response => console.log('响应:', response));
```

#### Promise 成功率监控

```javascript
class PromiseMonitor {
  constructor() {
    this.stats = {
      total: 0,
      success: 0,
      failure: 0
    };
  }

  monitor(promise) {
    this.stats.total++;
    return promise
      .then(value => {
        this.stats.success++;
        return value;
      })
      .catch(error => {
        this.stats.failure++;
        throw error;
      });
  }

  getStats() {
    const successRate = (this.stats.success / this.stats.total * 100).toFixed(2);
    return {
      ...this.stats,
      successRate: `${successRate}%`
    };
  }
}

// 使用示例
const monitor = new PromiseMonitor();

monitor.monitor(fetch('https://api.example.com/data1'));
monitor.monitor(fetch('https://api.example.com/data2'));
monitor.monitor(fetch('https://api.example.com/data3'));

setTimeout(() => {
  console.log('Promise 统计:', monitor.getStats());
}, 1000);
```

## 最佳实践

### 1. 错误处理

```javascript
// ✅ 好的做法：始终处理错误
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    return await response.json();
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error;
  }
}

// ❌ 不好的做法：忽略错误
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  return await response.json();
}
```

### 2. 并行处理

```javascript
// ✅ 好的做法：使用 Promise.all 并行处理
async function fetchMultipleData() {
  const [user, posts, comments] = await Promise.all([
    fetch('https://api.example.com/user').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/comments').then(r => r.json())
  ]);
  return { user, posts, comments };
}

// ❌ 不好的做法：串行处理
async function fetchMultipleData() {
  const user = await fetch('https://api.example.com/user').then(r => r.json());
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  const comments = await fetch('https://api.example.com/comments').then(r => r.json());
  return { user, posts, comments };
}
```

### 3. 避免过深的 Promise 链

```javascript
// ✅ 好的做法：使用 async/await
async function process() {
  const data1 = await step1();
  const data2 = await step2(data1);
  const data3 = await step3(data2);
  return data3;
}

// ❌ 不好的做法：过深的 Promise 链
function process() {
  return step1()
    .then(data1 => step2(data1))
    .then(data2 => step3(data2))
    .then(data3 => data3);
}
```

### 4. 合理使用 Promise 静态方法

```javascript
// ✅ 好的做法：根据场景选择合适的方法
// 所有都必须成功
await Promise.all([promise1, promise2, promise3]);

// 只要有一个成功就行
await Promise.any([promise1, promise2, promise3]);

// 需要所有结果，无论成功失败
await Promise.allSettled([promise1, promise2, promise3]);

// 只要有一个完成就行
await Promise.race([promise1, promise2, promise3]);
```

### 5. 避免创建不必要的 Promise

```javascript
// ✅ 好的做法：直接返回值
function getData() {
  return 'data';
}

// ❌ 不好的做法：包装不必要的 Promise
function getData() {
  return Promise.resolve('data');
}
```

### 6. 使用 finally 进行清理

```javascript
// ✅ 好的做法：使用 finally 确保清理
async function fetchData() {
  const connection = await createConnection();
  try {
    const data = await connection.query('SELECT * FROM users');
    return data;
  } finally {
    await connection.close();
  }
}

// ❌ 不好的做法：在多个地方重复清理代码
async function fetchData() {
  const connection = await createConnection();
  try {
    const data = await connection.query('SELECT * FROM users');
    await connection.close();
    return data;
  } catch (error) {
    await connection.close();
    throw error;
  }
}
```

### 7. 错误恢复策略

```javascript
// ✅ 好的做法：提供错误恢复机制
async function fetchDataWithFallback(primaryUrl, fallbackUrl) {
  try {
    return await fetch(primaryUrl).then(r => r.json());
  } catch (error) {
    console.warn('主接口失败，使用备用接口:', error.message);
    return await fetch(fallbackUrl).then(r => r.json());
  }
}

// 使用示例
fetchDataWithFallback(
  'https://api.primary.com/data',
  'https://api.fallback.com/data'
);
```

### 8. Promise 超时处理

```javascript
// ✅ 好的做法：为 Promise 添加超时
async function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('请求超时')), timeout)
    )
  ]);
}

// 使用示例
fetchWithTimeout('https://api.example.com/data', 3000)
  .then(response => console.log('请求成功'))
  .catch(error => console.log('请求失败:', error.message));
```

### 9. 避免在循环中创建 Promise

```javascript
// ❌ 不好的做法：在循环中创建 Promise
async function processItems(items) {
  const results = [];
  for (const item of items) {
    results.push(new Promise(resolve => {
      setTimeout(() => resolve(process(item)), 1000);
    }));
  }
  return Promise.all(results);
}

// ✅ 好的做法：使用 map 创建 Promise
async function processItems(items) {
  const promises = items.map(item => 
    new Promise(resolve => {
      setTimeout(() => resolve(process(item)), 1000);
    })
  );
  return Promise.all(promises);
}
```

### 10. 使用 Promise.allSettled 处理批量操作

```javascript
// ✅ 好的做法：使用 Promise.allSettled 处理批量操作
async function uploadFiles(files) {
  const results = await Promise.allSettled(
    files.map(file => uploadFile(file))
  );
  
  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
  
  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);
  
  console.log(`成功: ${successful.length}, 失败: ${failed.length}`);
  return { successful, failed };
}

// ❌ 不好的做法：使用 Promise.all，一个失败就全部失败
async function uploadFiles(files) {
  try {
    return await Promise.all(files.map(file => uploadFile(file)));
  } catch (error) {
    console.log('上传失败:', error);
    throw error;
  }
}
```

### 11. 合理使用 async/await 和 Promise

```javascript
// ✅ 好的做法：并行操作使用 Promise.all，串行操作使用 async/await
async function fetchData() {
  // 并行获取不相关的数据
  const [user, settings] = await Promise.all([
    fetchUser(),
    fetchSettings()
  ]);
  
  // 串行处理有依赖的数据
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);
  
  return { user, settings, posts, comments };
}
```

### 12. 避免嵌套的 async 函数

```javascript
// ❌ 不好的做法：嵌套的 async 函数
async function process() {
  const data1 = await fetch1();
  const data2 = await fetch2();
  
  async function processNested() {
    const data3 = await fetch3();
    const data4 = await fetch4();
    return { data3, data4 };
  }
  
  const nested = await processNested();
  return { data1, data2, ...nested };
}

// ✅ 好的做法：扁平化 async 函数
async function process() {
  const data1 = await fetch1();
  const data2 = await fetch2();
  const data3 = await fetch3();
  const data4 = await fetch4();
  
  return { data1, data2, data3, data4 };
}
```

### 13. 使用 AbortController 取消请求

```javascript
// ✅ 好的做法：使用 AbortController 取消请求
class RequestManager {
  constructor() {
    this.controller = new AbortController();
  }

  async fetch(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: this.controller.signal
      });
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求已取消');
      }
      throw error;
    }
  }

  cancel() {
    this.controller.abort();
    this.controller = new AbortController();
  }
}

// 使用示例
const manager = new RequestManager();
manager.fetch('https://api.example.com/data');
manager.cancel(); // 取消请求
```

### 14. 错误分类处理

```javascript
// ✅ 好的做法：分类处理不同类型的错误
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError('资源不存在');
      } else if (response.status >= 500) {
        throw new ServerError('服务器错误');
      } else {
        throw new ApiError('请求失败');
      }
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof NetworkError) {
      console.error('网络错误:', error.message);
    } else if (error instanceof ApiError) {
      console.error('API 错误:', error.message);
    } else {
      console.error('未知错误:', error.message);
    }
    throw error;
  }
}
```

### 15. 使用 Promise 缓存结果

```javascript
// ✅ 好的做法：缓存 Promise 结果
class PromiseCache {
  constructor() {
    this.cache = new Map();
  }

  async get(key, factory) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const promise = factory().finally(() => {
      // 可选：设置缓存过期时间
      setTimeout(() => this.cache.delete(key), 60000);
    });

    this.cache.set(key, promise);
    return promise;
  }
}

// 使用示例
const cache = new PromiseCache();

async function getUserData(userId) {
  return cache.get(`user-${userId}`, () => 
    fetch(`https://api.example.com/users/${userId}`).then(r => r.json())
  );
}

// 多次调用只会发起一次请求
const user1 = await getUserData(1);
const user2 = await getUserData(1); // 使用缓存
```

## 面试高频问题

### Q1: Promise 的状态转换规则是什么？

**答案**：
- Promise 有三种状态：pending、fulfilled、rejected
- 状态只能从 pending 转换为 fulfilled 或 rejected
- 一旦状态改变，就不可逆
- fulfilled 状态会保存结果值，rejected 状态会保存失败原因

**代码示例**：
```javascript
const promise = new Promise((resolve, reject) => {
  resolve('成功');
  reject('失败'); // 不会执行，状态已改变
});

console.log(promise); // Promise {<fulfilled>: '成功'}
```

### Q2: Promise.then 的返回值是什么？

**答案**：
- then 方法总是返回一个新的 Promise
- 返回值的处理规则：
  - 返回普通值：新 Promise resolve 该值
  - 返回 Promise：新 Promise 采用该 Promise 的状态
  - 返回 thenable 对象：递归处理
  - 抛出错误：新 Promise reject 该错误

**代码示例**：
```javascript
// 返回普通值
Promise.resolve(1)
  .then(value => value + 1)
  .then(value => console.log(value)); // 输出: 2

// 返回 Promise
Promise.resolve(1)
  .then(value => Promise.resolve(value + 1))
  .then(value => console.log(value)); // 输出: 2

// 返回 thenable 对象
Promise.resolve(1)
  .then(value => ({
    then: function(resolve) {
      resolve(value + 1);
    }
  }))
  .then(value => console.log(value)); // 输出: 2

// 抛出错误
Promise.resolve(1)
  .then(() => { throw new Error('错误'); })
  .catch(error => console.log(error.message)); // 输出: 错误
```

### Q3: 如何实现 Promise 的串行和并行？

**答案**：
```javascript
// 串行执行
async function serial(promises) {
  const results = [];
  for (const promise of promises) {
    const result = await promise;
    results.push(result);
  }
  return results;
}

// 并行执行
async function parallel(promises) {
  return Promise.all(promises);
}

// 限制并发数
async function limitConcurrency(promises, limit) {
  const results = [];
  const executing = [];
  
  for (const promise of promises) {
    const p = Promise.resolve(promise).then(result => {
      executing.splice(executing.indexOf(p), 1);
      return result;
    });
    
    results.push(p);
    executing.push(p);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// 使用示例
const tasks = [
  () => new Promise(resolve => setTimeout(() => resolve(1), 100)),
  () => new Promise(resolve => setTimeout(() => resolve(2), 200)),
  () => new Promise(resolve => setTimeout(() => resolve(3), 300))
];

serial(tasks).then(console.log); // 串行执行
parallel(tasks).then(console.log); // 并行执行
limitConcurrency(tasks, 2).then(console.log); // 限制并发数为2
```

### Q4: Promise.all 和 Promise.allSettled 的区别？

**答案**：
- **Promise.all**：所有 Promise 都成功才成功，有一个失败就失败
- **Promise.allSettled**：无论成功失败，都返回所有 Promise 的结果

**代码示例**：
```javascript
// Promise.all - 有一个失败就失败
Promise.all([
  Promise.resolve(1),
  Promise.reject('失败'),
  Promise.resolve(3)
]).catch(error => console.log('Promise.all 失败:', error));
// 输出: Promise.all 失败: 失败

// Promise.allSettled - 返回所有结果
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('失败'),
  Promise.resolve(3)
]).then(results => console.log('Promise.allSettled 结果:', results));
// 输出: Promise.allSettled 结果: [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: '失败' },
//   { status: 'fulfilled', value: 3 }
// ]
```

### Q5: 如何实现一个带超时的 Promise？

**答案**：
```javascript
function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// 使用示例
withTimeout(fetch('https://api.example.com'), 5000)
  .then(response => console.log('请求成功'))
  .catch(error => console.log('请求失败:', error.message));

// 也可以封装成 Promise 方法
Promise.withTimeout = function(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};

Promise.withTimeout(
  new Promise(resolve => setTimeout(() => resolve('完成'), 3000)),
  2000
).catch(error => console.log(error.message)); // 输出: Timeout
```

### Q6: 如何实现 Promise 的重试机制？

**答案**：
```javascript
async function retry(fn, times = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (times <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, times - 1, delay);
  }
}

// 使用示例
retry(
  () => fetch('https://api.example.com').then(r => {
    if (!r.ok) throw new Error('请求失败');
    return r.json();
  }),
  3,
  1000
)
  .then(data => console.log('请求成功:', data))
  .catch(error => console.log('重试失败:', error.message));

// 也可以实现指数退避重试
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Q7: Promise 和 async/await 的区别？

**答案**：
- **Promise**：基于链式调用的异步处理方式
- **async/await**：基于同步语法的异步处理方式，是 Promise 的语法糖

**对比**：
```javascript
// Promise 链式调用
function fetchData() {
  return fetch('https://api.example.com/user')
    .then(response => response.json())
    .then(user => {
      return fetch(`https://api.example.com/posts/${user.id}`)
        .then(response => response.json())
        .then(posts => ({ user, posts }));
    });
}

// async/await
async function fetchData() {
  const userResponse = await fetch('https://api.example.com/user');
  const user = await userResponse.json();
  
  const postsResponse = await fetch(`https://api.example.com/posts/${user.id}`);
  const posts = await postsResponse.json();
  
  return { user, posts };
}
```

**优势对比**：
- **Promise**：更适合处理并行的异步操作
- **async/await**：更适合处理有依赖关系的串行异步操作，代码更易读

### Q8: 如何实现 Promise 的取消？

**答案**：
```javascript
class CancellablePromise {
  constructor(executor) {
    this.cancelled = false;
    this.promise = new Promise((resolve, reject) => {
      executor(
        value => this.cancelled ? reject(new Error('Cancelled')) : resolve(value),
        reason => this.cancelled ? reject(new Error('Cancelled')) : reject(reason)
      );
    });
  }

  cancel() {
    this.cancelled = true;
  }

  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.promise.catch(onRejected);
  }
}

// 使用示例
const cancellablePromise = new CancellablePromise((resolve) => {
  setTimeout(() => resolve('完成'), 2000);
});

cancellablePromise.then(console.log);
cancellablePromise.cancel(); // 取消 Promise

// 也可以使用 AbortController
function fetchWithAbort(url, options = {}) {
  const controller = new AbortController();
  const signal = controller.signal;
  
  const promise = fetch(url, { ...options, signal });
  
  promise.abort = () => controller.abort();
  
  return promise;
}

// 使用示例
const request = fetchWithAbort('https://api.example.com/data');
request.then(response => console.log(response));
request.abort(); // 取消请求
```

### Q9: Promise 的微任务和宏任务有什么区别？

**答案**：
- **微任务**：Promise.then、queueMicrotask、MutationObserver
- **宏任务**：setTimeout、setInterval、setImmediate、I/O、UI 渲染

**执行顺序**：
```javascript
console.log('1');

setTimeout(() => console.log('2'), 0); // 宏任务

Promise.resolve().then(() => console.log('3')); // 微任务

console.log('4');

// 输出顺序: 1, 4, 3, 2
```

**执行机制**：
1. 执行同步代码
2. 执行所有微任务
3. 执行一个宏任务
4. 重复步骤 2-3

### Q10: 如何避免 Promise 的内存泄漏？

**答案**：
```javascript
// 1. 及时清理引用
function createPromise() {
  const data = { largeData: new Array(1000000).fill('data') };
  
  return new Promise((resolve) => {
    resolve(data);
    // Promise resolve 后，data 可以被垃圾回收
  });
}

// 2. 避免循环引用
const promise = new Promise((resolve) => {
  const obj = { promise }; // 循环引用
  resolve(obj);
});

// 3. 使用 WeakMap 避免强引用
const cache = new WeakMap();

function fetchData(url) {
  if (cache.has(url)) {
    return Promise.resolve(cache.get(url));
  }
  
  return fetch(url).then(response => {
    const data = response.json();
    cache.set(url, data); // 使用 WeakMap，不会阻止垃圾回收
    return data;
  });
}

// 4. 及时取消未完成的 Promise
class PromiseManager {
  constructor() {
    this.promises = new Set();
  }

  add(promise) {
    this.promises.add(promise);
    return promise.finally(() => {
      this.promises.delete(promise);
    });
  }

  cancelAll() {
    this.promises.forEach(promise => {
      if (promise.abort) promise.abort();
    });
    this.promises.clear();
  }
}
```

## 总结

Promise 是 JavaScript 中处理异步操作的强大工具，它提供了：

1. **优雅的链式调用**：避免回调地狱，使代码更清晰
2. **统一的错误处理**：使用 catch 捕获所有错误
3. **状态管理**：清晰的状态转换机制
4. **丰富的静态方法**：all、race、allSettled、any 等
5. **与 async/await 集成**：提供更简洁的语法

理解 Promise 的工作原理和使用方法，对于编写高质量的异步代码至关重要。在实际开发中，合理使用 Promise 可以大大提高代码的可读性、可维护性和可靠性。

Promise 已经成为现代 JavaScript 中处理异步操作的标准方式，掌握它是每个 JavaScript 开发者的必备技能。