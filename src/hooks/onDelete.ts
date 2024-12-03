import type { HookContext } from "@feathersjs/feathers";
import { checkContext } from "feathers-hooks-common";
import { getItemsIsArray, shouldSkip } from "../utils";
import type { KeyOf, MaybeArray } from "../typesInternal";

export type OnDeleteAction = "cascade" | "set null";

export interface OnDeleteOptions<Path extends string = string> {
  service: Path;
  keyThere: string;
  keyHere: string;
  onDelete: OnDeleteAction;
  blocking?: boolean;
}

/**
 * hook to manipulate related items on delete
 */
export function onDelete<
  S = Record<string, any>,
  H extends HookContext = HookContext,
>(options: MaybeArray<OnDeleteOptions<KeyOf<S>>>) {
  return async (context: H) => {
    if (shouldSkip("onDelete", context)) {
      return context;
    }

    checkContext(context, "after", "remove", "onDelete");

    const { items } = getItemsIsArray(context);

    const entries = Array.isArray(options) ? options : [options];

    const promises: Promise<any>[] = [];

    entries.forEach(
      async ({ keyHere, keyThere, onDelete, service, blocking }) => {
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

        let promise: Promise<any> | undefined = undefined;

        if (onDelete === "cascade") {
          promise = context.app.service(service as string).remove(null, params);
        } else if (onDelete === "set null") {
          const data = { [keyThere]: null };
          promise = context.app
            .service(service as string)
            .patch(null, data, params);
        }

        if (blocking) {
          promises.push(promise);
        }
      },
    );

    if (promises.length) {
      await Promise.all(promises);
    }

    return context;
  };
}
