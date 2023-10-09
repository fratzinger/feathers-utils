import type { HookContext } from "@feathersjs/feathers";
import assert from "assert";
import { checkMulti } from "../../src";

describe("hook - checkMulti", function () {
  it("passes if 'allowsMulti' not defined", function () {
    const makeContext = (type: string, method: string) =>
      ({
        service: {},
        type,
        method,
      }) as HookContext;
    ["before", "after"].forEach((type) => {
      ["find", "get", "create", "update", "patch", "remove"].forEach(
        (method) => {
          const context = makeContext(type, method);
          //@ts-ignore
          assert.doesNotThrow(
            () => checkMulti()(context),
            `'${type}:${method}': does not throw`,
          );
        },
      );
    });
  });

  it("passes if 'allowsMulti' returns true", function () {
    const makeContext = (type: string, method: string) => {
      const context = {
        service: {
          allowsMulti: () => true,
        },
        method,
        type,
      };
      if (method === "create") {
        type === "before"
          ? //@ts-ignore
            (context.data = [])
          : //@ts-ignore
            (context.result = []);
      }
      return context as HookContext;
    };
    ["before", "after"].forEach((type) => {
      ["find", "get", "create", "update", "patch", "remove"].forEach(
        (method) => {
          const context = makeContext(type, method);
          //@ts-ignore
          assert.doesNotThrow(
            () => checkMulti()(context),
            `'${type}:${method}': does not throw`,
          );
        },
      );
    });
  });

  it("passes for 'find', 'get' and 'update'", function () {
    const makeContext = (type: string, method: string) =>
      ({
        service: {
          allowsMulti: () => false,
        },
        type,
        method,
      }) as HookContext;
    ["before", "after"].forEach((type) => {
      ["find", "get", "update"].forEach((method) => {
        const context = makeContext(type, method);
        //@ts-ignore
        assert.doesNotThrow(
          () => checkMulti()(context),
          `'${type}:${method}': does not throw`,
        );
      });
    });
  });

  it("passes if 'allowsMulti' returns false and is no multi data", function () {
    const makeContext = (type: string, method: string) => {
      const context = {
        service: {
          allowsMulti: (method: string) => method !== "find",
        },
        method,
        type,
      };
      if (method === "create") {
        type === "before"
          ? //@ts-ignore
            (context.data = {})
          : //@ts-ignore
            (context.result = {});
      }
      if (["patch", "remove"].includes(method)) {
        //@ts-ignore
        context.id = 1;
      }
      return context as HookContext;
    };
    ["before", "after"].forEach((type) => {
      ["create", "patch", "remove"].forEach((method) => {
        const context = makeContext(type, method);
        //@ts-ignore
        assert.doesNotThrow(
          () => checkMulti()(context),
          `'${type}:${method}': does not throw`,
        );
      });
    });
  });

  it("throws if 'allowsMulti' returns false and multi data", function () {
    const makeContext = (type: string, method: string) => {
      const context = {
        service: {
          allowsMulti: () => false,
        },
        method,
        type,
      };
      if (method === "create") {
        type === "before"
          ? //@ts-ignore
            (context.data = [])
          : //@ts-ignore
            (context.result = []);
      }
      return context as HookContext;
    };
    ["before", "after"].forEach((type) => {
      ["create", "patch", "remove"].forEach((method) => {
        const context = makeContext(type, method);
        //@ts-ignore
        assert.throws(
          () => checkMulti()(context),
          `'${type}:${method}': throws`,
        );
      });
    });
  });

  it("can skip hook", function () {
    const makeContext = (type: string, method: string) => {
      const context = {
        service: {
          allowsMulti: () => false,
        },
        method,
        type,
        params: {},
      };
      if (method === "create") {
        type === "before"
          ? //@ts-ignore
            (context.data = [])
          : //@ts-ignore
            (context.result = []);
      }
      return context as HookContext;
    };
    ["before", "after"].forEach((type) => {
      ["create", "patch", "remove"].forEach((method) => {
        const context = makeContext(type, method);
        context.params = {
          skipHooks: ["checkMulti"],
        };
        //@ts-ignore
        assert.doesNotThrow(
          () => checkMulti()(context),
          `'${type}:${method}': throws`,
        );
      });
    });
  });
});
