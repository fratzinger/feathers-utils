export interface PushSetOptions {
  unique?: boolean
}
  
export type Path = string|Array<string|number>;
export type HookType = "before"|"after"|"error";
export type ServiceMethodName = "find"|"get"|"create"|"update"|"patch"|"remove";

export type Handle = "target"|"source"|"combine"|"intersect"|"intersectOrFull"
export interface MergeQueryOptions {
  defaultHandle?: Handle,
  actionOnEmptyIntersect?(): void
  handle?: {
    [key: string]: Handle
  }
}

export interface HookSetDataOptions {
  allowUndefined?: boolean
}

export interface AddHookOptions {
  types: HookType[],
  methods: ServiceMethodName[],
  orderByType: Record<HookType, "first" | "last">
  whitelist?: string[],
  blacklist?: string[],
}