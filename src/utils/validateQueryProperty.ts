import { _ } from "@feathersjs/commons";
import { BadRequest } from "@feathersjs/errors";
import type { Query } from "@feathersjs/feathers";

const isPlainObject = (value: any) =>
  _.isObject(value) && value.constructor === {}.constructor;

export const validateQueryProperty = (
  query: any,
  operators: string[] = []
): Query => {
  if (!isPlainObject(query)) {
    return query;
  }

  for (const key of Object.keys(query)) {
    if (key.startsWith("$") && !operators.includes(key)) {
      throw new BadRequest(`Invalid query parameter ${key}`, query);
    }

    const value = query[key];

    if (isPlainObject(value)) {
      query[key] = validateQueryProperty(value, operators);
    }
  }

  return {
    ...query,
  };
};
