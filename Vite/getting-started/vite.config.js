/**
 * Vite 基础配置示例
 * 这是一个最基本的 Vite 配置文件
 */

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // 项目根目录
  root: './',
  
  // 开发服务器配置
  server: {
    // 端口
    port: 5173,
    
    // 自动打开浏览器
    open: true,
    
    // 主机
    host: 'localhost'
  },
  
  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 静态资源目录
    assetsDir: 'assets',
    
    // 生成 source map
    sourcemap: false,
    
    // 代码分割
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks: {
          // 将第三方库单独打包
          vendor: ['vue', 'react', 'lodash']
        }
      }
    }
  },
  
  // 插件
  plugins: [
    // 这里可以添加各种 Vite 插件
    // 例如: vue()、react() 等
  ],
  
  // 解析配置
  resolve: {
    // 别名
    alias: {
      '@': '/src'
    }
  }
})

/**
 * 配置说明：
 * 
 * 1. root: 项目的根目录，默认为 './'
 * 2. server: 开发服务器配置
 *    - port: 开发服务器端口
 *    - open: 是否自动打开浏览器
 *    - host: 主机名
 * 
 * 3. build: 构建配置
 *    - outDir: 构建输出目录
 *    - assetsDir: 静态资源目录
 *    - sourcemap: 是否生成 source map
 *    - rollupOptions: Rollup 配置选项
 * 
 * 4. plugins: Vite 插件数组
 * 
 * 5. resolve: 模块解析配置
 *    - alias: 路径别名
 */

/**
 * 如何使用这个配置文件：
 * 
 * 1. 将此文件保存为项目根目录的 vite.config.js
 * 2. 根据你的项目需求修改配置
 * 3. 运行 npm run dev 启动开发服务器
 * 4. 运行 npm run build 构建生产版本
 */
