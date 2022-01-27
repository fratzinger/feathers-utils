import type { HookContext } from "@feathersjs/feathers";
import { getPaginate } from "./getPaginate";

export const isPaginated = (
  context: HookContext
): boolean => {
  if (context.params.paginate === false) { return false; }

  const paginate = getPaginate(context);

  return !!paginate;
};