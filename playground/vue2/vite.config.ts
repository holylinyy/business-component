import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import './vite.init'

export default defineConfig({
  resolve: {},
  plugins: [createVuePlugin({ jsx: true })],
})
