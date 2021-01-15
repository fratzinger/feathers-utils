import {
  Handle
} from "../types";

export default (targetArr: unknown[], sourceArr: unknown[], handle: Handle, actionOnIntersect?: () => void): unknown[]|undefined => {
  if (!sourceArr && !targetArr) { return; }
  if (handle === "target") {
    return targetArr;
  } else if (handle === "source") {
    return sourceArr;
  } else if (handle === "combine") {
    if (!sourceArr || !Array.isArray(sourceArr)) { return targetArr; }
    if (!targetArr || !Array.isArray(targetArr)) { return sourceArr; }
    const arr = targetArr.concat(sourceArr);
    return [...new Set(arr)];
  } else if (handle === "intersect" || handle === "intersectOrFull") {
    const targetIsArray = !targetArr || !Array.isArray(targetArr);
    const sourceIsArray = !sourceArr || !Array.isArray(sourceArr);

    if ((targetIsArray || sourceIsArray) && handle === "intersect") {
      if (actionOnIntersect) { actionOnIntersect(); }
      return;
    }

    if (handle === "intersectOrFull") {
      const val = (!targetIsArray) ? targetArr : sourceArr;
      return val;
    }

    return targetArr.filter(val => sourceArr.includes(val));
  }
  return undefined;
};
