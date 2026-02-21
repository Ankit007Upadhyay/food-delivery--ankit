import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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

export { loginUser, registerUser };
