const mongoose = require("mongoose");


const ShopCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    short_name:{
        type:String,
        default:""
    },
    symbol:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:null
    },
    active:{
        type:Boolean,
        default:true
    }
});
module.exports = mongoose.model("shopCategorys", ShopCategorySchema);