import * as src from '../src/index.js'

describe('index.ts', function () {
  it('exports all members', function () {
    const members: Record<keyof typeof src, boolean> = {
      // hooks
      checkMulti: true,
      createRelated: true,
      forEach: true,
      onDelete: true,
      paramsForServer: true,
      paramsFromClient: true,
      parseFields: true,
      removeRelated: true,
      runPerItem: true,
      setData: true,

      // utils
      DebouncedStore: true,
      debounceMixin: true,
      defineHooks: true,
      defineParamsForServer: true,
      defineParamsFromClient: true,
      deflattenQuery: true,
      filterArray: true,
      filterObject: true,
      filterQuery: true,
      flattenQuery: true,
      getItemsIsArray: true,
      getPaginate: true,
      isMulti: true,
      isPaginated: true,
      markHookForSkip: true,
      mergeArrays: true,
      mergeQuery: true,
      optimizeBatchPatch: true,
      pushSet: true,
      reassembleQuery: true,
      setQueryKeySafely: true,
      setResultEmpty: true,
      shouldSkip: true,
      toJSON: true,
      validateQueryProperty: true,
    }

    Object.keys(members).forEach((key: string) =>
      expect((src as any)[key as any]).toBeDefined(),
    )
  })
})
