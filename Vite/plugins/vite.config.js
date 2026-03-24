/**
 * Vite 插件配置示例
 * 演示如何使用各种 Vite 插件
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { VitePWA } from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import svgLoader from 'vite-svg-loader'
import htmlPlugin from 'vite-plugin-html'
import compression from 'vite-plugin-compression'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// 自定义插件示例
function myCustomPlugin(options = {}) {
  return {
    name: 'my-custom-plugin',
    
    config(config, env) {
      return {
        define: {
          __CUSTOM_VERSION__: JSON.stringify('1.0.0')
        }
      }
    },
    
    transform(code, id) {
      if (id.endsWith('.js')) {
        return code.replace(/\bconsole\.log\(/g, 'console.log(\'[CUSTOM]\', ')
      }
      return code
    },
    
    buildEnd(error) {
      if (!error) {
        console.log('Custom plugin: Build completed!')
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  // 插件配置
  plugins: [
    // 框架插件（二选一）
    // vue(), // Vue 3 支持
    // react(), // React 支持
    
    // Legacy 插件（旧浏览器支持）
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    
    // PWA 插件（生产环境）
    process.env.NODE_ENV === 'production' && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.svg'],
      manifest: {
        name: 'My Vite App',
        short_name: 'Vite App',
        description: 'A Vite application with PWA support',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'icons/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 小时
              }
            }
          }
        ]
      }
    }),
    
    // 自动导入
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          axios: [['default', 'axios']]
        }
      ],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true
      }
    }),
    
    // 组件自动导入
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
      include: [/\.(vue|ts|js)\b/]
    }),
    
    // SVG 加载器
    svgLoader({
      defaultImport: 'component'
    }),
    
    // SVG 图标插件
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, 'src/icons')],
      symbolId: 'icon-[dir]-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__'
    }),
    
    // HTML 插件
    htmlPlugin({
      title: 'Vite App',
      inject: {
        data: {
          appTitle: 'My Vite Application',
          appDescription: 'A modern Vite application'
        },
        tags: [
          {
            injectTo: 'body-prepend',
            tag: 'div',
            attrs: {
              id: 'loading',
              style: 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #fff; z-index: 9999;'
            },
            children: 'Loading...'
          }
        ]
      }
    }),
    
    // 压缩插件
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 10kb
      deleteOriginFile: false
    }),
    
    // 自定义插件
    myCustomPlugin(),
    
    // 条件插件
    process.env.NODE_ENV === 'development' && {
      name: 'dev-only-plugin',
      configureServer(server) {
        server.middlewares.use('/dev-api', (req, res) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            message: 'Development API',
            timestamp: Date.now()
          }))
        })
      }
    }
  ].filter(Boolean),
  
  // 其他配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  server: {
    port: 3000,
    open: true
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})

/**
 * 插件说明：
 * 
 * 1. 框架插件
 *    - @vitejs/plugin-vue: Vue 3 支持
 *    - @vitejs/plugin-react: React 支持
 * 
 * 2. 官方插件
 *    - @vitejs/plugin-legacy: 旧浏览器支持
 *    - vite-plugin-pwa: PWA 支持
 * 
 * 3. 社区插件
 *    - unplugin-auto-import: 自动导入
 *    - unplugin-vue-components: 组件自动导入
 *    - vite-svg-loader: SVG 加载器
 *    - vite-plugin-svg-icons: SVG 图标
 *    - vite-plugin-html: HTML 处理
 *    - vite-plugin-compression: 压缩输出
 * 
 * 4. 自定义插件
 *    - myCustomPlugin: 示例自定义插件
 * 
 * 5. 条件插件
 *    - 仅在开发环境使用的插件
 */

/**
 * 如何使用：
 * 
 * 1. 安装所需插件：
 *    npm install @vitejs/plugin-vue @vitejs/plugin-legacy vite-plugin-pwa unplugin-auto-import unplugin-vue-components vite-svg-loader vite-plugin-html vite-plugin-compression vite-plugin-svg-icons
 * 
 * 2. 根据项目类型取消注释相应的框架插件
 * 
 * 3. 运行 npm run dev 启动开发服务器
 * 
 * 4. 运行 npm run build 构建生产版本
 */
