const agent = require('../models/agent')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const axios = require("axios")
exports.addagent = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = req.body

        const userdata = axios.get(`http://localhost:8082/api/v1/get/${data.name}`).then((res) => {
            console.log(res , "res")
            return res.data.data
        }).catch((err) => {
            console.log(err)
        })

        console.log(userdata.userType)
        console.log(data.role , "data.role")
        if(data.role !== userdata.userType){
            res.status(400).json({
                success: false,
                message: "cannot create the agent This type not match while registration",
            });
            return
        }

        const checkData = await agent.findOne({ agent_id: req.body.agent_id })
        if (checkData) {
            res.status(201).json({
                success: true,
                message: "agent already exist",
            })
            return
        }
        const createagent = await agent.create(data)
        // console.log(createagent)
        if (!createagent) {
            res.status(400).json({
                success: false,
                message: 'cannot create agent',
            })
            return
        }
        if (createagent) {
            await createagent.save()
            res.status(200).json({
                success: true,
                message: "agent register succesfully",
                data: createagent,
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

exports.getAgent = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await agent.find()

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getAgent failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getAgent Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "getAgent failled in catch",
        });
    }
})

exports.getAgentById = catchAsyncErrors(async (req, res) => {
    try {
        const findusers = await agent.findById(req.params.id)
        console.log(findusers)
        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getAgentById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getAgentById Succesfully",
                data : findusers
            });
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "getAgentById failled in catch",
        });
    }
})