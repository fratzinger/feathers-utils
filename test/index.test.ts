import assert from "assert";
import {
  // utils
  getPaginate,
  isMulti,
  isPaginated,
  mergeQuery,
  mergeArrays,
  pushSet,
  setResultEmpty,
  markHookForSkip,
  filterQuery,
  getItemsIsArray,
  shouldSkip,
  // filters
  filterArray,
  filterObject,
  // mixins
  debounceMixin,
  DebouncedStore,
  // hooks
  checkMulti,
  setData,
  runPerItem,
  createRelated,
} from "../src";

describe("index.ts", function () {
  it("exports all members", function () {
    const members = [
      getPaginate,
      isMulti,
      isPaginated,
      mergeQuery,
      mergeArrays,
      pushSet,
      setResultEmpty,
      markHookForSkip,
      filterQuery,
      filterArray,
      filterObject,
      getItemsIsArray,
      shouldSkip,
      debounceMixin,
      DebouncedStore,
      checkMulti,
      setData,
      runPerItem,
      createRelated,
    ];

    members.forEach((member) => assert.ok(member));
  });
});
