const mongoose = require("mongoose");


const FaqSchema = new mongoose.Schema({
  question:{type:String},
  answer:{type:String},
  active:{type:Boolean,default:true},
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Faqs", FaqSchema);
