const Customer = require("../models/customer/CustomerModel"); 
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");
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

exports.customerLogin = async (req, res) => {
    try {
        const { phone } = req.body; 

        if (!phone) {
            return res.status(400).send({ status: false, message: "Phone number is required" });
        }

        const existingCustomer = await Customer.findOne({ phone });

        if (!existingCustomer) {
            return res.status(404).send({ status: false, message: "No record found" });
        }

        // 🔹 Mail API URL (Self API call)
        const mailApiUrl = `${req.protocol}://${req.get("host")}/mail/send`;

        let mailResponse;
        try {
            // 🔹 Send only the email in the request body
            const response = await axios.post(mailApiUrl, { email: existingCustomer.email });
            mailResponse = response.data;  // Expected { status: true/false, message: "some message" }
        } catch (mailError) {
            console.error("Error sending email:", mailError.response?.data || mailError.message);
            mailResponse = { status: false, message: "Failed to send email" };
        }

        // 🔹 Final response with only status and message from the mail API response
        return res.status(200).send(mailResponse);

    } catch (error) {
        console.error("Error in customerLogin:", error);
        return res.status(500).send({ status: false, message: "Server error" });
    }
};