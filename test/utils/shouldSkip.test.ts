import type { HookContext } from "@feathersjs/feathers";
import assert from "assert";
import { shouldSkip } from "../../src";

describe("util - shouldSkip", function () {
  it("returns false if skipHooks not defined", function () {
    ["before", "after"].forEach((type) => {
      ["find", "get", "create", "update", "patch", "remove"].forEach(
        (method) => {
          const context = { type, method } as HookContext;
          assert.strictEqual(
            shouldSkip("all", context),
            false,
            `'${type}:${method}': returns false`
          );
        }
      );
    });
  });

  it("returns true for skipHooks: ['all']", function () {
    ["before", "after", "error"].forEach((type) => {
      ["find", "get", "create", "update", "patch", "remove"].forEach(
        (method) => {
          const context = {
            type,
            method,
            params: { skipHooks: ["all"] },
          } as HookContext;
          assert.strictEqual(
            shouldSkip("test", context),
            true,
            `'${type}:${method}': returns true`
          );
        }
      );
    });
  });

  it("returns true for skipHooks: [`type`]", function () {
    ["before", "after", "error"].forEach((type) => {
      ["find", "get", "create", "update", "patch", "remove"].forEach(
        (method) => {
          const context = {
            type,
            method,
            params: { skipHooks: [type] },
          } as HookContext;
          assert.strictEqual(
            shouldSkip("test", context),
            true,
            `'${type}:${method}': returns true`
          );
        }
      );
    });
  });

  it("returns true for skipHooks: ['`type`:test']", function () {
    ["before", "after", "error"].forEach((type) => {
      ["find", "get", "create", "update", "patch", "remove"].forEach(
        (method) => {
          const context = {
            type,
            method,
            params: { skipHooks: [`${type}:test`] },
          } as HookContext;
          assert.strictEqual(
            shouldSkip("test", context),
            true,
            `'${type}:${method}': returns true`
          );
        }
      );
    });
  });

  it("returns true for skipHooks: ['test']", function () {
    ["before", "after", "error"].forEach((type) => {
      ["find", "get", "create", "update", "patch", "remove"].forEach(
        (method) => {
          const context = {
            type,
            method,
            params: { skipHooks: ["test"] },
          } as HookContext;
          assert.strictEqual(
            shouldSkip("test", context),
            true,
            `'${type}:${method}': returns true`
          );
        }
      );
    });
  });

  it("returns false for skipHooks other than test", function () {
    const types = ["before", "after", "error"];
    types.forEach((type) => {
      ["find", "get", "create", "update", "patch", "remove"].forEach(
        (method) => {
          const remainingTypes = types.filter((x) => x !== type);
          const skipHooks = [
            "test2",
            `${type}:test2`,
            ...remainingTypes.map((t) => `${t}:test1`),
          ];
          const context = {
            type,
            method,
            params: { skipHooks },
          } as HookContext;
          assert.strictEqual(
            shouldSkip("test1", context),
            false,
            `'${type}:${method}': returns true`
          );
        }
      );
    });
  });
});
