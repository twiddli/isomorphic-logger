import {createStackTraceTransformProcessor} from '../../main/processors/createStackTraceTransformProcessor';

describe(`createStackTraceTransformProcessor`, () => {
  it(`invokes transformer function if a message is an instance of Error class`, () => {
    const transformer = jest.fn();
    const stackTraceExtractor = createStackTraceTransformProcessor({transformer});
    stackTraceExtractor([{messages: [new Error]}]);
    expect(transformer.mock.calls.length).toBe(1);
  });

  it(`replaces Error with string and passes Error.stack to a transformer`, () => {
    const approver = jest.fn();
    const transformer = (stack) => {
      if (typeof stack === 'string') {
        approver();
      }
      return 'foo stack';
    };
    const stackTraceExtractor = createStackTraceTransformProcessor({transformer});
    const records = stackTraceExtractor([{messages: [new Error]}]);
    const [error] = records[0].messages;
    expect(approver.mock.calls.length).toBe(1);
    expect(error).toBe('foo stack');
  });
});
