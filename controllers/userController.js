const user = require('../models/user')
const admin = require("../models/admin")
const agent = require("../models/agent")
const bussinessOwner = require("../models/businessOwner")
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const bcrypt = require('bcrypt')
const twillo = require('../utlis/twillio');
const consumer = require('../models/consumer');
const sendsms = require('../utlis/twillio');

const config = require('../config/config')

const accountSid = config.TWILIO_ACCOUNT_SID
const authToken = config.TWILIO_AUTH_TOKEN;
const phoneNumber = config.TWILIO_PHONE_NUMBER
const serviceId = config.Service_SID;

exports.registeruser = catchAsyncErrors(async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            isBlocked,
            isRemoved,
            profileImage,
            devices,
            userType,
        } = req.body;

        const finduser = await user.findOne({ email : email});
        const finduserphone = await user.findOne({ phone : phone})
        // console.log(finduserphone , "finduserphone");

        if (finduser || finduserphone) {
            res.status(201).json({
                success: true,
                message: 'user already exsit with same credtinals',
            })
            return
        }

        const createuser = await user.create({
            name,
            email,
            phone,
            password,
            isBlocked,
            isRemoved,
            profileImage,
            devices,
            userType,
        });
        if (!createuser) {
            res.status(400).json({
                success: false,
                message: 'cannot create user',
            })
        }

        if (createuser) {
            const token = createuser.getJwtToken()
            console.log(token)
            const salt = await bcrypt.genSalt(10);
            createuser.password = await bcrypt.hash(createuser.password, salt);
            await createuser.save();
            res.status(200).json({
                success: true,
                message: "user register succesfully",
                data: createuser,
                token: token
            });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "validation failled in catch",
        });
    }
});

// 
exports.loginUser = catchAsyncErrors(async (req, res) => {
    try {
        const { email, password, role } = req.body
        console.log({ email, password, role })
        const finduser = await user.findOne({ email: email })
        if(!email || !password || !role){
            res.status(400).json({
                success: false,
                message: "Please Provide Email , Password , Role",
            })
            return
        }
        if (!finduser) {
            console.log(finduser)
            res.status(400).json({
                success: false,
                message: "Login  failled in try",
            });
            return
        }

        if (finduser) {

            // let ismatch = await bcrypt.compare(password , finduser.password)
            let ismatch = finduser.comparePassword(password)

            if (!ismatch) {
                res.status(400).json({
                    success: false,
                    message: "Login unsuccesfully ",
                });
            }

            if (ismatch) {
                const token = finduser.getJwtToken()
                console.log(token)
                console.log(finduser.userType)
                let userRoleData;
                console.log("Role", role)
                // "consumer", "businessOwner", "agent", "admin", "subAdmin"


                if (role === "agent") {
                    userRoleData = await agent.findOne({ agent_id: finduser._id })
                } else if (role === "consumer") {
                    userRoleData = await consumer.findOne({ name: finduser._id })
                } else if (role === "businessOwner") {
                    userRoleData = await bussinessOwner.findOne({ name: finduser._id })
                } else if (role === "admin") {
                    userRoleData = await admin.findOne({ name: finduser._id })
                } else if (role === "subAdmin") {
                    userRoleData = await admin.findOne({ name: finduser._id })
                }

                if (userRoleData) {
                    res.status(200).json({
                        success: true,
                        message: "Login succesfully ",
                        data: finduser,
                        userRole: userRoleData,
                        token: token
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "Login Unsuccesfully ",
                    });
                }
            }

        }


    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Login  failled in catch",
        });
    }
})

exports.getUsers = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await user.find()

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getUsers failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getUsers Succesfully",
                data: findusers
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "getUsers failled in catch",
        });
    }
})

exports.getUserById = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await user.findById(req.params.id)
        console.log(findusers)
        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getUsersById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getUsersById Succesfully",
                data: findusers
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "getUsersById failled in catch",
        });
    }
})

// 
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
    try {
        const { phone } = req.body
        const findUser = await user.find({ phone })
        // console.log(findUser)
        if (!findUser) {
            res.status(400).json({
                success: false,
                message: "user doesn't exsit !",
            });
            return
        }
        if (findUser) {
            try {
                // console.log("data")
                const client = require('twilio')(accountSid, authToken);
                await client.verify.services(serviceId)
                    .verifications
                    .create({
                        // body: message,
                        from: phoneNumber,
                        to: `+91${phone}`,
                        channel: 'sms'
                    }).then((verification) => {
                        data = verification
                        if (data) {
                            res.status(200).json({
                                sucess: true,
                                message: "otp send successfully",
                                data: data
                            })
                            return
                        }
                        if (!data) {
                            res.status(400).json({
                                sucess: false,
                                message: "otp send cannot send !",
                            })
                        }
                    })

            } catch (err) {
                console.log(err);
                res.status(201).json({ message: "error while sending otp" })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "validation failled in catch",
        });
    }
})


exports.verfiyOtp = catchAsyncErrors(async (req, res, next) => {
    try {
        let data
        const { phone, code } = req.body
        const client = require('twilio')(accountSid, authToken);
        await client.verify.v2.services(serviceId)
            .verificationChecks
            .create({
                // body: message,
                to: `+91${phone}`,
                code: code
            }).then((verification_check) => {
                data = verification_check
                console.log(verification_check)
                if (data.valid === true) {
                    res.status(200).json({
                        sucess: true,
                        message: "otp verfied",
                        data: data
                    })
                    return
                }
                if (!data) {
                    res.status(400).json({
                        sucess: false,
                        message: "otp send cannot send !",
                    })
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "validation failled in catch twillo",
        });
    }
})


// internal services

exports.internalservices = catchAsyncErrors(async (req, res) => {
    try {
        console.log("finduser id " , req.params.id)

        const findusers = await user.findById(req.params.id)
        console.log("finduser " , findusers)
        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getUsersById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getUsersById Succesfully",
                data: findusers
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "getUsersById failled in catch",
        });
    }
})
