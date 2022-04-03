import assert from "assert";
import feathers from "@feathersjs/feathers";
import { Service } from "feathers-memory";
import { runPerItem } from "../../src";

const mockApp = () => {
  const app = feathers();
  
  app.use("users", new Service({ startId: 1, multi: true }));
  app.use("todos", new Service({ startId: 1, multi: true }));
  
  const usersService = app.service("users");
  const todosService = app.service("todos");
  
  return { 
    app,
    todosService,
    usersService
  };
};

describe("hook - runPerItem", function() {
  it("runs for one item", async function() {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
      after: {
        create: [
          runPerItem((item, context) => {
            return todosService.create({
              title: "First issue",
              userId: item.id
            });
          })
        ]
      }
    });

    const user = await usersService.create({
      name: "John Doe"
    });

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [{ id: 1, title: "First issue", userId: 1 }]);
  });

  it("can skip hook", async function() {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
      after: {
        create: [
          runPerItem((item, context) => {
            return todosService.create({
              title: "First issue",
              userId: item.id
            });
          })
        ]
      }
    });

    const user = await usersService.create({
      name: "John Doe"
    }, { skipHooks: ["runForItems"] });

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, []);
  });

  it("runs for multiple items", async function() {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
      after: {
        create: [
          runPerItem((item, context) => {
            return todosService.create({
              title: "First issue",
              userId: item.id
            });
          })
        ]
      }
    });

    const user = await usersService.create([
      { name: "John Doe" },
      { name: "Jane Doe" }
    ]);

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [
      { id: 1, title: "First issue", userId: 1 },
      { id: 2, title: "First issue", userId: 2 }
    ]);
  });
});