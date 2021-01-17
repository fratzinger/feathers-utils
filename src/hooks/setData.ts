import _get from "lodash/get";
import _set from "lodash/set";

import { getItems } from "feathers-hooks-common";

import { Forbidden } from "@feathersjs/errors";
import { HookContext } from "@feathersjs/feathers";

import {
  HookSetDataOptions,
  Path 
} from "../types";

export default (from: Path, to: Path, options?: HookSetDataOptions): ((context: HookContext) => HookContext) => {
  options = options || {};
  return (context: HookContext): HookContext => {

    let items = getItems(context);
    items = (Array.isArray(items)) ? items : [items];

    const val = _get(context, from);

    if (val === undefined) {
      if (!context.params?.provider || options?.allowUndefined === true) {
        return context;
      }

      throw new Forbidden(`Expected field ${from} not available`);
    }

    items.forEach((item: Record<string, unknown>) => {
      _set(item, to, val);
    });

    return context;
  };
};
