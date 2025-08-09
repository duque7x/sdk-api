exports.assertString = function (v) {
    if (!v && typeof v !== "string"  || v === '') throw `${v} must be a string`;
}
exports.assertNumber = function (v) {
    if (!v && typeof v !== "number") throw `${v} must be a number`;
}
exports.assertArray = function (v) {
    if (!v && !Array.isArray(v)) throw `${v} must be an array`;
}
exports.assertObject = function (v) {
    if (!v && typeof v !== "object") throw `${v} must be an object`;
}
exports.assertBoolean = function (v) {
    if (!v && typeof v !== "boolean") throw `${v} must be a boolean`;
}
exports.assertFunction = function (v) {
    if (!v && typeof v !== "function") throw `${v} must be a function`;
}