import type { HookContext } from "@feathersjs/feathers";
import assert from "assert";
import { getItemsIsArray } from "../../src";

describe("util - getItemsIsArray", function() {
  describe("before", function() {
    it("find:before", async function() {
      const context = {
        type: "before",
        method: "find",
        params: {
          query: {}
        }
      } as any as HookContext;
        
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, []);
      assert.deepStrictEqual(isArray, false);
    });
        
    it("get:before", async function() {
      const context = {
        type: "before",
        method: "get",
        id: 1,
        params: {
          query: {}
        }
      } as any as HookContext;
        
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, []);
      assert.deepStrictEqual(isArray, false);
    });
        
    it("create:before single", async function() {
      const context = {
        type: "before",
        method: "create",
        data: { test: true },
        params: {
          query: {}
        }
      } as any as HookContext;
        
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }]);
      assert.deepStrictEqual(isArray, false);
    });
        
    it("create:before multi", async function() {
      const context = {
        type: "before",
        method: "create",
        data: [{ test: true }, { test: true }],
        params: {
          query: {}
        }
      } as any as HookContext;
        
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }, { test: true }]);
      assert.deepStrictEqual(isArray, true);
    });
        
    it("update:before single", async function() {
      const context = {
        type: "before",
        method: "update",
        id: 1,
        data: { test: true },
        params: {
          query: {}
        }
      } as any as HookContext;
        
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }]);
      assert.deepStrictEqual(isArray, false);
    });
        
    it("patch:before single", async function() {
      const context = {
        type: "before",
        method: "patch",
        id: 1,
        data: { test: true },
        params: {
          query: {}
        }
      } as any as HookContext;
        
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }]);
      assert.deepStrictEqual(isArray, false);
    });
        
    it("patch:before multi", async function() {
      const context = {
        type: "before",
        method: "patch",
        id: null,
        data: { test: true },
        params: {
          query: {}
        }
      } as any as HookContext;
        
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }]);
      assert.deepStrictEqual(isArray, false);
    });
        
    it("remove:before single", async function() {
      const context = {
        type: "before",
        method: "remove",
        id: 1,
        params: {
          query: {}
        }
      } as any as HookContext;
        
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, []);
      assert.deepStrictEqual(isArray, false);
    });
        
    it("remove:before multi", async function() {
      const context = {
        type: "before",
        method: "remove",
        id: null,
        params: {
          query: {}
        }
      } as any as HookContext;
        
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, []);
      assert.deepStrictEqual(isArray, false);
    });
  });

  describe("after", function() {
    it("find:after paginate:true", function () {
      const context = {
        type: "after",
        method: "find",
        result: {
          total: 1,
          skip: 0,
          limit: 10,
          data: [{ test: true }]
        },
        params: {
          query: {}
        }
      } as any as HookContext;
              
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }]);
      assert.deepStrictEqual(isArray, true);
    });

    it("find:after paginate:false", function () {
      const context = {
        type: "after",
        method: "find",
        result: [{ test: true }],
        params: {
          query: {}
        }
      } as any as HookContext;
                
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }]);
      assert.deepStrictEqual(isArray, true);
    });

    it("get:after", function () {
      const context = {
        type: "after",
        method: "get",
        id: 1,
        result: { test: true },
        params: {
          query: {}
        }
      } as any as HookContext;
                  
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }]);
      assert.deepStrictEqual(isArray, false);
    });

    it("update:after", function () {
      const context = {
        type: "after",
        method: "update",
        id: 1,
        data: { test: "yes" },
        result: { test: true },
        params: {
          query: {}
        }
      } as any as HookContext;
                  
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }]);
      assert.deepStrictEqual(isArray, false);
    });

    it("patch:after single", function () {
      const context = {
        type: "after",
        method: "patch",
        id: 1,
        data: { test: "yes" },
        result: { test: true },
        params: {
          query: {}
        }
      } as any as HookContext;
                  
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }]);
      assert.deepStrictEqual(isArray, false);
    });

    it("patch:after multi", function () {
      const context = {
        type: "after",
        method: "patch",
        id: null,
        data: { test: "yes" },
        result: [{ test: true }, { test: true }],
        params: {
          query: {}
        }
      } as any as HookContext;
                  
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }, { test: true }]);
      assert.deepStrictEqual(isArray, true);
    });

    it("remove:after single", function () {
      const context = {
        type: "after",
        method: "remove",
        id: 1,
        data: { test: "yes" },
        result: { test: true },
        params: {
          query: {}
        }
      } as any as HookContext;
                  
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }]);
      assert.deepStrictEqual(isArray, false);
    });

    it("remove:after multi", function () {
      const context = {
        type: "after",
        method: "remove",
        id: null,
        data: { test: "yes" },
        result: [{ test: true }, { test: true }],
        params: {
          query: {}
        }
      } as any as HookContext;
                  
      const { items, isArray } = getItemsIsArray(context);
      assert.deepStrictEqual(items, [{ test: true }, { test: true }]);
      assert.deepStrictEqual(isArray, true);
    });
  });
});