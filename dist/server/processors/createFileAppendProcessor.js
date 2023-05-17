"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileAppendProcessor = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function createFileAppendProcessor({ filePath, encoding = 'utf8', lineBreak = '\n', basedir = __dirname } = {}) {
    return (records) => {
        fs_1.default.appendFile(path_1.default.resolve(basedir, filePath), records.join(lineBreak) + lineBreak, encoding, error => {
            if (error) {
                console.error(error);
            }
        });
        return records;
    };
}
exports.createFileAppendProcessor = createFileAppendProcessor;
