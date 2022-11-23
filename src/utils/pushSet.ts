import _isEqual from "lodash/isEqual.js";
import _get from "lodash/get.js";
import _set from "lodash/set.js";
import type { Path } from "../typesInternal";

export interface PushSetOptions {
  unique?: boolean;
}

/**
 * util to push a value to an array at a given path in an object
 */
export const pushSet = (
  obj: Record<string, unknown>,
  path: string | Path,
  val: unknown,
  options?: PushSetOptions
): unknown[] => {
  options = options || {};
  let arr = _get(obj, path);
  if (!arr || !Array.isArray(arr)) {
    arr = [val];
    _set(obj, path, arr);
    return arr;
  } else {
    if (options.unique && arr.some((x) => _isEqual(x, val))) {
      return arr;
    }
    arr.push(val);
    return arr;
  }
};
