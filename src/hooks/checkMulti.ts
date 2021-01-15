import { MethodNotAllowed } from "@feathersjs/errors";
import shouldSkip from "../shouldSkip";
import isMulti from "../isMulti";
import { HookContext } from "@feathersjs/feathers";

export default (): ((context: HookContext) => HookContext) => {
  return (context: HookContext): HookContext => {
    if (shouldSkip("checkMulti", context)) { return context; }
    const { service, method } = context;
    if (!service.allowsMulti || !isMulti(context) || method === "find") { return context; }

    if (!service.allowsMulti(method)) {
      throw new MethodNotAllowed(`Can not ${method} multiple entries`);
    }

    return context;
  };
};
