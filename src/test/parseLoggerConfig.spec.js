import {parseLoggerConfig} from '../main/parseLoggerConfig';
import {Logger} from '../main/Logger';
import {LogLevel} from '../main/LogLevel';

jest.mock('../main/Logger', () => {
  const Logger = jest.fn(function() {
    this.channels = [];
    this.setLevel = jest.fn();
    this.channel = jest.fn(function(...processors) {
      this.channels.push({processors});
    });
  });
  return {Logger};
});

describe('parseLoggerConfig', () => {

  it(`creates an instance of logger for empty object`, () => {
    const logger = parseLoggerConfig({});
    expect(logger).toBeInstanceOf(Logger);
  });

  it(`creates an instance of logger from null`, () => {
    const logger = parseLoggerConfig(null);
    expect(logger).toBeInstanceOf(Logger);
  });

  it(`calls Logger.setLevel if config.level is present`, () => {
    const logger = parseLoggerConfig({level: 'INFO'});
    expect(logger.setLevel).lastCalledWith(LogLevel.INFO);
  });

  it(`throws if log level is unknown`, () => {
    expect(() => parseLoggerConfig({level: 'foo'})).toThrow();
  });

  it(`creates runs through channels[][processors] and throws error if processor creator is not described in schema`, () => {
    expect(() => parseLoggerConfig({channels: [[{type: 'foo'}]]})).toThrow();
  });

  it(`creates runs through channels[][processors] and creates a processor using ProcessorFactories map and passes options`, () => {
    const fooCreator = jest.fn();
    const logger = parseLoggerConfig({
      channels: [
        [
          {
            type: 'foo',
            options: {
              bar: 'baz'
            }
          }
        ]
      ]
    }, {foo: fooCreator});
    expect(fooCreator).lastCalledWith({bar: 'baz'});
  });

  it(`creates runs through channels[][processors] and creates a Logger if type is "logger"`, () => {
    const logger = parseLoggerConfig({
      channels: [
        [
          {
            type: 'logger',
            options: {level: 'ERROR'}
          }
        ]
      ]
    });
    expect(logger.channels[0].processors[0]).toBeInstanceOf(Logger);
  });

  it(`creates a complicated logger with inner loggers and processors`, () => {
    const loggerConfig = {
      level: 'INFO',
      channels: [
        [
          {type: 'foo', options: {foo: 'foo'}},
          {type: 'bar', options: {bar: 'bar'}}
        ],
        [
          {type: 'baz'},
          {type: 'logger', options: {
            level: 'WARN',
            channels: [
              [
                {type: 'foo'},
                {type: 'logger', options: {
                  level: 'ERROR',
                  channels: [
                    [
                      {type: 'qux', options: 'qux'}
                    ]
                  ]
                }}
              ]
            ]
          }}
        ]
      ]
    };
    const processorFactories = {
      foo: jest.fn(() => 123),
      bar: jest.fn(() => 'bar'),
      baz: jest.fn(() => true),
      qux: jest.fn(() => () => {})
    };
    const logger = parseLoggerConfig(loggerConfig, processorFactories);

    expect(logger).toBeInstanceOf(Logger);
    expect(logger.setLevel).lastCalledWith(LogLevel.INFO);
    expect(logger.channels[0].processors[0]).toBe(123);
    expect(logger.channels[0].processors[1]).toBe('bar');
    
    expect(logger.channels[1].processors[0]).toBe(true);
    expect(logger.channels[1].processors[1]).toBeInstanceOf(Logger);
    expect(logger.channels[1].processors[1].setLevel).lastCalledWith(LogLevel.WARN);
    expect(logger.channels[1].processors[1].channels[0].processors[0]).toBe(123);

    expect(logger.channels[1].processors[1].channels[0].processors[1]).toBeInstanceOf(Logger);
    expect(logger.channels[1].processors[1].channels[0].processors[1].setLevel).lastCalledWith(LogLevel.ERROR);
    expect(logger.channels[1].processors[1].channels[0].processors[1].channels[0].processors[0]).toBeInstanceOf(Function);

    expect(processorFactories.foo.mock.calls.length).toBe(2);
    expect(processorFactories.foo).lastCalledWith(undefined);
    expect(processorFactories.bar).lastCalledWith({bar: 'bar'});
    expect(processorFactories.baz.mock.calls.length).toBe(1);
    expect(processorFactories.baz).lastCalledWith(undefined);
    expect(processorFactories.qux.mock.calls.length).toBe(1);
    expect(processorFactories.qux).lastCalledWith('qux');

  });
});
