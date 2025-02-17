const express = require("express");
const {addProduct,addShop,getShopProducts,addShopProduct,updateShopProducts,productSearchResult,getOrderDetails,getDashboardData, } = require("../controllers/shopProductController");
const router = express.Router();
const verifyToken=require("../middleware/verifyToken")

router.post("/add/:ownerId", addShop);

router.post("/product",addProduct)

router.post("/shopProduct",addShopProduct);

router.get("/getShopProducts/:shopId",getShopProducts);

router.put("/updateProduct",updateShopProducts);

router.get("/productSearch",productSearchResult );

// router.get("/orders/:shopId",getOrderDetails);

router.get("/dashboard/:shopId",getDashboardData);

module.exports = router;