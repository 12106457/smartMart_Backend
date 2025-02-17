const express = require("express");
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  processPayment,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/create", createOrder);
router.get("/", getOrders);
router.put("/status", updateOrderStatus);
router.post("/payment", processPayment); 

module.exports = router;
