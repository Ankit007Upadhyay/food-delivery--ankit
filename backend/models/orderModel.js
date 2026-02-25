import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  items: [{
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "food", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  }],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "pending" },
  status: { type: String, default: "pending_acceptance" }, // "pending_acceptance", "Food Processing", "Out for delivery", "Delivered", "rejected"
  restaurantOwners: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }], // Single restaurant owner
  deliveryBoyNumber: { type: String, default: "" }, // Delivery boy contact number
  cancellationReason: { type: String },
  cancelledAt: { type: Date },
},
{ minimize: false, timestamps: true }
);

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
