import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import Notifications from "../Notifications/Notifications";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalCartAmount, token, setToken, user, totalOrders } = useContext(StoreContext);
  const navigate = useNavigate();

  // Format price for cart badge
  const formatCartPrice = (price) => {
    if (price >= 1000) {
      return `₹${(price / 1000).toFixed(1)}k`;
    }
    return `₹${price}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Logout Successfully");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (menuItem) => {
    setMenu(menuItem);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <img src={assets.newlogo} alt="GoRestro" className="logo" />
          <span className="logo-text">GoRestro</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="navbar-menu desktop-menu">
          <Link
            to="/"
            onClick={() => handleMenuClick("home")}
            className={`menu-item ${menu === "home" ? "active" : ""}`}
          >
            <span className="menu-icon">🏠</span>
            <span>Home</span>
          </Link>
          <Link
            to="/menu"
            onClick={() => handleMenuClick("menu")}
            className={`menu-item ${menu === "menu" ? "active" : ""}`}
          >
            <span className="menu-icon">🍽️</span>
            <span>Menu</span>
          </Link>
          <a
            href="#app-download"
            onClick={() => handleMenuClick("mobile-app")}
            className={`menu-item ${menu === "mobile-app" ? "active" : ""}`}
          >
            <span className="menu-icon">📱</span>
            <span>App</span>
          </a>
          <a
            href="#footer"
            onClick={() => handleMenuClick("contact-us")}
            className={`menu-item ${menu === "contact-us" ? "active" : ""}`}
          >
            <span className="menu-icon">📞</span>
            <span>Contact</span>
          </a>
        </ul>

        <div className="navbar-right">
          {/* Search Bar */}
          <div className="search-container">
            <input type="text" placeholder="Search food..." className="search-input" />
            <img src={assets.search_icon} alt="Search" className="search-icon" />
          </div>

          {/* Cart */}
          <div className="cart-container">
            <Link to="/cart" className="cart-link">
              <div className="cart-icon-wrapper">
                <img src={assets.basket_icon} alt="Cart" className="cart-icon" />
                {getTotalCartAmount() > 0 && (
                  <span className="cart-badge">•</span>
                )}
              </div>
            </Link>
          </div>

          {/* Notifications */}
          {token && <Notifications />}

          {/* User Actions */}
          {!token ? (
            <button 
              onClick={() => setShowLogin(true)} 
              className="modern-signin-btn"
            >
              <span className="btn-icon">👤</span>
              Sign In
            </button>
          ) : (
            <div className="profile-container">
              <div className="profile-trigger">
                <img src={assets.profile_icon} alt="Profile" className="profile-icon" />
                <span className="profile-arrow">▼</span>
              </div>
              <ul className="profile-dropdown">
                {user && (
                  <li className="profile-info-section">
                    <div className="profile-info">
                      <div className="profile-name">👤 {user.name}</div>
                      <div className="profile-email">✉️ {user.email}</div>
                      <div className="profile-orders">📦 Total Orders: {totalOrders}</div>
                    </div>
                  </li>
                )}
                <hr />
                <li onClick={() => { navigate("/myorders"); setIsMobileMenuOpen(false); }}>
                  <img src={assets.bag_icon} alt="Orders" />
                  <span>My Orders</span>
                </li>
                <li onClick={() => { navigate("/cart"); setIsMobileMenuOpen(false); }}>
                  <img src={assets.basket_icon} alt="Cart" />
                  <span>Cart</span>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="Logout" />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-menu-list">
          <Link
            to="/"
            onClick={() => handleMenuClick("home")}
            className={`mobile-menu-item ${menu === "home" ? "active" : ""}`}
          >
            <span className="menu-icon">🏠</span>
            <span>Home</span>
          </Link>
          <a
            href="#explore-menu"
            onClick={() => handleMenuClick("menu")}
            className={`mobile-menu-item ${menu === "menu" ? "active" : ""}`}
          >
            <span className="menu-icon">🍽️</span>
            <span>Menu</span>
          </a>
          <a
            href="#app-download"
            onClick={() => handleMenuClick("mobile-app")}
            className={`mobile-menu-item ${menu === "mobile-app" ? "active" : ""}`}
          >
            <span className="menu-icon">📱</span>
            <span>Mobile App</span>
          </a>
          <a
            href="#footer"
            onClick={() => handleMenuClick("contact-us")}
            className={`mobile-menu-item ${menu === "contact-us" ? "active" : ""}`}
          >
            <span className="menu-icon">📞</span>
            <span>Contact Us</span>
          </a>
        </ul>

        {!token && (
          <div className="mobile-auth">
            <button 
              onClick={() => { setShowLogin(true); setIsMobileMenuOpen(false); }}
              className="mobile-signin-btn"
            >
              <span className="btn-icon">👤</span>
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
