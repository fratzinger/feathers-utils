// Kudos to @DaddyWarbucks! This is a cheeky copy of his awesome library: 'feathers-fletching'.
// Definitely check it out! https://daddywarbucks.github.io/feathers-fletching/overview.html

import { GeneralError } from "@feathersjs/errors";

import type { HookContext } from "@feathersjs/feathers";

export type ShouldSkipOptions = {
  notSkippable?: boolean;
};

/**
 * util to detect if a hook should be skipped
 */
export const shouldSkip = <
  H extends HookContext = HookContext,
  O extends ShouldSkipOptions = ShouldSkipOptions
>(
  hookName: string,
  context: H,
  options?: O
): boolean => {
  if (!context.params || !context.params.skipHooks || options?.notSkippable) {
    return false;
  }

  const { skipHooks } = context.params;
  if (!Array.isArray(skipHooks)) {
    throw new GeneralError("The `skipHooks` param must be an Array of Strings");
  }
  const { type } = context;
  if (skipHooks.includes(hookName)) {
    return true;
  }
  if (skipHooks.includes("all")) {
    return true;
  }
  if (type === "before") {
    return (
      skipHooks.includes(`before:${hookName}`) || skipHooks.includes("before")
    );
  }
  if (type === "after") {
    return (
      skipHooks.includes(`after:${hookName}`) || skipHooks.includes("after")
    );
  }
  if (type === "error") {
    return (
      skipHooks.includes(`error:${hookName}`) || skipHooks.includes("error")
    );
  }

  return false;
};
