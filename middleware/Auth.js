const jwt = require('jsonwebtoken');
const user = require('../models/user');
const config = require('../config/config')


exports.isAuthenticated = async (req, res, next) => {
    try {
        
        const token = req.get('Authorization');
        const verfiyUser = jwt.verify(token, "ASDFGHJKLASDFGHJKL");
        console.log('verfiyr', verfiyUser)

        req.user = await user.findById(verfiyUser.id)
        next()
    }
    catch (err) {
        console.log(err)
        res.status(401).json({ message: "invalid token request " })
    }
}

exports.authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log(req.user.role, 'roles');
            return next(res.json("roles not allowed"))
        }
        next()
    }
}