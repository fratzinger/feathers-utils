import type { DebouncedStoreOptions } from "./types";

export const makeDefaultOptions = (): DebouncedStoreOptions => {
  return {
    leading: false,
    maxWait: undefined,
    trailing: true,
    wait: 100,
  };
};
