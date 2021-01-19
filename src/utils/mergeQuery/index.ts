import { filterQuery } from "@feathersjs/adapter-commons";
import _get from "lodash/get";
import _has from "lodash/has";
import _isEqual from "lodash/isEqual";
import _merge from "lodash/merge";
import _set from "lodash/set";

import mergeArrays from "./mergeArrays";

import { Forbidden } from "@feathersjs/errors";

import {
  Path,
  Handle,
  MergeQueryOptions
} from "../../types";

import { Query } from "@feathersjs/feathers";

const hasOnlyProperty = (obj: Record<string, unknown>, key: string): boolean => {
  return typeof obj === "object" && Object.keys(obj).length === 1 && obj[key] !== undefined;
};

const handleArray = (target: Record<string, unknown>, source: Record<string, unknown>, key: Path, options: MergeQueryOptions): void => {
  const targetVal = _get(target, key);
  const sourceVal = _get(source, key);
  if (!sourceVal && !targetVal) { return; }
  const handle: Handle = _get(options, `handle.${key}`, options.defaultHandle);
  const arr = mergeArrays(targetVal, sourceVal, handle, key, options.actionOnEmptyIntersect);
  _set(target, key, arr);
};

const handleCircular = (target: Record<string, unknown>, source: Record<string, unknown>, prependKey: Path, options: MergeQueryOptions): void => {
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
    } else if (hasOnlyProperty(targetVal, "$in") || hasOnlyProperty(sourceVal, "$in")) {
      const targetHasIn = hasOnlyProperty(targetVal, "$in");
      //const sourceHasIn = hasOnlyProperty(sourceVal, "$in");
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
    _set(target, prependKey, sourceVal);
    return;
  }

  if (typeOfTargetVal !== "object" || typeOfSourceVal !== "object") {
    _set(target, prependKey, sourceVal);
    return;
  }

  if (hasOnlyProperty(targetVal, "$in") && hasOnlyProperty(sourceVal, "$in")) {
    const targetIn = targetVal["$in"];
    const sourceIn = sourceVal["$in"];
    if (defaultHandle === "combine") {
      let $in: unknown[] = targetIn.concat(sourceIn);
      $in = [...new Set($in)];
      _set(target, `${prependKey}.$in`, $in);
      return;
    } else if (defaultHandle === "intersect") {
      const $in = targetIn.filter((x: unknown) => sourceIn.some((y: unknown) => _isEqual(x, y)));
      if ($in.length === 0) {
        actionOnEmptyIntersect(target, source, `${prependKey}.$in`);
        
      } else if ($in.length === 1) {
        _set(target, prependKey, $in[0]);
        return;
      } else {
        _set(target, `${prependKey}.$in`, $in);
      }
    }
  }

  // both are objects
  const sourceKeys = Object.keys(sourceVal);

  for (let i = 0, n = sourceKeys.length; i < n; i++) {
    const key = sourceKeys[i];
    handleCircular(target, source, `${prependKey}.${key}`, options);
  }
};

const makeDefaultOptions = (options?: Partial<MergeQueryOptions>): MergeQueryOptions => {
  options = options || {} as MergeQueryOptions;
  options.defaultHandle = options.defaultHandle || "combine";
  options.actionOnEmptyIntersect = options.actionOnEmptyIntersect || (() => {
    throw new Forbidden("You're not allowed to make this request");
  });
  options.handle = options.handle || {};
  if (options.defaultHandle === "intersect") {
    options.handle.$select = options.handle.$select || "intersectOrFull";
  }
  return options as MergeQueryOptions;
};

const mergeQuery = (target: Query, source: Query, options?: Partial<MergeQueryOptions>): Query => {
  const fullOptions = makeDefaultOptions(options);
  const { filters: targetFilters, query: targetQuery } = filterQuery(target);
  const { filters: sourceFilters, query: sourceQuery } = filterQuery(source);
  handleArray(targetFilters, sourceFilters, "$select", fullOptions);
  // remaining filters
  delete sourceFilters["$select"];
  _merge(targetFilters, sourceFilters);
  const keys = Object.keys(sourceQuery);
  for (let i = 0, n = keys.length; i < n; i++) {
    const key = keys[i];
    handleCircular(targetQuery, sourceQuery, key, fullOptions);
  }
  const result = Object.assign({}, targetFilters, targetQuery) as Query;
  return result;
};

export default mergeQuery;