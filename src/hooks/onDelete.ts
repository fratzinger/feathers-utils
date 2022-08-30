import type { HookContext } from "@feathersjs/feathers";
import { checkContext } from "feathers-hooks-common";
import type { OnDeleteOptions } from "../types";
import { getItemsIsArray } from "../utils/getItemsIsArray";

export function onDelete<S = Record<string, any>>(
  service: keyof S,
  {
    keyThere,
    keyHere = "id",
    onDelete = "cascade",
    blocking = true
  }: OnDeleteOptions) {
  if (!service || !keyThere) {
    throw "initialize hook 'removeRelated' completely!";
  }
  if (!["cascade", "set null"].includes(onDelete)) {
    throw "onDelete must be 'cascade' or 'set null'";
  }

  return async (context: HookContext): Promise<HookContext> => {
    checkContext(context, "after", "remove", "onDelete");

    const { items } = getItemsIsArray(context);

    let ids = items.map(x => x[keyHere]).filter(x => !!x);
    ids = [...new Set(ids)];

    if (!ids || ids.length <= 0) { return context; }

    const params = {
      query: {
        [keyThere]: {
          $in: ids
        }
      },
      paginate: false
    };

    let promise;

    if (onDelete === "cascade") {
      promise = context.app.service(service as string).remove(null, params);
    } else if (onDelete === "set null") {
      const data = { [keyThere]: null };
      promise = context.app.service(service as string).patch(null, data, params);
    }

    if (blocking) {
      await promise;
    }

    return context;
  };
}