const express = require('express')
const router = express.Router()
const agentController = require('../controllers/agentController')
const { validateagent } = require('../middleware/userValidations')
const { isAuthenticated } = require('../middleware/Auth')



router.post('/add/agent', isAuthenticated, validateagent, agentController.addagent)

router.get('/get/agent', isAuthenticated, agentController.getAgent)

router.get('/get/agent/:id', isAuthenticated, agentController.getAgentById)

module.exports = router