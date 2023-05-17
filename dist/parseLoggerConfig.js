"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLoggerConfig = void 0;
const Logger_1 = require("./Logger");
const LogLevel_1 = require("./LogLevel");
function parseLoggerConfig(loggerConfig, processorDictionary = {}) {
    const logger = new Logger_1.Logger();
    if (!loggerConfig) {
        return logger;
    }
    const { level, channels } = loggerConfig;
    if (level) {
        const logLevel = LogLevel_1.LogLevel.valueOf(level);
        if (!logLevel) {
            throw new Error(`Unknown log level "${level}"`);
        }
        logger.setLevel(logLevel);
    }
    if (!channels) {
        return logger;
    }
    for (const channel of channels) {
        const processors = [];
        for (const processor of channel) {
            const { type, options } = processor;
            const processorFactory = processorDictionary[type];
            if (type === 'logger') {
                processors.push(parseLoggerConfig(options, processorDictionary));
            }
            else if (!processorFactory) {
                throw new Error(`Unknown processor type "${type}"`);
            }
            else {
                processors.push(processorFactory(options));
            }
        }
        logger.channel(...processors);
    }
    return logger;
}
exports.parseLoggerConfig = parseLoggerConfig;
