const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    ShopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // 24 hours from now
  },
  { timestamps: true }
);

// TTL index: MongoDB automatically deletes documents after 24 hours
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Notification", notificationSchema);
