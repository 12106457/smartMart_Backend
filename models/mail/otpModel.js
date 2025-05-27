// models/mail/otpModel.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true }, // hashed OTP
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // 10 minutes
  }
});

module.exports = mongoose.model("Otp", otpSchema);
