import React, { useState, useEffect, useContext } from "react";
import "./Notifications.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Notifications = () => {
  const { url, token } = useContext(StoreContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axios.post(url + "/api/notification/list", {}, {
        headers: { token }
      });
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.post(url + "/api/notification/unread-count", {}, {
        headers: { token }
      });
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.post(url + "/api/notification/mark-read", {
        notificationId
      }, {
        headers: { token }
      });
      if (response.data.success) {
        setNotifications(notifications.map(notif => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      console.log("=== Customer marking all notifications as read ===");
      console.log("Current showNotifications state:", showNotifications);
      
      // Close immediately to prevent any interference
      setShowNotifications(false);
      console.log("Pre-emptive close called");
      
      // Prevent any immediate clicks from reopening
      const preventReopen = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Customer prevented reopen event");
      };
      
      // Add temporary event listener to prevent reopening
      const header = document.querySelector('.notifications-header');
      if (header) {
        header.addEventListener('click', preventReopen, { once: true });
        console.log("Added temporary prevent reopen listener");
      }
      
      const response = await axios.post(url + "/api/notification/mark-all-read", {}, {
        headers: { token }
      });
      
      if (response.data.success) {
        console.log("✅ Customer API call successful");
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read");
        
        // Ensure it stays closed
        setShowNotifications(false);
        console.log("Post-API close called");
        
        // Multiple force closes to ensure it stays closed
        setTimeout(() => {
          setShowNotifications(false);
          console.log("Customer force close 1 called");
        }, 50);
        
        setTimeout(() => {
          setShowNotifications(false);
          console.log("Customer force close 2 called");
        }, 200);
        
        setTimeout(() => {
          setShowNotifications(false);
          console.log("Customer force close 3 called");
        }, 500);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.post(url + "/api/notification/delete", {
        notificationId
      }, {
        headers: { token }
      });
      if (response.data.success) {
        const deletedNotif = notifications.find(n => n._id === notificationId);
        setNotifications(notifications.filter(notif => notif._id !== notificationId));
        if (!deletedNotif.isRead) {
          setUnreadCount(Math.max(0, unreadCount - 1));
        }
        toast.success("Notification deleted");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order_placed":
        return "📦";
      case "order_status":
        return "🔄";
      case "order_delivered":
        return "✅";
      case "payment_received":
        return "💰";
      default:
        return "🔔";
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        fetchUnreadCount();
      }
    }, 30000); // Check for new notifications every 30 seconds

    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="notifications-container">
      <div className="notifications-header" onClick={() => setShowNotifications(!showNotifications)}>
        <div className="notifications-icon">
          🔔
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </div>
      </div>

      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-actions">
            <button onClick={(e) => {
              e.stopPropagation();
              markAllAsRead();
            }} className="mark-all-read-btn">
              Mark all as read
            </button>
          </div>
          
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.isRead ? "unread" : ""}`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">{formatTime(notification.createdAt)}</span>
                  </div>
                  <button
                    className="delete-notification"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification._id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
