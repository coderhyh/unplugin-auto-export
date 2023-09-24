# unplugin-auto-export

`unplugin-auto-export` is a plugin designed specifically for Vite and Webpack build tools, that automates the maintenance of export statements in `index.ts` files, reducing the manual effort of writing `export` statements. It's especially useful in large projects where managing export statements can become cumbersome.

[中文文档](/README-zh.md)

## Features

- Automatically watches specified directories for file changes.
- Updates the `index.ts` file within those directories with the appropriate `export` statements.
- Configurable to ignore specific files or directories.
- Supports `ts | js` file extensions (default is `.ts`).
- Handles component directories with options to specify component directories.

## Installation

You can install the `unplugin-auto-export` plugin using npm or yarn:

```bash
npm install unplugin-auto-export --save-dev
# or
yarn add unplugin-auto-export --dev
```

## Usage

To use the `unplugin-auto-export` plugin in your Vite project, follow these steps:

1. Configure the plugin

**vite**: In your `vite.config.js` file, import the plugin and specify configuration options:

```javascript
import { defineConfig } from 'vite';
import AutoExport from 'unplugin-auto-export/vite';

export default defineConfig({
  // ... other Vite configuration options

  plugins: [
    AutoExport({
      path: ['~/views/**/{components,hooks}/*', '~/hooks/*'], // Directories to watch, paths can use aliases
      ignore: ['**/node_modules'], // Directories or files to ignore (optional)
      componentDirs: ['components'], // Component directories to handle (optional)
      extname: 'ts', // File extension (default is 'ts') `ts` | `js`
    }),
  ],
});
```

**webpack**: In your `webpack.config.js` file, import the plugin and specify configuration options:

```javascript
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-auto-export/webpack')({ /* options */ }),
  ],
}
```

2. Run your project, and the `unplugin-auto-export` plugin will automatically maintain the `index.ts` files in the specified directories.

## Configuration Options

- `path` (`string` or `string[]`): Directories to watch for changes. Can be a single string or an array of strings.
  - You can use your own configured path aliases.
  - **To use a wildcard pattern, such as `~/views/**/{components,hooks}/*` or `src/hooks/*.ts`**
- `ignore` (`string[]`): Directories or files to ignore during watching. **(optional)**
  - Follows the same path rule as `path`.
- `extname` (`string`): The file extension to use for the `index` files (default is `ts`).
  - support `ts | js`.
- `componentDirs` (`string[]`): Component directories to handle. **(optional)**
  - For example, if you pass `componentDirs: ['components']`,
  - The generated `export` statement will be: `export { default as ZForm } from './z-form.vue'`.

## Error Handling

- The `unplugin-auto-export` plugin enforces a specific path rule: `/\/\*(\.[\w\d]+)?$/`.
  - When using a wildcard pattern, it only requires ending with `/*` or `/*.ts`. Typically, ending with `/*` is sufficient.
  - Because this is the only way to indicate monitoring files within a specific folder.
- If the path does not match this rule, the plugin will throw an error with the message: `Path rule does not match. Please check the path format.`
- Correct examples: `~/views/**/{components,hooks}/* or src/hooks/*.ts`
  - `~` is the path alias configured in `Vite`.

## Contributing

If you encounter any issues or have suggestions for improvements, feel free to [open an issue](https://github.com/coderhyh/unplugin-auto-export/issues) or [contribute to the project](https://github.com/coderhyh/unplugin-auto-export).

## License

This project is licensed under the MIT License. See the [LICENSE](/LICENSE) file for details.

## Author

GitHub: [coderhyh](https://github.com/coderhyh)

## Additional Information

For more information and updates, visit the [`unplugin-auto-export` GitHub](https://github.com/coderhyh/unplugin-auto-export) repository.
