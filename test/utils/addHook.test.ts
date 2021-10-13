import assert from "assert";
import feathers from "@feathersjs/feathers";
import createService from "feathers-memory";

import { addHook } from "../../src";

import { HookType, ServiceMethodName } from "../../src/types";

const mockApp = (withHooks?: boolean) => {
  const app = feathers();
  app.use("users", createService());
  app.use("tasks", createService());
  app.use("authentication", createService());
  const usersService = app.service("users");
  const tasksService = app.service("tasks");
  const authenticationService = app.service("authentication");
  usersService.path = "users";
  tasksService.path = "tasks";
  authenticationService.path = "authentication";
  if (withHooks) {
    [usersService, tasksService, authenticationService].forEach(service => {
      service.hooks({
        before: {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          all: [() => {}]
        },
        after: {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          all: [() => {}]
        },
        error: {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          all: [() => {}]
        }
      });
    });
  } else {
    [usersService, tasksService, authenticationService].forEach(service => {
      service.hooks({
        before: { all: [] },
        after: { all: [] },
        error: { all: [] }
      });
    });
  }
  return {
    app,
    usersService,
    tasksService,
    authenticationService
  };
};

describe("util - addHook", function() {
  it("adds all hooks", function() {
    const {
      app,
      usersService,
      tasksService,
      authenticationService
    } = mockApp();
    
    const types = ["before", "after", "error"] as HookType[];
    const methods = ["find", "get", "create", "update", "patch", "remove"] as ServiceMethodName[];
    
    addHook(app, "addHook", {
      types,
      methods,
      orderByType: {
        before: "first",
        after: "first",
        error: "first"
      }
    });
    
    [usersService, tasksService, authenticationService].forEach(service => {
      types.forEach(type => {
        methods.forEach(method => {
          const hooks = service.__hooks[type][method];
          assert.strictEqual(hooks.length, 1, `'${service.path}/${type}:${method}': has 1 hook`);
          assert.strictEqual(hooks[0], "addHook", `'${service.path}/${type}:${method}': hook is 'addHook'`);
        });
      });
    });
  });

  it("adds hooks to specific type", function() {
    const types = ["before", "after", "error"] as HookType[];
    const methods = ["find", "get", "create", "update", "patch", "remove"] as ServiceMethodName[];
    
    types.forEach(type => {
      const {
        app,
        usersService,
        tasksService,
        authenticationService
      } = mockApp();
      
      addHook(app, "addHook", {
        types: [type],
        methods,
        orderByType: {
          before: "first",
          after: "first",
          error: "first"
        }
      });

      const remainingTypes = types.filter(x => x !== type);

      [usersService, tasksService, authenticationService].forEach(service => {
        methods.forEach(method => {
          const hooks = service.__hooks[type][method];
          assert.strictEqual(hooks.length, 1, `'${service.path}/${type}:${method}': has 1 hook`);
          assert.strictEqual(hooks[0], "addHook", `'${service.path}/${type}:${method}': hook is 'addHook'`);
          remainingTypes.forEach(type => {
            const hooks = service.__hooks[type][method];
            assert.strictEqual(hooks.length, 0, `'${service.path}/${type}:${method}': has zero hooks`);
          });
        });
      });
    });
  });

  it("adds hooks to specific type and method", function() {
    const types = ["before", "after", "error"] as HookType[];
    const methods = ["find", "get", "create", "update", "patch", "remove"] as ServiceMethodName[];

    const method = "find";
    
    types.forEach(type => {
      const {
        app,
        usersService,
        tasksService,
        authenticationService
      } = mockApp();
      
      addHook(app, "addHook", {
        types: [type],
        methods: [method],
        orderByType: {
          before: "first",
          after: "first",
          error: "first"
        }
      });

      const remainingTypes = types.filter(x => x !== type);
      const remainingMethods = methods.filter(x => x != method);

      [usersService, tasksService, authenticationService].forEach(service => {
        const hooks = service.__hooks[type][method];
        assert.strictEqual(hooks.length, 1, `'${service.path}/${type}:${method}': has 1 hook`);
        assert.strictEqual(hooks[0], "addHook", `'${service.path}/${type}:${method}': hook is 'addHook'`);
        remainingTypes.forEach(type => {
          remainingMethods.forEach(method => {
            const hooks = service.__hooks[type][method];
            assert.strictEqual(hooks.length, 0, `'${service.path}/${type}:${method}': has zero hooks`);
          });
        });
      });
    });
  });

  it("appends all hooks with 'last'", function() {
    const {
      app,
      usersService,
      tasksService,
      authenticationService
    } = mockApp(true);

    const types = ["before", "after", "error"] as HookType[];
    const methods = ["find", "get", "create", "update", "patch", "remove"] as ServiceMethodName[];

    addHook(app, "addHook", {
      types,
      methods,
      orderByType: {
        before: "last",
        after: "last",
        error: "last"
      }
    });

    [usersService, tasksService, authenticationService].forEach(service => {
      types.forEach(type => {
        methods.forEach(method => {
          const hooks = service.__hooks[type][method];
          assert.strictEqual(hooks.length, 2, `'${service.path}/${type}:${method}': has 2 hooks`);
          assert.strictEqual(hooks[1], "addHook", `'${service.path}/${type}:${method}': last hook is 'addHook'`);
        });
      });
    });
  });

  it("prepends all hooks with 'first'", function() {
    const {
      app,
      usersService,
      tasksService,
      authenticationService
    } = mockApp(true);

    const types = ["before", "after", "error"] as HookType[];
    const methods = ["find", "get", "create", "update", "patch", "remove"] as ServiceMethodName[];

    addHook(app, "addHook", {
      types,
      methods,
      orderByType: {
        before: "first",
        after: "first",
        error: "first"
      }
    });

    [usersService, tasksService, authenticationService].forEach(service => {
      types.forEach(type => {
        methods.forEach(method => {
          const hooks = service.__hooks[type][method];
          assert.strictEqual(hooks.length, 2, `'${service.path}/${type}:${method}' has 2 hooks`);
          assert.strictEqual(hooks[0], "addHook", `'${service.path}/${type}:${method}': first hook is 'addHook'`);
        });
      });
    });
  });

  it("ignores blacklisted", function() {
    const {
      app,
      usersService,
      tasksService,
      authenticationService
    } = mockApp();

    const types = ["before", "after", "error"] as HookType[];
    const methods = ["find", "get", "create", "update", "patch", "remove"] as ServiceMethodName[];

    const blacklist = ["authentication"];

    addHook(app, "addHook", {
      types,
      methods,
      orderByType: {
        before: "first",
        after: "first",
        error: "first"
      },
      blacklist: ["authentication"]
    });

    [usersService, tasksService, authenticationService].forEach(service => {
      types.forEach(type => {
        methods.forEach(method => {
          const hooks = service.__hooks[type][method];
          if (blacklist.includes(service.path)) {
            assert.strictEqual(hooks.length, 0, `'${service.path}/${type}:${method}' has zero hooks`);
          } else {
            assert.strictEqual(hooks.length, 1, `'${service.path}/${type}:${method}' has 1 hook`);
            assert.strictEqual(hooks[0], "addHook", "hook is 'addHook'");
          }
        });
      });
    });
  });

  it("only sets whitelist", function() {
    const {
      app,
      usersService,
      tasksService,
      authenticationService
    } = mockApp();

    const types = ["before", "after", "error"] as HookType[];
    const methods = ["find", "get", "create", "update", "patch", "remove"] as ServiceMethodName[];

    const whitelist = ["users"];

    addHook(app, "addHook", {
      types,
      methods,
      orderByType: {
        before: "first",
        after: "first",
        error: "first"
      },
      whitelist
    });

    [usersService, tasksService, authenticationService].forEach(service => {
      types.forEach(type => {
        methods.forEach(method => {
          const hooks = service.__hooks[type][method];
          if (whitelist.includes(service.path)) {
            assert.strictEqual(hooks.length, 1, `'${service.path}/${type}:${method}' has 1 hook`);
            assert.strictEqual(hooks[0], "addHook", "hook is 'addHook'");
          } else {
            assert.strictEqual(hooks.length, 0, `'${service.path}/${type}:${method}' has zero hooks`);
          }
        });
      });
    });
  });
});