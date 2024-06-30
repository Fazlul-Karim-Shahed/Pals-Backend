

const { model, Schema } = require('mongoose')

const DepartmentModel = model('Department', new Schema({

    name: { type: String, required: [true, "nname is required"] },
    description: { type: String },
    featureImage: { contentType: String, type: Object, name: String, required: true },
    status: { type: Boolean, default: true, required: true },
    verified: { type: Boolean, default: false, required: true },
    promotionalImage: { contentType: String, type: Object, name: String },
    promotionalDescription: { type: String },
    promotionalLink: { type: String },

}, { timestamps: true }))


module.exports.DepartmentModel = DepartmentModel