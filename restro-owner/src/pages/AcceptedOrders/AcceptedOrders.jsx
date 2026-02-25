import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AcceptedOrders.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const AcceptedOrders = () => {
  const navigate = useNavigate();
  const { token, admin, url } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchAcceptedOrders = async () => {
    const response = await axios.post(url + "/api/order/restro-accepted-orders", {}, {
      headers: { token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const updateItemStatus = async (orderId, itemId, newStatus) => {
    try {
      const response = await axios.post(url + "/api/order/update-item-status", {
        orderId,
        itemId,
        status: newStatus,
      }, { headers: { token } });
      
      if (response.data.success) {
        toast.success(`Item status updated to ${newStatus}`);
        await fetchAcceptedOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating item status:", error);
      toast.error("Error updating item status");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please Login First");
      navigate("/");
    } else {
      fetchAcceptedOrders();
    }
  }, [token, navigate]);

  // Auto-refresh accepted orders every 30 seconds
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        fetchAcceptedOrders();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <div className="accepted-orders add">
      <div className="accepted-orders-header">
        <h3>Accepted Orders</h3>
        <button onClick={fetchAcceptedOrders} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, itemIndex) => {
                  if (itemIndex === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <div className="order-item-payment">
              <p><strong>Payment:</strong> {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
              <p><strong>Status:</strong> {order.paymentStatus}</p>
            </div>
            <div className="order-item-actions">
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="item-action">
                  <p className="item-name">{item.name} x {item.quantity}</p>
                  <p className="accepted-time">Accepted at: {new Date(item.acceptedAt).toLocaleString()}</p>
                  <select
                    onChange={(event) => updateItemStatus(order._id, item._id, event.target.value)}
                    value={item.status}
                    className="status-select"
                  >
                    <option value="accepted">Accepted</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready for Pickup</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcceptedOrders;
