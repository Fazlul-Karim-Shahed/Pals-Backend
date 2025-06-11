const { deleteFile } = require("../Controllers/FileControllers/deleteFile");
const { getAllFiles } = require("../Controllers/FileControllers/getAllFiles");

const router = require("express").Router();

router.delete("/:filename", deleteFile);
router.get("/", getAllFiles);

module.exports = router;
