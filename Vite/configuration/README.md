# Vite 配置选项

Vite 提供了丰富的配置选项，可以通过 `vite.config.js` 文件来自定义构建行为。本文档详细介绍 Vite 的各种配置选项。

## 目录

1. [配置文件结构](#配置文件结构)
2. [基础配置](#基础配置)
3. [开发服务器配置](#开发服务器配置)
4. [构建配置](#构建配置)
5. [解析配置](#解析配置)
6. [CSS 配置](#css-配置)
7. [JSON 配置](#json-配置)
8. [esbuild 配置](#esbuild-配置)
9. [日志配置](#日志配置)
10. [环境变量配置](#环境变量配置)
11. [插件配置](#插件配置)
12. [高级配置](#高级配置)
13. [配置示例](#配置示例)
14. [配置最佳实践](#配置最佳实践)

## 配置文件结构

Vite 配置文件可以使用以下格式：

### ES 模块格式（推荐）

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // 配置选项
})
```

### CommonJS 格式

```javascript
// vite.config.js
const { defineConfig } = require('vite')

module.exports = defineConfig({
  // 配置选项
})
```

### TypeScript 格式

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  // 配置选项
})
```

## 基础配置

### root

项目根目录，默认为 `./`。

```javascript
export default defineConfig({
  root: './src'
})
```

### base

开发或生产环境的基础路径，默认为 `/`。

```javascript
export default defineConfig({
  base: '/my-app/'
})
```

### mode

运行模式，默认为 `development` 或 `production`。

```javascript
export default defineConfig({
  mode: 'development'
})
```

### define

定义全局常量。

```javascript
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
    __API_URL__: JSON.stringify('https://api.example.com')
  }
})
```

### plugins

插件数组。

```javascript
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

## 开发服务器配置

### server.port

开发服务器端口，默认为 `5173`。

```javascript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### server.open

是否自动打开浏览器，默认为 `false`。

```javascript
export default defineConfig({
  server: {
    open: true
  }
})
```

### server.host

主机名，默认为 `localhost`。设置为 `true` 会监听所有网络接口。

```javascript
export default defineConfig({
  server: {
    host: '0.0.0.0'
  }
})
```

### server.https

是否启用 HTTPS，默认为 `false`。

```javascript
export default defineConfig({
  server: {
    https: true
  }
})
```

### server.proxy

代理配置，用于解决跨域问题。

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### server.cors

CORS 配置，默认为 `true`。

```javascript
export default defineConfig({
  server: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  }
})
```

### server.watch

文件监听配置。

```javascript
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/node_modules/**']
    }
  }
})
```

## 构建配置

### build.outDir

构建输出目录，默认为 `dist`。

```javascript
export default defineConfig({
  build: {
    outDir: 'build'
  }
})
```

### build.assetsDir

静态资源目录，默认为 `assets`。

```javascript
export default defineConfig({
  build: {
    assetsDir: 'static'
  }
})
```

### build.assetsInlineLimit

内联静态资源的大小限制，默认为 `4096` (4kb)。

```javascript
export default defineConfig({
  build: {
    assetsInlineLimit: 8192 // 8kb
  }
})
```

### build.cssCodeSplit

是否启用 CSS 代码分割，默认为 `true`。

```javascript
export default defineConfig({
  build: {
    cssCodeSplit: false
  }
})
```

### build.sourcemap

是否生成 source map，默认为 `false`。

```javascript
export default defineConfig({
  build: {
    sourcemap: true
  }
})
```

### build.minify

是否压缩代码，默认为 `'esbuild'`。

```javascript
export default defineConfig({
  build: {
    minify: 'terser' // 也可以是 'esbuild' 或 false
  }
})
```

### build.rollupOptions

Rollup 配置选项。

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          utils: ['lodash', 'axios']
        }
      }
    }
  }
})
```

### build.emptyOutDir

构建前是否清空输出目录，默认为 `true`。

```javascript
export default defineConfig({
  build: {
    emptyOutDir: false
  }
})
```

## 解析配置

### resolve.alias

路径别名。

```javascript
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils'
    }
  }
})
```

### resolve.extensions

导入时省略的文件扩展名。

```javascript
export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
})
```

### resolve.dedupe

重复依赖的去重。

```javascript
export default defineConfig({
  resolve: {
    dedupe: ['vue']
  }
})
```

## CSS 配置

### css.modules

CSS 模块配置。

```javascript
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    }
  }
})
```

### css.preprocessorOptions

预处理器选项。

```javascript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      },
      less: {
        javascriptEnabled: true
      }
    }
  }
})
```

### css.postcss

PostCSS 配置。

```javascript
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('autoprefixer')
      ]
    }
  }
})
```

## JSON 配置

### json.namedExports

是否支持 JSON 的命名导出，默认为 `true`。

```javascript
export default defineConfig({
  json: {
    namedExports: false
  }
})
```

### json.stringify

是否将 JSON 转换为 ES 模块，默认为 `false`。

```javascript
export default defineConfig({
  json: {
    stringify: true
  }
})
```

## esbuild 配置

### esbuild

esbuild 配置选项。

```javascript
export default defineConfig({
  esbuild: {
    target: 'es2015',
    minify: true,
    loader: {
      '.js': 'jsx'
    }
  }
})
```

## 日志配置

### logLevel

日志级别，默认为 `'info'`。

```javascript
export default defineConfig({
  logLevel: 'silent' // 'info', 'warn', 'error', 'silent'
})
```

### clearScreen

是否清除屏幕，默认为 `true`。

```javascript
export default defineConfig({
  clearScreen: false
})
```

## 环境变量配置

### envDir

环境变量文件目录，默认为 `./`。

```javascript
export default defineConfig({
  envDir: './env'
})
```

### envPrefix

环境变量前缀，默认为 `VITE_`。

```javascript
export default defineConfig({
  envPrefix: 'APP_'
})
```

## 插件配置

### 官方插件

```javascript
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    react(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```

### 社区插件

```javascript
import vitePluginImp from 'vite-plugin-imp'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: 'antd/es/{{member}}/style'
        }
      ]
    }),
    svgLoader()
  ]
})
```

## 高级配置

### optimizeDeps

依赖预构建配置。

```javascript
export default defineConfig({
  optimizeDeps: {
    include: ['lodash', 'axios'],
    exclude: ['@vue/runtime-dom']
  }
})
```

### ssr

SSR 配置。

```javascript
export default defineConfig({
  ssr: {
    noExternal: ['vue', 'vue-router'],
    external: ['lodash']
  }
})
```

### worker

Web Worker 配置。

```javascript
export default defineConfig({
  worker: {
    format: 'es'
  }
})
```

## 配置示例

### 基础 Vue 项目配置

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['ant-design-vue']
        }
      }
    }
  }
})
```

### 基础 React 项目配置

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material']
        }
      }
    }
  }
})
```

### 生产环境优化配置

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['ant-design-vue'],
          utils: ['axios', 'lodash']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'ant-design-vue', 'axios', 'lodash']
  }
})
```

## 配置最佳实践

### 1. 环境分离

为不同环境创建不同的配置文件：

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import baseConfig from './vite.config.base.js'
import devConfig from './vite.config.dev.js'
import prodConfig from './vite.config.prod.js'

const configs = {
  development: devConfig,
  production: prodConfig
}

export default defineConfig({
  ...baseConfig,
  ...configs[process.env.NODE_ENV]
})
```

### 2. 类型安全

使用 TypeScript 配置文件获取类型提示：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  // 配置选项会有类型提示
})
```

### 3. 性能优化

- **合理使用别名**：简化导入路径
- **配置代码分割**：减小初始加载体积
- **优化依赖预构建**：提升开发速度
- **合理设置缓存**：提高构建速度

### 4. 安全性

- **使用 HTTPS**：在生产环境中启用 HTTPS
- **配置 CORS**：正确设置跨域策略
- **环境变量管理**：不要在配置文件中硬编码敏感信息

### 5. 可维护性

- **模块化配置**：将配置拆分为多个文件
- **注释说明**：为复杂配置添加注释
- **版本控制**：将配置文件纳入版本控制

## 总结

Vite 提供了丰富的配置选项，可以根据项目的具体需求进行自定义。合理的配置可以提高开发效率，优化构建性能，提升应用的用户体验。

在配置 Vite 时，应该：

1. 了解项目的具体需求
2. 参考官方文档
3. 从基础配置开始，逐步添加高级配置
4. 测试配置的效果
5. 定期更新配置以适应项目的变化

通过合理的配置，Vite 可以为你的项目提供最佳的开发和构建体验。