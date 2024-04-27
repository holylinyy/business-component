import { defineConfig, UserConfig } from 'vite'
import { resolve } from 'pathe'
import dts from 'vite-plugin-dts'
import { generateExternal, requireModules } from './utils'
import { formats, fileName } from './config'

export default defineConfig(async (): Promise<UserConfig> => {
  const entry = resolve(process.cwd(), './src/index.ts')
  const vue3Plugin = requireModules(
    'playground/vue3/node_modules/@vitejs/plugin-vue',
  )
  const plugins: UserConfig['plugins'] = [
    vue3Plugin(),
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

    outDir: 'dist/v3',
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
