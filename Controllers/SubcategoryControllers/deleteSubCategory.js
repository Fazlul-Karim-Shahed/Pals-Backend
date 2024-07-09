
const { SubCategoryModel } = require("../../Models/SubCategoryModel")


const deleteSubCategory = async (req, res) => {


    let subCategory = await SubCategoryModel.deleteOne({ _id: req.params.subCategoryId })

    if (subCategory.deletedCount != 0) {

        res.status(200).send({ message: 'Sub Category deleted successfully', error: false })
    }
    else {
        res.send({ message: 'No Sub Category found', error: true })
    }

}

module.exports.deleteSubCategory = deleteSubCategory