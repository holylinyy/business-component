import { defineConfig, UserConfig } from 'vite'
import { resolve } from 'pathe'
import { generateExternal, requireModules } from './utils'
import dts from 'vite-plugin-dts'

export default defineConfig(async (): Promise<UserConfig> => {
  const entry = resolve(process.cwd(), './src/index.ts')
  const vue27Plugin = requireModules(
    'playground/vue2.7/node_modules/@vitejs/plugin-vue2',
  )
  const vue27Compiler = requireModules(
    'playground/vue2.7/node_modules/vue/compiler-sfc',
  )
  const plugins: UserConfig['plugins'] = [
    vue27Plugin({ compiler: vue27Compiler }),
    dts({
      include: ['./src'],
    }),
  ]
  const external = await generateExternal()
  const build: UserConfig['build'] = {
    lib: {
      entry: entry,
      formats: ['es'],
      fileName: () => 'index.js',
    },

    outDir: 'dist/v2.7',
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
