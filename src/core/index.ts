import fs from 'node:fs'
import path from 'node:path'
import chokidar from 'chokidar'
import type { Alias, AliasOptions } from 'vite'
import type { Options } from '../types'
import { replacePath, throwError, toHump } from './utils'

export function unpluginAutoExport(config: Options, alias: AliasOptions & Alias[]) {
  const reg = /\/\*(\.[\w\d]+)?$/

  const handleDir = (_path: string) => {
    const { extname = 'ts', componentDirs = [] } = config
    const indexFileName = `index.${extname}`
    const dirPath = path.dirname(_path)
    const indexFilePath = `${dirPath}/${indexFileName}`
    const dir = dirPath.split('/').at(-1)!
    const isVue = componentDirs.includes(dir)
    const files = fs.readdirSync(dirPath).filter(e => e !== indexFileName && fs.statSync(`${dirPath}/${e}`).isFile())
    if (path.basename(_path) === indexFileName)
      return
    const indexFileContent
      = `${files
        .map((file) => {
          const basename = path.basename(file)
          const [filename] = basename.split('.')
          const s = isVue ? `{ default as ${toHump(filename)} }` : '*'
          const name = isVue ? basename : filename
          return `export ${s} from './${name}'`
        })
        .join('\n')}\n`
    fs.writeFileSync(indexFilePath, indexFileContent)
  }
  const setupWatcher = (watcher: fs.FSWatcher) => {
    watcher.on('unlink', handleDir)
    watcher.on('add', handleDir)
  }
  const init = (path: string | string[], ignore: string[]) => {
    setupWatcher(chokidar.watch(path, { ignored: ignore }))
  }
  const handleAlias = () => {
    let path = config.path
    let ignore = config.ignore ?? []
    if (Array.isArray(path)) {
      !path.every(p => reg.test(p)) && throwError()
      path = path.map(e => replacePath(e, alias))
    }
    else {
      !reg.test(path) && throwError()
      path = replacePath(path, alias)
    }
    !ignore.every(p => reg.test(p)) && throwError()
    ignore = ignore?.map(e => replacePath(e, alias))

    init(path, ignore)
  }

  handleAlias()
}
