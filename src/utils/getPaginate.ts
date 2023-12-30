import type { PaginationOptions } from "@feathersjs/adapter-commons";
import type { HookContext } from "@feathersjs/feathers";
import { hasOwnProperty } from "./_utils.internal";

/**
 * util to get paginate options from context
 * 1. it uses `context.params.paginate` if it exists
 * 2. it uses `service.options.paginate` if it exists
 * 3. it uses `context.params.adapter` if it exists
 */
export const getPaginate = <H extends HookContext = HookContext>(
  context: H,
): PaginationOptions | undefined => {
  if (hasOwnProperty(context.params, "paginate")) {
    return (context.params.paginate as PaginationOptions) || undefined;
  }

  if (context.params.paginate === false) {
    return undefined;
  }
  let options = context.service?.options || {};

  options = {
    ...options,
    ...context.params.adapter,
  };

  return options.paginate || undefined;
};

if (import.meta.vitest) {
  const { it, assert } = import.meta.vitest;

  it("returns service.options.paginate", function () {
    const serviceOptions = {
      paginate: {
        default: 10,
        max: 50,
      },
    };

    const paginate = getPaginate({
      params: {},
      service: {
        options: serviceOptions,
      },
    } as any as HookContext);

    assert.deepStrictEqual(paginate, { default: 10, max: 50 });
  });

  it("returns undefined for params.paginate: false", function () {
    const serviceOptions = {
      paginate: {
        default: 10,
        max: 50,
      },
    };

    const paginate = getPaginate({
      params: { paginate: false },
      service: {
        options: serviceOptions,
      },
    } as any as HookContext);

    assert.deepStrictEqual(paginate, undefined);
  });

  it("returns context.adapter.paginate over service.options.paginate", function () {
    const serviceOptions = {
      paginate: {
        default: 10,
        max: 50,
      },
    };

    const paginate = getPaginate({
      params: { adapter: { paginate: { default: 20, max: 100 } } },
      service: {
        options: serviceOptions,
      },
    } as any as HookContext);

    assert.deepStrictEqual(paginate, { default: 20, max: 100 });
  });

  it("returns undefined for no paginate", function () {
    const serviceOptions = {
      paginate: false,
    };

    const paginate = getPaginate({
      params: {},
      service: {
        options: serviceOptions,
      },
    } as any as HookContext);

    assert.deepStrictEqual(paginate, undefined);
  });
}
