"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyLog = exports.createMessageConcatProcessor = void 0;
const safe_json_stringify_1 = __importDefault(require("safe-json-stringify"));
function createMessageConcatProcessor(options = {}) {
    const { stringifyLoggedValue = stringifyLog } = options;
    return (records) => records.map(({ level, messages, meta }) => {
        if (messages.length === 0) {
            return { level, messages, meta };
        }
        meta = Object.assign({}, meta);
        let [message] = messages;
        if (messages.length === 1) {
            if (message instanceof Error) {
                meta.error = message;
                message = message.message;
            }
            else if (typeof message === "object") {
                meta.object = message;
            }
            message = stringifyLoggedValue(message, 50);
        }
        else if (messages.length > 1) {
            let i = 1;
            const parts = [];
            for (let message of messages) {
                if (typeof message === "object") {
                    parts.push(`${stringifyLoggedValue(message, 25)} (#${i})`);
                    meta["#" + i] = message;
                    i += 1;
                }
                else {
                    parts.push(message);
                }
            }
            message = parts.join(" ");
        }
        return { level, messages: [message], meta };
    });
}
exports.createMessageConcatProcessor = createMessageConcatProcessor;
function stringifyLog(value, charLimit) {
    let string;
    if (value instanceof Error) {
        string = value.message;
    }
    else if (typeof value === "object") {
        string = (0, safe_json_stringify_1.default)(value);
    }
    else {
        string = String(value);
    }
    if (string.length < charLimit) {
        return string;
    }
    charLimit -= 1;
    string =
        string.match(new RegExp(`^.{0,${charLimit}}(?=\\s|\\s+\\b|$)`)) ||
            string.slice(0, charLimit);
    return string + "…";
}
exports.stringifyLog = stringifyLog;
