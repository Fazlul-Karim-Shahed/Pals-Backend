

const { cancelOrder } = require('../Controllers/OrderController/cancelOrder')
const { createOrder } = require('../Controllers/OrderController/createOrder')
const { getAllOrders } = require('../Controllers/OrderController/getAllOrders')
const { roleCheck } = require('../Middlewares/roleCheck')


const router = require('express').Router()


router.get('/', getAllOrders)
router.post('/', roleCheck(['admin']), createOrder)
router.put('/:orderId/cancel', roleCheck(['admin']), cancelOrder)


module.exports = router