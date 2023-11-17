import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    port: 5173,
    host:'0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:19001',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  build: {

  },
  plugins: [
    vue(),
  ],
  css: {
    extract: false,
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    dedupe: ['vue']
  }
})
