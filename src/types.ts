export interface PushSetOptions {
  unique?: boolean
}
  
export type Path = string|Array<string|number>;

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