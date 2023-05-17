// @flow
import type { Processor, Record } from "../types/LoggerType";
import type { ProcessorOptions } from "../types/LoggerConfigParserType";

type AggregateProcessorOptions = ProcessorOptions & {
  onDispatch: (records: Record[], next: () => any) => void;
};

export function createAggregateProcessor(
  options: AggregateProcessorOptions
): Processor {
  const { onDispatch } = options;
  let resolve;
  let promise;
  let cache = [];

  function next() {
    if (cache.length && resolve) {
      resolve(cache);
      resolve = null;
      promise = null;
      cache = [];
    }
  }

  function tryDispatch() {
    onDispatch(cache, next);
  }

  return (records) => {
    cache.push(...records);

    if (resolve) {
      const nextPromise = promise;
      tryDispatch();
      return nextPromise;
    } else {
      if (!promise) {
        promise = new Promise((resolveSelf) => {
          resolve = resolveSelf;
          tryDispatch();
        });
      }
      return promise;
    }
  };
}
