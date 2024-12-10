export function throwError() {
  throw new Error(
    'Path rule does not match. Please check the path format. See: https://github.com/coderhyh/unplugin-auto-export#error-handling',
  )
}

/**
 * throw error when `val` is `nullish` or `false`.
 */
export function withThrowError(val?: boolean) {
  !val && throwError()
}
