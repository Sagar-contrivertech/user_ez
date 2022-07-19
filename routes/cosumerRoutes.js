const express = require('express')
const router = express.Router()
const cosumerController = require('../controllers/consumerController')
const { validateCosumer } = require('../middleware/userValidations')
const { isAuthenticated } = require('../middleware/Auth')



router.post('/add/cosumer', isAuthenticated, validateCosumer, cosumerController.addCosumer)

router.get('/get/cosumer', isAuthenticated, cosumerController.getConsumer)

router.get('/get/cosumer/:id', isAuthenticated, cosumerController.getConsumerById)

module.exports = router