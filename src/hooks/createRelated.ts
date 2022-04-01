import type { HookContext } from "@feathersjs/feathers";
import { checkContext } from "feathers-hooks-common";
import type { CreateRelatedOptions } from "../types";
import { getItemsIsArray } from "../utils/getItemsIsArray";

export function createRelated<S = Record<string, any>>({
  service,
  multi = true,
  data
}: CreateRelatedOptions<S>) {
  if (!service || !data) {
    throw "initialize hook 'createRelated' completely!";
  }
  return async (context: HookContext): Promise<HookContext> => {
    checkContext(context, "after", undefined, "createRelated");

    const { items } = getItemsIsArray(context);

    const dataToCreate = await Promise.all(
      items.map(async item => data(item, context))
    );

    if (!dataToCreate || dataToCreate.length <= 0) { 
      return context; 
    }

    if (multi) {
      await context.app.service(service as string).create(dataToCreate);
    } else {
      await Promise.all(
        dataToCreate.map(async item => 
          context.app.service(service as string).create(item)
        )
      );
    }

    return context;
  };
}