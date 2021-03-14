# feathers-utils

![npm](https://img.shields.io/npm/v/feathers-utils)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/fratzinger/feathers-utils/Node.js%20CI)
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

- `mixins/debounceMixin`

### Utils

- `addHook`: add hooks to specific services
- `filterQuery`
- `isMulti(context) => Boolean`: returns true, if `find`, `create/patch/remove`: multi
- `mergeQuery`: deeply merges queries
- `mergeArrays`: merges arrays with intersection options
- `pushSet`: if existing array: *push*, else *set*
- `shouldSkip`: checks `context.params.skipHooks` for `'all' | '${hookName}' | '${type}:${hookName}'`