# Vite 环境变量

Vite 提供了一种灵活的方式来管理不同环境的配置，通过环境变量文件来存储和加载配置信息。本文档详细介绍 Vite 中环境变量的使用方法。

## 目录

1. [环境变量基础](#环境变量基础)
2. [环境变量文件](#环境变量文件)
3. [环境变量前缀](#环境变量前缀)
4. [在代码中使用环境变量](#在代码中使用环境变量)
5. [TypeScript 支持](#typescript-支持)
6. [环境变量配置选项](#环境变量配置选项)
7. [环境变量最佳实践](#环境变量最佳实践)
8. [常见问题](#常见问题)
9. [示例](#示例)

## 环境变量基础

### 什么是环境变量？

环境变量是在操作系统或应用程序中定义的变量，用于存储配置信息。在 Vite 中，环境变量通常用于：

- 存储 API 端点 URL
- 配置数据库连接信息
- 管理不同环境的配置（开发、测试、生产）
- 存储敏感信息（如 API 密钥）

### Vite 中的环境变量

Vite 会自动加载环境变量文件，并将其注入到应用程序中。环境变量可以在：

- 开发环境中使用
- 构建过程中使用
- 运行时使用

## 环境变量文件

Vite 支持以下环境变量文件：

| 文件名 | 说明 | 加载环境 |
|-------|------|----------|
| `.env` | 基础环境变量文件 | 所有环境 |
| `.env.local` | 本地环境变量文件 | 所有环境（会被 git 忽略） |
| `.env.development` | 开发环境变量文件 | 开发环境 |
| `.env.development.local` | 本地开发环境变量文件 | 开发环境（会被 git 忽略） |
| `.env.production` | 生产环境变量文件 | 生产环境 |
| `.env.production.local` | 本地生产环境变量文件 | 生产环境（会被 git 忽略） |
| `.env.test` | 测试环境变量文件 | 测试环境 |
| `.env.test.local` | 本地测试环境变量文件 | 测试环境（会被 git 忽略） |

### 加载优先级

Vite 按以下优先级加载环境变量文件（从高到低）：

1. `.env.{mode}.local`
2. `.env.{mode}`
3. `.env.local`
4. `.env`

### 环境变量文件格式

环境变量文件使用键值对格式：

```
# 注释
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
VITE_DEBUG=true
```

## 环境变量前缀

### 默认前缀

Vite 默认只暴露以 `VITE_` 前缀开头的环境变量到浏览器环境中。这是为了：

- 防止敏感信息泄露到浏览器
- 区分 Vite 环境变量和系统环境变量

### 自定义前缀

你可以在 `vite.config.js` 中自定义环境变量前缀：

```javascript
export default defineConfig({
  envPrefix: 'APP_'
})
```

这样，只有以 `APP_` 开头的环境变量会被暴露到浏览器环境中。

## 在代码中使用环境变量

### 在客户端代码中使用

在客户端代码中，你可以通过 `import.meta.env` 访问环境变量：

```javascript
// 访问环境变量
const apiUrl = import.meta.env.VITE_API_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;
const isDebug = import.meta.env.VITE_DEBUG === 'true';

// 内置环境变量
const isDev = import.meta.env.DEV; // 开发环境为 true
const isProd = import.meta.env.PROD; // 生产环境为 true
const baseUrl = import.meta.env.BASE_URL; // 应用基础路径
const mode = import.meta.env.MODE; // 当前环境模式
```

### 在内置环境变量

Vite 提供了以下内置环境变量：

| 变量名 | 说明 |
|-------|------|
| `import.meta.env.DEV` | 是否为开发环境 |
| `import.meta.env.PROD` | 是否为生产环境 |
| `import.meta.env.MODE` | 当前环境模式（development/production） |
| `import.meta.env.BASE_URL` | 应用的基础路径 |
| `import.meta.env.SSR` | 是否为 SSR 环境 |

### 在配置文件中使用

在 `vite.config.js` 中，你可以通过 `process.env` 访问环境变量：

```javascript
export default defineConfig({
  server: {
    port: process.env.VITE_PORT || 3000
  }
})
```

### 在 Node.js 环境中使用

在 Node.js 环境（如 SSR 或 API 服务器）中，你可以通过 `process.env` 访问环境变量：

```javascript
// server.js
const apiUrl = process.env.VITE_API_URL;
```

## TypeScript 支持

### 类型声明

为了在 TypeScript 中获得环境变量的类型提示，你需要创建或修改 `vite-env.d.ts` 文件：

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

declare interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_DEBUG: string
  // 更多环境变量...
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 类型安全

使用 TypeScript 可以确保环境变量的类型安全：

```typescript
// 类型安全的环境变量使用
const apiUrl: string = import.meta.env.VITE_API_URL;
const debug: boolean = import.meta.env.VITE_DEBUG === 'true';
```

## 环境变量配置选项

### envDir

指定环境变量文件的目录，默认为 `./`：

```javascript
export default defineConfig({
  envDir: './env'
})
```

### envPrefix

指定环境变量的前缀，默认为 `VITE_`：

```javascript
export default defineConfig({
  envPrefix: 'APP_'
})
```

### define

在 `define` 选项中定义全局常量：

```javascript
export default defineConfig({
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_API_URL),
    __APP_VERSION__: JSON.stringify('1.0.0')
  }
})
```

## 环境变量最佳实践

### 1. 分离环境配置

为不同环境创建不同的环境变量文件：

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `.env.test` - 测试环境配置

### 2. 敏感信息管理

- **不要**将敏感信息（如 API 密钥、数据库密码）提交到版本控制系统
- 使用 `.env.local` 文件存储本地敏感信息（会被 git 忽略）
- 对于生产环境，使用环境变量注入或 secret 管理服务

### 3. 类型安全

- 使用 TypeScript 类型定义环境变量
- 在使用环境变量前进行验证
- 提供默认值以避免运行时错误

### 4. 命名规范

- 使用大写字母和下划线命名环境变量
- 使用前缀区分不同类型的环境变量
- 保持命名一致和清晰

### 5. 文档

- 记录所有环境变量的用途
- 提供示例环境变量文件
- 说明哪些环境变量是必需的，哪些是可选的

## 常见问题

### 1. 环境变量未生效

**问题**：修改环境变量后，应用中没有生效

**解决方案**：
- 重启开发服务器
- 检查环境变量文件名是否正确
- 检查环境变量前缀是否正确
- 检查环境变量加载优先级

### 2. 环境变量在生产环境中不可用

**问题**：开发环境中环境变量正常，生产环境中不可用

**解决方案**：
- 确保生产环境文件（如 `.env.production`）存在
- 确保生产环境变量已正确设置
- 检查构建过程是否正确加载环境变量

### 3. 敏感信息泄露

**问题**：环境变量中的敏感信息出现在构建产物中

**解决方案**：
- 不要在客户端代码中使用敏感环境变量
- 使用服务器端 API 代理敏感操作
- 确保敏感环境变量不以 `VITE_` 前缀开头

### 4. 类型错误

**问题**：TypeScript 报错，找不到环境变量类型

**解决方案**：
- 创建或更新 `vite-env.d.ts` 文件
- 确保环境变量类型定义正确
- 重启 TypeScript 服务器

## 示例

### 基础示例

#### 1. 环境变量文件

```env
# .env
VITE_APP_TITLE=My App
VITE_API_URL=https://api.example.com
VITE_DEBUG=false

# .env.development
VITE_API_URL=https://dev-api.example.com
VITE_DEBUG=true

# .env.production
VITE_API_URL=https://api.example.com
VITE_DEBUG=false
```

#### 2. 在代码中使用

```javascript
// src/api/index.js
const API_URL = import.meta.env.VITE_API_URL;
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

export const fetchData = async (endpoint) => {
  if (DEBUG) {
    console.log(`Fetching: ${API_URL}${endpoint}`);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`);
  return response.json();
};
```

#### 3. 在配置文件中使用

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: process.env.VITE_PORT || 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://api.example.com',
        changeOrigin: true
      }
    }
  }
})
```

### 高级示例

#### 1. 多环境配置

```javascript
// src/config/index.js
const configs = {
  development: {
    apiUrl: import.meta.env.VITE_API_URL,
    timeout: 10000,
    debug: true
  },
  production: {
    apiUrl: import.meta.env.VITE_API_URL,
    timeout: 5000,
    debug: false
  }
};

export const config = configs[import.meta.env.MODE] || configs.development;
```

#### 2. 环境变量验证

```javascript
// src/utils/validateEnv.js
export const validateEnv = () => {
  const requiredEnvs = ['VITE_API_URL', 'VITE_APP_TITLE'];
  const missingEnvs = [];

  requiredEnvs.forEach(env => {
    if (!import.meta.env[env]) {
      missingEnvs.push(env);
    }
  });

  if (missingEnvs.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
    // 可以选择抛出错误或使用默认值
  }
};

// 在应用入口调用
validateEnv();
```

#### 3. 动态环境变量

```javascript
// src/utils/env.js
export const getEnv = (key, defaultValue = undefined) => {
  const value = import.meta.env[key];
  return value !== undefined ? value : defaultValue;
};

export const getEnvBool = (key, defaultValue = false) => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

export const getEnvNumber = (key, defaultValue = 0) => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};
```

## 总结

环境变量是 Vite 中管理不同环境配置的强大工具。通过合理使用环境变量，你可以：

1. 分离不同环境的配置
2. 管理敏感信息
3. 提高应用的可配置性
4. 确保类型安全

遵循最佳实践，正确配置和使用环境变量，可以让你的应用更加灵活、安全和可维护。