import type { Application, HookOptions } from '@feathersjs/feathers'

export function defineHooks<
  A extends Application = Application,
  S = {
    find: any
    get: any
    create: any
    update: any
    patch: any
    remove: any
  },
  Options = HookOptions<A, S>,
>(hooks: Options): Options {
  return hooks
}
