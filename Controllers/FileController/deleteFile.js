
const fs = require("fs")
const path = require("path")

const deleteFile = async (req, res) => {

    let fileName = req.params.filename
    let filePath = path.join(process.cwd(), "uploads", fileName)

    fs.unlink(filePath, (err) => {
        if (err) {
            res.status(500).send({ message: "Error deleting file" })
        } else {
            res.status(200).send({ message: "File deleted" })
        }
    })

}

module.exports.deleteFile = deleteFile
