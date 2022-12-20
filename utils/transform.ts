import { gunzip } from "zlib"
import fs, { unlink } from "fs-extra"
import { addToWritingQueue } from "./writestream";

export default function procGZipToString(source: string) {
    var input = fs.createReadStream(source)  
    var chunks : Uint8Array[] = []

    // Load gzip file and push bytes to chunks
    input.on('data', function(chunk) {
        chunks.push(Buffer.from(chunk));
    }).on('end', function() {
        var buf = Buffer.concat(chunks);
        
        // unzip gzip bytes
        gunzip(buf, async function(err, buffer) {
            if (!err) {
                // delete uploaded file after unzip
                try {
                    await unlink(source)
                    console.log('Successfully deleted ' + source)
                } catch (error : any) {
                    console.log("There is an error ", error.message)
                }

                // convert extracted buffer to string
                var uploadedString = buffer.toString()

                // convert original string to JSON object
                var originalJSONObj = JSON.parse(uploadedString)
                
                // console.log(originalJSONObj)

                // create new JSON object
                var outputJSONObj = JSON.parse('{}')

                // add timestamp to outputJSON object from original JSON object
                outputJSONObj.timestamp = originalJSONObj.ts

                // parse url
                var url : string = originalJSONObj.u
                var parsedURL = ParseURL(url)
                
                // add parsed url if it exists
                if (parsedURL != null) {
                    outputJSONObj.url_object = parsedURL
                }

                // add event content
                outputJSONObj.ec = originalJSONObj.e

                // convert JSON object to string
                var outputString = JSON.stringify(outputJSONObj)

                // add result string to writing queue for saving
                addToWritingQueue(outputString)
                
                // console.log(outputString)
            } else {
                console.log(err);
            }
        });
    });
}

export function ParseURL(url: string) {
    var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?")
    var matches = url.match(pattern)
    if (matches != null) {
        var domain = matches[4]
        var path = matches[5]
        var query = matches[7]
        var hash = matches[9] != null ? matches[9] : ''
        
        var query_objects = JSON.parse('{}')
        if (query != null) {
            var objects = query.match(/([a-z0-9A-Z%])+/g)
            if (objects != null) {                                
                for (var i = 0; i < objects.length; i += 2) {
                    query_objects[objects[i].toString()] = objects[i + 1]
                }
            }
        }
        return {
            "domain": domain,
            "path": path,
            "query_object": query_objects,
            "hash": hash
        }
    } else {
        return null
    }
}


