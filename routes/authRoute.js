const express = require("express");
const {shopOwnerLogin,shopOwnerRegister,updatedProfileDetails,updatedShopDetails } = require("../controllers/authController");
const router = express.Router();

router.post("/register", shopOwnerRegister);

router.post("/login",shopOwnerLogin );

router.put('/update/user/profile',updatedProfileDetails);

router.put('/update/shop/profile',updatedShopDetails);


module.exports = router;