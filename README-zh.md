# unplugin-auto-export

`unplugin-auto-export` 是一个用于 Vite 的插件，它可以自动化维护 `index.ts` 文件中的导出语句，减轻手动编写 `export` 语句的工作负担。在大型项目中，特别是在需要管理许多导出语句时，这个插件尤其有用。

## 功能特点

- 自动监听指定的文件夹以检测文件变化。
- 更新这些文件夹内的 `index.ts` 文件，写入正确的 `export` 语句。
- 可配置以忽略特定文件或文件夹。
- 支持 `ts | js` 的文件扩展名（默认为 `.ts`）。
- 处理组件文件夹，并提供选项以指定组件文件夹。

## 安装

您可以使用 npm 或 yarn 安装 `unplugin-auto-export` 插件：

```bash
npm install unplugin-auto-export --save-dev
# 或
yarn add unplugin-auto-export --dev
```

## 使用方法

要在您的 Vite 项目中使用 `unplugin-auto-export` 插件，请按照以下步骤操作：

1. 配置插件

**vite**: 在 `vite.config.js` 文件中导入插件并指定配置选项:

```typescript
import { defineConfig } from 'vite';
import AutoExport from 'unplugin-auto-export/vite';

export default defineConfig({
  // ... 其他 Vite 配置选项

  plugins: [
    AutoExport({
      path: ['~/views/**/{components,hooks}/*', '~/hooks/*'], // 要监听的文件夹, 路径可以使用别名
      ignore: ['**/node_modules'], // 要忽略的文件夹或文件（可选）
      componentDirs: ['components'], // 处理的组件文件夹（可选）
      extname: 'ts', // 文件扩展名（默认为 'ts'）`'ts' | 'js'`
    }),
  ],
});
```

**webpack**: 在 `webpack.config.js` 文件中导入插件并指定配置选项:

```javascript
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-auto-export/webpack')({ /* options */ }),
  ],
}
```

2. 运行您的 Vite 项目，`unplugin-auto-export` 插件将自动维护指定文件夹中的 `index.ts` 文件。

## 配置选项

- `path`（`string` 或 `string[]`）：要监听变化的文件夹。可以是单个字符串或字符串数组
  - 可以使用自己配置的路径别名
  - **要使用通配符匹配模式, 如: `~/views/**/{components,hooks}/*` 或者 `src/hooks/*.ts`**
- `ignore`（`string[]`）：在监听时要忽略的文件夹或文件。**（可选）**
  - 同 `path` 规则
- `extname`（`string`）：用于 `index` 文件的文件扩展名（默认为 `ts`）
- `componentDirs`（`string[]`）：要处理的组件文件夹。 **（可选）**
  - 比如以上的例子中传入的是 `componentDirs: ['components']`
  - 那么输出的 `export` 语句就是: `export { default as ZForm } from './z-form.vue'`

## 错误处理

- `unplugin-auto-export` 插件强制执行特定的路径规则：`/\/\*(\.[\w\d]+)?$/`
  - **使用通配符模式, 只是需要结尾为 `*` or `*.ts`。通常结尾为 `*` 即可**
- 如果路径不符合此规则，插件将抛出错误，并显示消息：`Path rule does not match. Please check the path format.`
- 正确例子: `~/views/**/{components,hooks}/*` 或者 `src/hooks/*.ts`
  - `~` 是 `Vite` 中配置的路径别名

## 贡献

如果您遇到任何问题或有改进建议，欢迎提交[问题](https://github.com/coderhyh/unplugin-auto-export/issues)或[贡献代码](https://github.com/coderhyh/unplugin-auto-export)。

## 许可证

该项目采用 MIT 许可证授权。有关详细信息，请参阅 [LICENSE](/LICENSE) 文件。

## 作者

GitHub：[coderhyh](https://github.com/coderhyh)

## 附加信息

有关更多信息和更新，请访问[`unplugin-auto-export` GitHub](https://github.com/coderhyh/unplugin-auto-export) 仓库。
