import {createAggregateProcessor} from '../../main/processors/createAggregateProcessor';

describe(`createAggregateProcessor`, () => {

  it('flushes cache between processes', async () => {
    const onDispatch = (records, next) => {
      if (records.length > 1) {
        next();
      }
    };
    const aggregate = createAggregateProcessor({onDispatch});

    aggregate([1]);
    aggregate([2]); // Flush should happen after this statement.

    const promise = aggregate([3]);
    aggregate([4]);

    expect(await promise).toEqual([3, 4]);
  });

  it('onDispatch can do asynchronous process', async () => {
    const onDispatch = (records, next) => {
      if (records.length > 1) {
        setTimeout(next, 10);
      }
      // Predicate always returns false, but invokes process asynchronously.
      return false;
    };
    const aggregate = createAggregateProcessor({onDispatch});

    const promise = aggregate([1]);

    expect(promise).toBe(aggregate([2])); // setTimeout is called after this statement.
    expect(promise).toBe(aggregate([3])); // setTimeout is called after this statement as well.

    // All messages would go to the same promise because they are dispatched asynchronously
    // but added synchronously to buffer.

    expect(await promise).toEqual([1, 2, 3]);
  });

});
