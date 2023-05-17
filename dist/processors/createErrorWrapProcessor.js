"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCreateStackTrace = exports.defaultTestMessage = exports.createErrorWrapProcessor = void 0;
const stacktrace_js_1 = __importDefault(require("stacktrace-js"));
const LogLevel_1 = require("../LogLevel");
const LOGGER_STACK_FRAME_COUNT = 8;
function createErrorWrapProcessor({ trimHeadFrames = 0, loggerStackFrameCount = LOGGER_STACK_FRAME_COUNT, testMessage = defaultTestMessage, createStackTrace = defaultCreateStackTrace, } = {}) {
    return (records) => records.map(({ level, messages, meta }) => {
        messages = [...messages];
        for (let i = 0; i < messages.length; ++i) {
            if (messages[i] instanceof Error ||
                !testMessage(messages[i], level, i)) {
                continue;
            }
            const error = new Error(messages[i]);
            const stackFrames = stacktrace_js_1.default.getSync().slice(trimHeadFrames + loggerStackFrameCount);
            error.stack = createStackTrace(error.name, error.message, stackFrames);
            messages[i] = error;
        }
        return { level, messages, meta };
    });
}
exports.createErrorWrapProcessor = createErrorWrapProcessor;
function defaultTestMessage(message, level, i) {
    return level >= LogLevel_1.LogLevel.ERROR && i === 0;
}
exports.defaultTestMessage = defaultTestMessage;
function defaultCreateStackTrace(errorType, errorMessage, stackFrames) {
    const callStack = [];
    for (const { fileName, lineNumber, columnNumber, functionName, } of stackFrames) {
        const path = `${fileName}:${lineNumber}:${columnNumber}`;
        callStack.push(functionName ? `at ${functionName} (${path})` : `at ${path}`);
    }
    return `${errorType}: ${errorMessage}\n${callStack.join("\n")}`;
}
exports.defaultCreateStackTrace = defaultCreateStackTrace;
