import {ProcessorFactories as UniversalProcessorFactories} from '../index';

import {createHighlightProcessor} from './processors/createHighlightProcessor';
import {createFileAppendProcessor} from './processors/createFileAppendProcessor';
import {createRollingFileAppendProcessor} from './processors/createRollingFileAppendProcessor';

export * from '../index';
export {
  createHighlightProcessor,
  createFileAppendProcessor,
  createRollingFileAppendProcessor
};

export const ProcessorFactories = {
  ...UniversalProcessorFactories,
  highlight: createHighlightProcessor,
  appendToFile: createFileAppendProcessor,
  appendRollingFile: createRollingFileAppendProcessor
};
