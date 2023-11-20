import _merge from "lodash/merge.js";
import _isEmpty from "lodash/isEmpty.js";
import type { Query } from "@feathersjs/feathers";
import {
  areQueriesOverlapping,
  handleArray,
  handleCircular,
  isQueryMoreExplicitThanQuery,
  makeDefaultOptions,
} from "./utils";
import type { MergeQueryOptions } from "./types";
import { filterQuery } from "../filterQuery";
import { hasOwnProperty } from "../internal.utils";

/**
 * Merges two queries into one.
 * @param target Query to be merged into
 * @param source Query to be merged from
 * @param _options
 * @returns Query
 */
export function mergeQuery<T = any>(
  target: Query,
  source: Query,
  _options?: Partial<MergeQueryOptions<T>>,
): Query {
  const options = makeDefaultOptions(_options);

  const { query: targetQuery, ...targetFilters } = filterQuery(target);

  // eslint-disable-next-line prefer-const
  let { query: sourceQuery, ...sourceFilters } = filterQuery(source);

  //#region filters
  handleArray(targetFilters, sourceFilters, ["$select"], options);
  // remaining filters
  delete sourceFilters["$select"];
  _merge(targetFilters, sourceFilters);

  //#endregion

  const subsetQuery = isQueryMoreExplicitThanQuery(targetQuery, sourceQuery);

  if (
    options.defaultHandle === "intersect" &&
    !!subsetQuery &&
    !hasOwnProperty(targetQuery, "$or", "$and") &&
    !hasOwnProperty(sourceQuery, "$or", "$and")
  ) {
    return {
      ...targetFilters,
      ...subsetQuery,
    };
  }

  if (
    options.defaultHandle === "intersect" &&
    !areQueriesOverlapping(targetQuery, sourceQuery) &&
    !hasOwnProperty(targetQuery, "$or", "$and") &&
    !hasOwnProperty(sourceQuery, "$or", "$and")
  ) {
    return {
      ...targetFilters,
      ...targetQuery,
      ...sourceQuery,
    };
  }

  //#region '$or' / '$and'

  if (
    options.useLogicalConjunction &&
    (options.defaultHandle === "combine" ||
      options.defaultHandle === "intersect") &&
    !_isEmpty(targetQuery)
  ) {
    const logicalOp = options.defaultHandle === "combine" ? "$or" : "$and";
    if (hasOwnProperty(sourceQuery, logicalOp)) {
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
    handleCircular(targetQuery, sourceQuery, [key], options);
  }

  return {
    ...targetFilters,
    ...targetQuery,
  };
}
