const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const shopRoutes = require("./routes/shopRoute");
const masterRoute=require("./routes/masterDataRoute")
const authRoute=require("./routes/authRoute")
const orderRoute=require("./routes/orderRoute")
const notificationRoute=require("./routes/notificationRoute")
const faqController=require("./routes/faqRoute");
const customerRoute=require("./routes/customerRoute");
const mailRoute=require("./routes/mailRoute");
const CustomerHomePageRoute=require("./routes/customerApplicationRoute/homeRoute")
const CustomerProductRoute=require("./routes/customerApplicationRoute/productRoute")
const cors = require("cors");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
    cors({
      origin: true,
      methods: ["POST", "GET", "PUT", "DELETE"],
      credentials: true,
    })
  );
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/shop", shopRoutes);
app.use("/master", masterRoute);
app.use("/auth", authRoute);
app.use("/order",orderRoute);
app.use("/notifications",notificationRoute);
app.use("/faq",faqController);
app.use("/customer",customerRoute);
app.use("/customer",CustomerHomePageRoute);
app.use("/customer",CustomerProductRoute);
app.use("/mail",mailRoute);
app.get("/", (req, res) => {
    res.send("Welcome to the India's Fastest App Backend Server...");
  });


// Function to send a request every 5 minutes (300000 ms)
function keepServerAlive() {
    axios.get(process.env.WEBSOCKET_URL)
        .then(response => {
            console.log(`✅ Server pinged at ${new Date().toLocaleTimeString()}`);
        })
        .catch(error => {
            console.error("❌ Error pinging the server:", error.message);
        });
}

// Call function immediately
keepServerAlive();

// Schedule repeated calls every 5 minutes
setInterval(keepServerAlive, 300000);

const PORT =5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
