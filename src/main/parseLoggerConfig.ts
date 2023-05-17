// @flow
import type {LoggerConfig, ProcessorDictionary} from './types/LoggerConfigParserType';
import {Logger} from './Logger';
import {LogLevel} from './LogLevel';

export function parseLoggerConfig(loggerConfig: LoggerConfig, processorDictionary: ProcessorDictionary = {}): Logger {
  const logger = new Logger();
  if (!loggerConfig) {
    return logger;
  }
  const {level, channels} = loggerConfig;
  if (level) {
    const logLevel = LogLevel.valueOf(level);
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
      const {type, options} = processor;
      const processorFactory = processorDictionary[type];

      if (type === 'logger') {
        processors.push(parseLoggerConfig(options, processorDictionary))
      } else if (!processorFactory) {
        throw new Error(`Unknown processor type "${type}"`);
      } else {
        processors.push(processorFactory(options))
      }
    }
    logger.channel(...processors);
  }
  return logger;
}
