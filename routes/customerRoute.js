const {createCustomer}=require("../controllers/customerController")
const express = require("express");
const router = express.Router();

router.post("/create", createCustomer);

module.exports = router;