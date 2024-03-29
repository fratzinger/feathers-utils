import type { Application } from "@feathersjs/feathers/lib";
import { DebouncedStore } from "./DebouncedStore";
import type { DebouncedStoreOptions, InitDebounceMixinOptions } from "./types";
import { makeDefaultOptions } from "./utils";

export function debounceMixin(
  options?: Partial<InitDebounceMixinOptions>,
): (app: Application) => void {
  return (app: Application): void => {
    options = options || {};
    const defaultOptions = Object.assign(
      makeDefaultOptions(),
      options?.default,
    );

    app.mixins.push((service: any, path) => {
      // if path is on blacklist, don't add debouncedStore to service
      if (options?.blacklist && options.blacklist.includes(path)) return;
      // if service already has registered something on `debouncedStore`
      if (service.debouncedStore) {
        console.warn(
          `[feathers-utils] service: '${path}' already has a property 'debouncedStore'. Mixin will skip creating a new debouncedStore`,
        );
        return;
      }

      const serviceOptions = Object.assign({}, defaultOptions, options?.[path]);
      service.debouncedStore = new DebouncedStore(
        app,
        serviceOptions as DebouncedStoreOptions,
      );
    });
  };
}
