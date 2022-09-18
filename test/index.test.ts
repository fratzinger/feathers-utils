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
  // mixins
  debounceMixin,
  DebouncedStore,
  // hooks
  checkMulti,
  setData,
  runPerItem

} from "../src";

describe("index.ts", function() {
  it("exports all members", function() {
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
      getItemsIsArray, 
      shouldSkip, 
      debounceMixin,
      DebouncedStore, 
      checkMulti, 
      setData,
      runPerItem
    ];

    members.forEach((member) => assert.ok(member));
  });
});