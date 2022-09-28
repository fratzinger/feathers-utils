import type { HookContext } from "@feathersjs/feathers";
import { checkContext } from "feathers-hooks-common";
import { getItemsIsArray } from "../utils/getItemsIsArray";

export type OnDeleteAction = "cascade" | "set null";

export interface OnDeleteOptions {
  keyThere: string;
  keyHere: string;
  onDelete: OnDeleteAction;
  blocking?: boolean;
}

export function onDelete<
  S = Record<string, any>,
  H extends HookContext = HookContext
>(
  service: keyof S,
  {
    keyThere,
    keyHere = "id",
    onDelete = "cascade",
    blocking = true,
  }: OnDeleteOptions
) {
  if (!service || !keyThere) {
    throw "initialize hook 'removeRelated' completely!";
  }
  if (!["cascade", "set null"].includes(onDelete)) {
    throw "onDelete must be 'cascade' or 'set null'";
  }

  return async (context: H) => {
    checkContext(context, "after", "remove", "onDelete");

    const { items } = getItemsIsArray(context);

    let ids = items.map((x) => x[keyHere]).filter((x) => !!x);
    ids = [...new Set(ids)];

    if (!ids || ids.length <= 0) {
      return context;
    }

    const params = {
      query: {
        [keyThere]: {
          $in: ids,
        },
      },
      paginate: false,
    };

    let promise;

    if (onDelete === "cascade") {
      promise = context.app.service(service as string).remove(null, params);
    } else if (onDelete === "set null") {
      const data = { [keyThere]: null };
      promise = context.app
        .service(service as string)
        .patch(null, data, params);
    }

    if (blocking) {
      await promise;
    }

    return context;
  };
}
