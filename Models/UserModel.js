



const { model, Schema } = require('mongoose')

const UserModel = model('User', new Schema({

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
        default: 'user',
        required: true,
    },
    phone: { type: String, required: true },
    address: { type: String },
    zip: { type: String },
    image: { contentType: String, type: Object, name: String },
    emailVerified: { type: Boolean, default: false }



}, { timestamps: true }))


module.exports.UserModel = UserModel