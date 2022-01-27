import type { HookContext } from "@feathersjs/feathers";
import { isMulti } from "..";
import { isPaginated } from "./isPaginated";

export const setResultEmpty = (
  context: HookContext
): HookContext => {
  if (context.result) { return context; }

  const multi = isMulti(context);

  if (multi) {
    if (context.method === "find" && isPaginated(context)) {
      context.result = {
        total: 0,
        skip: 0,
        limit: 0,
        data: []
      };
    } else {
      context.result = [];
    }
  } else {
    context.result = null;
  }

  return context;
};