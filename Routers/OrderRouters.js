

const { createOrder } = require('../Controllers/OrderController/createOrder')
const { getAllOrders } = require('../Controllers/OrderController/getAllOrders')
const { roleCheck } = require('../Middlewares/roleCheck')


const router = require('express').Router()


router.get('/', getAllOrders)
router.post('/', roleCheck(['admin']), createOrder )


module.exports = router