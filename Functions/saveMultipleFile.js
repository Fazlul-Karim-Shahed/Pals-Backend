

const fs = require('fs')
const path = require('path');

const saveMultipleFile = async (files) => {


    let arr = []

    if (files && files.length > 0) {

        for (let i in files) {

            let x = new Promise(resolve => {

                const prefix = ""
                const oldPath = files[i].filepath;
                const newPath = path.join(process.cwd(), "uploads", prefix + files[i].originalFilename);

                fs.copyFile(oldPath, newPath, (err) => {
                    if (err) {
                        return null;
                    }
                    resolve({
                        contentType: files[i].mimetype,
                        name: prefix + files[i].originalFilename,
                    })

                });
            })

            arr.push(x)
        }
    }

    return Promise.all(arr)
    ll
};

module.exports.saveMultipleFile = saveMultipleFile;
