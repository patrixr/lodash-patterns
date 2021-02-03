"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matcher = exports.when = void 0;
var lodash_1 = __importDefault(require("lodash"));
// -----------------------------
//  Pattern Matching API
// -----------------------------
function when(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (el) {
        var _a;
        return Boolean((_a = lodash_1.default)[method].apply(_a, __spreadArrays([el], args)));
    };
}
exports.when = when;
function matcher() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (el) {
        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
            var matcher_1 = args_1[_i];
            var predicate = lodash_1.default.isArray(matcher_1) ? matcher_1[0] : function () { return true; };
            var resolver = lodash_1.default.isArray(matcher_1) ? matcher_1[1] : matcher_1;
            if (predicate(el)) {
                return resolver(el);
            }
        }
        return null;
    };
}
exports.matcher = matcher;
exports.default = { when: when, matcher: matcher };
