// @flow
import type {Processor, Record} from '../types/LoggerType';
import type {ProcessorOptions} from '../types/LoggerConfigParserType';
import {createAggregateProcessor} from './createAggregateProcessor';

type ThrottleProcessorOptions = ProcessorOptions & {
  delay: number;
  length: number;
  leading: boolean;
};

export function createThrottleProcessor(options: ThrottleProcessorOptions = {
  delay: 1000,
  length: 1000,
  leading: true
}): Processor {
  const {delay, length, leading} = options;
  let timeout;

  return createAggregateProcessor({
    onDispatch(records: Record[], next): void {
      if (records.length < length) {
        // Aggregator did not collect enough records yet.
        if (leading) {
          if (!timeout) {
            timeout = setTimeout(() => {
              timeout = 0;
              next();
            }, delay);
          }
        } else {
          timeout = setTimeout(next, delay);
        }
      } else {
        clearTimeout(timeout);
        next();
      }
    }
  });
}
