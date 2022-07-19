const Joi = require('joi')

const registerUser = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
    phone: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    Dob: Joi.string().required(),
    userType: Joi.string().required().valid("consumer", "businessOwner", "agent", "admin", "subAdmin")
})

const ValidateUser = async (req, res, next) => {
    const data = req.body
    const payload = data

    const { error } = registerUser.validate(payload);
    if (error) {
        res.status(406);
        return res.json({ message: ` validation failed ${error.message}` })
    } else {
        next();
    }
}

const consumer = Joi.object({
    name: Joi.string().required(),
    gender: Joi.string().required().valid('male', 'female', 'others'),
    Dob: Joi.string().required(),
    isAnonymous: Joi.boolean(),
    currentAddress: Joi.string(),
})

const validateCosumer = async (req, res, next) => {
    const data = req.body
    const payload = data

    const { error } = consumer.validate(payload);
    if (error) {
        res.status(406);
        return res.json({ message: ` validation failed ${error.message}` })
    } else {
        next();
    }
}

const agentValidtaor = Joi.object ({
    agent_id:Joi.string().required(),
    income:Joi.string().required(),
    dl_image:Joi.string(),
    id_image:Joi.string(),
    address:Joi.string(), 
    feedbacks:Joi.string(),
    last_active:Joi.string(),
    active_status:Joi.string(),
    dob:Joi.string(),
    vehicle_type:Joi.string(),
    vehicle_reg:Joi.string(),
    vehicleLicenceImage: Joi.string(),
    latitude:Joi.string(),
    longitude:Joi.string(),
    service_radius:Joi.string(),
    verification:Joi.string(),
    current_latitude:Joi.string(),
    current_longitude:Joi.string(),
    orders:Joi.array(),
    bankName: Joi.string(),
    bankAccountNumber: Joi.string(),
    bankAccountHolderName: Joi.string(),
    bankCode: Joi.string()
})

const validateagent = async (req, res, next) => {
    const data = req.body
    const payload = data

    const { error } = agentValidtaor.validate(payload);
    if (error) {
        res.status(406);
        return res.json({ message: ` validation failed ${error.message}` })
    } else {
        next();
    }
}

const businessOwnerValidator = Joi.object({
    name : Joi.string(),
    ownerName : Joi.string(),
    ownerEmail : Joi.string(),
    id_proof_url:Joi.string(),
    designation:Joi.string(),
    merchant_type:Joi.string().required().valid('Localbusiness','RegionalFranchise','LiquorStore'),
    bankName: Joi.string(),
    bankAccountNumber: Joi.string(),
    bankAccountHolderName: Joi.string(),
    bankCode: Joi.string()
})

const validatebussiness = async (req, res, next) => {
    const data = req.body
    const payload = data

    const { error } = businessOwnerValidator.validate(payload);
    if (error) {
        res.status(406);
        return res.json({ message: ` validation failed ${error.message}` })
    } else {
        next();
    }
}

const adminValidator = Joi.object({
    name:Joi.string().required(),
    role:Joi.string().required().valid('admin','subadmin')
})

const validateadmin = async (req, res, next) => {
    const data = req.body
    const payload = data

    const { error } = adminValidator.validate(payload);
    if (error) {
        res.status(406);
        return res.json({ message: ` validation failed ${error.message}` })
    } else {
        next();
    }
}

module.exports = {
    ValidateUser, validateCosumer,validateagent,validatebussiness,validateadmin
}
