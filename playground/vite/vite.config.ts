import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoExport from 'unplugin-auto-export/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoExport({
      path: ['src/components/*'],
      componentDirs: ['components'],
    }),
  ],
})
