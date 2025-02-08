const mongoose = require('mongoose');

const ShopProductSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  prodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('ShopProduct', ShopProductSchema);