const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

const saveAndGetFile = async (file) => {
    const oldPath = file.filepath;
    const originalFileName = file.originalFilename;
    const fileExtension = path.extname(originalFileName).toLowerCase();
    const baseName = path.basename(originalFileName, fileExtension);
    const convertedFileName = baseName + ".webp";
    const newPath = path.join(process.cwd(), "uploads", convertedFileName);

    try {
        // Read the original image file
        const inputBuffer = await fs.readFile(oldPath);
        console.log("Original size:", (inputBuffer.length / 1024).toFixed(2), "KB");

        // Use sharp to compress and convert to webp
        const compressedBuffer = await sharp(inputBuffer).webp({ quality: 70 }).toBuffer();

        console.log("Compressed size:", (compressedBuffer.length / 1024).toFixed(2), "KB");

        // Save the compressed image with the .webp extension
        await fs.writeFile(newPath, compressedBuffer);

        // Optional: delete the original uploaded file if needed
        // await fs.unlink(oldPath);

        console.log(convertedFileName)
        return {
            name: convertedFileName,
            contentType: "image/webp",
        };
    } catch (err) {
        console.error("Image compression failed:", err);
        return null;
    }
};

module.exports.saveAndGetFile = saveAndGetFile;
