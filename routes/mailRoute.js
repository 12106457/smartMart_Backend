const {sendMail,verifyOtp,resendOtp}=require("../controllers/mailController")
const express = require("express");
const router = express.Router();

router.post("/send", sendMail);

router.post("/verifyotp", verifyOtp);

router.post("/resend-otp",resendOtp);

module.exports = router;