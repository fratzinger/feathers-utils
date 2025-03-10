import type { FilterQueryOptions } from '@feathersjs/adapter-commons'
import { validateQueryProperty } from '../utils/validateQueryProperty.js'
import { isObject } from '../utils/_utils.internal.js'

const filterQueryObject =
  (key: string) =>
  (obj: any, { operators }: FilterQueryOptions) => {
    if (obj && !isObject(obj)) {
      throw new Error(
        `Invalid query parameter: '${key}'. It has to be an object`,
      )
    }

    return validateQueryProperty(obj, operators)
  }

export const filterObject = <T extends string[]>(...keys: T) => {
  const result: {
    [key in T[number]]: (value: any, options: FilterQueryOptions) => any
  } = {} as any

  for (const key of keys) {
    result[key as T[number]] = filterQueryObject(key)
  }

  return result
}
