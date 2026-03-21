# JavaScript 防抖与节流

## 目录

1. [什么是防抖与节流](#什么是防抖与节流)
2. [防抖详解](#防抖详解)
3. [节流详解](#节流详解)
4. [防抖 vs 节流](#防抖-vs-节流)
5. [实现方法](#实现方法)
6. [requestAnimationFrame 节流](#requestanimationframe-节流)
7. [实际应用场景](#实际应用场景)
8. [性能优化](#性能优化)
9. [最佳实践](#最佳实践)
10. [常见问题](#常见问题)

---

## 什么是防抖与节流

### 基本概念

防抖（Debounce）和节流（Throttle）都是用于控制函数执行频率的技术，用于优化性能，减少不必要的函数调用。

### 为什么需要防抖与节流

```javascript
// 没有优化的搜索框
input.addEventListener('input', (e) => {
  fetchSearchResults(e.target.value);
});

// 问题：用户输入 "javascript" 会触发 10 次请求
// 每次输入一个字符就发送一次请求，浪费资源
```

```javascript
// 使用防抖优化
input.addEventListener('input', debounce((e) => {
  fetchSearchResults(e.target.value);
}, 500));

// 优化：用户停止输入 500ms 后才发送一次请求
// 大大减少了请求次数
```

### 核心区别

```
防抖：事件触发后，等待一段时间，如果在这段时间内没有再次触发，才执行
节流：事件触发后，按照固定频率执行，不管触发多少次
```

---

## 防抖详解

### 什么是防抖

防抖是指在事件被触发后，等待一段时间，如果在这段时间内没有再次触发该事件，才执行回调函数。如果在这段时间内再次触发，则重新计时。

### 防抖的工作原理

```
时间轴: |----|----|----|----|----|----|----|
触发:   ●    ●    ●    ●    ●    ●
         ↓    ↓    ↓    ↓    ↓    ↓
计时器: 500ms 500ms 500ms 500ms 500ms
执行:                           ●
         (只在最后一次触发后执行)
```

### 防抖的实现

#### 基础版本

```javascript
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
// 只有最后一次调用会在 500ms 后执行
```

#### 立即执行版本

```javascript
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

immediateHandler('a'); // 立即执行
immediateHandler('ab'); // 不执行（在延迟时间内）
```

#### 完整版本

```javascript
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
```

### 防抖的应用场景

#### 1. 搜索框输入

```javascript
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', debounce((e) => {
  const keyword = e.target.value;
  fetch(`/api/search?q=${keyword}`)
    .then(res => res.json())
    .then(data => {
      renderResults(data);
    });
}, 500));

// 用户输入时，不会每次都发送请求
// 只有停止输入 500ms 后才发送请求
```

#### 2. 窗口 resize

```javascript
window.addEventListener('resize', debounce(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  updateLayout(width, height);
}, 300));

// 窗口调整大小时，不会频繁触发布局更新
// 只有停止调整 300ms 后才更新布局
```

#### 3. 按钮防重复点击

```javascript
const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', debounce(() => {
  submitForm();
}, 1000, true));

// 点击按钮后，1 秒内不会再次触发
// 防止用户重复提交表单
```

---

## 节流详解

### 什么是节流

节流是指按照固定的时间间隔执行函数，不管事件触发多少次，都按照固定的频率执行。

### 节流的工作原理

```
时间轴: |----|----|----|----|----|----|----|
触发:   ●    ●    ●    ●    ●    ●    ●
         ↓    ↓    ↓    ↓    ↓    ↓    ↓
执行:   ●              ●              ●
         (每 500ms 执行一次)
```

### 节流的实现

#### 时间戳版本

```javascript
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

const scrollHandler = throttleTimestamp((scrollTop) => {
  console.log('滚动位置:', scrollTop);
}, 1000);

scrollHandler(100); // 立即执行
scrollHandler(200); // 不执行
setTimeout(() => scrollHandler(300), 1100); // 执行
```

#### 定时器版本

```javascript
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

const scrollHandler = throttleTimer((scrollTop) => {
  console.log('滚动位置:', scrollTop);
}, 1000);

scrollHandler(100); // 1 秒后执行
scrollHandler(200); // 不执行
```

#### 完整版本

```javascript
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
```

### 节流的应用场景

#### 1. 滚动监听

```javascript
window.addEventListener('scroll', throttle(() => {
  const scrollTop = window.scrollY;
  updateScrollPosition(scrollTop);
  loadMoreContent();
}, 200));

// 滚动时，每 200ms 执行一次
// 不会因为滚动太快而频繁执行
```

#### 2. 鼠标移动

```javascript
document.addEventListener('mousemove', throttle((e) => {
  const { clientX, clientY } = e;
  updateCursorPosition(clientX, clientY);
}, 100));

// 鼠标移动时，每 100ms 更新一次位置
// 不会因为移动太快而频繁更新
```

#### 3. 窗口滚动加载更多

```javascript
window.addEventListener('scroll', throttle(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMoreItems();
  }
}, 300));

// 滚动到底部时，加载更多内容
// 不会因为滚动太快而重复加载
```

---

## 防抖 vs 节流

### 对比表格

| 特性 | 防抖 | 节流 |
|------|------|------|
| 执行时机 | 停止触发后执行 | 按固定频率执行 |
| 执行次数 | 最多执行一次 | 按频率执行多次 |
| 适用场景 | 搜索框、resize | 滚动、鼠标移动 |
| 性能优化 | 减少不必要的调用 | 控制调用频率 |
| 用户体验 | 等待用户操作完成 | 持续响应用户操作 |

### 可视化对比

```
防抖 (Debounce):
触发: ●    ●    ●    ●    ●    ●
时间:  |----|----|----|----|----|----|
执行:                            ●
       (只执行最后一次)

节流 (Throttle):
触发: ●    ●    ●    ●    ●    ●    ●
时间:  |----|----|----|----|----|----|
执行:  ●              ●              ●
       (按固定频率执行)
```

### 选择建议

```javascript
// 需要等待用户操作完成 → 使用防抖
searchInput.addEventListener('input', debounce(search, 500));
window.addEventListener('resize', debounce(updateLayout, 300));

// 需要持续响应用户操作 → 使用节流
window.addEventListener('scroll', throttle(handleScroll, 200));
document.addEventListener('mousemove', throttle(handleMouseMove, 100));
```

---

## 实现方法

### 防抖的多种实现

#### 1. 基础防抖

```javascript
function debounce(func, delay) {
  let timer = null;
  
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
```

#### 2. 立即执行防抖

```javascript
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
    }, delay);
  };
}
```

#### 3. 可配置防抖

```javascript
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
```

### 节流的多种实现

#### 1. 时间戳节流

```javascript
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
```

#### 2. 定时器节流

```javascript
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
```

#### 3. 完整节流

```javascript
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
```

---

## requestAnimationFrame 节流

### 什么是 requestAnimationFrame

`requestAnimationFrame` 是浏览器提供的 API，用于在下一帧之前执行回调函数，通常用于动画和视觉更新。

### RAF 节流的实现

```javascript
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

const scrollHandler = throttleRAF((scrollTop) => {
  updateScrollPosition(scrollTop);
});

window.addEventListener('scroll', scrollHandler);
```

### RAF 节流的优势

```javascript
// 与普通节流对比
const throttleNormal = throttle(func, 16); // 约 60fps
const throttleRAF = throttleRAF(func);

// RAF 节流的优势：
// 1. 与浏览器刷新率同步，更流畅
// 2. 页面不可见时自动暂停，节省资源
// 3. 适合动画和视觉更新
```

### RAF 节流的应用

```javascript
// 滚动监听
window.addEventListener('scroll', throttleRAF(() => {
  const scrollTop = window.scrollY;
  updateScrollPosition(scrollTop);
}));

// 鼠标移动
document.addEventListener('mousemove', throttleRAF((e) => {
  updateCursorPosition(e.clientX, e.clientY);
}));

// 拖拽
element.addEventListener('drag', throttleRAF((e) => {
  updateDragPosition(e.clientX, e.clientY);
}));
```

---

## 实际应用场景

### 场景 1：搜索框防抖

```javascript
const searchInput = document.getElementById('search');

const debouncedSearch = debounce(async (keyword) => {
  if (!keyword.trim()) {
    clearResults();
    return;
  }
  
  showLoading();
  
  try {
    const results = await fetchSearchResults(keyword);
    renderResults(results);
  } catch (error) {
    showError(error);
  } finally {
    hideLoading();
  }
}, 500);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// 优化效果：
// - 用户输入 "javascript" 只触发一次搜索
// - 减少了 9 次不必要的请求
// - 提升了用户体验
```

### 场景 2：滚动加载更多

```javascript
let isLoading = false;

const throttledScroll = throttle(async () => {
  if (isLoading) return;
  
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    isLoading = true;
    showLoading();
    
    try {
      const items = await loadMoreItems();
      appendItems(items);
    } catch (error) {
      showError(error);
    } finally {
      isLoading = false;
      hideLoading();
    }
  }
}, 300);

window.addEventListener('scroll', throttledScroll);

// 优化效果：
// - 滚动时不会频繁触发加载
// - 每 300ms 最多触发一次
// - 避免重复加载
```

### 场景 3：窗口 resize

```javascript
const debouncedResize = debounce(() => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  updateLayout(width, height);
  recalculatePositions();
  reloadImages();
}, 300);

window.addEventListener('resize', debouncedResize);

// 优化效果：
// - 窗口调整大小时不会频繁重新计算
// - 只在停止调整后执行一次
// - 提升了性能
```

### 场景 4：鼠标移动追踪

```javascript
const throttledMouseMove = throttle((e) => {
  const { clientX, clientY } = e;
  
  updateCursorPosition(clientX, clientY);
  updateTooltipPosition(clientX, clientY);
  checkHoverElements(clientX, clientY);
}, 100);

document.addEventListener('mousemove', throttledMouseMove);

// 优化效果：
// - 鼠标移动时不会频繁更新
// - 每 100ms 更新一次
// - 降低了 CPU 占用
```

### 场景 5：按钮防重复点击

```javascript
const submitButton = document.getElementById('submit');

const debouncedSubmit = debounce(async () => {
  try {
    await submitForm();
    showSuccess('提交成功');
  } catch (error) {
    showError(error);
  }
}, 1000, true);

submitButton.addEventListener('click', debouncedSubmit);

// 优化效果：
// - 点击按钮后 1 秒内不会再次触发
// - 防止用户重复提交
// - 提升了用户体验
```

---

## 性能优化

### 性能对比

```javascript
// 测试函数
const testFn = (value) => {
  for (let i = 0; i < 10000; i++) {
    Math.sqrt(i);
  }
};

// 无优化
const start1 = performance.now();
for (let i = 0; i < 100; i++) {
  testFn(i);
}
const end1 = performance.now();
console.log(`无优化: ${(end1 - start1).toFixed(2)}ms`);

// 防抖
const debouncedTest = debounce(testFn, 100);
const start2 = performance.now();
for (let i = 0; i < 100; i++) {
  debouncedTest(i);
}
const end2 = performance.now();
console.log(`防抖: ${(end2 - start2).toFixed(2)}ms`);

// 节流
const throttledTest = throttle(testFn, 100);
const start3 = performance.now();
for (let i = 0; i < 100; i++) {
  throttledTest(i);
}
const end3 = performance.now();
console.log(`节流: ${(end3 - start3).toFixed(2)}ms`);
```

### 性能优化建议

```javascript
// 1. 合理设置延迟时间
const searchDebounce = debounce(search, 500); // 搜索框 500ms
const scrollThrottle = throttle(handleScroll, 200); // 滚动 200ms
const resizeDebounce = debounce(handleResize, 300); // resize 300ms

// 2. 使用 RAF 节流处理动画
const animationThrottle = throttleRAF(updateAnimation);

// 3. 避免在回调中执行耗时操作
const optimizedHandler = throttle((e) => {
  requestIdleCallback(() => {
    heavyComputation(e);
  });
}, 100);

// 4. 使用事件委托
document.addEventListener('click', throttle((e) => {
  if (e.target.matches('.button')) {
    handleClick(e);
  }
}, 100));
```

---

## 最佳实践

### 1. 选择合适的延迟时间

```javascript
// 搜索框：500ms（用户输入间隔）
searchInput.addEventListener('input', debounce(search, 500));

// 滚动：200ms（平衡性能和响应）
window.addEventListener('scroll', throttle(handleScroll, 200));

// resize：300ms（布局计算）
window.addEventListener('resize', debounce(handleResize, 300));

// 鼠标移动：100ms（视觉更新）
document.addEventListener('mousemove', throttle(handleMouseMove, 100));
```

### 2. 取消防抖/节流

```javascript
// 取消防抖
function cancelDebounce(debouncedFn) {
  if (debouncedFn && debouncedFn.timer) {
    clearTimeout(debouncedFn.timer);
    debouncedFn.timer = null;
  }
}

// 取消节流
function cancelThrottle(throttledFn) {
  if (throttledFn && throttledFn.timer) {
    clearTimeout(throttledFn.timer);
    throttledFn.timer = null;
  }
}

// 使用示例
const debouncedSearch = debounce(search, 500);
searchInput.addEventListener('input', debouncedSearch);

// 组件卸载时取消
componentWillUnmount() {
  cancelDebounce(debouncedSearch);
}
```

### 3. 使用 Lodash 等库

```javascript
import { debounce, throttle } from 'lodash';

// 使用 Lodash 的防抖
const debouncedSearch = debounce(search, 500);

// 使用 Lodash 的节流
const throttledScroll = throttle(handleScroll, 200);

// Lodash 的优势：
// - 经过充分测试
// - 功能完善
// - 性能优化
```

### 4. 结合 React 使用

```javascript
import { useEffect, useCallback } from 'react';
import { debounce, throttle } from 'lodash';

function SearchComponent() {
  const handleSearch = useCallback(
    debounce((keyword) => {
      fetchSearchResults(keyword);
    }, 500),
    []
  );
  
  const handleScroll = useCallback(
    throttle(() => {
      updateScrollPosition();
    }, 200),
    []
  );
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);
  
  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

---

## 常见问题

### Q1：防抖和节流的延迟时间应该设置多少？

**A**：
- 搜索框：500ms（用户输入间隔）
- 滚动：200ms（平衡性能和响应）
- resize：300ms（布局计算）
- 鼠标移动：100ms（视觉更新）

### Q2：防抖和节流可以同时使用吗？

**A**：可以，但通常不需要同时使用。根据场景选择合适的方法即可。

### Q3：如何测试防抖和节流的效果？

**A**：
```javascript
// 测试防抖
const debouncedFn = debounce(() => {
  console.log('执行');
}, 1000);

for (let i = 0; i < 10; i++) {
  debouncedFn();
}

// 测试节流
const throttledFn = throttle(() => {
  console.log('执行');
}, 1000);

for (let i = 0; i < 10; i++) {
  throttledFn();
}
```

### Q4：requestAnimationFrame 节流和普通节流有什么区别？

**A**：
- RAF 节流：与浏览器刷新率同步，适合动画
- 普通节流：固定时间间隔，适合一般场景

### Q5：如何在 Vue 中使用防抖和节流？

**A**：
```javascript
import { debounce, throttle } from 'lodash';

export default {
  methods: {
    handleSearch: debounce(function(keyword) {
      this.fetchSearchResults(keyword);
    }, 500),
    
    handleScroll: throttle(function() {
      this.updateScrollPosition();
    }, 200)
  },
  
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    this.handleScroll.cancel();
  }
};
```

---

## 总结

### 核心要点

1. **防抖**：
   - 延迟执行，延迟时间内多次调用会重置定时器
   - 只执行最后一次调用
   - 应用场景：搜索框、resize、按钮防重复点击

2. **节流**：
   - 按固定频率执行
   - 保证函数在一定时间内至少执行一次
   - 应用场景：滚动监听、鼠标移动、窗口滚动

3. **实现方式**：
   - 防抖：使用 setTimeout
   - 节流：使用 setTimeout + 时间戳
   - RAF 节流：使用 requestAnimationFrame

4. **选择建议**：
   - 需要等待用户操作完成：使用防抖
   - 需要持续响应用户操作：使用节流
   - 动画相关：使用 RAF 节流

5. **性能优化**：
   - 减少函数调用次数
   - 降低 CPU 占用
   - 提升用户体验

### 记忆口诀

```
防抖等待再执行，
节流固定频率行。
搜索 resize 用防抖，
滚动移动用节流。
动画优先用 RAF，
性能提升看得见。
```

掌握防抖与节流，是前端性能优化的必备技能！