import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { ResolvedConfig } from 'vite'
import type { Options } from './types'
import { UnpluginAutoExport } from './core'

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: 'unplugin-auto-export',
  transformInclude(id) {
    console.log(id)
    return id.endsWith('main.ts')
  },
  transform(code) {
    console.log(code)
    return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
  },
  vite: {
    configResolved(config: ResolvedConfig) {
      const res = new UnpluginAutoExport(options!, config.resolve.alias)
    },
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
