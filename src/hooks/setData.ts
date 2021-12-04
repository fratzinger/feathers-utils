import _get from "lodash/get";
import _set from "lodash/set";
import _has from "lodash/has";

import { getItems } from "feathers-hooks-common";

import { Forbidden } from "@feathersjs/errors";

import type { HookContext } from "@feathersjs/feathers";

import type {
  HookSetDataOptions
} from "../types";
import type { PropertyPath } from "lodash";

const defaultOptions: Required<HookSetDataOptions> = {
  allowUndefined: false,
  overwrite: true
};

export function setData(
  from: PropertyPath, 
  to: PropertyPath, 
  _options?: HookSetDataOptions
): ((context: HookContext) => HookContext) {
  const options: Required<HookSetDataOptions> = Object.assign({}, defaultOptions, _options);
  return (context: HookContext): HookContext => {

    //@ts-expect-error type error because feathers-hooks-common is feathers@4
    let items = getItems(context);
    items = (Array.isArray(items)) ? items : [items];

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
      if (!options.overwrite && _has(item, to)) { return; }

      _set(item, to, val);
    });

    return context;
  };
}