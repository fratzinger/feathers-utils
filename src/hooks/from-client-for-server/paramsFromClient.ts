import type { HookContext } from "@feathersjs/feathers";
import { FROM_CLIENT_FOR_SERVER_DEFAULT_KEY } from "./common";

export function defineParamsFromClient(keyToHide: string) {
  return function paramsFromClient(
    ...whitelist: string[]
  ): (context: HookContext) => HookContext {
    return (context: HookContext): HookContext => {
      if (
        !context.params?.query?.[keyToHide] ||
        typeof context.params.query[keyToHide] !== "object"
      ) {
        return context;
      }

      const params = {
        ...context.params,
        query: {
          ...context.params.query,
          [keyToHide]: {
            ...context.params.query[keyToHide],
          },
        },
      };

      const client = params.query[keyToHide];

      whitelist.forEach((key) => {
        if (key in client) {
          params[key] = client[key];
          delete client[key];
        }
      });

      if (Object.keys(client).length === 0) {
        delete params.query[keyToHide];
      }

      context.params = params;

      return context;
    };
  };
}

export const paramsFromClient = defineParamsFromClient(
  FROM_CLIENT_FOR_SERVER_DEFAULT_KEY,
);

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("should move params to query._$client", () => {
    expect(
      paramsFromClient(
        "a",
        "b",
      )({
        params: {
          query: {
            _$client: {
              a: 1,
              b: 2,
            },
            c: 3,
          },
        },
      } as HookContext),
    ).toEqual({
      params: {
        a: 1,
        b: 2,
        query: {
          c: 3,
        },
      },
    });
  });

  it("should move params to query._$client and leave remaining", () => {
    expect(
      paramsFromClient("a")({
        params: {
          query: {
            _$client: {
              a: 1,
              b: 2,
            },
            c: 3,
          },
        },
      } as HookContext),
    ).toEqual({
      params: {
        a: 1,
        query: {
          _$client: {
            b: 2,
          },
          c: 3,
        },
      },
    });
  });
}
