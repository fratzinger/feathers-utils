import type { HookContext } from "@feathersjs/feathers";
import type { GetItemsIsArrayOptions } from "..";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getItemsIsArray = <T = any>(
  context: HookContext
): GetItemsIsArrayOptions<T> => {
  let itemOrItems = context.type === "before" 
    ? context.data 
    : context.result;
  itemOrItems = itemOrItems && context.method === "find" 
    ? (itemOrItems.data || itemOrItems) 
    : itemOrItems;
  const isArray = Array.isArray(itemOrItems);
  return {
    items: (isArray) 
      ? itemOrItems 
      : (itemOrItems != null) 
        ? [itemOrItems] 
        : [],
    isArray
  };
};