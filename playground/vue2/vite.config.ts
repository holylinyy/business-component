import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import UnocssVitePlugin from 'unocss/vite'
import * as path from 'node:path'
import './vite.init'

export default defineConfig({
  resolve: {
    alias: {
      '@vueuse/core': path.resolve(__dirname, 'node_modules/@vueuse/core'),
    },
  },
  plugins: [createVuePlugin({ jsx: true }), UnocssVitePlugin()],
})
