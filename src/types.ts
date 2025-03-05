import type { HookContext } from '@feathersjs/feathers'

export type Predicate<T = any> = (item: T) => boolean

export type PredicateWithContext<T = any> = (
  item: T,
  context: HookContext,
) => boolean
