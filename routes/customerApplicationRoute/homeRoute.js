const express = require("express");
const {findNearbyShops}=require("../../controllers/customerApplicationController/homePageController")
const router = express.Router();


router.get("/getshop",findNearbyShops);

module.exports = router;