const express = require("express");
const {
  createOrder,
  getSellerOrders,
  updateOrderStatus,
  processPayment,
  sendCustomerOrder
} = require("../controllers/orderController");

const router = express.Router();

router.post("/create", createOrder);
router.get("/:sellerId", getSellerOrders);

router.get("/customer/:customerId",sendCustomerOrder);
// router.put("/status", updateOrderStatus);
// router.post("/payment", processPayment); 

module.exports = router;
