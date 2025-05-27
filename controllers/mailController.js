const Customer = require("../models/customer/CustomerModel");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generateOTP = require("../utility/otpGenerator");
const otpModel = require("../models/mail/otpModel");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const expiryTime = 10 * 60 * 1000; 

exports.sendMail = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const plainOtp = generateOTP();

    let emailAddress = "";
    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { phone }],
    });

    if (phone) {
      if (!existingCustomer) {
        return res
          .status(404)
          .send({ status: false, message: "Phone number not found." });
      }
      emailAddress = existingCustomer.email;
    } else if (email) {
      emailAddress = email;
    } else {
      return res
        .status(400)
        .send({ status: false, message: "Email or phone is required." });
    }

    // Delete old OTP if exists
    await otpModel.deleteOne({ email: emailAddress });

    
    const hashedOtp = await bcrypt.hash(plainOtp.toString(), 10);

    const expiresAt = new Date(Date.now() + expiryTime);

    // Save new OTP with expiry
    await otpModel.create({
      email: emailAddress,
      otp: hashedOtp,
      expiresAt,
    });

    // Email content
    const mailOptions = {
      from: "smartmart@gmail.com",
      to: emailAddress,
      subject: "Smart Mart - OTP Verification",
      html: `
        <p>Your One-Time Password (OTP) for Smart Mart verification is:</p>
        <h1 style="color: blue; text-align: center;">${plainOtp}</h1>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <br>
        <p>Thank you,</p>
        <p><strong>Smart Mart Team</strong></p>
      `,
    };

    // Send email
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Mail sending failed:", err);
        return res.status(500).send({ status: false, message: "Email sending failed" });
      }
      console.log("Email sent successfully...");
      return res.status(200).send({ status: true, message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error("Error in sendMail:", error);
    return res.status(500).send({ status: false, message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!email || !otp) {
      return res.status(400).send({ status: false, message: "Email and OTP are required" });
    }

    const otpEntry = await otpModel.findOne({ email });

    if (!otpEntry) {
      return res.status(401).send({ status: false, message: "OTP expired or not found" });
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), otpEntry.otp);

    if (!isOtpValid) {
      return res.status(402).send({ status: false, message: "Wrong OTP" });
    }

    
    await otpModel.deleteOne({ email });

    return res.status(200).send({ status: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).send({ status: false, message: "Server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ status: false, message: "Email is required." });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (!existingCustomer) {
      return res.status(404).send({ status: false, message: "Email not found." });
    }

    const newOtp = generateOTP();
    const hashedOtp = await bcrypt.hash(newOtp.toString(), 10);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await otpModel.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt },
      { upsert: true, new: true }
    );

    const mailOptions = {
      from: "smartmart@gmail.com",
      to: email,
      subject: "Smart Mart - Resend OTP",
      html: `
        <p>Your new OTP for Smart Mart verification is:</p>
        <h1 style="color: blue; text-align: center;">${newOtp}</h1>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <br>
        <p>Thank you,</p>
        <p><strong>Smart Mart Team</strong></p>
      `,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Failed to send OTP email:", err);
        return res.status(500).send({ status: false, message: "Failed to resend OTP" });
      }
      return res.status(200).send({ status: true, message: "OTP resent successfully" });
    });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    res.status(500).send({ status: false, message: "Server error" });
  }
};