"use strict";
// @flow
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
class LogLevel {
    constructor(value) {
        if (value instanceof LogLevel) {
            return value;
        }
        this.value = value;
    }
    static valueOf(name) {
        const level = LogLevel[name];
        if (level instanceof LogLevel) {
            return level;
        }
        return null;
    }
    valueOf() {
        return this.value;
    }
}
exports.LogLevel = LogLevel;
LogLevel.TRACE = new LogLevel(0);
LogLevel.DEBUG = new LogLevel(100);
LogLevel.INFO = new LogLevel(200);
LogLevel.WARN = new LogLevel(300);
LogLevel.ERROR = new LogLevel(400);
LogLevel.OFF = new LogLevel(Number.MAX_VALUE);
