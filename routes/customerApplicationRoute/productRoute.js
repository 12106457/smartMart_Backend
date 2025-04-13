const express = require("express");
const {sendParticularProductDetails,ViewAllProducts,updateCart,sendCartDetails,getCustomerOrderList}=require("../../controllers/customerApplicationController/productController")
const router = express.Router();

//send product details based on id
router.get("/getproduct",sendParticularProductDetails);

//send all shops products based on shop id in params
router.get("/view-all-products/:id",ViewAllProducts);

//responsible for update,delete and add new product to cart 
router.post("/cart",updateCart);

//send what product are added in user cart
router.get("/cart/:id",sendCartDetails);

//send all order details based on id
router.get("/orders/:id",getCustomerOrderList);

module.exports = router;