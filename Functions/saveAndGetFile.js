
// This is for cloudinary

const sharp = require("sharp");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;
const stream = require("stream");

const MAX_SIZE_KB = 400;

const compressToTargetSize = async (inputBuffer, fileExtension) => {
    let quality = 90;
    let compressedBuffer;
    let sharpInstance = sharp(inputBuffer);

    const metadata = await sharpInstance.metadata();
    if (metadata.width > 1500) {
        sharpInstance = sharpInstance.resize({ width: 1500 });
    }

    while (quality >= 30) {
        if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
            compressedBuffer = await sharpInstance.clone().jpeg({ quality }).toBuffer();
        } else if (fileExtension === ".png") {
            compressedBuffer = await sharpInstance.clone().png({ compressionLevel: 9 }).toBuffer();
        } else if (fileExtension === ".webp") {
            compressedBuffer = await sharpInstance.clone().webp({ quality }).toBuffer();
        } else {
            return null;
        }

        if (compressedBuffer.length / 1024 <= MAX_SIZE_KB) {
            return compressedBuffer;
        }

        quality -= 10;
    }

    return compressedBuffer;
};

const saveAndGetFile = async (file) => {
    const inputBuffer = await fs.readFile(file.filepath);
    const fileExtension = path.extname(file.originalFilename).toLowerCase();
    const baseName = path.basename(file.originalFilename, fileExtension);

    const compressedBuffer = await compressToTargetSize(inputBuffer, fileExtension);
    if (!compressedBuffer) {
        console.log("Unsupported format or compression failed.");
        return null;
    }

    return await new Promise((resolve) => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "uploads",
                public_id: baseName,
                resource_type: "image",
                overwrite: true,
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload failed:", error);
                    resolve(null);
                } else {
                    resolve({
                        ...result,
                        name: file.originalFilename,
                        contentType: file.mimetype,
                    });
                }
            }
        );

        const bufferStream = new stream.PassThrough();
        bufferStream.end(compressedBuffer);
        bufferStream.pipe(uploadStream);
    });
};

module.exports.saveAndGetFile = saveAndGetFile;





// This is for local upload 









// const fs = require("fs").promises;
// const path = require("path");
// const sharp = require("sharp");

// const MAX_SIZE_KB = 400;

// const compressToTargetSize = async (inputBuffer, fileExtension) => {
//     let quality = 90;
//     let compressedBuffer;
//     let sharpInstance = sharp(inputBuffer);

//     // Resize if too large (optional but helpful)
//     const metadata = await sharpInstance.metadata();
//     if (metadata.width > 1500) {
//         sharpInstance = sharpInstance.resize({ width: 1500 });
//     }

//     while (quality >= 30) {
//         if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
//             compressedBuffer = await sharpInstance.clone().jpeg({ quality }).toBuffer();
//         } else if (fileExtension === ".png") {
//             compressedBuffer = await sharpInstance.clone().png({ compressionLevel: 9 }).toBuffer();
//         } else if (fileExtension === ".webp") {
//             compressedBuffer = await sharpInstance.clone().webp({ quality }).toBuffer();
//         } else {
//             return null; // Unsupported
//         }

//         if (compressedBuffer.length / 1024 <= MAX_SIZE_KB) {
//             return compressedBuffer;
//         }

//         quality -= 10;
//     }

//     // Return lowest quality attempt even if not under threshold
//     return compressedBuffer;
// };

// const saveAndGetFile = async (file) => {
//     const oldPath = file.filepath;
//     const originalFileName = file.originalFilename;
//     const fileExtension = path.extname(originalFileName).toLowerCase();
//     const baseName = path.basename(originalFileName, fileExtension);
//     const newFileName = baseName + fileExtension;
//     const newPath = path.join(process.cwd(), "uploads", newFileName);

//     try {
//         const inputBuffer = await fs.readFile(oldPath);
//         console.log("Original size:", (inputBuffer.length / 1024).toFixed(2), "KB");

//         let compressedBuffer = await compressToTargetSize(inputBuffer, fileExtension);

//         if (!compressedBuffer) {
//             console.log("Unsupported format or compression failed, copying original.");
//             await fs.copyFile(oldPath, newPath);
//             return {
//                 name: newFileName,
//                 contentType: file.mimetype,
//             };
//         }

//         console.log("Compressed size:", (compressedBuffer.length / 1024).toFixed(2), "KB");

//         await fs.writeFile(newPath, compressedBuffer);
//         console.log("=======> ", newFileName);

//         return {
//             name: newFileName,
//             contentType: file.mimetype,
//         };
//     } catch (err) {
//         console.error("Image compression failed:", err);
//         return null;
//     }
// };

// module.exports.saveAndGetFile = saveAndGetFile;
