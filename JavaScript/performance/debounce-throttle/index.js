/**
 * ============================================
 * JavaScript 防抖与节流实现与演示
 * ============================================
 * 
 * 防抖和节流是 JavaScript 中常用的性能优化技术，
 * 用于控制函数的执行频率，提高应用性能。
 */

// ============================================
// 第一部分：防抖 (Debounce) 基础实现
// ============================================

console.log('========== 防抖基础实现 ==========');

function debounce(func, delay) {
  let timer = null;
  
  return function(...args) {
    if (timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, delay);
  };
}

const searchHandler = debounce((keyword) => {
  console.log('搜索:', keyword);
}, 500);

searchHandler('a');
searchHandler('ab');
searchHandler('abc');
searchHandler('abcd');

// 只有最后一次调用会在 500ms 后执行


// ============================================
// 第二部分：防抖 - 立即执行版本
// ============================================

console.log('\n========== 防抖 - 立即执行版本 ==========');

function debounceImmediate(func, delay) {
  let timer = null;
  let isImmediate = false;
  
  return function(...args) {
    if (timer) clearTimeout(timer);
    
    if (isImmediate) {
      isImmediate = false;
    } else {
      func.apply(this, args);
      isImmediate = true;
    }
    
    timer = setTimeout(() => {
      isImmediate = false;
      timer = null;
    }, delay);
  };
}

const immediateHandler = debounceImmediate((keyword) => {
  console.log('立即搜索:', keyword);
}, 500);

immediateHandler('a');
immediateHandler('ab');
immediateHandler('abc');

// 第一次立即执行，后续在延迟时间内不执行


// ============================================
// 第三部分：节流 (Throttle) 基础实现
// ============================================

console.log('\n========== 节流基础实现 ==========');

function throttle(func, delay) {
  let timer = null;
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);
    
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      func.apply(this, args);
      lastTime = now;
    } else if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args);
        lastTime = Date.now();
        timer = null;
      }, remaining);
    }
  };
}

const scrollHandler = throttle((scrollTop) => {
  console.log('滚动位置:', scrollTop);
}, 1000);

scrollHandler(100);
scrollHandler(200);
scrollHandler(300);
scrollHandler(400);

// 第一次立即执行，后续每隔 1000ms 执行一次


// ============================================
// 第四部分：节流 - 时间戳版本
// ============================================

console.log('\n========== 节流 - 时间戳版本 ==========');

function throttleTimestamp(func, delay) {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastTime >= delay) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}

const timestampHandler = throttleTimestamp((scrollTop) => {
  console.log('时间戳节流:', scrollTop);
}, 1000);

timestampHandler(100);
timestampHandler(200);
setTimeout(() => timestampHandler(300), 1100);


// ============================================
// 第五部分：节流 - 定时器版本
// ============================================

console.log('\n========== 节流 - 定时器版本 ==========');

function throttleTimer(func, delay) {
  let timer = null;
  
  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

const timerHandler = throttleTimer((scrollTop) => {
  console.log('定时器节流:', scrollTop);
}, 1000);

timerHandler(100);
timerHandler(200);
timerHandler(300);


// ============================================
// 第六部分：防抖 vs 节流对比演示
// ============================================

console.log('\n========== 防抖 vs 节流对比 ==========');

const debounceFn = debounce((count) => {
  console.log('防抖执行:', count);
}, 1000);

const throttleFn = throttle((count) => {
  console.log('节流执行:', count);
}, 1000);

console.log('开始快速调用...');
for (let i = 1; i <= 10; i++) {
  debounceFn(i);
  throttleFn(i);
}

console.log('等待 2 秒...');
setTimeout(() => {
  console.log('防抖只执行最后一次，节流按固定频率执行');
}, 2000);


// ============================================
// 第七部分：requestAnimationFrame 节流
// ============================================

console.log('\n========== requestAnimationFrame 节流 ==========');

function throttleRAF(func) {
  let rafId = null;
  let lastArgs = null;
  
  return function(...args) {
    lastArgs = args;
    
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, lastArgs);
        rafId = null;
        lastArgs = null;
      });
    }
  };
}

const rafHandler = throttleRAF((scrollTop) => {
  console.log('RAF 节流:', scrollTop);
});

rafHandler(100);
rafHandler(200);
rafHandler(300);


// ============================================
// 第八部分：实际应用场景 - 搜索框
// ============================================

console.log('\n========== 实际应用 - 搜索框 ==========');

const searchInput = {
  value: '',
  listeners: [],
  
  onInput(callback) {
    this.listeners.push(callback);
  },
  
  setValue(value) {
    this.value = value;
    this.listeners.forEach(fn => fn(value));
  }
};

const debouncedSearch = debounce((keyword) => {
  console.log('执行搜索请求:', keyword);
}, 500);

searchInput.onInput(debouncedSearch);

console.log('模拟用户输入...');
searchInput.setValue('j');
searchInput.setValue('ja');
searchInput.setValue('jav');
searchInput.setValue('java');
searchInput.setValue('javas');
searchInput.setValue('javasc');
searchInput.setValue('javascri');
searchInput.setValue('javascrip');
searchInput.setValue('javascript');

console.log('只有最后一次输入会触发搜索请求');


// ============================================
// 第九部分：实际应用场景 - 滚动监听
// ============================================

console.log('\n========== 实际应用 - 滚动监听 ==========');

const scrollContainer = {
  scrollTop: 0,
  listeners: [],
  
  onScroll(callback) {
    this.listeners.push(callback);
  },
  
  setScrollTop(value) {
    this.scrollTop = value;
    this.listeners.forEach(fn => fn(value));
  }
};

const throttledScroll = throttle((scrollTop) => {
  console.log('更新滚动位置:', scrollTop);
}, 1000);

scrollContainer.onScroll(throttledScroll);

console.log('模拟快速滚动...');
for (let i = 0; i <= 1000; i += 100) {
  scrollContainer.setScrollTop(i);
}

console.log('滚动事件被节流，减少性能消耗');


// ============================================
// 第十部分：实际应用场景 - 窗口 resize
// ============================================

console.log('\n========== 实际应用 - 窗口 resize ==========');

const windowResize = {
  width: window.innerWidth,
  height: window.innerHeight,
  listeners: [],
  
  onResize(callback) {
    this.listeners.push(callback);
  },
  
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.listeners.forEach(fn => fn(width, height));
  }
};

const debouncedResize = debounce((width, height) => {
  console.log('窗口大小改变:', width, 'x', height);
}, 300);

windowResize.onResize(debouncedResize);

console.log('模拟窗口调整大小...');
windowResize.resize(800, 600);
windowResize.resize(900, 700);
windowResize.resize(1000, 800);
windowResize.resize(1100, 900);

console.log('只有最后一次 resize 会触发回调');


// ============================================
// 第十一部分：工具函数集合
// ============================================

console.log('\n========== 工具函数集合 ==========');

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
function debounce(func, delay = 300, immediate = false) {
  let timer = null;
  let isImmediate = false;
  
  return function(...args) {
    const context = this;
    
    if (timer) clearTimeout(timer);
    
    if (immediate) {
      if (isImmediate) {
        isImmediate = false;
      } else {
        func.apply(context, args);
        isImmediate = true;
      }
    }
    
    timer = setTimeout(() => {
      if (immediate) {
        isImmediate = false;
      } else {
        func.apply(context, args);
      }
      timer = null;
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {Object} options - 配置选项
 * @param {boolean} options.leading - 是否在开始时执行
 * @param {boolean} options.trailing - 是否在结束时执行
 * @returns {Function} 节流后的函数
 */
function throttle(func, delay = 300, options = {}) {
  const { leading = true, trailing = true } = options;
  let timer = null;
  let lastTime = 0;
  
  return function(...args) {
    const context = this;
    const now = Date.now();
    const remaining = delay - (now - lastTime);
    
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (leading) {
        func.apply(context, args);
        lastTime = now;
      }
    } else if (!timer && trailing) {
      timer = setTimeout(() => {
        func.apply(context, args);
        lastTime = Date.now();
        timer = null;
      }, remaining);
    }
  };
}

/**
 * requestAnimationFrame 节流
 * @param {Function} func - 要节流的函数
 * @returns {Function} 节流后的函数
 */
function throttleRAF(func) {
  let rafId = null;
  let lastArgs = null;
  
  return function(...args) {
    lastArgs = args;
    
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, lastArgs);
        rafId = null;
        lastArgs = null;
      });
    }
  };
}

/**
 * 取消防抖
 * @param {Function} debouncedFn - 防抖函数
 */
function cancelDebounce(debouncedFn) {
  if (debouncedFn && debouncedFn.timer) {
    clearTimeout(debouncedFn.timer);
    debouncedFn.timer = null;
  }
}

/**
 * 取消节流
 * @param {Function} throttledFn - 节流函数
 */
function cancelThrottle(throttledFn) {
  if (throttledFn && throttledFn.timer) {
    clearTimeout(throttledFn.timer);
    throttledFn.timer = null;
  }
}

console.log('工具函数已定义：debounce, throttle, throttleRAF, cancelDebounce, cancelThrottle');


// ============================================
// 第十二部分：性能对比
// ============================================

console.log('\n========== 性能对比 ==========');

const testFn = (value) => {
  const start = performance.now();
  for (let i = 0; i < 10000; i++) {
    Math.sqrt(i);
  }
  return performance.now() - start;
};

const debouncedTest = debounce(testFn, 100);
const throttledTest = throttle(testFn, 100);

console.log('测试 100 次调用...');

const start1 = performance.now();
for (let i = 0; i < 100; i++) {
  testFn(i);
}
const end1 = performance.now();
console.log(`无优化耗时: ${(end1 - start1).toFixed(2)}ms`);

const start2 = performance.now();
for (let i = 0; i < 100; i++) {
  debouncedTest(i);
}
const end2 = performance.now();
console.log(`防抖耗时: ${(end2 - start2).toFixed(2)}ms`);

const start3 = performance.now();
for (let i = 0; i < 100; i++) {
  throttledTest(i);
}
const end3 = performance.now();
console.log(`节流耗时: ${(end3 - start3).toFixed(2)}ms`);


// ============================================
// 第十三部分：可视化演示
// ============================================

console.log('\n========== 可视化演示 ==========');

function visualizeDebounce() {
  console.log(`
┌─────────────────────────────────────────────────────────────┐
│                    防抖 (Debounce)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  调用:  ●    ●    ●    ●    ●    ●    ●                   │
│         ↓    ↓    ↓    ↓    ↓    ↓    ↓                    │
│  时间:  |----|----|----|----|----|----|----|               │
│         0    100  200  300  400  500  600  700             │
│                                                             │
│  执行:                                    ●                │
│         (只在最后一次调用后延迟执行)                          │
│                                                             │
│  特点:                                                     │
│  - 频繁触发时，只执行最后一次                               │
│  - 适合搜索框、窗口 resize 等场景                           │
│  - 延迟时间内多次调用，会重置定时器                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
  `);
}

function visualizeThrottle() {
  console.log(`
┌─────────────────────────────────────────────────────────────┐
│                    节流 (Throttle)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  调用:  ●    ●    ●    ●    ●    ●    ●                   │
│         ↓    ↓    ↓    ↓    ↓    ↓    ↓                    │
│  时间:  |----|----|----|----|----|----|----|               │
│         0    100  200  300  400  500  600  700             │
│                                                             │
│  执行:  ●              ●              ●                    │
│         (按固定频率执行，间隔 500ms)                        │
│                                                             │
│  特点:                                                     │
│  - 按固定频率执行，不会过于频繁                             │
│  - 适合滚动监听、鼠标移动等场景                             │
│  - 保证函数在一定时间内至少执行一次                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
  `);
}

visualizeDebounce();
visualizeThrottle();


// ============================================
// 总结
// ============================================

console.log('\n========== 总结 ==========');
console.log(`
防抖与节流核心要点：

1. 防抖 (Debounce)：
   - 延迟执行，延迟时间内多次调用会重置定时器
   - 只执行最后一次调用
   - 应用场景：搜索框、窗口 resize、按钮防重复点击

2. 节流 (Throttle)：
   - 按固定频率执行
   - 保证函数在一定时间内至少执行一次
   - 应用场景：滚动监听、鼠标移动、窗口滚动

3. 实现方式：
   - 防抖：使用 setTimeout
   - 节流：使用 setTimeout + 时间戳
   - RAF 节流：使用 requestAnimationFrame（适合动画）

4. 选择建议：
   - 需要等待用户操作完成：使用防抖
   - 需要持续响应：使用节流
   - 动画相关：使用 RAF 节流

5. 性能优化：
   - 减少函数调用次数
   - 降低 CPU 占用
   - 提升用户体验

掌握防抖与节流，是前端性能优化的必备技能！
`);