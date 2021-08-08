import type { HookContext, Id } from "@feathersjs/feathers";
import { getItems } from "feathers-hooks-common";

import shouldSkip from "../utils/shouldSkip";
import type { ChangeById, HookChangesByIdOptions } from "../types";
import getOrFindById from "../utils/getOrFindById";
import resultById from "../utils/resultById";

const defaultOptions: HookChangesByIdOptions = {
  removeSelect: true,
  skipHooks: false,
  refetchItems: true,
  params: undefined
};

const changesById = <T>(
  cb: (changesById: Record<Id, ChangeById<T>>, context: HookContext) => void | Promise<void>,
  providedOptions?: Partial<HookChangesByIdOptions>
): ((context: HookContext) => Promise<HookContext>) => {
  const options: HookChangesByIdOptions = Object.assign({}, defaultOptions, providedOptions);
  return async (context: HookContext): Promise<HookContext> => {    
    if (shouldSkip("checkMulti", context)) { return context; }

    if (context.type === "before") {
      await changesByIdBefore(context, options);
    } else if (context.type === "after") {
      await changesByIdAfter(context, cb, options);
    }
  
    return context;
  };
};

export const changesByIdBefore = async (
  context: HookContext, 
  options: Pick<HookChangesByIdOptions, "params" | "skipHooks">
): Promise<HookContext> => {
  const byId = await getOrFindById(context, options.params, { skipHooks: options.skipHooks });

  context.params.changelog = context.params.changelog || {};
  context.params.changelog.itemsBefore = byId;
  return context;
};

export const changesByIdAfter = async <T>(
  context: HookContext,
  cb: (changesById: Record<Id, ChangeById<T>>, context: HookContext) => void | Promise<void>,
  options: HookChangesByIdOptions
): Promise<HookContext> => {
  if (!context.params.changelog?.itemsBefore) { return context; }

  const { itemsBefore } = context.params.changelog;
  const itemsAfter = await refetchItems(context, options);
  if (!itemsAfter) { return context; }

  const changesById = Object.keys(itemsAfter).reduce(
    (result: Record<Id, ChangeById<T>>, id: string): Record<Id, ChangeById<T>> => {
      if (!itemsBefore[id]) return result;
      result[id] = {
        before: itemsBefore[id],
        after: itemsAfter[id]
      };
      return result;
    }, 
    {}
  );
  await cb(changesById, context);
  return context;
};

const refetchItems = async (
  context: HookContext,
  options: Pick<HookChangesByIdOptions, "params" | "refetchItems" | "skipHooks">
) => {
  const itemOrItems = getItems(context);
  if (!itemOrItems) { return undefined; }
  if (!options.refetchItems) return itemOrItems;

  if (!options.refetchItems) {
    return resultById(context);
  } else {
    return await getOrFindById(context, options.params, { skipHooks: options.skipHooks });
  }
};

export default changesById;