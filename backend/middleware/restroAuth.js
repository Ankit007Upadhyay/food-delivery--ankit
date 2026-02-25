import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const restroAuthMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(token_decode.id);
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    if (user.role !== "restro_owner") {
      return res.json({ success: false, message: "Not authorized. Restaurant owner access required." });
    }
    
    if (!user.isApproved) {
      return res.json({ success: false, message: "Account pending admin approval" });
    }
    
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"});
  }
};

export default restroAuthMiddleware;
