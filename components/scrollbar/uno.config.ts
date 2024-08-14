import {
  Rule,
  UserConfig,
  defineConfig,
  presetAttributify,
  presetUno,
  toEscapedSelector,
} from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

const scrollBarRules: Rule[] = [
  [
    /^scrollbar-(.+)$/,
    ([, name], { rawSelector }) => {
      const selector = toEscapedSelector(rawSelector)

      if (name === 'none') {
        return `
          ${selector} {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          ${selector}::-webkit-scrollbar {
            display: none;
          }
        `
      }
    },
  ],
]

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetRemToPx()],
  rules: [...scrollBarRules],
} as UserConfig)
