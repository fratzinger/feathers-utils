import _isEqual from "lodash/isEqual";
import _get from "lodash/get";
import _set from "lodash/set";

import type {
  Path,
  PushSetOptions
} from "../types";

export const pushSet = (obj: Record<string, unknown>, path: string | Path, val: unknown, options?: PushSetOptions): unknown[] => {
  options = options || {};
  let arr = _get(obj, path);
  if (!arr || !Array.isArray(arr)) {
    arr = [val];
    _set(obj, path, arr);
    return arr;
  } else {
    if (options.unique && arr.some(x => _isEqual(x, val))) { return arr; }
    arr.push(val);
    return arr;
  }
};