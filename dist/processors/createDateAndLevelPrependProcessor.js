"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDateAndLevelPrependProcessor = exports.getLogLevelName = void 0;
const moment_1 = __importDefault(require("moment"));
const LogLevel_1 = require("../LogLevel");
function getLogLevelName(level) {
    for (const key in LogLevel_1.LogLevel) {
        if (level instanceof LogLevel_1.LogLevel && level === LogLevel_1.LogLevel[key]) {
            return key;
        }
        if (typeof level === 'number' && level === LogLevel_1.LogLevel[key].valueOf()) {
            return key;
        }
    }
    return level;
}
exports.getLogLevelName = getLogLevelName;
function createDateAndLevelPrependProcessor({ dateFormat = 'YYYY-MM-DD HH:MM:SS' } = {}) {
    return (records) => records.map(record => {
        record = Object.assign(Object.assign({}, record), { messages: [...record.messages] });
        const { messages, level } = record;
        messages.unshift(getLogLevelName(level), (0, moment_1.default)().format(dateFormat));
        return record;
    });
}
exports.createDateAndLevelPrependProcessor = createDateAndLevelPrependProcessor;
