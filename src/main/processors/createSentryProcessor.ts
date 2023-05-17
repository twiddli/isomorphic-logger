// @flow
import type { Processor, Record } from "../types/LoggerType";
import { LogLevel } from '../LogLevel';

type Sentry = {
  captureMessage(...varargs: any[]): any;
  captureException(...varargs: any[]): any;
};

export function createSentryProcessor(sentry: Sentry): Processor {
  return (records: Record[]) => {
    for (const { level, messages, meta } of records) {
      if (!messages.length) {
        continue;
      }
      const message = messages[0];
      if (level.valueOf() < LogLevel.ERROR.valueOf()) {
        sentry.captureMessage(message, {
          level: level.valueOf() < LogLevel.WARN.valueOf() ? "info" : "warn",
          meta,
        });
      } else {
        sentry.captureException(message, { level: "error", meta });
      }
    }
    return records;
  };
}
