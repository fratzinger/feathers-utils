import type { HookContext } from "@feathersjs/feathers";
import assert from "assert";
import { isPaginated } from "../../src";

describe("util - isPaginated", function() {
  it("returns true for service.options.paginate", function() {
    const serviceOptions = {
      paginate: {
        default: 10,
        max: 50
      }
    };

    const paginate = isPaginated({
      params: {},
      service: {
        options: serviceOptions
      }
    } as any as HookContext);

    assert.deepStrictEqual(paginate, true);
  });

  it("returns false for params.paginate: false", function() {
    const serviceOptions = {
      paginate: {
        default: 10,
        max: 50
      }
    };

    const paginate = isPaginated({
      params: { paginate: false },
      service: {
        options: serviceOptions
      }
    } as any as HookContext);

    assert.deepStrictEqual(paginate, false);
  });

  it("returns true for context.adapter.paginate", function() {
    const serviceOptions = {
      paginate: false
    };

    const paginate = isPaginated({
      params: { adapter: { paginate: { default: 20, max: 100 } } },
      service: {
        options: serviceOptions
      }
    } as any as HookContext);

    assert.deepStrictEqual(paginate, true);
  });

  it("returns false for no paginate", function() {
    const serviceOptions = {
      paginate: false
    };

    const paginate = isPaginated({
      params: {},
      service: {
        options: serviceOptions
      }
    } as any as HookContext);

    assert.deepStrictEqual(paginate, false);
  });
});