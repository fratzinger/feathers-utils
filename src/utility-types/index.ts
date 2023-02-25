import type { Application, Id } from "@feathersjs/feathers";

type Single<T> = T extends Array<infer U> ? U : T;
type AsArray<T> = T extends any[] ? T : [T];

export type InferCreateData<S> = S extends {
  create: (data: infer D, params: any) => any;
}
  ? D
  : never;

export type InferCreateDataSingle<S> = Single<InferCreateData<S>>;

export type InferUpdateData<S> = S extends {
  update: (id: any, data: infer D, params: any) => any;
}
  ? D
  : never;

export type InferPatchData<S> = S extends {
  patch: (id: any, data: infer D, params: any) => any;
}
  ? D
  : never;

export type InferGetResult<S> = S extends {
  get: (id: any, params: any) => infer R;
}
  ? Awaited<R>
  : never;

export type InferFindResult<S> = S extends {
  find: (params: any) => infer R;
}
  ? Awaited<R>
  : never;

export type InferCreateResult<S, D = unknown> = S extends {
  create: (data: any, params: any) => infer R;
}
  ? D extends any[]
    ? AsArray<Awaited<R>>
    : D extends InferCreateDataSingle<S>
      ? Single<Awaited<R>>
      : Awaited<R>
  : never;

export type InferCreateResultSingle<S> = Single<InferCreateResult<S>>;

export type InferUpdateResult<S> = S extends {
  update: (id: any, data: any, params: any) => infer R;
}
  ? Awaited<R>
  : never;

export type InferPatchResult<S, IdOrNullable = any> = S extends {
  patch: (id: Id, data: any, params: any) => infer R;
}
  ? IdOrNullable extends Id
    ? Single<Awaited<R>>
    : IdOrNullable extends null
      ? AsArray<Awaited<R>>
      : Awaited<R>
  : never;

export type InferRemoveResult<S, IdOrNullable = any> = S extends {
  remove: (id: IdOrNullable, params: any) => infer R;
}
  ? IdOrNullable extends Id
    ? Single<Awaited<R>>
    : IdOrNullable extends null
      ? AsArray<Awaited<R>>
      : Awaited<R>
  : never;

export type GetService<App extends Application, Path extends string> = App["services"][Path];

export type InferGetResultFromPath<App extends Application, Path extends string> = InferGetResult<GetService<App, Path>>;
export type InferFindResultFromPath<App extends Application, Path extends string> = InferFindResult<GetService<App, Path>>;

export type InferCreateDataFromPath<App extends Application, Path extends string> = InferCreateData<GetService<App, Path>>
export type InferCreateDataSingleFromPath<App extends Application, Path extends string> = InferCreateDataSingle<GetService<App, Path>>;

export type InferCreateResultFromPath<App extends Application, Path extends string, D = unknown> = InferCreateResult<GetService<App, Path>, D>;
export type InferCreateResultSingleFromPath<App extends Application, Path extends string> = InferCreateResultSingle<GetService<App, Path>>;

export type InferUpdateDataFromPath<App extends Application, Path extends string> = InferUpdateData<GetService<App, Path>>
export type InferPatchDataFromPath<App extends Application, Path extends string> = InferPatchData<GetService<App, Path>>

export type InferUpdateResultFromPath<App extends Application, Path extends string> = InferUpdateResult<GetService<App, Path>>;
export type InferPatchResultFromPath<App extends Application, Path extends string, IdOrNullable = any> = InferPatchResult<GetService<App, Path>, IdOrNullable>;

export type InferRemoveResultFromPath<App extends Application, Path extends string, IdOrNullable = any> = InferRemoveResult<GetService<App, Path>, IdOrNullable>;

export type InferDataFromPath<App extends Application, Path extends string, Method extends "create" | "update" | "patch"> = Method extends "create"
  ? InferCreateDataFromPath<App, Path>
  : Method extends "update"
    ? InferUpdateDataFromPath<App, Path>
    : Method extends "patch"
      ? InferPatchDataFromPath<App, Path>
      : never;

export type InferResultFromPath<App extends Application, Path extends string, Method extends "get" | "find" | "create" | "update" | "patch" | "remove"> = Method extends "get"
  ? InferGetResultFromPath<App, Path>
  : Method extends "find"
    ? InferFindResultFromPath<App, Path>
    : Method extends "create"
      ? InferCreateResultFromPath<App, Path>
      : Method extends "update"
        ? InferUpdateResultFromPath<App, Path>
        : Method extends "patch"
          ? InferPatchResultFromPath<App, Path>
          : Method extends "remove"
            ? InferRemoveResultFromPath<App, Path>
            : never;
            