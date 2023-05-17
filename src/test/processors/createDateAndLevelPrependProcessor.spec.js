import {LogLevel} from '../../main/LogLevel';
import {createDateAndLevelPrependProcessor, getLogLevelName} from '../../main/processors/createDateAndLevelPrependProcessor';

describe(`getLogLevelName`, () => {
  it(`returns human readable name of log level`, () => {
    expect(getLogLevelName(LogLevel.TRACE)).toBe('TRACE');
    expect(getLogLevelName(LogLevel.DEBUG)).toBe('DEBUG');
    expect(getLogLevelName(LogLevel.INFO)).toBe('INFO');
    expect(getLogLevelName(LogLevel.WARN)).toBe('WARN');
    expect(getLogLevelName(LogLevel.ERROR)).toBe('ERROR');
    expect(getLogLevelName(LogLevel.OFF)).toBe('OFF');

    expect(getLogLevelName(0)).toBe('TRACE');
    expect(getLogLevelName(100)).toBe('DEBUG');
    expect(getLogLevelName(200)).toBe('INFO');
    expect(getLogLevelName(300)).toBe('WARN');
    expect(getLogLevelName(400)).toBe('ERROR');
    expect(getLogLevelName(Number.MAX_VALUE)).toBe('OFF');

    expect(getLogLevelName('foo')).toBe('foo');
    expect(getLogLevelName(123)).toBe(123);
  });

  it(`prepends level and and current date to record.message`, () => {
    const dateAndLevelPrepender = createDateAndLevelPrependProcessor({dateFormat: 'YYYY'});
    const records = dateAndLevelPrepender([{level: LogLevel.TRACE, messages: ['foo']}]);
    const [level, date, message] = records[0].messages;
    expect(level).toBe('TRACE');
    expect(date).toBe(new Date().getFullYear().toString());
    expect(message).toBe('foo');
  });
});
