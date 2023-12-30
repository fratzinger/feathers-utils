import type { Path } from "../../typesInternal";
import type { Handle, ActionOnEmptyIntersect } from "./types";

export function mergeArrays<T>(
  targetArr: T[] | undefined,
  sourceArr: T[] | undefined,
  handle: Handle,
  prependKey?: Path,
  actionOnEmptyIntersect?: ActionOnEmptyIntersect,
): T[] | undefined {
  if (!sourceArr && !targetArr) {
    return;
  }
  if (handle === "target") {
    return targetArr;
  } else if (handle === "source") {
    return sourceArr;
  } else if (handle === "combine") {
    if (!sourceArr || !Array.isArray(sourceArr)) {
      return targetArr;
    }
    if (!targetArr || !Array.isArray(targetArr)) {
      return sourceArr;
    }
    const arr = targetArr.concat(sourceArr);
    return [...new Set(arr)];
  } else if (handle === "intersect" || handle === "intersectOrFull") {
    const targetIsNotArray = !targetArr || !Array.isArray(targetArr);
    const sourceIsNotArray = !sourceArr || !Array.isArray(sourceArr);

    if ((targetIsNotArray || sourceIsNotArray) && handle === "intersect") {
      if (actionOnEmptyIntersect) {
        actionOnEmptyIntersect(
          targetArr as unknown,
          sourceArr,
          prependKey || [],
        );
      }
      return;
    }

    if (targetIsNotArray || sourceIsNotArray) {
      const val = !targetIsNotArray ? targetArr : sourceArr;
      return val;
    }

    return targetArr!.filter((val) => sourceArr!.includes(val));
  }
  return undefined;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  describe("target", function () {
    it("returns target", function () {
      const arr = mergeArrays([1], [2], "target");

      expect(arr).toStrictEqual([1]);
    });

    it("returns target even if undefined", function () {
      const arr = mergeArrays(undefined, [1], "target");

      expect(arr).toBeUndefined();
    });
  });

  describe("source", function () {
    it("returns source", function () {
      const arr = mergeArrays([1], [2], "source");

      expect(arr).toStrictEqual([2]);
    });

    it("returns source even if undefined", function () {
      const arr = mergeArrays([1], undefined, "source");

      expect(arr).toBeUndefined();
    });
  });

  describe("combine", function () {
    it("returns combined array", function () {
      const arr = mergeArrays([1, 2], [2, 3], "combine");

      expect(arr).toStrictEqual([1, 2, 3]);
    });

    it("returns one array if combine", function () {
      const arr1 = mergeArrays([1, 2], undefined, "combine");

      expect(arr1).toStrictEqual([1, 2]);

      const arr2 = mergeArrays(undefined, [1, 2], "combine");

      expect(arr2).toStrictEqual([1, 2]);
    });
  });

  describe("intersect", function () {
    it("returns intersected array", function () {
      const arr = mergeArrays([1, 2], [2, 3], "intersect");

      expect(arr).toStrictEqual([2]);
    });

    it("returns undefined if one is undefined", function () {
      const arr1 = mergeArrays([1, 2], undefined, "intersect");

      expect(arr1).toBeUndefined();

      const arr2 = mergeArrays(undefined, [1, 2], "intersect");

      expect(arr2).toBeUndefined();
    });
  });
}
