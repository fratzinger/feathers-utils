import type { Query } from '@feathersjs/feathers'
import _set from 'lodash/set.js'
import { isObject } from './_utils.internal.js'

export function deflattenQuery(query: Query) {
  const result: Query = {}

  Object.keys(query).forEach((key) => {
    const value = query[key]

    if (Array.isArray(value)) {
      _set(result, key, value.map(deflattenQuery))
      return
    }

    if (isObject(value)) {
      _set(result, key, deflattenQuery(value))
      return
    }

    _set(result, key, query[key])
  })

  return result
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('deflattenQuery', () => {
    it('should deflatten a query', () => {
      expect(
        deflattenQuery({
          a: 1,
          'b.c': 1,
          'b.d': 1,
          'e.f.g': 1,
        }),
      ).toEqual({
        a: 1,
        b: {
          c: 1,
          d: 1,
        },
        e: {
          f: {
            g: 1,
          },
        },
      })
    })
  })

  it('should handle operators', () => {
    expect(
      deflattenQuery({
        'a.b': 1,
        c: {
          $gt: 1,
          $lte: 1,
        },
      }),
    ).toEqual({
      a: {
        b: 1,
      },
      c: {
        $gt: 1,
        $lte: 1,
      },
    })
  })

  it('should handle $or / $and', () => {
    expect(
      deflattenQuery({
        'a.b': 1,
        $and: [
          {
            'c.d': 1,
          },
        ],
        $or: [
          {
            'e.f': 1,
          },
        ],
      }),
    ).toEqual({
      a: {
        b: 1,
      },
      $and: [
        {
          c: {
            d: 1,
          },
        },
      ],
      $or: [
        {
          e: {
            f: 1,
          },
        },
      ],
    })
  })
}
