import { shouldSkip } from "../utils/shouldSkip";

import type { ReturnAsyncHook, Promisable } from "../typesInternal";
import type { HookContext } from "@feathersjs/feathers";
import type { GetItemsIsArrayOptions } from "../utils/getItemsIsArray";
import { getItemsIsArray } from "../utils/getItemsIsArray";

export type HookForEachOptions<T = any, H = HookContext, R = never> = {
  wait?: "sequential" | "parallel" | false;
  items?: GetItemsIsArrayOptions["from"];
  forAll?: (items: T[], context: H) => Promisable<R>;
};

type ActionPerItem<T, H, R> = (
  item: T,
  options: {
    context: H;
    i: number;
    fromAll: R;
  },
) => Promisable<any>;

export const forEach = <
  H extends HookContext = HookContext,
  T = any,
  R = never,
>(
  actionPerItem: ActionPerItem<T, H, R>,
  options?: HookForEachOptions<T, H, R>,
): ReturnAsyncHook<H> => {
  const { wait = "parallel", items: from = "automatic" } = options || {};

  return async (context: H): Promise<H> => {
    if (shouldSkip("forEach", context)) {
      return context;
    }

    const { items } = getItemsIsArray(context, { from });

    const forAll = options?.forAll
      ? await options.forAll(items, context)
      : ({} as R);

    const promises: Promise<any>[] = [];

    let i = 0;

    for (const item of items) {
      const promise = actionPerItem(item, {
        context,
        i,
        fromAll: forAll,
      });

      if (wait === "sequential") {
        await promise;
      } else {
        promises.push(promise);
      }

      i++;
    }

    if (wait === "parallel") {
      await Promise.all(promises);
    }

    return context;
  };
};
