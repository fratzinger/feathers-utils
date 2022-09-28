import { pushSet } from "./pushSet";

import type { HookContext } from "@feathersjs/feathers";
import type { HookType } from "feathers-hooks-common";
import type { MaybeArray } from "../typesInternal";

export function markHookForSkip<H extends HookContext = HookContext>(
  hookName: string,
  type: "all" | MaybeArray<HookType>,
  context?: H
) {
  // @ts-expect-error context is not of type 'H'
  context = context || {};
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const params = context!.params || {};
  const types: string[] = Array.isArray(type) ? type : [type];

  types.forEach((t) => {
    const combinedName = t === "all" ? hookName : `${type}:${hookName}`;
    pushSet(params, ["skipHooks"], combinedName, { unique: true });
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  context!.params = params;
  return context;
}
