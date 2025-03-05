import { shouldSkip, getItemsIsArray } from '../utils/index.js'

import type { HookContext } from '@feathersjs/feathers'
import type { Promisable } from '../typesInternal.js'

export interface HookRunPerItemOptions {
  wait?: boolean
}

const makeOptions = (
  options?: HookRunPerItemOptions,
): Required<HookRunPerItemOptions> => {
  options = options || {}
  return {
    wait: true,
    ...options,
  }
}

/**
 * hook to run a hook for each item in the context
 * uses `context.result` if it is existent. otherwise uses context.data
 */
export const runPerItem = <H extends HookContext = HookContext, T = any>(
  actionPerItem: (item: T, context: H) => Promisable<any>,
  _options?: HookRunPerItemOptions,
) => {
  const options = makeOptions(_options)
  return async (context: H) => {
    if (shouldSkip('runForItems', context)) {
      return context
    }

    const { items } = getItemsIsArray(context)

    const promises = items.map(async (item: T) => {
      await actionPerItem(item, context)
    })

    if (options.wait) {
      await Promise.all(promises)
    }

    return context
  }
}
