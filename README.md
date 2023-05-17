# Isomorphic Logger

> FORK

Tiny isomorphic logger that has the same semantics on the server and on the client with multi-channel support and modular structure.

```js
import {Logger, createConsoleProcessor} from '@grabrinc/isomorphic-logger';

const logger = new Logger;

logger.channel(createConsoleProcessor());

logger.log('Hello world!', {foo: 'bar'}); // → Prints "Hello world! {foo: 'bar'}" to console
```


## Logging

These methods are available on `Logger` instance and log messages at corresponding log level:

- `trace(...messages)`
- `debug(...messages)`
- `info(...messages)` there's a convinient alias `log(...messages)`
- `warn(...messages)`
- `error(...messages)`

Each method accepts an arbitrary number of arguments as `console.log` does.


## Logging Level

Setting log level on `Logger` instance allows to limit verbosity of the output:

```js
import {LogLevel} from '@grabrinc/isomorphic-logger';

// Now messages with warn level or higher are logged.
logger.setLevel(LogLevel.WARN);
```

Following log levels are available out-of-the-box:

- `LogLevel.TRACE`
- `LogLevel.DEBUG`
- `LogLevel.INFO`
- `LogLevel.WARN`
- `LogLevel.ERROR`
- `LogLevel.OFF` no messages would be logged with this level.

You can create your own log level via instantinating `LogLevel` class:

```js
logger.setLevel(new LogLevel(150));
```


### Logging Level Test

If you want to perform heavy computations when particular logging level is set, you can use logging level test methods:

```js
if (logger.isDebugEnabled()) {
  // Do heavy stuff here
  logger.debug('Computation results');
}
```

These methods are availeble on `Logger` instance:
- `isTraceEnabled()`
- `isDebugEnabled()`
- `isInfoEnabled()`
- `isWarnEnabled()`
- `isErrorEnabled()`


## Channels

To set up a logger instance you need to define at least one channel.

Channel consists of processors that are executed one after another and can be asynchronous.

```js
import {
  Logger,
  createStackTraceTransformProcessor,
  createDateAndLevelPrependProcessor,
  createThrottleProcessor,
  createConsoleProcessor
} from '@grabrinc/isomorphic-logger';
import Sentry from 'raven-js';

logger.channel(
  createStackTraceTransformProcessor(),              // Converts error objects to string representing stack trace.
  createDateAndLevelPrependProcessor(),              // Prepends every message with date and time.
  createThrottleProcessor({delay: 500, length: 10}), // Batch logged messages.
  createConsoleProcessor()                           // Write batched messages to console.
);

logger.channel(
  createMessageConcatProcessor(), // Concat all messages into a single string.
  createErrorWrapProcessor(),     // Wrap message into an Error object and trim excessive stack frames.
  createSentryProcessor(Sentry)   // Send messages to Sentry.
);

logger.log('Hello there!') // This is logged to both console and Sentry
```

Even if the channel contains an asynchronous processor, messages are guaranteed to be logged in the original order.

Logger itself is also a processor, so you can nest one logger into another:

```js
const errorLogger = new Logger();
errorLogger.setLevel(LogLevel.ERROR);
errorLogger.channel(createSentryProcessor(Sentry));

const logger = new Logger();
logger.setLevel(LogLevel.TRACE);
logger.channel(createConsoleProcessor());
logger.channel(errorLogger);


logger.log('Foo'); // This is logged in the console only

logger.error('Oh snap!') // This is logged in the console and send to Sentry
```


### Available Processors

Following processors are available at the moment:

- [`createAggregateProcessor()`](src/main/processors/createAggregateProcessor.js)
- [`createConsoleProcessor()`](src/main/processors/createConsoleProcessor.js)
- [`createDateAndLevelPrependProcessor()`](src/main/processors/createDateAndLevelPrependProcessor.js)
- [`createErrorWrapProcessor()`](src/main/processors/createErrorWrapProcessor.js)
- [`createInspectProcessor()`](src/main/processors/createInspectProcessor.js)
- [`createMessageConcatProcessor()`](src/main/processors/createMessageConcatProcessor.js)
- [`createSentryProcessor()`](src/main/processors/createSentryProcessor.js)
- [`createStackTraceTransformProcessor()`](src/main/processors/createStackTraceTransformProcessor.js)
- [`createThrottleProcessor()`](src/main/processors/createThrottleProcessor.js)

There are also server-only processors available which can be imported from `@grabrinc/isomorphic-logger/server`:

- [`createHighlightProcessor()`](src/main/server/processors/createHighlightProcessor.js)
- [`createFileAppendProcessor()`](src/main/server/processors/createFileAppendProcessor.js) Unstable!
- [`createRollingFileAppendProcessor()`](src/main/server/processors/createRollingFileAppendProcessor.js) Unstable!


### How to create a custom processor?

A processor is a function that receives a set of records:

```flow
type Record = {
  level: LogLevel,
  messages: Array<*>
}

function myCustomProcessor(records: Record[]): Promise<Record[]> | Record[] | Promise<null> | null {
  return records;
}
```

Or an object that has `process` function property:

```js
const myCustomProcessor = {

  process(records: Record[]): Promise<Record[]> | Record[] | Promise<null> | null {
    return records;
  }
}
```

A processor should do some stuff with messages and return a new set of records that is passed to the next processor.

If processor returns false value than next processor is not invoked.

A processor can return `Promise` that is awaited before proceeding to next processor.

If you need to ensure logging was completed before continuing code execution you can:

```js
await logger.error('Wait for this messages to log!', error);
```


## Declarative Logger Configuration

Logger can be created from JSON configuration:

```js
import {parseLoggerConfig, ProcessorFactories} from '@grabrinc/isomorphic-logger';

const loggerConfig = {
  level: 'TRACE',
  channels: [
    [
      {type: 'throttle', options: {delay: 1000, length: 10}}
      {type: 'extractStackTrace'},
      {type: 'highlight'},
      {type: 'console'}
    ],
    [
      {
        type: 'logger',
        options: {
          level: 'ERROR',
          channels: [
            [
              {type: 'prependDateAndLevel'},
              {type: 'console'}
            ]
          ]
        }
      }
    ]
  ]
};

const logger = parseLoggerConfig(loggerConfig, ProcessorFactories);
```

## License

The code is available under [MIT license](LICENSE.txt).
