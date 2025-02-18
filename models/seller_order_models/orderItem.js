const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  // orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer_Order_Table", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "ShopProduct", required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true }
});

module.exports = mongoose.model("Order_Item", orderItemSchema);
