
const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { checkEmail } = require('../../Functions/checkEmail');
const { AdminModel } = require('../../Models/AdminModel');
const { SuperAdminModel } = require('../../Models/SuperAdminModel');
const { EmployeeModel } = require('../../Models/EmployeeModel');
const { UserModel } = require('../../Models/UserModel');
const { cleanObject } = require('../../Functions/cleanObject');


const signup = async (req, res) => {

    let data = await checkEmail(req.body.email)

    if (data) {
        res.send({ message: 'User already exist', error: true })
    }
    else {

        data = cleanObject(req.body);
        let salt = await bcrypt.genSalt(10)
        let hashedPass = await bcrypt.hash(data.password, salt)

        data['password'] = hashedPass

        data = data.role === 'admin' ? new AdminModel(data) : data.role === 'superAdmin' ? new SuperAdminModel(data) : data.role === 'employee' ? new EmployeeModel(data) : new UserModel(data)


        data = data.save().then(data => {

            const token = jwt.sign(_.pick(data, ['firstName', 'lastName', 'role', 'email', '_id', 'phone', 'emailVerified']), process.env.SECRET_KEY, { expiresIn: '1h' })
            res.send({
                message: 'Registration complete', error: false, value: {
                    token: token
                }
            })
        })
            .catch(err => {
                res.send({ message: 'Something went wrong while signup', error: true, value: err.message })
            })

    }

}

module.exports.signup = signup




// req.body.role === 'admin' ? _.pick(req.body, ['username', 'email', 'password', 'role', 'phone', 'nidNumber', 'image', 'nidFrontImage', 'nidBackImage']) :

//     req.body.role === 'superAdmin' ? _.pick(req.body, ['username', 'email', 'password', 'role', 'phone', 'nidNumber', 'image', 'nidFrontImage', 'nidBackImage']) :

//         req.body.role === 'employee' ? _.pick(req.body, ['username', 'email', 'password', 'role', 'phone', 'address', 'dob', 'zip', 'image', 'nidFrontImage', 'nidBackImage', 'department', 'position', 'salary']) : _.pick(req.body, ['username', 'email', 'password', 'role', 'phone', 'address', 'dob', 'zip', 'image'])