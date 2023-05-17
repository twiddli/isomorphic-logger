import {Logger} from '../main/Logger';
import {LogLevel} from '../main/LogLevel';

describe(`Logger`, () => {

  it('default log level is INFO', () => {
    const l = new Logger();
    expect(l.level).toBe(LogLevel.INFO);
  });
});

describe(`Logger.channel`, () => {

  const processor = records => null;

  it('returns undefined', () => {
    const logger = new Logger;
    expect(logger.channel(processor)).toBeUndefined();
  });

  it('creates channel in logger when function processor is provided', () => {
    const logger = new Logger;
    logger.channel(processor);

    expect(logger.channels).toEqual([{
      processors: [processor],
      promise: undefined
    }]);
  });
});

describe(`Logger.process`, () => {

  it('does not fail if no channel were specified', () => {
    const l = new Logger();
    expect(() => l.log('foo')).not.toThrow();
  });

  it('returns original records if none of them fit current level', () => {
    const l = new Logger();
    l.setLevel(LogLevel.ERROR);
    l.channel(() => null);
    expect(l.trace('foo')).toEqual([
      {level: LogLevel.TRACE, messages: ['foo'], meta: undefined}
    ]);
  });

  it('does not invoke processors if none of the provided records fit current level', () => {
    const fn = jest.fn();
    const l = new Logger();
    l.setLevel(LogLevel.ERROR);
    l.channel(fn);
    l.trace('foo');
    expect(fn).not.toHaveBeenCalled();
  });

  it('invokes synchronously all processors in channel', () => {
    const fn = jest.fn(r => r);
    const l = new Logger();
    l.channel(fn, fn);
    l.log('foo');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('passes result of previous processor to next one', () => {
    const r = {level: LogLevel.INFO, messages: ['bar'], meta: undefined};
    const fn = jest.fn();
    const l = new Logger();
    l.channel(
      rs => [r],
      fn
    );
    l.log('foo');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).lastCalledWith([r]);
  });

  it('stops processing when any synchronous processor returns empty value', () => {
    const fn = jest.fn();
    const l = new Logger();
    l.channel(
      r => null,
      fn
    );
    l.log('foo');
    expect(fn).not.toHaveBeenCalled();
  });

  it('stops processing when any asynchronous processor returns empty value', async () => {
    const fn = jest.fn();
    const l = new Logger();
    l.channel(
      r => Promise.resolve(null),
      fn
    );
    await l.log('foo');
    expect(fn).not.toHaveBeenCalled();
  });

  it('does not invoke processors which were added after channel processing started', async () => {
    const fn1 = jest.fn(r => Promise.resolve(r));
    const fn2 = jest.fn();
    const l = new Logger();
    l.channel(fn1);

    const promise = l.log('foo');

    l.channels[0].processors.push(fn2);

    await promise;
    expect(fn2).not.toHaveBeenCalled();
  });

  it('return Promise if channel contains async processors', () => {
    const l = new Logger();
    l.channel(
      r => Promise.resolve(r)
    );
    expect(l.log('foo')).toBeInstanceOf(Promise);
  });

  it('return Promise if channel contains async processors', async () => {
    const l = new Logger();
    l.channel(
      r => Promise.resolve(r)
    );
    expect(await l.log('foo')).toEqual([
      {level: LogLevel.INFO, messages: ['foo'], meta: undefined}
    ]);
  });

  it('return Promise if channel contains async processors', async () => {
    const l = new Logger();
    l.channel(
      r => Promise.resolve(r)
    );
    expect(await l.log('foo')).toEqual([
      {level: LogLevel.INFO, messages: ['foo'], meta: undefined}
    ]);
  });

  it('preserves logging sequence for async processors', async () => {
    const arr = [];
    const l = new Logger();

    const fn = jest.fn(r => {
      if (r[0].messages[0] === 'foo') {
        return new Promise(resolve => setTimeout(resolve, 200, r));
      } else {
        return r;
      }
    });

    l.channel(
      fn,
      r => arr.push(r[0].messages[0])
    );

    l.log('foo');
    await l.log('bar');

    expect(arr).toEqual(['foo', 'bar']);
  });

  it('each call returns promise to its own completion', async () => {
    const arr = [];
    const l = new Logger();

    const fn1 = jest.fn(r => {
      if (r[0].messages[0] === 'foo') {
        return new Promise(resolve => setTimeout(resolve, 200, r));
      } else {
        return r;
      }
    });

    const fn2 = jest.fn();

    l.channel(
      fn1,
      r => arr.push(r[0].messages[0])
    );

    l.log('foo').then(fn2);
    await l.log('bar').then(fn2);

    expect(fn2.mock.calls).toEqual([
      [
        [{level: LogLevel.INFO, messages: ['foo'], meta: undefined}]
      ],
      [
        [{level: LogLevel.INFO, messages: ['bar'], meta: undefined}]
      ]
    ]);
  });

  it('set channel.promise to null when there are not further logging', async () => {
    const l = new Logger();

    const fn1 = jest.fn(r => new Promise(resolve => setTimeout(resolve, 200, r)));
    const fn2 = jest.fn();

    l.channel(fn1);

    l.log('foo').then(() => fn2(l.channels[0].promise instanceof Promise));
    await l.log('bar').then(() => fn2(l.channels[0].promise instanceof Promise));

    expect(fn2.mock.calls).toEqual([
      [
        true
      ],
      [
        false
      ]
    ]);
  });
});
