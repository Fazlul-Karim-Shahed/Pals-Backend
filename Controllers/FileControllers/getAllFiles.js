const fs = require("fs");
const path = require("path");

const getAllFiles = async (req, res) => {
    try {
        const uploadsDir = path.join(process.cwd(), "uploads");
        const files = await fs.promises.readdir(uploadsDir); // ✅ this waits properl

        res.send({ message: "All files in database", error: false, data: files });
    } catch (err) {
        console.error("Error reading uploads directory:", err);
        res.status(500).send({ message: "Failed to read files", error: true, data: [] });
    }
};

module.exports.getAllFiles = getAllFiles;
