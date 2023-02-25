// here are types that are not meant to be exported!
// just for internal use of this package

export type MaybeArray<T> = T | T[];
export type Promisable<T> = T | Promise<T>;
export type Path = Array<string | number>;
