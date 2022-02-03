import {
  DebouncedStore,
  makeDefaultOptions
} from "./DebouncedStore";

import type { Application } from "@feathersjs/feathers";

import type {
  InitDebounceMixinOptions,
  DebouncedStoreOptions,
} from "../../types";

export function debounceMixin(
  options?: Partial<InitDebounceMixinOptions>
): ((app: Application) => void) {
  return (app: Application): void => {
    options = options || {};
    const defaultOptions = Object.assign(makeDefaultOptions(), options?.default);
    app.mixins.push((service, path) => {
      // if path is on blacklist, don't add debouncedStore to service
      if (options?.blacklist && options.blacklist.includes(path)) return;
      // if service already has registered something on `debouncedStore`
      if (service.debouncedStore) {
        console.warn(`[feathers-utils] service: '${path}' already has a property 'debouncedStore'. Mixin will skip creating a new debouncedStore`);
        return;
      }

      const serviceOptions = Object.assign({}, defaultOptions, options?.[path]);
      service.debouncedStore = new DebouncedStore(app, serviceOptions as DebouncedStoreOptions);
    });
  };
}

export { DebouncedStore };