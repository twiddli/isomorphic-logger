import {createMessageConcatProcessor, stringifyLog} from '../../main/processors/createMessageConcatProcessor';

describe(`createMessageConcatProcessor`, () => {
  let logsConcatenator;

  beforeEach(() => logsConcatenator = createMessageConcatProcessor());

  it(`saves passed records`, () => {
    const args = [{level: 'foo', messages: [], meta: 123}];
    expect(logsConcatenator(args)).toEqual(args);
  });

  it(`returns message with Error.message and meta for single Error type argument`, () => {
    const message = new Error('hello!');
    const records = [{level: 'info', messages: [message]}];
    expect(logsConcatenator(records)[0]).toEqual({
      level: 'info',
      messages: ['hello!'],
      meta: {error: message}
    });
  });

  it(`returns message with stringified object and meta for single object argument`, () => {
    const message = {'foo': 'bar'};
    const records = [{level: 'info', messages: [message]}];
    expect(logsConcatenator(records)[0]).toEqual({
      level: 'info',
      messages: ['{"foo":"bar"}'],
      meta: {object: message}
    });
  });

  it(`returns string message for single argument with primitive type`, () => {
    const recordsA = [{level: 'info', messages: ['string'], meta: {}}];
    const recordsB = [{level: 'info', messages: [123], meta: {}}];
    const recordsC = [{level: 'info', messages: [null], meta: {}}];
    const recordsD = [{level: 'info', messages: [undefined], meta: {}}];
    expect(logsConcatenator(recordsA)[0].messages).toEqual(['string']);
    expect(logsConcatenator(recordsB)[0].messages).toEqual(['123']);
    expect(logsConcatenator(recordsC)[0].messages).toEqual(['null']);
    expect(logsConcatenator(recordsD)[0].messages).toEqual(['undefined']);
  });

  it(`returns concatenated string message and meta for multiple arguments`, () => {
    const object = {foo: 'bar'};
    const error = new Error('exception');
    const records = [{level: 'info', messages: ['Uncaught', error, 'on page with following params', object]}];
    expect(logsConcatenator(records)[0]).toEqual({
      level: 'info',
      messages: [`Uncaught exception (#1) on page with following params {"foo":"bar"} (#2)`],
      meta: {
        '#1': error,
        '#2': object
      }
    });
  });
});

describe(`stringifyLog`, () => {

  it(`accepts Error`, () => {
    expect(stringifyLog(new Error('foo'), 20)).toBe('foo');
  });

  it(`accepts object`, () => {
    expect(stringifyLog({foo:'bar'}, 20)).toBe('{"foo":"bar"}');
  });

  it(`accepts object with cyclic reference`, () => {
    const a = {foo: 'bar'};
    a.qux = a;
    expect(stringifyLog(a, 300)).toBe('{"foo":"bar","qux":"[Circular]"}');
  });

  it(`accepts primitive`, () => {
    expect(stringifyLog('foo bar', 20)).toBe('foo bar');
    expect(stringifyLog(1, 20)).toBe('1');
    expect(stringifyLog(null, 20)).toBe('null');
    expect(stringifyLog(undefined, 20)).toBe('undefined');
  });

  it(`crops with slice`, () => {
    expect(stringifyLog('foo', 2)).toBe('f…');
  });

  it(`crops with RegExp`, () => {
    expect(stringifyLog('foo bar', 5)).toBe('foo…');
    expect(stringifyLog('foo $$', 5)).toBe('foo…');
    expect(stringifyLog('foo:bar', 5)).toBe('foo:…');
    expect(stringifyLog('foo:…', 5)).toBe('foo:…');
  });
});
