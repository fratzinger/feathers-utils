import { pushSet } from './pushSet.js'

import type { HookContext } from '@feathersjs/feathers'
import type { HookType } from 'feathers-hooks-common'
import type { MaybeArray } from '../typesInternal.js'

/**
 * util to mark a hook for skip, has to be used with `shouldSkip`
 */
export function markHookForSkip<H extends HookContext = HookContext>(
  hookName: string,
  type: 'all' | MaybeArray<HookType>,
  context?: H,
) {
  // @ts-expect-error context is not of type 'H'
  context = context || {}

  const params = context!.params || {}
  const types: string[] = Array.isArray(type) ? type : [type]

  types.forEach((t) => {
    const combinedName = t === 'all' ? hookName : `${type}:${hookName}`
    pushSet(params, ['skipHooks'], combinedName, { unique: true })
  })

  context!.params = params
  return context
}

if (import.meta.vitest) {
  const { it, assert } = import.meta.vitest
  const { feathers } = await import('@feathersjs/feathers')
  const { MemoryService } = await import('@feathersjs/memory')
  const { hasOwnProperty } = await import('./_utils.internal.js')
  const { shouldSkip } = await import('./shouldSkip.js')

  it('returns hook object', function () {
    const context = markHookForSkip('test', 'all')
    assert.ok(context, 'returned context')
    assert.ok(context?.params.skipHooks, 'has skipHooks')
  })

  it('returns hook object for undefined context', function () {
    const context = markHookForSkip('test', 'all')
    assert.ok(context, 'returned context')
    assert.ok(context?.params.skipHooks, 'has skipHooks')
  })

  it('skips explicitly before hook', async function () {
    const app = feathers()
    app.use('service', new MemoryService())
    const service = app.service('service')
    const ranInto: Record<string, boolean> = {}
    service.hooks({
      before: {
        all: [
          (context) => {
            markHookForSkip('test', 'before', context)
          },
        ],
        find: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['find'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        get: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['get'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        create: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['create'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        update: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['update'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        patch: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['patch'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        remove: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['remove'] = true
          },
          (context) => {
            context.result = null
          },
        ],
      },
    })
    const methods = {
      find: [],
      get: [1],
      create: [{}],
      update: [1, {}],
      patch: [1, {}],
      remove: [1],
    }
    const promises = Object.keys(methods).map(async (method) => {
      await ((service as any)[method] as any)(...(methods as any)[method])
      assert.ok(
        !hasOwnProperty(ranInto, method),
        `'${method}': did not run into hook`,
      )
      return true
    })

    const results = await Promise.all(promises)
    assert.ok(
      results.every((x) => x === true),
      'all ok',
    )
  })

  it('skips explicitly after hook', async function () {
    const app = feathers()
    app.use('service', new MemoryService())
    const service = app.service('service')
    const ranInto: Record<string, boolean> = {}
    service.hooks({
      before: {
        all: [
          (context) => {
            markHookForSkip('test', 'after', context)
          },
          (context) => {
            context.result = null
            return context
          },
        ],
      },
      after: {
        find: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['find'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        get: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['get'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        create: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['create'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        update: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['update'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        patch: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['patch'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        remove: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranInto['remove'] = true
          },
          (context) => {
            context.result = null
          },
        ],
      },
    })
    const methods = {
      find: [],
      get: [1],
      create: [{}],
      update: [1, {}],
      patch: [1, {}],
      remove: [1],
    }
    const promises = Object.keys(methods).map(async (method) => {
      await ((service as any)[method] as any)(...(methods as any)[method])
      assert.ok(
        !hasOwnProperty(ranInto, method),
        `'${method}': did not run into hook`,
      )
      return true
    })

    const results = await Promise.all(promises)
    assert.ok(
      results.every((x) => x === true),
      'all ok',
    )
  })

  it('skips all hooks', async function () {
    const app = feathers()
    app.use('service', new MemoryService())
    const service = app.service('service')
    const ranIntoBefore: Record<string, boolean> = {}
    const ranIntoAfter: Record<string, boolean> = {}
    service.hooks({
      before: {
        all: [
          (context) => {
            markHookForSkip('test', 'all', context)
          },
        ],
        find: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoBefore['find'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        get: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoBefore['get'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        create: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoBefore['create'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        update: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoBefore['update'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        patch: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoBefore['patch'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        remove: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoBefore['remove'] = true
          },
          (context) => {
            context.result = null
          },
        ],
      },
      after: {
        find: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoAfter['find'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        get: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoAfter['get'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        create: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoAfter['create'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        update: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoAfter['update'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        patch: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoAfter['patch'] = true
          },
          (context) => {
            context.result = null
          },
        ],
        remove: [
          (context) => {
            if (shouldSkip('test', context)) {
              return context
            }
            ranIntoAfter['remove'] = true
          },
          (context) => {
            context.result = null
          },
        ],
      },
    })
    const methods = {
      find: [],
      get: [1],
      create: [{}],
      update: [1, {}],
      patch: [1, {}],
      remove: [1],
    }
    const promises = Object.keys(methods).map(async (method) => {
      await ((service as any)[method] as any)(...(methods as any)[method])
      assert.ok(
        !hasOwnProperty(ranIntoBefore, method),
        `'${method}': did not run into before hook`,
      )
      assert.ok(
        !hasOwnProperty(ranIntoAfter, method),
        `'${method}': did not run into after hook`,
      )
      return true
    })

    const results = await Promise.all(promises)
    assert.ok(
      results.every((x) => x === true),
      'all ok',
    )
  })
}
