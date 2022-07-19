const express = require('express')
const router = express.Router()
const {ValidateUser} = require('../middleware/userValidations')
const userController = require('../controllers/userController')
const {isAuthenticated} = require('../middleware/Auth')

router.post('/consumer/auth/getotp' ,userController.forgetPassword)

router.post('/consumer/auth/verifyOtp',userController.verfiyOtp)

module.exports = router