
// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const shopRoutes = require("./routes/shopRoute");
// const masterRoute = require("./routes/masterDataRoute");
// const authRoute = require("./routes/authRoute");
// const cors = require("cors");
// const WebSocket = require("ws");
// const mongoose = require("mongoose");
// const Order = require("./models/orders");
// const axios = require("axios");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());
// app.use(
//   cors({
//     origin: true,
//     methods: ["POST", "GET", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

// app.use("/shop", shopRoutes);
// app.use("/master", masterRoute);
// app.use("/auth", authRoute);

// app.get("/", (req, res) => {
//   res.send("Welcome to the India's Fastest App Backend Server...");
// });

// // Order route
// // Order route with online check
// app.post('/order', async (req, res) => {
//   const { sellerId, customerId, product, quantity } = req.body;

//   try {
//     // Check if the seller is online
//     if (!sellerConnections[sellerId]) {
//       return res.status(400).json({
//         success: false,
//         message: 'Seller is offline. Order cannot be placed at this moment.',
//       });
//     }

//     // Connect to MongoDB
//     await connectDB();

//     const newOrder = new Order({
//       sellerId,
//       customerId,
//       product,
//       quantity,
//       status: 'pending',
//     });

//     await newOrder.save();

//     // Notify WebSocket server
//     sellerConnections[sellerId].send(JSON.stringify(newOrder));

//     res.status(200).json({ success: true, message: 'Order placed successfully' });
//   } catch (error) {
//     console.error('Error saving order:', error);
//     res.status(500).json({ success: false, message: 'Failed to place order' });
//   }
// });


// // WebSocket Setup
// const wss = new WebSocket.Server({ noServer: true });
// const sellerConnections = {};  // Store active seller WebSocket connections

// wss.on("connection", (ws, req) => {
//   const sellerId = req.url.split("/").pop();  // Get sellerId from URL
//   sellerConnections[sellerId] = ws;
//   console.log(`Seller ${sellerId} connected`);

//   ws.on("close", () => {
//     delete sellerConnections[sellerId];
//     console.log(`Seller ${sellerId} disconnected`);
//   });
// });

// // WebSocket endpoint to trigger notifications
// app.post("/websocket/connect/:sellerId", async (req, res) => {
//   const { sellerId } = req.params;
//   const { message, order } = req.body;

//   try {
//     if (sellerConnections[sellerId]) {
//       sellerConnections[sellerId].send(JSON.stringify(order));
//       res.status(200).json({ success: true, message: "Order details sent to seller" });
//     } else {
//       res.status(400).json({ success: false, message: "Seller is not connected" });
//     }
//   } catch (error) {
//     console.error("Error sending order to seller:", error);
//     res.status(500).json({ success: false, message: "Failed to send order" });
//   }
// });

// // Create an HTTP server to handle WebSocket upgrade
// const http = require('http');
// const server = http.createServer(app);

// server.on("upgrade", (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit("connection", ws, request);
//   });
// });

// const PORT = 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

