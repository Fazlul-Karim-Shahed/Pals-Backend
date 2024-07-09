
const { BrandModel } = require("../../Models/BrandModel")


const deleteBrand = async (req, res) => {


    let brand = await BrandModel.deleteOne({ _id: req.params.brandId })

    if (brand.deletedCount != 0) {

        res.status(200).send({ message: 'Brand deleted successfully', error: false })
    }
    else {
        res.send({ message: 'No brand found', error: true })
    }

}

module.exports.deleteBrand = deleteBrand