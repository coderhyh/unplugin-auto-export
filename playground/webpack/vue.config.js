const { defineConfig } = require('@vue/cli-service')
const AutoExport = require('unplugin-auto-export/webpack').default
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      AutoExport({ 
        path: ['@/components/*'],
        componentDirs: ['components'],
      }),
    ],
  },
})
