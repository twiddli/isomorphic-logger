/**
 * Converts object messages to stringified representation.
 * @param {Number} [depth = 10] Object nesting depth.
 */
import type {Processor, Record} from '../types/LoggerType';
import objectInspect from 'object-inspect';

export function createInspectProcessor({depth = 10} = {}): Processor {
  return (records: Record[]) => records.map(record => ({
    ...record,
    messages: record.messages.map(message => {
      if (typeof message === 'object' || typeof message === 'function') {
        return objectInspect(message, {depth});
      }
      return message;
    })
  }))
}
