import checkMulti from "./hooks/checkMulti";
import setData from "./hooks/setData";

export const hooks = {
  checkMulti,
  setData
};

import addHook from "./addHook";
import isMulti from "./isMulti";
import mergeQuery from "./mergeQuery/index";
import mergeArrays from "./mergeQuery/mergeArrays";
import pushSet from "./pushSet";
import shouldSkip from "./shouldSkip";

export { addHook };
export { isMulti };
export { mergeQuery };
export { mergeArrays };
export { pushSet };
export { shouldSkip };