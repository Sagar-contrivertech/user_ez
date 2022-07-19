const config = require('../config/config')

const accountSid = config.TWILIO_ACCOUNT_SID
const authToken = config.TWILIO_AUTH_TOKEN;
const phoneNumber = config.TWILIO_PHONE_NUMBER
const serviceId = config.Service_SID;

const sendsms = (phone) => {
    let data
    const client = require('twilio')(accountSid, authToken);

    client.verify.services(serviceId)
        .verifications
        .create({
            // body: message,
            from: phoneNumber,
            to: `+91${phone}`,
            channel: 'sms'
        })
        .then((verification) => {
            data = verification
            if (data) {
                res.status(200).json({
                    sucess: true,
                    message: "otp send successfully",
                    data: data
                })
                return
            }
            if (!data) {
                res.status(400).json({
                    sucess: false,
                    message: "otp send cannot send !",
                })
            }
        });;
    // next(data)
}



module.exports = sendsms
