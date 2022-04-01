// hooks
import { checkMulti } from "./hooks/checkMulti";
import { setData } from "./hooks/setData";

import { runPerItem } from "./hooks/runPerItem";

export const hooks = {
  checkMulti,
  setData,
  runPerItem
};

export { checkMulti };
export { createRelated } from "./hooks/createRelated";
export { setData };
export { removeRelated } from "./hooks/removeRelated";
export { runPerItem };

import { debounceMixin, DebouncedStore } from "./mixins/debounce-mixin";

export const mixins = {
  debounceMixin,
  DebouncedStore
};

export { debounceMixin };
export { DebouncedStore };

export { addHook } from "./utils/addHook";
export { getPaginate } from "./utils/getPaginate";
export { isMulti } from "./utils/isMulti";
export { isPaginated } from "./utils/isPaginated";
export { mergeQuery } from "./utils/mergeQuery/index";
export { mergeArrays } from "./utils/mergeQuery/mergeArrays";
export { pushSet } from "./utils/pushSet";
export { setResultEmpty } from "./utils/setResultEmpty";

export { markHookForSkip } from "./utils/markHookForSkip";
export { filterQuery } from "./utils/filterQuery";
export { getItemsIsArray } from "./utils/getItemsIsArray";
export { shouldSkip } from "./utils/shouldSkip";


export * from "./types";