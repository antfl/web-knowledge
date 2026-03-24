# Vite 代理配置

Vite 的代理配置是开发过程中的重要功能，用于解决跨域问题和模拟 API 请求。本文档详细介绍 Vite 代理配置的使用方法、配置选项和最佳实践。

## 目录

1. [代理基础](#代理基础)
2. [配置选项](#配置选项)
3. [使用方法](#使用方法)
4. [常见用例](#常见用例)
5. [最佳实践](#最佳实践)
6. [故障排除](#故障排除)
7. [示例](#示例)

## 代理基础

### 什么是代理？

代理是一种服务器中间层，用于转发客户端的请求到目标服务器，并将响应返回给客户端。在开发过程中，代理主要用于：

- **解决跨域问题**：避免浏览器的同源策略限制
- **模拟 API 响应**：在后端 API 未完成时模拟响应
- **转发请求**：将特定路径的请求转发到不同的后端服务

### Vite 代理的特点

Vite 的代理配置基于 `http-proxy`，具有以下特点：

- **简单配置**：通过 `vite.config.js` 中的 `server.proxy` 配置
- **灵活规则**：支持多个代理规则和路径匹配
- **实时重载**：配置更改后自动生效
- **支持 WebSocket**：可以代理 WebSocket 连接

## 配置选项

### 基本配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      // 字符串简写形式
      '/api': 'http://localhost:3000'
    }
  }
})
```

### 详细配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      // 选项写法
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true
      }
    }
  }
})
```

### 多代理配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/auth': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '')
      }
    }
  }
})
```

### 配置选项说明

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `target` | `string` | - | 目标服务器的 URL |
| `changeOrigin` | `boolean` | `false` | 是否改变请求头中的 `Host` 字段 |
| `rewrite` | `function` | - | 重写请求路径 |
| `secure` | `boolean` | `true` | 是否验证 SSL 证书 |
| `ws` | `boolean` | `false` | 是否代理 WebSocket 连接 |
| `configure` | `function` | - | 自定义代理配置 |
| `headers` | `object` | - | 添加请求头 |
| `followRedirects` | `boolean` | `false` | 是否跟随重定向 |
| `preserveHeaderKeyCase` | `boolean` | `false` | 是否保留请求头大小写 |
| `auth` | `string` | - | 代理认证信息 |

## 使用方法

### 基本使用

1. **配置代理规则**：在 `vite.config.js` 中添加 `server.proxy` 配置
2. **启动开发服务器**：运行 `npm run dev` 启动 Vite 开发服务器
3. **发送请求**：在前端代码中使用相对路径发送请求，例如 `fetch('/api/users')`
4. **查看代理效果**：Vite 会将请求代理到目标服务器

### 路径重写

当后端 API 路径与前端请求路径不一致时，可以使用 `rewrite` 选项：

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v1')
      }
    }
  }
})
```

### WebSocket 代理

对于需要 WebSocket 连接的场景，启用 `ws` 选项：

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
```

### 自定义配置

使用 `configure` 选项可以更精细地控制代理行为：

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy, options) => {
          // 自定义代理配置
          proxy.on('error', (err, req, res) => {
            console.log('代理错误:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 修改代理请求
            proxyReq.setHeader('X-Custom-Header', 'value');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // 修改代理响应
            proxyRes.headers['X-Proxy-Header'] = 'value';
          });
        }
      }
    }
  }
})
```

## 常见用例

### 1. 解决跨域问题

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

### 2. 模拟 API 响应

使用 `http-proxy-middleware` 的 `router` 选项或自定义中间件来模拟 API 响应：

```javascript
// vite.config.js
import { createProxyMiddleware } from 'http-proxy-middleware'

export default defineConfig({
  server: {
    middleware: [
      createProxyMiddleware('/api', {
        target: 'http://localhost:3000',
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
          // 模拟响应
          if (req.url === '/api/mock') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Mock response' }));
            return true;
          }
        }
      })
    ]
  }
})
```

### 3. 多环境代理

根据环境配置不同的代理目标：

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
```

### 4. 代理到不同端口

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:9090',
        changeOrigin: true
      }
    }
  }
})
```

## 最佳实践

### 1. 合理配置代理规则

- **明确路径匹配**：使用具体的路径前缀，避免过于宽泛的匹配
- **统一 API 路径**：在前端代码中使用统一的 API 路径前缀
- **合理使用重写**：根据后端 API 结构调整路径重写规则

### 2. 安全性考虑

- **生产环境禁用**：代理配置仅在开发环境使用，生产环境应使用真实的 API 地址
- **验证 SSL 证书**：在生产环境中启用 `secure: true`
- **避免暴露敏感信息**：不要在代理配置中硬编码敏感信息

### 3. 性能优化

- **合理设置超时**：避免代理请求超时影响开发体验
- **使用缓存**：对于频繁请求的静态资源，考虑使用缓存策略
- **限制代理范围**：只代理必要的路径，减少不必要的代理请求

### 4. 调试技巧

- **启用日志**：在开发过程中启用代理日志，便于调试
- **使用浏览器开发工具**：查看网络请求和响应
- **测试代理配置**：确保代理规则正确生效

## 故障排除

### 1. 代理不生效

**问题**：代理配置后，请求没有被代理到目标服务器

**解决方案**：
- 检查代理配置是否正确
- 检查目标服务器是否运行
- 检查路径匹配是否正确
- 查看 Vite 开发服务器日志

### 2. 跨域问题仍然存在

**问题**：配置代理后，仍然出现跨域错误

**解决方案**：
- 确保 `changeOrigin: true` 已设置
- 检查目标服务器是否正确设置 CORS 头
- 验证代理路径是否正确

### 3. 代理超时

**问题**：代理请求超时

**解决方案**：
- 检查目标服务器是否响应
- 检查网络连接是否正常
- 调整代理超时设置

### 4. WebSocket 代理失败

**问题**：WebSocket 连接无法通过代理

**解决方案**：
- 确保 `ws: true` 已设置
- 检查目标服务器是否支持 WebSocket
- 验证 WebSocket 路径是否正确

### 5. 路径重写错误

**问题**：路径重写后请求地址不正确

**解决方案**：
- 检查 `rewrite` 函数逻辑
- 测试重写后的路径是否正确
- 查看代理日志中的请求路径

## 示例

### 基础代理配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 高级代理配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/v1'),
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': 'Bearer token'
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('代理请求:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('代理响应状态:', proxyRes.statusCode);
          });
        }
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
```

### 多环境代理配置

```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: mode === 'production'
        }
      }
    }
  }
})
```

### 前端代码示例

```javascript
// src/api/index.js

// 使用代理的 API 请求
export async function fetchUsers() {
  const response = await fetch('/api/users');
  return response.json();
}

export async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return response.json();
}
```

## 总结

Vite 的代理配置是开发过程中的重要工具，能够有效解决跨域问题和简化 API 调用。通过合理配置代理规则，你可以：

1. **解决跨域问题**：避免浏览器的同源策略限制
2. **简化 API 调用**：使用相对路径调用 API
3. **模拟后端响应**：在后端 API 未完成时进行开发
4. **灵活配置**：根据不同环境和需求调整代理规则

在配置代理时，应注意：

- 合理设置代理规则和路径重写
- 考虑安全性和性能因素
- 及时排查代理配置中的问题
- 在生产环境中使用真实的 API 地址

通过充分利用 Vite 的代理功能，你可以打造更加高效、流畅的开发体验。