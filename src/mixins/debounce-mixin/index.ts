import { Application } from "@feathersjs/feathers";

import DebouncedStore, {
  makeDefaultOptions
} from "./DebouncedStore";

import {
  MixinDebounceStoreOptions,
} from "../../types";

interface InitDebounceMixinOptions {
  default: Partial<MixinDebounceStoreOptions>
  blacklist: string[]
  [key: string]: unknown
}

export default function initDebounceMixin(options?: Partial<InitDebounceMixinOptions>): ((app: Application) => void) {
  return (app: Application): void => {
    if (!options?.default?.idField) {
      throw new Error("'feathers-utils:debounce-mixin': options.default.idField need to be provided");
    }
    const defaultOptions = Object.assign(makeDefaultOptions(), options?.default);
    app.mixins.push((service, path) => {
      if ((options.blacklist as string[])?.includes(path)) return;
      const serviceOptions = Object.assign({}, defaultOptions, options?.[path]);
      service.debouncedStore = new DebouncedStore(app, serviceOptions as MixinDebounceStoreOptions);
    });
  };
}

export { DebouncedStore };