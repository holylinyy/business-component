import { ProjectManifest } from '@pnpm/types'
import { resolve } from 'pathe'

export const generateExternal = async () => {
  const { dependencies, peerDependencies } = getPackageDependencies(
    resolve(process.cwd(), 'package.json'),
  )
  return (id: string) => {
    const packages: string[] = [...peerDependencies]
    packages.push('@vue', ...dependencies)
    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`),
    )
  }
}

const getPackageManifest = (pkgPath: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(pkgPath) as ProjectManifest
}

const getPackageDependencies = (
  pkgPath: string,
): Record<
  'dependencies' | 'peerDependencies' | 'devDependencies',
  string[]
> => {
  const manifest = getPackageManifest(pkgPath)
  const {
    dependencies = {},
    peerDependencies = {},
    devDependencies = {},
  } = manifest

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
    devDependencies: Object.keys(devDependencies),
  }
}
