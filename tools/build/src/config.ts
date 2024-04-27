import { LibraryOptions } from 'vite'
export const formats: LibraryOptions['formats'] = ['es', 'cjs']
export const fileName: LibraryOptions['fileName'] = (formats) => {
  const ext = formats === 'es' ? '.js' : '.cjs'
  return `index${ext}`
}
