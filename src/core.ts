import fs from 'node:fs'
import path from 'node:path'
import chokidar from 'chokidar'
import fg from 'fast-glob'
import type { Alias, AliasOptions } from 'vite'
import type { Options } from './types'

export class UnpluginAutoExport {
  constructor(public config: Options, public alias: AliasOptions & Alias[]) {
    this.handleAlias(this.alias)
  }

  toHump(s: string) {
    s.replace(/^[A-z\d]|[-_]([A-z\d])/g, (v, $1) => ($1 ? $1.toUpperCase() : v.toUpperCase()))
  }

  replacePath(path: string, alias: AliasOptions & Alias[]) {
    const firstPath = path[0]
    const aliasItem = alias.find(e => e.find === firstPath)
    if (aliasItem)
      return path.replace(aliasItem.find, aliasItem.replacement)
    return path
  }

  handleDir(_path: string) {
    const { extname = 'ts', vueDirs = [] } = this.config
    const indexFileName = `index.${extname}`
    const dirPath = path.dirname(_path)
    const indexFilePath = `${dirPath}/${indexFileName}`
    const dir = dirPath.split('/').at(-1)!
    const isVue = vueDirs.includes(dir)

    const files = fs.readdirSync(dirPath).filter(e => e !== indexFileName)
    const indexFileContent
      = `${files
        .map((file) => {
          const basename = path.basename(file)
          const [filename] = basename.split('.')
          const s = isVue ? `{ default as ${this.toHump(filename)} }` : '*'
          const name = isVue ? basename : filename
          return `export ${s} from './${name}'`
        })
        .join('\n')}\n`
    fs.writeFileSync(indexFilePath, indexFileContent)
  }

  setupWatcher(watcher: fs.FSWatcher) {
    watcher.on('unlink', this.handleDir)
    watcher.on('add', this.handleDir)
  }

  async init(path: string | string[], ignore: string[]) {
    const resPath = await fg.async(path, { onlyDirectories: true, dot: true, ignore })
    this.setupWatcher(chokidar.watch(resPath, { ignored: ignore }))
  }

  handleAlias(alias: AliasOptions & Alias[]) {
    let path = this.config.path
    let ignore = this.config.ignore ?? []
    if (Array.isArray(path))
      path = path.map(e => this.replacePath(e, alias))
    else path = this.replacePath(path, alias)
    ignore = ignore?.map(e => this.replacePath(e, alias))

    this.init(path, ignore)
  }
}
