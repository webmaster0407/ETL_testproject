import express from "express";
import multer from "multer";

import procGZipToString from "./utils/transform";
import { createWritingProcess } from "./utils/writestream";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

createWritingProcess()

const upload = multer({ dest: "uploads/" })

app.get('/', (req, res) => {
    res.sendFile('template.html', { root: __dirname });
});

app.post('/upload', upload.single("file"), async (req, res) => {
    try {
        if(!req.file) {
            console.log('No file uploaded')
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            procGZipToString(req.file.path)
            res.json({ message: "Successfully uploaded file" })
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on PORT ${port}`));