const mongoose = require("mongoose");

const sellerOrderSchema = new mongoose.Schema({
  orderNo:{type:String,required:true,index:true},
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true,index:true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true ,index:true}, // Reference to the customer placing the order
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order_Item" }], // Referencing Order_Item
  totalOrderAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Processed", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed", "Refund"], default: "Pending" },
  paymentMethod: { type: String, enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery", "UPI"] },
  deliveryStatus: { type: String, enum: ["Pending", "Shipped", "Delivered", "Returned"], default: "Pending" },
  orderDate: { type: Date, default: Date.now },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: "India" },
    pinCode: { type: String }
  },
  additionalNotes: { type: String }
}, { timestamps: true });


module.exports = mongoose.model("Seller_Order_Table", sellerOrderSchema);

