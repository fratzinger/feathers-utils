import _get from "lodash/get.js";
import _set from "lodash/set.js";
import _has from "lodash/has.js";

import { Forbidden } from "@feathersjs/errors";
import { getItemsIsArray } from "../utils/getItemsIsArray";

import type { HookContext } from "@feathersjs/feathers";
import type { PropertyPath } from "lodash";

import type {
  HookSetDataOptions, 
  ReturnSyncHook 
} from "../types";

const defaultOptions: Required<HookSetDataOptions> = {
  allowUndefined: false,
  overwrite: true
};

export function setData(
  from: PropertyPath, 
  to: PropertyPath, 
  _options?: HookSetDataOptions
): ReturnSyncHook {
  const options: Required<HookSetDataOptions> = Object.assign({}, defaultOptions, _options);
  return (context: HookContext): HookContext => {

    const { items } = getItemsIsArray(context);

    if (!_has(context, from)) {
      if (!context.params?.provider || options.allowUndefined === true) {
        return context;
      }

      if (!options.overwrite && items.every((item: Record<string, unknown>) => _has(item, to))) {
        return context;
      }

      throw new Forbidden(`Expected field ${from.toString()} not available`);
    }

    const val = _get(context, from);

    items.forEach((item: Record<string, unknown>) => {
      let overwrite: boolean;
      if (typeof options.overwrite === "function") {
        overwrite = options.overwrite(item, context);
      } else {
        overwrite = options.overwrite;
      }

      if (!overwrite && _has(item, to)) { return; }

      _set(item, to, val);
    });

    return context;
  };
}