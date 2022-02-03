import { pushSet } from "./pushSet";

import type { HookContext } from "@feathersjs/feathers";
import type { HookType, MaybeArray } from "../types";

export function markHookForSkip<T>(
  hookName: string, 
  type: "all" | MaybeArray<HookType>, 
  context?: Partial<HookContext<T>>
): Partial<HookContext<T>> {
  context = context || {};
  const params = context.params || {};
  const types: string[] = (Array.isArray(type)) ? type : [type];
  
  types.forEach(t => {
    const combinedName = (t === "all")
      ? hookName
      : `${type}:${hookName}`;
    pushSet(params, ["skipHooks"], combinedName, { unique: true });
  });
  
  context.params = params;
  return context;
}