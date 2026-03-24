import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // 服务器配置
  server: {
    port: 3000,
    open: true
  },
  // 构建配置
  build: {
    // 服务端构建配置
    ssr: true,
    outDir: 'dist/server',
    rollupOptions: {
      input: resolve(__dirname, 'src/entry-server.js'),
      output: {
        format: 'cjs'
      }
    }
  }
})
