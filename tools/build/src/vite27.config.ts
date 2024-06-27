import { defineConfig, UserConfig } from 'vite'
import { resolve } from 'pathe'
import { generateExternal, requireModules } from './utils'
import dts from 'vite-plugin-dts'
import { formats, fileName } from './config'

export default defineConfig(async (): Promise<UserConfig> => {
  const entry = resolve(process.cwd(), './src/index.ts')
  const vue27Plugin = requireModules(
    'playground/vue2.7/node_modules/@vitejs/plugin-vue2',
  )
  const UnoCSS = (await import('unocss/vite')).default
  const vue27Compiler = requireModules(
    'playground/vue2.7/node_modules/vue/compiler-sfc',
  )
  const plugins: UserConfig['plugins'] = [
    vue27Plugin({ compiler: vue27Compiler }),
    dts({
      include: ['./src'],
    }),
    UnoCSS({
      configFile: resolve(process.cwd(), './uno.config.ts'),
    }),
  ]
  const external = await generateExternal()
  const build: UserConfig['build'] = {
    lib: {
      entry: entry,
      formats,
      fileName,
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
