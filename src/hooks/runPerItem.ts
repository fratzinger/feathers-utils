import { shouldSkip, getItemsIsArray } from "../utils";

import type { HookContext } from "@feathersjs/feathers";
import type { Promisable } from "../typesInternal";

export interface HookRunPerItemOptions {
  wait?: boolean;
}

const makeOptions = (
  options?: HookRunPerItemOptions
): Required<HookRunPerItemOptions> => {
  options = options || {};
  return Object.assign(
    {
      wait: true,
    },
    options
  );
};

/**
 * hook to run a hook for each item in the context
 * uses `context.result` if it is existent. otherwise uses context.data
 */
export const runPerItem = <H extends HookContext = HookContext>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionPerItem: (item: any, context: H) => Promisable<any>,
  _options?: HookRunPerItemOptions
) => {
  const options = makeOptions(_options);
  return async (context: H) => {
    if (shouldSkip("runForItems", context)) {
      return context;
    }

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
