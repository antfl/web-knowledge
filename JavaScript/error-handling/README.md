# JavaScript 错误处理

错误处理是确保程序在遇到错误时能够优雅地处理，提供良好的错误处理是编写健壮代码的关键。

## 错误类型

### 内置错误类型

JavaScript 内置了多种错误类型：

- **Error** - 所有错误的基类
- **SyntaxError** - 语法错误
- **ReferenceError** - 引用错误（引用未定义的变量
- **TypeError** - 类型错误
- **RangeError** - 范围错误
- **URIError** - URI 相关错误
- **EvalError** - eval() 函数错误

## try...catch...finally

### 基本语法

```javascript
try {
  // 可能抛出错误的代码
} catch (error) {
  // 处理错误
} finally {
  // 无论是否出错都会执行
}
```

### 只使用 try-catch

```javascript
try {
  const result = someFunction();
} catch (error) {
  console.error('发生错误:', error.message);
}
```

### 使用 finally

```javascript
try {
  openFile();
} catch (error) {
  console.error('打开文件失败:', error);
} finally {
  closeFile();
}
```

## 抛出错误

### throw 语句

```javascript
throw new Error('这是一个错误');
throw new SyntaxError('语法错误');
throw new ReferenceError('引用错误');
```

### 抛出自定义错误

```javascript
class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomError';
  }
}

throw new CustomError('自定义错误');
```

## 错误对象属性

```javascript
try {
  throw new Error('测试错误');
} catch (error) {
  console.log(error.name);        // 错误名称
  console.log(error.message);     // 错误消息
  console.log(error.stack);       // 错误堆栈
}
```

## 异步错误处理

### Promise 错误处理

```javascript
fetch('https://api.example.com')
  .then(response => response.json())
  .catch(error => {
    console.error('请求失败:', error);
  });
```

### async/await 错误处理

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}
```

## 错误处理最佳实践

### 1. 不要捕获所有错误

```javascript
try {
  riskyOperation();
} catch (error) {
  if (error instanceof NetworkError) {
    handleNetworkError(error);
  } else {
    throw error;
  }
}
```

### 2. 提供有意义的错误信息

```javascript
throw new Error(`无法找到用户 ID: ${userId}');
```

### 3. 记录错误

```javascript
try {
  operation();
} catch (error) {
  logger.error(error);
  throw error;
}
```

### 4. 验证输入

```javascript
function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('参数必须是数字');
  }
  if (b === 0) {
    throw new RangeError('除数不能为零');
  }
  return a / b;
}
```

## 全局错误处理

### window.onerror

```javascript
window.onerror = function(message, source, lineno, colno, error) {
  console.error('全局错误:', message);
  return true;
};
```

### unhandledrejection

```javascript
window.addEventListener('unhandledrejection', function(event) {
  console.error('未处理的 Promise 拒绝:', event.reason);
});
```

## 错误恢复

```javascript
function safeParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('JSON 解析失败，返回 null');
    return null;
  }
}
```

## 学习建议

1. 理解不同类型的错误
2. 合理使用 try-catch
3. 提供有意义的错误信息
4. 不要吞掉所有错误
5. 记录错误以便调试
6. 学习异步错误处理
7. 使用自定义错误
