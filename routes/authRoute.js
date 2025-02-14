const express = require("express");
const {shopOwnerLogin,shopOwnerRegister,updatedProfileDetails,updatedShopDetails } = require("../controllers/authController");
const router = express.Router();

router.post("/register", shopOwnerRegister);

router.post("/login",shopOwnerLogin );

router.put('/update/profile/:OwnerId',updatedProfileDetails);




module.exports = router;