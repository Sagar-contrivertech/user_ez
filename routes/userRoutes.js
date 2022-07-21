const express = require('express')
const router = express.Router()
const { ValidateUser } = require('../middleware/userValidations')
const userController = require('../controllers/userController')
const { isAuthenticated } = require('../middleware/Auth')

router.post('/register/user', ValidateUser, userController.registeruser)

router.get('/me',isAuthenticated,userController.profile)

router.post('/verify/auth/user', userController.loginUser)

router.get('/get/user', isAuthenticated, userController.getUsers)

router.get('/get/user/:id', isAuthenticated, userController.getUserById)

// update password
// router.put('/verify/auth/updatepassword',isAuthenticated,use)


// internal services
router.get('/get/:id', userController.internalservices)


module.exports = router