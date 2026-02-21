import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["order_placed", "order_status", "order_delivered", "payment_received"], required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const notificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema);

export default notificationModel;
