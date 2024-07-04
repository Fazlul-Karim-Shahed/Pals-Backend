const { roleCheck } = require('../Middlewares/roleCheck')
const { createCategory } = require('../Controllers/CategoryControllers/createCategory')

const router = require('express').Router()

router.get('/', )
router.post('/', roleCheck(['admin']), createCategory)
router.put('/:departmentId', roleCheck(['admin']), )
router.delete('/:departmentId', roleCheck(['admin']), )

module.exports = router