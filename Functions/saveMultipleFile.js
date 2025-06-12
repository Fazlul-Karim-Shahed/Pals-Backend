const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

const saveMultipleFile = async (files) => {
    let arr = [];

    if (files && files.length > 0) {
        for (let file of files) {
            const promise = new Promise(async (resolve) => {
                try {
                    const oldPath = file.filepath;
                    const originalFileName = file.originalFilename;
                    const fileExtension = path.extname(originalFileName).toLowerCase();
                    const baseName = path.basename(originalFileName, fileExtension);
                    const convertedFileName = baseName + ".webp";
                    const newPath = path.join(process.cwd(), "uploads", convertedFileName);

                    
                    // Read the original file
                    const inputBuffer = await fs.readFile(oldPath);

                    // Optional logs
                    console.log(`\nProcessing: ${originalFileName}`);
                    console.log("Original size:", (inputBuffer.length / 1024).toFixed(2), "KB");

                    // Compress and convert to webp
                    const compressedBuffer = await sharp(inputBuffer).webp({ quality: 70 }).toBuffer();

                    console.log("Compressed size:", (compressedBuffer.length / 1024).toFixed(2), "KB");

                    // Save the new file
                    await fs.writeFile(newPath, compressedBuffer);

                    resolve({
                        name: convertedFileName,
                        contentType: "image/webp",
                    });
                } catch (err) {
                    console.error("Compression failed for a file:", err);
                    resolve(null); // resolve with null if failed
                }
            });

            arr.push(promise);
        }
    }

    return Promise.all(arr);
};

module.exports.saveMultipleFile = saveMultipleFile;
