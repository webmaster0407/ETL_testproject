"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startThread = exports.stopThread = exports.addToWritingQueue = exports.createWritingProcess = void 0;
var fs_1 = __importDefault(require("fs"));
var currentFileName = fileNameGenerator(20);
var currentWritingStream;
var writingQueue = [];
var isRuning = false;
var isSleeping = true;
var limitSize = 8192;
function createWritingProcess() {
    isRuning = true;
    var interval = setInterval(function () {
        if (writingQueue.length > 0) {
            // console.log('current writingqueue status: ', writingQueue)
            var writingString = writingQueue.shift();
            if (writingString != null) {
                if (isSleeping) {
                    currentWritingStream = fs_1.default.createWriteStream(currentFileName);
                    promisify(currentWritingStream).then(function () {
                        console.log('Done');
                    });
                    isSleeping = false;
                }
                // console.log(lengthInUtf8Bytes(writingString), writingString.length)
                if (currentWritingStream.bytesWritten + 4 * lengthInUtf8Bytes(writingString) > limitSize) {
                    currentWritingStream.end();
                    updateWriteStream();
                }
                currentWritingStream.write(writingString);
            }
        }
        else {
            if (!isSleeping)
                currentWritingStream.end();
            isSleeping = true;
        }
        if (!isRuning)
            clearInterval(interval);
    }, 0);
}
exports.createWritingProcess = createWritingProcess;
function addToWritingQueue(data) {
    if (data != null && data.length > 0)
        writingQueue.push(data);
}
exports.addToWritingQueue = addToWritingQueue;
function stopThread() {
    isRuning = false;
}
exports.stopThread = stopThread;
function startThread() {
    isRuning = true;
}
exports.startThread = startThread;
function lengthInUtf8Bytes(str) {
    return str.length;
}
function fileNameGenerator(length) {
    var result = "";
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return './storage/' + result;
}
function updateWriteStream() {
    currentFileName = fileNameGenerator(20);
    currentWritingStream = fs_1.default.createWriteStream(currentFileName);
    promisify(currentWritingStream).then(function () {
        console.log('Done');
    });
}
function promisify(s) {
    return new Promise(function (resolve, reject) {
        var onClose = function () {
            s.off('error', onError);
            resolve();
        };
        var onError = function (error) {
            s.off('close', onClose);
            reject(error);
        };
        s.once('close', onClose);
        s.once('error', onError);
    });
}
