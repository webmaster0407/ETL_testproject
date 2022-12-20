# ETL_testproject

## TypeScript + Express

This project uses Ajax to upload multiple gzip files in parallel and then processes them in parallel.
At the end of the process, each file is written to the local storage as a file.
The write file cannot be larger than 8 KB and writes the data to another file when the size limit is reached.

## Run
You can run it using "npm start".
Then you go to localhost:3000 using your browser.
The processed files are stored to storage folder.

##
-Thanks!
