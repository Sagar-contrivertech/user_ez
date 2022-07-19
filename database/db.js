const mongoose = require("mongoose")
const config = require("../config/config")

mongoose.connect(config.mongodburl).then((res) => {
    console.log("db is connected")
}).catch((err) => {
    console.log("db is not connected" , err)
})