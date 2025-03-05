import type { Query } from '@feathersjs/feathers'

type FilterQueryResult<Q extends Query = Query> = {
  $select: Q['$select'] extends any ? Q['$select'] : never
  $limit: Q['$limit'] extends any ? Q['$limit'] : never
  $skip: Q['$skip'] extends any ? Q['$skip'] : never
  $sort: Q['$sort'] extends any ? Q['$sort'] : never
  query: Omit<Q, '$select' | '$limit' | '$skip' | '$sort'>
}

/**
 * Extracts $select, $limit, $skip, $sort from a query and returns the rest as a query object.
 *
 * @param providedQuery
 * @returns
 */
export function filterQuery<Q extends Query>(
  providedQuery?: Q,
): FilterQueryResult<Q> {
  providedQuery ??= {} as Q
  const { $select, $limit, $skip, $sort, ...query } = providedQuery

  const result: FilterQueryResult<Q> = { query } as any

  if ('$select' in providedQuery) {
    result.$select = $select
  }

  if ('$limit' in providedQuery) {
    result.$limit = $limit
  }

  if ('$skip' in providedQuery) {
    result.$skip = $skip
  }

  if ('$sort' in providedQuery) {
    result.$sort = $sort
  }

  return result
}

export function reassembleQuery(query: FilterQueryResult): Query {
  const { $select, $limit, $skip, $sort, query: rest } = query

  const result: Query = rest

  if ($select !== undefined) {
    result.$select = $select
  }

  if ($limit !== undefined) {
    result.$limit = $limit
  }

  if ($skip !== undefined) {
    result.$skip = $skip
  }

  if ($sort !== undefined) {
    result.$sort = $sort
  }

  return result
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('filterQuery', () => {
    it('should filter query', () => {
      const query = {
        $select: ['a'],
        $limit: 10,
        $skip: 10,
        $sort: {
          a: 1,
        },
        a: 1,
        b: 2,
      }

      expect(filterQuery(query)).toEqual({
        $select: ['a'],
        $limit: 10,
        $skip: 10,
        $sort: {
          a: 1,
        },
        query: {
          a: 1,
          b: 2,
        },
      })
    })

    it('should not include filters if not provided', () => {
      const query = {
        a: 1,
        b: 2,
      }

      expect(filterQuery(query)).toEqual({
        query: {
          a: 1,
          b: 2,
        },
      })
    })

    it('sets empty query object if empty object is provided', () => {
      expect(filterQuery({})).toEqual({
        query: {},
      })
    })

    it('sets empty query object if undefined is provided', () => {
      expect(filterQuery(undefined)).toEqual({
        query: {},
      })
    })
  })

  describe('reassembleQuery', () => {
    it('should filter query', () => {
      expect(
        reassembleQuery(
          filterQuery({
            $select: ['a'],
            $limit: 10,
            $skip: 10,
            $sort: {
              a: 1,
            },
            a: 1,
            b: 2,
          }),
        ),
      ).toEqual({
        $select: ['a'],
        $limit: 10,
        $skip: 10,
        $sort: {
          a: 1,
        },
        a: 1,
        b: 2,
      })
    })

    it('should not include filters if not provided', () => {
      expect(
        reassembleQuery(
          filterQuery({
            a: 1,
            b: 2,
          }),
        ),
      ).toEqual({
        a: 1,
        b: 2,
      })
    })

    it('sets empty query object if empty object is provided', () => {
      expect(reassembleQuery(filterQuery({}))).toEqual({})
    })
  })
}
