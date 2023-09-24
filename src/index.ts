import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { ResolvedConfig } from 'vite'
import type { Options } from './types'

import { unpluginAutoExport } from './core'

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: 'unplugin-auto-export',
  // transformInclude(id) {
  //   return id.endsWith('main.ts')
  // },
  vite: {
    configResolved(config: ResolvedConfig) {
      unpluginAutoExport(options!, config.resolve.alias)
    },
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
