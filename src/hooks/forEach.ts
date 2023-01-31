import { shouldSkip } from "../utils/shouldSkip";

import type { ReturnAsyncHook, Promisable } from "../types";
import type { HookContext } from "@feathersjs/feathers";
import type { GetItemsIsArrayOptions } from "../utils/getItemsIsArray";
import { getItemsIsArray } from "../utils/getItemsIsArray";

export interface HookForEachOptions {
  wait?: "sequential" | "parallel" | false
  items?: GetItemsIsArrayOptions["from"]
}

export const forEach = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionPerItem: (item: any, context: HookContext) => Promisable<any>, 
  _options?: HookForEachOptions
): ReturnAsyncHook => {
  const options: Required<HookForEachOptions> = {
    wait: "parallel",
    items: "automatic",
    ..._options
  };

  return async (context: HookContext): Promise<HookContext> => {
    if (shouldSkip("runForItems", context)) { return context; }

    const { items } =  getItemsIsArray(context, { from: options.items });

    const promises: Promise<any>[] = [];

    for (const item of items) {
      const promise = actionPerItem(item, context);

      if (options.wait === "sequential") {
        await promise;
      } else {
        promises.push(promise);
      }
    }

    if (options.wait === "parallel") {
      await Promise.all(promises);
    }

    return context;
  };
};