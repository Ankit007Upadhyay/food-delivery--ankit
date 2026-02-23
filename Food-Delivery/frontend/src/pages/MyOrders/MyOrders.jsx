import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    if (response.data.success) {
      setData(response.data.data);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        url + "/api/order/cancel-order",
        { 
          orderId,
          reason: "Customer cancelled the order"
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully!");
        fetchOrders(); // Refresh orders
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Error cancelling order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      "pending_acceptance": { color: "#f59e0b", text: "Pending Acceptance" },
      "Food Processing": { color: "#3b82f6", text: "Food Processing" },
      "Out for delivery": { color: "#8b5cf6", text: "Out for Delivery" },
      "Delivered": { color: "#10b981", text: "Delivered" },
      "cancelled": { color: "#ef4444", text: "Cancelled" },
      "rejected": { color: "#ef4444", text: "Rejected" }
    };

    const config = statusConfig[status] || { color: "#6b7280", text: status };
    
    return (
      <span 
        className="status-badge" 
        style={{ backgroundColor: config.color }}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {/* Debug: Show all orders */}
        {console.log("=== Customer MyOrders Debug ===")}
        {console.log("Total orders received:", data.length)}
        {data.map((order, index) => {
          console.log(`Order ${index}: Status="${order.status}", ID: ${order._id}`);
          return null;
        })}
        
        {/* Filter and display active orders */}
        {data.filter(order => order.status !== "cancelled").map((order, index) => {
          const canCancel = order.status === "pending_acceptance";
          console.log(`Rendering order: ${order._id}, Status: ${order.status}`);
          
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <div className="order-details">
                <p>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " X " + item.quantity;
                    } else {
                      return item.name + " X " + item.quantity + ",";
                    }
                  })}
                </p>
                <p>₹{order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <div className="order-status">
                  <span>&#x25cf;</span>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              <div className="order-actions">
                <button onClick={fetchOrders} className="track-btn">
                  Track Order
                </button>
                {canCancel && (
                  <button 
                    onClick={() => cancelOrder(order._id)} 
                    className="cancel-btn"
                    disabled={loading}
                  >
                    {loading ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Show message if no active orders */}
        {data.filter(order => order.status !== "cancelled").length === 0 && (
          <div className="no-orders">
            <p>No active orders found.</p>
            {data.length > 0 && (
              <p style={{fontSize: '12px', color: '#999'}}>
                (You have {data.length} cancelled order(s) hidden)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
