import type { HookContext } from "@feathersjs/feathers";
import assert from "assert";
import { setData } from "../../src";

describe("hook - setData", function () {
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
        };

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = {};

        //@ts-ignore
        const result = setData("params.user.id", "userId")(context);
        assert.strictEqual(
          result[dataOrResult].userId,
          1,
          `'${type}/${method}': ${dataOrResult} has 'userId:1'`
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
        };

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = { userId: 2 };

        //@ts-ignore
        const result = setData("params.user.id", "userId")(context);
        assert.strictEqual(
          result[dataOrResult].userId,
          1,
          `'${type}/${method}': ${dataOrResult} has 'userId:1'`
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
        };

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = [{}, {}, {}];

        //@ts-ignore
        const result = setData("params.user.id", "userId")(context);
        result[dataOrResult].forEach((item) => {
          assert.strictEqual(
            item.userId,
            1,
            `'${type}/${method}': ${dataOrResult} has 'userId:1'`
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
        };

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = [{ userId: 2 }, {}, { userId: "abc" }];

        //@ts-ignore
        const result = setData("params.user.id", "userId")(context);
        result[dataOrResult].forEach((item) => {
          assert.strictEqual(
            item.userId,
            1,
            `'${type}/${method}': ${dataOrResult} has 'userId:1'`
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
        };

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = { userId: 2 };

        //@ts-ignore
        const result = setData("params.user.id", "userId")(context);

        assert.strictEqual(
          result[dataOrResult].userId,
          2,
          `'${type}/${method}': ${dataOrResult} has 'userId:2'`
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
        };

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = {};

        assert.throws(
          //@ts-ignore
          () => setData("params.user.id", "userId")(context),
          (err: any) => err.name === "Forbidden",
          `'${type}/${method}': throws 'Forbidden' error`
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
        } as any as HookContext;

        assert.doesNotThrow(
          //@ts-ignore
          () =>
            setData("params.user.id", "userId", { allowUndefined: true })(
              context
            ),
          `'${type}/${method}': passes`
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
        } as any as HookContext;

        const dataOrResult = type === "before" ? "data" : "result";
        context[dataOrResult] = { userId: 1 };

        assert.doesNotThrow(
          //@ts-ignore
          () =>
            setData("params.user.id", "userId", { overwrite: false })(context),
          `'${type}/${method}': passes`
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
          } as any as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = {};

          //@ts-ignore
          const result = setData("params.user.id", "userId", {
            overwrite: false,
          })(context);
          assert.strictEqual(
            result[dataOrResult].userId,
            1,
            `'${type}/${method}': ${dataOrResult} has 'userId:1'`
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
          } as any as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = { userId: 2 };

          //@ts-ignore
          const result = setData("params.user.id", "userId", {
            overwrite: false,
          })(context);
          assert.strictEqual(
            result[dataOrResult].userId,
            2,
            `'${type}/${method}': ${dataOrResult} has 'userId:2'`
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
          } as any as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = [{}, {}, {}];

          //@ts-ignore
          const result = setData("params.user.id", "userId", {
            overwrite: false,
          })(context);
          result[dataOrResult].forEach((item) => {
            assert.strictEqual(
              item.userId,
              1,
              `${type}/${method}': ${dataOrResult} has 'userId:1'`
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
          } as any as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = [{ userId: 0 }, {}, { userId: 2 }];

          //@ts-ignore
          const result = setData("params.user.id", "userId", {
            overwrite: false,
          })(context);
          result[dataOrResult].forEach((item, i) => {
            assert.strictEqual(
              item.userId,
              i,
              `${type}/${method}': ${dataOrResult} has 'userId:${i}`
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
          } as any as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = [{ userId: 2 }, {}, { userId: "abc" }];

          //@ts-ignore
          const result = setData("params.user.id", "userId", {
            overwrite: () => true,
          })(context);
          result[dataOrResult].forEach((item) => {
            assert.strictEqual(
              item.userId,
              1,
              `'${type}/${method}': ${dataOrResult} has 'userId:1'`
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
          } as any as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = { userId: 2 };

          //@ts-ignore
          const result = setData("params.user.id", "userId", {
            overwrite: (item) => item.userId == null,
          })(context);
          assert.strictEqual(
            result[dataOrResult].userId,
            2,
            `'${type}/${method}': ${dataOrResult} has 'userId:2'`
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
          } as any as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = { userId: 2 };

          //@ts-ignore
          const result = setData("params.user.id", "userId", {
            overwrite: (item, context) => context.type === "before",
          })(context);
          if (type === "before") {
            assert.strictEqual(
              result[dataOrResult].userId,
              1,
              `'${type}/${method}': ${dataOrResult} has 'userId:1'`
            );
          } else {
            assert.strictEqual(
              result[dataOrResult].userId,
              2,
              `'${type}/${method}': ${dataOrResult} has 'userId:2'`
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
          } as any as HookContext;

          const dataOrResult = type === "before" ? "data" : "result";
          context[dataOrResult] = [{ userId: 0 }, {}, { userId: 2 }];

          //@ts-ignore
          const result = setData("params.user.id", "userId", {
            overwrite: (item) => item.userId == null,
          })(context);
          result[dataOrResult].forEach((item, i) => {
            assert.strictEqual(
              item.userId,
              i,
              `${type}/${method}': ${dataOrResult} has 'userId:${i}`
            );
          });
        });
      });
    });
  });
});
