const { createDepartment } = require('../Controllers/DepartmentControllers/createDepartment')
const { roleCheck } = require('../Middlewares/roleCheck')





const router = require('express').Router()

router.post('/create', roleCheck(['admin']), createDepartment)

module.exports = router