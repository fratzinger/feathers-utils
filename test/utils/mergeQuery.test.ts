import assert from"assert";
import mergeQuery from "../../src/utils/mergeQuery";
import feathers from "@feathersjs/feathers";
import { Service } from "feathers-memory";

describe("util - mergeQuery", function() {
  describe("simple objects passing", function() {
    const app = feathers();
    let service = new Service({ paginate: { default: 10, max: 100 } });
    app.use("/service", service);
    service = app.service("/service");
    const passingPairs = {
      "empty": {
        target: {},
        source: {},
        expected: {}
      },
      "target": {
        target: { id : 1, test1: true },
        source: { id : 2, test2: false },
        options: { defaultHandle: "target" },
        expected: { id: 1, test1: true, test2: false }
      },
      "source": {
        target: { id : 1, test1: true },
        source: { id : 2, test2: false },
        options: { defaultHandle: "source" },
        expected: { id: 2, test1: true, test2: false }
      },
      "combine two numbers": {
        target: { id : 1 },
        source: { id : 2 },
        options: { defaultHandle: "combine" },
        expected: { id: { $in: [1, 2] } }
      },
      "combine $in different types": {
        target: { id : "1" },
        source: { id : 2 },
        options: { defaultHandle: "combine" },
        expected: { id: { $in: ["1", 2] } }
      },
      "native booleans": {
        target: { test: true },
        source: { test: false },
        options: { },
        expected: { test: false }
      },
      "native nested to boolean": {
        target: { test: { nested: [{ deep: true } ] } },
        source: { test: false },
        options: { },
        expected: { test: false }
      },
      "combine number to $in with overlapping": {
        target: { id: 1 },
        source: { id: { $in: [1, 2] } },
        options: { defaultHandle: "combine" },
        expected: { id: { $in: [1, 2] } }
      },
      "combine numbers in $in": {
        target: { id: 1 },
        source: { id: { $in: [2, 3] } },
        options: { defaultHandle: "combine" },
        expected: { id: { $in: [2, 3, 1] } }
      },
      "combine two $in": {
        target: { id: { $in: [2] } },
        source: { id: { $in: [3, 4] } },
        options: { defaultHandle: "combine" },
        expected: { id: { $in: [2, 3, 4] } }
      },
      /*"combine $in and $nin": {
        target: { id: { $in: [2] } },
        source: { id: { $nin: [3, 4] } },
        options: { defaultHandle: "combine" },
        expected: { id: { $in: [2], $nin: [3, 4] } }
      },*/
      "intersect number and overlapping $in": {
        target: { id: 1 },
        source: { id: { $in: [1, 3] } },
        options: { defaultHandle: "intersect" },
        expected: { id: 1 }
      },
      "intersect $in and $in with overlapping": {
        target: { id: { $in: [1, 2] } },
        source: { id: { $in: [1, 3] } },
        options: { defaultHandle: "intersect" },
        expected: { id: 1 }
      },
      "$limit for target stays the same": {
        target: { $limit: 50, $skip: 10, $sort: { id: 1 } },
        source: { id: 1 },
        options: { defaultHandle: "intersect", service },
        expected: { id: 1, $limit: 50, $skip: 10, $sort: { id: 1 } }
      },
      "$limit gets overridden": {
        target: { $limit: 50, $skip: 10, $sort: { id: 1 } },
        source: { $limit: 10, id: 1 },
        options: { defaultHandle: "intersect", service },
        expected: { id: 1, $limit: 10, $skip: 10, $sort: { id: 1 } }
      }
      /*"intersect number and $nin": {
        target: { id: 1 },
        source: { id: { $nin: [1] } },
        options: { defaultHandle: "intersect" },
        expected: { id: { $in: [] } }
      },
      "intersect number and $nin": {
        target: { id: 1 },
        source: { id: { $nin: [1, 3] } },
        options: { defaultHandle: "intersect" },
        expected: { id: { $nin: [1, 3] } }
      },*/
      /*"intersect $in and $nin": {
        target: { id: { $in: [1] } },
        source: { id: { $nin: [1] } },
        options: { defaultHandle: "intersect" },
        expected: { id: { $in: [] } }
      },*/
    };
    for (const key in passingPairs) {
      const { target, source, options, expected } = passingPairs[key];
      it(`'${key}'`, function() {
        const query = mergeQuery(target, source, options);
        assert.deepStrictEqual(query, expected, "works as expected");
      });
    }
  });

  describe("simple objects failing", function() {
    const failingPairs = {
      "intersect two numbers": {
        target: { id: 1 },
        source: { id: 2 },
        options: { defaultHandle: "intersect" }
      },
      "intersect booleans": {
        target: { test: true },
        source: { test: false },
        options: { defaultHandle: "intersect" }
      },
      "intersect number and $in": {
        target: { id: 1 },
        source: { id: { $in: [2, 3] } },
        options: { defaultHandle: "intersect" }
      },
      "intersect two $in": {
        target: { id: { $in: [1, 3 ] } },
        source: { id: { $in: [2, 4 ] } },
        options: { defaultHandle: "intersect" }
      }
    };
    for (const key in failingPairs) {
      const { target, source, options } = failingPairs[key];
      it(`'${key}'`, function() {
        assert.throws(() => {
          mergeQuery(target, source, options);
        }, err => err.name === "Forbidden", "throws as expected");
      });
    }
  });
});
