const shopCategory =require("../models/shopCategoryModel");
const subCategorys=require("../models/subCategoryModel");
const shopModel=require("../models/shopModel");
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

exports.addSubCategoryData=async (req, res)=>{
    try{
         if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).send({
                status: false,
                message: "Please send an array of categories"
            });
        }

        
        const masterData = await subCategorys.insertMany(req.body);

        res.status(200).send({
            status: true,
            message: "SubCategories added successfully",
            data: masterData
        });

    }catch(error){
        console.error("Error in addSubCategory:", error);
        res.status(500).send({ status: false, message: "Something went wrong." });
    }
}

exports.sendSubCategoryList = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res.json({ status: false, message: "categoryId required" });
    }

    const subCategoryList = await subCategorys.find({ category: categoryId });

    res.json({ status: true, message: "Fetch successful", data: subCategoryList });
  } catch (error) {
    console.error("Error in sendSubCategoryList:", error);
    res.status(500).send({ status: false, message: "Something went wrong." });
  }
};

exports.getSubcategoryParticularShop = async (req, res) => {
  try {
    const shopId = req.params.shopId;

    if (!shopId) {
      return res.status(400).json({ status: false, message: "shopId is required" });
    }

    const shopData = await shopModel
      .findOne({ shopId }) // Use findOne with object
      .populate("subCategorys");

    if (!shopData) {
      return res.status(404).json({ status: false, message: "Shop not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Subcategories fetched successfully",
      data: shopData.subCategorys,
    });
  } catch (error) {
    console.error("Error in getSubcategoryParticularShop:", error);
    res.status(500).send({ status: false, message: "Something went wrong." });
  }
};