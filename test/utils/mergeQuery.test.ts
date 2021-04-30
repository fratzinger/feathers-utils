import assert from"assert";
import mergeQuery from "../../src/utils/mergeQuery";
import feathers from "@feathersjs/feathers";
import { Service } from "feathers-memory";

describe("util - mergeQuery", function() {
  describe("simple objects passing", function() {
    const app = feathers();
    let service = new Service({ paginate: { default: 10, max: 100 }, whitelist: ["$and"] });
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
      },
      "combine two $or queries": {
        target: { $or: [ { id: 1 }, { id: 2 } ] },
        source: { $or: [ { id: 3 } ] },
        options: { defaultHandle: "combine", service },
        expected: { $or: [ { id: 1 }, { id: 2 }, { id: 3 } ] }
      },
      "intersects two $or queries": {
        target: { $or: [ { id: 1 }, { id: 2 } ] },
        source: { $or: [ { id: 3 } ] },
        options: { defaultHandle: "intersect", service },
        expected: { $and: [{ $or: [{ id: 1 }, { id: 2 }] }, { $or: [{ id: 3 }] }] }
      },
      "combine two $and queries": {
        target: { $and: [ { id: 1 }, { id: 2 } ] },
        source: { $and: [ { id: 3 } ] },
        options: { defaultHandle: "combine", service },
        expected: { $or: [{ $and: [{ id: 1 }, { id: 2 }] }, { $and: [{ id: 3 }] }] }
      },
      "intersects two $and queries": {
        target: { $and: [ { id: 1 }, { id: 2 } ] },
        source: { $and: [ { id: 3 } ] },
        options: { defaultHandle: "intersect", service },
        expected: { $and: [ { id: 1 }, { id: 2 }, { id: 3 } ] }
      },
      "combine $or and $and queries": {
        target: { $or: [ { id: 1 }, { id: 2 } ], $and: [{ id: 4 }] },
        source: { $or: [ { id: 3 } ], $and: [{ id: 5 }] },
        options: { defaultHandle: "combine", service },
        expected: { $or: [ { id: 1 }, { id: 2 }, { id: 3 }, { $and: [{ id: 4 }] }, { $and: [{ id: 5 }] } ] }
      },
      "intersect $or and $and queries": {
        target: { $or: [ { id: 1 }, { id: 2 } ], $and: [{ id: 4 }] },
        source: { $or: [ { id: 3 } ], $and: [{ id: 5 }] },
        options: { defaultHandle: "intersect", service },
        expected: { $and: [{ id: 4 }, { $or: [ { id: 1 }, { id: 2 } ] }, { $or: [{ id: 3 }] }, { id: 5 }] }
      },
      "removes empty $or for both": {
        target: { $or: [{}] },
        source: { $or: [{}] },
        options: { defaultHandle: "combine", service },
        expected: {}
      },
      "removes empty $and for both": {
        target: { $and: [{}] },
        source: { $and: [{}] },
        options: { defaultHandle: "combine", service },
        expected: {}
      },
      "cleans up $and with empty entries": {
        target: { $and: [{}, { id: 1 }, { id: 1 }, { id: 2 }] },
        source: { $and: [{}, { id: 2 }] },
        options: { defaultHandle: "intersect", service },
        expected: { $and: [{ id: 1 }, { id: 2 }] }
      },
      "removes duplicate entries in $or": {
        target: { $or: [{ id: 1 }, { id: 1 }, { id: 2 }] },
        source: { $or: [{ id: 2 }] },
        options: { defaultHandle: "combine", service },
        expected: { $or: [{ id: 1 }, { id: 2 }] }
      },
      "removes duplicate entries in $and": {
        target: { $and: [{ id: 1 }, { id: 1 }, { id: 2 }] },
        source: { $and: [{ id: 2 }] },
        options: { defaultHandle: "intersect", service },
        expected: { $and: [{ id: 1 }, { id: 2 }] }
      },
      "removes unnecessary $or in target with intersect": {
        target: { $or: [{ id: 1 }, {}] },
        source: { hi: "test" },
        options: { defaultHandle: "intersect", service },
        expected: { hi: "test" }
      },
      "removes unnecessary $or in source with intersect": {
        target: { hi: "test" },
        source: { $or: [{ id: 1 }, {}]  },
        options: { defaultHandle: "intersect", service },
        expected: { hi: "test" }
      },
      "removes unnecessary $or in target with combine": {
        target: { $or: [{ id: 1 }, {}] },
        source: { hi: "test" },
        options: { defaultHandle: "combine", service },
        expected: { hi: "test" }
      },
      "removes unnecessary $or in source with combine": {
        target: { hi: "test" },
        source: { $or: [{ id: 1 }, {}]  },
        options: { defaultHandle: "combine", service },
        expected: { hi: "test" }
      },
      "$in and other props": {
        target: { id: { $in: [1, 2, 3] }, status: "complete" },
        source: { id: { $in: [2, 3, 4] }, status: { $in: ["complete", "pending", "draft"] } },
        options: { defaultHandle: "intersect", service },
        expected: { id: { $in: [ 2, 3 ] }, status: "complete" }
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
