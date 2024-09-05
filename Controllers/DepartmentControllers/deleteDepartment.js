
const { DepartmentModel } = require("../../Models/DepartmentModel")


const deleteDepartment = async (req, res) => {

    let department = await DepartmentModel.deleteOne({ _id: req.params.departmentId })

    if (department.deletedCount != 0) {

        res.status(200).send({ message: 'Department deleted successfully', error: false })
    }
    else {
        res.send({ message: 'No department found', error: true })
    }

}

module.exports.deleteDepartment = deleteDepartment