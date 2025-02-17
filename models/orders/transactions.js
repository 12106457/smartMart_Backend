const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  paymentMethod: { type: String, enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"], required: true },
  status: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" },
  amount: { type: Number, required: true },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
