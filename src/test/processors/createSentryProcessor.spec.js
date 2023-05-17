import {createSentryProcessor} from '../../main/processors/createSentryProcessor';
import {LogLevel} from '../../main/LogLevel';

describe(`createSentryProcessor`, () => {
  let sentryLogger;
  let Raven;

  beforeEach(() => {
    Raven = {
      captureException: jest.fn(),
      captureMessage: jest.fn()
    };
    sentryLogger = createSentryProcessor(Raven);
  });

  it(`saves passed records`, () => {
    const data = [{level: 'foo', messages: [], extraProperty: 123}];
    expect(sentryLogger(data)).toEqual(data);
  });

  it(`calls appropriate Raven function depending on LogLevel.level`, () => {
    sentryLogger([{level: LogLevel.TRACE, messages: ['trace']}]);
    sentryLogger([{level: LogLevel.DEBUG, messages: ['debug']}]);
    sentryLogger([{level: LogLevel.INFO, messages: ['info']}]);
    sentryLogger([{level: LogLevel.WARN, messages: ['warn']}]);
    sentryLogger([{level: LogLevel.ERROR, messages: ['error']}]);

    expect(Raven.captureMessage.mock.calls.length).toBe(4);
    expect(Raven.captureException.mock.calls.length).toBe(1);
  });

  it(`sets SentryOptions.level to 'info' for LogLevel.TRACE/DEBUG/INFO`, () => {
    sentryLogger([{level: LogLevel.TRACE, messages: ['trace']}]);
    expect(Raven.captureMessage).lastCalledWith('trace', {level: 'info'});
    sentryLogger([{level: LogLevel.TRACE, messages: ['debug']}]);
    expect(Raven.captureMessage).lastCalledWith('debug', {level: 'info'});
    sentryLogger([{level: LogLevel.TRACE, messages: ['info']}]);
    expect(Raven.captureMessage).lastCalledWith('info', {level: 'info'});
  });

  it(`sets SentryOptions.level to 'warn' for LogLevel.WARN`, () => {
    sentryLogger([{level: LogLevel.WARN, messages: ['warn']}]);
    expect(Raven.captureMessage).lastCalledWith('warn', {level: 'warn'});
  });

  it(`sets SentryOptions.level to 'error' for LogLevel.ERROR`, () => {
    sentryLogger([{level: LogLevel.ERROR, messages: ['error']}]);
    expect(Raven.captureException).lastCalledWith('error', {level: 'error'});
  });
});
