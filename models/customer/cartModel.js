const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true, index: true }, // Link to Customer
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "ShopProduct", required: true }, 
      quantity: { type: Number, default: 1, min: 1 }, 
      totalAmount: { type: Number, required: true }, 
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
