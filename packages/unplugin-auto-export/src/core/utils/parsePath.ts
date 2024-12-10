import type { IOptions, TAlias } from '../../types'
import { replacePath } from './replacePath'
import { withThrowError } from './throwError'

const reg = /\/\*(\.[\w\d]+)?$/

export function parsePath(path: IOptions['path'], alias: TAlias) {
  if (!Array.isArray(path))
    // set path to array if it's not
    path = [path]

  withThrowError(path.every(p => reg.test(p)))
  path = path.map(e => replacePath(e, alias))

  return path
}
