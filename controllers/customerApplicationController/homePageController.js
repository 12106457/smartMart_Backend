const mongoose = require("mongoose");
const Shop = require("../../models/shopModel"); 

exports.findNearbyShops = async (req, res) => {
    try {
        // const { latitude, longitude, radius } = req.body; // Accept radius in KM
        let { latitude, longitude, radius } = req.query;

        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ message: "Valid latitude and longitude are required" });
        }

        const userLocation = {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)] // [lng, lat]
        };

        const maxDistance = (isNaN(radius) ? 5 : parseFloat(radius)) * 1000; // Convert KM to meters, default 5km

        // await mongoose.connection.db.collection("shops").dropIndex("location_1").catch(err => console.log(err.message));

        // console.log(await Shop.listIndexes());


        const nearbyShops = await Shop.aggregate([
        
            {
                $geoNear: {
                    near: userLocation,
                    distanceField: "distance", // Will return the distance in meters
                    maxDistance: maxDistance, // Limit to given radius
                    spherical: true
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    shopAddress: 1,
                    shopImage: 1,
                    rating: 1,
                    distance: { $round: [{ $divide: ["$distance", 1000] }, 2] } // Convert meters to KM (2 decimal places)
                }
            }
        ]);

        if (nearbyShops.length > 0) {
            return res.status(200).json({
                status: true,
                message: `Fetched shops within ${radius ? radius : "5"} km radius`,
                shops: nearbyShops
            });
        } else {
            return res.status(200).json({
                status: true,
                message: `No shops found within ${radius ? radius : "5"} km radius`
            });
        }

    } catch (error) {
        console.error("Error fetching nearby shops:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
