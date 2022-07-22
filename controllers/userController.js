const user = require('../models/user')
const admin = require("../models/admin")
const agent = require("../models/agent")
const bussinessOwner = require("../models/businessOwner")
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const bcrypt = require('bcrypt')
const twillo = require('../utlis/twillio');
const consumer = require('../models/consumer');
const sendsms = require('../utlis/twillio');
const jwt = require('jsonwebtoken')

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

        const finduser = await user.findOne({ email: email });
        const finduserphone = await user.findOne({ phone: phone })
        // console.log(finduserphone , "finduserphone");

        if (finduser || finduserphone) {
            res.status(201).json({
                success: false,
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
        const { email, password, role, phone } = req.body
        console.log({ email, password, role })
        const finduser = await user.find({
            $or: [{
                email: email
            },
            {
                phone: phone
            }
            ]
        })
        // console.log(finduser)
        if (!role) {
            res.status(400).json({
                success: false,
                message: "Please Provide Email , Password , Role",
            })
            return
        }
        if (!finduser) {
            res.status(400).json({
                success: false,
                message: "Login  failled in try",
            });
            return
        }
        let passwordData
        let data1
        finduser && finduser.map((i) => {
            passwordData = i.password
            data1 = i
            console.log(i.password)
        })
        console.log(data1)
        const token = data1.getJwtToken()
        if (finduser) {
            let ismatch = await bcrypt.compare(password, passwordData)
            // let ismatch = finduser.comparePassword(password)
            console.log(ismatch)
            if (!ismatch) {
                res.status(400).json({
                    success: false,
                    message: "Login unsuccesfully ",
                });
            }

            if (ismatch) {
                // const token = jwt.sign({
                //     id: finduser._id,
                //     isAdmin: finduser.isAdmin
                // },
                //     "ADGSGWUEVVKBSSGKJSKJJKGS",
                //     { expiresIn: '1w' }
                // )
                let userRoleData;
                console.log("Role", token)
                if (role === "agent") {
                    userRoleData = await agent.findOne({ agent_id: data1._id })
                } else if (role === "consumer") {
                    userRoleData = await consumer.findOne({ name: data1._id })
                } else if (role === "businessOwner") {
                    userRoleData = await bussinessOwner.findOne({ name: data1._id })
                } else if (role === "admin") {
                    userRoleData = await admin.findOne({ name: data1._id })
                } else if (role === "subAdmin") {
                    userRoleData = await admin.findOne({ name: data1._id })
                }
                let data = []
                // data.push(data1,token)
                // console.log(";hjjj",data)
                const token1 = Object.assign(data1, { token })
                console.log(token1, 'lll')
                if (token1) {
                    res.status(200).json({
                        success: true,
                        message: "Login succesfully ",
                        data: token1,
                        // userRole: userRoleData,
                        // token: token
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
                                success: true,
                                message: "otp send successfully",
                                data: data
                            })
                            return
                        }
                        if (!data) {
                            res.status(400).json({
                                success: false,
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
                        success: true,
                        message: "otp verfied",
                        data: data
                    })
                    return
                }
                if (!data) {
                    res.status(400).json({
                        success: false,
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
        console.log("finduser id ", req.params.id)

        const findusers = await user.findById(req.params.id)
        console.log("finduser ", findusers)
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

exports.updataData = catchAsyncErrors(async (req, res) => {
    try {
        bodyData = req.body
        const data = await user.findById(req.params.id, {
            bodyData
        })
        if (!data) {
            res.status(400).json({
                success: false,
                message: "cannot update password",
            });
            return
        }
        if (data) {
            res.status(200).json({
                success: true,
                message: "SuccessFully !",
            });
            return
        }

    } catch (err) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "failled while updating ",
        });
    }
})


// reset password
exports.resetPassword = async (req, res, next) => {
    try {
        // const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

        // const user = await User.findOne({
        //     resetPasswordToken,
        //     resetpasswordExpire: { $gt: Date.now() }
        // })
        if (!user) {
            return next(res.status(400).json({ mesage: "password token invalid or expried", }))
        }
        if (!req.body.password == req.body.confirmpassword) {
            return next(res.status(400).json({ message: "password and confirm password dont match" }))
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        console.log('password', user.password)
        user.resetpassword = undefined;
        user.resetpasswordExpire = undefined;


        await user.save()
        res.status(200).json({ message: "password reset ,!go back and login", resetPasswordToken })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: "token invalid ! something went wrong" })
    }
}

// profile

exports.profile = catchAsyncErrors(async (req, res, next) => {
    try {
        console.log(req.user.id)
        const users = await user.findById(req.user.id)
        console.log(users._id)
        const findConsumer = await consumer.find({ name: users._id }).populate('name')
        // console.log(findConsumer)
        res.status(200).json({
            success: true,
            message: "user fetch sucessfully",
            data: findConsumer,
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: "token invalid ! something went wrong"
        })
    }
})