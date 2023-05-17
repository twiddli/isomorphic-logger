import {
  createErrorWrapProcessor,
  defaultCreateStackTrace,
  defaultTestMessage
} from '../../main/processors/createErrorWrapProcessor';
import {LogLevel} from '../../main/LogLevel';

describe(`createErrorWrapProcessor`, () => {

  it(`saves passed records`, () => {
    const records = [{level: 'foo', messages: [], meta: 123}];
    const errorWrapper = createErrorWrapProcessor();
    expect(errorWrapper(records)).toEqual(records);
  });

  it(`wraps logger message with error object`, () => {
    const errorWrapper = createErrorWrapProcessor();
    const message = 'error message';
    const records = [{level: LogLevel.ERROR, messages: [message]}];
    const result = errorWrapper(records);

    expect(result[0].level).toBe(LogLevel.ERROR);
    expect(result[0].messages).toEqual([new Error(message)]);
  });

  it(`trims error stack depending on trimHeadFrames option`, () => {
    const errorWrapperWithoutTrim = createErrorWrapProcessor({trimHeadFrames: 3, loggerStackFrameCount: 0});
    const errorWrapperWithTrim = createErrorWrapProcessor({trimHeadFrames: 5, loggerStackFrameCount: 0});
    const records = [{level: LogLevel.ERROR, messages: ['error message']}];
    const stackA = errorWrapperWithoutTrim(records)[0].messages[0].stack.split('\n');
    const stackB = errorWrapperWithTrim(records)[0].messages[0].stack.split('\n');

    const expectedStack = [...stackA.slice(0, 1), ...stackA.slice(3)];

    expect(expectedStack).toEqual(stackB);
  });
});

describe(`defaultTestMessage`, () => {

  it(`returns true if level is LogLevel.ERROR and i equals zero`, () => {
    expect(defaultTestMessage('foo', LogLevel.ERROR, 0)).toBe(true);
  });

  it(`returns false for all other cases`, () => {
    expect(defaultTestMessage()).toBe(false);
    expect(defaultTestMessage('foo', LogLevel.INFO, 0)).toBe(false);
    expect(defaultTestMessage('foo', LogLevel.ERROR, 1)).toBe(false);
    expect(defaultTestMessage(null, null, null)).toBe(false);
  });
});

describe(`defaultCreateStackTrace`, () => {
  it(`creates a stack trace from type, message and stack frames with function name`, () => {
    expect(
      defaultCreateStackTrace(
        'Type Error',
        'Unexpected Token',
        [{fileName: 'a.js', lineNumber: '10', columnNumber: '20', functionName: 'foo()'}]
      )).toEqual(`Type Error: Unexpected Token\nat foo() (a.js:10:20)`);
  });
  it(`creates a stack trace from type, message and stack frames without function name`, () => {
    expect(
      defaultCreateStackTrace(
        'Type Error',
        'Unexpected Token',
        [{fileName: 'a.js', lineNumber: '10', columnNumber: '20'}]
      )).toEqual(`Type Error: Unexpected Token\nat a.js:10:20`);
  });
});
