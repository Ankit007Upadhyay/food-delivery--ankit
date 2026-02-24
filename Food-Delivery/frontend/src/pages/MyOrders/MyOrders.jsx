import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/frontend_assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post(url + "/api/order/userorders", {}, {
        headers: { token }
      });
      
      if (response.data.success) {
        setData(response.data.data);
        console.log("=== Customer MyOrders Debug ===");
        console.log("Total orders received:", response.data.data.length);
        response.data.data.forEach((order, index) => {
          console.log(`Order ${index}: Status="${order.status}", ID: ${order._id}`);
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.post(url + "/api/order/cancel-order", {
        orderId,
        reason: "Customer cancelled the order"
      }, {
        headers: { token }
      });

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      "pending_acceptance": { color: "#f59e0b", icon: "", text: "Pending Acceptance" },
      "Food Processing": { color: "#3b82f6", icon: "", text: "Preparing" },
      "Out for delivery": { color: "#8b5cf6", icon: "", text: "Out for Delivery" },
      "Delivered": { color: "#10b981", icon: "", text: "Delivered" },
      "rejected": { color: "#ef4444", icon: "", text: "Rejected" },
      "cancelled": { color: "#ef4444", icon: "", text: "Cancelled" }
    };

    const config = statusConfig[status] || { color: "#6b7280", icon: "", text: status };
    
    return (
      <span 
        className="modern-status-badge" 
        style={{ backgroundColor: config.color }}
      >
        <span className="status-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="modern-my-orders">
      <div className="orders-header">
        <div className="header-content">
          <h1 className="page-title"> My Orders</h1>
          <p className="page-subtitle">Track your food delivery orders</p>
        </div>
        <button 
          className={`refresh-btn ${loading ? 'spinning' : ''}`}
          onClick={fetchOrders}
          disabled={loading}
        >
          <span className="refresh-icon"></span>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="modern-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : data.filter(order => order.status !== "cancelled" && order.status !== "Delivered" && order.status !== "rejected").length === 0 ? (
        <div className="modern-empty-state">
          <div className="empty-icon"></div>
          <h3>No active orders</h3>
          <p>When you place orders, they will appear here</p>
          {data.length > 0 && (
            <p className="completed-info">
              You have {data.filter(order => order.status === "cancelled").length} cancelled, {data.filter(order => order.status === "rejected").length} rejected, and {data.filter(order => order.status === "Delivered").length} delivered order(s) completed
            </p>
          )}
          <button className="modern-primary-btn" onClick={() => window.location.href = '/'} >
            Order Food Now
          </button>
        </div>
      ) : (
        <div className="modern-orders-grid">
          {data.filter(order => order.status !== "cancelled" && order.status !== "Delivered" && order.status !== "rejected").map((order, index) => {
            const canCancel = order.status === "pending_acceptance";
            
            return (
              <div key={order._id} className="modern-order-card" style={{ animationDelay: `${index * 0.1}s` }} >
                <div className="order-card-header">
                  <div className="order-info">
                    <div className="order-id-badge">
                      <span className="order-id">#{order._id.slice(-8)}</span>
                      <span className="order-date">{formatOrderDate(order.createdAt)}</span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="order-amount">
                    <span className="amount">₹{order.amount}</span>
                    <span className="items-count">{order.items.length} items</span>
                  </div>
                </div>

                <div className="order-items-preview">
                  <div className="items-header">
                    <span className="items-icon"></span>
                    <span className="items-title">Order Items</span>
                  </div>
                  <div className="items-list">
                    {order.items.slice(0, 3).map((item, itemIndex) => (
                      <div key={itemIndex} className="item-preview">
                        <img 
                          src={`${url}/images/${item.image}`} 
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="item-details">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x{item.quantity}</span>
                        </div>
                        <span className="item-price">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Show delivery boy number if order is out for delivery */}
                {order.status === "Out for delivery" && order.deliveryBoyNumber && (
                  <div className="delivery-boy-contact">
                    <div className="contact-header">
                      <span className="contact-icon"></span>
                      <span className="contact-title">Out for Delivery</span>
                    </div>
                    <div className="contact-info">
                      <span className="contact-label">Delivery Boy:</span>
                      <a 
                        href={`tel:${order.deliveryBoyNumber}`} 
                        className="contact-number"
                      >
                        <span className="phone-icon"></span>
                        {order.deliveryBoyNumber}
                      </a>
                    </div>
                  </div>
                )}

                <div className="order-card-actions">
                  <button onClick={fetchOrders} className="modern-secondary-btn">
                    <span className="btn-icon"></span>
                    Track Order
                  </button>
                  {canCancel && (
                    <button 
                      onClick={() => cancelOrder(order._id)} 
                      className="modern-danger-btn"
                      disabled={loading}
                    >
                      <span className="btn-icon"></span>
                      {loading ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
