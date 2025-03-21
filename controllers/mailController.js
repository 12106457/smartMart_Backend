const Customer = require("../models/customer/CustomerModel"); 
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generateOTP=require("../utility/otpGenerator")
require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });
  
const otpGeneratorList = {};
const expiryTime = 10 * 60 * 1000; // 10 minutes in milliseconds

exports.sendMail = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const NewOtp = generateOTP(); // Function to generate a 6-digit OTP

    let emailAddress = "";
    const existingCustomer = await Customer.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (phone) {
      // LOGIN CASE: Fetch email using phone number
      if (!existingCustomer) {
        return res.status(404).send({ status: false, message: "Phone number not found." });
      }
      emailAddress = existingCustomer.email;
    } else if (email) {
      // REGISTRATION CASE: Use the email provided in request body
      emailAddress = email;
    } else {
      return res.status(400).send({ status: false, message: "Email or phone is required." });
    }

    // Check if OTP was already sent
    if (otpGeneratorList[emailAddress]) {
        return res.status(200).send({ status: false, message: "OTP already sent to mail" });
      }

    let mailOptions = {
      from: "smartmart@gmail.com",
      to: emailAddress,
      subject: "Smart Mart - OTP Verification",
      text: `Your One-Time Password (OTP) for Smart Mart verification is: ${NewOtp}.\n\nPlease use this OTP to complete your verification process. It is valid for 10 minutes.\n\nIf you did not request this OTP, please ignore this email.\n\nThank you,\nSmart Mart Team`,
      html: `
        <p>Your One-Time Password (OTP) for Smart Mart verification is:</p>
        <h1 style="color: blue; text-align: center;">${NewOtp}</h1>
        <p>Please use this OTP to complete your verification process.</p>
        <p><strong>Note:</strong> This OTP is valid for <strong>10 minutes</strong>.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <br>
        <p>Thank you,</p>
        <p><strong>Smart Mart Team</strong></p>
      `,
    };

    // Store OTP in memory
    otpGeneratorList[emailAddress] = NewOtp;

    // Automatically remove OTP after 10 minutes
    setTimeout(() => {
      delete otpGeneratorList[emailAddress];
      console.log(`OTP for ${emailAddress} has expired.`);
    }, expiryTime);

    transporter.sendMail(mailOptions, (err, result) => {
      if (err) {
        console.log("Something went wrong while sending the mail...");
        return res.status(500).send({ error: "Email sending failed" });
      } else {
        console.log("Email sent successfully...");
        res.status(200).send({ status: true, message: "OTP sent successfully" });
      }
    });

  } catch (error) {
    console.error("Error in sendMail:", error);
    res.status(500).send({ error: "Server error" });
  }
};


exports.verifyOtp = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!email || !otp) {
            return res.status(400).send({ status: false, message: "Email and OTP are required" });
        }

        if (!otpGeneratorList[email]) {
            return res.status(401).send({ status: false, message: "OTP expired or not found" });
        }

        // Convert OTP to string to avoid type mismatch
        if (otpGeneratorList[email].toString() === otp.toString()) {
            delete otpGeneratorList[email]; // Remove OTP after successful verification
            return res.status(200).send({ status: true, message: "OTP verified successfully" });
        } else {
            return res.status(402).send({ status: false, message: "Wrong OTP" });
        }
    } catch (error) {
        console.error("Error in verifyOtp:", error);
        return res.status(500).send({ status: false, message: "Server error" });
    }
};


