const mongoose = require('mongoose');

const ShopProductSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  prodId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductImage', required: true },
  name:{type:String,required:true},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'subCategorys', required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('ShopProduct', ShopProductSchema);