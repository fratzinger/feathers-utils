import { isPlainObject } from './_utils.internal.js'
import type { Params } from '@feathersjs/feathers'

export type SetQueryKeySafelyOptions = {
  mutate?: boolean
}

export const setQueryKeySafely = (
  params: Params,
  key: string,
  value: any,
  operator = '$eq',
  options?: SetQueryKeySafelyOptions,
): Params => {
  const { mutate = false } = options || {}

  // TODO: mutate params
  if (!mutate) {
    params = structuredClone(params)
  }

  if (!params.query) {
    params.query = {}
  }

  // if the key is not in the query, just add it and return
  if (!(key in params.query)) {
    if (operator === '$eq') {
      params.query[key] = value
    } else {
      params.query[key] = {
        [operator]: value,
      }
    }

    return params
  }

  if (isPlainObject(params.query[key]) && !(operator in params.query[key])) {
    params.query[key][operator] = value
  } else {
    params.query.$and ??= []

    params.query.$and.push(
      operator === '$eq'
        ? { [key]: value }
        : {
            [key]: {
              [operator]: value,
            },
          },
    )
  }

  return params
}

if (import.meta.vitest) {
  const { it, assert } = import.meta.vitest

  it('does not mutate by default', function () {
    const params: Params = {
      query: {
        test: true,
      },
    }

    const result = setQueryKeySafely(params, 'test', false)
    assert.deepStrictEqual(params, {
      query: {
        test: true,
      },
    })

    assert.deepStrictEqual(result, {
      query: {
        test: true,
        $and: [{ test: false }],
      },
    })
  })

  it('does not mutate explicitely', function () {
    const params: Params = {
      query: {
        test: true,
      },
    }

    const result = setQueryKeySafely(params, 'test', false, '$eq', {
      mutate: false,
    })

    assert.deepStrictEqual(params, {
      query: {
        test: true,
      },
    })

    assert.deepStrictEqual(result, {
      query: {
        test: true,
        $and: [{ test: false }],
      },
    })
  })

  it('does mutate explicitely', function () {
    const params: Params = {
      query: {
        test: true,
      },
    }

    const result = setQueryKeySafely(params, 'test', false, '$eq', {
      mutate: true,
    })

    assert.equal(params, result)
  })

  it('adds a $eq filter for non existent key', function () {
    const params: Params = {
      query: {},
    }

    const result = setQueryKeySafely(params, 'test', true)
    assert.deepStrictEqual(result, {
      query: {
        test: true,
      },
    })
  })

  it('adds a $ne filter for non existent key', function () {
    const params = {
      query: {},
    }

    const result = setQueryKeySafely(params, 'test', true, '$ne')
    assert.deepStrictEqual(result, {
      query: {
        test: {
          $ne: true,
        },
      },
    })
  })

  it('adds a $eq filter for existing key', function () {
    const params: Params = {
      query: {
        test: true,
      },
    }

    const result = setQueryKeySafely(params, 'test', false)
    assert.deepStrictEqual(result, {
      query: {
        test: true,
        $and: [{ test: false }],
      },
    })
  })

  it('adds a $in filter for existing key with value', function () {
    const params: Params = {
      query: {
        test: true,
      },
    }

    const result = setQueryKeySafely(params, 'test', [true], '$in')
    assert.deepStrictEqual(result, {
      query: {
        test: true,
        $and: [{ test: { $in: [true] } }],
      },
    })
  })

  it('adds a $in filter for existing key with object', function () {
    const params: Params = {
      query: {
        test: {
          $eq: true,
        },
      },
    }

    const result = setQueryKeySafely(params, 'test', [true], '$in')
    assert.deepStrictEqual(result, {
      query: {
        test: {
          $eq: true,
          $in: [true],
        },
      },
    })
  })

  it('adds a $in filter for existing $in', function () {
    const params: Params = {
      query: {
        test: {
          $in: [true],
        },
      },
    }

    const result = setQueryKeySafely(params, 'test', [false], '$in')
    assert.deepStrictEqual(result, {
      query: {
        test: {
          $in: [true],
        },
        $and: [{ test: { $in: [false] } }],
      },
    })
  })
}
