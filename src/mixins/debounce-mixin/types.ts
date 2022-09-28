import type { Application } from "@feathersjs/feathers";

export interface InitDebounceMixinOptions {
  default: Partial<DebouncedStoreOptions>;
  blacklist: string[];
  [key: string]: unknown;
}

export type DebouncedFunctionApp = (app?: Application) => void | Promise<void>;

export interface DebouncedStoreOptions {
  leading: boolean;
  maxWait: number | undefined;
  trailing: boolean;
  wait: number;
}
