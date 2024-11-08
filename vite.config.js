import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.REACT_APP_BACKEND_URL': JSON.stringify(env.REACT_APP_BACKEND_URL),
      'process.env.REACT_APP_BACKEND_SOCKET':JSON.stringify(env.REACT_APP_BACKEND_SOCKET)
    },
    plugins: [react()],
    build: {
      outDir: 'dist',
      // Asegurarse de que los assets se manejen correctamente
      assetsDir: 'assets',
      // Es importante que esto esté en '/'
      base: '/'
    }
    // server:{
    //   host: true
    // }
    // server: {
    //   proxy: {
    //     '/api': 'http://localhost:5000/api'
    //   }
    // }
  }
})