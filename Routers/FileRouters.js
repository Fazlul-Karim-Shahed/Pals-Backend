const { deleteFile } = require("d:/Skills/Web Development/KONCEPT_TECH/QOC_Learning/Controllers/FileController/deleteFile");
const { getAllFiles } = require("d:/Skills/Web Development/KONCEPT_TECH/QOC_Learning/Controllers/FileController/getAllFiles");

const router = require("express").Router();

router.delete("/:filename", deleteFile);
router.get("/", getAllFiles)

module.exports = router;
