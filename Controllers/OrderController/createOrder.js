const { OrderModel } = require("../../Models/OrderModel");
const { ProductModel } = require("../../Models/ProductModel");
const { cleanObject } = require('../../Functions/cleanObject');
const { sendEmail } = require('../../Functions/sendEmail');

const createOrder = async (req, res) => {
    try {
        let products = await ProductModel.find({
            _id: { $in: req.body.orderList.map(item => item.productId) }
        });

        // Stock validation
        for (let product of products) {
            const orderItem = req.body.orderList.find(item => item.productId == product._id);

            if (product.stock < Number(orderItem.quantity)) {
                return res.status(400).json({
                    message: `Stock is not available for ${product.name}. Available only ${product.stock}`,
                    error: true
                });
            }

            if (product.colors.length > 0 && orderItem.color != '') {
                const colorObj = product.colors.find(c => c.color == orderItem.color);
                if (!colorObj || colorObj.stock < Number(orderItem.quantity)) {
                    return res.status(400).json({
                        message: `Stock is not available for Color: ${orderItem.color} Product: ${product.name}. Available only ${colorObj?.stock || 0}`,
                        error: true
                    });
                }
            }

            if (product.sizes.length > 0 && orderItem.size != '') {
                const sizeMatch = product.sizes.filter(s => {
                    return s.size == orderItem.size &&
                        (!s.referenceColor || s.referenceColor === orderItem.color);
                });

                if (!sizeMatch.length) {
                    return res.status(400).json({
                        message: `Size ${orderItem.size} is not available for ${product.name}`,
                        error: true
                    });
                }

                if (sizeMatch[0].stock < Number(orderItem.quantity)) {
                    return res.status(400).json({
                        message: `Stock is not available for Size: ${orderItem.size} Product: ${product.name}. Available only ${sizeMatch[0].stock}`,
                        error: true
                    });
                }
            }
        }

        // Create Order
        const order = new OrderModel(cleanObject(req.body));
        order.orderNo = new Date().getUTCDate() + "" + (new Date().getUTCMonth() + 1) + "" + (await OrderModel.countDocuments() + 1);
        const savedOrder = await order.save();

        // Update product stocks
        for (let product of products) {
            const orderItem = req.body.orderList.find(item => item.productId == product._id);

            product.stock -= Number(orderItem.quantity);

            if (product.colors.length > 0) {
                product.colors = product.colors.map(c => {
                    if (c.color == orderItem.color) {
                        c.stock -= Number(orderItem.quantity);
                    }
                    return c;
                });
            }

            if (product.sizes.length > 0) {
                product.sizes = product.sizes.map(s => {
                    if (s.size == orderItem.size &&
                        (!s.referenceColor || s.referenceColor === orderItem.color)) {
                        s.stock -= Number(orderItem.quantity);
                    }
                    return s;
                });
            }

            await ProductModel.findByIdAndUpdate(product._id, product);
        }

        // Email content
        const customerEmail = savedOrder.email;
        const orderSummary = savedOrder.orderList.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.productName}</td>
                <td>${item.color || '-'}</td>
                <td>${item.size || '-'}</td>
                <td>${item.quantity}</td>
            </tr>
        `).join('');

        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>🛍️ Order Confirmation - Pals Limited</h2>
                <p>Dear Customer,</p>
                <p>Thank you for your order. Your order number is <strong>#${savedOrder.orderNo}</strong>.</p>
                <table style="border-collapse: collapse; width: 100%;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th>#</th><th>Product</th><th>Color</th><th>Size</th><th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderSummary}
                    </tbody>
                </table>
                <p style="margin-top: 20px;">We will process your order shortly.</p>
                <p>Best regards,<br/>Pals Limited Team</p>
            </div>
        `;

        // Send emails
        await sendEmail({
            to: customerEmail,
            subject: `Your Order #${savedOrder.orderNo} Confirmation`,
            html: htmlTemplate
        });

        await sendEmail({
            to: 'your_admin_email@example.com', // Replace with your admin email
            subject: `New Order Received - #${savedOrder.orderNo}`,
            html: htmlTemplate
        });

        return res.status(200).json({
            message: "Order placed successfully",
            data: savedOrder
        });
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            message: "Failed to create order",
            error: err
        });
    }
};

module.exports.createOrder = createOrder;
