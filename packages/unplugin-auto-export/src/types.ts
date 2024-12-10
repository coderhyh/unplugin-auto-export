/**
 * Hmm, maybe we should make an agreement about the difference between `filename` and `basename` and other properties:
 *
 * - `filename` is the file name without the extension.
 * - `extname` is the file extension.
 * - `basename` is the file name with the extension (`${filename}.${extname}`).
 * - `dirPath` is the directory path where the file is located.
 * - `fullpath` is the complete path of the file, composed of `dirPath` and `basename` (`join(dirPath, basename)`).
 */
export interface IWatchContext {
  /**
   * The file name without the extension.
   */
  filename: string
  /**
   * The file extension.
   */
  extname: string
  /**
   * The file name with the extension (`${filename}.${extname}`).
   */
  basename: string
  /**
   * The directory path where the file is located.
   */
  dirPath: string
  /**
   * The complete path of the file, composed of `dirPath` and `basename` (`join(dirPath, basename)`).
   */
  fullpath: string
}

export interface IFilter {
  (options: IWatchContext): boolean
}

export interface IFormatter {
  (filename: string, extname: string, context: IWatchContext): string
}

export interface IOptions {
  path: string | string[]
  ignore?: string[]
  extname?: 'ts' | 'js'
  formatter?: IFormatter
  filter?: IFilter
}

export type TFileType = 'ts' | 'js' | 'vue' | 'json'

export type TAlias = import('vite').AliasOptions & import('vite').Alias[]
