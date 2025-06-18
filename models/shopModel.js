const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
    shopId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shopAddress: { type: String, required: true },
    location: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    shopCategory: { type: mongoose.Schema.Types.ObjectId, ref: "shopCategorys", required: true },
    subCategorys:[{ type: mongoose.Schema.Types.ObjectId, ref: "subCategorys", required: true }],
    shopImage: { type: String },
    openingHours: { type: String, required: true },
    rating: { type: Number, default: 5 },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// ✅ Add 2dsphere Index for location
ShopSchema.index({ location: "2dsphere" }); 

// ✅ Additional indexes (Avoid duplicate indexes)
ShopSchema.index({ shopId: 1 });
ShopSchema.index({ name: 1 });

module.exports = mongoose.model("Shop", ShopSchema);
