import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://moneywise-backend-187q.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
