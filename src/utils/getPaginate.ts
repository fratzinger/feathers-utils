import type { HookContext, PaginationOptions } from "@feathersjs/feathers";

export const getPaginate = (
  context: HookContext
): PaginationOptions | undefined => {
  if (Object.prototype.hasOwnProperty.call(context.params, "paginate")) {
    return context.params.paginate as PaginationOptions || undefined;
  }
  if (context.params.paginate === false) { return undefined; }
  let options = context.service.options || {};
  
  options = {
    ...options,
    ...context.params.adapter
  };
  
  return options.paginate || undefined;
};