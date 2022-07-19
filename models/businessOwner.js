const mongoose = require('mongoose')

const BusinessOwnerSchema = new mongoose.Schema({
    name:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    ownerName : {
        type : String
    },
    ownerEmail : {
        type : String
    },
    ownerImages : {
        type : String
    },
    dateOfBirth : {
        type : String
    },
    storeName : {
        type : String
    },
    bussinessName : {
        type : String
    },
    bussinessLegalName : {
        type : String
    },
    bussinessEmailId : {
        type : String
    },
    bussinessWebsite : {
        type : String
    },
    bussinessNIF : {
        type : String
    },
    bussinessType : {
        type : String
    },
    bussinessServices : {
        type : String
    },
    bussinessLandlineNumber : {
        type : String
    },
    bussinessMobileNumber : {
        type : String
    },
    openingTime : {
        type : String
    },
    closingTime : {
        type : String
    },
    range : {
        type : String
    },
    workSince : {
        type : String
    },
    bussinessLogo : {
        type : String
    },
    bussinessImages : {
        type : String
    },
    id_proof_url: {
        type: String
    },
    designation: {
        type: String
    },
    merchant_type: {
        enum: {
            values: ['Localbusiness','RegionalFranchise','LiquorStore']
        }
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
    currentAddress: {
        type: String
    },
})

module.exports = mongoose.model('BusinessOwner', BusinessOwnerSchema)