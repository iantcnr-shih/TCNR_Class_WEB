import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        // target: 'http://127.0.0.1:8000',
        // target: 'http://192.168.12.106:8000',
        target: 'http://10.140.241.130:8000',
        changeOrigin: true,
      }
    }
  },
  base: "/TCNR_Class_WEB/",
})