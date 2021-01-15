# feathers-utils

## Installation

```shell
npm i feathers-utils
```

## Usage

### Hooks

- `checkMulti()`: throws if the request is **multi** data, but the service has `allowsMulti(method)` returns `false`
- `setData({ allowUndefined: Boolean })`

### Utils

- `isMulti(context) => Boolean`: returns true, if `find`, `create/patch/remove`: multi
- `mergeQuery`: deeply merges queries
- `mergeArrays`: merges arrays with intersection options
- `pushSet`: if existing array: *push*, else *set*
- `shouldSkip`: checks `context.params.skipHooks` for `'all' | '${hookName}' | '${type}:${hookName}'`