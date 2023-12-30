// Kudos to @DaddyWarbucks! This is a cheeky copy of his awesome library: 'feathers-fletching'.
// Definitely check it out! https://daddywarbucks.github.io/feathers-fletching/overview.html

import { GeneralError } from "@feathersjs/errors";

import type { HookContext } from "@feathersjs/feathers";

export type ShouldSkipOptions = {
  notSkippable?: boolean;
};

/**
 * util to detect if a hook should be skipped
 */
export const shouldSkip = <H extends HookContext = HookContext>(
  hookName: string,
  context: H,
  options?: ShouldSkipOptions,
): boolean => {
  if (!context.params || !context.params.skipHooks || options?.notSkippable) {
    return false;
  }

  const { skipHooks } = context.params;
  if (!Array.isArray(skipHooks)) {
    throw new GeneralError("The `skipHooks` param must be an Array of Strings");
  }
  const { type } = context;
  if (skipHooks.includes(hookName)) {
    return true;
  } else if (skipHooks.includes("all")) {
    return true;
  } else if (skipHooks.includes(type)) {
    return true;
  } else if (skipHooks.includes(`${type}:${hookName}`)) {
    return true;
  }

  return false;
};

if (import.meta.vitest) {
  const { it, assert } = import.meta.vitest;

  it("returns false if skipHooks not defined", function () {
    ["before", "after"].forEach((type) => {
      ["find", "get", "create", "update", "patch", "remove"].forEach(
        (method) => {
          const context = { type, method } as HookContext;
          assert.strictEqual(
            shouldSkip("all", context),
            false,
            `'${type}:${method}': returns false`,
          );
        },
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
            `'${type}:${method}': returns true`,
          );
        },
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
            `'${type}:${method}': returns true`,
          );
        },
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
            `'${type}:${method}': returns true`,
          );
        },
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
            `'${type}:${method}': returns true`,
          );
        },
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
            `'${type}:${method}': returns true`,
          );
        },
      );
    });
  });
}
