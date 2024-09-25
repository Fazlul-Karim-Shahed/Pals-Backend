




const { OrderModel } = require("../../Models/OrderModel")


const getAllOrders = async (req, res) => {

    let order = await OrderModel.find().sort({ orderDate: -1 }).populate({ path: 'orderList.productId', model: 'Product' })

    if (order.length != 0) {

        res.status(200).send({ message: 'All order', error: false, data: order })
    }
    else {
        res.send({ message: 'No order found', error: true })
    }

}

module.exports.getAllOrders = getAllOrders