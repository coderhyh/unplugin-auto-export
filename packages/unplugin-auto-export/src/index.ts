import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Alias, AliasOptions, ResolvedConfig } from 'vite'
import type chokidar from 'chokidar'
import type { IOptions, TAlias } from './types'
import { unpluginAutoExport } from './core'

let watcher: chokidar.FSWatcher | undefined
export const unpluginFactory: UnpluginFactory<IOptions> = options => ({
  name: 'unplugin-auto-export',
  // transformInclude(id) {
  //   return id.endsWith('main.ts')
  // },
  webpack(compiler) {
    if (compiler.options.mode === 'production')
      return
    const alias = compiler.options?.resolve?.alias
    const aliasList: TAlias = Object.keys(alias ?? {}).map(k => ({
      find: k,
      replacement: alias![k as keyof typeof alias],
    }))
    unpluginAutoExport(options, aliasList)
  },
  vite: {
    apply: 'serve',
    configResolved(config: ResolvedConfig) {
      watcher?.close()
      watcher = unpluginAutoExport(options, config.resolve.alias)
    },
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
