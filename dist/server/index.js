"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessorFactories = exports.createRollingFileAppendProcessor = exports.createFileAppendProcessor = exports.createHighlightProcessor = void 0;
const index_1 = require("../index");
const createHighlightProcessor_1 = require("./processors/createHighlightProcessor");
Object.defineProperty(exports, "createHighlightProcessor", { enumerable: true, get: function () { return createHighlightProcessor_1.createHighlightProcessor; } });
const createFileAppendProcessor_1 = require("./processors/createFileAppendProcessor");
Object.defineProperty(exports, "createFileAppendProcessor", { enumerable: true, get: function () { return createFileAppendProcessor_1.createFileAppendProcessor; } });
const createRollingFileAppendProcessor_1 = require("./processors/createRollingFileAppendProcessor");
Object.defineProperty(exports, "createRollingFileAppendProcessor", { enumerable: true, get: function () { return createRollingFileAppendProcessor_1.createRollingFileAppendProcessor; } });
__exportStar(require("../index"), exports);
exports.ProcessorFactories = Object.assign(Object.assign({}, index_1.ProcessorFactories), { highlight: createHighlightProcessor_1.createHighlightProcessor, appendToFile: createFileAppendProcessor_1.createFileAppendProcessor, appendRollingFile: createRollingFileAppendProcessor_1.createRollingFileAppendProcessor });
