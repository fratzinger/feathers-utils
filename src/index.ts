// hooks
import changesById from "./hooks/changesById";
import checkMulti from "./hooks/checkMulti";
import setData from "./hooks/setData";
import runPerItem from "./hooks/runPerItem";

export const hooks = {
  changesById,
  checkMulti,
  setData,
  runPerItem
};

import debounceMixin, { DebouncedStore } from "./mixins/debounce-mixin";

export const mixins = {
  debounceMixin,
  DebouncedStore
};

import addHook from "./utils/addHook";
import isMulti from "./utils/isMulti";
import mergeQuery from "./utils/mergeQuery/index";
import mergeArrays from "./utils/mergeQuery/mergeArrays";
import pushSet from "./utils/pushSet";

import markHookForSkip from "./utils/markHookForSkip";
import shouldSkip from "./utils/shouldSkip";

import filterQuery from "./utils/filterQuery";

export { addHook };
export { isMulti };
export { mergeQuery };
export { mergeArrays };
export { pushSet };

export { markHookForSkip };
export { shouldSkip };

export { filterQuery };

export * from "./types";