export const hasOwnProperty = (
  obj: Record<string, unknown>,
  ...keys: string[]
): boolean => {
  return keys.some((x) => Object.prototype.hasOwnProperty.call(obj, x))
}

export const isObject = (item: unknown): boolean =>
  !!item && typeof item === 'object' && !Array.isArray(item)

export const isPlainObject = (value: unknown): boolean =>
  isObject(value) && value.constructor === {}.constructor

export const isEmpty = (obj: unknown): boolean =>
  [Object, Array].includes((obj || {}).constructor as any) &&
  !Object.keys(obj || {}).length
