import assert from 'node:assert'
import { feathers } from '@feathersjs/feathers'
import { MemoryService } from '@feathersjs/memory'
import { runPerItem } from '../../src/index.js'

const mockApp = () => {
  const app = feathers()

  app.use('users', new MemoryService({ startId: 1, multi: true }))
  app.use('todos', new MemoryService({ startId: 1, multi: true }))

  const usersService = app.service('users')
  const todosService = app.service('todos')

  return {
    app,
    todosService,
    usersService,
  }
}

describe('hook - runPerItem', function () {
  it('runs for one item', async function () {
    const { usersService, todosService } = mockApp()

    usersService.hooks({
      after: {
        create: [
          runPerItem((item) => {
            return todosService.create({
              title: 'First issue',
              userId: item.id,
            })
          }),
        ],
      },
    })

    await usersService.create({
      name: 'John Doe',
    })

    const todos = await todosService.find({ query: {} })

    assert.deepStrictEqual(todos, [{ id: 1, title: 'First issue', userId: 1 }])
  })

  it('can skip hook', async function () {
    const { usersService, todosService } = mockApp()

    usersService.hooks({
      after: {
        create: [
          runPerItem((item) => {
            return todosService.create({
              title: 'First issue',
              userId: item.id,
            })
          }),
        ],
      },
    })

    // @ts-expect-error - params don't support skipHooks
    await usersService.create(
      {
        name: 'John Doe',
      },
      { skipHooks: ['runForItems'] },
    )

    const todos = await todosService.find({ query: {} })

    assert.deepStrictEqual(todos, [])
  })

  it('runs for multiple items', async function () {
    const { usersService, todosService } = mockApp()

    usersService.hooks({
      after: {
        create: [
          runPerItem((item) => {
            return todosService.create({
              title: 'First issue',
              userId: item.id,
            })
          }),
        ],
      },
    })

    await usersService.create([{ name: 'John Doe' }, { name: 'Jane Doe' }])

    const todos = await todosService.find({ query: {} })

    assert.deepStrictEqual(todos, [
      { id: 1, title: 'First issue', userId: 1 },
      { id: 2, title: 'First issue', userId: 2 },
    ])
  })
})
