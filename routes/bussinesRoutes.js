const express = require("express")
const router = express.Router()
const bussinessController = require("../controllers/bussinessControllr")
const { validatebussiness } = require("../middleware/userValidations")
const { isAuthenticated } = require('../middleware/Auth')



router.post("/add/bussiness" , isAuthenticated,validatebussiness , bussinessController.addbussiness)

router.get("/get/bussiness" , isAuthenticated,bussinessController.getBussiness)

router.get("/get/bussiness/:id" ,isAuthenticated ,bussinessController.getBussinessById)

module.exports = router