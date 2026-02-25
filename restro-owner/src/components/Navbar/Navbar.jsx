import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Notifications from "../Notifications/Notifications";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { token, admin, setAdmin, setToken } = useContext(StoreContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const logout = () => {
    console.log("=== Logout Function Called ===");
    console.log("Current token:", !!token);
    console.log("Current admin:", admin);
    
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      setToken("");
      setAdmin(false);
      setIsMenuOpen(false); // Close the dropdown
      toast.success("Logout Successfully");
      navigate("/");
      console.log("✅ Logout completed successfully");
    } catch (error) {
      console.error("❌ Error during logout:", error);
      toast.error("Error during logout");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
          <div className={`hamburger ${isSidebarOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        <img className="logo" src={assets.newlogo} alt="Restaurant Logo" />
        <div className="brand-text">
          <h1>Restaurant Manager</h1>
          <span className="tagline">Manage your business with ease</span>
        </div>
      </div>
      
      <div className="navbar-actions">
        <div className="action-items">
          {token && <Notifications />}
          
          <div className="profile-section">
            {token ? (
              <div className="profile-dropdown" ref={dropdownRef}>
                <button 
                  className="profile-trigger"
                  onClick={toggleMenu}
                >
                  <img className="profile-image" src={assets.profile_image} alt="Profile" />
                  <span className="profile-name">Admin</span>
                  <div className={`dropdown-arrow ${isMenuOpen ? 'open' : ''}`}>▼</div>
                </button>
                
                {isMenuOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <img src={assets.profile_image} alt="Profile" />
                      <div>
                        <p className="user-name">Restaurant Owner</p>
                        <p className="user-role">Administrator</p>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button 
                      className="dropdown-item logout-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        logout();
                      }}
                    >
                      <span className="item-icon">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="login-button"
                onClick={() => navigate("/")}
              >
                <span className="login-icon">🔑</span>
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
