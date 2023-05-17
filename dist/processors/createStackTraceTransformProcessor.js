"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStackTraceTransformProcessor = void 0;
function webpackStackCleaner(stack) {
    return stack.replace(/\/[^(\n]+(target.out|webpack:)(~?\/)+/g, '');
}
function createStackTraceTransformProcessor(options = { transformer: webpackStackCleaner }) {
    const { transformer } = options;
    return (records) => records.map(record => (Object.assign(Object.assign({}, record), { messages: record.messages.map(message => {
            if (message instanceof Error) {
                return transformer(message.stack);
            }
            return message;
        }) })));
}
exports.createStackTraceTransformProcessor = createStackTraceTransformProcessor;
