

const fs = require('fs');
const path = require('path');
const { OrderModel } = require("../../Models/OrderModel");
const formidable = require('formidable');
const { formDataToObj } = require('../../Functions/formDataToObj');
const { saveAndGetFile } = require('../../Functions/saveAndGetFile');
const { cleanObject } = require('../../Functions/cleanObject');


const createOrder = async (req, res) => {


    let order = new OrderModel(cleanObject(req.body)) 

    order.save()
        .then(order => {
            res.status(200).json({ message: "Order created successfully", order })
        })
        .catch(err => {
            res.status(400).json({ message: "Failed to create order", error: err })
        })


}

module.exports.createOrder = createOrder
