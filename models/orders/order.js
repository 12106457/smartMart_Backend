const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  totalOrderAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Processed", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed","Refund"], default: "Pending" },
  paymentMethod: { type: String, enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"] },
  shippingAddress: { type: String, required: true },
  deliveryStatus: { type: String, enum: ["Pending", "Delivered", "Returned"], default: "Pending" },
  additionalNotes: { type: String },
});

module.exports = mongoose.model("Order", orderSchema);
