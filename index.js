exports.mergeQuery = require("./src/mergeQuery");
exports.mergeArrays = require("./src/mergeQuery/mergeArrays");
exports.shouldSkip = require("./src/shouldSkip");
exports.pushSet = require("./src/pushSet");
exports.isMulti = require("./src/isMulti");

exports.hooks = {
  checkMulti: require("./src/hooks/checkMulti")
};
