import { HookContext } from "@feathersjs/feathers";
import { HookType } from "feathers-hooks-common/types";
import pushSet from "./pushSet";

function markHookForSkip<T>(
  hookName: string, 
  type: "all" | HookType | HookType[], 
  context?: Partial<HookContext<T>>
): Partial<HookContext<T>> {
  context = context || {};
  const params = context.params || {};
  const types: string[] = (Array.isArray(type)) ? type : [type];
  
  types.forEach(t => {
    const combinedName = (t === "all")
      ? hookName
      : `${type}:${hookName}`;
    pushSet(params, "skipHooks", combinedName, { unique: true });
  });
  
  context.params = params;
  return context;
}

export default markHookForSkip;