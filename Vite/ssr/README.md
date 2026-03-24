# Vite 服务端渲染 (SSR)

Vite 提供了对服务端渲染（Server-Side Rendering，SSR）的支持，能够显著提升首屏加载速度和搜索引擎优化（SEO）。本文档详细介绍 Vite SSR 的工作原理、配置方法和最佳实践。

## 目录

1. [SSR 基础](#ssr-基础)
2. [工作原理](#工作原理)
3. [项目结构](#项目结构)
4. [配置方法](#配置方法)
5. [开发流程](#开发流程)
6. [部署策略](#部署策略)
7. [性能优化](#性能优化)
8. [常见问题](#常见问题)
9. [示例](#示例)

## SSR 基础

### 什么是服务端渲染？

服务端渲染是指在服务器端生成 HTML 页面，然后将完整的 HTML 发送给客户端的技术。与传统的客户端渲染相比，SSR 具有以下优点：

- **更快的首屏加载**：无需等待 JavaScript 下载和执行
- **更好的 SEO**：搜索引擎可以直接索引服务器生成的 HTML
- **更好的用户体验**：用户可以更快地看到内容
- **减少客户端资源消耗**：部分渲染工作在服务器完成

### Vite SSR 的特点

Vite 的 SSR 实现具有以下特点：

- **快速开发体验**：利用 Vite 的开发服务器和热更新
- **同构代码**：客户端和服务器可以使用相同的代码
- **灵活配置**：支持多种后端框架
- **性能优化**：内置的构建优化和缓存策略

## 工作原理

### Vite SSR 工作流程

1. **开发阶段**：
   - Vite 开发服务器处理客户端和服务器代码
   - 支持热更新，提高开发效率

2. **构建阶段**：
   - 构建客户端代码（client build）
   - 构建服务器代码（server build）
   - 生成静态资源和服务端渲染所需的文件

3. **运行阶段**：
   - 服务器接收请求
   - 执行服务端渲染逻辑，生成 HTML
   - 将生成的 HTML 发送给客户端
   - 客户端激活（hydration），接管页面交互

### 核心概念

- **同构代码**：同时在客户端和服务器运行的代码
- **客户端激活**：客户端 JavaScript 接管服务器生成的 HTML
- **水合（Hydration）**：客户端将静态 HTML 转换为可交互的应用
- **预渲染**：在构建时生成静态 HTML 页面

## 项目结构

### 基本项目结构

```
├── public/              # 静态资源
├── src/
│   ├── assets/          # 资源文件
│   ├── components/      # 组件
│   ├── pages/           # 页面
│   ├── router/          # 路由
│   ├── store/           # 状态管理
│   ├── entry-client.js  # 客户端入口
│   ├── entry-server.js  # 服务器入口
│   └── main.js          # 应用主文件
├── server/              # 服务器代码
│   └── index.js         # 服务器入口
├── vite.config.js       # Vite 配置
├── package.json         # 项目配置
```

### 关键文件说明

1. **entry-server.js**：服务器端入口，负责渲染应用
2. **entry-client.js**：客户端入口，负责激活应用
3. **main.js**：应用主文件，创建 Vue 应用实例
4. **server/index.js**：Node.js 服务器，处理请求并执行 SSR

## 配置方法

### Vite 配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    ssr: true,
    outDir: 'dist/server',
    rollupOptions: {
      input: resolve(__dirname, 'src/entry-server.js'),
      output: {
        format: 'cjs'
      }
    }
  }
})
```

### 客户端构建配置

```javascript
// vite.config.client.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: resolve(__dirname, 'src/entry-client.js')
    }
  }
})
```

### 服务器配置

```javascript
// server/index.js
const express = require('express')
const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')
const path = require('path')
const fs = require('fs')

const app = express()
const port = 3000

// 读取客户端构建产物
const clientDist = path.resolve(__dirname, '../dist/client')
const template = fs.readFileSync(path.join(clientDist, 'index.html'), 'utf-8')

// 导入服务端入口
const { render } = require('../dist/server/entry-server.js')

// 静态资源服务
app.use(express.static(clientDist))

// SSR 路由
app.get('*', async (req, res) => {
  try {
    const appContent = await render(req.url)
    
    const html = template.replace('<!--app-html-->', appContent)
    
    res.status(200).set('Content-Type', 'text/html').end(html)
  } catch (error) {
    console.error('SSR 错误:', error)
    res.status(500).end('服务器错误')
  }
})

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
})
```

## 开发流程

### 1. 创建项目

使用 Vite 创建项目：

```bash
npm create vite@latest my-ssr-app -- --template vue
cd my-ssr-app
npm install
```

### 2. 安装依赖

安装 SSR 所需的依赖：

```bash
npm install express @vue/server-renderer
```

### 3. 创建入口文件

#### 客户端入口

```javascript
// src/entry-client.js
import { createApp } from './main'

const app = createApp()
app.mount('#app')
```

#### 服务器入口

```javascript
// src/entry-server.js
import { createApp } from './main'
import { renderToString } from '@vue/server-renderer'

export async function render(url) {
  const app = createApp()
  
  // 处理路由
  // 可以使用 vue-router 等路由库
  
  const html = await renderToString(app)
  return html
}
```

#### 应用主文件

```javascript
// src/main.js
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  return app
}
```

### 4. 配置构建脚本

```json
// package.json
{
  "scripts": {
    "dev": "node server/dev.js",
    "build:client": "vite build --config vite.config.client.js",
    "build:server": "vite build --config vite.config.server.js",
    "build": "npm run build:client && npm run build:server",
    "start": "node server/index.js"
  }
}
```

### 5. 开发服务器

```javascript
// server/dev.js
const express = require('express')
const { createServer: createViteServer } = require('vite')

async function createServer() {
  const app = express()
  
  // 创建 Vite 开发服务器
  const vite = await createViteServer({
    server: {
      middlewareMode: true
    }
  })
  
  app.use(vite.middlewares)
  
  app.get('*', async (req, res) => {
    try {
      // 读取模板
      let template = await vite.readFile('index.html')
      
      // 转换模板
      template = await vite.transformIndexHtml(req.url, template)
      
      // 导入服务器入口
      const { render } = await vite.ssrLoadModule('./src/entry-server.js')
      
      // 渲染应用
      const appHtml = await render(req.url)
      
      // 注入应用内容
      const html = template.replace('<!--app-html-->', appHtml)
      
      res.status(200).set('Content-Type', 'text/html').end(html)
    } catch (error) {
      vite.ssrFixStacktrace(error)
      console.error(error)
      res.status(500).end(error.message)
    }
  })
  
  app.listen(3000, () => {
    console.log('开发服务器运行在 http://localhost:3000')
  })
}

createServer()
```

## 部署策略

### 1. 静态部署

对于内容不常变化的应用，可以使用预渲染：

```javascript
// scripts/prerender.js
const fs = require('fs')
const path = require('path')
const { render } = require('../dist/server/entry-server.js')

const routes = ['/', '/about', '/contact']
const clientDist = path.resolve(__dirname, '../dist/client')
const template = fs.readFileSync(path.join(clientDist, 'index.html'), 'utf-8')

async function prerender() {
  for (const route of routes) {
    const appHtml = await render(route)
    const html = template.replace('<!--app-html-->', appHtml)
    
    const filePath = path.join(clientDist, route === '/' ? 'index.html' : `${route}/index.html`)
    
    // 确保目录存在
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, html)
    
    console.log(`预渲染: ${route} -> ${filePath}`)
  }
}

prerender()
```

### 2. 服务器部署

对于需要动态内容的应用，部署到 Node.js 服务器：

1. **构建应用**：
   ```bash
   npm run build
   ```

2. **部署到服务器**：
   - 使用 PM2 管理进程
   - 配置 Nginx 反向代理
   - 启用 HTTPS

3. **Nginx 配置**：
   ```nginx
   server {
     listen 80;
     server_name example.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     }
     
     location /assets/ {
       root /path/to/dist/client;
       expires 1y;
     }
   }
   ```

### 3. 容器化部署

使用 Docker 容器化部署：

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY dist/ ./dist/
COPY server/ ./server/

EXPOSE 3000

CMD ["node", "server/index.js"]
```

## 性能优化

### 1. 缓存策略

- **页面缓存**：缓存渲染结果
- **API 缓存**：缓存 API 响应
- **静态资源缓存**：设置合理的缓存头

### 2. 代码分割

- **路由级代码分割**：按需加载路由
- **组件级代码分割**：按需加载组件
- **依赖分割**：将第三方库单独打包

### 3. 预加载

- **预加载关键资源**：使用 `<link rel="preload">`
- **预连接**：使用 `<link rel="preconnect">`
- **预渲染**：预生成静态页面

### 4. 服务器优化

- **使用 Node.js 集群**：充分利用多核 CPU
- **内存管理**：避免内存泄漏
- **响应时间优化**：减少服务器处理时间

## 常见问题

### 1. 客户端激活失败

**问题**：客户端激活时出现 hydration mismatch 错误

**解决方案**：
- 确保服务器和客户端使用相同的数据
- 检查组件的渲染逻辑
- 避免在渲染过程中使用随机值

### 2. 首屏加载慢

**问题**：SSR 首屏加载时间过长

**解决方案**：
- 优化服务器响应时间
- 减少服务端渲染的复杂度
- 使用缓存策略
- 考虑预渲染

### 3. 内存泄漏

**问题**：服务器内存使用持续增长

**解决方案**：
- 检查事件监听器
- 清理定时器
- 避免循环引用
- 使用内存分析工具

### 4. SEO 问题

**问题**：搜索引擎索引不完整

**解决方案**：
- 确保服务器生成完整的 HTML
- 使用合理的页面标题和描述
- 配置 sitemap.xml
- 提交站点到搜索引擎

### 5. 部署问题

**问题**：部署后 SSR 不工作

**解决方案**：
- 检查环境变量配置
- 确保依赖正确安装
- 检查服务器配置
- 查看日志错误信息

## 示例

### 基本 SSR 示例

```javascript
// src/entry-server.js
import { createApp } from './main'
import { renderToString } from '@vue/server-renderer'

export async function render(url) {
  const app = createApp()
  
  // 简单的路由处理
  if (url === '/about') {
    app.component('PageContent', {
      template: '<div>关于页面</div>'
    })
  } else {
    app.component('PageContent', {
      template: '<div>首页</div>'
    })
  }
  
  const html = await renderToString(app)
  return html
}
```

```javascript
// src/main.js
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  return app
}
```

```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <h1>Vue SSR 示例</h1>
    <nav>
      <a href="/">首页</a>
      <a href="/about">关于</a>
    </nav>
    <PageContent />
  </div>
</template>

<script setup>
// 客户端激活时的逻辑
</script>
```

### 带路由的 SSR 示例

```javascript
// src/router/index.js
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

export function createRouter(isServer) {
  return createRouter({
    history: isServer ? createMemoryHistory() : createWebHistory(),
    routes: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/about',
        component: About
      }
    ]
  })
}
```

```javascript
// src/entry-server.js
import { createApp } from './main'
import { renderToString } from '@vue/server-renderer'

export async function render(url) {
  const { app, router } = createApp()
  
  // 设置路由
  router.push(url)
  await router.isReady()
  
  const html = await renderToString(app)
  return html
}
```

```javascript
// src/main.js
import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'

export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter(import.meta.env.SSR)
  
  app.use(router)
  
  return { app, router }
}
```

### 带状态管理的 SSR 示例

```javascript
// src/store/index.js
import { createPinia } from 'pinia'

export function createStore() {
  return createPinia()
}
```

```javascript
// src/main.js
import { createSSRApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'

export function createApp() {
  const app = createSSRApp(App)
  const router = createRouter(import.meta.env.SSR)
  const store = createStore()
  
  app.use(router)
  app.use(store)
  
  return { app, router, store }
}
```

```javascript
// src/entry-server.js
import { createApp } from './main'
import { renderToString } from '@vue/server-renderer'

export async function render(url) {
  const { app, router, store } = createApp()
  
  router.push(url)
  await router.isReady()
  
  // 预加载数据
  const matchedComponents = router.currentRoute.value.matched.flatMap(
    record => Object.values(record.components)
  )
  
  await Promise.all(
    matchedComponents.map(Component => {
      if (Component.asyncData) {
        return Component.asyncData({ store, route: router.currentRoute.value })
      }
    })
  )
  
  const html = await renderToString(app)
  const state = store.state
  
  return {
    html,
    state
  }
}
```

```javascript
// src/entry-client.js
import { createApp } from './main'

const { app, router, store } = createApp()

// 恢复状态
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.isReady().then(() => {
  app.mount('#app')
})
```

## 总结

Vite SSR 是一种强大的技术，可以显著提升应用的首屏加载速度和 SEO 表现。通过合理的配置和优化，你可以：

1. **提升用户体验**：更快的首屏加载和更好的交互体验
2. **改善 SEO**：让搜索引擎更好地索引你的网站
3. **减少客户端负担**：将部分渲染工作转移到服务器
4. **提高应用性能**：通过缓存和代码分割等优化手段

在实施 SSR 时，应注意：

- 确保服务器和客户端代码的一致性
- 合理处理数据预加载
- 优化服务器性能和内存使用
- 选择合适的部署策略

通过充分利用 Vite SSR 的特性，你可以构建出性能优异、用户体验出色的现代前端应用。