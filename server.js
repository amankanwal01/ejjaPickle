const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./backend/config/db");

// 1. LOAD ENVIRONMENT VARIABLES
dotenv.config();

// 2. CONNECT TO DATABASE
connectDB();

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 3. API ROUTES
app.use("/api/users", require("./backend/routes/userRoutes"));
app.use("/api/products", require("./backend/routes/productRoutes"));
app.use("/api/orders", require("./backend/routes/orderRoutes"));
app.use("/api/payments", require("./backend/routes/paymentRoutes"));
app.use("/api/coupons", require("./backend/routes/couponRoutes"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Pickle Shop API is running perfectly!" });
});

// 4. ERROR MIDDLEWARE
const { errorHandler } = require("./backend/middleware/errorMiddleware");
app.use(errorHandler);

// 5. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
