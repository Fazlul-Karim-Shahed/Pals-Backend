const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { IncomingForm } = require("formidable");

const uploadFiles = async (req, res) => {
    const form = new IncomingForm({
        multiples: false,
        keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error("Formidable error:", err);
            return res.status(500).json({ error: true, message: "Upload failed." });
        }

        let file = files.file;

        if (Array.isArray(file)) file = file[0];
        if (!file) {
            return res.status(400).json({ error: true, message: "No file uploaded." });
        }

        const tempPath = file.filepath || file.path;
        if (!tempPath) {
            return res.status(400).json({ error: true, message: "File path missing." });
        }

        // Clean original filename
        let originalName = file.originalFilename || `upload-${Date.now()}`;
        originalName = originalName.split(/[/\\]/).pop();

        const uploadDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const newPath = path.join(uploadDir, originalName);

        // Use copy + unlink to avoid EXDEV error
        fs.copyFile(tempPath, newPath, (copyErr) => {
            if (copyErr) {
                console.error("Copy error:", copyErr);
                return res.status(500).json({ error: true, message: "File saving failed." });
            }

            // Delete temp file
            fs.unlink(tempPath, (unlinkErr) => {
                if (unlinkErr) {
                    console.warn("Warning: temp file not deleted", unlinkErr);
                }

                return res.status(200).json({
                    error: false,
                    message: "File uploaded successfully.",
                    fileName: originalName,
                    filePath: `/uploads/${originalName}`,
                });
            });
        });
    });
};

module.exports.uploadFiles = uploadFiles;
