const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    role:{
        type:String,
        enum:{
            values:['admin','subadmin']
        }
    }
})

module.exports = mongoose.model('admin',adminSchema)