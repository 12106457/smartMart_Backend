const express = require("express");
const {addShopCategory,getShopCategory } = require("../controllers/masterDataController");
const router = express.Router();
const verifyToken=require("../middleware/verifyToken")

router.post("/add", addShopCategory);

router.get("/get",getShopCategory );


module.exports = router;