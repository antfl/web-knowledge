import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteImagemin from 'vite-plugin-imagemin'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    // 图片压缩
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
    }),
    // Gzip 压缩
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false
    }),
    // Brotli 压缩
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    }),
    // 构建分析
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
        // 代码分割
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['ant-design-vue'],
          utils: ['axios', 'lodash'],
          charts: ['echarts']
        },
        // 文件名哈希，用于缓存控制
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  // 依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'lodash', 'ant-design-vue', 'echarts'],
    exclude: []
  },
  // ESBuild 配置
  esbuild: {
    // 移除控制台输出和调试器
    drop: ['console', 'debugger'],
    // 目标浏览器
    target: 'es2015'
  },
  // 服务器配置
  server: {
    port: 3000,
    open: true,
    hmr: true
  }
})
