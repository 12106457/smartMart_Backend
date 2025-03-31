const mongoose = require("mongoose");
const Shop = require("../../models/shopModel");
const ShopProduct = require("../../models/shopProdctModel");

exports.findNearbyShops = async (req, res) => {
    try {
        let { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ message: "Valid latitude and longitude are required" });
        }

        const userLocation = {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        };

        const maxDistance = (isNaN(radius) ? 5 : parseFloat(radius)) * 1000;

        const nearbyShops = await Shop.aggregate([
            {
                $geoNear: {
                    near: userLocation,
                    distanceField: "distance",
                    maxDistance: maxDistance,
                    spherical: true
                }
            },
            {
                $lookup: {
                    from: "shopproducts",
                    let: { shopId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$shopId", "$$shopId"] } } },
                        { $sample: { size: 10 } }, // Fetch 10 random products
                        {
                            $lookup: {
                                from: "productimages",
                                localField: "prodId",
                                foreignField: "_id",
                                as: "productDetails"
                            }
                        },
                        { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                category: 1,
                                description: 1,
                                price: 1,
                                stock: 1,
                                available: 1,
                                productImage: "$productDetails.image" 
                            }
                        }
                    ],
                    as: "products"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    shopAddress: 1,
                    shopImage: 1,
                    rating: 1,
                    distance: { $round: [{ $divide: ["$distance", 1000] }, 2] },
                    products: 1
                }
            }
        ]);

        return res.status(200).json({
            status: true,
            message: `Fetched shops within ${radius || "5"} km radius`,
            shops: nearbyShops
        });

    } catch (error) {
        console.error("Error fetching nearby shops:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
