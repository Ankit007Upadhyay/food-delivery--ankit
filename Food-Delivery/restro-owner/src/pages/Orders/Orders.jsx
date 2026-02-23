import React, { useState, useEffect, useContext } from "react";
import "./Orders.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post(url + "/api/order/restro-orders", {}, {
        headers: { token }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(url + "/api/order/restro-status", {
        orderId,
        status: newStatus,
        userId: localStorage.getItem("userId")
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Order status updated successfully!");
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      const response = await axios.post(url + "/api/order/accept-order", {
        orderId,
        userId: localStorage.getItem("userId")
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Order accepted successfully!");
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Error accepting order");
    }
  };

  const rejectOrder = async (orderId) => {
    try {
      const response = await axios.post(url + "/api/order/reject-order", {
        orderId,
        userId: localStorage.getItem("userId"),
        reason: "Restaurant rejected the order"
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Order rejected successfully!");
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast.error("Error rejecting order");
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      "pending_acceptance": { color: "#f59e0b", icon: "⏳", text: "Pending Acceptance" },
      "Food Processing": { color: "#3b82f6", icon: "👨‍🍳", text: "Food Processing" },
      "Out for delivery": { color: "#8b5cf6", icon: "🚚", text: "Out for Delivery" },
      "Delivered": { color: "#10b981", icon: "✅", text: "Delivered" },
      "rejected": { color: "#ef4444", icon: "❌", text: "Rejected" },
      "cancelled": { color: "#ef4444", icon: "🚫", text: "Cancelled by Customer" }
    };

    const config = statusConfig[status] || { color: "#6b7280", icon: "📦", text: status };
    
    return (
      <span 
        className="status-badge" 
        style={{ backgroundColor: config.color }}
      >
        <span className="status-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="header-content">
          <h1 className="page-title">📋 Order Management</h1>
          <p className="page-subtitle">Manage and track your restaurant orders</p>
        </div>
        <button 
          className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <span className="refresh-icon">🔄</span>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : orders.filter(order => order.status !== "cancelled").length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No active orders</h3>
          <p>When customers place orders, they will appear here</p>
          {orders.filter(order => order.status === "cancelled").length > 0 && (
            <p style={{fontSize: '14px', color: '#999', marginTop: '10px'}}>
              You have {orders.filter(order => order.status === "cancelled").length} cancelled order(s)
            </p>
          )}
          <button className="modern-btn" onClick={handleRefresh}>
            Check for Orders
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.filter(order => order.status !== "cancelled").map((order, index) => (
            <div key={order._id} className="order-card slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="order-header">
                <div className="order-info">
                  <h3 className="order-id">Order #{order._id.slice(-8)}</h3>
                  <p className="customer-name">👤 {order.userId?.name || 'Customer'}</p>
                </div>
                <div className="order-amount">
                  <span className="amount">₹{order.amount}</span>
                </div>
              </div>

              <div className="order-items">
                <h4>🍽️ Order Items:</h4>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="order-item">
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
              </div>

              <div className="order-status">
                <div className="status-section">
                  <h4>Order Status:</h4>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              <div className="order-actions">
                {order.status === "pending_acceptance" && (
                  <div className="action-buttons">
                    <button 
                      className="accept-btn"
                      onClick={() => acceptOrder(order._id)}
                    >
                      <span>✅</span>
                      Accept Order
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => rejectOrder(order._id)}
                    >
                      <span>❌</span>
                      Reject Order
                    </button>
                  </div>
                )}

                {order.status === "cancelled" && (
                  <div className="cancelled-message">
                    <span>🚫 Order cancelled by customer</span>
                    {order.cancellationReason && (
                      <p className="cancellation-reason">
                        Reason: {order.cancellationReason}
                      </p>
                    )}
                  </div>
                )}

                {order.status !== "pending_acceptance" && order.status !== "rejected" && order.status !== "cancelled" && order.status !== "Delivered" && (
                  <div className="status-update">
                    <label>Update Status:</label>
                    <select 
                      className="status-select"
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      value={order.status}
                    >
                      <option value="Food Processing">👨‍🍳 Food Processing</option>
                      <option value="Out for delivery">🚚 Out for Delivery</option>
                      <option value="Delivered">✅ Delivered</option>
                    </select>
                  </div>
                )}

                {order.status === "rejected" && (
                  <div className="rejected-message">
                    <span>❌ Order has been rejected</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
