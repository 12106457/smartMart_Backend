const mongoose = require('mongoose'); 

const shopOwnerProfileModel=require("../models/shopOwnerProfileModel");
const shopModel=require("../models/shopModel");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const Customer = require("../models/customer/CustomerModel"); 

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
                email:shopOwner.email,
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
        const { firstname, lastname,email } = req.body;

        
        const ownerDetails = await shopOwnerProfileModel.findOne({ _id: OwnerId });
        if (!ownerDetails || !ownerDetails.shopId) {
            return res.status(404).send({
                status: false,
                message: "No user found. Please register/login again!"
            });
        }

        
        const updatedOwner = await shopOwnerProfileModel.findByIdAndUpdate(
            OwnerId, 
            { $set: { firstname, lastname,email } },
            { new: true } 
        );

        let UpdatedShopProfile = null;
        
        if (updatedOwner.shopId) {
            UpdatedShopProfile = await shopModel.findByIdAndUpdate(
                updatedOwner.shopId,
                { $set: req.body },
                { new: true }
            );
        }

       
        return res.status(200).send({
            status: true,
            message: "Updated details successfully",
            data: {
                profileData: updatedOwner,
                shopDetails: UpdatedShopProfile || "No shop details found",
            }
        });

    } catch (error) {
        console.error("Error in updatedProfileDetails:", error);
        return res.status(500).send({
            status: false,
            message: "Something went wrong.",
            error: error.message
        });
    }
};

exports.changeExistingPassword = async (req, res) => {
    try {
        const { id, previousPassword, newPassword } = req.body;

        // Check if user exists
        const userProfileData = await shopOwnerProfileModel.findById(id);
        if (!userProfileData) {
            return res.status(404).send({
                status: false,
                message: "User not found"
            });
        }

        // Verify previous password
        const isPasswordValid = await bcryptjs.compare(previousPassword, userProfileData.password);
        if (!isPasswordValid) {
            return res.status(400).send({
                status: false,
                message: "Incorrect previous password"
            });
        }

        // Hash new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        // Update password
        const updatedProfileDetails = await shopOwnerProfileModel.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        if (updatedProfileDetails) {
            return res.status(200).send({
                status: true,
                message: "Password updated successfully"
            });
        } else {
            return res.status(500).send({
                status: false,
                message: "Failed to update password"
            });
        }
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).send({
            status: false,
            message: "Internal server error"
        });
    }
};





// ----------------------------------------------------------
exports.createCustomer = async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        image,
        address,
        walletBalance,
        cart,
        orders,
        referralCode,
        isActive,
        location // Accept location from the request body
      } = req.body;
  
      // Ensure location is either omitted or set as an empty object if not provided
      const customerData = {
        name,
        email,
        phone,
        password,
        image,
        address,
        walletBalance: walletBalance || 0, // Default to 0 if not provided
        cart: cart || [],
        orders: orders || [],
        referralCode: referralCode || null,
        isActive: isActive !== undefined ? isActive : true, // Default to true if not provided
        location: location || {} // If location is not provided, set it to an empty object
      };
  
      const newCustomer = new Customer(customerData);
  
      const savedCustomer = await newCustomer.save();
  
      res.status(201).json({ message: 'Customer created successfully', data: savedCustomer });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };