import type { HookContext } from "@feathersjs/feathers";
import { FROM_CLIENT_FOR_SERVER_DEFAULT_KEY } from "./common";

export function defineParamsForServer(keyToHide: string) {
  return function paramsForServer(...whitelist: string[]) {
    return <H extends HookContext>(context: H) => {
      // clone params on demand
      let clonedParams;

      Object.keys(context.params).forEach((key) => {
        if (key === "query") {
          return;
        }

        if (whitelist.includes(key)) {
          if (!clonedParams) {
            clonedParams = {
              ...context.params,
              query: {
                ...context.params.query,
              },
            };
          }

          if (!clonedParams.query[keyToHide]) {
            clonedParams.query[keyToHide] = {};
          }

          clonedParams.query[keyToHide][key] = clonedParams[key];
          delete clonedParams[key];
        }
      });

      if (clonedParams) {
        context.params = clonedParams;
      }

      return context;
    };
  };
}

/**
 * a hook to move params to query._$client
 * the server only receives 'query' from params. All other params are ignored.
 * So, to use `$populateParams` on the server, we need to move the params to query._$client
 * the server will move them back to params
 */
export const paramsForServer = defineParamsForServer(
  FROM_CLIENT_FOR_SERVER_DEFAULT_KEY,
);

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("should move params to query._$client", () => {
    expect(
      paramsForServer(
        "a",
        "b",
      )({
        params: {
          a: 1,
          b: 2,
          query: {},
        },
      } as HookContext),
    ).toEqual({
      params: {
        query: {
          _$client: {
            a: 1,
            b: 2,
          },
        },
      },
    });
  });

  it("should move params to query._$client and leave remaining", () => {
    expect(
      paramsForServer("a")({
        params: {
          a: 1,
          b: 2,
          query: {},
        },
      } as HookContext),
    ).toEqual({
      params: {
        b: 2,
        query: {
          _$client: {
            a: 1,
          },
        },
      },
    });
  });
}
