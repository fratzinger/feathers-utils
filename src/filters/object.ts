import type { FilterQueryOptions } from "@feathersjs/adapter-commons";
import { validateQueryProperty } from "../utils/validateQueryProperty";
import _isObject from "lodash/isObject";

export const filterObject =
  (key: string) =>
  (obj: any, { operators }: FilterQueryOptions) => {
    if (obj && !_isObject(obj)) {
      throw new Error(
        `Invalid query parameter: '${key}'. It has to be an object`
      );
    }

    return validateQueryProperty(obj, operators);
  };
