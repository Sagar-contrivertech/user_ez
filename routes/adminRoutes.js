const express = require("express")
const router = express()
const adminController = require("../controllers/adminController")
const { validateadmin } = require("../middleware/userValidations")
const { isAuthenticated } = require('../middleware/Auth')


router.post("/add/admin", isAuthenticated, validateadmin, adminController.addAdmin)

router.get("/get/admin", isAuthenticated, adminController.getAdmin)

router.get("/get/admin/:id", isAuthenticated, adminController.getAdminById)

module.exports = router