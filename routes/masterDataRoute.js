const express = require("express");
const {addShopCategory,getShopCategory,addSubCategoryData,sendSubCategoryList,getSubcategoryParticularShop } = require("../controllers/masterDataController");
const router = express.Router();
const verifyToken=require("../middleware/verifyToken")

router.post("/add", addShopCategory);

router.get("/get",getShopCategory );

router.post("/add-subcategory",addSubCategoryData);

router.get("/get-subcategory/:id",sendSubCategoryList);

router.get("/get-subcategory-particular-shop/:shopId",getSubcategoryParticularShop)


module.exports = router;