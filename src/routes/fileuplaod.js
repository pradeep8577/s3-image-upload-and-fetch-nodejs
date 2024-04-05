const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const upload = require("../utils/upload");
const File = require("../models/fileModels");
const { v4: uuidv4 } = require('uuid');

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        // Ensure that req.file is populated with necessary fields
        if (!req.file || !req.file.originalname || !req.file.size || !req.file.key) {
            return res.status(400).json({ error: "Invalid file data" });
        }

        // Create a new File document
        const file = new File({
            filename: req.file.originalname,
            size: req.file.size,
            uuid:  uuidv4(),
            path: req.file.key, // Use the S3 object key instead of local path
        });

        // Save the File document to the database
        await file.save();

        // Return a response with the UUID of the uploaded file
        return res.json({ uuid: file.uuid });
    } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({ error: "Failed to upload file" });
    }
});


// list of all file
router.get("/files", async (req, res) => {
    const files = await File.find();
    return res.json(files);
});


// get file by uuid
router.get("/files/:uuid", async (req, res) => {
    const file = await File.findOne({ uuid: req.params.uuid });
    return res.json(file);
}
);

// delete file by uuid
router.delete("/files/:uuid", async (req, res) => {
    try {
        const file = await File.findOneAndDelete({ uuid: req.params.uuid });
        if (!file) {
            return res.status(400).json({ error: "File not found" });
        }
        return res.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Error deleting file:", error);
        return res.status(500).json({ error: "Failed to delete file" });
    }
});

// read file by uuid
router.get("/files/download/:uuid", async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            return res.status(400).json({ error: "File not found" });
        }
        // // Return a response with the S3 object key of the file
        // return res.json({ key: file.path });

        // return the file 
        return res.redirect(process.env.AWS_BUCKET_URL + file.path);

    } catch (error) {
        console.error("Error downloading file:", error);
        return res.status(500).json({ error: "Failed to download file" });
    }
});


module.exports = router;


