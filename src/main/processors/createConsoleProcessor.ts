// @flow
import type {Processor, Record} from '../types/LoggerType';
import {LogLevel} from '../LogLevel';

export function createConsoleProcessor(): Processor {
  return (records: Record[]) => {
    for (const {level, messages} of records) {
      switch (level) {

        case LogLevel.TRACE:
        case LogLevel.DEBUG:
          if (console.debug) {
            console.debug(...messages);
            return;
          }
          break;

        case LogLevel.INFO:
          if (console.info) {
            console.info(...messages);
            return;
          }
          break;

        case LogLevel.WARN:
          if (console.warn) {
            console.warn(...messages);
            return;
          }
          break;

        case LogLevel.ERROR:
          console.error(...messages);
          return;
      }
      console.log(...messages);
    }
    return records;
  }
}
