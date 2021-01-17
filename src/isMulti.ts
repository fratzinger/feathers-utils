import { HookContext } from "@feathersjs/feathers";

const isMulti = (context: HookContext): boolean => {
  const { method } = context;
  if (method === "find") {
    return true;
  } else if (["patch", "remove"].includes(context.method)) {
    return context.id == null;
  } else if (method === "create") {
    const items = context.type === "before" ? context.data : context.result;
    items && context.method === "find" ? items.data || items : items;
    return Array.isArray(items);
  } else if (method === "get" || method === "update") {
    return false;
  }
  return false;
};

export default isMulti;