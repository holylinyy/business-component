import path from 'node:path';
import fse from 'fs-extra'
import { createRequire } from 'node:module'

const require = createRequire(process.cwd())
const packageJsonPath = path.join(process.cwd(), './package.json')
const packageJson = require(packageJsonPath)



async function switchVersion() {
  let vue = null
  try {
    vue = require('vue')
  } catch (e) {
    console.log(
      '[vue-demi-component-template] not current Vue version, please use Vue2/3',
    )
    return
  }
  const { version } = vue

  if (
    typeof version !== 'string' ||
    !(version.startsWith('2.') || version.startsWith('3.'))
  ) {
    console.log(
      '[vue-demi-component-template] not current Vue version, please use Vue2/3',
    )
    return
  }

  const isVue2 = version.startsWith('2.')
  const isVue27 = version.startsWith('2.7.')

  const distDir = `dist/${isVue2 ? (isVue27 ? 'v2.7' : 'v2') : 'v3'}`

  const exportJson = {
    main: `${distDir}/index.js`,
    module: `${distDir}/index.mjs`,
    types: `${distDir}/index.d.ts`,
    style: `${distDir}/style.css`,
    exports: {
      '.': {
        types: `./${distDir}/index.d.ts`,
        import: `./${distDir}/index.es.js`,
        require: `./${distDir}/index.cjs.js`,
      },
    },
  }

  const newPackageJson = Object.assign(packageJson, exportJson)

  fse.writeJsonSync(packageJsonPath, newPackageJson, { spaces: '\t' })

  console.log(
    `[vue-demi-component-template] Switch packageJson fields for Vue${version}`,
  )
}

async function main() {
  await switchVersion()
}

main().catch((e) => {
  console.log(e)
})
