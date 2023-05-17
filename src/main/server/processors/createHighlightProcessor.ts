/**
 * Creates log processor that applies ASCII coloring to messages according to
 * logging level of the provided record. Useful for terminal logging only.
 */
import type {Processor, Record} from '../../types/LoggerType';
import chalk from 'chalk';
import {LogLevel} from '../../LogLevel';

const DEFAULT_COLORS = {
  [LogLevel.ERROR]: 'red',
  [LogLevel.TRACE]: 'gray',
  [LogLevel.DEBUG]: 'blue',
  [LogLevel.WARN]: 'yellow'
};

export function createHighlightProcessor({colors = DEFAULT_COLORS} = {}): Processor {
  return (records: Record[]) => records.map(record => ({
    ...record,
    messages: record.messages.map(message => {
      if (typeof message === 'object') {
        return message;
      }
      let methods = colors[record.level];
      if (methods) {
        if (!Array.isArray(methods)) {
          methods = [methods];
        }
        for (const method of methods) {
          message = chalk[method](message);
        }
      }
      return message;
    })
  }));
}
