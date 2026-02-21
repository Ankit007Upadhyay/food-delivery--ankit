import userModel from "../models/userModel.js";

// Get all pending restaurant owner requests
const getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await userModel.find({ 
      role: "restro_owner", 
      isApproved: false 
    }).select("-password");
    res.json({ success: true, data: pendingRequests });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get all approved restaurant owners
const getApprovedOwners = async (req, res) => {
  try {
    const approvedOwners = await userModel.find({ 
      role: "restro_owner", 
      isApproved: true 
    }).select("-password");
    res.json({ success: true, data: approvedOwners });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Approve restaurant owner request
const approveOwner = async (req, res) => {
  try {
    const { ownerId } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      ownerId,
      { isApproved: true },
      { new: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, message: "Restaurant owner approved", data: updatedUser });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Reject restaurant owner request
const rejectOwner = async (req, res) => {
  try {
    const { ownerId } = req.body;
    const deletedUser = await userModel.findByIdAndDelete(ownerId);
    
    if (!deletedUser) {
      return res.json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, message: "Restaurant owner request rejected and deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get restaurant owner profile
const getOwnerProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findById(userId).select("-password");
    
    if (!user || user.role !== "restro_owner") {
      return res.json({ success: false, message: "Restaurant owner not found" });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { 
  getPendingRequests, 
  getApprovedOwners, 
  approveOwner, 
  rejectOwner, 
  getOwnerProfile 
};
