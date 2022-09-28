import _merge from "lodash/merge.js";
import _isEmpty from "lodash/isEmpty.js";
import type { Query } from "@feathersjs/feathers";
import {
  handleArray,
  handleCircular,
  makeDefaultOptions,
  moveProperty,
} from "./utils";
import type { MergeQueryOptions } from "./types";
import { filterQuery } from "../filterQuery";

export function mergeQuery<T>(
  target: Query,
  source: Query,
  options?: Partial<MergeQueryOptions<T>>
): Query {
  const fullOptions = makeDefaultOptions(options);
  const { filters: targetFilters, query: targetQuery } = filterQuery(target, {
    operators: fullOptions.operators,
    service: fullOptions.service,
  });

  moveProperty(targetFilters, targetQuery, "$or");
  moveProperty(targetFilters, targetQuery, "$and");

  if (target.$limit) {
    targetFilters.$limit = target.$limit;
  }

  let {
    // eslint-disable-next-line prefer-const
    filters: sourceFilters,
    query: sourceQuery,
  } = filterQuery(source, {
    operators: fullOptions.operators,
    service: fullOptions.service,
  });

  moveProperty(sourceFilters, sourceQuery, "$or");
  moveProperty(sourceFilters, sourceQuery, "$and");

  if (source.$limit) {
    sourceFilters.$limit = source.$limit;
  }

  //#region filters

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

  //#endregion

  //#region '$or' / '$and'

  if (
    options?.useLogicalConjunction &&
    (options.defaultHandle === "combine" ||
      options.defaultHandle === "intersect") &&
    !_isEmpty(targetQuery)
  ) {
    const logicalOp = options.defaultHandle === "combine" ? "$or" : "$and";
    if (Object.prototype.hasOwnProperty.call(sourceQuery, logicalOp)) {
      // omit '$or'/'$and' and put all other props into '$or'/'$and'
      const andOr = sourceQuery[logicalOp] as unknown[];
      delete sourceQuery[logicalOp];
      andOr.push(sourceQuery);
      sourceQuery = { [logicalOp]: andOr };
    } else {
      sourceQuery = { [logicalOp]: [sourceQuery] };
    }
  }

  //#endregion

  const keys = Object.keys(sourceQuery);
  for (let i = 0, n = keys.length; i < n; i++) {
    const key = keys[i];
    handleCircular(targetQuery, sourceQuery, [key], fullOptions);
  }
  const result = Object.assign({}, targetFilters, targetQuery) as Query;

  return result;
}
