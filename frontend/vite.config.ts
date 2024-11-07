import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3007',
    //     changeOrigin: true
    //   }
    // }
  },
  define:
    process.env.NODE_ENV !== 'production'
      ? {
          'window.config': {
            VUE_APP_API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3007',
            VUE_APP_API_SOCKET_URL: process.env.API_SOCKET_URL || 'http://localhost:3001'
          }
        }
      : {},
  logLevel: 'info',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
