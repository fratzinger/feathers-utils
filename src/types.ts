import type { Application, HookContext, Service } from "@feathersjs/feathers";

export type Path = Array<string|number>;
export type MaybeArray<T> = T | T[]
export type Promisable<T> = T | Promise<T>

export type HookType = "before" | "after" | "error";
export type ServiceMethodName = "find" | "get" | "create" | "update" | "patch" | "remove";
export type ReturnSyncHook = (context: HookContext) => HookContext
export type ReturnAsyncHook = (context: HookContext) => Promise<HookContext>

export type Handle = "target" | "source" | "combine" | "intersect"| "intersectOrFull";
export type FirstLast = "first" | "last";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Predicate<T = any> = (item: T) => boolean
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PredicateWithContext<T = any> = (item: T, context: HookContext) => boolean

//#region hooks

export interface HookSetDataOptions {
  allowUndefined?: boolean
  overwrite?: boolean | PredicateWithContext
}

export interface AddHookOptions {
  types: HookType[],
  methods: ServiceMethodName[],
  orderByType: Record<HookType, FirstLast>
  whitelist?: string[],
  blacklist?: string[],
}

export interface HookRunPerItemOptions {
  wait?: boolean
}

export interface RemoveRelatedOptions<S = Record<string, any>> {
  service: keyof S
  keyThere: string
  keyHere: string
  blocking?: boolean
}

export interface CreateRelatedOptions<S = Record<string, any>> {
  service: keyof S
  multi?: boolean
  data: (item: any, context: HookContext) => Promisable<Record<string, any>>
  createItemsInDataArraySeparately?: boolean
}

export type OnDeleteAction = "cascade" | "set null";

export interface OnDeleteOptions {
    keyThere: string
    keyHere: string
    onDelete: OnDeleteAction
    blocking?: boolean
}

//#endregion

//#region mixins

export interface InitDebounceMixinOptions {
  default: Partial<DebouncedStoreOptions>
  blacklist: string[]
  [key: string]: unknown
}

export type DebouncedFunctionApp = (app?: Application) => void | Promise<void>;

export interface DebouncedStoreOptions {
  leading: boolean
  maxWait: number | undefined
  trailing: boolean
  wait: number
}

/*interface WaitingObject {
    id: Id,
    action: FunctionApp
}*/

//#endregion

//#region utils
export interface PushSetOptions {
  unique?: boolean
}

export type ActionOnEmptyIntersect = (target: unknown, source: unknown, prependKey: Path) => void

export interface MergeQueryOptions<T> extends FilterQueryOptions<T> {
  defaultHandle: Handle,
  actionOnEmptyIntersect: ActionOnEmptyIntersect
  useLogicalConjunction: boolean
  handle?: {
    [key: string]: Handle
  }
}

export interface FilterQueryOptions<T> {
  service?: Service<T>
  operators?: string[],
  filters?: string[],
}

export interface PlainFilterQueryOptions {
  operators?: string[],
  filters?: string[],
}

export interface FilterQueryResult {
  filters: Record<string, unknown>
  query: Record<string, unknown>
  paginate?: unknown
  [key: string]: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GetItemsIsArrayResult<T = any> {
  items: T[]
  isArray: boolean
}

//#endregion