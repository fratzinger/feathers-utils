import assert from "assert";
import { filterArray, mergeQuery } from "../../src";
import { feathers } from "@feathersjs/feathers";
import { MemoryService } from "@feathersjs/memory";

describe("util - mergeQuery", function () {
  describe("general", function () {
    it("$limit: -1", function () {
      const query = mergeQuery({ $limit: -1 }, { id: 1 });
      assert.deepStrictEqual(query, { $limit: -1, id: 1 });
    });
  });

  describe("simple objects passing", function () {
    const app = feathers();
    app.use(
      "/service",
      new MemoryService({
        paginate: { default: 10, max: 100 },
        operators: ["$and"],
        filters: {
          $and: filterArray("$and"),
        },
      })
    );
    const service = app.service("/service");
    const passingPairs = {
      empty: {
        target: {},
        source: {},
        options: { useLogicalConjunction: false },
        expected: {},
      },
      target: {
        target: { id: 1, test1: true },
        source: { id: 2, test2: false },
        options: { defaultHandle: "target", useLogicalConjunction: false },
        expected: { id: 1, test1: true, test2: false },
      },
      source: {
        target: { id: 1, test1: true },
        source: { id: 2, test2: false },
        options: { defaultHandle: "source", useLogicalConjunction: false },
        expected: { id: 2, test1: true, test2: false },
      },
      "native booleans": {
        target: { test: true },
        source: { test: false },
        options: { useLogicalConjunction: false },
        expected: { test: false },
      },
      "native nested to boolean": {
        target: { test: { nested: [{ deep: true }] } },
        source: { test: false },
        options: { useLogicalConjunction: false },
        expected: { test: false },
      },
    };
    for (const key in passingPairs) {
      const { target, source, options, expected } = passingPairs[key];
      it(`'${key}'`, function () {
        const query = mergeQuery(
          target,
          source,
          Object.assign({ service }, options)
        );
        assert.deepStrictEqual(query, expected, "works as expected");
      });
    }
  });

  describe("simple objects passing with handle combine", function () {
    const app = feathers();
    app.use(
      "/service",
      new MemoryService({
        paginate: { default: 10, max: 100 },
        operators: ["$and"],
        filters: {
          $and: filterArray("$and"),
        },
      })
    );
    const service = app.service("/service");
    const passingPairs = {
      "combine two numbers": {
        target: { id: 1 },
        source: { id: 2 },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: { id: { $in: [1, 2] } },
      },
      "combine $in different types": {
        target: { id: "1" },
        source: { id: 2 },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: { id: { $in: ["1", 2] } },
      },
      "combine number to $in with overlapping": {
        target: { id: 1 },
        source: { id: { $in: [1, 2] } },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: { id: { $in: [1, 2] } },
      },
      "combine numbers in $in": {
        target: { id: 1 },
        source: { id: { $in: [2, 3] } },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: { id: { $in: [2, 3, 1] } },
      },
      "combine two $in": {
        target: { id: { $in: [2] } },
        source: { id: { $in: [3, 4] } },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: { id: { $in: [2, 3, 4] } },
      },
      "combine two $or queries": {
        target: { $or: [{ id: 1 }, { id: 2 }] },
        source: { $or: [{ id: 3 }] },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: { $or: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      },
      "combine two $and queries": {
        target: { $and: [{ id: 1 }, { id: 2 }] },
        source: { $and: [{ id: 3 }] },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: {
          $or: [{ $and: [{ id: 1 }, { id: 2 }] }, { $and: [{ id: 3 }] }],
        },
      },
      "combine $or and $and queries": {
        target: { $or: [{ id: 1 }, { id: 2 }], $and: [{ id: 4 }] },
        source: { $or: [{ id: 3 }], $and: [{ id: 5 }] },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: {
          $or: [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { $and: [{ id: 4 }] },
            { $and: [{ id: 5 }] },
          ],
        },
      },
      "removes empty $or for both": {
        target: { $or: [{}] },
        source: { $or: [{}] },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: {},
      },
      "removes empty $and for both": {
        target: { $and: [{}] },
        source: { $and: [{}] },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: {},
      },
      "removes duplicate entries in $or": {
        target: { $or: [{ id: 1 }, { id: 1 }, { id: 2 }] },
        source: { $or: [{ id: 2 }] },
        options: { defaultHandle: "combine", useLogicalConjunction: false },
        expected: { $or: [{ id: 1 }, { id: 2 }] },
      },
      "$in and other props": {
        target: { id: { $in: [1, 2, 3] }, status: "complete" },
        source: {
          id: { $in: [2, 3, 4] },
          status: { $in: ["complete", "pending", "draft"] },
        },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { id: { $in: [2, 3] }, status: "complete" },
      },
    };
    for (const key in passingPairs) {
      const { target, source, options, expected } = passingPairs[key];
      it(`'${key}'`, function () {
        if (key === "combine two $and queries") {
          console.log("target", target);
          console.log("source", source);
        }
        const query = mergeQuery(
          target,
          source,
          Object.assign({ service }, options)
        );
        assert.deepStrictEqual(query, expected, "works as expected");
      });
    }

    describe("with useLogicalConjunction: true", function () {
      const app = feathers();
      app.use(
        "/service",
        new MemoryService({
          paginate: { default: 10, max: 100 },
          operators: ["$and"],
          filters: {
            $and: filterArray("$and"),
          },
        })
      );
      const service = app.service("/service");
      const passingPairs = {
        "merge empty source": {
          target: { id: 1 },
          source: {},
          options: { defaultHandle: "combine", useLogicalConjunction: true },
          expected: { id: 1 },
        },
        "merge empty target": {
          target: {},
          source: { id: 1 },
          options: { defaultHandle: "combine", useLogicalConjunction: true },
          expected: { id: 1 },
        },
        "merge queries with $or": {
          target: { id: 1 },
          source: { $or: [{ id: { $in: [1, 3] } }], id: 2 },
          options: { defaultHandle: "combine", useLogicalConjunction: true },
          expected: { id: 1, $or: [{ id: { $in: [1, 3] } }, { id: 2 }] },
        },
        "merge queries with existing $or": {
          target: { id: 1 },
          source: { $or: [{ id: { $in: [1, 3] } }], id: 2 },
          options: { defaultHandle: "combine", useLogicalConjunction: true },
          expected: { id: 1, $or: [{ id: { $in: [1, 3] } }, { id: 2 }] },
        },
        "merge queries with existing $and": {
          target: { id: 1 },
          source: { $and: [{ id: 2 }] },
          options: { defaultHandle: "combine", useLogicalConjunction: true },
          expected: { id: 1, $or: [{ $and: [{ id: 2 }] }] },
        },
        "merge queries with existing $or in target": {
          target: { $or: [{ id: 1 }], id: 3 },
          source: { id: 2 },
          options: { defaultHandle: "combine", useLogicalConjunction: true },
          expected: { $or: [{ id: 1 }, { id: 2 }], id: 3 },
        },
      };
      for (const key in passingPairs) {
        const { target, source, options, expected } = passingPairs[key];
        it(`'${key}'`, function () {
          const query = mergeQuery(
            target,
            source,
            Object.assign({ service }, options)
          );
          assert.deepStrictEqual(query, expected, "works as expected");
        });
      }
    });
  });

  describe("simple objects passing with handle intersect", function () {
    const app = feathers();
    app.use(
      "/service",
      new MemoryService({
        paginate: { default: 10, max: 100 },
        whitelist: ["$and"],
        filters: {
          $and: filterArray("$and"),
        },
      })
    );
    const service = app.service("/service");
    const passingPairs = {
      "intersect number and overlapping $in": {
        target: { id: 1 },
        source: { id: { $in: [1, 3] } },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { id: 1 },
      },
      "intersect $in and $in with overlapping": {
        target: { id: { $in: [1, 2] } },
        source: { id: { $in: [1, 3] } },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { id: 1 },
      },
      "$limit for target stays the same": {
        target: { $limit: 50, $skip: 10, $sort: { id: 1 } },
        source: { id: 1 },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { id: 1, $limit: 50, $skip: 10, $sort: { id: 1 } },
      },
      "$limit gets overridden": {
        target: { $limit: 50, $skip: 10, $sort: { id: 1 } },
        source: { $limit: 10, id: 1 },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { id: 1, $limit: 10, $skip: 10, $sort: { id: 1 } },
      },
      "intersects two $or queries": {
        target: { $or: [{ id: 1 }, { id: 2 }] },
        source: { $or: [{ id: 3 }] },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: {
          $and: [{ $or: [{ id: 1 }, { id: 2 }] }, { $or: [{ id: 3 }] }],
        },
      },
      "intersects two $and queries": {
        target: { $and: [{ id: 1 }, { id: 2 }] },
        source: { $and: [{ id: 3 }] },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { $and: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      },
      "intersect $or and $and queries": {
        target: { $or: [{ id: 1 }, { id: 2 }], $and: [{ id: 4 }] },
        source: { $or: [{ id: 3 }], $and: [{ id: 5 }] },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: {
          $and: [
            { id: 4 },
            { $or: [{ id: 1 }, { id: 2 }] },
            { $or: [{ id: 3 }] },
            { id: 5 },
          ],
        },
      },
      "cleans up $and with empty entries": {
        target: { $and: [{}, { id: 1 }, { id: 1 }, { id: 2 }] },
        source: { $and: [{}, { id: 2 }] },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { $and: [{ id: 1 }, { id: 2 }] },
      },
      "removes duplicate entries in $and": {
        target: { $and: [{ id: 1 }, { id: 1 }, { id: 2 }] },
        source: { $and: [{ id: 2 }] },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { $and: [{ id: 1 }, { id: 2 }] },
      },
      "removes unnecessary $or in target with intersect": {
        target: { $or: [{ id: 1 }, {}] },
        source: { hi: "test" },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { hi: "test" },
      },
      "removes unnecessary $or in source with intersect": {
        target: { hi: "test" },
        source: { $or: [{ id: 1 }, {}] },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { hi: "test" },
      },
      "$in and other props": {
        target: { id: { $in: [1, 2, 3] }, status: "complete" },
        source: {
          id: { $in: [2, 3, 4] },
          status: { $in: ["complete", "pending", "draft"] },
        },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
        expected: { id: { $in: [2, 3] }, status: "complete" },
      },
    };
    for (const key in passingPairs) {
      const { target, source, options, expected } = passingPairs[key];
      it(`'${key}'`, function () {
        const query = mergeQuery(
          target,
          source,
          Object.assign({ service }, options)
        );
        assert.deepStrictEqual(query, expected, "works as expected");
      });
    }

    describe("with useLogicalConjunction: true", function () {
      const app = feathers();
      app.use(
        "/service",
        new MemoryService({
          paginate: { default: 10, max: 100 },
          operators: ["$and"],
          filters: {
            $and: filterArray("$and"),
          },
        })
      );
      const service = app.service("/service");
      const passingPairs = {
        "merge empty source": {
          target: { id: 1 },
          source: {},
          options: { defaultHandle: "intersect", useLogicalConjunction: true },
          expected: { id: 1 },
        },
        "merge empty target": {
          target: {},
          source: { id: 1 },
          options: { defaultHandle: "intersect", useLogicalConjunction: true },
          expected: { id: 1 },
        },
        "merge queries with $and": {
          target: { id: 1 },
          source: { id: { $in: [1, 3] } },
          options: { defaultHandle: "intersect", useLogicalConjunction: true },
          expected: { id: 1, $and: [{ id: { $in: [1, 3] } }] },
        },
        "merge queries with existing $and": {
          target: { id: 1 },
          source: { $and: [{ id: { $in: [1, 3] } }], id: 2 },
          options: { defaultHandle: "intersect", useLogicalConjunction: true },
          expected: { id: 1, $and: [{ id: { $in: [1, 3] } }, { id: 2 }] },
        },
        "merge queries with existing $or": {
          target: { id: 1 },
          source: { $or: [{ id: 2 }] },
          options: { defaultHandle: "intersect", useLogicalConjunction: true },
          expected: { id: 1, $and: [{ $or: [{ id: 2 }] }] },
        },
        "merge queries with existing $and in target": {
          target: { $and: [{ id: 1 }], id: 3 },
          source: { id: 2 },
          options: { defaultHandle: "intersect", useLogicalConjunction: true },
          expected: { $and: [{ id: 1 }, { id: 2 }], id: 3 },
        },
      };
      for (const key in passingPairs) {
        const { target, source, options, expected } = passingPairs[key];
        it(`'${key}'`, function () {
          const query = mergeQuery(
            target,
            source,
            Object.assign({ service }, options)
          );
          assert.deepStrictEqual(query, expected, "works as expected");
        });
      }
    });
  });

  describe("simple objects failing", function () {
    const failingPairs = {
      "intersect two numbers": {
        target: { id: 1 },
        source: { id: 2 },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
      },
      "intersect booleans": {
        target: { test: true },
        source: { test: false },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
      },
      "intersect number and $in": {
        target: { id: 1 },
        source: { id: { $in: [2, 3] } },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
      },
      "intersect two $in": {
        target: { id: { $in: [1, 3] } },
        source: { id: { $in: [2, 4] } },
        options: { defaultHandle: "intersect", useLogicalConjunction: false },
      },
    };
    for (const key in failingPairs) {
      const { target, source, options } = failingPairs[key];
      it(`'${key}'`, function () {
        assert.throws(
          () => {
            mergeQuery(target, source, options);
          },
          (err: any) => err.name === "Forbidden",
          "throws as expected"
        );
      });
    }
  });
});
