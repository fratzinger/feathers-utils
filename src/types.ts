import { Application, Service } from "@feathersjs/feathers";

export type Path = string|Array<string|number>;
export type HookType = "before"|"after"|"error";
export type ServiceMethodName = "find"|"get"|"create"|"update"|"patch"|"remove";

export type Handle = "target"|"source"|"combine"|"intersect"|"intersectOrFull";
export type FirstLast = "first" | "last";

//#region hooks

export interface HookSetDataOptions {
  allowUndefined?: boolean
}

export interface AddHookOptions {
  types: HookType[],
  methods: ServiceMethodName[],
  orderByType: Record<HookType, FirstLast>
  whitelist?: string[],
  blacklist?: string[],
}

//#endregion

//#region mixins

export type MixinDebounceFunctionApp = (app?: Application) => void | Promise<void>;

export interface MixinDebounceOptions {
    leading: boolean,
    maxWait: number | undefined
    trailing: boolean
}

export interface MixinDebounceStoreOptions extends MixinDebounceOptions {
  idField: string,
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
export interface MergeQueryOptions<T> {
  defaultHandle: Handle,
  actionOnEmptyIntersect: ActionOnEmptyIntersect
  service?: Service<T>
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

//#endregion