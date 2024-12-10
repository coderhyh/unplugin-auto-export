import { pascalCase } from 'change-case'
import type { IFormatter } from '../../types'

// -- replace with `pascalCase` from `change-case`.
// export function toHump(s: string) {
//   return s.replace(/^[A-z\d]|[-_]([A-z\d])/g, (v, $1) => ($1 ? $1.toUpperCase() : v.toUpperCase()))
// }

export const defaultFormatter: IFormatter = (filename: string, extname: string) => {
  switch (extname) {
    case 'vue':
    case 'json':
      return `export { default as ${pascalCase(filename)} } from './${filename}.${extname}'`
    case 'js':
    case 'ts':
    default:
      return `export * from './${filename}'`
  }
}
