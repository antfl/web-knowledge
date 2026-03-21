# JavaScript 深拷贝与浅拷贝

## 目录

1. [什么是拷贝](#什么是拷贝)
2. [浅拷贝详解](#浅拷贝详解)
3. [深拷贝详解](#深拷贝详解)
4. [深拷贝实现方法](#深拷贝实现方法)
5. [处理循环引用](#处理循环引用)
6. [处理特殊类型](#处理特殊类型)
7. [性能对比](#性能对比)
8. [实际应用场景](#实际应用场景)
9. [最佳实践](#最佳实践)
10. [常见问题](#常见问题)

---

## 什么是拷贝

### 基本概念

拷贝是指创建一个对象的副本。在 JavaScript 中，根据复制程度的不同，分为**浅拷贝**和**深拷贝**。

### 为什么需要拷贝

```javascript
const original = { name: '张三', age: 25 };
const copy = original;

copy.name = '李四';
console.log(original.name); // 输出：李四

// 问题：copy 和 original 指向同一个对象，修改 copy 会影响 original
```

### JavaScript 的数据类型

JavaScript 的数据类型分为：
- **基本类型**：String、Number、Boolean、Null、Undefined、Symbol、BigInt
- **引用类型**：Object、Array、Function、Date、RegExp、Map、Set 等

**基本类型**是按值传递的，拷贝时会创建新的副本。
**引用类型**是按引用传递的，拷贝时只是复制了引用地址。

---

## 浅拷贝详解

### 什么是浅拷贝

浅拷贝只复制对象的第一层属性，如果属性值是引用类型，则复制的是引用地址。

### 浅拷贝的特点

```
原始对象: { name: '张三', hobbies: ['读书', '运动'] }
                    ↓ 浅拷贝
拷贝对象: { name: '张三', hobbies: ['读书', '运动'] }
                    ↓
              hobbies 指向同一个数组
```

### 浅拷贝的实现方法

#### 1. Object.assign()

```javascript
const original = {
  name: '张三',
  age: 25,
  hobbies: ['读书', '运动']
};

const shallowCopy = Object.assign({}, original);

// 修改原始对象的引用类型属性
original.hobbies.push('旅游');

console.log(original.hobbies); // ['读书', '运动', '旅游']
console.log(shallowCopy.hobbies); // ['读书', '运动', '旅游']
console.log(original.hobbies === shallowCopy.hobbies); // true
```

#### 2. 展开运算符 (...)

```javascript
const original = {
  name: '李四',
  age: 30,
  address: { city: '北京' }
};

const shallowCopy = { ...original };

original.address.city = '上海';

console.log(original.address.city); // '上海'
console.log(shallowCopy.address.city); // '上海'
console.log(original.address === shallowCopy.address); // true
```

#### 3. Array.slice()（仅适用于数组）

```javascript
const originalArray = [1, 2, { name: 'test' }];
const shallowCopy = originalArray.slice();

originalArray[2].name = 'modified';

console.log(originalArray[2].name); // 'modified'
console.log(shallowCopy[2].name); // 'modified'
```

#### 4. Array.concat()（仅适用于数组）

```javascript
const originalArray = [1, 2, { name: 'test' }];
const shallowCopy = originalArray.concat();

originalArray[2].name = 'modified';

console.log(shallowCopy[2].name); // 'modified'
```

### 浅拷贝的局限性

```javascript
const original = {
  name: '王五',
  address: {
    city: '北京',
    district: '朝阳区'
  }
};

const shallowCopy = { ...original };

// 修改嵌套对象
original.address.city = '上海';

console.log(shallowCopy.address.city); // '上海'（被修改了）
```

---

## 深拷贝详解

### 什么是深拷贝

深拷贝会递归复制对象的所有层级，创建一个完全独立的副本，修改拷贝对象不会影响原始对象。

### 深拷贝的特点

```
原始对象: { name: '张三', address: { city: '北京' } }
                    ↓ 深拷贝
拷贝对象: { name: '张三', address: { city: '北京' } }
                    ↓
              address 是完全独立的对象
```

### 深拷贝 vs 浅拷贝

```javascript
const original = {
  name: '张三',
  hobbies: ['读书', '运动']
};

// 浅拷贝
const shallowCopy = { ...original };
shallowCopy.hobbies.push('旅游');
console.log(original.hobbies); // ['读书', '运动', '旅游']（被修改）

// 深拷贝
const deepCopy = JSON.parse(JSON.stringify(original));
deepCopy.hobbies.push('旅游');
console.log(original.hobbies); // ['读书', '运动']（未被修改）
```

---

## 深拷贝实现方法

### 方法 1：JSON.parse(JSON.stringify())

#### 基本用法

```javascript
const original = {
  name: '张三',
  age: 25,
  hobbies: ['读书', '运动']
};

const deepCopy = JSON.parse(JSON.stringify(original));

original.hobbies.push('旅游');

console.log(original.hobbies); // ['读书', '运动', '旅游']
console.log(deepCopy.hobbies); // ['读书', '运动']
```

#### 局限性

```javascript
const obj = {
  name: '测试',
  date: new Date(),
  regex: /test/,
  func: function() { return 'hello'; },
  undefined: undefined,
  symbol: Symbol('test'),
  NaN: NaN,
  Infinity: Infinity
};

const copy = JSON.parse(JSON.stringify(obj));

console.log(typeof copy.date); // 'string'（Date 变成字符串）
console.log(copy.func); // undefined（Function 丢失）
console.log(copy.undefined); // undefined（undefined 丢失）
console.log(copy.symbol); // undefined（Symbol 丢失）
console.log(copy.NaN); // null（NaN 变成 null）
console.log(copy.Infinity); // null（Infinity 变成 null）
```

#### 不支持循环引用

```javascript
const obj = { name: '测试' };
obj.self = obj;

try {
  const copy = JSON.parse(JSON.stringify(obj));
} catch (error) {
  console.error('循环引用错误:', error.message);
  // TypeError: Converting circular structure to JSON
}
```

### 方法 2：递归实现（基础版）

```javascript
function deepCloneBasic(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const result = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepCloneBasic(obj[key]);
    }
  }

  return result;
}

const original = {
  name: '李四',
  address: { city: '北京' }
};

const copy = deepCloneBasic(original);
original.address.city = '上海';

console.log(copy.address.city); // '北京'（未被修改）
```

### 方法 3：递归实现（完整版）

```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  if (obj instanceof Map) {
    const result = new Map();
    obj.forEach((value, key) => {
      result.set(deepClone(key, hash), deepClone(value, hash));
    });
    return result;
  }

  if (obj instanceof Set) {
    const result = new Set();
    obj.forEach(value => {
      result.add(deepClone(value, hash));
    });
    return result;
  }

  if (hash.has(obj)) {
    return hash.get(obj);
  }

  const result = Array.isArray(obj) ? [] : {};
  hash.set(obj, result);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key], hash);
    }
  }

  return result;
}
```

### 方法 4：structuredClone API

```javascript
const obj = {
  name: '测试',
  date: new Date(),
  regex: /test/,
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3])
};

const copy = structuredClone(obj);

console.log(copy.date instanceof Date); // true
console.log(copy.regex instanceof RegExp); // true
console.log(copy.map instanceof Map); // true
console.log(copy.set instanceof Set); // true
```

#### 局限性

```javascript
const obj = {
  func: function() { return 'hello'; },
  symbol: Symbol('test')
};

try {
  const copy = structuredClone(obj);
} catch (error) {
  console.error('不支持的对象:', error.message);
  // DOMException: function() { return 'hello'; } could not be cloned
}
```

### 方法 5：MessageChannel

```javascript
function deepCloneByMessage(obj) {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port2.onmessage = (e) => {
      resolve(e.data);
    };
    channel.port1.postMessage(obj);
  });
}

const obj = { name: '测试', data: { value: '数据' } };

deepCloneByMessage(obj).then(cloned => {
  console.log(cloned);
});
```

---

## 处理循环引用

### 什么是循环引用

```javascript
const objA = { name: '对象 A' };
const objB = { name: '对象 B' };
objA.ref = objB;
objB.ref = objA;

console.log(objA.ref.ref.ref === objA); // true
```

### 使用 WeakMap 处理循环引用

```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (hash.has(obj)) {
    return hash.get(obj);
  }

  const result = Array.isArray(obj) ? [] : {};
  hash.set(obj, result);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key], hash);
    }
  }

  return result;
}

const objA = { name: '对象 A' };
const objB = { name: '对象 B' };
objA.ref = objB;
objB.ref = objA;

const copy = deepClone(objA);
console.log(copy.ref.ref.ref === copy); // true
```

---

## 处理特殊类型

### Date 对象

```javascript
function deepClone(obj) {
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  // ... 其他逻辑
}

const original = { date: new Date('2024-01-01') };
const copy = deepClone(original);

console.log(copy.date instanceof Date); // true
console.log(copy.date.getTime() === original.date.getTime()); // true
```

### RegExp 对象

```javascript
function deepClone(obj) {
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  // ... 其他逻辑
}

const original = { regex: /test/gi };
const copy = deepClone(original);

console.log(copy.regex instanceof RegExp); // true
console.log(copy.regex.source === original.regex.source); // true
```

### Map 对象

```javascript
function deepClone(obj) {
  if (obj instanceof Map) {
    const result = new Map();
    obj.forEach((value, key) => {
      result.set(deepClone(key), deepClone(value));
    });
    return result;
  }
  // ... 其他逻辑
}

const original = { map: new Map([['key', 'value']]) };
const copy = deepClone(original);

console.log(copy.map instanceof Map); // true
console.log(copy.map.get('key')); // 'value'
```

### Set 对象

```javascript
function deepClone(obj) {
  if (obj instanceof Set) {
    const result = new Set();
    obj.forEach(value => {
      result.add(deepClone(value));
    });
    return result;
  }
  // ... 其他逻辑
}

const original = { set: new Set([1, 2, 3]) };
const copy = deepClone(original);

console.log(copy.set instanceof Set); // true
console.log(copy.set.has(2)); // true
```

---

## 性能对比

### 测试代码

```javascript
const largeObj = {};
for (let i = 0; i < 10000; i++) {
  largeObj[`key${i}`] = { value: i, nested: { data: `data${i}` } };
}

// 测试 1：自定义深拷贝
const start1 = performance.now();
const clone1 = deepClone(largeObj);
const end1 = performance.now();
console.log(`自定义深拷贝: ${(end1 - start1).toFixed(2)}ms`);

// 测试 2：JSON 方法
const start2 = performance.now();
const clone2 = JSON.parse(JSON.stringify(largeObj));
const end2 = performance.now();
console.log(`JSON 方法: ${(end2 - start2).toFixed(2)}ms`);

// 测试 3：structuredClone
const start3 = performance.now();
const clone3 = structuredClone(largeObj);
const end3 = performance.now();
console.log(`structuredClone: ${(end3 - start3).toFixed(2)}ms`);
```

### 性能对比结果

| 方法 | 性能 | 功能 | 兼容性 |
|------|------|------|--------|
| JSON.parse/stringify | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 自定义深拷贝 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| structuredClone | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 实际应用场景

### 场景 1：状态管理（Redux/Vuex）

```javascript
const initialState = {
  user: { name: '用户', age: 20 },
  todos: [{ id: 1, text: '学习' }]
};

function updateState(state, updates) {
  return deepClone({ ...state, ...updates });
}

const newState = updateState(initialState, {
  todos: [...initialState.todos, { id: 2, text: '工作' }]
});

console.log(initialState.todos !== newState.todos); // true
```

### 场景 2：表单数据重置

```javascript
const formDataTemplate = {
  username: '',
  email: '',
  preferences: {
    theme: 'light',
    notifications: true
  }
};

function resetFormData() {
  return deepClone(formDataTemplate);
}

const filledForm = { ...formDataTemplate, username: 'testuser' };
const resetForm = resetFormData();

console.log(resetForm.username === ''); // true
```

### 场景 3：撤销/重做功能

```javascript
const historyStack = [];
let currentState = { value: 1 };

function saveState() {
  historyStack.push(deepClone(currentState));
}

function undo() {
  if (historyStack.length > 0) {
    currentState = historyStack.pop();
  }
  return currentState;
}

saveState();
currentState = { value: 2 };
saveState();
currentState = { value: 3 };

console.log(undo()); // { value: 2 }
console.log(undo()); // { value: 1 }
```

### 场景 4：数据隔离

```javascript
const defaultConfig = {
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000
  },
  ui: {
    theme: 'light',
    language: 'zh-CN'
  }
};

function createConfig(overrides) {
  return deepClone(defaultConfig);
}

const userConfig = createConfig();
userConfig.api.baseUrl = 'https://custom.api.com';

console.log(defaultConfig.api.baseUrl); // 'https://api.example.com'
console.log(userConfig.api.baseUrl); // 'https://custom.api.com'
```

---

## 最佳实践

### 1. 选择合适的拷贝方法

```javascript
// 简单对象，无特殊类型：使用 JSON 方法
const simpleObj = { name: '张三', age: 25 };
const copy = JSON.parse(JSON.stringify(simpleObj));

// 包含特殊类型：使用 structuredClone
const complexObj = { date: new Date(), regex: /test/ };
const copy = structuredClone(complexObj);

// 需要处理循环引用或函数：使用自定义深拷贝
const cyclicObj = { name: '测试' };
cyclicObj.self = cyclicObj;
const copy = deepClone(cyclicObj);
```

### 2. 避免不必要的深拷贝

```javascript
// ❌ 不好的做法：每次都深拷贝
function updateData(data) {
  const copy = deepClone(data);
  copy.value = 10;
  return copy;
}

// ✅ 好的做法：只在需要时深拷贝
function updateData(data) {
  if (data.value !== 10) {
    const copy = deepClone(data);
    copy.value = 10;
    return copy;
  }
  return data;
}
```

### 3. 使用不可变数据结构

```javascript
// 使用 immer 库简化深拷贝
import { produce } from 'immer';

const state = {
  users: [{ name: '张三', age: 25 }]
};

const nextState = produce(state, draft => {
  draft.users[0].age = 26;
});

console.log(state.users[0].age); // 25
console.log(nextState.users[0].age); // 26
```

### 4. 性能优化

```javascript
// 对于大型对象，考虑使用浅拷贝 + 手动处理
function updateLargeObject(obj, updates) {
  const copy = { ...obj };
  for (const key in updates) {
    if (typeof updates[key] === 'object' && updates[key] !== null) {
      copy[key] = deepClone(updates[key]);
    } else {
      copy[key] = updates[key];
    }
  }
  return copy;
}
```

---

## 常见问题

### Q1：什么时候使用浅拷贝，什么时候使用深拷贝？

**A**：
- **浅拷贝**：当对象只有一层，或者不需要完全独立时
- **深拷贝**：当对象有多层嵌套，需要完全独立的副本时

### Q2：JSON.parse(JSON.stringify()) 为什么会丢失某些属性？

**A**：
- JSON 只支持基本数据类型和对象/数组
- 不支持 Function、undefined、Symbol、Date、RegExp 等
- 不支持循环引用

### Q3：WeakMap 和 Map 有什么区别？

**A**：
- **WeakMap**：键必须是对象，弱引用，垃圾回收友好
- **Map**：键可以是任意类型，强引用
- 处理循环引用时使用 WeakMap 可以避免内存泄漏

### Q4：structuredClone 的兼容性如何？

**A**：
- 现代浏览器（Chrome 98+、Firefox 94+、Safari 15.4+）都支持
- Node.js 17+ 支持
- 旧浏览器需要 polyfill

### Q5：如何判断两个对象是否相等？

**A**：
```javascript
function deepEqual(a, b) {
  if (a === b) return true;
  
  if (typeof a !== 'object' || a === null || 
      typeof b !== 'object' || b === null) {
    return false;
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }
  
  return true;
}
```

---

## 总结

### 核心要点

1. **浅拷贝**：
   - 只复制第一层属性
   - 引用类型属性共享内存
   - 方法：Object.assign()、展开运算符、Array.slice()

2. **深拷贝**：
   - 递归复制所有层级
   - 完全独立的副本
   - 方法：JSON.parse/stringify、structuredClone、自定义实现

3. **深拷贝实现要点**：
   - 处理基本类型
   - 处理数组和对象
   - 处理特殊类型（Date、RegExp、Map、Set）
   - 处理循环引用（使用 WeakMap）

4. **方法选择**：
   - JSON 方法：简单快速，但有局限性
   - structuredClone：现代浏览器推荐
   - 自定义实现：功能最全，最灵活

5. **应用场景**：
   - 状态管理
   - 表单重置
   - 撤销/重做
   - 数据隔离

### 记忆口诀

```
浅拷贝只复制表面，
深拷贝递归到深层。
JSON 方法简单快，
特殊类型要小心。
循环引用 WeakMap，
性能优化要考虑。
```

掌握深拷贝与浅拷贝，是 JavaScript 开发中的必备技能！