import { searchForWorkspaceRoot } from 'vite'
import path from 'node:path'
import { createRequire } from 'node:module'

const workspaceRoot = searchForWorkspaceRoot(process.cwd())
const require = createRequire(import.meta.url)

const pathFromWorkspaceRoot = (...args: any) =>
  path.resolve(workspaceRoot, ...args)
export const requireModules = (id: string) =>
  require(require.resolve(pathFromWorkspaceRoot(id)))
