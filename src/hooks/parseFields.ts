import type { HookContext } from "@feathersjs/feathers";
import { getItemsIsArray } from "../utils/getItemsIsArray";

/**
 * Parse fields to date or number
 * skips undefined fields
 */
export const parseFields = (type: "date" | "number", options: { fields: string[] }) => (context: HookContext) => {
  const { items } = getItemsIsArray(context);
  
  items.forEach(item => {
    options.fields.forEach(field => {
      // ignore undefined fields
      if (!(field in item)) {
        return;
      }
  
      if (type === "date") {
        item[field] = new Date(item[field]);
      } else if (type === "number") {
        item[field] = Number(item[field]);
      }
    });
  });

  return context;
};