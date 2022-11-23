import type { HookContext } from "@feathersjs/feathers";

export interface GetItemsIsArrayOptions<T = any> {
  items: T[];
  isArray: boolean;
}

/**
 * util to get items from context, return it as an array, no matter if it is an array or not
 * in a before hook, it uses `context.data`. in an after hook, it uses `context.result`
 */
export const getItemsIsArray = <T = any, H extends HookContext = HookContext>(
  context: H
): GetItemsIsArrayOptions<T> => {
  let itemOrItems = context.type === "before" ? context.data : context.result;
  itemOrItems =
    itemOrItems && context.method === "find"
      ? itemOrItems.data || itemOrItems
      : itemOrItems;
  const isArray = Array.isArray(itemOrItems);
  return {
    items: isArray ? itemOrItems : itemOrItems != null ? [itemOrItems] : [],
    isArray,
  };
};
