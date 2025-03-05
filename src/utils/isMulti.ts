import type { HookContext } from '@feathersjs/feathers'

/**
 * util to check if a hook is a multi hook:
 * - find: true
 * - get: false
 * - create: `context.data` is an array
 * - update: false
 * - patch: `context.id == null`
 * - remove: `context.id == null`
 */
export const isMulti = <H extends HookContext = HookContext>(
  context: H,
): boolean => {
  const { method } = context
  if (method === 'find') {
    return true
  } else if (['patch', 'remove'].includes(method)) {
    return context.id == null
  } else if (method === 'create') {
    const items = context.type === 'before' ? context.data : context.result
    return Array.isArray(items)
  } else if (['get', 'update'].includes(method)) {
    return false
  }
  return false
}

if (import.meta.vitest) {
  const { it, assert } = import.meta.vitest

  it('returns true', function () {
    const makeContext = (type: string, method: string) => {
      const context = {
        method,
        type,
      } as HookContext
      if (method === 'create') {
        if (type === 'before') {
          context.data = []
        } else {
          context.result = []
        }
      }
      return context
    }
    ;['before', 'after'].forEach((type) => {
      ;['find', 'create', 'patch', 'remove'].forEach((method) => {
        const context = makeContext(type, method)
        assert.strictEqual(
          isMulti(context),
          true,
          `'${type}:${method}': returns true`,
        )
      })
    })
  })

  it('returns false', function () {
    const makeContext = (type: string, method: string) => {
      const context = {
        method,
        type,
        id: 0,
      } as HookContext
      if (method === 'create') {
        if (type === 'before') {
          context.data = {}
        } else {
          context.result = {}
        }
      }
      return context
    }
    ;['before', 'after'].forEach((type) => {
      ;['get', 'create', 'update', 'patch', 'remove'].forEach((method) => {
        const context = makeContext(type, method)
        assert.strictEqual(
          isMulti(context),
          false,
          `'${type}:${method}': returns false`,
        )
      })
    })
  })
}
