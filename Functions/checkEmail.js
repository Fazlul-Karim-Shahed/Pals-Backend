

const { AdminModel } = require("../Models/AdminModel")
const { SuperAdminModel } = require("../Models/SuperAdminModel")
const { EmployeeModel } = require("../Models/EmployeeModel")
const { UserModel } = require("../Models/UserModel")


const checkEmail = async (email) => {

    let userMailCheck = await UserModel.findOne({ email: email })
    let superAdminMailCheck = await SuperAdminModel.findOne({ email: email })
    let employeeMailCheck = await EmployeeModel.findOne({ email: email })
    let adminMailCheck = await AdminModel.findOne({ email: email })

    let data = (userMailCheck) ? userMailCheck : (superAdminMailCheck) ? superAdminMailCheck : (employeeMailCheck) ? employeeMailCheck : (adminMailCheck) ? adminMailCheck : null

    return data
}


exports.checkEmail = checkEmail