import assert from "assert";
import { pushSet } from "../../src";

describe("util - pushSet", function () {
  it("pushes to existing array", function () {
    const obj = {
      arr: [1],
    };
    pushSet(obj, ["arr"], 2);
    assert.deepStrictEqual(obj, { arr: [1, 2] });
  });

  it("sets array for not existing", function () {
    const obj = {};
    pushSet(obj, ["arr"], 2);
    assert.deepStrictEqual(obj, { arr: [2] });
  });

  it("adds existing element", function () {
    const obj = {
      arr: [1],
    };
    pushSet(obj, ["arr"], 1);
    assert.deepStrictEqual(obj, { arr: [1, 1] });
  });

  it("skips existing element", function () {
    const obj = {
      arr: [1],
    };
    pushSet(obj, ["arr"], 1, { unique: true });
    assert.deepStrictEqual(obj, { arr: [1] });
  });

  describe("deep dot notation", function () {
    it("deep: pushes to existing array", function () {
      const obj = {
        nested: { deep: [{ arr: [1] }] },
      };
      pushSet(obj, ["nested", "deep", 0, "arr"], 2);
      assert.deepStrictEqual(obj, { nested: { deep: [{ arr: [1, 2] }] } });
    });

    it("deep: sets array for not existing", function () {
      const obj = {};
      pushSet(obj, ["nested", "deep", 0, "arr"], 2);
      assert.deepStrictEqual(obj, { nested: { deep: [{ arr: [2] }] } });
    });

    it("deep: adds existing element", function () {
      const obj = {
        nested: { deep: [{ arr: [1] }] },
      };
      pushSet(obj, ["nested", "deep", 0, "arr"], 1);
      assert.deepStrictEqual(obj, { nested: { deep: [{ arr: [1, 1] }] } });
    });

    it("deep: skips existing element", function () {
      const obj = {
        nested: { deep: [{ arr: [1] }] },
      };
      pushSet(obj, ["nested", "deep", 0, "arr"], 1, { unique: true });
      assert.deepStrictEqual(obj, { nested: { deep: [{ arr: [1] }] } });
    });
  });
});
