import { BadRequest } from "@feathersjs/errors";
import type { Query } from "@feathersjs/feathers";
import { isObject } from "./_utils.internal";

/**
 * util to validate a query for operators
 */
export const validateQueryProperty = (
  query: any,
  operators: string[] = [],
): Query => {
  if (!isObject(query)) {
    return query;
  }

  for (const key of Object.keys(query)) {
    if (key.startsWith("$") && !operators.includes(key)) {
      throw new BadRequest(`Invalid query parameter ${key}`, query);
    }

    const value = query[key];

    if (isObject(value)) {
      query[key] = validateQueryProperty(value, operators);
    }
  }

  return {
    ...query,
  };
};
