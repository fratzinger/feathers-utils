import { shouldSkip } from "../utils/shouldSkip";

import type { HookRunPerItemOptions, ReturnAsyncHook, Promisable } from "../types";
import type { HookContext } from "@feathersjs/feathers";
import { getItemsIsArray } from "../utils/getItemsIsArray";

const makeOptions = (
  options?: HookRunPerItemOptions
): Required<HookRunPerItemOptions> => {
  options = options || {};
  return Object.assign({
    wait: true
  }, options);
};

export const runPerItem = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionPerItem: (item: any, context: HookContext) => Promisable<any>, 
  _options?: HookRunPerItemOptions
): ReturnAsyncHook => {
  const options = makeOptions(_options);
  return async (context: HookContext): Promise<HookContext> => {
    if (shouldSkip("runForItems", context)) { return context; }
    const { items } = getItemsIsArray(context);
    const promises = items.map(async (item: unknown) => {
      await actionPerItem(item, context);
    });

    if (options.wait) {
      await Promise.all(promises);
    }

    return context;
  };
};