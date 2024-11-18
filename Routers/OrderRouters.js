

const { createOrder } = require('../Controllers/OrderController/createOrder')
const { getAllOrders } = require('../Controllers/OrderController/getAllOrders')
const { updateOrderStatus } = require('../Controllers/OrderController/updateOrderStatus')
const { roleCheck } = require('../Middlewares/roleCheck')


const router = require('express').Router()


router.post('/get', getAllOrders)
router.post('/', createOrder)
router.put('/:orderId', roleCheck(['admin']), updateOrderStatus)
router.delete('/:orderId', roleCheck(['admin']))


module.exports = router