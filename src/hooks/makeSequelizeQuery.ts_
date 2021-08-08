import _get from "lodash/get";
import _isObject from "lodash/isObject";
import _transform from "lodash/transform";
import _intersection from "lodash/intersection";
import { HookContext, Query } from "@feathersjs/feathers";

import { Model } from "sequelize";

function replaceKeysDeep(
  obj: Record<string, unknown>, 
  keysMap: Record<string, string>
) { // keysMap = { oldKey1: newKey1, oldKey2: newKey2, etc...
  return _transform(obj, function(
    result: Record<string, unknown>, 
    value,
    key
  ) { // transform to a new object

    const currentKey = keysMap[key] || key; // if the key is in keysMap use the replacement, if not use the original key

    result[currentKey] = _isObject(value) ? replaceKeysDeep(value as Record<string, unknown>, keysMap) : value; // if the key is an object run it through the inner function - replaceKeys
  });
}

const makeIncludeArray = (
  query: Query, 
  Model: Model, 
  operators
) => {
  const queryKeys = Object.keys(query);
  const { associations: associationsByKey } = Model;
  const associationsKeys = Object.keys(associationsByKey);

  const associationKeysInQuery = _intersection(queryKeys, associationsKeys);

  const result = [];

  for (let i = 0, n = associationKeysInQuery.length; i < n; i++) {
    const key = associationKeysInQuery[i];
    const model = associationsByKey[key].target;
    const where = operators ? replaceKeysDeep(query[key], operators) : query[key];
    const as = key;
    const include = makeIncludeArray(where, model, operators);
    delete query[key];

    const association = {
      model,
      as,
      attributes: [],
      required: true
    };
    if (include.length > 0) {
      association.include = include;
    }
    if (Object.keys(where).length > 0) {
      association.where = where;
    }
    if (include.length > 0 || Object.keys(where).length > 0) {
      result.push(association);
    }
  }

  return result;
};

const makeSequelizeQuery = () => {
  return (context: HookContext): HookContext => {
    const { params } = context;
    const { query = {} } = params;

    const { Model } = context.service;
    if (!Model || !Model.sequelize) { return context; }
    const operators = _get(context, "service.options.operators");

    const include = makeIncludeArray(query, Model, operators);

    if (include.length > 0) {
      params.sequelize = params.sequelize || { include: [] };
      if (params.sequelize.include) {
        params.sequelize.include.push(...include);
      } else {
        params.sequelize.include = include;
      }
    }

    return context;
  };
};

export default makeSequelizeQuery;
