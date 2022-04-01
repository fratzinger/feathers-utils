import assert from "assert";
import feathers from "@feathersjs/feathers";
import { Service } from "feathers-memory";
import { createRelated } from "../../src";

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

describe("hook - createRelated", function() {
  it("creates single item for single item", async function() {
    const { app, todosService } = mockApp();

    app.service("users").hooks({
      after: {
        create: [
          createRelated({
            service: "todos",
            data: (item, context) => ({
              title: "First issue",
              userId: item.id
            })
          })
        ]
      }
    });

    const user = await app.service("users").create({
      name: "John Doe"
    });

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [{ id: 1, title: "First issue", userId: 1 }]);
  });

  it.skip("creates multiple items for multiple items", async function() {

  });

  it.skip("does not create items if falsey", async function() {
  });
});