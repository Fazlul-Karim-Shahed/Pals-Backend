const { OrderModel } = require("../../Models/OrderModel");

const getAllOrders = async (req, res) => {
    let query = {};

    if (req.body.day && !isNaN(req.body.day)) {
        query = {
            ...query,
            orderDate: { $gte: new Date(Date.now() - req.body.day * 24 * 60 * 60 * 1000) }
        };
    }
    else if(req.body.startDate) {
        query = {
            ...query,
            orderDate: { $gte: new Date(req.body.startDate), $lt: req.body.endDate ? new Date(req.body.endDate) : new Date(Date.now()) }
        };
    }

    let order = await OrderModel.find(query)
        .sort({ orderDate: -1 })
        .populate({ path: 'orderList.productId', model: 'Product' });

    if (order.length !== 0) {
        res.status(200).send({ message: 'All orders within the specified date range', error: false, data: order });
    } else {
        res.send({ message: 'No orders found within the specified date range', error: true });
    }
};

module.exports.getAllOrders = getAllOrders;
