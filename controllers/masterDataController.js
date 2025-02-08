const shopCategory =require("../models/shopCategoryModel");

exports.addShopCategory = async (req, res) => {
    try {
    
        if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).send({
                status: false,
                message: "Please send an array of categories"
            });
        }

        
        const masterData = await shopCategory.insertMany(req.body);

        res.status(200).send({
            status: true,
            message: "Categories added successfully",
            data: masterData
        });
    } catch (error) {
        console.error("Error in addShopCategory:", error);
        res.status(500).send({ status: false, message: "Something went wrong." });
    }
};


exports.getShopCategory = async (req, res) => {
    try {
    
        const masterData = await shopCategory.find();

        res.status(200).send({
            status: true,
            message: "fetched category successfully",
            data: masterData
        });
    } catch (error) {
        console.error("Error in addShopCategory:", error);
        res.status(500).send({ status: false, message: "Something went wrong." });
    }
};