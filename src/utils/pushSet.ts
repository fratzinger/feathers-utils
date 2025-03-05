import { deepEqual as _isEqual } from 'fast-equals'
import _get from 'lodash/get.js'
import _set from 'lodash/set.js'
import type { Path } from '../typesInternal.js'

export interface PushSetOptions {
  unique?: boolean
}

/**
 * util to push a value to an array at a given path in an object
 */
export const pushSet = (
  obj: Record<string, unknown>,
  path: string | Path,
  val: unknown,
  options?: PushSetOptions,
): unknown[] => {
  options = options || {}
  let arr = _get(obj, path)
  if (!arr || !Array.isArray(arr)) {
    arr = [val]
    _set(obj, path, arr)
    return arr
  } else {
    if (options.unique && arr.some((x) => _isEqual(x, val))) {
      return arr
    }
    arr.push(val)
    return arr
  }
}

if (import.meta.vitest) {
  const { describe, it, assert } = import.meta.vitest

  it('pushes to existing array', function () {
    const obj = {
      arr: [1],
    }
    pushSet(obj, ['arr'], 2)
    assert.deepStrictEqual(obj, { arr: [1, 2] })
  })

  it('sets array for not existing', function () {
    const obj = {}
    pushSet(obj, ['arr'], 2)
    assert.deepStrictEqual(obj, { arr: [2] })
  })

  it('adds existing element', function () {
    const obj = {
      arr: [1],
    }
    pushSet(obj, ['arr'], 1)
    assert.deepStrictEqual(obj, { arr: [1, 1] })
  })

  it('skips existing element', function () {
    const obj = {
      arr: [1],
    }
    pushSet(obj, ['arr'], 1, { unique: true })
    assert.deepStrictEqual(obj, { arr: [1] })
  })

  describe('deep dot notation', function () {
    it('deep: pushes to existing array', function () {
      const obj = {
        nested: { deep: [{ arr: [1] }] },
      }
      pushSet(obj, ['nested', 'deep', 0, 'arr'], 2)
      assert.deepStrictEqual(obj, { nested: { deep: [{ arr: [1, 2] }] } })
    })

    it('deep: sets array for not existing', function () {
      const obj = {}
      pushSet(obj, ['nested', 'deep', 0, 'arr'], 2)
      assert.deepStrictEqual(obj, { nested: { deep: [{ arr: [2] }] } })
    })

    it('deep: adds existing element', function () {
      const obj = {
        nested: { deep: [{ arr: [1] }] },
      }
      pushSet(obj, ['nested', 'deep', 0, 'arr'], 1)
      assert.deepStrictEqual(obj, { nested: { deep: [{ arr: [1, 1] }] } })
    })

    it('deep: skips existing element', function () {
      const obj = {
        nested: { deep: [{ arr: [1] }] },
      }
      pushSet(obj, ['nested', 'deep', 0, 'arr'], 1, { unique: true })
      assert.deepStrictEqual(obj, { nested: { deep: [{ arr: [1] }] } })
    })
  })
}
