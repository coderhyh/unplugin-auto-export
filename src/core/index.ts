import fs from 'node:fs'
import path from 'node:path'
import chokidar from 'chokidar'
import type { Alias, AliasOptions } from 'vite'
import type { IOptions, TFileType } from '../types'
import { replacePath, throwError, toHump } from './utils'

export function unpluginAutoExport(config: IOptions, alias: AliasOptions & Alias[]): chokidar.FSWatcher {
  const reg = /\/\*(\.[\w\d]+)?$/
  const splitReg = /\.(?=[^\.]+$)/g
  const defaultOptions: IOptions = {
    path: [],
    ignore: [],
    extname: 'ts',
  }
  config = Object.assign(defaultOptions, config)

  const handleDir = (_path: string) => {
    const { extname } = config
    const dirPath = path.dirname(_path)
    const indexFileName = `index.${extname}`
    const indexFilePath = `${dirPath}/${indexFileName}`
    const files = fs.readdirSync(dirPath).filter(e => e !== indexFileName && fs.statSync(`${dirPath}/${e}`).isFile())
    if (path.basename(_path) === indexFileName)
      return
    const exportList = files
      .map((basename) => {
        const [filename, extname] = basename.split(splitReg) as [string, TFileType]
        if (config.formatter)
          return config.formatter(filename, extname)

        switch (extname) {
          case 'vue':
          case 'json':
            return `export { default as ${toHump(filename)} } from './${filename}.${extname}'`
          case 'js':
          case 'ts':
          default:
            return `export * from './${filename}'`
        }
      })
      .join('\n')
    const indexFileContent = `/* eslint-disable */\n${exportList || 'export {}'}\n`
    fs.writeFileSync(indexFilePath, indexFileContent)
  }
  const init = () => {
    let path = config.path
    let ignore = config.ignore
    if (Array.isArray(path)) {
      !path.every(p => reg.test(p)) && throwError()
      path = path.map(e => replacePath(e, alias))
    }
    else {
      !reg.test(path) && throwError()
      path = replacePath(path, alias)
    }
    !ignore?.every(p => reg.test(p)) && throwError()
    ignore = ignore?.map(e => replacePath(e, alias))

    const watcher = chokidar.watch(path, { ignored: ignore })
    watcher.on('unlink', handleDir)
    watcher.on('add', handleDir)
    return watcher
  }

  return init()
}
