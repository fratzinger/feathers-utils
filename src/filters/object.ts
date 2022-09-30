import type { FilterQueryOptions } from "@feathersjs/adapter-commons";
import { validateQueryProperty } from "../utils/validateQueryProperty";
import _isObject from "lodash/isObject";

export const filterQueryObject =
  (key: string) =>
  (obj: any, { operators }: FilterQueryOptions) => {
    if (obj && !_isObject(obj)) {
      throw new Error(
        `Invalid query parameter: '${key}'. It has to be an object`
      );
    }

    return validateQueryProperty(obj, operators);
  };

export const filterObject = <T extends string[]>(...keys: T) => {
  const result: {
    [key in T[number]]: (value: any, options: FilterQueryOptions) => any;
  } = {} as any;

  for (const key of keys) {
    // @ts-ignore
    result[key] = filterQueryObject(key);
  }

  return result;
};
