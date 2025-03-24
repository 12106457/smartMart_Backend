const {createCustomer,customerLogin}=require("../controllers/customerController")
const express = require("express");
const router = express.Router();

router.post("/create", createCustomer);
router.post("/login", customerLogin);

module.exports = router;