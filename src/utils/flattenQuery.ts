import type { Query } from "@feathersjs/feathers";
import { filterQuery, reassembleQuery } from "./filterQuery";
import _set from "lodash/set.js";
import { isObject } from "./_utils.internal";

export function flattenQuery(q: Query) {
  if (Array.isArray(q)) {
    return q.map(flattenQuery);
  }

  if (!isObject(q)) {
    return q;
  }

  const { query, $limit, $select, $skip, $sort } = filterQuery(q);

  type StepOptions = {
    prev?: string[];
    result?: Query;
  };

  const res = {};

  function step(object: Query, options?: StepOptions) {
    const { prev = [], result = res } = options ?? {};

    Object.keys(object).forEach((key) => {
      const value = object[key];
      if (Array.isArray(value)) {
        const newValues = value.map((v) =>
          step(v, {
            result: {},
          }),
        );
        _set(result, [...prev, key], newValues);
        return;
      }

      if (key.startsWith("$")) {
        _set(result, [...prev, key], value);
        return;
      }

      const newKey = !prev.length
        ? [key]
        : [...prev.slice(0, -1), `${prev[prev.length - 1]}.${key}`];

      if (!isObject(value)) {
        _set(result, newKey, value);
        return;
      } else {
        step(value, {
          prev: newKey,
          result,
        });
        return;
      }
    });

    return result;
  }

  return reassembleQuery({
    $limit,
    $select,
    $skip,
    $sort,
    query: step(query),
  });
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("flattenQuery", () => {
    it("should flatten a query", () => {
      expect(
        flattenQuery({
          a: 1,
          b: {
            c: 1,
            d: 1,
          },
          e: {
            f: {
              g: 1,
            },
          },
        }),
      ).toEqual({
        a: 1,
        "b.c": 1,
        "b.d": 1,
        "e.f.g": 1,
      });
    });
  });

  it("should handle operators", () => {
    expect(
      flattenQuery({
        a: {
          b: 1,
        },
        c: {
          $gt: 1,
          $lte: 1,
        },
      }),
    ).toEqual({
      "a.b": 1,
      c: {
        $gt: 1,
        $lte: 1,
      },
    });
  });

  it("should handle $or / $and", () => {
    expect(
      flattenQuery({
        a: {
          b: 1,
        },
        $and: [
          {
            c: {
              d: 1,
            },
          },
        ],
        $or: [
          {
            e: {
              f: 1,
            },
          },
        ],
      }),
    ).toEqual({
      "a.b": 1,
      $and: [
        {
          "c.d": 1,
        },
      ],
      $or: [
        {
          "e.f": 1,
        },
      ],
    });
  });

  it("should handle nested $or / $and with operators", () => {
    expect(
      flattenQuery({
        a: {
          b: 1,
        },
        $and: [
          {
            $or: [
              {
                c1: {
                  d1: 1,
                },
              },
              {
                c2: {
                  d2: {
                    $gt: 1,
                  },
                },
              },
            ],
          },
        ],
      }),
    ).toEqual({
      "a.b": 1,
      $and: [
        {
          $or: [
            {
              "c1.d1": 1,
            },
            {
              "c2.d2": {
                $gt: 1,
              },
            },
          ],
        },
      ],
    });
  });
}
