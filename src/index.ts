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
export { setData };
export { runPerItem };

import { debounceMixin, DebouncedStore } from "./mixins/debounce-mixin";

export const mixins = {
  debounceMixin,
  DebouncedStore
};

export { debounceMixin };
export { DebouncedStore };

export { addHook } from "./utils/addHook";
export { isMulti } from "./utils/isMulti";
export { mergeQuery } from "./utils/mergeQuery/index";
export { mergeArrays } from "./utils/mergeQuery/mergeArrays";
export { pushSet } from "./utils/pushSet";

export { markHookForSkip } from "./utils/markHookForSkip";
export { shouldSkip } from "./utils/shouldSkip";

export { filterQuery } from "./utils/filterQuery";

export * from "./types";