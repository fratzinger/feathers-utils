import type { Application } from "@feathersjs/feathers";

type Single<T> = T extends Array<infer U> ? U : T;

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

export type InferCreateResult<S> = S extends {
  create: (data: any, params: any) => infer R;
}
  ? Awaited<R>
  : never;

export type InferCreateResultSingle<S> = Single<InferCreateResult<S>>;

export type InferUpdateResult<S> = S extends {
  update: (id: any, data: any, params: any) => infer R;
}
  ? Awaited<R>
  : never;

export type InferPatchResult<S, Id = any> = S extends {
  patch: (id: Id, data: any, params: any) => infer R;
}
  ? Awaited<R>
  : never;

export type InferRemoveResult<S, Id = any> = S extends {
  remove: (id: Id, params: any) => infer R;
}
  ? Awaited<R>
  : never;

export type GetService<App extends Application, Path extends string> = App["services"][Path];

export type InferGetResultFromPath<App extends Application, Path extends string> = InferGetResult<GetService<App, Path>>;
export type InferFindResultFromPath<App extends Application, Path extends string> = InferFindResult<GetService<App, Path>>;

export type InferCreateDataFromPath<App extends Application, Path extends string> = InferCreateData<GetService<App, Path>>
export type InferCreateDataSingleFromPath<App extends Application, Path extends string> = InferCreateDataSingle<GetService<App, Path>>;
export type InferCreateResultFromPath<App extends Application, Path extends string> = InferCreateResult<GetService<App, Path>>;
export type InferCreateResultSingleFromPath<App extends Application, Path extends string> = InferCreateResultSingle<GetService<App, Path>>;

export type InferUpdateDataFromPath<App extends Application, Path extends string> = InferUpdateData<GetService<App, Path>>
export type InferPatchDataFromPath<App extends Application, Path extends string> = InferPatchData<GetService<App, Path>>

export type InferUpdateResultFromPath<App extends Application, Path extends string> = InferUpdateResult<GetService<App, Path>>;
export type InferPatchResultFromPath<App extends Application, Path extends string, Id = any> = InferPatchResult<GetService<App, Path>, Id>;

export type InferRemoveResultFromPath<App extends Application, Path extends string, Id = any> = InferRemoveResult<GetService<App, Path>, Id>;
