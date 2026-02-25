import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/list", authMiddleware, getUserNotifications);
notificationRouter.post("/mark-read", authMiddleware, markAsRead);
notificationRouter.post("/mark-all-read", authMiddleware, markAllAsRead);
notificationRouter.post("/unread-count", authMiddleware, getUnreadCount);
notificationRouter.post("/delete", authMiddleware, deleteNotification);

export default notificationRouter;
