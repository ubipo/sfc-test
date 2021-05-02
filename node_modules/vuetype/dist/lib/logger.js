"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
function logEmitted(filePath) {
    console.log(chalk_1.default.green('Emitted: ') + filePath);
}
exports.logEmitted = logEmitted;
function logRemoved(filePath) {
    console.log(chalk_1.default.green('Removed: ') + filePath);
}
exports.logRemoved = logRemoved;
function logError(filePath, messages) {
    var errors = [
        chalk_1.default.red('Emit Failed: ') + filePath
    ].concat(messages.map(function (m) { return '  ' + chalk_1.default.red('Error: ') + m; }));
    console.error(errors.join('\n'));
}
exports.logError = logError;
