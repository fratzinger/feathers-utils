import type { HookContext, Params, Query } from '@feathersjs/feathers'
import { FROM_CLIENT_FOR_SERVER_DEFAULT_KEY } from './common.js'

export function defineParamsForServer(keyToHide: string) {
  return function paramsForServer(...whitelist: string[]) {
    return <H extends HookContext>(context: H) => {
      // clone params on demand
      let clonedParams: (Params & { query: Query }) | undefined

      Object.keys(context.params).forEach((key) => {
        if (key === 'query') {
          return
        }

        if (whitelist.includes(key)) {
          const currentParams = clonedParams ?? {
            ...context.params,
            query: {
              ...context.params.query,
            },
          }

          if (!currentParams.query[keyToHide]) {
            currentParams.query[keyToHide] = {}
          }

          currentParams.query[keyToHide][key] = currentParams[key]
          delete currentParams[key]

          clonedParams = currentParams
        }
      })

      if (clonedParams) {
        context.params = clonedParams
      }

      return context
    }
  }
}

/**
 * a hook to move params to query._$client
 * the server only receives 'query' from params. All other params are ignored.
 * So, to use `$populateParams` on the server, we need to move the params to query._$client
 * the server will move them back to params
 */
export const paramsForServer = defineParamsForServer(
  FROM_CLIENT_FOR_SERVER_DEFAULT_KEY,
)

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('should move params to query._$client', () => {
    expect(
      paramsForServer(
        'a',
        'b',
      )({
        params: {
          a: 1,
          b: 2,
          query: {},
        },
      } as HookContext),
    ).toEqual({
      params: {
        query: {
          _$client: {
            a: 1,
            b: 2,
          },
        },
      },
    })
  })

  it('should move params to query._$client and leave remaining', () => {
    expect(
      paramsForServer('a')({
        params: {
          a: 1,
          b: 2,
          query: {},
        },
      } as HookContext),
    ).toEqual({
      params: {
        b: 2,
        query: {
          _$client: {
            a: 1,
          },
        },
      },
    })
  })
}
