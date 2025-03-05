import type { HookContext } from '@feathersjs/feathers'

export type GetItemsIsArrayFrom = 'data' | 'result' | 'automatic'

export type GetItemsIsArrayOptions = {
  from?: GetItemsIsArrayFrom
}

export interface GetItemsIsArrayResult<T = any> {
  items: T[]
  isArray: boolean
}

export const getItemsIsArray = <T = any, H extends HookContext = HookContext>(
  context: H,
  options?: GetItemsIsArrayOptions,
): GetItemsIsArrayResult<T> => {
  const { from = 'automatic' } = options || {}

  let itemOrItems

  if (from === 'automatic') {
    itemOrItems = context.type === 'before' ? context.data : context.result
  } else if (from === 'data') {
    itemOrItems = context.data
  } else if (from === 'result') {
    itemOrItems = context.result
  }

  if ((from === 'automatic' || from === 'result') && context.type === 'after') {
    itemOrItems =
      itemOrItems && context.method === 'find'
        ? itemOrItems.data || itemOrItems
        : itemOrItems
  }

  const isArray = Array.isArray(itemOrItems)
  return {
    items: isArray ? itemOrItems : itemOrItems != null ? [itemOrItems] : [],
    isArray,
  }
}

if (import.meta.vitest) {
  const { describe, it, assert } = import.meta.vitest

  const assertBefore = (context: any, items: any, isArray: any) => {
    const arrays: (GetItemsIsArrayFrom | undefined)[] = [
      undefined,
      'data',
      'automatic',
    ]

    for (const from of arrays) {
      const { items: items2, isArray: isArray2 } = getItemsIsArray(context, {
        from,
      })
      assert.deepStrictEqual(items2, items, `from: ${from}`)
      assert.deepStrictEqual(isArray2, isArray, `from: ${from}`)
    }
  }

  const assertAfter = (context: any, items: any, isArray: any) => {
    const arrays: (GetItemsIsArrayFrom | undefined)[] = [
      undefined,
      'result',
      'automatic',
    ]

    for (const from of arrays) {
      const { items: items2, isArray: isArray2 } = getItemsIsArray(context, {
        from,
      })
      assert.deepStrictEqual(items2, items, `from: ${from}`)
      assert.deepStrictEqual(isArray2, isArray, `from: ${from}`)
    }
  }

  describe('before', function () {
    it('find:before', async function () {
      const context = {
        type: 'before',
        method: 'find',
        params: {
          query: {},
        },
      } as any as HookContext

      assertBefore(context, [], false)
    })

    it('get:before', async function () {
      const context = {
        type: 'before',
        method: 'get',
        id: 1,
        params: {
          query: {},
        },
      } as any as HookContext

      assertBefore(context, [], false)
    })

    it('create:before single', async function () {
      const context = {
        type: 'before',
        method: 'create',
        data: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext

      assertBefore(context, [{ test: true }], false)
    })

    it('create:before multi', async function () {
      const context = {
        type: 'before',
        method: 'create',
        data: [{ test: true }, { test: true }],
        params: {
          query: {},
        },
      } as any as HookContext

      assertBefore(context, [{ test: true }, { test: true }], true)
    })

    it('update:before single', async function () {
      const context = {
        type: 'before',
        method: 'update',
        id: 1,
        data: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext

      assertBefore(context, [{ test: true }], false)
    })

    it('patch:before single', async function () {
      const context = {
        type: 'before',
        method: 'patch',
        id: 1,
        data: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext

      assertBefore(context, [{ test: true }], false)
    })

    it('patch:before multi', async function () {
      const context = {
        type: 'before',
        method: 'patch',
        id: null,
        data: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext

      assertBefore(context, [{ test: true }], false)
    })

    it('remove:before single', async function () {
      const context = {
        type: 'before',
        method: 'remove',
        id: 1,
        params: {
          query: {},
        },
      } as any as HookContext

      assertBefore(context, [], false)
    })

    it('remove:before multi', async function () {
      const context = {
        type: 'before',
        method: 'remove',
        id: null,
        params: {
          query: {},
        },
      } as any as HookContext

      assertBefore(context, [], false)
    })
  })

  describe('after', function () {
    it('find:after paginate:true', function () {
      const context = {
        type: 'after',
        method: 'find',
        result: {
          total: 1,
          skip: 0,
          limit: 10,
          data: [{ test: true }],
        },
        params: {
          query: {},
        },
      } as any as HookContext

      assertAfter(context, [{ test: true }], true)
    })

    it('find:after paginate:false', function () {
      const context = {
        type: 'after',
        method: 'find',
        result: [{ test: true }],
        params: {
          query: {},
        },
      } as any as HookContext

      assertAfter(context, [{ test: true }], true)
    })

    it('get:after', function () {
      const context = {
        type: 'after',
        method: 'get',
        id: 1,
        result: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext

      assertAfter(context, [{ test: true }], false)
    })

    it('update:after', function () {
      const context = {
        type: 'after',
        method: 'update',
        id: 1,
        data: { test: 'yes' },
        result: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext

      assertAfter(context, [{ test: true }], false)
    })

    it('patch:after single', function () {
      const context = {
        type: 'after',
        method: 'patch',
        id: 1,
        data: { test: 'yes' },
        result: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext

      assertAfter(context, [{ test: true }], false)
    })

    it('patch:after multi', function () {
      const context = {
        type: 'after',
        method: 'patch',
        id: null,
        data: { test: 'yes' },
        result: [{ test: true }, { test: true }],
        params: {
          query: {},
        },
      } as any as HookContext

      assertAfter(context, [{ test: true }, { test: true }], true)
    })

    it('remove:after single', function () {
      const context = {
        type: 'after',
        method: 'remove',
        id: 1,
        data: { test: 'yes' },
        result: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext

      assertAfter(context, [{ test: true }], false)
    })

    it('remove:after multi', function () {
      const context = {
        type: 'after',
        method: 'remove',
        id: null,
        data: { test: 'yes' },
        result: [{ test: true }, { test: true }],
        params: {
          query: {},
        },
      } as any as HookContext

      assertAfter(context, [{ test: true }, { test: true }], true)
    })
  })
}
