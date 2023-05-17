import {createConsoleProcessor} from '../../main/processors/createConsoleProcessor';
import {LogLevel} from '../../main/LogLevel';

describe(`createConsoleProcessor`, () => {
  beforeEach(() => {
    global.console = {
      log: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
  });

  it(`calls global.console.debug for record.level = TRACE and record.level.DEBUG`, () => {
    const consoleAppender = createConsoleProcessor();
    consoleAppender([{level: LogLevel.TRACE, messages: ['trace']}]);
    expect(global.console.debug).lastCalledWith('trace');

    consoleAppender([{level: LogLevel.DEBUG, messages: ['debug']}]);
    expect(global.console.debug).lastCalledWith('debug');
  });

  it(`calls global.console.info for record.level = INFO`, () => {
    const consoleAppender = createConsoleProcessor();
    consoleAppender([{level: LogLevel.INFO, messages: ['info']}]);
    expect(global.console.info).lastCalledWith('info');
  });

  it(`calls global.console.warn for record.level = WARN`, () => {
    const consoleAppender = createConsoleProcessor();
    consoleAppender([{level: LogLevel.WARN, messages: ['warn']}]);
    expect(global.console.warn).lastCalledWith('warn');
  });

  it(`calls global.console.error for record.level = ERROR`, () => {
    const consoleAppender = createConsoleProcessor();
    consoleAppender([{level: LogLevel.ERROR, messages: ['error']}]);
    expect(global.console.error).lastCalledWith('error');
  });
});
