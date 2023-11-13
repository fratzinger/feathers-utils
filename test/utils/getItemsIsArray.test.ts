import type { HookContext } from "@feathersjs/feathers";
import assert from "assert";
import type { GetItemsIsArrayFrom } from "../../src";
import { getItemsIsArray } from "../../src";

function assertBefore(context, items, isArray) {
  const arrays: (GetItemsIsArrayFrom | undefined)[] = [
    undefined,
    "data",
    "automatic",
  ];

  for (const from of arrays) {
    const { items: items2, isArray: isArray2 } = getItemsIsArray(context, {
      from,
    });
    assert.deepStrictEqual(items2, items, `from: ${from}`);
    assert.deepStrictEqual(isArray2, isArray, `from: ${from}`);
  }
}

function assertAfter(context, items, isArray) {
  const arrays: (GetItemsIsArrayFrom | undefined)[] = [
    undefined,
    "result",
    "automatic",
  ];

  for (const from of arrays) {
    const { items: items2, isArray: isArray2 } = getItemsIsArray(context, {
      from,
    });
    assert.deepStrictEqual(items2, items, `from: ${from}`);
    assert.deepStrictEqual(isArray2, isArray, `from: ${from}`);
  }
}

describe("util - getItemsIsArray", function () {
  describe("before", function () {
    it("find:before", async function () {
      const context = {
        type: "before",
        method: "find",
        params: {
          query: {},
        },
      } as any as HookContext;

      assertBefore(context, [], false);
    });

    it("get:before", async function () {
      const context = {
        type: "before",
        method: "get",
        id: 1,
        params: {
          query: {},
        },
      } as any as HookContext;

      assertBefore(context, [], false);
    });

    it("create:before single", async function () {
      const context = {
        type: "before",
        method: "create",
        data: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext;

      assertBefore(context, [{ test: true }], false);
    });

    it("create:before multi", async function () {
      const context = {
        type: "before",
        method: "create",
        data: [{ test: true }, { test: true }],
        params: {
          query: {},
        },
      } as any as HookContext;

      assertBefore(context, [{ test: true }, { test: true }], true);
    });

    it("update:before single", async function () {
      const context = {
        type: "before",
        method: "update",
        id: 1,
        data: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext;

      assertBefore(context, [{ test: true }], false);
    });

    it("patch:before single", async function () {
      const context = {
        type: "before",
        method: "patch",
        id: 1,
        data: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext;

      assertBefore(context, [{ test: true }], false);
    });

    it("patch:before multi", async function () {
      const context = {
        type: "before",
        method: "patch",
        id: null,
        data: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext;

      assertBefore(context, [{ test: true }], false);
    });

    it("remove:before single", async function () {
      const context = {
        type: "before",
        method: "remove",
        id: 1,
        params: {
          query: {},
        },
      } as any as HookContext;

      assertBefore(context, [], false);
    });

    it("remove:before multi", async function () {
      const context = {
        type: "before",
        method: "remove",
        id: null,
        params: {
          query: {},
        },
      } as any as HookContext;

      assertBefore(context, [], false);
    });
  });

  describe("after", function () {
    it("find:after paginate:true", function () {
      const context = {
        type: "after",
        method: "find",
        result: {
          total: 1,
          skip: 0,
          limit: 10,
          data: [{ test: true }],
        },
        params: {
          query: {},
        },
      } as any as HookContext;

      assertAfter(context, [{ test: true }], true);
    });

    it("find:after paginate:false", function () {
      const context = {
        type: "after",
        method: "find",
        result: [{ test: true }],
        params: {
          query: {},
        },
      } as any as HookContext;

      assertAfter(context, [{ test: true }], true);
    });

    it("get:after", function () {
      const context = {
        type: "after",
        method: "get",
        id: 1,
        result: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext;

      assertAfter(context, [{ test: true }], false);
    });

    it("update:after", function () {
      const context = {
        type: "after",
        method: "update",
        id: 1,
        data: { test: "yes" },
        result: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext;

      assertAfter(context, [{ test: true }], false);
    });

    it("patch:after single", function () {
      const context = {
        type: "after",
        method: "patch",
        id: 1,
        data: { test: "yes" },
        result: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext;

      assertAfter(context, [{ test: true }], false);
    });

    it("patch:after multi", function () {
      const context = {
        type: "after",
        method: "patch",
        id: null,
        data: { test: "yes" },
        result: [{ test: true }, { test: true }],
        params: {
          query: {},
        },
      } as any as HookContext;

      assertAfter(context, [{ test: true }, { test: true }], true);
    });

    it("remove:after single", function () {
      const context = {
        type: "after",
        method: "remove",
        id: 1,
        data: { test: "yes" },
        result: { test: true },
        params: {
          query: {},
        },
      } as any as HookContext;

      assertAfter(context, [{ test: true }], false);
    });

    it("remove:after multi", function () {
      const context = {
        type: "after",
        method: "remove",
        id: null,
        data: { test: "yes" },
        result: [{ test: true }, { test: true }],
        params: {
          query: {},
        },
      } as any as HookContext;

      assertAfter(context, [{ test: true }, { test: true }], true);
    });
  });
});
