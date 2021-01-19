import assert from "assert";
import isMulti from "../../src/utils/isMulti";

describe("util - isMulti", function() {
  it("returns true", function() {
    const makeContext = (type: string, method: string) => {
      const context = {
        method,
        type,
      };
      if (method === "create") {
        (type === "before") 
        //@ts-ignore
          ? context.data = [] 
        //@ts-ignore
          : context.result = [];
      }
      return context;
    };
    ["before", "after"].forEach(type => {
      ["find", "create", "patch", "remove"].forEach(method => {
        const context = makeContext(type, method);
        //@ts-ignore
        assert.strictEqual(isMulti(context), true, `'${type}:${method}': returns true`);
      });
    });
  });

  it("returns false", function() {
    const makeContext = (type: string, method: string) => {
      const context = {
        method,
        type,
        id: 0
      };
      if (method === "create") {
        (type === "before")
        //@ts-ignore
          ? context.data = {}
        //@ts-ignore
          : context.result = {};
      }
      return context;
    };
    ["before", "after"].forEach(type => {
      ["get", "create", "update", "patch", "remove"].forEach(method => {
        const context = makeContext(type, method);
        //@ts-ignore
        assert.strictEqual(isMulti(context), false, `'${type}:${method}': returns false`);
      });
    });
  });
});