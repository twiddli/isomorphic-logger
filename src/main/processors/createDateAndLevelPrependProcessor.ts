import type {Processor, Record} from '../types/LoggerType';
import moment from 'moment';
import {LogLevel} from '../LogLevel';

export function getLogLevelName(level) {
  for (const key in LogLevel) {
    if (level instanceof LogLevel && level === LogLevel[key]) {
      return key;
    }
    if (typeof level === 'number' && level === LogLevel[key].valueOf()) {
      return key;
    }
  }
  return level;
}

export function createDateAndLevelPrependProcessor({
  dateFormat = 'YYYY-MM-DD HH:MM:SS'
} = {}): Processor {
  return (records: Record[]) => records.map(record => {
    record = {...record, messages: [...record.messages]};
    const {messages, level} = record;

    messages.unshift(
        getLogLevelName(level),
        moment().format(dateFormat)
    );

    return record;
  });
}
