import { 
  filterQuery as plainFilterQuery
} from "@feathersjs/adapter-commons";

import type {
  FilterQueryOptions,
  FilterQueryResult,
  PlainFilterQueryOptions
} from "../types";

import type { Query } from "@feathersjs/feathers";

export function filterQuery<T>(query: Query, options?: FilterQueryOptions<T>): FilterQueryResult {
  query = query || {};
  options = options || {};
  if (options?.service) {
    const { service } = options;
    const operators = options.operators 
      ? options.operators
      : service.options?.whitelist;
    const filters = options.filters
      ? options.filters
      : service.options?.filters;
    const optionsForFilterQuery: PlainFilterQueryOptions = {}; 
    if (operators) { optionsForFilterQuery.operators = operators; }
    if (filters) { optionsForFilterQuery.filters = filters; }
    if (typeof service?.filterQuery === "function") {
      return service.filterQuery({ query }, optionsForFilterQuery);
    } else {
      return plainFilterQuery(query, optionsForFilterQuery) as FilterQueryResult;
    }
  }
  return plainFilterQuery(query, options) as FilterQueryResult;
}