import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

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
    const foods = await foodModel.find({});
    console.log("✅ Found", foods.length, "food items in database");
    if (foods.length > 0) {
      console.log("Sample food item:", foods[0]);
    }
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log("❌ Error fetching food list:", error);
    res.json({ success: false, message: "Error" });
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
