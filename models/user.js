const mongoose = require('mongoose')
const config = require('../config/config')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const user = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: Number
    },
    password: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isRemoved: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String
    },
    devices: {
        type: Array
    },
    userType: {
        type: String,
        enum: {
            values: ["consumer", "businessOwner", "agent", "admin", "subAdmin"]
        }
    },
    token: {
        type: String
    }
}, { timestamps: true })


user.methods.comparePassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)
}


user.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, "ASDFGHJKLASDFGHJKL", {
        expiresIn: '7d'
    })
}

user.methods.reset = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetpassword = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetpasswordExpire = Date.now() + 30 * 60 * 1000
    return resetToken;
}

module.exports = mongoose.model("user", user)