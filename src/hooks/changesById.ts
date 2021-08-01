import type { HookContext, Id, Params, Query } from "@feathersjs/feathers";
import { getItems } from "feathers-hooks-common";

import shouldSkip from "../utils/shouldSkip";
import type { ChangeById, HookChangesByIdOptions } from "../types";

const defaultOptions: HookChangesByIdOptions = {
  removeSelect: true,
  skipHooks: false,
  refetchItems: true,
  params: undefined,
  paramsBefore: undefined,
  paramsAfter: undefined
};

const changesById = <T>(
  cb: (changesById: Record<Id, ChangeById<T>>, context: HookContext) => void | Promise<void>,
  providedOptions?: Partial<HookChangesByIdOptions>
): ((context: HookContext) => Promise<HookContext>) => {
  const options: HookChangesByIdOptions = Object.assign({}, defaultOptions, providedOptions);
  return async (context: HookContext): Promise<HookContext> => {
    //checkContext(context, "before", ["patch", "update"]);
    //checkContext(context, "after", ["patch", "update"]);
    
    if (shouldSkip("checkMulti", context)) { return context; }

    if (context.type === "before") {
      await beforeHook(context, options);
    } else if (context.type === "after") {
      await afterHook(context, cb, options);
    }
  
    return context;
  };
};

const beforeHook = async (
  context: HookContext, 
  options: HookChangesByIdOptions
): Promise<HookContext> => {
  const params: Params = await transformedParams(context, context.params.query, options);
  const byId = await getOrFindById(context, params, { skipHooks: options.skipHooks, asArray: true });

  context.params.changelog = context.params.changelog || {};
  context.params.changelog.itemsBefore = byId;
  return context;
};

const afterHook = async <T>(
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

const transformedParams = async (
  context: HookContext,
  providedQuery: Query | undefined,
  options: HookChangesByIdOptions
): Promise<Params> => {
  const query: Query = Object.assign({}, providedQuery);

  if (options.removeSelect) {
    delete query.$select;
  }

  let params: Params = Object.assign({ paginate: false }, context.params, { query });

  const paramsKeyToUse = (context.type === "before") ? "paramsBefore" : "paramsAfter";

  if (options[paramsKeyToUse] || options.params) {
    const paramsFnToUse = options[paramsKeyToUse] || options.params;

    if (paramsFnToUse && typeof paramsFnToUse === "function") {
      params = await paramsFnToUse(params, context);
    }
  }

  return params;
};

const getOrFindById = async (
  context: HookContext, 
  params: Params, 
  options: Pick<HookChangesByIdOptions, "skipHooks"> & { asArray: true }
): Promise<Record<string, unknown> | undefined> => {

  let itemOrItems;

  if (context.id === null) {
    const method = (options.skipHooks) ? "_find" : "find";
    itemOrItems = await context.service[method](params);
    itemOrItems = itemOrItems && (itemOrItems.data || itemOrItems);
  } else {
    const method = (options.skipHooks) ? "_get" : "get";
    itemOrItems = await context.service[method](context.id, params);
  }

  const items = (!itemOrItems)
    ? []
    : (Array.isArray(itemOrItems))
      ? itemOrItems
      : [itemOrItems];

  const idField = getIdField(context);

  const result = items.reduce((byId, item) => {
    const id = item[idField];
    byId[id] = item;
    return byId;
  }, {});
  
  return result;
};

const refetchItems = async (
  context: HookContext,
  options: HookChangesByIdOptions
) => {
  const itemOrItems = getItems(context);
  if (!itemOrItems) { return undefined; }
  if (!options.refetchItems) return itemOrItems;

  const idField = getIdField(context);
  const items = (Array.isArray(itemOrItems)) ? itemOrItems : [itemOrItems];
  const ids = items.map(x => x[idField]);

  let params: Params = (context.id)
    ? {
      query: {
        [idField]: { $in: ids }
      },
      paginate: false
    }
    : {};

  params = await transformedParams(context, params, options);

  const result = await getOrFindById(context, params, { skipHooks: options.skipHooks, asArray: true });
  return result;
};

const getIdField = (context: HookContext): string => {
  return context.service.options.id;
};

export default changesById;