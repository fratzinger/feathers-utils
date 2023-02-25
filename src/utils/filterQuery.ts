import { filterQuery as plainFilterQuery } from "@feathersjs/adapter-commons";

import type {
  FilterQueryOptions as PlainFilterQueryOptions,
  AdapterBase,
} from "@feathersjs/adapter-commons";

import type { Query } from "@feathersjs/feathers";

export interface FilterQueryOptions<T> {
  service?: AdapterBase<T>;
  operators?: PlainFilterQueryOptions["operators"];
  filters?: PlainFilterQueryOptions["filters"];
}

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
    if (operators) {
      optionsForFilterQuery.operators = operators;
    }
    if (filters) {
      optionsForFilterQuery.filters = filters;
    }
    if (
      service &&
      "filterQuery" in service &&
      typeof service.filterQuery === "function"
    ) {
      return service.filterQuery({ query }, optionsForFilterQuery);
    } else {
      return plainFilterQuery(query, optionsForFilterQuery);
    }
  }
  return plainFilterQuery(query, options);
}
