# feathers-utils

[![npm](https://img.shields.io/npm/v/feathers-utils)](https://www.npmjs.com/package/feathers-utils)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/fratzinger/feathers-utils/node.js.yml?branch=main)](https://github.com/fratzinger/feathers-utils/actions/workflows/node.js.yml?query=branch%3Amain)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/fratzinger/feathers-utils)](https://codeclimate.com/github/fratzinger/feathers-utils)
[![Code Climate coverage](https://img.shields.io/codeclimate/coverage/fratzinger/feathers-utils)](https://codeclimate.com/github/fratzinger/feathers-utils)
[![npm](https://img.shields.io/npm/dm/feathers-utils)](https://www.npmjs.com/package/feathers-utils)
[![GitHub license](https://img.shields.io/github/license/fratzinger/feathers-utils)](https://github.com/fratzinger/feathers-utils/blob/main/LICENSE.md)

> NOTE: This is the version for Feathers v5. For Feathers v4 use [feathers-utils v1](https://github.com/fratzinger/feathers-utils/tree/crow)


## Installation

```shell
npm i feathers-utils
```

## Usage

### Hooks

- `checkMulti`: throws if the request is **multi** data, but the services `allowsMulti(method)` returns `false`
- `createRelated`: simply create related items from a hook.
- `forEach`
- `onDelete`: simply remove/set null related items from a hook.
- `paramsForServer`
- `paramsFromClient`
- `parseFields`
- `removeRelated`: simple remove related items from a hook. Basically `cascade` at feathers level.
- `runPerItem`: run a function for every item. Meant for `multi:true`.
- `setData`: map properties from `context` to `data`. Something like `userId: context.params.user.id`

### Mixins

- `mixins/debounceMixin` & `mixins/DebouncedStore`

### Utils

- `defineHooks`
- `filterQuery`
- `flattenQuery`
- `deflattenQuery`
- `getItemsIsArray(context)`: returns `{ items: any[], isArray: boolean }`
- `getPaginate`
- `isMulti(context) => Boolean`: returns true, if `find`, `create/patch/remove`: multi
- `isPaginated`
- `markHookForSkip`: add hookName to `context.params.skipHooks` - also see `shouldSkip`
- `mergeQuery`: deeply merges queries
- `mergeArrays`: merges arrays with intersection options
- `pushSet`: if existing array: *push*, else *set*
- `setQueryKeySafely`
- `setResultEmpty`
- `shouldSkip`: checks `context.params.skipHooks` for `'all' | '${hookName}' | '${type}:${hookName}'` - also see `markHookForSkip`