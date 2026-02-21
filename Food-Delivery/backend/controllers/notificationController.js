import notificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";

// Create a new notification
const createNotification = async (userId, title, message, type, orderId = null) => {
  try {
    const notification = new notificationModel({
      userId,
      title,
      message,
      type,
      orderId
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// Get notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({ userId: req.body.userId })
      .sort({ createdAt: -1 })
      .populate('orderId', 'amount status')
      .limit(20);
    
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching notifications" });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await notificationModel.findByIdAndUpdate(notificationId, { isRead: true });
    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error marking notification as read" });
  }
};

// Mark all notifications as read for a user
const markAllAsRead = async (req, res) => {
  try {
    await notificationModel.updateMany(
      { userId: req.body.userId, isRead: false },
      { isRead: true }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error marking notifications as read" });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationModel.countDocuments({
      userId: req.body.userId,
      isRead: false
    });
    res.json({ success: true, count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching unread count" });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await notificationModel.findByIdAndDelete(notificationId);
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting notification" });
  }
};

export {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
};
