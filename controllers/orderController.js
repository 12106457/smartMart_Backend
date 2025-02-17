const mongoose = require("mongoose");
const Order = require("../models/orders/order");
const OrderItem = require("../models/orders/orderItem");
const Transaction = require("../models/orders/transactions");
const OrderStatusHistory = require("../models/orders/orderStatusHistory");
const axios = require("axios"); // Import axios for API call

// ✅ CREATE ORDER WITH TRANSACTION LOGGING

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Begin Transaction

  try {
    const { sellerId, customerId, products, totalOrderAmount, paymentMethod, shippingAddress } = req.body;

    // ✅ Step 1: Create Order
    const order = new Order({ sellerId, customerId, totalOrderAmount, paymentMethod, shippingAddress });
    await order.save({ session });

    // ✅ Step 2: Add Order Items
    const orderItems = products.map((product) => ({
      orderId: order._id,
      productId: product.productId,
      quantity: product.quantity,
      totalAmount: product.totalAmount,
    }));

    await OrderItem.insertMany(orderItems, { session });

    // ✅ Step 3: Create Order Status History (Initial Status)
    await OrderStatusHistory.create([{ orderId: order._id, status: "Pending" }], { session });

    // ✅ Step 4: Create Transaction (If Payment Method is Not COD)
    if (paymentMethod !== "cash_on_delivery") {
      await Transaction.create(
        [
          {
            orderId: order._id,
            userId: customerId,
            paymentMethod,
            status: "Pending",
            amount: totalOrderAmount,
            transactionId: `TXN-${Date.now()}`, // Mock Transaction ID
          },
        ],
        { session }
      );
    }

    await session.commitTransaction(); // Commit Transaction
    session.endSession();

    // ✅ Step 5: Notify WebSocket Microservice (Send Order to Seller's Page)
    try {
      await axios.post("https://smart-mart-websocket.onrender.com/place-order", {
        orderId: order._id, // Send order ID to WebSocket microservice
      });
    } catch (wsError) {
      console.error("WebSocket Microservice Error:", wsError.message);
    }

    res.status(201).json({ success: true, message: "Order created", order });
  } catch (error) {
    await session.abortTransaction(); // Rollback in case of error
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL ORDERS (With Order History & Transactions)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("sellerId customerId")
      .lean(); // Convert Mongoose docs to plain objects

    for (const order of orders) {
      order.items = await OrderItem.find({ orderId: order._id }).populate("productId").lean();
      order.transactions = await Transaction.find({ orderId: order._id }).lean();
      order.statusHistory = await OrderStatusHistory.find({ orderId: order._id }).lean();
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE ORDER STATUS & LOG IN HISTORY
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Update Order Status
    order.status = status;
    await order.save();

    // ✅ Log Order Status History
    await OrderStatusHistory.create({ orderId, status });

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ PROCESS PAYMENT (Updates Transaction)
exports.processPayment = async (req, res) => {
  try {
    const { orderId, transactionId, status } = req.body;

    const transaction = await Transaction.findOne({ orderId });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    transaction.status = status;
    transaction.transactionId = transactionId || transaction.transactionId;
    await transaction.save();

    // ✅ If Payment is Successful, Update Order Payment Status
    if (status === "Success") {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "Paid" });
    } else if (status === "Failed") {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "Failed" });
    }

    res.json({ message: "Payment updated", transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
