import type { HookContext } from "@feathersjs/feathers";
import assert from "assert";
import { isMulti } from "../../src";

describe("util - isMulti", function () {
  it("returns true", function () {
    const makeContext = (type: string, method: string) => {
      const context = {
        method,
        type,
      } as HookContext;
      if (method === "create") {
        type === "before" ? (context.data = []) : (context.result = []);
      }
      return context;
    };
    ["before", "after"].forEach((type) => {
      ["find", "create", "patch", "remove"].forEach((method) => {
        const context = makeContext(type, method);
        assert.strictEqual(
          isMulti(context),
          true,
          `'${type}:${method}': returns true`
        );
      });
    });
  });

  it("returns false", function () {
    const makeContext = (type: string, method: string) => {
      const context = {
        method,
        type,
        id: 0,
      } as HookContext;
      if (method === "create") {
        type === "before" ? (context.data = {}) : (context.result = {});
      }
      return context;
    };
    ["before", "after"].forEach((type) => {
      ["get", "create", "update", "patch", "remove"].forEach((method) => {
        const context = makeContext(type, method);
        assert.strictEqual(
          isMulti(context),
          false,
          `'${type}:${method}': returns false`
        );
      });
    });
  });
});
