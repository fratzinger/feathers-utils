import _get from "lodash/get";
import _has from "lodash/has";
import _isEmpty from "lodash/isEmpty";
import _isEqual from "lodash/isEqual";
import _merge from "lodash/merge";
import _set from "lodash/set";

import mergeArrays from "./mergeArrays";
import filterQuery from "../filterQuery";

import { Forbidden } from "@feathersjs/errors";

import {
  Handle,
  MergeQueryOptions,
  Path
} from "../../types";

import { Query } from "@feathersjs/feathers";

const hasOwnProperty = (obj: Record<string, unknown>, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

function handleArray<T>(target: Record<string, unknown>, source: Record<string, unknown>, key: Path, options: MergeQueryOptions<T>): void {
  const targetVal = _get(target, key);
  const sourceVal = _get(source, key);
  if (!sourceVal && !targetVal) { return; }
  const handle: Handle = _get(options, ["handle", ...key], options.defaultHandle);
  const arr = mergeArrays(targetVal, sourceVal, handle, key, options.actionOnEmptyIntersect);
  _set(target, key, arr);
}

function handleCircular<T>(target: Record<string, unknown>, source: Record<string, unknown>, prependKey: Path, options: MergeQueryOptions<T>): void {
  if (!_has(source, prependKey)) { return; }

  if (!_has(target, prependKey)) {
    _set(target, prependKey, _get(source, prependKey));
    return;
  }

  const {
    defaultHandle,
    actionOnEmptyIntersect
  } = options;

  if (defaultHandle === "target") { return; }


  const getTargetVal = () => {
    return (prependKey.length > 0) ? _get(target, prependKey) : target;
  };

  const getSourceVal = () => {
    return (prependKey.length > 0) ? _get(source, prependKey) : source;
  };

  const targetVal = getTargetVal();
  const sourceVal = getSourceVal();

  if (_isEqual(targetVal, sourceVal)) {
    return;
  }

  if (defaultHandle === "source") {
    _set(target, prependKey, sourceVal);
    return;
  }

  if (targetVal === null || sourceVal === null) {
    _set(target, prependKey, sourceVal);
    return;
  }

  const typeOfTargetVal = typeof targetVal;

  if (["boolean"].includes(typeOfTargetVal)) {
    if (defaultHandle === "intersect") {
      actionOnEmptyIntersect(target, source, prependKey);
    }
    _set(target, prependKey, sourceVal);
    return;
  }

  const typeOfSourceVal = typeof sourceVal;

  const isTargetSimple = ["string", "number"].includes(typeOfTargetVal);
  const isSourceSimple = ["string", "number"].includes(typeOfSourceVal);

  if (isTargetSimple || isSourceSimple) {
    if (isTargetSimple && isSourceSimple) {
      if (defaultHandle === "combine") {
        _set(target, prependKey, { $in: [...new Set([targetVal, sourceVal])] });
        return;
      } else if (defaultHandle === "intersect") {
        actionOnEmptyIntersect(target, source, prependKey);
      } else {
        throw new Error("should not reach here");
      }
    } else if (hasOwnProperty(targetVal, "$in") || hasOwnProperty(sourceVal, "$in")) {
      const targetHasIn = hasOwnProperty(targetVal, "$in");
      
      const $in = (targetHasIn) ? targetVal["$in"] : sourceVal["$in"];
      const otherVal = (isTargetSimple) ? targetVal : sourceVal;
      if ($in.length === 1 && _isEqual($in[0], otherVal)) {
        _set(target, prependKey, otherVal);
        return;
      } else if (defaultHandle === "combine") {
        if (!$in.some((x: unknown) => _isEqual(x, otherVal))) {
          $in.push(otherVal);
        }
        _set(target, `${prependKey}.$in`, $in);
        return;
      } else if (defaultHandle === "intersect") {
        if ($in.some((x: unknown) => _isEqual(x, otherVal))) {
          _set(target, prependKey, otherVal);
        } else {
          actionOnEmptyIntersect(target, source, prependKey);
          
        }
        return;
      }
      return;
    }
  }

  const isTargetArray = Array.isArray(targetVal);
  const isSourceArray = Array.isArray(sourceVal);

  if (isTargetArray && isSourceArray) {
    const key = prependKey[prependKey.length-1];
    if (key === "$or") {
      if (defaultHandle === "combine") {
        const newVals = sourceVal.filter((x: unknown) => !targetVal.some((y: unknown) => _isEqual(x, y)));
        targetVal.push(...newVals);
      } else if (defaultHandle === "intersect") {
        // combine into "$and"
        const targetParent = getParentProp(target, prependKey);
        const sourceParent = getParentProp(source, prependKey);
        targetParent.$and = targetParent.$and || [];
        targetParent.$and.push(
          { $or: targetVal },
          { $or: sourceVal }
        );
        delete targetParent.$or;
        delete sourceParent.$or;
        handleCircular(target, source, [...prependKey, "$and"], options);
        return;
      }
      return;
    } else if (key === "$and") {
      if (defaultHandle === "combine") {
        // combine into "$or"
        const targetParent = getParentProp(target, prependKey);
        const sourceParent = getParentProp(source, prependKey);
        targetParent.$or = targetParent.$or || [];
        targetParent.$or.push(
          { $and: targetVal },
          { $and: sourceVal }
        );
        delete targetParent.$and;
        delete sourceParent.$and;
        handleCircular(target, source, [...prependKey, "$or"], options);
        return;
      } else if (defaultHandle === "intersect") {
        const newVals = sourceVal.filter((x: unknown) => !targetVal.some((y: unknown) => _isEqual(x, y)));
        targetVal.push(...newVals);
        return;
      }
    } else if (key === "$in") {
      if (defaultHandle === "combine") {
        let $in: unknown[] = targetVal.concat(sourceVal);
        $in = [...new Set($in)];
        _set(target, prependKey, $in);
        return;
      } else if (defaultHandle === "intersect") {
        const $in = targetVal.filter((x: unknown) => sourceVal.some((y: unknown) => _isEqual(x, y)));
        if ($in.length === 0) {
          actionOnEmptyIntersect(target, source, prependKey);
          
        } else if ($in.length === 1) {
          _set(target, prependKey.slice(0, -1), $in[0]);
          return;
        } else {
          _set(target, prependKey, $in);
        }
      }
      return;
    }
    
    _set(target, prependKey, sourceVal);
    return;
  }

  if (typeOfTargetVal !== "object" || typeOfSourceVal !== "object") {
    _set(target, prependKey, sourceVal);
    return;
  }

  // both are objects
  const sourceKeys = Object.keys(sourceVal);

  for (let i = 0, n = sourceKeys.length; i < n; i++) {
    const key = sourceKeys[i];
    handleCircular(target, source, [...prependKey, key], options);
  }
}

function makeDefaultOptions<T>(options?: Partial<MergeQueryOptions<T>>): MergeQueryOptions<T> {
  options = options || {} as MergeQueryOptions<T>;
  options.defaultHandle = options.defaultHandle || "combine";
  options.actionOnEmptyIntersect = options.actionOnEmptyIntersect || (() => {
    throw new Forbidden("You're not allowed to make this request");
  });
  options.handle = options.handle || {};
  if (options.defaultHandle === "intersect") {
    options.handle.$select = options.handle.$select || "intersectOrFull";
  }
  return options as MergeQueryOptions<T>;
}

function mergeQuery<T>(target: Query, source: Query, options?: Partial<MergeQueryOptions<T>>): Query {
  const fullOptions = makeDefaultOptions(options);
  const {
    filters: targetFilters, 
    query: targetQuery 
  } = filterQuery(target, { 
    operators: fullOptions.operators, 
    service: fullOptions.service 
  });
  
  const { 
    filters: sourceFilters, 
    query: sourceQuery 
  } = filterQuery(source, { 
    operators: fullOptions.operators, 
    service: fullOptions.service 
  });
  
  if (
    target && 
    !Object.prototype.hasOwnProperty.call(target, "$limit") && 
    Object.prototype.hasOwnProperty.call(targetFilters, "$limit")
  ) {
    delete targetFilters.$limit;
  }

  if (
    source && 
    !Object.prototype.hasOwnProperty.call(source, "$limit") && 
    Object.prototype.hasOwnProperty.call(sourceFilters, "$limit")
  ) {
    delete sourceFilters.$limit;
  }

  handleArray(targetFilters, sourceFilters, ["$select"], fullOptions);
  // remaining filters
  delete sourceFilters["$select"];
  _merge(targetFilters, sourceFilters);

  // remove unnecessary $or
  if (targetQuery?.$or && Array.isArray(targetQuery.$or) && targetQuery.$or.some(x => _isEmpty(x))) {
    delete targetQuery.$or;
  }
  if (sourceQuery?.$or && Array.isArray(sourceQuery.$or) && sourceQuery.$or.some(x => _isEmpty(x))) {
    delete sourceQuery.$or;
  }

  const keys = Object.keys(sourceQuery);
  for (let i = 0, n = keys.length; i < n; i++) {
    const key = keys[i];
    handleCircular(targetQuery, sourceQuery, [key], fullOptions);
  }
  const result = Object.assign({}, targetFilters, targetQuery) as Query;

  return result;
}

function getParentProp(target: Record<string, unknown>, path: Path) {
  if (path.length <= 1) { return target; }
  const pathOneUp = path.slice(0, -1);
  return _get(target, pathOneUp);
}

export default mergeQuery;