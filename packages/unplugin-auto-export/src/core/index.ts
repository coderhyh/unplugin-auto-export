import fs from 'node:fs'
import { basename, dirname, join } from 'node:path'
import chokidar from 'chokidar'
import type { IOptions, IWatchContext, TAlias, TFileType } from '../types'
import { defaultFilter, defaultFormatter, parsePath } from './utils'

const defaultOptions: Required<IOptions> = {
  path: [],
  ignore: [],
  extname: 'ts',
  filter: defaultFilter,
  formatter: defaultFormatter,
}

export function unpluginAutoExport({
  path = [...defaultOptions.path],
  ignore = [...defaultOptions.ignore],
  extname = defaultOptions.extname,
  formatter = defaultOptions.formatter,
  filter = defaultFilter,
}: IOptions, alias: TAlias): chokidar.FSWatcher {
  const splitReg = /\.(?=[^\.]+$)/g

  const handleDir = (_path: string) => {
    const dirPath = dirname(_path)
    const indexFileName = `index.${extname}`
    const indexFullPath = join(dirPath, indexFileName)

    if (basename(_path) === indexFileName)
      return

    const files = fs
      .readdirSync(dirPath)
      // map to IWatchContext
      .map((basename) => {
        const [filename, extname] = basename.split(splitReg) as [string, TFileType]
        return {
          filename,
          extname,
          dirPath,
          basename,
          fullpath: join(dirPath, basename),
        } as IWatchContext
      })
      // filter the files
      .filter(filter)
    const exportList = files
      .map(context => formatter(context.filename, context.extname, context))
      .join('\n')

    const indexFileContent = `${exportList || 'export {}'}\n`
    fs.writeFileSync(indexFullPath, indexFileContent)
  }

  path = parsePath(path, alias)
  ignore = parsePath(ignore, alias)

  const watcher = chokidar.watch(path, { ignored: ignore })
  watcher
    .on('unlink', handleDir)
    .on('add', handleDir)

  return watcher
}
