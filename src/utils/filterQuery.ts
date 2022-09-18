import { 
  filterQuery as plainFilterQuery,
} from "@feathersjs/adapter-commons";

import type {
  FilterQueryOptions as PlainFilterQueryOptions,
} from "@feathersjs/adapter-commons";

import type { Query } from "@feathersjs/feathers";
import type { FilterQueryOptions } from "../types";

export function filterQuery<T>(query: Query, _options?: FilterQueryOptions<T>) {
  query = query || {};
  _options = _options || {};
  const { service, ...options } = _options;
  if (service) {
    const operators = options.operators 
      ? options.operators
      : service.options?.operators;
    const filters = options.filters
      ? options.filters
      : service.options?.filters;
    const optionsForFilterQuery: PlainFilterQueryOptions = {}; 
    if (operators) { optionsForFilterQuery.operators = operators; }
    if (filters) { optionsForFilterQuery.filters = filters; }
    // @ts-expect-error service has no filterQuery method
    if (service && "filterQuery" in service && typeof service.filterQuery === "function") {
      // @ts-expect-error service has no filterQuery method
      return service.filterQuery({ query }, optionsForFilterQuery);
    } else {
      return plainFilterQuery(query, optionsForFilterQuery);
    }
  }
  return plainFilterQuery(query, options);
}
