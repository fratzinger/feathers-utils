import assert from "assert";
import { feathers } from "@feathersjs/feathers";
import { Service } from "feathers-memory";
import { shouldSkip, markHookForSkip } from "../../src";

describe("util - markHookForSkip", function() {
  it("returns hook object", function() {
    const context = markHookForSkip("test", "all", {});
    assert.ok(context, "returned context");
    assert.ok(context.params.skipHooks, "has skipHooks");
  });

  it("returns hook object for undefined context", function() {
    const context = markHookForSkip("test", "all");
    assert.ok(context, "returned context");
    assert.ok(context.params.skipHooks, "has skipHooks");
  });
  
  it("skips explicitly before hook", async function() {
    const app = feathers();
    app.use("service", new Service());
    const service = app.service("service");
    const ranInto = {};
    service.hooks({
      before: {
        all: [
          context => {
            markHookForSkip("test", "before", context);
          }
        ],
        find: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["find"] = true;
          },
          context => { context.result = null; }
        ],
        get: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["get"] = true;
          },
          context => { context.result = null; }
        ],
        create: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["create"] = true;
          },
          context => { context.result = null; }
        ],
        update: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["update"] = true;
          },
          context => { context.result = null; }
        ],
        patch: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["patch"] = true;
          },
          context => { context.result = null; }
        ],
        remove: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["remove"] = true;
          },
          context => { context.result = null; }
        ]
      }
    });
    const methods = {
      find: [],
      get: [1],
      create: [{}],
      update: [1, {}],
      patch: [1, {}],
      remove: [1]
    };
    const promises = Object.keys(methods).map(async method => {
      await service[method](...methods[method]);
      assert.ok(!Object.prototype.hasOwnProperty.call(ranInto, method), `'${method}': did not run into hook`);
      return true;
    });

    const results = await Promise.all(promises);
    assert.ok(results.every(x => x === true), "all ok");
  });

  it("skips explicitly after hook", async function() {
    const app = feathers();
    app.use("service", new Service());
    const service = app.service("service");
    const ranInto = {};
    service.hooks({
      before: {
        all: [
          context => {
            markHookForSkip("test", "after", context);
          },
          context => {
            context.result = null;
            return context;
          }
        ]
      },
      after: {
        find: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["find"] = true;
          },
          context => { context.result = null; }
        ],
        get: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["get"] = true;
          },
          context => { context.result = null; }
        ],
        create: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["create"] = true;
          },
          context => { context.result = null; }
        ],
        update: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["update"] = true;
          },
          context => { context.result = null; }
        ],
        patch: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["patch"] = true;
          },
          context => { context.result = null; }
        ],
        remove: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranInto["remove"] = true;
          },
          context => { context.result = null; }
        ]
      }
    });
    const methods = {
      find: [],
      get: [1],
      create: [{}],
      update: [1, {}],
      patch: [1, {}],
      remove: [1]
    };
    const promises = Object.keys(methods).map(async method => {
      await service[method](...methods[method]);
      assert.ok(!Object.prototype.hasOwnProperty.call(ranInto, method), `'${method}': did not run into hook`);
      return true;
    });

    const results = await Promise.all(promises);
    assert.ok(results.every(x => x === true), "all ok");
  });

  it("skips all hooks", async function() {
    const app = feathers();
    app.use("service", new Service());
    const service = app.service("service");
    const ranIntoBefore = {};
    const ranIntoAfter = {};
    service.hooks({
      before: {
        all: [
          context => {
            markHookForSkip("test", "all", context);
          }
        ],
        find: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoBefore["find"] = true;
          },
          context => { context.result = null; }
        ],
        get: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoBefore["get"] = true;
          },
          context => { context.result = null; }
        ],
        create: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoBefore["create"] = true;
          },
          context => { context.result = null; }
        ],
        update: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoBefore["update"] = true;
          },
          context => { context.result = null; }
        ],
        patch: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoBefore["patch"] = true;
          },
          context => { context.result = null; }
        ],
        remove: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoBefore["remove"] = true;
          },
          context => { context.result = null; }
        ]
      },
      after: {
        find: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoAfter["find"] = true;
          },
          context => { context.result = null; }
        ],
        get: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoAfter["get"] = true;
          },
          context => { context.result = null; }
        ],
        create: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoAfter["create"] = true;
          },
          context => { context.result = null; }
        ],
        update: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoAfter["update"] = true;
          },
          context => { context.result = null; }
        ],
        patch: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoAfter["patch"] = true;
          },
          context => { context.result = null; }
        ],
        remove: [
          context => {
            if (shouldSkip("test", context)) { return context; }
            ranIntoAfter["remove"] = true;
          },
          context => { context.result = null; }
        ]
      }
    });
    const methods = {
      find: [],
      get: [1],
      create: [{}],
      update: [1, {}],
      patch: [1, {}],
      remove: [1]
    };
    const promises = Object.keys(methods).map(async method => {
      await service[method](...methods[method]);
      assert.ok(!Object.prototype.hasOwnProperty.call(ranIntoBefore, method), `'${method}': did not run into before hook`);
      assert.ok(!Object.prototype.hasOwnProperty.call(ranIntoAfter, method), `'${method}': did not run into after hook`);
      return true;
    });

    const results = await Promise.all(promises);
    assert.ok(results.every(x => x === true), "all ok");
  });
});
