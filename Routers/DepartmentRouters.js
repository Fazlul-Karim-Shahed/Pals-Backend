const { createDepartment } = require('../Controllers/DepartmentControllers/createDepartment')
const { getAllDepartment } = require('../Controllers/DepartmentControllers/getAllDepartment')
const { updateDepartment } = require('../Controllers/DepartmentControllers/updateDepartment')
const { roleCheck } = require('../Middlewares/roleCheck')





const router = require('express').Router()

router.get('/', getAllDepartment)
router.post('/create', roleCheck(['admin']), createDepartment)
router.put('/update/:departmentId', roleCheck('admin'), updateDepartment)

module.exports = router