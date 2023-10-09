// here are types that are not meant to be exported!
// just for internal use of this package

import type { HookContext } from "@feathersjs/feathers/lib";

export type MaybeArray<T> = T | T[];
export type Promisable<T> = T | Promise<T>;
export type Path = Array<string | number>;

export type HookType = "before" | "after" | "error";
export type ServiceMethodName =
  | "find"
  | "get"
  | "create"
  | "update"
  | "patch"
  | "remove";
export type ReturnSyncHook = (context: HookContext) => HookContext;
export type ReturnAsyncHook = (context: HookContext) => Promise<HookContext>;
