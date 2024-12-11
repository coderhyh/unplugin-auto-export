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

  /**
   * Cache the file content to avoid unnecessary write
   *
   * - key: fullpath
   * - value: content
   */
  const cache = new Map<string, string>()

  const handleDir = (event: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir', watchedPath: string) => {
    if (event === 'change')
      return

    const dirPath = dirname(watchedPath)
    const indexFileName = `index.${extname}`
    const indexFullPath = join(dirPath, indexFileName)

    if (basename(watchedPath) === indexFileName || !fs.existsSync(dirPath))
      return

    const files = fs
      .readdirSync(dirPath)
      // map to IWatchContext
      .map((basename) => {
        const fullpath = join(dirPath, basename)
        const [filename, extname] = (fs.statSync(fullpath).isFile() ? basename.split(splitReg) : [basename, undefined]) as [string, TFileType]
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

    if (cache.get(indexFullPath) === indexFileContent)
      return

    cache.set(indexFullPath, indexFileContent)
    fs.writeFileSync(indexFullPath, indexFileContent)
  }

  path = parsePath(path, alias)
  ignore = parsePath(ignore, alias)

  const watcher = chokidar.watch(path, { ignored: ignore })
  watcher.on('all', handleDir)

  return watcher
}
