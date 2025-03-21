const {sendMail,verifyOtp}=require("../controllers/mailController")
const express = require("express");
const router = express.Router();

router.post("/send", sendMail);

router.post("/verifyotp", verifyOtp);

module.exports = router;