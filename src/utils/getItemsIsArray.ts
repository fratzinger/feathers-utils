import type { HookContext } from "@feathersjs/feathers";
import type { GetItemsIsArrayResult } from "..";

export type GetItemsIsArrayOptions = {
  from: "data" | "result" | "automatic"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getItemsIsArray = <T = any>(
  context: HookContext,
  options?: GetItemsIsArrayOptions
): GetItemsIsArrayResult<T> => {
  const {
    from = "automatic"
  } = options || {};

  let itemOrItems;

  if (from === "automatic") {
    itemOrItems = context.type === "before" 
      ? context.data 
      : context.result;
    itemOrItems = itemOrItems && context.method === "find" 
      ? (itemOrItems.data || itemOrItems) 
      : itemOrItems;
  } else if (from === "data") {
    itemOrItems = context.data;
  } else if (from === "result") {
    itemOrItems = context.result;
  }
  
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