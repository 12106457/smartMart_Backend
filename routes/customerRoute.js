const {createCustomer,customerLogin,verifyLoginOtp}=require("../controllers/customerController")
const express = require("express");
const router = express.Router();

router.post("/create", createCustomer);
router.post("/login", customerLogin);
router.post("/verify-login-otp", verifyLoginOtp);

module.exports = router;