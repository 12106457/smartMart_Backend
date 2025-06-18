const mongoose = require("mongoose");


const SubCategorySchema = new mongoose.Schema({
    category: {type: mongoose.Schema.Types.ObjectId, ref: "shopCategorys", required: true,index:true  },
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
module.exports = mongoose.model("subCategorys", SubCategorySchema);