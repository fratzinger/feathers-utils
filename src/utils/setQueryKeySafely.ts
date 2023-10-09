import type { Params } from "@feathersjs/feathers";

type SetQueryKeySafelyOptions = {
  mutate?: boolean;
};

const isPlainObject = (value) =>
  value && [undefined, Object].includes(value.constructor);

export const setQueryKeySafely = (
  params: Params,
  key: string,
  value: any,
  operator = "$eq",
  options?: SetQueryKeySafelyOptions,
) => {
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

  console.log(
    "params.query[key]",
    params.query[key],
    isPlainObject(params.query[key]),
  );

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
