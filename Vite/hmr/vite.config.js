import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue()
  ],
  server: {
    // 热更新配置
    hmr: {
      // WebSocket 协议
      protocol: 'ws',
      // WebSocket 主机
      host: 'localhost',
      // WebSocket 端口（默认与开发服务器端口相同）
      // port: 3000,
      // WebSocket 路径
      path: '/ws',
      // 超时时间（毫秒）
      timeout: 30000,
      // 显示错误覆盖层
      overlay: true,
      // 客户端 WebSocket 端口（当服务器在不同端口时使用）
      // clientPort: 3000,
      // 是否启用服务器端 HMR
      server: false
    }
  },
  // 其他配置
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
