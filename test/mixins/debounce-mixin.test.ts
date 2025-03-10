import assert from 'node:assert'
import { feathers } from '@feathersjs/feathers'
import { MemoryService } from '@feathersjs/memory'
import { debounceMixin as makeMixin } from '../../src/index.js'
import type { DebouncedService } from '../../src/index.js'
import { performance } from 'node:perf_hooks'

const mockApp = () => {
  const app = feathers()
  app.configure(
    makeMixin({
      default: {
        wait: 50,
        maxWait: 1000,
      },
      blacklist: ['authentication'],
    }),
  )
  app.use('users', new MemoryService())
  app.use('tasks', new MemoryService())
  app.use('posts', new MemoryService())

  app.use('authentication', new MemoryService())

  const usersService: DebouncedService<MemoryService> = app.service(
    'users',
  ) as any
  const tasksService: DebouncedService<MemoryService> = app.service(
    'tasks',
  ) as any
  const postsService: DebouncedService<MemoryService> = app.service(
    'posts',
  ) as any
  const authenticationService = app.service('authentication')

  return {
    app,
    usersService,
    tasksService,
    postsService,
    authenticationService,
  }
}

describe('mixin: debounce-mixin', function () {
  it('initializes debounce-mixin', function () {
    const { usersService, tasksService, postsService, authenticationService } =
      mockApp()

    ;[usersService, tasksService, postsService].forEach((service) => {
      assert.ok(service.debouncedStore, 'service has debounceStore')
      assert.strictEqual(
        typeof service.debouncedStore.add,
        'function',
        "service has 'add' function",
      )
    })

    assert.strictEqual(
      // @ts-expect-error - wrong type
      authenticationService.debouncedStore,
      undefined,
      'authentication has no debounced Store',
    )
  })

  it('only gets called once', async function () {
    const { usersService } = mockApp()
    let callCounter = 0
    for (let i = 0; i < 50; i++) {
      usersService.debouncedStore.add(1, () => {
        callCounter++
        return usersService.create({ id: i, test: true })
      })
    }
    await new Promise((resolve) => setTimeout(resolve, 400))
    const items = await usersService.find({ query: {}, paginate: false })
    assert.strictEqual(items.length, 1, 'only has one item')
    assert.strictEqual(items[0].id, 49, 'called with last iteration')
    assert.strictEqual(callCounter, 1, 'only called once')
    assert.deepStrictEqual(
      usersService.debouncedStore._queueById,
      {},
      'queue is empty',
    )

    assert.deepStrictEqual(
      // @tx-expect-error access to private property
      usersService.debouncedStore._isRunningById,
      {},
      'nothing is running',
    )
  })

  it("doesn't call instantly", async function () {
    const { usersService } = mockApp()
    let callCounter = 0
    for (let i = 0; i < 50; i++) {
      usersService.debouncedStore.add(1, () => {
        callCounter++
        return usersService.create({ id: i, test: true })
      })
    }
    const items = await usersService.find({ query: {}, paginate: false })
    assert.strictEqual(items.length, 0, "hasn't any items yet")
    assert.strictEqual(callCounter, 0, 'not called yet')
  })

  it('stores per id', async function () {
    const { usersService } = mockApp()
    const callCounter: Record<string, number> = {}
    const times = 100
    for (let i = 0; i < times; i++) {
      callCounter[i] = 0
      for (let j = 0; j < 50; j++) {
        usersService.debouncedStore.add(i, () => {
          callCounter[i]++
          return usersService.create({ id: i, test: true })
        })
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 400))
    const items = await usersService.find({
      query: { $sort: { id: 1 } },
      paginate: false,
    })
    assert.strictEqual(items.length, times, `has ${times} items`)
    items.forEach((item, i) => {
      assert.strictEqual(item.id, i, 'continuous ids')
      assert.strictEqual(callCounter[i], 1, 'only called once')
    })
  })

  it('waits per id', () =>
    new Promise<void>((done) => {
      const { usersService } = mockApp()
      const callCounter = {
        1: 0,
        2: 0,
      }
      const times = 60
      usersService.debouncedStore.add(1, () => {
        callCounter[1]++
        return usersService.create({ id: 1, test: true })
      })
      let counter = 0
      const started = performance.now()
      const callTwo = () => {
        if (counter > times) {
          assert.ok(performance.now() - started > 200, 'enough time elapsed')
          usersService
            .find({ query: { $sort: { id: 1 } }, paginate: false })
            .then((items) => {
              assert.strictEqual(items.length, 1, 'has just one item yet')
              assert.strictEqual(items[0].id, 1, 'id is one')
              const timeElapsed = performance.now() - started
              assert.ok(timeElapsed > 200, 'enough time elapsed')
              assert.ok(timeElapsed < 1000, 'less than maxWait')
              done()
            })

          return
        }
        setTimeout(() => {
          usersService.debouncedStore.add(2, () => {
            callCounter[2]++
            return usersService.create({ id: 2, test: true })
          })
          counter++
          callTwo()
        }, 5)
      }
      callTwo()
    }))

  it('cancel works', async function () {
    const { usersService } = mockApp()
    let callCounter = 0
    for (let i = 0; i < 50; i++) {
      usersService.debouncedStore.add(1, () => {
        callCounter++
        return usersService.create({ id: i, test: true })
      })
    }
    usersService.debouncedStore.cancel(1)
    await new Promise((resolve) => setTimeout(resolve, 400))
    const items = await usersService.find({ query: {}, paginate: false })
    assert.strictEqual(items.length, 0, "hasn't items")
    assert.strictEqual(callCounter, 0, 'not called once')
  })
})
