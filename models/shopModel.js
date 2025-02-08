const mongoose = require("mongoose");


const ShopSchema = new mongoose.Schema({
    shopId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shopAddress:{type:String,required:true},
    location: { type: String, required: true },
    shopCategory:[{ type: mongoose.Schema.Types.ObjectId, ref: "shopCategorys",required:true }],
    shopImage:{type:String},
    openingHours:{type:String,required:true},
    rating: { type: Number, default: 0 },
    status:{type:Boolean,default:true},
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Shop", ShopSchema);
