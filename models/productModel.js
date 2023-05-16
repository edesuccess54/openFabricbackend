const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Please enter the product name"],
        trim: true
    },

    productPrice: {
        type: String,
        required: [true, "Please enter the product price"],
        trim: true
    },

    priceDiscount: {
        type: String,
        required: [true, "Please enter the price discount"],
        trim: true
    },

    productDesc: {
        type: String,
        required: [true, "Please enter the product descriptions"],
        trim: true
    },

    productImage: {
        type: Object,
        required: [true, "Please enter the product image"],
        trim: true
    },
}, {
    timestamps: true
})

const Product = mongoose.model('product', productSchema)

module.exports = Product