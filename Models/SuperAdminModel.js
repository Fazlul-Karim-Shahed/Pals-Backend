

const { model, Schema } = require('mongoose')

const SuperAdminModel = model('SuperAdmin', new Schema({

    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String },
    email: { type: String, required: true },
    password: {
        type: String,
        max: 1024,
        min: 6,
        required: true
    },
    role: {
        type: String,
        default: 'superadmin',
        required: true,
    },
    phone: { type: String, required: true },
    nidNumber: { type: String, required: true },
    image: { contentType: String, type: Object, name: String },
    nidFrontImage: { contentType: String, type: Object, name: String, required: true },
    nidBackImage: { contentType: String, type: Object, name: String, required: true },
    emailVerified: { type: Boolean, default: false }


    

}, { timestamps: true }))


module.exports.SuperAdminModel = SuperAdminModel