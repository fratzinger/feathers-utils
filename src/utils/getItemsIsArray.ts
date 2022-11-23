import type { HookContext } from "@feathersjs/feathers";

export interface GetItemsIsArrayResult<T = any> {
  items: T[];
  isArray: boolean;
}

/**
 * util to get items from context, return it as an array, no matter if it is an array or not
 * uses `context.result` if existent. uses `context.data` otherwise
 */
export const getItemsIsArray = <T = any, H extends HookContext = HookContext>(
  context: H
): GetItemsIsArrayResult<T> => {
  let itemOrItems = context.result !== undefined ? context.result : context.data;
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
