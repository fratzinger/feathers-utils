import assert from "assert";
import feathers from "@feathersjs/feathers";
import { Service } from "feathers-memory";
import { removeRelated } from "../../src";

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

describe("hook - removeRelated", function() {
  it("removes single item for single item", async function() {
    const { app, todosService } = mockApp();

    app.service("users").hooks({
      after: {
        remove: [
          removeRelated({
            service: "todos",
            keyThere: "userId",
            keyHere: "id",
            blocking: true
          })
        ]
      }
    });

    const user = await app.service("users").create({
      name: "John Doe"
    });

    const todo = await todosService.create({
      title: "Buy milk",
      userId: user.id
    });

    await app.service("users").remove(user.id);

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, []);
  });

  it.skip("removes single item for multiple items", async function() {
    
  });

  it.skip("removes multiple items for multiple items", async function() {

  });

  it.skip("does not remove items if not found", async function() {
  });
});