
const { model, Schema } = require('mongoose')

const ProductModel = model('Product', new Schema({

    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: [true, "Department is required"] },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: [true, "Category is required"] },
    subCategoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: [true, "Sub Category is required"] },
    brandId: { type: Schema.Types.ObjectId, ref: 'Brand', required: [true, "Brand is required"] },
    subBrandId: { type: Schema.Types.ObjectId },
    verified: { type: Boolean, default: false, required: true },

    name: { type: String, required: [true, "Category name is required"] },
    description: { type: String },
    image: [{ contentType: String, type: Object, name: String, required: true }],

    orderPrice: { type: Number, required: [true, 'Order Price is required'] },
    sellingPrice: { type: Number, required: [true, 'Selling Price is required'] },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: [true, 'Stock is required'] },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    sizes: [{ type: Object, size: String, stock: Number }],
    colors: [{ type: Object, color: String, stock: Number, image: String }],

    

}, { timestamps: true }))


module.exports.ProductModel = ProductModel