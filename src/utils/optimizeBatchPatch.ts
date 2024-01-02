import type { Id, Params } from "@feathersjs/feathers";
import { deepEqual } from "fast-equals";
import type { KeyOf } from "../typesInternal";

export type OptimizeBatchPatchOptions<IdKey extends string> = {
  /** the key of the id property */
  id?: IdKey;
};

export type OptimizeBatchPatchResultItem<
  T = Record<string, unknown>,
  P = Params,
> = [Id, T, P | undefined];

export function optimizeBatchPatch<
  T extends Record<string, any>,
  IdKey extends KeyOf<T>,
  P extends Params,
  R extends Omit<T, IdKey> = Omit<T, IdKey>,
>(
  items: T[],
  options?: OptimizeBatchPatchOptions<IdKey>,
): OptimizeBatchPatchResultItem<R, P>[] {
  const map: { ids: Id[]; data: R }[] = [];

  const idKey = options?.id ?? "id";

  for (const _data of items) {
    const data = _data as unknown as R;
    const id = _data[idKey];
    delete data[idKey as any];

    const index = map.findIndex((item) => {
      return deepEqual(item.data, data);
    });

    if (index === -1) {
      map.push({ ids: [id], data });
    } else {
      map[index].ids.push(id);
    }
  }

  return map.map(({ ids, data }) => {
    return ids.length === 1
      ? ([ids[0], data, undefined] as OptimizeBatchPatchResultItem<R, P>)
      : ([
          null,
          data,
          {
            query: {
              [idKey]: { $in: ids },
            },
          },
        ] as OptimizeBatchPatchResultItem<R, P>);
  });
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("optimizeBatchPatch", () => {
    expect(
      optimizeBatchPatch(
        [
          { id: "1", name: "John" },
          { id: "2", name: "Jane" },
          { id: "3", name: "John" },
          { id: "4", name: "Jane" },
          { id: 5, name: "Jack" },
        ],
        { id: "id" },
      ),
    ).toEqual([
      [null, { name: "John" }, { query: { id: { $in: ["1", "3"] } } }],
      [null, { name: "Jane" }, { query: { id: { $in: ["2", "4"] } } }],
      [5, { name: "Jack" }, undefined],
    ]);
  });

  it("optimizeBatchPatch with _id", () => {
    expect(
      optimizeBatchPatch(
        [
          { _id: "1", name: "John" },
          { _id: "2", name: "Jane" },
          { _id: "3", name: "John" },
          { _id: "4", name: "Jane" },
          { _id: 5, name: "Jack" },
        ],
        { id: "_id" },
      ),
    ).toEqual([
      [null, { name: "John" }, { query: { _id: { $in: ["1", "3"] } } }],
      [null, { name: "Jane" }, { query: { _id: { $in: ["2", "4"] } } }],
      [5, { name: "Jack" }, undefined],
    ]);
  });
}
