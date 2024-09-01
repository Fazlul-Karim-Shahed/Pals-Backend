
const fs = require('fs');
const path = require('path');
const { ProductModel } = require("../../Models/ProductModel");
const formidable = require('formidable');
const { formDataToObj } = require('../../Functions/formDataToObj');
const { cleanObject } = require('../../Functions/cleanObject');
const { saveMultipleFile } = require('../../Functions/saveMultipleFile');
const { saveAndGetFile } = require('../../Functions/saveAndGetFile');


const updateProduct = async (req, res) => {

    const form = new formidable.IncomingForm();
    form.keepExtensions = true

    let product = await ProductModel.findOne({ _id: req.params.productId })

    form.parse(req, (err, fields, files) => {

        if (err) {
            return res.status(500).send(err);
        }

        fields = cleanObject(formDataToObj(fields));


        Object.assign(product, fields);

        product.sizes = fields.sizes ? fields.sizes : []
        product.colors = fields.colors ? fields.colors : []



        let imageList = files && files['imageList[]'] && files['imageList[]'].length > 0 ? saveMultipleFile(files['imageList[]']) : null

        if (imageList) {

            imageList.then(data => {

                product.save()
                    .then(product => {
                        res.send({ message: 'product update successfully', error: false, data: product });
                    })
                    .catch(err => {
                        res.send({ message: err.message, error: true });
                    });


            }).catch(err => {
                res.send({ message: err.message, error: true });
            })

        }
        else {
            product.save()
                .then(product => {
                    res.send({ message: 'product update successfully', error: false, data: product });
                })
                .catch(err => {
                    res.send({ message: err.message, error: true });
                });
        }



    });



}

module.exports.updateProduct = updateProduct
