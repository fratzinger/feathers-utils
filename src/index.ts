import checkMulti from "./hooks/checkMulti";
import setData from "./hooks/setData";

export const hooks = {
  checkMulti,
  setData
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
import shouldSkip from "./utils/shouldSkip";
import filterQuery from "./utils/filterQuery";

export { addHook };
export { isMulti };
export { mergeQuery };
export { mergeArrays };
export { pushSet };
export { shouldSkip };
export { filterQuery };

export * from "./types";