import { setQueryKeySafely } from "../../src";
import assert from "assert";

describe("util - setQueryKeySafely", function () {
  it("does not mutate", function () {
    const params = {
      query: {
        test: true,
      },
    };

    const result = setQueryKeySafely(params, "test", false);
    assert.deepStrictEqual(params, {
      query: {
        test: true,
      },
    });

    assert.deepStrictEqual(result, {
      query: {
        test: true,
        $and: [{ test: false }],
      },
    });
  });

  it("adds a $eq filter for non existent key", function () {
    const params = {
      query: {},
    };

    const result = setQueryKeySafely(params, "test", true);
    assert.deepStrictEqual(result, {
      query: {
        test: true,
      },
    });
  });

  it("adds a $ne filter for non existent key", function () {
    const params = {
      query: {},
    };

    const result = setQueryKeySafely(params, "test", true, "$ne");
    assert.deepStrictEqual(result, {
      query: {
        test: {
          $ne: true,
        },
      },
    });
  });

  it("adds a $eq filter for existing key", function () {
    const params = {
      query: {
        test: true,
      },
    };

    const result = setQueryKeySafely(params, "test", false);
    assert.deepStrictEqual(result, {
      query: {
        test: true,
        $and: [{ test: false }],
      },
    });
  });

  it("adds a $in filter for existing key with value", function () {
    const params = {
      query: {
        test: true,
      },
    };

    const result = setQueryKeySafely(params, "test", [true], "$in");
    assert.deepStrictEqual(result, {
      query: {
        test: true,
        $and: [{ test: { $in: [true] } }],
      },
    });
  });

  it("adds a $in filter for existing key with object", function () {
    const params = {
      query: {
        test: {
          $eq: true,
        },
      },
    };

    const result = setQueryKeySafely(params, "test", [true], "$in");
    assert.deepStrictEqual(result, {
      query: {
        test: {
          $eq: true,
          $in: [true],
        },
      },
    });
  });

  it("adds a $in filter for existing $in", function () {
    const params = {
      query: {
        test: {
          $in: [true],
        },
      },
    };

    const result = setQueryKeySafely(params, "test", [false], "$in");
    assert.deepStrictEqual(result, {
      query: {
        test: {
          $in: [true],
        },
        $and: [{ test: { $in: [false] } }],
      },
    });
  });
});
