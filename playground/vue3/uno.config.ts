import { UserConfig, defineConfig, presetAttributify, presetUno } from 'unocss'
export default defineConfig({
  presets: [presetUno(), presetAttributify()],
} as UserConfig)
