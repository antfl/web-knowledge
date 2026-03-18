/**
 * 手写实现 Promise
 * 实现 Promise/A+ 规范的核心功能
 */
class MyPromise {
  // 定义 Promise 的三种状态
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  /**
   * 构造函数
   * @param {Function} executor - 执行器函数，接收 resolve 和 reject 两个参数
   */
  constructor(executor) {
    // 初始化状态
    this.status = MyPromise.PENDING;
    // 存储成功时的值
    this.value = undefined;
    // 存储失败时的原因
    this.reason = undefined;
    // 存储成功回调函数队列
    this.onFulfilledCallbacks = [];
    // 存储失败回调函数队列
    this.onRejectedCallbacks = [];

    // 绑定 this 指向
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);

    try {
      // 执行执行器函数
      executor(this.resolve, this.reject);
    } catch (error) {
      // 如果执行器函数抛出错误，直接 reject
      this.reject(error);
    }
  }

  /**
   * 成功回调
   * @param {*} value - 成功时的值
   */
  resolve(value) {
    // 只有在 pending 状态下才能转变为 fulfilled 状态
    if (this.status === MyPromise.PENDING) {
      // 改变状态为 fulfilled
      this.status = MyPromise.FULFILLED;
      // 存储成功值
      this.value = value;
      // 执行所有成功回调
      this.onFulfilledCallbacks.forEach(callback => {
        callback(value);
      });
    }
  }

  /**
   * 失败回调
   * @param {*} reason - 失败的原因
   */
  reject(reason) {
    // 只有在 pending 状态下才能转变为 rejected 状态
    if (this.status === MyPromise.PENDING) {
      // 改变状态为 rejected
      this.status = MyPromise.REJECTED;
      // 存储失败原因
      this.reason = reason;
      // 执行所有失败回调
      this.onRejectedCallbacks.forEach(callback => {
        callback(reason);
      });
    }
  }

  /**
   * 注册成功和失败的回调
   * @param {Function} onFulfilled - 成功回调
   * @param {Function} onRejected - 失败回调
   * @returns {MyPromise} - 返回一个新的 Promise
   */
  then(onFulfilled, onRejected) {
    // 处理参数默认值，确保是函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    // 创建并返回一个新的 Promise
    const promise2 = new MyPromise((resolve, reject) => {
      // 处理 fulfilled 状态
      if (this.status === MyPromise.FULFILLED) {
        // 使用 setTimeout 模拟异步，确保回调是异步执行的
        setTimeout(() => {
          try {
            // 执行成功回调，获取返回值
            const x = onFulfilled(this.value);
            // 处理返回值，实现链式调用
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            // 如果回调执行出错，直接 reject
            reject(error);
          }
        }, 0);
      }

      // 处理 rejected 状态
      if (this.status === MyPromise.REJECTED) {
        // 使用 setTimeout 模拟异步，确保回调是异步执行的
        setTimeout(() => {
          try {
            // 执行失败回调，获取返回值
            const x = onRejected(this.reason);
            // 处理返回值，实现链式调用
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            // 如果回调执行出错，直接 reject
            reject(error);
          }
        }, 0);
      }

      // 处理 pending 状态
      if (this.status === MyPromise.PENDING) {
        // 将回调函数存储到队列中
        this.onFulfilledCallbacks.push(value => {
          setTimeout(() => {
            try {
              const x = onFulfilled(value);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallbacks.push(reason => {
          setTimeout(() => {
            try {
              const x = onRejected(reason);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }

  /**
   * 处理 Promise 的返回值，实现链式调用
   * @param {MyPromise} promise2 - then 方法返回的新 Promise
   * @param {*} x - 回调函数的返回值
   * @param {Function} resolve - promise2 的 resolve 方法
   * @param {Function} reject - promise2 的 reject 方法
   */
  resolvePromise(promise2, x, resolve, reject) {
    // 如果 x 就是 promise2，会导致循环引用，直接 reject
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }

    // 如果 x 是 Promise 实例
    if (x instanceof MyPromise) {
      // 等待 x 状态改变后，将结果传递给 promise2
      x.then(
        value => this.resolvePromise(promise2, value, resolve, reject),
        reason => reject(reason)
      );
    } 
    // 如果 x 是对象或函数
    else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let called = false; // 防止多次调用 resolve 或 reject
      try {
        // 获取 x.then 方法
        const then = x.then;
        // 如果 then 是函数
        if (typeof then === 'function') {
          // 调用 then 方法，将 this 指向 x
          then.call(
            x,
            // 成功回调
            value => {
              if (called) return;
              called = true;
              // 递归处理返回值
              this.resolvePromise(promise2, value, resolve, reject);
            },
            // 失败回调
            reason => {
              if (called) return;
              called = true;
              reject(reason);
            }
          );
        } else {
          // 如果 then 不是函数，直接 resolve x
          if (called) return;
          called = true;
          resolve(x);
        }
      } catch (error) {
        // 如果获取 then 或调用 then 时出错，直接 reject
        if (called) return;
        called = true;
        reject(error);
      }
    } 
    // 如果 x 是其他值，直接 resolve x
    else {
      resolve(x);
    }
  }

  /**
   * 注册失败回调，相当于 then(null, onRejected)
   * @param {Function} onRejected - 失败回调
   * @returns {MyPromise} - 返回一个新的 Promise
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * 无论 Promise 成功还是失败，都会执行的回调
   * @param {Function} onFinally - 最终回调
   * @returns {MyPromise} - 返回一个新的 Promise
   */
  finally(onFinally) {
    return this.then(
      value => {
        // 执行 finally 回调，然后返回原 value
        return MyPromise.resolve(onFinally()).then(() => value);
      },
      reason => {
        // 执行 finally 回调，然后抛出原 reason
        return MyPromise.resolve(onFinally()).then(() => { throw reason });
      }
    );
  }

  /**
   * 静态方法：创建一个已解决的 Promise
   * @param {*} value - 解决值
   * @returns {MyPromise} - 返回一个已解决的 Promise
   */
  static resolve(value) {
    // 如果 value 已经是 Promise 实例，直接返回
    if (value instanceof MyPromise) {
      return value;
    }
    // 否则创建一个新的 Promise 并 resolve
    return new MyPromise(resolve => resolve(value));
  }

  /**
   * 静态方法：创建一个已拒绝的 Promise
   * @param {*} reason - 拒绝原因
   * @returns {MyPromise} - 返回一个已拒绝的 Promise
   */
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  /**
   * 静态方法：等待所有 Promise 完成
   * @param {Array} promises - Promise 数组
   * @returns {MyPromise} - 返回一个新的 Promise
   */
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }

      const result = [];
      let count = 0;

      for (let i = 0; i < promises.length; i++) {
        MyPromise.resolve(promises[i]).then(
          value => {
            result[i] = value;
            count++;
            // 所有 Promise 都完成后 resolve
            if (count === promises.length) {
              resolve(result);
            }
          },
          reason => {
            // 有一个 Promise 失败就 reject
            reject(reason);
          }
        );
      }

      // 如果数组为空，直接 resolve 空数组
      if (promises.length === 0) {
        resolve(result);
      }
    });
  }

  /**
   * 静态方法：等待第一个完成的 Promise
   * @param {Array} promises - Promise 数组
   * @returns {MyPromise} - 返回一个新的 Promise
   */
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }

      // 只要有一个 Promise 完成或失败，就立即 resolve 或 reject
      for (let i = 0; i < promises.length; i++) {
        MyPromise.resolve(promises[i]).then(
          value => resolve(value),
          reason => reject(reason)
        );
      }

      // 如果数组为空，Promise 将永远保持 pending 状态
    });
  }

  /**
   * 静态方法：等待所有 Promise 完成，无论成功或失败
   * @param {Array} promises - Promise 数组
   * @returns {MyPromise} - 返回一个新的 Promise，包含所有结果
   */
  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }

      const result = [];
      let count = 0;

      for (let i = 0; i < promises.length; i++) {
        MyPromise.resolve(promises[i]).then(
          value => {
            result[i] = { status: 'fulfilled', value };
            count++;
            if (count === promises.length) {
              resolve(result);
            }
          },
          reason => {
            result[i] = { status: 'rejected', reason };
            count++;
            if (count === promises.length) {
              resolve(result);
            }
          }
        );
      }

      if (promises.length === 0) {
        resolve(result);
      }
    });
  }

  /**
   * 静态方法：只要有一个 Promise 成功就 resolve，否则 reject
   * @param {Array} promises - Promise 数组
   * @returns {MyPromise} - 返回一个新的 Promise
   */
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Argument must be an array'));
      }

      const errors = [];
      let count = 0;

      for (let i = 0; i < promises.length; i++) {
        MyPromise.resolve(promises[i]).then(
          value => resolve(value), // 只要有一个成功就 resolve
          reason => {
            errors[i] = reason;
            count++;
            // 所有都失败才 reject
            if (count === promises.length) {
              reject(new AggregateError(errors, 'All promises were rejected'));
            }
          }
        );
      }

      if (promises.length === 0) {
        reject(new AggregateError([], 'All promises were rejected'));
      }
    });
  }
}

// 测试用例
function testPromise() {
  console.log('=== 测试 Promise 基本功能 ===');
  
  // 测试 1: 基本 resolve
  console.log('\n测试 1: 基本 resolve');
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('成功');
    }, 100);
  }).then(value => {
    console.log('resolve 结果:', value);
  });
  
  // 测试 2: 基本 reject
  console.log('\n测试 2: 基本 reject');
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject('失败');
    }, 100);
  }).catch(reason => {
    console.log('reject 结果:', reason);
  });
  
  // 测试 3: 链式调用
  console.log('\n测试 3: 链式调用');
  new MyPromise((resolve, reject) => {
    resolve(1);
  }).then(value => {
    console.log('第一步:', value);
    return value * 2;
  }).then(value => {
    console.log('第二步:', value);
    return value * 2;
  }).then(value => {
    console.log('第三步:', value);
  });
  
  // 测试 4: 错误处理
  console.log('\n测试 4: 错误处理');
  new MyPromise((resolve, reject) => {
    resolve(1);
  }).then(value => {
    throw new Error('手动抛出错误');
  }).catch(error => {
    console.log('捕获错误:', error.message);
    return '错误已处理';
  }).then(value => {
    console.log('错误处理后的结果:', value);
  });
  
  // 测试 5: finally
  console.log('\n测试 5: finally');
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('成功');
    }, 100);
  }).then(value => {
    console.log('成功结果:', value);
  }).finally(() => {
    console.log('执行 finally');
  });
  
  // 测试 6: Promise.resolve
  console.log('\n测试 6: Promise.resolve');
  MyPromise.resolve('直接 resolve').then(value => {
    console.log('resolve 结果:', value);
  });
  
  // 测试 7: Promise.reject
  console.log('\n测试 7: Promise.reject');
  MyPromise.reject('直接 reject').catch(reason => {
    console.log('reject 结果:', reason);
  });
  
  // 测试 8: Promise.all
  console.log('\n测试 8: Promise.all');
  MyPromise.all([
    MyPromise.resolve(1),
    MyPromise.resolve(2),
    MyPromise.resolve(3)
  ]).then(values => {
    console.log('all 结果:', values);
  });
  
  // 测试 9: Promise.race
  console.log('\n测试 9: Promise.race');
  MyPromise.race([
    new MyPromise(resolve => setTimeout(() => resolve('第一个'), 100)),
    new MyPromise(resolve => setTimeout(() => resolve('第二个'), 50)),
    new MyPromise(resolve => setTimeout(() => resolve('第三个'), 150))
  ]).then(value => {
    console.log('race 结果:', value);
  });
  
  // 测试 10: Promise.allSettled
  console.log('\n测试 10: Promise.allSettled');
  MyPromise.allSettled([
    MyPromise.resolve(1),
    MyPromise.reject('失败'),
    MyPromise.resolve(3)
  ]).then(results => {
    console.log('allSettled 结果:', results);
  });
  
  // 测试 11: Promise.any
  console.log('\n测试 11: Promise.any');
  MyPromise.any([
    MyPromise.reject('第一个失败'),
    MyPromise.resolve('成功'),
    MyPromise.reject('第三个失败')
  ]).then(value => {
    console.log('any 结果:', value);
  });
  
  // 测试 12: 异步测试
  console.log('\n测试 12: 异步测试');
  function asyncTask(time, value, shouldReject = false) {
    return new MyPromise((resolve, reject) => {
      setTimeout(() => {
        if (shouldReject) {
          reject(value);
        } else {
          resolve(value);
        }
      }, time);
    });
  }
  
  asyncTask(100, '任务 1').then(value => {
    console.log('异步任务 1 完成:', value);
    return asyncTask(150, '任务 2');
  }).then(value => {
    console.log('异步任务 2 完成:', value);
    return asyncTask(200, '任务 3');
  }).then(value => {
    console.log('异步任务 3 完成:', value);
  });
}

// 运行测试
testPromise();
