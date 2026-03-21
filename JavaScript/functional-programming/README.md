
# JavaScript 函数式编程

函数式编程是一种编程范式，它将计算视为数学函数的求值，并避免改变状态和可变数据。

## 核心概念

### 1. 纯函数 (Pure Functions)

纯函数是指相同的输入总是返回相同的输出，并且没有任何副作用的函数。

```javascript
// 纯函数示例
function add(a, b) {
  return a + b;
}

// 非纯函数示例（有副作用）
let count = 0;
function increment() {
  count++;
  return count;
}
```

### 2. 不可变性 (Immutability)

不可变性意味着数据一旦创建就不能被修改。

```javascript
// 可变方式
const arr = [1, 2, 3];
arr.push(4); // 修改了原数组

// 不可变方式
const arr = [1, 2, 3];
const newArr = [...arr, 4]; // 创建新数组
```

### 3. 函数是一等公民 (First-Class Functions)

函数可以作为参数传递、作为返回值返回、赋值给变量。

```javascript
// 函数赋值给变量
const greet = function(name) {
  return 'Hello, ' + name;
};

// 函数作为参数
function apply(fn, value) {
  return fn(value);
}

// 函数作为返回值
function createMultiplier(multiplier) {
  return function(x) {
    return x * multiplier;
  };
}
```

### 4. 高阶函数 (Higher-Order Functions)

接受函数作为参数或返回函数的函数。

```javascript
// map - 数组映射
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2);

// filter - 数组过滤
const even = numbers.filter(x => x % 2 === 0);

// reduce - 数组归约
const sum = numbers.reduce((acc, x) => acc + x, 0);
```

### 5. 闭包 (Closures)

函数能够记住并访问其词法作用域，即使函数在其词法作用域之外执行。

```javascript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
```

### 6. 柯里化 (Currying)

将一个多参数函数转换为一系列单参数函数的过程。

```javascript
// 普通函数
function add(a, b) {
  return a + b;
}

// 柯里化函数
function curriedAdd(a) {
  return function(b) {
    return a + b;
  };
}

const add5 = curriedAdd(5);
add5(3); // 8
```

### 7. 函数组合 (Function Composition)

将多个函数组合成一个新函数。

```javascript
function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

function double(x) { return x * 2; }
function increment(x) { return x + 1; }

const doubleThenIncrement = compose(increment, double);
doubleThenIncrement(5); // 11
```

## 常用的函数式编程工具

### 数组方法

- `map` - 转换数组
- `filter` - 过滤数组
- `reduce` - 归约数组
- `forEach` - 遍历数组
- `some` - 检查是否有元素满足条件
- `every` - 检查是否所有元素都满足条件
- `find` - 查找第一个满足条件的元素
- `findIndex` - 查找第一个满足条件的元素索引

### 函数式编程库

- **Lodash/fp** - Lodash 的函数式编程版本
- **Ramda** - 实用的函数式编程工具库
- **Immer** - 处理不可变数据的库

## 函数式编程的优势

1. **可预测性** - 纯函数使代码更易预测
2. **可测试性** - 纯函数更容易测试
3. **可组合性** - 函数可以灵活组合
4. **并行处理** - 不可变数据更适合并行处理
5. **更少的 bug** - 避免状态变化减少副作用

## 学习建议

1. 理解纯函数和不可变性
2. 熟练使用数组的 map、filter、reduce
3. 学习闭包和高阶函数
4. 练习柯里化和函数组合
5. 尝试使用函数式编程库
