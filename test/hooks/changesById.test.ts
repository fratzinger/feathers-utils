import assert from "assert";
import changesById from "../../src/hooks/changesById";
import { Service } from "feathers-memory";
import feathers from "@feathersjs/feathers";

describe("hook - changesById", function() {
  function mock(cb, options?) {
    const app = feathers();
    app.use("/test", new Service());
    const service = app.service("test");
    service.hooks({
      before: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [
          changesById(cb, options)
        ],
        patch: [
          changesById(cb, options)
        ],
        remove: []
      },
      after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [
          changesById(cb, options)
        ],
        patch: [
          changesById(cb, options)
        ],
        remove: []
      }
    });
    
    return { 
      app, 
      service 
    };
  }

  describe("update", function() {
    it("basic update", async function() {
      let calledCb = false;
      const cb = (byId, context) => {
        calledCb = true;
        assert.strictEqual(context.path, "test", "cb has context");
        assert.ok(byId["0"].before, "has before");
        assert.ok(byId["0"].after, "has after");
        assert.deepStrictEqual(byId["0"].before, { id: 0, test: true, comment: "awesome" }, "has right before");
        assert.deepStrictEqual(byId["0"].after, { id: 0, test: false }, "has right after");
      };
      const { service } = mock(cb);
    
      const item = await service.create({ test: true, comment: "awesome" });
    
      assert.ok(!calledCb, "not called cb");
    
      const result = await service.update(item.id, { test: false });
    
      assert.ok(calledCb, "called cb");
      assert.deepStrictEqual(result, { id: 0, test: false }, "has right result");
    });

    it("basic update with $select", async function() {
      let calledCb = false;
      const cb = (byId, context) => {
        calledCb = true;
        assert.strictEqual(context.path, "test", "cb has context");
        assert.ok(byId["0"].before, "has before");
        assert.ok(byId["0"].after, "has after");
        assert.deepStrictEqual(byId["0"].before, { id: 0, test: true, comment: "awesome" }, "has right before");
        assert.deepStrictEqual(byId["0"].after, { id: 0, test: false }, "has right after");
      };
      const { service } = mock(cb);
      
      const item = await service.create({ test: true, comment: "awesome" });
      
      assert.ok(!calledCb, "not called cb");
      
      const result = await service.update(item.id, { test: false }, { query: { $select: ["id"] } });
      
      assert.ok(calledCb, "called cb");
      assert.deepStrictEqual(result, { id: 0 }, "has right result");
    });
  });

  describe("patch", function() {
    it("basic patch", async function() {
      let calledCb = false;
      const cb = (byId, context) => {
        calledCb = true;
        assert.strictEqual(context.path, "test", "cb has context");
        assert.ok(byId["0"].before, "has before");
        assert.ok(byId["0"].after, "has after");
        assert.deepStrictEqual(byId["0"].before, { id: 0, test: true, comment: "awesome" }, "has right before");
        assert.deepStrictEqual(byId["0"].after, { id: 0, test: false, comment: "awesome" }, "has right after");
      };
      const { service } = mock(cb);
      
      const item = await service.create({ test: true, comment: "awesome" });
      
      assert.ok(!calledCb, "not called cb");
      
      const result = await service.patch(item.id, { test: false });
      
      assert.ok(calledCb, "called cb");
      assert.deepStrictEqual(result, { id: 0, test: false, comment: "awesome" }, "has right result");
    });
  
    it("basic patch with $select", async function() {
      let calledCb = false;
      const cb = (byId, context) => {
        calledCb = true;
        assert.strictEqual(context.path, "test", "cb has context");
        assert.ok(byId["0"].before, "has before");
        assert.ok(byId["0"].after, "has after");
        assert.deepStrictEqual(byId["0"].before, { id: 0, test: true, comment: "awesome" }, "has right before");
        assert.deepStrictEqual(byId["0"].after, { id: 0, test: false, comment: "awesome" }, "has right after");
      };
      const { service } = mock(cb);
        
      const item = await service.create({ test: true, comment: "awesome" });
        
      assert.ok(!calledCb, "not called cb");
        
      const result = await service.patch(item.id, { test: false }, { query: { $select: ["id"] } });
        
      assert.ok(calledCb, "called cb");
      assert.deepStrictEqual(result, { id: 0 }, "has right result");
    });
  });
});