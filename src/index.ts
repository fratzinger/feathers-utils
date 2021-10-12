// hooks
import checkMulti from "./hooks/checkMulti";
import setData from "./hooks/setData";
import runPerItem from "./hooks/runPerItem";

export const hooks = {
  checkMulti,
  setData,
  runPerItem
};

export { checkMulti };
export { setData };
export { runPerItem };

import debounceMixin, { DebouncedStore } from "./mixins/debounce-mixin";

export const mixins = {
  debounceMixin,
  DebouncedStore
};

export * as addHook from "./utils/addHook";
export * as isMulti from "./utils/isMulti";
export * as mergeQuery from "./utils/mergeQuery/index";
export * as mergeArrays from "./utils/mergeQuery/mergeArrays";
export * as pushSet from "./utils/pushSet";

export * as markHookForSkip from "./utils/markHookForSkip";
export * as shouldSkip from "./utils/shouldSkip";

export * as filterQuery from "./utils/filterQuery";

export * from "./types";