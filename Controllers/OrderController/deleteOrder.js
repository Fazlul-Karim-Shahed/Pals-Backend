const fs = require("fs");
const path = require("path");
const { OrderModel } = require("../../Models/OrderModel");
const { ProductModel } = require("../../Models/ProductModel");
const formidable = require("formidable");
const { formDataToObj } = require("../../Functions/formDataToObj");
const { saveAndGetFile } = require("../../Functions/saveAndGetFile");
const { cleanObject } = require("../../Functions/cleanObject");

const deleteOrder = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.orderId);
        if (!order) {
            return res.status(400).json({ message: "Order not found", error: true });
        }

        const products = await ProductModel.find({
            _id: { $in: order.orderList.map((item) => item.productId) },
        });

        for (const product of products) {
            const orderItem = order.orderList.find((item) => item.productId.toString() === product._id.toString());

            if (!orderItem) continue;

            const quantity = Number(orderItem.quantity);
            product.stock += quantity;

            // Update color-wise stock
            let colorModified = false;
            if (Array.isArray(product.colors)) {
                product.colors = product.colors.map((c) => {
                    if (c.color === orderItem.color) {
                        c.stock = (c.stock || 0) + quantity;
                        colorModified = true;
                    }
                    return c;
                });
                if (colorModified) product.markModified("colors");
            }

            // Update size-wise stock
            let sizeModified = false;
            if (Array.isArray(product.sizes)) {
                product.sizes = product.sizes.map((s) => {
                    const matchColor = !s.referenceColor || s.referenceColor === "" || s.referenceColor === "0" || s.referenceColor === orderItem.color;
                    if (s.size === orderItem.size && matchColor) {
                        s.stock = (s.stock || 0) + quantity;
                        sizeModified = true;
                    }
                    return s;
                });
                if (sizeModified) product.markModified("sizes");
            }

            await product.save();
        }

        await OrderModel.findByIdAndDelete(req.params.orderId);

        return res.status(200).json({
            message: "Order deleted and stock restored successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "An error occurred while deleting order",
            error: err,
        });
    }
};



module.exports.deleteOrder = deleteOrder;