# Vite 性能优化

Vite 作为现代前端构建工具，本身已经具备出色的性能表现，但通过合理的优化策略，可以进一步提升应用的性能和用户体验。本文档详细介绍 Vite 项目的性能优化策略和最佳实践。

## 目录

1. [性能指标](#性能指标)
2. [构建优化](#构建优化)
3. [运行时优化](#运行时优化)
4. [资源优化](#资源优化)
5. [网络优化](#网络优化)
6. [代码优化](#代码优化)
7. [性能监控](#性能监控)
8. [最佳实践](#最佳实践)
9. [常见问题](#常见问题)
10. [示例](#示例)

## 性能指标

### 核心 Web 性能指标

1. **LCP (Largest Contentful Paint)**：最大内容绘制时间，衡量页面主要内容加载完成的时间
2. **FID (First Input Delay)**：首次输入延迟，衡量用户首次交互的响应时间
3. **CLS (Cumulative Layout Shift)**：累积布局偏移，衡量页面元素的意外移动
4. **TTFB (Time to First Byte)**：首字节时间，衡量服务器响应速度
5. **FCP (First Contentful Paint)**：首次内容绘制，衡量页面开始显示内容的时间
6. **TTI (Time to Interactive)**：可交互时间，衡量页面完全可交互的时间

### 性能测试工具

- **Lighthouse**：Google 开发的网站性能评估工具
- **WebPageTest**：详细的网站性能测试工具
- **Chrome DevTools**：浏览器内置的开发工具
- **Vitals**：Google 的核心 Web 性能指标监控

## 构建优化

### 依赖预构建

Vite 会自动预构建依赖，将 CommonJS 依赖转换为 ESM 格式，提高加载速度：

```javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    include: ['lodash', 'axios'],
    exclude: ['node_modules']
  }
})
```

### 代码分割

合理的代码分割可以减小初始加载体积：

```javascript
// vite.config.js
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

### 压缩优化

使用 ESBuild 进行快速压缩：

```javascript
// vite.config.js
export default defineConfig({
  build: {
    minify: 'esbuild',
    cssCodeSplit: true
  }
})
```

### Tree Shaking

Vite 默认启用 Tree Shaking，移除未使用的代码：

```javascript
// 按需导入，避免导入整个库
import { debounce } from 'lodash'
// 而不是 import _ from 'lodash'
```

## 运行时优化

### 按需加载

使用动态导入实现按需加载：

```javascript
// 路由懒加载
const Home = () => import('./views/Home.vue')
const About = () => import('./views/About.vue')

// 组件懒加载
const Modal = defineAsyncComponent(() => import('./components/Modal.vue'))
```

### 缓存策略

合理的缓存策略可以提高重复访问的性能：

```javascript
// vite.config.js
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

### 预加载

使用预加载提升关键资源的加载速度：

```html
<link rel="preload" href="/assets/js/main.js" as="script">
<link rel="preload" href="/assets/css/main.css" as="style">
<link rel="preload" href="/assets/fonts/font.woff2" as="font" type="font/woff2" crossorigin>
```

### 预连接

对第三方域名使用预连接：

```html
<link rel="preconnect" href="https://api.example.com">
<link rel="preconnect" href="https://cdn.example.com">
```

## 资源优化

### 图片优化

1. **使用适当的图片格式**：
   - WebP：现代浏览器支持，体积更小
   - AVIF：比 WebP 更小，但兼容性稍差
   - SVG：适合图标和简单图形

2. **图片压缩**：
   ```javascript
   // vite.config.js
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
         }
       })
     ]
   })
   ```

3. **懒加载图片**：
   ```html
   <img src="placeholder.jpg" data-src="image.jpg" loading="lazy" alt="Image">
   ```

### 字体优化

1. **字体子集化**：只包含使用的字符
2. **字体加载策略**：
   ```css
   @font-face {
     font-family: 'CustomFont';
     src: url('./fonts/custom-font.woff2') format('woff2');
     font-display: swap;
   }
   ```
3. **预加载关键字体**：
   ```html
   <link rel="preload" href="/fonts/custom-font.woff2" as="font" type="font/woff2" crossorigin>
   ```

### CSS 优化

1. **提取关键 CSS**：将首屏所需的 CSS 内联到 HTML 中
2. **CSS 模块化**：使用 CSS Modules 或 CSS-in-JS
3. **避免 CSS 阻塞**：使用 `media` 属性和异步加载

### JavaScript 优化

1. **减少包体积**：
   - 按需导入库
   - 使用 Tree Shaking
   - 移除未使用的代码

2. **代码分割**：
   - 按路由分割
   - 按功能分割
   - 按使用频率分割

3. **避免长任务**：
   - 使用 Web Workers 处理复杂计算
   - 优化循环和算法
   - 避免同步操作阻塞主线程

## 网络优化

### CDN 使用

使用 CDN 分发静态资源，提高加载速度：

```javascript
// vite.config.js
export default defineConfig({
  base: 'https://cdn.example.com/'
})
```

### 压缩传输

启用 Gzip 和 Brotli 压缩：

```javascript
// vite.config.js
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240
    })
  ]
})
```

### HTTP/2 和 HTTP/3

使用 HTTP/2 或 HTTP/3 协议，支持多路复用和头部压缩。

### 缓存控制

合理设置缓存控制头：

```nginx
location /assets/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## 代码优化

### 代码质量

1. **使用 ESLint**：确保代码质量和一致性
2. **使用 TypeScript**：提供类型安全
3. **代码审查**：定期进行代码审查

### 算法优化

1. **时间复杂度**：优化算法的时间复杂度
2. **空间复杂度**：优化算法的空间复杂度
3. **避免重复计算**：使用缓存和记忆化

### 渲染优化

1. **虚拟列表**：处理长列表
2. **防抖和节流**：优化事件处理
3. **批量更新**：减少 DOM 操作
4. **避免强制回流**：合理使用 CSS 和 JavaScript

## 性能监控

### 构建分析

使用 rollup-plugin-visualizer 分析构建产物：

```javascript
// vite.config.js
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

### 运行时监控

1. **Core Web Vitals**：监控核心 Web 性能指标
2. **自定义指标**：监控特定的性能指标
3. **错误监控**：监控运行时错误

### A/B 测试

通过 A/B 测试验证优化效果：

- 测试不同的优化策略
- 比较性能指标
- 选择最佳方案

## 最佳实践

### 开发环境优化

1. **使用 Vite 开发服务器**：利用其快速的热更新
2. **合理配置开发环境**：避免不必要的插件和配置
3. **使用别名**：简化模块导入路径

### 生产环境优化

1. **最小化构建**：启用代码压缩和 Tree Shaking
2. **合理的缓存策略**：使用文件名哈希和长期缓存
3. **按需加载**：减少初始加载体积
4. **资源优化**：压缩图片、字体等资源

### 团队协作

1. **性能预算**：设置性能预算，确保团队遵守
2. **性能审查**：定期进行性能审查
3. **文档化**：记录性能优化策略和最佳实践

### 持续优化

1. **监控性能**：持续监控应用性能
2. **分析瓶颈**：定期分析性能瓶颈
3. **迭代优化**：不断优化和改进

## 常见问题

### 1. 构建产物过大

**问题**：构建产物体积过大，影响加载速度

**解决方案**：
- 分析构建产物，识别大文件
- 优化代码分割
- 按需导入库
- 压缩资源
- 使用 Tree Shaking

### 2. 首屏加载慢

**问题**：首屏加载时间过长

**解决方案**：
- 减少初始加载体积
- 使用预加载
- 优化关键路径
- 合理使用缓存
- 考虑服务端渲染

### 3. 运行时性能差

**问题**：应用运行时性能差，卡顿明显

**解决方案**：
- 优化渲染性能
- 避免长任务
- 使用 Web Workers
- 优化算法
- 减少 DOM 操作

### 4. 内存泄漏

**问题**：应用内存使用持续增长，导致性能下降

**解决方案**：
- 检查事件监听器
- 清理定时器
- 避免循环引用
- 使用 WeakMap 和 WeakSet
- 定期检查内存使用

### 5. 网络请求过多

**问题**：网络请求过多，影响加载速度

**解决方案**：
- 合并请求
- 使用 HTTP/2 或 HTTP/3
- 合理使用缓存
- 优化资源加载顺序
- 考虑使用 Service Worker

## 示例

### 性能优化配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteImagemin from 'vite-plugin-imagemin'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
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
    include: ['vue', 'vue-router', 'pinia', 'axios', 'lodash']
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})
```

### 前端代码优化

```javascript
// 按需导入
import { debounce } from 'lodash'

// 路由懒加载
const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
]

// 防抖处理
const handleSearch = debounce((query) => {
  // 搜索逻辑
}, 300)

// 虚拟列表组件
import { defineComponent, computed, ref } from 'vue'

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true
    },
    itemHeight: {
      type: Number,
      default: 50
    }
  },
  setup(props) {
    const containerRef = ref(null)
    const scrollTop = ref(0)
    
    const visibleItems = computed(() => {
      const start = Math.floor(scrollTop.value / props.itemHeight)
      const end = Math.min(
        start + Math.ceil(containerRef.value.clientHeight / props.itemHeight) + 1,
        props.items.length
      )
      return props.items.slice(start, end)
    })
    
    const containerStyle = computed(() => ({
      height: `${props.items.length * props.itemHeight}px`
    }))
    
    const wrapperStyle = computed(() => ({
      transform: `translateY(${Math.floor(scrollTop.value / props.itemHeight) * props.itemHeight}px)`
    }))
    
    const handleScroll = (e) => {
      scrollTop.value = e.target.scrollTop
    }
    
    return {
      containerRef,
      visibleItems,
      containerStyle,
      wrapperStyle,
      handleScroll
    }
  }
})
```

### 服务端配置

```nginx
server {
  listen 80;
  server_name example.com;
  
  root /var/www/html;
  index index.html;
  
  # 静态资源缓存
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
  
  # Gzip 压缩
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
  gzip_min_length 1024;
  gzip_comp_level 6;
  gzip_vary on;
  
  # 处理单页应用路由
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## 总结

Vite 性能优化是一个持续的过程，需要从多个方面入手：

1. **构建优化**：合理配置 Vite，优化构建产物
2. **运行时优化**：提升应用的运行时性能
3. **资源优化**：优化图片、字体、CSS 和 JavaScript 等资源
4. **网络优化**：改善网络传输和缓存策略
5. **代码优化**：提高代码质量和执行效率
6. **性能监控**：持续监控和分析性能指标

通过综合运用这些优化策略，你可以显著提升 Vite 项目的性能，为用户提供更好的体验。记住，性能优化是一个迭代的过程，需要不断地分析、优化和验证，才能达到最佳效果。