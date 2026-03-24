import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [
      vue()
    ],
    server: {
      // 代理配置
      proxy: {
        // 基础 API 代理
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: mode === 'production',
          configure: (proxy, options) => {
            // 自定义代理配置
            proxy.on('error', (err, req, res) => {
              console.log('代理错误:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // 修改代理请求
              proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
              // 可以添加认证信息
              // proxyReq.setHeader('Authorization', 'Bearer token');
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              // 修改代理响应
              proxyRes.headers['X-Proxy-Header'] = 'Vite Proxy';
            });
          }
        },
        // WebSocket 代理
        '/ws': {
          target: 'ws://localhost:3000',
          ws: true,
          changeOrigin: true
        },
        // 认证服务代理
        '/auth': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth/, '')
        }
      }
    },
    // 其他配置
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  }
})
