const mongoose = require("mongoose");

const orderStatusHistorySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  status: { type: String, enum: ["Pending", "Processed", "Shipped", "Delivered", "Cancelled"], required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order_Status_History", orderStatusHistorySchema);
