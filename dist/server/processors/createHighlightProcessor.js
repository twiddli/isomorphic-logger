"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHighlightProcessor = void 0;
const chalk_1 = __importDefault(require("chalk"));
const LogLevel_1 = require("../../LogLevel");
const DEFAULT_COLORS = {
    [LogLevel_1.LogLevel.ERROR]: 'red',
    [LogLevel_1.LogLevel.TRACE]: 'gray',
    [LogLevel_1.LogLevel.DEBUG]: 'blue',
    [LogLevel_1.LogLevel.WARN]: 'yellow'
};
function createHighlightProcessor({ colors = DEFAULT_COLORS } = {}) {
    return (records) => records.map(record => (Object.assign(Object.assign({}, record), { messages: record.messages.map(message => {
            if (typeof message === 'object') {
                return message;
            }
            let methods = colors[record.level];
            if (methods) {
                if (!Array.isArray(methods)) {
                    methods = [methods];
                }
                for (const method of methods) {
                    message = chalk_1.default[method](message);
                }
            }
            return message;
        }) })));
}
exports.createHighlightProcessor = createHighlightProcessor;
