import type { HookContext } from "@feathersjs/feathers";
import { isMulti } from "./isMulti";
import { isPaginated } from "./isPaginated";

/**
 * util to set `context.result` to an empty array or object, depending on the hook type
 */
export const setResultEmpty = <H extends HookContext = HookContext>(
  context: H
) => {
  if (context.result) {
    return context;
  }

  const multi = isMulti(context);

  if (multi) {
    if (context.method === "find" && isPaginated(context)) {
      context.result = {
        total: 0,
        skip: 0,
        limit: 0,
        data: [],
      };
    } else {
      context.result = [];
    }
  } else {
    context.result = null;
  }

  return context;
};
