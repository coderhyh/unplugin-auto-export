import fs from 'node:fs'
import { join } from 'node:path'
import type { IFilter } from '../../types'

export const defaultFilter: IFilter = ({
  basename,
  dirPath,
  extname,
}) => basename !== `index.${extname}` && fs.statSync(join(dirPath, basename)).isFile()
