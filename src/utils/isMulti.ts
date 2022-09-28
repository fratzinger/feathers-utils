import type { HookContext } from "@feathersjs/feathers";

export const isMulti = <H extends HookContext = HookContext>(
  context: H
): boolean => {
  const { method } = context;
  if (method === "find") {
    return true;
  } else if (["patch", "remove"].includes(method)) {
    return context.id == null;
  } else if (method === "create") {
    const items = context.type === "before" ? context.data : context.result;
    return Array.isArray(items);
  } else if (["get", "update"].includes(method)) {
    return false;
  }
  return false;
};
