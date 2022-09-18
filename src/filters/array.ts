import type { FilterQueryOptions } from "@feathersjs/adapter-commons";
import { validateQueryProperty } from "../utils/validateQueryProperty";

export const filterArray = () => (arr: any, { operators }: FilterQueryOptions) => {
  if (arr && !Array.isArray(arr)) {
    throw new Error("Invalid query parameter $and. It has to be an array");
  }

  if (Array.isArray(arr)) {
    return arr.map((current) => validateQueryProperty(current, operators));
  }

  return arr;
};