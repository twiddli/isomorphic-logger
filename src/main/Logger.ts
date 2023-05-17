// @flow
import type {
  Channel,
  Messages,
  Processor,
  ProcessorResult,
  Record,
} from "./types/LoggerType";
import { LogLevel } from './LogLevel';

export class Logger {
  level: LogLevel = LogLevel.INFO;

  channels: Channel[] = [];

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Creates logging channel that consists of a list of processors.
   *
   * Processor is a function that accepts an array of records `{level, messages}` and returns another
   * array of records for consequent processors to work with. If processor returns a promise then logging
   * channel is suspended until this promise is resolved.
   *
   * Instead of an object with `process` method can be provided.
   *
   * @returns {Logger}
   */
  channel(...processors: Processor[]): void {
    processors = processors.map((processor) => {
      if (typeof processor === "function") {
        return processor;
      }
      if (processor && processor.process) {
        return processor.process;
      }
      throw new Error(
        "Processor should be a function or an object with `process` callback"
      );
    });

    this.channels.push({ processors, promise: undefined });
  }

  /**
   * Process records through pipeline.
   *
   * @param {Array} records
   * @return {Promise|null}
   */
  process(records: Record[]): ProcessorResult {
    let r = records.filter((record) => record.level >= this.level.valueOf());

    if (!r.length) {
      return records;
    }

    const promises = [];

    for (const channel of this.channels) {
      let p: Processor[] = [...channel.processors];
      let promise;

      function next(
        p: Processor[],
        r: Record[] | undefined,
        i: number
      ): ProcessorResult {
        if (!r) {
          return;
        }
        if (i < p.length) {
          let r1: ProcessorResult;
          try {
            r1 = p[i](r);
          } catch (error) {
            console.log(error);
          }

          if (r1 instanceof Promise) {
            return r1
              .then((r2) => next(p, r2, i + 1))
              .catch((error) => console.log(error));
          } else {
            return next(p, r1, i + 1);
          }
        } else {
          if (channel.promise === promise) {
            channel.promise = undefined;
          }
        }
      }

      if (channel.promise) {
        promise = channel.promise = channel.promise.then(() => next(p, r, 0));
      } else {
        promise = next(p, r, 0);
        if (promise instanceof Promise) {
          channel.promise = promise;
        }
      }
      if (promise) {
        promises.push(promise);
      }
    }
    if (promises.length) {
      return Promise.all(promises).then(() => records);
    }
    return records;
  }

  isTraceEnabled() {
    return this.level.valueOf() >= LogLevel.TRACE.valueOf();
  }

  isDebugEnabled() {
    return this.level.valueOf() >= LogLevel.DEBUG.valueOf();
  }

  isInfoEnabled() {
    return this.level.valueOf() >= LogLevel.INFO.valueOf();
  }

  isWarnEnabled() {
    return this.level.valueOf() >= LogLevel.WARN.valueOf();
  }

  isErrorEnabled() {
    return this.level.valueOf() >= LogLevel.ERROR.valueOf();
  }

  /**
   * Send messages to channels of this logger.
   *
   * @param {Number} level Level to log provided messages with.
   * @param {Array} messages Messages to pass to processors.
   * @param {Object} [meta] Any additional meta passed to processors.
   *
   * @returns {Promise} Promise that resolves when all channels did process provided messages.
   */
  sendMessages(level: LogLevel, messages: Messages, meta?: any) {
    return this.process([{ level, messages, meta }]);
  }

  log(...messages: Messages) {
    return this.sendMessages(LogLevel.INFO, messages);
  }

  trace(...messages: Messages) {
    return this.sendMessages(LogLevel.TRACE, messages);
  }

  debug(...messages: Messages) {
    return this.sendMessages(LogLevel.DEBUG, messages);
  }

  info(...messages: Messages) {
    return this.sendMessages(LogLevel.INFO, messages);
  }

  warn(...messages: Messages) {
    return this.sendMessages(LogLevel.WARN, messages);
  }

  error(...messages: Messages) {
    return this.sendMessages(LogLevel.ERROR, messages);
  }
}
