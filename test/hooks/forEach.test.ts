import assert from "assert";
import { feathers } from "@feathersjs/feathers";
import { MemoryService } from "@feathersjs/memory";
import { forEach } from "../../src";

const mockApp = () => {
  const app = feathers();

  app.use("users", new MemoryService({ startId: 1, multi: true }));
  app.use("todos", new MemoryService({ startId: 1, multi: true }));

  const usersService = app.service("users");
  const todosService = app.service("todos");

  return {
    app,
    todosService,
    usersService,
  };
};

describe("hook - forEach", function () {
  it("runs for one item", async function () {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
      after: {
        create: [
          forEach((item) => {
            return todosService.create({
              title: "First issue",
              userId: item.id,
            });
          }),
        ],
      },
    });

    const user = await usersService.create({
      name: "John Doe",
    });

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [{ id: 1, title: "First issue", userId: 1 }]);
  });

  it("can skip hook", async function () {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
      after: {
        create: [
          forEach((item) => {
            return todosService.create({
              title: "First issue",
              userId: item.id,
            });
          }),
        ],
      },
    });

    const user = await usersService.create(
      {
        name: "John Doe",
      },
      { skipHooks: ["forEach"] } as any,
    );

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, []);
  });

  it("can skip hook with skip option", async function () {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
      after: {
        create: [
          forEach(
            (item) => {
              return todosService.create({
                title: "First issue",
                userId: item.id,
              });
            },
            {
              skip: (context) => true,
            },
          ),
        ],
      },
    });

    const user = await usersService.create({
      name: "John Doe",
    });

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, []);
  });

  it("runs for multiple items", async function () {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
      after: {
        create: [
          forEach((item) => {
            return todosService.create({
              title: "First issue",
              userId: item.id,
            });
          }),
        ],
      },
    });

    const user = await usersService.create([
      { name: "John Doe" },
      { name: "Jane Doe" },
    ]);

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [
      { id: 1, title: "First issue", userId: 1 },
      { id: 2, title: "First issue", userId: 2 },
    ]);
  });

  it("runs with forAll", async function () {
    const { app, usersService, todosService } = mockApp();

    usersService.hooks({
      after: {
        create: [
          forEach(
            (item, { fromAll }) => {
              expect(fromAll).toStrictEqual("test");
              return todosService.create({
                title: "First issue",
                userId: item.id,
              });
            },
            {
              forAll: async () => "test" as const,
            },
          ),
        ],
      },
    });

    const user = await usersService.create([
      { name: "John Doe" },
      { name: "Jane Doe" },
    ]);

    const todos = await todosService.find({ query: {} });

    assert.deepStrictEqual(todos, [
      { id: 1, title: "First issue", userId: 1 },
      { id: 2, title: "First issue", userId: 2 },
    ]);
  });
});
