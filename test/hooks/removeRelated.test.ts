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
  it("throws for undefined options", function() {
    // @ts-expect-error - missing service
    assert.throws(() => createRelated({
      keyThere: "userId",
      keyHere: "id"
    }));

    // @ts-expect-error - missing keyThere
    assert.throws(() => createRelated({
      service: "todos",
      keyHere: "id"
    }));
  });

  it("removes single item for single item", async function() {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
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

    const user = await usersService.create({
      name: "John Doe"
    });

    const todo = await todosService.create({
      title: "Buy milk",
      userId: user.id
    });

    const todo2 = await todosService.create({
      title: "Buy eggs",
      userId: 2
    });

    await usersService.remove(user.id);

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [{ id: 2, title: "Buy eggs", userId: 2 }]);
  });

  it("removes multiple items for single item", async function() {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
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

    const user = await usersService.create({
      name: "John Doe"
    });

    const todo = await todosService.create({
      title: "Buy milk",
      userId: user.id
    });

    const todo2 = await todosService.create({
      title: "Buy eggs",
      userId: user.id
    });

    const todo3 = await todosService.create({
      title: "Buy bread",
      userId: 3
    });

    await usersService.remove(user.id);

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [{ id: 3, title: "Buy bread", userId: 3 }]);
  });

  it("removes single item for multiple items", async function() {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
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

    await usersService.create([
      { name: "John Doe" },
      { name: "Jane Doe" },
      { name: "Jack Doe" }
    ]);

    const todo = await todosService.create({
      title: "Buy milk",
      userId: 1
    });

    const todo2 = await todosService.create({
      title: "Buy eggs",
      userId: 2
    });

    const todo3 = await todosService.create({
      title: "Buy bread",
      userId: 3
    });

    await usersService.remove(1);

    const users = await usersService.find({ query: {} });

    assert.deepStrictEqual(users, [
      { id: 2, name: "Jane Doe" },
      { id: 3, name: "Jack Doe" }
    ]);

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [
      { id: 2, title: "Buy eggs", userId: 2 },
      { id: 3, title: "Buy bread", userId: 3 }
    ]);
  });

  it("removes multiple items for multiple items", async function() {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
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

    await usersService.create([
      { name: "John Doe" },
      { name: "Jane Doe" },
      { name: "Jack Doe" }
    ]);

    const todo = await todosService.create({
      title: "Buy milk",
      userId: 1
    });

    const todo2 = await todosService.create({
      title: "Buy eggs",
      userId: 2
    });

    const todo3 = await todosService.create({
      title: "Buy bread",
      userId: 3
    });

    await usersService.remove(null, { query: { id: { $in: [1, 2] } } });

    const users = await usersService.find({ query: {} });

    assert.deepStrictEqual(users, [{ id: 3, name: "Jack Doe" }]);

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [{ id: 3, title: "Buy bread", userId: 3 }]);
  });

  it("does not remove items if not found", async function() {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
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

    await usersService.create([
      { name: "John Doe" },
      { name: "Jane Doe" },
      { name: "Jack Doe" }
    ]);

    const todo = await todosService.create({
      title: "Buy milk",
      userId: 2
    });

    const todo2 = await todosService.create({
      title: "Buy eggs",
      userId: 2
    });

    const todo3 = await todosService.create({
      title: "Buy bread",
      userId: 3
    });

    await usersService.remove(1);

    const users = await usersService.find({ query: {} });

    assert.deepStrictEqual(users, [
      { id: 2, name: "Jane Doe" },
      { id: 3, name: "Jack Doe" }
    ]);

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [
      { id: 1, title: "Buy milk", userId: 2 },
      { id: 2, title: "Buy eggs", userId: 2 },
      { id: 3, title: "Buy bread", userId: 3 }
    ]);
  });
});