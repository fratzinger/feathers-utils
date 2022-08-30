# feathers-utils

[![npm](https://img.shields.io/npm/v/feathers-utils)](https://www.npmjs.com/package/feathers-utils)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/fratzinger/feathers-utils/Node.js%20CI)](https://github.com/fratzinger/feathers-utils/actions/workflows/node.js.yml?query=branch%3Amain)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/fratzinger/feathers-utils)](https://codeclimate.com/github/fratzinger/feathers-utils)
[![Code Climate coverage](https://img.shields.io/codeclimate/coverage/fratzinger/feathers-utils)](https://codeclimate.com/github/fratzinger/feathers-utils)
[![libraries.io](https://img.shields.io/librariesio/release/npm/feathers-utils)](https://libraries.io/npm/feathers-utils)
[![npm](https://img.shields.io/npm/dm/feathers-utils)](https://www.npmjs.com/package/feathers-utils)
[![GitHub license](https://img.shields.io/github/license/fratzinger/feathers-utils)](https://github.com/fratzinger/feathers-utils/blob/main/LICENSE.md)


## Installation

```shell
npm i feathers-utils
```

## Usage

### Hooks

- `checkMulti`: throws if the request is **multi** data, but the service has `allowsMulti(method)` returns `false`
- `createRelated`: simply create related items from a hook.
- `onDelete`: simply remove/set null related items from a hook.
- `removeRelated`: simple remove related items from a hook. Basically `cascade` at feathers level.
- `runPerItem`: run a function for every item. Meant for `multi:true`.
- `setData`: map properties from `context` to `data`. Something like `userId: context.params.user.id`

### Mixins

- `mixins/debounceMixin` & `mixins/DebouncedStore`

### Utils

- `addHook`: add hooks to specific services
- `filterQuery`
- `getItemsIsArray(context)`: returns `{ items: any[], isArray: boolean }`
- `getPaginate`
- `isMulti(context) => Boolean`: returns true, if `find`, `create/patch/remove`: multi
- `isPaginated`
- `markHookForSkip`: add hookName to `context.params.skipHooks` - also see `shouldSkip`
- `mergeQuery`: deeply merges queries
- `mergeArrays`: merges arrays with intersection options
- `pushSet`: if existing array: *push*, else *set*
- `setResultEmpty`
- `shouldSkip`: checks `context.params.skipHooks` for `'all' | '${hookName}' | '${type}:${hookName}'` - also see `markHookForSkip`