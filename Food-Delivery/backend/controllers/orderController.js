import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import notificationModel from "../models/notificationModel.js";
import Stripe from "stripe";
import { createNotification } from "./notificationController.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
  try {
    // Get unique restaurant owners from order items
    const restaurantOwnerIds = [...new Set(req.body.items.map(item => item.addedBy))];
    
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentMethod === "cod" ? "pending" : "pending",
      restaurantOwners: restaurantOwnerIds
    });
    
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create notifications for restaurant owners
    for (const ownerId of restaurantOwnerIds) {
      if (ownerId) { // Only create notification if ownerId exists
        await createNotification(
          ownerId,
          "New Order Received!",
          `You have a new order worth $${req.body.amount}. Please check your orders panel.`,
          "order_placed",
          newOrder._id
        );
      }
    }

    // Create notification for customer
    const customer = await userModel.findById(req.body.userId);
    await createNotification(
      req.body.userId,
      "Order Placed Successfully!",
      `Your order worth $${req.body.amount} has been placed and is being processed.`,
      "order_placed",
      newOrder._id
    );

    if (req.body.paymentMethod === "cod") {
      // Cash on delivery - order placed directly
      res.json({ success: true, message: "Order placed successfully" });
    } else {
      // Online payment - create Stripe session
      const line_items = req.body.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Delivery Charges",
          },
          unit_amount: 2 * 100,
        },
        quantity: 1,
      });

      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      });

      res.json({ success: true, session_url: session.url });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin pannel
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const order = await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });

      // Create notification for customer
      await createNotification(
        order.userId,
        "Order Status Updated",
        `Your order status has been updated to: ${req.body.status}`,
        "order_status",
        req.body.orderId
      );

      res.json({ success: true, message: "Status Updated Successfully" });
    }else{
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get orders for restaurant owners
const getRestroOwnerOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    
    if (userData.role !== "restro_owner") {
      return res.json({ success: false, message: "You are not a restaurant owner" });
    }
    
    // Get all orders and filter by items.addedBy
    const orders = await orderModel.find({}).populate({
      path: 'userId',
      model: 'user',
      select: 'name email'
    }).populate('items');
    
    // Filter orders that contain items from this restaurant owner
    const filteredOrders = orders.filter(order => {
      const hasOwnerItem = order.items.some(item => {
        return item.addedBy && item.addedBy.toString() === req.body.userId.toString();
      });
      return hasOwnerItem;
    });
    
    res.json({ success: true, data: filteredOrders });
  } catch (error) {
    console.log("Error in getRestroOwnerOrders:", error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove delivered orders from both customer and restaurant owner sides
const removeDeliveredOrders = async (req, res) => {
  try {
    // Find all delivered orders
    const deliveredOrders = await orderModel.find({ status: "Delivered" });
    
    if (deliveredOrders.length === 0) {
      return res.json({ success: true, message: "No delivered orders found", removedCount: 0 });
    }
    
    // Delete all delivered orders
    const result = await orderModel.deleteMany({ status: "Delivered" });
    
    res.json({ 
      success: true, 
      message: `Successfully removed ${result.deletedCount} delivered orders`,
      removedCount: result.deletedCount
    });
    
  } catch (error) {
    console.log("Error removing delivered orders:", error);
    res.json({ success: false, message: "Error removing delivered orders" });
  }
};

// Auto-remove delivered orders (call this function periodically or when status is updated to Delivered)
const autoRemoveDeliveredOrders = async () => {
  try {
    const deliveredOrders = await orderModel.find({ status: "Delivered" });
    if (deliveredOrders.length > 0) {
      await orderModel.deleteMany({ status: "Delivered" });
      console.log(`Auto-removed ${deliveredOrders.length} delivered orders`);
    }
  } catch (error) {
    console.log("Error in auto-remove delivered orders:", error);
  }
};
const updateRestroOrderStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "restro_owner") {
      // Get the order and check if it belongs to this restaurant owner
      const order = await orderModel.findById(req.body.orderId).populate('items');
      
      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }
      
      // Check if this order contains items from this restaurant owner
      const hasOwnerItem = order.items.some(item => {
        return item.addedBy && item.addedBy.toString() === req.body.userId.toString();
      });
      
      if (!hasOwnerItem) {
        return res.json({ success: false, message: "You can only update your own orders" });
      }
      
      // Update the order status
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status
      });
      
      // Create notification for customer
      await createNotification(
        order.userId,
        "Order Status Updated",
        `Your order status has been updated to: ${req.body.status}`,
        "status_update",
        req.body.orderId
      );
      
      // If status is "Delivered", remove the order immediately
      if (req.body.status === "Delivered") {
        console.log(`Order ${req.body.orderId} marked as Delivered - removing from system`);
        await orderModel.findByIdAndDelete(req.body.orderId);
        
        return res.json({ 
          success: true, 
          message: "Order marked as delivered and removed from system",
          orderRemoved: true
        });
      }
      
      res.json({ success: true, message: "Status updated successfully" });
    } else {
      res.json({ success: false, message: "You are not a restaurant owner" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, getRestroOwnerOrders, updateRestroOrderStatus, removeDeliveredOrders, autoRemoveDeliveredOrders };
