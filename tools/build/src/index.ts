import { build as viteBuild } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { runScript } from './utils'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const build = async () => {
  await runScript('vue-demi-switch 2 vue2')
  await viteBuild({
    configFile: path.resolve(__dirname, './vite2.config.ts'),
  })
  await runScript('vue-demi-switch 2.7 vue2.7')
  await viteBuild({
    configFile: path.resolve(__dirname, './vite27.config.ts'),
  })
  await runScript('vue-demi-switch 3 vue3')
  await viteBuild({
    configFile: path.resolve(__dirname, './vite3.config.ts'),
  })
}
