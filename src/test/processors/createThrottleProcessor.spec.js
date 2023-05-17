import {createThrottleProcessor} from '../../main/processors/createThrottleProcessor';

describe('createThrottleProcessor', () => {

  it('processes records after leading delay expires', done => {
    const throttle = createThrottleProcessor({delay: 200, length: Infinity, leading: true});

    const promise = throttle([1]);

    throttle([2]);
    throttle([3]);

    promise.then(records => {
      expect(records).toEqual([1, 2, 3]);
    });

    setTimeout(() => {
      const promise = throttle([4]);

      throttle([5]);
      throttle([6]);

      promise.then(records => {
        expect(records).toEqual([4, 5, 6]);
      });

      done();
    }, 400);
  });

  it('processes records after trailing delay expires', () => {
    const throttle = createThrottleProcessor({delay: 200, length: Infinity, leading: false});

    const promise = throttle([1]);

    setTimeout(throttle, 150, [2]);
    setTimeout(throttle, 300, [3]);
    setTimeout(throttle, 450, [4]);
    setTimeout(throttle, 600, [5]);

    promise.then(records => {
      expect(records).toEqual([1, 2, 3, 4, 5]);
    });
  });

  it('processes records when length limit is reached', () => {
    const throttle = createThrottleProcessor({delay: 200, length: 2, leading: false});

    throttle([1]);
    throttle([2]); // Dispatch occurs after this statement

    const promise = throttle([3]);
    throttle([4]);

    promise.then(records => {
      expect(records).toEqual([3, 4]);
    });
  });

});
