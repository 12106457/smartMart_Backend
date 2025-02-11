const mongoose = require('mongoose'); // For ObjectId validation
const ShopProduct = require('../models/shopProdctModel');
const Product = require('../models/productModel');
const Shop = require('../models/shopModel');
const shopOwnerModel=require('../models/shopOwnerProfileModel.js')
const generateUniqueShopId =require('../utility/shopIdGenerator.js');


// Add a New Shop
exports.addShop = async (req, res) => {
    try {
        const { name, location } = req.body;
        const { ownerId } = req.params; 

        // Validate input
        if (!name || !location) {
            return res.status(400).send({
                status: false,
                message: "Shop name and location are required."
            });
        }

         // Find the shop owner's profile
         const ownerProfileDetails = await shopOwnerModel.findOne({ _id: ownerId });

         if (!ownerProfileDetails) {
             return res.status(404).send({
                 status: false,
                 message: "Shop owner Profile not found.Please register first"
             });
         }

        // Check if a shop with the same name and location already exists
        const existingShop = await Shop.findOne({ name, location });
        if (existingShop) {
            return res.status(400).send({
                status: false,
                message: "A shop with this name already exists at this location."
            });
        }

        

        // Generate a unique shop ID
        const generatedShopId = await generateUniqueShopId();

        // Create a new shop
        const newShop = await Shop.create({
            shopId: generatedShopId,
            ...req.body
        });

       

        // Update the shopId in the owner's profile
        ownerProfileDetails.shopId = newShop._id; // ✅ Correctly assigning `shopId`
        await ownerProfileDetails.save(); // ✅ Ensuring update is saved

        res.status(201).send({
            status: true,
            message: "Shop Register added successfully",
            data: newShop
        });

    } catch (error) {
        console.error("Error in addShop:", error);
        
        if (error.name === "ValidationError") {
            // Extract validation error messages
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({ status: false, error: "Validation Error", message: errors });
        }

        res.status(500).send({ error: "Something went wrong" });
    }
};

//Add a new product
exports.addProduct = async (req, res) => {
    try {

        const newProduct = new Product(req.body);
        await newProduct.save();

        res.status(201).send({
            status: true,
            message: "New Product added successfully",
            data: newProduct
        });


    } catch (error) {
        if (error.name === "ValidationError") {
            // Extract validation error messages
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({status:false, error: "Validation Error", message: errors });
        }
        
        res.status(500).send({ error: "Something went wrong" });
    }
};

//Add a new shopProduct
exports.addShopProduct = async (req, res) => {
    try {
        const {shopId,prodId}=req.body;
        //validation check
        if(!shopId||!prodId){
            return res.status(400).send({
                status: false,
                message: "ShopId and ProdId are required."
            });
        }

        // Check if shop exists
        const shopExists = await Shop.findById(shopId);
        if (!shopExists) {
            return res.status(404).send({
                status: false,
                message: "Shop not found. Please provide a valid ShopId."
            });
        }

        // Check if product exists
        const productExists = await Product.findById(prodId);
        if (!productExists) {
            return res.status(404).send({
                status: false,
                message: "Product not found. Please provide a valid ProdId."
            });
        }

        // Check if the product is already added to the shop
        const existingShopProduct = await ShopProduct.findOne({ shopId, prodId });
        if (existingShopProduct) {
            return res.status(400).send({
                status: false,
                message: "This product is already added to the shop."
            });
        }

        const newShopProduct=new ShopProduct(req.body);
        newShopProduct.save();
        res.status(201).send({
            status:true,
            message:"Product added to shop successfully",
            data:newShopProduct
        })


    } catch (error) {
        if (error.name === "ValidationError") {
            // Extract validation error messages
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({ status:false,error: "Validation Error", message: errors });
        }
        
        res.status(500).send({ error: "Something went wrong" });
    }
};


// Get all products for a particular shop
exports.getShopProducts = async (req, res) => {
    try {
        const { shopId } = req.params;

        // Validate input
        if (!shopId) {
            return res.status(400).send({
                status: false,
                message: "ShopId is required."
            });
        }

        // Check if shop exists
        const shopExists = await Shop.findById(shopId);
        if (!shopExists) {
            return res.status(404).send({
                status: false,
                message: "Shop not found. Please provide a valid ShopId."
            });
        }

        // Fetch products associated with the shop
        const shopProducts = await ShopProduct.find({ shopId })
            .populate("prodId"); // Populates product details from Product collection

        if (!shopProducts.length) {
            return res.status(404).send({
                status: false,
                message: "No products found for this shop."
            });
        }

        res.status(200).send({
            status: true,
            message: "Products retrieved successfully.",
            data: shopProducts
        });

    } catch (error) {
        console.error("Error in getShopProducts:", error);
        res.status(500).send({ error: "Something went wrong" });
    }
};

exports.updateShopProducts = async (req, res) => {
    try {
        const { id, price, stock, available, image, category, description, name } = req.body;

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (price !== undefined) updateFields.price = price;
        if (stock !== undefined) updateFields.stock = stock;
        if (available !== undefined) updateFields.available = available;
        if (description !== undefined) updateFields.description = description;
        if (category !== undefined) updateFields.category = category;

        const updatedShopProduct = await ShopProduct.findOneAndUpdate(
            { _id: id },
            { $set: updateFields },
            { new: true } // ✅ Ensures updated document is returned
        ).populate("prodId");

        if (!updatedShopProduct) {
            return res.status(404).send({
                status: false,
                message: "This product is not associated with the provided shop."
            });
        }

        res.status(200).send({
            status: true,
            message: "Shop product and associated product details updated successfully.",
            data: updatedShopProduct
        });

    } catch (error) {
        console.error("Error in updateShopProducts:", error);
        res.status(500).send({ error: "Something went wrong." });
    }
};

exports.productSearchResult = async (req, res) => {
    try {
        const { search } = req.query;

        let query = {}; // Default query

        if (search && search.trim() !== "") {
            query.name = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        // Fetch matching products if search exists, else return first 10 products
        const result = Object.keys(query).length > 0
            ? await Product.find(query).limit(20) // Fetch filtered products
            : await Product.find().limit(14); // Fetch first 10 products if no search

        res.status(200).send({
            status: true,
            message: search && search.trim() !== "" 
                ? "Search results fetched successfully." 
                : "Initial product list (first 10).",
            data: result
        });

    } catch (error) {
        console.error("Error in productSearchResult:", error);
        res.status(500).send({ error: "Something went wrong." });
    }
};

