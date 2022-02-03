import type { Application } from "@feathersjs/feathers";
import type { AddHookOptions, HookType } from "../types";

const defaultOptions = (): Partial<AddHookOptions> => {
  return {
    whitelist: ["*"],
    blacklist: []
  };
};

export const addHook = (
  app: Application, 
  hook: unknown, 
  options: AddHookOptions
): void => {
  options = Object.assign(defaultOptions(), options);

  const {
    types,
    methods,
    whitelist,
    blacklist,
    orderByType
  } = options;

  if (types.some(
    x => !(Object.keys(orderByType).includes(x)))
  ) {
    throw new Error("'feathers-utils/addHook': some types in 'orderByType' are undefined");
  }
  if (
    (Object.keys(orderByType) as HookType[]).some(
      type => !((["first", "last"]).includes(orderByType[type])))
  ) {
    throw new Error("'feathers-utils/addHook': only allowed values for 'orderByType' are 'first' or 'last'");
  }

  const allServices = app.services;

  for (const servicePath in allServices) {
    if(!Object.prototype.hasOwnProperty.call(allServices, servicePath)) { continue; }
    const service = app.service(servicePath);
    if (blacklist && blacklist.includes(servicePath)) { continue; }
    if (whitelist && !whitelist.includes("*") && !whitelist.includes(servicePath)) { continue; }
    types.forEach(type => {
      const order = orderByType[type];
      const unshiftOrPush = (order === "first") ? "unshift" : "push";
      methods.forEach(method => {
        service.__hooks[type][method][unshiftOrPush](hook);
      });
    });
  }
};