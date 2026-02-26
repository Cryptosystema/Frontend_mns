import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/stream': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    },
    headers: {
      // Разрешить eval для Three.js в dev-режиме (НЕ для production)
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src *; img-src * data:;"
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
