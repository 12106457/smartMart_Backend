const mongoose = require("mongoose");
const axios = require("axios");
const SellerOrder = require("../models/seller_order_models/order");
const CustomerOrder = require("../models/customer/CustomerOrderModel");
const OrderItem = require("../models/seller_order_models/orderItem");
const Transaction = require("../models/seller_order_models/transactions");
const OrderStatusHistory = require("../models/seller_order_models/orderStatusHistory");
const generateOrderId = require("../utility/orderIdGenerator");
const CustomerCartModel=require("../models/customer/cartModel");

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Begin Transaction

  try {
    const { sellerId, customerId, products, totalOrderAmount, paymentMethod,paymentStatus, shippingAddress,additionalNotes,orderType } = req.body;

    const OrderId=await generateOrderId();

    // ✅ Step 1: Create Order Items
    const orderItems = products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
      totalAmount: product.totalAmount,
    }));

    const savedOrderItems = await OrderItem.insertMany(products, { session });

    // ✅ Step 2: Create Seller Order
    const sellerOrder = new SellerOrder({
      orderNo:OrderId,
      sellerId,
      customerId,
      items: savedOrderItems.map((item) => item._id),
      totalOrderAmount,
      paymentMethod,
      shippingAddress,
      status: "Pending",
      orderType,
      paymentStatus: paymentMethod === "Cash_On_Delivery" ? "Pending" : paymentStatus,
      deliveryStatus: "Pending",
      additionalNotes
    });

    await sellerOrder.save({ session });

    // ✅ Step 3: Create Customer Order
    const customerOrder = new CustomerOrder({
      orderNo:OrderId,
      customerId,
      shopId: sellerId,
      items: savedOrderItems.map((item) => item._id),
      totalOrderAmount,
      paymentMethod,
      shippingAddress,
      orderType,
      status: "Pending",
      paymentStatus: paymentMethod === "Cash_On_Delivery" ? "Pending" : paymentStatus,
    });

    await customerOrder.save({ session });

    // ✅ Step 4: Create Order Status History (Initial Status)
    await OrderStatusHistory.create([{ orderId: OrderId, status: "Pending" }], { session });

    // ✅ Step 5: Create Transaction (If Payment Method is Not COD)
    let transaction = null;
    if (paymentMethod !== "Cash_On_Delivery") {
      transaction = new Transaction({
        orderNo:OrderId,
        shopId:sellerId,
        userId: customerId,
        paymentMethod,
        status: paymentStatus,
        amount: totalOrderAmount,
        transactionId: `TXN-${Date.now()}`, // Mock Transaction ID
      });
      await transaction.save({ session });
    }

    await CustomerCartModel.updateOne(
      { customerId },
      { $set: { items: [] } },
      { session }
    );
    const updatedCart = await CustomerCartModel.findOne({ customerId }).session(session);
    console.log("Updated Cart:", updatedCart);
    await session.commitTransaction(); // Commit Transaction
    session.endSession();

    // ✅ Step 6: Notify WebSocket Microservice (Send Order to Seller's Page)
    try {
      await axios.post(
        "https://smart-mart-websocket.onrender.com/place-order"
        // "http://localhost:8080/place-order"
        , {
        orderId: OrderId,
      });
    } catch (wsError) {
      console.error("WebSocket Microservice Error:", wsError.message);
    }
    console.log("Order placed successfully...")

    res.status(201).json({ success: true, message: "Order created", orderId: OrderId });
  } catch (error) {
    await session.abortTransaction(); // Rollback in case of error
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ GET ALL ORDERS (With Order History & Transactions)
exports.getSellerOrders = async (req, res) => {
  try {
    const { sellerId } = req.params; 
    
    const orders = await SellerOrder.find({ sellerId })
      .select("-__v -createdAt -updatedAt")
      .populate("customerId","_id name email phone image address location") 
      .populate({
        path: "items", 
        populate: {
          path: "productId",
          select:"_id name category description price", 
          populate: {
            path: "prodId", 
            select:"image"
          },
        },
        select:"_id quantity totalAmount"
      })
      .lean()
      .sort({ orderDate: -1 });

    
    // Respond with the populated orders
    res.status(200).send({
      status:true,
      message:"fetch the seller orders",
      data: orders
    });
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


// --------------------------customer order controllers------------------------------

exports.sendCustomerOrder=async (req,res)=>{
  try {
    const { customerId } = req.params; 
    
    const orders = await CustomerOrder.find({ customerId })
      .select("-__v -createdAt -updatedAt")
      .populate("shopId","_id name shopAddress phone location shopImage image openingHours rating shopCategory") 
      .populate({
        path: "items", 
        populate: {
          path: "productId",
          select:"_id name category description price", 
          populate: {
            path: "prodId", 
            select:"image"
          },
        },
        select:"_id quantity totalAmount"
      })
      .lean()
      .sort({ orderDate: -1 });

    
    // Respond with the populated orders
    res.status(200).send({
      status:true,
      message:"fetch the seller orders",
      data: orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
