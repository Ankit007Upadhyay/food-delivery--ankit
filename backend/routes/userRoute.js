import express from "express";
import authMiddleware from "../middleware/auth.js";
import { loginUser, registerUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/profile", authMiddleware, getUserProfile);
userRouter.post("/update-profile", authMiddleware, updateUserProfile);

export default userRouter;
