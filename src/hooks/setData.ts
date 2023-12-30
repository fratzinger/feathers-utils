import _get from "lodash/get.js";
import _set from "lodash/set.js";
import _has from "lodash/has.js";

import { Forbidden } from "@feathersjs/errors";
import { getItemsIsArray, shouldSkip } from "../utils";

import type { HookContext } from "@feathersjs/feathers";
import type { PropertyPath } from "lodash";
import type { PredicateWithContext } from "../types";
import { toJSON } from "../utils/toJSON";

export interface HookSetDataOptions {
  allowUndefined?: boolean;
  overwrite?: boolean | PredicateWithContext;
}

const defaultOptions: Required<HookSetDataOptions> = {
  allowUndefined: false,
  overwrite: true,
};

/**
 * hook to set properties on `context.result` (if existent) or `context.data` (otherwise)
 */
export function setData<H extends HookContext = HookContext>(
  from: PropertyPath,
  to: PropertyPath,
  _options?: HookSetDataOptions,
) {
  const options: Required<HookSetDataOptions> = {
    ...defaultOptions,
    ..._options,
  };
  return (context: H) => {
    if (shouldSkip("setData", context)) {
      return context;
    }

    const { items } = getItemsIsArray(context);

    const contextJson = toJSON(context);

    if (!_has(contextJson, from)) {
      if (!context.params?.provider || options.allowUndefined === true) {
        return context;
      }

      if (
        !options.overwrite &&
        items.every((item: Record<string, unknown>) => _has(item, to))
      ) {
        return context;
      }

      throw new Forbidden(`Expected field ${from.toString()} not available`);
    }

    const val = _get(contextJson, from);

    items.forEach((item: Record<string, unknown>) => {
      let overwrite: boolean;
      if (typeof options.overwrite === "function") {
        overwrite = options.overwrite(item, context);
      } else {
        overwrite = options.overwrite;
      }

      if (!overwrite && _has(item, to)) {
        return;
      }

      _set(item, to, val);
    });

    return context;
  };
}

if (import.meta.vitest) {
  const { describe, it, assert, expect } = import.meta.vitest;

  it("sets userId for single item", function () {
    const methodsByType = {
      before: ["create", "update", "patch", "remove"],
      after: ["find", "get", "create", "update", "patch", "remove"],
    };
    Object.keys(methodsByType).forEach((type) => {
      methodsByType[type].forEach((method) => {
        const context = {
          method,
          type,
          params: {
            user: {
              id: 1,
            },
          },
        } as HookContext;

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = {};

        const result = setData("params.user.id", "userId")(context);
        assert.strictEqual(
          result[dataOrResult].userId,
          1,
          `'${type}/${method}': ${dataOrResult} has 'userId:1'`,
        );
      });
    });
  });

  it("overwrites userId for single item", function () {
    const methodsByType = {
      before: ["create", "update", "patch", "remove"],
      after: ["find", "get", "create", "update", "patch", "remove"],
    };
    Object.keys(methodsByType).forEach((type) => {
      methodsByType[type].forEach((method) => {
        const context = {
          method,
          type,
          params: {
            user: {
              id: 1,
            },
          },
        } as HookContext;

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = { userId: 2 };

        const result = setData("params.user.id", "userId")(context);
        assert.strictEqual(
          result[dataOrResult].userId,
          1,
          `'${type}/${method}': ${dataOrResult} has 'userId:1'`,
        );
      });
    });
  });

  it("sets userId for multiple items", function () {
    const methodsByType = {
      before: ["create", "update", "patch", "remove"],
      after: ["find", "get", "create", "update", "patch", "remove"],
    };
    Object.keys(methodsByType).forEach((type) => {
      methodsByType[type].forEach((method) => {
        const context = {
          method,
          type,
          params: {
            user: {
              id: 1,
            },
          },
        } as HookContext;

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = [{}, {}, {}];

        const result = setData("params.user.id", "userId")(context);
        result[dataOrResult].forEach((item) => {
          assert.strictEqual(
            item.userId,
            1,
            `'${type}/${method}': ${dataOrResult} has 'userId:1'`,
          );
        });
      });
    });
  });

  it("overwrites userId for multiple items", function () {
    const methodsByType = {
      before: ["create", "update", "patch", "remove"],
      after: ["find", "get", "create", "update", "patch", "remove"],
    };
    Object.keys(methodsByType).forEach((type) => {
      methodsByType[type].forEach((method) => {
        const context = {
          method,
          type,
          params: {
            user: {
              id: 1,
            },
          },
        } as HookContext;

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = [{ userId: 2 }, {}, { userId: "abc" }];

        const result = setData("params.user.id", "userId")(context);
        result[dataOrResult].forEach((item) => {
          assert.strictEqual(
            item.userId,
            1,
            `'${type}/${method}': ${dataOrResult} has 'userId:1'`,
          );
        });
      });
    });
  });

  it("does not change createdById if 'params.user.id' is not provided", function () {
    const methodsByType = {
      before: ["create", "update", "patch", "remove"],
      after: ["find", "get", "create", "update", "patch", "remove"],
    };
    Object.keys(methodsByType).forEach((type) => {
      methodsByType[type].forEach((method) => {
        const context = {
          method,
          type,
          params: {},
        } as HookContext;

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = { userId: 2 };

        const result = setData("params.user.id", "userId")(context);

        assert.strictEqual(
          result[dataOrResult].userId,
          2,
          `'${type}/${method}': ${dataOrResult} has 'userId:2'`,
        );
      });
    });
  });

  it("throws if 'external' is set and context.user.id is undefined", function () {
    const methodsByType = {
      before: ["create", "update", "patch", "remove"],
      after: ["find", "get", "create", "update", "patch", "remove"],
    };
    Object.keys(methodsByType).forEach((type) => {
      methodsByType[type].forEach((method) => {
        const context = {
          method,
          type,
          params: {
            provider: "socket.io",
          },
        } as HookContext;

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = {};

        expect(() => setData("params.user.id", "userId")(context)).toThrow(
          Forbidden,
        );
      });
    });
  });

  it("passes if 'external' and 'allowUndefined: true'", function () {
    const methodsByType = {
      before: ["create", "update", "patch", "remove"],
      after: ["find", "get", "create", "update", "patch", "remove"],
    };
    Object.keys(methodsByType).forEach((type) => {
      methodsByType[type].forEach((method) => {
        const context = {
          method,
          type,
          provider: "socket.io",
          params: {},
          data: {},
        } as unknown as HookContext;

        assert.doesNotThrow(
          () =>
            setData("params.user.id", "userId", { allowUndefined: true })(
              context,
            ),
          `'${type}/${method}': passes`,
        );
      });
    });
  });

  it("passes if 'external' is set and context.user.id is undefined but overwrite: false", function () {
    const methodsByType = {
      before: ["create", "update", "patch", "remove"],
      after: ["find", "get", "create", "update", "patch", "remove"],
    };
    Object.keys(methodsByType).forEach((type) => {
      methodsByType[type].forEach((method) => {
        const context = {
          method,
          type,
          params: {
            provider: "socket.io",
          },
        } as unknown as HookContext;

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = { userId: 1 };

        assert.doesNotThrow(
          () =>
            setData("params.user.id", "userId", { overwrite: false })(context),
          `'${type}/${method}': passes`,
        );
      });
    });
  });

  describe("overwrite: false", function () {
    it("sets userId for single item", function () {
      const methodsByType = {
        before: ["create", "update", "patch", "remove"],
        after: ["find", "get", "create", "update", "patch", "remove"],
      };
      Object.keys(methodsByType).forEach((type) => {
        methodsByType[type].forEach((method) => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1,
              },
            },
          } as unknown as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = {};

          const result = setData("params.user.id", "userId", {
            overwrite: false,
          })(context);
          assert.strictEqual(
            result[dataOrResult].userId,
            1,
            `'${type}/${method}': ${dataOrResult} has 'userId:1'`,
          );
        });
      });
    });

    it("does not overwrite userId for single item", function () {
      const methodsByType = {
        before: ["create", "update", "patch", "remove"],
        after: ["find", "get", "create", "update", "patch", "remove"],
      };
      Object.keys(methodsByType).forEach((type) => {
        methodsByType[type].forEach((method) => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1,
              },
            },
          } as unknown as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = { userId: 2 };

          const result = setData("params.user.id", "userId", {
            overwrite: false,
          })(context);
          assert.strictEqual(
            result[dataOrResult].userId,
            2,
            `'${type}/${method}': ${dataOrResult} has 'userId:2'`,
          );
        });
      });
    });

    it("sets userId for multiple items", function () {
      const methodsByType = {
        before: ["create", "update", "patch", "remove"],
        after: ["find", "get", "create", "update", "patch", "remove"],
      };
      Object.keys(methodsByType).forEach((type) => {
        methodsByType[type].forEach((method) => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1,
              },
            },
          } as unknown as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = [{}, {}, {}];

          const result = setData("params.user.id", "userId", {
            overwrite: false,
          })(context);
          result[dataOrResult].forEach((item) => {
            assert.strictEqual(
              item.userId,
              1,
              `${type}/${method}': ${dataOrResult} has 'userId:1'`,
            );
          });
        });
      });
    });

    it("overwrites userId for multiple items", function () {
      const methodsByType = {
        before: ["create", "update", "patch", "remove"],
        after: ["find", "get", "create", "update", "patch", "remove"],
      };
      Object.keys(methodsByType).forEach((type) => {
        methodsByType[type].forEach((method) => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1,
              },
            },
          } as unknown as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = [{ userId: 0 }, {}, { userId: 2 }];

          const result = setData("params.user.id", "userId", {
            overwrite: false,
          })(context);
          result[dataOrResult].forEach((item, i) => {
            assert.strictEqual(
              item.userId,
              i,
              `${type}/${method}': ${dataOrResult} has 'userId:${i}`,
            );
          });
        });
      });
    });
  });

  describe("overwrite: predicate", function () {
    it("overwrites userId for multiple items per predicate", function () {
      const methodsByType = {
        before: ["create", "update", "patch", "remove"],
        after: ["find", "get", "create", "update", "patch", "remove"],
      };
      Object.keys(methodsByType).forEach((type) => {
        methodsByType[type].forEach((method) => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1,
              },
            },
          } as unknown as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = [{ userId: 2 }, {}, { userId: "abc" }];

          const result = setData("params.user.id", "userId", {
            overwrite: () => true,
          })(context);
          result[dataOrResult].forEach((item) => {
            assert.strictEqual(
              item.userId,
              1,
              `'${type}/${method}': ${dataOrResult} has 'userId:1'`,
            );
          });
        });
      });
    });

    it("does not overwrite userId for single item by predicate", function () {
      const methodsByType = {
        before: ["create", "update", "patch", "remove"],
        after: ["find", "get", "create", "update", "patch", "remove"],
      };
      Object.keys(methodsByType).forEach((type) => {
        methodsByType[type].forEach((method) => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1,
              },
            },
          } as unknown as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = { userId: 2 };

          const result = setData("params.user.id", "userId", {
            overwrite: (item) => item.userId == null,
          })(context);
          assert.strictEqual(
            result[dataOrResult].userId,
            2,
            `'${type}/${method}': ${dataOrResult} has 'userId:2'`,
          );
        });
      });
    });

    it("predicate based on context", function () {
      const methodsByType = {
        before: ["create", "update", "patch", "remove"],
        after: ["find", "get", "create", "update", "patch", "remove"],
      };
      Object.keys(methodsByType).forEach((type) => {
        methodsByType[type].forEach((method) => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1,
              },
            },
          } as unknown as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = { userId: 2 };

          const result = setData("params.user.id", "userId", {
            overwrite: (item, context) => context.type === "before",
          })(context);
          if (type === "before") {
            assert.strictEqual(
              result[dataOrResult].userId,
              1,
              `'${type}/${method}': ${dataOrResult} has 'userId:1'`,
            );
          } else {
            assert.strictEqual(
              result[dataOrResult].userId,
              2,
              `'${type}/${method}': ${dataOrResult} has 'userId:2'`,
            );
          }
        });
      });
    });

    it("overwrites userId for multiple items by predicate", function () {
      const methodsByType = {
        before: ["create", "update", "patch", "remove"],
        after: ["find", "get", "create", "update", "patch", "remove"],
      };
      Object.keys(methodsByType).forEach((type) => {
        methodsByType[type].forEach((method) => {
          const context = {
            method,
            type,
            params: {
              user: {
                id: 1,
              },
            },
          } as unknown as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = [{ userId: 0 }, {}, { userId: 2 }];

          const result = setData("params.user.id", "userId", {
            overwrite: (item) => item.userId == null,
          })(context);
          result[dataOrResult].forEach((item, i) => {
            assert.strictEqual(
              item.userId,
              i,
              `${type}/${method}': ${dataOrResult} has 'userId:${i}`,
            );
          });
        });
      });
    });
  });
}
