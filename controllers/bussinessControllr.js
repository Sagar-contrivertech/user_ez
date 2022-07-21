const BusinessOwner = require('../models/businessOwner')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');


exports.addbussiness = catchAsyncErrors(async (req, res) => {
    try {
        const finduser = await BusinessOwner.findOne({ name: req.body.name });
        if (finduser) {
            res.status(201).json({
                success: false,
                message: 'owner exsit with same credtinals',
            })
            return
        }
        const data = req.body
        const createOwner = await BusinessOwner.create(data)
        if (!createOwner) {
            res.status(400).json({
                success: false,
                message: 'cannot create ',
            })
            return
        }
        if (createOwner) {
            await createOwner.save()
            res.status(200).json({
                success: true,
                message: 'create user',
                data: createOwner
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "validation failled in catch",
        });
    }
})

exports.getBussiness = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await BusinessOwner.find().populate("name")

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getBussiness failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getBussiness Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "getBussiness failled in catch",
        });
    }
})

exports.getBussinessById = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await BusinessOwner.findById(req.params.id).populate("name")

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getBussinessById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getBussinessById Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "getBussinessById failled in catch",
        });
    }
})