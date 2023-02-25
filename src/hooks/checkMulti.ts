import { MethodNotAllowed } from "@feathersjs/errors";
import { shouldSkip, isMulti } from "../utils";

import type { HookContext } from "@feathersjs/feathers";

/**
 * hook to check if context is multi patch/remove and if the service allows it
 */
export function checkMulti<H extends HookContext = HookContext>() {
  return (context: H) => {
    if (shouldSkip("checkMulti", context)) {
      return context;
    }

    const { service, method } = context;
    if (!service.allowsMulti || !isMulti(context) || method === "find") {
      return context;
    }

    if (!service.allowsMulti(method)) {
      throw new MethodNotAllowed(`Can not ${method} multiple entries`);
    }

    return context;
  };
}
