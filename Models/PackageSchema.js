const mongoose = require('mongoose')

const PackageShema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
})

module.exports = Package = mongoose.model('package ', PackageShema )
