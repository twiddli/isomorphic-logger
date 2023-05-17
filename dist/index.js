"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessorFactories = exports.createSentryProcessor = exports.createMessageConcatProcessor = exports.createErrorWrapProcessor = exports.createThrottleProcessor = exports.createStackTraceTransformProcessor = exports.createInspectProcessor = exports.createDateAndLevelPrependProcessor = exports.createConsoleProcessor = exports.createAggregateProcessor = exports.parseLoggerConfig = exports.default = exports.Logger = exports.LogLevel = void 0;
const Logger_1 = require("./Logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return Logger_1.Logger; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return Logger_1.Logger; } });
const parseLoggerConfig_1 = require("./parseLoggerConfig");
Object.defineProperty(exports, "parseLoggerConfig", { enumerable: true, get: function () { return parseLoggerConfig_1.parseLoggerConfig; } });
const createAggregateProcessor_1 = require("./processors/createAggregateProcessor");
Object.defineProperty(exports, "createAggregateProcessor", { enumerable: true, get: function () { return createAggregateProcessor_1.createAggregateProcessor; } });
const createConsoleProcessor_1 = require("./processors/createConsoleProcessor");
Object.defineProperty(exports, "createConsoleProcessor", { enumerable: true, get: function () { return createConsoleProcessor_1.createConsoleProcessor; } });
const createDateAndLevelPrependProcessor_1 = require("./processors/createDateAndLevelPrependProcessor");
Object.defineProperty(exports, "createDateAndLevelPrependProcessor", { enumerable: true, get: function () { return createDateAndLevelPrependProcessor_1.createDateAndLevelPrependProcessor; } });
const createInspectProcessor_1 = require("./processors/createInspectProcessor");
Object.defineProperty(exports, "createInspectProcessor", { enumerable: true, get: function () { return createInspectProcessor_1.createInspectProcessor; } });
const createStackTraceTransformProcessor_1 = require("./processors/createStackTraceTransformProcessor");
Object.defineProperty(exports, "createStackTraceTransformProcessor", { enumerable: true, get: function () { return createStackTraceTransformProcessor_1.createStackTraceTransformProcessor; } });
const createThrottleProcessor_1 = require("./processors/createThrottleProcessor");
Object.defineProperty(exports, "createThrottleProcessor", { enumerable: true, get: function () { return createThrottleProcessor_1.createThrottleProcessor; } });
const createErrorWrapProcessor_1 = require("./processors/createErrorWrapProcessor");
Object.defineProperty(exports, "createErrorWrapProcessor", { enumerable: true, get: function () { return createErrorWrapProcessor_1.createErrorWrapProcessor; } });
const createMessageConcatProcessor_1 = require("./processors/createMessageConcatProcessor");
Object.defineProperty(exports, "createMessageConcatProcessor", { enumerable: true, get: function () { return createMessageConcatProcessor_1.createMessageConcatProcessor; } });
var LogLevel_1 = require("./LogLevel");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return LogLevel_1.LogLevel; } });
var createSentryProcessor_1 = require("./processors/createSentryProcessor");
Object.defineProperty(exports, "createSentryProcessor", { enumerable: true, get: function () { return createSentryProcessor_1.createSentryProcessor; } });
exports.ProcessorFactories = {
    logger: Logger_1.Logger,
    aggregate: createAggregateProcessor_1.createAggregateProcessor,
    console: createConsoleProcessor_1.createConsoleProcessor,
    prependDateAndLevel: createDateAndLevelPrependProcessor_1.createDateAndLevelPrependProcessor,
    inspect: createInspectProcessor_1.createInspectProcessor,
    extractStackTrace: createStackTraceTransformProcessor_1.createStackTraceTransformProcessor,
    throttle: createThrottleProcessor_1.createThrottleProcessor,
    wrapError: createErrorWrapProcessor_1.createErrorWrapProcessor,
    concatMessages: createMessageConcatProcessor_1.createMessageConcatProcessor
};
