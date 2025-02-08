const mongoose = require("mongoose");


const ShopOwnerProfileSchema = new mongoose.Schema({
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop",default:null },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone:{type:Number,required:true,unique:true},
    password:{type:String,required:true},
});
module.exports = mongoose.model("shopOwnerProfile", ShopOwnerProfileSchema);