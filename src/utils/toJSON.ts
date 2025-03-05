import type { HookContext } from '@feathersjs/feathers'

export const toJSON = (context: HookContext) => {
  if (context.toJSON) {
    return context.toJSON()
  }
  return context
}
