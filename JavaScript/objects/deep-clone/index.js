/**
 * ============================================
 * JavaScript 深拷贝与浅拷贝实现与演示
 * ============================================
 * 
 * 深拷贝和浅拷贝是 JavaScript 中处理对象复制的重要概念，
 * 理解它们的区别对于避免引用类型带来的问题至关重要。
 */

// ============================================
// 第一部分：浅拷贝演示
// ============================================

console.log('========== 浅拷贝演示 ==========');

const original = {
  name: '张三',
  age: 25,
  hobbies: ['读书', '运动']
};

console.log('原始对象:', original);

// 方法 1：使用 Object.assign()
const shallowCopy1 = Object.assign({}, original);
console.log('Object.assign 浅拷贝:', shallowCopy1);

// 修改原始对象的引用类型属性
original.hobbies.push('旅游');
console.log('修改后原始对象:', original);
console.log('修改后浅拷贝对象:', shallowCopy1);
console.log('浅拷贝的引用类型属性被修改:', shallowCopy1.hobbies === original.hobbies);

// 方法 2：使用展开运算符
const shallowCopy2 = { ...original };
console.log('\n展开运算符浅拷贝:', shallowCopy2);

// 方法 3：使用 Array.slice()（仅适用于数组）
const originalArray = [1, 2, { name: 'test' }];
const shallowCopy3 = originalArray.slice();
console.log('\n数组 slice 浅拷贝:', shallowCopy3);

originalArray[2].name = 'modified';
console.log('修改后原始数组:', originalArray);
console.log('修改后浅拷贝数组:', shallowCopy3);


// ============================================
// 第二部分：基础深拷贝实现
// ============================================

console.log('\n========== 基础深拷贝实现 ==========');

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

const originalObj = {
  name: '李四',
  age: 30,
  address: {
    city: '北京',
    district: '朝阳区'
  },
  hobbies: ['编程', '阅读']
};

const deepCopy = deepCloneBasic(originalObj);
console.log('原始对象:', originalObj);
console.log('深拷贝对象:', deepCopy);

originalObj.address.city = '上海';
originalObj.hobbies.push('旅游');
console.log('\n修改后原始对象:', originalObj);
console.log('修改后深拷贝对象:', deepCopy);
console.log('深拷贝对象未被修改:', deepCopy.address.city === '北京');


// ============================================
// 第三部分：完整深拷贝实现（处理各种类型）
// ============================================

console.log('\n========== 完整深拷贝实现 ==========');

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

const complexObj = {
  name: '王五',
  date: new Date(),
  regex: /test/g,
  map: new Map([['key1', 'value1']]),
  set: new Set([1, 2, 3]),
  nested: {
    deep: {
      value: '深层对象'
    }
  }
};

const complexCopy = deepClone(complexObj);
console.log('复杂对象:', complexObj);
console.log('复杂对象深拷贝:', complexCopy);
console.log('Date 对象是否相等:', complexCopy.date.getTime() === complexObj.date.getTime());
console.log('RegExp 对象是否相等:', complexCopy.regex.source === complexObj.regex.source);


// ============================================
// 第四部分：处理循环引用
// ============================================

console.log('\n========== 循环引用处理 ==========');

const objA = { name: '对象 A' };
const objB = { name: '对象 B' };
objA.ref = objB;
objB.ref = objA;

console.log('循环引用对象:', objA);

const cyclicCopy = deepClone(objA);
console.log('循环引用深拷贝:', cyclicCopy);
console.log('循环引用是否保持:', cyclicCopy.ref.ref === cyclicCopy);


// ============================================
// 第五部分：使用 JSON 方法（局限性）
// ============================================

console.log('\n========== JSON 方法深拷贝（局限性） ==========');

const objForJSON = {
  name: '赵六',
  age: 28,
  hobbies: ['游泳', '跑步']
};

const jsonCopy = JSON.parse(JSON.stringify(objForJSON));
console.log('JSON 方法深拷贝:', jsonCopy);

// JSON 方法的局限性
const objWithSpecialTypes = {
  name: '测试',
  date: new Date(),
  regex: /test/,
  func: function() { return 'hello'; },
  undefined: undefined,
  symbol: Symbol('test'),
  NaN: NaN,
  Infinity: Infinity
};

console.log('\n包含特殊类型的对象:', objWithSpecialTypes);
const jsonCopySpecial = JSON.parse(JSON.stringify(objWithSpecialTypes));
console.log('JSON 方法拷贝后:', jsonCopySpecial);
console.log('Date 变成字符串:', typeof jsonCopySpecial.date);
console.log('Function 丢失:', jsonCopySpecial.func === undefined);
console.log('undefined 丢失:', jsonCopySpecial.undefined === undefined);
console.log('Symbol 丢失:', jsonCopySpecial.symbol === undefined);


// ============================================
// 第六部分：使用 structuredClone API
// ============================================

console.log('\n========== structuredClone API ==========');

const objForStructuredClone = {
  name: '孙七',
  date: new Date(),
  regex: /test/,
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3])
};

try {
  const structuredCloneCopy = structuredClone(objForStructuredClone);
  console.log('structuredClone 拷贝:', structuredCloneCopy);
  console.log('Date 保持:', structuredCloneCopy.date instanceof Date);
  console.log('RegExp 保持:', structuredCloneCopy.regex instanceof RegExp);
  console.log('Map 保持:', structuredCloneCopy.map instanceof Map);
  console.log('Set 保持:', structuredCloneCopy.set instanceof Set);
} catch (error) {
  console.log('structuredClone 不支持:', error.message);
}


// ============================================
// 第七部分：使用 MessageChannel 实现深拷贝
// ============================================

console.log('\n========== MessageChannel 深拷贝 ==========');

function deepCloneByMessage(obj) {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port2.onmessage = (e) => {
      resolve(e.data);
    };
    channel.port1.postMessage(obj);
  });
}

const objForMessage = {
  name: '周八',
  data: { value: '测试数据' }
};

deepCloneByMessage(objForMessage).then(cloned => {
  console.log('MessageChannel 深拷贝:', cloned);
  console.log('对象相等:', JSON.stringify(cloned) === JSON.stringify(objForMessage));
});


// ============================================
// 第八部分：性能对比
// ============================================

console.log('\n========== 性能对比 ==========');

const largeObj = {};
for (let i = 0; i < 10000; i++) {
  largeObj[`key${i}`] = { value: i, nested: { data: `data${i}` } };
}

console.log('开始性能测试...');

const start1 = performance.now();
const clone1 = deepClone(largeObj);
const end1 = performance.now();
console.log(`自定义深拷贝耗时: ${(end1 - start1).toFixed(2)}ms`);

const start2 = performance.now();
const clone2 = JSON.parse(JSON.stringify(largeObj));
const end2 = performance.now();
console.log(`JSON 方法耗时: ${(end2 - start2).toFixed(2)}ms`);

try {
  const start3 = performance.now();
  const clone3 = structuredClone(largeObj);
  const end3 = performance.now();
  console.log(`structuredClone 耗时: ${(end3 - start3).toFixed(2)}ms`);
} catch (error) {
  console.log('structuredClone 测试失败');
}


// ============================================
// 第九部分：实际应用场景
// ============================================

console.log('\n========== 实际应用场景 ==========');

// 场景 1：状态管理（如 Redux）
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

console.log('原始状态:', initialState);
console.log('新状态:', newState);
console.log('状态独立:', initialState.todos !== newState.todos);

// 场景 2：表单数据重置
const formData = {
  username: '',
  email: '',
  preferences: {
    theme: 'light',
    notifications: true
  }
};

const formDataTemplate = deepClone(formData);

function resetFormData() {
  return deepClone(formDataTemplate);
}

const filledForm = { ...formData, username: 'testuser' };
const resetForm = resetFormData();
console.log('\n填充的表单:', filledForm);
console.log('重置的表单:', resetForm);
console.log('表单已重置:', resetForm.username === '');

// 场景 3：撤销/重做功能
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

console.log('\n当前状态:', currentState);
console.log('撤销:', undo());
console.log('撤销:', undo());


// ============================================
// 第十部分：工具函数集合
// ============================================

console.log('\n========== 工具函数集合 ==========');

/**
 * 浅拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 浅拷贝的对象
 */
function shallowClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  return Array.isArray(obj) ? [...obj] : { ...obj };
}

/**
 * 深拷贝对象（推荐版本）
 * @param {*} obj - 要拷贝的值
 * @param {WeakMap} hash - 用于处理循环引用
 * @returns {*} 深拷贝的值
 */
function clone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map) {
    const result = new Map();
    obj.forEach((value, key) => {
      result.set(clone(key, hash), clone(value, hash));
    });
    return result;
  }
  if (obj instanceof Set) {
    const result = new Set();
    obj.forEach(value => result.add(clone(value, hash)));
    return result;
  }

  if (hash.has(obj)) return hash.get(obj);

  const result = Array.isArray(obj) ? [] : {};
  hash.set(obj, result);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = clone(obj[key], hash);
    }
  }

  return result;
}

/**
 * 合并对象（深拷贝）
 * @param {Object} target - 目标对象
 * @param {...Object} sources - 源对象
 * @returns {Object} 合并后的对象
 */
function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: clone(source[key]) });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

console.log('工具函数已定义：shallowClone, clone, deepMerge');


// ============================================
// 总结
// ============================================

console.log('\n========== 总结 ==========');
console.log(`
深拷贝与浅拷贝核心要点：

1. 浅拷贝：
   - 只复制对象的第一层属性
   - 引用类型属性仍然指向同一个内存地址
   - 方法：Object.assign()、展开运算符、Array.slice()

2. 深拷贝：
   - 递归复制对象的所有层级
   - 完全独立的副本，互不影响
   - 方法：递归实现、JSON.parse/stringify、structuredClone、MessageChannel

3. 深拷贝实现要点：
   - 处理基本类型
   - 处理数组
   - 处理对象
   - 处理特殊类型（Date、RegExp、Map、Set）
   - 处理循环引用（使用 WeakMap）

4. 各方法对比：
   - JSON 方法：简单但有局限性（无法处理函数、undefined、Symbol、循环引用）
   - structuredClone：现代浏览器支持，功能强大
   - 自定义实现：最灵活，可以处理所有情况

5. 性能考虑：
   - JSON 方法通常最快
   - 自定义实现功能最全但性能稍差
   - 根据实际需求选择合适的方法

6. 应用场景：
   - 状态管理（Redux、Vuex）
   - 表单数据重置
   - 撤销/重做功能
   - 数据隔离和备份

掌握深拷贝与浅拷贝，是 JavaScript 开发中的必备技能！
`);