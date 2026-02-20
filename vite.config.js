import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      '/llm': { target: 'http://localhost:3005', changeOrigin: true },
      '/memory': { target: 'http://localhost:3005', changeOrigin: true },
      '/file': { target: 'http://localhost:3005', changeOrigin: true },
      '/plugins': { target: 'http://localhost:3005', changeOrigin: true },
    },
  },
})
