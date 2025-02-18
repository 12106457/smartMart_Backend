const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  phone: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  image: { type: String, default: null },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: "India" },
    pinCode: { type: String}
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" }
  },
  walletBalance: { type: Number, default: 0, min: 0 },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer_Order_Table" }],
  referralCode: { type: String, sparse: true, default: null },
  isActive: { type: Boolean, default: true},
}, { timestamps: true });




module.exports = mongoose.model("Customer", customerSchema);
