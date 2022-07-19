const mongoose = require('mongoose')

const consumerSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'others']
        }
    },
    Dob: {
        type: String,
        require: true
    },
    isAnonymous: {
        type: Boolean,
    },
    currentAddress: {
        type: String
    },
    addresList: {
        type: Array
    },
    orders: {
        type: Array
    },
    feedbacks: {
        type: Array
    },
    orderable_favourites: {
        type: Array
    }
}, { timestamps: true })


module.exports = mongoose.model('consumer', consumerSchema)