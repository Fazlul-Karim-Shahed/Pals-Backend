




const fs = require('fs');
const path = require('path');
const { ProductModel } = require("../../Models/ProductModel");
const formidable = require('formidable');
const { formDataToObj } = require('../../Functions/formDataToObj');
const { cleanObject } = require('../../Functions/cleanObject');
const { saveMultipleFile } = require('../../Functions/saveMultipleFile');
const { saveAndGetFile } = require('../../Functions/saveAndGetFile');


const createProduct = async (req, res) => {

    const form = new formidable.IncomingForm();
    form.keepExtensions = true


    form.parse(req, (err, fields, files) => {

        if (err) {
            return res.status(500).send(err);
        }


        fields = cleanObject(formDataToObj(fields));


        let product = new ProductModel(fields);



        let imageList = files['imageList[]'].length > 0 ? saveMultipleFile(files['imageList[]']) : null


        if (imageList) {

            imageList.then(data => {
                
                product.save()
                    .then(product => {
                        res.send({ message: 'product created successfully', error: false, data: product });
                    })
                    .catch(err => {
                        res.send({ message: err.message, error: true });
                    });


            }).catch(err => {
                res.send({ message: err.message, error: true });
            })

        }
        else {
            res.send({ message: 'Product not created. Image is required', error: true });
        }



    });



}

module.exports.createProduct = createProduct
