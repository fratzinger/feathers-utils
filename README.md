# feathers-utils

![npm](https://img.shields.io/npm/v/feathers-utils)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/fratzinger/feathers-utils/Node.js%20CI)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/fratzinger/feathers-utils)
![Code Climate coverage](https://img.shields.io/codeclimate/coverage/fratzinger/feathers-utils)
![David](https://img.shields.io/david/fratzinger/feathers-casl)
![npm](https://img.shields.io/npm/dm/feathers-utils)
[![GitHub license](https://img.shields.io/github/license/fratzinger/feathers-utils)](https://github.com/fratzinger/feathers-utils/blob/main/LICENSE.md)


## Installation

```shell
npm i feathers-utils
```

## Usage

### Hooks

- `hooks/checkMulti()`: throws if the request is **multi** data, but the service has `allowsMulti(method)` returns `false`
- `hooks/setData({ allowUndefined: Boolean })`

### Mixins

- `mixins/debounceMixin` & `mixins/DebouncedStore`

### Utils

- `filterQuery`
- `isMulti(context) => Boolean`: returns true, if `find`, `create/patch/remove`: multi
- `markHookForSkip`: add hookName to `context.params.skipHooks` - also see `shouldSkip`
- `mergeQuery`: deeply merges queries
- `mergeArrays`: merges arrays with intersection options
- `pushSet`: if existing array: *push*, else *set*
- `shouldSkip`: checks `context.params.skipHooks` for `'all' | '${hookName}' | '${type}:${hookName}'` - also see `markHookForSkip`