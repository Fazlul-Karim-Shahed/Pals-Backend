
const jwt = require('jsonwebtoken')
const { checkEmail } = require('../Functions/checkEmail')

const roleCheck = roleArray => {

    return async (req, res, next) => {

        try {

            const data = await jwt.verify(req.headers.authorization.split(" ")[1], process.env.SECRET_KEY)

            if (data) {
                const user = await checkEmail(data.email)

                if (user) {
                    let match = false

                    roleArray.forEach(role => {
                        if (user.role === role || user.role === 'superAdmin') {
                            match = true
                        }
                    })

                    if (match) {
                        req.user = user
                        next()
                    }
                    else {
                        res.send({ message: 'You are not authorized', error: true })
                    }

                }
                else {
                    res.send({ message: 'User not found', error: true });
                }
            }
            else {
                req.send({ message: 'Not verified', error: true })
            }

        }
        catch (err) {
            res.send({ message: 'Something went wrong', error: true, data: err.message });
        }


    }
}

module.exports.roleCheck = roleCheck