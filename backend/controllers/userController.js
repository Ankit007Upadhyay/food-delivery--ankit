import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch =await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    
    // Check if user is approved (for restaurant owners)
    if (!user.isApproved) {
      return res.json({ 
        success: false, 
        message: "Your account is pending admin approval" 
      });
    }
    
    const role=user.role;
    const token = createToken(user._id);
    res.json({ success: true, token, role, isApproved: user.isApproved });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Create token

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user

const registerUser = async (req, res) => {
  const { name, email, password, role, restaurantName, restaurantAddress } = req.body;
  console.log("Registration data received:", { name, email, role, restaurantName, restaurantAddress });
  try {
    // checking user is already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine approval status based on role
    let isApproved = true;
    let userRole = role || "user";
    console.log("Determined userRole:", userRole);
    
    if (userRole === "restro_owner") {
      isApproved = false; // Restaurant owners need admin approval
      console.log("Setting isApproved to false for restaurant owner");
      if (!restaurantName || !restaurantAddress) {
        return res.json({ 
          success: false, 
          message: "Restaurant name and address are required for restaurant owners" 
        });
      }
    }

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      role: userRole,
      isApproved: isApproved,
      restaurantName: restaurantName,
      restaurantAddress: restaurantAddress
    });
    
    console.log("User object to be saved:", {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isApproved: newUser.isApproved,
      restaurantName: newUser.restaurantName
    });

    const user = await newUser.save();
    
    // Only provide token if user is approved (not for pending restaurant owners)
    if (user.isApproved) {
      const token = createToken(user._id);
      res.json({ success: true, token, role: user.role, isApproved: user.isApproved });
    } else {
      res.json({ 
        success: true, 
        message: "Restaurant owner registration submitted. Waiting for admin approval.",
        role: user.role, 
        isApproved: user.isApproved 
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    console.log("=== Backend: Getting User Profile ===");
    console.log("User ID from token:", req.body.userId);
    
    const user = await userModel.findById(req.body.userId).select('-password');
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.json({ success: false, message: "User not found" });
    }
    
    console.log("✅ User found:", user.name, user.email);
    console.log("User role:", user.role);
    console.log("Restaurant name:", user.restaurantName);
    
    res.json({ success: true, data: user });
  } catch (error) {
    console.log("❌ Error fetching profile:", error);
    res.json({ success: false, message: "Error fetching profile" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, restaurantName, restaurantAddress, phone } = req.body;
    const userId = req.body.userId;
    
    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await userModel.findOne({ 
        email: email, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.json({ 
          success: false, 
          message: "Email is already taken by another user" 
        });
      }
    }
    
    // Validate email format if provided
    if (email && !validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (restaurantName) updateData.restaurantName = restaurantName;
    if (restaurantAddress) updateData.restaurantAddress = restaurantAddress;
    if (phone) updateData.phone = phone;
    
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }
    
    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.log("Error updating profile:", error);
    res.json({ success: false, message: "Error updating profile" });
  }
};

export { loginUser, registerUser, getUserProfile, updateUserProfile };
