import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";
import mongoose from "mongoose";

// add food items

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
    addedBy: req.body.userId // Track who added the food item
  });
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && (userData.role === "admin" || userData.role === "restro_owner")) {
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "You are not authorized to add food items" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    console.log("=== Fetching all food items ===");
    
    // Check database connection first
    if (mongoose.connection.readyState !== 1) {
      console.log("❌ Database not connected");
      return res.status(500).json({ success: false, message: "Database not connected" });
    }
    
    const foods = await foodModel.find({}).populate('addedBy', 'name email');
    console.log("✅ Found", foods.length, "food items in database");
    
    if (foods.length > 0) {
      console.log("Sample food item:", foods[0].name);
    }
    
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("❌ Error fetching food list:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    const food = await foodModel.findById(req.body.id);
    
    if (!food) {
      return res.json({ success: false, message: "Food item not found" });
    }
    
    if (userData && (userData.role === "admin" || (userData.role === "restro_owner" && food.addedBy.toString() === req.body.userId))) {
      fs.unlink(`uploads/${food.image}`, () => {});
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not authorized to remove this food item" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
