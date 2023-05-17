"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRollingFileAppendProcessor = void 0;
const fs_1 = __importDefault(require("fs"));
const createFileAppendProcessor_1 = require("./createFileAppendProcessor");
function createRollingFileAppendProcessor(_a = {}) {
    var { filePath, maxFileSize = 102400 } = _a, fileAppenderOptions = __rest(_a, ["filePath", "maxFileSize"]);
    const fileAppender = (0, createFileAppendProcessor_1.createFileAppendProcessor)(filePath, fileAppenderOptions);
    let index = 1;
    while (true) {
        try {
            fs_1.default.statSync(createFileName(filePath, index));
        }
        catch (error) {
            break;
        }
        index++;
    }
    return (records) => {
        fs_1.default.stat(filePath, (error, stats) => {
            if (error) {
                return;
            }
            if (stats.size >= maxFileSize) {
                try {
                    fs_1.default.renameSync(filePath, createFileName(filePath, index));
                    index++;
                }
                catch (error) {
                    // Prevent death if rename failed.
                }
            }
        });
        return fileAppender(records);
    };
}
exports.createRollingFileAppendProcessor = createRollingFileAppendProcessor;
function createFileName(path, index) {
    return path + '.' + index;
}
