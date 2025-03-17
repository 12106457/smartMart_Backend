const express = require("express");
const {sellerNotification } = require("../controllers/notificationController");
const router = express.Router();

router.get("/:shopId",sellerNotification);



module.exports = router;