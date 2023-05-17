import {Logger} from './Logger';
import {parseLoggerConfig} from './parseLoggerConfig';
import {createAggregateProcessor} from './processors/createAggregateProcessor';
import {createConsoleProcessor} from './processors/createConsoleProcessor';
import {createDateAndLevelPrependProcessor} from './processors/createDateAndLevelPrependProcessor';
import {createInspectProcessor} from './processors/createInspectProcessor';
import {createStackTraceTransformProcessor} from './processors/createStackTraceTransformProcessor';
import {createThrottleProcessor} from './processors/createThrottleProcessor';
import {createErrorWrapProcessor} from './processors/createErrorWrapProcessor';
import {createMessageConcatProcessor} from './processors/createMessageConcatProcessor';

export {LogLevel} from './LogLevel';
export {
  Logger,
  Logger as default,
  parseLoggerConfig,
  createAggregateProcessor,
  createConsoleProcessor,
  createDateAndLevelPrependProcessor,
  createInspectProcessor,
  createStackTraceTransformProcessor,
  createThrottleProcessor,
  createErrorWrapProcessor,
  createMessageConcatProcessor
};
export {createSentryProcessor} from './processors/createSentryProcessor';

export const ProcessorFactories = {
  logger: Logger,
  aggregate: createAggregateProcessor,
  console: createConsoleProcessor,
  prependDateAndLevel: createDateAndLevelPrependProcessor,
  inspect: createInspectProcessor,
  extractStackTrace: createStackTraceTransformProcessor,
  throttle: createThrottleProcessor,
  wrapError: createErrorWrapProcessor,
  concatMessages: createMessageConcatProcessor
};


