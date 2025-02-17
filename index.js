const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const shopRoutes = require("./routes/shopRoute");
const masterRoute=require("./routes/masterDataRoute")
const authRoute=require("./routes/authRoute")
const orderRoute=require("./routes/orderRoute")
const cors = require("cors");
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

app.use("/shop", shopRoutes);
app.use("/master", masterRoute);
app.use("/auth", authRoute);
app.use("/order",orderRoute);
app.get("/", (req, res) => {
    res.send("Welcome to the India's Fastest App Backend Server...");
  });
const PORT =5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
