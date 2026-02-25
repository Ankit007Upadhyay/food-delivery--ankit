import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import restroOwnerRouter from "./routes/restroOwnerRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import mongoose from "mongoose";

// app config
const app = express();
const port =process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5177', 'https://food-delivery-ankit-backend.onrender.com', 'https://food-delivery-ankit-front.vercel.app', 'https://food-delivery-ankit-restro.vercel.app', 'https://gorestrofront.vercel.app'],
  credentials: true
}));

// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/restro-owner", restroOwnerRouter);
app.use("/api/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

app.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
