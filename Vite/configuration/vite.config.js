/**
 * Vite 配置选项示例
 * 包含了 Vite 的各种配置选项
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 基础配置
  root: './',
  base: '/',
  mode: process.env.NODE_ENV || 'development',
  
  // 全局常量
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'https://api.example.com'),
    __DEBUG__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  
  // 插件
  plugins: [
    // Vue 插件
    // vue(),
    
    // React 插件
    // react(),
    
    //  legacy 插件（用于支持旧浏览器）
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  
  // 开发服务器配置
  server: {
    port: 5173,
    open: true,
    host: 'localhost',
    https: false,
    
    // 代理配置
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true
      }
    },
    
    // CORS 配置
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    
    // 文件监听配置
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**', '**/build/**'],
      usePolling: false,
      interval: 100,
      binaryInterval: 300,
      depth: 99,
      followSymlinks: true
    }
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 4096, // 4kb
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild', // 'esbuild', 'terser', false
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    write: true,
    emptyOutDir: true,
    manifest: false,
    lib: false,
    ssr: false,
    ssrManifest: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          // 第三方库
          vendor: ['vue', 'vue-router', 'pinia'],
          // UI 库
          ui: ['ant-design-vue', '@mui/material'],
          // 工具库
          utils: ['axios', 'lodash', 'dayjs'],
          // 图表库
          charts: ['echarts', 'd3']
        },
        // 输出文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 代码分割策略
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@vue')) {
              return 'vendor';
            } else if (id.includes('ant-design') || id.includes('@mui')) {
              return 'ui';
            } else if (id.includes('axios') || id.includes('lodash')) {
              return 'utils';
            } else if (id.includes('echarts') || id.includes('d3')) {
              return 'charts';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@api': path.resolve(__dirname, './src/api')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    dedupe: ['vue', 'vue-router'],
    preserveSymlinks: false
  },
  
  // CSS 配置
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]__[hash:base64:5]',
      globalModulePaths: [],
      hashPrefix: '',
      scopeBehaviour: 'local'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
        quietDeps: true
      },
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#1890ff'
        }
      },
      stylus: {
        define: {
          $primary: '#1890ff'
        }
      }
    },
    postcss: {
      plugins: [
        // 自动添加浏览器前缀
        require('autoprefixer')({
          overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead']
        }),
        // CSS 压缩
        require('cssnano')({
          preset: 'default'
        })
      ]
    }
  },
  
  // JSON 配置
  json: {
    namedExports: true,
    stringify: false
  },
  
  // esbuild 配置
  esbuild: {
    target: 'es2015',
    charset: 'utf8',
    logLevel: 'warning',
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    loader: {
      '.js': 'jsx',
      '.ts': 'tsx'
    },
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    sourcemap: false
  },
  
  // 依赖预构建
  optimizeDeps: {
    entries: ['index.html'],
    include: [
      'vue', 'vue-router', 'pinia',
      'axios', 'lodash', 'dayjs',
      'ant-design-vue', '@mui/material'
    ],
    exclude: ['@vue/runtime-dom'],
    keepNames: false,
    esbuildOptions: {
      target: 'es2015',
      loader: {
        '.js': 'jsx'
      }
    }
  },
  
  // SSR 配置
  ssr: {
    format: 'esm',
    target: 'node',
    external: ['lodash', 'axios'],
    noExternal: ['vue', 'vue-router', 'pinia'],
    optimizeDeps: {
      include: ['@vue/server-renderer']
    }
  },
  
  // Web Worker 配置
  worker: {
    format: 'es',
    plugins: [],
    rollupOptions: {}
  },
  
  // 环境变量
  envDir: './env',
  envPrefix: 'VITE_',
  
  // 日志配置
  logLevel: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
  clearScreen: true,
  
  // 预览服务器配置
  preview: {
    port: 4173,
    open: true,
    host: 'localhost',
    https: false,
    strictPort: false,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})

/**
 * 配置说明：
 * 
 * 1. 基础配置
 *    - root: 项目根目录
 *    - base: 基础路径
 *    - mode: 运行模式
 *    - define: 全局常量
 * 
 * 2. 开发服务器
 *    - port: 端口
 *    - open: 自动打开浏览器
 *    - proxy: 代理配置
 *    - cors: CORS 配置
 * 
 * 3. 构建配置
 *    - outDir: 输出目录
 *    - assetsDir: 静态资源目录
 *    - sourcemap: 是否生成 source map
 *    - rollupOptions: Rollup 配置
 * 
 * 4. 解析配置
 *    - alias: 路径别名
 *    - extensions: 文件扩展名
 * 
 * 5. CSS 配置
 *    - modules: CSS 模块配置
 *    - preprocessorOptions: 预处理器选项
 *    - postcss: PostCSS 配置
 * 
 * 6. 其他配置
 *    - esbuild: esbuild 配置
 *    - optimizeDeps: 依赖预构建
 *    - ssr: SSR 配置
 *    - worker: Web Worker 配置
 */

/**
 * 如何使用此配置：
 * 
 * 1. 根据项目类型取消注释相应的插件（vue 或 react）
 * 2. 根据项目需求修改配置选项
 * 3. 运行 npm run dev 启动开发服务器
 * 4. 运行 npm run build 构建生产版本
 */
