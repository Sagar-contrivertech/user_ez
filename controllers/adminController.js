const admin = require('../models/admin')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const axios  = require('axios');

exports.addAdmin = catchAsyncErrors(async (req, res) => {
    try {
        const data = req.body
        // console.log(data)
        // console.log(data.name)
        const userdata = axios.get(`http://localhost:8082/api/v1/get/${data.name}`).then((res) => {
            console.log(res , "res")
            return res.data.data
        }).catch((err) => {
            console.log(err)
        })
        console.log(userdata.userType)

        if(data.role !== userdata.userType){
            res.status(400).json({
                success: false,
                message: "cannot create the user This type not match while registration",
            });
            return
        }
        const createAdmin = await admin.create(data)
        if (!createAdmin) {
            console.log(createAdmin)
            res.status(400).json({
                success: false,
                message: "cannot create the user",
            });
            return
        }
        if (createAdmin) {
            console.log(createAdmin)
            await createAdmin.save()
            res.status(200).json({
                success: true,
                message: "user created sucessfulyy",
                data: createAdmin
            });
            return
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error !",
            error
        });
    }
})

exports.getAdmin = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await admin.find().populate("name")

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getAdmin failled in try",
            });
        }

        if (findusers) {


            res.status(200).json({
                success: true,
                message: "getAdmin Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "getAdmin failled in catch",
        });
    }
})

exports.getAdminById = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await admin.findById(req.params.id).populate("name")

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getAdminById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getAdminById Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "getAdminById failled in catch",
        });
    }
})