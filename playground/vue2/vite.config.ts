import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import UnocssVitePlugin from 'unocss/vite'
import './vite.init'

export default defineConfig({
  resolve: {},
  plugins: [createVuePlugin({ jsx: true }), UnocssVitePlugin()],
})
