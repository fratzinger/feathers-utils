import { isPlainObject } from "./internal.utils";
import type { Params } from "@feathersjs/feathers";

export type SetQueryKeySafelyOptions = {
  mutate?: boolean;
};

export const setQueryKeySafely = <P extends Params = Params>(
  params: P,
  key: string,
  value: any,
  operator = "$eq",
  options?: SetQueryKeySafelyOptions,
): P => {
  const { mutate = false } = options || {};

  // TODO: mutate params
  if (!mutate) {
    params = structuredClone(params);
  }

  if (!params.query) {
    params.query = {};
  }

  // if the key is not in the query, just add it and return
  if (!(key in params.query)) {
    if (operator === "$eq") {
      params.query[key] = value;
    } else {
      params.query[key] = {
        [operator]: value,
      };
    }

    return params;
  }

  if (isPlainObject(params.query[key]) && !(operator in params.query[key])) {
    params.query[key][operator] = value;
  } else {
    params.query.$and ??= [];

    params.query.$and.push(
      operator === "$eq"
        ? { [key]: value }
        : {
            [key]: {
              [operator]: value,
            },
          },
    );
  }

  return params;
};
