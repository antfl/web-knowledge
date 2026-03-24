# Vite 热更新 (HMR)

Vite 的热更新（Hot Module Replacement，HMR）是其核心特性之一，能够在不刷新整个页面的情况下更新修改的模块，显著提升开发体验。本文档详细介绍 Vite 热更新的工作原理、配置选项和最佳实践。

## 目录

1. [热更新基础](#热更新基础)
2. [工作原理](#工作原理)
3. [配置选项](#配置选项)
4. [使用方法](#使用方法)
5. [最佳实践](#最佳实践)
6. [常见问题](#常见问题)
7. [示例](#示例)

## 热更新基础

### 什么是热更新？

热更新是一种在开发过程中，当代码发生变化时，无需刷新整个页面就能更新相关模块的技术。它具有以下优点：

- **保留应用状态**：不会丢失当前页面的状态，如表单数据、滚动位置等
- **提升开发速度**：无需等待页面重新加载，立即看到修改效果
- **减少开发干扰**：保持开发流程的连贯性

### Vite 热更新的特点

Vite 的热更新具有以下特点：

- **快速响应**：基于原生 ESM，更新速度极快
- **精确更新**：只更新修改的模块，不影响其他模块
- **状态保留**：尽可能保留应用状态
- **支持多种文件类型**：JavaScript、CSS、Vue 组件等

## 工作原理

### Vite HMR 工作流程

1. **开发服务器启动**：Vite 启动开发服务器，监听文件变化
2. **文件监听**：使用 `chokidar` 监听文件系统变化
3. **模块解析**：当文件变化时，重新解析相关模块
4. **依赖分析**：分析模块的依赖关系
5. **更新计算**：计算需要更新的模块
6. **WebSocket 通信**：通过 WebSocket 向浏览器发送更新通知
7. **客户端更新**：浏览器接收更新并应用

### 核心技术

- **原生 ESM**：利用浏览器的原生 ES 模块支持，实现快速更新
- **WebSocket**：用于服务器和客户端之间的实时通信
- **模块图**：维护模块之间的依赖关系
- **热更新边界**：确定模块更新的范围

### 热更新边界

当一个模块发生变化时，Vite 会：

1. 重新编译该模块
2. 通知浏览器更新该模块
3. 如果该模块导出的内容发生变化，还会更新其依赖模块
4. 对于有副作用的模块，可能会触发整个模块的重新加载

## 配置选项

### 基本配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    hmr: true // 默认为 true
  }
})
```

### 高级配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
      path: '/ws',
      timeout: 30000,
      overlay: true,
      clientPort: undefined,
      server: false
    }
  }
})
```

### 配置选项说明

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `protocol` | `string` | `'ws'` | WebSocket 协议 |
| `host` | `string` | `'localhost'` | WebSocket 主机 |
| `port` | `number` | 开发服务器端口 | WebSocket 端口 |
| `path` | `string` | `'/ws'` | WebSocket 路径 |
| `timeout` | `number` | `30000` | 超时时间（毫秒） |
| `overlay` | `boolean` | `true` | 显示错误覆盖层 |
| `clientPort` | `number` | `undefined` | 客户端 WebSocket 端口 |
| `server` | `boolean` | `false` | 是否启用服务器端 HMR |

## 使用方法

### 基本使用

Vite 的热更新默认是启用的，无需额外配置。在开发过程中，当你修改代码时，Vite 会自动：

1. 重新编译修改的文件
2. 通过 WebSocket 通知浏览器
3. 浏览器更新相应的模块

### 手动处理热更新

在某些情况下，你可能需要手动处理热更新，特别是对于有状态的模块：

```javascript
// 手动处理热更新
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // 处理模块更新
    console.log('模块已更新:', newModule);
  });
  
  import.meta.hot.dispose(() => {
    // 清理资源
    console.log('模块即将被替换');
  });
  
  import.meta.hot.invalidate();
}
```

### 热更新 API

Vite 提供了以下热更新 API：

- **import.meta.hot**：热更新对象
- **import.meta.hot.accept()**：接受模块更新
- **import.meta.hot.dispose()**：模块被替换时清理资源
- **import.meta.hot.invalidate()**：使当前模块失效，触发重新加载
- **import.meta.hot.data**：在模块更新之间共享数据

## 最佳实践

### 1. 合理组织代码结构

- **模块化设计**：将代码拆分为小模块，减少热更新的范围
- **避免全局状态**：减少全局状态的使用，便于热更新
- **使用状态管理**：对于复杂状态，使用 Vuex、Pinia 等状态管理库

### 2. 处理副作用

- **清理副作用**：在 `dispose` 中清理定时器、事件监听器等
- **避免全局副作用**：减少模块的全局副作用
- **使用生命周期钩子**：利用框架的生命周期钩子管理资源

### 3. 优化热更新速度

- **减少模块依赖**：减少模块之间的依赖关系
- **避免循环依赖**：避免模块之间的循环依赖
- **合理使用动态导入**：对于大型模块，使用动态导入

### 4. 调试热更新

- **使用热更新日志**：查看浏览器控制台的热更新日志
- **检查网络请求**：查看 WebSocket 连接和更新请求
- **使用 `vite-plugin-inspect`**：分析 Vite 的构建过程

## 常见问题

### 1. 热更新不生效

**问题**：修改代码后，热更新没有生效

**解决方案**：
- 检查文件是否被正确监听
- 检查 WebSocket 连接是否正常
- 检查是否有语法错误导致热更新失败
- 检查 `vite.config.js` 中的 HMR 配置

### 2. 热更新导致状态丢失

**问题**：热更新后，应用状态丢失

**解决方案**：
- 使用 `import.meta.hot.data` 保存状态
- 使用状态管理库管理状态
- 避免在模块顶层定义状态

### 3. 热更新速度慢

**问题**：热更新速度较慢

**解决方案**：
- 减少模块依赖
- 避免大型模块
- 优化代码结构
- 检查是否有耗时的操作

### 4. 热更新错误

**问题**：热更新过程中出现错误

**解决方案**：
- 检查代码语法错误
- 检查模块导出是否正确
- 检查依赖关系是否正确
- 查看控制台错误信息

## 示例

### 基本热更新示例

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// 手动处理热更新
if (import.meta.hot) {
  import.meta.hot.accept()
}
```

### 带状态管理的热更新

```javascript
// src/store/index.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})

// 热更新处理
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
}
```

### 组件热更新

```vue
<!-- src/components/HelloWorld.vue -->
<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello Vite!')
const count = ref(0)

// 热更新处理
if (import.meta.hot) {
  import.meta.hot.accept()
}
</script>
```

### 样式热更新

```css
/* src/style.css */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
}

/* 样式文件的热更新会自动生效，无需额外配置 */
```

## 总结

Vite 的热更新是其核心特性之一，能够显著提升开发体验。通过理解其工作原理和配置选项，你可以：

1. **提高开发效率**：快速看到代码修改的效果
2. **保留应用状态**：避免因刷新页面而丢失状态
3. **优化开发流程**：保持开发的连贯性

在使用热更新时，应注意：

- 合理组织代码结构，减少模块依赖
- 处理好模块的副作用
- 正确使用热更新 API
- 及时解决热更新过程中出现的问题

通过充分利用 Vite 的热更新特性，你可以打造更加高效、流畅的开发体验。