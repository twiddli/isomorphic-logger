"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAggregateProcessor = void 0;
function createAggregateProcessor(options) {
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
        }
        else {
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
exports.createAggregateProcessor = createAggregateProcessor;
