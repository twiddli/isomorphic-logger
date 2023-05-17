// @flow
import type {Processor, Record} from '../types/LoggerType';
import type {ProcessorOptions} from '../types/LoggerConfigParserType';

type StackTraceTransformProcessorOptions = ProcessorOptions & {
  transformer: (stack: string) => string;
}

function webpackStackCleaner(stack: string): string {
  return stack.replace(/\/[^(\n]+(target.out|webpack:)(~?\/)+/g, '');
}

export function createStackTraceTransformProcessor(options: StackTraceTransformProcessorOptions = {transformer: webpackStackCleaner}): Processor {
  const {transformer} = options;

  return (records: Record[]) => records.map(record => ({
    ...record,
    messages: record.messages.map(message => {
      if (message instanceof Error) {
        return transformer(message.stack);
      }
      return message;
    })
  }));
}
