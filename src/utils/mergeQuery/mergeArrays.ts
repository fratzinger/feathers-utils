import type { Path } from "../../typesInternal";
import type { Handle, ActionOnEmptyIntersect } from "./types";

export function mergeArrays<T>(
  targetArr: T[] | undefined,
  sourceArr: T[] | undefined,
  handle: Handle,
  prependKey?: Path,
  actionOnEmptyIntersect?: ActionOnEmptyIntersect
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
          prependKey || []
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
