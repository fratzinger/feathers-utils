import type { HookContext, Params, Query } from "@feathersjs/feathers";
import { checkContext } from "feathers-hooks-common";
import type { RemoveRelatedOptions } from "../types";
import { getItemsIsArray } from "../utils/getItemsIsArray";

export function removeRelated<S = Record<string, any>>({
  service,
  keyThere,
  keyHere = "id",
  blocking = true
}: RemoveRelatedOptions<S>) {
  if (!service || !keyThere) {
    throw "initialize hook 'removeRelated' completely!";
  }
  return async (context: HookContext): Promise<HookContext> => {
    // @ts-expect-error wait for feathers-hooks-common to update
    checkContext(context, "after", "remove", "removeRelated");

    const { items } = getItemsIsArray(context);

    let ids = items.map(x => x[keyHere]).filter(x => !!x);
    ids = [...new Set(ids)];

    if (!ids || ids.length <= 0) { return context; }

    // feathers does not accept `paginate: false` for remove, but some adapters need it to work properly
    const promise: Promise<any> = context.app.service(service as string).remove(null, {
      query: {
        [keyThere]: {
          $in: ids
        }
      },
      paginate: false
    } as Params<Query>);

    if (blocking) {
      await promise;
    }

    return context;
  };
}