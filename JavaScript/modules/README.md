
# JavaScript 模块系统

模块系统是 JavaScript 中用于组织和管理代码的重要机制。JavaScript 提供了多种模块化方案。

## CommonJS

CommonJS 是 Node.js 早期使用的模块系统。

### 导出

```javascript
const math = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

module.exports = math;
```

### 导入

```javascript
const math = require('./math.js');
console.log(math.add(1, 2));
```

## ES Modules

ES Modules 是 JavaScript 官方标准的模块系统，在浏览器和 Node.js 中都支持。

### 命名导出

```javascript
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

### 默认导出

```javascript
const math = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

export default math;
```

### 命名导入

```javascript
import { add, subtract } from './math.js';
console.log(add(1, 2));
```

### 默认导入

```javascript
import math from './math.js';
console.log(math.add(1, 2));
```

### 混合导入

```javascript
import math, { add, subtract } from './math.js';
```

### 重命名导入

```javascript
import { add as sum, subtract as diff } from './math.js';
```

### 导入整个模块

```javascript
import * as math from './math.js';
console.log(math.add(1, 2));
```

## 动态导入

动态导入可以在运行时按需加载模块。

```javascript
async function loadModule() {
  const module = await import('./math.js');
  console.log(module.add(1, 2));
}
```

## UMD

UMD（Universal Module Definition）是一种兼容多种模块系统的格式。

```javascript
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports === 'object') {
    factory(exports);
  } else {
    root.myModule = factory({});
  }
}(this, function(exports) {
  exports.add = (a, b) => a + b;
  exports.subtract = (a, b) => a - b;
}));
```

## 模块加载器

### Browserify

Browserify 可以让浏览器支持 CommonJS 模块。

```bash
browserify main.js -o bundle.js
```

### Webpack

Webpack 是一个模块打包器，支持多种模块系统。

```javascript
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

### Rollup

Rollup 专注于 ES Modules，支持 Tree Shaking。

```javascript
export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'esm'
  }
};
```

### Vite

Vite 是新一代的构建工具，基于 ES Modules。

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000
  }
});
```

## 最佳实践

### 1. 使用 ES Modules

优先使用 ES Modules 作为标准的模块系统。

### 2. 保持模块小而专注

每个模块应该只负责一个功能。

### 3. 明确的导出和导入

使用明确的命名导出，避免默认导出的滥用。

### 4. 避免循环依赖

重构代码以避免模块之间的循环依赖。

### 5. 使用 Tree Shaking

使用支持 Tree Shaking 的工具来消除未使用的代码。

## 学习建议

1. 理解 CommonJS 和 ES Modules 的区别
2. 熟练使用 ES Modules 的导入导出语法
3. 学习动态导入的使用场景
4. 了解模块打包工具的使用
5. 实践模块化开发的最佳实践
