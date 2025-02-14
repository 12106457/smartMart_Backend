const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shopOwnerProfile', 
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',  
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopProduct',  
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,  
      },
      price: {
        type: Number,
        required: true,  
      },
      totalAmount: {
        type: Number,
        required: true,  
      },
    },
  ],
  totalOrderAmount: {
    type: Number,
    required: true, 
  },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,  
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Delivered', 'Returned'],
    default: 'Pending',
  },
  additionalNotes: {
    type: String,
  },
});

module.exports = mongoose.model('Order', orderSchema);
