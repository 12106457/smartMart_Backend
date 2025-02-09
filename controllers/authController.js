const mongoose = require('mongoose'); 

const shopOwnerProfileModel=require("../models/shopOwnerProfileModel");
const shopModel=require("../models/shopModel");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

//shopOwner register
exports.shopOwnerRegister=async(req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).send({status:false, message: "Password is required." });
        }

        // Generate salt and hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create shop owner
        const newShopOwner = await shopOwnerProfileModel.create({
            ...req.body,
            password: hashedPassword,
        });

        res.status(200).send({
            status:true,
            message: "Profile Creation was successful!",
            data: newShopOwner,
        });
    } catch (error) {
        console.error("Error in shopOwnerRegister:", error);
        res.status(500).send({status:false, message: "Something went wrong." });
    }
  };

//shopOwner login
exports.shopOwnerLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validate input
        if (!phone || !password) {  
            return res.status(400).send({status:false, message: "Phone number and password are required." });
        }

        // Check if shop owner exists
        const shopOwner = await shopOwnerProfileModel.findOne({ phone }).populate("shopId");
        if (!shopOwner) {
            return res.status(404).send({status:false, message: "Shop owner not found." });
        }

        // Compare password
        const isMatch = await bcryptjs.compare(password, shopOwner.password);
        if (!isMatch) {
            return res.status(401).send({status:false, message: "Invalid credentials." });
        }

        // Generate JWT token
        const token = jsonwebtoken.sign(
            { phone: shopOwner.phone }, 
            process.env.JWT_SECRET, 
            { expiresIn: "7d" } // Token expires in 7 days
        );

        res.status(200).send({
            status:true,
            message: "Login successful!",
            token:token,
            data: {
                id: shopOwner._id,
                firstname: shopOwner.firstname,
                lastname: shopOwner.lastname,
                phone: shopOwner.phone,
                shopDetails: shopOwner.shopId,
            }
        });

    } catch (error) {
        console.error("Error in shopOwnerLogin:", error);
        res.status(500).send({status:false, message: "Something went wrong." });
    }
};


exports.updatedProfileDetails = async (req, res) => {
    try {
        const { OwnerId } = req.params;

        // Await the result of findOne to get the owner details
        const ownerDetails = await shopOwnerProfileModel.findOne({ _id: OwnerId });
        if (!ownerDetails) {
            return res.status(404).send({
                status: false,
                message: "No user found. Please register/login again!"
            });
        }

        // Perform the update and await the result of findByIdAndUpdate
        const updatedOwner = await shopOwnerProfileModel.findByIdAndUpdate(
            { _id: OwnerId },
            { $set: req.body },
            { new: true } // To return the updated document
        );

        // Send a response with the updated data
        res.status(200).send({
            status: true,
            message: "Updated details successfully",
            data: updatedOwner
        });

    } catch (error) {
        console.error("Error in updatedProfileDetails:", error);
        res.status(500).send({ status: false, message: "Something went wrong." });
    }
};

exports.updatedShopDetails = async (req, res) => {
    try {
        const { shopId } = req.params;

        // Await the result of findOne to get the shop details
        const shopDetails = await shopModel.findOne({ shopId });
        if (!shopDetails) {
            return res.status(404).send({
                status: false,
                message: "No shop found. Please register/login again!"
            });
        }

        // Perform the update and await the result of findByIdAndUpdate
        const updatedShopDetails = await shopModel.findOneAndUpdate(
            { shopId }, // Use shopId instead of _id
            { $set: req.body },
            { new: true } // To return the updated document
        );

        // Send a response with the updated data
        res.status(200).send({
            status: true,
            message: "Updated details successfully",
            data: updatedShopDetails
        });

    } catch (error) {
        console.error("Error in updatedShopDetails:", error);
        res.status(500).send({ status: false, message: "Something went wrong." });
    }
};