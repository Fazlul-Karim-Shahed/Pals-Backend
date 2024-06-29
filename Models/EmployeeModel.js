

const { model, Schema } = require('mongoose')

const EmployeeModel = model('Employee', new Schema({

    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String },
    email: { type: String, required: [true, 'Email is required'] },
    password: {
        type: String,
        max: 1024,
        min: 6,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        default: 'employee',
        required: [true, 'Role is required'],
    },

    department: { type: String, required: [true, "Department name is required"] },
    position: { type: String, required: [true, "Position is required"] },
    salary: { type: Number, required: [true, "Salary is required"] },
    address: { type: String, required: [true, "Address is required"] },
    phone: { type: String, required: [true, "Phone number is required"] },
    dob: { type: Date, required: [true, "Date of birth is required "] },
    nidNumber: { type: String, required: [true, "NID is required"] },
    nidFrontImage: { contentType: String, type: Object, name: String, required: true },
    nidBackImage: { contentType: String, type: Object, name: String, required: true },
    image: { contentType: String, type: Object, name: String },
    emailVerified: { type: Boolean, default: false }

}, { timestamps: true }))


module.exports.EmployeeModel = EmployeeModel