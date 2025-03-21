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

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).send({status:false,message:"Missing" });
    }

    // ✅ Check if email or phone already exists
    const existingCustomer = await Customer.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingCustomer) {
      return res.status(409).send({status:false, message: "Exist" });
    }

    // ✅ Create new customer
    const newCustomer = new Customer({ name, email, phone });
    const savedCustomer = await newCustomer.save();

    res.status(201).json({ status:true,message: "Customer created successfully", data: savedCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);

    // ✅ Handle duplicate key error (MongoDB E11000 error)
    if (error.code === 11000) {
      return res.status(409).json({ status:false,message: "Exist" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};