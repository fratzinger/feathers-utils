import _get from "lodash/get";
import _set from "lodash/set";
import _has from "lodash/has";

import { getItems } from "feathers-hooks-common";

import { Forbidden } from "@feathersjs/errors";

import type { HookContext } from "@feathersjs/feathers";

import type {
  HookSetDataOptions
} from "../types";

const defaultOptions: Required<HookSetDataOptions> = {
  allowUndefined: false,
  overwrite: true
};

function setData(
  from: string[], 
  to: string[], 
  _options?: HookSetDataOptions
): ((context: HookContext) => HookContext) {
  const options: Required<HookSetDataOptions> = Object.assign({}, defaultOptions, _options);
  return (context: HookContext): HookContext => {

    let items = getItems(context);
    items = (Array.isArray(items)) ? items : [items];

    const val = _get(context, from);

    if (val === undefined) {
      if (!context.params?.provider || options.allowUndefined === true) {
        return context;
      }

      throw new Forbidden(`Expected field ${from.toString()} not available`);
    }

    items.forEach((item: Record<string, unknown>) => {
      if (!options.overwrite && _has(item, to)) { return; }
      
      _set(item, to, val);
    });

    return context;
  };
}

export default setData;