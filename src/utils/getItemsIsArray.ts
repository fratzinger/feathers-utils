import type { HookContext } from "@feathersjs/feathers";

export interface GetItemsIsArrayOptions<T = any> {
  items: T[];
  isArray: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
