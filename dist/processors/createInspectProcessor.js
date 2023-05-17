"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInspectProcessor = void 0;
const object_inspect_1 = __importDefault(require("object-inspect"));
function createInspectProcessor({ depth = 10 } = {}) {
    return (records) => records.map(record => (Object.assign(Object.assign({}, record), { messages: record.messages.map(message => {
            if (typeof message === 'object' || typeof message === 'function') {
                return (0, object_inspect_1.default)(message, { depth });
            }
            return message;
        }) })));
}
exports.createInspectProcessor = createInspectProcessor;
