import fs from 'node:fs';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoExport from 'unplugin-auto-export/vite'
import { join } from 'node:path'
import { pascalCase } from 'change-case';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoExport({
      path: ['src/components/**/*'],

      filter: ({ basename, dirPath, extname }) =>
        basename !== `ignore.ts` && // ignore this file if it's named `ignore.ts`
        basename !== `index.${extname}` &&
        (fs.statSync(join(dirPath, basename)).isFile() || (fs.existsSync(join(dirPath, basename, `index.ts`)) && fs.statSync(join(dirPath, basename, `index.ts`)).isFile())),

      formatter: (filename, extname, { basename }) => {
        switch (extname) {
          case 'vue':
          case 'json':
            return `export { default as ${pascalCase(filename)} } from './${filename}.${extname}'`
          case 'js':
          case 'ts':
          default:
            // if the file name ends with `.ns`, export it as namespace.
            if (filename.endsWith('.ns')) {
              return `export * as ${filename.replace('.ns', '')} from './${basename}'`
            }

            return `export * from './${filename}'`
        }
      }
    }),
  ],
})
