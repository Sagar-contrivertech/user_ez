const dotenv = require("dotenv")
const path = require("path")

process.env.NODE_ENV = "uat"

dotenv.config({path : path.join(__dirname , `../environment/.${process.env.NODE_ENV}.env` ) })

module.exports = {
    port : process.env.port,
    mongodburl : process.env.mongodburl,
    version:process.env.version,
    JWT:process.env.JWt,
    TWILIO_ACCOUNT_SID:process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN:process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER:process.env.TWILIO_PHONE_NUMBER,
    Service_SID:process.env.Service_SID
}