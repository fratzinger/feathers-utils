import type { Id, Params } from "@feathersjs/feathers";
import { deepEqual } from "fast-equals";

export type OptimizeBatchPatchOptions = {
  id?: string;
};

export type OptimizeBatchPatchResultItem<
  T = Record<string, unknown>,
  P = Params,
> = [Id, T, P | undefined];

export function optimizeBatchPatch<
  T extends Record<string, unknown>,
  P extends Params,
>(
  items: Map<Id, T>,
  options?: OptimizeBatchPatchOptions,
): OptimizeBatchPatchResultItem<T, P>[] {
  const map: { ids: Id[]; data: T }[] = [];

  const id = options?.id ?? "id";

  for (const [id, data] of items) {
    const index = map.findIndex((item) => deepEqual(item.data, data));

    if (index === -1) {
      map.push({ ids: [id], data });
    } else {
      map[index].ids.push(id);
    }
  }

  return map.map(({ ids, data }) => {
    return ids.length === 1
      ? ([ids[0], data, undefined] as OptimizeBatchPatchResultItem<T, P>)
      : ([
          null,
          data,
          {
            query: {
              [id]: { $in: ids },
            },
          },
        ] as OptimizeBatchPatchResultItem<T, P>);
  });
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("optimizeBatchPatch", () => {
    const items = new Map<Id, Record<string, unknown>>([
      ["1", { name: "John" }],
      ["2", { name: "Jane" }],
      ["3", { name: "John" }],
      ["4", { name: "Jane" }],
      [5, { name: "Jack" }],
    ]);

    expect(optimizeBatchPatch(items)).toEqual([
      [null, { name: "John" }, { query: { id: { $in: ["1", "3"] } } }],
      [null, { name: "Jane" }, { query: { id: { $in: ["2", "4"] } } }],
      [5, { name: "Jack" }, undefined],
    ]);
  });
}
