import { getItems } from "feathers-hooks-common";

import { shouldSkip } from "../utils/shouldSkip";

import type { HookRunPerItemOptions } from "../types";
import type { HookContext } from "@feathersjs/feathers";

const makeOptions = (
  options: HookRunPerItemOptions
): Required<HookRunPerItemOptions> => {
  options = options || {};
  return Object.assign({
    wait: true
  }, options);
};

export const runPerItem = (
  actionPerItem: (item: any, context: HookContext) => Promise<any>, 
  options: HookRunPerItemOptions
): ((context: HookContext) => Promise<HookContext>) => {
  options = makeOptions(options);
  return async (context: HookContext): Promise<HookContext> => {
    if (shouldSkip("runForItems", context)) { return context; }
    let items = getItems(context);
    items = (Array.isArray(items)) ? items : [items];

    const promises = items.map(async (item: unknown) => {
      await actionPerItem(item, context);
    });

    if (options.wait) {
      await Promise.all(promises);
    }

    return context;
  };
};