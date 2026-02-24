import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const createAdminInDeployedDB = async () => {
  try {
    // Connect to deployed database
    await mongoose.connect("mongodb+srv://ankityay007_db_user:sOfTOLtdk5IwgbUC@cluster0.mejm2ar.mongodb.net/foody?retryWrites=true&w=majority");
    console.log("Connected to deployed database");

    // Check if admin exists
    const existingAdmin = await userModel.findOne({ email: "wizard7@gmail.com" });
    if (existingAdmin) {
      console.log("✅ Admin already exists in deployed DB");
      console.log("Email:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      console.log("Name:", existingAdmin.name);
    } else {
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("wizGoFood2004", salt);

      const admin = new userModel({
        name: "Wizard Admin",
        email: "wizard7@gmail.com",
        password: hashedPassword,
        role: "admin"
      });

      await admin.save();
      console.log("✅ Admin created successfully in deployed DB");
      console.log("Email: wizard7@gmail.com");
      console.log("Password: wizGoFood2004");
      console.log("Role: admin");
    }

    // Show all users to verify
    const allUsers = await userModel.find({});
    console.log("\n📋 All users in database:");
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdminInDeployedDB();
