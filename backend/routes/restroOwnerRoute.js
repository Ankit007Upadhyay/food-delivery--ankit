import express from "express";
import { 
  getPendingRequests, 
  getApprovedOwners, 
  approveOwner, 
  rejectOwner, 
  getOwnerProfile 
} from "../controllers/restroOwnerController.js";

const restroOwnerRouter = express.Router();

// Admin routes for managing restaurant owners
restroOwnerRouter.get("/pending", getPendingRequests);
restroOwnerRouter.get("/approved", getApprovedOwners);
restroOwnerRouter.post("/approve", approveOwner);
restroOwnerRouter.post("/reject", rejectOwner);

// Restaurant owner routes
restroOwnerRouter.post("/profile", getOwnerProfile);

export default restroOwnerRouter;
