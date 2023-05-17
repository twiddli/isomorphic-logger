"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSentryProcessor = void 0;
const LogLevel_1 = require("../LogLevel");
function createSentryProcessor(sentry) {
    return (records) => {
        for (const { level, messages, meta } of records) {
            if (!messages.length) {
                continue;
            }
            const message = messages[0];
            if (level.valueOf() < LogLevel_1.LogLevel.ERROR.valueOf()) {
                sentry.captureMessage(message, {
                    level: level.valueOf() < LogLevel_1.LogLevel.WARN.valueOf() ? "info" : "warn",
                    meta,
                });
            }
            else {
                sentry.captureException(message, { level: "error", meta });
            }
        }
        return records;
    };
}
exports.createSentryProcessor = createSentryProcessor;
