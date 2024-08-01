



const { ProductModel } = require("../../Models/ProductModel")


const getAllProduct = async (req, res) => {

    let products = await ProductModel.find({ verified: true }).populate(['batchId', 'departmentId', 'categoryId', 'subCategoryId', 'brandId', 'subBrandId'])

    if (products.length != 0) {

        res.status(200).send({ message: 'All products', error: false, data: products })
    }
    else {
        res.send({ message: 'No products found', error: true })
    }

}

module.exports.getAllProduct = getAllProduct