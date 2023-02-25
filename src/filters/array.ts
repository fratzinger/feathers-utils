import type { FilterQueryOptions } from "@feathersjs/adapter-commons";
import { validateQueryProperty } from "../utils/validateQueryProperty";

const filterQueryArray =
  (key: string) =>
  (arr: any, { operators }: FilterQueryOptions) => {
    if (arr && !Array.isArray(arr)) {
      throw new Error(
        `Invalid query parameter '${key}'. It has to be an array`
      );
    }

    if (Array.isArray(arr)) {
      return arr.map((current) => validateQueryProperty(current, operators));
    }

    return arr;
  };

export const filterArray = <T extends string[]>(...keys: T) => {
  const result: {
    [key in T[number]]: (value: any, options: FilterQueryOptions) => any;
  } = {} as any;

  for (const key of keys) {
    result[key as T[number]] = filterQueryArray(key);
  }

  return result;
};
