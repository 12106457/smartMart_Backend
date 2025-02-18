const express = require("express");
const {shopOwnerLogin,shopOwnerRegister,updatedProfileDetails,updatedShopDetails,createCustomer } = require("../controllers/authController");
const router = express.Router();

router.post("/register", shopOwnerRegister);

router.post("/login",shopOwnerLogin );

router.put('/update/profile/:OwnerId',updatedProfileDetails);


router.post("/customer",createCustomer);



module.exports = router;