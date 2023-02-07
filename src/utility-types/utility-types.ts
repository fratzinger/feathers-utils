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
