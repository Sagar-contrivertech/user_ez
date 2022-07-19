const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
    agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    income: {
        type: String
    },
    dl_image: {
        type: String
    },
    id_image: {
        type: String
    },
    address: {
        type: Array
    },
    feedbacks: {
        type: Array
    },
    last_active: {
        type: String
    },
    active_status: {
        type: String,
        enum: {
            values: ['idle', 'busy', 'inactive']
        }
    },
    dob: {
        type: String
    },
    vehicle_type: {
        type: String
    },
    vehicle_reg: {
        type: String
    },
    vehicleLicenceImage : {
        type : String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    service_radius: {
        type: String
    },
    verification: {
        type: String
    },
    current_latitude: {
        type: String
    },
    current_longitude: {
        type: String
    },
    orders: {
        type: Array
    },
    bankName: {
        type: String
    },
    bankAccountNumber: {
        type: String
    },
    bankAccountHolderName: {
        type: String
    },
    bankCode: {
        type: String
    },
    
})


module.exports = mongoose.model('agent', agentSchema)