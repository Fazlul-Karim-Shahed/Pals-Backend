

const { createExpense } = require('../Controllers/ExpenseControllers/createExpense')
const { getAllExpense } = require('../Controllers/ExpenseControllers/getAllExpense')
const { roleCheck } = require('../Middlewares/roleCheck')


const router = require('express').Router()


router.get('/', getAllExpense)
router.post('/', roleCheck(['admin']), createExpense)


module.exports = router