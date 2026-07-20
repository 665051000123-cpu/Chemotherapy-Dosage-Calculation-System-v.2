import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['ram2-webapp01.ram2.local'] as any,
    port: 5003,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5004',
        changeOrigin: true,
      },
    },
  },
})