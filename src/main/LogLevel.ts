// @flow

export class LogLevel {
  static TRACE: LogLevel;
  static DEBUG: LogLevel;
  static INFO: LogLevel;
  static WARN: LogLevel;
  static ERROR: LogLevel;
  static OFF: LogLevel;

  value: number;

  static valueOf(name: string) {
    const level = LogLevel[name];
    if (level instanceof LogLevel) {
      return level;
    }
    return null;
  }

  constructor(value: LogLevel | number) {
    if (value instanceof LogLevel) {
      return value;
    }
    this.value = value;
  }

  valueOf() {
    return this.value;
  }
}

LogLevel.TRACE = new LogLevel(0);
LogLevel.DEBUG = new LogLevel(100);
LogLevel.INFO = new LogLevel(200);
LogLevel.WARN = new LogLevel(300);
LogLevel.ERROR = new LogLevel(400);
LogLevel.OFF = new LogLevel(Number.MAX_VALUE);
