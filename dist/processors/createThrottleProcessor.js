"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThrottleProcessor = void 0;
const createAggregateProcessor_1 = require("./createAggregateProcessor");
function createThrottleProcessor(options = {
    delay: 1000,
    length: 1000,
    leading: true
}) {
    const { delay, length, leading } = options;
    let timeout;
    return (0, createAggregateProcessor_1.createAggregateProcessor)({
        onDispatch(records, next) {
            if (records.length < length) {
                // Aggregator did not collect enough records yet.
                if (leading) {
                    if (!timeout) {
                        timeout = setTimeout(() => {
                            timeout = 0;
                            next();
                        }, delay);
                    }
                }
                else {
                    timeout = setTimeout(next, delay);
                }
            }
            else {
                clearTimeout(timeout);
                next();
            }
        }
    });
}
exports.createThrottleProcessor = createThrottleProcessor;
