import type { HookContext } from "@feathersjs/feathers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Predicate<T = any> = (item: T) => boolean;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PredicateWithContext<T = any> = (
  item: T,
  context: HookContext,
) => boolean;
