import type { HookContext } from "@feathersjs/feathers";
import { getPaginate } from "./getPaginate";

export const isPaginated = <H extends HookContext = HookContext>(
  context: H
): boolean => {
  if (context.params.paginate === false) {
    return false;
  }

  const paginate = getPaginate(context);

  return !!paginate;
};
