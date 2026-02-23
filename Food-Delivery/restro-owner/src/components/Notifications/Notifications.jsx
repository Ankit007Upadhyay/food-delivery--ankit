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

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT");
      audio.volume = 0.3;
      audio.play().catch(e => console.log("Audio play failed:", e));
    } catch (error) {
      console.log("Sound notification failed:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.post(url + "/api/notification/list", {}, {
        headers: { token }
      });
      if (response.data.success) {
        const newNotifications = response.data.data;
        
        // Check if there are new notifications (compare with current)
        if (notifications.length > 0) {
          const newUnreadNotifications = newNotifications.filter(newNotif => 
            !newNotif.isRead && 
            !notifications.some(existingNotif => existingNotif._id === newNotif._id)
          );
          
          // Show toast for each new notification
          newUnreadNotifications.forEach(notif => {
            if (notif.type === 'order_placed' || notif.type === 'order_pending_acceptance') {
              playNotificationSound(); // Play sound for new orders
              toast.success(`🍔 New Order: ${notif.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            } else if (notif.type === 'order_accepted') {
              toast.success(`✅ Order Accepted: ${notif.message}`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            } else if (notif.type === 'order_rejected') {
              toast.error(`❌ Order Rejected: ${notif.message}`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            } else if (notif.type === 'status_update') {
              toast.info(`📋 Order Update: ${notif.message}`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            }
          });
        }
        
        setNotifications(newNotifications);
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
      console.log("=== Marking all notifications as read ===");
      console.log("Current showNotifications state:", showNotifications);
      
      // Close immediately to prevent any interference
      setShowNotifications(false);
      console.log("Pre-emptive close called");
      
      // Prevent any immediate clicks from reopening
      const preventReopen = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Prevented reopen event");
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
        console.log("✅ API call successful");
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read");
        
        // Ensure it stays closed
        setShowNotifications(false);
        console.log("Post-API close called");
        
        // Multiple force closes to ensure it stays closed
        setTimeout(() => {
          setShowNotifications(false);
          console.log("Force close 1 called");
        }, 50);
        
        setTimeout(() => {
          setShowNotifications(false);
          console.log("Force close 2 called");
        }, 200);
        
        setTimeout(() => {
          setShowNotifications(false);
          console.log("Force close 3 called");
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
      case 'order_placed':
        return '🍽️';
      case 'order_pending_acceptance':
        return '⏰';
      case 'order_accepted':
        return '✅';
      case 'order_rejected':
        return '❌';
      case 'order_status':
        return '�';
      case 'order_delivered':
        return '🚚';
      case 'payment_received':
        return '💰';
      case 'status_update':
        return '🔄';
      case 'order_cancelled':
        return '�';
      default:
        return '�';
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
        fetchNotifications();
        fetchUnreadCount();
      }
    }, 10000); // Check for new notifications every 10 seconds (more frequent)

    return () => clearInterval(interval);
  }, [token]);

  // Update browser tab title with unread count
  useEffect(() => {
    const originalTitle = document.title;
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }
    
    return () => {
      document.title = originalTitle;
    };
  }, [unreadCount]);

  return (
    <div className="notifications-container">
      <div className="notifications-header" onClick={() => setShowNotifications(!showNotifications)}>
        <div className="notifications-icon">
          🔔
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </div>
        <span>Notifications</span>
      </div>

      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-actions">
            <button onClick={(e) => {
              e.stopPropagation();
              fetchNotifications();
              fetchUnreadCount();
              toast.success("Notifications refreshed");
            }} className="refresh-notifications-btn">
              🔄 Refresh
            </button>
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
