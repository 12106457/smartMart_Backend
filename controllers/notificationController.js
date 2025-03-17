const NotificationModel =require("../models/notification/sellerNotificationModel");

exports.sellerNotification=async(req, res) => {
    try {
        const { shopId } = req.params; // Extract shopId from URL params
  
        if (!shopId) {
            return res.status(400).json({
                status: false,
                message: "Shop ID is required"
            });
        }
  
        // Fetch notifications related to the shop
        const notifications = await NotificationModel.find({ ShopId:shopId })
            .sort({ createdAt: -1 }) // Latest notifications first
            .lean();
  
        res.status(200).json({
            status: true,
            message: "Fetched notifications successfully",
            data: notifications.length > 0 ? notifications : []
        });
  
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}