export interface PushSetOptions {
  unique?: boolean
}
  
export type Path = string|Array<string|number>;
export type HookType = "before"|"after"|"error";
export type ServiceMethodName = "find"|"get"|"create"|"update"|"patch"|"remove";

export type Handle = "target"|"source"|"combine"|"intersect"|"intersectOrFull";

export type ActionOnEmptyIntersect = (target: unknown, source: unknown, prependKey: Path) => void
export interface MergeQueryOptions {
  defaultHandle: Handle,
  actionOnEmptyIntersect: ActionOnEmptyIntersect
  handle?: {
    [key: string]: Handle
  }
}

export interface HookSetDataOptions {
  allowUndefined?: boolean
}

export type FirstLast = "first" | "last";

export interface AddHookOptions {
  types: HookType[],
  methods: ServiceMethodName[],
  orderByType: Record<HookType, FirstLast>
  whitelist?: string[],
  blacklist?: string[],
}