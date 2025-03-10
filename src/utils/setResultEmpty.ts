import type { HookContext } from '@feathersjs/feathers'
import { isMulti } from './isMulti.js'
import { isPaginated } from './isPaginated.js'

/**
 * util to set `context.result` to an empty array or object, depending on the hook type
 */
export const setResultEmpty = <H extends HookContext = HookContext>(
  context: H,
) => {
  if (context.result) {
    return context
  }

  const multi = isMulti(context)

  if (multi) {
    if (context.method === 'find' && isPaginated(context)) {
      context.result = {
        total: 0,
        skip: 0,
        limit: 0,
        data: [],
      }
    } else {
      context.result = []
    }
  } else {
    context.result = null
  }

  return context
}

if (import.meta.vitest) {
  const { it, assert } = import.meta.vitest

  const paginatedService = {
    options: {
      paginate: {
        default: 10,
        max: 50,
      },
    },
  }

  const nonPaginatedService = {
    options: {
      paginate: false,
    },
  }

  const paramsEmpty = {}
  const paramsPaginateFalse = { paginate: false }
  const paramsPaginate = { paginate: { default: 10, max: 50 } }
  const paramsAdapterPaginate = {
    adapter: { paginate: { default: 10, max: 50 } },
  }

  it('does not overwrite result', function () {
    ;['find', 'get', 'create', 'update', 'patch', 'remove'].forEach(
      (method) => {
        ;['before', 'after'].forEach((type) => {
          ;[paginatedService, nonPaginatedService].forEach((service) => {
            ;[paramsPaginateFalse, paramsAdapterPaginate].forEach((params) => {
              const context = setResultEmpty({
                method,
                type,
                service,
                params,
                result: 123,
              } as any as HookContext)

              assert.deepStrictEqual(
                context.result,
                123,
                `result is not changed. '${type}:${method}': '${service}' - '${params}'`,
              )
            })
          })
        })
      },
    )
  })

  describe('find', function () {
    it('sets paginated result', function () {
      const combos = [
        { service: paginatedService, params: paramsEmpty },
        { service: paginatedService, params: paramsAdapterPaginate },
        { service: nonPaginatedService, params: paramsPaginate },
        { service: nonPaginatedService, params: paramsAdapterPaginate },
      ]

      combos.forEach(({ service, params }, i) => {
        const { result } = setResultEmpty({
          service,
          params,
          method: 'find',
        } as any as HookContext)
        assert.deepStrictEqual(
          result,
          { total: 0, skip: 0, limit: 0, data: [] },
          `'${i}': result is paginated empty`,
        )
      })
    })

    it('sets empty array', function () {
      const combos = [
        { service: paginatedService, params: paramsPaginateFalse },
        { service: nonPaginatedService, params: paramsEmpty },
      ]

      combos.forEach(({ service, params }, i) => {
        const { result } = setResultEmpty({
          service,
          params,
          method: 'find',
        } as any as HookContext)
        assert.deepStrictEqual(result, [], `'${i}': result is empty array`)
      })
    })
  })

  describe('get', function () {
    it('sets result to null', function () {
      const combos = [
        { service: paginatedService, params: paramsEmpty },
        { service: paginatedService, params: paramsAdapterPaginate },
        { service: paginatedService, params: paramsPaginateFalse },
        { service: nonPaginatedService, params: paramsPaginate },
        { service: nonPaginatedService, params: paramsAdapterPaginate },
      ]

      combos.forEach(({ service, params }, i) => {
        const { result } = setResultEmpty({
          service,
          params,
          method: 'get',
        } as any as HookContext)
        assert.deepStrictEqual(result, null, `'${i}': result is null`)
      })
    })
  })

  describe('create', function () {
    it('sets result to null for single data', function () {
      const combos = [
        { service: paginatedService, params: paramsEmpty },
        { service: paginatedService, params: paramsAdapterPaginate },
        { service: paginatedService, params: paramsPaginateFalse },
        { service: nonPaginatedService, params: paramsPaginate },
        { service: nonPaginatedService, params: paramsAdapterPaginate },
      ]

      combos.forEach(({ service, params }, i) => {
        const { result } = setResultEmpty({
          service,
          params,
          method: 'create',
          data: { id: 1 },
        } as any as HookContext)
        assert.deepStrictEqual(result, null, `'${i}': result is null`)
      })
    })

    it('sets result to empty array for array data', function () {
      const combos = [
        { service: paginatedService, params: paramsEmpty },
        { service: paginatedService, params: paramsAdapterPaginate },
        { service: paginatedService, params: paramsPaginateFalse },
        { service: nonPaginatedService, params: paramsPaginate },
        { service: nonPaginatedService, params: paramsAdapterPaginate },
      ]

      combos.forEach(({ service, params }, i) => {
        const { result } = setResultEmpty({
          service,
          params,
          method: 'create',
          data: [{ id: 1 }],
          type: 'before',
        } as any as HookContext)
        assert.deepStrictEqual(result, [], `'${i}': result is empty array`)
      })
    })
  })

  describe('update', function () {
    it('sets result to null', function () {
      const combos = [
        { service: paginatedService, params: paramsEmpty },
        { service: paginatedService, params: paramsAdapterPaginate },
        { service: paginatedService, params: paramsPaginateFalse },
        { service: nonPaginatedService, params: paramsPaginate },
        { service: nonPaginatedService, params: paramsAdapterPaginate },
      ]

      combos.forEach(({ service, params }, i) => {
        const { result } = setResultEmpty({
          service,
          params,
          method: 'update',
          id: 1,
        } as any as HookContext)
        assert.deepStrictEqual(result, null, `'${i}': result is null`)
      })
    })
  })

  describe('patch', function () {
    it('sets result to null for id: 1', function () {
      const combos = [
        { service: paginatedService, params: paramsEmpty },
        { service: paginatedService, params: paramsAdapterPaginate },
        { service: paginatedService, params: paramsPaginateFalse },
        { service: nonPaginatedService, params: paramsPaginate },
        { service: nonPaginatedService, params: paramsAdapterPaginate },
      ]

      combos.forEach(({ service, params }, i) => {
        const { result } = setResultEmpty({
          service,
          params,
          method: 'patch',
          id: 1,
        } as any as HookContext)
        assert.deepStrictEqual(result, null, `'${i}': result is null`)
      })
    })

    it('sets result to empty array for id: null', function () {
      const combos = [
        { service: paginatedService, params: paramsEmpty },
        { service: paginatedService, params: paramsAdapterPaginate },
        { service: paginatedService, params: paramsPaginateFalse },
        { service: nonPaginatedService, params: paramsPaginate },
        { service: nonPaginatedService, params: paramsAdapterPaginate },
      ]

      combos.forEach(({ service, params }, i) => {
        const { result } = setResultEmpty({
          service,
          params,
          method: 'patch',
          id: null,
        } as any as HookContext)
        assert.deepStrictEqual(result, [], `'${i}': result is empty array`)
      })
    })
  })

  describe('remove', function () {
    it('sets result to null for id: 1', function () {
      const combos = [
        { service: paginatedService, params: paramsEmpty },
        { service: paginatedService, params: paramsAdapterPaginate },
        { service: paginatedService, params: paramsPaginateFalse },
        { service: nonPaginatedService, params: paramsPaginate },
        { service: nonPaginatedService, params: paramsAdapterPaginate },
      ]

      combos.forEach(({ service, params }, i) => {
        const { result } = setResultEmpty({
          service,
          params,
          method: 'remove',
          id: 1,
        } as any as HookContext)
        assert.deepStrictEqual(result, null, `'${i}': result is null`)
      })
    })

    it('sets result to empty array for id: null', function () {
      const combos = [
        { service: paginatedService, params: paramsEmpty },
        { service: paginatedService, params: paramsAdapterPaginate },
        { service: paginatedService, params: paramsPaginateFalse },
        { service: nonPaginatedService, params: paramsPaginate },
        { service: nonPaginatedService, params: paramsAdapterPaginate },
      ]

      combos.forEach(({ service, params }, i) => {
        const { result } = setResultEmpty({
          service,
          params,
          method: 'remove',
          id: null,
        } as any as HookContext)
        assert.deepStrictEqual(result, [], `'${i}': result is empty array`)
      })
    })
  })
}
