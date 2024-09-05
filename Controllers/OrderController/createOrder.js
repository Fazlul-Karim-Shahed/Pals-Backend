

const fs = require('fs');
const path = require('path');
const { OrderModel } = require("../../Models/OrderModel");
const { ProductModel } = require("../../Models/ProductModel");
const formidable = require('formidable');
const { formDataToObj } = require('../../Functions/formDataToObj');
const { saveAndGetFile } = require('../../Functions/saveAndGetFile');
const { cleanObject } = require('../../Functions/cleanObject');


const createOrder = async (req, res) => {

    let products = await ProductModel.find({ _id: { $in: req.body.orderList.map(item => item.productId) } })

    for (let product in products) {
        product = products[product]
        let orderItem = req.body.orderList.find(item => item.productId == product._id)


        if (product.stock < Number(orderItem.quantity)) {
            res.status(400).json({ message: `Stock is not available for ${product.name}. Available only ${product.stock}`, error: true })
        }


        if (product.colors.length > 0 && orderItem.color != '') {
            if (product.colors.filter(c => c.color == orderItem.color)[0].stock < Number(orderItem.quantity)) {
                res.status(400).json({ message: `Stock is not available for Color: ${color} Product: ${product.name}. Available only ${product.colors.filter(c => c.color == color)[0].stock}`, error: true })
            }
        }
        if (product.sizes.length > 0 && orderItem.size != '') {

            let x = product.sizes.filter(s => (s.size == orderItem.size) && (s.referenceColor == '' || s.referenceColor == 0 || s.referenceColor == null) ? true : (s.referenceColor === orderItem.color))

            if (!x || x.length == 0) {
                res.status(400).json({ message: `Size ${size} is not available for ${product.name}`, error: true })
            }
            if (x && x.length != 0 && x[0].stock < Number(orderItem.quantity)) {
                res.status(400).json({ message: `Stock is not available for Size: ${size} Product: ${product.name}. Available only ${x[0].stock}`, error: true })
            }
        }


    }


    let order = new OrderModel(cleanObject(req.body))


    order.save()
        .then(order => {


            for (let product in products) {
                product = products[product]
                let orderItem = req.body.orderList.find(item => item.productId == product._id)

                product.stock = product.stock - Number(orderItem.quantity)
                if (product.colors.length > 0) {
                    product.colors = product.colors.map(c => {
                        if (c.color == orderItem.color) {
                            c.stock = c.stock - Number(orderItem.quantity)
                        }
                        return c
                    })
                }
                if (product.sizes.length > 0) {
                    product.sizes = product.sizes.map(s => {
                        if ((s.size == orderItem.size) && (s.referenceColor == '' || s.referenceColor == 0 || s.referenceColor == null) ? true : (s.referenceColor === orderItem.color)) {
                            s.stock = s.stock - Number(orderItem.quantity)
                        }
                        return s
                    })
                }

                ProductModel.findByIdAndUpdate(product._id, product).then(product => {}).catch(err => { res.status(400).json({ message: `Failed to update product ${product.name}`, error: err }) })
            }


            res.status(200).json({ message: "Order created successfully", order })
        })
        .catch(err => {
            res.status(400).json({ message: "Failed to create order", error: err })
        })


}

module.exports.createOrder = createOrder
