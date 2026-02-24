import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const fixAdminRole = async () => {
  try {
    // Connect to deployed database
    await mongoose.connect("mongodb+srv://ankityay007_db_user:sOfTOLtdk5IwgbUC@cluster0.mejm2ar.mongodb.net/foody?retryWrites=true&w=majority");
    console.log("Connected to deployed database");

    // Update admin role
    const updatedAdmin = await userModel.findOneAndUpdate(
      { email: "wizard7@gmail.com" },
      { role: "admin" },
      { new: true }
    );

    if (updatedAdmin) {
      console.log("✅ Admin role updated successfully!");
      console.log("Email:", updatedAdmin.email);
      console.log("Name:", updatedAdmin.name);
      console.log("Role:", updatedAdmin.role);
    } else {
      console.log("❌ Admin user not found");
    }

    // Verify the update
    const adminUser = await userModel.findOne({ email: "wizard7@gmail.com" });
    console.log("\n🔍 Verification:");
    console.log("User exists:", !!adminUser);
    console.log("Role is admin:", adminUser.role === "admin");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

fixAdminRole();
