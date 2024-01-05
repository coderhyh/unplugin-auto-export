import type { Alias, AliasOptions } from 'vite'

export function toHump(s: string) {
  return s.replace(/^[A-z\d]|[-_]([A-z\d])/g, (v, $1) => ($1 ? $1.toUpperCase() : v.toUpperCase()))
}
export function throwError() {
  throw new Error(
    'Path rule does not match. Please check the path format. See: https://github.com/coderhyh/unplugin-auto-export#error-handling',
  )
}
export function replacePath(path: string, alias: AliasOptions & Alias[]) {
  const firstPath = path[0]
  const aliasItem = alias.find(e => e.find === firstPath)
  if (aliasItem)
    return path.replace(aliasItem.find, aliasItem.replacement)
  return path
}
