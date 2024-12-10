import type { Alias, AliasOptions } from 'vite'

export function replacePath(path: string, alias: AliasOptions & Alias[]) {
  const firstPath = path[0]
  const aliasItem = alias.find(e => e.find === firstPath)
  if (aliasItem)
    return path.replace(aliasItem.find, aliasItem.replacement)
  return path
}
