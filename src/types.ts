export interface IOptions {
  path: string | string[]
  ignore?: string[]
  extname?: 'ts' | 'js'
  formatter?: (filename: string, extname: string) => string
}

export type TFileType = 'ts' | 'js' | 'vue' | 'json'
