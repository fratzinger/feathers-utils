import type { DebouncedStoreOptions } from './types.js'

export const makeDefaultOptions = (): DebouncedStoreOptions => {
  return {
    leading: false,
    maxWait: undefined,
    trailing: true,
    wait: 100,
  }
}
