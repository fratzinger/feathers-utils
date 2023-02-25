import type { HookContext } from "@feathersjs/feathers";

/**
 * util to check if a hook is a multi hook:
 * - find: true
 * - get: false
 * - create: `context.data` is an array
 * - update: false
 * - patch: `context.id == null`
 * - remove: `context.id == null`
 */
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
