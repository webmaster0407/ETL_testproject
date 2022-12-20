import fs from 'fs'
import stream from 'stream'

var currentFileName: string = fileNameGenerator(20)
var currentWritingStream: fs.WriteStream

var writingQueue: string[] = []

var isRuning: boolean = false
var isSleeping: boolean = true

const limitSize = 8192 // limit size of file

export function createWritingProcess() {
    isRuning = true

    // Start writing process as thread
    let interval = setInterval(() => {
        // if writing queus is not empty start writing from its start point
        if (writingQueue.length > 0) {
            var writingString = writingQueue.shift()
            if (writingString != null) {
                if (isSleeping) {
                    currentWritingStream = fs.createWriteStream(currentFileName)
                    promisify(currentWritingStream).then(() => {
                        console.log('Done')
                    })
                    isSleeping = false
                }

                // If the size of current file will be larger than limit size, create new file
                if (currentWritingStream.bytesWritten + 4 * lengthInUtf8Bytes(writingString) > limitSize) {
                    currentWritingStream.end()
                    updateWriteStream()
                }

                currentWritingStream.write(writingString)
            }
        } else {
            if(!isSleeping) currentWritingStream.end()
            isSleeping = true
        }
        
        if (!isRuning) clearInterval(interval)
    }, 0)
}

export function addToWritingQueue(data: string) {
    if (data != null && data.length > 0) writingQueue.push(data)
}

export function stopThread() {
    isRuning = false
}

export function startThread() {
    isRuning = true
}

function lengthInUtf8Bytes(str: string) {
    return str.length;
}

function fileNameGenerator(length: number) {
    var result = "";
    var characters = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return './storage/' + result;
}

function updateWriteStream() {
    currentFileName = fileNameGenerator(20)
    currentWritingStream = fs.createWriteStream(currentFileName)
    promisify(currentWritingStream).then(() => {
        console.log('Done')
    })
}

function promisify(s: stream.Stream): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const onClose = () => {
            s.off('error', onError);
            resolve();
        };
        const onError = (error: Error) => {
            s.off('close', onClose);
            reject(error);
        };
    
        s.once('close', onClose);
        s.once('error', onError);
    });
}