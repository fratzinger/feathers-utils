import type { HookContext } from "@feathersjs/feathers";
import { checkContext } from "feathers-hooks-common";
import type { Promisable } from "../typesInternal";
import { getItemsIsArray, shouldSkip } from "../utils";

export interface CreateRelatedOptions<S = Record<string, any>> {
  service: keyof S;
  multi?: boolean;
  data: (item: any, context: HookContext) => Promisable<Record<string, any>>;
  createItemsInDataArraySeparately?: boolean;
}

/**
 * hook to create related items
 */
export function createRelated<
  S = Record<string, any>,
  H extends HookContext = HookContext
>({
  service,
  multi = true,
  data,
  createItemsInDataArraySeparately = true,
}: CreateRelatedOptions<S>) {
  if (!service || !data) {
    throw "initialize hook 'createRelated' completely!";
  }
  return async (context: H) => {
    if (shouldSkip("createRelated", context)) {
      return context;
    }

    checkContext(context, "after", undefined, "createRelated");

    const { items } = getItemsIsArray(context);

    let dataToCreate = (
      await Promise.all(items.map(async (item) => data(item, context)))
    ).filter((x) => !!x);

    if (createItemsInDataArraySeparately) {
      dataToCreate = dataToCreate.flat();
    }

    if (!dataToCreate || dataToCreate.length <= 0) {
      return context;
    }

    if (multi) {
      await context.app.service(service as string).create(dataToCreate);
    } else {
      await Promise.all(
        dataToCreate.map(async (item) =>
          context.app.service(service as string).create(item)
        )
      );
    }

    return context;
  };
}
