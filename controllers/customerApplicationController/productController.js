const cartModel=require("../../models/customer/cartModel");
const productModel=require("../../models/shopProdctModel");
const shopModel=require("../../models/shopModel");
const customerOrderModel=require("../../models/customer/CustomerOrderModel")

exports.sendParticularProductDetails = async (req, res) => {
    try {
        const { id } = req.query;
        console.log("id:",id);
        if (!id) {
            return res.status(400).json({ status: false, message: "Product ID is required" });
        }

        // Fetch product details and populate shop details
        const productData = await productModel.findById(id).populate("prodId");

        if (!productData) {
            return res.status(404).json({ status: false, message: "No product found" });
        }

        return res.status(200).json({ 
            status: true, 
            message: "Product details fetched successfully", 
            data: productData 
        });

    } catch (error) {
        console.error("Error fetching product details:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const { customerId, productId, quantity } = req.body;

        // ✅ Validate input
        if (!customerId || !productId || quantity < 0) {
            return res.status(400).json({ status: false, message: "Invalid input" });
        }

        // ✅ Fetch product details (includes shopId)
        const product = await productModel.findById(productId)
            .select("shopId prodId name category description price stock");

        if (!product) {
            return res.status(404).json({ status: false, message: "Product not found" });
        }

        // ✅ Find user's cart
        let cart = await cartModel.findOne({ customerId });

        if (!cart) {
            cart = new cartModel({ customerId, items: [] });
        }

        // ✅ Check if cart has existing items
        if (cart.items.length > 0) {
            // Fetch shopId of the first product in the cart
            const existingProduct = await productModel.findById(cart.items[0].productId).select("shopId");

            if (existingProduct && existingProduct.shopId.toString() !== product.shopId.toString()) {
                // ✅ Different shop detected → Clear cart
                cart.items = [];
            }
        }

        // ✅ Check if product already exists in cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex !== -1) {
            if (quantity === 0) {
                cart.items.splice(itemIndex, 1); // ✅ Remove product from cart
            } else {
                cart.items[itemIndex].quantity = quantity;
                cart.items[itemIndex].totalAmount = product.price * quantity;
            }
        } else if (quantity > 0) {
            cart.items.push({ productId, quantity, totalAmount: product.price * quantity });
        }

        // ✅ Save updated cart
        await cart.save();

        // ✅ Fetch updated cart with full product details
        const updatedCart = await cartModel.findOne({ customerId })
            .populate({
                path: "items.productId",
                select: "prodId name category description price",
                populate: {
                    path: "prodId",
                    select: "name image"
                }
            });

        return res.status(200).json({ status: true, message: "Cart updated successfully", cart: updatedCart });

    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
};



exports.sendCartDetails = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("hostname:",req.headers.host)
        // ✅ Validate customer ID
        if (!id) {
            return res.status(400).send({ status: false, message: "Please provide customer ID" });
        }

        // ✅ Fetch the cart using customerId (not _id)
        const cartDetails = await cartModel
        .findOne({ customerId: id })
        .populate({
            path: "items.productId",
            populate: {
                path: "prodId", 
                select:"image name"
            },
        });
        if (!cartDetails) {
            return res.status(404).send({ status: false, message: "Cart not found" });
        }

        // ✅ Send response
        return res.status(200).send({ status: true, message: "Fetched the cart data", data: cartDetails });

    } catch (error) {
        console.error("Error fetching cart details:", error);
        return res.status(500).send({ status: false, message: "Internal server error" });
    }
};

exports.getCustomerOrderList = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).send({ status: false, message: "Customer ID is required" });
        }

        const customerOrderDetails = await customerOrderModel
        .find({ customerId: id })
        .populate({
            path: "shopId",
            select: "name shopAddress shopImage" // Only fetch these fields
        })
        .populate({
            path: "items",
            populate: {
                path: "productId", // Populating productId inside items
                model: "ShopProduct",
                select:"productId name category description price",
                populate:{
                    path:"prodId",
                    model:"ProductImage",
                    select:"image"
                }
            }
        }).select("shippingAddress orderNo shopId items totalOrderAmount status paymentMethod orderType estimatedDelivery")
        .exec();

        if (!customerOrderDetails || customerOrderDetails.length === 0) {
            return res.status(404).send({ status: false, message: "No orders found" });
        }

        res.status(200).send({ status: true, message: "Orders fetched successfully", data: customerOrderDetails });

    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).send({ status: false, message: "Internal server error" });
    }
};



