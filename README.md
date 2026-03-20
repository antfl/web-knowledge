# 前端知识体系

> 本项目系统性地整理了前端开发的核心知识点，从基础到进阶，从理论到实践，帮助开发者构建完整的前端知识体系。掌握这些知识是成为高级前端工程师的必经之路，能够胜任复杂的前端架构设计和工程化建设。

## 📚 当前文档概要

### JavaScript 核心知识

#### 1. this 指向与闭包
- **this 指向**：深入理解 JavaScript 中 this 的绑定规则和调用方式
  - [call 方法详解](./JavaScript/1.call/call.md) - 立即执行函数并改变 this 指向
  - [apply 方法详解](./JavaScript/3.apply/apply.md) - 以数组形式传递参数并改变 this 指向
  - [bind 方法详解](./JavaScript/2.bind/bind.md) - 创建新函数并永久绑定 this 指向

- **闭包**：掌握闭包的形成原理、使用场景和内存管理
  - [闭包详解](./JavaScript/5.closure/closure.md) - 闭包的概念、特性、用法和实际应用

#### 2. 异步编程
- **Promise**：理解 Promise 的工作原理和链式调用
  - [Promise 详解](./JavaScript/4.promise/promise.md) - Promise 的状态、方法和实际应用

#### 3. 原型链
- **原型链**：掌握 JavaScript 的继承机制和原型链查找
  - [原型链详解](./JavaScript/6.prototype/prototype.md) - 原型链的结构、继承方式和最佳实践

## 🏗️ 前端工程化

### 包管理工具

#### npm (Node Package Manager)
- **核心概念**：
  - npm 是 Node.js 的默认包管理器
  - 拥有全球最大的 JavaScript 包仓库
  - 支持 package.json 依赖管理
  - 提供脚本运行机制

- **常用命令**：
  ```bash
  # 初始化项目
  npm init
  
  # 安装依赖
  npm install <package-name>
  npm install <package-name> --save-dev
  npm install <package-name> --global
  
  # 更新依赖
  npm update
  
  # 卸载依赖
  npm uninstall <package-name>
  
  # 运行脚本
  npm run <script-name>
  
  # 查看依赖信息
  npm list
  npm outdated
  ```

- **最佳实践**：
  - 使用 `package-lock.json` 锁定依赖版本
  - 合理区分 `dependencies` 和 `devDependencies`
  - 使用 `npm scripts` 统一项目命令
  - 定期更新依赖，保持安全性

#### pnpm (Performant npm)
- **核心优势**：
  - 使用硬链接和符号链接，节省磁盘空间
  - 安装速度比 npm 快 2-3 倍
  - 严格的依赖管理，避免幽灵依赖
  - 支持 monorepo 原生支持

- **常用命令**：
  ```bash
  # 初始化项目
  pnpm init
  
  # 安装依赖
  pnpm add <package-name>
  pnpm add <package-name> --save-dev
  pnpm add <package-name> --global
  
  # 更新依赖
  pnpm update
  
  # 卸载依赖
  pnpm remove <package-name>
  
  # 运行脚本
  pnpm run <script-name>
  
  # 查看依赖信息
  pnpm list
  pnpm why <package-name>
  ```

- **最佳实践**：
  - 在大型项目中优先使用 pnpm
  - 利用 workspace 功能管理 monorepo
  - 使用 `pnpm import` 从 npm 迁移
  - 配置 `.npmrc` 优化安装行为

#### Yarn
- **核心优势**：
  - 并行安装，速度快
  - 离线模式支持
  - 原生 workspace 支持
  - 确定性安装

- **常用命令**：
  ```bash
  # 初始化项目
  yarn init
  
  # 安装依赖
  yarn add <package-name>
  yarn add <package-name> --dev
  
  # 更新依赖
  yarn upgrade
  
  # 卸载依赖
  yarn remove <package-name>
  
  # 运行脚本
  yarn run <script-name>
  
  # 查看依赖信息
  yarn list
  yarn why <package-name>
  ```

### 构建工具

#### Vite
- **核心优势**：
  - 开发服务器启动极快（毫秒级）
  - 原生 ES Module 支持，无需打包
  - HMR（热模块替换）性能优异
  - 内置 TypeScript、CSS 预处理器支持
  - 丰富的插件生态

- **配置示例**：
  ```javascript
  // vite.config.js
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'
  import path from 'path'

  export default defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router']
          }
        }
      }
    }
  })
  ```

- **最佳实践**：
  - 利用环境变量管理不同配置
  - 合理配置代码分割策略
  - 使用插件扩展功能
  - 优化构建输出，减小包体积

#### Webpack
- **核心概念**：
  - Entry（入口）：模块构建的起点
  - Output（输出）：打包后的文件输出位置
  - Loader（加载器）：处理非 JavaScript 文件
  - Plugin（插件）：扩展 Webpack 功能
  - Mode（模式）：开发/生产环境配置

- **配置示例**：
  ```javascript
  // webpack.config.js
  const path = require('path')
  const HtmlWebpackPlugin = require('html-webpack-plugin')

  module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ],
    devServer: {
      static: './dist',
      hot: true,
      port: 3000
    }
  }
  ```

- **性能优化**：
  - 代码分割（Code Splitting）
  - Tree Shaking（摇树优化）
  - 按需加载（Lazy Loading）
  - 缓存策略配置
  - 压缩和混淆

#### Rollup
- **核心优势**：
  - 专注于 ES Module 打包
  - 输出更小、更高效的代码
  - 支持 Tree Shaking
  - 适合库和工具的打包

- **配置示例**：
  ```javascript
  // rollup.config.js
  import resolve from '@rollup/plugin-node-resolve'
  import commonjs from '@rollup/plugin-commonjs'
  import typescript from '@rollup/plugin-typescript'

  export default {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript()
    ]
  }
  ```

#### esbuild
- **核心优势**：
  - 极快的构建速度（Go 语言编写）
  - 内置 TypeScript 支持
  - 支持 ES Module 和 CommonJS
  - 体积小，无需 Node.js 运行时

- **使用示例**：
  ```javascript
  import * as esbuild from 'esbuild'

  await esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/bundle.js',
    minify: true,
    sourcemap: true,
    loader: {
      '.ts': 'ts'
    }
  })
  ```

### Monorepo 管理

#### 什么是 Monorepo？
Monorepo 是一种代码组织方式，将多个相关项目存储在同一个代码仓库中，共享依赖和配置。

#### 优势
- **代码共享**：公共代码和工具可以轻松共享
- **统一版本管理**：依赖版本统一，减少兼容性问题
- **原子提交**：跨项目的修改可以在一个 commit 中完成
- **简化 CI/CD**：统一的构建和部署流程
- **团队协作**：跨项目协作更加便捷

#### 工具选择

##### pnpm workspace
```json
// pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

```bash
# 安装依赖
pnpm install

# 在所有项目中运行命令
pnpm run --filter <package-name> build
pnpm -r build

# 添加依赖到特定项目
pnpm add <package-name> --filter <project-name>
```

##### Yarn workspace
```json
// package.json
{
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

```bash
# 安装依赖
yarn install

# 在所有项目中运行命令
yarn workspaces run build

# 添加依赖到特定项目
yarn workspace <project-name> add <package-name>
```

##### Lerna
```bash
# 初始化 Lerna
lerna init

# 发布新版本
lerna publish

# 运行命令
lerna run build
lerna exec -- <command>
```

##### Nx
```bash
# 创建 Nx workspace
npx create-nx-workspace

# 生成应用
nx g app my-app

# 生成库
nx g lib my-lib

# 运行命令
nx run my-app:build
nx run-many --target=build --all
```

#### 最佳实践
- 合理划分 packages 和 apps
- 使用 workspace 协议进行内部依赖
- 配置增量构建，提高构建效率
- 统一代码风格和 lint 规则
- 使用 changesets 管理版本发布

## 🧩 微前端架构

### 微前端概念
微前端是一种架构风格，将前端应用分解为更小、更简单的块，这些块可以由不同的团队独立开发、测试和部署。

### 核心优势
- **技术栈无关**：不同团队可以使用不同的技术栈
- **独立部署**：各个微应用可以独立部署和更新
- **团队自治**：团队可以自主选择技术方案和发布节奏
- **增量升级**：可以逐步升级技术栈，降低风险
- **故障隔离**：单个微应用的故障不会影响整个系统

### 实现方案

#### 1. qiankun（蚂蚁金服）
- **特点**：
  - 基于 single-spa 封装，开箱即用
  - HTML Entry 接入方式，简单易用
  - 样式隔离（Shadow DOM）
  - JS 沙箱（Proxy 拦截）
  - 预加载机制

- **使用示例**：
  ```javascript
  // 主应用
  import { registerMicroApps, start } from 'qiankun'

  registerMicroApps([
    {
      name: 'reactApp',
      entry: '//localhost:7100',
      container: '#subapp-container',
      activeRule: '/react'
    },
    {
      name: 'vueApp',
      entry: '//localhost:7200',
      container: '#subapp-container',
      activeRule: '/vue'
    }
  ])

  start()
  ```

- **最佳实践**：
  - 合理规划路由规则
  - 处理公共依赖加载
  - 配置预加载策略
  - 处理微应用间的通信

#### 2. single-spa
- **特点**：
  - 成熟的微前端框架
  - 支持多种技术栈
  - 生命周期管理
  - 应用间通信机制

- **使用示例**：
  ```javascript
  import { registerApplication, start } from 'single-spa'

  registerApplication({
    name: 'vue-app',
    app: () => System.import('vue-app'),
    activeWhen: '/vue'
  })

  start()
  ```

#### 3. Module Federation（Webpack 5）
- **特点**：
  - Webpack 5 原生支持
  - 运行时动态加载
  - 依赖共享机制
  - 版本管理

- **配置示例**：
  ```javascript
  // app1/webpack.config.js
  module.exports = {
    plugins: [
      new ModuleFederationPlugin({
        name: 'app1',
        filename: 'remoteEntry.js',
        exposes: {
          './Button': './src/Button'
        },
        shared: ['react', 'react-dom']
      })
    ]
  }

  // app2/webpack.config.js
  module.exports = {
    plugins: [
      new ModuleFederationPlugin({
        name: 'app2',
        remotes: {
          app1: 'app1@http://localhost:3001/remoteEntry.js'
        },
        shared: ['react', 'react-dom']
      })
    ]
  }
  ```

#### 4. iframe 方案
- **特点**：
  - 完全隔离，样式和 JS 互不影响
  - 实现简单，兼容性好
  - 性能较差，通信复杂

- **使用场景**：
  - 第三方应用集成
  - 安全性要求高的场景
  - 快速集成遗留系统

#### 5. Web Components
- **特点**：
  - 浏览器原生支持
  - 真正的组件化
  - 样式和脚本隔离
  - 跨框架使用

- **使用示例**：
  ```javascript
  class MyElement extends HTMLElement {
    connectedCallback() {
      this.innerHTML = '<p>Hello World</p>'
    }
  }

  customElements.define('my-element', MyElement)
  ```

### 微前端最佳实践
- **路由管理**：统一的路由策略和权限控制
- **状态管理**：跨应用的状态共享和同步
- **样式隔离**：避免样式冲突和污染
- **通信机制**：应用间的数据传递和事件通信
- **性能优化**：合理配置加载策略和缓存机制
- **监控和日志**：统一的监控和错误处理

## 🌐 浏览器相关知识

### 浏览器渲染原理

#### 渲染流程
1. **解析 HTML**：构建 DOM 树
2. **解析 CSS**：构建 CSSOM 树
3. **合并**：DOM 树和 CSSOM 树合并为渲染树
4. **布局**：计算每个元素的位置和大小
5. **绘制**：将渲染树绘制到屏幕
6. **合成**：将多个图层合成最终图像

#### 关键概念
- **DOM（Document Object Model）**：文档对象模型
- **CSSOM（CSS Object Model）**：CSS 对象模型
- **渲染树**：DOM 和 CSSOM 的结合
- **重排**：元素位置或大小变化，需要重新计算布局
- **重绘**：元素样式变化，但位置和大小不变
- **合成**：将多个图层合成最终图像

### 浏览器缓存

#### 缓存类型
1. **强缓存**：
   - Cache-Control
   - Expires
   - 浏览器直接使用缓存，不请求服务器

2. **协商缓存**：
   - ETag
   - Last-Modified
   - 浏览器请求服务器验证缓存是否有效

#### 缓存策略
```javascript
// Service Worker 缓存
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})
```

### 浏览器存储

#### LocalStorage
```javascript
// 设置
localStorage.setItem('key', 'value')

// 获取
const value = localStorage.getItem('key')

// 删除
localStorage.removeItem('key')

// 清空
localStorage.clear()

// 遍历
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  const value = localStorage.getItem(key)
}
```

#### SessionStorage
```javascript
// 用法与 LocalStorage 相同
// 但数据在会话结束时清除
sessionStorage.setItem('key', 'value')
```

#### IndexedDB
```javascript
// 打开数据库
const request = indexedDB.open('myDatabase', 1)

request.onupgradeneeded = event => {
  const db = event.target.result
  const objectStore = db.createObjectStore('users', { keyPath: 'id' })
  objectStore.createIndex('name', 'name', { unique: false })
}

request.onsuccess = event => {
  const db = event.target.result
  
  // 添加数据
  const transaction = db.transaction(['users'], 'readwrite')
  const objectStore = transaction.objectStore('users')
  const request = objectStore.add({ id: 1, name: 'John' })
}
```

#### Cookie
```javascript
// 设置 Cookie
document.cookie = 'name=value; expires=Thu, 01 Jan 2025 00:00:00 GMT; path=/'

// 获取 Cookie
const cookies = document.cookie

// 删除 Cookie
document.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
```

### 浏览器性能优化

#### 性能指标
- **FCP（First Contentful Paint）**：首次内容绘制
- **LCP（Largest Contentful Paint）**：最大内容绘制
- **FID（First Input Delay）**：首次输入延迟
- **CLS（Cumulative Layout Shift）**：累积布局偏移
- **TTI（Time to Interactive）**：可交互时间

#### 优化策略
1. **资源优化**：
   - 压缩图片（WebP、AVIF）
   - 使用 CDN 加速
   - 懒加载图片和视频
   - 预加载关键资源

2. **代码优化**：
   - 代码分割和按需加载
   - Tree Shaking 移除未使用代码
   - 压缩和混淆代码
   - 使用 Web Workers 处理复杂计算

3. **渲染优化**：
   - 减少 DOM 操作
   - 使用虚拟 DOM
   - 避免强制同步布局
   - 使用 CSS 动画代替 JS 动画

4. **网络优化**：
   - 使用 HTTP/2 或 HTTP/3
   - 启用 Brotli 压缩
   - 使用 Service Worker 缓存
   - 优化 DNS 查询

## 🔒 Web 安全

### XSS（跨站脚本攻击）

#### 防御措施
1. **输入验证**：
   ```javascript
   function sanitizeInput(input) {
     return input.replace(/[<>]/g, '')
   }
   ```

2. **输出编码**：
   ```javascript
   function escapeHtml(unsafe) {
     return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;")
   }
   ```

3. **使用 CSP（Content Security Policy）**：
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-inline'">
   ```

### CSRF（跨站请求伪造）

#### 防御措施
1. **CSRF Token**：
   ```javascript
   // 生成 Token
   const csrfToken = generateRandomToken()
   
   // 在请求中包含 Token
   fetch('/api/data', {
     method: 'POST',
     headers: {
       'X-CSRF-Token': csrfToken
     }
   })
   ```

2. **SameSite Cookie**：
   ```javascript
   document.cookie = 'session=xxx; SameSite=Strict'
   ```

3. **验证 Referer**：
   ```javascript
   const referer = request.headers.referer
   if (!isValidReferer(referer)) {
     return 403
   }
   ```

### 点击劫持

#### 防御措施
1. **X-Frame-Options**：
   ```html
   <meta http-equiv="X-Frame-Options" content="DENY">
   ```

2. **Content Security Policy**：
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="frame-ancestors 'none'">
   ```

### 内容安全策略（CSP）

#### 配置示例
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
              script-src 'self' 'unsafe-inline' https://cdn.example.com; 
              style-src 'self' 'unsafe-inline'; 
              img-src 'self' data: https:; 
              connect-src 'self' https://api.example.com;">
```

### HTTPS 和 SSL/TLS

#### HTTPS 优势
- **数据加密**：传输数据加密，防止中间人攻击
- **身份验证**：验证服务器身份，防止钓鱼攻击
- **数据完整性**：确保数据在传输过程中不被篡改
- **SEO 优化**：搜索引擎优先收录 HTTPS 网站

#### SSL/TLS 证书
- **证书类型**：
  - DV（Domain Validation）：域名验证
  - OV（Organization Validation）：组织验证
  - EV（Extended Validation）：扩展验证

- **免费证书**：
  - Let's Encrypt
  - ZeroSSL

- **配置示例**：
  ```nginx
  server {
    listen 443 ssl;
    server_name example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
  }
  ```

## 🌐 HTTP/HTTPS 协议

### HTTP 基础

#### 请求方法
- **GET**：获取资源
- **POST**：创建资源
- **PUT**：更新资源
- **DELETE**：删除资源
- **PATCH**：部分更新资源
- **HEAD**：获取响应头
- **OPTIONS**：获取服务器支持的 HTTP 方法

#### 状态码
- **2xx 成功**：
  - 200 OK
  - 201 Created
  - 204 No Content

- **3xx 重定向**：
  - 301 Moved Permanently
  - 302 Found
  - 304 Not Modified

- **4xx 客户端错误**：
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found

- **5xx 服务器错误**：
  - 500 Internal Server Error
  - 502 Bad Gateway
  - 503 Service Unavailable

#### HTTP 头部
```javascript
// 请求头
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer token',
  'User-Agent': 'Mozilla/5.0'
}

// 响应头
headers: {
  'Content-Type': 'application/json',
  'Content-Length': '1234',
  'Cache-Control': 'max-age=3600',
  'ETag': '"33a64df551425fcc55e4d42a148795d9f25f89d4"'
}
```

### HTTP/2

#### 核心特性
- **多路复用**：单个 TCP 连接可以同时发送多个请求
- **头部压缩**：HPACK 算法压缩 HTTP 头部
- **服务器推送**：服务器可以主动推送资源
- **二进制协议**：更高效的传输

#### 性能提升
- 减少连接建立开销
- 降低网络延迟
- 提高页面加载速度
- 改善用户体验

### HTTP/3

#### 核心特性
- **基于 QUIC**：使用 UDP 而不是 TCP
- **连接迁移**：网络切换时保持连接
- **0-RTT 握手**：减少连接建立时间
- **内置加密**：TLS 1.3 集成

#### 性能提升
- 更低的延迟
- 更好的网络适应性
- 更强的抗丢包能力
- 更快的页面加载

### HTTPS 配置

#### 证书申请
```bash
# 使用 Let's Encrypt 申请证书
certbot certonly --standalone -d example.com
```

#### Nginx 配置
```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000" always;

    # 其他配置...
}
```

#### Apache 配置
```apache
<VirtualHost *:443>
    ServerName example.com
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/example.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem
    SSLProtocol all -SSLv2 -SSLv3 -TLSv1 -TLSv1.1
    SSLHonorCipherOrder on
    
    # HSTS
    Header always set Strict-Transport-Security "max-age=31536000"
    
    # 其他配置...
</VirtualHost>
```

## 📊 性能监控

### 性能指标
- **LCP（Largest Contentful Paint）**：最大内容绘制时间
- **FID（First Input Delay）**：首次输入延迟
- **CLS（Cumulative Layout Shift）**：累积布局偏移
- **FCP（First Contentful Paint）**：首次内容绘制时间
- **TTI（Time to Interactive）**：可交互时间

### 监控工具
- **Lighthouse**：Google 的性能审计工具
- **WebPageTest**：在线性能测试工具
- **Chrome DevTools**：浏览器内置性能分析工具
- **Sentry**：错误监控和性能追踪
- **New Relic**：应用性能监控

### 性能优化建议
1. **减少 HTTP 请求**：合并资源，使用雪碧图
2. **使用 CDN**：加速静态资源加载
3. **启用压缩**：Gzip、Brotli 压缩
4. **优化图片**：使用 WebP、AVIF 格式
5. **代码分割**：按需加载，减少初始加载体积
6. **缓存策略**：合理配置浏览器缓存和 CDN 缓存
7. **懒加载**：延迟加载非关键资源
8. **预加载**：提前加载关键资源

## 🎯 学习路径

### 初级阶段
- 掌握 JavaScript 基础语法和概念
- 理解 DOM 操作和事件处理
- 学习 CSS 基础和布局
- 掌握 Git 基本操作

### 中级阶段
- 深入理解 JavaScript 高级特性（闭包、原型链、异步编程）
- 掌握主流前端框架（Vue、React）
- 学习前端工程化工具（Webpack、Vite）
- 理解浏览器工作原理

### 高级阶段
- 掌握前端架构设计
- 深入理解性能优化
- 学习微前端架构
- 掌握服务端渲染（SSR）
- 理解网络安全和最佳实践

### 专家阶段
- 参与开源项目贡献
- 设计和实现前端基础设施
- 指导团队成员成长
- 推动技术选型和架构决策

## 📖 推荐资源

### 学习资源
- **MDN Web Docs**：权威的 Web 技术文档
- **JavaScript.info**：深入的 JavaScript 教程
- **CSS-Tricks**：CSS 技巧和最佳实践
- **Frontend Masters**：高质量的前端课程

### 工具和框架
- **Vue.js**：渐进式 JavaScript 框架
- **React**：用于构建用户界面的 JavaScript 库
- **Angular**：完整的前端框架
- **Svelte**：编译型框架

### 社区和博客
- **掘金**：中文技术社区
- **知乎**：技术问答和分享
- **GitHub**：代码托管和协作平台
- **Stack Overflow**：技术问答社区

## 🤝 贡献指南

欢迎对本项目进行贡献，包括：
- 修正文档错误
- 补充缺失的知识点
- 提供更好的代码示例
- 分享最佳实践经验

## 📄 许可证

本项目采用 MIT 许可证，可以自由使用和修改。

---

**掌握这些前端知识体系，能够帮助你构建高质量的前端应用，胜任复杂的前端架构设计和工程化建设，在技术面试中脱颖而出，在职业发展中获得更好的机会。**
