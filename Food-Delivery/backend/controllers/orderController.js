import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import notificationModel from "../models/notificationModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";
import { createNotification } from "./notificationController.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
  try {
    // Get the restaurant owner from the first item (all items should be from same restaurant)
    const restaurantOwnerId = req.body.items[0]?.addedBy;
    
    // Validate that all items are from the same restaurant
    const allFromSameRestaurant = req.body.items.every(item => 
      item.addedBy && item.addedBy.toString() === restaurantOwnerId.toString()
    );
    
    if (!allFromSameRestaurant) {
      return res.json({ 
        success: false, 
        message: "All items must be from the same restaurant" 
      });
    }
    
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentMethod === "cod" ? "pending" : "pending",
      restaurantOwners: [restaurantOwnerId], // Single restaurant owner
      status: "pending_acceptance" // Order is pending acceptance by restaurant owner
    });
    
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create notification for the specific restaurant owner
    if (restaurantOwnerId) {
      console.log("=== Creating notification for restaurant owner ===");
      console.log("Restaurant Owner ID:", restaurantOwnerId);
      console.log("Order ID:", newOrder._id);
      console.log("Order Amount:", req.body.amount);
      
      const notification = await createNotification(
        restaurantOwnerId,
        "New Order - Action Required!",
        `You have a new order worth $${req.body.amount}. Please accept or reject the order.`,
        "order_pending_acceptance",
        newOrder._id
      );
      
      if (notification) {
        console.log("✅ Notification created successfully:", notification._id);
      } else {
        console.log("❌ Failed to create notification");
      }
    } else {
      console.log("❌ No restaurant owner ID found - cannot create notification");
    }
    
    if (req.body.paymentMethod === "cod") {
      await newOrder.save();
      res.json({ success: true, message: "Order Placed - Waiting for Restaurant Acceptance" });
    } else {
      // Stripe payment logic remains the same
      const line_items = req.body.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100 * 80,
        },
        quantity: item.quantity,
      }));

      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Delivery Charges",
          },
          unit_amount: 2 * 100 * 80,
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
    
    console.log("=== Getting orders for restaurant owner ===");
    console.log("Restaurant Owner ID:", req.body.userId);
    console.log("Restaurant Owner Name:", userData.name);
    console.log("Restaurant Name:", userData.restaurantName);
    
    // Get all orders and populate
    const orders = await orderModel.find({}).populate({
      path: 'userId',
      model: 'user',
      select: 'name email'
    }).populate({
      path: 'items._id',
      model: 'food',
      select: 'name addedBy'
    });
    
    console.log("Total orders in database:", orders.length);
    
    // Debug: Show all orders with their status
    orders.forEach(order => {
      const orderId = order._id ? order._id.toString().slice(-8) : 'UNKNOWN';
      console.log(`Order ${orderId} - Status: ${order.status} - Items: ${order.items.length}`);
      order.items.forEach(item => {
        const addedById = item._id?.addedBy || item.addedBy;
        console.log(`  - Item: ${item.name}, addedBy: ${addedById || 'NULL'}`);
      });
    });
    
    // Filter orders that contain items from this restaurant owner
    const filteredOrders = orders.filter(order => {
      const orderId = order._id ? order._id.toString().slice(-8) : 'UNKNOWN';
      console.log(`\nChecking order ${orderId} (status: ${order.status})`);
      
      const hasOwnerItem = order.items.some(item => {
        const addedById = item._id?.addedBy || item.addedBy;
        const belongsToOwner = addedById && 
               addedById.toString() === req.body.userId.toString();
        
        console.log(`  Item "${item.name}" - addedBy: ${addedById || 'NULL'} - belongsToOwner: ${belongsToOwner}`);
        
        if (belongsToOwner) {
          console.log(`✅ Order ${orderId} contains item "${item.name}" from this restaurant`);
        }
        return belongsToOwner;
      });
      
      if (!hasOwnerItem) {
        console.log(`❌ Order ${orderId} has no items from this restaurant`);
      }
      
      return hasOwnerItem;
    }).map(order => {
      // For each order, only include items that belong to this restaurant owner
      const ownerItems = order.items.filter(item => {
        const addedById = item._id?.addedBy || item.addedBy;
        return addedById && addedById.toString() === req.body.userId.toString();
      });
      
      return {
        ...order.toObject(),
        items: ownerItems
      };
    });
    
    console.log("\n=== FINAL RESULTS ===");
    console.log("Filtered orders for this restaurant:", filteredOrders.length);
    filteredOrders.forEach(order => {
      const orderId = order._id ? order._id.toString().slice(-8) : 'UNKNOWN';
      console.log(`✅ Order ${orderId} - Status: ${order.status}`);
    });
    
    res.json({ success: true, data: filteredOrders });
  } catch (error) {
    console.log("Error in getRestroOwnerOrders:", error);
    res.json({ success: false, message: "Error" });
  }
};

// Cancel order by customer
const cancelOrder = async (req, res) => {
  try {
    console.log("=== Customer Canceling Order ===");
    const { orderId, reason } = req.body;
    const userId = req.body.userId;
    
    console.log("Order ID:", orderId);
    console.log("Customer ID:", userId);
    console.log("Cancellation reason:", reason);
    
    // Find the order
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      console.log("❌ Order not found");
      return res.json({ success: false, message: "Order not found" });
    }
    
    // Check if order belongs to the customer
    if (order.userId.toString() !== userId) {
      console.log("❌ Order does not belong to this customer");
      return res.json({ success: false, message: "Unauthorized to cancel this order" });
    }
    
    // Check if order can be cancelled (only pending_acceptance status)
    if (order.status !== "pending_acceptance") {
      console.log("❌ Order cannot be cancelled. Current status:", order.status);
      return res.json({ 
        success: false, 
        message: "Order can only be cancelled before restaurant accepts it" 
      });
    }
    
    // Update order status
    order.status = "cancelled";
    order.cancellationReason = reason || "Customer cancelled the order";
    order.cancelledAt = new Date();
    await order.save();
    
    console.log("✅ Order cancelled successfully");
    
    // Find the restaurant owner who added the food items
    if (order.items && order.items.length > 0) {
      console.log("=== Looking for restaurant owner ===");
      console.log("First item ID:", order.items[0]._id);
      console.log("First item addedBy:", order.items[0].addedBy);
      
      // Try to get restaurant owner from order item directly first
      let restaurantOwnerId = order.items[0].addedBy;
      
      // If not found in order item, try to find from food model
      if (!restaurantOwnerId) {
        const foodItem = await foodModel.findById(order.items[0]._id);
        if (foodItem && foodItem.addedBy) {
          restaurantOwnerId = foodItem.addedBy;
        }
      }
      
      if (restaurantOwnerId) {
        console.log("=== Sending cancellation notification to restaurant owner ===");
        console.log("Restaurant Owner ID:", restaurantOwnerId);
        console.log("Order ID:", orderId);
        console.log("Order Amount:", order.amount);
        console.log("Customer Name:", order.address.firstName + " " + order.address.lastName);
        
        try {
          console.log("=== Creating cancellation notification ===");
          
          const notification = await createNotification(
            restaurantOwnerId,
            "Order Cancelled by Customer",
            `Order #${orderId.slice(-8)} for ₹${order.amount} has been cancelled by customer. Reason: ${reason || "No reason provided"}`,
            "order_cancelled",
            orderId
          );
          
          if (notification) {
            console.log("✅ Cancellation notification created successfully:", notification._id);
          } else {
            console.log("❌ Failed to create cancellation notification");
          }
        } catch (notificationError) {
          console.log("❌ Error creating notification:", notificationError.message);
        }
      } else {
        console.log("❌ Could not find restaurant owner for notification");
      }
    } else {
      console.log("❌ No items found in order for notification");
    }
    
    res.json({ 
      success: true, 
      message: "Order cancelled successfully",
      data: order
    });
    
  } catch (error) {
    console.log("❌ Error cancelling order:", error);
    res.json({ success: false, message: "Error cancelling order" });
  }
};

// Accept order for restaurant owner
const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const restaurantOwnerId = req.body.userId;
    
    // Get the order
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    // Check if order belongs to this restaurant owner
    if (!order.restaurantOwners.includes(restaurantOwnerId)) {
      return res.json({ success: false, message: "This order is not yours" });
    }
    
    // Check if order is already processed
    if (order.status !== "pending_acceptance") {
      return res.json({ success: false, message: "Order has already been processed" });
    }
    
    // Update order status to Food Processing
    order.status = "Food Processing";
    await order.save();
    
    // Create notification for customer
    await createNotification(
      order.userId,
      "Order Accepted!",
      `Your order has been accepted by the restaurant and is now being prepared.`,
      "order_accepted",
      orderId
    );
    
    res.json({ 
      success: true, 
      message: "Order accepted successfully! Order is now in Food Processing."
    });
    
  } catch (error) {
    console.log("Error accepting order:", error);
    res.json({ success: false, message: "Error accepting order" });
  }
};

// Reject order for restaurant owner
const rejectOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const restaurantOwnerId = req.body.userId;
    
    // Get the order
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    // Check if order belongs to this restaurant owner
    if (!order.restaurantOwners.includes(restaurantOwnerId)) {
      return res.json({ success: false, message: "This order is not yours" });
    }
    
    // Check if order is already processed
    if (order.status !== "pending_acceptance") {
      return res.json({ success: false, message: "Order has already been processed" });
    }
    
    // Update order status to rejected
    order.status = "rejected";
    await order.save();
    
    // Create notification for customer
    await createNotification(
      order.userId,
      "Order Rejected",
      `Your order has been rejected by the restaurant${reason ? ': ' + reason : ''}. Please contact support for assistance.`,
      "order_rejected",
      orderId
    );
    
    res.json({ 
      success: true, 
      message: "Order rejected successfully"
    });
    
  } catch (error) {
    console.log("Error rejecting order:", error);
    res.json({ success: false, message: "Error rejecting order" });
  }
};

// Update order status for restaurant owners
const updateRestroOrderStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "restro_owner") {
      // Get the order first to check current status
      const order = await orderModel.findById(req.body.orderId);
      
      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }
      
      // Check if order belongs to this restaurant owner
      if (!order.restaurantOwners.includes(req.body.userId)) {
        return res.json({ success: false, message: "This order is not yours" });
      }
      
      // Check if order is still pending acceptance
      if (order.status === "pending_acceptance") {
        return res.json({ 
          success: false, 
          message: "Please accept or reject the order first before updating status" 
        });
      }
      
      // Update the order status
      const updatedOrder = await orderModel.findByIdAndUpdate(req.body.orderId, {
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

      // Auto-remove delivered orders
      if (req.body.status === "Delivered") {
        await orderModel.findByIdAndDelete(req.body.orderId);
        await createNotification(
          order.userId,
          "Order Completed",
          "Your order has been delivered and completed!",
          "order_delivered",
          req.body.orderId
        );
        
        return res.json({ 
          success: true, 
          message: "Order marked as delivered and removed from system" 
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

export { 
  placeOrder, 
  verifyOrder, 
  userOrders, 
  listOrders, 
  updateStatus, 
  getRestroOwnerOrders, 
  updateRestroOrderStatus, 
  acceptOrder, 
  rejectOrder,
  cancelOrder,
  removeDeliveredOrders, 
  autoRemoveDeliveredOrders 
};
