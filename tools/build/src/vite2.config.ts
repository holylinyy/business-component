import { defineConfig, UserConfig } from 'vite'
import { generateExternal, requireModules } from './utils'
import { resolve } from 'pathe'
import dts from 'vite-plugin-dts'
import { formats, fileName } from './config'
export default defineConfig(async (): Promise<UserConfig> => {
  const entry = resolve(process.cwd(), './src/index.ts')
  const vue2Plugin = requireModules(
    'playground/vue2/node_modules/vite-plugin-vue2',
  ).createVuePlugin
  const plugins: UserConfig['plugins'] = [
    vue2Plugin({
      jsx: true,
      template: {
        compilerOptions: {
          comments: false,
        },
      },
    }),
    dts({
      include: ['./src'],
    }),
  ]
  const external = await generateExternal()
  const build: UserConfig['build'] = {
    lib: {
      entry: entry,
      formats,
      fileName,
    },

    outDir: 'dist/v2',
    rollupOptions: {
      external,
    },
  }
  const config: UserConfig = {
    resolve: {
      alias: {
        '@': resolve(process.cwd(), './src'),
      },
    },
    optimizeDeps: {
      exclude: ['vue-demi', 'vue'],
    },
    plugins,
    build,
  }
  return config
})
