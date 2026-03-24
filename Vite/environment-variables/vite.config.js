/**
 * Vite 环境变量配置示例
 * 演示如何在 Vite 配置中使用环境变量
 */

import { defineConfig } from 'vite'
import path from 'path'

// 加载环境变量
// Vite 会自动加载 .env 文件，所以这里不需要手动加载

// https://vitejs.dev/config/
export default defineConfig({
  // 基础配置
  base: process.env.VITE_BASE_URL || '/',
  
  // 全局常量
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION || '1.0.0'),
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'https://api.example.com'),
    __DEBUG__: JSON.stringify(process.env.VITE_DEBUG === 'true'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // 环境变量配置
  envDir: process.env.VITE_ENV_DIR || './', // 环境变量文件目录
  envPrefix: 'VITE_', // 环境变量前缀
  
  // 开发服务器配置
  server: {
    port: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 3000,
    open: process.env.VITE_OPEN === 'true',
    host: process.env.VITE_HOST || 'localhost',
    https: process.env.VITE_HTTPS === 'true',
    
    // 代理配置
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: process.env.VITE_PROXY_SECURE !== 'false'
      }
    }
  },
  
  // 构建配置
  build: {
    outDir: process.env.VITE_OUT_DIR || 'dist',
    assetsDir: process.env.VITE_ASSETS_DIR || 'assets',
    sourcemap: process.env.VITE_SOURCE_MAP === 'true',
    minify: process.env.VITE_MINIFY === 'false' ? false : 'esbuild',
    
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ...(process.env.VITE_ENABLE_UI_CHUNK === 'true' && {
            ui: ['ant-design-vue']
          }),
          ...(process.env.VITE_ENABLE_UTILS_CHUNK === 'true' && {
            utils: ['axios', 'lodash']
          })
        }
      }
    }
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      ...(process.env.VITE_ENABLE_ADDITIONAL_ALIASES === 'true' && {
        '@components': path.resolve(__dirname, './src/components'),
        '@utils': path.resolve(__dirname, './src/utils')
      })
    }
  },
  
  // CSS 配置
  css: {
    modules: {
      generateScopedName: process.env.VITE_CSS_MODULES_PATTERN || '[name]__[local]__[hash:base64:5]'
    },
    preprocessorOptions: {
      scss: {
        additionalData: process.env.VITE_SCSS_ADDITIONAL_DATA || ''
      }
    }
  },
  
  // esbuild 配置
  esbuild: {
    target: process.env.VITE_ESBUILD_TARGET || 'es2015',
    drop: process.env.NODE_ENV === 'production' && process.env.VITE_DROP_CONSOLE === 'true' 
      ? ['console', 'debugger'] 
      : []
  },
  
  // 依赖预构建
  optimizeDeps: {
    include: [
      'vue', 'vue-router',
      ...(process.env.VITE_OPTIMIZE_UTILS === 'true' ? ['axios', 'lodash'] : [])
    ]
  },
  
  // 日志配置
  logLevel: process.env.VITE_LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'info' : 'warn'),
  clearScreen: process.env.VITE_CLEAR_SCREEN !== 'false',
  
  // 预览服务器配置
  preview: {
    port: process.env.VITE_PREVIEW_PORT ? Number(process.env.VITE_PREVIEW_PORT) : 4173,
    open: process.env.VITE_PREVIEW_OPEN === 'true'
  }
})

/**
 * 配置说明：
 * 
 * 此配置文件演示了如何在 Vite 配置中使用环境变量
 * 所有配置项都可以通过环境变量来覆盖默认值
 * 
 * 示例环境变量文件：
 * 
 * # .env
 * VITE_APP_VERSION=1.0.0
 * VITE_API_URL=https://api.example.com
 * VITE_DEBUG=false
 * VITE_PORT=3000
 * 
 * # .env.development
 * VITE_API_URL=https://dev-api.example.com
 * VITE_DEBUG=true
 * VITE_PORT=3000
 * 
 * # .env.production
 * VITE_API_URL=https://api.example.com
 * VITE_DEBUG=false
 * VITE_PORT=3000
 * VITE_SOURCE_MAP=false
 * VITE_DROP_CONSOLE=true
 */

/**
 * 如何使用：
 * 
 * 1. 创建 .env 文件，设置基础环境变量
 * 2. 创建 .env.development 和 .env.production 文件，设置对应环境的变量
 * 3. 运行 npm run dev 启动开发服务器
 * 4. 运行 npm run build 构建生产版本
 */
