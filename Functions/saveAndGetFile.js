const fs = require('fs').promises;
const path = require('path');

const saveAndGetFile = async (file) => {
    
    const oldPath = file.filepath;
    const prefix = "";
    const newPath = path.join(process.cwd(), "uploads", prefix + file.originalFilename);

    try {

        await fs.copyFile(oldPath, newPath);

        return { name: file.originalFilename, contentType: file.mimetype };

    } catch (err) {

        return null;
    }
};

module.exports.saveAndGetFile = saveAndGetFile;
