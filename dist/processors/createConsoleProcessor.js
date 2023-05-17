"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConsoleProcessor = void 0;
const LogLevel_1 = require("../LogLevel");
function createConsoleProcessor() {
    return (records) => {
        for (const { level, messages } of records) {
            switch (level) {
                case LogLevel_1.LogLevel.TRACE:
                case LogLevel_1.LogLevel.DEBUG:
                    if (console.debug) {
                        console.debug(...messages);
                        return;
                    }
                    break;
                case LogLevel_1.LogLevel.INFO:
                    if (console.info) {
                        console.info(...messages);
                        return;
                    }
                    break;
                case LogLevel_1.LogLevel.WARN:
                    if (console.warn) {
                        console.warn(...messages);
                        return;
                    }
                    break;
                case LogLevel_1.LogLevel.ERROR:
                    console.error(...messages);
                    return;
            }
            console.log(...messages);
        }
        return records;
    };
}
exports.createConsoleProcessor = createConsoleProcessor;
