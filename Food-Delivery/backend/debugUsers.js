import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import { connectDB } from "./config/db.js";
import "dotenv/config";

const debugUsers = async () => {
  try {
    await connectDB();
    
    console.log("=== All Users ===");
    const allUsers = await userModel.find({});
    allUsers.forEach(user => {
      console.log(`Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Approved: ${user.isApproved}`);
    });
    
    console.log("\n=== Pending Restaurant Owners ===");
    const pendingOwners = await userModel.find({ role: "restro_owner", isApproved: false });
    if (pendingOwners.length === 0) {
      console.log("No pending restaurant owners found");
    } else {
      pendingOwners.forEach(owner => {
        console.log(`Name: ${owner.name}, Email: ${owner.email}, Restaurant: ${owner.restaurantName}`);
      });
    }
    
    console.log("\n=== Approved Restaurant Owners ===");
    const approvedOwners = await userModel.find({ role: "restro_owner", isApproved: true });
    if (approvedOwners.length === 0) {
      console.log("No approved restaurant owners found");
    } else {
      approvedOwners.forEach(owner => {
        console.log(`Name: ${owner.name}, Email: ${owner.email}, Restaurant: ${owner.restaurantName}`);
      });
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

debugUsers();
