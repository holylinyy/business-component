import { spawn } from 'child_process'

export const runScript = (command: string, cwd = process.cwd()) => {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd: cwd,
      stdio: 'inherit',
      shell: true,
    })
    app.on('error', (err) => {
      reject(err)
    })
    app.on('close', (code) => {
      if (code !== 0) {
        reject()
        return
      }
      resolve(undefined)
    })
  })
}
