import {createInspectProcessor} from '../../main/processors/createInspectProcessor';

describe('createInspectProcessor', () => {
  it(`inspects given record.message in accordance with passed depth (depth=3)`, () => {
    const inspector = createInspectProcessor({depth: 3});
    const result = inspector([{messages: [
      {foo: {bar: {baz: {qux: {foo: {bar: {}}}}}}}
    ]}]);
    expect(result[0].messages[0]).toBe('{ foo: { bar: { baz: [Object] } } }')
  });

  it(`inspects given record.message in accordance with passed depth (depth=5)`, () => {
    const inspector = createInspectProcessor({depth: 5});
    const result = inspector([{messages: [
      {foo: {bar: {baz: {qux: {foo: {bar: {}}}}}}}
    ]}]);
    expect(result[0].messages[0]).toBe('{ foo: { bar: { baz: { qux: { foo: [Object] } } } } }')
  });

  it(`inspects given record.message in accordance with no passed depth (default is 10)`, () => {
    const inspector = createInspectProcessor();
    const result = inspector([{messages: [
      {foo: {bar: {baz: {qux: {foo: {bar: {baz: {qux: {foo: {foo: {bar: {baz: {qux: {foo: {bar: {baz: {qux: {foo: {}}}}}}}}}}}}}}}}}}}
    ]}]);
    expect(result[0].messages[0]).toBe('{ foo: { bar: { baz: { qux: { foo: { bar: { baz: { qux: { foo: { foo: [Object] } } } } } } } } } }')
  });
});
