import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import * as path from 'node:path'
import './vite.init'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@vueuse/core': path.resolve(__dirname, 'node_modules/@vueuse/core'),
    },
  },
})
