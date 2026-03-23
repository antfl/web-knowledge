# Vite 构建优化

Vite 提供了多种构建优化选项，可以显著提升应用的性能和用户体验。本文档详细介绍 Vite 构建优化的各种策略和配置。

## 目录

1. [构建优化基础](#构建优化基础)
2. [代码分割](#代码分割)
3. [资源优化](#资源优化)
4. [缓存策略](#缓存策略)
5. [Tree Shaking](#tree-shaking)
6. [压缩优化](#压缩优化)
7. [预加载策略](#预加载策略)
8. [构建分析](#构建分析)
9. [多环境构建](#多环境构建)
10. [CI/CD 集成](#cicd-集成)
11. [最佳实践](#最佳实践)
12. [常见问题](#常见问题)
13. [示例](#示例)

## 构建优化基础

### 什么是构建优化？

构建优化是指通过各种技术手段，减小构建产物的体积，提高应用的加载速度和运行性能。Vite 的构建优化主要包括：

- 减小文件体积
- 提高加载速度
- 优化缓存策略
- 提升运行性能

### Vite 的构建过程

Vite 的构建过程包括：

1. **依赖预构建**：将 CommonJS 依赖转换为 ESM
2. **代码转换**：处理 TypeScript、JSX 等
3. **代码分割**：将代码分割成多个块
4. **Tree Shaking**：移除未使用的代码
5. **压缩**：压缩 JavaScript、CSS 等
6. **生成资源**：生成最终的构建产物

## 代码分割

### 什么是代码分割？

代码分割是将代码拆分成多个小块，按需加载，从而减小初始加载体积，提高首屏加载速度。

### 自动代码分割

Vite 会自动分割代码：

- **异步导入**：使用 `import()` 语法的模块会被自动分割
- **动态导入**：使用 `import.meta.glob()` 导入的模块会被分割
- **第三方库**：默认会被分割到单独的 chunk

### 手动代码分割

在 `vite.config.js` 中配置 `manualChunks`：

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['ant-design-vue'],
          utils: ['axios', 'lodash']
        }
      }
    }
  }
})
```

### 基于文件路径的代码分割

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@vue')) {
              return 'vendor';
            } else if (id.includes('ant-design')) {
              return 'ui';
            } else if (id.includes('axios') || id.includes('lodash')) {
              return 'utils';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
```

## 资源优化

### 图片优化

#### 图片压缩

使用 `vite-plugin-imagemin` 插件：

```javascript
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.8, 0.9]
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    })
  ]
})
```

#### 图片格式转换

- **WebP**：现代浏览器支持，体积更小
- **AVIF**：比 WebP 更小，但兼容性稍差
- **SVG**：适合图标和简单图形

### 字体优化

#### 字体子集化

只包含使用的字符，减小字体文件体积：

```css
/* 只包含常用字符 */
@font-face {
  font-family: 'CustomFont';
  src: url('./fonts/custom-font-subset.woff2') format('woff2');
  font-display: swap;
}
```

#### 字体加载策略

- **font-display: swap**：优先使用系统字体，字体加载后替换
- **预加载**：对关键字体使用 `preload`
- **异步加载**：对非关键字体使用异步加载

### CSS 优化

#### CSS 提取

```javascript
export default defineConfig({
  build: {
    cssCodeSplit: true // 默认为 true
  }
})
```

#### CSS 压缩

```javascript
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('cssnano')({
          preset: 'default'
        })
      ]
    }
  }
})
```

### JavaScript 优化

#### 代码压缩

```javascript
export default defineConfig({
  build: {
    minify: 'esbuild' // 'esbuild' | 'terser' | false
  }
})
```

#### 移除控制台输出

```javascript
export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger']
  }
})
```

## 缓存策略

### 文件名哈希

Vite 默认会在文件名中添加哈希值，用于缓存控制：

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
```

### 长期缓存

- **文件名哈希**：确保内容变化时文件名变化
- **合理的缓存策略**：对静态资源设置长缓存时间
- **CDN 缓存**：配置 CDN 缓存策略

### 缓存失效策略

- **版本化资源**：使用文件名哈希或版本号
- **清除旧缓存**：部署时清理旧缓存
- **缓存控制头**：设置适当的 `Cache-Control` 头

## Tree Shaking

### 什么是 Tree Shaking？

Tree Shaking 是一种通过静态分析，移除未使用代码的技术，减小构建产物体积。

### 如何启用 Tree Shaking

Vite 默认启用 Tree Shaking，无需额外配置。确保：

- 使用 ES 模块
- 避免副作用
- 合理组织代码结构

### Tree Shaking 最佳实践

- **按需导入**：只导入需要的模块
- **避免默认导入**：使用命名导入
- **模块化设计**：将代码拆分为小模块
- **避免副作用**：确保模块可以被安全移除

## 压缩优化

### Gzip 压缩

使用 `vite-plugin-compression` 插件：

```javascript
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 10kb
      deleteOriginFile: false
    })
  ]
})
```

### Brotli 压缩

Brotli 压缩比 Gzip 更小：

```javascript
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240
    })
  ]
})
```

### 服务器配置

确保服务器正确处理压缩文件：

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_vary on;
```

## 预加载策略

### 预加载（Preload）

对关键资源使用 `preload`：

```html
<link rel="preload" href="/assets/js/main-123.js" as="script">
<link rel="preload" href="/assets/css/main-123.css" as="style">
<link rel="preload" href="/assets/fonts/font.woff2" as="font" type="font/woff2" crossorigin>
```

### 预连接（Preconnect）

对第三方域名使用 `preconnect`：

```html
<link rel="preconnect" href="https://api.example.com">
<link rel="preconnect" href="https://cdn.example.com">
```

### 预获取（Prefetch）

对非关键资源使用 `prefetch`：

```html
<link rel="prefetch" href="/assets/js/async-123.js">
```

## 构建分析

### 使用 rollup-plugin-visualizer

```javascript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

### 分析报告解读

- **文件大小**：识别大文件
- **依赖关系**：分析模块依赖
- **代码重复**：发现重复代码
- **优化机会**：识别可优化的部分

## 多环境构建

### 开发环境

```javascript
// vite.config.dev.js
export default {
  build: {
    sourcemap: true,
    minify: false
  }
}
```

### 生产环境

```javascript
// vite.config.prod.js
export default {
  build: {
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['ant-design-vue']
        }
      }
    }
  }
}
```

### 测试环境

```javascript
// vite.config.test.js
export default {
  build: {
    sourcemap: true,
    minify: 'esbuild'
  }
}
```

## CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/build.yml
name: Build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Upload artifact
        uses: actions/upload-artifact@v2
        with:
          name: build
          path: dist
```

### GitLab CI

```yaml
# .gitlab-ci.yml
build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist
  only:
    - main
```

## 最佳实践

### 1. 代码分割策略

- **合理的代码分割**：根据功能和使用频率分割代码
- **避免过度分割**：不要分割过小的模块
- **优先级**：优先分割第三方库和大型组件

### 2. 资源优化

- **图片优化**：使用适当的格式和压缩
- **字体优化**：使用字体子集和合适的加载策略
- **CSS 优化**：提取关键 CSS，避免重复

### 3. 缓存策略

- **文件名哈希**：确保内容变化时文件名变化
- **长期缓存**：对静态资源设置长缓存时间
- **缓存控制**：合理设置缓存控制头

### 4. 构建配置

- **使用 ESBuild**：更快的构建速度
- **启用 Tree Shaking**：移除未使用的代码
- **合理的压缩**：平衡压缩率和构建速度

### 5. 性能监控

- **构建分析**：定期分析构建产物
- **性能测试**：使用 Lighthouse 等工具测试
- **监控指标**：关注首屏加载时间、LCP、FID 等指标

## 常见问题

### 1. 构建产物过大

**问题**：构建产物体积过大

**解决方案**：
- 检查是否有未使用的依赖
- 优化代码分割
- 启用 Tree Shaking
- 压缩资源
- 分析构建报告

### 2. 构建速度慢

**问题**：构建速度慢

**解决方案**：
- 使用 ESBuild 压缩
- 合理配置依赖预构建
- 避免不必要的插件
- 优化构建配置

### 3. 缓存失效

**问题**：缓存策略不当导致缓存失效

**解决方案**：
- 使用文件名哈希
- 合理设置缓存控制头
- 避免在文件名中包含版本号
- 清理旧缓存

### 4. 代码分割不合理

**问题**：代码分割导致过多的网络请求

**解决方案**：
- 调整代码分割策略
- 合并过小的 chunk
- 合理设置分割阈值

## 示例

### 基础优化配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240
    }),
    visualizer({
      open: true,
      gzipSize: true
    })
  ],
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
  }
})
```

### 高级优化配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import viteImagemin from 'vite-plugin-imagemin'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.8, 0.9]
      }
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240
    }),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@vue')) {
              return 'vendor';
            } else if (id.includes('ant-design')) {
              return 'ui';
            } else if (id.includes('axios') || id.includes('lodash')) {
              return 'utils';
            } else if (id.includes('echarts')) {
              return 'charts';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})
```

## 总结

Vite 构建优化是提高应用性能的重要手段。通过合理的代码分割、资源优化、缓存策略和构建配置，可以显著提升应用的加载速度和用户体验。

在进行构建优化时，应该：

1. **分析构建产物**：使用构建分析工具识别问题
2. **合理配置**：根据项目特点选择合适的优化策略
3. **测试验证**：使用性能测试工具验证优化效果
4. **持续优化**：定期检查和更新优化策略

通过不断优化构建过程，你可以构建出更小、更快、更高效的前端应用，为用户提供更好的体验。